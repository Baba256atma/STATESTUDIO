/**
 * Canonical Dashboard Context Router — single entry point for all dashboard context flow.
 * Source → Router → Normalization → Surface Resolution → Workspace Commit → Container
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { NexoraRouteResolution, RouteRequestSource } from "../routing/nexoraRoutingContract.ts";
import type {
  NexoraWorkspaceAction,
  NexoraWorkspaceState,
} from "../workspace/nexoraWorkspaceStateContract.ts";
import {
  evaluateMrpWorkspaceCommit,
  logMrpWriteSkipped,
} from "../runtime/mrpWriteDedupRuntime.ts";
import { traceNexoraLoopGuard } from "../runtime/nexoraLoopGuardDiagnostics.ts";
import {
  CANONICAL_DASHBOARD_CONTEXT_ROUTER,
  DASHBOARD_CONTEXT_ROUTER_VERSION,
  type DashboardContextCommitSource,
  type DashboardContextSource,
  type DashboardRouteIntent,
  type NormalizedDashboardContext,
} from "./dashboardContextTypes.ts";
import {
  normalizeDashboardContextInput,
  type RawDashboardContextInput,
} from "./dashboardContextNormalization.ts";
import {
  advanceDashboardContextLifecycle,
  getActiveDashboardContext,
  registerDashboardContextCreated,
} from "./dashboardContextLifecycle.ts";
import { CANONICAL_DASHBOARD_RUNTIME_OWNER } from "./dashboardRuntimeContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";
import {
  reportDashboardContext,
  reportDashboardContextNormalized,
  reportDashboardRoute,
  reportDashboardSurfaceResolved,
  reportDuplicateDashboardOwner,
} from "./dashboardRuntimeLogging.ts";
import { measureDashboardOperation, reportDashboardContextCost } from "./dashboardPerformanceMetrics.ts";
import { recordDashboardRoutingFrequency } from "./dashboardPerformanceRegression.ts";
import {
  evaluateObjectClickDashboardCommitGuard,
  traceObjectClickDashboardCommitBlocked,
} from "../selection/objectClickDashboardCommitGuard.ts";

export type DashboardContextRouteInput = Readonly<{
  source: DashboardContextSource | RouteRequestSource | DashboardContextCommitSource;
  raw: RawDashboardContextInput;
  intent?: DashboardRouteIntent;
  priorContext?: DashboardContext | null;
  contextId?: string;
  currentWorkspaceState?: NexoraWorkspaceState;
  workspaceId?: string | null;
}>;

export type DashboardContextRouteResult = Readonly<{
  normalized: NormalizedDashboardContext;
  surfaceId: DashboardSurfaceId;
  workspaceActions: readonly NexoraWorkspaceAction[];
  assistantIsolated: boolean;
  sceneTimelineActive: boolean;
}>;

const bypassWarnings = new Set<string>();
let lastCommittedRouteKey: string | null = null;
let lastCommittedRouteResult: DashboardContextRouteResult | null = null;

function buildRouteDedupeKey(input: DashboardContextRouteInput): string {
  return JSON.stringify({
    source: input.source,
    intent: input.intent ?? "default",
    priorContext: input.priorContext ?? null,
    dashboardContext: input.raw.dashboardContext ?? null,
    legacyRoute: input.raw.legacyRoute ?? null,
    objectId: input.raw.objectId ?? null,
    scenarioId: input.raw.scenarioId ?? null,
    reason: input.raw.reason ?? null,
    routeResolution: input.raw.routeResolution
      ? {
          dashboardContext: input.raw.routeResolution.dashboardContext,
          mrpTab: input.raw.routeResolution.mrpTab,
          selectedObjectId: input.raw.routeResolution.selectedObjectId,
          sceneTimelineActive: input.raw.routeResolution.sceneTimelineActive,
          assistantIsolated: input.raw.routeResolution.assistantIsolated,
          reason: input.raw.routeResolution.reason,
        }
      : null,
  });
}

export function buildWorkspaceActionsFromRoute(
  normalized: NormalizedDashboardContext,
  options?: { assistantIsolated?: boolean; sceneTimelineActive?: boolean }
): NexoraWorkspaceAction[] {
  if (options?.assistantIsolated) {
    return [{ type: "setMRPTab", tab: "assistant" }];
  }

  const actions: NexoraWorkspaceAction[] = [
    { type: "setMRPTab", tab: "dashboard" },
    { type: "setDashboardContext", context: normalized.dashboardContext },
  ];

  if (options?.sceneTimelineActive || normalized.intent === "timeline_activation") {
    actions.push({ type: "setTimelineState", state: "expanded", activateContext: true });
  }

  if (normalized.objectId) {
    actions.push({
      type: "selectObject",
      objectId: normalized.objectId,
      dashboardContext: normalized.dashboardContext,
    });
  }

  return actions;
}

export function routeDashboardContext(input: DashboardContextRouteInput): DashboardContextRouteResult {
  return measureDashboardOperation(
    "contextRouting",
    () => {
      const normalized = normalizeDashboardContextInput({
        source: input.source,
        raw: input.raw,
        intent: input.intent,
        contextId: input.contextId,
      });

      const routeResolution = input.raw.routeResolution;
      const assistantIsolated = routeResolution?.assistantIsolated === true;
      const sceneTimelineActive =
        routeResolution?.sceneTimelineActive === true || normalized.intent === "timeline_activation";

      const workspaceActions = buildWorkspaceActionsFromRoute(normalized, {
        assistantIsolated,
        sceneTimelineActive,
      });

      measureDashboardOperation(
        "surfaceResolution",
        () => normalized.surfaceId,
        {
          phase: "surface_resolve",
          contextId: normalized.id,
          surfaceId: normalized.surfaceId,
          category: normalized.category,
        }
      );

      reportDashboardContextNormalized({
        contextId: normalized.id,
        category: normalized.category,
        source: normalized.source,
        intent: normalized.intent,
        objectId: normalized.objectId,
        scenarioId: normalized.scenarioId,
        dashboardContext: normalized.dashboardContext,
      });

      reportDashboardRoute({
        contextId: normalized.id,
        source: normalized.source,
        intent: normalized.intent,
        dashboardContext: normalized.dashboardContext,
        reason: normalized.reason,
        priorContext: input.priorContext ?? null,
        router: CANONICAL_DASHBOARD_CONTEXT_ROUTER,
        version: DASHBOARD_CONTEXT_ROUTER_VERSION,
      });

      reportDashboardSurfaceResolved({
        contextId: normalized.id,
        surfaceId: normalized.surfaceId,
        category: normalized.category,
        dashboardContext: normalized.dashboardContext,
        intent: normalized.intent,
        source: normalized.source,
      });

      recordDashboardRoutingFrequency({
        contextId: normalized.id,
        dashboardContext: normalized.dashboardContext,
        source: normalized.source,
      });

      return Object.freeze({
        normalized,
        surfaceId: normalized.surfaceId,
        workspaceActions,
        assistantIsolated,
        sceneTimelineActive,
      });
    },
    { phase: "route_dashboard_context", source: input.source }
  );
}

export function commitDashboardContextRoute(
  dispatch: (action: NexoraWorkspaceAction) => void,
  routeResult: DashboardContextRouteResult,
  options?: { priorContext?: DashboardContext | null }
): NormalizedDashboardContext {
  const now = new Date().toISOString();
  let context = registerDashboardContextCreated(routeResult.normalized);
  context = advanceDashboardContextLifecycle(context.id, "routed", now) ?? context;

  for (const action of routeResult.workspaceActions) {
    dispatch(action);
  }

  context = advanceDashboardContextLifecycle(context.id, "dashboard_updated", now) ?? context;

  reportDashboardContext({
    dashboardContext: context.dashboardContext,
    surfaceId: context.surfaceId,
    source: context.source,
    reason: context.reason,
    priorContext: options?.priorContext ?? null,
    contextId: context.id,
    lifecyclePhase: context.lifecyclePhase,
  });

  return context;
}

export function routeAndCommitDashboardContext(
  dispatch: (action: NexoraWorkspaceAction) => void,
  input: DashboardContextRouteInput
): DashboardContextRouteResult {
  const commitGuard = evaluateObjectClickDashboardCommitGuard({
    source: String(input.source ?? ""),
    intent: input.intent ?? null,
    reason: input.raw.reason ?? null,
  });
  if (!commitGuard.allowed) {
    traceObjectClickDashboardCommitBlocked({
      source: input.source,
      intent: input.intent ?? null,
      reason: input.raw.reason ?? null,
      selectedObjectId:
        typeof input.raw.objectId === "string"
          ? input.raw.objectId
          : typeof input.raw.routeResolution?.selectedObjectId === "string"
            ? input.raw.routeResolution.selectedObjectId
            : null,
    });
    return routeDashboardContext(input);
  }

  const dedupeKey = buildRouteDedupeKey(input);
  if (dedupeKey === lastCommittedRouteKey && lastCommittedRouteResult) {
    logMrpWriteSkipped("same_state", dedupeKey, {
      phase: "route_deduped_skip",
      source: input.source,
    });
    traceNexoraLoopGuard({
      source: String(input.source ?? "unknown"),
      action: "write_skipped",
      reason: "same_state",
      stateSignature: dedupeKey,
      surfaceId: lastCommittedRouteResult.surfaceId,
      workspaceId: input.workspaceId ?? null,
      dashboardContext: lastCommittedRouteResult.normalized.dashboardContext,
    });
    reportDashboardContextCost({
      phase: "route_deduped_skip",
      contextId: lastCommittedRouteResult.normalized.id,
      dashboardContext: lastCommittedRouteResult.normalized.dashboardContext,
      durationMs: 0,
      withinBudget: true,
      source: input.source,
    });
    return lastCommittedRouteResult;
  }

  const routeResult = routeDashboardContext(input);
  if (input.currentWorkspaceState) {
    const evaluation = evaluateMrpWorkspaceCommit({
      currentWorkspace: input.currentWorkspaceState,
      routeResult,
      workspaceId: input.workspaceId ?? null,
    });
    if (!evaluation.shouldCommit) {
      logMrpWriteSkipped("same_state", evaluation.nextSignature, {
        previousSignature: evaluation.previousSignature,
        surfaceId: routeResult.surfaceId,
        source: input.source,
      });
      traceNexoraLoopGuard({
        source: String(input.source ?? "unknown"),
        action: "write_skipped",
        reason: "same_state",
        stateSignature: evaluation.nextSignature,
        objectId: routeResult.normalized.objectId,
        surfaceId: routeResult.surfaceId,
        workspaceId: input.workspaceId ?? null,
        dashboardContext: routeResult.normalized.dashboardContext,
      });
      return routeResult;
    }
  }
  commitDashboardContextRoute(dispatch, routeResult, { priorContext: input.priorContext ?? null });
  lastCommittedRouteKey = dedupeKey;
  lastCommittedRouteResult = routeResult;
  return routeResult;
}

export function routeAndCommitDashboardRouteResolution(
  dispatch: (action: NexoraWorkspaceAction) => void,
  resolution: NexoraRouteResolution,
  options: {
    source: DashboardContextSource | RouteRequestSource | DashboardContextCommitSource;
    priorContext?: DashboardContext | null;
    currentWorkspaceState?: NexoraWorkspaceState;
    workspaceId?: string | null;
  }
): DashboardContextRouteResult {
  return routeAndCommitDashboardContext(dispatch, {
    source: options.source,
    priorContext: options.priorContext ?? null,
    currentWorkspaceState: options.currentWorkspaceState,
    workspaceId: options.workspaceId ?? null,
    raw: {
      routeResolution: resolution,
      reason: resolution.reason,
      objectId: resolution.selectedObjectId,
    },
  });
}

export function warnDashboardContextBypassAttempt(owner: string, source: string): void {
  const key = `${owner}:${source}`;
  if (bypassWarnings.has(key)) return;
  bypassWarnings.add(key);
  reportDuplicateDashboardOwner({
    competingOwner: owner,
    source,
    canonicalOwner: `${CANONICAL_DASHBOARD_RUNTIME_OWNER} via ${CANONICAL_DASHBOARD_CONTEXT_ROUTER}`,
  });
}

export function getCanonicalDashboardContext(): NormalizedDashboardContext | null {
  return getActiveDashboardContext();
}

export function resetDashboardContextRouterForTests(): void {
  bypassWarnings.clear();
  lastCommittedRouteKey = null;
  lastCommittedRouteResult = null;
}
