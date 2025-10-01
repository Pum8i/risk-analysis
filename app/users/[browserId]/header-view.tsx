import { SectionCard, SectionCards } from "@/components/section-cards";
import { User } from "@/lib/types";

export default async function UserHeaderView({ user }: { user: User }) {
  return (
    <SectionCards>
      <SectionCard title="Browser ID" value={user.browserId} />
      <SectionCard
        title="Total Risk Score"
        value={user.totalRisk.toLocaleString()}
      />
      <SectionCard
        title="Total # Records"
        value={user.records.length.toString()}
        secondaryTitle="At Risk Records"
        secondaryValue={user.records
          .filter((r) => r.riskLevel > 0)
          .length.toString()}
      />
    </SectionCards>
  );
}
