import React from "react";
import { cn } from "@/utils/cn";

interface StickyHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * A layout utility that sticks a header to the top of its scrolling container.
 * Commonly used for table headers or secondary page navigation.
 */
export function StickyHeader({ children, className, ...props }: StickyHeaderProps) {
  return (
    <div 
      className={cn("sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
