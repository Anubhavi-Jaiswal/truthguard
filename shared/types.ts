export type SourceType = 'pdf' | 'docx' | 'txt' | 'md' | 'synthetic';

export type PolicyCategory = 'HR' | 'IT_SECURITY' | 'EXPENSE' | 'GENERAL';

export interface Document {
  id: string;
  title: string;
  content: string;
  version: string;
  publishedAt: string; // ISO date YYYY-MM-DD
  effectiveFrom: string; // ISO date YYYY-MM-DD
  effectiveTo?: string; // ISO date YYYY-MM-DD or undefined
  supersedes?: string[]; // IDs of documents superseded by this
  category: PolicyCategory;
  sourceType: SourceType;
  metadata?: Record<string, any>;
}

export interface Passage {
  id: string;
  documentId: string;
  documentTitle: string;
  version: string;
  category: PolicyCategory;
  effectiveFrom: string;
  effectiveTo?: string;
  section?: string;
  text: string;
  score?: number; // BM25 relevance score
}

export type ClaimStatus = 'SUPPORTED' | 'CONTRADICTED' | 'UNSUPPORTED' | 'PARTIALLY_SUPPORTED';

export interface Claim {
  id: string;
  text: string;
  supportingPassageIds: string[];
  status: ClaimStatus;
  explanation: string;
}

export type ConflictSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ResolutionStatus = 'RESOLVED' | 'UNRESOLVED' | 'CONDITIONAL';

export interface Conflict {
  id: string;
  description: string;
  involvedPassageIds: string[];
  severity: ConflictSeverity;
  resolutionStatus: ResolutionStatus;
  explanation: string;
  conflictingStatements?: {
    passageId: string;
    documentTitle: string;
    version: string;
    effectiveFrom: string;
    effectiveTo?: string;
    quote: string;
    ruleValue?: string | number;
  }[];
  resolutionJustification?: string;
}

export type VerificationStatus = 
  | 'VERIFIED' 
  | 'CONFLICT_DETECTED' 
  | 'INSUFFICIENT_EVIDENCE' 
  | 'PARTIALLY_VERIFIED';

export type StageStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface VerificationStage {
  id: 'retriever' | 'synthesizer' | 'critic' | 'resolver';
  name: string;
  agent: string;
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  summary?: string;
  details?: any;
}

export type ExecutionMode = 'LIVE_AI' | 'DEMO_DETERMINISTIC';

export interface VerificationResult {
  question: string;
  answer: string;
  overallStatus: VerificationStatus;
  claims: Claim[];
  conflicts: Conflict[];
  citedSources: {
    documentId: string;
    documentTitle: string;
    version: string;
    effectiveFrom: string;
    effectiveTo?: string;
    passageId: string;
    quote: string;
  }[];
  resolutionExplanation?: string;
  unresolvedQuestions: string[];
  verificationStages: VerificationStage[];
  executionMode: ExecutionMode;
  metadata?: {
    retrievedPassageCount: number;
    processingTimeMs: number;
    provider?: string;
    model?: string;
  };
}

export interface TestCase {
  id: string;
  title: string;
  scenarioType: string;
  question: string;
  description: string;
  relevantDocumentIds: string[];
  expectedStatus: VerificationStatus;
  expectedResolutionStatus?: ResolutionStatus;
  expectedKeyTerms?: string[];
  expectedConflictDescription?: string;
}

export interface TestResult {
  testId: string;
  title: string;
  passed: boolean;
  actualStatus: VerificationStatus;
  expectedStatus: VerificationStatus;
  actualResolutionStatus?: ResolutionStatus;
  expectedResolutionStatus?: ResolutionStatus;
  explanation: string;
  verificationResult: VerificationResult;
  executionTimeMs: number;
}
