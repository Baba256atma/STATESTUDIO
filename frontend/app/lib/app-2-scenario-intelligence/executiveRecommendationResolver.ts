/**
 * APP-2:9 — Executive Recommendation Resolver.
 * Read-only consumption of ExecutiveScenarioSnapshot and ExecutiveScenarioSummary.
 */

import type { ExecutiveScenarioSnapshot } from "./executiveScenarioSnapshot.ts";
import type { ExecutiveScenarioSummary } from "./executiveScenarioSummaryResult.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";
import {
  buildEmptyExecutiveRecommendationPortfolio,
  buildExecutiveRecommendationPortfolio,
} from "./executiveRecommendationBuilder.ts";
import type { ExecutiveRecommendationPortfolio } from "./executiveRecommendationResult.ts";
import { createExecutiveRecommendationDiagnostic } from "./executiveRecommendationDiagnostics.ts";

export type ExecutiveRecommendationResolveRequest = Readonly<{
  snapshot: ExecutiveScenarioSnapshot;
  summary: ExecutiveScenarioSummary;
  generatedAt: string;
  workspaceId?: string;
}>;

export function validateExecutiveRecommendationInputs(
  snapshot: ExecutiveScenarioSnapshot,
  summary: ExecutiveScenarioSummary,
  workspaceId?: string
): Readonly<{ valid: boolean; message: string }> {
  if (!snapshot.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSnapshot must be read-only." });
  }
  if (!summary.readOnly) {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSummary must be read-only." });
  }
  if (snapshot.engineVersion !== "APP-2/8") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSnapshot engine version mismatch." });
  }
  if (summary.engineVersion !== "APP-2/8") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSummary engine version mismatch." });
  }
  if (snapshot.scenarioId !== summary.scenarioId) {
    return Object.freeze({ valid: false, message: "Snapshot and summary scenario ID mismatch." });
  }
  if (snapshot.workspaceId !== summary.workspaceId) {
    return Object.freeze({ valid: false, message: "Snapshot and summary workspace ID mismatch." });
  }
  if (workspaceId !== undefined && snapshot.workspaceId !== workspaceId.trim()) {
    return Object.freeze({ valid: false, message: "Workspace isolation violation." });
  }
  if (summary.summaryStatus === "incomplete") {
    return Object.freeze({ valid: false, message: "ExecutiveScenarioSummary is incomplete." });
  }
  return Object.freeze({ valid: true, message: "Inputs valid for recommendation portfolio construction." });
}

export function resolveExecutiveRecommendationPortfolio(
  request: ExecutiveRecommendationResolveRequest
): ExecutiveRecommendationPortfolio {
  const validation = validateExecutiveRecommendationInputs(
    request.snapshot,
    request.summary,
    request.workspaceId
  );

  if (!validation.valid) {
    const code =
      validation.message.includes("Snapshot") && validation.message.includes("read-only")
        ? "missing_snapshot"
        : validation.message.includes("Summary") && validation.message.includes("read-only")
          ? "missing_summary"
          : validation.message.includes("Workspace")
            ? "invalid_recommendation"
            : validation.message.includes("incomplete")
              ? "missing_summary"
              : "invalid_recommendation";

    return buildEmptyExecutiveRecommendationPortfolio(
      request.snapshot.scenarioId,
      request.snapshot.workspaceId,
      request.generatedAt,
      Object.freeze([
        createExecutiveRecommendationDiagnostic(code, validation.message, request.generatedAt, Object.freeze({
          workspaceId: request.workspaceId ?? null,
        })),
      ])
    );
  }

  return buildExecutiveRecommendationPortfolio(request.snapshot, request.summary, {
    generatedAt: request.generatedAt,
  });
}

export function resolveExecutiveRecommendationPortfolioProbeExample(
  generatedAt: string = new Date(0).toISOString()
): ExecutiveRecommendationPortfolio {
  return resolveExecutiveRecommendationPortfolio(
    Object.freeze({
      snapshot: resolveExecutiveScenarioSnapshotProbeExample(generatedAt),
      summary: resolveExecutiveScenarioSummaryProbeExample(generatedAt),
      generatedAt,
    })
  );
}
