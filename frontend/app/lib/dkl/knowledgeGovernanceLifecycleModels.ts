/**
 * DKL-8:3 — Knowledge Governance Lifecycle Models.
 *
 * Lifecycle state and transition record structural definitions.
 * References registered states and transitions only. No state machine.
 *
 * Ownership: owned exclusively by DKL-8:3.
 */

import { KnowledgeGovernanceRegistryPlatform } from "./knowledgeGovernanceRegistry.ts";
import type { KnowledgeGovernanceModelKindDescriptor } from "./knowledgeGovernanceModelTypes.ts";

const registry = KnowledgeGovernanceRegistryPlatform;

const descriptor = (
  modelKind: KnowledgeGovernanceModelKindDescriptor["modelKind"],
  description: string,
  fields: readonly string[],
  order: number,
): KnowledgeGovernanceModelKindDescriptor =>
  Object.freeze({
    modelKindId: `DKL-8:3/ModelKind/${modelKind}`,
    modelKind,
    description,
    fields: Object.freeze([...fields]),
    sourcePhase: "DKL-8:3" as const,
    registryAligned: true as const,
    runtimeBehavior: "None" as const,
    generatesFindings: false as const,
    evaluatesGovernance: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Lifecycle model kind descriptors. */
export const KnowledgeGovernanceLifecycleModelKinds: readonly KnowledgeGovernanceModelKindDescriptor[] =
  Object.freeze([
    descriptor(
      "GovernanceLifecycleState",
      "Declared current governance lifecycle state referencing one registered state.",
      Object.freeze([
        "currentState",
        "previousStateReference",
        "transitionReference",
        "reason",
        "evidenceReferences",
        "decisionReferences",
        "status",
      ]),
      16,
    ),
    descriptor(
      "GovernanceLifecycleTransitionRecord",
      "Declarative transition record referencing one registered transition.",
      Object.freeze([
        "transitionId",
        "fromState",
        "toState",
        "transitionReference",
        "reason",
        "actorRoleReference",
        "evidenceReferences",
        "decisionReferences",
        "status",
      ]),
      17,
    ),
  ]);

/** Registry lifecycle anchors — 11 states and 31 transitions. */
export const KnowledgeGovernanceLifecycleRegistryAnchors = Object.freeze({
  lifecycleStateIds: Object.freeze(
    registry.lifecycleStates.map((item) => item.id),
  ),
  lifecycleTransitionIds: Object.freeze(
    registry.lifecycleTransitions.map((item) => item.id),
  ),
  lifecycleStateCount: registry.lifecycleStates.length,
  lifecycleTransitionCount: registry.lifecycleTransitions.length,
  initialStateId: registry.lifecycle.initialStateId,
  terminalStateId: registry.lifecycle.terminalStateId,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  generatesTimestamps: false as const,
  mutatesState: false as const,
  metadataOnly: true as const,
});
