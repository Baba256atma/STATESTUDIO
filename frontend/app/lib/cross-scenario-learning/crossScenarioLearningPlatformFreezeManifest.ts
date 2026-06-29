/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_ID,
  CROSS_SCENARIO_LEARNING_PLATFORM_NAME,
} from "./crossScenarioLearningConstants.ts";
import { CROSS_SCENARIO_LEARNING_FREEZE_RULES } from "./crossScenarioLearningContracts.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST,
} from "./crossScenarioLearningPlatformCertificationManifest.ts";
import { CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX } from "./crossScenarioLearningPlatformFreezeCompatibility.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SOURCE,
  CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_BY,
  CROSS_SCENARIO_LEARNING_PLATFORM_EXTENSION_POLICY,
  CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_STATUS,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES,
  CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS,
  CROSS_SCENARIO_LEARNING_PLATFORM_NO_MUTATION_POLICY,
  CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_STATUS,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_CERTIFIED,
  CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_FROZEN,
  CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_RELEASED,
  getCrossScenarioLearningConsumerRegistry,
} from "./crossScenarioLearningPlatformFreezeRegistry.ts";
import type { CrossScenarioLearningPlatformFreezeCertificationDependency } from "./crossScenarioLearningPlatformFreezeTypes.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "DashboardAdapter",
  "AssistantAdapter",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-10/9",
  title: "Cross-Scenario Learning Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-10:1 through APP-10:8.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeTypes.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeRegistry.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeCompatibility.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeManifest.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeValidation.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeRunner.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts",
    "frontend/app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.test.ts",
    "docs/app-10-9-cross-scenario-learning-platform-freeze.md",
  ]),
  forbiddenPatterns: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-10/1",
    "APP-10/2",
    "APP-10/3",
    "APP-10/4",
    "APP-10/5",
    "APP-10/6",
    "APP-10/7",
    "APP-10/8",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze([
    "[APP10_9]",
    "[PLATFORM_FROZEN]",
    "[METADATA_ONLY]",
    "[NO_RUNTIME_CHANGES]",
    "[EXTEND_ONLY]",
    "[ARCHITECTURE_FROZEN]",
  ] as const),
} satisfies StageManifest);

export type CrossScenarioLearningPlatformFreezeManifest = Readonly<{
  platformId: typeof CROSS_SCENARIO_LEARNING_PLATFORM_ID;
  platformName: typeof CROSS_SCENARIO_LEARNING_PLATFORM_NAME;
  appId: "APP-10";
  releaseVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG;
  releaseStatus: Readonly<{
    certified: typeof CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_FROZEN;
    released: typeof CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES;
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getCrossScenarioLearningConsumerRegistry>;
  compatibilityMatrix: typeof CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof CROSS_SCENARIO_LEARNING_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof CROSS_SCENARIO_LEARNING_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof CROSS_SCENARIO_LEARNING_FREEZE_RULES;
  foundationContractVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  platformReleaseStatus: typeof CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildCrossScenarioLearningPlatformFreezeManifest(
  certification: CrossScenarioLearningPlatformFreezeCertificationDependency,
  frozenAt: string = new Date().toISOString()
): CrossScenarioLearningPlatformFreezeManifest {
  const readyForRelease =
    certification.certified === true &&
    certification.readyForFreeze === true &&
    certification.report.certified === true;

  const certificationScore =
    certification.report.checkCount === 0
      ? 0
      : Math.round((certification.report.passedCount / certification.report.checkCount) * 100);

  return Object.freeze({
    platformId: CROSS_SCENARIO_LEARNING_PLATFORM_ID,
    platformName: CROSS_SCENARIO_LEARNING_PLATFORM_NAME,
    appId: "APP-10",
    releaseVersion: CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_VERSION,
    releaseTag: CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
    releaseStatus: Object.freeze({
      certified: CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_CERTIFIED,
      frozen: CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_FROZEN,
      released: CROSS_SCENARIO_LEARNING_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_STATUS,
    certifiedBy: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFIED_BY,
    certificationSource: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES,
    dependencyVersions: Object.freeze(
      Object.fromEntries(
        CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PHASES.map((entry) => [entry.phaseId, entry.contractVersion])
      )
    ),
    publicApis: CROSS_SCENARIO_LEARNING_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getCrossScenarioLearningConsumerRegistry(),
    compatibilityMatrix: CROSS_SCENARIO_LEARNING_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: CROSS_SCENARIO_LEARNING_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: CROSS_SCENARIO_LEARNING_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: CROSS_SCENARIO_LEARNING_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: CROSS_SCENARIO_LEARNING_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: CROSS_SCENARIO_LEARNING_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: CROSS_SCENARIO_LEARNING_FREEZE_RULES,
    foundationContractVersion: CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    platformReleaseStatus: CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_STATUS,
    certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateCrossScenarioLearningFreezeManifest(
  manifest: CrossScenarioLearningPlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== CROSS_SCENARIO_LEARNING_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== CROSS_SCENARIO_LEARNING_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Invalid consumedCertification.");
  }
  if (manifest.certifiedPhases.length !== 9) {
    issues.push("Expected nine certified phases.");
  }
  if (manifest.consumers.length !== 4) {
    issues.push("Expected four consumer contracts.");
  }
  if (manifest.forbiddenChanges.length < 10) {
    issues.push("Forbidden changes list incomplete.");
  }
  if (manifest.allowedFutureExtensions.length < 10) {
    issues.push("Allowed future extensions list incomplete.");
  }
  if (!manifest.readyForRelease) {
    issues.push("readyForRelease must be true.");
  }
  if (
    manifest.releaseStatus.certified !== true ||
    manifest.releaseStatus.frozen !== true ||
    manifest.releaseStatus.released !== true
  ) {
    issues.push("Release status flags must be certified, frozen, and released.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_DOCUMENTATION_FILES };
