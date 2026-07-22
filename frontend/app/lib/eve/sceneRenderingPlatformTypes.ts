export interface SceneRenderingPlatformCapability {
  readonly id: `EVE-2:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: "EVE-2:5/SceneRenderingManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingPlatformGuarantee {
  readonly id: `EVE-2:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: "EVE-2:5/SceneRenderingManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingPlatformCompatibilityEntry {
  readonly id: `EVE-2:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeCheck: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
