export interface SceneRenderingManifestGuarantee {
  readonly id: `EVE-2:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-2:4/SceneRenderingValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingManifestReadinessEntry {
  readonly id: `EVE-2:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly evidenceReference: "EVE-2:4/SceneRenderingValidation";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingManifestCompatibilityEntry {
  readonly id: `EVE-2:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeCheck: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
