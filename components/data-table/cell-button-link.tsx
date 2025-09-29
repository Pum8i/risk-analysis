"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function TableCellButtonLink({
  url,
  value,
}: {
  url: string;
  value: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="link"
      className="text-foreground w-fit px-0 text-left"
      onClick={() => {
        router.push(url);
      }}
    >
      {value}
    </Button>
  );
}
