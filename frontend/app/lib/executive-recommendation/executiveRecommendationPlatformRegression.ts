/**
 * APP-12:8 — Executive Recommendation Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runExecutiveRecommendationFoundation } from "./executiveRecommendationRunner.ts";
import { runRecommendationGenerationCertification } from "./executiveRecommendationGenerationEngineRunner.ts";
import { runRecommendationEvaluationCertification } from "./executiveRecommendationEvaluationEngineRunner.ts";
import { runRecommendationExplainabilityCertification } from "./executiveRecommendationExplainabilityEngineRunner.ts";
import { runRecommendationGovernanceCertification } from "./executiveRecommendationGovernanceEngineRunner.ts";
import { runRecommendationOptimizationCertification } from "./executiveRecommendationOptimizationEngineRunner.ts";
import { runRecommendationDeliveryCertification } from "./executiveRecommendationDeliveryEngineRunner.ts";
import { EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST } from "./executiveRecommendationDeliveryEngine.ts";
import type { PlatformRegressionLayerResult } from "./executiveRecommendationPlatformCertificationTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function layerResult(
  layerId: string,
  title: string,
  contractVersion: string,
  certified: boolean,
  passedCount: number,
  checkCount: number
): PlatformRegressionLayerResult {
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
  const libraryFiles = EXECUTIVE_RECOMMENDATION_DELIVERY_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/executive-recommendation/") &&
      !file.includes("executiveRecommendationPlatformCertification") &&
      !file.includes("app-12-8")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runExecutiveRecommendationPlatformRegression(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly PlatformRegressionLayerResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runExecutiveRecommendationFoundation(timestamp);
  const generation = runRecommendationGenerationCertification(timestamp);
  const evaluation = runRecommendationEvaluationCertification(timestamp);
  const explainability = runRecommendationExplainabilityCertification(timestamp);
  const governance = runRecommendationGovernanceCertification(timestamp);
  const optimization = runRecommendationOptimizationCertification(timestamp);
  const delivery = runRecommendationDeliveryCertification(timestamp);

  const layerResults = Object.freeze([
    layerResult("APP-12/1", "Foundation", "APP-12/1", foundation.certified, foundation.passedCount, foundation.checkCount),
    layerResult(
      "APP-12/2",
      "Generation Engine",
      "APP-12/2",
      generation.certified,
      generation.passedCount,
      generation.checkCount
    ),
    layerResult(
      "APP-12/3",
      "Evaluation Engine",
      "APP-12/3",
      evaluation.certified,
      evaluation.passedCount,
      evaluation.checkCount
    ),
    layerResult(
      "APP-12/4",
      "Explainability Engine",
      "APP-12/4",
      explainability.certified,
      explainability.passedCount,
      explainability.checkCount
    ),
    layerResult(
      "APP-12/5",
      "Governance Engine",
      "APP-12/5",
      governance.certified,
      governance.passedCount,
      governance.checkCount
    ),
    layerResult(
      "APP-12/6",
      "Optimization Engine",
      "APP-12/6",
      optimization.certified,
      optimization.passedCount,
      optimization.checkCount
    ),
    layerResult(
      "APP-12/7",
      "Delivery Engine",
      "APP-12/7",
      delivery.certified,
      delivery.passedCount,
      delivery.checkCount
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
      ? `All ${layersTotal} APP-12 layers certified; prior phase files preserved.`
      : `Regression incomplete: ${layersPassed}/${layersTotal} layers certified.`,
    layerResults,
    priorPhasesPreserved,
    readOnly: true as const,
  });
}
