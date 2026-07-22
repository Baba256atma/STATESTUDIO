import type * as Registry from "./visualizationPlatformRegistry.ts";

export type VisualizationPlatformModelName =
  | "VisualizationPlatformModel" | "PlatformCompositionModel"
  | "VisualizationModuleModel" | "ModuleReferenceModel"
  | "PlatformCapabilityModel" | "PlatformCompatibilityModel"
  | "PlatformOwnershipModel" | "PlatformBoundaryModel"
  | "PlatformLifecycleModel" | "NamespaceDescriptorModel"
  | "ExtensionDescriptorModel" | "RegistryReferenceModel"
  | "PlatformIdentityModel" | "PlatformMetadataModel"
  | "PlatformVersionModel" | "PlatformSummaryModel"
  | "PlatformInventoryModel" | "PlatformReadinessModel";

type RegistryEntry =
  typeof Registry.VisualizationPlatformRegistryPlatform.catalog[number];
type RegistryCategory =
  typeof Registry.VisualizationPlatformRegistryPlatform.categories[number];
type RegistryModule =
  typeof Registry.VisualizationPlatformRegistryPlatform.modules[number];

export interface VisualizationPlatformModelDescriptor {
  readonly id: `EVE-8:3/Model/${VisualizationPlatformModelName}`;
  readonly canonicalName: VisualizationPlatformModelName;
  readonly modelKind: string;
  readonly registryReference: RegistryEntry;
  readonly categoryReference: RegistryCategory;
  readonly moduleReference: RegistryModule;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly namespace: `nexora.eve.visualization-platform.model.${string}`;
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly extensionClassification: string;
  readonly structuralMetadata: readonly string[];
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformModelRelationship {
  readonly id: `EVE-8:3/Relationship/${string}`;
  readonly sourceModel: VisualizationPlatformModelName;
  readonly targetModel: VisualizationPlatformModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-8:2/VisualizationPlatformRegistry";
  readonly deterministicOrder: number;
  readonly orchestrationProvided: false;
  readonly traversalProvided: false;
  readonly resolutionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
