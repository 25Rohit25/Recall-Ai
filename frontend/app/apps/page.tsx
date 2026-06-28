import { LeftSidebar } from '@/components/LeftSidebar';
import { Search, Zap, Plus, FileText, Sparkles, Wand2, Lightbulb } from 'lucide-react';

export default function AppsPage() {
  const customApps = [
    { title: 'Action Item Extractor', desc: 'Automatically pull out tasks and assignees from any meeting.', icon: <CheckSquare className="text-emerald-400" size={24} /> },
    { title: 'Sales Discovery', desc: 'Identify pain points, budget, and authority from sales calls.', icon: <DollarSign className="text-blue-400" size={24} /> },
    { title: 'Engineering Standup', desc: 'Summarize blockers and yesterday/today updates.', icon: <Code className="text-purple-400" size={24} /> },
    { title: 'Sentiment Analysis', desc: 'Analyze the emotional tone of the conversation.', icon: <Smile className="text-rose-400" size={24} /> },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30">
      <div className="w-64 flex-shrink-0">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex-shrink-0 h-16 border-b border-slate-800 bg-[#0c1222] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Zap className="text-purple-400" size={20} />
            <h1 className="text-lg font-semibold text-white">AI Apps</h1>
          </div>
          
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-purple-600/20">
            <Plus size={16} /> Create Custom App
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* AskFred Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={20} /> AskFireNotes (AskFred)
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Interact with your meetings using conversational AI.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-[#0c1222] border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">Prompt Library</h3>
                  <div className="flex flex-col gap-3">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/30 cursor-pointer transition-colors flex items-start gap-4">
                      <Wand2 className="text-purple-400 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-slate-200">Write a follow-up email</div>
                        <div className="text-sm text-slate-400 mt-1">"Draft a professional follow-up email based on the action items discussed."</div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/30 cursor-pointer transition-colors flex items-start gap-4">
                      <FileText className="text-blue-400 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-slate-200">Generate release notes</div>
                        <div className="text-sm text-slate-400 mt-1">"Extract all features and bug fixes discussed and format them as release notes."</div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/30 cursor-pointer transition-colors flex items-start gap-4">
                      <Lightbulb className="text-amber-400 mt-0.5" size={18} />
                      <div>
                        <div className="font-medium text-slate-200">Brainstorm ideas</div>
                        <div className="text-sm text-slate-400 mt-1">"What were the top 3 ideas proposed for the Q3 marketing campaign?"</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Magic Summaries Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Custom Summaries</h2>
                <p className="text-slate-400 text-sm">Automatically extract structured data from every meeting.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {customApps.map((app, i) => (
                  <div key={i} className="bg-[#0c1222] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                      {app.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{app.title}</h3>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{app.desc}</p>
                      <button className="text-purple-400 text-sm font-medium mt-3 hover:text-purple-300 transition-colors">
                        Edit Prompt &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

// Helper icons
function CheckSquare(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>; }
function DollarSign(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>; }
function Code(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>; }
function Smile(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>; }
