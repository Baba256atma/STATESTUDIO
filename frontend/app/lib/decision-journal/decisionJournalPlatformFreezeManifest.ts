/**
 * APP-8:9 — Decision Journal Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_ID,
  DECISION_JOURNAL_PLATFORM_NAME,
} from "./decisionJournalConstants.ts";
import { DECISION_JOURNAL_FREEZE_RULES } from "./decisionJournalContracts.ts";
import { DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./decisionJournalPlatformCertificationManifest.ts";
import { DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./decisionJournalPlatformCertificationManifest.ts";
import type { DecisionJournalPlatformCertificationResult } from "./decisionJournalPlatformCertification.ts";
import { DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX } from "./decisionJournalPlatformFreezeCompatibility.ts";
import {
  DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  DECISION_JOURNAL_PLATFORM_CERTIFICATION_SOURCE,
  DECISION_JOURNAL_PLATFORM_CERTIFIED_BY,
  DECISION_JOURNAL_PLATFORM_EXTENSION_POLICY,
  DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES,
  DECISION_JOURNAL_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  DECISION_JOURNAL_PLATFORM_FREEZE_STATUS,
  DECISION_JOURNAL_PLATFORM_FREEZE_TAGS,
  DECISION_JOURNAL_PLATFORM_FROZEN_PHASES,
  DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS,
  DECISION_JOURNAL_PLATFORM_NO_MUTATION_POLICY,
  DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  DECISION_JOURNAL_PLATFORM_RELEASE_STATUS,
  DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
  DECISION_JOURNAL_PLATFORM_RELEASE_VERSION,
  DECISION_JOURNAL_PLATFORM_STATUS_CERTIFIED,
  DECISION_JOURNAL_PLATFORM_STATUS_FROZEN,
  DECISION_JOURNAL_PLATFORM_STATUS_RELEASED,
  getDecisionJournalConsumerRegistry,
} from "./decisionJournalPlatformFreezeRegistry.ts";

export const DECISION_JOURNAL_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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

export const DECISION_JOURNAL_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/9",
  title: "Decision Journal Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-8:1 through APP-8:8.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeManifest.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeRegistry.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeCompatibility.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreezeRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreeze.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformFreeze.test.ts",
    "docs/app-8-9-decision-journal-platform-freeze.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-8/1",
    "APP-8/2",
    "APP-8/3",
    "APP-8/4",
    "APP-8/5",
    "APP-8/6",
    "APP-8/7",
    "APP-8/8",
  ]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_PLATFORM_FREEZE_TAGS,
} satisfies StageManifest);

export type DecisionJournalPlatformFreezeManifest = Readonly<{
  platformId: typeof DECISION_JOURNAL_PLATFORM_ID;
  platformName: typeof DECISION_JOURNAL_PLATFORM_NAME;
  appId: "APP-8";
  releaseVersion: typeof DECISION_JOURNAL_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof DECISION_JOURNAL_PLATFORM_RELEASE_TAG;
  releaseStatus: Readonly<{
    certified: typeof DECISION_JOURNAL_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof DECISION_JOURNAL_PLATFORM_STATUS_FROZEN;
    released: typeof DECISION_JOURNAL_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof DECISION_JOURNAL_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof DECISION_JOURNAL_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof DECISION_JOURNAL_PLATFORM_FROZEN_PHASES;
  publicApis: typeof DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getDecisionJournalConsumerRegistry>;
  compatibilityMatrix: typeof DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof DECISION_JOURNAL_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof DECISION_JOURNAL_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof DECISION_JOURNAL_FREEZE_RULES;
  foundationContractVersion: typeof DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof DECISION_JOURNAL_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  platformReleaseStatus: typeof DECISION_JOURNAL_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = DECISION_JOURNAL_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildDecisionJournalPlatformFreezeManifest(
  certification: DecisionJournalPlatformCertificationResult,
  frozenAt: string = new Date().toISOString()
): DecisionJournalPlatformFreezeManifest {
  const readyForRelease = certification.certified === true && certification.readyForFreeze === true;

  return Object.freeze({
    platformId: DECISION_JOURNAL_PLATFORM_ID,
    platformName: DECISION_JOURNAL_PLATFORM_NAME,
    appId: "APP-8",
    releaseVersion: DECISION_JOURNAL_PLATFORM_RELEASE_VERSION,
    releaseTag: DECISION_JOURNAL_PLATFORM_RELEASE_TAG,
    releaseStatus: Object.freeze({
      certified: DECISION_JOURNAL_PLATFORM_STATUS_CERTIFIED,
      frozen: DECISION_JOURNAL_PLATFORM_STATUS_FROZEN,
      released: DECISION_JOURNAL_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: DECISION_JOURNAL_PLATFORM_FREEZE_STATUS,
    certifiedBy: DECISION_JOURNAL_PLATFORM_CERTIFIED_BY,
    certificationSource: DECISION_JOURNAL_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: DECISION_JOURNAL_PLATFORM_FROZEN_PHASES,
    publicApis: DECISION_JOURNAL_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getDecisionJournalConsumerRegistry(),
    compatibilityMatrix: DECISION_JOURNAL_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: DECISION_JOURNAL_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: DECISION_JOURNAL_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: DECISION_JOURNAL_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: DECISION_JOURNAL_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: DECISION_JOURNAL_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: DECISION_JOURNAL_FREEZE_RULES,
    foundationContractVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: DECISION_JOURNAL_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: DECISION_JOURNAL_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    platformReleaseStatus: DECISION_JOURNAL_PLATFORM_RELEASE_STATUS,
    certificationScore: certification.certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateDecisionJournalFreezeManifest(
  manifest: DecisionJournalPlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== DECISION_JOURNAL_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== DECISION_JOURNAL_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Invalid consumedCertification.");
  }
  if (manifest.certifiedPhases.length !== 9) {
    issues.push("Expected nine certified phases.");
  }
  if (manifest.consumers.length !== 7) {
    issues.push("Expected seven consumer contracts.");
  }
  if (manifest.forbiddenChanges.length < 9) {
    issues.push("Forbidden changes list incomplete.");
  }
  if (manifest.allowedFutureExtensions.length < 9) {
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

export { DECISION_JOURNAL_PLATFORM_FREEZE_DOCUMENTATION_FILES };
