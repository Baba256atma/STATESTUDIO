export interface GraphVisualizationManifestGuarantee {
  readonly id: `EVE-3:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-3:4/GraphVisualizationValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationManifestCompatibilityEntry {
  readonly id: `EVE-3:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationManifestReadinessEntry {
  readonly id: `EVE-3:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly validationReference: "EVE-3:4/GraphVisualizationValidation";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
