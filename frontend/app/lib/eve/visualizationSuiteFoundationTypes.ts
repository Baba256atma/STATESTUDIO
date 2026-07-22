export type VisualizationSuiteFoundationContractName =
  | "VisualizationSuiteIdentity" | "VisualizationSuiteContract"
  | "SuiteCompositionContract" | "VisualizationPlatformContract"
  | "SuiteCapabilityContract" | "SuiteCompatibilityContract"
  | "SuiteExtensionContract" | "SuiteBoundaryContract"
  | "SuiteOwnershipContract" | "SuiteLifecycleContract"
  | "SuiteMetadataContract" | "SuiteVersionContract"
  | "SuiteReadinessContract" | "SuiteSummaryContract"
  | "SuiteReferenceContract" | "SuiteNamespaceContract";

export type VisualizationSuiteFoundationLifecycleState =
  | "Declared" | "Registered" | "Modeled" | "Validated" | "Published";

export interface VisualizationSuiteFoundationContractDeclaration {
  readonly id:
    `EVE-9:1/Contract/${VisualizationSuiteFoundationContractName}`;
  readonly canonicalName: string;
  readonly namespace:
    `nexora.eve.visualization-suite.foundation.contract.${string}`;
  readonly version: "1.0.0";
  readonly ownership: unknown;
  readonly lifecycle: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly boundaryReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly compatibilityMetadata: Readonly<{
    releasedVisualizationPlatformsCompatible: true;
  }>;
  readonly extensionMetadata: Readonly<{ classification: string }>;
  readonly deterministicOrder: number;
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
