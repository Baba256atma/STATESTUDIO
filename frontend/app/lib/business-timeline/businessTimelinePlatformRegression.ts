/**
 * APP-7:7 — Business Timeline Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runBusinessEventEngineCertification } from "./businessEventEngineRunner.ts";
import { runBusinessTimelineApiCertification } from "./businessTimelineApiRunner.ts";
import { runBusinessTimelineContextCertification } from "./businessTimelineContextRunner.ts";
import { runBusinessTimelineLifecycleCertification } from "./businessTimelineLifecycleRunner.ts";
import { runBusinessTimelineQueryCertification } from "./businessTimelineQueryRunner.ts";
import { runBusinessTimelineFoundation } from "./businessTimelineRunner.ts";
import { BUSINESS_TIMELINE_API_SELF_MANIFEST } from "./businessTimelineApiManifest.ts";
import type { BusinessTimelinePlatformLayerRegressionResult } from "./businessTimelinePlatformCertificationTypes.ts";

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
): BusinessTimelinePlatformLayerRegressionResult {
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
): BusinessTimelinePlatformLayerRegressionResult {
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
  const libraryFiles = BUSINESS_TIMELINE_API_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/business-timeline/") &&
      !file.includes("businessTimelinePlatformCertification") &&
      !file.includes("app-7-7")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runBusinessTimelinePlatformRegression(): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly BusinessTimelinePlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runBusinessTimelineFoundation();
  const event = runBusinessEventEngineCertification();
  const query = runBusinessTimelineQueryCertification();
  const lifecycle = runBusinessTimelineLifecycleCertification();
  const context = runBusinessTimelineContextCertification();
  const api = runBusinessTimelineApiCertification();

  const layerResults = Object.freeze([
    layerResultFromCounts(
      "APP-7/1",
      "Business Timeline Foundation",
      "APP-7/1",
      foundation.certified,
      foundation.passedCount,
      foundation.checkCount,
      `${foundation.passedCount}/${foundation.checkCount} foundation checks passed`
    ),
    layerResultFromCertification("APP-7/2", "Business Event Engine", "APP-7/2", event),
    layerResultFromCertification("APP-7/3", "Business Timeline Query + Ordering", "APP-7/3", query),
    layerResultFromCertification("APP-7/4", "Business Timeline Lifecycle + Milestones", "APP-7/4", lifecycle),
    layerResultFromCertification("APP-7/5", "Business Timeline Context + Relationships", "APP-7/5", context),
    layerResultFromCertification("APP-7/6", "Business Timeline API + Consumer Contract", "APP-7/6", api),
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

export { REPO_ROOT as BUSINESS_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT };
