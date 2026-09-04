import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, FileCode, AlertCircle, AlertTriangle, Edit3, Eye, RefreshCw, Undo2 } from 'lucide-react';
import { Issue } from '../types';

interface GherkinEditorProps {
  content: string;
  issues?: Issue[];
  selectedLine?: number;
  onSelectLine?: (line: number) => void;
  title?: string;
  fileName?: string;
  onSaveAndReanalyze?: (updatedContent: string) => void;
  isReanalyzing?: boolean;
}

export const GherkinEditor: React.FC<GherkinEditorProps> = ({
  content,
  issues = [],
  selectedLine,
  onSelectLine,
  title = 'Gherkin Feature Code',
  fileName = 'feature.feature',
  onSaveAndReanalyze,
  isReanalyzing = false
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(content);

  useEffect(() => {
    setEditableText(content);
  }, [content]);

  const lines = (isEditing ? editableText : content).split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editableText : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = isEditing ? editableText : content;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.feature') ? fileName : `${fileName}.feature`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRecheck = () => {
    if (onSaveAndReanalyze) {
      onSaveAndReanalyze(editableText);
    }
  };

  const handleReset = () => {
    setEditableText(content);
  };

  const isDirty = editableText !== content;

  const formatLineSyntax = (text: string) => {
    const trimmed = text.trim();

    if (trimmed.startsWith('#')) {
      return <span className="text-slate-400 italic">{text}</span>;
    }
    if (trimmed.startsWith('@')) {
      return <span className="text-indigo-400 font-semibold">{text}</span>;
    }
    if (trimmed.startsWith('Feature:')) {
      return (
        <span>
          <span className="text-purple-400 font-bold">Feature:</span>
          <span className="text-white font-semibold">{text.replace('Feature:', '')}</span>
        </span>
      );
    }
    if (trimmed.startsWith('Background:')) {
      return <span className="text-purple-400 font-bold">{text}</span>;
    }
    if (trimmed.startsWith('Scenario:') || trimmed.startsWith('Scenario Outline:')) {
      const isOutline = trimmed.startsWith('Scenario Outline:');
      const keyword = isOutline ? 'Scenario Outline:' : 'Scenario:';
      const rest = text.slice(text.indexOf(keyword) + keyword.length);
      return (
        <span>
          <span className="text-amber-400 font-bold">{keyword}</span>
          <span className="text-slate-100 font-medium">{rest}</span>
        </span>
      );
    }
    if (trimmed.startsWith('Examples:')) {
      return <span className="text-amber-400 font-bold">{text}</span>;
    }

    const match = text.match(/^(\s*)(Given|When|Then|And|But)\b(.*)$/);
    if (match) {
      const [, spaces, keyword, rest] = match;
      let kwColor = 'text-emerald-400';
      if (keyword === 'When') kwColor = 'text-sky-400';
      if (keyword === 'Then') kwColor = 'text-indigo-300 font-bold';
      if (keyword === 'And' || keyword === 'But') kwColor = 'text-emerald-300';

      return (
        <span>
          <span>{spaces}</span>
          <span className={`${kwColor} font-bold`}>{keyword}</span>
          <span className="text-slate-200">{highlightParams(rest)}</span>
        </span>
      );
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      return <span className="text-indigo-200 font-mono">{text}</span>;
    }

    return <span className="text-slate-300">{text}</span>;
  };

  const highlightParams = (text: string) => {
    const parts = text.split(/(".*?"|<.*?>)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return <span key={idx} className="text-amber-300 font-mono">{part}</span>;
      }
      if (part.startsWith('<') && part.endsWith('>')) {
        return <span key={idx} className="text-pink-400 font-mono font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 overflow-hidden shadow-lg flex flex-col font-mono text-xs">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          <span className="ml-2 text-xs font-sans font-bold text-slate-200">{title}</span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">({fileName})</span>
        </div>

        {/* Mode Toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle between Edit Mode and Visual Review Mode */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-sans">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                !isEditing ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Review Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                isEditing ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Live Edit</span>
            </button>
          </div>

          {/* Re-Check Button (Shows prominently when in edit mode or when edited) */}
          {onSaveAndReanalyze && (
            <button
              type="button"
              onClick={handleRecheck}
              disabled={isReanalyzing}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-bold transition shadow-xs ${
                isDirty || isEditing
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
              <span>{isReanalyzing ? 'Re-Checking...' : 'Re-Check Gherkin'}</span>
            </button>
          )}

          {isEditing && isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              title="Reset changes to original"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans font-medium transition"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans font-medium transition"
            title="Download .feature file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save .feature</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isEditing ? (
        <div className="p-4 bg-slate-950 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
            <span>✏️ Live Edit Mode: Type directly to fix lines or add missing scenarios, then click <strong>"Re-Check Gherkin"</strong></span>
            <span>{lines.length} Lines</span>
          </div>

          <div className="relative flex rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
            {/* Line Numbers Column */}
            <div className="py-3 px-2 bg-slate-950/80 border-r border-slate-800/80 select-none text-right text-slate-600 font-mono text-xs leading-relaxed space-y-0.5 min-w-[2.5rem]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area */}
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              rows={Math.max(16, lines.length + 2)}
              className="w-full p-3 bg-transparent font-mono text-xs text-slate-100 focus:outline-hidden leading-relaxed resize-y whitespace-pre"
              placeholder="Paste or write your Gherkin feature..."
              spellCheck={false}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-sans">
              {isDirty ? '⚠️ You have unsaved changes in your Gherkin' : '✓ Up to date with latest check'}
            </span>

            {onSaveAndReanalyze && (
              <button
                type="button"
                onClick={handleRecheck}
                disabled={isReanalyzing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold transition shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin' : ''}`} />
                <span>{isReanalyzing ? 'Re-Checking Feature...' : 'Save & Re-Check Gherkin'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 overflow-x-auto overflow-y-auto max-h-[540px] leading-relaxed space-y-0.5 select-text">
          {lines.map((lineText, idx) => {
            const lineNum = idx + 1;
            const isSelected = selectedLine === lineNum;
            const lineIssue = issues.find(i => i.line === lineNum);

            let rowBg = '';
            if (isSelected) rowBg = 'bg-indigo-950/70 border-l-2 border-indigo-500';
            else if (lineIssue?.severity === 'CRITICAL') rowBg = 'bg-rose-950/40 border-l-2 border-rose-500';
            else if (lineIssue?.severity === 'HIGH') rowBg = 'bg-amber-950/30 border-l-2 border-amber-500';
            else if (lineIssue) rowBg = 'bg-blue-950/20 border-l-2 border-blue-500';

            return (
              <div
                key={idx}
                onClick={() => onSelectLine && onSelectLine(lineNum)}
                className={`flex items-start gap-3 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-900/80 transition ${rowBg}`}
              >
                {/* Line Number */}
                <span className="w-8 flex-shrink-0 text-right text-slate-600 select-none text-[11px]">
                  {lineNum}
                </span>

                {/* Issue indicator */}
                <span className="w-4 flex-shrink-0 select-none">
                  {lineIssue ? (
                    lineIssue.severity === 'CRITICAL' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )
                  ) : null}
                </span>

                {/* Syntax line */}
                <div className="flex-1 whitespace-pre">
                  {formatLineSyntax(lineText)}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
