/**
 * APP-8:1 — Decision Journal Platform domain types.
 * Immutable contract vocabulary — no storage, visualization, or execution.
 */

import type {
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";

export type DecisionJournalEntryId = string;
export type DecisionJournalId = string;
export type DecisionWorkspaceId = string;
export type DecisionId = string;
export type ScenarioId = string;
export type DecisionJournalTag = string;

export type DecisionCertificationStatus = "pending" | "pass" | "fail";
export type DecisionFreezeState = "open" | "frozen";
export type DecisionArchitectureStatus = "build" | "certified";

export type DecisionJournalStatus = (typeof DECISION_JOURNAL_STATUS_KEYS)[number];
export type DecisionJournalSource = (typeof DECISION_JOURNAL_SOURCE_KEYS)[number];
export type DecisionJournalConfidence = (typeof DECISION_JOURNAL_CONFIDENCE_KEYS)[number];

export type DecisionJournalPlatformIdentity = Readonly<{
  appId: "APP-8";
  title: "Decision Journal";
  platformId: "decision-journal-platform";
  version: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  status: DecisionArchitectureStatus;
  certificationStatus: DecisionCertificationStatus;
  freezeState: DecisionFreezeState;
  architectureVersion: string;
}>;

export type DecisionJournalMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type DecisionJournalEntry = Readonly<{
  id: DecisionJournalEntryId;
  workspaceId: DecisionWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  title: string;
  summary: string;
  rationale: string;
  assumptions: readonly string[];
  alternatives: readonly string[];
  evidenceReferences: readonly string[];
  acceptedRisks: readonly string[];
  expectedOutcome: string;
  confidence: DecisionJournalConfidence;
  tradeoffs: readonly string[];
  constraints: readonly string[];
  author: string;
  reviewers: readonly string[];
  tags: readonly DecisionJournalTag[];
  metadata: DecisionJournalMetadata;
  createdAt: string;
  updatedAt: string;
  version: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type DecisionJournalRegistration = Readonly<{
  journalId: DecisionJournalId;
  workspaceId: DecisionWorkspaceId;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type DecisionJournalRegistrationInput = Readonly<{
  journalId: DecisionJournalId;
  workspaceId: DecisionWorkspaceId;
  label: string;
  description: string;
}>;

export type DecisionJournalStatusRegistration = Readonly<{
  statusId: DecisionJournalStatus;
  label: string;
  description: string;
  terminal: boolean;
}>;

export type DecisionJournalSourceRegistration = Readonly<{
  sourceId: DecisionJournalSource;
  label: string;
  description: string;
}>;

export type DecisionJournalConfidenceRegistration = Readonly<{
  confidenceId: DecisionJournalConfidence;
  label: string;
  description: string;
  rank: number;
}>;

export type DecisionJournalMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type DecisionJournalFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type DecisionJournalValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type DecisionJournalValidationResult = Readonly<{
  valid: boolean;
  issues: readonly DecisionJournalValidationIssue[];
  readOnly: true;
}>;

export type DecisionJournalPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type DecisionJournalRegistrySnapshot = Readonly<{
  registryVersion: string;
  journalCount: number;
  journalIds: readonly DecisionJournalId[];
  statusTypeCount: number;
  sourceTypeCount: number;
  confidenceTypeCount: number;
  metadataExtensionCount: number;
  futureExtensionCount: number;
  readOnly: true;
}>;

export type DecisionJournalPlatformState = Readonly<{
  platformId: "decision-journal-platform";
  foundationVersion: string;
  contractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  journalCount: number;
  registeredJournalIds: readonly DecisionJournalId[];
  supportedStatuses: readonly DecisionJournalStatus[];
  supportedSources: readonly DecisionJournalSource[];
  supportedConfidenceLevels: readonly DecisionJournalConfidence[];
  timestamp: string;
  readOnly: true;
}>;

export type DecisionJournalFutureCompatibility = Readonly<{
  app8Ready: boolean;
  journalEngineReady: boolean;
  storageReady: boolean;
  visualizationReady: boolean;
  dashboardReady: boolean;
  assistantReady: boolean;
  analyticsReady: boolean;
  decisionTimelineLinkReady: boolean;
  scenarioTimelineConsumerReady: boolean;
  decisionTimelineConsumerReady: boolean;
  workspaceConsumerReady: boolean;
  readOnly: true;
  metadataOnly: true;
}>;

export type DecisionJournalPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  workspaceIsolationValid: boolean;
  journalIdentityValid: boolean;
  issues: readonly DecisionJournalValidationIssue[];
  readOnly: true;
}>;

export type DecisionJournalCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type DecisionJournalCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-8/1";
  contractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  checks: readonly DecisionJournalCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
