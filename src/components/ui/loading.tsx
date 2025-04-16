"use client";
import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-black",
          "h-1 w-full rounded-none",
        )}
      >
        <ProgressPrimitive.Indicator
          style={{
            transformOrigin: "0% 50%",
          }}
          className={`h-full w-full flex-1 animate-progress bg-primaryColor transition-all`}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
