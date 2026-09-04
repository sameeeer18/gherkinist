import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Trash2,
  Layers,
  Scale
} from 'lucide-react';
import { DashboardStats, AnalysisResult } from '../types';

interface DashboardPageProps {
  stats: DashboardStats;
  onSelectAnalysis: (id: string) => void;
  onStartAnalyze: () => void;
  onDeleteAnalysis: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  onSelectAnalysis,
  onStartAnalyze,
  onDeleteAnalysis
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
              Quality Gate Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Engine v2.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise health dashboard across Gherkin feature files, sprint gates, and model consensus.
          </p>
        </div>

        <button
          onClick={onStartAnalyze}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
        >
          <UploadCloud className="w-4 h-4 text-indigo-300" />
          <span>Analyze New Feature</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Files */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Features Analyzed</span>
            <FileCode2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {stats.filesAnalyzed}
          </div>
          <p className="text-[11px] text-slate-400">Total audited files</p>
        </div>

        {/* Avg Readiness Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Readiness</span>
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 font-mono">
            {stats.averageScore} <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-slate-400">Target quality bar: 85+</p>
        </div>

        {/* Sprint Ready Count */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Sprint Gate Pass</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono">
            {stats.sprintReadyCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {stats.needsRevisionCount} features need revision
          </p>
        </div>

        {/* AI Consensus Average */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>AI Consensus Avg</span>
            <Scale className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {stats.consensusAverage}%
          </div>
          <p className="text-[11px] text-slate-400">ChatGPT + Claude + Gemini</p>
        </div>

      </div>

      {/* Layer Distribution & Readiness Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Layer Averages */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quality Metrics Benchmark</h3>
              <p className="text-xs text-slate-500">Average scores across all audited features</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">MAX 3.0 PTS</span>
          </div>

          <div className="space-y-4">
            {stats.layerAverages.map((la) => (
              <div key={la.layer} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{la.layer}</span>
                  <span className="font-mono font-bold text-slate-900">{la.score} / {la.max}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      la.score >= 2.8 ? 'bg-emerald-500' : la.score >= 2.0 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(la.score / la.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Gates Summary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Sprint Gate Distribution</h3>
            <p className="text-xs text-slate-500">Readiness bar evaluation</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">Sprint Ready</span>
              </div>
              <span className="text-base font-extrabold text-emerald-700 font-mono">{stats.sprintReadyCount}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">Needs Revision</span>
              </div>
              <span className="text-base font-extrabold text-amber-700 font-mono">{stats.needsRevisionCount}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">Critical Issues</span>
              </div>
              <span className="text-base font-extrabold text-rose-700 font-mono">{stats.criticalIssuesCount}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Requires ≥ 2/3 points on Coverage & Coherence to pass
          </p>
        </div>

      </div>

      {/* Recent Feature Analyses Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Feature Quality Audits</h3>
            <p className="text-xs text-slate-500">Click any row to open the complete analysis workspace</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Feature & File</th>
                <th className="py-3 px-4 font-semibold text-center">Readiness</th>
                <th className="py-3 px-4 font-semibold text-center">Dev / QA</th>
                <th className="py-3 px-4 font-semibold text-center">Sprint Gate</th>
                <th className="py-3 px-4 font-semibold text-center">Issues</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentAnalyses.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => onSelectAnalysis(rec.id)}
                  className="hover:bg-indigo-50/40 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{rec.featureTitle}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{rec.fileName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-extrabold text-slate-900 text-sm">{rec.overallScore}</span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                    {rec.developmentScore}% / {rec.qaScore}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {rec.sprintReady ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ SPRINT READY
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        REVISION NEEDED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                    {rec.issuesCount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnalysis(rec.id);
                        }}
                        className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                        title="View Analysis"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAnalysis(rec.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
