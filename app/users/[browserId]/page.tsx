import { getUserProfileByBrowserId } from "@/lib/actions";
import UserChartView from "./chart-view";
import UserHeaderView from "./header-view";
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
      <UserHeaderView user={user} />
      <UserChartView user={user} />
      <UserTableView records={user.records} />
    </>
  );
}
