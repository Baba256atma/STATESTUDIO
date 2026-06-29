/**
 * APP-1:7 — Executive Event Lifecycle metadata.
 * Immutable lifecycle states — no replay or subscriptions.
 */

export const EXECUTIVE_EVENT_LIFECYCLE_VERSION = "APP-1/7" as const;

export type ExecutiveEventLifecycleState =
  | "created"
  | "validated"
  | "classified"
  | "registered"
  | "published";

export type ExecutiveEventLifecycleStep = Readonly<{
  state: ExecutiveEventLifecycleState;
  order: number;
  label: string;
}>;

export const EXECUTIVE_EVENT_LIFECYCLE_STEPS: readonly ExecutiveEventLifecycleStep[] = Object.freeze([
  Object.freeze({ state: "created", order: 0, label: "Event created." }),
  Object.freeze({ state: "validated", order: 1, label: "Publisher request validated." }),
  Object.freeze({ state: "classified", order: 2, label: "Event classified." }),
  Object.freeze({ state: "registered", order: 3, label: "Event registered." }),
  Object.freeze({ state: "published", order: 4, label: "Event published." }),
]);

export type ExecutiveEventLifecycleMetadata = Readonly<{
  currentState: ExecutiveEventLifecycleState;
  steps: readonly ExecutiveEventLifecycleStep[];
  completedStates: readonly ExecutiveEventLifecycleState[];
}>;

export function createExecutiveEventLifecycleMetadata(
  currentState: ExecutiveEventLifecycleState
): ExecutiveEventLifecycleMetadata {
  const current = EXECUTIVE_EVENT_LIFECYCLE_STEPS.find((step) => step.state === currentState);
  const order = current?.order ?? 0;
  const completedStates = Object.freeze(
    EXECUTIVE_EVENT_LIFECYCLE_STEPS.filter((step) => step.order <= order).map((step) => step.state)
  );
  return Object.freeze({
    currentState,
    steps: EXECUTIVE_EVENT_LIFECYCLE_STEPS,
    completedStates,
  });
}

export function advanceExecutiveEventLifecycle(
  fromState: ExecutiveEventLifecycleState
): ExecutiveEventLifecycleState {
  const index = EXECUTIVE_EVENT_LIFECYCLE_STEPS.findIndex((step) => step.state === fromState);
  if (index < 0 || index >= EXECUTIVE_EVENT_LIFECYCLE_STEPS.length - 1) {
    return fromState;
  }
  return EXECUTIVE_EVENT_LIFECYCLE_STEPS[index + 1]!.state;
}
