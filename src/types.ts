export type LayerType = 'structuralSyntax' | 'coverageCompleteness' | 'coherenceConsistency' | 'traceability';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface LayerReview {
  name: string;
  layer: LayerType;
  score: number; // 0 to 3
  maxScore: number;
  status: 'Meets Bar' | 'Needs Revision' | 'Major Gaps' | 'Fails' | 'Not Applicable';
  summary: string;
  checksPassed: number;
  totalChecks: number;
}

export interface AIAgreement {
  gemini?: boolean;
  gpt4o?: boolean;
  claude?: boolean;
  deepseek?: boolean;
  mistral?: boolean;
  llama?: boolean;
  blackbox?: boolean;
  qwen?: boolean;
  [key: string]: boolean | undefined;
}

export interface Issue {
  id: string;
  layer: LayerType;
  severity: IssueSeverity;
  line: number;
  codeSnippet?: string;
  correctedSnippet?: string;
  scenario?: string;
  title: string;
  description: string;
  whyItMatters: string;
  suggestedFix: string;
  aiAgreement: AIAgreement;
  consensusRatio: string; // e.g. "8/8", "7/8"
  consensusLevel: 'Strong Consensus' | 'Partial Consensus' | 'Low Consensus' | 'Disagreement';
  confidence: number; // e.g. 100, 88, 75
  modelFindings?: {
    gemini?: string;
    gpt4o?: string;
    claude?: string;
    deepseek?: string;
    mistral?: string;
    llama?: string;
    blackbox?: string;
    qwen?: string;
    [key: string]: string | undefined;
  };
  resolved?: boolean;
}

export interface MissingScenario {
  id: string;
  category: 'Happy Path' | 'Negative Path' | 'Boundary' | 'Error Handling' | 'State Transition' | 'Data Variation' | 'Security' | 'Performance';
  title: string;
  description: string;
  suggestedGherkin: string;
  addedToFeature?: boolean;
}

export interface AcceptanceCriteriaCoverage {
  acId: string;
  description: string;
  status: 'COVERED' | 'PARTIAL' | 'MISSING';
  mappedScenarios: string[];
}

export interface RequirementMapping {
  requirementId: string;
  title: string;
  description: string;
  mappedScenarios: {
    scenarioTitle: string;
    status: 'VERIFIED' | 'MISSING' | 'ORPHAN';
    requirementTag?: string;
  }[];
  acceptanceCriteria: AcceptanceCriteriaCoverage[];
  orphanScenarios: string[];
  traceabilityStatus: 'FULL' | 'COMPLETE' | 'PARTIAL' | 'NOT_COVERED' | 'UNAVAILABLE';
  notes: string;
}

export interface AIModelReviewSummary {
  modelName: string;
  modelId: string;
  avatarColor: string;
  status: 'COMPLETED' | 'UNAVAILABLE' | 'RUNNING';
  score: number;
  verdict: string;
  keyFinding: string;
  issuesCount: number;
  specialization?: string;
}

export interface AIConsensus {
  consensusRate: number; // e.g. 91%
  models: AIModelReviewSummary[];
  disagreementsCount: number;
}

export type TraceabilityData = RequirementMapping;

export interface AnalysisResult {
  id: string;
  userId?: string;
  fileName: string;
  fileSize?: string;
  featureTitle: string;
  featureNarrative: string;
  originalGherkin: string;
  requirementText?: string;
  requirementFileName?: string;
  
  // Readiness Scores
  overallScore: number; // 0 to 100%
  developmentScore: number; // 0 to 100%
  qaScore: number; // 0 to 100%
  sprintReady: boolean;
  sprintBlockedReason?: string;
  finalVerdict: 'DEVELOPMENT + QA READY' | 'DEVELOPMENT READY' | 'QA READY' | 'NEEDS REVISION' | 'NOT READY';

  // Four-Layer Framework (0 to 3 each)
  fourLayers: {
    structuralSyntax: LayerReview;
    coverageCompleteness: LayerReview;
    coherenceConsistency: LayerReview;
    traceability: LayerReview;
  };
  totalFrameworkScore: number; // out of 12 or 9
  maxFrameworkScore: number; // 12 (with req) or 9 (without req)

  // Details
  issues: Issue[];
  missingScenarios: MissingScenario[];
  
  // Multi-AI
  aiConsensus: {
    consensusRate: number; // e.g. 91%
    models: AIModelReviewSummary[];
    disagreementsCount: number;
  };

  // Traceability
  traceabilityData?: RequirementMapping;

  // Improvement
  improvedGherkin: string;
  improvementsCount: number;
  executiveSummary: string;
  shortAnswer?: string;
  whatsGood?: string[];
  strengths: string[];
  recommendations: string[];

  // Metadata
  version: number;
  previousAnalysisId?: string;
  improvementDelta?: number;
  fintechTagsDetected: string[];
  detectedBankingPillar?: string;
  detectedBankingModule?: string;
  createdAt: string;
}

export interface DashboardStats {
  filesAnalyzed: number;
  averageScore: number;
  developmentReadyCount: number;
  qaReadyCount: number;
  sprintReadyCount: number;
  needsRevisionCount: number;
  totalIssuesFound: number;
  criticalIssuesCount: number;
  consensusAverage: number;
  scoreTrend: { date: string; score: number; dev: number; qa: number }[];
  layerAverages: { layer: string; score: number; max: number }[];
  recentAnalyses: AnalysisSummary[];
}

export interface AnalysisSummary {
  id: string;
  fileName: string;
  featureTitle: string;
  overallScore: number;
  developmentScore: number;
  qaScore: number;
  sprintReady: boolean;
  finalVerdict: string;
  issuesCount: number;
  createdAt: string;
  version: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  token?: string;
}
