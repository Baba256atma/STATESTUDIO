export interface AnimationEffectsPlatformCapability {
  readonly id: `EVE-7:6/Capability/${string}`;
  readonly name: string;
  readonly description: string;
  readonly manifestReference: "EVE-7:5/AnimationEffectsManifest";
  readonly deterministicOrder: number;
  readonly implementationProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsPlatformGuarantee {
  readonly id: `EVE-7:6/Guarantee/${string}`;
  readonly name: string;
  readonly guaranteed: true;
  readonly manifestReference: "EVE-7:5/AnimationEffectsManifest";
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsPlatformCompatibilityEntry {
  readonly id: `EVE-7:6/Compatibility/${string}`;
  readonly name: string;
  readonly compatible: true;
  readonly canonicalReference: string;
  readonly canonicalSource: unknown;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
