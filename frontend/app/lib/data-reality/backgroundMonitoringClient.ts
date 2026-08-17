"use client";

import type { NexoraBackgroundMonitoringState } from "./backgroundMonitoringRuntime.ts";
import type { NexoraDurableMonitoringSnapshot } from "./durableMonitoringRuntime.ts";

export async function readBackgroundMonitoringState(workspaceId: string): Promise<NexoraBackgroundMonitoringState | null> {
  const response = await fetch(`/api/monitoring/background?workspaceId=${encodeURIComponent(workspaceId)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const body = await response.json() as Readonly<{ state?: NexoraBackgroundMonitoringState | null }>;
  return body.state ?? null;
}

export async function syncBackgroundMonitoringSnapshot(snapshot: NexoraDurableMonitoringSnapshot, now: string): Promise<void> {
  const response = await fetch("/api/monitoring/background", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "sync", snapshot, now }) });
  const body = await response.json() as Readonly<{ ok?: boolean; message?: string }>;
  if (!response.ok || !body.ok) throw new Error(body.message ?? "Background monitoring could not be enabled.");
}

export async function requestBackgroundMonitoringRefresh(workspaceId: string, connectionId: string, now: string): Promise<Readonly<{ completed: boolean; reason: string; observationId: string | null }>> {
  const response = await fetch("/api/monitoring/background", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "manual", workspaceId, connectionId, now }) });
  const body = await response.json() as Readonly<{ result?: Readonly<{ completed: boolean; reason: string; observationId: string | null }>; message?: string }>;
  if (!body.result) throw new Error(body.message ?? "Background refresh could not be started.");
  return body.result;
}
