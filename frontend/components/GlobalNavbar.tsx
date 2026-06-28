'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, ChevronDown, Mic, FileText, Search, Brain, 
  Zap, Users, Building2, DollarSign, Briefcase, Code, 
  Megaphone, GraduationCap, Plug, MessageSquare, Hash,
  BookOpen, HelpCircle, Newspaper, Shield, Menu, X, ArrowRight
} from 'lucide-react';

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  desc: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function NavDropdown({ label, items, isOpen, onToggle, onClose }: NavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-80 bg-[#0c1222] border border-slate-800 rounded-2xl shadow-2xl shadow-black/40 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useAuthStore } from '@/store/useAuthStore';

export function FirefliesNavbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const productItems: DropdownItem[] = [
    { icon: <Mic size={16} className="text-purple-400" />, label: 'AI Notetaker', desc: 'Auto-join and transcribe meetings', href: '/dashboard' },
    { icon: <FileText size={16} className="text-blue-400" />, label: 'AI Summaries', desc: 'Smart meeting recaps and action items', href: '/dashboard' },
    { icon: <Search size={16} className="text-emerald-400" />, label: 'AskFred', desc: 'Search across all your meetings', href: '/dashboard' },
    { icon: <Zap size={16} className="text-amber-400" />, label: 'AI Apps', desc: 'Automate workflows with AI skills', href: '/dashboard' },
    { icon: <Brain size={16} className="text-rose-400" />, label: 'Conversation Intelligence', desc: 'Deep analytics and insights', href: '/dashboard' },
  ];

  const solutionItems: DropdownItem[] = [
    { icon: <DollarSign size={16} className="text-emerald-400" />, label: 'Sales', desc: 'Close deals faster with AI insights', href: '/dashboard' },
    { icon: <Users size={16} className="text-blue-400" />, label: 'Recruiting', desc: 'Streamline your hiring process', href: '/dashboard' },
    { icon: <Megaphone size={16} className="text-rose-400" />, label: 'Marketing', desc: 'Extract insights from customer calls', href: '/dashboard' },
    { icon: <Code size={16} className="text-purple-400" />, label: 'Engineering', desc: 'Keep engineering teams aligned', href: '/dashboard' },
    { icon: <GraduationCap size={16} className="text-amber-400" />, label: 'Education', desc: 'Transform lectures and seminars', href: '/dashboard' },
  ];

  const integrationItems: DropdownItem[] = [
    { icon: <Plug size={16} className="text-blue-400" />, label: 'Zoom', desc: 'Auto-join Zoom meetings', href: '/dashboard' },
    { icon: <MessageSquare size={16} className="text-purple-400" />, label: 'Microsoft Teams', desc: 'Seamless Teams integration', href: '/dashboard' },
    { icon: <Hash size={16} className="text-emerald-400" />, label: 'Slack', desc: 'Push summaries to Slack channels', href: '/dashboard' },
    { icon: <Briefcase size={16} className="text-amber-400" />, label: 'Salesforce', desc: 'Sync meeting notes to CRM', href: '/dashboard' },
  ];

  const resourceItems: DropdownItem[] = [
    { icon: <BookOpen size={16} className="text-blue-400" />, label: 'Blog', desc: 'Latest articles and guides', href: '#' },
    { icon: <HelpCircle size={16} className="text-emerald-400" />, label: 'Help Center', desc: 'Get answers to your questions', href: '#' },
    { icon: <Newspaper size={16} className="text-purple-400" />, label: 'Changelog', desc: 'Product updates and releases', href: '#' },
    { icon: <Users size={16} className="text-rose-400" />, label: 'Community', desc: 'Join our user community', href: '#' },
  ];

  const toggle = (key: string) => setOpenDropdown(openDropdown === key ? null : key);
  const close = () => setOpenDropdown(null);

  return (
    <header className="sticky top-0 left-0 w-full z-50">
      {/* Announcement Strip */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-center text-sm text-white font-medium">
        <span className="inline-flex items-center gap-2">
          <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
          FireNotes launches AI Live Assist & Desktop App. 
          <Link href="/dashboard" className="underline underline-offset-2 hover:no-underline font-semibold">Learn More</Link>
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">fireflies.ai</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-7">
              <NavDropdown label="Product" items={productItems} isOpen={openDropdown === 'product'} onToggle={() => toggle('product')} onClose={close} />
              <NavDropdown label="Solutions" items={solutionItems} isOpen={openDropdown === 'solutions'} onToggle={() => toggle('solutions')} onClose={close} />
              <NavDropdown label="Integrations" items={integrationItems} isOpen={openDropdown === 'integrations'} onToggle={() => toggle('integrations')} onClose={close} />
              <NavDropdown label="Resources" items={resourceItems} isOpen={openDropdown === 'resources'} onToggle={() => toggle('resources')} onClose={close} />
              <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Enterprise</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden md:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                  Go to Dashboard
                </Link>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300 font-medium mr-2">{user.name}</span>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                  Login
                </Link>
                <Link href="/login" className="hidden md:inline-flex px-4 py-2 rounded-lg border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
                  Request Demo
                </Link>
                <Link href="/signup" className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-1.5">
                  Get Started <ArrowRight size={14} />
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-300 hover:text-white">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0c1222] border-t border-slate-800 px-6 py-6 space-y-4">
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Product</Link>
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Solutions</Link>
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Integrations</Link>
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Resources</Link>
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Enterprise</Link>
            <Link href="/dashboard" className="block text-sm font-medium text-slate-300 py-2">Pricing</Link>
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link href="/login" className="block text-center text-sm font-medium text-slate-300 py-2">Login</Link>
              <Link href="/signup" className="block text-center px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-semibold">Get Started</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
