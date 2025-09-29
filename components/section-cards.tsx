import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditStatistics } from "@/lib/types";

export function SectionCard({
  title,
  value,
  secondaryTitle,
  secondaryValue,
}: {
  title: string;
  value: string;
  secondaryTitle?: string;
  secondaryValue?: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="flex justify-between">
          <div>{title}</div>
          {secondaryTitle && <div>{secondaryTitle}</div>}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex justify-between">
          <div>{value.toLocaleString()}</div>
          {secondaryValue && <div>{secondaryValue}</div>}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export function SectionCards({ children }: { children: React.ReactNode }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {children}
    </div>
  );
}
