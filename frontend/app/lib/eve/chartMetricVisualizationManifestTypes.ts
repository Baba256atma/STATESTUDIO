export interface ChartMetricVisualizationManifestGuarantee {
  readonly id: `EVE-5:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-5:4/ChartMetricVisualizationValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationManifestCompatibilityEntry {
  readonly id: `EVE-5:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationManifestReadinessEntry {
  readonly id: `EVE-5:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
