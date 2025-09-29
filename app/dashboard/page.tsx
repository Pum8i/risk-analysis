import { getRiskData, getAuditStatistics } from "@/lib/actions";
import { HeaderView } from "./header-view";
import { TableView } from "./table-view";

export default async function Page() {
  const [stats, risks] = await Promise.all([
    getAuditStatistics(),
    getRiskData(),
  ]);

  const { allRisks, allRisksCount, atRiskUsers, atRiskUserCount } = risks;

  return (
    <>
      <HeaderView
        stats={{ ...stats }}
        allRisksCount={allRisksCount}
        atRiskUserCount={atRiskUserCount}
      />
      <TableView
        allRisks={allRisks}
        atRiskUsers={atRiskUsers}
        allRisksCount={allRisksCount}
        atRiskUserCount={atRiskUserCount}
      />
    </>
  );
}
