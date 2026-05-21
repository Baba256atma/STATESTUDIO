/** D9:7:1 — Autonomous executive consensus intelligence + enterprise multi-agent strategic cognition types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";

export type PerspectiveCategory =
  | "resilience"
  | "governance"
  | "operational_speed"
  | "recovery"
  | "coordination"
  | "foresight"
  | "risk"
  | "stability"
  | "unknown";

export type ConsensusStrength = "weak" | "partial" | "moderate" | "strong" | "executive_grade";

export type ConsensusState =
  | "fragmented"
  | "divergent"
  | "negotiating"
  | "converging"
  | "aligned";

export type ExecutiveReasoningPerspective = {
  perspectiveId: string;
  perspectiveCategory: PerspectiveCategory;
  perspectiveLabel: string;
  prioritySummary: string;
  perspectiveWeight: number;
  alignmentSignals: readonly string[];
  divergenceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicConsensusRecord = {
  consensusId: string;
  consensusState: ConsensusState;
  consensusStrength: ConsensusStrength;
  summary: string;
  alignedPerspectives: readonly PerspectiveCategory[];
  divergentPerspectives: readonly PerspectiveCategory[];
  consensusSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterprisePerspectiveConflict = {
  conflictId: string;
  conflictLabel: string;
  conflictSummary: string;
  primaryCategory: PerspectiveCategory;
  opposingCategory: PerspectiveCategory;
  conflictSeverity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type MultiAgentReasoningSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly PerspectiveCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type ConsensusAlignmentField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly PerspectiveCategory[];
  generatedAt: number;
};

export type DistributedCognitionSummary = {
  dominantConsensusState: ConsensusState;
  dominantConsensusStrength: ConsensusStrength;
  consensusHeadline: string;
  perspectiveDiversityPosture: "low" | "moderate" | "high";
};

export type StrategicConsensusSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: DistributedCognitionSummary;
  recentConsensusRecords: readonly StrategicConsensusRecord[];
  reasoningPerspectives: readonly ExecutiveReasoningPerspective[];
  perspectiveConflicts: readonly EnterprisePerspectiveConflict[];
  multiAgentSignals: readonly MultiAgentReasoningSignal[];
  alignmentFields: readonly ConsensusAlignmentField[];
};

export type ExecutiveConsensusIntelligenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveConsensusIntelligenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicConsensusSnapshot | null;
  newConsensusRecords: number;
  storeSignature: string;
};

export type ConsensusIntelligenceStoreState = {
  reasoningPerspectives: readonly ExecutiveReasoningPerspective[];
  consensusRecords: readonly StrategicConsensusRecord[];
  snapshots: readonly StrategicConsensusSnapshot[];
  perspectiveConflicts: readonly EnterprisePerspectiveConflict[];
  multiAgentSignals: readonly MultiAgentReasoningSignal[];
  alignmentFields: readonly ConsensusAlignmentField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastConsensusState: ConsensusState | null;
};
