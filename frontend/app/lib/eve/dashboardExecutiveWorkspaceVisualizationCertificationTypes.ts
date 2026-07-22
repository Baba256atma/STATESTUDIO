export interface DashboardExecutiveWorkspaceCertificationCriterion {
  readonly id: `EVE-6:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference:
    "EVE-6:6/DashboardExecutiveWorkspaceVisualizationPlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceCertificationGate {
  readonly id: `EVE-6:7/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceCertificationCompatibilityEntry {
  readonly id: `EVE-6:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
