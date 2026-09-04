import React, { useState } from 'react';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ListFilter,
  Layers,
  CheckCircle2,
  Trash2,
  Edit3,
  Lightbulb,
  Bot,
  FileCheck2,
  FileText
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { ScoreCard } from '../components/ScoreCard';
import { IssueCard } from '../components/IssueCard';
import { GherkinEditor } from '../components/GherkinEditor';
import { DiffViewer } from '../components/DiffViewer';
import { MissingScenariosCard } from '../components/MissingScenariosCard';
import { CorrectedFeatureViewer } from '../components/CorrectedFeatureViewer';
import { RequirementMapping } from '../components/RequirementMapping';

interface AnalysisResultPageProps {
  analysis: AnalysisResult;
  onBack: () => void;
  onReanalyze: (gherkinContent?: string, requirementContent?: string) => Promise<void>;
  onDelete: (id: string) => void;
  isReanalyzing?: boolean;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysis,
  onBack,
  onReanalyze,
  onDelete,
  isReanalyzing = false
}) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'traceability' | 'wholeFeature' | 'missing' | 'aiReviews' | 'code' | 'diff'>('issues');
  const [selectedLine, setSelectedLine] = useState<number | undefined>(undefined);

  const handleJumpToLine = (line: number) => {
    setSelectedLine(line);
    setActiveTab('code');
  };

  const handleInsertMissingScenario = (snippet: string) => {
    const updatedGherkin = `${analysis.originalGherkin}\n\n${snippet}`;
    onReanalyze(updatedGherkin, analysis.requirementText);
  };

  const handleAddScenarioForAC = (acId: string) => {
    const ac = analysis.traceabilityData?.acceptanceCriteria.find(a => a.acId === acId);
    const desc = ac?.description || 'Verify requirement criteria';
    const cleanTitle = desc.replace(/[^a-zA-Z0-9 ]/g, ' ').substring(0, 50).trim();
    const newSnippet = `  @requirement @${analysis.traceabilityData?.requirementId || 'REQ'}-${acId}
  Scenario: ${cleanTitle}
    Given the user initiates the transaction with valid parameters
    When the requirement criteria for "${acId}" are evaluated
    Then the system should verify "${desc.replace(/"/g, "'")}" successfully
    And the transaction record should be updated in the ledger`;

    const updatedGherkin = `${analysis.originalGherkin}\n\n${newSnippet}`;
    onReanalyze(updatedGherkin, analysis.requirementText);
  };

  const handleApplyImproved = () => {
    onReanalyze(analysis.improvedGherkin, analysis.requirementText);
  };

  const handleSaveEditorAndRecheck = (updatedGherkin: string) => {
    onReanalyze(updatedGherkin, analysis.requirementText);
  };

  const issuesCount = analysis.issues.length;
  const missingCount = analysis.missingScenarios?.length || 0;
  const aiModels = analysis.aiConsensus?.models || [];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Bar with Simple Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Check Another File</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onReanalyze()}
            disabled={isReanalyzing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isReanalyzing ? 'Re-Checking with 4 AIs...' : 'Re-Check File with All 4 AIs'}</span>
          </button>

          <button
            onClick={() => onDelete(analysis.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete this result"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Quality Engine & Framework Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>AI Quality Engine &bull; 4-Layer Assessment Framework</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            How to fix your Gherkin file:
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            <strong>1.</strong> Review the mistakes and AI findings in the list below. &nbsp;•&nbsp; 
            <strong>2.</strong> Click <strong>"Edit & Fix File"</strong> to type your corrections. &nbsp;•&nbsp; 
            <strong>3.</strong> Click <strong>"Re-Check Gherkin"</strong> to see your new points and score!
          </p>
        </div>

        <button
          onClick={() => setActiveTab('code')}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-indigo-600" />
          <span>Open Live Editor</span>
        </button>
      </div>

      {/* Feature File Title & Banking Domain Pillar Badge */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              File Checked:
            </span>
            {analysis.detectedBankingPillar && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#09B1EC]/10 text-[#078bb9] border border-[#09B1EC]/30">
                {analysis.detectedBankingPillar}
              </span>
            )}
            {analysis.detectedBankingModule && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-900 text-white">
                {analysis.detectedBankingModule}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {analysis.featureTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {analysis.fileName}
            </span>
            {analysis.fintechTagsDetected && analysis.fintechTagsDetected.length > 0 && (
              <div className="flex flex-wrap items-center gap-1">
                {analysis.fintechTagsDetected.slice(0, 4).map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
            Structural Syntax
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            Coverage &amp; Edge Cases
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
            Coherence &amp; Domain
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            Traceability &amp; BDD
          </span>
        </div>
      </div>

      {/* 1. Score Card */}
      <ScoreCard
        overallScore={analysis.overallScore}
        developmentScore={analysis.developmentScore}
        qaScore={analysis.qaScore}
        sprintReady={analysis.sprintReady}
        sprintBlockedReason={analysis.sprintBlockedReason}
        finalVerdict={analysis.finalVerdict}
        shortAnswer={analysis.shortAnswer}
        whatsGood={analysis.whatsGood}
        fourLayers={analysis.fourLayers}
        aiConsensusRate={analysis.aiConsensus.consensusRate}
        aiModels={aiModels}
        totalFrameworkScore={analysis.totalFrameworkScore}
        maxFrameworkScore={analysis.maxFrameworkScore}
        issuesCount={issuesCount}
        missingCount={missingCount}
        onGoToEditor={() => setActiveTab('code')}
      />

      {/* 2. Main Easy Tabs */}
      <div className="space-y-4">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          
          <button
            onClick={() => setActiveTab('issues')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'issues'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Mistakes to Fix</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              activeTab === 'issues' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-800'
            }`}>
              {issuesCount}
            </span>
          </button>

          {/* Layer 4: Requirement Coverage Tab */}
          <button
            onClick={() => setActiveTab('traceability')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'traceability'
                ? 'bg-indigo-900 text-white shadow-xs'
                : Boolean(analysis.requirementText || analysis.traceabilityData)
                ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Requirement Coverage (Layer 4)</span>
            {analysis.traceabilityData?.acceptanceCriteria && analysis.traceabilityData.acceptanceCriteria.length > 0 ? (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                analysis.traceabilityData.acceptanceCriteria.filter(a => a.status === 'COVERED').length === analysis.traceabilityData.acceptanceCriteria.length
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}>
                {analysis.traceabilityData.acceptanceCriteria.filter(a => a.status === 'COVERED').length}/{analysis.traceabilityData.acceptanceCriteria.length} ACs
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                Layer 4
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('wholeFeature')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'wholeFeature'
                ? 'bg-rose-950 text-rose-100 border border-rose-700 shadow-xs'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/70'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-rose-400" />
            <span>Whole Corrected Gherkin</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
              Red Highlighted
            </span>
          </button>

          <button
            onClick={() => setActiveTab('aiReviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'aiReviews'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Quality Engine</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900">
              4 Layers
            </span>
          </button>

          <button
            onClick={() => setActiveTab('missing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'missing'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Missing Test Cases</span>
            {missingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                {missingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit & Re-Check Gherkin</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'diff'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Auto-Fixed Comparison</span>
          </button>

        </div>

        {/* Tab 1: Issues & Action Items */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                {issuesCount === 0
                  ? 'No mistakes found! Your feature file has valid Gherkin syntax.'
                  : `Showing ${issuesCount} line-specific mistakes verified by the AI Engine & Quality Framework:`}
              </p>
            </div>

            {issuesCount === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Zero Mistakes Found!</h4>
                <p className="text-xs text-slate-500">All your Given / When / Then lines look correct.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {analysis.issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onJumpToLine={handleJumpToLine}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Layer 4 Requirement Coverage & Traceability */}
        {activeTab === 'traceability' && (
          <div className="space-y-4">
            <RequirementMapping
              traceability={analysis.traceabilityData}
              onAddScenario={handleAddScenarioForAC}
            />
          </div>
        )}

        {/* Tab: Whole Corrected Gherkin Feature */}
        {activeTab === 'wholeFeature' && (
          <CorrectedFeatureViewer
            originalGherkin={analysis.originalGherkin}
            improvedGherkin={analysis.improvedGherkin}
            fileName={analysis.fileName}
            onApplyImproved={handleApplyImproved}
            isReanalyzing={isReanalyzing}
          />
        )}

        {/* Tab 2: 4 AI Reviews Details */}
        {activeTab === 'aiReviews' && (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Detailed Findings from the AI Quality Engine &amp; 4-Layer Framework
                </h3>
                <p className="text-xs text-slate-500">
                  Four independent validation layers evaluated your Gherkin feature file:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiModels.map((m) => {
                  const border = 
                    m.modelId === 'gemini' ? 'border-blue-200 bg-blue-50/40' :
                    m.modelId === 'chatgpt' ? 'border-emerald-200 bg-emerald-50/40' :
                    m.modelId === 'claude' ? 'border-amber-200 bg-amber-50/40' :
                    'border-purple-200 bg-purple-50/40';

                  const badge = 
                    m.modelId === 'gemini' ? 'bg-blue-600' :
                    m.modelId === 'chatgpt' ? 'bg-emerald-600' :
                    m.modelId === 'claude' ? 'bg-amber-600' :
                    'bg-purple-600';

                  return (
                    <div key={m.modelId} className={`p-4 rounded-2xl border ${border} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${badge}`}></span>
                          <h4 className="text-sm font-bold text-slate-900">{m.modelName}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                          {m.score}/100 Score
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {m.keyFinding}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Status: <strong className="text-slate-800">{m.verdict}</strong></span>
                        <span>{m.issuesCount} flagged points</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Missing Scenarios */}
        {activeTab === 'missing' && (
          <MissingScenariosCard
            missingScenarios={analysis.missingScenarios}
            onInsertScenario={handleInsertMissingScenario}
          />
        )}

        {/* Tab 4: Live Editor & Re-Check */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Tip:</strong> Click on <strong>"Live Edit"</strong> in the top toolbar to edit any line, or copy fixes from the mistakes tab. When ready, click the green <strong>"Re-Check Gherkin"</strong> button!
                </span>
              </div>
            </div>

            <GherkinEditor
              content={analysis.originalGherkin}
              issues={analysis.issues}
              selectedLine={selectedLine}
              onSelectLine={(line) => setSelectedLine(line)}
              title={analysis.featureTitle}
              fileName={analysis.fileName}
              onSaveAndReanalyze={handleSaveEditorAndRecheck}
              isReanalyzing={isReanalyzing}
            />
          </div>
        )}

        {/* Tab 5: AI Diff Comparison */}
        {activeTab === 'diff' && (
          <DiffViewer
            originalGherkin={analysis.originalGherkin}
            improvedGherkin={analysis.improvedGherkin}
            improvementsCount={analysis.improvementsCount}
            recommendations={analysis.recommendations}
            fileName={analysis.fileName}
            onApplyImproved={handleApplyImproved}
            isReanalyzing={isReanalyzing}
          />
        )}

      </div>

    </div>
  );
};
