'use client';

import Link from 'next/link';
import { FirefliesNavbar } from '@/components/GlobalNavbar';
import { 
  ArrowRight, Mic, FileText, Search, Brain, Zap, 
  CheckCircle2, Star, Lock, Video, Monitor, 
  MessageSquare, Globe, Clock, BarChart3, Users,
  Sparkles, Shield, ChevronDown
} from 'lucide-react';
import { useState } from 'react';

function LogoBar() {
  const logos = ['Netflix', 'Uber', 'Spotify', 'Stripe', 'Notion', 'Figma', 'Vercel', 'Shopify'];
  return (
    <div className="py-16 border-y border-slate-800/50">
      <p className="text-center text-xs font-bold tracking-[0.25em] uppercase text-slate-500 mb-10">
        Used across <span className="text-purple-400">300,000+</span> companies
      </p>
      <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
        {logos.map((name) => (
          <span key={name} className="text-lg font-bold text-slate-400 tracking-wide">{name}</span>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="group relative bg-[#0c1222] border border-slate-800 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.08)]">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function AccordionItem({ title, content, isOpen, onClick }: { title: string; content: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className={`border-b border-slate-800 transition-colors ${isOpen ? 'border-purple-500/30' : ''}`}>
      <button onClick={onClick} className="flex items-center justify-between w-full py-5 text-left group">
        <span className={`text-base font-semibold transition-colors ${isOpen ? 'text-purple-400' : 'text-slate-300 group-hover:text-white'}`}>{title}</span>
        <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-slate-400 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const features = [
    { icon: <Mic size={22} className="text-white" />, title: 'AI Notetaker', desc: 'Automatically joins your meetings on Zoom, Teams, Google Meet and transcribes everything with 95%+ accuracy.', color: 'bg-purple-500/20 border border-purple-500/30' },
    { icon: <FileText size={22} className="text-white" />, title: 'AI Summaries', desc: 'Get smart meeting recaps with key decisions, action items, and follow-ups — all generated in seconds.', color: 'bg-blue-500/20 border border-blue-500/30' },
    { icon: <Search size={22} className="text-white" />, title: 'Smart Search', desc: 'Search across all your meetings with natural language. Find exactly what was discussed, by whom, and when.', color: 'bg-emerald-500/20 border border-emerald-500/30' },
    { icon: <Brain size={22} className="text-white" />, title: 'Conversation Intelligence', desc: 'Deep analytics on speaker talk time, sentiment, topics, questions asked, and engagement patterns.', color: 'bg-rose-500/20 border border-rose-500/30' },
    { icon: <Zap size={22} className="text-white" />, title: 'AI Workflows', desc: 'Automate post-meeting tasks. Push action items to Jira, summaries to Slack, and notes to your CRM.', color: 'bg-amber-500/20 border border-amber-500/30' },
    { icon: <Shield size={22} className="text-white" />, title: 'Enterprise Security', desc: 'SOC 2 Type II, GDPR, and HIPAA compliant. End-to-end encryption with role-based access controls.', color: 'bg-teal-500/20 border border-teal-500/30' },
  ];

  const accordionData = [
    { title: 'Speaker Talk-time Analysis', content: 'See exactly how much each participant talks during a meeting. Identify dominant speakers, quiet participants, and optimize meeting dynamics for better collaboration.' },
    { title: 'AI-Powered Filters', content: 'Automatically detect and filter questions, action items, tasks, pricing discussions, and key metrics from your transcripts. Jump to exactly what matters.' },
    { title: 'Sentiment Analysis', content: 'Understand the emotional tone of your meetings. Detect positive, negative, or neutral sentiments across speakers and topics to gauge team morale and client satisfaction.' },
    { title: 'Topic Trackers', content: 'Create custom trackers for specific topics, competitors, or keywords. Get automatically alerted when these topics come up across any meeting in your organization.' },
  ];

  return (
    <div className="min-h-full bg-[#020617] text-white overflow-x-hidden">


      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-pink-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            The #1 AI Assistant For{' '}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Your Meetings</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Transcribe, summarize, search, and analyze all your team conversations. Build a searchable knowledge base of every meeting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-base hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_45px_rgba(168,85,247,0.45)] flex items-center gap-2 group">
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-semibold text-base hover:bg-slate-800/50 hover:border-slate-600 transition-all">
              Request Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="ml-1">Rated 4.8/5 on G2</span>
            </div>
            <span className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Lock size={13} className="text-emerald-400" />
              <span>SOC 2, GDPR, HIPAA</span>
            </div>
          </div>
        </div>

        {/* Hero Visual - Mock Dashboard */}
        <div className="relative max-w-5xl mx-auto px-6 mt-16">
          <div className="bg-[#0c1222] border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-800 bg-[#0a0f1e]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-[11px] text-slate-500 ml-3 font-medium">FireNotes AI — Dashboard</span>
            </div>
            
            <div className="grid grid-cols-12 min-h-[400px]">
              {/* Mini Sidebar */}
              <div className="col-span-3 border-r border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="w-5 h-5 rounded bg-purple-500/30 flex items-center justify-center"><Sparkles size={11} className="text-purple-400" /></div>
                  <span className="text-xs font-semibold text-purple-400">Dashboard</span>
                </div>
                {['Meetings', 'Search', 'Analytics', 'Workflows', 'Settings'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-800/50 transition-colors">
                    <div className="w-5 h-5 rounded bg-slate-800" />
                    <span className="text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              {/* Main Content */}
              <div className="col-span-9 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm font-bold text-slate-200">Good Morning, Alice</div>
                    <div className="text-xs text-slate-500 mt-0.5">You have 3 meetings today</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400">Today</div>
                    <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">This Week</div>
                  </div>
                </div>
                
                {/* Metric Cards */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Meetings', value: '24', color: 'text-blue-400' },
                    { label: 'Hours Saved', value: '48h', color: 'text-emerald-400' },
                    { label: 'Action Items', value: '12', color: 'text-amber-400' },
                    { label: 'Health Score', value: '92', color: 'text-purple-400' },
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-800/30 rounded-xl p-3 border border-slate-800">
                      <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Meeting List Preview */}
                {['Q3 Planning Review', 'Engineering Sync', 'Client Onboarding'].map((title, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${['bg-indigo-500/30', 'bg-emerald-500/30', 'bg-rose-500/30'][i]}`}>
                        {title[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-300">{title}</div>
                        <div className="text-[10px] text-slate-500">45 min • 4 participants</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617] to-transparent" />
        </div>
      </section>

      {/* Logo Bar */}
      <div className="max-w-7xl mx-auto px-6">
        <LogoBar />
      </div>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">never forget</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            From transcription to actionable insights — FireNotes handles the entire meeting lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* Conversation Intelligence Section */}
      <section className="py-24 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Drive Insights With{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Conversation Intelligence</span>
            </h2>
            <p className="text-base text-slate-400 mb-10 leading-relaxed">
              Detailed analytics to help you uncover insights across every conversation.
            </p>
            <div>
              {accordionData.map((item, i) => (
                <AccordionItem
                  key={i}
                  title={item.title}
                  content={item.content}
                  isOpen={openAccordion === i}
                  onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                />
              ))}
            </div>
          </div>

          {/* Right side mock */}
          <div className="relative">
            <div className="bg-[#0c1222] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-sm font-bold text-slate-200">Meeting Analytics</span>
                <span className="text-xs text-slate-500">Q3 Planning Review</span>
              </div>
              
              {/* Speaker bars */}
              {[
                { name: 'Alice (CEO)', pct: 35, color: 'bg-purple-500' },
                { name: 'Bob (CTO)', pct: 28, color: 'bg-blue-500' },
                { name: 'Carol (PM)', pct: 22, color: 'bg-emerald-500' },
                { name: 'Dave (Eng)', pct: 15, color: 'bg-amber-500' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-300">{s.name}</span>
                    <span className="text-xs text-slate-500">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}

              {/* Sentiment */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3">
                {[
                  { label: 'Positive', value: '68%', color: 'text-emerald-400' },
                  { label: 'Neutral', value: '24%', color: 'text-slate-400' },
                  { label: 'Concerns', value: '8%', color: 'text-rose-400' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 bg-slate-800/30 rounded-xl">
                    <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#0c1222] to-[#1a0b2e] border border-slate-800 rounded-3xl p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your meetings?
              </h2>
              <p className="text-base text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Join 300,000+ teams who use FireNotes to save time, capture insights, and never miss a detail.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-2 group">
                  Start Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="px-8 py-4 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800/50 transition-all">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">fireflies.ai</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered meeting intelligence for modern teams.</p>
            </div>
            {[
              { title: 'Product', links: ['AI Notetaker', 'AI Summaries', 'Smart Search', 'AI Apps', 'Analytics'] },
              { title: 'Solutions', links: ['Sales', 'Recruiting', 'Marketing', 'Engineering', 'Education'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'Changelog', 'Community', 'API Docs'] },
              { title: 'Company', links: ['About', 'Careers', 'Security', 'Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-600">&copy; {new Date().getFullYear()} FireNotes AI. All rights reserved.</span>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <Link href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-400 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
