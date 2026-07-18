/**
 * DKL-5:1 — Knowledge Validation Lifecycle.
 *
 * Ordered lifecycle states and a deeply frozen transition map.
 * Metadata only — no transition execution function.
 *
 * Ownership: owned exclusively by DKL-5:1.
 */

import type { ValidationLifecycleState } from "./knowledgeValidationFoundationTypes.ts";

export const KNOWLEDGE_VALIDATION_LIFECYCLE_STATES: readonly ValidationLifecycleState[] =
  Object.freeze([
    "Declared",
    "AwaitingEvaluation",
    "Evaluating",
    "EvidenceCollected",
    "FindingsProduced",
    "ResultDetermined",
    "Limited",
    "Blocked",
    "ReadyForConsumer",
    "Superseded",
    "Archived",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "AwaitingEvaluation",
    "Blocked",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  AwaitingEvaluation: Object.freeze([
    "Evaluating",
    "Blocked",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  Evaluating: Object.freeze([
    "EvidenceCollected",
    "Blocked",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  EvidenceCollected: Object.freeze([
    "FindingsProduced",
    "Blocked",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  FindingsProduced: Object.freeze([
    "ResultDetermined",
    "Blocked",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  ResultDetermined: Object.freeze([
    "Limited",
    "Blocked",
    "ReadyForConsumer",
    "Superseded",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  Limited: Object.freeze([
    "ReadyForConsumer",
    "Blocked",
    "Superseded",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  Blocked: Object.freeze([
    "AwaitingEvaluation",
    "Superseded",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  ReadyForConsumer: Object.freeze([
    "Superseded",
    "Archived",
  ]) as readonly ValidationLifecycleState[],
  Superseded: Object.freeze(["Archived"]) as readonly ValidationLifecycleState[],
  Archived: Object.freeze([]) as readonly ValidationLifecycleState[],
}) as Readonly<
  Record<ValidationLifecycleState, readonly ValidationLifecycleState[]>
>;

/** Canonical immutable Knowledge Validation lifecycle. */
export const KnowledgeValidationLifecycle = Object.freeze({
  lifecycleId: "DKL-5:1/KnowledgeValidationLifecycle",
  states: KNOWLEDGE_VALIDATION_LIFECYCLE_STATES,
  stateCount: KNOWLEDGE_VALIDATION_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  terminalStates: Object.freeze(["Archived"] as const),
  notes: Object.freeze({
    metadataOnly: true,
    transitionExecutionForbidden: true,
    validationExecutionForbidden: true,
    description:
      "Lifecycle transitions are declared as metadata; DKL-5:1 does not execute them.",
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
