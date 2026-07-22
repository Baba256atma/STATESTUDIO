export interface GraphVisualizationRegistryEntry {
  readonly id: `EVE-3:2/${string}/${string}`;
  readonly key: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: string;
  readonly foundationContractReference: `EVE-3:1/Contract/${string}`;
  readonly ownershipReference: "EVE-3:1/GraphVisualizationOwnership";
  readonly boundaryReferences: readonly string[];
  readonly lifecycleApplicability: readonly string[];
  readonly capabilityReferences: readonly string[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string | null;
  readonly deprecated: false;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationRegistryCategory {
  readonly id: `EVE-3:2/Category/${string}`;
  readonly key: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly foundationContract: {
    readonly id: `EVE-3:1/Contract/${string}`;
    readonly name: string;
    readonly description: string;
    readonly fields: readonly string[];
    readonly deterministicOrder: number;
    readonly runtimeBehavior: "None";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly ownershipReference: "EVE-3:1/GraphVisualizationOwnership";
  readonly deterministicOrder: number;
  readonly entryCollection: readonly GraphVisualizationRegistryEntry[];
  readonly extensionEligible: boolean;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationRegistryPolicy {
  readonly id: `EVE-3:2/Policy/${string}`;
  readonly name: string;
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
