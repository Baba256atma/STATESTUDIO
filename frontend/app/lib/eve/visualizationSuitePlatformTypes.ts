export interface VisualizationSuitePlatformCapability {
  readonly id: `EVE-9:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: "EVE-9:5/VisualizationSuiteManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuitePlatformGuarantee {
  readonly id: `EVE-9:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: "EVE-9:5/VisualizationSuiteManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuitePlatformCompatibilityEntry {
  readonly id: `EVE-9:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
