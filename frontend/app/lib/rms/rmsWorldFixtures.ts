/**
 * NPA-T RMS:2 — deterministic fixtures. Not a customer demo.
 */

import { instantiateRmsGroundTruth } from "./rmsWorldEngine.ts";
import type { RmsStructuredGroundTruth, RmsWorldEvent } from "./rmsWorldContract.ts";

export function createNorthstarManufacturingWorld(): RmsStructuredGroundTruth {
  return instantiateRmsGroundTruth({
    worldId: "world:northstar",
    worldKind: "BUSINESS",
    nmiContextKind: "BUSINESS",
    label: "Northstar Manufacturing",
    entities: [
      { entityId: "org:northstar", kind: "ORGANIZATION", label: "Northstar Manufacturing" },
      { entityId: "unit:production", kind: "OPERATING_UNIT", label: "Production" },
      { entityId: "asset:machine-a", kind: "ASSET", label: "Machine A" },
      { entityId: "product:a", kind: "PRODUCT", label: "Product A" },
      { entityId: "inv:finished", kind: "INVENTORY", label: "Finished goods" },
      { entityId: "unit:delivery", kind: "OPERATING_UNIT", label: "Delivery" },
    ],
    variables: [
      variable("var:demand", "demand", 100, "units/day", "unit:production"),
      variable("var:capacity", "availableCapacity", 110, "units/day", "unit:production"),
      variable("var:inventory", "inventory", 420, "units", "inv:finished"),
      variable("var:availability", "machineAvailability", 1, "ratio", "asset:machine-a"),
    ],
    relationships: [
      {
        relationshipId: "rel:machine-capacity",
        fromId: "asset:machine-a",
        toId: "unit:production",
        kind: "supplies_capacity",
        knownToNexora: false,
        confirmedCausalForNexora: false,
      },
      {
        relationshipId: "rel:production-product",
        fromId: "unit:production",
        toId: "product:a",
        kind: "produces",
        knownToNexora: false,
        confirmedCausalForNexora: false,
      },
      {
        relationshipId: "rel:inventory-delivery",
        fromId: "inv:finished",
        toId: "unit:delivery",
        kind: "supports",
        knownToNexora: false,
        confirmedCausalForNexora: false,
      },
    ],
  });
}

export function createWarehouseExpansionWorld(): RmsStructuredGroundTruth {
  return instantiateRmsGroundTruth({
    worldId: "world:warehouse-expansion",
    worldKind: "PROJECT",
    nmiContextKind: "PROJECT",
    label: "Warehouse Expansion",
    entities: [
      { entityId: "project:warehouse", kind: "PROJECT", label: "Warehouse Expansion" },
      { entityId: "stream:build", kind: "WORKSTREAM", label: "Build" },
      { entityId: "resource:crew", kind: "RESOURCE", label: "Crew capacity" },
    ],
    variables: [
      variable("var:planned", "plannedProgress", 0.71, "ratio", "project:warehouse"),
      variable("var:actual", "projectProgress", 0.63, "ratio", "project:warehouse"),
      variable("var:crew", "staffAvailable", 12, "people", "resource:crew"),
      variable("var:unit-cost", "unitCost", 14.2, "currency", "project:warehouse"),
      variable("var:schedule", "scheduleVarianceDays", 0, "days", "stream:build"),
    ],
    relationships: [
      {
        relationshipId: "rel:crew-build",
        fromId: "resource:crew",
        toId: "stream:build",
        kind: "supplies_capacity",
        knownToNexora: false,
        confirmedCausalForNexora: false,
      },
    ],
  });
}

export const NORTHSTAR_DEMAND_EVENT: RmsWorldEvent = Object.freeze({
  eventId: "evt:demand-125",
  type: "DEMAND_CHANGE",
  variableId: "var:demand",
  nextValue: 125,
});

export const NORTHSTAR_CAPACITY_EVENT: RmsWorldEvent = Object.freeze({
  eventId: "evt:capacity-85",
  type: "CAPACITY_CHANGE",
  variableId: "var:capacity",
  nextValue: 85,
});

export const WAREHOUSE_PROGRESS_EVENT: RmsWorldEvent = Object.freeze({
  eventId: "evt:progress-065",
  type: "WORK_PROGRESS",
  variableId: "var:actual",
  nextValue: 0.65,
});

function variable(
  variableId: string,
  key: string,
  value: number,
  unit: string,
  entityId: string,
): RmsWorldVariableLike {
  return {
    variableId,
    key,
    value,
    unit,
    tick: 0,
    simulatedAt: "2026-09-16T00:00:00.000Z",
    entityId,
    source: "rms:2-fixture",
    mutability: "MUTABLE",
    vaiRoleEngine: false,
  };
}

type RmsWorldVariableLike = {
  readonly variableId: string;
  readonly key: string;
  readonly value: number;
  readonly unit: string;
  readonly tick: number;
  readonly simulatedAt: string;
  readonly entityId: string;
  readonly source: string;
  readonly mutability: "MUTABLE";
  readonly vaiRoleEngine: false;
};
