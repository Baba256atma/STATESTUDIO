import type {
  ExecutiveOrchestrationFreezeCompatibilityDependency,
  ExecutiveOrchestrationFreezeCompatibilityEntry,
} from "./executiveOrchestrationFreezeTypes.ts";

const compatibility = (
  dependency: ExecutiveOrchestrationFreezeCompatibilityDependency,
) => Object.freeze({
  dependency,
  compatibilityStatus: "Compatible",
  publicApiOnly: true,
  runtimeInteractionAllowed: false,
  certified: true,
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationFreezeCompatibilityEntry);

/**
 * Immutable freeze compatibility declarations for ENG-8:8.
 * Descriptive only — no runtime interaction.
 */
export const ExecutiveOrchestrationFreezeCompatibility = Object.freeze([
  compatibility("ENG-1"),
  compatibility("ENG-2"),
  compatibility("ENG-3"),
  compatibility("ENG-4"),
  compatibility("ENG-5"),
  compatibility("ENG-6"),
  compatibility("ENG-7"),
  compatibility("BUS Public APIs"),
  compatibility("OPS Public APIs"),
  compatibility("Advisor Public APIs"),
] as const);
