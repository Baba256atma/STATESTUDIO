export interface AnimationEffectsCertificationCriterion {
  readonly id: `EVE-7:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-7:6/AnimationEffectsPlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsCertificationGate {
  readonly id: `EVE-7:7/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AnimationEffectsCertificationCompatibilityEntry {
  readonly id: `EVE-7:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
