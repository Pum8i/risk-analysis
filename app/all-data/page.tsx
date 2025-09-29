import { getAllAuditData } from "@/lib/actions";
import AllDataView from "./AllDataView";

export default async function AllDataPage() {
  const allData = await getAllAuditData();

  return <AllDataView allData={allData} />;
}
