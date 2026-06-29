/**
 * APP-8:8 — Decision Journal Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runDecisionJournalEngineCertification } from "./decisionJournalEngineRunner.ts";
import { runDecisionJournalApiCertification } from "./decisionJournalApiRunner.ts";
import { runDecisionJournalQueryCertification } from "./decisionJournalQueryRunner.ts";
import { runDecisionJournalReflectionCertification } from "./decisionJournalReflectionRunner.ts";
import { runDecisionJournalEvidenceAssumptionCertification } from "./decisionJournalEvidenceAssumptionRunner.ts";
import { runDecisionJournalRetrospectiveCertification } from "./decisionJournalRetrospectiveRunner.ts";
import { runDecisionJournalFoundation } from "./decisionJournalRunner.ts";
import { DECISION_JOURNAL_API_SELF_MANIFEST } from "./decisionJournalApiManifest.ts";
import type { DecisionJournalPlatformLayerRegressionResult } from "./decisionJournalPlatformCertificationTypes.ts";

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
): DecisionJournalPlatformLayerRegressionResult {
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
): DecisionJournalPlatformLayerRegressionResult {
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
  const libraryFiles = DECISION_JOURNAL_API_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/decision-journal/") &&
      !file.includes("decisionJournalPlatformCertification") &&
      !file.includes("app-8-8")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runDecisionJournalPlatformRegression(): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly DecisionJournalPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runDecisionJournalFoundation();
  const engine = runDecisionJournalEngineCertification();
  const query = runDecisionJournalQueryCertification();
  const reflection = runDecisionJournalReflectionCertification();
  const quality = runDecisionJournalEvidenceAssumptionCertification();
  const retrospective = runDecisionJournalRetrospectiveCertification();
  const api = runDecisionJournalApiCertification();

  const layerResults = Object.freeze([
    layerResultFromCounts(
      "APP-8/1",
      "Decision Journal Foundation",
      "APP-8/1",
      foundation.certified,
      foundation.passedCount,
      foundation.checkCount,
      `${foundation.passedCount}/${foundation.checkCount} foundation checks passed`
    ),
    layerResultFromCertification("APP-8/2", "Decision Journal Engine", "APP-8/2", engine),
    layerResultFromCertification("APP-8/3", "Decision Journal Query + Ordering", "APP-8/3", query),
    layerResultFromCertification("APP-8/4", "Decision Journal Insight + Reflection", "APP-8/4", reflection),
    layerResultFromCertification("APP-8/5", "Decision Journal Evidence + Assumption", "APP-8/5", quality),
    layerResultFromCertification("APP-8/6", "Decision Journal Outcome + Retrospective", "APP-8/6", retrospective),
    layerResultFromCertification("APP-8/7", "Decision Journal API + Consumer Contract", "APP-8/7", api),
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

export { REPO_ROOT as DECISION_JOURNAL_PLATFORM_CERTIFICATION_REPO_ROOT };
