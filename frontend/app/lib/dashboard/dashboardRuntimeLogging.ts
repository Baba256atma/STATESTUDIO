/**
 * Dashboard runtime diagnostic brakes (dev only, deduped).
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { DashboardSurfaceId } from "./dashboardSurfaceRegistry.ts";

const dashboardLogKeys = new Set<string>();

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (dashboardLogKeys.has(dedupeKey)) return false;
  dashboardLogKeys.add(dedupeKey);
  return true;
}

export function reportDashboardRuntime(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.phase ?? "init"}:${payload.owner ?? "unknown"}`;
  if (!shouldEmit("[Nexora][DashboardRuntime]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardRuntime]", payload);
}

export function reportDashboardSurface(payload: {
  surfaceId: DashboardSurfaceId;
  dashboardContext: DashboardContext;
  status: "active" | "placeholder" | "delegated";
  source?: string;
}): void {
  const key = `${payload.surfaceId}:${payload.dashboardContext}:${payload.status}`;
  if (!shouldEmit("[Nexora][DashboardSurface]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardSurface]", payload);
}

export function reportDashboardContext(payload: {
  dashboardContext: DashboardContext;
  surfaceId: DashboardSurfaceId;
  source: string;
  reason?: string;
  priorContext?: DashboardContext | null;
  contextId?: string;
  lifecyclePhase?: string;
}): void {
  const key = `${payload.contextId ?? payload.dashboardContext}:${payload.source}:${payload.reason ?? "update"}`;
  if (!shouldEmit("[Nexora][DashboardContext]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardContext]", payload);
}

export function reportDashboardRoute(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.contextId ?? "none"}:${payload.source ?? "unknown"}:${payload.intent ?? "default"}`;
  if (!shouldEmit("[Nexora][DashboardRoute]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardRoute]", payload);
}

export function reportDashboardSurfaceResolved(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.contextId ?? "none"}:${payload.surfaceId ?? "unknown"}:${payload.category ?? "unknown"}`;
  if (!shouldEmit("[Nexora][DashboardSurfaceResolved]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardSurfaceResolved]", payload);
}

export function reportDashboardContextNormalized(payload: Readonly<Record<string, unknown>>): void {
  const key = `${payload.contextId ?? "none"}:${payload.category ?? "unknown"}:${payload.source ?? "unknown"}`;
  if (!shouldEmit("[Nexora][DashboardContextNormalized]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardContextNormalized]", payload);
}

export function reportDashboardRegistry(payload: {
  surfaceCount: number;
  surfaces: readonly DashboardSurfaceId[];
  version: string;
}): void {
  const key = `${payload.version}:${payload.surfaceCount}`;
  if (!shouldEmit("[Nexora][DashboardRegistry]", key)) return;
  globalThis.console?.info?.("[Nexora][DashboardRegistry]", payload);
}

export function reportDuplicateDashboardOwner(payload: {
  competingOwner: string;
  source: string;
  canonicalOwner: string;
}): void {
  const key = `${payload.competingOwner}:${payload.source}`;
  if (!shouldEmit("[Nexora][DashboardRuntime]", `duplicate:${key}`)) return;
  globalThis.console?.warn?.("[Nexora][DashboardRuntime]", {
    violation: "duplicate_dashboard_owner",
    action: "preserve_canonical_owner",
    ...payload,
  });
}

export function resetDashboardRuntimeLoggingForTests(): void {
  dashboardLogKeys.clear();
}
