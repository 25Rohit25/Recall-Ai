"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Reusable layout that manages the structural split between a left sidebar and main content.
 * Scalable for any dashboard-style page.
 */
export function SidebarLayout({ sidebar, children }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Sidebar Container */}
      <aside
        className={cn(
          "relative flex flex-col border-r border-border bg-slate-900 transition-all duration-300 ease-in-out shrink-0 h-full",
          isCollapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
