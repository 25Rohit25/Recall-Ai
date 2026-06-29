/**
 * Why it exists: The entry point route for the /meetings URL.
 * Why this implementation is scalable: Wrapping the dashboard in a Suspense boundary or Provider here keeps the actual Dashboard component pure and focused on UI logic.
 */
import React from 'react';
import MeetingsDashboard from '@/features/meetings/components/MeetingsDashboard';

export const metadata = {
  title: 'Meetings | FireNotes AI',
  description: 'Manage and search your meetings efficiently.',
};

export default function MeetingsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <MeetingsDashboard />
    </main>
  );
}
