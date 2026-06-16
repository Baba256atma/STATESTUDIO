/**
 * SVIE:3:6 — Advisory visual intelligence certification contract.
 */

export const SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG =
  "[SVIE:3_ADVISORY_VISUAL_INTELLIGENCE_CERTIFIED]" as const;

export const SVIE_PHASE3_COMPLETE_TAG = "[SVIE_PHASE3_COMPLETE]" as const;

export const SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION = "3.6.0" as const;

export const SVIE_CERTIFICATION_ADVISORY_LINK_LOG = "[SVIE][Certification][AdvisoryLink]" as const;
export const SVIE_CERTIFICATION_CAUSE_CHAIN_LOG = "[SVIE][Certification][CauseChain]" as const;
export const SVIE_CERTIFICATION_RECOMMENDATION_LOG = "[SVIE][Certification][Recommendation]" as const;
export const SVIE_CERTIFICATION_CONFIDENCE_LOG = "[SVIE][Certification][Confidence]" as const;
export const SVIE_CERTIFICATION_EXECUTIVE_STORY_LOG = "[SVIE][Certification][ExecutiveStory]" as const;
export const SVIE_CERTIFICATION_PHASE3_SYNC_LOG = "[SVIE][Certification][Phase3Sync]" as const;
export const SVIE_CERTIFICATION_PHASE3_RENDER_LOG = "[SVIE][Certification][Phase3Render]" as const;
export const SVIE_CERTIFICATION_PHASE3_LIFECYCLE_LOG = "[SVIE][Certification][Phase3Lifecycle]" as const;
export const SVIE_CERTIFICATION_PHASE3_PERFORMANCE_LOG =
  "[SVIE][Certification][Phase3Performance]" as const;
export const SVIE_CERTIFICATION_PHASE3_EXECUTIVE_READY_LOG =
  "[SVIE][Certification][Phase3ExecutiveReady]" as const;

export type SvieAdvisoryVisualIntelligenceCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J";

export type SvieAdvisoryVisualIntelligenceCertificationGateStatus = "PASS" | "FAIL" | "WARN";

export type SvieAdvisoryVisualIntelligenceCertificationGate = Readonly<{
  id: SvieAdvisoryVisualIntelligenceCertificationGateId;
  name: string;
  status: SvieAdvisoryVisualIntelligenceCertificationGateStatus;
  detail: string;
  certificationLog: string;
}>;

export type SvieAdvisoryVisualIntelligenceCertificationResult = Readonly<{
  tag: typeof SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG;
  phaseCompleteTag: typeof SVIE_PHASE3_COMPLETE_TAG;
  version: typeof SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_VERSION;
  gates: readonly SvieAdvisoryVisualIntelligenceCertificationGate[];
  freezeTags: readonly string[];
  runtimeWarnings: readonly string[];
  certified: boolean;
  finalStatus: "PASS" | "PASS WITH WARNINGS" | "FAIL";
}>;

export const SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  SVIE_ADVISORY_VISUAL_INTELLIGENCE_CERTIFICATION_TAG,
  SVIE_PHASE3_COMPLETE_TAG,
]);

export const SVIE_PHASE3_FORBIDDEN_VISUAL_KEYS = Object.freeze([
  "position",
  "scale",
  "rotation",
  "transform",
  "x",
  "y",
  "z",
  "confidence",
  "text",
]);

export const SVIE_PHASE3_PERFORMANCE_OBJECT_COUNTS = Object.freeze([10, 50, 100, 250]);
