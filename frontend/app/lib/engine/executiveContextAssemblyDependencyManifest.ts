import type { ExecutiveContextManifestDependency } from "./executiveContextAssemblyManifestTypes.ts";

const dependency = (
  id: string,
  source: string,
  target: string,
  publicIndexReference: string,
) => Object.freeze({
  id, source, target,
  direction: "ForwardOnly",
  consumption: "PublicIndexOnly",
  reverseDependency: false,
  circularDependency: false,
  internalImplementationDependency: false,
  futurePhaseDependency: false,
  publicIndexReference,
  metadataOnly: true, immutable: true,
} as const satisfies ExecutiveContextManifestDependency);

export const ExecutiveContextAssemblyDependencyManifest = Object.freeze([
  dependency("eng-4-dep-external-eng-1", "ENG-4", "ENG-1", "executiveEnginePublicIndex.ts"),
  dependency("eng-4-dep-external-eng-2", "ENG-4", "ENG-2", "executiveRequestIntentPublicIndex.ts"),
  dependency("eng-4-dep-external-eng-3", "ENG-4", "ENG-3", "executiveIntentResolutionPublicIndex.ts"),
  dependency("eng-4-dep-registry-foundation", "ENG-4:2", "ENG-4:1", "executiveContextAssemblyFoundation.ts"),
  dependency("eng-4-dep-model-foundation", "ENG-4:3", "ENG-4:1", "executiveContextAssemblyFoundation.ts"),
  dependency("eng-4-dep-model-registry", "ENG-4:3", "ENG-4:2", "executiveContextAssemblyRegistry.ts"),
  dependency("eng-4-dep-validation-foundation", "ENG-4:4", "ENG-4:1", "executiveContextAssemblyFoundation.ts"),
  dependency("eng-4-dep-validation-registry", "ENG-4:4", "ENG-4:2", "executiveContextAssemblyRegistry.ts"),
  dependency("eng-4-dep-validation-model", "ENG-4:4", "ENG-4:3", "executiveContextAssemblyModel.ts"),
  dependency("eng-4-dep-manifest-foundation", "ENG-4:5", "ENG-4:1", "executiveContextAssemblyFoundation.ts"),
  dependency("eng-4-dep-manifest-registry", "ENG-4:5", "ENG-4:2", "executiveContextAssemblyRegistry.ts"),
  dependency("eng-4-dep-manifest-model", "ENG-4:5", "ENG-4:3", "executiveContextAssemblyModel.ts"),
  dependency("eng-4-dep-manifest-validation", "ENG-4:5", "ENG-4:4", "executiveContextAssemblyValidation.ts"),
] as const);
