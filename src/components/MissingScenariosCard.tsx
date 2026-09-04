import React, { useState } from 'react';
import { PlusCircle, Copy, Check, ChevronDown, ChevronUp, Sparkles, Lightbulb } from 'lucide-react';
import { MissingScenario } from '../types';

interface MissingScenariosCardProps {
  missingScenarios: MissingScenario[];
  onInsertScenario?: (gherkinSnippet: string) => void;
}

export const MissingScenariosCard: React.FC<MissingScenariosCardProps> = ({
  missingScenarios,
  onInsertScenario
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(missingScenarios[0]?.id || null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!missingScenarios || missingScenarios.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h4 className="text-base font-bold text-slate-900">Great Job! All Test Scenarios Covered</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          You have written both normal success paths and important error checks.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Friendly Explainer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-amber-950">
            Why do missing test scenarios matter?
          </h4>
          <p className="text-xs text-amber-900 leading-relaxed">
            Good tests don't just test when everything works. They must also test what happens when things go wrong (like wrong passwords, negative numbers, or server errors). Below are {missingScenarios.length} test cases we noticed you haven't written yet.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <h3 className="text-sm font-bold text-slate-900">
          Suggested Scenarios to Add ({missingScenarios.length})
        </h3>
        <span className="text-xs text-slate-500">
          Click "Add to My Feature" to add instantly
        </span>
      </div>

      <div className="space-y-3">
        {missingScenarios.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden transition hover:border-slate-300"
            >
              {/* Collapsed Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wide">
                    {item.category || 'Missing Test'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-600 font-semibold hidden sm:inline">
                    {isExpanded ? 'Hide Code' : 'View Code'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Code Body */}
              {isExpanded && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-sans text-slate-400 text-xs">
                      Ready-to-use Gherkin scenario:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.id, item.suggestedGherkin)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                      </button>

                      {onInsertScenario && (
                        <button
                          onClick={() => onInsertScenario(item.suggestedGherkin)}
                          className="flex items-center gap-1 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add to My Feature</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <pre className="font-mono text-xs text-emerald-300 p-3.5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                    {item.suggestedGherkin}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
