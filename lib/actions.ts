"use server";

import {
  AuditDataRaw,
  AuditStatistics,
  Record as AuditRecord,
  RiskByHour,
  RiskData,
  User,
  UserRecord,
} from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";
import { parseWithDateFns } from "./utils";
import { cache } from "react";

// Cache in memory as it's a large dataset. Prevents re-process data on every page load/api request. We would act differently if we were to get it from a DB.
let memoizedAuditData: AuditRecord[] | null = null;
let memoizedAuditDataMTime: number | null = null;

// Check when file was last modified
async function getFileMTime(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.mtimeMs;
}

const loadAndParseAuditData = async (): Promise<AuditRecord[]> => {
  try {
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

    const parsedData: AuditRecord[] = [];
    for (const record of data.RECORDS) {
      try {
        const meta = JSON.parse(record.meta);

        parsedData.push({
          ...record,
          browserId: meta.browser_uuid,
          riskLevel: parseInt(record.risk_level, 10) || 0,
          content: meta.content,
          ipExternal: meta.ip_external,
          ipInternal: meta.ip_internal,
          userAgent: meta.user_agent,
        });
      } catch (e) {
        // In Prod - send error to Error table for later analysis
        console.error(`Failed to parse meta for record ID: ${record.id}`, e);
      }
    }

    memoizedAuditData = parsedData;
    memoizedAuditDataMTime = fileMTime;

    return parsedData;
  } catch (error) {
    console.error("Failed to read or parse audit data:", error);
    return [];
  }
};

// Cache the function to avoid reloading the data multiple times per request
export const getAllAuditData = cache(loadAndParseAuditData);

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
    const allData = await getAllAuditData();
    const atRiskRecords: AuditRecord[] = [];

    // Create a map of users to allow us to group records by browserId & sum their total risk
    const users: Record<
      string,
      { browserId: string; records: AuditRecord[]; totalRisk: number }
    > = {};

    for (const record of allData) {
      if (record.riskLevel > 0) {
        atRiskRecords.push(record);

        // We don't have a user yet, add a default one
        if (!users[record.browserId]) {
          users[record.browserId] = {
            browserId: record.browserId,
            records: [],
            totalRisk: 0,
          };
        }

        // Now we have a user, push the record and add sum the totalRisk
        users[record.browserId].records.push(record);
        users[record.browserId].totalRisk += record.riskLevel;
      }
    }

    // There's no risk data to return, so return an empty object
    if (atRiskRecords.length === 0) {
      return defaultRiskData;
    }

    // Get a sorted array of users
    const atRiskUsers = Object.values(users).sort(
      (a, b) => b.totalRisk - a.totalRisk
    );

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
  const defaultUser: User = {
    browserId,
    records: [],
    totalRisk: 0,
    riskByHour: [],
    risksTypes: [],
  };

  try {
    const allData = await getAllAuditData();

    let totalRisk = 0;
    // Create an object for each hour of the day. Used for chart axis.
    const riskByHourData: RiskByHour[] = Array.from({ length: 24 }, (_, i) => ({
      hour: i.toString(),
      risks: {},
    }));

    // Get unique risks for this user - used when defining the chart.
    const riskTypes = new Set<string>();
    const records: UserRecord[] = [];

    for (const record of allData) {
      if (record.browserId === browserId) {
        totalRisk += record.riskLevel;

        // Group records by hour and sum the risk level for chart data.
        if (record.riskLevel > 0) {
          riskTypes.add(record.risk);

          // Get risk data by hour. Used for populating the chart.
          const { date } = parseWithDateFns(record.created);
          const hour = date.getHours();

          const risk = riskByHourData[hour].risks[record.risk];
          if (!risk) {
            riskByHourData[hour].risks[record.risk] = 1;
          } else {
            riskByHourData[hour].risks[record.risk]++;
          }
        }

        // Flatten records for ease of use
        records.push({
          id: record.id,
          created: record.created,
          riskLevel: record.riskLevel,
          risk: record.risk,
          content: record.content,
          userAgent: record.userAgent,
          ipExternal: record.ipExternal,
          ipInternal: record.ipInternal,
        });
      }
    }

    // There's no records or this user - so return an empty user object
    if (records.length === 0) {
      return defaultUser;
    }

    return {
      browserId,
      totalRisk,
      records,
      riskByHour: Object.values(riskByHourData),
      risksTypes: Array.from(riskTypes),
    };
  } catch (error) {
    console.error(`Failed to get data for browserId ${browserId}:`, error);
    return defaultUser;
  }
}
