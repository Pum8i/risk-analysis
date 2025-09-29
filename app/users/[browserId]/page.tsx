import { SectionCard, SectionCards } from "@/components/section-cards";
import { getUserProfileByBrowserId } from "@/lib/actions";
import UserTableView from "./table-view";

export default async function UserPage({
  params,
}: {
  params: Promise<{ browserId: string }>;
}) {
  const { browserId } = await params;
  const user = await getUserProfileByBrowserId(browserId);

  return (
    <>
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
      <div className="overflow-hidden rounded-lg border">
        <UserTableView records={user.records} />
      </div>
    </>
  );
}
