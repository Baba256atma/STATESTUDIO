export interface TimelineVisualizationCertificationCriterion {
  readonly id: `EVE-4:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-4:6/TimelineVisualizationPlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationCertificationGate {
  readonly id: `EVE-4:7/Gate/${string}`;
  readonly name: string;
  readonly status: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationCertificationCompatibilityEntry {
  readonly id: `EVE-4:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
