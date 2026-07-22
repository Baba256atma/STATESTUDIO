export interface GraphVisualizationCertificationCriterion {
  readonly id: `EVE-3:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-3:6/GraphVisualizationPlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationCertificationGate {
  readonly id: `EVE-3:7/Gate/${string}`;
  readonly name: string;
  readonly status: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationCertificationCompatibilityEntry {
  readonly id: `EVE-3:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
