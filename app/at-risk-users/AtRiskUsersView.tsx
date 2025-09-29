"use client";
import { DataTable } from "@/components/data-table/data-table";
import { atRiskColumns } from "@/lib/table-columns";
import { AtRiskUser } from "@/lib/types";

export default function AtRiskUsersView({
  atRiskUsers,
}: {
  atRiskUsers: AtRiskUser[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <DataTable data={atRiskUsers} columns={atRiskColumns} />
    </div>
  );
}
