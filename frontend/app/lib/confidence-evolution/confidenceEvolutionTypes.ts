/**
 * APP-9:1 — Confidence Evolution Platform domain types.
 * Immutable contract vocabulary — no storage, visualization, or execution.
 */

import type {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";

export type ConfidenceRecordId = string;
export type ConfidenceEvolutionId = string;
export type ConfidenceWorkspaceId = string;
export type DecisionId = string;
export type ScenarioId = string;
export type JournalEntryId = string;

export type ConfidenceCertificationStatus = "pending" | "pass" | "fail";
export type ConfidenceFreezeState = "open" | "frozen";
export type ConfidenceArchitectureStatus = "build" | "certified";

export type ConfidenceLevel = (typeof CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS)[number];
export type ConfidenceSource = (typeof CONFIDENCE_EVOLUTION_SOURCE_KEYS)[number];
export type ConfidenceChangeReason = (typeof CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS)[number];

export type ConfidenceEvolutionPlatformIdentity = Readonly<{
  appId: "APP-9";
  title: "Confidence Evolution";
  platformId: "confidence-evolution-platform";
  version: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  status: ConfidenceArchitectureStatus;
  certificationStatus: ConfidenceCertificationStatus;
  freezeState: ConfidenceFreezeState;
  architectureVersion: string;
}>;

export type ConfidenceEvolutionMetadata = Readonly<{
  metadataVersion: string;
  owner?: string;
  extensions: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type ConfidenceRecord = Readonly<{
  id: ConfidenceRecordId;
  workspaceId: ConfidenceWorkspaceId;
  decisionId?: DecisionId;
  scenarioId?: ScenarioId;
  journalEntryId?: JournalEntryId;
  title: string;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  source: ConfidenceSource;
  reason: ConfidenceChangeReason;
  notes: string;
  evidenceReferences: readonly string[];
  previousConfidence?: ConfidenceLevel;
  metadata: ConfidenceEvolutionMetadata;
  createdAt: string;
  updatedAt: string;
  version: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  readOnly: true;
}>;

export type ConfidenceEvolutionRegistration = Readonly<{
  evolutionId: ConfidenceEvolutionId;
  workspaceId: ConfidenceWorkspaceId;
  label: string;
  description: string;
  registeredAt: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionRegistrationInput = Readonly<{
  evolutionId: ConfidenceEvolutionId;
  workspaceId: ConfidenceWorkspaceId;
  label: string;
  description: string;
}>;

export type ConfidenceLevelRegistration = Readonly<{
  levelId: ConfidenceLevel;
  label: string;
  description: string;
  rank: number;
}>;

export type ConfidenceSourceRegistration = Readonly<{
  sourceId: ConfidenceSource;
  label: string;
  description: string;
}>;

export type ConfidenceChangeReasonRegistration = Readonly<{
  reasonId: ConfidenceChangeReason;
  label: string;
  description: string;
}>;

export type ConfidenceEvolutionMetadataExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  description: string;
}>;

export type ConfidenceEvolutionFutureExtensionRegistration = Readonly<{
  extensionId: string;
  label: string;
  phaseKey: string;
}>;

export type ConfidenceEvolutionValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionValidationResult = Readonly<{
  valid: boolean;
  issues: readonly ConfidenceEvolutionValidationIssue[];
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformResult<T> = Readonly<{
  success: boolean;
  reason: string;
  data: T | null;
  readOnly: true;
}>;

export type ConfidenceEvolutionRegistrySnapshot = Readonly<{
  registryVersion: string;
  evolutionCount: number;
  evolutionIds: readonly ConfidenceEvolutionId[];
  confidenceLevelCount: number;
  sourceCount: number;
  changeReasonCount: number;
  metadataExtensionCount: number;
  futureExtensionCount: number;
  readOnly: true;
}>;

export type ConfidenceEvolutionPlatformState = Readonly<{
  platformId: "confidence-evolution-platform";
  foundationVersion: string;
  contractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  initialized: boolean;
  evolutionCount: number;
  registeredEvolutionIds: readonly ConfidenceEvolutionId[];
  supportedConfidenceLevels: readonly ConfidenceLevel[];
  supportedSources: readonly ConfidenceSource[];
  supportedChangeReasons: readonly ConfidenceChangeReason[];
  timestamp: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionFutureCompatibility = Readonly<{
  app9Ready: boolean;
  evolutionEngineReady: boolean;
  trendEngineReady: boolean;
  storageReady: boolean;
  visualizationReady: boolean;
  dashboardReady: boolean;
  assistantReady: boolean;
  decisionJournalLinkReady: boolean;
  decisionTimelineLinkReady: boolean;
  scenarioTimelineConsumerReady: boolean;
  workspaceConsumerReady: boolean;
  readOnly: true;
  metadataOnly: true;
}>;

export type ConfidenceEvolutionPlatformValidationReport = Readonly<{
  valid: boolean;
  platformInitialized: boolean;
  registryValid: boolean;
  manifestValid: boolean;
  compatibilityValid: boolean;
  workspaceIsolationValid: boolean;
  evolutionIdentityValid: boolean;
  issues: readonly ConfidenceEvolutionValidationIssue[];
  readOnly: true;
}>;

export type ConfidenceEvolutionCertificationCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ConfidenceEvolutionCertificationResult = Readonly<{
  certified: boolean;
  phase: "APP-9/1";
  contractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  checks: readonly ConfidenceEvolutionCertificationCheck[];
  checkCount: number;
  passedCount: number;
  failedCount: number;
  timestamp: string;
  readOnly: true;
}>;
