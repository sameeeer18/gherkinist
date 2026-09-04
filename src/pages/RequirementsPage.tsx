import React, { useState } from 'react';
import { FileCheck2, Plus, Search, CheckCircle2, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { AnalysisResult } from '../types';

interface RequirementsPageProps {
  analyses: AnalysisResult[];
  onSelectAnalysis: (id: string) => void;
}

export const RequirementsPage: React.FC<RequirementsPageProps> = ({ analyses, onSelectAnalysis }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const reqs = analyses.filter(a => a.traceabilityData && a.traceabilityData.acceptanceCriteria?.length);

  return (
    <div className="space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
            Requirements & Acceptance Criteria Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track business requirements, mapped acceptance criteria (AC), and feature coverage status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reqs.map((item) => {
          const t = item.traceabilityData!;
          const covered = t.acceptanceCriteria.filter(a => a.status === 'COVERED').length;
          const total = t.acceptanceCriteria.length;

          return (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition cursor-pointer space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white">
                    {t.requirementId || 'REQ-SPEC'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  t.traceabilityStatus === 'COMPLETE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {t.traceabilityStatus} COVERAGE ({covered}/{total} AC)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {t.acceptanceCriteria.map((ac) => (
                  <div key={ac.acId} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-800">{ac.acId}</span>
                      <span className={`font-semibold ${ac.status === 'COVERED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ac.status}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 text-[11px]">{ac.description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <span className="font-mono">Mapped Feature: {item.fileName}</span>
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  Open Traceability Matrix <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
