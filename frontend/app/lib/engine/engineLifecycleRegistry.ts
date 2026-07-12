import type { ExecutiveEngineLifecycleRegistryEntry, ExecutiveEngineLifecycleStatus } from "./engineRegistryTypes.ts";

const lifecycle = (id: ExecutiveEngineLifecycleStatus, name: string, order: number, description: string) => Object.freeze({
  id, name, order, description, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineLifecycleRegistryEntry);

export const ExecutiveEngineLifecycleRegistry = Object.freeze([
  lifecycle("planned", "Planned", 1, "Architectural component is planned."),
  lifecycle("active", "Active", 2, "Architectural component metadata is active."),
  lifecycle("certified", "Certified", 3, "Architectural component metadata is certified."),
  lifecycle("frozen", "Frozen", 4, "Architectural component metadata is frozen."),
  lifecycle("released", "Released", 5, "Architectural component metadata is publicly released."),
] as const);

export const ExecutiveEngineCurrentLifecycle = Object.freeze({
  phaseId: "ENG-1:2", status: "active", metadataOnly: true,
} as const);
