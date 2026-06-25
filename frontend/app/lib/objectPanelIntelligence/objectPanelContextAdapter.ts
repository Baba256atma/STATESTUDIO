/**
 * INT-4 — Object Panel Context Adapter.
 * Reads platform context from registries — no local object cache or duplicated state.
 */

import type { BuildObjectPanelIntelligenceInput } from "./objectPanelIntelligenceContract.ts";
import {
  OBJECT_PANEL_CONSUMER,
  OBJECT_PANEL_DEFAULT_MODE,
  OBJECT_PANEL_DEFAULT_PANEL,
} from "./objectPanelIntelligenceContract.ts";
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

export type ObjectPanelAdaptedContextInput = Readonly<{
  intelligenceContextInput: BuildIntelligenceContextInput;
  executiveTimeInput: BuildExecutiveTimeContextInput;
  panel: DashboardIntelligencePanelId;
  dashboardMode: DashboardIntelligenceMode;
  selectedObjectId: string | null;
}>;

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

export function adaptObjectPanelContext(
  input: BuildObjectPanelIntelligenceInput
): ObjectPanelAdaptedContextInput {
  const platformContext = input.useCurrentContext !== false ? getCurrentIntelligenceContext() : null;
  const platformTimeContext = input.useCurrentContext !== false ? getCurrentExecutiveTimeContext() : null;

  const selectedObjectId =
    normalizeId(input.selectedObjectId) ??
    normalizeId(input.selection?.objectId) ??
    platformContext?.selectedObject ??
    null;

  const panel = resolveConsumerPanel({
    consumer: OBJECT_PANEL_CONSUMER,
    panel: input.panel,
    platformContext,
    defaultPanel: OBJECT_PANEL_DEFAULT_PANEL,
  });
  const dashboardMode = resolveConsumerDashboardMode({
    consumer: OBJECT_PANEL_CONSUMER,
    dashboardMode: input.dashboardMode,
    platformContext,
    defaultMode: OBJECT_PANEL_DEFAULT_MODE,
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
    consumer: OBJECT_PANEL_CONSUMER,
    workspace: normalizeId(input.workspace) ?? platformContext?.workspace ?? null,
    selectedObject: selectedObjectId,
    selectedRelationship:
      normalizeId(input.selection?.relationshipId) ?? platformContext?.selectedRelationship ?? null,
    selectedKpi: normalizeId(input.selection?.kpiId) ?? platformContext?.selectedKpi ?? null,
    selectedRisk: normalizeId(input.selection?.riskId) ?? platformContext?.selectedRisk ?? null,
    selectedScenario:
      normalizeId(input.selection?.scenarioId) ?? platformContext?.selectedScenario ?? null,
    selectedDataSource:
      normalizeId(input.selection?.dataSourceId) ?? platformContext?.selectedDataSource ?? null,
    timelinePosition: executiveTimeInput.timelinePosition ?? platformContext?.timelinePosition ?? null,
    selectionPath: selectedObjectId
      ? Object.freeze([...(platformContext?.selectionPath ?? []), selectedObjectId].filter(Boolean))
      : platformContext?.selectionPath ?? Object.freeze([]),
    filters: input.filters ?? platformContext?.filters ?? Object.freeze({}),
    viewMode: platformContext?.viewMode ?? "focus",
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
    selectedObjectId,
  });
}

export const ObjectPanelContextAdapter = Object.freeze({
  adaptObjectPanelContext,
});
