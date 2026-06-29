import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge tailwind classes safely, combining clsx and tailwind-merge.
 * This ensures no conflicting tailwind utility classes exist on the same element.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
