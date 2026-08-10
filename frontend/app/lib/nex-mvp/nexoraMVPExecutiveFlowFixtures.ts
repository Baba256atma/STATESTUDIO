/**
 * NEX-MVP:8 — Executive flow fixtures (development / demo-ready).
 *
 * Typed, replaceable composition data for Object → Problem → Scenario →
 * Decision → Execution → Timeline/Journal. Not a domain workflow engine.
 * Runtime/domain results should replace these later.
 */

export type NexoraMVPFlowDecisionStatus =
  | "draft"
  | "under-review"
  | "approved"
  | "rejected"
  | "archived"
  | "locked";

export type NexoraMVPFlowExecutionStatus =
  | "planned"
  | "in-progress"
  | "paused"
  | "blocked"
  | "complete"
  | "cancelled";

export type NexoraMVPFlowExecutionHealth =
  | "on-track"
  | "at-risk"
  | "blocked"
  | "complete";

export type NexoraMVPFlowEdgeFixture = {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly relation:
    | "affects"
    | "explored-by"
    | "sources"
    | "implements"
    | "associated-with";
};

export type NexoraMVPFlowTimelineEventFixture = {
  readonly id: string;
  readonly kind:
    | "problem-identified"
    | "scenario-reviewed"
    | "decision-created"
    | "decision-approved"
    | "decision-rejected"
    | "execution-started"
    | "execution-changed"
    | "execution-completed";
  readonly subjectId: string;
  readonly label: string;
  readonly occurredAt: string;
  readonly objectId?: string;
  readonly risk: "warning" | "risk" | "success";
};

export type NexoraMVPFlowJournalPackFixture = {
  readonly id: string;
  readonly packKind: "problem" | "scenario" | "decision" | "execution";
  readonly title: string;
  readonly subjectId: string;
  readonly summary: string;
  readonly occurredAt: string;
  readonly relatedObjectIds: readonly string[];
  readonly timelineEventId: string;
};

export type NexoraMVPFlowDecisionRecord = {
  readonly id: string;
  readonly status: NexoraMVPFlowDecisionStatus;
  readonly sourceScenarioId: string | null;
  readonly sourceProblemId: string | null;
  readonly objectId: string | null;
  readonly label: string;
};

export type NexoraMVPFlowExecutionRecord = {
  readonly id: string;
  readonly status: NexoraMVPFlowExecutionStatus;
  readonly health: NexoraMVPFlowExecutionHealth;
  readonly progress: string;
  readonly sourceDecisionId: string | null;
  readonly objectId: string | null;
  readonly label: string;
  readonly blocker?: string;
};

/**
 * Directed flow edges between subjects (object or context).
 * Incomplete chains are valid; multiple outgoing edges are valid.
 */
export const NEXORA_MVP_FLOW_EDGE_FIXTURES = Object.freeze([
  // Revenue executive journey (primary demo chain)
  Object.freeze({
    id: "flow-rev-margin",
    fromId: "obj-revenue",
    toId: "ctx-problem-margin",
    relation: "affects",
  }),
  Object.freeze({
    id: "flow-margin-pricing",
    fromId: "ctx-problem-margin",
    toId: "ctx-scenario-pricing",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "flow-margin-demand",
    fromId: "ctx-problem-margin",
    toId: "ctx-scenario-demand",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "flow-pricing-reprice",
    fromId: "ctx-scenario-pricing",
    toId: "ctx-decision-reprice",
    relation: "sources",
  }),
  Object.freeze({
    id: "flow-reprice-rollout",
    fromId: "ctx-decision-reprice",
    toId: "ctx-execution-rollout",
    relation: "implements",
  }),
  // Capacity journey (partial + capacity scenario/execution)
  Object.freeze({
    id: "flow-cap-gap",
    fromId: "obj-capacity",
    toId: "ctx-problem-capacity",
    relation: "affects",
  }),
  Object.freeze({
    id: "flow-gap-expand-scn",
    fromId: "ctx-problem-capacity",
    toId: "ctx-scenario-capacity",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "flow-expand-scn-dec",
    fromId: "ctx-scenario-capacity",
    toId: "ctx-decision-capacity",
    relation: "sources",
  }),
  Object.freeze({
    id: "flow-expand-dec-exec",
    fromId: "ctx-decision-capacity",
    toId: "ctx-execution-capacity",
    relation: "implements",
  }),
  Object.freeze({
    id: "flow-delivery-gap",
    fromId: "obj-delivery",
    toId: "ctx-problem-capacity",
    relation: "affects",
  }),
] as const satisfies readonly NexoraMVPFlowEdgeFixture[]);

/** Seed timeline events already recorded before the session. */
export const NEXORA_MVP_FLOW_TIMELINE_SEED = Object.freeze([
  Object.freeze({
    id: "tl-margin-identified",
    kind: "problem-identified",
    subjectId: "ctx-problem-margin",
    label: "Margin Pressure identified",
    occurredAt: "2026-08-01T10:00:00.000Z",
    objectId: "obj-revenue",
    risk: "risk",
  }),
  Object.freeze({
    id: "tl-pricing-reviewed",
    kind: "scenario-reviewed",
    subjectId: "ctx-scenario-pricing",
    label: "Pricing Response reviewed",
    occurredAt: "2026-08-03T14:00:00.000Z",
    objectId: "obj-revenue",
    risk: "warning",
  }),
  Object.freeze({
    id: "tl-reprice-created",
    kind: "decision-created",
    subjectId: "ctx-decision-reprice",
    label: "Approve Repricing created",
    occurredAt: "2026-08-05T09:00:00.000Z",
    objectId: "obj-revenue",
    risk: "warning",
  }),
  Object.freeze({
    id: "tl-capacity-gap",
    kind: "problem-identified",
    subjectId: "ctx-problem-capacity",
    label: "Capacity Gap identified",
    occurredAt: "2026-08-02T11:00:00.000Z",
    objectId: "obj-capacity",
    risk: "warning",
  }),
] as const satisfies readonly NexoraMVPFlowTimelineEventFixture[]);

export const NEXORA_MVP_FLOW_JOURNAL_SEED = Object.freeze([
  Object.freeze({
    id: "pack-problem-margin",
    packKind: "problem",
    title: "Margin Pressure",
    subjectId: "ctx-problem-margin",
    summary: "Critical margin pressure affecting Revenue.",
    occurredAt: "2026-08-01T10:00:00.000Z",
    relatedObjectIds: Object.freeze(["obj-revenue", "obj-risk"]),
    timelineEventId: "tl-margin-identified",
  }),
  Object.freeze({
    id: "pack-scenario-pricing",
    packKind: "scenario",
    title: "Pricing Response",
    subjectId: "ctx-scenario-pricing",
    summary: "Scenario reviewed for margin recovery under capacity constraint.",
    occurredAt: "2026-08-03T14:00:00.000Z",
    relatedObjectIds: Object.freeze(["obj-revenue"]),
    timelineEventId: "tl-pricing-reviewed",
  }),
  Object.freeze({
    id: "pack-decision-reprice",
    packKind: "decision",
    title: "Approve Repricing",
    subjectId: "ctx-decision-reprice",
    summary: "Decision created from Pricing Response; under review.",
    occurredAt: "2026-08-05T09:00:00.000Z",
    relatedObjectIds: Object.freeze(["obj-revenue"]),
    timelineEventId: "tl-reprice-created",
  }),
  Object.freeze({
    id: "pack-problem-capacity",
    packKind: "problem",
    title: "Capacity Gap",
    subjectId: "ctx-problem-capacity",
    summary: "Capacity constrains Delivery; expansion under consideration.",
    occurredAt: "2026-08-02T11:00:00.000Z",
    relatedObjectIds: Object.freeze(["obj-capacity", "obj-delivery"]),
    timelineEventId: "tl-capacity-gap",
  }),
] as const satisfies readonly NexoraMVPFlowJournalPackFixture[]);

export function createInitialNexoraMVPFlowDecisionRecords(): readonly NexoraMVPFlowDecisionRecord[] {
  return Object.freeze([
    Object.freeze({
      id: "ctx-decision-reprice",
      status: "under-review" as const,
      sourceScenarioId: "ctx-scenario-pricing",
      sourceProblemId: "ctx-problem-margin",
      objectId: "obj-revenue",
      label: "Approve Repricing",
    }),
    Object.freeze({
      id: "ctx-decision-capacity",
      status: "under-review" as const,
      sourceScenarioId: "ctx-scenario-capacity",
      sourceProblemId: "ctx-problem-capacity",
      objectId: "obj-capacity",
      label: "Expand Capacity",
    }),
  ]);
}

export function createInitialNexoraMVPFlowExecutionRecords(): readonly NexoraMVPFlowExecutionRecord[] {
  return Object.freeze([
    Object.freeze({
      id: "ctx-execution-rollout",
      status: "in-progress" as const,
      health: "at-risk" as const,
      progress: "62%",
      sourceDecisionId: "ctx-decision-reprice",
      objectId: "obj-revenue",
      label: "Pricing Rollout",
      blocker: "Capacity utilization above target band",
    }),
    Object.freeze({
      id: "ctx-execution-capacity",
      status: "planned" as const,
      health: "on-track" as const,
      progress: "0%",
      sourceDecisionId: "ctx-decision-capacity",
      objectId: "obj-capacity",
      label: "Capacity Expansion",
    }),
  ]);
}

export function getNexoraMVPFlowEdgeFixtures(): readonly NexoraMVPFlowEdgeFixture[] {
  return NEXORA_MVP_FLOW_EDGE_FIXTURES;
}
