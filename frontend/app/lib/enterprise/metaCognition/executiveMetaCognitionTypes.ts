/** F10:1 — Executive meta-cognition + enterprise strategic self-awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../governance/adaptiveGovernanceTypes";

export type ReasoningPath =
  | "observing"
  | "interpreting"
  | "advising"
  | "governing"
  | "reflecting";

export type UncertaintyLevel = "low" | "moderate" | "elevated" | "high";

export type ConfidenceEvolution = "forming" | "stable" | "strengthening" | "strained";

export type MetaCognitionPosture = "idle" | "observing" | "reflecting" | "transparent" | "attention";

/** Canonical executive meta-cognition contract (session-scoped, deterministic). */
export type ExecutiveMetaCognitionSnapshot = {
  organizationId: string;
  reasoningPath: ReasoningPath;
  supportingSignals: readonly string[];
  assumptions: readonly string[];
  uncertainty: UncertaintyLevel;
  confidenceEvolution: ConfidenceEvolution;
  governanceContext: string;
  advisoryLimits: readonly string[];
  strategicReflection: string;
  confidence: number;
  timestamp: number;
};

export type SynthesizeExecutiveMetaCognitionInput = {
  organizationId: string;
  governanceStack: AdaptiveGovernanceIntelligenceSnapshot;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type AutonomousExecutiveMetaCognitionLayerSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  metaCognitionPosture: MetaCognitionPosture;
  reflectionHeadline: string;
  reflectionSubline: string;
  reasoningPathLine: string;
  assumptionsLine: string;
  uncertaintyLine: string;
  confidenceEvolutionLine: string;
  advisoryLimitsLine: string;
  timelineReasoningLine: string;
  assistantMetaCognitionLine: string;
  executiveMetaCognitionActive: boolean;
  strategicSelfAwarenessActive: boolean;
  canonical: ExecutiveMetaCognitionSnapshot | null;
  reflectionStable: boolean;
};

export const AUTONOMOUS_EXECUTIVE_META_COGNITION_SYNC_EVENT =
  "nexora:autonomous-executive-meta-cognition-sync" as const;
