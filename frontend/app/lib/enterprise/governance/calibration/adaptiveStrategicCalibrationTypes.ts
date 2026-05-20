/** F9:3 — Adaptive strategic calibration + institutional decision quality types. */

import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";
import type { EnterpriseStrategicCoherence } from "../coherence/enterpriseStrategicCoherenceTypes";

export type DecisionQuality = "emerging" | "developing" | "refined" | "strained";

export type StrategicAdjustmentPattern = "reactive" | "corrective" | "adaptive" | "proactive";

export type AdaptationEffectiveness = "weak" | "forming" | "effective" | "sustained";

export type ResilienceDecisionEvolution = "fragile" | "forming" | "maturing" | "consistent";

export type GovernanceCorrectionQuality = "unstable" | "forming" | "stable" | "mature";

export type OperationalRefinement = "nascent" | "developing" | "mature" | "degraded";

export type InstitutionalLearningStrength = "weak" | "forming" | "strong" | "embedded";

export type CalibrationPosture =
  | "idle"
  | "observing"
  | "refining"
  | "calibrating"
  | "adaptive"
  | "attention";

/** Canonical adaptive strategic calibration contract (session-scoped, deterministic). */
export type AdaptiveStrategicCalibration = {
  organizationId: string;
  decisionQuality: DecisionQuality;
  strategicAdjustmentPatterns: StrategicAdjustmentPattern;
  adaptationEffectiveness: AdaptationEffectiveness;
  resilienceDecisionEvolution: ResilienceDecisionEvolution;
  governanceCorrectionQuality: GovernanceCorrectionQuality;
  operationalRefinement: OperationalRefinement;
  institutionalLearningStrength: InstitutionalLearningStrength;
  confidence: number;
  timestamp: number;
};

export type SynthesizeAdaptiveStrategicCalibrationInput = {
  organizationId: string;
  adaptiveGovernance: AdaptiveGovernanceCognition | null;
  strategicCoherence: EnterpriseStrategicCoherence | null;
  enterpriseCoherenceActive: boolean;
  governanceOversightActive: boolean;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type AdaptiveStrategicCalibrationSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  calibrationPosture: CalibrationPosture;
  calibrationHeadline: string;
  calibrationSubline: string;
  decisionQualityLine: string;
  operationalCorrectionLine: string;
  refinementInterpretationLine: string;
  timelineCalibrationLine: string;
  assistantCalibrationLine: string;
  strategicCalibrationActive: boolean;
  decisionQualityCognitionActive: boolean;
  canonical: AdaptiveStrategicCalibration | null;
  calibrationStable: boolean;
};

export const ADAPTIVE_STRATEGIC_CALIBRATION_SYNC_EVENT =
  "nexora:adaptive-strategic-calibration-sync" as const;
