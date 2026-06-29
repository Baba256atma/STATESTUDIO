/**
 * APP-4:5 — Executive Intent link target registry.
 * Identifier-only registration for orphan prevention — does not modify APP-3 state.
 */

import { isReservedIntentId } from "../executiveIntent/executiveIntentValidation.ts";
import type { IntentIdentifier } from "../executiveIntent/executiveIntentTypes.ts";
import type { ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveIntentLinkTargetRegistration } from "./executiveIntentMemoryLinkTypes.ts";

export type RegisteredExecutiveIntentLinkTarget = Readonly<{
  intentId: IntentIdentifier;
  workspaceId: ExecutiveMemoryWorkspaceId;
  goalIds: readonly string[];
  scenarioIds: readonly string[];
  decisionIds: readonly string[];
  evidenceIds: readonly string[];
  referenceIds: readonly string[];
  registeredAt: string;
  readOnly: true;
}>;

const registry = new Map<IntentIdentifier, RegisteredExecutiveIntentLinkTarget>();

export function resetExecutiveIntentLinkTargetRegistryForTests(): void {
  registry.clear();
}

export function registerExecutiveIntentLinkTarget(
  input: ExecutiveIntentLinkTargetRegistration,
  registeredAt: string
): Readonly<{ success: boolean; reason: string }> {
  if (isReservedIntentId(input.intentId)) {
    return Object.freeze({ success: false, reason: `Reserved intent id: ${input.intentId}.` });
  }
  if (input.intentId.trim().length === 0) {
    return Object.freeze({ success: false, reason: "Intent id must not be empty." });
  }

  registry.set(
    input.intentId,
    Object.freeze({
      intentId: input.intentId,
      workspaceId: input.workspaceId,
      goalIds: Object.freeze([...(input.goalIds ?? [])]),
      scenarioIds: Object.freeze([...(input.scenarioIds ?? [])]),
      decisionIds: Object.freeze([...(input.decisionIds ?? [])]),
      evidenceIds: Object.freeze([...(input.evidenceIds ?? [])]),
      referenceIds: Object.freeze([...(input.referenceIds ?? [])]),
      registeredAt,
      readOnly: true as const,
    })
  );
  return Object.freeze({ success: true, reason: "Intent link target registered." });
}

export function isExecutiveIntentLinkTargetRegistered(intentId: IntentIdentifier): boolean {
  return registry.has(intentId);
}

export function getExecutiveIntentLinkTarget(
  intentId: IntentIdentifier
): RegisteredExecutiveIntentLinkTarget | null {
  return registry.get(intentId) ?? null;
}

export function listRegisteredExecutiveIntentLinkTargets(): readonly RegisteredExecutiveIntentLinkTarget[] {
  return Object.freeze(
    [...registry.values()].sort((left, right) => left.intentId.localeCompare(right.intentId))
  );
}

export const ExecutiveIntentLinkTargetRegistry = Object.freeze({
  registerExecutiveIntentLinkTarget,
  isExecutiveIntentLinkTargetRegistered,
  getExecutiveIntentLinkTarget,
  listRegisteredExecutiveIntentLinkTargets,
  resetExecutiveIntentLinkTargetRegistryForTests,
});
