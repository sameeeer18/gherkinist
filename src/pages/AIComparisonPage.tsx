import React from 'react';
import { Scale, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Layers } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AIComparisonPageProps {
  analyses: AnalysisResult[];
}

export const AIComparisonPage: React.FC<AIComparisonPageProps> = ({ analyses }) => {
  const current = analyses[0];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Scale className="w-3.5 h-3.5" />
          <span>AI Engine + Validation Framework Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          AI Engine Quality Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Gherkinist evaluates feature files with independent validation layers and strict prompt isolating rules to ensure zero false positives and high test coverage.
        </p>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              L1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Syntax &amp; Step Flow Engine</h3>
              <p className="text-[11px] text-slate-500">Structural Gherkin Standard</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluates mechanical Cucumber keyword structure, Scenario Outline Examples table formatting, and step definition regex compatibility.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-1 font-mono">
            <div>• Gherkin standard compliance</div>
            <div>• Placeholder detection</div>
            <div>• Step keyword syntax</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              L2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Logic &amp; Risk Engine</h3>
              <p className="text-[11px] text-slate-500">Coverage &amp; Negative Paths</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Performs rigorous negative boundary testing, failure path auditing, regulatory compliance, and state transition validation.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-1 font-mono">
            <div>• Missing negative branches</div>
            <div>• FinTech limit boundaries</div>
            <div>• Precondition inconsistencies</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              L3
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Traceability &amp; Coherence Engine</h3>
              <p className="text-[11px] text-slate-500">User Story &amp; AC Alignment</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Processes full User Story context to map Acceptance Criteria AC-01/02, detect orphan scenarios, and ensure domain vocabulary alignment.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-1 font-mono">
            <div>• Layer 4 AC-01/02 mapping</div>
            <div>• Orphan scenario detection</div>
            <div>• Terminology standardization</div>
          </div>
        </div>

      </div>

      {/* Consensus Math Explanation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
        <h3 className="text-base font-bold font-sans flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          The Consensus Math
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="font-bold text-emerald-400">3/3 Unanimous (100% Confidence)</span>
            <p>All 3 models identified the exact same defect. Automatically classified as a required fix.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="font-bold text-indigo-300">2/3 Majority (67% Confidence)</span>
            <p>2 models agreed. Evaluated by the deterministic rule engine to confirm validity.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="font-bold text-amber-400">1/3 Low Agreement (33% Confidence)</span>
            <p>Single model flagged an item. Presented as an optional style recommendation.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
