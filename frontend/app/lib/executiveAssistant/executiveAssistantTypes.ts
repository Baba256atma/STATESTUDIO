/**
 * PHASE-12 / EAI-1 — Executive Assistant Intelligence types.
 * Conversational explanation contract only — no LLM, calculation, or runtime behavior.
 */

import type {
  ExecutiveIntelligenceContext,
  ExecutiveIntelligenceResponse,
  ExecutiveIntelligenceSession,
} from "../executiveIntelligencePlatform/executiveIntelligencePlatformTypes.ts";

export type ExecutiveAssistantWorkspaceId = string;

export type ExecutiveAssistantRequestType =
  | "explain_summary"
  | "explain_object"
  | "explain_relationship"
  | "explain_kpi"
  | "explain_risk"
  | "explain_scenario"
  | "explain_okr"
  | "executive_question"
  | "custom";

export type ExecutiveAssistantReferenceKind =
  | "summary"
  | "object"
  | "relationship"
  | "kpi"
  | "risk"
  | "scenario"
  | "okr"
  | "custom";

export type ExecutiveAssistantLifecycleState =
  | "initialized"
  | "prepared"
  | "validated"
  | "available"
  | "deprecated"
  | "archived";

export type ExecutiveAssistantExtensionPoint = Readonly<{
  taxonomyOverride?: string | null;
  futureExtension?: Readonly<Record<string, unknown>>;
}>;

export type ExecutiveAssistantMetadata = Readonly<{
  tags: readonly string[];
  domainHint: string | null;
  executiveCategoryHint: string | null;
  conversationHint: string | null;
  taxonomyOverride: string | null;
  extension: ExecutiveAssistantExtensionPoint;
}>;

export type ExecutiveAssistantConversationState = Readonly<{
  conversationId: string;
  selectedTopic: string | null;
  turnMetadata: readonly string[];
  historyMetadata: readonly string[];
  userPreferences: Readonly<Record<string, string>>;
  explanationContext: string | null;
}>;

export type ExecutiveAssistantExplanation = Readonly<{
  explanationId: string;
  explanationScope: ExecutiveAssistantRequestType;
  explanationText: string;
  identityReferences: readonly string[];
  referenceKind: ExecutiveAssistantReferenceKind;
  explanationMetadata: ExecutiveAssistantMetadata;
  sourceTopic: string | null;
}>;

export type ExecutiveAssistantSession = Readonly<{
  contractVersion: string;
  assistantSessionId: string;
  workspaceId: ExecutiveAssistantWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  intelligenceRequestId: string;
  conversationId: string;
  requestTypesUsed: readonly ExecutiveAssistantRequestType[];
  explanationCount: number;
  sessionSummary: string;
  metadata: ExecutiveAssistantMetadata;
  lifecycleState: ExecutiveAssistantLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-12-executive-assistant-intelligence";
}>;

export type ExecutiveAssistantRequest = Readonly<{
  contractVersion: string;
  requestId: string;
  assistantSessionId: string;
  workspaceId: ExecutiveAssistantWorkspaceId;
  executiveModelId: string;
  intelligenceResponseId: string;
  requestType: ExecutiveAssistantRequestType;
  targetReferenceId: string | null;
  metadata: ExecutiveAssistantMetadata;
  lifecycleState: ExecutiveAssistantLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-12-executive-assistant-intelligence";
}>;

export type ExecutiveAssistantResponse = Readonly<{
  contractVersion: string;
  responseId: string;
  requestId: string;
  assistantSessionId: string;
  workspaceId: ExecutiveAssistantWorkspaceId;
  executiveModelId: string;
  intelligenceResponseId: string;
  explanation: ExecutiveAssistantExplanation;
  conversationMetadata: ExecutiveAssistantMetadata;
  metadata: ExecutiveAssistantMetadata;
  lifecycleState: ExecutiveAssistantLifecycleState;
  createdAt: string;
  updatedAt: string;
  source: "phase-12-executive-assistant-intelligence";
}>;

export type ExecutiveAssistantContext = Readonly<{
  contextId: string;
  assistantSessionId: string;
  workspaceId: ExecutiveAssistantWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  conversationState: ExecutiveAssistantConversationState;
  metadata: ExecutiveAssistantMetadata;
  createdAt: string;
  updatedAt: string;
  source: "phase-12-executive-assistant-intelligence";
}>;

export type ExecutiveAssistantExplanationInput = Readonly<{
  intelligenceResponse: ExecutiveIntelligenceResponse;
  intelligenceSession: ExecutiveIntelligenceSession;
  intelligenceContext: ExecutiveIntelligenceContext;
  requestType: ExecutiveAssistantRequestType;
  targetReferenceId?: string | null;
  assistantSessionId?: string;
  conversationId?: string;
}>;

export type ExecutiveAssistantOwnershipContract = Readonly<{
  assistantSessionId: string;
  workspaceId: ExecutiveAssistantWorkspaceId;
  executiveModelId: string;
  intelligenceSessionId: string;
  intelligenceResponseId: string;
  isolationPolicy: "workspace-exclusive";
  upstreamAuthority: "phase-10-executive-intelligence-platform";
  mutationPolicy: "read-only-explanation-snapshot";
}>;

export type ExecutiveAssistantValidationIssue = Readonly<{
  code: string;
  message: string;
}>;

export type ExecutiveAssistantValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ExecutiveAssistantValidationIssue[];
}>;

export type ExecutiveAssistantExplanationResult = Readonly<{
  success: boolean;
  session: ExecutiveAssistantSession | null;
  request: ExecutiveAssistantRequest | null;
  response: ExecutiveAssistantResponse | null;
  context: ExecutiveAssistantContext | null;
  issues: readonly ExecutiveAssistantValidationIssue[];
  assistantSessionId: string;
}>;

export type ExecutiveAssistantScoreDimensions = Readonly<{
  architecture: number;
  maintainability: number;
  regressionSafety: number;
  scalability: number;
  certificationReadiness: number;
}>;

export type ExecutiveAssistantScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveAssistantScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveAssistantCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
}>;

export type ExecutiveAssistantCertificationResult = Readonly<{
  contractVersion: string;
  certified: boolean;
  checks: readonly ExecutiveAssistantCertificationCheck[];
  scoreReport: ExecutiveAssistantScoreReport;
  analysisScoreReport: ExecutiveAssistantAnalysisScoreReport | null;
  freezeReport: ExecutiveAssistantFreezeReport | null;
  summary: string;
  generatedAt: string;
  tags: readonly string[];
}>;

export type ExecutiveAssistantAnalysisScoreDimensions = Readonly<{
  architectureHealth: number;
  maintainability: number;
  scalability: number;
  regressionSafety: number;
  eipInputBoundaryIntegrity: number;
  conversationOnlyIntegrity: number;
  explanationIntegrity: number;
  conversationMetadataSafety: number;
  bugTraceability: number;
  certificationReadiness: number;
}>;

export type ExecutiveAssistantAnalysisScoreReport = Readonly<{
  contractVersion: string;
  dimensions: ExecutiveAssistantAnalysisScoreDimensions;
  overall: number;
  meetsMinimum: boolean;
  generatedAt: string;
}>;

export type ExecutiveAssistantFreezeReport = Readonly<{
  frozen: boolean;
  frozenAt: string | null;
  requestTypesCount: number;
  explanationStagesCount: number;
  lifecycleStatesCount: number;
  generatedAt: string;
}>;

export type ExecutiveAssistantDiagnosticEventType =
  | "AssistantSessionCreated"
  | "AssistantRequestAccepted"
  | "ExplanationPrepared"
  | "ExplanationValidated"
  | "AssistantResponseReady"
  | "ConversationUpdated"
  | "CertificationStarted"
  | "CertificationPassed"
  | "CertificationFailed";

export type ExecutiveAssistantDiagnosticEvent = Readonly<{
  type: ExecutiveAssistantDiagnosticEventType;
  assistantSessionId: string | null;
  workspaceId: ExecutiveAssistantWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  timestamp: string;
}>;

export type ExecutiveAssistantDiagnosticLogEntry = Readonly<{
  assistantSessionId: string | null;
  workspaceId: ExecutiveAssistantWorkspaceId | null;
  requestId: string | null;
  responseId: string | null;
  event: ExecutiveAssistantDiagnosticEventType;
  message: string;
  generatedAt: string;
}>;
