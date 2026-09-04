import React from 'react';
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';
import { AIConsensus, Issue } from '../types';

interface ConsensusCardProps {
  consensus: AIConsensus;
  issues: Issue[];
}

export const ConsensusCard: React.FC<ConsensusCardProps> = ({ consensus, issues }) => {
  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <Scale className="w-3.5 h-3.5" />
            <span>AI Quality Engine Multi-Layer Agreement</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-sans">
            AI Engine Agreement Rate: {consensus.consensusRate}%
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Gherkinist audits your scenarios across independent validation layers with strict rules to verify syntax, coverage, and automation readiness.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-5 py-4 rounded-2xl border border-slate-200/60">
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Disagreements
            </span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono">
              {consensus.disagreementsCount}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Confidence
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {consensus.consensusRate >= 90 ? 'High' : 'Moderate'}
            </span>
          </div>
        </div>
      </div>

      {/* Model Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {consensus.models.map((model) => (
          <div
            key={model.modelId}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-200 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${model.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {model.modelName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{model.modelName}</h4>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Output
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold font-mono text-slate-900">{model.score}</span>
                <span className="text-xs text-slate-400 font-mono">/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Assessment:
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                "{model.keyFinding}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Issues Flagged: <strong className="text-slate-800 font-mono">{model.issuesCount}</strong></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {model.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Consensus Matrix Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Issue-by-Issue Model Consensus Matrix
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Issue Title</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold text-center">Syntax Layer</th>
                <th className="py-3 px-4 font-semibold text-center">Coverage Layer</th>
                <th className="py-3 px-4 font-semibold text-center">Coherence Layer</th>
                <th className="py-3 px-4 font-semibold text-center">Consensus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {issue.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {issue.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {issue.aiAgreement.chatgpt ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {issue.aiAgreement.claude ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {issue.aiAgreement.gemini ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 font-mono">
                      {issue.consensusRatio} ({issue.confidence}%)
                    </span>
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
