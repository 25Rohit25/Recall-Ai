import React from "react";
import { cn } from "@/utils/cn";

interface ContentContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Standard inner container for grouping cards or blocks of content together.
 * Usually placed inside a PageContainer.
 */
export function ContentContainer({ children, className, ...props }: ContentContainerProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {children}
    </div>
  );
}
