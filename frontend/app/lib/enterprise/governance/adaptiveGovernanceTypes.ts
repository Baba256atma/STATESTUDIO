/** F9:1 — Adaptive governance intelligence + strategic oversight cognition types. */

import type {
  AdaptiveStrategicCalibrationSnapshot,
  CalibrationPosture,
} from "./calibration/adaptiveStrategicCalibrationTypes";
import type {
  InstitutionalStrategicAdaptationGovernanceSnapshot,
  AdaptationGovernancePosture,
} from "./adaptation/strategicAdaptationGovernanceTypes";
import type {
  UnifiedAdaptiveGovernanceRuntimeSnapshot,
  EvolutionConvergencePosture,
} from "./runtime/unifiedAdaptiveGovernanceTypes";
import type {
  AutonomousExecutiveMetaCognitionLayerSnapshot,
  MetaCognitionPosture,
} from "../metaCognition/executiveMetaCognitionTypes";
import type {
  InstitutionalStrategicReflectionLayerSnapshot,
  CognitiveEvolutionPosture,
} from "../metaCognition/reflection/institutionalStrategicReflectionTypes";
import type {
  AutonomousStrategicForesightLayerSnapshot,
  StrategicForesightPosture,
} from "../metaCognition/foresight/institutionalFutureStateTypes";
import type {
  UnifiedStrategicConsciousnessRuntimeSnapshot,
  MetaIntelligencePosture,
} from "../metaCognition/consciousness/unifiedStrategicConsciousnessTypes";
import type {
  AutonomousInstitutionalIntelligenceRuntimeSnapshot,
  InstitutionalIntelligencePosture,
} from "../metaCognition/institutionalRuntime/enterpriseCognitiveRuntimeTypes";
import type {
  InstitutionalStrategicPressureGovernanceSnapshot,
  PressureGovernancePosture,
} from "./pressure/strategicPressureGovernanceTypes";
import type {
  CoherencePosture,
  StrategicAlignmentIntegritySnapshot,
} from "./coherence/enterpriseStrategicCoherenceTypes";

/** Optional F8 institutional convergence inputs (null-safe when F8 is absent). */
export type InstitutionalCognitionConvergenceInput = {
  historicalCognitionActive?: boolean;
  behavioralLearningActive?: boolean;
  resilienceEvolutionActive?: boolean;
  strategicEvolutionActive?: boolean;
  cognitiveCultureActive?: boolean;
  enterpriseEvolutionActive?: boolean;
  institutionalCognitionConverged?: boolean;
  convergenceDepth?: number;
};

export type GovernanceStability = "fragile" | "forming" | "stable" | "strained";

export type StrategicAlignment = "misaligned" | "forming" | "tracking" | "aligned";

export type OperationalDiscipline = "nascent" | "developing" | "mature" | "degraded";

export type ResilienceGovernance = "reactive" | "adaptive" | "consistent" | "strained";

export type EscalationGovernance = "avoidant" | "balanced" | "disciplined" | "elevated";

export type AdaptationConsistency = "fragmented" | "forming" | "coherent" | "sustained";

export type InstitutionalCoherence = "fragmenting" | "forming" | "coherent" | "stable";

export type GovernanceOversightPosture =
  | "idle"
  | "observing"
  | "calibrating"
  | "synchronized"
  | "oversight_active"
  | "attention";

/** Canonical adaptive governance cognition contract (session-scoped, deterministic). */
export type AdaptiveGovernanceCognition = {
  organizationId: string;
  governanceStability: GovernanceStability;
  strategicAlignment: StrategicAlignment;
  operationalDiscipline: OperationalDiscipline;
  resilienceGovernance: ResilienceGovernance;
  escalationGovernance: EscalationGovernance;
  adaptationConsistency: AdaptationConsistency;
  institutionalCoherence: InstitutionalCoherence;
  confidence: number;
  timestamp: number;
};

export type SynthesizeAdaptiveGovernanceCognitionInput = {
  organizationId: string;
  institutional: InstitutionalCognitionConvergenceInput | null;
  continuityPreserved: boolean;
  cognitionConverged: boolean;
  fragilityElevated: boolean;
};

export type AdaptiveGovernanceIntelligenceSnapshot = {
  signature: string;
  enabled: boolean;
  hydrated: boolean;
  visible: boolean;
  oversightPosture: GovernanceOversightPosture;
  governanceHeadline: string;
  governanceSubline: string;
  oversightInterpretationLine: string;
  selfCalibrationLine: string;
  strategicAlignmentLine: string;
  timelineGovernanceLine: string;
  assistantGovernanceLine: string;
  governanceOversightActive: boolean;
  enterpriseSelfCalibrationActive: boolean;
  canonical: AdaptiveGovernanceCognition | null;
  governanceStable: boolean;
  /** F9:2 — strategic alignment integrity + enterprise coherence */
  coherencePosture: CoherencePosture;
  coherenceHeadline: string;
  coherenceSubline: string;
  alignmentIntegrityLine: string;
  operationalHarmonyLine: string;
  fragmentationAwarenessLine: string;
  timelineCoherenceLine: string;
  assistantCoherenceLine: string;
  enterpriseCoherenceActive: boolean;
  strategicAlignmentIntegrityActive: boolean;
  strategicCoherence: StrategicAlignmentIntegritySnapshot | null;
  /** F9:3 — adaptive strategic calibration + decision quality cognition */
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
  strategicCalibration: AdaptiveStrategicCalibrationSnapshot | null;
  /** F9:4 — strategic pressure governance + executive stability */
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
  strategicPressureGovernance: InstitutionalStrategicPressureGovernanceSnapshot | null;
  /** F9:5 — strategic adaptation governance + organizational evolution */
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
  strategicAdaptationGovernance: InstitutionalStrategicAdaptationGovernanceSnapshot | null;
  /** F9:6 — unified adaptive governance runtime + institutional strategic evolution */
  evolutionConvergencePosture: EvolutionConvergencePosture;
  unifiedGovernanceHeadline: string;
  unifiedGovernanceSubline: string;
  strategicEvolutionLine: string;
  selfRegulationLine: string;
  timelineStrategicEvolutionLine: string;
  assistantUnifiedGovernanceLine: string;
  unifiedGovernanceRuntimeActive: boolean;
  institutionalStrategicEvolutionConverged: boolean;
  unifiedAdaptiveGovernanceRuntime: UnifiedAdaptiveGovernanceRuntimeSnapshot | null;
  /** F10:1 — executive meta-cognition + strategic self-awareness */
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
  autonomousExecutiveMetaCognition: AutonomousExecutiveMetaCognitionLayerSnapshot | null;
  /** F10:3 — institutional strategic reflection + cognitive evolution */
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
  institutionalStrategicReflection: InstitutionalStrategicReflectionLayerSnapshot | null;
  /** F10:4 — autonomous strategic foresight + future-state intelligence */
  strategicForesightPosture: StrategicForesightPosture;
  foresightHeadline: string;
  foresightSubline: string;
  trajectoryLine: string;
  resilienceForecastLine: string;
  strategicTimingLine: string;
  uncertaintyFactorsLine: string;
  timelineFutureStateLine: string;
  assistantStrategicForesightLine: string;
  strategicForesightActive: boolean;
  futureStateIntelligenceActive: boolean;
  autonomousStrategicForesight: AutonomousStrategicForesightLayerSnapshot | null;
  /** F10:5 — unified strategic consciousness + enterprise meta-intelligence */
  metaIntelligencePosture: MetaIntelligencePosture;
  consciousnessHeadline: string;
  consciousnessSubline: string;
  cognitionIntegrityLine: string;
  continuityHealthLine: string;
  crossLayerSyncLine: string;
  executiveAttentionLine: string;
  timelineStrategicContinuityLine: string;
  assistantMetaIntelligenceLine: string;
  unifiedStrategicConsciousnessActive: boolean;
  enterpriseMetaIntelligenceActive: boolean;
  unifiedStrategicConsciousness: UnifiedStrategicConsciousnessRuntimeSnapshot | null;
  /** F10:6 — autonomous institutional intelligence + final enterprise cognitive runtime */
  institutionalIntelligencePosture: InstitutionalIntelligencePosture;
  institutionalHeadline: string;
  institutionalSubline: string;
  synchronizationHealthLine: string;
  adaptationContinuityLine: string;
  executiveCognitionSyncLine: string;
  timelineInstitutionalContinuityLine: string;
  assistantInstitutionalIntelligenceLine: string;
  autonomousInstitutionalIntelligenceActive: boolean;
  enterpriseCognitiveRuntimeComplete: boolean;
  autonomousInstitutionalIntelligence: AutonomousInstitutionalIntelligenceRuntimeSnapshot | null;
};

export const ADAPTIVE_GOVERNANCE_INTELLIGENCE_SYNC_EVENT =
  "nexora:adaptive-governance-intelligence-sync" as const;
