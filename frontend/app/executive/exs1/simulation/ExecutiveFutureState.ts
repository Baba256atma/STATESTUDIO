/**
 * Phase D — Isolated Future Executive State (never mutates Runtime).
 */

import type { Exs1ObjectId } from "../exs1Types";
import type {
  AssumptionEffect,
  BaselineSnapshot,
  ObjectMetricSnapshot,
  SimulationAssumptionId,
} from "./ExecutiveSimulationConfig";
import { ASSUMPTION_EFFECTS } from "./ExecutiveSimulationConfig";

export type FutureObjectState = {
  readonly objectId: Exs1ObjectId;
  readonly label: string;
  readonly metric: string;
  readonly current: number;
  readonly future: number;
  readonly delta: number;
  readonly unit: string;
};

export type FutureKpiState = {
  readonly kpiId: string;
  readonly name: string;
  readonly current: number;
  readonly projected: number;
  readonly difference: number;
  readonly unit: string;
};

export type ExecutiveFutureState = {
  readonly futureStateId: string;
  readonly scenarioLabel: string;
  readonly assumptionIds: readonly SimulationAssumptionId[];
  readonly objects: readonly FutureObjectState[];
  readonly kpis: readonly FutureKpiState[];
  readonly createdAt: number;
};

function combineEffects(
  assumptionIds: readonly SimulationAssumptionId[],
): AssumptionEffect {
  const objectDeltas: Partial<Record<Exs1ObjectId, number>> = {};
  const kpiDeltas: Record<string, number> = {};
  let notes = "";
  for (const id of assumptionIds) {
    const effect = ASSUMPTION_EFFECTS[id];
    notes = notes ? `${notes} ${effect.notes}` : effect.notes;
    for (const [objectId, delta] of Object.entries(effect.objectDeltas)) {
      const key = objectId as Exs1ObjectId;
      objectDeltas[key] = (objectDeltas[key] ?? 0) + (delta ?? 0);
    }
    for (const [kpiId, delta] of Object.entries(effect.kpiDeltas)) {
      kpiDeltas[kpiId] = (kpiDeltas[kpiId] ?? 0) + delta;
    }
  }
  return {
    objectDeltas,
    kpiDeltas,
    risk: "Medium",
    notes,
  };
}

export function buildFutureState(input: {
  readonly baseline: BaselineSnapshot;
  readonly scenarioLabel: string;
  readonly assumptionIds: readonly SimulationAssumptionId[];
}): ExecutiveFutureState {
  const effect = combineEffects(input.assumptionIds);
  const objects: FutureObjectState[] = input.baseline.objects.map(
    (object: ObjectMetricSnapshot) => {
      const delta = effect.objectDeltas[object.objectId] ?? 0;
      return {
        objectId: object.objectId,
        label: object.label,
        metric: object.metric,
        current: object.current,
        future: object.current + delta,
        delta,
        unit: object.unit,
      };
    },
  );
  const kpis: FutureKpiState[] = input.baseline.kpis.map((kpi) => {
    const difference = effect.kpiDeltas[kpi.kpiId] ?? 0;
    return {
      kpiId: kpi.kpiId,
      name: kpi.name,
      current: kpi.current,
      projected: kpi.current + difference,
      difference,
      unit: kpi.unit,
    };
  });

  return {
    futureStateId: `future-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    scenarioLabel: input.scenarioLabel,
    assumptionIds: [...input.assumptionIds],
    objects,
    kpis,
    createdAt: Date.now(),
  };
}
