export interface VisualizationPlatformPlatformCapability {
  readonly id: `EVE-8:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: "EVE-8:5/VisualizationPlatformManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformPlatformGuarantee {
  readonly id: `EVE-8:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: "EVE-8:5/VisualizationPlatformManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformPlatformCompatibilityEntry {
  readonly id: `EVE-8:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
