/**
 * MRP_HUD:10:2 — Object Panel safe zone diagnostics traces.
 */

import type { ObjectPanelSafeZoneContract } from "./objectPanelSafeZoneContract.ts";

export type ObjectPanelSafeZoneStatus = "pass" | "warning" | "fail";

export function traceObjectPanelSafeZoneStatus(status: ObjectPanelSafeZoneStatus): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraObjectPanelSafeZone]\nstatus=${status}`);
}

export function traceObjectPanelSafeZoneOverlapDetected(overlapDetected: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraObjectPanelSafeZone]\noverlapDetected=${String(overlapDetected)}`
  );
}

export function traceObjectPanelSafeZoneMetrics(input: {
  objectPanelRight: number;
  mrpLeft: number;
  gap: number;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraObjectPanelSafeZone]\nobjectPanelRight=${input.objectPanelRight}\nmrpLeft=${input.mrpLeft}\ngap=${input.gap}`
  );
}

export function traceObjectPanelSafeZoneViolation(safeZoneViolation: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraObjectPanelSafeZone]\nsafeZoneViolation=${String(safeZoneViolation)}`
  );
}

export function traceObjectPanelSafeZoneContract(
  contract: ObjectPanelSafeZoneContract
): void {
  if (process.env.NODE_ENV === "production") return;
  const objectPanelRight = contract.objectPanelZone.left + contract.objectPanelZone.width;
  const status: ObjectPanelSafeZoneStatus = contract.overlapDetected
    ? "fail"
    : contract.safeZoneViolation
      ? "warning"
      : "pass";

  traceObjectPanelSafeZoneStatus(status);
  traceObjectPanelSafeZoneOverlapDetected(contract.overlapDetected);
  traceObjectPanelSafeZoneMetrics({
    objectPanelRight,
    mrpLeft: contract.mrpLeft,
    gap: contract.gap,
  });
  traceObjectPanelSafeZoneViolation(contract.safeZoneViolation);
}
