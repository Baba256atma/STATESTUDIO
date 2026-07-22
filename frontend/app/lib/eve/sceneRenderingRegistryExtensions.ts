import { SceneRenderingFoundation } from "./sceneRenderingFoundation.ts";
import type { SceneRenderingRegistryEntry } from "./sceneRenderingRegistryTypes.ts";

const extensionContract = SceneRenderingFoundation.contracts.find(
  ({ name }) => name === "ExtensionPoint",
)!;

const names = Object.freeze([
  "SceneExtension", "RenderContextExtension", "RenderPassExtension",
  "RenderStageExtension", "RenderLayerExtension", "RenderTargetExtension",
  "RenderSurfaceExtension", "FrameExtension", "CompositionExtension",
  "OutputExtension", "RenderingProfileExtension",
  "RenderingCapabilityExtension",
] as const);

export const SceneRenderingExtensionPointTypeRegistry: readonly SceneRenderingRegistryEntry[] =
  Object.freeze(names.map((name, index) => Object.freeze({
    id: `EVE-2:2/ExtensionPointType/${name}`,
    key: name,
    displayName: name,
    description: `Declarative Scene Rendering extension classification for ${name}.`,
    category: "ExtensionPointType",
    foundationContractReference: extensionContract.id,
    ownershipReference: SceneRenderingFoundation.ownership.id,
    boundaryReference: SceneRenderingFoundation.boundaries.id,
    lifecycleApplicability: SceneRenderingFoundation.lifecycle.states,
    capabilityApplicability: Object.freeze(
      SceneRenderingFoundation.capabilities.map(({ id }) => id),
    ),
    stability: "Stable",
    version: "1.0.0",
    extensionClassification: name,
    deprecated: false,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

export const SceneRenderingRegistryExtensions = Object.freeze({
  classifications: SceneRenderingExtensionPointTypeRegistry,
  foundationContractReference: extensionContract.id,
  loadsPlugins: false,
  executesExtensions: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

