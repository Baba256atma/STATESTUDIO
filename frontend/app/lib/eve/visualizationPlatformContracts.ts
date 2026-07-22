import { VisualizationPlatformFoundationBoundaries } from "./visualizationPlatformBoundaries.ts";
import type {
  VisualizationPlatformFoundationContractDeclaration,
  VisualizationPlatformFoundationContractName,
} from "./visualizationPlatformFoundationTypes.ts";
import { VisualizationPlatformFoundationLifecycle } from "./visualizationPlatformLifecycle.ts";
import { VisualizationPlatformFoundationOwnership } from "./visualizationPlatformOwnership.ts";

const capabilityNames = Object.freeze([
  "Platform composition", "Module aggregation", "Metadata publication",
  "Compatibility publication", "Identity preservation",
  "Namespace preservation", "Platform summary", "Dependency publication",
  "Readiness publication", "Extension publication",
] as const);

export const VisualizationPlatformFoundationCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-8:1/Capability/${index + 1}` as const,
    name,
    description: `Descriptive Visualization Platform capability: ${name}.`,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);

const contractSeeds = Object.freeze([
  ["VisualizationPlatformIdentity", ["stableId", "canonicalName", "namespace"]],
  ["VisualizationPlatformContract", ["identityReference", "compositionReference", "readinessReference"]],
  ["PlatformCompositionContract", ["moduleReferences", "canonicalOrder", "compatibilityReference"]],
  ["VisualizationModuleContract", ["moduleIdentity", "publicIndexReference", "namespaceReference"]],
  ["PlatformCapabilityContract", ["capabilityIdentity", "capabilityIntent", "moduleApplicability"]],
  ["PlatformCompatibilityContract", ["compatibilityIdentity", "moduleReferences", "preservationIntent"]],
  ["PlatformExtensionContract", ["extensionIdentity", "extensionIntent", "compatibilityReference"]],
  ["PlatformBoundaryContract", ["boundaryIdentity", "ownershipReference", "exclusionIntent"]],
  ["PlatformOwnershipContract", ["ownerIdentity", "ownedMetadata", "excludedRuntime"]],
  ["PlatformLifecycleContract", ["lifecycleIdentity", "stateReferences", "orderingIntent"]],
  ["PlatformMetadataContract", ["platformIdentity", "inventoryReference", "dependencyReference"]],
  ["PlatformVersionContract", ["versionIdentity", "compatibilityReference", "stabilityIntent"]],
  ["PlatformReadinessContract", ["readinessIdentity", "statusReference", "registryIntent"]],
  ["PlatformSummaryContract", ["summaryIdentity", "compositionReference", "inventoryReference"]],
  ["PlatformReferenceContract", ["referenceIdentity", "publicIndexReference", "canonicalSource"]],
  ["PlatformNamespaceContract", ["namespaceIdentity", "moduleNamespaces", "orderingIntent"]],
] as const satisfies readonly [VisualizationPlatformFoundationContractName,
  readonly string[]][]);

export const VisualizationPlatformFoundationContracts:
readonly VisualizationPlatformFoundationContractDeclaration[] = Object.freeze(
  contractSeeds.map(([name, structuralMetadata], index) => Object.freeze({
    id: `EVE-8:1/Contract/${name}` as const,
    canonicalName: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    namespace:
      `nexora.eve.visualization-platform.foundation.contract.${name.toLowerCase()}` as const,
    version: "1.0.0" as const,
    ownership: VisualizationPlatformFoundationOwnership,
    lifecycle: VisualizationPlatformFoundationLifecycle,
    capabilityReferences: VisualizationPlatformFoundationCapabilities,
    boundaryReferences: VisualizationPlatformFoundationBoundaries,
    structuralMetadata: Object.freeze([...structuralMetadata]),
    compatibilityMetadata: Object.freeze({
      releasedVisualizationModulesCompatible: true as const,
    }),
    extensionMetadata: Object.freeze({ classification: `${name}Extension` }),
    deterministicOrder: index + 1,
    executableBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
