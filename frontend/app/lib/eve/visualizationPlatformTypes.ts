export interface VisualizationPlatformCapability {
  readonly id: `EVE-1:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: string;
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformGuarantee {
  readonly id: `EVE-1:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformCompatibilityEntry {
  readonly id: `EVE-1:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly manifestReference: string;
  readonly deterministicOrder: number;
  readonly runtimeCheck: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

