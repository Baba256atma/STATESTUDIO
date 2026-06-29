/**
 * APP-2:9.5 — Executive Scenario Package manifest.
 * Versioning, metadata, and export boundary definitions.
 */

import {
  SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_IDENTITY,
} from "./scenarioIntelligenceContract.ts";
import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type { ExecutiveScenarioPackageDiagnostic } from "./executiveScenarioPackageDiagnostics.ts";

export const EXECUTIVE_SCENARIO_PACKAGE_VERSION = "APP-2/9.5" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_ARCHITECTURE_VERSION = "APP-2/9.5-arch" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION = "APP-2/9.5-cert" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_BUILD_VERSION = "APP-2/9.5-build" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_FREEZE_VERSION = "APP-2/9.5-freeze" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION = "APP-2/9.5-compat" as const;
export const EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION = "nexora-type-c" as const;

export type ExecutiveScenarioPackageMetadata = Readonly<{
  architecture: typeof EXECUTIVE_SCENARIO_PACKAGE_ARCHITECTURE_VERSION;
  certification: typeof EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION;
  freeze: typeof EXECUTIVE_SCENARIO_PACKAGE_FREEZE_VERSION;
  workspace: ScenarioIntelligenceWorkspaceId;
  scenario: ScenarioIntelligenceScenarioId;
  generatedAt: string;
  platformVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION;
  compatibilityVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION;
  packageVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_VERSION;
  buildVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_BUILD_VERSION;
  contractVersion: typeof SCENARIO_INTELLIGENCE_CONTRACT_VERSION;
  architectureVersion: typeof SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION;
  readOnly: true;
}>;

export const EXECUTIVE_SCENARIO_PACKAGE_MANIFEST = Object.freeze({
  stageId: "APP-2/9.5",
  title: "Executive Scenario Package",
  goal: "Single immutable export interface for APP-2 executive intelligence.",
  packageVersion: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
  architectureVersion: EXECUTIVE_SCENARIO_PACKAGE_ARCHITECTURE_VERSION,
  certificationVersion: EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION,
  buildVersion: EXECUTIVE_SCENARIO_PACKAGE_BUILD_VERSION,
  freezeVersion: EXECUTIVE_SCENARIO_PACKAGE_FREEZE_VERSION,
  compatibilityVersion: EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION,
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  contractModified: false,
  enginesModified: false,
  exportOnly: true,
} as const);

export const EXECUTIVE_SCENARIO_PACKAGE_TAGS = Object.freeze([
  "[APP2_9_5_EXECUTIVE_SCENARIO_PACKAGE]",
  "[EXECUTIVE_SCENARIO_PACKAGE_READY]",
  "[APP2_EXPORT_LAYER]",
  "[AGGREGATION_ONLY]",
  "[NO_INTELLIGENCE]",
  "[WORKSPACE_ISOLATED]",
  "[READ_ONLY]",
] as const);

export const EXECUTIVE_SCENARIO_PACKAGE_RULES = Object.freeze({
  aggregatesOnly: true,
  referencesOnly: true,
  noBusinessLogic: true,
  noAi: true,
  noScoring: true,
  noRecommendationGeneration: true,
  noMutation: true,
  noGlobalCache: true,
  noSingleton: true,
  readOnly: true,
  deterministic: true,
  serializable: true,
  workspaceIsolated: true,
} as const);

export function createExecutiveScenarioPackageMetadata(
  scenarioId: ScenarioIntelligenceScenarioId,
  workspaceId: ScenarioIntelligenceWorkspaceId,
  generatedAt: string
): ExecutiveScenarioPackageMetadata {
  return Object.freeze({
    architecture: EXECUTIVE_SCENARIO_PACKAGE_ARCHITECTURE_VERSION,
    certification: EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION,
    freeze: EXECUTIVE_SCENARIO_PACKAGE_FREEZE_VERSION,
    workspace: workspaceId,
    scenario: scenarioId,
    generatedAt,
    platformVersion: EXECUTIVE_SCENARIO_PACKAGE_PLATFORM_VERSION,
    compatibilityVersion: EXECUTIVE_SCENARIO_PACKAGE_COMPATIBILITY_VERSION,
    packageVersion: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
    buildVersion: EXECUTIVE_SCENARIO_PACKAGE_BUILD_VERSION,
    contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    architectureVersion: SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
    readOnly: true as const,
  });
}

export function validateExecutiveScenarioPackageMetadata(
  metadata: ExecutiveScenarioPackageMetadata
): readonly ExecutiveScenarioPackageDiagnostic[] {
  const diagnostics: ExecutiveScenarioPackageDiagnostic[] = [];
  const timestamp = metadata.generatedAt;

  if (metadata.packageVersion !== EXECUTIVE_SCENARIO_PACKAGE_VERSION) {
    diagnostics.push(
      createMetadataDiagnostic("version_mismatch", "Package version mismatch.", timestamp)
    );
  }
  if (metadata.certification !== EXECUTIVE_SCENARIO_PACKAGE_CERTIFICATION_VERSION) {
    diagnostics.push(
      createMetadataDiagnostic("certification_missing", "Package certification version missing.", timestamp)
    );
  }
  if (!metadata.scenario || !metadata.workspace) {
    diagnostics.push(
      createMetadataDiagnostic("invalid_metadata", "Package metadata missing scenario or workspace.", timestamp)
    );
  }

  return Object.freeze(diagnostics);
}

function createMetadataDiagnostic(
  code: import("./executiveScenarioPackageDiagnostics.ts").ExecutiveScenarioPackageDiagnosticCode,
  message: string,
  timestamp: string
): ExecutiveScenarioPackageDiagnostic {
  return Object.freeze({
    code,
    message,
    severity: code === "invalid_metadata" || code === "version_mismatch" || code === "certification_missing"
      ? "error"
      : "warning",
    timestamp,
    metadata: Object.freeze({}),
  });
}

export const EXECUTIVE_SCENARIO_PACKAGE_IDENTITY = Object.freeze({
  ...SCENARIO_INTELLIGENCE_IDENTITY,
  exportLayer: "APP-2/9.5",
  exportVersion: EXECUTIVE_SCENARIO_PACKAGE_VERSION,
});
