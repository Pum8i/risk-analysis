import { SectionCard, SectionCards } from "@/components/section-cards";
import { AuditStatistics } from "@/lib/types";

export function HeaderView({
  stats,
  allRisksCount,
  atRiskUserCount,
}: {
  stats: AuditStatistics;
  allRisksCount: number;
  atRiskUserCount: number;
}) {
  return (
    <SectionCards>
      <SectionCard
        title="Total # Records"
        value={stats.totalRecordsCount.toLocaleString()}
      />
      <SectionCard
        title="Total # Risks"
        value={allRisksCount.toLocaleString()}
        secondaryTitle="Unique Risks"
        secondaryValue={stats.uniqueRisksCount.toLocaleString()}
      />
      <SectionCard
        title="Total # Users"
        value={stats.uniqueUsersCount.toLocaleString()}
        secondaryTitle="At Risk Users"
        secondaryValue={atRiskUserCount.toLocaleString()}
      />
    </SectionCards>
  );
}
