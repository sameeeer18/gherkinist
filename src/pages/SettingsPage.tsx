import React, { useState } from 'react';
import { Settings, ShieldCheck, Scale, Check, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [minPassScore, setMinPassScore] = useState('85');
  const [consensusThreshold, setConsensusThreshold] = useState('90');
  const [strictCoverageGate, setStrictCoverageGate] = useState(true);
  const [fintechRulesEnabled, setFintechRulesEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          Quality Gate Thresholds & Rule Engine Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize sprint readiness criteria, model arbiter parameters, and enterprise FinTech validation rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Readiness Gates */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Sprint Gate Thresholds</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Readiness Score to Pass Gate (0–100)
              </label>
              <input
                type="number"
                value={minPassScore}
                onChange={(e) => setMinPassScore(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default: 85</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tri-Model AI Consensus Confidence Threshold (%)
              </label>
              <input
                type="number"
                value={consensusThreshold}
                onChange={(e) => setConsensusThreshold(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default: 90%</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={strictCoverageGate}
                onChange={(e) => setStrictCoverageGate(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Strict Sprint Gate: Require ≥ 2/3 on Coverage & Coherence
                </span>
                <span className="text-[11px] text-slate-500">
                  Block sprints when negative paths or contradictory rules are detected even if overall score is high.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={fintechRulesEnabled}
                onChange={(e) => setFintechRulesEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  FinTech & Banking Domain Pack
                </span>
                <span className="text-[11px] text-slate-500">
                  Enforces idempotency keys, UPI mandate limits, KYC retry timeouts, and ledger reconciliation checks.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Configuration saved successfully
            </span>
          ) : <span></span>}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
