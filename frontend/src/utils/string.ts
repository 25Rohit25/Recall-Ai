/**
 * Generates initials from a full name (e.g., "Alice Lane" -> "AL")
 */
export function getInitials(name: string): string {
  if (!name) return "??";
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministically generates a Tailwind background color class based on a string.
 * Used for maintaining consistent avatar colors for specific users/speakers.
 */
export function getAvatarColor(identifier: string): string {
  const colors = [
    "bg-indigo-900 text-indigo-300",
    "bg-emerald-900 text-emerald-300",
    "bg-rose-900 text-rose-300",
    "bg-amber-900 text-amber-300",
    "bg-cyan-900 text-cyan-300",
    "bg-violet-900 text-violet-300",
    "bg-fuchsia-900 text-fuchsia-300",
  ];
  
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
