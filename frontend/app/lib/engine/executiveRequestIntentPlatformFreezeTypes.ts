export type ExecutiveRequestIntentFreezeStatus = "Frozen";
export type ExecutiveRequestIntentReleaseStatus = "ReadyForPublicIndex";

export interface ExecutiveRequestIntentFreezeRegistryEntry {
  readonly identifier: `eng-2-freeze-${string}`;
  readonly phase: "ENG-2:1" | "ENG-2:2" | "ENG-2:3" | "ENG-2:4" | "ENG-2:5" | "ENG-2:6" | "ENG-2:7";
  readonly namespace: string;
  readonly version: "1.0.0";
  readonly owner: "ENG-2";
  readonly freezeStatus: ExecutiveRequestIntentFreezeStatus;
  readonly releaseStatus: ExecutiveRequestIntentReleaseStatus;
  readonly publicDependencyReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export type ExecutiveRequestIntentFreezeRegistry = readonly ExecutiveRequestIntentFreezeRegistryEntry[];

export interface ExecutiveRequestIntentCompatibility {
  readonly identifier: `eng-2-freeze-compatibility-${string}`;
  readonly target: string;
  readonly compatibilityStatus: "Compatible" | "Ready";
  readonly ownershipSafety: "Protected";
  readonly namespaceStability: "Stable";
  readonly publicApiStability: "Stable";
  readonly releaseReadiness: ExecutiveRequestIntentReleaseStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveRequestIntentFreezeSummary {
  readonly registryEntryCount: 7;
  readonly frozenEntryCount: 7;
  readonly compatibilityCount: 7;
  readonly dependencyCount: 7;
  readonly freezeStatus: "Frozen";
  readonly certificationStatus: "Certified";
  readonly runtimeClassification: "MetadataOnly";
  readonly publicApiStatus: "PublicApiStable";
  readonly ownershipStatus: "OwnershipProtected";
  readonly namespaceStatus: "NamespaceStable";
  readonly releaseStatus: "ReadyForPublicIndex";
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveRequestIntentPlatformFreeze {
  readonly registry: ExecutiveRequestIntentFreezeRegistry;
  readonly compatibility: readonly ExecutiveRequestIntentCompatibility[];
  readonly manifest: object;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
