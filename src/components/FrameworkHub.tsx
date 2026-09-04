import React, { useState } from 'react';
import {
  Layers,
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Sparkles,
  ShieldCheck,
  PlayCircle,
  FileCode,
  Zap,
  ArrowRight
} from 'lucide-react';
import { LayerReview, LayerType } from '../types';
import { SUPPORTED_FRAMEWORKS, SupportedFramework, generateStepDefinitions } from '../utils/frameworkGenerator';

interface FrameworkHubProps {
  fourLayers: {
    structuralSyntax: LayerReview;
    coverageCompleteness: LayerReview;
    coherenceConsistency: LayerReview;
    traceability: LayerReview;
  };
  gherkinText: string;
  featureTitle: string;
  fileName?: string;
  totalScore: number;
}

export const FrameworkHub: React.FC<FrameworkHubProps> = ({
  fourLayers,
  gherkinText,
  featureTitle,
  fileName = 'feature.feature',
  totalScore
}) => {
  const [selectedFramework, setSelectedFramework] = useState<SupportedFramework>('cucumber-java');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'automation' | 'quality'>('automation');

  const currentFw = SUPPORTED_FRAMEWORKS.find(f => f.id === selectedFramework) || SUPPORTED_FRAMEWORKS[0];
  const stepDefCode = generateStepDefinitions(selectedFramework, gherkinText, featureTitle);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stepDefCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(currentFw.runnerCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([stepDefCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${featureTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Steps${currentFw.extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const qualityLayers = [
    {
      key: 'structuralSyntax' as LayerType,
      title: 'Layer 1: Structural & Gherkin Syntax',
      score: fourLayers.structuralSyntax.score,
      maxScore: 3,
      status: fourLayers.structuralSyntax.status,
      summary: fourLayers.structuralSyntax.summary || 'Validates standard Gherkin syntax, Given/When/Then order, and keyword placement.',
      checks: [
        'Proper Feature header and user narrative',
        'Valid Given, When, Then step sequence',
        'Scenario Outlines with Examples table',
        'Zero placeholder or unparseable text'
      ]
    },
    {
      key: 'coverageCompleteness' as LayerType,
      title: 'Layer 2: Coverage & Completeness',
      score: fourLayers.coverageCompleteness.score,
      maxScore: 3,
      status: fourLayers.coverageCompleteness.status,
      summary: fourLayers.coverageCompleteness.summary || 'Audits edge cases, negative failure paths, timeout scenarios, and boundary limits.',
      checks: [
        'Primary happy path transaction workflow',
        'Negative error and rejection paths',
        'Network latency & gateway timeout handling',
        'Upper & lower boundary value thresholds'
      ]
    },
    {
      key: 'coherenceConsistency' as LayerType,
      title: 'Layer 3: Coherence & Terminology',
      score: fourLayers.coherenceConsistency.score,
      maxScore: 3,
      status: fourLayers.coherenceConsistency.status,
      summary: fourLayers.coherenceConsistency.summary || 'Ensures consistent actor vocabulary, unambiguous phrasing, and non-contradictory logic.',
      checks: [
        'Consistent actor terminology (e.g. Customer)',
        'Clear observable assertions in Then steps',
        'Unambiguous step descriptions',
        'Zero duplicate or contradictory steps'
      ]
    },
    {
      key: 'traceability' as LayerType,
      title: 'Layer 4: Requirement Traceability',
      score: fourLayers.traceability.score,
      maxScore: 3,
      status: fourLayers.traceability.status,
      summary: fourLayers.traceability.summary || 'Maps scenarios to business user stories, acceptance criteria, and @REQ tags.',
      checks: [
        'Acceptance criteria mapping',
        'Traceable @REQ and Jira tags',
        'Zero orphan scenarios without requirement link',
        'Full business specification coverage'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Automation & Quality Frameworks
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              BDD Frameworks Supported
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Test Automation & Quality Framework Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Generate ready-to-run step definitions for <strong>Cucumber, Playwright, Cypress, Python Behave, Karate, and SpecFlow</strong>, or review your 4-Layer quality framework score breakdown.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('automation')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'automation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Automation Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quality')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'quality'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            4-Layer Framework Score
          </button>
        </div>
      </div>

      {activeTab === 'automation' ? (
        /* Section 1: Test Automation Framework Selector & Step Generator */
        <div className="space-y-6">
          
          {/* Framework Picker Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Select Your Target Test Framework:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {SUPPORTED_FRAMEWORKS.map((fw) => {
                const isSelected = fw.id === selectedFramework;
                return (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500 ring-offset-1'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${fw.iconColor}`}></span>
                      <span className="text-xs font-bold truncate">{fw.name}</span>
                    </div>
                    <span className={`text-[10px] block truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {fw.language}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Framework Info & Runner Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{currentFw.name} ({currentFw.language})</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ✓ 100% Gherkin Compatible
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{currentFw.description}</p>
            </div>

            {/* Terminal Runner Command */}
            <div className="flex items-center gap-2 bg-slate-900 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-mono w-full sm:w-auto">
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{currentFw.runnerCommand}</span>
              <button
                onClick={handleCopyCmd}
                className="ml-auto text-slate-400 hover:text-white transition"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step Definition Code Viewer */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Auto-Generated Step Definitions ({currentFw.extension})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadCode}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold text-indigo-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-950">
              <pre className="text-xs font-mono text-slate-100 leading-relaxed overflow-x-auto whitespace-pre p-2">
                {stepDefCode}
              </pre>
            </div>
          </div>

        </div>
      ) : (
        /* Section 2: 4-Layer Quality Assessment Framework Breakdown */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">4-Layer Quality Assessment Framework</h3>
              <p className="text-xs text-slate-500">
                Industry standard 4-pillar quality benchmark evaluating Structural Syntax, Coverage, Coherence, and Requirement Traceability.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Quality Score</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900">{totalScore}/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityLayers.map((layer) => {
              const isGood = layer.score === 3;
              const isWarning = layer.score === 2;

              return (
                <div key={layer.key} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{layer.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      isGood ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      isWarning ? 'bg-amber-50 text-amber-900 border-amber-200' :
                      'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {layer.score}/3 Points ({layer.status})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {layer.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Pillar Criteria Checks:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {layer.checks.map((chk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{chk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
