/**
 * APP-4:7 — Decision target registry for orphan prevention.
 */

import type {
  ExecutiveDecisionId,
  ExecutiveDecisionTargetRegistration,
} from "./executiveDecisionMemoryTypes.ts";
import type { ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";

export type RegisteredExecutiveDecisionTarget = Readonly<{
  decisionId: ExecutiveDecisionId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  status: string | null;
  registeredAt: string;
  readOnly: true;
}>;

const registry = new Map<ExecutiveDecisionId, RegisteredExecutiveDecisionTarget>();

export function resetExecutiveDecisionTargetRegistryForTests(): void {
  registry.clear();
}

export function registerExecutiveDecisionTarget(
  input: ExecutiveDecisionTargetRegistration,
  registeredAt: string
): Readonly<{ success: boolean; reason: string }> {
  if (input.decisionId.trim().length === 0) {
    return Object.freeze({ success: false, reason: "Decision id must not be empty." });
  }
  registry.set(
    input.decisionId,
    Object.freeze({
      decisionId: input.decisionId,
      workspaceId: input.workspaceId,
      status: input.status ?? null,
      registeredAt,
      readOnly: true as const,
    })
  );
  return Object.freeze({ success: true, reason: "Decision target registered." });
}

export function isExecutiveDecisionTargetRegistered(decisionId: ExecutiveDecisionId): boolean {
  return registry.has(decisionId);
}

export function getExecutiveDecisionTarget(
  decisionId: ExecutiveDecisionId
): RegisteredExecutiveDecisionTarget | null {
  return registry.get(decisionId) ?? null;
}

export function listRegisteredExecutiveDecisionTargets(): readonly RegisteredExecutiveDecisionTarget[] {
  return Object.freeze(
    [...registry.values()].sort((left, right) => left.decisionId.localeCompare(right.decisionId))
  );
}

export const ExecutiveDecisionTargetRegistry = Object.freeze({
  registerExecutiveDecisionTarget,
  isExecutiveDecisionTargetRegistered,
  getExecutiveDecisionTarget,
  listRegisteredExecutiveDecisionTargets,
  resetExecutiveDecisionTargetRegistryForTests,
});
