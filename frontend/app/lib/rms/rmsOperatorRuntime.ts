/**
 * NPA-T RMS:3 — Operator Agent runtime over sealed Ground Truth.
 */

import { RMS_3_BOUNDARY, type RmsObservableRecord, type RmsOperationalSourceFamily, type RmsOperatorPermittedView } from "./rmsOperatorContract.ts";
import { applyRmsObservationPolicy } from "./rmsObservationPolicy.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";

const PERMITTED_KEYS = Object.freeze([
  "demand",
  "availableCapacity",
  "inventory",
  "machineAvailability",
  "plannedProgress",
  "projectProgress",
  "staffAvailable",
  "scheduleVarianceDays",
]);

export function projectRmsOperatorPermittedView(world: RmsStructuredGroundTruth): RmsOperatorPermittedView {
  const values: Record<string, string | number | boolean> = {};
  for (const variable of world.variables) {
    if ((PERMITTED_KEYS as readonly string[]).includes(variable.key)) values[variable.key] = variable.value;
  }
  return Object.freeze({
    actorKind: "OPERATOR_AGENT",
    tick: world.clock.tick,
    simulatedAt: world.clock.simulatedAt,
    worldKind: world.worldKind,
    values: Object.freeze(values),
    hiddenCausalRelationships: false,
  });
}

export function observeRmsOperationalWorld(input: {
  readonly world: RmsStructuredGroundTruth;
  readonly simulationId: string;
  readonly runId: string;
  readonly enabledSources?: readonly RmsOperationalSourceFamily[];
}): readonly RmsObservableRecord[] {
  if (RMS_3_BOUNDARY.startsRms4) throw new Error("RMS:3 must not start RMS:4");
  return applyRmsObservationPolicy(input);
}

export type { RmsOperatorPublicationAttempt } from "./rmsOperatorContract.ts";

export function verifyRmsOperatorObservable(): { readonly ok: true } {
  if (RMS_3_BOUNDARY.parallelDataReality) throw new Error("RMS:3 must not create Data Reality");
  if (RMS_3_BOUNDARY.publishesGroundTruthDirectlyToNexora) throw new Error("RMS:3 must not publish Ground Truth to Nexora");
  if (RMS_3_BOUNDARY.simulationConfirmsSemantics) throw new Error("RMS:3 must not confirm semantics");
  if (RMS_3_BOUNDARY.startsRms4) throw new Error("RMS:3 must not start RMS:4");
  return Object.freeze({ ok: true as const });
}
