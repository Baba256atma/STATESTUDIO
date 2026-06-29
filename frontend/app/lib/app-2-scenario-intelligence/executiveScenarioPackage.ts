/**
 * APP-2:9.5 — Executive Scenario Package.
 * Canonical export package type — aggregation only, no intelligence.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type { ScenarioContext } from "./scenarioContextResult.ts";
import type { ScenarioStateResult } from "./scenarioStateResult.ts";
import type { ExecutiveScenarioPriority } from "./executiveScenarioPriorityResult.ts";
import type { ScenarioDependencyGraph } from "./scenarioDependencyResult.ts";
import type { ExecutiveScenarioConflictGraph } from "./executiveScenarioConflictResult.ts";
import type { ExecutiveScenarioOpportunityGraph } from "./executiveScenarioOpportunityResult.ts";
import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import type {
  ExecutiveScenarioPackageDiagnostic,
  ExecutiveScenarioPackageMetadata,
} from "./executiveScenarioPackageManifest.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_VERSION } from "./executiveScenarioPackageManifest.ts";

export type ExecutiveScenarioPackageReferences = Readonly<{
  context: ScenarioContext;
  state: ScenarioStateResult | null;
  priority: ExecutiveScenarioPriority;
  dependencyGraph: ScenarioDependencyGraph;
  conflictGraph: ExecutiveScenarioConflictGraph;
  opportunityGraph: ExecutiveScenarioOpportunityGraph;
  readOnly: true;
}>;

export type ExecutiveScenarioPackage = Readonly<{
  packageId: string;
  packageVersion: typeof EXECUTIVE_SCENARIO_PACKAGE_VERSION;
  scenarioId: ScenarioIntelligenceScenarioId;
  workspaceId: ScenarioIntelligenceWorkspaceId;
  snapshot: ExecutiveScenarioSnapshot;
  summary: ExecutiveScenarioSummary;
  recommendationPortfolio: ExecutiveRecommendationPortfolio;
  references: ExecutiveScenarioPackageReferences;
  metadata: ExecutiveScenarioPackageMetadata;
  diagnostics: readonly ExecutiveScenarioPackageDiagnostic[];
  generatedAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioPackageBuildRequest = Readonly<{
  snapshot: ExecutiveScenarioSnapshot;
  summary: ExecutiveScenarioSummary;
  recommendationPortfolio: ExecutiveRecommendationPortfolio;
  generatedAt: string;
  workspaceId?: string;
}>;

export function createExecutiveScenarioPackage(
  input: Omit<ExecutiveScenarioPackage, "readOnly">
): ExecutiveScenarioPackage {
  return Object.freeze({
    ...input,
    readOnly: true as const,
  });
}

export function createExecutiveScenarioPackageReferences(
  snapshot: ExecutiveScenarioSnapshot
): ExecutiveScenarioPackageReferences {
  return Object.freeze({
    context: snapshot.context,
    state: snapshot.state,
    priority: snapshot.priority,
    dependencyGraph: snapshot.dependencyGraph,
    conflictGraph: snapshot.conflictGraph,
    opportunityGraph: snapshot.opportunityGraph,
    readOnly: true as const,
  });
}

export function buildExecutiveScenarioPackageId(
  scenarioId: string,
  workspaceId: string,
  generatedAt: string
): string {
  return `app2-package:${workspaceId}:${scenarioId}:${generatedAt}`;
}
