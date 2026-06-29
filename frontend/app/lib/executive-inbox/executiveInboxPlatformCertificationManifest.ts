/**
 * APP-11:7 — Executive Inbox Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_INBOX_CONSUMER_REGISTRY,
  EXECUTIVE_INBOX_MUST_NOT_OWN,
  EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PLATFORM_ID,
  EXECUTIVE_INBOX_PLATFORM_NAME,
  EXECUTIVE_INBOX_PLATFORM_PRINCIPLES,
} from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST } from "./executiveInboxSchedulingEngine.ts";

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-11/7" as const;
export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-11/7-platform-certification-arch" as const;

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP11_7]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-11/1", title: "Executive Inbox Foundation", contractVersion: "APP-11/1" },
  { layerId: "APP-11/2", title: "Aggregation Engine", contractVersion: "APP-11/2" },
  { layerId: "APP-11/3", title: "Prioritization Engine", contractVersion: "APP-11/3" },
  { layerId: "APP-11/4", title: "Notification Engine", contractVersion: "APP-11/4" },
  { layerId: "APP-11/5", title: "Reminder Engine", contractVersion: "APP-11/5" },
  { layerId: "APP-11/6", title: "Scheduling Engine", contractVersion: "APP-11/6" },
] as const);

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
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

export type ExecutiveInboxPlatformCertificationGroupKey =
  (typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-11-1-executive-inbox-foundation.md",
  "docs/app-11-2-executive-inbox-aggregation-engine.md",
  "docs/app-11-3-executive-inbox-prioritization-engine.md",
  "docs/app-11-4-executive-inbox-notification-engine.md",
  "docs/app-11-5-executive-inbox-reminder-engine.md",
  "docs/app-11-6-executive-inbox-scheduling-engine.md",
  "docs/app-11-7-executive-inbox-platform-certification.md",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "platformFreeze",
  "createCalendarEvent",
  "backgroundJob",
  "setInterval(",
  "setTimeout(",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
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
  "DS",
  "INT",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS = Object.freeze([
  "certifyExecutiveInboxPlatform",
  "validateExecutiveInboxPlatform",
  "runExecutiveInboxPlatformCertification",
  "getExecutiveInboxCertificationManifest",
  "runExecutiveInboxPlatformRegression",
  "buildExecutiveInboxFoundation",
  "aggregateExecutiveInbox",
  "prioritizeExecutiveInbox",
  "generateExecutiveNotifications",
  "generateExecutiveReminders",
  "generateExecutiveScheduleIntents",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/7",
  title: "Executive Inbox Platform Certification",
  goal: "Official read-only full-platform certification for APP-11:1 through APP-11:6.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxPlatformCertificationTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformCertificationManifest.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformRegression.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformCertificationRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformCertification.ts",
    "frontend/app/lib/executive-inbox/executiveInboxPlatformCertification.test.ts",
    "docs/app-11-7-executive-inbox-platform-certification.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-11/1",
    "APP-11/2",
    "APP-11/3",
    "APP-11/4",
    "APP-11/5",
    "APP-11/6",
  ]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type ExecutiveInboxPlatformCertificationManifest = Readonly<{
  platformId: typeof EXECUTIVE_INBOX_PLATFORM_ID;
  platformName: typeof EXECUTIVE_INBOX_PLATFORM_NAME;
  platformVersion: typeof EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-11";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  dependencyVersions: Readonly<Record<string, string>>;
  publicApis: typeof EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS;
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

export function buildExecutiveInboxPlatformCertificationManifest(
  generatedAt: string,
  certified: boolean,
  regressionSummary: ExecutiveInboxPlatformCertificationManifest["regressionSummary"],
  certificationTimestamp: string | null = null
): ExecutiveInboxPlatformCertificationManifest {
  return Object.freeze({
    platformId: EXECUTIVE_INBOX_PLATFORM_ID,
    platformName: EXECUTIVE_INBOX_PLATFORM_NAME,
    platformVersion: EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-11",
    phases: Object.freeze(
      EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.map((entry) =>
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
        EXECUTIVE_INBOX_PLATFORM_CERTIFIED_MODULES.map((entry) => [entry.layerId, entry.contractVersion])
      )
    ),
    publicApis: EXECUTIVE_INBOX_PLATFORM_PUBLIC_APIS,
    supportedConsumers: Object.freeze(
      EXECUTIVE_INBOX_CONSUMER_REGISTRY.map((entry) =>
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
        description: "APP-11 consumes certified upstream platforms without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "metadata-only-inbox",
        description: "All inbox engines operate on metadata and certified references only.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "deterministic-outputs",
        description: "All APP-11 outputs are deterministic and immutable.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "frozen-prior-platforms",
        description: "Does not modify certified APP-1 through APP-10 platforms.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "no-delivery-or-execution",
        description: "No notification delivery, reminder delivery, or scheduling execution in APP-11.",
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

export function validateExecutiveInboxPlatformCertificationManifest(
  manifest: ExecutiveInboxPlatformCertificationManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== EXECUTIVE_INBOX_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.phases.length !== 6) {
    issues.push("Expected six certified phases.");
  }
  if (manifest.supportedConsumers.length === 0) {
    issues.push("Supported consumers must not be empty.");
  }
  if (manifest.compatibilityMatrix.length < 5) {
    issues.push("Compatibility matrix incomplete.");
  }
  if (manifest.platformVersion !== EXECUTIVE_INBOX_PLATFORM_CERTIFICATION_CONTRACT_VERSION) {
    issues.push("Platform version mismatch.");
  }
  if (!manifest.readOnly) {
    issues.push("Manifest must be read-only.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export const EXECUTIVE_INBOX_PLATFORM_COMPATIBILITY_GUARANTEES = Object.freeze({
  consumerOnly: EXECUTIVE_INBOX_PLATFORM_PRINCIPLES.includes("executive_inbox_is_consumer_only"),
  metadataOnly: EXECUTIVE_INBOX_PLATFORM_PRINCIPLES.includes("platform_must_remain_metadata_only"),
  deterministic: EXECUTIVE_INBOX_PLATFORM_PRINCIPLES.includes("inbox_is_deterministic_and_explainable"),
  noDelivery: EXECUTIVE_INBOX_MUST_NOT_OWN.includes("notification_delivery"),
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
});
