import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  Trash2,
  GitCompare,
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { api } from '../services/api';

interface HistoryPageProps {
  history: AnalysisResult[];
  onSelectAnalysis: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onSelectAnalysis,
  onDeleteAnalysis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'all' | 'ready' | 'revision'>('all');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.featureTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (verdictFilter === 'ready') return matchesSearch && item.sprintReady;
    if (verdictFilter === 'revision') return matchesSearch && !item.sprintReady;
    return matchesSearch;
  });

  const handleLaunchCompare = async (targetId: string) => {
    setIsComparing(true);
    try {
      const data = await api.compareVersions(targetId);
      setComparisonData(data);
      setCompareModalOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
            Feature Quality Audit History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete revision history, quality gate decisions, and version improvements.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by feature, file, or audit ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setVerdictFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              verdictFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Audits ({history.length})
          </button>
          <button
            onClick={() => setVerdictFilter('ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              verdictFilter === 'ready' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Sprint Ready
          </button>
          <button
            onClick={() => setVerdictFilter('revision')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              verdictFilter === 'revision' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Needs Revision
          </button>
        </div>
      </div>

      {/* Audit List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectAnalysis(item.id)}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-sm transition cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">v{item.version || 1}.0</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.sprintReady ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {item.finalVerdict}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.featureTitle}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {item.fileName} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 self-end md:self-center">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Score</span>
                <span className="text-2xl font-extrabold font-mono text-slate-900">{item.overallScore}</span>
                <span className="text-xs text-slate-400 font-mono">/100</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchCompare(item.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                  title="Compare with baseline version"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAnalysis(item.id);
                  }}
                  className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                  title="View Audit"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAnalysis(item.id);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Modal */}
      {compareModalOpen && comparisonData && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Version Improvement Delta</h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Baseline Version</span>
                <div className="text-3xl font-extrabold font-mono text-slate-800">
                  {comparisonData.baseVersion.score}
                </div>
                <p className="text-xs text-slate-500">v{comparisonData.baseVersion.version || 1}.0 • {comparisonData.baseVersion.issuesCount} issues</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
                <span className="text-xs font-bold text-indigo-700 uppercase">Target Version</span>
                <div className="text-3xl font-extrabold font-mono text-indigo-950">
                  {comparisonData.targetVersion.score}
                </div>
                <p className="text-xs text-indigo-700">v{comparisonData.targetVersion.version || 2}.0 • {comparisonData.targetVersion.issuesCount} issues</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Score Improvement Delta:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{comparisonData.metrics.scoreDeltaSign} Points</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Defects Resolved:</span>
                <span className="font-mono font-bold text-emerald-400">{comparisonData.metrics.fixedIssuesCount} Issues Fixed</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
