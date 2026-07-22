import type * as Foundation from "./visualizationPlatformFoundation.ts";

export type VisualizationPlatformRegistryKey =
  | "VisualizationModules" | "PlatformIdentities" | "PlatformContracts"
  | "PlatformCapabilities" | "PlatformCompatibilityClasses"
  | "PlatformOwnership" | "PlatformBoundaries" | "LifecycleStates"
  | "PlatformComposition" | "NamespaceCategories" | "PlatformReferences"
  | "ExtensionClassifications" | "RegistryCategories" | "RegistryMetadata"
  | "StabilityCategories" | "VersionCategories";

type FoundationContract =
  typeof Foundation.VisualizationPlatformFoundationPlatform.contracts[number];
type FoundationModule =
  typeof Foundation.VisualizationPlatformFoundationPlatform.composition[number];

export interface VisualizationPlatformRegistryEntry {
  readonly id: `EVE-8:2/Registry/${VisualizationPlatformRegistryKey}`;
  readonly key: VisualizationPlatformRegistryKey;
  readonly canonicalKey: string;
  readonly displayName: string;
  readonly description: string;
  readonly foundationContractReference: FoundationContract;
  readonly moduleReference: FoundationModule;
  readonly ownershipReference: unknown;
  readonly boundaryReference: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityApplicability: readonly unknown[];
  readonly namespace: `nexora.eve.visualization-platform.registry.${string}`;
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformRegistryCategory {
  readonly id: `EVE-8:2/Category/${string}`;
  readonly canonicalName: string;
  readonly description: string;
  readonly foundationReference: FoundationContract;
  readonly immutableCollection: readonly FoundationContract[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
