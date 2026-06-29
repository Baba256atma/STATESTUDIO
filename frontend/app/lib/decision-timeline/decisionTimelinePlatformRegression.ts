/**
 * APP-6:11 — Decision Timeline Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runDecisionAssistantIntegration } from "./decisionAssistantRunner.ts";
import { runDecisionComparisonEngine } from "./decisionComparisonRunner.ts";
import { runDecisionDashboardIntegration } from "./decisionDashboardRunner.ts";
import { runDecisionEventEngine } from "./decisionEventRunner.ts";
import { runDecisionHistoryEngine } from "./decisionHistoryRunner.ts";
import { runDecisionLifecycleEngine } from "./decisionLifecycleRunner.ts";
import { runDecisionQueryEngine } from "./decisionQueryRunner.ts";
import { runDecisionReplayEngine } from "./decisionReplayRunner.ts";
import { runDecisionStateEngine } from "./decisionStateRunner.ts";
import { runDecisionTimelineFoundation } from "./decisionTimelineRunner.ts";
import { DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST } from "./decisionAssistantEngine.ts";
import type { DecisionTimelinePlatformLayerRegressionResult } from "./decisionTimelinePlatformCertification.ts";

const REPO_ROOT = join(process.cwd(), "..");

function layerScore(certified: boolean, passedCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return certified ? 100 : 0;
  }
  return Math.round((passedCount / totalCount) * 100);
}

function layerResultFromCounts(
  layerId: string,
  certified: boolean,
  passedCount: number,
  totalCount: number,
  summary: string
): DecisionTimelinePlatformLayerRegressionResult {
  return Object.freeze({
    layerId,
    certified,
    score: layerScore(certified, passedCount, totalCount),
    summary,
    readOnly: true as const,
  });
}

function layerResultFromCertification(
  layerId: string,
  result: { certified: boolean; score: number; summary: string }
): DecisionTimelinePlatformLayerRegressionResult {
  return Object.freeze({
    layerId,
    certified: result.certified,
    score: result.score,
    summary: result.summary,
    readOnly: true as const,
  });
}

function priorPhaseFilesPreserved(): boolean {
  const libraryFiles = DECISION_ASSISTANT_INTEGRATION_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/decision-timeline/") &&
      !file.includes("decisionTimelinePlatformCertification") &&
      !file.includes("app-6-11")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runDecisionTimelinePlatformRegression(): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly DecisionTimelinePlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runDecisionTimelineFoundation();
  const event = runDecisionEventEngine();
  const history = runDecisionHistoryEngine();
  const lifecycle = runDecisionLifecycleEngine();
  const state = runDecisionStateEngine();
  const query = runDecisionQueryEngine();
  const comparison = runDecisionComparisonEngine();
  const replay = runDecisionReplayEngine();
  const dashboard = runDecisionDashboardIntegration();
  const assistant = runDecisionAssistantIntegration();

  const layerResults = Object.freeze([
    layerResultFromCounts(
      "APP-6/1",
      foundation.certified,
      foundation.passedCount,
      foundation.checkCount,
      `${foundation.passedCount}/${foundation.checkCount} foundation checks passed`
    ),
    layerResultFromCertification("APP-6/2", event),
    layerResultFromCertification("APP-6/3", history),
    layerResultFromCertification("APP-6/4", lifecycle),
    layerResultFromCertification("APP-6/5", state),
    layerResultFromCertification("APP-6/6", query),
    layerResultFromCertification("APP-6/7", comparison),
    layerResultFromCertification("APP-6/8", replay),
    layerResultFromCertification("APP-6/9", dashboard),
    layerResultFromCertification("APP-6/10", assistant),
  ]);

  const layersPassed = layerResults.filter((entry) => entry.certified).length;
  const priorPhasesPreserved = priorPhaseFilesPreserved();
  const success = layersPassed === layerResults.length && priorPhasesPreserved;

  return Object.freeze({
    success,
    layersPassed,
    layersTotal: layerResults.length,
    summary: `${layersPassed}/${layerResults.length} layer regressions passed.`,
    layerResults,
    priorPhasesPreserved,
    readOnly: true as const,
  });
}

export { REPO_ROOT as DECISION_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT };
