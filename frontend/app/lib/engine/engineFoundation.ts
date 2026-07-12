import { ExecutiveEngineContracts } from "./engineContracts.ts";
import { ExecutiveEngineMetadata } from "./engineMetadata.ts";
import { ExecutiveEngineRegistry } from "./engineRegistry.ts";
import type { ExecutiveEngineFoundationDescriptor } from "./engineTypes.ts";

export const ExecutiveEngineFoundation = Object.freeze({
  contracts: ExecutiveEngineContracts,
  registry: ExecutiveEngineRegistry,
  metadata: ExecutiveEngineMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveEngineFoundationDescriptor);

export const getExecutiveEngineFoundation = () => ExecutiveEngineFoundation;
export const getExecutiveEngineMetadata = () => ExecutiveEngineMetadata;
