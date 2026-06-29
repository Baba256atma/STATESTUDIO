/**
 * APP-2:9.5 — Executive Scenario Package Resolver.
 * Export-layer validation and package resolution — read-only aggregation.
 */

import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";
import { resolveExecutiveRecommendationPortfolioProbeExample } from "./executiveRecommendationResolver.ts";
import { buildExecutiveScenarioPackage } from "./executiveScenarioPackageBuilder.ts";
import type {
  ExecutiveScenarioPackage,
  ExecutiveScenarioPackageBuildRequest,
} from "./executiveScenarioPackage.ts";
import { createExecutiveScenarioPackageDiagnostic } from "./executiveScenarioPackageDiagnostics.ts";
import { createExecutiveScenarioPackageMetadata, EXECUTIVE_SCENARIO_PACKAGE_RULES } from "./executiveScenarioPackageManifest.ts";
import { buildExecutiveScenarioPackageId, createExecutiveScenarioPackage, createExecutiveScenarioPackageReferences } from "./executiveScenarioPackage.ts";

export type { ExecutiveScenarioPackage, ExecutiveScenarioPackageBuildRequest };

export function validateExecutiveScenarioPackageInputs(
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  recommendationPortfolio: ExecutiveRecommendationPortfolio,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!snapshot.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSnapshot must be read-only." });
  }
  if (!summary.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSummary must be read-only." });
  }
  if (!recommendationPortfolio.readOnly) {
    return Object.freeze({
      valid: false,
      message: "ExecutiveRecommendationPortfolio must be read-only.",
    });
  }
  if (snapshot.scenarioId !== summary.scenarioId) {
    return Object.freeze({ valid: false, message: "Snapshot and summary scenario ID mismatch." });
  }
  if (snapshot.scenarioId !== recommendationPortfolio.scenarioId) {
    return Object.freeze({
      valid: false,
      message: "Snapshot and recommendation portfolio scenario ID mismatch.",
    });
  }
  if (snapshot.workspaceId !== summary.workspaceId) {
    return Object.freeze({ valid: false, message: "Snapshot and summary workspace ID mismatch." });
  }
  if (snapshot.workspaceId !== recommendationPortfolio.workspaceId) {
    return Object.freeze({
      valid: false,
      message: "Snapshot and recommendation portfolio workspace ID mismatch.",
    });
  }
  if (workspaceId !== undefined && snapshot.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for package construction." });
}

export function resolveExecutiveScenarioPackage(
  request: ExecutiveScenarioPackageBuildRequest
): ExecutiveScenarioPackage {
  const validation = validateExecutiveScenarioPackageInputs(
    request.snapshot,
    request.summary,
    request.recommendationPortfolio,
    request.workspaceId
  );

  if (!validation.valid) {
    const code = validation.message.includes("Snapshot")
      ? "missing_snapshot"
      : validation.message.includes("Summary")
        ? "missing_summary"
        : validation.message.includes("Recommendation")
          ? "missing_recommendation_portfolio"
          : validation.message.includes("Workspace")
            ? "incomplete_package"
            : "version_mismatch";

    const metadata = createExecutiveScenarioPackageMetadata(
      request.snapshot.scenarioId,
      request.snapshot.workspaceId,
      request.generatedAt
    );

    return createExecutiveScenarioPackage({
      packageId: buildExecutiveScenarioPackageId(
        request.snapshot.scenarioId,
        request.snapshot.workspaceId,
        request.generatedAt
      ),
      packageVersion: "APP-2/9.5",
      scenarioId: request.snapshot.scenarioId,
      workspaceId: request.snapshot.workspaceId,
      snapshot: request.snapshot,
      summary: request.summary,
      recommendationPortfolio: request.recommendationPortfolio,
      references: createExecutiveScenarioPackageReferences(request.snapshot),
      metadata,
      diagnostics: Object.freeze([
        createExecutiveScenarioPackageDiagnostic(
          code,
          validation.message,
          request.generatedAt,
          Object.freeze({ workspaceId: request.workspaceId ?? null })
        ),
      ]),
      generatedAt: request.generatedAt,
    });
  }

  return buildExecutiveScenarioPackage(
    request.snapshot,
    request.summary,
    request.recommendationPortfolio,
    { generatedAt: request.generatedAt, workspaceId: request.workspaceId }
  );
}

export function resolveExecutiveScenarioPackageProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveScenarioPackage {
  return resolveExecutiveScenarioPackage(
    Object.freeze({
      snapshot: resolveExecutiveScenarioSnapshotProbeExample(generatedAt),
      summary: resolveExecutiveScenarioSummaryProbeExample(generatedAt),
      recommendationPortfolio: resolveExecutiveRecommendationPortfolioProbeExample(generatedAt),
      generatedAt,
    })
  );
}

export const ExecutiveScenarioPackageExport = Object.freeze({
  resolveExecutiveScenarioPackage,
  resolveExecutiveScenarioPackageProbeExample,
  validateExecutiveScenarioPackageInputs,
  rules: EXECUTIVE_SCENARIO_PACKAGE_RULES,
});
