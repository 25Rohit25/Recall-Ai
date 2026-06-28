'use client';
import { UploadCloud, FileText, Database } from 'lucide-react';

interface EmptyWorkspaceStateProps {
  onUpload: () => void;
  onImport: () => void;
  onLoadSample: () => void;
}

export function EmptyWorkspaceState({ onUpload, onImport, onLoadSample }: EmptyWorkspaceStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center fade-in">
      <div className="w-20 h-20 bg-[#0F172A] rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-2xl">
        <Database className="text-slate-500" size={32} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">No Meetings Analyzed Yet</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
        Your executive workspace is empty. Upload a recording or transcript to instantly generate actionable intelligence, speaker metrics, and tasks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <button 
          onClick={onUpload}
          className="group flex flex-col items-center p-6 bg-[#020617] border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-[#0F172A] transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
        >
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="text-purple-400" size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Upload Audio</h3>
          <p className="text-xs text-slate-500">MP3, M4A, or WAV</p>
        </button>

        <button 
          onClick={onImport}
          className="group flex flex-col items-center p-6 bg-[#020617] border border-slate-800 rounded-xl hover:border-blue-500/50 hover:bg-[#0F172A] transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
        >
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="text-blue-400" size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Import Raw Transcript</h3>
          <p className="text-xs text-slate-500">TXT, VTT, or SRT</p>
        </button>

        <button 
          onClick={onLoadSample}
          className="group flex flex-col items-center p-6 bg-[#020617] border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:bg-[#0F172A] transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="text-emerald-400" size={24} />
          </div>
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Load Sample</h3>
          <p className="text-xs text-slate-500">Enterprise Meeting Demo</p>
        </button>
      </div>
    </div>
  );
}
