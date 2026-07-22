import { VisualizationSuiteRegistryPlatform } from "./visualizationSuiteRegistry.ts";
import type {
  VisualizationSuiteModelDescriptor,
  VisualizationSuiteModelName,
} from "./visualizationSuiteModelTypes.ts";

const descriptorSeeds = Object.freeze([
  ["VisualizationSuiteModel", "Visualization Suite", ["identityReference", "compositionReference", "platformReferences", "metadataReference"]],
  ["SuiteCompositionModel", "Suite Composition", ["platformReferences", "canonicalOrdering", "compatibilityReference"]],
  ["VisualizationPlatformModel", "Visualization Platform", ["platformIdentity", "publicIndexReference", "capabilityReferences", "namespaceReference"]],
  ["PublicIndexReferenceModel", "Public Index Reference", ["referenceIdentity", "platformReference", "canonicalSource"]],
  ["SuiteCapabilityModel", "Suite Capability", ["capabilityIdentity", "capabilityIntent", "platformApplicability"]],
  ["SuiteCompatibilityModel", "Suite Compatibility", ["compatibilityIdentity", "platformReferences", "preservationIntent"]],
  ["SuiteOwnershipModel", "Suite Ownership", ["ownerIdentity", "ownedMetadata", "excludedRuntime"]],
  ["SuiteBoundaryModel", "Suite Boundary", ["boundaryIdentity", "ownershipReference", "exclusionIntent"]],
  ["SuiteLifecycleModel", "Suite Lifecycle", ["lifecycleIdentity", "stateReferences", "orderingIntent"]],
  ["NamespaceDescriptorModel", "Namespace Descriptor", ["namespaceIdentity", "platformNamespaces", "orderingIntent"]],
  ["ExtensionDescriptorModel", "Extension Descriptor", ["extensionIdentity", "classification", "compatibilityReference"]],
  ["RegistryReferenceModel", "Registry Reference", ["registryIdentity", "collectionReferences", "suiteReference"]],
  ["SuiteIdentityModel", "Suite Identity", ["stableId", "canonicalName", "namespace", "version"]],
  ["SuiteMetadataModel", "Suite Metadata", ["identityReference", "inventoryReference", "readinessReference"]],
  ["SuiteVersionModel", "Suite Version", ["versionIdentity", "stability", "compatibilityReference"]],
  ["SuiteSummaryModel", "Suite Summary", ["summaryIdentity", "compositionReference", "inventoryReference"]],
  ["SuiteInventoryModel", "Suite Inventory", ["inventoryIdentity", "collectionReferences", "countMetadata"]],
  ["SuiteReadinessModel", "Suite Readiness", ["readinessIdentity", "status", "validationIntent"]],
] as const satisfies readonly [VisualizationSuiteModelName, string,
  readonly string[]][]);

const registry = VisualizationSuiteRegistryPlatform;

export const VisualizationSuiteModelDescriptors:
readonly VisualizationSuiteModelDescriptor[] = Object.freeze(
  descriptorSeeds.map(([canonicalName, modelKind, structuralMetadata], index) => {
    const registryReference = registry.catalog[index % registry.catalog.length]!;
    const platformReference =
      registry.platforms[index % registry.platforms.length]!;
    return Object.freeze({
      id: `EVE-9:3/Model/${canonicalName}` as const,
      canonicalName,
      modelKind,
      registryReference,
      categoryReference: registry.categories[index % registry.categories.length]!,
      platformReference,
      publicIndexReference: platformReference.publicIndexReference,
      ownershipReference: registryReference.ownershipReference,
      boundaryReference: registryReference.boundaryReference,
      lifecycleApplicability: registryReference.lifecycleApplicability,
      capabilityApplicability: registryReference.capabilityApplicability,
      namespace:
        `nexora.eve.visualization-suite.model.${canonicalName.toLowerCase()}` as const,
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

export const VisualizationSuiteModelComposition =
  VisualizationSuiteRegistryPlatform.platforms;
