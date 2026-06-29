import { LeftSidebar } from '@/components/LeftSidebar';
import { Search, Plug, CheckCircle2 } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    { name: 'Zoom', desc: 'Auto-join and transcribe Zoom meetings', connected: true, icon: '📹' },
    { name: 'Google Meet', desc: 'Auto-join and transcribe Google Meet calls', connected: true, icon: '🎥' },
    { name: 'Microsoft Teams', desc: 'Transcribe Microsoft Teams meetings', connected: false, icon: '💼' },
    { name: 'Slack', desc: 'Send meeting recaps directly to Slack channels', connected: true, icon: '💬' },
    { name: 'Salesforce', desc: 'Sync meeting notes to your CRM', connected: false, icon: '☁️' },
    { name: 'HubSpot', desc: 'Update deals and contacts automatically', connected: false, icon: '🎯' },
    { name: 'Notion', desc: 'Export transcripts and action items to Notion', connected: false, icon: '📝' },
    { name: 'Asana', desc: 'Create tasks directly from meeting action items', connected: false, icon: '✅' },
  ];

  return (
    <div className="flex h-full bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30">
      <div className="w-64 flex-shrink-0">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-[#0c1222] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Plug className="text-purple-400" size={20} />
            <h1 className="text-lg font-semibold text-white">Integrations</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search integrations..." 
              className="w-64 bg-slate-900 border border-slate-800 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-slate-500 text-slate-300"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Tools</h2>
              <p className="text-slate-400">Automate your workflow by connecting Recall AI to your favorite apps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {integrations.map((app, i) => (
                <div key={i} className="bg-[#0c1222] border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all group flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {app.icon}
                    </div>
                    {app.connected && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} /> Connected
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-200 mb-2">{app.name}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                    {app.desc}
                  </p>
                  <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    app.connected 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-purple-600 hover:bg-purple-500 text-white'
                  }`}>
                    {app.connected ? 'Manage' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
