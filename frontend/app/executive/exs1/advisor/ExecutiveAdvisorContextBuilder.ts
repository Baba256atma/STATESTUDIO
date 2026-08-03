/**
 * Sprint 5 / Phase A — Builds immutable Executive Advisor Context from Runtime.
 * Metadata resolves business-friendly names without changing Runtime IDs.
 */

import { EXS1_OBJECTS, EXS1_PACKS } from "../mock/exs1Mock";
import type { ExecutiveMetadataCatalog } from "../metadata/ExecutiveMetadataRegistry";
import {
  resolveFieldDisplayName,
  resolveObjectDisplayName,
} from "../metadata/ExecutiveMetadataRegistry";
import type { ExecutiveRuntimeState } from "../runtime/ExecutiveRuntimeStore";
import type { Exs1ObjectId } from "../exs1Types";
import type { ExecutiveAdvisorContext } from "./ExecutiveAdvisorTypes";

export function buildExecutiveAdvisorContext(
  state: ExecutiveRuntimeState,
  catalog?: ExecutiveMetadataCatalog | null,
): ExecutiveAdvisorContext {
  const packId = state.pack.selectedPackId;
  const packTitle =
    EXS1_PACKS.find((p) => p.id === packId)?.title ??
    state.decision.decisionPacks.find((p) => p.id === packId)?.title ??
    state.execution.executionPacks.find((p) => p.id === packId)?.title ??
    state.monitoring.monitoringPacks.find((p) => p.id === packId)?.title ??
    state.data.dataPacks.find((p) => p.id === packId)?.title ??
    "Production Delay";

  const selectedObjectId = state.selection.selectedObjectId;
  const fallbackLabel =
    EXS1_OBJECTS.find((o) => o.id === selectedObjectId)?.label ?? null;
  const selectedObjectLabel = selectedObjectId
    ? catalog
      ? resolveObjectDisplayName(catalog, selectedObjectId, fallbackLabel ?? undefined)
      : fallbackLabel
    : null;

  const scenario =
    state.scenario.scenarios.find(
      (s) => s.id === state.scenario.currentScenarioId,
    ) ?? null;
  const decision =
    state.decision.decisions.find(
      (d) => d.id === state.decision.currentDecisionId,
    ) ?? null;

  const tasks = state.execution.plan.tasks;
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length,
        );
  const blockedTaskNames = tasks
    .filter((t) => t.status === "Blocked")
    .map((t) => t.name);

  const dataSource =
    state.data.sources.find((s) => s.id === state.data.selectedSourceId) ??
    null;

  const selectedObjectIds: Exs1ObjectId[] = selectedObjectId
    ? [selectedObjectId]
    : state.scenario.compareIds.length >= 2
      ? Array.from(
          new Set(
            state.scenario.compareIds.flatMap((id) => {
              const item = state.scenario.scenarios.find((s) => s.id === id);
              return item?.objectIds ?? [];
            }),
          ),
        )
      : [...(scenario?.objectIds ?? [])];

  const selectedObjectLabels = selectedObjectIds.map((id) =>
    catalog
      ? resolveObjectDisplayName(
          catalog,
          id,
          EXS1_OBJECTS.find((o) => o.id === id)?.label,
        )
      : (EXS1_OBJECTS.find((o) => o.id === id)?.label ?? id),
  );

  const highlightedField =
    state.data.mappings.find((m) =>
      state.data.selectedSourceId
        ? m.sourceId === state.data.selectedSourceId
        : true,
    )?.sourceColumn ?? "MAT_QTY";
  const fieldDisplayName = catalog
    ? resolveFieldDisplayName(catalog, highlightedField)
    : highlightedField;

  return Object.freeze({
    mode: state.mode.activeMode,
    packId,
    packTitle,
    timelineLens: state.timeline.lens,
    timelinePosition: state.timeline.position,
    selectedObjectId,
    selectedObjectLabel,
    selectedObjectIds,
    selectedObjectLabels,
    highlightedFieldTechnical: highlightedField,
    highlightedFieldDisplayName: fieldDisplayName,
    scenarioId: scenario?.id ?? null,
    scenarioName: scenario?.name ?? null,
    decisionId: decision?.id ?? null,
    decisionName: decision?.name ?? null,
    decisionStatus: decision?.status ?? null,
    executionStatus: state.execution.plan.status,
    executionProgress: progress,
    blockedTaskNames,
    monitoringHealth: state.monitoring.executiveHealth,
    monitoringSummary: state.monitoring.summary,
    alertTitles: state.monitoring.alerts.map((a) => a.title),
    dataSourceId: dataSource?.id ?? null,
    dataSourceName: dataSource?.name ?? null,
    dataActive: state.data.experienceActive,
    explorerNav: state.explorer.nav,
    explorerVisible: state.explorer.visible,
    goal: "Resolve Production Delay with executive control retained.",
  });
}

export function formatAdvisorContextBrief(
  context: ExecutiveAdvisorContext,
): string {
  const objectLine =
    context.selectedObjectLabels?.length
      ? context.selectedObjectLabels.join(", ")
      : context.selectedObjectIds.length
        ? context.selectedObjectIds.join(", ")
        : "None";

  return [
    `Current Mode: ${context.mode}`,
    `Current Pack: ${context.packTitle}`,
    `Timeline: ${context.timelineLens} @ ${context.timelinePosition}`,
    `Selected Objects: ${objectLine}`,
    context.highlightedFieldDisplayName
      ? `Field Focus: ${context.highlightedFieldDisplayName}${
          context.highlightedFieldTechnical &&
          context.highlightedFieldTechnical !==
            context.highlightedFieldDisplayName
            ? ` (${context.highlightedFieldTechnical})`
            : ""
        }`
      : null,
    `Current Scenario: ${context.scenarioName ?? "None"}`,
    `Decision: ${context.decisionName ?? "None"} (${context.decisionStatus ?? "n/a"})`,
    `Execution: ${context.executionStatus}`,
    `Monitoring: ${context.monitoringHealth}`,
    `Data Source: ${context.dataSourceName ?? "None"}`,
    `Explorer: ${context.explorerNav}${context.explorerVisible ? " · open" : ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}
