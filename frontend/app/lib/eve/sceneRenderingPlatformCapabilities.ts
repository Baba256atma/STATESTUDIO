import { SceneRenderingManifest } from "./sceneRenderingManifest.ts";
import type { SceneRenderingPlatformCapability } from "./sceneRenderingPlatformTypes.ts";

const names = Object.freeze([
  "Scene Rendering Architecture Composition",
  "Canonical Metadata Publication",
  "Canonical Inventory Publication",
  "Foundation Reference Preservation",
  "Registry Reference Preservation",
  "Model Reference Preservation",
  "Validation Reference Preservation",
  "Manifest Reference Preservation",
  "Compatibility Publication",
  "Certification Readiness Publication",
] as const);

export const SceneRenderingPlatformCapabilities: readonly SceneRenderingPlatformCapability[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:6/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Declarative Scene Rendering Platform capability for ${name}.`,
    manifestReference: SceneRenderingManifest.metadata.id,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })));
