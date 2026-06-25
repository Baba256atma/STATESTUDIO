/**
 * INT-3 — Executive Summary Context Adapter.
 * Reads platform context from registries — no local intelligence copies.
 */

import type { BuildExecutiveSummaryIntelligenceInput } from "./executiveSummaryIntelligenceContract.ts";
import {
  EXECUTIVE_SUMMARY_CONSUMER,
  EXECUTIVE_SUMMARY_DEFAULT_MODE,
  EXECUTIVE_SUMMARY_DEFAULT_PANEL,
} from "./executiveSummaryIntelligenceContract.ts";
import type { BuildExecutiveTimeContextInput } from "../dashboardIntelligence/executiveTimeContextContract.ts";
import type { BuildIntelligenceContextInput } from "../dashboardIntelligence/intelligenceContextContract.ts";
import type {
  DashboardIntelligenceMode,
  DashboardIntelligencePanelId,
} from "../dashboardIntelligence/dashboardIntelligenceContract.ts";
import {
  resolveConsumerDashboardMode,
  resolveConsumerPanel,
  resolveExecutiveTimeTimelinePosition,
} from "../dashboardIntelligence/consumerContextResolution.ts";
import { getCurrentExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextRegistry.ts";
import { getCurrentIntelligenceContext } from "../dashboardIntelligence/intelligenceContextRegistry.ts";

export type ExecutiveSummaryAdaptedContextInput = Readonly<{
  intelligenceContextInput: BuildIntelligenceContextInput;
  executiveTimeInput: BuildExecutiveTimeContextInput;
  panel: DashboardIntelligencePanelId;
  dashboardMode: DashboardIntelligenceMode;
}>;

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

export function adaptExecutiveSummaryContext(
  input: BuildExecutiveSummaryIntelligenceInput
): ExecutiveSummaryAdaptedContextInput {
  const platformContext = input.useCurrentContext !== false ? getCurrentIntelligenceContext() : null;
  const platformTimeContext = input.useCurrentContext !== false ? getCurrentExecutiveTimeContext() : null;

  const panel = resolveConsumerPanel({
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    panel: input.panel,
    platformContext,
    defaultPanel: EXECUTIVE_SUMMARY_DEFAULT_PANEL,
  });
  const dashboardMode = resolveConsumerDashboardMode({
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    dashboardMode: input.dashboardMode,
    platformContext,
    defaultMode: EXECUTIVE_SUMMARY_DEFAULT_MODE,
    panel,
  });

  const timeState =
    input.executiveTime?.timeState ??
    platformTimeContext?.timeState ??
    platformContext?.executiveTimeContext.timeState ??
    "now";

  const executiveTimeInput: BuildExecutiveTimeContextInput = Object.freeze({
    timeState,
    referenceTimestamp:
      input.executiveTime?.referenceTimestamp ??
      platformTimeContext?.referenceTimestamp ??
      platformContext?.executiveTimeContext.referenceTimestamp ??
      null,
    requestedTime:
      input.executiveTime?.requestedTime ??
      platformTimeContext?.requestedTime ??
      null,
    timelinePosition: resolveExecutiveTimeTimelinePosition({
      executiveTime: input.executiveTime,
      timeState,
      platformTimelinePosition:
        platformTimeContext?.timelinePosition ?? platformContext?.timelinePosition ?? null,
    }),
    futureExtension:
      input.executiveTime?.futureExtension ??
      platformTimeContext?.futureExtension ??
      platformContext?.executiveTimeContext.futureExtension ??
      null,
  });

  const intelligenceContextInput: BuildIntelligenceContextInput = Object.freeze({
    consumer: EXECUTIVE_SUMMARY_CONSUMER,
    workspace: normalizeId(input.workspace) ?? platformContext?.workspace ?? null,
    selectedObject:
      normalizeId(input.selection?.objectId) ?? platformContext?.selectedObject ?? null,
    selectedRelationship:
      normalizeId(input.selection?.relationshipId) ?? platformContext?.selectedRelationship ?? null,
    selectedKpi: normalizeId(input.selection?.kpiId) ?? platformContext?.selectedKpi ?? null,
    selectedRisk: normalizeId(input.selection?.riskId) ?? platformContext?.selectedRisk ?? null,
    selectedScenario:
      normalizeId(input.selection?.scenarioId) ?? platformContext?.selectedScenario ?? null,
    selectedDataSource:
      normalizeId(input.selection?.dataSourceId) ?? platformContext?.selectedDataSource ?? null,
    timelinePosition: executiveTimeInput.timelinePosition ?? platformContext?.timelinePosition ?? null,
    selectionPath: platformContext?.selectionPath ?? Object.freeze([]),
    filters: input.filters ?? platformContext?.filters ?? Object.freeze({}),
    viewMode: platformContext?.viewMode ?? "overview",
    dashboardMode,
    panel,
    executiveTime: executiveTimeInput,
    futureExtension: platformContext?.futureExtension ?? Object.freeze({}),
  });

  return Object.freeze({
    intelligenceContextInput,
    executiveTimeInput,
    panel,
    dashboardMode,
  });
}

export const ExecutiveSummaryContextAdapter = Object.freeze({
  adaptExecutiveSummaryContext,
});
