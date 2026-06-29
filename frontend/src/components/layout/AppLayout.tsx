"use client";

import React from "react";
import { SidebarLayout } from "./SidebarLayout";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings as SettingsIcon, Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

/**
 * Top level layout that connects the visual Sidebar and Header
 * for authenticated dashboard views.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-bold text-lg text-primary">FireNotes AI</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-slate-800")}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link href="/settings" className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-slate-800")}>
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Link>
      </nav>
    </div>
  );

  return (
    <SidebarLayout sidebar={sidebarContent}>
      <header className="h-16 border-b border-border bg-slate-900/80 backdrop-blur shrink-0 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <LayoutDashboard className="w-5 h-5" />
          </Button>
          <span className="font-medium text-sm text-muted-foreground">Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>FN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </SidebarLayout>
  );
}
