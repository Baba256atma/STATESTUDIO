export interface TimelineVisualizationManifestGuarantee {
  readonly id: `EVE-4:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-4:4/TimelineVisualizationValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationManifestCompatibilityEntry {
  readonly id: `EVE-4:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationManifestReadinessEntry {
  readonly id: `EVE-4:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
