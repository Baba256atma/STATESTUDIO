/**
 * APP-11:7 — Executive Inbox Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { runExecutiveInboxFoundation } from "./executiveInboxRunner.ts";
import { runExecutiveInboxAggregationCertification } from "./executiveInboxAggregationEngineRunner.ts";
import { runExecutiveInboxPrioritizationCertification } from "./executiveInboxPrioritizationEngineRunner.ts";
import { runExecutiveInboxNotificationCertification } from "./executiveInboxNotificationEngineRunner.ts";
import { runExecutiveInboxReminderCertification } from "./executiveInboxReminderEngineRunner.ts";
import { runExecutiveInboxSchedulingCertification } from "./executiveInboxSchedulingEngineRunner.ts";
import { EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST } from "./executiveInboxSchedulingEngine.ts";
import type { ExecutiveInboxPlatformLayerRegressionResult } from "./executiveInboxPlatformCertificationTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function layerResult(
  layerId: string,
  title: string,
  contractVersion: string,
  certified: boolean,
  passedCount: number,
  checkCount: number
): ExecutiveInboxPlatformLayerRegressionResult {
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
  const libraryFiles = EXECUTIVE_INBOX_SCHEDULING_ENGINE_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/executive-inbox/") &&
      !file.includes("executiveInboxPlatformCertification") &&
      !file.includes("app-11-7")
  );
  return libraryFiles.every((file) => {
    const relative = file.replace(/^frontend\//, "");
    return existsSync(join(process.cwd(), relative));
  });
}

export function runExecutiveInboxPlatformRegression(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): Readonly<{
  success: boolean;
  layersPassed: number;
  layersTotal: number;
  summary: string;
  layerResults: readonly ExecutiveInboxPlatformLayerRegressionResult[];
  priorPhasesPreserved: boolean;
  readOnly: true;
}> {
  const foundation = runExecutiveInboxFoundation(timestamp);
  const aggregation = runExecutiveInboxAggregationCertification(timestamp);
  const prioritization = runExecutiveInboxPrioritizationCertification(timestamp);
  const notification = runExecutiveInboxNotificationCertification(timestamp);
  const reminder = runExecutiveInboxReminderCertification(timestamp);
  const scheduling = runExecutiveInboxSchedulingCertification(timestamp);

  const layerResults = Object.freeze([
    layerResult("APP-11/1", "Foundation", "APP-11/1", foundation.certified, foundation.passedCount, foundation.checkCount),
    layerResult(
      "APP-11/2",
      "Aggregation Engine",
      "APP-11/2",
      aggregation.certified,
      aggregation.passedCount,
      aggregation.checkCount
    ),
    layerResult(
      "APP-11/3",
      "Prioritization Engine",
      "APP-11/3",
      prioritization.certified,
      prioritization.passedCount,
      prioritization.checkCount
    ),
    layerResult(
      "APP-11/4",
      "Notification Engine",
      "APP-11/4",
      notification.certified,
      notification.passedCount,
      notification.checkCount
    ),
    layerResult(
      "APP-11/5",
      "Reminder Engine",
      "APP-11/5",
      reminder.certified,
      reminder.passedCount,
      reminder.checkCount
    ),
    layerResult(
      "APP-11/6",
      "Scheduling Engine",
      "APP-11/6",
      scheduling.certified,
      scheduling.passedCount,
      scheduling.checkCount
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
      ? `All ${layersTotal} APP-11 layers certified; prior phase files preserved.`
      : `Regression incomplete: ${layersPassed}/${layersTotal} layers certified.`,
    layerResults,
    priorPhasesPreserved,
    readOnly: true as const,
  });
}
