/**
 * MRP_HUD:10:3 — Timeline zone diagnostics traces.
 */

import type { TimelineZoneContract } from "./timelineZoneContract.ts";

export type TimelineZoneStatus = "pass" | "warning" | "fail";

export function traceTimelineZoneStatus(status: TimelineZoneStatus): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraTimelineZone]\nstatus=${status}`);
}

export function traceTimelineZoneOverlapDetected(overlapDetected: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraTimelineZone]\noverlapDetected=${String(overlapDetected)}`
  );
}

export function traceTimelineZoneMetrics(input: {
  timelineLeft: number;
  timelineRight: number;
  objectPanelLeft: number;
  scenePanelRight: number;
  mrpLeft: number;
  availableWidth: number;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraTimelineZone]\ntimelineLeft=${input.timelineLeft}\ntimelineRight=${input.timelineRight}\nobjectPanelLeft=${input.objectPanelLeft}\nscenePanelRight=${input.scenePanelRight}\nmrpLeft=${input.mrpLeft}\navailableWidth=${input.availableWidth}`
  );
}

export function traceTimelineZoneViolation(safeZoneViolation: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraTimelineZone]\nsafeZoneViolation=${String(safeZoneViolation)}`
  );
}

export function traceTimelineZoneClamped(clamped: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraTimelineZone]\nclamped=${String(clamped)}`);
}

export function traceTimelineZoneWriteSkipped(reason: string): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraTimelineZoneWriteSkipped]\nreason=${reason}`
  );
}

export function traceTimelineZoneContract(contract: TimelineZoneContract): void {
  if (process.env.NODE_ENV === "production") return;

  const status: TimelineZoneStatus = contract.overlapDetected
    ? "fail"
    : contract.safeZoneViolation
      ? "warning"
      : "pass";

  traceTimelineZoneStatus(status);
  traceTimelineZoneOverlapDetected(contract.overlapDetected);
  traceTimelineZoneMetrics({
    timelineLeft: contract.timelineLeft,
    timelineRight: contract.timelineRight,
    objectPanelLeft: contract.objectPanelLeft,
    scenePanelRight: contract.scenePanelRight,
    mrpLeft: contract.mrpLeft,
    availableWidth: contract.availableWidth,
  });
  traceTimelineZoneViolation(contract.safeZoneViolation);
  traceTimelineZoneClamped(contract.clamped);
}
