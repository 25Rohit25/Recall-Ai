'use client'; // Error components must be Client Components
 
import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error boundary caught:', error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] p-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 border-dashed m-4">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        We encountered an unexpected issue while loading this view.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md font-medium shadow-sm transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry Request
      </button>
    </div>
  );
}
