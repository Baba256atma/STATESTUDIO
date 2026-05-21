/** D9:2:10 — Unified enterprise institutional memory cognition runtime types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalMemoryIntegrationResult } from "./integrateInstitutionalMemoryWithCognition";
import type { EnterpriseCognitionObservationInput } from "./institutionalMemoryTypes";

export type InstitutionalSubsystemId =
  | "institutional_memory"
  | "experience_correlation"
  | "adaptation_intelligence"
  | "decision_outcomes"
  | "knowledge_distillation"
  | "historical_recall"
  | "maturity_tracking"
  | "wisdom_preservation"
  | "cognitive_governance";

export type MemoryRuntimeStatus =
  | "initializing"
  | "stable"
  | "degraded"
  | "unstable"
  | "recovering";

export type InstitutionalHealthLevel = "weak" | "moderate" | "strong" | "verified";

export type UnifiedLearningSummary = {
  primaryStrategicLesson: string;
  resilienceMaturity: string;
  organizationalWisdomState: string;
  cognitiveIntegrity: string;
  strategicMemoryContinuity: string;
};

export type SubsystemHealthRecord = {
  subsystemId: InstitutionalSubsystemId;
  active: boolean;
  healthy: boolean;
  signature: string;
};

export type OrganizationalWisdomState = {
  dominantContinuityLevel: string;
  artifactCount: number;
  anchorCount: number;
  summary: string;
};

export type InstitutionalLearningHealth = {
  level: InstitutionalHealthLevel;
  governanceStatus: string;
  layerDepth: number;
  activeSubsystemCount: number;
};

export type EnterpriseMemoryCognitionSnapshot = {
  snapshotId: string;
  organizationId: string;
  runtimeStatus: MemoryRuntimeStatus;
  institutionalHealth: InstitutionalHealthLevel;
  summary: UnifiedLearningSummary;
  activeSubsystems: readonly InstitutionalSubsystemId[];
  subsystemHealth: readonly SubsystemHealthRecord[];
  learningHealth: InstitutionalLearningHealth;
  wisdomState: OrganizationalWisdomState;
  generatedAt: number;
  signature: string;
};

export type UnifiedInstitutionalMemoryState = {
  organizationId: string;
  latestSnapshot: EnterpriseMemoryCognitionSnapshot | null;
  cognitionHistory: readonly EnterpriseMemoryCognitionSnapshot[];
  runtimeStatus: MemoryRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: MemoryRuntimeStatus | null;
};

export type UnifiedInstitutionalMemoryInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type UnifiedInstitutionalMemoryStoreState = {
  snapshots: readonly EnterpriseMemoryCognitionSnapshot[];
  runtimeStatus: MemoryRuntimeStatus;
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: MemoryRuntimeStatus | null;
};

export type UnifiedInstitutionalMemoryResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  integration: InstitutionalMemoryIntegrationResult | null;
  snapshot: EnterpriseMemoryCognitionSnapshot | null;
  state: UnifiedInstitutionalMemoryState | null;
  storeSignature: string;
  runtimeTransition?: {
    from: MemoryRuntimeStatus | null;
    to: MemoryRuntimeStatus;
  };
};
