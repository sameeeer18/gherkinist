import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Cpu, Bot, Check, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressStepperProps {
  fileName: string;
  onComplete?: () => void;
}

interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  badge: string;
  color: string;
}

const STEPS: StepItem[] = [
  { 
    id: 1, 
    label: 'Layer 1: Structural & Syntax Quality Audit', 
    sublabel: 'Scanning for standard Gherkin syntax, keyword sequence, and formatting integrity', 
    badge: 'Syntax Layer',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  { 
    id: 2, 
    label: 'Layer 2: Coverage & Completeness Check', 
    sublabel: 'Auditing edge cases, negative failure paths, timeout scenarios, and boundary limits', 
    badge: 'Coverage Layer',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  { 
    id: 3, 
    label: 'Layer 3: Coherence & Terminology Verification', 
    sublabel: 'Inspecting actor consistency, observable assertions, and unambiguous phrasing', 
    badge: 'Coherence Layer',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  { 
    id: 4, 
    label: 'Layer 4: Traceability & Automation Code Generation', 
    sublabel: 'Mapping acceptance criteria and generating BDD step definition automation snippets', 
    badge: 'Automation Layer',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  }
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ fileName, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
      
      {/* File Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{fileName}</p>
            <p className="text-xs text-slate-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Engine + 4-Layer Quality Framework
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-indigo-600">
            {Math.min(100, Math.round((currentStep / STEPS.length) * 100))}%
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          Auditing with AI Engine &amp; Quality Framework...
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Evaluating structural syntax, coverage completeness, coherence, and test framework automation readiness
        </p>
      </div>

      {/* Stepper items */}
      <div className="space-y-2.5">
        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isRunning = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.8, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-3 rounded-2xl text-xs transition ${
                isRunning
                  ? 'bg-indigo-50/90 border border-indigo-200 text-indigo-950 font-semibold shadow-xs'
                  : isDone
                  ? 'bg-slate-50 text-slate-700 font-medium'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isDone ? 'bg-emerald-100 text-emerald-700' : isRunning ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isDone ? '✓' : step.id}
                </span>
                <div>
                  <p className="font-bold">{step.label}</p>
                  <p className="text-[11px] text-slate-500 font-normal">{step.sublabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${step.color}`}>
                  {step.badge}
                </span>
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5]" />}
                {isRunning && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />}
                {isPending && <span className="w-2 h-2 rounded-full bg-slate-300"></span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-2 text-center">
        <p className="text-[11px] text-slate-500 font-medium">
          Powered by AI Engine + 4-Layer Quality Framework
        </p>
      </div>

    </div>
  );
};
