import type { NexoraOSModuleId, NexoraOSRouteIntent } from "./NexoraOSContracts.ts";

const VALID_MODULES: ReadonlySet<NexoraOSModuleId> = new Set([
  "strategic_workspace",
  "war_room",
  "multi_agent",
  "sandbox",
  "execution",
  "memory",
  "governance",
]);

export function isNexoraOSModule(value: string | null | undefined): value is NexoraOSModuleId {
  return VALID_MODULES.has(value as NexoraOSModuleId);
}

export function resolveNexoraOSRoute(input?: {
  requestedModule?: string | null;
  fallback?: NexoraOSModuleId;
  hasExecution?: boolean;
  hasSimulation?: boolean;
  hasSandbox?: boolean;
}): NexoraOSRouteIntent {
  const fallback = input?.fallback ?? "strategic_workspace";
  if (isNexoraOSModule(input?.requestedModule)) {
    return { module: input.requestedModule, reason: "explicit_module_request" };
  }
  if (input?.hasExecution) return { module: "execution", reason: "execution_active" };
  if (input?.hasSimulation) return { module: "war_room", reason: "simulation_active" };
  if (input?.hasSandbox) return { module: "sandbox", reason: "sandbox_available" };
  return { module: fallback, reason: "fallback" };
}
