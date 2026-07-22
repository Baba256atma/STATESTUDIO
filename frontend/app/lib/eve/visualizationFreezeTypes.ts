export interface VisualizationFreezeLock {
  readonly id: `EVE-1:8/Lock/${string}`;
  readonly name: string;
  readonly lockIdentifier: "EVE-1-VISUALIZATION-LOCKED";
  readonly status: "Locked";
  readonly certificationReference: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationFrozenBaseline {
  readonly id: `EVE-1:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationFreezeRegistryEntry {
  readonly id: `EVE-1:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: string;
  readonly source: "VisualizationCertification";
  readonly deterministicOrder: number;
  readonly copiesMetadata: false;
  readonly immutable: true;
}

