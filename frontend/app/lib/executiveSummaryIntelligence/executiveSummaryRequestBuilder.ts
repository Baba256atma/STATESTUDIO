/**
 * INT-3 — Executive Summary Request Builder.
 * Sole creator of immutable ExecutiveSummaryIntelligenceRequest objects.
 */

import {
  EXECUTIVE_SUMMARY_CONSUMER,
  EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  type ExecutiveSummaryIntelligenceRequest,
  type ExecutiveSummaryRequestBuildResult,
  type ExecutiveSummarySelection,
  type BuildExecutiveSummaryIntelligenceInput,
} from "./executiveSummaryIntelligenceContract.ts";
import { adaptExecutiveSummaryContext } from "./executiveSummaryContextAdapter.ts";
import { buildExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextBuilder.ts";
import { buildIntelligenceContext } from "../dashboardIntelligence/intelligenceContextBuilder.ts";

let summaryRequestSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function nextSummaryRequestId(): string {
  summaryRequestSequence += 1;
  return `exec_sum_req_${summaryRequestSequence}_${Date.now()}`;
}

function normalizeSelection(
  input: Partial<ExecutiveSummarySelection> | null | undefined
): ExecutiveSummarySelection {
  const normalize = (value: unknown): string | null => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed || null;
  };
  return Object.freeze({
    objectId: normalize(input?.objectId),
    relationshipId: normalize(input?.relationshipId),
    kpiId: normalize(input?.kpiId),
    riskId: normalize(input?.riskId),
    scenarioId: normalize(input?.scenarioId),
    dataSourceId: normalize(input?.dataSourceId),
  });
}

export function buildExecutiveSummaryIntelligenceRequest(
  input: BuildExecutiveSummaryIntelligenceInput
): ExecutiveSummaryRequestBuildResult {
  const adapted = adaptExecutiveSummaryContext(input);

  const timeBuild = buildExecutiveTimeContext(adapted.executiveTimeInput);
  if (!timeBuild.success || !timeBuild.timeContext) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "time_context_failed",
      message: timeBuild.message,
    });
  }

  const contextBuild = buildIntelligenceContext(adapted.intelligenceContextInput);
  if (!contextBuild.success || !contextBuild.context) {
    return Object.freeze({
      success: false,
      request: null,
      reason: "intelligence_context_failed",
      message: contextBuild.message,
    });
  }

  const request: ExecutiveSummaryIntelligenceRequest = Object.freeze({
    contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
    summaryRequestId: nextSummaryRequestId(),
    requestId: contextBuild.context.requestId,
    workspace: contextBuild.context.workspace,
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    panel: adapted.panel,
    dashboardMode: adapted.dashboardMode,
    selection: normalizeSelection({
      objectId: contextBuild.context.selectedObject,
      relationshipId: contextBuild.context.selectedRelationship,
      kpiId: contextBuild.context.selectedKpi,
      riskId: contextBuild.context.selectedRisk,
      scenarioId: contextBuild.context.selectedScenario,
      dataSourceId: contextBuild.context.selectedDataSource,
    }),
    executiveTime: adapted.executiveTimeInput,
    intelligenceContext: contextBuild.context,
    executiveTimeContext: timeBuild.timeContext,
    timestamp: nowIso(),
    source: EXECUTIVE_SUMMARY_INTELLIGENCE_SOURCE,
  });

  return Object.freeze({
    success: true,
    request,
    reason: "built",
    message: "Executive Summary intelligence request built.",
  });
}

export function resetExecutiveSummaryRequestBuilderForTests(): void {
  summaryRequestSequence = 0;
}

export const ExecutiveSummaryRequestBuilder = Object.freeze({
  buildExecutiveSummaryIntelligenceRequest,
});
