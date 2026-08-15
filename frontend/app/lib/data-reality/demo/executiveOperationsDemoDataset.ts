/**
 * P0:1 — Nexora Executive Operations Demo dataset (Dataset A / baseline).
 *
 * Controlled demo business observations for subsequent P0 phases.
 * NOT hard-coded Stage behavior. Stage must never import this module.
 *
 * Dataset B (operational-pressure) shares the same familyId / object model
 * and is prepared architecturally via withDatasetScenario — values arrive later.
 *
 * P0:2: object bindings with canonical NOL ids live in
 * executiveOperationsObjectBindings.ts and are re-exported here.
 */

import type {
  NexoraDataset,
  NexoraDatasetRecord,
  NexoraKPIDefinition,
  NexoraObjectDataBinding,
} from "../dataRealityContracts.ts";
import {
  EXECUTIVE_OPERATIONS_KPI_DEFINITIONS as CANONICAL_KPI_DEFINITIONS,
  getExecutiveOperationsKpiDefinitions as getCanonicalKpiDefinitions,
} from "./executiveOperationsKPIDefinitions.ts";
import {
  EXECUTIVE_OPERATIONS_OBJECT_BINDINGS as RESOLVED_DEMO_BINDINGS,
  getExecutiveOperationsObjectBindings as getResolvedDemoBindings,
} from "./executiveOperationsObjectBindings.ts";

export const EXECUTIVE_OPERATIONS_DATASET_FAMILY_ID =
  "nexora.executive-operations" as const;

export const EXECUTIVE_OPERATIONS_DEMO_DATASET_ID =
  "nexora.executive-operations.demo.baseline" as const;

export const EXECUTIVE_OPERATIONS_DEMO_DATASET_NAME =
  "Nexora Executive Operations Demo" as const;

/**
 * Canonical demo business object keys for this family.
 * P0:2 maps these onto NOL NexoraObjectIdentity.id via
 * executiveOperationsObjectBindings.ts (Stage adapter later).
 */
export const EXECUTIVE_OPERATIONS_OBJECT_KEYS = Object.freeze([
  "revenue",
  "cost",
  "production",
  "warehouse",
  "shipping",
  "customer",
] as const);

export type ExecutiveOperationsObjectKey =
  (typeof EXECUTIVE_OPERATIONS_OBJECT_KEYS)[number];

const BASELINE_RECORDS: readonly NexoraDatasetRecord[] = Object.freeze([
  Object.freeze({
    objectKey: "revenue",
    metricKey: "currentRevenue",
    value: 8_400_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "revenue",
    metricKey: "previousRevenue",
    value: 8_080_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "cost",
    metricKey: "operatingCost",
    value: 6_700_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "production",
    metricKey: "usedCapacity",
    value: 8700,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "production",
    metricKey: "totalCapacity",
    value: 10_000,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "warehouse",
    metricKey: "usedCapacity",
    value: 7900,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "warehouse",
    metricKey: "totalCapacity",
    value: 8500,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "shipping",
    metricKey: "onTimeDeliveries",
    value: 910,
    unit: "deliveries",
  }),
  Object.freeze({
    objectKey: "shipping",
    metricKey: "totalDeliveries",
    value: 1000,
    unit: "deliveries",
  }),
  Object.freeze({
    objectKey: "customer",
    metricKey: "satisfactionScore",
    value: 4.2,
    unit: "score",
  }),
  Object.freeze({
    objectKey: "customer",
    metricKey: "maximumSatisfactionScore",
    value: 5,
    unit: "score",
  }),
]);

export const EXECUTIVE_OPERATIONS_DEMO_DATASET: NexoraDataset = Object.freeze({
  id: EXECUTIVE_OPERATIONS_DEMO_DATASET_ID,
  name: EXECUTIVE_OPERATIONS_DEMO_DATASET_NAME,
  version: "1.0.0",
  capturedAt: "2026-08-10T00:00:00.000Z",
  source: "demo",
  familyId: EXECUTIVE_OPERATIONS_DATASET_FAMILY_ID,
  scenario: "baseline",
  records: BASELINE_RECORDS,
});

/**
 * Dataset B — Operational Pressure.
 * Same family / objects / bindings / KPI definitions; different values only.
 */
export const EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID =
  "nexora.executive-operations.demo.operational-pressure" as const;

const PRESSURE_RECORDS: readonly NexoraDatasetRecord[] = Object.freeze([
  Object.freeze({
    objectKey: "revenue",
    metricKey: "currentRevenue",
    value: 8_200_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "revenue",
    metricKey: "previousRevenue",
    value: 8_080_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "cost",
    metricKey: "operatingCost",
    value: 7_100_000,
    unit: "USD",
  }),
  Object.freeze({
    objectKey: "production",
    metricKey: "usedCapacity",
    value: 9600,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "production",
    metricKey: "totalCapacity",
    value: 10_000,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "warehouse",
    metricKey: "usedCapacity",
    value: 8400,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "warehouse",
    metricKey: "totalCapacity",
    value: 8500,
    unit: "units",
  }),
  Object.freeze({
    objectKey: "shipping",
    metricKey: "onTimeDeliveries",
    value: 820,
    unit: "deliveries",
  }),
  Object.freeze({
    objectKey: "shipping",
    metricKey: "totalDeliveries",
    value: 1000,
    unit: "deliveries",
  }),
  Object.freeze({
    objectKey: "customer",
    metricKey: "satisfactionScore",
    value: 3.6,
    unit: "score",
  }),
  Object.freeze({
    objectKey: "customer",
    metricKey: "maximumSatisfactionScore",
    value: 5,
    unit: "score",
  }),
]);

export const EXECUTIVE_OPERATIONS_PRESSURE_DATASET: NexoraDataset = Object.freeze({
  id: EXECUTIVE_OPERATIONS_PRESSURE_DATASET_ID,
  name: "Nexora Executive Operations Demo — Operational Pressure",
  version: "1.0.0",
  capturedAt: "2026-08-10T12:00:00.000Z",
  source: "demo",
  familyId: EXECUTIVE_OPERATIONS_DATASET_FAMILY_ID,
  scenario: "operational-pressure",
  records: PRESSURE_RECORDS,
});

/** P0:2 registry — includes canonical nexoraObjectId for each demo object. */
export const EXECUTIVE_OPERATIONS_OBJECT_BINDINGS: readonly NexoraObjectDataBinding[] =
  RESOLVED_DEMO_BINDINGS;

/** P0:3 registry — computation metadata only; shared by Dataset A and B. */
export const EXECUTIVE_OPERATIONS_KPI_DEFINITIONS: readonly NexoraKPIDefinition[] =
  CANONICAL_KPI_DEFINITIONS;

export function getExecutiveOperationsDemoDataset(): NexoraDataset {
  return EXECUTIVE_OPERATIONS_DEMO_DATASET;
}

export function getExecutiveOperationsPressureDataset(): NexoraDataset {
  return EXECUTIVE_OPERATIONS_PRESSURE_DATASET;
}

export function getExecutiveOperationsObjectKeys(): readonly string[] {
  return EXECUTIVE_OPERATIONS_OBJECT_KEYS;
}

export function getExecutiveOperationsObjectBindings(): readonly NexoraObjectDataBinding[] {
  return getResolvedDemoBindings();
}

export function getExecutiveOperationsKpiDefinitions(): readonly NexoraKPIDefinition[] {
  return getCanonicalKpiDefinitions();
}

export function countExecutiveOperationsDemoObjects(): number {
  return EXECUTIVE_OPERATIONS_OBJECT_KEYS.length;
}

export function countExecutiveOperationsDemoRecords(): number {
  return EXECUTIVE_OPERATIONS_DEMO_DATASET.records.length;
}
