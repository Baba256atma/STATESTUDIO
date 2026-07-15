import type { ExecutiveContextFreezeEntry } from "./executiveContextAssemblyFreezeTypes.ts";

const entry = (
  key: string,
  name: string,
  phase: ExecutiveContextFreezeEntry["phase"],
  publicSurface: string,
) => Object.freeze({
  freezeEntryId: `eng-4-freeze-entry-${key}`,
  componentId: `eng-4-freeze-component-${key}`,
  name, phase, version: "1.0.0", owner: "ENG-4", publicSurface,
  certificationState: "Certified",
  freezeState: "Frozen",
  publicApiStabilityState: "Stable",
  ownershipProtectionState: "Protected",
  antiDuplicationState: "Protected",
  runtimeFree: true,
  metadataOnly: true,
  lockIdentifier: "ENG-4-LOCKED",
  immutable: true,
} as const satisfies ExecutiveContextFreezeEntry);

export const ExecutiveContextAssemblyFreezeRegistry = Object.freeze([
  entry("foundation", "Foundation", "ENG-4:1", "executiveContextAssemblyFoundation.ts"),
  entry("registry", "Registry", "ENG-4:2", "executiveContextAssemblyRegistry.ts"),
  entry("model", "Model", "ENG-4:3", "executiveContextAssemblyModel.ts"),
  entry("validation", "Validation", "ENG-4:4", "executiveContextAssemblyValidation.ts"),
  entry("manifest", "Manifest", "ENG-4:5", "executiveContextAssemblyManifest.ts"),
  entry("platform", "Platform", "ENG-4:6", "executiveContextAssemblyPlatform.ts"),
  entry("certification", "Certification", "ENG-4:7", "executiveContextAssemblyCertification.ts"),
] as const);
