/** F10:3 — Institutional strategic reflection + executive cognitive evolution types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../../governance/adaptiveGovernanceTypes";

export type ReasoningEvolution = "nascent" | "forming" | "maturing" | "sustained";

export type StrategicBehaviorPattern = "reactive" | "adaptive" | "disciplined" | "coordinated";

export type GovernanceMaturity = "nascent" | "developing" | "mature" | "strained";

export type ResilienceProgression = "fragile" | "strengthening" | "sustained" | "mature";

export type CoordinationEvolution = "fragmented" | "aligning" | "coordinated" | "institutional";

export type CognitiveEvolutionPosture =
  | "idle"
  | "observing"
  | "maturing"
  | "evolving"
  | "sustained"
  | "attention";

/** Canonical institutional strategic reflection contract (session-scoped, deterministic). */
export type InstitutionalStrategicReflection = {
  organizationId: string;
  reasoningEvolution: ReasoningEvolution;
  strategicBehaviorPatterns: StrategicBehaviorPattern;
  governanceMaturity: GovernanceMaturity;
  resilienceProgression: ResilienceProgression;
  adaptationSignals: readonly string[];
  executiveLearningIndicators: readonly string[];
  coordinationEvolution: CoordinationEvolution;
  institutionalStrengths: readonly string[];
  institutionalFragilities: readonly string[];
  strategicReflectionSummary: string;
  confidence: number;
  timestamp: number;
};

export type SynthesizeInstitutionalStrategicReflectionInput = {
  organizationId: string;
  intelligenceStack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type InstitutionalStrategicReflectionLayerSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  cognitiveEvolutionPosture: CognitiveEvolutionPosture;
  evolutionHeadline: string;
  evolutionSubline: string;
  strategicMaturityLine: string;
  resilienceEvolutionLine: string;
  organizationalLearningLine: string;
  timelineInstitutionalEvolutionLine: string;
  assistantInstitutionalReflectionLine: string;
  institutionalReflectionActive: boolean;
  cognitiveEvolutionActive: boolean;
  canonical: InstitutionalStrategicReflection | null;
  evolutionStable: boolean;
};

export const INSTITUTIONAL_STRATEGIC_REFLECTION_SYNC_EVENT =
  "nexora:institutional-strategic-reflection-sync" as const;
