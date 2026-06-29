import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

interface SearchInputProps extends React.ComponentProps<typeof Input> {
  wrapperClassName?: string;
}

export function SearchInput({ className, wrapperClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-9 bg-slate-900 border-slate-800 placeholder:text-muted-foreground", className)}
        {...props}
      />
    </div>
  );
}
