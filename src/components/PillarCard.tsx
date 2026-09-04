import React from 'react';
import { Code2, Target, Layers, GitBranch, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { LayerReview, LayerType } from '../types';

interface PillarCardProps {
  fourLayers: {
    structuralSyntax: LayerReview;
    coverageCompleteness: LayerReview;
    coherenceConsistency: LayerReview;
    traceability: LayerReview;
  };
  activeFilter?: LayerType | 'all';
  onSelectLayer: (layer: LayerType | 'all') => void;
}

export const PillarCard: React.FC<PillarCardProps> = ({
  fourLayers,
  activeFilter,
  onSelectLayer
}) => {
  const cards = [
    {
      key: 'structuralSyntax' as LayerType,
      title: 'Structural / Syntax',
      layerNumber: 'Layer 01',
      icon: Code2,
      review: fourLayers.structuralSyntax,
      checklist: ['Feature narrative', 'Given/When/Then logic', 'Scenario Outline & Examples', 'Zero vague placeholders']
    },
    {
      key: 'coverageCompleteness' as LayerType,
      title: 'Coverage / Completeness',
      layerNumber: 'Layer 02',
      icon: Target,
      review: fourLayers.coverageCompleteness,
      checklist: ['Primary happy path', 'Negative failure paths', 'Boundary/Limit validation', 'Timeout/Error states']
    },
    {
      key: 'coherenceConsistency' as LayerType,
      title: 'Coherence / Consistency',
      layerNumber: 'Layer 03',
      icon: Layers,
      review: fourLayers.coherenceConsistency,
      checklist: ['Domain terminology alignment', 'Non-contradictory rules', 'Descriptive scenario titles', 'No duplicate tests']
    },
    {
      key: 'traceability' as LayerType,
      title: 'Traceability',
      layerNumber: 'Layer 04',
      icon: GitBranch,
      review: fourLayers.traceability,
      checklist: ['Source requirement linking', 'Acceptance criteria coverage', 'Zero orphan scenarios', 'Traceable @REQ tags']
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Four-Layer Review Scoreboard</h3>
          <p className="text-xs text-slate-500">
            Click any layer to inspect detailed checks, rule compliance, and specific issue items
          </p>
        </div>
        {activeFilter && activeFilter !== 'all' && (
          <button
            onClick={() => onSelectLayer('all')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg transition"
          >
            Show All Layers
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((item) => {
          const Icon = item.icon;
          const isSelected = activeFilter === item.key;
          const score = item.review.score;
          const max = item.review.maxScore || 3;
          
          let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          let iconColor = 'text-emerald-600 bg-emerald-50';
          let statusText = '✓ Meets Bar';

          if (item.review.status === 'Not Applicable') {
            badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
            iconColor = 'text-slate-500 bg-slate-100';
            statusText = 'Partially Assessed';
          } else if (score <= 1) {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
            iconColor = 'text-rose-600 bg-rose-50';
            statusText = '✗ Major Gaps';
          } else if (score === 2) {
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
            iconColor = 'text-amber-600 bg-amber-50';
            statusText = '⚠ Needs Revision';
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectLayer(isSelected ? 'all' : item.key)}
              className={`text-left p-5 rounded-2xl bg-white border transition-all relative flex flex-col justify-between h-full group ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200/80 hover:border-indigo-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-3 w-full">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {item.layerNumber}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${iconColor} flex items-center justify-center font-bold`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Title & Score */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {item.review.status === 'Not Applicable' ? 'N/A' : `${score} / ${max}`}
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                    {statusText}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.review.summary}
                </p>

              </div>

              {/* Mini Checklist */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                {item.checklist.slice(0, 2).map((chk, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="truncate">{chk}</span>
                  </div>
                ))}
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
};
