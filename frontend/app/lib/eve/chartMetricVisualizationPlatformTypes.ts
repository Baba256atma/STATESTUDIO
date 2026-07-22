export interface ChartMetricVisualizationPlatformCapability {
  readonly id: `EVE-5:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: "EVE-5:5/ChartMetricVisualizationManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationPlatformGuarantee {
  readonly id: `EVE-5:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: "EVE-5:5/ChartMetricVisualizationManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationPlatformCompatibilityEntry {
  readonly id: `EVE-5:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
