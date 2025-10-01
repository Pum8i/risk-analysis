"use client";
import { User } from "@/lib/types";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const description = "A stacked bar chart with a legend";

const availableColors = [
  "#a7d8f0",
  "#d1caae",
  "#aee3d8",
  "#fcf0c3",
  "#cdd5e0",
  "#b2e2e8",
  "#f9d1b7",
  "#e7e1f9",
  "#f9d6e4",
  "#fde2d4",
];

export default function UserChartView({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Data by Hour of Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="max-h-[200px] w-full">
          <BarChart accessibilityLayer data={user.riskByHour}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => `${value.padStart(2, "0")}:00`}
            />

            {user.risksTypes.map((r: string, i: number) => (
              <Bar
                dataKey={`risks.${r}`}
                stackId="a"
                fill={availableColors[Math.abs(i % 10)]}
                name={`${r.charAt(0).toUpperCase()}${r
                  .slice(1)
                  .replaceAll("-", " ")}`}
              />
            ))}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  hideLabel
                  contentStyle={{ padding: 4 }}
                  wrapperStyle={{ padding: 4 }}
                />
              }
              cursor={false}
              defaultIndex={1}
              contentStyle={{ padding: 4 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
