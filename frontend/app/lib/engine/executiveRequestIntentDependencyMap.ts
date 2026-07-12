import type { ExecutiveRequestIntentDependency } from "./executiveRequestIntentManifestTypes.ts";

const dependency = (id: ExecutiveRequestIntentDependency["id"], source: string, target: string, dependencyType: ExecutiveRequestIntentDependency["dependencyType"], publicIndexReference: string) => Object.freeze({
  id, source, target, dependencyType, publicIndexReference, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveRequestIntentDependency);

export const ExecutiveRequestIntentDependencyMap = Object.freeze({
  approvedDependencies: Object.freeze([
    dependency("eng-2-dependency-2-2-on-2-1", "ENG-2:2", "ENG-2:1", "ApprovedPublicIndex", "executiveRequestIntentIndex.ts"),
    dependency("eng-2-dependency-2-3-on-2-2", "ENG-2:3", "ENG-2:2", "ApprovedPublicIndex", "executiveRequestIntentRegistryIndex.ts"),
    dependency("eng-2-dependency-2-4-on-2-3", "ENG-2:4", "ENG-2:3", "ApprovedPublicIndex", "executiveRequestIntentModelIndex.ts"),
    dependency("eng-2-dependency-2-5-on-2-4", "ENG-2:5", "ENG-2:4", "ApprovedPublicIndex", "executiveRequestIntentValidationIndex.ts"),
  ]),
  futureReferences: Object.freeze([
    dependency("eng-2-dependency-future-2-6", "ENG-2:6", "ENG-2:5", "FutureArchitecturalReference", "executiveRequestIntentManifestIndex.ts"),
    dependency("eng-2-dependency-future-2-7", "ENG-2:7", "ENG-2:6", "FutureArchitecturalReference", "future ENG-2:6 public index"),
    dependency("eng-2-dependency-future-2-8", "ENG-2:8", "ENG-2:7", "FutureArchitecturalReference", "future ENG-2:7 public index"),
    dependency("eng-2-dependency-future-2-9", "ENG-2:9", "ENG-2:8", "FutureArchitecturalReference", "future ENG-2:8 public index"),
  ]),
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
