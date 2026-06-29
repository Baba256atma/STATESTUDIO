/**
 * APP-12:8 — Executive Recommendation Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY,
  EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY,
  EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
  EXECUTIVE_RECOMMENDATION_PLATFORM_NAME,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES,
} from "./executiveRecommendationConstants.ts";
import { EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS } from "./executiveRecommendationDeliveryEngineConstants.ts";
import { EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST } from "./executiveRecommendationDeliveryEngine.ts";

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-12/8" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-12/8-platform-certification-arch" as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP12_8]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES = Object.freeze([
  { phaseId: "APP-12/1", title: "Executive Recommendation Foundation", contractVersion: "APP-12/1" },
  { phaseId: "APP-12/2", title: "Recommendation Generation Engine", contractVersion: "APP-12/2" },
  { phaseId: "APP-12/3", title: "Recommendation Evaluation Engine", contractVersion: "APP-12/3" },
  { phaseId: "APP-12/4", title: "Recommendation Explainability Engine", contractVersion: "APP-12/4" },
  { phaseId: "APP-12/5", title: "Recommendation Constraint & Governance Engine", contractVersion: "APP-12/5" },
  { phaseId: "APP-12/6", title: "Recommendation Optimization Engine", contractVersion: "APP-12/6" },
  { phaseId: "APP-12/7", title: "Recommendation Delivery & Interaction Engine", contractVersion: "APP-12/7" },
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_platform_identity",
  "B_dependency_chain",
  "C_phase_regression",
  "D_public_apis",
  "E_contract_integrity",
  "F_manifest_integrity",
  "G_compatibility_matrix",
  "H_consumer_only_architecture",
  "I_determinism",
  "J_immutable_contracts",
  "K_backward_compatibility",
  "L_freeze_readiness",
] as const);

export type ExecutiveRecommendationPlatformCertificationGroupKey =
  (typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-12-1-executive-recommendation-foundation.md",
  "docs/app-12-2-recommendation-generation-engine.md",
  "docs/app-12-3-recommendation-evaluation-engine.md",
  "docs/app-12-4-recommendation-explainability-engine.md",
  "docs/app-12-5-recommendation-governance-engine.md",
  "docs/app-12-6-recommendation-optimization-engine.md",
  "docs/app-12-7-recommendation-delivery-engine.md",
  "docs/app-12-8-executive-recommendation-platform-certification.md",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "components/",
  ".tsx",
  "React.",
  "useState",
  "localStorage",
  "indexedDB",
  "openai",
  "ChatGPT",
  "prompt(",
  "fetch(",
  "generateExecutiveRecommendations(",
  "evaluateExecutiveRecommendations(",
  "explainExecutiveRecommendations(",
  "validateExecutiveRecommendationGovernance(",
  "optimizeExecutiveRecommendations(",
  "prepareExecutiveRecommendationDelivery(",
  "setInterval(",
  "setTimeout(",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "APP-10",
  "APP-11",
  "DS",
  "INT",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS = Object.freeze([
  "certifyExecutiveRecommendationPlatform",
  "validateExecutiveRecommendationPlatform",
  "runExecutiveRecommendationPlatformCertification",
  "runExecutiveRecommendationPlatformRegression",
  "getExecutiveRecommendationCertificationManifest",
  "buildExecutiveRecommendationFoundation",
  "generateExecutiveRecommendations",
  "evaluateExecutiveRecommendations",
  "explainExecutiveRecommendations",
  "validateExecutiveRecommendationGovernance",
  "optimizeExecutiveRecommendations",
  "prepareExecutiveRecommendationDelivery",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/8",
  title: "Executive Recommendation Platform Certification",
  goal: "Official read-only full-platform certification for APP-12:1 through APP-12:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertificationTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertificationManifest.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformRegression.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertificationRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertification.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformCertification.test.ts",
    "docs/app-12-8-executive-recommendation-platform-certification.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-12/1",
    "APP-12/2",
    "APP-12/3",
    "APP-12/4",
    "APP-12/5",
    "APP-12/6",
    "APP-12/7",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type CertificationManifest = Readonly<{
  platformId: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_ID;
  platformName: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_NAME;
  platformVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-12";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS;
  supportedConsumers: readonly Readonly<{ consumerId: string; label: string; readOnly: true }>[];
  compatibilityMatrix: readonly Readonly<{ guaranteeId: string; description: string; enforced: true; readOnly: true }>[];
  certificationStatus: Readonly<{
    certified: boolean;
    readyForFreeze: boolean;
    certificationTimestamp: string | null;
    readOnly: true;
  }>;
  regressionSummary: Readonly<{
    layersPassed: number;
    layersTotal: number;
    success: boolean;
    readOnly: true;
  }>;
  generatedAt: string;
  readOnly: true;
}>;

export function buildExecutiveRecommendationPlatformCertificationManifest(
  generatedAt: string,
  certified: boolean,
  regressionSummary: CertificationManifest["regressionSummary"],
  certificationTimestamp: string | null = null
): CertificationManifest {
  return Object.freeze({
    platformId: EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
    platformName: EXECUTIVE_RECOMMENDATION_PLATFORM_NAME,
    platformVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-12",
    phases: Object.freeze(
      EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.map((entry) =>
        Object.freeze({
          phaseId: entry.phaseId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    dependencyVersions: Object.freeze(
      Object.fromEntries(
        EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_PHASES.map((entry) => [entry.phaseId, entry.contractVersion])
      )
    ),
    publicApis: EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_APIS,
    supportedConsumers: Object.freeze(
      EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY.map((entry) =>
        Object.freeze({
          consumerId: entry.consumerId,
          label: entry.label,
          readOnly: true as const,
        })
      )
    ),
    compatibilityMatrix: Object.freeze(
      EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY.map((entry) =>
        Object.freeze({
          guaranteeId: entry.guaranteeId,
          description: entry.description,
          enforced: true as const,
          readOnly: true as const,
        })
      )
    ),
    certificationStatus: Object.freeze({
      certified,
      readyForFreeze: certified,
      certificationTimestamp,
      readOnly: true as const,
    }),
    regressionSummary,
    generatedAt,
    readOnly: true as const,
  });
}

export function validateExecutiveRecommendationPlatformCertificationManifest(
  manifest: CertificationManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== EXECUTIVE_RECOMMENDATION_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.phases.length !== 7) {
    issues.push("Expected seven certified phases.");
  }
  if (manifest.supportedConsumers.length === 0) {
    issues.push("Supported consumers must not be empty.");
  }
  if (manifest.compatibilityMatrix.length < 5) {
    issues.push("Compatibility matrix incomplete.");
  }
  if (manifest.platformVersion !== EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Platform version mismatch.");
  }
  if (Object.keys(manifest.dependencyVersions).length !== 7) {
    issues.push("Expected seven dependency versions.");
  }
  if (EXECUTIVE_RECOMMENDATION_DELIVERY_CONSUMER_TARGETS.length !== 4) {
    issues.push("Expected four delivery consumer targets.");
  }
  if (!manifest.readOnly) {
    issues.push("Manifest must be read-only.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_GUARANTEES = Object.freeze({
  consumerOnly: EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES.includes("executive_recommendation_is_consumer_only"),
  metadataOnly: EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES.includes("platform_must_remain_metadata_only"),
  deterministic: EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES.includes("recommendations_are_deterministic_and_explainable"),
  noExecution: EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN.includes("recommendation_execution"),
  foundationVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
});
