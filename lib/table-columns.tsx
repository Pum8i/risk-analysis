import { ColumnDef } from "@tanstack/react-table";

import ActiveBadge from "@/components/active-badge";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { AtRiskUser, Record, UserRecord } from "./types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import TableCellButtonLink from "@/components/data-table/cell-button-link";
import { parseWithDateFns } from "./utils";

const cellSpanStyle = "block text-center";

export const allRiskColumns: ColumnDef<Record>[] = [
  {
    accessorKey: "browserId",
    header: "Browser ID",
    cell: ({ row }) => (
      <TableCellButtonLink
        url={`/users/${row.original.browserId}`}
        value={row.original.browserId}
      />
    ),
  },
  {
    accessorKey: "active",
    header: () => <span className={cellSpanStyle}>Active</span>,
    cell: ({ row }) => (
      <span className={cellSpanStyle}>
        <ActiveBadge active={row.original.active === "t"} />
      </span>
    ),
  },
  {
    accessorKey: "riskLevel",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Risk Level"
        className="text-center"
      />
    ),
    cell: ({ row }) => (
      <span className={cellSpanStyle}>{row.original.riskLevel}</span>
    ),
  },
  {
    accessorKey: "risk",
    header: "Risk",
    cell: ({ row }) => (
      <span className="block truncate max-w-[200px]">{row.original.risk}</span>
    ),
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="block truncate max-w-[200px]">
        {parseWithDateFns(row.original.created).formattedDate}
      </span>
    ),
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => <HoverCell value={row.original.content} />,
  },
];

export const atRiskColumns: ColumnDef<AtRiskUser>[] = [
  {
    accessorKey: "browserId",
    header: "Browser ID",
    cell: ({ row }) => (
      <TableCellButtonLink
        url={`/users/${row.original.browserId}`}
        value={row.original.browserId}
      />
    ),
  },
  {
    accessorKey: "totalRisk",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Level"
        className="text-center"
      />
    ),
    cell: ({ row }) => (
      <span className={cellSpanStyle}>{row.original.totalRisk}</span>
    ),
  },
  {
    accessorKey: "totalNumOfRisk",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total # of Risks"
        className="text-center"
      />
    ),
    cell: ({ row }) => (
      <span className={cellSpanStyle}>{row.original.records.length}</span>
    ),
  },
  {
    accessorKey: "typesOfRisk",
    header: () => <span className={cellSpanStyle}>Types of Risks</span>,
    cell: ({ row }) => {
      const value = row.original.records.map(
        (r) => `${r.risk} (${r.riskLevel})`
      );
      const uniqueArray = [...new Set(value)].join(", ");
      return <span className={cellSpanStyle}>{uniqueArray}</span>;
    },
  },
];

export const userColumns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: "risk",
    header: "Risk",
    cell: ({ row }) => (
      <span className="block truncate max-w-[200px]">{row.original.risk}</span>
    ),
  },
  {
    accessorKey: "riskLevel",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Risk Level"
        className="text-center"
      />
    ),
    cell: ({ row }) => (
      <span className={cellSpanStyle}>{row.original.riskLevel}</span>
    ),
  },
  {
    accessorKey: "created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="block truncate max-w-[200px]">
        {parseWithDateFns(row.original.created).formattedDate}
      </span>
    ),
  },
  {
    accessorKey: "ipExternal",
    header: "External IP",
    cell: ({ row }) => (
      <span className="block truncate max-w-[160px]">
        {row.original.ipExternal}
      </span>
    ),
  },
  {
    accessorKey: "ipInternal",
    header: "Internal IP",
    cell: ({ row }) => (
      <span className="block truncate max-w-[160px]">
        {row.original.ipInternal}
      </span>
    ),
  },
  {
    accessorKey: "content",
    header: "URL",
    cell: ({ row }) => <HoverCell value={row.original.content} />,
  },
  {
    accessorKey: "userAgent",
    header: "User Agent",
    cell: ({ row }) => <HoverCell value={row.original.userAgent} />,
  },
];

function HoverCell({ value }: { value: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger className="block truncate max-w-[300px]">
        {value}
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] break-words">
        {value}
      </HoverCardContent>
    </HoverCard>
  );
}
