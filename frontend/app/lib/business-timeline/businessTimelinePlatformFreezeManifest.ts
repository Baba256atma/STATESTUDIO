/**
 * APP-7:8 — Business Timeline Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_ID,
  BUSINESS_TIMELINE_PLATFORM_NAME,
} from "./businessTimelineConstants.ts";
import { BUSINESS_TIMELINE_FREEZE_RULES } from "./businessTimelineContracts.ts";
import { BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./businessTimelinePlatformCertificationManifest.ts";
import { BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./businessTimelinePlatformCertificationManifest.ts";
import type { BusinessTimelinePlatformCertificationResult } from "./businessTimelinePlatformCertification.ts";
import { BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX } from "./businessTimelinePlatformFreezeCompatibility.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
  BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SOURCE,
  BUSINESS_TIMELINE_PLATFORM_CERTIFIED_BY,
  BUSINESS_TIMELINE_PLATFORM_EXTENSION_POLICY,
  BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_STATUS,
  BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES,
  BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  BUSINESS_TIMELINE_PLATFORM_NO_MUTATION_POLICY,
  BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  BUSINESS_TIMELINE_PLATFORM_RELEASE_STATUS,
  BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG,
  BUSINESS_TIMELINE_PLATFORM_RELEASE_VERSION,
  BUSINESS_TIMELINE_PLATFORM_STATUS_CERTIFIED,
  BUSINESS_TIMELINE_PLATFORM_STATUS_FROZEN,
  BUSINESS_TIMELINE_PLATFORM_STATUS_RELEASED,
  getBusinessTimelineConsumerRegistry,
} from "./businessTimelinePlatformFreezeRegistry.ts";

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "BusinessChart",
  "TimelineRenderer",
  "DashboardAdapter",
  "AssistantAdapter",
  "dataSourceIngestion",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/8",
  title: "Business Timeline Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-7:1 through APP-7:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeManifest.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeRegistry.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeCompatibility.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreezeRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreeze.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformFreeze.test.ts",
    "docs/app-7-8-business-timeline-platform-freeze.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-7/1",
    "APP-7/2",
    "APP-7/3",
    "APP-7/4",
    "APP-7/5",
    "APP-7/6",
    "APP-7/7",
  ]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_PLATFORM_FREEZE_TAGS,
} satisfies StageManifest);

export type BusinessTimelinePlatformFreezeManifest = Readonly<{
  platformId: typeof BUSINESS_TIMELINE_PLATFORM_ID;
  platformName: typeof BUSINESS_TIMELINE_PLATFORM_NAME;
  appId: "APP-7";
  releaseVersion: typeof BUSINESS_TIMELINE_PLATFORM_RELEASE_VERSION;
  releaseStatus: Readonly<{
    certified: typeof BUSINESS_TIMELINE_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof BUSINESS_TIMELINE_PLATFORM_STATUS_FROZEN;
    released: typeof BUSINESS_TIMELINE_PLATFORM_STATUS_RELEASED;
    readOnly: true;
  }>;
  freezeStatus: typeof BUSINESS_TIMELINE_PLATFORM_FREEZE_STATUS;
  certifiedBy: typeof BUSINESS_TIMELINE_PLATFORM_CERTIFIED_BY;
  certificationSource: typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SOURCE;
  consumedCertification: typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedPhases: typeof BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES;
  publicApis: typeof BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS;
  consumers: ReturnType<typeof getBusinessTimelineConsumerRegistry>;
  compatibilityMatrix: typeof BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
  extensionPolicy: typeof BUSINESS_TIMELINE_PLATFORM_EXTENSION_POLICY;
  forbiddenChanges: typeof BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES;
  allowedFutureExtensions: typeof BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS;
  noMutationPolicy: typeof BUSINESS_TIMELINE_PLATFORM_NO_MUTATION_POLICY;
  contractRegistry: typeof BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  freezeRules: typeof BUSINESS_TIMELINE_FREEZE_RULES;
  foundationContractVersion: typeof BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  freezeVersion: typeof BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  architectureVersion: typeof BUSINESS_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  releaseTag: typeof BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG;
  platformReleaseStatus: typeof BUSINESS_TIMELINE_PLATFORM_RELEASE_STATUS;
  certificationScore: number;
  readyForRelease: boolean;
  frozenAt: string;
  generatedAt: string;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildBusinessTimelinePlatformFreezeManifest(
  certification: BusinessTimelinePlatformCertificationResult,
  frozenAt: string = new Date().toISOString()
): BusinessTimelinePlatformFreezeManifest {
  const readyForRelease = certification.certified === true && certification.readyForFreeze === true;

  return Object.freeze({
    platformId: BUSINESS_TIMELINE_PLATFORM_ID,
    platformName: BUSINESS_TIMELINE_PLATFORM_NAME,
    appId: "APP-7",
    releaseVersion: BUSINESS_TIMELINE_PLATFORM_RELEASE_VERSION,
    releaseStatus: Object.freeze({
      certified: BUSINESS_TIMELINE_PLATFORM_STATUS_CERTIFIED,
      frozen: BUSINESS_TIMELINE_PLATFORM_STATUS_FROZEN,
      released: BUSINESS_TIMELINE_PLATFORM_STATUS_RELEASED,
      readOnly: true as const,
    }),
    freezeStatus: BUSINESS_TIMELINE_PLATFORM_FREEZE_STATUS,
    certifiedBy: BUSINESS_TIMELINE_PLATFORM_CERTIFIED_BY,
    certificationSource: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SOURCE,
    consumedCertification: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedPhases: BUSINESS_TIMELINE_PLATFORM_FROZEN_PHASES,
    publicApis: BUSINESS_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
    consumers: getBusinessTimelineConsumerRegistry(),
    compatibilityMatrix: BUSINESS_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
    extensionPolicy: BUSINESS_TIMELINE_PLATFORM_EXTENSION_POLICY,
    forbiddenChanges: BUSINESS_TIMELINE_PLATFORM_FORBIDDEN_CHANGES,
    allowedFutureExtensions: BUSINESS_TIMELINE_PLATFORM_ALLOWED_FUTURE_EXTENSIONS,
    noMutationPolicy: BUSINESS_TIMELINE_PLATFORM_NO_MUTATION_POLICY,
    contractRegistry: BUSINESS_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    freezeRules: BUSINESS_TIMELINE_FREEZE_RULES,
    foundationContractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    freezeVersion: BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    architectureVersion: BUSINESS_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    releaseTag: BUSINESS_TIMELINE_PLATFORM_RELEASE_TAG,
    platformReleaseStatus: BUSINESS_TIMELINE_PLATFORM_RELEASE_STATUS,
    certificationScore: certification.certificationScore,
    readyForRelease,
    frozenAt,
    generatedAt: frozenAt,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function validateBusinessTimelineFreezeManifest(
  manifest: BusinessTimelinePlatformFreezeManifest | null
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (!manifest) {
    issues.push("Freeze manifest is required.");
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }
  if (manifest.platformId !== BUSINESS_TIMELINE_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.freezeVersion !== BUSINESS_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION) {
    issues.push("Invalid freezeVersion.");
  }
  if (manifest.consumedCertification !== BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Invalid consumedCertification.");
  }
  if (manifest.certifiedPhases.length !== 8) {
    issues.push("Expected eight certified phases.");
  }
  if (manifest.consumers.length !== 7) {
    issues.push("Expected seven consumer contracts.");
  }
  if (manifest.forbiddenChanges.length < 7) {
    issues.push("Forbidden changes list incomplete.");
  }
  if (manifest.allowedFutureExtensions.length < 7) {
    issues.push("Allowed future extensions list incomplete.");
  }
  if (!manifest.readyForRelease) {
    issues.push("readyForRelease must be true.");
  }
  if (manifest.releaseStatus.certified !== true || manifest.releaseStatus.frozen !== true || manifest.releaseStatus.released !== true) {
    issues.push("Release status flags must be certified, frozen, and released.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export { BUSINESS_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES };
