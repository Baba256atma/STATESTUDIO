import { VisualizationPlatformRegistryPlatform } from "./visualizationPlatformRegistry.ts";
import type {
  VisualizationPlatformModelName,
  VisualizationPlatformModelRelationship,
} from "./visualizationPlatformModelTypes.ts";

const relationshipSeeds = Object.freeze([
  ["VisualizationPlatformModel", "VisualizationModuleModel", "moduleReferences"],
  ["VisualizationPlatformModel", "PlatformCapabilityModel", "capabilityReferences"],
  ["VisualizationPlatformModel", "PlatformCompatibilityModel", "compatibilityReferences"],
  ["VisualizationPlatformModel", "PlatformLifecycleModel", "lifecycleReference"],
  ["VisualizationPlatformModel", "PlatformOwnershipModel", "ownershipReference"],
  ["VisualizationPlatformModel", "PlatformBoundaryModel", "boundaryReferences"],
  ["VisualizationPlatformModel", "NamespaceDescriptorModel", "namespaceReferences"],
  ["VisualizationPlatformModel", "RegistryReferenceModel", "registryReference"],
  ["VisualizationPlatformModel", "ExtensionDescriptorModel", "extensionReferences"],
  ["VisualizationModuleModel", "PlatformCapabilityModel", "capabilityReferences"],
  ["VisualizationModuleModel", "PlatformCompatibilityModel", "compatibilityReference"],
  ["VisualizationModuleModel", "NamespaceDescriptorModel", "namespaceReference"],
  ["RegistryReferenceModel", "VisualizationPlatformModel", "platformReference"],
] as const satisfies readonly [VisualizationPlatformModelName,
  VisualizationPlatformModelName, string][]);

export const VisualizationPlatformModelRelationships:
readonly VisualizationPlatformModelRelationship[] = Object.freeze(
  relationshipSeeds.map(([sourceModel, targetModel, referenceField], index) =>
    Object.freeze({
      id: `EVE-8:3/Relationship/${sourceModel}-${targetModel}` as const,
      sourceModel,
      targetModel,
      referenceField,
      registryReference: VisualizationPlatformRegistryPlatform.metadata.id,
      deterministicOrder: index + 1,
      orchestrationProvided: false as const,
      traversalProvided: false as const,
      resolutionProvided: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
