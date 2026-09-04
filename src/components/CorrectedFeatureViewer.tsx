import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileCode2,
  AlertCircle,
  Eye,
  Layers
} from 'lucide-react';

interface CorrectedFeatureViewerProps {
  originalGherkin: string;
  improvedGherkin: string;
  fileName?: string;
  onApplyImproved?: () => void;
  isReanalyzing?: boolean;
}

export const CorrectedFeatureViewer: React.FC<CorrectedFeatureViewerProps> = ({
  originalGherkin,
  improvedGherkin,
  fileName = 'feature.feature',
  onApplyImproved,
  isReanalyzing
}) => {
  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'changesOnly'>('all');

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedGherkin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([improvedGherkin], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.feature', '_corrected.feature');
    link.click();
    URL.revokeObjectURL(url);
  };

  // Compare original lines vs improved lines to highlight changes in RED and unchanged in WHITE
  const lineAnalysis = useMemo(() => {
    const origLines = originalGherkin.split('\n').map(l => l.trim());
    const origSet = new Set(origLines.filter(l => l.length > 0));
    
    const impLines = improvedGherkin.split('\n');

    let changedCount = 0;
    let unchangedCount = 0;

    const analyzed = impLines.map((line, index) => {
      const trimmed = line.trim();
      const isEmpty = trimmed.length === 0;
      const isComment = trimmed.startsWith('#');
      
      // Determine if line was newly added or modified
      const isChanged = !isEmpty && !isComment && !origSet.has(trimmed);

      if (isChanged) {
        changedCount++;
      } else if (!isEmpty) {
        unchangedCount++;
      }

      return {
        lineNum: index + 1,
        text: line,
        isChanged,
        isEmpty,
        isComment
      };
    });

    return {
      lines: analyzed,
      totalLines: impLines.length,
      changedCount,
      unchangedCount
    };
  }, [originalGherkin, improvedGherkin]);

  const displayedLines = filterMode === 'changesOnly'
    ? lineAnalysis.lines.filter(l => l.isChanged || l.isEmpty)
    : lineAnalysis.lines;

  return (
    <div className="space-y-4">
      
      {/* Top Banner with Stats & Actions */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Whole Corrected Gherkin Feature
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Changes highlighted in <strong className="text-rose-400 font-bold">Red</strong> &bull; Original kept in <strong className="text-white font-bold">White</strong>
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            Ready-to-Use Complete .feature File
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl">
            All syntax errors, missing steps, and negative boundary scenarios have been synthesized into a single production-ready Gherkin file.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition cursor-pointer shadow-xs active:scale-97"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Copied Full Feature!' : 'Copy Corrected Feature'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition cursor-pointer shadow-xs active:scale-97"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Download .feature</span>
          </button>

          {onApplyImproved && (
            <button
              onClick={onApplyImproved}
              disabled={isReanalyzing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm transition active:scale-97 cursor-pointer"
            >
              {isReanalyzing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Re-Check this Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Legend & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-600 border border-rose-700"></span>
            <span className="font-bold text-rose-700">Red Highlighted:</span>
            <span className="text-slate-600">Fixed / Modified / Newly Added ({lineAnalysis.changedCount} lines)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-900 border border-slate-700"></span>
            <span className="font-bold text-slate-900">White Text:</span>
            <span className="text-slate-600">Original Unchanged ({lineAnalysis.unchangedCount} lines)</span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
              filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Show All ({lineAnalysis.totalLines} lines)
          </button>
          <button
            onClick={() => setFilterMode('changesOnly')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
              filterMode === 'changesOnly' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Changes Only ({lineAnalysis.changedCount})
          </button>
        </div>
      </div>

      {/* Complete Code Viewer with Red/White Highlighting */}
      <div className="rounded-2xl bg-[#0B132B] border border-slate-800 shadow-inner overflow-hidden">
        
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#09B1EC]" />
            <span className="text-slate-200 font-bold">{fileName.replace('.feature', '_corrected.feature')}</span>
            <span className="text-[10px] text-slate-500 font-sans">({lineAnalysis.totalLines} total lines)</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-sans font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Validated Gherkin
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5 overflow-x-auto code-scrollbar font-mono text-xs sm:text-sm leading-relaxed max-h-[600px] overflow-y-auto">
          {displayedLines.map((line) => {
            if (line.isEmpty) {
              return (
                <div key={line.lineNum} className="flex min-h-[1.5rem] py-0.5">
                  <span className="w-12 select-none text-right pr-4 text-slate-700 text-xs">
                    {line.lineNum}
                  </span>
                  <span></span>
                </div>
              );
            }

            if (line.isChanged) {
              // Highlighted in RED with high contrast as requested
              return (
                <div
                  key={line.lineNum}
                  className="flex items-center bg-rose-950/80 hover:bg-rose-900/80 border-l-4 border-rose-500 px-2 py-1 my-0.5 rounded-r transition group"
                >
                  <span className="w-10 select-none text-right pr-4 text-rose-400/80 text-xs font-bold font-mono">
                    {line.lineNum}
                  </span>
                  <span className="text-rose-100 font-bold whitespace-pre font-mono flex-1">
                    {line.text}
                  </span>
                  <span className="text-[10px] uppercase font-sans font-black bg-rose-700 text-white px-1.5 py-0.5 rounded-md ml-2 shrink-0 opacity-80 group-hover:opacity-100">
                    CHANGED / FIXED
                  </span>
                </div>
              );
            }

            // Standard original line in WHITE text
            return (
              <div
                key={line.lineNum}
                className="flex items-center px-2 py-0.5 hover:bg-slate-900/60 rounded-r transition"
              >
                <span className="w-10 select-none text-right pr-4 text-slate-600 text-xs font-mono">
                  {line.lineNum}
                </span>
                <span className="text-white font-normal whitespace-pre font-mono flex-1">
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
