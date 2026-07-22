export interface VisualizationManifestGuarantee {
  readonly id: `EVE-1:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationManifestReadinessEntry {
  readonly id: `EVE-1:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationManifestCompatibilityEntry {
  readonly id: `EVE-1:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

