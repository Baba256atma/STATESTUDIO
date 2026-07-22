export interface AnimationEffectsFreezeLock {
  readonly id: `EVE-7:8/Lock/${string}`;
  readonly canonicalName: string;
  readonly lockIdentifier: "EVE-7-ANIMATION-EFFECTS-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsFrozenBaseline {
  readonly id: `EVE-7:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsFreezeDeclaration {
  readonly id: `EVE-7:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsFreezeRegistryEntry {
  readonly id: `EVE-7:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-7:7/AnimationEffectsCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
