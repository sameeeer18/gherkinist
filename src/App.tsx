import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { api, SampleFeature } from './services/api';
import { AnalysisResult } from './types';
import { Loader2, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('analyze');
  const [samples, setSamples] = useState<SampleFeature[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingFileName, setAnalyzingFileName] = useState('');
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load initial samples
  useEffect(() => {
    async function loadInitial() {
      try {
        const [sampleList, historyList] = await Promise.all([
          api.getSamples(),
          api.getHistory()
        ]);
        setSamples(sampleList);
        if (historyList && historyList.length > 0) {
          setCurrentAnalysis(historyList[0]);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadInitial();
  }, []);

  const handleAnalyzeSubmit = async (gherkin: string, requirement?: string, fileName?: string) => {
    setIsAnalyzing(true);
    setAnalyzingFileName(fileName || 'feature.feature');
    try {
      const res = await api.analyze(gherkin, requirement, fileName);
      if (res.analysis) {
        setCurrentAnalysis(res.analysis);
        setCurrentTab('result');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      alert(`Analysis failed: ${err.message || 'Check connection'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReanalyze = async (gherkinContent?: string, requirementContent?: string) => {
    if (!currentAnalysis) return;
    setIsReanalyzing(true);
    try {
      const res = await api.reanalyze(currentAnalysis.id, gherkinContent, requirementContent);
      if (res.analysis) {
        setCurrentAnalysis(res.analysis);
      }
    } catch (e) {
      console.error('Reanalysis failed:', e);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await api.deleteAnalysis(id);
      setCurrentAnalysis(null);
      setCurrentTab('analyze');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSample = (sample: SampleFeature) => {
    handleAnalyzeSubmit(sample.gherkin, sample.requirement, sample.fileName);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4 p-4">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-[#69E2FF]/10 blur-md"></div>
          <span className="font-mono text-base font-black tracking-tight text-[#69E2FF] relative z-10">
            [✓]
          </span>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-base font-extrabold tracking-tight text-slate-100">
            Initializing Gherkinist Studio
          </h2>
          <p className="text-xs text-slate-400">
            AI Engine + Automation &amp; Quality Framework
          </p>
        </div>
        <Loader2 className="w-5 h-5 text-[#69E2FF] animate-spin mt-2" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={currentTab}
        hasAnalysisResult={Boolean(currentAnalysis)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onCheckFeatureClick={() => {
          setCurrentTab('analyze');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        
        {currentTab === 'analyze' && (
          <AnalyzePage
            onAnalyzeSubmit={handleAnalyzeSubmit}
            samples={samples}
            isAnalyzing={isAnalyzing}
            analyzingFileName={analyzingFileName}
          />
        )}

        {currentTab === 'result' && currentAnalysis && (
          <AnalysisResultPage
            analysis={currentAnalysis}
            onBack={() => setCurrentTab('analyze')}
            onReanalyze={handleReanalyze}
            onDelete={handleDeleteAnalysis}
            isReanalyzing={isReanalyzing}
          />
        )}

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/90 bg-white/95 backdrop-blur-md py-6 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 font-black text-slate-950">
              <span className="w-2 h-2 rounded-full bg-[#09B1EC]"></span>
              <span>Gherkinist Studio</span>
            </div>
            <span>&bull;</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300/80 text-[11px] shadow-2xs">
              <CreditCard className="w-3.5 h-3.5 text-slate-900" />
              <span className="text-black font-black uppercase tracking-wider">Made by Prepaid card team</span>
              <span className="text-[#09B1EC] font-black text-xs">@iServeU</span>
            </span>
          </div>

          <p className="text-slate-500 text-center sm:text-right font-medium">
            AI Quality Engine &bull; 4-Layer Assessment Framework
          </p>
        </div>
      </footer>

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
