import { VisualizationSuiteFoundationBoundaries } from "./visualizationSuiteBoundaries.ts";
import { VisualizationSuiteFoundationCapabilities } from "./visualizationSuiteCapabilities.ts";
import type {
  VisualizationSuiteFoundationContractDeclaration,
  VisualizationSuiteFoundationContractName,
} from "./visualizationSuiteFoundationTypes.ts";
import { VisualizationSuiteFoundationLifecycle } from "./visualizationSuiteLifecycle.ts";
import { VisualizationSuiteFoundationOwnership } from "./visualizationSuiteOwnership.ts";

const contractSeeds = Object.freeze([
  ["VisualizationSuiteIdentity", ["stableId", "canonicalName", "namespace"]],
  ["VisualizationSuiteContract", ["identityReference", "compositionReference", "readinessReference"]],
  ["SuiteCompositionContract", ["platformReferences", "canonicalOrder", "compatibilityReference"]],
  ["VisualizationPlatformContract", ["platformIdentity", "publicIndexReference", "namespaceReference"]],
  ["SuiteCapabilityContract", ["capabilityIdentity", "capabilityIntent", "platformApplicability"]],
  ["SuiteCompatibilityContract", ["compatibilityIdentity", "platformReferences", "preservationIntent"]],
  ["SuiteExtensionContract", ["extensionIdentity", "extensionIntent", "compatibilityReference"]],
  ["SuiteBoundaryContract", ["boundaryIdentity", "ownershipReference", "exclusionIntent"]],
  ["SuiteOwnershipContract", ["ownerIdentity", "ownedMetadata", "excludedRuntime"]],
  ["SuiteLifecycleContract", ["lifecycleIdentity", "stateReferences", "orderingIntent"]],
  ["SuiteMetadataContract", ["suiteIdentity", "inventoryReference", "dependencyReference"]],
  ["SuiteVersionContract", ["versionIdentity", "compatibilityReference", "stabilityIntent"]],
  ["SuiteReadinessContract", ["readinessIdentity", "statusReference", "registryIntent"]],
  ["SuiteSummaryContract", ["summaryIdentity", "compositionReference", "inventoryReference"]],
  ["SuiteReferenceContract", ["referenceIdentity", "publicIndexReference", "canonicalSource"]],
  ["SuiteNamespaceContract", ["namespaceIdentity", "platformNamespaces", "orderingIntent"]],
] as const satisfies readonly [VisualizationSuiteFoundationContractName,
  readonly string[]][]);

export const VisualizationSuiteFoundationContracts:
readonly VisualizationSuiteFoundationContractDeclaration[] = Object.freeze(
  contractSeeds.map(([name, structuralMetadata], index) => Object.freeze({
    id: `EVE-9:1/Contract/${name}` as const,
    canonicalName: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    namespace:
      `nexora.eve.visualization-suite.foundation.contract.${name.toLowerCase()}` as const,
    version: "1.0.0" as const,
    ownership: VisualizationSuiteFoundationOwnership,
    lifecycle: VisualizationSuiteFoundationLifecycle,
    capabilityReferences: VisualizationSuiteFoundationCapabilities,
    boundaryReferences: VisualizationSuiteFoundationBoundaries,
    structuralMetadata: Object.freeze([...structuralMetadata]),
    compatibilityMetadata: Object.freeze({
      releasedVisualizationPlatformsCompatible: true as const,
    }),
    extensionMetadata: Object.freeze({ classification: `${name}Extension` }),
    deterministicOrder: index + 1,
    executableBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
