/**
 * APP-2:9.5 — Executive Scenario Package Builder.
 * Pure aggregation and freeze — no intelligence or calculation.
 */

import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import {
  buildExecutiveScenarioPackageId,
  createExecutiveScenarioPackage,
  createExecutiveScenarioPackageReferences,
  type ExecutiveScenarioPackage,
} from "./executiveScenarioPackage.ts";
import {
  createExecutiveScenarioPackageMetadata,
  validateExecutiveScenarioPackageMetadata,
} from "./executiveScenarioPackageManifest.ts";
import {
  createExecutiveScenarioPackageDiagnostic,
  type ExecutiveScenarioPackageDiagnostic,
} from "./executiveScenarioPackageDiagnostics.ts";

function validatePackageInputs(
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  recommendationPortfolio: ExecutiveRecommendationPortfolio,
  generatedAt: string,
  workspaceId?: string
): readonly ExecutiveScenarioPackageDiagnostic[] {
  const diagnostics: ExecutiveScenarioPackageDiagnostic[] = [];

  if (!snapshot.readOnly) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "missing_snapshot",
        "ExecutiveScenarioSnapshot must be read-only.",
        generatedAt
      )
    );
  }
  if (!summary.readOnly) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "missing_summary",
        "ExecutiveScenarioSummary must be read-only.",
        generatedAt
      )
    );
  }
  if (!recommendationPortfolio.readOnly) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "missing_recommendation_portfolio",
        "ExecutiveRecommendationPortfolio must be read-only.",
        generatedAt
      )
    );
  }
  if (snapshot.engineVersion !== "APP-2/8") {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "version_mismatch",
        "ExecutiveScenarioSnapshot engine version mismatch.",
        generatedAt
      )
    );
  }
  if (summary.engineVersion !== "APP-2/8") {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "version_mismatch",
        "ExecutiveScenarioSummary engine version mismatch.",
        generatedAt
      )
    );
  }
  if (recommendationPortfolio.engineVersion !== "APP-2/9") {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "version_mismatch",
        "ExecutiveRecommendationPortfolio engine version mismatch.",
        generatedAt
      )
    );
  }
  const scenarioId = snapshot.scenarioId;
  if (
    scenarioId !== summary.scenarioId ||
    scenarioId !== recommendationPortfolio.scenarioId
  ) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "version_mismatch",
        "Certified output scenario ID mismatch.",
        generatedAt
      )
    );
  }
  if (
    snapshot.workspaceId !== summary.workspaceId ||
    snapshot.workspaceId !== recommendationPortfolio.workspaceId
  ) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "version_mismatch",
        "Certified output workspace ID mismatch.",
        generatedAt
      )
    );
  }
  if (workspaceId !== undefined && snapshot.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "incomplete_package",
        "Workspace isolation violation.",
        generatedAt,
        Object.freeze({ workspaceId })
      )
    );
  }
  if (summary.summaryStatus === "incomplete") {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "incomplete_package",
        "ExecutiveScenarioSummary is incomplete.",
        generatedAt
      )
    );
  }
  if (recommendationPortfolio.recommendations.length === 0) {
    diagnostics.push(
      createExecutiveScenarioPackageDiagnostic(
        "incomplete_package",
        "ExecutiveRecommendationPortfolio contains no recommendations.",
        generatedAt
      )
    );
  }

  return Object.freeze(diagnostics);
}

export function buildExecutiveScenarioPackage(
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  recommendationPortfolio: ExecutiveRecommendationPortfolio,
  options: Readonly<{ generatedAt: string; workspaceId?: string }>
): ExecutiveScenarioPackage {
  const inputDiagnostics = validatePackageInputs(
    snapshot,
    summary,
    recommendationPortfolio,
    options.generatedAt,
    options.workspaceId
  );

  const hasBlockingError = inputDiagnostics.some((entry) => entry.severity === "error");

  const metadata = createExecutiveScenarioPackageMetadata(
    snapshot.scenarioId,
    snapshot.workspaceId,
    options.generatedAt
  );

  const metadataDiagnostics = validateExecutiveScenarioPackageMetadata(metadata);
  const diagnostics = Object.freeze([...inputDiagnostics, ...metadataDiagnostics]);

  if (hasBlockingError || metadataDiagnostics.some((entry) => entry.severity === "error")) {
    return createExecutiveScenarioPackage({
      packageId: buildExecutiveScenarioPackageId(
        snapshot.scenarioId,
        snapshot.workspaceId,
        options.generatedAt
      ),
      packageVersion: "APP-2/9.5",
      scenarioId: snapshot.scenarioId,
      workspaceId: snapshot.workspaceId,
      snapshot,
      summary,
      recommendationPortfolio,
      references: createExecutiveScenarioPackageReferences(snapshot),
      metadata,
      diagnostics,
      generatedAt: options.generatedAt,
    });
  }

  return createExecutiveScenarioPackage({
    packageId: buildExecutiveScenarioPackageId(
      snapshot.scenarioId,
      snapshot.workspaceId,
      options.generatedAt
    ),
    packageVersion: "APP-2/9.5",
    scenarioId: snapshot.scenarioId,
    workspaceId: snapshot.workspaceId,
    snapshot,
    summary,
    recommendationPortfolio,
    references: createExecutiveScenarioPackageReferences(snapshot),
    metadata,
    diagnostics,
    generatedAt: options.generatedAt,
  });
}

export function buildEmptyExecutiveScenarioPackage(
  scenarioId: string,
  workspaceId: string,
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  recommendationPortfolio: ExecutiveRecommendationPortfolio,
  generatedAt: string,
  diagnostics: readonly ExecutiveScenarioPackageDiagnostic[]
): ExecutiveScenarioPackage {
  const metadata = createExecutiveScenarioPackageMetadata(scenarioId, workspaceId, generatedAt);
  return createExecutiveScenarioPackage({
    packageId: buildExecutiveScenarioPackageId(scenarioId, workspaceId, generatedAt),
    packageVersion: "APP-2/9.5",
    scenarioId,
    workspaceId,
    snapshot,
    summary,
    recommendationPortfolio,
    references: createExecutiveScenarioPackageReferences(snapshot),
    metadata,
    diagnostics,
    generatedAt,
  });
}
