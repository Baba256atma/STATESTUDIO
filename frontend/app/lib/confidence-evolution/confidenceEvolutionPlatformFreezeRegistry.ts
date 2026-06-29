/**
 * APP-9:9 — Confidence Evolution Platform Freeze registry.
 * Metadata-only platform identity, phase registry, and API registry.
 */

import { listConfidenceEvolutionConsumerContracts } from "./confidenceEvolutionConsumerContracts.ts";

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION = "APP-9/9" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_ARCHITECTURE_VERSION =
  "APP-9/9-platform-freeze-arch" as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_VERSION = "APP-9" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG = "app-9-confidence-evolution-v1.0.0-frozen" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_STATUS = "released" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_STATUS = "frozen" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_VERSION = "APP-9-compat-v1" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_BY = "APP-9:8 Platform Certification" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SOURCE = "APP-9/8" as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_STATUS_CERTIFIED = true as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_STATUS_FROZEN = true as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_STATUS_RELEASED = true as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[APP9_9]",
  "[PLATFORM_FROZEN]",
  "[CONFIDENCE_EVOLUTION_PLATFORM_COMPLETE]",
  "[METADATA_ONLY]",
  "[NO_RUNTIME_CHANGES]",
  "[EXTEND_ONLY]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES = Object.freeze([
  "docs/app-9-1-confidence-evolution-foundation.md",
  "docs/app-9-2-confidence-evolution-engine.md",
  "docs/app-9-3-confidence-evolution-query-ordering.md",
  "docs/app-9-4-confidence-trend-volatility.md",
  "docs/app-9-5-confidence-evidence-reason-link.md",
  "docs/app-9-6-confidence-calibration-accuracy.md",
  "docs/app-9-7-confidence-api-consumer-contract.md",
  "docs/app-9-8-confidence-evolution-platform-certification.md",
  "docs/app-9-9-confidence-evolution-platform-freeze.md",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS = Object.freeze([
  "app9_addon_modules",
  "workspace_confidence_capture_integration",
  "dashboard_consumer_integration",
  "assistant_consumer_integration",
  "visualization_consumer_integration",
  "report_export_modules",
  "persistence_adapter",
  "app6_app7_app8_link_adapters_facade_only",
  "audit_governance_integration",
  "external_confidence_import_export_adapter",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES = Object.freeze([
  "changing_confidence_record_identity",
  "changing_immutable_confidence_record_rules",
  "changing_append_only_revision_policy",
  "bypassing_app9_7_api_facade",
  "direct_internal_imports_by_consumers",
  "mutating_certified_app9_1_through_9_8_contracts",
  "direct_app6_app7_app8_internal_coupling",
  "adding_prediction_recommendation_logic_inside_frozen_core",
  "adding_ui_dashboard_assistant_behavior_inside_frozen_core",
  "changing_calibration_trend_semantics_inside_frozen_core",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-9-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend APP-9 through consumer bindings and adapters without modifying certified APP-9:1 through APP-9:8 contracts.",
  allowedFutureExtensions: CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  forbiddenChanges: CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES,
  facadeRequired: true,
  consumerContractsRequired: true,
  readOnly: true as const,
} as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_NO_MUTATION_POLICY = Object.freeze({
  policyId: "APP-9-NO-MUTATION-FREEZE",
  metadataOnly: true,
  noNewRuntimeBehavior: true,
  noEngineChanges: true,
  noQueryChanges: true,
  noTrendChanges: true,
  noEvidenceReasonChanges: true,
  noCalibrationChanges: true,
  noApiBehaviorChanges: true,
  readOnly: true as const,
} as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES = Object.freeze([
  Object.freeze({ phaseId: "APP-9/1", title: "Confidence Evolution Foundation", contractVersion: "APP-9/1" }),
  Object.freeze({ phaseId: "APP-9/2", title: "Confidence Evolution Engine", contractVersion: "APP-9/2" }),
  Object.freeze({ phaseId: "APP-9/3", title: "Confidence Evolution Query + Ordering", contractVersion: "APP-9/3" }),
  Object.freeze({ phaseId: "APP-9/4", title: "Confidence Trend + Volatility", contractVersion: "APP-9/4" }),
  Object.freeze({ phaseId: "APP-9/5", title: "Confidence Evidence + Reason Link", contractVersion: "APP-9/5" }),
  Object.freeze({ phaseId: "APP-9/6", title: "Confidence Calibration + Accuracy", contractVersion: "APP-9/6" }),
  Object.freeze({ phaseId: "APP-9/7", title: "Confidence API + Consumer Contract", contractVersion: "APP-9/7" }),
  Object.freeze({ phaseId: "APP-9/8", title: "Platform Certification", contractVersion: "APP-9/8" }),
  Object.freeze({ phaseId: "APP-9/9", title: "Platform Freeze", contractVersion: "APP-9/9" }),
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "createConfidenceEvolutionFoundation",
  "validateConfidenceEvolution",
  "getConfidenceEvolution",
  "createConfidenceEvolution",
  "runConfidenceEvolutionFoundation",
  "createConfidenceRecord",
  "getConfidenceRecordById",
  "getConfidenceRecords",
  "updateConfidenceMetadata",
  "archiveConfidenceRecord",
  "runConfidenceEvolutionEngineCertification",
  "queryConfidenceEvolution",
  "getConfidenceRecordsOrdered",
  "getConfidenceEvolutionRange",
  "getConfidenceEvolutionSummary",
  "runConfidenceEvolutionQueryCertification",
  "buildConfidenceTrendModel",
  "calculateConfidenceDeltas",
  "calculateConfidenceVolatility",
  "classifyConfidenceTrendDirection",
  "runConfidenceTrendCertification",
  "buildConfidenceEvidenceReasonLinkModel",
  "buildConfidenceReasonLinks",
  "buildConfidenceEvidenceLinks",
  "detectConfidenceExplanationFlags",
  "runConfidenceEvidenceReasonCertification",
  "buildConfidenceCalibrationModel",
  "evaluateConfidenceCalibration",
  "calculateConfidenceCalibrationScore",
  "calculateConfidenceAccuracyScore",
  "runConfidenceCalibrationCertification",
  "createConfidenceEvolutionApi",
  "getConfidenceEvolutionApi",
  "getConfidenceEvolutionApiManifest",
  "validateConfidenceEvolutionApiContract",
  "getConfidenceEvolutionConsumerContract",
  "validateConfidenceEvolutionConsumerAccess",
  "runConfidenceEvolutionApiCertification",
  "runConfidenceEvolutionPlatformCertification",
  "runConfidenceEvolutionPlatformRegression",
  "getConfidenceEvolutionPlatformManifest",
  "validateConfidenceEvolutionPlatform",
  "runConfidenceEvolutionPlatformFreeze",
  "getConfidenceEvolutionFreezeManifest",
  "validateConfidenceEvolutionPlatformFreeze",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY = Object.freeze([
  Object.freeze({ contractId: "APP-9/1", label: "Foundation", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/2", label: "Confidence Engine", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/3", label: "Query + Ordering", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/4", label: "Trend + Volatility", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/5", label: "Evidence + Reason Link", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/6", label: "Calibration + Accuracy", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/7", label: "API + Consumer Contract", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/8", label: "Platform Certification", frozen: true as const }),
  Object.freeze({ contractId: "APP-9/9", label: "Platform Freeze", frozen: true as const }),
] as const);

let publishedManifest: import("./confidenceEvolutionPlatformFreezeManifest.ts").ConfidenceEvolutionPlatformFreezeManifest | null =
  null;

export function resetConfidenceEvolutionPlatformFreezeRegistryForTests(): void {
  publishedManifest = null;
}

export function registerConfidenceEvolutionPlatformFreezeManifest(
  manifest: import("./confidenceEvolutionPlatformFreezeManifest.ts").ConfidenceEvolutionPlatformFreezeManifest
): void {
  publishedManifest = manifest;
}

export function getPublishedConfidenceEvolutionFreezeManifest():
  | import("./confidenceEvolutionPlatformFreezeManifest.ts").ConfidenceEvolutionPlatformFreezeManifest
  | null {
  return publishedManifest;
}

export function getConfidenceEvolutionConsumerRegistry() {
  return listConfidenceEvolutionConsumerContracts();
}

export function getConfidenceEvolutionPlatformRegistry(): import("./confidenceEvolutionPlatformFreezeTypes.ts").ConfidenceEvolutionPlatformRegistrySnapshot {
  const manifest = publishedManifest;
  return Object.freeze({
    registryVersion: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
    platformId: manifest?.platformId ?? "confidence-evolution-platform",
    platformName: manifest?.platformName ?? "Confidence Evolution",
    releaseVersion: manifest?.releaseVersion ?? CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_VERSION,
    frozen: manifest?.releaseStatus.frozen === true,
    publicApiCount: CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS.length,
    phaseCount: CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES.length,
    consumerCount: getConfidenceEvolutionConsumerRegistry().length,
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionPlatformFreezeRegistry = Object.freeze({
  resetConfidenceEvolutionPlatformFreezeRegistryForTests,
  registerConfidenceEvolutionPlatformFreezeManifest,
  getPublishedConfidenceEvolutionFreezeManifest,
  getConfidenceEvolutionPlatformRegistry,
  getConfidenceEvolutionConsumerRegistry,
});
