/**
 * Dashboard context lifecycle ownership: Created → Routed → Dashboard Updated → Archived.
 */

import type {
  DashboardContextLifecyclePhase,
  NormalizedDashboardContext,
} from "./dashboardContextTypes.ts";

const MAX_ARCHIVED_CONTEXTS = 32;

let activeContextId: string | null = null;
let activeContext: NormalizedDashboardContext | null = null;
const archivedContexts: NormalizedDashboardContext[] = [];

export function getActiveDashboardContext(): NormalizedDashboardContext | null {
  return activeContext;
}

export function getActiveDashboardContextId(): string | null {
  return activeContextId;
}

export function listArchivedDashboardContexts(): readonly NormalizedDashboardContext[] {
  return Object.freeze([...archivedContexts]);
}

export function registerDashboardContextCreated(context: NormalizedDashboardContext): NormalizedDashboardContext {
  if (activeContext && activeContext.id !== context.id) {
    archiveDashboardContext(activeContext);
  }
  activeContextId = context.id;
  activeContext = context;
  return context;
}

export function advanceDashboardContextLifecycle(
  contextId: string,
  phase: DashboardContextLifecyclePhase,
  timestamp: string
): NormalizedDashboardContext | null {
  if (!activeContext || activeContext.id !== contextId) return null;
  const next: NormalizedDashboardContext = Object.freeze({
    ...activeContext,
    lifecyclePhase: phase,
    routedAt: phase === "routed" || activeContext.routedAt ? timestamp : activeContext.routedAt,
    dashboardUpdatedAt:
      phase === "dashboard_updated" || activeContext.dashboardUpdatedAt
        ? timestamp
        : activeContext.dashboardUpdatedAt,
    archivedAt: phase === "archived" ? timestamp : activeContext.archivedAt,
  });
  activeContext = next;
  return next;
}

export function archiveDashboardContext(context: NormalizedDashboardContext): void {
  const archived = Object.freeze({
    ...context,
    lifecyclePhase: "archived" as const,
    archivedAt: context.archivedAt ?? new Date().toISOString(),
  });
  archivedContexts.unshift(archived);
  if (archivedContexts.length > MAX_ARCHIVED_CONTEXTS) {
    archivedContexts.length = MAX_ARCHIVED_CONTEXTS;
  }
  if (activeContextId === context.id) {
    activeContextId = null;
    activeContext = null;
  }
}

export function resetDashboardContextLifecycleForTests(): void {
  activeContextId = null;
  activeContext = null;
  archivedContexts.length = 0;
}
