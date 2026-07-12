import { ExecutiveEngineDependencyRegistry } from "./engineRegistryIndex.ts";
import type { ExecutiveEngineCompatibilityEntry } from "./engineFreezeTypes.ts";

const compatibility = (sequence: number, target: string, scope: ExecutiveEngineCompatibilityEntry["scope"]) => Object.freeze({
  artifactId: `ENG-COMPATIBILITY-${String(sequence).padStart(3, "0")}`,
  target, scope, compatibilityStatus: "Compatible", enforcement: false,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineCompatibilityEntry);

export const ExecutiveEngineCompatibilityMatrix = Object.freeze([
  ...ExecutiveEngineDependencyRegistry.map((dependency, index) => compatibility(index + 1, dependency.id, "ExternalPublicLayer")),
  ...["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform", "Certification"].map((target, index) => compatibility(index + 5, target, "InternalEngineSection")),
] as const);
