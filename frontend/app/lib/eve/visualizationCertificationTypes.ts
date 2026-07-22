export type VisualizationCertificationResult = "Certified" | "NotCertified" | "NotEvaluated";

export interface VisualizationCertificationCriterion {
  readonly id: `EVE-1:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: string;
  readonly expectedResult: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationCertificationGate {
  readonly id: `EVE-1:7/Gate/${string}`;
  readonly name: string;
  readonly result: "Certified";
  readonly status: "Passed";
  readonly platformReference: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationCertificationCompatibilityEntry {
  readonly id: `EVE-1:7/Compatibility/${string}`;
  readonly name: string;
  readonly certified: true;
  readonly platformReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

