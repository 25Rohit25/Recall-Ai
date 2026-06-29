/**
 * Why it exists: Abstracts global keyboard events out of the UI components.
 * Why this implementation is scalable: Uses a single window event listener rather than attaching listeners to individual DOM elements. Checks if the user is typing in an input before executing shortcuts (to avoid playing/pausing when typing "space" in search).
 */
import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onTogglePlay: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onSearchFocus: () => void;
  onClearSearch: () => void;
  onNextSearchResult: () => void;
  onPrevSearchResult: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const activeElement = document.activeElement as HTMLElement;
      const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlers.onSearchFocus();
        return;
      }
      
      if (e.key === 'Escape') {
        handlers.onClearSearch();
        return;
      }

      if (isTyping) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onSeekBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onSeekForward();
          break;
        case 'j':
        case 'J':
          e.preventDefault();
          handlers.onNextSearchResult();
          break;
        case 'k':
        case 'K':
          e.preventDefault();
          handlers.onPrevSearchResult();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
