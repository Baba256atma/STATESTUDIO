export interface TimelineVisualizationRegistryEntry {
  readonly id: `EVE-4:2/Entry/${string}/${string}`;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly foundationContractReference: unknown;
  readonly ownershipReference: unknown;
  readonly boundaryReferences: readonly unknown[];
  readonly lifecycleApplicability: readonly unknown[];
  readonly capabilityReferences: readonly unknown[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationRegistryCategory {
  readonly id: `EVE-4:2/Category/${string}`;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly foundationContractReference: unknown;
  readonly deterministicOrder: number;
  readonly entries: readonly TimelineVisualizationRegistryEntry[];
  readonly extensionEligible: true;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationRegistryPolicy {
  readonly id: `EVE-4:2/Policy/${string}`;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly enforcement: "DescriptiveOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}
