export interface VisualizationRegistryEntry {
  readonly id: `EVE-1:2/${string}/${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: "1.0.0";
  readonly namespace: `nexora.eve.registry.${string}`;
  readonly stability: "Stable";
  readonly foundationContractId: `EVE-1:1/Contract/${string}`;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationRegistryCategory {
  readonly id: `EVE-1:2/Category/${string}`;
  readonly name: string;
  readonly foundationContractId: `EVE-1:1/Contract/${string}`;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationRegistryPolicy {
  readonly id: `EVE-1:2/Policy/${string}`;
  readonly name: string;
  readonly description: string;
  readonly enforcement: "DescriptiveOnly";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

