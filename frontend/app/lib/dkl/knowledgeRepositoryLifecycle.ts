/**
 * DKL-6:1 — Knowledge Repository Lifecycle.
 *
 * Ordered lifecycle states and a deeply frozen transition map.
 * Metadata only — no transition execution function.
 *
 * Ownership: owned exclusively by DKL-6:1.
 */

import type { RepositoryLifecycleState } from "./knowledgeRepositoryFoundationTypes.ts";

export const KNOWLEDGE_REPOSITORY_LIFECYCLE_STATES: readonly RepositoryLifecycleState[] =
  Object.freeze([
    "Created",
    "Validated",
    "Stored",
    "Versioned",
    "Retrieved",
    "Archived",
    "Frozen",
  ]);

const TRANSITIONS = Object.freeze({
  Created: Object.freeze([
    "Validated",
    "Archived",
  ]) as readonly RepositoryLifecycleState[],
  Validated: Object.freeze([
    "Stored",
    "Archived",
  ]) as readonly RepositoryLifecycleState[],
  Stored: Object.freeze([
    "Versioned",
    "Retrieved",
    "Archived",
    "Frozen",
  ]) as readonly RepositoryLifecycleState[],
  Versioned: Object.freeze([
    "Retrieved",
    "Archived",
    "Frozen",
  ]) as readonly RepositoryLifecycleState[],
  Retrieved: Object.freeze([
    "Versioned",
    "Archived",
    "Frozen",
  ]) as readonly RepositoryLifecycleState[],
  Archived: Object.freeze([
    "Frozen",
  ]) as readonly RepositoryLifecycleState[],
  Frozen: Object.freeze([]) as readonly RepositoryLifecycleState[],
});

/** Canonical immutable Knowledge Repository lifecycle metadata. */
export const KnowledgeRepositoryLifecycle = Object.freeze({
  lifecycleId: "DKL-6:1/KnowledgeRepositoryLifecycle",
  sourcePhase: "DKL-6:1" as const,
  states: KNOWLEDGE_REPOSITORY_LIFECYCLE_STATES,
  stateCount: KNOWLEDGE_REPOSITORY_LIFECYCLE_STATES.length,
  transitions: TRANSITIONS,
  notes: Object.freeze({
    metadataOnly: true,
    noTransitionExecution: true,
    noPersistence: true,
    terminalState: "Frozen" as const,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
