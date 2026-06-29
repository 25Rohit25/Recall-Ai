import { MeetingDetailResponse, TranscriptSegment, ActionItem } from '@/hooks/useMeetings';

export function exportMeetingToMarkdown(meeting: MeetingDetailResponse) {
  const { title, date, intelligence, action_items, transcript_segments } = meeting;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  let md = `# ${title}\n`;
  md += `**Date:** ${formattedDate}\n`;
  if (intelligence?.health_score) {
    md += `**Health Score:** ${intelligence.health_score}/100\n`;
  }
  md += `\n---\n\n`;

  if (intelligence) {
    md += `## Executive Summary\n`;
    md += `${intelligence.overview}\n\n`;

    if (meeting.decisions && meeting.decisions.length > 0) {
      md += `## Key Decisions\n`;
      meeting.decisions.forEach(d => {
        md += `- ${d.description}\n`;
      });
      md += `\n`;
    }

    md += `## Risks Identified\n`;
    intelligence.risks.forEach(r => {
      md += `- ${r}\n`;
    });
    md += `\n`;
  }

  if (action_items && action_items.length > 0) {
    md += `## Action Items\n`;
    action_items.forEach(task => {
      const checked = task.status === 'completed' ? '[x]' : '[ ]';
      md += `- ${checked} **${task.owner}**: ${task.task}\n`;
    });
    md += `\n`;
  }

  md += `## Transcript\n\n`;
  transcript_segments.forEach(segment => {
    const m = Math.floor(segment.start_time / 60);
    const s = Math.floor(segment.start_time % 60).toString().padStart(2, '0');
    md += `**[${m}:${s}] ${segment.speaker}**\n`;
    md += `${segment.text}\n\n`;
  });

  // Create and trigger download
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_Notes.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
