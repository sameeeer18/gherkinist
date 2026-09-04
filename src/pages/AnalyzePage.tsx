import React, { useState } from 'react';
import { UploadDropzone } from '../components/UploadDropzone';
import { ProgressStepper } from '../components/ProgressStepper';
import { SampleFeature } from '../services/api';

interface AnalyzePageProps {
  onAnalyzeSubmit: (gherkin: string, requirement?: string, fileName?: string) => Promise<void>;
  samples: SampleFeature[];
  isAnalyzing: boolean;
  analyzingFileName: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  onAnalyzeSubmit,
  samples,
  isAnalyzing,
  analyzingFileName
}) => {
  return (
    <div className="py-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {isAnalyzing ? (
        <ProgressStepper fileName={analyzingFileName || 'feature.feature'} />
      ) : (
        <UploadDropzone
          onAnalyze={onAnalyzeSubmit}
          samples={samples}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
};
