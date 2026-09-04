import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Bot,
  Sparkles,
  Award,
  Layers,
  Check,
  ArrowRight,
  ThumbsUp,
  FileCheck
} from 'lucide-react';
import { AIModelReviewSummary, LayerReview, LayerType } from '../types';

interface ScoreCardProps {
  overallScore: number;
  developmentScore?: number;
  qaScore?: number;
  sprintReady?: boolean;
  sprintBlockedReason?: string;
  finalVerdict?: string;
  shortAnswer?: string;
  whatsGood?: string[];
  totalFrameworkScore?: number;
  maxFrameworkScore?: number;
  aiConsensusRate?: number;
  aiModels?: AIModelReviewSummary[];
  fourLayers?: Record<LayerType, LayerReview>;
  onGoToEditor?: () => void;
  issuesCount?: number;
  missingCount?: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  overallScore,
  sprintReady = true,
  sprintBlockedReason,
  shortAnswer,
  whatsGood = [],
  fourLayers,
  onGoToEditor,
  issuesCount = 0,
  missingCount = 0
}) => {
  const isGood = overallScore >= 85 && sprintReady;
  const isNeedsFix = overallScore >= 50 && overallScore < 85;

  const scoreColor = isGood ? 'text-emerald-600' : isNeedsFix ? 'text-amber-600' : 'text-rose-600';
  const scoreBg = isGood ? 'bg-emerald-50 border-emerald-200' : isNeedsFix ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200';

  const defaultShortAnswer = isGood
    ? "Reviewed against all four layers of the framework. Short answer: clean pass — high quality Gherkin with strong structure and comprehensive coverage."
    : `Reviewed against all four layers of the framework. Short answer: not quite — it's strong but has ${issuesCount} specific item${issuesCount === 1 ? '' : 's'} across syntax and coverage to refine before sprint readiness.`;

  const layerItems: { key: LayerType; label: string; layerNum: string; defaultSummary: string }[] = [
    { key: 'structuralSyntax', label: 'Structural / Syntax', layerNum: 'Layer 1', defaultSummary: 'Gherkin keyword linting, Outline tables, step order.' },
    { key: 'coverageCompleteness', label: 'Coverage / Completeness', layerNum: 'Layer 2', defaultSummary: 'Happy path, negative branches, edge cases.' },
    { key: 'coherenceConsistency', label: 'Coherence / Consistency', layerNum: 'Layer 3', defaultSummary: 'Given-When-Then semantic alignment, Background commonality.' },
    { key: 'traceability', label: 'Requirement Traceability', layerNum: 'Layer 4', defaultSummary: 'Self-contained AC mapping and user story coverage.' },
  ];

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* 1. Claude-Style 4-Layer Verdict Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
              4-Layer Framework Audit
            </span>
            <span className="text-xs text-slate-300">
              Deterministic AST Parser + 8-AI Ensemble
            </span>
          </div>
          {isGood ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sprint Ready</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Action Items Identified</span>
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed font-sans">
          {shortAnswer || defaultShortAnswer}
        </p>
      </div>

      {/* 2. Four Layers Scorecard Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Four-Layer Assessment Breakdown</span>
          </h4>
          <span className="text-xs font-medium text-slate-400">
            Scored 0 to 3 per layer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {layerItems.map(({ key, label, layerNum, defaultSummary }) => {
            const layerData = fourLayers ? fourLayers[key] : undefined;
            const score = layerData?.score !== undefined ? layerData.score : 2;
            const status = layerData?.status || (score === 3 ? 'Meets Bar' : 'Needs Revision');
            
            const badgeBg = score === 3 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : score === 2 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200';

            return (
              <div 
                key={key} 
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-indigo-200 transition space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {layerNum}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeBg}`}>
                      Score {score}/3
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 leading-tight">
                    {label}
                  </h5>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {layerData?.summary || defaultSummary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. What's Genuinely Good Here */}
      {whatsGood && whatsGood.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <ThumbsUp className="w-4 h-4 text-emerald-600" />
            <span>What's Genuinely Good Here</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {whatsGood.map((good, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{good}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Action Summary Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Line Issues
            </span>
            <div className="text-xl font-mono font-extrabold text-slate-900">
              {issuesCount}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Missing Scenarios
            </span>
            <div className="text-xl font-mono font-extrabold text-slate-900">
              {missingCount}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Overall Score
            </span>
            <div className={`text-xl font-mono font-extrabold ${scoreColor}`}>
              {overallScore}/100
            </div>
          </div>
        </div>

        {onGoToEditor && (
          <button
            onClick={onGoToEditor}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            <span>Open Live Editor &amp; Apply Fixes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
};
