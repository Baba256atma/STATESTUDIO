export interface DirectorCertificationCriterion {
  readonly id: `DIRECTOR-1:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: string;
  readonly deterministicOrder: number;
  readonly verification: "DescriptiveOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorCertificationGate {
  readonly id: `DIRECTOR-1:7/Gate/${string}`;
  readonly name: string;
  readonly description: string;
  readonly status: "Certified";
  readonly result: "Passed";
  readonly evidenceReference: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DirectorCertificationCompatibilityEntry {
  readonly id: `DIRECTOR-1:7/Compatibility/${string}`;
  readonly name: string;
  readonly platformReference: string;
  readonly compatible: true;
  readonly deterministicOrder: number;
  readonly derivedFromPlatform: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

