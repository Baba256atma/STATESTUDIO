/**
 * NPA-T RMS:2 — executable Business/Project Ground Truth schema.
 * Simulated world state only. Not NMI, VAI, Data Reality, or Nexora Evidence.
 */

import type { BusinessProjectContextKind } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";
import type { RmsClock } from "./rmsSimulationState.ts";

export type RmsWorldFact = {
  readonly factId: string;
  readonly key: string;
  readonly value: string | number | boolean;
};

export const rmsGroundTruthWorldIdentity = "NPA-T RMS:2/BusinessProjectGroundTruth" as const;

export const RMS_WORLD_KINDS = Object.freeze(["BUSINESS", "PROJECT", "HYBRID"] as const);
export type RmsWorldKind = (typeof RMS_WORLD_KINDS)[number];

export const RMS_ENTITY_KINDS = Object.freeze([
  "ORGANIZATION",
  "PROJECT",
  "OPERATING_UNIT",
  "PROCESS",
  "WORKSTREAM",
  "RESOURCE",
  "PERSON_CAPACITY",
  "ASSET",
  "PRODUCT",
  "DELIVERABLE",
  "SUPPLIER",
  "CUSTOMER",
  "STAKEHOLDER",
  "INVENTORY",
] as const);
export type RmsEntityKind = (typeof RMS_ENTITY_KINDS)[number];

export const RMS_WORLD_RELATION_KINDS = Object.freeze([
  "supplies_capacity",
  "supplies_material",
  "produces",
  "supports",
  "depends_on",
] as const);
export type RmsWorldRelationKind = (typeof RMS_WORLD_RELATION_KINDS)[number];

export const RMS_WORLD_EVENT_TYPES = Object.freeze([
  "DEMAND_CHANGE",
  "CAPACITY_CHANGE",
  "RESOURCE_CHANGE",
  "ASSET_STATE_CHANGE",
  "INVENTORY_CHANGE",
  "COST_CHANGE",
  "SCHEDULE_CHANGE",
  "WORK_PROGRESS",
] as const);
export type RmsWorldEventType = (typeof RMS_WORLD_EVENT_TYPES)[number];

export const RMS_VALUE_MUTABILITY = Object.freeze(["MUTABLE", "LOCKED"] as const);
export type RmsValueMutability = (typeof RMS_VALUE_MUTABILITY)[number];

export type RmsWorldEntity = {
  readonly entityId: string;
  readonly kind: RmsEntityKind;
  readonly label: string;
};

export type RmsWorldVariable = {
  readonly variableId: string;
  readonly key: string;
  readonly value: string | number | boolean;
  readonly unit: string | null;
  readonly tick: number;
  readonly simulatedAt: string;
  readonly entityId: string;
  readonly source: string;
  readonly mutability: RmsValueMutability;
  readonly vaiRoleEngine: false;
};

export type RmsWorldRelationship = {
  readonly relationshipId: string;
  readonly fromId: string;
  readonly toId: string;
  readonly kind: RmsWorldRelationKind;
  readonly knownToNexora: false;
  readonly confirmedCausalForNexora: false;
};

export type RmsWorldEvent = {
  readonly eventId: string;
  readonly type: RmsWorldEventType;
  readonly variableId: string;
  readonly nextValue?: string | number | boolean;
  readonly delta?: number;
  readonly note?: string;
};

export type RmsWorldHistoryEntry = {
  readonly historyId: string;
  readonly tick: number;
  readonly simulatedAt: string;
  readonly eventId: string;
  readonly eventType: RmsWorldEventType;
  readonly entityId: string;
  readonly variableId: string;
  readonly beforeValue: string | number | boolean;
  readonly afterValue: string | number | boolean;
  readonly nexoraEvidence: false;
};

export const RMS_2_BOUNDARY = Object.freeze({
  identity: rmsGroundTruthWorldIdentity,
  ownsInstantiatedWorldState: true as const,
  ownsSimulationClock: true as const,
  ownsGroundTruthTransitions: true as const,
  ownsGroundTruthEvents: true as const,
  ownsGroundTruthHistory: true as const,
  ownsNmiSemantics: false as const,
  ownsVaiRoles: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsManagerObject: false as const,
  ownsDataReality: false as const,
  ownsCsvSemantics: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  ownsNexoraConversation: false as const,
  publishesGroundTruthToObservableData: false as const,
  publishesGroundTruthToNexora: false as const,
  d7IsGroundTruth: false as const,
  startsRms3: false as const,
  nmiContextKindReuse: "BCA:1 / NMI:1" as const,
});

export type RmsStructuredGroundTruth = {
  readonly identity: typeof rmsGroundTruthWorldIdentity;
  readonly worldId: string;
  readonly worldKind: RmsWorldKind;
  readonly nmiContextKind: BusinessProjectContextKind;
  readonly nmiStructureAuthority: "NMI:1";
  readonly label: string;
  readonly clock: RmsClock;
  readonly paused: boolean;
  readonly entities: readonly RmsWorldEntity[];
  readonly variables: readonly RmsWorldVariable[];
  readonly relationships: readonly RmsWorldRelationship[];
  readonly history: readonly RmsWorldHistoryEntry[];
  readonly facts: readonly RmsWorldFact[];
  readonly publishedToObservableData: false;
  readonly publishedToNexoraKnowledge: false;
  readonly vaiRoleEngine: false;
};
