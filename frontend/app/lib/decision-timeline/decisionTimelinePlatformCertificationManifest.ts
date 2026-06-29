/**
 * APP-6:11 — Decision Timeline Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST } from "./decisionAssistantEngine.ts";

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-6/11" as const;
export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-6/11-platform-certification-arch" as const;

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP6_11]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const DECISION_TIMELINE_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-6/1", title: "Decision Timeline Foundation", contractVersion: "APP-6/1" },
  { layerId: "APP-6/2", title: "Decision Event Engine", contractVersion: "APP-6/2" },
  { layerId: "APP-6/3", title: "Decision History Engine", contractVersion: "APP-6/3" },
  { layerId: "APP-6/4", title: "Decision Lifecycle Engine", contractVersion: "APP-6/4" },
  { layerId: "APP-6/5", title: "Decision State Engine", contractVersion: "APP-6/5" },
  { layerId: "APP-6/6", title: "Decision Query Engine", contractVersion: "APP-6/6" },
  { layerId: "APP-6/7", title: "Decision Comparison Engine", contractVersion: "APP-6/7" },
  { layerId: "APP-6/8", title: "Decision Replay Engine", contractVersion: "APP-6/8" },
  { layerId: "APP-6/9", title: "Decision Dashboard Integration", contractVersion: "APP-6/9" },
  { layerId: "APP-6/10", title: "Decision Assistant Integration", contractVersion: "APP-6/10" },
] as const);

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_platform_identity",
  "B_architecture_integrity",
  "C_public_api_surface",
  "D_cross_module_compatibility",
  "E_regression",
  "F_determinism",
  "G_workspace_isolation",
  "H_forbidden_dependencies",
  "I_build_integrity",
  "J_platform_readiness",
] as const);

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-6-1-decision-timeline-foundation-report.md",
  "docs/app-6-2-decision-event-engine-report.md",
  "docs/app-6-3-decision-history-engine-report.md",
  "docs/app-6-4-decision-lifecycle-engine-report.md",
  "docs/app-6-5-decision-state-engine-report.md",
  "docs/app-6-6-decision-query-engine-report.md",
  "docs/app-6-7-decision-comparison-engine-report.md",
  "docs/app-6-8-decision-replay-engine-report.md",
  "docs/app-6-9-decision-dashboard-integration-report.md",
  "docs/app-6-10-decision-assistant-integration-report.md",
  "docs/app-6-11-decision-timeline-platform-certification-report.md",
] as const);

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
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
  "PlatformFreeze",
  "freezePlatform",
] as const);

export const DECISION_TIMELINE_PLATFORM_INTEGRATION_MODULES = Object.freeze([
  "app/lib/decision-timeline/decisionDashboardAdapter.ts",
  "app/lib/decision-timeline/decisionAssistantAdapter.ts",
  "app/lib/decision-timeline/decisionDashboardEngine.ts",
  "app/lib/decision-timeline/decisionAssistantEngine.ts",
] as const);

export const DECISION_TIMELINE_PLATFORM_LAYER_DEPENDENCY_RULES = Object.freeze([
  Object.freeze({
    module: "decisionDashboardAdapter.ts",
    mustImport: ["decisionQueryEngine.ts", "decisionComparisonEngine.ts", "decisionReplayEngine.ts"],
    mustNotImport: [
      "decisionHistoryEngine.ts",
      "decisionLifecycleEngine.ts",
      "decisionStateEngine.ts",
      "decisionEventEngine.ts",
    ],
  }),
  Object.freeze({
    module: "decisionAssistantAdapter.ts",
    mustImport: ["decisionDashboardEngine.ts"],
    mustNotImport: [
      "decisionQueryEngine.ts",
      "decisionComparisonEngine.ts",
      "decisionReplayEngine.ts",
      "decisionHistoryEngine.ts",
      "decisionLifecycleEngine.ts",
      "decisionStateEngine.ts",
      "decisionEventEngine.ts",
    ],
  }),
] as const);

export const DECISION_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/11",
  title: "Decision Timeline Platform Certification",
  goal: "Official read-only platform-wide certification for APP-6:1 through APP-6:10.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertificationManifest.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformRegression.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertificationRunner.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertification.ts",
    "frontend/app/lib/decision-timeline/decisionTimelinePlatformCertification.test.ts",
    "docs/app-6-11-decision-timeline-platform-certification-report.md",
  ]),
  forbiddenPatterns: DECISION_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
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
  ]),
  runtimePath: "library-only" as const,
  tags: DECISION_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export function getDecisionTimelineCertificationManifestContract(): Readonly<{
  contractVersion: typeof DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  certifiedModuleCount: number;
  certificationGroupCount: number;
  readOnly: true;
}> {
  return Object.freeze({
    contractVersion: DECISION_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certifiedModuleCount: DECISION_TIMELINE_CERTIFIED_MODULES.length,
    certificationGroupCount: DECISION_TIMELINE_PLATFORM_CERTIFICATION_GROUP_KEYS.length,
    readOnly: true as const,
  });
}
