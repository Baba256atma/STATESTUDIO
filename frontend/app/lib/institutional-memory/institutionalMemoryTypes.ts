/** D9:2:1 — Institutional learning memory + organizational experience accumulation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";

export type MemoryCategory =
  | "fragility"
  | "escalation"
  | "governance"
  | "resilience"
  | "coordination"
  | "operational"
  | "strategic"
  | "recovery"
  | "unknown";

export type ExperienceSeverity = "low" | "medium" | "high" | "critical";

export type HistoricalOperationalEvent = {
  eventId: string;
  category: MemoryCategory;
  severity: ExperienceSeverity;
  label: string;
  observedAt: number;
};

export type InstitutionalMemoryRecord = {
  memoryId: string;
  category: MemoryCategory;
  severity: ExperienceSeverity;
  title: string;
  summary: string;
  observations: readonly string[];
  recordedAt: number;
  lastObservedAt: number;
  recurrenceCount: number;
};

export type OrganizationalExperience = {
  experienceId: string;
  category: MemoryCategory;
  severity: ExperienceSeverity;
  pattern: string;
  summary: string;
  relatedMemoryIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalLearningSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  memoryCount: number;
  experienceCount: number;
  historicalSummary: string;
  dominantCategories: readonly MemoryCategory[];
  recentMemories: readonly InstitutionalMemoryRecord[];
  recentExperiences: readonly OrganizationalExperience[];
  continuityConcernActive: boolean;
};

/** Optional D9:1 observation inputs (null-safe when layers are absent). */
export type EnterpriseCognitionObservationInput = {
  monitoringAlertActive?: boolean;
  driftDetected?: boolean;
  attentionFragmented?: boolean;
  escalationCount?: number;
  continuityDegraded?: boolean;
  patternRecurrenceDetected?: boolean;
  narrativePressureElevated?: boolean;
  pressureTopologyStressed?: boolean;
  resilienceForecastAtRisk?: boolean;
  unifiedCognitionSynchronized?: boolean;
};

export type InstitutionalMemoryAccumulationInput = {
  organizationId: string;
  cognitionSnapshot: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type InstitutionalMemoryStoreState = {
  records: readonly InstitutionalMemoryRecord[];
  experiences: readonly OrganizationalExperience[];
  events: readonly HistoricalOperationalEvent[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
