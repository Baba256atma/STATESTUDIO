import type * as Foundation from "./visualizationSuiteFoundation.ts";

export type VisualizationSuiteRegistryKey =
  | "VisualizationSuite" | "VisualizationPlatforms"
  | "PublicIndexReferences" | "SuiteIdentities" | "SuiteContracts"
  | "SuiteCapabilities" | "CompatibilityClasses" | "Ownership"
  | "ArchitecturalBoundaries" | "LifecycleStates" | "SuiteComposition"
  | "NamespaceCategories" | "ExtensionClassifications"
  | "RegistryCategories" | "RegistryMetadata" | "VersionMetadata";

type FoundationContract =
  typeof Foundation.VisualizationSuiteFoundationPlatform.contracts[number];
type FoundationPlatform =
  typeof Foundation.VisualizationSuiteFoundationPlatform.composition[number];

export interface VisualizationSuiteRegistryEntry {
  readonly id: `EVE-9:2/Registry/${VisualizationSuiteRegistryKey}`;
  readonly key: VisualizationSuiteRegistryKey;
  readonly canonicalKey: string;
  readonly displayName: string;
  readonly description: string;
  readonly foundationContractReference: FoundationContract;
  readonly platformReference: FoundationPlatform;
  readonly publicIndexReference: unknown;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly namespace: `nexora.eve.visualization-suite.registry.${string}`;
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteRegistryCategory {
  readonly id: `EVE-9:2/Category/${string}`;
  readonly canonicalName: string;
  readonly description: string;
  readonly foundationReference: FoundationContract;
  readonly immutableCollection: readonly FoundationContract[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
