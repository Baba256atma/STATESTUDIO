/**
 * APP-3:2 — Executive Intent lifecycle transition matrix.
 * Deterministic transition validation — metadata only, no execution.
 */

import type { IntentLifecycleStage } from "./executiveIntentTypes.ts";

export const EXECUTIVE_INTENT_LIFECYCLE_MATRIX_VERSION = "APP-3/2" as const;

export type IntentLifecycleTransitionValidation = Readonly<{
  from: IntentLifecycleStage;
  to: IntentLifecycleStage;
  allowed: boolean;
  reason: string;
  readOnly: true;
}>;

export const EXECUTIVE_INTENT_ALLOWED_LIFECYCLE_TRANSITIONS = Object.freeze([
  Object.freeze({ from: "created", to: "validated" }),
  Object.freeze({ from: "validated", to: "approved" }),
  Object.freeze({ from: "approved", to: "activated" }),
  Object.freeze({ from: "activated", to: "updated" }),
  Object.freeze({ from: "updated", to: "completed" }),
  Object.freeze({ from: "completed", to: "archived" }),
  Object.freeze({ from: "validated", to: "created" }),
  Object.freeze({ from: "approved", to: "validated" }),
  Object.freeze({ from: "activated", to: "approved" }),
  Object.freeze({ from: "updated", to: "activated" }),
] as const satisfies readonly Readonly<{ from: IntentLifecycleStage; to: IntentLifecycleStage }>[]);

export const EXECUTIVE_INTENT_FORBIDDEN_LIFECYCLE_TRANSITIONS = Object.freeze([
  Object.freeze({ from: "created", to: "approved" }),
  Object.freeze({ from: "created", to: "activated" }),
  Object.freeze({ from: "validated", to: "activated" }),
  Object.freeze({ from: "completed", to: "activated" }),
  Object.freeze({ from: "archived", to: "activated" }),
  Object.freeze({ from: "archived", to: "approved" }),
  Object.freeze({ from: "archived", to: "created" }),
] as const satisfies readonly Readonly<{ from: IntentLifecycleStage; to: IntentLifecycleStage }>[]);

const ALLOWED_TRANSITION_KEYS = new Set(
  EXECUTIVE_INTENT_ALLOWED_LIFECYCLE_TRANSITIONS.map((entry) => `${entry.from}->${entry.to}`)
);

function transitionKey(from: IntentLifecycleStage, to: IntentLifecycleStage): string {
  return `${from}->${to}`;
}

export function isAllowedLifecycleTransition(
  from: IntentLifecycleStage,
  to: IntentLifecycleStage
): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITION_KEYS.has(transitionKey(from, to));
}

export function resolveLifecycleTransition(
  from: IntentLifecycleStage,
  to: IntentLifecycleStage
): IntentLifecycleTransitionValidation {
  if (from === to) {
    return Object.freeze({
      from,
      to,
      allowed: true,
      reason: "Lifecycle stage unchanged.",
      readOnly: true,
    });
  }

  const allowed = isAllowedLifecycleTransition(from, to);
  return Object.freeze({
    from,
    to,
    allowed,
    reason: allowed
      ? `Transition ${from} → ${to} is allowed.`
      : `Transition ${from} → ${to} is not allowed by the lifecycle matrix.`,
    readOnly: true,
  });
}

export function listAllowedLifecycleTransitionsFrom(
  from: IntentLifecycleStage
): readonly IntentLifecycleStage[] {
  return Object.freeze(
    EXECUTIVE_INTENT_ALLOWED_LIFECYCLE_TRANSITIONS.filter((entry) => entry.from === from).map(
      (entry) => entry.to
    )
  );
}

export const ExecutiveIntentLifecycleMatrix = Object.freeze({
  resolveLifecycleTransition,
  isAllowedLifecycleTransition,
  listAllowedLifecycleTransitionsFrom,
  version: EXECUTIVE_INTENT_LIFECYCLE_MATRIX_VERSION,
});
