/**
 * NPA-T RMS:2 — deterministic Ground Truth clock, events, and transitions.
 */

import { createRmsClock, type RmsClock } from "./rmsSimulationState.ts";
import type {
  RmsStructuredGroundTruth,
  RmsWorldEvent,
  RmsWorldFact,
  RmsWorldHistoryEntry,
  RmsWorldKind,
  RmsWorldVariable,
} from "./rmsWorldContract.ts";
import { RMS_2_BOUNDARY, rmsGroundTruthWorldIdentity } from "./rmsWorldContract.ts";
import type { BusinessProjectContextKind } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";

export type RmsGroundTruthSeed = {
  readonly worldId: string;
  readonly worldKind?: RmsWorldKind;
  readonly nmiContextKind?: BusinessProjectContextKind;
  readonly label?: string;
  readonly facts?: readonly RmsWorldFact[];
  readonly entities?: RmsStructuredGroundTruth["entities"];
  readonly variables?: readonly RmsWorldVariable[];
  readonly relationships?: RmsStructuredGroundTruth["relationships"];
  readonly clock?: RmsClock;
  readonly paused?: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const EPOCH = Date.parse("2026-09-16T00:00:00.000Z");

export function advanceRmsSimulationClock(clock: RmsClock, steps = 1): RmsClock {
  const tick = clock.tick + steps;
  return createRmsClock(tick, new Date(EPOCH + tick * DAY_MS).toISOString());
}

export function projectRmsFacts(variables: readonly RmsWorldVariable[]): readonly RmsWorldFact[] {
  return Object.freeze(
    variables.map((item) =>
      Object.freeze({
        factId: item.variableId,
        key: item.key,
        value: item.value,
      }),
    ),
  );
}

export function instantiateRmsGroundTruth(seed: RmsGroundTruthSeed): RmsStructuredGroundTruth {
  const clock = seed.clock ?? createRmsClock();
  const worldKind = seed.worldKind ?? "BUSINESS";
  const nmiContextKind = seed.nmiContextKind ?? worldKind;
  const variables = seed.variables
    ? Object.freeze(seed.variables.map((item) => Object.freeze({ ...item, vaiRoleEngine: false as const })))
    : Object.freeze(
        (seed.facts ?? []).map((fact) =>
          Object.freeze({
            variableId: fact.factId,
            key: fact.key,
            value: fact.value,
            unit: null,
            tick: clock.tick,
            simulatedAt: clock.simulatedAt,
            entityId: "entity:lifted",
            source: "rms:1-fact-lift",
            mutability: "MUTABLE" as const,
            vaiRoleEngine: false as const,
          }),
        ),
      );
  const entities = seed.entities
    ? Object.freeze(seed.entities.map((item) => Object.freeze({ ...item })))
    : Object.freeze([{ entityId: "entity:lifted", kind: "ORGANIZATION" as const, label: seed.label ?? seed.worldId }]);
  const relationships = Object.freeze((seed.relationships ?? []).map((item) => Object.freeze({
    ...item,
    knownToNexora: false as const,
    confirmedCausalForNexora: false as const,
  })));
  return Object.freeze({
    identity: rmsGroundTruthWorldIdentity,
    worldId: seed.worldId,
    worldKind,
    nmiContextKind,
    nmiStructureAuthority: "NMI:1",
    label: seed.label ?? seed.worldId,
    clock,
    paused: seed.paused ?? false,
    entities,
    variables,
    relationships,
    history: Object.freeze([]),
    facts: projectRmsFacts(variables),
    publishedToObservableData: false,
    publishedToNexoraKnowledge: false,
    vaiRoleEngine: false,
  });
}

export function applyRmsWorldEvents(
  world: RmsStructuredGroundTruth,
  events: readonly RmsWorldEvent[],
): RmsStructuredGroundTruth {
  return applyRmsWorldTransitions(world, events, true);
}

export function applyRmsWorldEventsOnCurrentTick(
  world: RmsStructuredGroundTruth,
  events: readonly RmsWorldEvent[],
): RmsStructuredGroundTruth {
  return applyRmsWorldTransitions(world, events, false);
}

export function advanceRmsWorldClock(world: RmsStructuredGroundTruth, steps = 1): RmsStructuredGroundTruth {
  if (RMS_2_BOUNDARY.startsRms3) throw new Error("RMS:2 must not start RMS:3");
  if (world.paused) throw new Error("RMS:2 cannot evolve a paused world");
  let clock = world.clock;
  for (let i = 0; i < steps; i += 1) clock = advanceRmsSimulationClock(clock);
  return Object.freeze({ ...world, clock });
}

function applyRmsWorldTransitions(
  world: RmsStructuredGroundTruth,
  events: readonly RmsWorldEvent[],
  advanceClock: boolean,
): RmsStructuredGroundTruth {
  if (RMS_2_BOUNDARY.startsRms3) throw new Error("RMS:2 must not start RMS:3");
  if (world.paused) throw new Error("RMS:2 cannot evolve a paused world");
  let clock = world.clock;
  const variables = [...world.variables];
  const history = [...world.history];
  for (const event of events) {
    if (advanceClock) clock = advanceRmsSimulationClock(clock);
    const index = variables.findIndex((item) => item.variableId === event.variableId);
    if (index < 0) throw new Error(`RMS:2 unknown variable ${event.variableId}`);
    const current = variables[index]!;
    if (current.mutability === "LOCKED") throw new Error(`RMS:2 variable ${current.variableId} is locked`);
    const after = nextValue(current.value, event);
    variables[index] = Object.freeze({
      ...current,
      value: after,
      tick: clock.tick,
      simulatedAt: clock.simulatedAt,
      vaiRoleEngine: false as const,
    });
    history.push(
      Object.freeze({
        historyId: `${world.worldId}:${event.eventId}:${clock.tick}:${history.length}`,
        tick: clock.tick,
        simulatedAt: clock.simulatedAt,
        eventId: event.eventId,
        eventType: event.type,
        entityId: current.entityId,
        variableId: current.variableId,
        beforeValue: current.value,
        afterValue: after,
        nexoraEvidence: false as const,
      } satisfies RmsWorldHistoryEntry),
    );
  }
  const nextVariables = Object.freeze(variables);
  return Object.freeze({
    ...world,
    clock,
    variables: nextVariables,
    history: Object.freeze(history),
    facts: projectRmsFacts(nextVariables),
    publishedToObservableData: false,
    publishedToNexoraKnowledge: false,
    vaiRoleEngine: false,
  });
}

export function pauseRmsWorld(world: RmsStructuredGroundTruth, paused: boolean): RmsStructuredGroundTruth {
  return Object.freeze({ ...world, paused });
}

export function verifyRmsGroundTruthWorld(): { readonly ok: true } {
  if (RMS_2_BOUNDARY.ownsNmiSemantics) throw new Error("RMS:2 must not own NMI semantics");
  if (RMS_2_BOUNDARY.ownsVaiRoles) throw new Error("RMS:2 must not own VAI roles");
  if (RMS_2_BOUNDARY.publishesGroundTruthToObservableData || RMS_2_BOUNDARY.publishesGroundTruthToNexora) {
    throw new Error("RMS:2 must not publish Ground Truth");
  }
  if (RMS_2_BOUNDARY.startsRms3) throw new Error("RMS:2 must not start RMS:3");
  if (RMS_2_BOUNDARY.d7IsGroundTruth) throw new Error("RMS:2 must not treat D7 as Ground Truth");
  return Object.freeze({ ok: true as const });
}

function nextValue(
  current: string | number | boolean,
  event: RmsWorldEvent,
): string | number | boolean {
  if (event.nextValue !== undefined) return event.nextValue;
  if (event.delta !== undefined) {
    if (typeof current !== "number") throw new Error("RMS:2 delta requires a numeric value");
    return current + event.delta;
  }
  throw new Error("RMS:2 event requires nextValue or delta");
}
