import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';

export default function UpcomingMeetingsPage() {
  return (
    <div className="flex-1 bg-[#0F172A] p-8 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Upcoming Meetings</h1>
        <p className="text-slate-400 mb-12">Manage and prepare for your scheduled syncs.</p>
        
        <FeaturePlaceholder 
          title="Calendar Integration" 
          description="We are building a seamless two-way sync with Google Calendar and Outlook to automatically ingest and prepare intelligence for your upcoming meetings."
        />
      </div>
    </div>
  );
}
