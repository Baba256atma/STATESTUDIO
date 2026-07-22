export interface VisualizationPlatformManifestGuarantee {
  readonly id: `EVE-8:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-8:4/VisualizationPlatformValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformManifestCompatibilityEntry {
  readonly id: `EVE-8:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformManifestReadinessEntry {
  readonly id: `EVE-8:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
