/**
 * APP-4:10 — Executive Memory Lifecycle state transitions.
 */

import type { ExecutiveMemoryGovernanceState } from "./executiveMemoryLifecycleTypes.ts";

const ALLOWED_TRANSITIONS: Readonly<Record<ExecutiveMemoryGovernanceState, readonly ExecutiveMemoryGovernanceState[]>> =
  Object.freeze({
    draft: Object.freeze(["active"] as const),
    active: Object.freeze(["archived", "superseded", "merged", "split", "locked"] as const),
    archived: Object.freeze(["active"] as const),
    superseded: Object.freeze(["active"] as const),
    merged: Object.freeze([] as const),
    split: Object.freeze([] as const),
    locked: Object.freeze(["active"] as const),
  });

export function isExecutiveMemoryLifecycleTransitionAllowed(
  from: ExecutiveMemoryGovernanceState,
  to: ExecutiveMemoryGovernanceState
): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function listAllowedExecutiveMemoryLifecycleTransitions(
  from: ExecutiveMemoryGovernanceState
): readonly ExecutiveMemoryGovernanceState[] {
  return ALLOWED_TRANSITIONS[from];
}

export const ExecutiveMemoryLifecycleTransitions = Object.freeze({
  isExecutiveMemoryLifecycleTransitionAllowed,
  listAllowedExecutiveMemoryLifecycleTransitions,
});
