import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { Badge } from "./ui/badge";

export default function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      {active ? (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      ) : (
        <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
      )}
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}
