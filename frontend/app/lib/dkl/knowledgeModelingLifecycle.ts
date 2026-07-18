/**
 * DKL-4:1 — Knowledge Modeling Lifecycle.
 *
 * Ordered lifecycle states and a deeply frozen transition map.
 * Metadata only — no transition execution function.
 *
 * Ownership: owned exclusively by DKL-4:1.
 */

import type { KnowledgeModelingLifecycleState } from "./knowledgeModelingFoundationTypes.ts";

export const KNOWLEDGE_MODELING_LIFECYCLE_STATES: readonly KnowledgeModelingLifecycleState[] =
  Object.freeze([
    "Received",
    "Bound",
    "Structured",
    "Related",
    "Composed",
    "Referenced",
    "ModelReady",
    "Completed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]);

const TRANSITIONS = Object.freeze({
  Received: Object.freeze([
    "Bound",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Bound: Object.freeze([
    "Structured",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Structured: Object.freeze([
    "Related",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Related: Object.freeze([
    "Composed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Composed: Object.freeze([
    "Referenced",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Referenced: Object.freeze([
    "ModelReady",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  ModelReady: Object.freeze([
    "Completed",
    "Blocked",
    "Failed",
    "Cancelled",
  ]) as readonly KnowledgeModelingLifecycleState[],
  Completed: Object.freeze([]) as readonly KnowledgeModelingLifecycleState[],
  Blocked: Object.freeze(["Cancelled"]) as readonly KnowledgeModelingLifecycleState[],
  Failed: Object.freeze(["Cancelled"]) as readonly KnowledgeModelingLifecycleState[],
  Cancelled: Object.freeze([]) as readonly KnowledgeModelingLifecycleState[],
}) as Readonly<
  Record<KnowledgeModelingLifecycleState, readonly KnowledgeModelingLifecycleState[]>
>;

/** Canonical immutable Knowledge Modeling lifecycle. */
export const KnowledgeModelingLifecycle = Object.freeze({
  lifecycleId: "DKL-4:1/KnowledgeModelingLifecycle",
  states: KNOWLEDGE_MODELING_LIFECYCLE_STATES,
  stateCount: KNOWLEDGE_MODELING_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  terminalStates: Object.freeze(["Completed", "Cancelled"] as const),
  notes: Object.freeze({
    metadataOnly: true,
    transitionExecutionForbidden: true,
    algorithmsForbidden: true,
    description:
      "Lifecycle transitions are declared as metadata; DKL-4:1 does not execute them.",
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
