/**
 * APP-1:5 — Executive Time Transition Policy.
 * Metadata-only lifecycle transition policies — no execution.
 */

import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_TRANSITION_POLICY_VERSION = "APP-1/5" as const;

export type ExecutiveTimeTransitionPolicyEdge = Readonly<{
  fromState: string;
  toState: string;
  label: string;
}>;

export type ExecutiveTimeTransitionPolicy = Readonly<{
  entityType: ExecutiveTimeEntityType;
  version: typeof EXECUTIVE_TIME_TRANSITION_POLICY_VERSION;
  edges: readonly ExecutiveTimeTransitionPolicyEdge[];
  primaryPath: readonly string[];
}>;

export type ExecutiveTimeTransitionPolicyResult = Readonly<{
  valid: boolean;
  allowed: boolean;
  policyId: string;
  fromState: string;
  toState: string;
  messages: readonly string[];
}>;

const POLICY_PRIMARY_PATHS: Readonly<Record<ExecutiveTimeEntityType, readonly string[]>> = Object.freeze({
  scenario: Object.freeze(["draft", "planned", "active", "completed"]),
  decision: Object.freeze(["draft", "review", "approved", "executed"]),
  risk: Object.freeze(["detected", "monitoring", "mitigated", "closed"]),
  kpi: Object.freeze(["inactive", "collecting", "monitoring", "completed"]),
  object: Object.freeze(["created", "active", "inactive", "archived"]),
  relationship: Object.freeze(["draft", "active", "archived"]),
  data_source: Object.freeze(["empty", "connected", "archived"]),
  report: Object.freeze(["draft", "published"]),
  dashboard: Object.freeze(["draft", "active", "archived"]),
  assistant: Object.freeze(["idle", "active", "archived"]),
  custom: Object.freeze(["draft", "active", "archived"]),
});

function buildEdges(path: readonly string[]): readonly ExecutiveTimeTransitionPolicyEdge[] {
  const edges: ExecutiveTimeTransitionPolicyEdge[] = [];
  for (let index = 0; index < path.length - 1; index += 1) {
    const fromState = path[index]!;
    const toState = path[index + 1]!;
    edges.push(Object.freeze({ fromState, toState, label: `${fromState}_to_${toState}` }));
  }
  return Object.freeze(edges);
}

const POLICIES: Readonly<Record<ExecutiveTimeEntityType, ExecutiveTimeTransitionPolicy>> = Object.freeze(
  Object.fromEntries(
    (Object.keys(POLICY_PRIMARY_PATHS) as ExecutiveTimeEntityType[]).map((entityType) => {
      const primaryPath = POLICY_PRIMARY_PATHS[entityType];
      return [
        entityType,
        Object.freeze({
          entityType,
          version: EXECUTIVE_TIME_TRANSITION_POLICY_VERSION,
          primaryPath,
          edges: buildEdges(primaryPath),
        }),
      ];
    })
  ) as Record<ExecutiveTimeEntityType, ExecutiveTimeTransitionPolicy>
);

export function resolveTransitionPolicy(entityType: ExecutiveTimeEntityType): ExecutiveTimeTransitionPolicy {
  return POLICIES[entityType];
}

export function validateTransitionPolicy(input: {
  entityType: ExecutiveTimeEntityType;
  fromState: string;
  toState: string;
}): ExecutiveTimeTransitionPolicyResult {
  const policy = resolveTransitionPolicy(input.entityType);
  const directEdge = policy.edges.some(
    (edge) => edge.fromState === input.fromState && edge.toState === input.toState
  );
  const allowed = directEdge;
  const messages = allowed
    ? Object.freeze([] as const)
    : Object.freeze([`Policy "${policy.entityType}" does not allow ${input.fromState} → ${input.toState}.`]);
  return Object.freeze({
    valid: allowed,
    allowed,
    policyId: `${policy.entityType}-primary-path`,
    fromState: input.fromState,
    toState: input.toState,
    messages,
  });
}

export function listPolicyNextStates(entityType: ExecutiveTimeEntityType, fromState: string): readonly string[] {
  const policy = resolveTransitionPolicy(entityType);
  return Object.freeze(policy.edges.filter((edge) => edge.fromState === fromState).map((edge) => edge.toState));
}
