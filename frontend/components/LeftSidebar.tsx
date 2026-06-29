'use client';
import { Briefcase, Plug, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full flex-shrink-0 border-r border-slate-800 bg-[var(--ff-sidebar)] flex flex-col h-full text-slate-300">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 flex-shrink-0 rounded bg-[var(--ff-purple)] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/20">
          FN
        </div>
        <span className="font-semibold text-slate-100 tracking-tight text-sm truncate">Recall AI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          <NavItem href="/dashboard" icon={<Briefcase size={18} />} label="Meetings" active={pathname === '/dashboard'} />
        </div>
        
        <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Apps
        </div>
        <div className="mt-3 px-3 space-y-1">
          <NavItem href="#" icon={<Plug size={18} />} label="Integrations" active={false} />
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        <button className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors w-full px-3 py-2 rounded-lg hover:bg-slate-800/50 focus:outline-none">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
        active 
          ? 'bg-[var(--ff-surface)] text-[var(--ff-purple)] border border-slate-800' 
          : 'text-slate-400 hover:bg-[var(--ff-surface)] hover:text-slate-200 border border-transparent'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
