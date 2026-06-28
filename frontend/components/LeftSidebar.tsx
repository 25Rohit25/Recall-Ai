'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { Briefcase, Calendar, FolderClosed, Home, Settings, Scale, Plug, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <aside className="w-full flex-shrink-0 border-r border-slate-800 bg-[var(--ff-sidebar)] flex flex-col h-full text-slate-300">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 flex-shrink-0 rounded bg-[var(--ff-purple)] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-600/20">
          FN
        </div>
        <span className="font-semibold text-slate-100 tracking-tight text-sm truncate">FireNotes AI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          <NavItem href="/dashboard" icon={<Home size={18} />} label="Home" active={pathname === '/dashboard'} />
          <NavItem href="/meetings/upcoming" icon={<Calendar size={18} />} label="Upcoming Meetings" active={pathname === '/meetings/upcoming'} />
          <NavItem href="/compare" icon={<Scale size={18} />} label="Compare Engine" active={pathname === '/compare'} />
          <NavItem href="/workspaces" icon={<Briefcase size={18} />} label="Workspaces" active={pathname === '/workspaces'} />
        </div>
        
        <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Apps & Add-ons
        </div>
        <div className="mt-3 px-3 space-y-1">
          <NavItem href="/integrations" icon={<Plug size={18} />} label="Integrations" active={pathname === '/integrations'} />
          <NavItem href="/apps" icon={<Zap size={18} />} label="AI Apps" active={pathname === '/apps'} />
        </div>

        <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recent Folders
        </div>
        <div className="mt-3 px-3 space-y-1">
          <NavItem href="/folders/q3-planning" icon={<FolderClosed size={18} />} label="Q3 Planning" active={pathname.includes('/folders/q3-planning')} />
          <NavItem href="/folders/engineering-syncs" icon={<FolderClosed size={18} />} label="Engineering Syncs" active={pathname.includes('/folders/engineering-syncs')} />
          <NavItem href="/folders/investor-updates" icon={<FolderClosed size={18} />} label="Investor Updates" active={pathname.includes('/folders/investor-updates')} />
          <NavItem href="/folders/client-calls" icon={<FolderClosed size={18} />} label="Client Calls" active={pathname.includes('/folders/client-calls')} />
          <NavItem href="/folders/internal-reviews" icon={<FolderClosed size={18} />} label="Internal Reviews" active={pathname.includes('/folders/internal-reviews')} />
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
        <button className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors w-full px-3 py-2 rounded-lg hover:bg-slate-800/50 focus:outline-none">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors w-full px-3 py-2 rounded-lg hover:bg-slate-800/50 focus:outline-none">
          <LogOut size={18} />
          <span className="text-sm font-medium">Log out</span>
        </button>

        {/* User Profile Block */}
        <div className="flex items-center gap-3 mt-4 px-2 py-2 w-full hover:bg-[var(--ff-surface)] rounded-lg cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-300 text-sm font-semibold">
            {user ? getInitials(user.name) : 'G'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-slate-200 truncate">{user ? user.name : 'Guest'}</span>
            <span className="text-xs text-slate-500 truncate">{user ? user.email : 'guest@firenotes.ai'}</span>
          </div>
        </div>
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
