/**
 * APP-12:9 — Executive Recommendation Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
  EXECUTIVE_RECOMMENDATION_PLATFORM_NAME,
} from "./executiveRecommendationConstants.ts";
import { EXECUTIVE_RECOMMENDATION_FREEZE_RULES } from "./executiveRecommendationContracts.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST,
} from "./executiveRecommendationPlatformCertificationManifest.ts";
import { EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_MATRIX } from "./executiveRecommendationPlatformFreezeCompatibility.ts";
import {
  EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SOURCE,
  EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_BY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_STATUS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES,
  EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_NO_MUTATION_POLICY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_STATUS,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
  EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_VERSION,
  EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_RELEASED,
  getExecutiveRecommendationConsumerRegistry,
} from "./executiveRecommendationPlatformFreezeRegistry.ts";
import type { ExecutiveRecommendationPlatformFreezeCertificationDependency } from "./executiveRecommendationPlatformFreezeTypes.ts";

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "executeRecommendation",
  "sendNotification",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-12/9",
  title: "Executive Recommendation Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-12:1 through APP-12:8.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeTypes.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeRegistry.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeCompatibility.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeManifest.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeValidation.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreezeRunner.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreeze.ts",
    "frontend/app/lib/executive-recommendation/executiveRecommendationPlatformFreeze.test.ts",
    "docs/app-12-9-executive-recommendation-platform-freeze.md",
  ]),
  forbiddenPatterns: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-12/1",
    "APP-12/2",
    "APP-12/3",
    "APP-12/4",
    "APP-12/5",
    "APP-12/6",
    "APP-12/7",
    "APP-12/8",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze([
    "[APP12_9]",
    "[PLATFORM_FROZEN]",
    "[METADATA_ONLY]",
    "[NO_RUNTIME_CHANGES]",
    "[EXTEND_ONLY]",
    "[ARCHITECTURE_FROZEN]",
  ] as const),
} satisfies StageManifest);

export type ExecutiveRecommendationPlatformFreezeManifest = Readonly<{
  platformId: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_ID;
  platformName: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_NAME;
  appId: "APP-12";
  releaseVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG;
  releaseStatus: Readonly<{
    certified: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_FROZEN;
    released: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES;
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getExecutiveRecommendationConsumerRegistry>;
  compatibilityMatrix: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof EXECUTIVE_RECOMMENDATION_FREEZE_RULES;
  foundationContractVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  platformReleaseStatus: typeof EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildExecutiveRecommendationPlatformFreezeManifest(
  certification: ExecutiveRecommendationPlatformFreezeCertificationDependency,
  frozenAt: string = new Date().toISOString()
): ExecutiveRecommendationPlatformFreezeManifest {
  const readyForRelease =
    certification.certified === true &&
    certification.readyForFreeze === true &&
    certification.report.certified === true;

  const certificationScore =
    certification.report.checkCount === 0
      ? 0
      : Math.round((certification.report.passedCount / certification.report.checkCount) * 100);

  return Object.freeze({
    platformId: EXECUTIVE_RECOMMENDATION_PLATFORM_ID,
    platformName: EXECUTIVE_RECOMMENDATION_PLATFORM_NAME,
    appId: "APP-12",
    releaseVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_VERSION,
    releaseTag: EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_TAG,
    releaseStatus: Object.freeze({
      certified: EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_CERTIFIED,
      frozen: EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_FROZEN,
      released: EXECUTIVE_RECOMMENDATION_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_STATUS,
    certifiedBy: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFIED_BY,
    certificationSource: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES,
    dependencyVersions: Object.freeze(
      Object.fromEntries(
        EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PHASES.map((entry) => [entry.phaseId, entry.contractVersion])
      )
    ),
    publicApis: EXECUTIVE_RECOMMENDATION_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getExecutiveRecommendationConsumerRegistry(),
    compatibilityMatrix: EXECUTIVE_RECOMMENDATION_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: EXECUTIVE_RECOMMENDATION_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: EXECUTIVE_RECOMMENDATION_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: EXECUTIVE_RECOMMENDATION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: EXECUTIVE_RECOMMENDATION_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: EXECUTIVE_RECOMMENDATION_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: EXECUTIVE_RECOMMENDATION_FREEZE_RULES,
    foundationContractVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    platformReleaseStatus: EXECUTIVE_RECOMMENDATION_PLATFORM_RELEASE_STATUS,
    certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateExecutiveRecommendationFreezeManifest(
  manifest: ExecutiveRecommendationPlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== EXECUTIVE_RECOMMENDATION_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== EXECUTIVE_RECOMMENDATION_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
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

export { EXECUTIVE_RECOMMENDATION_PLATFORM_FREEZE_DOCUMENTATION_FILES };
