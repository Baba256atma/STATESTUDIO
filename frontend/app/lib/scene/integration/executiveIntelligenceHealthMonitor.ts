/**
 * E2:100 — Runtime health monitor for executive cognition modules.
 */

import type { ExecutiveRuntimeModuleEntry, ExecutiveRuntimeModuleHealth } from "./executiveIntelligenceTypes";

export type ExecutiveRuntimeHealthSummary = {
  activeCount: number;
  degradedCount: number;
  failedCount: number;
  idleCount: number;
  failedModules: readonly string[];
  degradedModules: readonly string[];
};

export function summarizeExecutiveRuntimeHealth(
  registry: readonly ExecutiveRuntimeModuleEntry[]
): ExecutiveRuntimeHealthSummary {
  const failedModules: string[] = [];
  const degradedModules: string[] = [];
  let activeCount = 0;
  let degradedCount = 0;
  let failedCount = 0;
  let idleCount = 0;

  registry.forEach((entry) => {
    if (entry.health === "active") activeCount += 1;
    if (entry.health === "degraded") {
      degradedCount += 1;
      degradedModules.push(entry.moduleId);
    }
    if (entry.health === "failed") {
      failedCount += 1;
      failedModules.push(entry.moduleId);
    }
    if (entry.health === "idle") idleCount += 1;
  });

  return {
    activeCount,
    degradedCount,
    failedCount,
    idleCount,
    failedModules,
    degradedModules,
  };
}

export function resolveModuleHealth(
  registry: readonly ExecutiveRuntimeModuleEntry[],
  moduleId: ExecutiveRuntimeModuleEntry["moduleId"]
): ExecutiveRuntimeModuleHealth {
  return registry.find((entry) => entry.moduleId === moduleId)?.health ?? "idle";
}
