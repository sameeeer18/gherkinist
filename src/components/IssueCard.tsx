import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  Check,
  Copy,
  Wrench,
  Bot
} from 'lucide-react';
import { Issue, IssueSeverity, LayerType } from '../types';

interface IssueCardProps {
  issue: Issue;
  onJumpToLine?: (line: number) => void;
  onApplyFix?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onJumpToLine
}) => {
  const [isWhyMattersOpen, setIsWhyMattersOpen] = useState(false);
  const [isAiFindingsOpen, setIsAiFindingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyFix = () => {
    if (issue.correctedSnippet || issue.suggestedFix) {
      navigator.clipboard.writeText(issue.correctedSnippet || issue.suggestedFix);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          label: 'Must Fix'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          label: 'Important'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'Suggestion'
        };
      case 'LOW':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Minor Note'
        };
    }
  };

  const getSimpleCategory = (layer: LayerType) => {
    switch (layer) {
      case 'structuralSyntax':
        return 'Syntax & Keyword';
      case 'coverageCompleteness':
        return 'Missing Step / Test';
      case 'coherenceConsistency':
        return 'Unclear Wording';
      case 'traceability':
        return 'Requirement Check';
    }
  };

  const badge = getSeverityBadge(issue.severity);

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition p-5 space-y-4">
      
      {/* Header Badges & Line Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {issue.line > 0 ? (
            <button
              onClick={() => onJumpToLine && onJumpToLine(issue.line)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300/80 text-rose-900 font-mono text-xs font-black transition group shadow-2xs cursor-pointer"
              title="Click to jump to line in editor"
            >
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <Code2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Line {issue.line}</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 text-rose-700" />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold">
              Feature-Level Check
            </span>
          )}

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${badge.bg}`}>
            {badge.label}
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
            {getSimpleCategory(issue.layer)}
          </span>
        </div>

        {/* Multi-AI badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          <Bot className="w-3.5 h-3.5 text-[#09B1EC]" />
          <span>AI Quality Verified</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h4 className="text-base font-extrabold text-slate-950 leading-snug flex items-center gap-2">
          {issue.title}
        </h4>
      </div>

      {/* Structured Detailed Explanation Box (Issue Description + Impact + Recommended Solution) */}
      <div className="space-y-2.5">
        
        {/* 1. Issue Description */}
        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-950 font-black text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Issue Explanation (Line {issue.line || 1}):</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-950 leading-relaxed font-medium">
            {issue.description}
          </p>
        </div>

        {/* 2. Why it breaks testing / Impact */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-950 font-black text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Why This Matters (Quality Impact):</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
            {issue.whyItMatters || 'When automated test runners (Cucumber/SpecFlow/Playwright) execute this step, ambiguous or non-standard syntax causes automation failure or unverified QA bugs.'}
          </p>
        </div>

        {/* 3. How to fix / Solution */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-950 font-black text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Recommended Solution:</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            {issue.suggestedFix}
          </p>
        </div>

      </div>

      {/* Code Comparison (Current Problem vs Recommended Fix) */}
      {(issue.codeSnippet || issue.correctedSnippet) && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Original Line vs Corrected Line:</span>
            {issue.correctedSnippet && (
              <button
                onClick={handleCopyFix}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Correct Line'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs font-mono">
            {/* Current Line Snippet */}
            {issue.codeSnippet && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                <div className="flex items-center justify-between text-[11px] font-black text-rose-900 mb-1 font-sans">
                  <span>❌ Your current line in original file:</span>
                  <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md">Line {issue.line || 1}</span>
                </div>
                <div className="whitespace-pre-wrap break-words text-slate-900 bg-white p-2.5 rounded-lg border border-rose-200/70 font-mono text-xs font-bold">
                  {issue.codeSnippet}
                </div>
              </div>
            )}

            {/* Corrected Snippet */}
            {issue.correctedSnippet && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center justify-between text-[11px] font-black text-emerald-900 mb-1 font-sans">
                  <span>✅ Corrected replacement line:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md font-sans">BDD Standard</span>
                </div>
                <div className="whitespace-pre-wrap break-words text-slate-900 bg-white p-2.5 rounded-lg border border-emerald-200 font-mono text-xs font-bold">
                  {issue.correctedSnippet}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Findings & Explanations Dropdown */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsWhyMattersOpen(!isWhyMattersOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Why does this matter?</span>
            {isWhyMattersOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {issue.modelFindings && (
            <button
              type="button"
              onClick={() => setIsAiFindingsOpen(!isAiFindingsOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Engine Layer Findings</span>
              {isAiFindingsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {isWhyMattersOpen && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
            <p className="font-medium text-slate-800">
              {issue.whyItMatters || 'When automated test runners read this feature file, bad keywords or vague words cause the test script to fail or be ambiguous.'}
            </p>
          </div>
        )}

        {isAiFindingsOpen && issue.modelFindings && (
          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block">
              AI Engine 4-Layer Assessment Notes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              {issue.modelFindings.gemini && (
                <div className="bg-white p-2 rounded-lg border border-blue-200">
                  <strong className="text-blue-700 block text-[11px]">Layer 1 (Structural Syntax &amp; Formatting):</strong>
                  {issue.modelFindings.gemini}
                </div>
              )}
              {issue.modelFindings.chatgpt && (
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <strong className="text-emerald-700 block text-[11px]">Layer 2 (Coverage &amp; Edge Cases):</strong>
                  {issue.modelFindings.chatgpt}
                </div>
              )}
              {issue.modelFindings.claude && (
                <div className="bg-white p-2 rounded-lg border border-amber-200">
                  <strong className="text-amber-800 block text-[11px]">Layer 3 (Coherence &amp; Domain Logic):</strong>
                  {issue.modelFindings.claude}
                </div>
              )}
              {issue.modelFindings.blackbox && (
                <div className="bg-white p-2 rounded-lg border border-purple-200">
                  <strong className="text-purple-800 block text-[11px]">Layer 4 (Traceability &amp; Automation):</strong>
                  {issue.modelFindings.blackbox}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
