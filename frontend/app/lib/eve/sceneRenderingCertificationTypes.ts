export type SceneRenderingCertificationOutcome = "Certified" | "NotCertified" | "NotEvaluated";

export interface SceneRenderingCertificationCriterion {
  readonly id: `EVE-2:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-2:6/SceneRenderingPlatform";
  readonly expectedOutcome: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingCertificationGate {
  readonly id: `EVE-2:7/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Certified";
  readonly status: "Passed";
  readonly platformReference: "EVE-2:6/SceneRenderingPlatform";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SceneRenderingCertificationCompatibilityEntry {
  readonly id: `EVE-2:7/Compatibility/${string}`;
  readonly name: string;
  readonly certified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
