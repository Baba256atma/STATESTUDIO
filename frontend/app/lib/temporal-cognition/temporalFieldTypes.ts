/** D9:3:9 — Strategic organizational time-field + enterprise long-horizon awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { OrganizationalContinuitySnapshot } from "../institutional-memory/institutionalContinuityTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { InstitutionalTemporalSyncSnapshot } from "./temporalMemorySyncTypes";
import type { TemporalCompressionSnapshot } from "./temporalCompressionTypes";
import type { OrganizationalReplaySnapshot } from "./operationalReplayTypes";
import type { StrategicAlignmentSnapshot } from "./temporalConvergenceTypes";

export type FieldCategory =
  | "fragility"
  | "resilience"
  | "governance"
  | "escalation"
  | "operational"
  | "coordination"
  | "recovery"
  | "strategic"
  | "unknown";

export type FieldStrength = "weak" | "moderate" | "strong" | "foundational";

export type HorizonState =
  | "short_term"
  | "medium_term"
  | "long_term"
  | "institutional"
  | "structural";

export type FieldConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type OrganizationalTimeField = {
  temporalFieldId: string;
  category: FieldCategory;
  fieldStrength: FieldStrength;
  horizonState: HorizonState;
  summary: string;
  fieldSignals: readonly string[];
  confidence: number;
  confidenceLevel: FieldConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseLongHorizonPattern = {
  patternId: string;
  category: FieldCategory;
  fieldStrength: FieldStrength;
  horizonState: HorizonState;
  patternLabel: string;
  patternSummary: string;
  linkedFieldIds: readonly string[];
  confidence: number;
  generatedAt: number;
};

export type StrategicTemporalField = {
  fieldKey: string;
  category: FieldCategory;
  fieldLabel: string;
  structuralSummary: string;
  horizonState: HorizonState;
  fieldIds: readonly string[];
  generatedAt: number;
};

export type OperationalEraEvolution = {
  eraId: string;
  category: FieldCategory;
  eraLabel: string;
  evolutionSummary: string;
  eraSignals: readonly string[];
  horizonState: HorizonState;
  generatedAt: number;
};

export type InstitutionalContinuityField = {
  continuityFieldId: string;
  category: FieldCategory;
  continuityLevel: string;
  fieldStrength: FieldStrength;
  continuitySummary: string;
  linkedFieldIds: readonly string[];
  generatedAt: number;
};

export type LongHorizonContinuitySignal = {
  signalId: string;
  category: FieldCategory;
  fieldStrength: FieldStrength;
  summary: string;
  confidence: number;
  generatedAt: number;
};

export type LongHorizonAwarenessSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  fieldCount: number;
  horizonSummary: string;
  dominantCategory: FieldCategory;
  dominantFieldStrength: FieldStrength;
  dominantHorizonState: HorizonState;
  recentTimeFields: readonly OrganizationalTimeField[];
  longHorizonPatterns: readonly EnterpriseLongHorizonPattern[];
  strategicTemporalFields: readonly StrategicTemporalField[];
  eraEvolutions: readonly OperationalEraEvolution[];
  continuityFields: readonly InstitutionalContinuityField[];
  continuitySignals: readonly LongHorizonContinuitySignal[];
};

export type StrategicTimeFieldInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  syncSnapshot?: InstitutionalTemporalSyncSnapshot | null;
  compressionSnapshot?: TemporalCompressionSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  continuitySnapshot?: OrganizationalContinuitySnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type StrategicTimeFieldResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: LongHorizonAwarenessSnapshot | null;
  newTimeFields: number;
  storeSignature: string;
};

export type TemporalFieldStoreState = {
  timeFields: readonly OrganizationalTimeField[];
  snapshots: readonly LongHorizonAwarenessSnapshot[];
  longHorizonPatterns: readonly EnterpriseLongHorizonPattern[];
  strategicTemporalFields: readonly StrategicTemporalField[];
  eraEvolutions: readonly OperationalEraEvolution[];
  continuityFields: readonly InstitutionalContinuityField[];
  continuitySignals: readonly LongHorizonContinuitySignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
