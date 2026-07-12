import { ExecutiveEngineDependencyRegistry } from "./engineRegistryIndex.ts";
import type { ExecutiveEngineDependencyEntry } from "./engineManifestTypes.ts";
const edge = (artifactId: ExecutiveEngineDependencyEntry["artifactId"], source: string, target: string, dependencyType: ExecutiveEngineDependencyEntry["dependencyType"]) => Object.freeze({ artifactId, source, target, dependencyType, circularDependencyAllowed: false, metadataOnly: true, immutable: true } as const satisfies ExecutiveEngineDependencyEntry);
export const ExecutiveEngineDependencyMap = Object.freeze([
  ...ExecutiveEngineDependencyRegistry.map((dependency, index) => edge(`ENG-DEPENDENCY-00${index + 1}` as ExecutiveEngineDependencyEntry["artifactId"], "ExecutiveEngine", dependency.id, "ExternalPublicApi")),
  edge("ENG-DEPENDENCY-005", "ENG-1:5", "ENG-1:1", "ConsumedEnginePhase"),
  edge("ENG-DEPENDENCY-006", "ENG-1:5", "ENG-1:2", "ConsumedEnginePhase"),
  edge("ENG-DEPENDENCY-007", "ENG-1:5", "ENG-1:3", "ConsumedEnginePhase"),
  edge("ENG-DEPENDENCY-008", "ENG-1:5", "ENG-1:4", "ConsumedEnginePhase"),
] as const);
