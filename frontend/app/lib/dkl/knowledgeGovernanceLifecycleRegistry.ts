/**
 * DKL-8:2 — Knowledge Governance Lifecycle Registry.
 *
 * Registers all 11 ordered lifecycle states and declarative transitions
 * from DKL-8:1. No executable transition engine.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

import { KnowledgeGovernanceFoundationPlatform } from "./knowledgeGovernanceFoundation.ts";
import type {
  KnowledgeGovernanceLifecycleStateRegistration,
  KnowledgeGovernanceLifecycleTransitionRegistration,
} from "./knowledgeGovernanceRegistryTypes.ts";

const lifecycle = KnowledgeGovernanceFoundationPlatform.lifecycle;

/** Eleven ordered lifecycle state registrations. */
export const KnowledgeGovernanceLifecycleStateRegistry: readonly KnowledgeGovernanceLifecycleStateRegistration[] =
  Object.freeze(
    lifecycle.states.map((state, index) =>
      Object.freeze({
        id: `DKL-8:2/LifecycleState/${state}`,
        name: state,
        description: lifecycle.stateMeanings[state],
        category: "lifecycleState" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        state,
        ordinal: index + 1,
        isInitial: state === "Declared",
        isTerminal: state === "Retired",
      }),
    ),
  );

const transitionEntries: KnowledgeGovernanceLifecycleTransitionRegistration[] =
  [];

let transitionOrder = 1;
for (const fromState of lifecycle.states) {
  for (const toState of lifecycle.transitions[fromState]) {
    transitionEntries.push(
      Object.freeze({
        id: `DKL-8:2/LifecycleTransition/${fromState}->${toState}`,
        name: `${fromState}->${toState}`,
        description: `Declarative transition from ${fromState} to ${toState}.`,
        category: "lifecycleTransition" as const,
        status: "Registered" as const,
        owner: "DKL-8" as const,
        sourcePhase: "DKL-8:1" as const,
        version: "1.0.0" as const,
        stability: "FoundationAligned" as const,
        public: true as const,
        deprecated: false as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: transitionOrder,
        fromState,
        toState,
        executable: false as const,
      }),
    );
    transitionOrder += 1;
  }
}

/** Declarative lifecycle transition registrations from Foundation. */
export const KnowledgeGovernanceLifecycleTransitionRegistry: readonly KnowledgeGovernanceLifecycleTransitionRegistration[] =
  Object.freeze(transitionEntries);

export const KnowledgeGovernanceLifecycleRegistry = Object.freeze({
  registryId: "DKL-8:2/LifecycleRegistry",
  states: KnowledgeGovernanceLifecycleStateRegistry,
  transitions: KnowledgeGovernanceLifecycleTransitionRegistry,
  stateCount: KnowledgeGovernanceLifecycleStateRegistry.length,
  transitionCount: KnowledgeGovernanceLifecycleTransitionRegistry.length,
  initialStateId: "DKL-8:2/LifecycleState/Declared",
  terminalStateId: "DKL-8:2/LifecycleState/Retired",
  declarativeOnly: true as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});
