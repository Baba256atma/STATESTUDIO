import { VisualizationPlatformRegistryPlatform } from "./visualizationPlatformRegistry.ts";
import type {
  VisualizationPlatformModelDescriptor,
  VisualizationPlatformModelName,
} from "./visualizationPlatformModelTypes.ts";

const descriptorSeeds = Object.freeze([
  ["VisualizationPlatformModel", "Visualization Platform", ["identityReference", "compositionReference", "moduleReferences", "metadataReference"]],
  ["PlatformCompositionModel", "Platform Composition", ["moduleReferences", "canonicalOrdering", "compatibilityReference"]],
  ["VisualizationModuleModel", "Visualization Module", ["moduleIdentity", "publicIndexReference", "capabilityReferences", "namespaceReference"]],
  ["ModuleReferenceModel", "Module Reference", ["referenceIdentity", "moduleReference", "canonicalSource"]],
  ["PlatformCapabilityModel", "Platform Capability", ["capabilityIdentity", "capabilityIntent", "moduleApplicability"]],
  ["PlatformCompatibilityModel", "Platform Compatibility", ["compatibilityIdentity", "moduleReferences", "preservationIntent"]],
  ["PlatformOwnershipModel", "Platform Ownership", ["ownerIdentity", "ownedMetadata", "excludedRuntime"]],
  ["PlatformBoundaryModel", "Platform Boundary", ["boundaryIdentity", "ownershipReference", "exclusionIntent"]],
  ["PlatformLifecycleModel", "Platform Lifecycle", ["lifecycleIdentity", "stateReferences", "orderingIntent"]],
  ["NamespaceDescriptorModel", "Namespace Descriptor", ["namespaceIdentity", "moduleNamespaces", "orderingIntent"]],
  ["ExtensionDescriptorModel", "Extension Descriptor", ["extensionIdentity", "classification", "compatibilityReference"]],
  ["RegistryReferenceModel", "Registry Reference", ["registryIdentity", "collectionReferences", "platformReference"]],
  ["PlatformIdentityModel", "Platform Identity", ["stableId", "canonicalName", "namespace", "version"]],
  ["PlatformMetadataModel", "Platform Metadata", ["identityReference", "inventoryReference", "readinessReference"]],
  ["PlatformVersionModel", "Platform Version", ["versionIdentity", "stability", "compatibilityReference"]],
  ["PlatformSummaryModel", "Platform Summary", ["summaryIdentity", "compositionReference", "inventoryReference"]],
  ["PlatformInventoryModel", "Platform Inventory", ["inventoryIdentity", "collectionReferences", "countMetadata"]],
  ["PlatformReadinessModel", "Platform Readiness", ["readinessIdentity", "status", "validationIntent"]],
] as const satisfies readonly [VisualizationPlatformModelName, string,
  readonly string[]][]);

const registry = VisualizationPlatformRegistryPlatform;

export const VisualizationPlatformModelDescriptors:
readonly VisualizationPlatformModelDescriptor[] = Object.freeze(
  descriptorSeeds.map(([canonicalName, modelKind, structuralMetadata], index) => {
    const registryReference = registry.catalog[index % registry.catalog.length]!;
    return Object.freeze({
      id: `EVE-8:3/Model/${canonicalName}` as const,
      canonicalName,
      modelKind,
      registryReference,
      categoryReference: registry.categories[index % registry.categories.length]!,
      moduleReference: registry.modules[index % registry.modules.length]!,
      ownershipReference: registryReference.ownershipReference,
      boundaryReference: registryReference.boundaryReference,
      lifecycleApplicability: registryReference.lifecycleApplicability,
      capabilityApplicability: registryReference.capabilityApplicability,
      namespace:
        `nexora.eve.visualization-platform.model.${canonicalName.toLowerCase()}` as const,
      version: registryReference.version,
      stability: registryReference.stability,
      extensionClassification: registryReference.extensionClassification,
      structuralMetadata: Object.freeze([...structuralMetadata]),
      deterministicOrder: index + 1,
      executableBehavior: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);

export const VisualizationPlatformModelComposition =
  VisualizationPlatformRegistryPlatform.modules;
