export interface AnimationEffectsManifestGuarantee {
  readonly id: `EVE-7:5/Guarantee/${string}`;
  readonly name: string;
  readonly description: string;
  readonly guaranteed: true;
  readonly evidenceReference: "EVE-7:4/AnimationEffectsValidation";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsManifestCompatibilityEntry {
  readonly id: `EVE-7:5/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsManifestReadinessEntry {
  readonly id: `EVE-7:5/Readiness/${string}`;
  readonly name: string;
  readonly ready: true;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
