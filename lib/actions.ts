"use server";

import {
  AuditDataRaw,
  AuditStatistics,
  Record,
  RiskData,
  User,
} from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";

// Keeping in memory as it's a large dataset. We would act differently if we were to get it from a DB.
let memoizedAuditData: Record[] | null = null;
let memoizedAuditDataMTime: number | null = null;

// Check when file was last modified
async function getFileMTime(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.mtimeMs;
}

export const getAllAuditData = cache(async (): Promise<Record[]> => {
  try {
    // const filePath = path.join(process.cwd(), "data/audit_small.json");
    const filePath = path.join(process.cwd(), "data/audit.json");
    const fileMTime = await getFileMTime(filePath);

    // Only reload if file has changed
    if (memoizedAuditData && memoizedAuditDataMTime === fileMTime) {
      return memoizedAuditData;
    }

    console.log("Reloading audit data...");

    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents) as AuditDataRaw;

    if (!data.RECORDS || !Array.isArray(data.RECORDS)) {
      console.error("Error: audit.json is missing a 'RECORDS' array.");
      return [];
    }

    const parsedData = data.RECORDS.map((record) => {
      try {
        // n.b JSON.parse is a big performance hit on large datasets.
        const { browser_uuid, content, ip_external, ip_internal, user_agent } =
          JSON.parse(record.meta);

        return {
          ...record,
          browserId: browser_uuid,
          riskLevel: parseInt(record.risk_level, 10) || 0,
          content,
          ipExternal: ip_external,
          ipInternal: ip_internal,
          userAgent: user_agent,
        };
      } catch (e) {
        // In Prod - send error to Error table for later analysis
        console.error(`Failed to parse meta for record ID: ${record.id}`, e);
      }
    }) as Record[];

    memoizedAuditData = parsedData;
    memoizedAuditDataMTime = fileMTime;

    return parsedData;
  } catch (error) {
    console.error("Failed to read or parse audit data:", error);
    return [];
  }
});

export async function getAuditStatistics(): Promise<AuditStatistics> {
  const defaultStats: AuditStatistics = {
    totalRecordsCount: 0,
    uniqueUsersCount: 0,
    uniqueRisksCount: 0,
  };

  try {
    const allData = await getAllAuditData();
    if (!allData || allData.length === 0) return defaultStats;

    // Create sets to track unique users and risks
    const uniqueUsers = new Set<string>();
    const uniqueRisks = new Set<string>();

    // Add to sets
    allData.forEach((record) => {
      uniqueUsers.add(record.browserId);
      if (record.riskLevel > 0) {
        uniqueRisks.add(`${record.risk}:${record.riskLevel}`);
      }
    });

    return {
      totalRecordsCount: allData.length,
      uniqueUsersCount: uniqueUsers.size,
      uniqueRisksCount: uniqueRisks.size,
    } as AuditStatistics;
  } catch (error) {
    console.error(`Failed to get audit statistics:`, error);
    return defaultStats;
  }
}

export async function getRiskData(): Promise<RiskData> {
  const defaultRiskData: RiskData = {
    allRisks: [],
    allRisksCount: 0,
    atRiskUsers: [],
    atRiskUserCount: 0,
  };

  try {
    const riskData = await getAllAuditData();
    const atRiskRecords = riskData.filter((record) => record.riskLevel > 0);

    if (!atRiskRecords || atRiskRecords.length === 0) return defaultRiskData;

    // Group records by browserId.
    const usersWithRecords = Object.groupBy(
      atRiskRecords,
      (record) => record.browserId
    );

    // Transform the grouped data into the AtRiskUser[] structure and sort.
    const atRiskUsers = Object.entries(usersWithRecords)
      .map(([browserId, records]) => ({
        browserId,
        records: records || [],
        totalRisk: (records || []).reduce((sum, r) => sum + r.riskLevel, 0),
      }))
      .sort((a, b) => b.totalRisk - a.totalRisk);
    return {
      allRisks: atRiskRecords,
      allRisksCount: atRiskRecords.length,
      atRiskUsers,
      atRiskUserCount: atRiskUsers.length,
    };
  } catch (error) {
    console.error(`Failed to get Risk data:`, error);
    return defaultRiskData;
  }
}

export async function getUserProfileByBrowserId(
  browserId: string
): Promise<User> {
  const defaultUser: User = { browserId, records: [], totalRisk: 0 };

  try {
    const allData = await getAllAuditData();

    // Filter for records with browserId
    const browserRecords = allData.filter((r) => r.browserId === browserId);

    if (!browserRecords || browserRecords.length === 0) return defaultUser;

    // Sum all riskLevel's to get the total riskLevel
    const totalRisk = browserRecords.reduce((sum, r) => sum + r.riskLevel, 0);

    // Flatten records for ease of use and only adding properties we'er using
    const records = browserRecords.map((record) => ({
      id: record.id,
      created: record.created,
      riskLevel: record.riskLevel,
      risk: record.risk,
      content: record.content,
      userAgent: record.userAgent,
      ipExternal: record.ipExternal,
      ipInternal: record.ipInternal,
      // Could add active here - but not sure there's much point
    }));

    return { browserId, totalRisk, records };
  } catch (error) {
    console.error(`Failed to get data for browserId ${browserId}:`, error);
    return defaultUser;
  }
}
