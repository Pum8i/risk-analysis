import { getRiskData } from "@/lib/actions";
import AtRiskUsersView from "./AtRiskUsersView";

export default async function AtRiskUsersPage() {
  const { atRiskUsers } = await getRiskData();

  return <AtRiskUsersView atRiskUsers={atRiskUsers} />;
}
