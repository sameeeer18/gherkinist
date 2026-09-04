import React from 'react';
import { GitBranch, CheckCircle2, AlertTriangle, XCircle, FileText, Sparkles, Tag } from 'lucide-react';
import { TraceabilityData } from '../types';

interface RequirementMappingProps {
  traceability?: TraceabilityData;
  onAddScenario?: (acId: string) => void;
}

export const RequirementMapping: React.FC<RequirementMappingProps> = ({
  traceability,
  onAddScenario
}) => {
  if (!traceability || !traceability.acceptanceCriteria || traceability.acceptanceCriteria.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">No Requirement Document Provided</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            GherkinIQ assessed syntax and general coverage. To unlock full bidirectional Layer 4 Traceability and verify AC-01, AC-02 mapping, upload the original User Story or Acceptance Criteria.
          </p>
        </div>
      </div>
    );
  }

  const coveredCount = traceability.acceptanceCriteria.filter(a => a.status === 'COVERED').length;
  const totalAC = traceability.acceptanceCriteria.length;
  const coveragePercent = Math.round((coveredCount / totalAC) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              {traceability.requirementId || 'REQ-DOC'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              traceability.traceabilityStatus === 'COMPLETE'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {traceability.traceabilityStatus} TRACEABILITY
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{traceability.title || 'Requirement Specification'}</h3>
          <p className="text-xs text-slate-500 max-w-xl">
            {traceability.description || 'Verified mapping between acceptance criteria and executable Gherkin scenarios.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200/60">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              AC Coverage
            </span>
            <span className="text-2xl font-extrabold text-slate-900 font-mono">
              {coveredCount}/{totalAC}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Rate
            </span>
            <span className="text-2xl font-extrabold text-indigo-600 font-mono">
              {coveragePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Acceptance Criteria Matrix */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Acceptance Criteria Verification Matrix</h4>
        <div className="grid grid-cols-1 gap-3">
          {traceability.acceptanceCriteria.map((ac) => {
            const isCovered = ac.status === 'COVERED';
            return (
              <div
                key={ac.acId}
                className={`p-4 rounded-2xl border transition ${
                  isCovered
                    ? 'bg-white border-slate-200/80'
                    : 'bg-amber-50/30 border-amber-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white">
                        {ac.acId}
                      </span>
                      <span className={`text-xs font-bold flex items-center gap-1 ${
                        isCovered ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {isCovered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                        {ac.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800">
                      {ac.description}
                    </p>
                  </div>

                  {!isCovered && onAddScenario && (
                    <button
                      onClick={() => onAddScenario(ac.acId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3" />
                      Generate Scenario
                    </button>
                  )}
                </div>

                {/* Mapped Scenarios list */}
                {ac.mappedScenarios && ac.mappedScenarios.length > 0 ? (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-400">Verifying Scenarios:</span>
                    {ac.mappedScenarios.map((sc, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[11px]">
                        "{sc}"
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-amber-700 font-medium">
                    ⚠️ No scenario currently tests this criterion. Recommended to add negative or timeout scenario.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Orphan Scenarios Section */}
      {traceability.orphanScenarios && traceability.orphanScenarios.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Orphan Scenarios Detected ({traceability.orphanScenarios.length})
            </h4>
          </div>
          <p className="text-xs text-slate-600">
            These scenarios exist in the feature file but do not correspond to any requirement acceptance criteria:
          </p>
          <div className="flex flex-wrap gap-2">
            {traceability.orphanScenarios.map((sc, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-800">
                {sc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Traceability Notes */}
      {traceability.notes && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950">
          <span className="font-bold">Architectural Note:</span> {traceability.notes}
        </div>
      )}

    </div>
  );
};
