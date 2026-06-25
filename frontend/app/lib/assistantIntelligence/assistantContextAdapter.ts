/**
 * INT-2 — Assistant Context Adapter.
 * Reads platform context from registries — no local intelligence copies.
 */

import type { BuildAssistantIntelligenceInput } from "./assistantIntelligenceContract.ts";
import {
  ASSISTANT_INTELLIGENCE_CONSUMER,
  ASSISTANT_REQUEST_PANEL_MAP,
} from "./assistantIntelligenceContract.ts";
import type { BuildExecutiveTimeContextInput } from "../dashboardIntelligence/executiveTimeContextContract.ts";
import type { BuildIntelligenceContextInput } from "../dashboardIntelligence/intelligenceContextContract.ts";
import {
  resolveConsumerPanel,
  resolveExecutiveTimeTimelinePosition,
} from "../dashboardIntelligence/consumerContextResolution.ts";
import { getCurrentExecutiveTimeContext } from "../dashboardIntelligence/executiveTimeContextRegistry.ts";
import { getCurrentIntelligenceContext } from "../dashboardIntelligence/intelligenceContextRegistry.ts";
import type { DashboardIntelligencePanelId } from "../dashboardIntelligence/dashboardIntelligenceContract.ts";

export type AssistantAdaptedContextInput = Readonly<{
  intelligenceContextInput: BuildIntelligenceContextInput;
  executiveTimeInput: BuildExecutiveTimeContextInput;
  panel: DashboardIntelligencePanelId;
}>;

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

export function adaptAssistantContext(
  input: BuildAssistantIntelligenceInput
): AssistantAdaptedContextInput {
  const platformContext = input.useCurrentContext !== false ? getCurrentIntelligenceContext() : null;
  const platformTimeContext = input.useCurrentContext !== false ? getCurrentExecutiveTimeContext() : null;

  const panel =
    input.panel ??
    (input.requestType ? ASSISTANT_REQUEST_PANEL_MAP[input.requestType] : null) ??
    resolveConsumerPanel({
      consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
      platformContext,
      defaultPanel: "executive_summary",
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
      normalizeId(input.managerPhrase) ??
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
    consumer: ASSISTANT_INTELLIGENCE_CONSUMER,
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
    dashboardMode: panel,
    panel,
    executiveTime: executiveTimeInput,
    futureExtension: platformContext?.futureExtension ?? Object.freeze({}),
  });

  return Object.freeze({
    intelligenceContextInput,
    executiveTimeInput,
    panel,
  });
}

export const AssistantContextAdapter = Object.freeze({
  adaptAssistantContext,
});
