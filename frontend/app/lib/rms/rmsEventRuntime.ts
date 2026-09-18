/**
 * NPA-T RMS:6 — deterministic event/disturbance scheduler over RMS:2 transitions.
 */

import { advanceRmsWorldClock, applyRmsWorldEventsOnCurrentTick } from "./rmsWorldEngine.ts";
import { compileRmsDisturbance } from "./rmsEventCompile.ts";
import { RMS_6_BOUNDARY, type RmsEventTrace, type RmsScheduledDisturbance } from "./rmsEventContract.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";

export type RmsEventRuntimeState = {
  readonly schedule: readonly RmsScheduledDisturbance[];
  readonly active: readonly string[];
  readonly traces: readonly RmsEventTrace[];
  readonly lastCompiledEffects: readonly { readonly eventId: string; readonly effect: "DIRECT" | "SECONDARY" }[];
};

export function createRmsEventRuntime(schedule: readonly RmsScheduledDisturbance[]): RmsEventRuntimeState {
  if (RMS_6_BOUNDARY.injectsProblemObjects || RMS_6_BOUNDARY.injectsRiskObjects) {
    throw new Error("RMS:6 must not inject Nexora Problem/Risk objects");
  }
  return Object.freeze({
    schedule: Object.freeze([...schedule].sort((left, right) => left.scheduledTick - right.scheduledTick || left.eventId.localeCompare(right.eventId))),
    active: Object.freeze([]),
    traces: Object.freeze([]),
    lastCompiledEffects: Object.freeze([]),
  });
}

export function runRmsEventScheduleUntil(
  world: RmsStructuredGroundTruth,
  runtime: RmsEventRuntimeState,
  untilTick: number,
): { readonly world: RmsStructuredGroundTruth; readonly runtime: RmsEventRuntimeState } {
  if (RMS_6_BOUNDARY.bypassesOperatorRdi) throw new Error("RMS:6 must not bypass Operator/RDI");
  let nextWorld = world;
  let active = [...runtime.active];
  const traces = [...runtime.traces];
  const effects: { eventId: string; effect: "DIRECT" | "SECONDARY" }[] = [];
  while (nextWorld.clock.tick < untilTick) {
    nextWorld = advanceRmsWorldClock(nextWorld, 1);
    const due = runtime.schedule.filter((item) => item.scheduledTick === nextWorld.clock.tick);
    for (const disturbance of due) {
      const compiled = compileRmsDisturbance(disturbance);
      const beforeHistory = nextWorld.history.length;
      nextWorld = applyRmsWorldEventsOnCurrentTick(nextWorld, compiled.map((item) => item.worldEvent));
      const historyIds = nextWorld.history.slice(beforeHistory).map((item) => item.historyId);
      traces.push(
        Object.freeze({
          eventId: disturbance.eventId,
          family: disturbance.family,
          tick: nextWorld.clock.tick,
          historyIds: Object.freeze(historyIds),
          hiddenFromNexora: true,
          hiddenFromManager: true,
        }),
      );
      for (const item of compiled) effects.push({ eventId: disturbance.eventId, effect: item.effect });
      if (disturbance.kind === "DURATION") active.push(disturbance.eventId);
      if (disturbance.kind === "RECOVERY") {
        active = active.filter((item) => !disturbance.eventId.startsWith(`${item}:`));
        const parent = disturbance.eventId.replace(/:recovery$/, "");
        active = active.filter((item) => item !== parent);
      }
    }
    active = active.filter((eventId) => {
      const source = runtime.schedule.find((item) => item.eventId === eventId);
      if (!source || source.durationTicks == null) return false;
      return nextWorld.clock.tick < source.scheduledTick + source.durationTicks;
    });
  }
  return Object.freeze({
    world: nextWorld,
    runtime: Object.freeze({
      schedule: runtime.schedule,
      active: Object.freeze(active),
      traces: Object.freeze(traces),
      lastCompiledEffects: Object.freeze(effects),
    }),
  });
}

export function verifyRmsEventsDisturbances(): { readonly ok: true } {
  if (RMS_6_BOUNDARY.startsRms7) throw new Error("RMS:6 must not start RMS:7");
  if (RMS_6_BOUNDARY.injectsProblemObjects || RMS_6_BOUNDARY.injectsRiskObjects) {
    throw new Error("RMS:6 must not inject Problem/Risk objects");
  }
  if (RMS_6_BOUNDARY.simulationCausalityIsNexoraEvidence) throw new Error("RMS:6 must not treat simulation causality as Evidence");
  if (RMS_6_BOUNDARY.d7IsGroundTruth) throw new Error("RMS:6 must not treat D7 as Ground Truth");
  return Object.freeze({ ok: true as const });
}
