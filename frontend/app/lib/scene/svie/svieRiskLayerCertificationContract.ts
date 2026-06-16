/**
 * SVIE:2:4 — Risk layer certification contract.
 *
 * Certification only — validates SVIE:2:1, 2:2, and 2:3 without introducing features.
 */

export const SVIE_RISK_LAYER_CERTIFICATION_TAG = "[SVIE:2_RISK_LAYER_CERTIFIED]" as const;

export const SVIE_PHASE2_COMPLETE_TAG = "[SVIE_PHASE2_COMPLETE]" as const;

export const SVIE_RISK_LAYER_CERTIFICATION_VERSION = "2.4.0" as const;

export const SVIE_CERTIFICATION_RISK_RUNTIME_LOG = "[SVIE][Certification][RiskRuntime]" as const;
export const SVIE_CERTIFICATION_HOTSPOT_LOG = "[SVIE][Certification][Hotspot]" as const;
export const SVIE_CERTIFICATION_EXECUTIVE_ATTENTION_LOG =
  "[SVIE][Certification][ExecutiveAttention]" as const;
export const SVIE_CERTIFICATION_SYNC_LOG = "[SVIE][Certification][Sync]" as const;
export const SVIE_CERTIFICATION_RENDER_LOG = "[SVIE][Certification][Render]" as const;
export const SVIE_CERTIFICATION_LIFECYCLE_LOG = "[SVIE][Certification][Lifecycle]" as const;
export const SVIE_CERTIFICATION_PERFORMANCE_LOG = "[SVIE][Certification][Performance]" as const;
export const SVIE_CERTIFICATION_EXECUTIVE_READY_LOG =
  "[SVIE][Certification][ExecutiveReady]" as const;

export type SvieRiskLayerCertificationGateId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export type SvieRiskLayerCertificationGateStatus = "PASS" | "FAIL" | "WARN";

export type SvieRiskLayerCertificationGate = Readonly<{
  id: SvieRiskLayerCertificationGateId;
  name: string;
  status: SvieRiskLayerCertificationGateStatus;
  detail: string;
  certificationLog: string;
}>;

export type SvieRiskLayerCertificationResult = Readonly<{
  tag: typeof SVIE_RISK_LAYER_CERTIFICATION_TAG;
  phaseCompleteTag: typeof SVIE_PHASE2_COMPLETE_TAG;
  version: typeof SVIE_RISK_LAYER_CERTIFICATION_VERSION;
  gates: readonly SvieRiskLayerCertificationGate[];
  freezeTags: readonly string[];
  runtimeWarnings: readonly string[];
  certified: boolean;
  finalStatus: "PASS" | "PASS WITH WARNINGS" | "FAIL";
}>;

export const SVIE_RISK_LAYER_CERTIFICATION_FREEZE_TAGS = Object.freeze([
  SVIE_RISK_LAYER_CERTIFICATION_TAG,
  SVIE_PHASE2_COMPLETE_TAG,
]);

export const SVIE_RISK_LAYER_FORBIDDEN_VISUAL_KEYS = Object.freeze([
  "position",
  "scale",
  "rotation",
  "transform",
  "x",
  "y",
  "z",
]);

export const SVIE_RISK_LAYER_PERFORMANCE_OBJECT_COUNTS = Object.freeze([10, 50, 100, 250]);
