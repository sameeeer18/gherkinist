import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  FileCheck2,
  FileText,
  Layers,
  Sparkles,
  Settings,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const { user } = useAuth();

  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Feature', icon: UploadCloud, badge: 'Gate' },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'requirements', label: 'Requirements', icon: FileCheck2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'framework', label: 'Review Framework', icon: Layers },
    { id: 'ai-comparison', label: 'AI Comparison', icon: Sparkles }
  ];

  const secondaryNav = [
    { id: 'settings', label: 'Settings & Rules', icon: Settings },
    { id: 'help', label: 'Help & Docs', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-6">
        
        {/* Workspace pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">FinTech Quality Gate</p>
              <p className="text-[10px] text-slate-500">v2.4 Active Engine</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
        </div>

        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Quality Gateway
          </p>
          <nav className="space-y-1">
            {primaryNav.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Configuration
          </p>
          <nav className="space-y-1">
            {secondaryNav.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* User footer */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'Alex Morgan'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.role || 'Lead QA Architect'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
