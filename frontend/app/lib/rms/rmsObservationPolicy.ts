/**
 * NPA-T RMS:3 — deterministic Ground Truth → Observable Record policy.
 * Does not publish causal conclusions or confirm Nexora semantics.
 */

import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";
import type { RmsObservableRecord, RmsObservationStatus, RmsOperationalSourceFamily } from "./rmsOperatorContract.ts";

export type RmsObservationRule = {
  readonly worldKey: string;
  readonly field: string;
  readonly sourceFamily: RmsOperationalSourceFamily;
  readonly objectKey: string;
  readonly delayTicks: number;
  readonly transform: "identity" | "machine_status" | "min_demand_capacity";
};

export const RMS_DEFAULT_OBSERVATION_POLICY = Object.freeze([
  Object.freeze({ worldKey: "demand", field: "orders_received", sourceFamily: "ERP", objectKey: "operations", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "demand", field: "requested_quantity", sourceFamily: "CRM", objectKey: "customer", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "availableCapacity", field: "CAP_AV", sourceFamily: "PRODUCTION", objectKey: "production", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "demand", field: "produced_quantity", sourceFamily: "PRODUCTION", objectKey: "production", delayTicks: 0, transform: "min_demand_capacity" }),
  Object.freeze({ worldKey: "inventory", field: "inventory_quantity", sourceFamily: "INVENTORY", objectKey: "inventory", delayTicks: 1, transform: "identity" }),
  Object.freeze({ worldKey: "machineAvailability", field: "machine_status", sourceFamily: "MAINTENANCE", objectKey: "maintenance", delayTicks: 0, transform: "machine_status" }),
  Object.freeze({ worldKey: "plannedProgress", field: "planned_progress", sourceFamily: "PMO", objectKey: "project-control", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "projectProgress", field: "actual_progress", sourceFamily: "PROJECT_CONTROL", objectKey: "project-control", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "staffAvailable", field: "resource_usage", sourceFamily: "PMO", objectKey: "project-control", delayTicks: 0, transform: "identity" }),
  Object.freeze({ worldKey: "scheduleVarianceDays", field: "schedule_observation", sourceFamily: "PROJECT_CONTROL", objectKey: "project-control", delayTicks: 0, transform: "identity" }),
]) satisfies readonly RmsObservationRule[];

export function observationPolicyForSources(
  sources: readonly RmsOperationalSourceFamily[],
): readonly RmsObservationRule[] {
  return Object.freeze(RMS_DEFAULT_OBSERVATION_POLICY.filter((rule) => sources.includes(rule.sourceFamily)));
}

export function applyRmsObservationPolicy(input: {
  readonly world: RmsStructuredGroundTruth;
  readonly simulationId: string;
  readonly runId: string;
  readonly policy?: readonly RmsObservationRule[];
  readonly enabledSources?: readonly RmsOperationalSourceFamily[];
}): readonly RmsObservableRecord[] {
  const policy = input.enabledSources
    ? observationPolicyForSources(input.enabledSources)
    : (input.policy ?? RMS_DEFAULT_OBSERVATION_POLICY);
  const records: RmsObservableRecord[] = [];
  const sourceAllowed = (family: RmsOperationalSourceFamily) =>
    !input.enabledSources || input.enabledSources.includes(family);
  for (const rule of policy) {
    const variable = input.world.variables.find((item) => item.key === rule.worldKey);
    if (!variable) continue;
    const delaySatisfied = input.world.clock.tick - variable.tick >= rule.delayTicks;
    const status: RmsObservationStatus = delaySatisfied ? "AVAILABLE" : "DELAYED";
    const value = status === "AVAILABLE" ? observeValue(input.world, rule) : null;
    records.push(
      Object.freeze({
        recordId: `${input.runId}:${rule.field}:${input.world.clock.tick}`,
        simulationId: input.simulationId,
        runId: input.runId,
        sourceFamily: rule.sourceFamily,
        sourceSystemId: `source:${rule.sourceFamily.toLowerCase()}`,
        domain: rule.sourceFamily,
        tick: input.world.clock.tick,
        simulatedAt: input.world.clock.simulatedAt,
        field: rule.field,
        value,
        unit: rule.transform === "machine_status" ? null : variable.unit,
        relatedEntityId: variable.entityId,
        status,
        semanticConfirmation: false,
        confirmedMeaning: null,
        hiddenGroundTruthKey: null,
        causalClaim: false,
        observationProvenance: `operator:${input.runId}:tick:${input.world.clock.tick}`,
      }),
    );
  }
  if (sourceAllowed("MAINTENANCE")) records.push(
    Object.freeze({
      recordId: `${input.runId}:downtime_unreported:${input.world.clock.tick}`,
      simulationId: input.simulationId,
      runId: input.runId,
      sourceFamily: "MAINTENANCE",
      sourceSystemId: "source:maintenance",
      domain: "MAINTENANCE",
      tick: input.world.clock.tick,
      simulatedAt: input.world.clock.simulatedAt,
      field: "downtime_unreported",
      value: null,
      unit: "min",
      relatedEntityId: null,
      status: "MISSING" as const,
      semanticConfirmation: false,
      confirmedMeaning: null,
      hiddenGroundTruthKey: null,
      causalClaim: false,
      observationProvenance: `operator:${input.runId}:tick:${input.world.clock.tick}`,
    }),
  );
  if (sourceAllowed("PRODUCTION")) records.push(
    Object.freeze({
      recordId: `${input.runId}:last_cycle_count:${input.world.clock.tick}`,
      simulationId: input.simulationId,
      runId: input.runId,
      sourceFamily: "PRODUCTION",
      sourceSystemId: "source:production",
      domain: "PRODUCTION",
      tick: input.world.clock.tick,
      simulatedAt: input.world.clock.simulatedAt,
      field: "last_cycle_count",
      value: 0,
      unit: "count",
      relatedEntityId: null,
      status: "STALE" as const,
      semanticConfirmation: false,
      confirmedMeaning: null,
      hiddenGroundTruthKey: null,
      causalClaim: false,
      observationProvenance: `operator:${input.runId}:tick:${input.world.clock.tick}`,
    }),
  );
  return Object.freeze(records);
}

function observeValue(
  world: RmsStructuredGroundTruth,
  rule: RmsObservationRule,
): string | number | boolean | null {
  if (rule.transform === "min_demand_capacity") {
    const demand = numeric(world, "demand");
    const capacity = numeric(world, "availableCapacity");
    if (demand == null || capacity == null) return null;
    return Math.min(demand, capacity);
  }
  const variable = world.variables.find((item) => item.key === rule.worldKey);
  if (!variable) return null;
  if (rule.transform === "machine_status") {
    return typeof variable.value === "number" && variable.value >= 1 ? "running" : "stopped";
  }
  return variable.value;
}

function numeric(world: RmsStructuredGroundTruth, key: string): number | null {
  const value = world.variables.find((item) => item.key === key)?.value;
  return typeof value === "number" ? value : null;
}
