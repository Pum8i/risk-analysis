export interface AuditDataRaw {
  RECORDS: RecordRaw[];
}
export interface RecordRaw {
  id: string;
  created: string;
  email: string;
  risk: string;
  risk_level: string;
  meta: string;
  active: string;
}

export interface Record {
  id: string;
  browserId: string;
  created: string;
  email: string;
  risk: string;
  riskLevel: number;
  active: string;
  content: string;
  ipExternal: string;
  ipInternal: string[];
  userAgent: string;
}

export interface Risks {
  risk: string;
  risk_level: number;
}

export interface AtRiskUser {
  browserId: string;
  totalRisk: number;
  records: Record[];
}

export interface RiskData {
  allRisks: Record[];
  allRisksCount: number;
  atRiskUsers: AtRiskUser[];
  atRiskUserCount: number;
}

export interface User {
  browserId: string;
  totalRisk: number;
  records: UserRecord[];
}
export interface UserRecord {
  id: string;
  created: string;
  risk: string;
  riskLevel: number;
  content: string;
  userAgent: string;
  ipExternal: string;
  ipInternal: string[];
}

export interface AuditStatistics {
  totalRecordsCount: number;
  uniqueUsersCount: number;
  uniqueRisksCount: number;
}
