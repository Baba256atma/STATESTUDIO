export interface DirectorManifestInventorySection {
  readonly id: `DIRECTOR-1:5/Inventory/${string}`;
  readonly name: string;
  readonly collectionCount: number;
  readonly entryCount: number;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly derived: true;
  readonly immutable: true;
}

export interface DirectorManifestCompatibilityEntry {
  readonly id: `DIRECTOR-1:5/Compatibility/${string}`;
  readonly name: string;
  readonly version: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorManifestReadinessEntry {
  readonly id: `DIRECTOR-1:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

