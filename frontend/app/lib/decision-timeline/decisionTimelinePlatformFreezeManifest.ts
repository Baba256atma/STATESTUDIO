/**
 * APP-6:12 — Decision Timeline Platform Freeze manifest and release metadata.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  DECISION_TIMELINE_EXTENSION_REGISTRY,
  DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY,
  DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_ID,
  DECISION_TIMELINE_PLATFORM_NAME,
} from "./decisionTimelineConstants.ts";
import { DECISION_TIMELINE_FREEZE_RULES } from "./decisionTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./decisionTimelinePlatformCertificationManifest.ts";
import { DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST } from "./decisionTimelinePlatformCertificationManifest.ts";
import type { DecisionTimelinePlatformCertificationResult } from "./decisionTimelinePlatformCertification.ts";
import { DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX } from "./decisionTimelinePlatformFreezeCompatibility.ts";
import {
  DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  DECISION_TIMELINE_PLATFORM_FROZEN_PHASES,
  DECISION_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
  DECISION_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  DECISION_TIMELINE_PLATFORM_FREEZE_TAGS,
  DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  DECISION_TIMELINE_PLATFORM_PUBLIC_GUARANTEES,
  DECISION_TIMELINE_PLATFORM_RELEASE_STAGE,
  DECISION_TIMELINE_PLATFORM_RELEASE_TAG,
  DECISION_TIMELINE_PLATFORM_STATUS_CERTIFIED,
  DECISION_TIMELINE_PLATFORM_STATUS_FROZEN,
  DECISION_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY,
  DECISION_TIMELINE_PLATFORM_STATUS_RELEASED,
  DECISION_TIMELINE_PLATFORM_SUPPORT_POLICY,
  DECISION_TIMELINE_PLATFORM_VERSION,
  DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
} from "./decisionTimelinePlatformFreezeRegistry.ts";

export const DECISION_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
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
  "deriveDecisionLifecycle",
  "computeDecisionHistory(",
  "compareDecisionStates(",
] as const);

export const DECISION_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/12",
  title: "Decision Timeline Platform Freeze",
  goal: "Official metadata-only platform freeze for certified APP-6:1 through APP-6:11.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreezeManifest.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreezeRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreezeCompatibility.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreezeValidation.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreeze.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreezeRunner.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformFreeze.test.ts",
    "docs/app-6-12-decision-timeline-platform-freeze-report.md",
  ]),
  forbiddenPatterns: DECISION_TIMELINE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-6/1",
    "APP-6/2",
    "APP-6/3",
    "APP-6/4",
    "APP-6/5",
    "APP-6/6",
    "APP-6/7",
    "APP-6/8",
    "APP-6/9",
    "APP-6/10",
    "APP-6/11",
  ]),
  runtimePath: "library-only" as const,
  tags: DECISION_TIMELINE_PLATFORM_FREEZE_TAGS,
} satisfies StageManifest);

export type DecisionTimelinePlatformFreezeManifest = Readonly<{
  platformId: typeof DECISION_TIMELINE_PLATFORM_ID;
  platformName: typeof DECISION_TIMELINE_PLATFORM_NAME;
  releaseVersion: typeof DECISION_TIMELINE_PLATFORM_VERSION;
  releaseStage: typeof DECISION_TIMELINE_PLATFORM_RELEASE_STAGE;
  releaseTag: typeof DECISION_TIMELINE_PLATFORM_RELEASE_TAG;
  certificationReference: typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  freezeVersion: typeof DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  compatibilityVersion: typeof DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION;
  releaseTimestamp: string;
  platformStatus: Readonly<{
    certified: typeof DECISION_TIMELINE_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof DECISION_TIMELINE_PLATFORM_STATUS_FROZEN;
    released: typeof DECISION_TIMELINE_PLATFORM_STATUS_RELEASED;
    productionReady: typeof DECISION_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY;
    readOnly: true;
  }>;
  certifiedModules: typeof DECISION_TIMELINE_PLATFORM_FROZEN_PHASES;
  publicApis: typeof DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS;
  extensionPoints: typeof DECISION_TIMELINE_EXTENSION_REGISTRY;
  reservedRegistries: typeof DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY;
  contractRegistry: typeof DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  compatibilityMatrix: typeof DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
  publicGuarantees: typeof DECISION_TIMELINE_PLATFORM_PUBLIC_GUARANTEES;
  extensionPolicy: typeof DECISION_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY;
  supportPolicy: typeof DECISION_TIMELINE_PLATFORM_SUPPORT_POLICY;
  freezeRules: typeof DECISION_TIMELINE_FREEZE_RULES;
  foundationContractVersion: typeof DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  architectureVersion: typeof DECISION_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  architectureHash: string;
  certificationScore: number;
  frozen: true;
  metadataOnly: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = DECISION_TIMELINE_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildDecisionTimelinePlatformFreezeManifest(
  certification: DecisionTimelinePlatformCertificationResult,
  releaseTimestamp: string = new Date().toISOString()
): DecisionTimelinePlatformFreezeManifest {
  return Object.freeze({
    platformId: DECISION_TIMELINE_PLATFORM_ID,
    platformName: DECISION_TIMELINE_PLATFORM_NAME,
    releaseVersion: DECISION_TIMELINE_PLATFORM_VERSION,
    releaseStage: DECISION_TIMELINE_PLATFORM_RELEASE_STAGE,
    releaseTag: DECISION_TIMELINE_PLATFORM_RELEASE_TAG,
    certificationReference: DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    freezeVersion: DECISION_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    compatibilityVersion: DECISION_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
    releaseTimestamp,
    platformStatus: Object.freeze({
      certified: DECISION_TIMELINE_PLATFORM_STATUS_CERTIFIED,
      frozen: DECISION_TIMELINE_PLATFORM_STATUS_FROZEN,
      released: DECISION_TIMELINE_PLATFORM_STATUS_RELEASED,
      productionReady: DECISION_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY,
      readOnly: true as const,
    }),
    certifiedModules: DECISION_TIMELINE_PLATFORM_FROZEN_PHASES,
    publicApis: DECISION_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
    extensionPoints: DECISION_TIMELINE_EXTENSION_REGISTRY,
    reservedRegistries: DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY,
    contractRegistry: DECISION_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    compatibilityMatrix: DECISION_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
    publicGuarantees: DECISION_TIMELINE_PLATFORM_PUBLIC_GUARANTEES,
    extensionPolicy: DECISION_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
    supportPolicy: DECISION_TIMELINE_PLATFORM_SUPPORT_POLICY,
    freezeRules: DECISION_TIMELINE_FREEZE_RULES,
    foundationContractVersion: DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    architectureVersion: DECISION_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    architectureHash: buildArchitectureHash(),
    certificationScore: certification.certificationScore,
    frozen: true as const,
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export { DECISION_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES };
