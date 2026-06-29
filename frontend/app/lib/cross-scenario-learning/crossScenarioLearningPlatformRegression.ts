/**
 * APP-10:8 — Cross-Scenario Learning Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runCrossScenarioLearningFoundation } from "./crossScenarioLearningRunner.ts";
import { runPatternExtractionEngine } from "./patternExtractionEngineRunner.ts";
import { runSimilarityEngineCertification } from "./similarityEngineRunner.ts";
import { runOutcomeLearningCertification } from "./outcomeLearningEngineRunner.ts";
import { runFailureLearningCertification } from "./failureLearningEngineRunner.ts";
import { runStrategyLearningCertification } from "./strategyLearningEngineRunner.ts";
import { runRecommendationLearningCertification } from "./recommendationLearningEngineRunner.ts";
import { RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST } from "./recommendationLearningEngine.ts";
import type { CrossScenarioLearningPlatformLayerRegressionResult } from "./crossScenarioLearningPlatformCertificationTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function layerResult(
  layerId: string,
  title: string,
  contractVersion: string,
  certified: boolean,
  passedCount: number,
  checkCount: number
): CrossScenarioLearningPlatformLayerRegressionResult {
  return Object.freeze({
    layerId,
    title,
    contractVersion,
    certified,
    passedCount,
    checkCount,
    summary: certified
      ? `${title} certified (${passedCount}/${checkCount} checks).`
      : `${title} failed (${passedCount}/${checkCount} checks).`,
    readOnly: true as const,
  });
}

function priorPhaseFilesPreserved(): boolean {
  const libraryFiles = RECOMMENDATION_LEARNING_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/cross-scenario-learning/") &&
      !file.includes("crossScenarioLearningPlatformCertification") &&
      !file.includes("app-10-8")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runCrossScenarioLearningPlatformRegression(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly CrossScenarioLearningPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runCrossScenarioLearningFoundation(timestamp);
  const pattern = runPatternExtractionEngine(timestamp);
  const similarity = runSimilarityEngineCertification(timestamp);
  const outcome = runOutcomeLearningCertification(timestamp);
  const failure = runFailureLearningCertification(timestamp);
  const strategy = runStrategyLearningCertification(timestamp);
  const recommendation = runRecommendationLearningCertification(timestamp);

  const layerResults = Object.freeze([
    layerResult("APP-10/1", "Foundation", "APP-10/1", foundation.certified, foundation.passedCount, foundation.checkCount),
    layerResult("APP-10/2", "Pattern Extraction", "APP-10/2", pattern.certified, pattern.passedCount, pattern.checkCount),
    layerResult("APP-10/3", "Similarity Engine", "APP-10/3", similarity.certified, similarity.passedCount, similarity.checkCount),
    layerResult("APP-10/4", "Outcome Learning", "APP-10/4", outcome.certified, outcome.passedCount, outcome.checkCount),
    layerResult("APP-10/5", "Failure Learning", "APP-10/5", failure.certified, failure.passedCount, failure.checkCount),
    layerResult("APP-10/6", "Strategy Learning", "APP-10/6", strategy.certified, strategy.passedCount, strategy.checkCount),
    layerResult(
      "APP-10/7",
      "Recommendation Learning",
      "APP-10/7",
      recommendation.certified,
      recommendation.passedCount,
      recommendation.checkCount
    ),
  ]);

  const layersPassed = layerResults.filter((entry) => entry.certified).length;
  const layersTotal = layerResults.length;
  const priorPhasesPreserved = priorPhaseFilesPreserved();
  const success = layersPassed === layersTotal && priorPhasesPreserved;

  return Object.freeze({
    success,
    layersPassed,
    layersTotal,
    summary: success
      ? `All ${layersTotal} APP-10 layers certified; prior phase files preserved.`
      : `Regression incomplete: ${layersPassed}/${layersTotal} layers certified.`,
    layerResults,
    priorPhasesPreserved,
    readOnly: true as const,
  });
}
