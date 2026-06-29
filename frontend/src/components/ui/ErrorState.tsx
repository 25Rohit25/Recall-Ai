import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
      <h3 className="text-lg font-semibold text-destructive-foreground mb-1">{title}</h3>
      <p className="text-sm text-destructive-foreground/80 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="destructive" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
