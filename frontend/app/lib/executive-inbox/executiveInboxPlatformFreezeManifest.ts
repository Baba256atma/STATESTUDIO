/**
 * APP-11:8 — Executive Inbox Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_ID,
  EXECUTIVE_INBOX_PLATFORM_NAME,
} from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_FREEZE_RULES } from "./executiveInboxContracts.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST,
} from "./executiveInboxPlatformCertificationManifest.ts";
import { EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX } from "./executiveInboxPlatformFreezeCompatibility.ts";
import {
  EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SOURCE,
  EXECUTIVE_INBOX_PLATFORM_CERTIFIED_BY,
  EXECUTIVE_INBOX_PLATFORM_EXTENSION_POLICY,
  EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  EXECUTIVE_INBOX_PLATFORM_FREEZE_STATUS,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES,
  EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS,
  EXECUTIVE_INBOX_PLATFORM_NO_MUTATION_POLICY,
  EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_STATUS,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG,
  EXECUTIVE_INBOX_PLATFORM_RELEASE_VERSION,
  EXECUTIVE_INBOX_PLATFORM_STATUS_CERTIFIED,
  EXECUTIVE_INBOX_PLATFORM_STATUS_FROZEN,
  EXECUTIVE_INBOX_PLATFORM_STATUS_RELEASED,
  getExecutiveInboxConsumerRegistry,
} from "./executiveInboxPlatformFreezeRegistry.ts";
import type { ExecutiveInboxPlatformFreezeCertificationDependency } from "./executiveInboxPlatformFreezeTypes.ts";

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "createCalendarEvent",
  "backgroundJob",
  "setInterval(",
  "setTimeout(",
  "deliverNotification",
  "deliverReminder",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/8",
  title: "Executive Inbox Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-11:1 through APP-11:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeCompatibility.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeManifest.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreezeRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreeze.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformFreeze.test.ts",
    "docs/app-11-8-executive-inbox-platform-freeze.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-11/1",
    "APP-11/2",
    "APP-11/3",
    "APP-11/4",
    "APP-11/5",
    "APP-11/6",
    "APP-11/7",
  ]),
  runtimePath: "library-only" as const,
  tags: Object.freeze([
    "[APP11_8]",
    "[PLATFORM_FROZEN]",
    "[METADATA_ONLY]",
    "[NO_RUNTIME_CHANGES]",
    "[EXTEND_ONLY]",
    "[ARCHITECTURE_FROZEN]",
  ] as const),
} satisfies StageManifest);

export type ExecutiveInboxPlatformFreezeManifest = Readonly<{
  platformId: typeof EXECUTIVE_INBOX_PLATFORM_ID;
  platformName: typeof EXECUTIVE_INBOX_PLATFORM_NAME;
  appId: "APP-11";
  releaseVersion: typeof EXECUTIVE_INBOX_PLATFORM_RELEASE_VERSION;
  releaseTag: typeof EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG;
  releaseStatus: Readonly<{
    certified: typeof EXECUTIVE_INBOX_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof EXECUTIVE_INBOX_PLATFORM_STATUS_FROZEN;
    released: typeof EXECUTIVE_INBOX_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof EXECUTIVE_INBOX_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof EXECUTIVE_INBOX_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES;
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getExecutiveInboxConsumerRegistry>;
  compatibilityMatrix: typeof EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof EXECUTIVE_INBOX_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof EXECUTIVE_INBOX_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof EXECUTIVE_INBOX_FREEZE_RULES;
  foundationContractVersion: typeof EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof EXECUTIVE_INBOX_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  platformReleaseStatus: typeof EXECUTIVE_INBOX_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildExecutiveInboxPlatformFreezeManifest(
  certification: ExecutiveInboxPlatformFreezeCertificationDependency,
  frozenAt: string = new Date().toISOString()
): ExecutiveInboxPlatformFreezeManifest {
  const readyForRelease =
    certification.certified === true &&
    certification.readyForFreeze === true &&
    certification.report.certified === true;

  const certificationScore =
    certification.report.checkCount === 0
      ? 0
      : Math.round((certification.report.passedCount / certification.report.checkCount) * 100);

  return Object.freeze({
    platformId: EXECUTIVE_INBOX_PLATFORM_ID,
    platformName: EXECUTIVE_INBOX_PLATFORM_NAME,
    appId: "APP-11",
    releaseVersion: EXECUTIVE_INBOX_PLATFORM_RELEASE_VERSION,
    releaseTag: EXECUTIVE_INBOX_PLATFORM_RELEASE_TAG,
    releaseStatus: Object.freeze({
      certified: EXECUTIVE_INBOX_PLATFORM_STATUS_CERTIFIED,
      frozen: EXECUTIVE_INBOX_PLATFORM_STATUS_FROZEN,
      released: EXECUTIVE_INBOX_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: EXECUTIVE_INBOX_PLATFORM_FREEZE_STATUS,
    certifiedBy: EXECUTIVE_INBOX_PLATFORM_CERTIFIED_BY,
    certificationSource: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES,
    dependencyVersions: Object.freeze(
      Object.fromEntries(
        EXECUTIVE_INBOX_PLATFORM_FROZEN_PHASES.map((entry) => [entry.phaseId, entry.contractVersion])
      )
    ),
    publicApis: EXECUTIVE_INBOX_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getExecutiveInboxConsumerRegistry(),
    compatibilityMatrix: EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: EXECUTIVE_INBOX_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: EXECUTIVE_INBOX_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: EXECUTIVE_INBOX_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: EXECUTIVE_INBOX_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: EXECUTIVE_INBOX_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: EXECUTIVE_INBOX_FREEZE_RULES,
    foundationContractVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_INBOX_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    platformReleaseStatus: EXECUTIVE_INBOX_PLATFORM_RELEASE_STATUS,
    certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateExecutiveInboxFreezeManifest(
  manifest: ExecutiveInboxPlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== EXECUTIVE_INBOX_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== EXECUTIVE_INBOX_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Invalid consumedCertification.");
  }
  if (manifest.certifiedPhases.length !== 8) {
    issues.push("Expected eight certified phases.");
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

export { EXECUTIVE_INBOX_PLATFORM_FREEZE_DOCUMENTATION_FILES };
