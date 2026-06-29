/**
 * APP-2:14 — Scenario Intelligence Platform Freeze Manifest.
 * Immutable release metadata — freeze only, no runtime changes.
 */

import { SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION, SCENARIO_INTELLIGENCE_CONTRACT_VERSION } from "./scenarioIntelligenceContract.ts";
import { SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY } from "./scenarioIntelligenceApi.ts";
import { SCENARIO_CONTEXT_ENGINE_VERSION } from "./scenarioContextResult.ts";
import { SCENARIO_STATE_ENGINE_VERSION } from "./scenarioStateResult.ts";
import { SCENARIO_DEPENDENCY_GRAPH_VERSION } from "./scenarioDependencyGraph.ts";
import { EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION } from "./executiveScenarioConflictGraph.ts";
import { EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION } from "./executiveScenarioOpportunityGraph.ts";
import { EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION } from "./executiveScenarioPriorityResult.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import { EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION } from "./executiveRecommendationPortfolio.ts";
import {
  EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION,
  EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION,
  EXECUTIVE_SCENARIO_PACKAGE_VERSION,
} from "./executiveScenarioPackageManifest.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION } from "./executiveScenarioWorkspaceView.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION } from "./executiveScenarioAssistantView.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION } from "./executiveScenarioDashboardView.ts";
import { SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION } from "./scenarioIntelligencePlatformCertificationContract.ts";

export const SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION = "APP-2/14" as const;
export const SCENARIO_INTELLIGENCE_PLATFORM_STATUS = "FROZEN" as const;

export const SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS = Object.freeze([
  "[APP2_PLATFORM_FROZEN]",
  "[SCENARIO_INTELLIGENCE_PLATFORM_COMPLETE]",
  "[EXECUTIVE_SCENARIO_PLATFORM_CERTIFIED]",
  "[EXECUTIVE_SCENARIO_PLATFORM_RELEASED]",
  "[NO_DIRECT_INTERNAL_ACCESS]",
  "[APP2_COMPLETE]",
  "[ARCHITECTURE_FROZEN]",
] as const);

export const SCENARIO_INTELLIGENCE_PLATFORM_FUTURE_EXTENSION_POLICY = Object.freeze({
  policyId: "APP-2-PLATFORM-EXTENSION",
  rule: "Future enhancements must extend the platform without modifying frozen APP-2 core architecture.",
  permitted: Object.freeze(["consumer_bindings", "adapter_wrappers", "metadata_extensions"]),
  forbidden: Object.freeze([
    "engine_rewrites",
    "public_api_breaking_changes",
    "export_surface_changes",
    "direct_engine_consumer_access",
    "adapter_bypass",
  ]),
});

export const SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST = Object.freeze({
  executiveMemory: Object.freeze({ compatible: true, mustUsePackageExport: true, runtimeBehaviorChanged: false }),
  governance: Object.freeze({ compatible: true, mustUsePackageExport: true, runtimeBehaviorChanged: false }),
  decisionJournal: Object.freeze({ compatible: true, mustUsePackageExport: true, runtimeBehaviorChanged: false }),
  executiveTime: Object.freeze({ compatible: true, readOnlyReferenceOnly: true, runtimeBehaviorChanged: false }),
  workspace: Object.freeze({ compatible: true, mustUseWorkspaceAdapter: true, runtimeBehaviorChanged: false }),
  assistant: Object.freeze({ compatible: true, mustUseAssistantAdapter: true, runtimeBehaviorChanged: false }),
  dashboard: Object.freeze({ compatible: true, mustUseDashboardAdapter: true, runtimeBehaviorChanged: false }),
  layArchitecture: Object.freeze({ compatible: true, mustUseAdapterBoundaries: true, runtimeBehaviorChanged: false }),
});

export const SCENARIO_INTELLIGENCE_PLATFORM_FROZEN_PUBLIC_APIS = Object.freeze([
  "ExecutiveScenarioPackageExport",
  "ExecutiveScenarioWorkspaceIntegration",
  "ExecutiveScenarioAssistantIntegration",
  "ExecutiveScenarioDashboardIntegration",
  "resolveExecutiveScenarioPackage",
  "resolveExecutiveScenarioWorkspaceView",
  "resolveExecutiveScenarioAssistantView",
  "resolveExecutiveScenarioDashboardView",
  "ScenarioIntelligencePlatformCertificationRunner",
  "ScenarioIntelligencePlatformFreezeRunner",
  "runScenarioIntelligencePlatformFinalCertification",
]);

export const SCENARIO_INTELLIGENCE_PLATFORM_FORBIDDEN_CONSUMER_IMPORTS = Object.freeze([
  "scenarioStateEngine",
  "scenarioContextEngine",
  "executiveScenarioPriorityEvaluator",
  "scenarioDependencyEngine",
  "executiveScenarioConflictEngine",
  "executiveScenarioOpportunityEngine",
  "executiveScenarioSummaryEngine",
  "executiveRecommendationEngine",
  "executiveScenarioPackageBuilder",
]);

export type ScenarioIntelligencePlatformFreezeManifest = Readonly<{
  freezeVersion: typeof SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION;
  platformVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  architectureVersion: typeof SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION;
  packageVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_VERSION;
  compatibilityVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION;
  certificationVersion: typeof SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION;
  certificationDate: string;
  platformStatus: typeof SCENARIO_INTELLIGENCE_PLATFORM_STATUS;
  frozenPublicApis: readonly string[];
  frozenLayers: Readonly<{
    intelligence: readonly string[];
    executive: readonly string[];
    export: readonly string[];
    integration: readonly string[];
  }>;
  frozenComponents: Readonly<Record<string, string>>;
  frozenAdapterRules: readonly string[];
  futureExtensionPolicy: typeof SCENARIO_INTELLIGENCE_PLATFORM_FUTURE_EXTENSION_POLICY;
  compatibilityManifest: typeof SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST;
  futureCompatibility: typeof SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY;
  releaseTags: readonly string[];
  architectureHash: string;
  metadataOnly: true;
}>;

function buildArchitectureHash(components: Readonly<Record<string, string>>): string {
  const payload = Object.entries(components)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildScenarioIntelligencePlatformFreezeManifest(
  certificationDate: string
): ScenarioIntelligencePlatformFreezeManifest {
  const frozenComponents = Object.freeze({
    contract: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    state: SCENARIO_STATE_ENGINE_VERSION,
    context: SCENARIO_CONTEXT_ENGINE_VERSION,
    priority: EXECUTIVE_SCENARIO_PRIORITY_ENGINE_VERSION,
    dependency: SCENARIO_DEPENDENCY_GRAPH_VERSION,
    conflict: EXECUTIVE_SCENARIO_CONFLICT_GRAPH_VERSION,
    opportunity: EXECUTIVE_SCENARIO_OPPORTUNITY_GRAPH_VERSION,
    snapshot: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
    summary: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
    recommendation: EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
    package: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
    workspaceAdapter: EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
    assistantAdapter: EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_VERSION,
    dashboardAdapter: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
    platformCertification: SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
    freeze: SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
  });

  return Object.freeze({
    freezeVersion: SCENARIO_INTELLIGENCE_PLATFORM_FREEZE_VERSION,
    platformVersion: EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    architectureVersion: SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
    packageVersion: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
    compatibilityVersion: EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION,
    certificationVersion: SCENARIO_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
    certificationDate,
    platformStatus: SCENARIO_INTELLIGENCE_PLATFORM_STATUS,
    frozenPublicApis: SCENARIO_INTELLIGENCE_PLATFORM_FROZEN_PUBLIC_APIS,
    frozenLayers: Object.freeze({
      intelligence: Object.freeze([
        "Contract",
        "State",
        "Context",
        "Priority",
        "Dependency Graph",
        "Conflict Graph",
        "Opportunity Graph",
      ]),
      executive: Object.freeze(["Snapshot", "Summary", "Recommendation Portfolio"]),
      export: Object.freeze(["ExecutiveScenarioPackage"]),
      integration: Object.freeze(["Workspace Adapter", "Assistant Adapter", "Dashboard Adapter"]),
    }),
    frozenComponents,
    frozenAdapterRules: Object.freeze([
      "Workspace adapter consumes ExecutiveScenarioPackage only",
      "Assistant adapter consumes ExecutiveScenarioWorkspaceView only",
      "Dashboard adapter consumes ExecutiveScenarioWorkspaceView only",
      "Consumers must not import APP-2 internal engines",
      "ExecutiveScenarioPackage is the sole export surface",
    ]),
    futureExtensionPolicy: SCENARIO_INTELLIGENCE_PLATFORM_FUTURE_EXTENSION_POLICY,
    compatibilityManifest: SCENARIO_INTELLIGENCE_PLATFORM_COMPATIBILITY_MANIFEST,
    futureCompatibility: SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY,
    releaseTags: SCENARIO_INTELLIGENCE_PLATFORM_RELEASE_TAGS,
    architectureHash: buildArchitectureHash(frozenComponents),
    metadataOnly: true,
  });
}

export const ScenarioIntelligencePlatformFreezeManifestBuilder = Object.freeze({
  buildScenarioIntelligencePlatformFreezeManifest,
});
