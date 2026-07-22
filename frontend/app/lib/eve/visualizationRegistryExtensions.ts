import { VisualizationFoundation } from "./visualizationFoundation.ts";
import type { VisualizationRegistryEntry } from "./visualizationRegistryTypes.ts";

const extensionContract = VisualizationFoundation.contracts.find(
  ({ name }) => name === "ExtensionPoint",
)!;

export const VisualizationExtensionPointTypeRegistry: readonly VisualizationRegistryEntry[] =
  Object.freeze([
    "VisualObjectExtension", "SurfaceExtension", "ModeExtension",
    "CapabilityExtension",
  ].map((name, index) => Object.freeze({
    id: `EVE-1:2/ExtensionPointType/${name}`,
    name,
    description: `Canonical EVE extension classification for ${name}.`,
    category: "ExtensionPointType",
    version: "1.0.0",
    namespace: "nexora.eve.registry.extensionpointtype",
    stability: "Stable",
    foundationContractId: extensionContract.id,
    deterministicOrder: index + 1,
    metadataOnly: true,
    immutable: true,
  })));

export const VisualizationRegistryExtensions = Object.freeze({
  extensionPointTypes: VisualizationExtensionPointTypeRegistry,
  foundationReference: extensionContract.id,
  implementationProvided: false,
  metadataOnly: true,
  immutable: true,
} as const);

