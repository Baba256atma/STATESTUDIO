/**
 * DKL-8:1 — Knowledge Governance Lifecycle.
 *
 * Ordered lifecycle states and declarative transition map.
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by DKL-8:1.
 */

import type {
  KnowledgeGovernanceLifecycleState,
  KnowledgeLifecycleGovernance,
} from "./knowledgeGovernanceFoundationTypes.ts";

export const KNOWLEDGE_GOVERNANCE_LIFECYCLE_STATES: readonly KnowledgeGovernanceLifecycleState[] =
  Object.freeze([
    "Declared",
    "Classified",
    "Assigned",
    "Reviewed",
    "Approved",
    "Active",
    "Restricted",
    "ExceptionGranted",
    "Superseded",
    "Archived",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Classified",
    "Assigned",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Classified: Object.freeze([
    "Assigned",
    "Reviewed",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Assigned: Object.freeze([
    "Reviewed",
    "Approved",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Reviewed: Object.freeze([
    "Approved",
    "Restricted",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Approved: Object.freeze([
    "Active",
    "Restricted",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Active: Object.freeze([
    "Restricted",
    "ExceptionGranted",
    "Superseded",
    "Archived",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Restricted: Object.freeze([
    "Active",
    "ExceptionGranted",
    "Archived",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  ExceptionGranted: Object.freeze([
    "Active",
    "Restricted",
    "Reviewed",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Superseded: Object.freeze([
    "Archived",
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Archived: Object.freeze([
    "Retired",
  ]) as readonly KnowledgeGovernanceLifecycleState[],
  Retired: Object.freeze([]) as readonly KnowledgeGovernanceLifecycleState[],
}) as Readonly<
  Record<
    KnowledgeGovernanceLifecycleState,
    readonly KnowledgeGovernanceLifecycleState[]
  >
>;

const STATE_MEANINGS = Object.freeze({
  Declared: "Governance subject has been declared.",
  Classified: "Classification has been declared.",
  Assigned: "Ownership or stewardship has been assigned.",
  Reviewed: "Governance review has been recorded as intent.",
  Approved: "Governance approval intent has been recorded.",
  Active: "Governance state is active under declared policy.",
  Restricted: "Governance state is restricted.",
  ExceptionGranted: "An exception has been granted as declared metadata.",
  Superseded: "Governance state has been superseded.",
  Archived: "Governance subject is archived under disposition intent.",
  Retired: "Governance subject is retired.",
} as const);

/** Canonical immutable governance lifecycle. */
export const KnowledgeGovernanceLifecycle: KnowledgeLifecycleGovernance =
  Object.freeze({
    lifecycleId: "DKL-8:1/KnowledgeGovernanceLifecycle",
    states: KNOWLEDGE_GOVERNANCE_LIFECYCLE_STATES,
    transitions: TRANSITIONS,
    stateMeanings: STATE_MEANINGS,
    stateCount: KNOWLEDGE_GOVERNANCE_LIFECYCLE_STATES.length,
    declarativeOnly: true,
    runtimeStateMachine: false,
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
