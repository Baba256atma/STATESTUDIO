/**
 * D7:1:1 — Deterministic simulation clock (explicit ticks only; no intervals / rAF).
 */

import type { SimulationTimestamp } from "./simulationTypes.ts";

const DEFAULT_EPOCH = "1970-01-01T00:00:00.000Z";

function parseEpochMs(epochIso: string): number {
  const ms = Date.parse(epochIso);
  return Number.isFinite(ms) ? ms : Date.parse(DEFAULT_EPOCH);
}

/** Create a simulation timestamp for a tick (deterministic given tick + epoch). */
export function createSimulationTimestamp(
  tick: number,
  options?: Readonly<{ epochSimulatedAt?: string; tickDurationMs?: number }>
): SimulationTimestamp {
  const safeTick = Math.max(0, Math.floor(Number(tick) || 0));
  const epoch = options?.epochSimulatedAt ?? DEFAULT_EPOCH;
  const durationMs = Math.max(0, Number(options?.tickDurationMs ?? 1000) || 1000);
  const simulatedAt = new Date(parseEpochMs(epoch) + safeTick * durationMs).toISOString();
  return { tick: safeTick, simulatedAt };
}

/** Advance to the next tick index (does not mutate). */
export function advanceSimulationTick(currentTick: number): number {
  const tick = Math.max(0, Math.floor(Number(currentTick) || 0));
  return tick + 1;
}

export function compareSimulationTicks(a: number, b: number): -1 | 0 | 1 {
  const ta = Math.max(0, Math.floor(Number(a) || 0));
  const tb = Math.max(0, Math.floor(Number(b) || 0));
  if (ta < tb) return -1;
  if (ta > tb) return 1;
  return 0;
}

export function isSimulationTickBefore(a: number, b: number): boolean {
  return compareSimulationTicks(a, b) < 0;
}
