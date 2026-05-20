/** F9:4 — Strategic pressure governance + executive stability cognition types. */

import type { AdaptiveGovernanceCognition } from "../adaptiveGovernanceTypes";
import type { AdaptiveStrategicCalibration } from "../calibration/adaptiveStrategicCalibrationTypes";
import type { EnterpriseStrategicCoherence } from "../coherence/enterpriseStrategicCoherenceTypes";

export type OperationalPressure = "low" | "moderate" | "elevated" | "critical";

export type EscalationGovernanceStability = "avoidant" | "forming" | "contained" | "disciplined";

export type ExecutiveStability = "fragile" | "forming" | "stable" | "composed";

export type ResilienceContinuity = "broken" | "forming" | "sustained" | "mature";

export type CoordinationStressHandling = "fragmented" | "adapting" | "coordinated" | "resilient";

export type StabilizationMaturity = "nascent" | "developing" | "mature" | "strained";

export type StrategicComposure = "reactive" | "forming" | "steady" | "composed";

export type PressureGovernancePosture =
  | "idle"
  | "monitoring"
  | "stabilizing"
  | "composed"
  | "resilient"
  | "attention";

/** Canonical strategic pressure governance contract (session-scoped, deterministic). */
export type StrategicPressureGovernance = {
  organizationId: string;
  operationalPressure: OperationalPressure;
  escalationGovernance: EscalationGovernanceStability;
  executiveStability: ExecutiveStability;
  resilienceContinuity: ResilienceContinuity;
  coordinationStressHandling: CoordinationStressHandling;
  stabilizationMaturity: StabilizationMaturity;
  strategicComposure: StrategicComposure;
  confidence: number;
  timestamp: number;
};

export type SynthesizeStrategicPressureGovernanceInput = {
  organizationId: string;
  adaptiveGovernance: AdaptiveGovernanceCognition | null;
  strategicCoherence: EnterpriseStrategicCoherence | null;
  strategicCalibration: AdaptiveStrategicCalibration | null;
  fragilityElevated: boolean;
  governanceOversightActive: boolean;
  strategicCalibrationActive: boolean;
  enterpriseCoherenceActive: boolean;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
};

export type InstitutionalStrategicPressureGovernanceSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  pressurePosture: PressureGovernancePosture;
  stabilityHeadline: string;
  stabilitySubline: string;
  executiveStabilityLine: string;
  escalationGovernanceLine: string;
  pressureStabilizationLine: string;
  timelineStabilityLine: string;
  assistantStabilityLine: string;
  executiveStabilityActive: boolean;
  pressureGovernanceActive: boolean;
  canonical: StrategicPressureGovernance | null;
  stabilityStable: boolean;
};

export const INSTITUTIONAL_STRATEGIC_PRESSURE_GOVERNANCE_SYNC_EVENT =
  "nexora:institutional-strategic-pressure-governance-sync" as const;
