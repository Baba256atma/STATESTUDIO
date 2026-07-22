export interface SceneRenderingFreezeLock {
  readonly id: `EVE-2:8/Lock/${string}`;
  readonly name: string;
  readonly lockIdentifier: "EVE-2-SCENE-RENDERING-LOCKED";
  readonly status: "Locked";
  readonly certificationReference: "EVE-2:7/SceneRenderingCertification";
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingFrozenBaseline {
  readonly id: `EVE-2:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingFreezeRegistryEntry {
  readonly id: `EVE-2:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: string;
  readonly source: "SceneRenderingCertification";
  readonly deterministicOrder: number;
  readonly copiesMetadata: false;
  readonly immutable: true;
}
