/**
 * SVIE:4:8 — Scenario visual intelligence certification contract.
 */

export const SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG =
  "[SVIE:4_SCENARIO_VISUAL_INTELLIGENCE_CERTIFIED]" as const;

export const SVIE_PHASE4_COMPLETE_TAG = "[SVIE_PHASE4_COMPLETE]" as const;

export const SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION = "4.8.0" as const;

export const SVIE_CERTIFICATION_SCENARIO_LINK_LOG = "[SVIE][Certification][ScenarioLink]" as const;
export const SVIE_CERTIFICATION_FUTURE_STATE_LOG = "[SVIE][Certification][FutureState]" as const;
export const SVIE_CERTIFICATION_SCENARIO_DELTA_LOG = "[SVIE][Certification][ScenarioDelta]" as const;
export const SVIE_CERTIFICATION_SCENARIO_IMPACT_LOG = "[SVIE][Certification][ScenarioImpact]" as const;
export const SVIE_CERTIFICATION_SCENARIO_COMPARISON_LOG =
  "[SVIE][Certification][ScenarioComparison]" as const;
export const SVIE_CERTIFICATION_SCENARIO_CONFIDENCE_LOG =
  "[SVIE][Certification][ScenarioConfidence]" as const;
export const SVIE_CERTIFICATION_EXECUTIVE_FUTURE_STORY_LOG =
  "[SVIE][Certification][ExecutiveFutureStory]" as const;
export const SVIE_CERTIFICATION_PHASE4_SYNC_LOG = "[SVIE][Certification][Phase4Sync]" as const;
export const SVIE_CERTIFICATION_PHASE4_RENDER_LOG = "[SVIE][Certification][Phase4Render]" as const;
export const SVIE_CERTIFICATION_PHASE4_LIFECYCLE_LOG =
  "[SVIE][Certification][Phase4Lifecycle]" as const;
export const SVIE_CERTIFICATION_PHASE4_PERFORMANCE_LOG =
  "[SVIE][Certification][Phase4Performance]" as const;
export const SVIE_CERTIFICATION_PHASE4_EXECUTIVE_READY_LOG =
  "[SVIE][Certification][Phase4ExecutiveReady]" as const;

export type SvieScenarioVisualIntelligenceCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L";

export type SvieScenarioVisualIntelligenceCertificationGateStatus = "PASS" | "FAIL" | "WARN";

export type SvieScenarioVisualIntelligenceCertificationGate = Readonly<{
  id: SvieScenarioVisualIntelligenceCertificationGateId;
  name: string;
  status: SvieScenarioVisualIntelligenceCertificationGateStatus;
  detail: string;
  certificationLog: string;
}>;

export type SvieScenarioVisualIntelligenceCertificationResult = Readonly<{
  tag: typeof SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG;
  phaseCompleteTag: typeof SVIE_PHASE4_COMPLETE_TAG;
  version: typeof SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION;
  gates: readonly SvieScenarioVisualIntelligenceCertificationGate[];
  freezeTags: readonly string[];
  runtimeWarnings: readonly string[];
  certified: boolean;
  finalStatus: "PASS" | "PASS WITH WARNINGS" | "FAIL";
}>;

export const SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  SVIE_SCENARIO_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
  SVIE_PHASE4_COMPLETE_TAG,
]);

export const SVIE_PHASE4_FORBIDDEN_VISUAL_KEYS = Object.freeze([
  "position",
  "scale",
  "rotation",
  "transform",
  "x",
  "y",
  "z",
  "text",
  "label",
  "title",
  "percentage",
]);

export const SVIE_PHASE4_PERFORMANCE_OBJECT_COUNTS = Object.freeze([10, 50, 100, 250]);
