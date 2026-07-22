export interface VisualizationSuiteCertificationCriterion {
  readonly id: `EVE-9:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-9:6/VisualizationSuitePlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteCertificationGate {
  readonly id: `EVE-9:7/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteCertificationCompatibilityEntry {
  readonly id: `EVE-9:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
