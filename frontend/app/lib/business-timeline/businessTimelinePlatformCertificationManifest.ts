/**
 * APP-7:7 — Business Timeline Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  BUSINESS_TIMELINE_PLATFORM_ID,
  BUSINESS_TIMELINE_PLATFORM_NAME,
} from "./businessTimelineConstants.ts";
import { BUSINESS_TIMELINE_API_SELF_MANIFEST } from "./businessTimelineApiManifest.ts";
import {
  BUSINESS_TIMELINE_API_GROUP_KEYS,
  BUSINESS_TIMELINE_CONSUMER_KEYS,
} from "./businessTimelineApiTypes.ts";
import {
  BUSINESS_TIMELINE_API_FORBIDDEN_CAPABILITIES,
  BUSINESS_TIMELINE_API_READ_CAPABILITIES,
  BUSINESS_TIMELINE_API_WRITE_CAPABILITIES,
} from "./businessTimelineApiManifest.ts";
import { listBusinessTimelineConsumerContracts } from "./businessTimelineConsumerContracts.ts";
import type { BusinessTimelineConsumerContract } from "./businessTimelineApiTypes.ts";

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-7/7" as const;
export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-7/7-platform-certification-arch" as const;

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP7_7]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-7/1", title: "Business Timeline Foundation", contractVersion: "APP-7/1" },
  { layerId: "APP-7/2", title: "Business Event Engine", contractVersion: "APP-7/2" },
  { layerId: "APP-7/3", title: "Business Timeline Query + Ordering", contractVersion: "APP-7/3" },
  { layerId: "APP-7/4", title: "Business Timeline Lifecycle + Milestones", contractVersion: "APP-7/4" },
  { layerId: "APP-7/5", title: "Business Timeline Context + Relationships", contractVersion: "APP-7/5" },
  { layerId: "APP-7/6", title: "Business Timeline API + Consumer Contract", contractVersion: "APP-7/6" },
] as const);

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_app7_1_foundation",
  "B_app7_2_event_engine",
  "C_app7_3_query_layer",
  "D_app7_4_lifecycle_layer",
  "E_app7_5_context_layer",
  "F_app7_6_api_layer",
  "G_public_facade_groups",
  "H_internal_modules_hidden",
  "I_workspace_isolation",
  "J_end_to_end_flow",
  "K_mutation_boundaries",
  "L_archive_policy",
  "M_readonly_consumers",
  "N_workspace_controlled_writes",
  "O_dashboard_assistant_visualization_readonly",
  "P_no_scenario_coupling",
  "Q_no_decision_coupling",
  "R_no_dashboard_implementation",
  "S_no_assistant_implementation",
  "T_no_visualization_implementation",
  "U_no_datasource_ingestion",
  "V_prior_platforms_untouched",
  "W_certification_deterministic",
  "X_platform_manifest_valid",
  "Y_ready_for_freeze",
] as const);

export type BusinessTimelinePlatformCertificationGroupKey =
  (typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-7-1-business-timeline-foundation.md",
  "docs/app-7-2-business-event-engine.md",
  "docs/app-7-3-business-timeline-query-ordering.md",
  "docs/app-7-4-business-timeline-lifecycle-milestones.md",
  "docs/app-7-5-business-timeline-causality-context.md",
  "docs/app-7-6-business-timeline-api-consumer-contract.md",
  "docs/app-7-7-business-timeline-platform-certification.md",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
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

export const BUSINESS_TIMELINE_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "DS",
  "INT",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_PUBLIC_APIS = Object.freeze([
  "createBusinessTimelineApi",
  "getBusinessTimelineApi",
  "getBusinessTimelineApiManifest",
  "validateBusinessTimelineApiContract",
  "getBusinessTimelineConsumerContract",
  "validateBusinessTimelineConsumerAccess",
  "runBusinessTimelineApiCertification",
  "runBusinessTimelinePlatformCertification",
  "runBusinessTimelinePlatformRegression",
  "getBusinessTimelinePlatformManifest",
  "getBusinessTimelinePlatformReadinessReport",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/7",
  title: "Business Timeline Platform Certification",
  goal: "Official read-only full-platform certification for APP-7:1 through APP-7:6.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_API_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelinePlatformCertificationTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformCertificationManifest.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformRegression.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformReadiness.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformCertification.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformCertificationRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelinePlatformCertification.test.ts",
    "docs/app-7-7-business-timeline-platform-certification.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-7/1", "APP-7/2", "APP-7/3", "APP-7/4", "APP-7/5", "APP-7/6"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type BusinessTimelinePlatformManifest = Readonly<{
  platformId: typeof BUSINESS_TIMELINE_PLATFORM_ID;
  platformName: typeof BUSINESS_TIMELINE_PLATFORM_NAME;
  platformVersion: typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-7";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  publicApis: typeof BUSINESS_TIMELINE_PLATFORM_PUBLIC_APIS;
  consumers: readonly BusinessTimelineConsumerContract[];
  capabilities: readonly string[];
  forbiddenCapabilities: typeof BUSINESS_TIMELINE_API_FORBIDDEN_CAPABILITIES;
  certificationGroups: typeof BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS;
  prerequisitePlatforms: typeof BUSINESS_TIMELINE_PLATFORM_PREREQUISITE_PLATFORMS;
  compatibilityMatrix: readonly Readonly<{ guaranteeId: string; description: string; enforced: true; readOnly: true }>[];
  readyForFreeze: boolean;
  certifiedAt: string | null;
  generatedAt: string;
  readOnly: true;
}>;

export function buildBusinessTimelinePlatformManifest(
  generatedAt: string,
  readyForFreeze: boolean,
  certifiedAt: string | null = null
): BusinessTimelinePlatformManifest {
  return Object.freeze({
    platformId: BUSINESS_TIMELINE_PLATFORM_ID,
    platformName: BUSINESS_TIMELINE_PLATFORM_NAME,
    platformVersion: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-7",
    phases: Object.freeze(
      BUSINESS_TIMELINE_PLATFORM_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          phaseId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    publicApis: BUSINESS_TIMELINE_PLATFORM_PUBLIC_APIS,
    consumers: listBusinessTimelineConsumerContracts(),
    capabilities: Object.freeze([
      ...BUSINESS_TIMELINE_API_READ_CAPABILITIES,
      ...BUSINESS_TIMELINE_API_WRITE_CAPABILITIES,
      ...BUSINESS_TIMELINE_API_GROUP_KEYS,
    ]),
    forbiddenCapabilities: BUSINESS_TIMELINE_API_FORBIDDEN_CAPABILITIES,
    certificationGroups: BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS,
    prerequisitePlatforms: BUSINESS_TIMELINE_PLATFORM_PREREQUISITE_PLATFORMS,
    compatibilityMatrix: Object.freeze([
      Object.freeze({
        guaranteeId: "app5-scenario-reference",
        description: "Compatible with APP-5 Scenario Timeline without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "app6-decision-reference",
        description: "Compatible with APP-6 Decision Timeline without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "frozen-prior-platforms",
        description: "Does not modify certified APP-1 through APP-6 platforms.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "facade-only-consumption",
        description: "Future consumers must use APP-7:6 facade — not internal modules.",
        enforced: true as const,
        readOnly: true as const,
      }),
    ]),
    readyForFreeze,
    certifiedAt,
    generatedAt,
    readOnly: true as const,
  });
}

export function validateBusinessTimelinePlatformManifest(
  manifest: BusinessTimelinePlatformManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== BUSINESS_TIMELINE_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.phases.length !== 6) {
    issues.push("Expected six certified phases.");
  }
  if (manifest.consumers.length !== BUSINESS_TIMELINE_CONSUMER_KEYS.length) {
    issues.push("Consumer contract count mismatch.");
  }
  if (manifest.certificationGroups.length !== 25) {
    issues.push("Expected 25 certification groups.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}
