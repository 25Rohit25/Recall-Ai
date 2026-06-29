import React from "react";
import { cn } from "@/utils/cn";

interface ResponsiveWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Ensures optimal viewing on mobile vs desktop.
 * Often used to wrap complex grid layouts that need horizontal scrolling on mobile
 * without breaking the entire page layout.
 */
export function ResponsiveWrapper({ children, className, ...props }: ResponsiveWrapperProps) {
  return (
    <div className={cn("w-full overflow-x-auto overflow-y-hidden lg:overflow-visible", className)} {...props}>
      {children}
    </div>
  );
}
