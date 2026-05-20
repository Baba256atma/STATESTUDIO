/** F9:5 — Strategic adaptation governance + organizational evolution cognition types. */

import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";
import type { InstitutionalCognitionConvergenceInput } from "../adaptiveGovernanceTypes";
import type { AdaptiveStrategicCalibration } from "../calibration/adaptiveStrategicCalibrationTypes";
import type { EnterpriseStrategicCoherence } from "../coherence/enterpriseStrategicCoherenceTypes";
import type { StrategicPressureGovernance } from "../pressure/strategicPressureGovernanceTypes";

export type TransformationContinuity = "fragmented" | "forming" | "sustained" | "coherent";

export type AdaptationGovernanceMaturity = "nascent" | "developing" | "mature" | "strained";

export type ResilienceEvolution = "reactive" | "adaptive" | "sustained" | "mature";

export type StrategicTransformation = "nascent" | "progressing" | "sustained" | "disrupted";

export type OperationalAdaptation = "forming" | "coordinated" | "synchronized" | "strained";

export type CoordinationEvolution = "fragmented" | "adapting" | "aligned" | "mature";

export type InstitutionalProgression = "early" | "developing" | "mature" | "strained";

export type AdaptationGovernancePosture =
  | "idle"
  | "observing"
  | "adapting"
  | "evolving"
  | "progressive"
  | "attention";

/** Canonical institutional strategic adaptation governance contract. */
export type InstitutionalStrategicAdaptationGovernance = {
  organizationId: string;
  transformationContinuity: TransformationContinuity;
  adaptationGovernance: AdaptationGovernanceMaturity;
  resilienceEvolution: ResilienceEvolution;
  strategicTransformation: StrategicTransformation;
  operationalAdaptation: OperationalAdaptation;
  coordinationEvolution: CoordinationEvolution;
  institutionalProgression: InstitutionalProgression;
  confidence: number;
  timestamp: number;
};

export type SynthesizeInstitutionalStrategicAdaptationGovernanceInput = {
  organizationId: string;
  institutional: InstitutionalCognitionConvergenceInput | null;
  adaptiveGovernance: AdaptiveGovernanceCognition | null;
  strategicCoherence: EnterpriseStrategicCoherence | null;
  strategicCalibration: AdaptiveStrategicCalibration | null;
  strategicPressure: StrategicPressureGovernance | null;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
  governanceOversightActive: boolean;
  enterpriseCoherenceActive: boolean;
  strategicCalibrationActive: boolean;
  executiveStabilityActive: boolean;
  pressureGovernanceActive: boolean;
};

export type InstitutionalStrategicAdaptationGovernanceSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  adaptationPosture: AdaptationGovernancePosture;
  evolutionHeadline: string;
  evolutionSubline: string;
  transformationContinuityLine: string;
  adaptationGovernanceLine: string;
  operationalEvolutionLine: string;
  timelineTransformationLine: string;
  assistantAdaptationLine: string;
  organizationalEvolutionActive: boolean;
  adaptationGovernanceActive: boolean;
  canonical: InstitutionalStrategicAdaptationGovernance | null;
  evolutionStable: boolean;
};

export const INSTITUTIONAL_STRATEGIC_ADAPTATION_GOVERNANCE_SYNC_EVENT =
  "nexora:institutional-strategic-adaptation-governance-sync" as const;
