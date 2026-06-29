import React from "react";
import { cn } from "@/utils/cn";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Standardizes the outermost padding and max-width for pages.
 * Ensures content never stretches too far on ultra-wide monitors.
 */
export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div className={cn("container mx-auto p-6 lg:p-8 max-w-7xl w-full", className)} {...props}>
      {children}
    </div>
  );
}
