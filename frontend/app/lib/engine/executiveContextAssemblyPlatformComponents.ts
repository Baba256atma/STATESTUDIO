import type { ExecutiveContextPlatformComponent } from "./executiveContextAssemblyPlatformTypes.ts";

const component = (
  componentId: string,
  name: string,
  phase: ExecutiveContextPlatformComponent["phase"],
  description: string,
  publicSurface: string,
  dependencies: readonly string[],
) => Object.freeze({
  componentId, name, phase, version: "1.0.0", description,
  owner: "ENG-4", publicSurface, dependencies, status: "Available",
  metadataOnly: true, runtimeFree: true, immutable: true,
} as const satisfies ExecutiveContextPlatformComponent);

export const ExecutiveContextAssemblyPlatformComponents = Object.freeze([
  component(
    "eng-4-platform-component-foundation",
    "Foundation",
    "ENG-4:1",
    "Canonical Context Assembly Foundation public surface.",
    "executiveContextAssemblyFoundation.ts",
    Object.freeze(["ENG-1 Public Index", "ENG-2 Public Index", "ENG-3 Public Index"]),
  ),
  component(
    "eng-4-platform-component-registry",
    "Registry",
    "ENG-4:2",
    "Canonical Context Assembly Registry public surface.",
    "executiveContextAssemblyRegistry.ts",
    Object.freeze(["ENG-4:1"]),
  ),
  component(
    "eng-4-platform-component-model",
    "Model",
    "ENG-4:3",
    "Canonical Context Assembly Model public surface.",
    "executiveContextAssemblyModel.ts",
    Object.freeze(["ENG-4:1", "ENG-4:2"]),
  ),
  component(
    "eng-4-platform-component-validation",
    "Validation",
    "ENG-4:4",
    "Canonical Context Assembly Validation public surface.",
    "executiveContextAssemblyValidation.ts",
    Object.freeze(["ENG-4:1", "ENG-4:2", "ENG-4:3"]),
  ),
  component(
    "eng-4-platform-component-manifest",
    "Manifest",
    "ENG-4:5",
    "Canonical Context Assembly Manifest public surface.",
    "executiveContextAssemblyManifest.ts",
    Object.freeze(["ENG-4:1", "ENG-4:2", "ENG-4:3", "ENG-4:4"]),
  ),
] as const);
