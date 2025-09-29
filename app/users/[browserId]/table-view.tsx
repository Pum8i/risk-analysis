"use client";
import { DataTable } from "@/components/data-table/data-table";
import { userColumns } from "@/lib/table-columns";

export default function UserTableView({ records }: { records: any }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <DataTable data={records} columns={userColumns} />
    </div>
  );
}
