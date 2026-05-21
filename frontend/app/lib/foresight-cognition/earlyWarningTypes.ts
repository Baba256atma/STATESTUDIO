/** D9:4:3 — Executive pre-escalation awareness + strategic organizational early warning types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type WarningCategory =
  | "fragility_accumulation"
  | "escalation_precursor"
  | "governance_delay"
  | "coordination_instability"
  | "resilience_erosion"
  | "operational_pressure"
  | "systemic_instability"
  | "unknown";

export type WarningSeverity = "low" | "moderate" | "elevated" | "critical";

export type EscalationState = "dormant" | "emerging" | "intensifying" | "unstable" | "spreading";

export type EarlyWarningConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type PreEscalationSignal = {
  warningId: string;
  category: WarningCategory;
  warningSeverity: WarningSeverity;
  escalationState: EscalationState;
  summary: string;
  warningSignals: readonly string[];
  confidence: number;
  confidenceLevel: EarlyWarningConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalWarningPattern = {
  patternId: string;
  category: WarningCategory;
  patternLabel: string;
  patternSummary: string;
  linkedWarningIds: readonly string[];
  warningSeverity: WarningSeverity;
  generatedAt: number;
};

export type EscalationPrecursorField = {
  fieldId: string;
  category: WarningCategory;
  fieldLabel: string;
  precursorSummary: string;
  warningSignals: readonly string[];
  escalationState: EscalationState;
  generatedAt: number;
};

export type StrategicInstabilityIndicator = {
  indicatorId: string;
  category: WarningCategory;
  indicatorLabel: string;
  instabilityHint: string;
  warningSeverity: WarningSeverity;
  confidence: number;
  generatedAt: number;
};

export type EarlyWarningAwarenessSummary = {
  dominantCategory: WarningCategory;
  dominantWarningSeverity: WarningSeverity;
  dominantEscalationState: EscalationState;
  warningHeadline: string;
  preEscalationRisk: "low" | "moderate" | "elevated" | "critical";
};

export type EnterpriseEarlyWarningSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  warningCount: number;
  awarenessSummary: EarlyWarningAwarenessSummary;
  recentPreEscalationSignals: readonly PreEscalationSignal[];
  warningPatterns: readonly OrganizationalWarningPattern[];
  precursorFields: readonly EscalationPrecursorField[];
  instabilityIndicators: readonly StrategicInstabilityIndicator[];
};

export type ExecutiveEarlyWarningInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  pressureTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveEarlyWarningResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseEarlyWarningSnapshot | null;
  newPreEscalationSignals: number;
  storeSignature: string;
};

export type EarlyWarningStoreState = {
  preEscalationSignals: readonly PreEscalationSignal[];
  snapshots: readonly EnterpriseEarlyWarningSnapshot[];
  warningPatterns: readonly OrganizationalWarningPattern[];
  precursorFields: readonly EscalationPrecursorField[];
  instabilityIndicators: readonly StrategicInstabilityIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
