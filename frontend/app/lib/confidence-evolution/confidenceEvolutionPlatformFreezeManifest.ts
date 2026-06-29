/**
 * APP-9:9 — Confidence Evolution Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_ID,
  CONFIDENCE_EVOLUTION_PLATFORM_NAME,
} from "./confidenceEvolutionConstants.ts";
import { CONFIDENCE_EVOLUTION_FREEZE_RULES } from "./confidenceEvolutionContracts.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./confidenceEvolutionPlatformCertificationManifest.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./confidenceEvolutionPlatformCertificationManifest.ts";
import type { ConfidenceEvolutionPlatformCertificationResult } from "./confidenceEvolutionPlatformCertification.ts";
import { CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX } from "./confidenceEvolutionPlatformFreezeCompatibility.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SOURCE,
  CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_BY,
  CONFIDENCE_EVOLUTION_PLATFORM_EXTENSION_POLICY,
  CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_STATUS,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES,
  CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS,
  CONFIDENCE_EVOLUTION_PLATFORM_NO_MUTATION_POLICY,
  CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_STATUS,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
  CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_STATUS_CERTIFIED,
  CONFIDENCE_EVOLUTION_PLATFORM_STATUS_FROZEN,
  CONFIDENCE_EVOLUTION_PLATFORM_STATUS_RELEASED,
  getConfidenceEvolutionConsumerRegistry,
} from "./confidenceEvolutionPlatformFreezeRegistry.ts";

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "DashboardAdapter",
  "AssistantAdapter",
  "VisualizationRenderer",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/9",
  title: "Confidence Evolution Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-9:1 through APP-9:8.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeManifest.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeRegistry.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeCompatibility.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreezeRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformFreeze.test.ts",
    "docs/app-9-9-confidence-evolution-platform-freeze.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-9/1",
    "APP-9/2",
    "APP-9/3",
    "APP-9/4",
    "APP-9/5",
    "APP-9/6",
    "APP-9/7",
    "APP-9/8",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze([
    "[APP9_9]",
    "[PLATFORM_FROZEN]",
    "[METADATA_ONLY]",
    "[NO_RUNTIME_CHANGES]",
    "[EXTEND_ONLY]",
    "[ARCHITECTURE_FROZEN]",
  ] as const),
} satisfies StageManifest);

export type ConfidenceEvolutionPlatformFreezeManifest = Readonly<{
  platformId: typeof CONFIDENCE_EVOLUTION_PLATFORM_ID;
  platformName: typeof CONFIDENCE_EVOLUTION_PLATFORM_NAME;
  appId: "APP-9";
  releaseVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG;
  releaseStatus: Readonly<{
    certified: typeof CONFIDENCE_EVOLUTION_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof CONFIDENCE_EVOLUTION_PLATFORM_STATUS_FROZEN;
    released: typeof CONFIDENCE_EVOLUTION_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES;
  publicApis: typeof CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getConfidenceEvolutionConsumerRegistry>;
  compatibilityMatrix: typeof CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof CONFIDENCE_EVOLUTION_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof CONFIDENCE_EVOLUTION_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof CONFIDENCE_EVOLUTION_FREEZE_RULES;
  foundationContractVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  platformReleaseStatus: typeof CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildConfidenceEvolutionPlatformFreezeManifest(
  certification: ConfidenceEvolutionPlatformCertificationResult,
  frozenAt: string = new Date().toISOString()
): ConfidenceEvolutionPlatformFreezeManifest {
  const readyForRelease = certification.certified === true && certification.readyForFreeze === true;

  return Object.freeze({
    platformId: CONFIDENCE_EVOLUTION_PLATFORM_ID,
    platformName: CONFIDENCE_EVOLUTION_PLATFORM_NAME,
    appId: "APP-9",
    releaseVersion: CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_VERSION,
    releaseTag: CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_TAG,
    releaseStatus: Object.freeze({
      certified: CONFIDENCE_EVOLUTION_PLATFORM_STATUS_CERTIFIED,
      frozen: CONFIDENCE_EVOLUTION_PLATFORM_STATUS_FROZEN,
      released: CONFIDENCE_EVOLUTION_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_STATUS,
    certifiedBy: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_BY,
    certificationSource: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PHASES,
    publicApis: CONFIDENCE_EVOLUTION_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getConfidenceEvolutionConsumerRegistry(),
    compatibilityMatrix: CONFIDENCE_EVOLUTION_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: CONFIDENCE_EVOLUTION_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: CONFIDENCE_EVOLUTION_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: CONFIDENCE_EVOLUTION_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: CONFIDENCE_EVOLUTION_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: CONFIDENCE_EVOLUTION_FREEZE_RULES,
    foundationContractVersion: CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: CONFIDENCE_EVOLUTION_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    platformReleaseStatus: CONFIDENCE_EVOLUTION_PLATFORM_RELEASE_STATUS,
    certificationScore: certification.certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateConfidenceEvolutionFreezeManifest(
  manifest: ConfidenceEvolutionPlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== CONFIDENCE_EVOLUTION_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Invalid consumedCertification.");
  }
  if (manifest.certifiedPhases.length !== 9) {
    issues.push("Expected nine certified phases.");
  }
  if (manifest.consumers.length !== 7) {
    issues.push("Expected seven consumer contracts.");
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

export { CONFIDENCE_EVOLUTION_PLATFORM_FREEZE_DOCUMENTATION_FILES };
