export type ExecutiveDecisionRegistryOwner = "ENG-7";
export type ExecutiveDecisionRegistryVersion = "1.0.0";
export type ExecutiveDecisionRegistryPhase = "ENG-7:2";
export type ExecutiveDecisionRegistryNamespace =
  "Nexora.Engine.ExecutiveDecision.Registry";

export type ExecutiveDecisionRegistryEntryId = string;

export type ExecutiveDecisionRegistryEntryStatus =
  | "Registered"
  | "Stable"
  | "Defined"
  | "Protected"
  | "Allowed"
  | "Forbidden";

export interface ExecutiveDecisionRegistryEntry {
  readonly id: ExecutiveDecisionRegistryEntryId;
  readonly name: string;
  readonly description: string;
  readonly namespace: string;
  readonly owner: ExecutiveDecisionRegistryOwner;
  readonly status: ExecutiveDecisionRegistryEntryStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionDomainRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly domainKey: string;
}

export interface ExecutiveDecisionTypeRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly publicName: string;
  readonly applicableDomains: readonly string[];
  readonly lifecycleCompatibility: readonly string[];
}

export interface ExecutiveDecisionCapabilityRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly canonicalName: string;
  readonly owningPhase: "ENG-7:1" | "ENG-7:2";
  readonly foundationCapabilityId: string;
  readonly permittedInputs: readonly string[];
  readonly declaredOutputs: readonly string[];
  readonly lifecycleStages: readonly string[];
  readonly dependencyRequirements: readonly string[];
  readonly prohibitedResponsibilities: readonly string[];
}

export interface ExecutiveDecisionOutputRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly outputKey: string;
  readonly fields: readonly string[];
}

export interface ExecutiveDecisionLifecycleRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly stateId: string;
  readonly allowedPredecessors: readonly string[];
  readonly allowedSuccessors: readonly string[];
  readonly terminal: boolean;
}

export interface ExecutiveDecisionOwnershipRegistryEntry {
  readonly id: string;
  readonly classification: "Owns" | "DoesNotOwn";
  readonly artifact: string;
  readonly owner: string;
  readonly rationale: string;
  readonly status: "Protected";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDecisionDependencyRegistryEntry {
  readonly id: string;
  readonly direction: "Incoming" | "Outgoing" | "Forbidden";
  readonly target: string;
  readonly relationship: string;
  readonly permission: "Allowed" | "Forbidden";
  readonly rationale: string;
  readonly ownershipBoundary: string;
  readonly status: ExecutiveDecisionRegistryEntryStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDecisionPublicContractRegistryEntry extends ExecutiveDecisionRegistryEntry {
  readonly contractKey: string;
  readonly originatingPhase: "ENG-7:1" | "ENG-7:2";
  readonly publicSurface: string;
}

export interface ExecutiveDecisionRegistryMetadata {
  readonly id: "ENG-7:2";
  readonly name: "Executive Decision Registry Platform";
  readonly namespace: ExecutiveDecisionRegistryNamespace;
  readonly version: ExecutiveDecisionRegistryVersion;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveDecisionRegistryOwner;
  readonly previousPhase: "ENG-7:1";
  readonly nextPhase: "ENG-7:3";
  readonly readiness: "ReadyForDecisionModel";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionRegistrySummary {
  readonly registryId: "ENG-7:2";
  readonly phase: ExecutiveDecisionRegistryPhase;
  readonly namespace: ExecutiveDecisionRegistryNamespace;
  readonly owner: ExecutiveDecisionRegistryOwner;
  readonly domainCount: number;
  readonly typeCount: number;
  readonly capabilityCount: number;
  readonly outputCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipEntryCount: number;
  readonly dependencyEntryCount: number;
  readonly publicContractCount: number;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly ownershipStatus: "OwnershipProtected";
  readonly dependencyStatus: "DependencySafe";
  readonly readiness: "ReadyForDecisionModel";
  readonly nextPhase: "ENG-7:3";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}
