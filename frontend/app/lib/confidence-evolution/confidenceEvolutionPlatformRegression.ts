/**
 * APP-9:8 — Confidence Evolution Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runConfidenceEvolutionEngineCertification } from "./confidenceEvolutionEngineRunner.ts";
import { runConfidenceEvolutionApiCertification } from "./confidenceEvolutionApiRunner.ts";
import { runConfidenceEvolutionQueryCertification } from "./confidenceEvolutionQueryRunner.ts";
import { runConfidenceTrendCertification } from "./confidenceEvolutionTrendRunner.ts";
import { runConfidenceEvidenceReasonCertification } from "./confidenceEvolutionEvidenceReasonRunner.ts";
import { runConfidenceCalibrationCertification } from "./confidenceEvolutionCalibrationRunner.ts";
import { runConfidenceEvolutionFoundation } from "./confidenceEvolutionRunner.ts";
import { CONFIDENCE_EVOLUTION_API_SELF_MANIFEST } from "./confidenceEvolutionApiManifest.ts";
import type { ConfidenceEvolutionPlatformLayerRegressionResult } from "./confidenceEvolutionPlatformCertificationTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function layerScore(certified: boolean, passedCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return certified ? 100 : 0;
  }
  return Math.round((passedCount / totalCount) * 100);
}

function layerResultFromCounts(
  layerId: string,
  title: string,
  contractVersion: string,
  certified: boolean,
  passedCount: number,
  totalCount: number,
  summary: string
): ConfidenceEvolutionPlatformLayerRegressionResult {
  return Object.freeze({
    layerId,
    title,
    contractVersion,
    certified,
    score: layerScore(certified, passedCount, totalCount),
    summary,
    readOnly: true as const,
  });
}

function layerResultFromCertification(
  layerId: string,
  title: string,
  contractVersion: string,
  result: { certified: boolean; score: number; summary: string }
): ConfidenceEvolutionPlatformLayerRegressionResult {
  return Object.freeze({
    layerId,
    title,
    contractVersion,
    certified: result.certified,
    score: result.score,
    summary: result.summary,
    readOnly: true as const,
  });
}

function priorPhaseFilesPreserved(): boolean {
  const libraryFiles = CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/confidence-evolution/") &&
      !file.includes("confidenceEvolutionPlatformCertification") &&
      !file.includes("app-9-8")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runConfidenceEvolutionPlatformRegression(): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly ConfidenceEvolutionPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runConfidenceEvolutionFoundation();
  const engine = runConfidenceEvolutionEngineCertification();
  const query = runConfidenceEvolutionQueryCertification();
  const trend = runConfidenceTrendCertification();
  const evidenceReason = runConfidenceEvidenceReasonCertification();
  const calibration = runConfidenceCalibrationCertification();
  const api = runConfidenceEvolutionApiCertification();

  const layerResults = Object.freeze([
    layerResultFromCounts(
      "APP-9/1",
      "Confidence Evolution Foundation",
      "APP-9/1",
      foundation.certified,
      foundation.passedCount,
      foundation.checkCount,
      `${foundation.passedCount}/${foundation.checkCount} foundation checks passed`
    ),
    layerResultFromCertification("APP-9/2", "Confidence Evolution Engine", "APP-9/2", engine),
    layerResultFromCertification("APP-9/3", "Confidence Evolution Query + Ordering", "APP-9/3", query),
    layerResultFromCertification("APP-9/4", "Confidence Trend + Volatility", "APP-9/4", trend),
    layerResultFromCertification("APP-9/5", "Confidence Evidence + Reason Link", "APP-9/5", evidenceReason),
    layerResultFromCertification("APP-9/6", "Confidence Calibration + Accuracy", "APP-9/6", calibration),
    layerResultFromCertification("APP-9/7", "Confidence API + Consumer Contract", "APP-9/7", api),
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

export { REPO_ROOT as CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_REPO_ROOT };
