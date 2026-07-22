export type VisualizationPlatformFoundationContractName =
  | "VisualizationPlatformIdentity" | "VisualizationPlatformContract"
  | "PlatformCompositionContract" | "VisualizationModuleContract"
  | "PlatformCapabilityContract" | "PlatformCompatibilityContract"
  | "PlatformExtensionContract" | "PlatformBoundaryContract"
  | "PlatformOwnershipContract" | "PlatformLifecycleContract"
  | "PlatformMetadataContract" | "PlatformVersionContract"
  | "PlatformReadinessContract" | "PlatformSummaryContract"
  | "PlatformReferenceContract" | "PlatformNamespaceContract";

export type VisualizationPlatformFoundationLifecycleState =
  | "Declared" | "Registered" | "Modeled" | "Validated" | "Published";

export interface VisualizationPlatformFoundationContractDeclaration {
  readonly id:
    `EVE-8:1/Contract/${VisualizationPlatformFoundationContractName}`;
  readonly canonicalName: string;
  readonly namespace:
    `nexora.eve.visualization-platform.foundation.contract.${string}`;
  readonly version: "1.0.0";
  readonly ownership: unknown;
  readonly lifecycle: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly boundaryReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly compatibilityMetadata: Readonly<{
    releasedVisualizationModulesCompatible: true;
  }>;
  readonly extensionMetadata: Readonly<{ classification: string }>;
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
