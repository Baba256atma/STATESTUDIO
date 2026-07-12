import { ExecutiveEngineContracts } from "./engineContracts.ts";
import { ExecutiveEngineRegistry } from "./engineRegistry.ts";
import type { ExecutiveEngineMetadataDescriptor } from "./engineTypes.ts";

export const ExecutiveEngineMetadata = Object.freeze({
  identity: ExecutiveEngineRegistry,
  purpose: "Canonical architectural foundation for the Nexora Executive Brain and its future coordination layers.",
  responsibilities: Object.freeze(ExecutiveEngineContracts.map((contract) => contract.responsibility)),
  publicDependencies: Object.freeze(["CORE", "CORE-TEN", "BUS", "OPS"]),
  boundaries: Object.freeze([
    "No AI reasoning", "No LLM calls", "No workflow execution", "No scheduling",
    "No task execution", "No automation", "No persistence", "No database access",
    "No API calls", "No network requests", "No authentication", "No authorization",
    "No user sessions", "No tenant resolution", "No calculations", "No decision logic",
    "No routing", "No orchestration execution",
  ]),
  publicApiSurface: Object.freeze([
    "ExecutiveEngineFoundation", "ExecutiveEngineContracts", "ExecutiveEngineRegistry",
    "ExecutiveEngineMetadata", "getExecutiveEngineFoundation", "getExecutiveEngineMetadata",
  ]),
  foundationStatus: "FoundationDefined",
  releaseMetadata: Object.freeze({ phase: "ENG-1:1", stage: "Draft", nextPhase: "ENG-1:2" }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveEngineMetadataDescriptor);
