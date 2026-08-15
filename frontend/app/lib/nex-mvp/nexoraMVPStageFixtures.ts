/**
 * NEX-MVP:3 — Stage development fixtures.
 *
 * Local, replaceable sample objects/relationships for Stage rendering.
 * Not canonical business logic.
 */

export type NexoraMVPStageObjectFixture = {
  readonly id: string;
  readonly label: string;
  readonly kind: "object";
  readonly position: readonly [number, number, number];
  /** Includes unresolved so missing runtime truth never falls back to healthy. */
  readonly status: "stable" | "watch" | "risk" | "unresolved";
  readonly attention: "normal" | "elevated" | "important" | "critical";
};

export type NexoraMVPStageRelationshipFixture = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
};

/** ~8 executive entities — enough for spatial presence without chaos. */
export const NEXORA_MVP_STAGE_OBJECT_FIXTURES = Object.freeze([
  Object.freeze({
    id: "obj-revenue",
    label: "Revenue",
    kind: "object" as const,
    position: [-2.4, 0.35, -0.6] as const,
    status: "stable" as const,
    attention: "elevated" as const,
  }),
  Object.freeze({
    id: "obj-capacity",
    label: "Capacity",
    kind: "object" as const,
    position: [-0.9, 0.2, 1.1] as const,
    status: "watch" as const,
    attention: "important" as const,
  }),
  Object.freeze({
    id: "obj-budget",
    label: "Budget",
    kind: "object" as const,
    position: [-2.1, -0.15, 1.4] as const,
    status: "stable" as const,
    attention: "normal" as const,
  }),
  Object.freeze({
    id: "obj-customer",
    label: "Customer",
    kind: "object" as const,
    position: [1.8, 0.25, -1.0] as const,
    status: "stable" as const,
    attention: "elevated" as const,
  }),
  Object.freeze({
    id: "obj-delivery",
    label: "Delivery",
    kind: "object" as const,
    position: [0.85, 0.1, 0.85] as const,
    status: "watch" as const,
    attention: "important" as const,
  }),
  Object.freeze({
    id: "obj-risk",
    label: "Risk",
    kind: "object" as const,
    position: [2.2, -0.05, 1.25] as const,
    status: "risk" as const,
    attention: "critical" as const,
  }),
  Object.freeze({
    id: "obj-inventory",
    label: "Inventory",
    kind: "object" as const,
    position: [-0.2, -0.25, -1.55] as const,
    status: "stable" as const,
    attention: "normal" as const,
  }),
  Object.freeze({
    id: "obj-demand",
    label: "Demand",
    kind: "object" as const,
    position: [0.35, 0.45, -0.15] as const,
    status: "watch" as const,
    attention: "elevated" as const,
  }),
]) satisfies readonly NexoraMVPStageObjectFixture[];

export const NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES = Object.freeze([
  Object.freeze({
    id: "rel-budget-capacity",
    sourceId: "obj-budget",
    targetId: "obj-capacity",
  }),
  Object.freeze({
    id: "rel-capacity-delivery",
    sourceId: "obj-capacity",
    targetId: "obj-delivery",
  }),
  Object.freeze({
    id: "rel-delivery-customer",
    sourceId: "obj-delivery",
    targetId: "obj-customer",
  }),
  Object.freeze({
    id: "rel-customer-revenue",
    sourceId: "obj-customer",
    targetId: "obj-revenue",
  }),
  Object.freeze({
    id: "rel-risk-delivery",
    sourceId: "obj-risk",
    targetId: "obj-delivery",
  }),
  Object.freeze({
    id: "rel-inventory-capacity",
    sourceId: "obj-inventory",
    targetId: "obj-capacity",
  }),
  Object.freeze({
    id: "rel-demand-delivery",
    sourceId: "obj-demand",
    targetId: "obj-delivery",
  }),
  Object.freeze({
    id: "rel-demand-revenue",
    sourceId: "obj-demand",
    targetId: "obj-revenue",
  }),
] as const satisfies readonly NexoraMVPStageRelationshipFixture[]);

export function getNexoraMVPStageObjectFixtures(): readonly NexoraMVPStageObjectFixture[] {
  return NEXORA_MVP_STAGE_OBJECT_FIXTURES;
}

export function getNexoraMVPStageRelationshipFixtures(): readonly NexoraMVPStageRelationshipFixture[] {
  return NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES;
}
