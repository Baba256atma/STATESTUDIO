/**
 * APP-4:6 — Scenario target registry for orphan prevention.
 * Identifier-only registration — does not modify APP-2 scenario objects.
 */

import type { ExecutiveScenarioId, ExecutiveScenarioTargetRegistration } from "./executiveScenarioMemoryTypes.ts";
import type { ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";

export type RegisteredExecutiveScenarioTarget = Readonly<{
  scenarioId: ExecutiveScenarioId;
  workspaceId: ExecutiveMemoryWorkspaceId;
  packageId: string | null;
  registeredAt: string;
  readOnly: true;
}>;

const registry = new Map<ExecutiveScenarioId, RegisteredExecutiveScenarioTarget>();

export function resetExecutiveScenarioTargetRegistryForTests(): void {
  registry.clear();
}

export function registerExecutiveScenarioTarget(
  input: ExecutiveScenarioTargetRegistration,
  registeredAt: string
): Readonly<{ success: boolean; reason: string }> {
  if (input.scenarioId.trim().length === 0) {
    return Object.freeze({ success: false, reason: "Scenario id must not be empty." });
  }
  registry.set(
    input.scenarioId,
    Object.freeze({
      scenarioId: input.scenarioId,
      workspaceId: input.workspaceId,
      packageId: input.packageId ?? null,
      registeredAt,
      readOnly: true as const,
    })
  );
  return Object.freeze({ success: true, reason: "Scenario target registered." });
}

export function isExecutiveScenarioTargetRegistered(scenarioId: ExecutiveScenarioId): boolean {
  return registry.has(scenarioId);
}

export function getExecutiveScenarioTarget(
  scenarioId: ExecutiveScenarioId
): RegisteredExecutiveScenarioTarget | null {
  return registry.get(scenarioId) ?? null;
}

export function listRegisteredExecutiveScenarioTargets(): readonly RegisteredExecutiveScenarioTarget[] {
  return Object.freeze(
    [...registry.values()].sort((left, right) => left.scenarioId.localeCompare(right.scenarioId))
  );
}

export const ExecutiveScenarioTargetRegistry = Object.freeze({
  registerExecutiveScenarioTarget,
  isExecutiveScenarioTargetRegistered,
  getExecutiveScenarioTarget,
  listRegisteredExecutiveScenarioTargets,
  resetExecutiveScenarioTargetRegistryForTests,
});
