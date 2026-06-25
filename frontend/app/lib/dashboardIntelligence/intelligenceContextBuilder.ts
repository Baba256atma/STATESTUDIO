/**
 * INT-1.2 — Intelligence Context builder.
 * The only creator of UnifiedIntelligenceContext — collect, validate, normalize, freeze.
 */

import type { DashboardIntelligencePanelId } from "./dashboardIntelligenceContract.ts";
import { buildExecutiveTimeContext } from "./executiveTimeContextBuilder.ts";
import type { ExecutiveTimeContext } from "./executiveTimeContextContract.ts";
import {
  buildIntelligenceContextDiagnostics,
  recordIntelligenceContextDiagnostics,
  recordIntelligenceContextEvent,
} from "./intelligenceContextDiagnostics.ts";
import {
  INTELLIGENCE_CONTEXT_SOURCE,
  INTELLIGENCE_CONTEXT_VERSION,
  INTELLIGENCE_VIEW_MODES,
  type BuildIntelligenceContextInput,
  type IntelligenceContextBuildResult,
  type IntelligenceFutureExtension,
  type IntelligenceSelectionPath,
  type IntelligenceTimelinePosition,
  type IntelligenceViewMode,
  type UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";
import { registerIntelligenceContext } from "./intelligenceContextRegistry.ts";
import { createIntelligenceContextSnapshot } from "./intelligenceContextSnapshot.ts";
import {
  validateIntelligenceContextInput,
  validateUnifiedIntelligenceContext,
} from "./intelligenceContextValidator.ts";

let contextSequence = 0;
let requestSequence = 0;

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeId(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || null;
}

function nextContextId(): string {
  contextSequence += 1;
  return `intel_ctx_${contextSequence}_${Date.now()}`;
}

function nextRequestId(): string {
  requestSequence += 1;
  return `intel_req_${requestSequence}_${Date.now()}`;
}

function normalizeViewMode(value: IntelligenceViewMode | null | undefined): IntelligenceViewMode {
  if (value && INTELLIGENCE_VIEW_MODES.includes(value)) return value;
  return "overview";
}

function normalizeTimelinePosition(
  input: Partial<IntelligenceTimelinePosition> | null | undefined
): IntelligenceTimelinePosition {
  if (!input) {
    return Object.freeze({ index: null, label: null, reserved: true });
  }
  return Object.freeze({
    index: typeof input.index === "number" ? input.index : null,
    label: normalizeId(input.label),
    reserved: input.reserved ?? input.index == null,
  });
}

function normalizeSelectionPath(input: readonly string[] | null | undefined): IntelligenceSelectionPath {
  if (!input || input.length === 0) return Object.freeze([]);
  return Object.freeze(input.map((entry) => entry.trim()).filter(Boolean));
}

function normalizeFilters(
  input: Readonly<Record<string, string | null>> | null | undefined
): Readonly<Record<string, string | null>> {
  if (!input) return Object.freeze({});
  return Object.freeze(
    Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, normalizeId(value)] as const)
    )
  );
}

function normalizeFutureExtension(
  input: IntelligenceFutureExtension | null | undefined
): IntelligenceFutureExtension {
  if (!input) return Object.freeze({});
  return Object.freeze({ ...input });
}

function freezeContext(context: UnifiedIntelligenceContext): UnifiedIntelligenceContext {
  return Object.freeze({
    ...context,
    timelinePosition: Object.freeze({ ...context.timelinePosition }),
    executiveTimeContext: Object.freeze({
      ...context.executiveTimeContext,
      timelinePosition: Object.freeze({ ...context.executiveTimeContext.timelinePosition }),
      futureExtension: Object.freeze({ ...context.executiveTimeContext.futureExtension }),
    }),
    selectionPath: Object.freeze([...context.selectionPath]),
    filters: Object.freeze({ ...context.filters }),
    futureExtension: Object.freeze({ ...context.futureExtension }),
  });
}

function resolveExecutiveTimeContext(
  input: BuildIntelligenceContextInput
): { success: true; timeContext: ExecutiveTimeContext } | { success: false; message: string } {
  const build = buildExecutiveTimeContext(
    input.executiveTime ?? Object.freeze({ timeState: "now" })
  );
  if (!build.success || !build.timeContext) {
    return Object.freeze({
      success: false,
      message: build.message,
    });
  }
  return Object.freeze({ success: true, timeContext: build.timeContext });
}

function resolvePanel(input: BuildIntelligenceContextInput): DashboardIntelligencePanelId {
  return input.panel ?? input.dashboardMode ?? "executive_summary";
}

export function buildIntelligenceContext(
  input: BuildIntelligenceContextInput
): IntelligenceContextBuildResult {
  const started = performance.now();
  const timeResolution = resolveExecutiveTimeContext(input);
  if (!timeResolution.success) {
    return Object.freeze({
      success: false,
      context: null,
      validation: Object.freeze({
        valid: false,
        issues: Object.freeze([
          Object.freeze({
            code: "executive_time_context_failed",
            message: timeResolution.message,
          }),
        ]),
      }),
      reason: "time_context_failed",
      message: timeResolution.message,
    });
  }
  const executiveTimeContext = timeResolution.timeContext;
  const inputValidation = validateIntelligenceContextInput(input);

  if (!inputValidation.valid) {
    recordIntelligenceContextEvent({
      type: "ContextRejected",
      consumer: input.consumer,
      workspace: normalizeId(input.workspace),
    });
    recordIntelligenceContextDiagnostics(
      buildIntelligenceContextDiagnostics({
        context: freezeContext({
          contractVersion: INTELLIGENCE_CONTEXT_VERSION,
          contextId: nextContextId(),
          workspace: normalizeId(input.workspace),
          selectedObject: normalizeId(input.selectedObject),
          selectedRelationship: normalizeId(input.selectedRelationship),
          selectedKpi: normalizeId(input.selectedKpi),
          selectedRisk: normalizeId(input.selectedRisk),
          selectedScenario: normalizeId(input.selectedScenario),
          selectedDataSource: normalizeId(input.selectedDataSource),
          timelinePosition: normalizeTimelinePosition(input.timelinePosition),
          selectionPath: normalizeSelectionPath(input.selectionPath),
          filters: normalizeFilters(input.filters),
          viewMode: normalizeViewMode(input.viewMode),
          dashboardMode: input.dashboardMode ?? resolvePanel(input),
          panel: resolvePanel(input),
          consumer: input.consumer,
          requestId: input.requestId ?? nextRequestId(),
          timestamp: input.timestamp ?? nowIso(),
          executiveTimeContext,
          futureExtension: normalizeFutureExtension(input.futureExtension),
          source: INTELLIGENCE_CONTEXT_SOURCE,
        }),
        validation: inputValidation,
        executionTimeMs: performance.now() - started,
      })
    );
    return Object.freeze({
      success: false,
      context: null,
      validation: inputValidation,
      reason: "validation_failed",
      message: inputValidation.issues[0]?.message ?? "Intelligence context validation failed.",
    });
  }

  const context = freezeContext(
    Object.freeze({
      contractVersion: INTELLIGENCE_CONTEXT_VERSION,
      contextId: nextContextId(),
      workspace: normalizeId(input.workspace),
      selectedObject: normalizeId(input.selectedObject),
      selectedRelationship: normalizeId(input.selectedRelationship),
      selectedKpi: normalizeId(input.selectedKpi),
      selectedRisk: normalizeId(input.selectedRisk),
      selectedScenario: normalizeId(input.selectedScenario),
      selectedDataSource: normalizeId(input.selectedDataSource),
      timelinePosition: normalizeTimelinePosition(input.timelinePosition),
      selectionPath: normalizeSelectionPath(input.selectionPath),
      filters: normalizeFilters(input.filters),
      viewMode: normalizeViewMode(input.viewMode),
      dashboardMode: input.dashboardMode ?? resolvePanel(input),
      panel: resolvePanel(input),
      consumer: input.consumer,
      requestId: input.requestId ?? nextRequestId(),
      timestamp: input.timestamp ?? nowIso(),
      executiveTimeContext,
      futureExtension: normalizeFutureExtension(input.futureExtension),
      source: INTELLIGENCE_CONTEXT_SOURCE,
    })
  );

  const contextValidation = validateUnifiedIntelligenceContext(context);
  if (!contextValidation.valid) {
    recordIntelligenceContextEvent({
      type: "ContextRejected",
      contextId: context.contextId,
      consumer: context.consumer,
      workspace: context.workspace,
    });
    return Object.freeze({
      success: false,
      context: null,
      validation: contextValidation,
      reason: "validation_failed",
      message: contextValidation.issues[0]?.message ?? "Unified context validation failed.",
    });
  }

  registerIntelligenceContext(context);
  createIntelligenceContextSnapshot({ context, reason: "created" });
  recordIntelligenceContextEvent({
    type: "ContextCreated",
    contextId: context.contextId,
    consumer: context.consumer,
    workspace: context.workspace,
  });
  recordIntelligenceContextEvent({
    type: "ContextValidated",
    contextId: context.contextId,
    consumer: context.consumer,
    workspace: context.workspace,
  });
  recordIntelligenceContextDiagnostics(
    buildIntelligenceContextDiagnostics({
      context,
      validation: contextValidation,
      executionTimeMs: performance.now() - started,
    })
  );

  return Object.freeze({
    success: true,
    context,
    validation: contextValidation,
    reason: "created",
    message: "Unified intelligence context created.",
  });
}

export function updateIntelligenceContext(
  current: UnifiedIntelligenceContext,
  patch: BuildIntelligenceContextInput
): IntelligenceContextBuildResult {
  const started = performance.now();
  const mergedInput: BuildIntelligenceContextInput = Object.freeze({
    workspace: patch.workspace ?? current.workspace,
    selectedObject: patch.selectedObject ?? current.selectedObject,
    selectedRelationship: patch.selectedRelationship ?? current.selectedRelationship,
    selectedKpi: patch.selectedKpi ?? current.selectedKpi,
    selectedRisk: patch.selectedRisk ?? current.selectedRisk,
    selectedScenario: patch.selectedScenario ?? current.selectedScenario,
    selectedDataSource: patch.selectedDataSource ?? current.selectedDataSource,
    timelinePosition: patch.timelinePosition ?? current.timelinePosition,
    selectionPath: patch.selectionPath ?? current.selectionPath,
    filters: patch.filters ?? current.filters,
    viewMode: patch.viewMode ?? current.viewMode,
    dashboardMode: patch.dashboardMode ?? current.dashboardMode,
    panel: patch.panel ?? current.panel,
    consumer: patch.consumer ?? current.consumer,
    requestId: patch.requestId ?? nextRequestId(),
    timestamp: nowIso(),
    executiveTime: patch.executiveTime ?? Object.freeze({ timeState: current.executiveTimeContext.timeState }),
    futureExtension: patch.futureExtension ?? current.futureExtension,
  });

  const built = buildIntelligenceContext(mergedInput);
  if (built.success && built.context) {
    createIntelligenceContextSnapshot({ context: built.context, reason: "updated" });
    recordIntelligenceContextEvent({
      type: "ContextUpdated",
      contextId: built.context.contextId,
      consumer: built.context.consumer,
      workspace: built.context.workspace,
    });
    recordIntelligenceContextEvent({
      type: "ContextChanged",
      contextId: built.context.contextId,
      consumer: built.context.consumer,
      workspace: built.context.workspace,
    });
    recordIntelligenceContextDiagnostics(
      buildIntelligenceContextDiagnostics({
        context: built.context,
        validation: built.validation,
        executionTimeMs: performance.now() - started,
      })
    );
  }
  return built;
}

export function resetIntelligenceContextBuilderForTests(): void {
  contextSequence = 0;
  requestSequence = 0;
}
