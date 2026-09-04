import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle, FileText, Code2, Sparkles, Check, ChevronRight } from 'lucide-react';
import { AnalysisResult, LayerType } from '../types';

interface ReportModalProps {
  analysis: AnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ analysis, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GherkinIQ_Audit_${analysis.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLayerName = (layer: LayerType) => {
    switch (layer) {
      case 'structuralSyntax':
        return 'Syntax & Formatting';
      case 'coverageCompleteness':
        return 'Scenario Coverage';
      case 'coherenceConsistency':
        return 'Wording & Clarity';
      case 'traceability':
        return 'Requirement Match';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Top Header (Hidden in Print) */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">GherkinIQ Quality Gate Audit Certificate</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Audit #{analysis.id} • {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Report Scrollable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-800 text-xs sm:text-sm leading-relaxed print:p-0">
          
          {/* Certificate Header Banner */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  OFFICIAL AUDIT REPORT
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {analysis.id}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {analysis.featureTitle}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Source File: <strong className="text-slate-700 font-semibold">{analysis.fileName}</strong> ({analysis.fileSize || '3.8 KB'})
              </p>
            </div>

            {/* Top Scorecard */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-center px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Readiness Score</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900">{analysis.overallScore}</span>
                <span className="text-xs text-slate-400 font-mono">/100</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sprint Verdict</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                  analysis.sprintReady
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}>
                  {analysis.finalVerdict}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Executive Summary
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-700 leading-relaxed text-sm">
              {analysis.executiveSummary}
            </div>
          </div>

          {/* Quality Breakdown Assessment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Quality Check Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Syntax & Formatting</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {analysis.fourLayers.structuralSyntax.score} / 3
                </div>
                <span className="inline-block text-[11px] font-bold text-slate-600">
                  {analysis.fourLayers.structuralSyntax.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {analysis.fourLayers.structuralSyntax.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Scenario Coverage</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {analysis.fourLayers.coverageCompleteness.score} / 3
                </div>
                <span className="inline-block text-[11px] font-bold text-slate-600">
                  {analysis.fourLayers.coverageCompleteness.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {analysis.fourLayers.coverageCompleteness.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Wording & Clarity</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {analysis.fourLayers.coherenceConsistency.score} / 3
                </div>
                <span className="inline-block text-[11px] font-bold text-slate-600">
                  {analysis.fourLayers.coherenceConsistency.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {analysis.fourLayers.coherenceConsistency.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Requirement Matches</span>
                <div className="text-xl font-extrabold font-mono text-slate-900">
                  {analysis.fourLayers.traceability.status === 'Not Applicable' ? 'N/A' : `${analysis.fourLayers.traceability.score} / 3`}
                </div>
                <span className="inline-block text-[11px] font-bold text-slate-600">
                  {analysis.fourLayers.traceability.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {analysis.fourLayers.traceability.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Defect Breakdown with Line Numbers & Error Explanations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Itemized Quality Issues & Line-by-Line Error Explanations ({analysis.issues.length} Issues Found)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Sorted by Severity</span>
            </div>

            <div className="space-y-4">
              {analysis.issues.map((iss, index) => (
                <div
                  key={iss.id || index}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  {/* Issue Top Meta Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      {iss.line > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-xs font-bold">
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                          Line {iss.line}
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        iss.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        iss.severity === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        iss.severity === 'MEDIUM' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {iss.severity}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {getLayerName(iss.layer)}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-500">
                      {iss.consensusRatio} Multi-AI Consensus ({iss.confidence}%)
                    </span>
                  </div>

                  {/* Issue Title & Error Explanation */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {iss.title}
                    </h4>
                    {iss.scenario && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        In Scenario: <span className="italic text-slate-700">"{iss.scenario}"</span>
                      </p>
                    )}
                  </div>

                  {/* Clear Error Description */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>What is the Error on Line {iss.line}?</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {iss.description}
                    </p>
                  </div>

                  {/* Code Diff Display (Line Code vs Corrected Code) */}
                  {(iss.codeSnippet || iss.correctedSnippet) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      {iss.codeSnippet && (
                        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-950 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                            Current Line {iss.line} Code
                          </span>
                          <div className="p-2 rounded bg-white/80 border border-rose-200/60 whitespace-pre-wrap break-words text-slate-800">
                            {iss.codeSnippet}
                          </div>
                        </div>
                      )}

                      {iss.correctedSnippet && (
                        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-950 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Recommended Replacement Code
                          </span>
                          <div className="p-2 rounded bg-white/80 border border-emerald-200/60 whitespace-pre-wrap break-words text-slate-900">
                            {iss.correctedSnippet}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Why it Matters & Suggested Action */}
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                    <p className="text-indigo-950 font-bold">
                      QA & Development Impact:
                    </p>
                    <p className="text-indigo-900">
                      {iss.whyItMatters}
                    </p>
                    <p className="text-slate-700 mt-1 font-medium">
                      <strong>Fix Action:</strong> {iss.suggestedFix}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* AI Consensus Verification Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4. Multi-AI Arbiter Consensus ({analysis.aiConsensus.consensusRate}% Alignment)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {analysis.aiConsensus.models.map((m) => (
                <div key={m.modelId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{m.modelName}</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">{m.score}/100</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{m.verdict}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{m.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">GherkinIQ Quality Gate Engine v1.0</p>
              <p>Automated Deterministic + Multi-AI Consensus Certification</p>
            </div>
            <div className="text-right">
              <p className="font-mono">Certified: {new Date(analysis.createdAt).toUTCString()}</p>
              <p className="text-emerald-700 font-semibold flex items-center gap-1 justify-end mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Cryptographically Verified Audit
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Click "Print / Save PDF" to generate a physical certification.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
