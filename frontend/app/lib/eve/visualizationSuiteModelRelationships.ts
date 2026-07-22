import { VisualizationSuiteRegistryPlatform } from "./visualizationSuiteRegistry.ts";
import type {
  VisualizationSuiteModelName,
  VisualizationSuiteModelRelationship,
} from "./visualizationSuiteModelTypes.ts";

const relationshipSeeds = Object.freeze([
  ["VisualizationSuiteModel", "VisualizationPlatformModel", "platformReferences"],
  ["VisualizationSuiteModel", "PublicIndexReferenceModel", "publicIndexReferences"],
  ["VisualizationSuiteModel", "SuiteCapabilityModel", "capabilityReferences"],
  ["VisualizationSuiteModel", "SuiteCompatibilityModel", "compatibilityReferences"],
  ["VisualizationSuiteModel", "SuiteLifecycleModel", "lifecycleReference"],
  ["VisualizationSuiteModel", "SuiteOwnershipModel", "ownershipReference"],
  ["VisualizationSuiteModel", "SuiteBoundaryModel", "boundaryReferences"],
  ["VisualizationSuiteModel", "NamespaceDescriptorModel", "namespaceReferences"],
  ["VisualizationSuiteModel", "RegistryReferenceModel", "registryReference"],
  ["VisualizationSuiteModel", "ExtensionDescriptorModel", "extensionReferences"],
  ["VisualizationPlatformModel", "PublicIndexReferenceModel", "publicIndexReference"],
  ["VisualizationPlatformModel", "SuiteCapabilityModel", "capabilityReferences"],
  ["RegistryReferenceModel", "VisualizationSuiteModel", "suiteReference"],
] as const satisfies readonly [VisualizationSuiteModelName,
  VisualizationSuiteModelName, string][]);

export const VisualizationSuiteModelRelationships:
readonly VisualizationSuiteModelRelationship[] = Object.freeze(
  relationshipSeeds.map(([sourceModel, targetModel, referenceField], index) =>
    Object.freeze({
      id: `EVE-9:3/Relationship/${sourceModel}-${targetModel}` as const,
      sourceModel,
      targetModel,
      referenceField,
      registryReference: VisualizationSuiteRegistryPlatform.metadata.id,
      deterministicOrder: index + 1,
      orchestrationProvided: false as const,
      traversalProvided: false as const,
      resolutionProvided: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
