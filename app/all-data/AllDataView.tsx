"use client";
import { DataTable } from "@/components/data-table/data-table";
import { allRiskColumns } from "@/lib/table-columns";
import { Record } from "@/lib/types";

export default function AllDataView({ allData }: { allData: Record[] }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <DataTable data={allData} columns={allRiskColumns} />
    </div>
  );
}
