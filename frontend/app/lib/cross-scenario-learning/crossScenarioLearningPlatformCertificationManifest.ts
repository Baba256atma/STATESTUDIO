/**
 * APP-10:8 — Cross-Scenario Learning Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY,
  CROSS_SCENARIO_LEARNING_MUST_NOT_OWN,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_ID,
  CROSS_SCENARIO_LEARNING_PLATFORM_NAME,
  CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES,
} from "./crossScenarioLearningConstants.ts";
import { RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST } from "./recommendationLearningEngine.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-10/8" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-10/8-platform-certification-arch" as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP10_8]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-10/1", title: "Cross-Scenario Learning Foundation", contractVersion: "APP-10/1" },
  { layerId: "APP-10/2", title: "Pattern Extraction Engine", contractVersion: "APP-10/2" },
  { layerId: "APP-10/3", title: "Similarity Engine", contractVersion: "APP-10/3" },
  { layerId: "APP-10/4", title: "Outcome Learning Engine", contractVersion: "APP-10/4" },
  { layerId: "APP-10/5", title: "Failure Learning Engine", contractVersion: "APP-10/5" },
  { layerId: "APP-10/6", title: "Strategy Learning Engine", contractVersion: "APP-10/6" },
  { layerId: "APP-10/7", title: "Recommendation Learning Engine", contractVersion: "APP-10/7" },
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_platform_identity",
  "B_dependency_chain",
  "C_phase_regression",
  "D_public_apis",
  "E_manifest_validation",
  "F_compatibility",
  "G_architecture_boundaries",
  "H_immutable_contracts",
  "I_prior_platforms",
  "J_determinism",
  "K_consumer_only",
  "L_ready_for_freeze",
] as const);

export type CrossScenarioLearningPlatformCertificationGroupKey =
  (typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-10-1-cross-scenario-learning-foundation.md",
  "docs/app-10-2-pattern-extraction-engine.md",
  "docs/app-10-3-similarity-engine.md",
  "docs/app-10-4-outcome-learning-engine.md",
  "docs/app-10-5-failure-learning-engine.md",
  "docs/app-10-6-strategy-learning-engine.md",
  "docs/app-10-7-recommendation-learning-engine.md",
  "docs/app-10-8-cross-scenario-learning-platform-certification.md",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "recommendationGenerator",
  "platformFreeze",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "APP-9",
  "DS",
  "INT",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS = Object.freeze([
  "certifyCrossScenarioLearningPlatform",
  "validateCrossScenarioLearningPlatform",
  "runCrossScenarioLearningPlatformCertification",
  "getCrossScenarioLearningCertificationManifest",
  "runCrossScenarioLearningPlatformRegression",
  "buildCrossScenarioLearningFoundation",
  "extractExecutivePatterns",
  "compareScenarioSimilarity",
  "learnHistoricalOutcomes",
  "learnHistoricalFailures",
  "learnHistoricalStrategies",
  "learnHistoricalRecommendations",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/8",
  title: "Cross-Scenario Learning Platform Certification",
  goal: "Official read-only full-platform certification for APP-10:1 through APP-10:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertificationTypes.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertificationManifest.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformRegression.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertificationRunner.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertification.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformCertification.test.ts",
    "docs/app-10-8-cross-scenario-learning-platform-certification.md",
  ]),
  forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-10/1",
    "APP-10/2",
    "APP-10/3",
    "APP-10/4",
    "APP-10/5",
    "APP-10/6",
    "APP-10/7",
  ]),
  runtimePath: "library-only" as const,
  tags: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type CrossScenarioLearningPlatformCertificationManifest = Readonly<{
  platformId: typeof CROSS_SCENARIO_LEARNING_PLATFORM_ID;
  platformName: typeof CROSS_SCENARIO_LEARNING_PLATFORM_NAME;
  platformVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-10";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS;
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

export function buildCrossScenarioLearningPlatformCertificationManifest(
  generatedAt: string,
  certified: boolean,
  regressionSummary: CrossScenarioLearningPlatformCertificationManifest["regressionSummary"],
  certificationTimestamp: string | null = null
): CrossScenarioLearningPlatformCertificationManifest {
  return Object.freeze({
    platformId: CROSS_SCENARIO_LEARNING_PLATFORM_ID,
    platformName: CROSS_SCENARIO_LEARNING_PLATFORM_NAME,
    platformVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-10",
    phases: Object.freeze(
      CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          phaseId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    dependencyVersions: Object.freeze(
      Object.fromEntries(
        CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_MODULES.map((entry) => [entry.layerId, entry.contractVersion])
      )
    ),
    publicApis: CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_APIS,
    supportedConsumers: Object.freeze(
      CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY.map((entry) =>
        Object.freeze({
          consumerId: entry.consumerId,
          label: entry.label,
          readOnly: true as const,
        })
      )
    ),
    compatibilityMatrix: Object.freeze([
      Object.freeze({
        guaranteeId: "consumer-only-platform",
        description: "APP-10 consumes certified upstream platforms without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "metadata-only-learning",
        description: "All learning engines operate on metadata and certified references only.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "deterministic-outputs",
        description: "All APP-10 outputs are deterministic and immutable.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "frozen-prior-platforms",
        description: "Does not modify certified APP-1 through APP-9 platforms.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "no-ml-forbidden",
        description: "No machine learning, embeddings, or vector search in APP-10.",
        enforced: true as const,
        readOnly: true as const,
      }),
    ]),
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

export function validateCrossScenarioLearningPlatformCertificationManifest(
  manifest: CrossScenarioLearningPlatformCertificationManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== CROSS_SCENARIO_LEARNING_PLATFORM_ID) {
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
  if (manifest.platformVersion !== CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Platform version mismatch.");
  }
  if (!manifest.readOnly) {
    issues.push("Manifest must be read-only.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_GUARANTEES = Object.freeze({
  consumerOnly: CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.includes("cross_scenario_learning_is_consumer_only"),
  metadataOnly: CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.includes("platform_must_remain_metadata_only"),
  deterministic: CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES.includes("learning_is_deterministic_and_reproducible"),
  noMl: CROSS_SCENARIO_LEARNING_MUST_NOT_OWN.includes("machine_learning"),
  foundationVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
});
