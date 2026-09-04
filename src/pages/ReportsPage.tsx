import React, { useState } from 'react';
import { FileText, Printer, Download, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '../types';
import { ReportModal } from '../components/ReportModal';

interface ReportsPageProps {
  analyses: AnalysisResult[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ analyses }) => {
  const [selectedReport, setSelectedReport] = useState<AnalysisResult | null>(null);

  return (
    <div className="space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          Saved Feature Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          View full test reports, check line-by-line mistakes, and print or export as PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analyses.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {item.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.sprintReady ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {item.finalVerdict}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.featureTitle}</h3>
              <p className="text-xs text-slate-500 font-mono">{item.fileName}</p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.executiveSummary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="font-mono text-xs">
                <span className="font-bold text-slate-900 text-sm">{item.overallScore}</span>
                <span className="text-slate-400">/100 Readiness</span>
              </div>

              <button
                onClick={() => setSelectedReport(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <ReportModal
          analysis={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

    </div>
  );
};
