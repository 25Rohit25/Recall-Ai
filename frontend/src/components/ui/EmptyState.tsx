import React from "react";
import { cn } from "@/utils/cn";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-slate-900/50", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 mb-4 text-muted-foreground">
        {icon || <FileQuestion className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
