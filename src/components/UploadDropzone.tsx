import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Code,
  FileText,
  Sparkles,
  ArrowRight,
  AlertOctagon,
  XCircle,
  FileCode2
} from 'lucide-react';
import { SampleFeature } from '../services/api';

interface UploadDropzoneProps {
  onAnalyze: (gherkin: string, requirement?: string, fileName?: string) => void;
  samples: SampleFeature[];
  isAnalyzing: boolean;
}

const DEFAULT_GHERKIN = `@REQ-PAY-101 @smoke
Feature: Payment Processing

  As a verified customer
  I want to make an instant payment
  So that I can purchase items securely

  Scenario: Successfully process payment
    Given customer has balance INR 5000
    When customer transfers INR 1000 to merchant
    Then payment status should be "COMPLETED"`;

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onAnalyze,
  samples,
  isAnalyzing
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');
  const [gherkinText, setGherkinText] = useState(DEFAULT_GHERKIN);
  const [fileName, setFileName] = useState('payment_processing.feature');
  const [requirementText, setRequirementText] = useState('');
  const [isRequirementOpen, setIsRequirementOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reqInputRef = useRef<HTMLInputElement>(null);

  // Sync sample if provided and empty
  useEffect(() => {
    if (samples.length > 0 && !gherkinText) {
      setGherkinText(samples[0].gherkin);
      setFileName(samples[0].fileName);
    }
  }, [samples]);

  // Listen to Navbar Check Feature trigger
  useEffect(() => {
    const handleTrigger = () => {
      // Validate file extension if filename exists
      if (fileName && !fileName.toLowerCase().endsWith('.feature')) {
        setFileError(`Invalid file format: "${fileName}". Please upload only valid .feature files.`);
        return;
      }
      
      let textToAnalyze = gherkinText.trim();
      if (!textToAnalyze) {
        setFileError('Please enter or upload a valid .feature file before checking.');
        return;
      }

      setFileError(null);
      onAnalyze(textToAnalyze, requirementText.trim() || undefined, fileName || 'feature.feature');
    };
    window.addEventListener('trigger-check-feature', handleTrigger);
    return () => {
      window.removeEventListener('trigger-check-feature', handleTrigger);
    };
  }, [gherkinText, requirementText, fileName, onAnalyze]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileError(null);
    const nameLower = file.name.toLowerCase();

    // Strict validation: ONLY .feature files are allowed
    if (!nameLower.endsWith('.feature')) {
      const fileExt = file.name.includes('.') ? `.${file.name.split('.').pop()}` : 'unknown file';
      setFileError(
        `Invalid File Uploaded (${fileExt})! Only ".feature" files are allowed. Gherkinist cannot accept "${file.name}". Please upload a valid .feature file.`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setGherkinText(content);
      setActiveTab('editor');
    };
    reader.readAsText(file);
  };

  const handleReqFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRequirementText(content);
        setIsRequirementOpen(true);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Strict validation on submit
    if (fileName && !fileName.toLowerCase().endsWith('.feature')) {
      setFileError(`Invalid file format: "${fileName}". Only .feature files are supported.`);
      return;
    }

    let textToAnalyze = gherkinText.trim();
    if (!textToAnalyze) {
      setFileError('Gherkin content is empty. Please provide or upload a .feature file.');
      fileInputRef.current?.click();
      return;
    }

    setFileError(null);
    onAnalyze(textToAnalyze, requirementText.trim() || undefined, fileName || 'feature.feature');
  };

  const linesCount = gherkinText ? gherkinText.split('\n').length : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pt-2">
      
      {/* Top Badge */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EEF2FF] text-slate-800 border border-[#C7D2FE]">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span>AI Quality Engine</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Gherkinist: Check &amp; Review Your Feature File
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-4xl leading-relaxed">
          Upload or paste your <span className="font-mono text-indigo-600 font-semibold">.feature</span> file. The <strong className="text-slate-900 font-bold">AI Engine + Quality Framework</strong> will review your test lines, spot mistakes, uncover missing scenarios, and generate instant automation step definitions.
        </p>
      </div>

      {/* Main Form / Workspace Container */}
      <form onSubmit={handleSubmit} id="gherkin-feature-form" className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          
          {/* Card Top Sub-Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            
            {/* Toggle group: Feature Editor | Upload File */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'editor'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-slate-700" />
                  <span>Feature Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upload');
                    fileInputRef.current?.click();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-slate-700" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Filename & lines display */}
              <span className="text-xs font-mono text-slate-500 font-medium hidden sm:inline">
                {fileName} ({linesCount} lines)
              </span>
            </div>

            {/* Right link: Browse .feature */}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                Browse .feature
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".feature"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Prominent File Validation Error Banner */}
          {fileError && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-start justify-between gap-3 animate-shake shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 text-rose-700 mt-0.5">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-rose-900 flex items-center gap-1.5">
                    <span>Invalid File Format Detected</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                      .feature Only
                    </span>
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {fileError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition cursor-pointer"
                title="Dismiss error"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Editor Container with Dark Theme matching screenshot */}
          {activeTab === 'editor' ? (
            <div className="rounded-2xl bg-[#0B132B] p-5 sm:p-6 shadow-inner border border-slate-800">
              <textarea
                id="gherkin-editor-input"
                value={gherkinText}
                onChange={(e) => setGherkinText(e.target.value)}
                rows={16}
                spellCheck={false}
                placeholder={DEFAULT_GHERKIN}
                className="w-full bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-hidden resize-y code-scrollbar"
              />
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl p-16 text-center cursor-pointer transition-all border-2 border-dashed ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-400'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-slate-800">
                Drop your <span className="font-mono text-indigo-600">.feature</span> file here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Cucumber, Behave, SpecFlow, and standard Gherkin files (.feature, .txt)
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-xs">
                  Choose Local File
                </span>
              </div>
            </div>
          )}

          {/* Optional Jira Requirement input */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRequirementOpen(!isRequirementOpen)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {isRequirementOpen ? 'Hide' : '+ Attach'} Jira Story / ACs for Requirement Coverage (Layer 4)
                </span>
              </button>
              <span className="text-[10px] text-slate-400">Optional</span>
            </div>

            {isRequirementOpen && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Paste acceptance criteria or user story:</span>
                  <button
                    type="button"
                    onClick={() => reqInputRef.current?.click()}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    Upload doc
                  </button>
                  <input
                    ref={reqInputRef}
                    type="file"
                    accept=".txt,.md,.doc,.json"
                    onChange={handleReqFileChange}
                    className="hidden"
                  />
                </div>
                <textarea
                  value={requirementText}
                  onChange={(e) => setRequirementText(e.target.value)}
                  rows={3}
                  placeholder={`ACCEPTANCE CRITERIA:
AC-01: Verify successful payment debit and notification.
AC-02: Prevent transaction on insufficient balance with code ERR_INSUFFICIENT_FUNDS.`}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="check-feature-submit-btn"
              disabled={isAnalyzing}
              className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-black text-white transition shadow-sm group ${
                isAnalyzing
                  ? 'bg-slate-500 cursor-not-allowed'
                  : 'bg-slate-950 hover:bg-slate-900 active:scale-98 cursor-pointer'
              }`}
            >
              <span>{isAnalyzing ? 'Auditing Feature File with AI...' : 'Check Feature'}</span>
              {!isAnalyzing && <ArrowRight className="w-4 h-4 text-[#09B1EC] group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </div>

        </div>
      </form>

    </div>
  );
};
