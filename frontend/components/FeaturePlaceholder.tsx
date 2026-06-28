import { Construction, Sparkles } from 'lucide-react';

export function FeaturePlaceholder({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center mb-8 shadow-2xl relative">
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#0F172A] rounded-full flex items-center justify-center border border-slate-700">
           <Sparkles size={12} className="text-pink-400" />
        </div>
        <Construction className="text-purple-400" size={32} />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-100 mb-4 tracking-tight">{title}</h2>
      <p className="text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed text-lg">
        {description}
      </p>

      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
        Currently in development
      </div>
    </div>
  );
}
