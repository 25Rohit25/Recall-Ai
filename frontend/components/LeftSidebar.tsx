import { Briefcase, Calendar, FolderClosed, Home, Settings } from 'lucide-react';

export function LeftSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
          FN
        </div>
        <span className="font-semibold text-slate-200 tracking-tight">FireNotes AI</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          <NavItem icon={<Home size={18} />} label="Home" active />
          <NavItem icon={<Calendar size={18} />} label="Upcoming Meetings" />
          <NavItem icon={<Briefcase size={18} />} label="Workspaces" />
        </div>
        
        <div className="mt-8 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Recent Folders
        </div>
        <div className="mt-3 px-3 space-y-1">
          <NavItem icon={<FolderClosed size={18} />} label="Q3 Planning" />
          <NavItem icon={<FolderClosed size={18} />} label="Engineering Syncs" />
          <NavItem icon={<FolderClosed size={18} />} label="Investor Updates" />
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors w-full px-2 py-1.5 rounded-md hover:bg-slate-800/50">
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-500/10 text-indigo-400' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
