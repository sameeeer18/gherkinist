import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2,
  Target,
  Layers,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Zap,
  TrendingUp,
  FileCode2,
  Users,
  Check
} from 'lucide-react';
import { SampleFeature } from '../services/api';

interface LandingPageProps {
  onStartAnalyze: () => void;
  onLoadSample: (sample: SampleFeature) => void;
  samples: SampleFeature[];
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalyze,
  onLoadSample,
  samples,
  onNavigate
}) => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Quality Gate Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Gherkin Quality Gate for Enterprise Teams</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-sans">
            Never send incomplete <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-800 to-slate-900 bg-clip-text text-transparent">
              Gherkin to Development & QA.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Deterministic rule validation, 4-layer review framework, and multi-layer AI Engine validation — all in one unified quality gate.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 shadow-xl shadow-slate-900/10 hover:shadow-2xl transition transform active:scale-95"
          >
            <span>Analyze My Gherkin</span>
            <ArrowRight className="w-4 h-4 text-indigo-300" />
          </button>

          {samples.length > 0 && (
            <button
              onClick={() => onLoadSample(samples[0])}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs transition"
            >
              <FileCode2 className="w-4 h-4 text-indigo-600" />
              <span>Load Live FinTech Sample</span>
            </button>
          )}
        </div>

        {/* Hero Trust Microcopy */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-2">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Deterministic Syntax Baseline
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-AI Agreement Metric
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant Improved Gherkin Export
          </span>
        </div>

        {/* Floating Interactive Dashboard Mockup Card */}
        <div className="relative max-w-5xl mx-auto pt-6">
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 text-left space-y-6 ring-1 ring-slate-900/5">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">payment_processing.feature</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      NEEDS REVISION
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">REQ-PAY-101 • Instant Digital Wallet Payment</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/60">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Readiness</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900">88 / 100</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">AI Consensus</span>
                  <span className="text-2xl font-extrabold font-mono text-indigo-600">91%</span>
                </div>
              </div>
            </div>

            {/* 4 Layer Scoreboard Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Layer 1: Structural</span>
                  <span className="font-bold text-emerald-600 font-mono">3 / 3</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">Meets Bar</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/80">
                <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
                  <span>Layer 2: Coverage</span>
                  <span className="font-bold text-amber-700 font-mono">2 / 3</span>
                </div>
                <div className="text-xs font-bold text-amber-900 mt-1">Needs Revision</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Layer 3: Coherence</span>
                  <span className="font-bold text-emerald-600 font-mono">3 / 3</span>
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">Meets Bar</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/80">
                <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
                  <span>Layer 4: Traceability</span>
                  <span className="font-bold text-amber-700 font-mono">2 / 3</span>
                </div>
                <div className="text-xs font-bold text-amber-900 mt-1">Needs Revision</div>
              </div>
            </div>

            {/* Consensus Flag Snippet */}
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  3/3 Strong Consensus Issue Detected:
                </span>
                <p className="text-indigo-900">
                  Missing negative scenario for Insufficient Wallet Balance (Violates AC-02).
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold whitespace-nowrap">
                Fix Generated
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* 2. THE 4-STEP CORE WORKFLOW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
            End-to-End Execution Flow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            How GherkinIQ Protects Your Sprint
          </h2>
          <p className="text-sm text-slate-600">
            From raw feature upload to production-ready Cucumber/Behave automation specs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Upload & Parse</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload <code className="px-1 py-0.5 rounded bg-slate-100 font-mono text-indigo-600">.feature</code> file and optionally paste the User Story or Acceptance Criteria.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Four-Layer Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic validation evaluates Structure, Coverage, Coherence, and Traceability against strict quality thresholds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Engine Quality Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Independent validation layers inspect your scenarios to ensure complete coverage and zero test ambiguity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900">Ready & Improve</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get an instant Development & QA Readiness score, plus an improved Gherkin file with missing scenarios inserted.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FOUR-LAYER FRAMEWORK DEEP DIVE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
              Deterministic Scoring Engine
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              The Four-Layer Gherkin Review Framework
            </h2>
            <p className="text-sm text-slate-600">
              GherkinIQ scores every feature file across four foundational pillars (0–3 points each, max 12).
            </p>
          </div>
          <button
            onClick={() => onNavigate('framework')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl transition flex items-center gap-1"
          >
            <span>Read Framework Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">LAYER 01</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Structural / Syntax</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validates Gherkin grammar, Given/When/Then sequencing, Scenario Outline table completeness, placeholder detection, and standard tag taxonomy.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500 font-mono space-y-1">
              <div>✓ Keywords syntax & capitalization</div>
              <div>✓ Zero empty/placeholder steps ("Then something happens")</div>
              <div>✓ Valid Examples table headers & row counts</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">LAYER 02</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Coverage / Completeness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensures tests go beyond the naive happy path. Checks for negative paths, boundary limits, gateway timeouts, idempotent retries, and error status transitions.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500 font-mono space-y-1">
              <div>✓ Happy path + explicit failure branches</div>
              <div>✓ Numerical and regulatory boundary tests</div>
              <div>✓ Timeout & network degradation resilience</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">LAYER 03</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Coherence / Consistency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects conflicting business rules, ambiguous phrasing, vague steps, duplicate scenarios, and misaligned domain terminology across files.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500 font-mono space-y-1">
              <div>✓ Domain dictionary verification</div>
              <div>✓ Non-contradictory precondition states</div>
              <div>✓ Descriptive scenario titles for reporting</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-indigo-200 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">LAYER 04</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Traceability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps Gherkin scenarios to source Jira tickets, User Stories, and Acceptance Criteria (AC-01, AC-02) with orphan scenario detection.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500 font-mono space-y-1">
              <div>✓ Every AC has at least 1 verifying scenario</div>
              <div>✓ Detects orphaned non-requirement tests</div>
              <div>✓ Automated @REQ metadata tagging</div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. MULTI-AI CONSENSUS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 space-y-8 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Scale className="w-3.5 h-3.5" />
                <span>Multi-Layer Verification</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-sans">
                AI Engine + 4-Layer Quality Gate
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Gherkinist applies automated validation layers to catch syntactic flaws, boundary conditions, and traceability issues with mathematically grounded confidence.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Consensus Confidence</span>
              <div className="text-4xl font-extrabold text-indigo-400 font-mono">90%+</div>
              <span className="text-[11px] text-emerald-400">Quality threshold</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                Syntax &amp; Structural Layer
              </div>
              <p className="text-xs text-slate-300">
                Specialized in Cucumber syntax nuances, step definition compatibility, and structural parsing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                Logic &amp; Risk Layer
              </div>
              <p className="text-xs text-slate-300">
                Specialized in deep edge-case reasoning, business rule consistency, and regulatory risk detection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                Traceability &amp; Framework Layer
              </div>
              <p className="text-xs text-slate-300">
                Specialized in acceptance criteria mapping and 7-framework test automation code generation.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FINTECH READINESS CALLOUT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Engineered for Regulated Systems
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Built for High-Stakes FinTech & Banking APIs
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Handles UPI Autopay mandates, Tier-1 KYC verification, idempotency keys, dual-entry accounting ledgers, and RBI / NPCI compliance rules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={onStartAnalyze}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 text-center"
            >
              Launch Quality Gate
            </button>
          </div>
        </div>
      </section>

      {/* 6. FAQ & GET STARTED */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
            Ready to establish your quality gate?
          </h2>
          <p className="text-sm text-slate-600">
            Join enterprise QA teams, product managers, and developers shipping defect-free user stories.
          </p>
        </div>

        <button
          onClick={onStartAnalyze}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xl transition transform active:scale-95"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-4 h-4 text-indigo-300" />
        </button>
      </section>

    </div>
  );
};
