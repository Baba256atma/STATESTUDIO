export interface SceneRenderingRegistryEntry {
  readonly id: `EVE-2:2/${string}/${string}`;
  readonly key: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: string;
  readonly foundationContractReference: `EVE-2:1/Contract/${string}`;
  readonly ownershipReference: "EVE-2:1/SceneRenderingOwnership";
  readonly boundaryReference: "EVE-2:1/SceneRenderingBoundaries";
  readonly lifecycleApplicability: readonly string[];
  readonly capabilityApplicability: readonly string[];
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly extensionClassification: string | null;
  readonly deprecated: false;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingRegistryCategory {
  readonly id: `EVE-2:2/Category/${string}`;
  readonly canonicalName: string;
  readonly description: string;
  readonly foundationReference: `EVE-2:1/Contract/${string}`;
  readonly ownershipReference: "EVE-2:1/SceneRenderingOwnership";
  readonly deterministicOrder: number;
  readonly entryCollection: readonly SceneRenderingRegistryEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingRegistryPolicy {
  readonly id: `EVE-2:2/Policy/${string}`;
  readonly name: string;
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

