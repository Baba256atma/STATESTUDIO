/** D9:4:1 — Executive strategic foresight + enterprise anticipatory cognition types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { MultiTimelineSnapshot } from "../temporal-cognition/multiTimelineTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type ForesightCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "resilience"
  | "operational"
  | "coordination"
  | "recovery"
  | "strategic"
  | "unknown";

export type EmergenceLevel = "weak" | "developing" | "strengthening" | "significant";

export type ForesightState =
  | "emerging"
  | "accumulating"
  | "intensifying"
  | "stabilizing"
  | "dissipating";

export type ForesightConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type EmergingStrategicSignal = {
  foresightId: string;
  category: ForesightCategory;
  emergenceLevel: EmergenceLevel;
  foresightState: ForesightState;
  summary: string;
  weakSignals: readonly string[];
  confidence: number;
  confidenceLevel: ForesightConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type WeakSignalDetection = {
  detectionId: string;
  category: ForesightCategory;
  signalLabel: string;
  signalSummary: string;
  emergenceLevel: EmergenceLevel;
  confidence: number;
  generatedAt: number;
};

export type AnticipatoryOperationalPattern = {
  patternId: string;
  category: ForesightCategory;
  patternLabel: string;
  patternSummary: string;
  linkedForesightIds: readonly string[];
  emergenceLevel: EmergenceLevel;
  generatedAt: number;
};

export type StrategicPressureEmergence = {
  emergenceId: string;
  category: ForesightCategory;
  pressureSummary: string;
  pressureSignals: readonly string[];
  emergenceLevel: EmergenceLevel;
  generatedAt: number;
};

export type OrganizationalFutureIndicator = {
  indicatorId: string;
  category: ForesightCategory;
  indicatorLabel: string;
  trajectoryHint: string;
  foresightState: ForesightState;
  confidence: number;
  generatedAt: number;
};

export type ForesightAwarenessSummary = {
  dominantCategory: ForesightCategory;
  dominantEmergenceLevel: EmergenceLevel;
  dominantForesightState: ForesightState;
  anticipatoryHeadline: string;
  preEscalationRisk: "low" | "moderate" | "elevated";
  resilienceEmergence: "weakening" | "neutral" | "strengthening";
};

export type EnterpriseForesightSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  signalCount: number;
  awarenessSummary: ForesightAwarenessSummary;
  recentEmergingSignals: readonly EmergingStrategicSignal[];
  weakSignalDetections: readonly WeakSignalDetection[];
  anticipatoryPatterns: readonly AnticipatoryOperationalPattern[];
  pressureEmergences: readonly StrategicPressureEmergence[];
  futureIndicators: readonly OrganizationalFutureIndicator[];
};

export type ExecutiveStrategicForesightInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  divergenceSnapshot?: MultiTimelineSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  pressureTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveStrategicForesightResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseForesightSnapshot | null;
  newEmergingSignals: number;
  storeSignature: string;
};

export type ForesightCognitionStoreState = {
  emergingSignals: readonly EmergingStrategicSignal[];
  snapshots: readonly EnterpriseForesightSnapshot[];
  weakSignalDetections: readonly WeakSignalDetection[];
  anticipatoryPatterns: readonly AnticipatoryOperationalPattern[];
  pressureEmergences: readonly StrategicPressureEmergence[];
  futureIndicators: readonly OrganizationalFutureIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
