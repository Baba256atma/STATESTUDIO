/**
 * NPA-T RMS:6 — world-condition fixtures. Not Nexora Problem/Risk objects.
 */

import type { RmsProblemInjection, RmsScheduledDisturbance } from "./rmsEventContract.ts";

function disturbance(input: Omit<RmsScheduledDisturbance, "origin" | "createsNexoraProblemObject" | "createsNexoraRiskObject" | "knownToNexora" | "knownToManager">): RmsScheduledDisturbance {
  return Object.freeze({
    ...input,
    origin: "RMS_SCHEDULER",
    createsNexoraProblemObject: false,
    createsNexoraRiskObject: false,
    knownToNexora: false,
    knownToManager: false,
  });
}

export const RMS_NORTHSTAR_DEMAND_SURGE = disturbance({
  eventId: "evt:demand-surge",
  family: "DEMAND",
  kind: "INSTANT",
  scheduledTick: 10,
  durationTicks: null,
  targetEntityId: "unit:production",
  magnitude: 125,
});

export const RMS_NORTHSTAR_MACHINE_FAILURE = disturbance({
  eventId: "evt:machine-failure",
  family: "ASSET",
  kind: "DURATION",
  scheduledTick: 20,
  durationTicks: 9,
  targetEntityId: "asset:machine-a",
  magnitude: 0,
});

export const RMS_NORTHSTAR_MACHINE_RECOVERY = disturbance({
  eventId: "evt:machine-failure:recovery",
  family: "ASSET",
  kind: "RECOVERY",
  scheduledTick: 29,
  durationTicks: null,
  targetEntityId: "asset:machine-a",
  magnitude: 1,
});

export const RMS_NORTHSTAR_MINOR_CAPACITY_LOSS = disturbance({
  eventId: "evt:minor-capacity",
  family: "CAPACITY",
  kind: "INSTANT",
  scheduledTick: 3,
  durationTicks: null,
  targetEntityId: "unit:production",
  magnitude: 108,
});

export const RMS_NORTHSTAR_SUPPLIER_DELAY = disturbance({
  eventId: "evt:supplier-delay",
  family: "SUPPLY",
  kind: "INSTANT",
  scheduledTick: 4,
  durationTicks: null,
  targetEntityId: "inv:finished",
  magnitude: 300,
});

export const RMS_WAREHOUSE_RESOURCE_SHORTAGE = disturbance({
  eventId: "evt:resource-shortage",
  family: "RESOURCE",
  kind: "INSTANT",
  scheduledTick: 5,
  durationTicks: null,
  targetEntityId: "resource:crew",
  magnitude: 8,
});

export const RMS_WAREHOUSE_SCHEDULE_DELAY = disturbance({
  eventId: "evt:schedule-delay",
  family: "SCHEDULE",
  kind: "INSTANT",
  scheduledTick: 5,
  durationTicks: null,
  targetEntityId: "stream:build",
  magnitude: 6,
});

export const RMS_CAPACITY_PROBLEM_INJECTION: RmsProblemInjection = Object.freeze({
  injectionId: "inject:capacity-condition",
  label: "World conditions that may produce a capacity management problem",
  createsNexoraProblemObject: false,
  createsNexoraRiskObject: false,
  worldConditions: Object.freeze([RMS_NORTHSTAR_DEMAND_SURGE, RMS_NORTHSTAR_MACHINE_FAILURE]),
});

export const RMS_COMBINED_DISTURBANCE_SCHEDULE = Object.freeze([
  RMS_NORTHSTAR_DEMAND_SURGE,
  RMS_NORTHSTAR_MACHINE_FAILURE,
]);

export const RMS_MACHINE_FAILURE_SCHEDULE = Object.freeze([
  RMS_NORTHSTAR_MACHINE_FAILURE,
  RMS_NORTHSTAR_MACHINE_RECOVERY,
]);

export const RMS_RISK_EXPOSURE_SCHEDULE = Object.freeze([RMS_NORTHSTAR_SUPPLIER_DELAY]);
export const RMS_INSUFFICIENT_SIGNAL_SCHEDULE = Object.freeze([RMS_NORTHSTAR_MINOR_CAPACITY_LOSS]);
export const RMS_PROJECT_DISTURBANCE_SCHEDULE = Object.freeze([
  RMS_WAREHOUSE_RESOURCE_SHORTAGE,
  RMS_WAREHOUSE_SCHEDULE_DELAY,
]);
