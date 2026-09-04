import React from 'react';
import { HelpCircle, BookOpen, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const HelpDocsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
          Gherkin Quality Standards & Cucumber Automation Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Best practices for writing maintainable, declarative, and automation-ready Gherkin features.
        </p>
      </div>

      {/* Guide sections */}
      <div className="space-y-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            1. The Declarative Rule
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Write what the system does from a user/business perspective, not how the UI clicks buttons.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <span className="font-bold block">❌ Anti-Pattern (Imperative UI):</span>
              <p className="font-mono text-[11px] mt-1">
                When I click button "#submit-btn"<br/>
                And I fill input "name" with "Alex"<br/>
                Then div ".modal" should be visible
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="font-bold block">✅ Best Practice (Declarative Business):</span>
              <p className="font-mono text-[11px] mt-1">
                When customer initiates transfer of INR 1000<br/>
                Then transaction status should be "COMPLETED"<br/>
                And wallet balance should be updated
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            2. Scenario Outline & Examples Table
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Use Scenario Outlines to test multiple boundary values and permission levels without copy-pasting scenarios.
          </p>
          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed">
{`Scenario Outline: Payment fee calculation by tier
  Given customer has tier "<Tier>"
  When payment amount is INR <Amount>
  Then calculated fee should be INR <Fee>

  Examples:
    | Tier     | Amount | Fee |
    | Standard | 1000   | 15  |
    | Premium  | 1000   | 5   |
    | VIP      | 1000   | 0   |`}
          </pre>
        </div>

      </div>

    </div>
  );
};
