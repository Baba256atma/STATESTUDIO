import { VisualizationSuiteFoundationPlatform } from "./visualizationSuiteFoundation.ts";
import type {
  VisualizationSuiteRegistryCategory,
  VisualizationSuiteRegistryEntry,
  VisualizationSuiteRegistryKey,
} from "./visualizationSuiteRegistryTypes.ts";

const catalogSeeds = Object.freeze([
  ["VisualizationSuite", "Visualization Suite"],
  ["VisualizationPlatforms", "Visualization Platforms"],
  ["PublicIndexReferences", "Public Index References"],
  ["SuiteIdentities", "Suite Identities"],
  ["SuiteContracts", "Suite Contracts"],
  ["SuiteCapabilities", "Suite Capabilities"],
  ["CompatibilityClasses", "Compatibility Classes"],
  ["Ownership", "Ownership"],
  ["ArchitecturalBoundaries", "Architectural Boundaries"],
  ["LifecycleStates", "Lifecycle States"],
  ["SuiteComposition", "Suite Composition"],
  ["NamespaceCategories", "Namespace Categories"],
  ["ExtensionClassifications", "Extension Classifications"],
  ["RegistryCategories", "Registry Categories"],
  ["RegistryMetadata", "Registry Metadata"],
  ["VersionMetadata", "Version Metadata"],
] as const satisfies readonly [VisualizationSuiteRegistryKey, string][]);

const foundation = VisualizationSuiteFoundationPlatform;

export const VisualizationSuiteRegistryCatalog:
readonly VisualizationSuiteRegistryEntry[] = Object.freeze(catalogSeeds.map(
  ([key, displayName], index) => {
    const platform = foundation.composition[index % foundation.composition.length]!;
    return Object.freeze({
      id: `EVE-9:2/Registry/${key}` as const,
      key,
      canonicalKey: key,
      displayName,
      description: `Canonical Visualization Suite registry for ${displayName.toLowerCase()}.`,
      foundationContractReference: foundation.contracts[index]!,
      platformReference: platform,
      publicIndexReference: platform.publicIndex,
      ownershipReference: foundation.ownership,
      boundaryReference: foundation.boundaries,
      lifecycleApplicability: foundation.lifecycle,
      capabilityApplicability: foundation.capabilities,
      namespace:
        `nexora.eve.visualization-suite.registry.${key.toLowerCase()}` as const,
      stability: "Stable" as const,
      version: "1.0.0" as const,
      extensionClassification: `${key}Extension`,
      deterministicOrder: index + 1,
      executable: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);

export const VisualizationSuiteRegistryCategories:
readonly VisualizationSuiteRegistryCategory[] = Object.freeze(
  foundation.contracts.map((contract, index) => Object.freeze({
    id: `EVE-9:2/Category/${contract.canonicalName.replaceAll(" ", "")}` as const,
    canonicalName: contract.canonicalName,
    description: `Foundation-derived category for ${contract.canonicalName}.`,
    foundationReference: contract,
    immutableCollection: Object.freeze([contract]),
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

export const VisualizationSuitePlatformRegistry = Object.freeze(
  foundation.composition.map((platform, index) => Object.freeze({
    id: `EVE-9:2/Platform/${index + 1}` as const,
    canonicalName: platform.name,
    foundationPlatformReference: platform,
    publicIndexReference: platform.publicIndex,
    release: platform.release,
    deterministicOrder: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
