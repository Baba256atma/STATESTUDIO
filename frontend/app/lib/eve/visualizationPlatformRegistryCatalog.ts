import { VisualizationPlatformFoundationPlatform } from "./visualizationPlatformFoundation.ts";
import type {
  VisualizationPlatformRegistryCategory,
  VisualizationPlatformRegistryEntry,
  VisualizationPlatformRegistryKey,
} from "./visualizationPlatformRegistryTypes.ts";

const catalogSeeds = Object.freeze([
  ["VisualizationModules", "Visualization Modules"],
  ["PlatformIdentities", "Platform Identities"],
  ["PlatformContracts", "Platform Contracts"],
  ["PlatformCapabilities", "Platform Capabilities"],
  ["PlatformCompatibilityClasses", "Platform Compatibility Classes"],
  ["PlatformOwnership", "Platform Ownership"],
  ["PlatformBoundaries", "Platform Boundaries"],
  ["LifecycleStates", "Lifecycle States"],
  ["PlatformComposition", "Platform Composition"],
  ["NamespaceCategories", "Namespace Categories"],
  ["PlatformReferences", "Platform References"],
  ["ExtensionClassifications", "Extension Classifications"],
  ["RegistryCategories", "Registry Categories"],
  ["RegistryMetadata", "Registry Metadata"],
  ["StabilityCategories", "Stability Categories"],
  ["VersionCategories", "Version Categories"],
] as const satisfies readonly [VisualizationPlatformRegistryKey, string][]);

const foundation = VisualizationPlatformFoundationPlatform;

export const VisualizationPlatformRegistryCatalog:
readonly VisualizationPlatformRegistryEntry[] = Object.freeze(catalogSeeds.map(
  ([key, displayName], index) => Object.freeze({
    id: `EVE-8:2/Registry/${key}` as const,
    key,
    canonicalKey: key,
    displayName,
    description: `Canonical Visualization Platform registry for ${displayName.toLowerCase()}.`,
    foundationContractReference: foundation.contracts[index]!,
    moduleReference: foundation.composition[index % foundation.composition.length]!,
    ownershipReference: foundation.ownership,
    boundaryReference: foundation.boundaries,
    lifecycleApplicability: foundation.lifecycle,
    capabilityApplicability: foundation.capabilities,
    namespace:
      `nexora.eve.visualization-platform.registry.${key.toLowerCase()}` as const,
    stability: "Stable" as const,
    version: "1.0.0" as const,
    extensionClassification: `${key}Extension`,
    deterministicOrder: index + 1,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

export const VisualizationPlatformRegistryCategories:
readonly VisualizationPlatformRegistryCategory[] = Object.freeze(
  foundation.contracts.map((contract, index) => Object.freeze({
    id: `EVE-8:2/Category/${contract.canonicalName.replaceAll(" ", "")}` as const,
    canonicalName: contract.canonicalName,
    description: `Foundation-derived category for ${contract.canonicalName}.`,
    foundationReference: contract,
    immutableCollection: Object.freeze([contract]),
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

export const VisualizationPlatformModuleRegistry = Object.freeze(
  foundation.composition.map((module, index) => Object.freeze({
    id: `EVE-8:2/Module/${index + 1}` as const,
    canonicalName: module.name,
    foundationModuleReference: module,
    publicIndexReference: module.publicIndex,
    release: module.release,
    deterministicOrder: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
