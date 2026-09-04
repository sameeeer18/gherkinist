import React from 'react';
import { Layers, Code2, Target, GitBranch, CheckCircle2, ShieldCheck, AlertTriangle, BookOpen } from 'lucide-react';

export const FrameworkPage: React.FC = () => {
  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quality Standard Specification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
          The Four-Layer Gherkin Review Framework
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          GherkinIQ evaluates feature files across four structured layers. Each layer is scored from 0 to 3 points, yielding a total framework score out of 12 points.
        </p>
      </div>

      {/* 4 Layers Detail */}
      <div className="space-y-6">
        
        {/* Layer 1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Layer 01</span>
                <h3 className="text-lg font-bold text-slate-900">Structural / Syntax Layer (0–3 Points)</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700">
              Max: 3.0 pts
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Evaluates mechanical Gherkin compliance, standard keyword capitalization, step sequencing, and placeholder detection.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900">What is evaluated:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Proper Feature narrative (As a / I want / So that)</li>
                <li>Given → When → Then strict sequential flow</li>
                <li>Scenario Outline with valid Examples tables</li>
                <li>Tag taxonomy (@REQ-*, @smoke, @priority)</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-1">
              <span className="font-bold text-rose-900">Common Defects:</span>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700">
                <li>Vague placeholders ("Then something happens", "TODO")</li>
                <li>Missing Examples table for Scenario Outline</li>
                <li>Empty When actions or missing assertions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Layer 02</span>
                <h3 className="text-lg font-bold text-slate-900">Coverage / Completeness Layer (0–3 Points)</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800">
              Max: 3.0 pts
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ensures that tests provide exhaustive coverage beyond the naive happy path. Required for Sprint Ready status.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="font-bold text-slate-900">What is evaluated:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                <li>Primary happy path execution</li>
                <li>Explicit negative failure branches (e.g. Insufficient Balance)</li>
                <li>Numerical & boundary limit validation</li>
                <li>Timeout, network latency & retry idempotency</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-1">
              <span className="font-bold text-rose-900">Sprint Gate Blocker Rule:</span>
              <p className="text-rose-800 leading-relaxed">
                If Coverage score is &lt; 2.0 / 3.0, the feature is automatically marked <strong>SPRINT BLOCKED</strong> to prevent unhandled production defects.
              </p>
            </div>
          </div>
        </div>

        {/* Layer 3 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Layer 03</span>
                <h3 className="text-lg font-bold text-slate-900">Coherence / Consistency Layer (0–3 Points)</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-700">
              Max: 3.0 pts
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Verifies domain terminology alignment, non-contradictory precondition states, and descriptive scenario titles.
          </p>
        </div>

        {/* Layer 4 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Layer 04</span>
                <h3 className="text-lg font-bold text-slate-900">Traceability Layer (0–3 Points or N/A)</h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700">
              Max: 3.0 pts
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Maps every Acceptance Criterion (AC-01, AC-02, AC-03) to verifying Gherkin scenarios and flags orphan tests.
          </p>
        </div>

      </div>

    </div>
  );
};
