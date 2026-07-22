export interface VisualizationSuiteManifestGuarantee {
  readonly id: `EVE-9:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-9:4/VisualizationSuiteValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteManifestCompatibilityEntry {
  readonly id: `EVE-9:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteManifestReadinessEntry {
  readonly id: `EVE-9:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
