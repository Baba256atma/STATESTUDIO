import type * as Registry from "./visualizationSuiteRegistry.ts";

export type VisualizationSuiteModelName =
  | "VisualizationSuiteModel" | "SuiteCompositionModel"
  | "VisualizationPlatformModel" | "PublicIndexReferenceModel"
  | "SuiteCapabilityModel" | "SuiteCompatibilityModel"
  | "SuiteOwnershipModel" | "SuiteBoundaryModel"
  | "SuiteLifecycleModel" | "NamespaceDescriptorModel"
  | "ExtensionDescriptorModel" | "RegistryReferenceModel"
  | "SuiteIdentityModel" | "SuiteMetadataModel"
  | "SuiteVersionModel" | "SuiteSummaryModel"
  | "SuiteInventoryModel" | "SuiteReadinessModel";

type RegistryEntry =
  typeof Registry.VisualizationSuiteRegistryPlatform.catalog[number];
type RegistryCategory =
  typeof Registry.VisualizationSuiteRegistryPlatform.categories[number];
type RegistryPlatform =
  typeof Registry.VisualizationSuiteRegistryPlatform.platforms[number];

export interface VisualizationSuiteModelDescriptor {
  readonly id: `EVE-9:3/Model/${VisualizationSuiteModelName}`;
  readonly canonicalName: VisualizationSuiteModelName;
  readonly modelKind: string;
  readonly registryReference: RegistryEntry;
  readonly categoryReference: RegistryCategory;
  readonly platformReference: RegistryPlatform;
  readonly publicIndexReference: unknown;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly namespace: `nexora.eve.visualization-suite.model.${string}`;
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly extensionClassification: string;
  readonly structuralMetadata: readonly string[];
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteModelRelationship {
  readonly id: `EVE-9:3/Relationship/${string}`;
  readonly sourceModel: VisualizationSuiteModelName;
  readonly targetModel: VisualizationSuiteModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-9:2/VisualizationSuiteRegistry";
  readonly deterministicOrder: number;
  readonly orchestrationProvided: false;
  readonly traversalProvided: false;
  readonly resolutionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
