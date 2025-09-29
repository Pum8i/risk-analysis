"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allRiskColumns, atRiskColumns } from "@/lib/table-columns";
import { AtRiskUser, Record } from "@/lib/types";

export function TableView({
  allRisks,
  atRiskUsers,
  allRisksCount,
  atRiskUserCount,
}: {
  allRisks: Record[];
  atRiskUsers: AtRiskUser[];
  allRisksCount: number;
  atRiskUserCount: number;
}) {
  return (
    <Tabs
      defaultValue="all-risks"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="all-risks">
            All Risks
            <Badge variant="secondary" className="min-w-fit">
              {allRisksCount.toLocaleString()}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="at-risk">
            Risk by User
            <Badge variant="secondary" className="min-w-fit">
              {atRiskUserCount.toLocaleString()}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="all-risks"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <div className="overflow-hidden rounded-lg border">
          <DataTable data={allRisks} columns={allRiskColumns} />
        </div>
      </TabsContent>
      <TabsContent
        value="at-risk"
        className="relative flex flex-col gap-4 overflow-auto"
      >
        <div className="overflow-hidden rounded-lg border">
          <DataTable data={atRiskUsers} columns={atRiskColumns} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
