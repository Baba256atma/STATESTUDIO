/**
 * DKL-9:1 — Data Knowledge Suite Lifecycle.
 *
 * Ordered suite lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by DKL-9:1.
 */

import type { DataKnowledgeSuiteLifecycleState } from "./dataKnowledgeSuiteFoundationTypes.ts";

export const DATA_KNOWLEDGE_SUITE_LIFECYCLE_STATES: readonly DataKnowledgeSuiteLifecycleState[] =
  Object.freeze([
    "Declared",
    "Composed",
    "Catalogued",
    "Boundaried",
    "Contracted",
    "ReadyForRegistry",
    "Registered",
    "Modeled",
    "Validated",
    "Manifested",
    "Platformed",
    "Certified",
    "Frozen",
    "Released",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Composed",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Composed: Object.freeze([
    "Catalogued",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Catalogued: Object.freeze([
    "Boundaried",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Boundaried: Object.freeze([
    "Contracted",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Contracted: Object.freeze([
    "ReadyForRegistry",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  ReadyForRegistry: Object.freeze([
    "Registered",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Registered: Object.freeze([
    "Modeled",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Modeled: Object.freeze([
    "Validated",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Validated: Object.freeze([
    "Manifested",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Manifested: Object.freeze([
    "Platformed",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Platformed: Object.freeze([
    "Certified",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Certified: Object.freeze([
    "Frozen",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Frozen: Object.freeze([
    "Released",
  ]) as readonly DataKnowledgeSuiteLifecycleState[],
  Released: Object.freeze(
    [] as const,
  ) as readonly DataKnowledgeSuiteLifecycleState[],
} as const);

/** Canonical immutable suite lifecycle declaration. */
export const DataKnowledgeSuiteLifecycle = Object.freeze({
  lifecycleId: "DKL-9:1/DataKnowledgeSuiteLifecycle",
  sourcePhase: "DKL-9:1" as const,
  states: DATA_KNOWLEDGE_SUITE_LIFECYCLE_STATES,
  stateCount: DATA_KNOWLEDGE_SUITE_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  currentState: "ReadyForRegistry" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
