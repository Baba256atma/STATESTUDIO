export interface DirectorPlatformChainEntry {
  readonly id: `DIRECTOR-1:6/Chain/${string}`;
  readonly phase: string;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorPlatformRegistryEntry {
  readonly id: `DIRECTOR-1:6/Registry/${string}`;
  readonly architectureLayer: string;
  readonly canonicalReference: string;
  readonly source: "DirectorManifest";
  readonly deterministicOrder: number;
  readonly duplicatesMetadata: false;
  readonly immutable: true;
}

export interface DirectorPlatformCompatibilityEntry {
  readonly id: `DIRECTOR-1:6/Compatibility/${string}`;
  readonly name: string;
  readonly sourceReference: string;
  readonly compatible: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

