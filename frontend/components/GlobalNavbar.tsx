import Link from 'next/link';
import { Sparkles, Search, Bell, Settings, User } from 'lucide-react';

export function GlobalNavbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50">
      <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Recall AI</span>
            </Link>

            {/* Global Search - Placeholder for Bonus */}
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search all meetings..." 
                className="w-96 bg-[var(--ff-surface)] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--ff-purple)]"
              />
            </div>
          </div>

          {/* Right Profile & Settings */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 cursor-pointer hover:border-[var(--ff-purple)] transition-colors">
              <User size={16} className="text-slate-400" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
