/** EX-3:6 closed metadata-only Platform types. */

export type ExecutiveTimelineExperiencePlatformEligibility =
  | "Eligible"
  | "Ineligible";

export type ExecutiveTimelineExperiencePlatformLifecycleState =
  | "Draft"
  | "Prepared"
  | "Integrated"
  | "Platform"
  | "ReadyForCertification";

export type ExecutiveTimelineExperiencePlatformReasonCode =
  | "ManifestMissing"
  | "ManifestMalformed"
  | "ManifestCloned"
  | "ManifestIdentityMismatch"
  | "ManifestReadinessMismatch"
  | "CapabilityBindingIncomplete"
  | "ContractIncomplete"
  | "LifecycleInvalid"
  | "MetadataIntegrityFailure"
  | "UpstreamReadinessMismatch";

export type ExecutiveTimelineExperiencePlatformContractName =
  | "Upstream"
  | "Platform"
  | "Metadata"
  | "Boundary"
  | "Authorization"
  | "Capability"
  | "Dependency"
  | "Lifecycle"
  | "Readiness"
  | "Aggregate";

export interface ExecutiveTimelineExperiencePlatformInput {
  readonly manifest: unknown;
  readonly manifestIdentity: unknown;
  readonly manifestReadiness: unknown;
  readonly capabilityBindings: unknown;
  readonly contracts: unknown;
  readonly lifecycleState: unknown;
  readonly metadata: unknown;
  readonly contractsSealed: unknown;
}

export interface ExecutiveTimelineExperiencePlatformReason {
  readonly reasonId: `EX-3:6/Reason/${ExecutiveTimelineExperiencePlatformReasonCode}`;
  readonly code: ExecutiveTimelineExperiencePlatformReasonCode;
  readonly order: number;
  readonly detail: string;
  readonly safeStructuralDetailOnly: true;
  readonly echoesInput: false;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperiencePlatformEligibilityResult {
  readonly platformId: "EX-3:6/ExecutiveTimelineExperiencePlatform";
  readonly eligibility: ExecutiveTimelineExperiencePlatformEligibility;
  readonly eligible: boolean;
  readonly reasonCount: number;
  readonly reasons: readonly ExecutiveTimelineExperiencePlatformReason[];
  readonly metadataOnly: true;
  readonly createsAuthority: false;
  readonly productionAuthorized: false;
  readonly ex37Authorized: false;
  readonly repairedInput: false;
  readonly mutatedInput: false;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperiencePlatformCapabilityBinding {
  readonly bindingId: `EX-3:6/Binding/${string}`;
  readonly order: number;
  readonly manifestCapabilityId: string;
  readonly manifestCapabilityName: string;
  readonly bindingKind: "CapabilityBinding";
  readonly exactManifestReferenceRequired: true;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperiencePlatformContract {
  readonly contractId: `EX-3:6/Contract/${ExecutiveTimelineExperiencePlatformContractName}`;
  readonly name: ExecutiveTimelineExperiencePlatformContractName;
  readonly order: number;
  readonly subject: string;
  readonly descriptiveOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperiencePlatformConsumerBinding {
  readonly consumerBindingId: "EX-3:6/ConsumerBinding";
  readonly supportedConsumers: readonly string[];
  readonly unsupportedConsumers: readonly string[];
  readonly requiredReadiness: "ReadyForCertification";
  readonly prohibitedImports: readonly string[];
  readonly publicReleaseState: "NotReleased";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperiencePlatformSummary {
  readonly identity: "EX-3:6/ExecutiveTimelineExperiencePlatform";
  readonly namespace: "nexora.ex.executive.timeline.experience.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly previousPhase: "EX-3:5 — Executive Timeline Experience Manifest";
  readonly nextPhase: "EX-3:7 — Executive Timeline Experience Certification";
  readonly upstreamDependency: "EX-3:5/ExecutiveTimelineExperienceManifest";
  readonly capabilityBindingCount: 16;
  readonly contractCount: 10;
  readonly eligibility: "Eligible";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly certificationCreated: false;
  readonly certificationAuthorized: false;
}
