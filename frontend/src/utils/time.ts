export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const mDisplay = m.toString().padStart(2, '0');
  const sDisplay = s.toString().padStart(2, '0');

  if (h > 0) {
    return `${h}:${mDisplay}:${sDisplay}`;
  }
  
  return `${mDisplay}:${sDisplay}`;
}
