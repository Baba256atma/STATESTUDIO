/**
 * APP-8:8 — Decision Journal Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  DECISION_JOURNAL_PLATFORM_ID,
  DECISION_JOURNAL_PLATFORM_NAME,
} from "./decisionJournalConstants.ts";
import { DECISION_JOURNAL_API_SELF_MANIFEST } from "./decisionJournalApiManifest.ts";
import {
  DECISION_JOURNAL_API_GROUP_KEYS,
  DECISION_JOURNAL_CONSUMER_KEYS,
} from "./decisionJournalApiTypes.ts";
import {
  DECISION_JOURNAL_API_FORBIDDEN_CAPABILITIES,
  DECISION_JOURNAL_API_READ_CAPABILITIES,
  DECISION_JOURNAL_API_WRITE_CAPABILITIES,
} from "./decisionJournalApiManifest.ts";
import { listDecisionJournalConsumerContracts } from "./decisionJournalConsumerContracts.ts";
import type { DecisionJournalConsumerContract } from "./decisionJournalApiTypes.ts";

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-8/8" as const;
export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-8/8-platform-certification-arch" as const;

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP8_8]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-8/1", title: "Decision Journal Foundation", contractVersion: "APP-8/1" },
  { layerId: "APP-8/2", title: "Decision Journal Engine", contractVersion: "APP-8/2" },
  { layerId: "APP-8/3", title: "Decision Journal Query + Ordering", contractVersion: "APP-8/3" },
  { layerId: "APP-8/4", title: "Decision Journal Insight + Reflection", contractVersion: "APP-8/4" },
  { layerId: "APP-8/5", title: "Decision Journal Evidence + Assumption", contractVersion: "APP-8/5" },
  { layerId: "APP-8/6", title: "Decision Journal Outcome + Retrospective", contractVersion: "APP-8/6" },
  { layerId: "APP-8/7", title: "Decision Journal API + Consumer Contract", contractVersion: "APP-8/7" },
] as const);

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_app8_1_foundation",
  "B_app8_2_engine",
  "C_app8_3_query_layer",
  "D_app8_4_reflection_layer",
  "E_app8_5_quality_layer",
  "F_app8_6_retrospective_layer",
  "G_app8_7_api_layer",
  "H_public_facade_groups",
  "I_consumer_contracts",
  "J_workspace_isolation",
  "K_end_to_end_flow",
  "L_mutation_boundaries",
  "M_archive_policy",
  "N_readonly_consumers",
  "O_workspace_controlled_writes",
  "P_dashboard_assistant_visualization_readonly",
  "Q_no_app6_integration",
  "R_no_dashboard_implementation",
  "S_no_assistant_implementation",
  "T_no_visualization_implementation",
  "U_no_persistence",
  "V_no_ai_generation",
  "W_prior_platforms_untouched",
  "X_certification_deterministic",
  "Y_platform_manifest_valid",
  "Z_ready_for_freeze",
] as const);

export type DecisionJournalPlatformCertificationGroupKey =
  (typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-8-1-decision-journal-foundation.md",
  "docs/app-8-2-decision-journal-engine.md",
  "docs/app-8-3-decision-journal-query-ordering.md",
  "docs/app-8-4-decision-journal-insight-reflection.md",
  "docs/app-8-5-decision-journal-evidence-assumption.md",
  "docs/app-8-6-decision-journal-outcome-retrospective.md",
  "docs/app-8-7-decision-journal-api-consumer-contract.md",
  "docs/app-8-8-decision-journal-platform-certification.md",
] as const);

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "TimelineRenderer",
] as const);

export const DECISION_JOURNAL_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "DS",
  "INT",
] as const);

export const DECISION_JOURNAL_PLATFORM_PUBLIC_APIS = Object.freeze([
  "createDecisionJournalApi",
  "getDecisionJournalApi",
  "getDecisionJournalApiManifest",
  "validateDecisionJournalApiContract",
  "getDecisionJournalConsumerContract",
  "validateDecisionJournalConsumerAccess",
  "runDecisionJournalApiCertification",
  "runDecisionJournalPlatformCertification",
  "runDecisionJournalPlatformRegression",
  "getDecisionJournalPlatformManifest",
  "getDecisionJournalPlatformReadinessReport",
  "validateDecisionJournalPlatform",
] as const);

export const DECISION_JOURNAL_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/8",
  title: "Decision Journal Platform Certification",
  goal: "Official read-only full-platform certification for APP-8:1 through APP-8:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_API_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalPlatformCertificationTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformCertificationManifest.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformRegression.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformReadiness.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformCertification.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformCertificationRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalPlatformCertification.test.ts",
    "docs/app-8-8-decision-journal-platform-certification.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2", "APP-8/3", "APP-8/4", "APP-8/5", "APP-8/6", "APP-8/7"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type DecisionJournalPlatformManifest = Readonly<{
  platformId: typeof DECISION_JOURNAL_PLATFORM_ID;
  platformName: typeof DECISION_JOURNAL_PLATFORM_NAME;
  platformVersion: typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-8";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  publicApis: typeof DECISION_JOURNAL_PLATFORM_PUBLIC_APIS;
  consumers: readonly DecisionJournalConsumerContract[];
  capabilities: readonly string[];
  forbiddenCapabilities: typeof DECISION_JOURNAL_API_FORBIDDEN_CAPABILITIES;
  certificationGroups: typeof DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS;
  prerequisitePlatforms: typeof DECISION_JOURNAL_PLATFORM_PREREQUISITE_PLATFORMS;
  compatibilityMatrix: readonly Readonly<{ guaranteeId: string; description: string; enforced: true; readOnly: true }>[];
  readyForFreeze: boolean;
  certifiedAt: string | null;
  generatedAt: string;
  readOnly: true;
}>;

export function buildDecisionJournalPlatformManifest(
  generatedAt: string,
  readyForFreeze: boolean,
  certifiedAt: string | null = null
): DecisionJournalPlatformManifest {
  return Object.freeze({
    platformId: DECISION_JOURNAL_PLATFORM_ID,
    platformName: DECISION_JOURNAL_PLATFORM_NAME,
    platformVersion: DECISION_JOURNAL_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-8",
    phases: Object.freeze(
      DECISION_JOURNAL_PLATFORM_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          phaseId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    publicApis: DECISION_JOURNAL_PLATFORM_PUBLIC_APIS,
    consumers: listDecisionJournalConsumerContracts(),
    capabilities: Object.freeze([
      ...DECISION_JOURNAL_API_READ_CAPABILITIES,
      ...DECISION_JOURNAL_API_WRITE_CAPABILITIES,
      ...DECISION_JOURNAL_API_GROUP_KEYS,
    ]),
    forbiddenCapabilities: DECISION_JOURNAL_API_FORBIDDEN_CAPABILITIES,
    certificationGroups: DECISION_JOURNAL_PLATFORM_CERTIFICATION_GROUP_KEYS,
    prerequisitePlatforms: DECISION_JOURNAL_PLATFORM_PREREQUISITE_PLATFORMS,
    compatibilityMatrix: Object.freeze([
      Object.freeze({
        guaranteeId: "app6-decision-reference",
        description: "Compatible with APP-6 Decision Timeline without direct integration.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "app7-business-reference",
        description: "Compatible with APP-7 Business Timeline without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "frozen-prior-platforms",
        description: "Does not modify certified APP-1 through APP-7 platforms.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "facade-only-consumption",
        description: "Future consumers must use APP-8:7 facade — not internal modules.",
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

export function validateDecisionJournalPlatformManifest(
  manifest: DecisionJournalPlatformManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== DECISION_JOURNAL_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.phases.length !== 7) {
    issues.push("Expected seven certified phases.");
  }
  if (manifest.consumers.length !== DECISION_JOURNAL_CONSUMER_KEYS.length) {
    issues.push("Consumer contract count mismatch.");
  }
  if (manifest.certificationGroups.length !== 26) {
    issues.push("Expected 26 certification groups.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}
