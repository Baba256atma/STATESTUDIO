/**
 * NPA-T RMS:7 — reusable world templates. Simulation shape only; NMI owns management meaning.
 */

import { instantiateRmsGroundTruth } from "./rmsWorldEngine.ts";
import { createNorthstarManufacturingWorld, createWarehouseExpansionWorld } from "./rmsWorldFixtures.ts";
import type { RmsStructuredGroundTruth, RmsWorldKind } from "./rmsWorldContract.ts";

export const RMS_WORLD_TEMPLATE_IDS = Object.freeze([
  "manufacturing-operations",
  "project-delivery",
  "logistics-delivery",
  "service-operations",
  "hybrid-reserved",
] as const);

export function instantiateManufacturingTemplate(): RmsStructuredGroundTruth {
  return createNorthstarManufacturingWorld();
}

export function instantiateProjectDeliveryTemplate(): RmsStructuredGroundTruth {
  return createWarehouseExpansionWorld();
}

export function instantiateLogisticsTemplate(): RmsStructuredGroundTruth {
  return instantiateRmsGroundTruth({
    worldId: "world:logistics",
    worldKind: "BUSINESS",
    nmiContextKind: "BUSINESS",
    label: "Harbor Logistics",
    entities: [
      { entityId: "org:harbor", kind: "ORGANIZATION", label: "Harbor Logistics" },
      { entityId: "inv:buffer", kind: "INVENTORY", label: "Outbound buffer" },
      { entityId: "unit:delivery", kind: "OPERATING_UNIT", label: "Delivery" },
    ],
    variables: [
      { variableId: "var:demand", key: "demand", value: 100, unit: "orders/day", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "unit:delivery", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
      { variableId: "var:inventory", key: "inventory", value: 420, unit: "units", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "inv:buffer", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
      { variableId: "var:capacity", key: "availableCapacity", value: 110, unit: "orders/day", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "unit:delivery", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
    ],
    relationships: [
      { relationshipId: "rel:buffer-delivery", fromId: "inv:buffer", toId: "unit:delivery", kind: "supports", knownToNexora: false, confirmedCausalForNexora: false },
    ],
  });
}

export function instantiateServiceTemplate(): RmsStructuredGroundTruth {
  return instantiateRmsGroundTruth({
    worldId: "world:service",
    worldKind: "BUSINESS",
    nmiContextKind: "BUSINESS",
    label: "Northline Service Desk",
    entities: [
      { entityId: "org:northline", kind: "ORGANIZATION", label: "Northline Service" },
      { entityId: "resource:crew", kind: "RESOURCE", label: "Service staff" },
    ],
    variables: [
      { variableId: "var:demand", key: "demand", value: 100, unit: "tickets/day", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "org:northline", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
      { variableId: "var:crew", key: "staffAvailable", value: 12, unit: "people", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "resource:crew", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
      { variableId: "var:actual", key: "projectProgress", value: 0.9, unit: "ratio", tick: 0, simulatedAt: "2026-09-16T00:00:00.000Z", entityId: "org:northline", source: "rms:7-template", mutability: "MUTABLE", vaiRoleEngine: false },
    ],
    relationships: [
      { relationshipId: "rel:staff-service", fromId: "resource:crew", toId: "org:northline", kind: "supplies_capacity", knownToNexora: false, confirmedCausalForNexora: false },
    ],
  });
}

export function instantiateHybridTemplate(): RmsStructuredGroundTruth {
  const world = createNorthstarManufacturingWorld();
  return instantiateRmsGroundTruth({
    worldId: "world:hybrid-reserved",
    worldKind: "HYBRID",
    nmiContextKind: "HYBRID",
    label: "Reserved Hybrid",
    entities: world.entities,
    variables: world.variables,
    relationships: world.relationships,
  });
}

export function worldKindForTemplate(templateId: string): RmsWorldKind {
  if (templateId === "project-delivery") return "PROJECT";
  if (templateId === "hybrid-reserved") return "HYBRID";
  return "BUSINESS";
}
