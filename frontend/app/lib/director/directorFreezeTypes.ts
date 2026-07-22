export interface DirectorFreezeLock {
  readonly lockId: "DIRECTOR-1-LOCKED";
  readonly lockName: "Director Architecture Lock";
  readonly lockVersion: "1.0.0";
  readonly lockStatus: "Locked";
  readonly lockTimestampMetadata: "DeterministicArchitecturalMetadataOnly";
  readonly lockScope: "CompleteCertifiedDirectorArchitecture";
  readonly lockReason: string;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorFreezeRegistryEntry {
  readonly id: `DIRECTOR-1:8/Registry/${string}`;
  readonly architectureLayer: string;
  readonly canonicalReference: string;
  readonly source: "DirectorCertification";
  readonly deterministicOrder: number;
  readonly copiesMetadata: false;
  readonly immutable: true;
}

export interface DirectorFreezeCompatibilityEntry {
  readonly id: `DIRECTOR-1:8/Compatibility/${string}`;
  readonly name: string;
  readonly certificationReference: string;
  readonly compatible: true;
  readonly deterministicOrder: number;
  readonly derivedFromCertification: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

