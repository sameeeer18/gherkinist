import React from 'react';
import {
  CreditCard,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onNavigate: (tab: string) => void;
  onCheckFeatureClick?: () => void;
  hasAnalysisResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onCheckFeatureClick
}) => {
  const handleCheckFeature = () => {
    onNavigate('analyze');
    if (onCheckFeatureClick) {
      onCheckFeatureClick();
    }
    // Dispatch custom event to trigger analysis immediately
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('trigger-check-feature'));
      const submitBtn = document.getElementById('check-feature-submit-btn') as HTMLButtonElement | null;
      if (submitBtn) {
        submitBtn.click();
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Brand Logo & Title & Badge */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => onNavigate('analyze')}
              className="flex items-center gap-3 sm:gap-3.5 text-left group cursor-pointer focus:outline-hidden"
              title="Gherkinist Studio"
            >
              {/* Square Modern Logo [✓] with #09B1EC cyan glow */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-[#09B1EC] font-mono font-black text-base shadow-sm border border-slate-800 ring-2 ring-[#09B1EC]/20 group-hover:ring-[#09B1EC]/60 transition-all shrink-0">
                [✓]
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  {/* Gherkinist Title */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
                      Gherkin<span className="text-[#09B1EC]">ist</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">
                      Studio
                    </span>
                  </div>
                  
                  {/* Pill badge: MADE BY PREPAID CARD TEAM in black & @iServeU in #09B1EC */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[10.5px] bg-slate-100/90 border border-slate-300/80 shadow-2xs whitespace-nowrap">
                    <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-900 shrink-0" />
                    <span className="text-slate-900 font-extrabold uppercase tracking-wider">
                      MADE BY PREPAID CARD TEAM
                    </span>
                    <span className="text-[#09B1EC] font-black tracking-tight text-[11px] sm:text-xs">
                      @iServeU
                    </span>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-tight mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#09B1EC] shrink-0"></span>
                  <span>AI Quality Engine &amp; BDD Feature Auditor</span>
                </p>
              </div>
            </button>
          </div>

          {/* Right: Primary Check Feature Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCheckFeature}
              id="navbar-check-feature-btn"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-950 hover:bg-slate-900 text-white transition shadow-sm hover:shadow-md active:scale-97 cursor-pointer border border-slate-800"
            >
              <span>Check Feature</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#09B1EC]" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

