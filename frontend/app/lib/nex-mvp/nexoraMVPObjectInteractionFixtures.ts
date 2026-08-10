/**
 * NEX-MVP:4 — Object interaction context fixtures.
 *
 * Replaceable Stage-development context (Problems / Scenarios / Decisions /
 * Execution) linked to NexoraObjects. Not canonical business logic.
 */

export type NexoraMVPContextSubjectKind =
  | "problem"
  | "scenario"
  | "decision"
  | "execution";

export type NexoraMVPContextSubjectFixture = {
  readonly id: string;
  readonly label: string;
  readonly kind: NexoraMVPContextSubjectKind;
  readonly status: "stable" | "watch" | "risk";
  readonly attention: "normal" | "elevated" | "important" | "critical";
};

export type NexoraMVPContextLinkFixture = {
  readonly id: string;
  readonly objectId: string;
  readonly contextId: string;
  readonly relation: string;
};

export const NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES = Object.freeze([
  Object.freeze({
    id: "ctx-problem-margin",
    label: "Margin Pressure",
    kind: "problem",
    status: "risk",
    attention: "critical",
  }),
  Object.freeze({
    id: "ctx-problem-capacity",
    label: "Capacity Gap",
    kind: "problem",
    status: "watch",
    attention: "important",
  }),
  Object.freeze({
    id: "ctx-scenario-pricing",
    label: "Pricing Response",
    kind: "scenario",
    status: "watch",
    attention: "elevated",
  }),
  Object.freeze({
    id: "ctx-scenario-demand",
    label: "Demand Surge",
    kind: "scenario",
    status: "stable",
    attention: "elevated",
  }),
  Object.freeze({
    id: "ctx-scenario-capacity",
    label: "Capacity Expansion Plan",
    kind: "scenario",
    status: "watch",
    attention: "important",
  }),
  Object.freeze({
    id: "ctx-decision-reprice",
    label: "Approve Repricing",
    kind: "decision",
    status: "watch",
    attention: "important",
  }),
  Object.freeze({
    id: "ctx-decision-capacity",
    label: "Expand Capacity",
    kind: "decision",
    status: "stable",
    attention: "elevated",
  }),
  Object.freeze({
    id: "ctx-execution-rollout",
    label: "Pricing Rollout",
    kind: "execution",
    status: "stable",
    attention: "normal",
  }),
  Object.freeze({
    id: "ctx-execution-capacity",
    label: "Capacity Expansion",
    kind: "execution",
    status: "stable",
    attention: "elevated",
  }),
] as const satisfies readonly NexoraMVPContextSubjectFixture[]);

/**
 * Object → contextual subject links (depth-1 only).
 * Sparse: not every object has every subject kind.
 */
export const NEXORA_MVP_CONTEXT_LINK_FIXTURES = Object.freeze([
  Object.freeze({
    id: "link-revenue-margin",
    objectId: "obj-revenue",
    contextId: "ctx-problem-margin",
    relation: "affected-by",
  }),
  Object.freeze({
    id: "link-revenue-pricing",
    objectId: "obj-revenue",
    contextId: "ctx-scenario-pricing",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "link-revenue-demand",
    objectId: "obj-revenue",
    contextId: "ctx-scenario-demand",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "link-revenue-reprice",
    objectId: "obj-revenue",
    contextId: "ctx-decision-reprice",
    relation: "acts-on",
  }),
  Object.freeze({
    id: "link-capacity-gap",
    objectId: "obj-capacity",
    contextId: "ctx-problem-capacity",
    relation: "constrained-by",
  }),
  Object.freeze({
    id: "link-capacity-expand",
    objectId: "obj-capacity",
    contextId: "ctx-decision-capacity",
    relation: "acts-on",
  }),
  Object.freeze({
    id: "link-capacity-scenario",
    objectId: "obj-capacity",
    contextId: "ctx-scenario-capacity",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "link-capacity-execution",
    objectId: "obj-capacity",
    contextId: "ctx-execution-capacity",
    relation: "implements",
  }),
  Object.freeze({
    id: "link-delivery-capacity-gap",
    objectId: "obj-delivery",
    contextId: "ctx-problem-capacity",
    relation: "affected-by",
  }),
  Object.freeze({
    id: "link-delivery-demand",
    objectId: "obj-delivery",
    contextId: "ctx-scenario-demand",
    relation: "explored-by",
  }),
  Object.freeze({
    id: "link-risk-margin",
    objectId: "obj-risk",
    contextId: "ctx-problem-margin",
    relation: "associated-with",
  }),
  Object.freeze({
    id: "link-reprice-rollout",
    objectId: "obj-revenue",
    contextId: "ctx-execution-rollout",
    relation: "implements",
  }),
] as const satisfies readonly NexoraMVPContextLinkFixture[]);

export function getNexoraMVPContextSubjectFixtures(): readonly NexoraMVPContextSubjectFixture[] {
  return NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES;
}

export function getNexoraMVPContextLinkFixtures(): readonly NexoraMVPContextLinkFixture[] {
  return NEXORA_MVP_CONTEXT_LINK_FIXTURES;
}
