/**
 * Why it exists: Provides an instant skeleton UI when navigating to a meeting detail page.
 * Why this architecture is scalable: Next.js automatically mounts this while the Server Components or data fetching resolves, completely eliminating Layout Shift (CLS).
 */
import React from 'react';

export default function MeetingLoading() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <header className="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-md hidden md:block"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
      </header>

      {/* Body Skeleton */}
      <div className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        
        {/* Left Column (Video/Summary) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
           <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800"></div>
           <div className="p-6 flex-grow space-y-4">
             <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
             <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded-md mb-8"></div>
             
             <div className="space-y-3">
               <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
               <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
               <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
             </div>
           </div>
        </div>

        {/* Right Column (Transcript) */}
        <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col bg-gray-50 dark:bg-gray-950 p-6 space-y-6">
           <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-800 rounded-full mb-4"></div>
           
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex items-start space-x-4">
               <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0"></div>
               <div className="flex-grow space-y-2">
                 <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                 <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                 <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
               </div>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}
