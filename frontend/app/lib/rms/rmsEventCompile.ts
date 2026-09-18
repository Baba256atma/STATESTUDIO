/**
 * NPA-T RMS:6 — compile disturbances into RMS:2 Ground Truth transition requests.
 * Direct vs secondary effects are explicit modeled assumptions, not a causal engine.
 */

import type { RmsCompiledTransition, RmsScheduledDisturbance } from "./rmsEventContract.ts";
import type { RmsWorldEvent, RmsWorldEventType } from "./rmsWorldContract.ts";

export const RMS_MODELED_ASSUMPTIONS = Object.freeze([
  "ASSET failure reduces availableCapacity to 85 while the asset is down",
  "ASSET recovery restores availableCapacity to 110",
  "SUPPLY delay reduces inventory buffer",
  "RESOURCE shortage slows projectProgress",
] as const);

export function compileRmsDisturbance(disturbance: RmsScheduledDisturbance): readonly RmsCompiledTransition[] {
  const compiled: RmsCompiledTransition[] = [];
  const direct = directTransition(disturbance);
  if (direct) compiled.push(direct);
  compiled.push(...secondaryTransitions(disturbance));
  return Object.freeze(compiled);
}

function worldEvent(eventId: string, type: RmsWorldEventType, variableId: string, nextValue: string | number | boolean): RmsWorldEvent {
  return Object.freeze({ eventId, type, variableId, nextValue });
}

function directTransition(disturbance: RmsScheduledDisturbance): RmsCompiledTransition | null {
  const id = disturbance.eventId;
  switch (disturbance.family) {
    case "DEMAND":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "DEMAND_CHANGE", "var:demand", disturbance.magnitude));
    case "CAPACITY":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "CAPACITY_CHANGE", "var:capacity", disturbance.magnitude));
    case "ASSET":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "ASSET_STATE_CHANGE", "var:availability", disturbance.kind === "RECOVERY" ? 1 : 0));
    case "SUPPLY":
    case "INVENTORY":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "INVENTORY_CHANGE", "var:inventory", disturbance.magnitude));
    case "RESOURCE":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "RESOURCE_CHANGE", "var:crew", disturbance.magnitude));
    case "COST":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "COST_CHANGE", "var:unit-cost", disturbance.magnitude));
    case "QUALITY":
      return freezeCompiled(id, "DIRECT", null, worldEvent(`${id}:quality`, "INVENTORY_CHANGE", "var:inventory", disturbance.magnitude));
    case "SCHEDULE":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "SCHEDULE_CHANGE", "var:schedule", disturbance.magnitude));
    case "SCOPE":
      return freezeCompiled(id, "DIRECT", null, worldEvent(id, "WORK_PROGRESS", "var:planned", disturbance.magnitude));
    default:
      return null;
  }
}

function secondaryTransitions(disturbance: RmsScheduledDisturbance): readonly RmsCompiledTransition[] {
  if (disturbance.family === "ASSET" && disturbance.kind !== "RECOVERY") {
    return Object.freeze([
      freezeCompiled(
        disturbance.eventId,
        "SECONDARY",
        RMS_MODELED_ASSUMPTIONS[0],
        worldEvent(`${disturbance.eventId}:capacity`, "CAPACITY_CHANGE", "var:capacity", 85),
      ),
    ]);
  }
  if (disturbance.family === "ASSET" && disturbance.kind === "RECOVERY") {
    return Object.freeze([
      freezeCompiled(
        disturbance.eventId,
        "SECONDARY",
        RMS_MODELED_ASSUMPTIONS[1],
        worldEvent(`${disturbance.eventId}:capacity`, "CAPACITY_CHANGE", "var:capacity", 110),
      ),
    ]);
  }
  if (disturbance.family === "RESOURCE" && disturbance.kind !== "RECOVERY") {
    return Object.freeze([
      freezeCompiled(
        disturbance.eventId,
        "SECONDARY",
        RMS_MODELED_ASSUMPTIONS[3],
        worldEvent(`${disturbance.eventId}:progress`, "WORK_PROGRESS", "var:actual", 0.58),
      ),
    ]);
  }
  return Object.freeze([]);
}

function freezeCompiled(
  eventId: string,
  effect: "DIRECT" | "SECONDARY",
  assumption: string | null,
  worldEventValue: RmsWorldEvent,
): RmsCompiledTransition {
  return Object.freeze({ eventId, effect, assumption, worldEvent: worldEventValue });
}
