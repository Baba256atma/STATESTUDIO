/** EX-3:6 Platform contracts and eligibility reason catalogue. */

import type {
  ExecutiveTimelineExperiencePlatformContract,
  ExecutiveTimelineExperiencePlatformReasonCode,
} from "./executiveTimelineExperiencePlatformTypes.ts";

export const ExecutiveTimelineExperiencePlatformEligibilityValues = Object.freeze(
  ["Eligible", "Ineligible"] as const,
);

export const ExecutiveTimelineExperiencePlatformReasonCodes = Object.freeze([
  "ManifestMissing",
  "ManifestMalformed",
  "ManifestCloned",
  "ManifestIdentityMismatch",
  "ManifestReadinessMismatch",
  "CapabilityBindingIncomplete",
  "ContractIncomplete",
  "LifecycleInvalid",
  "MetadataIntegrityFailure",
  "UpstreamReadinessMismatch",
] as const satisfies readonly ExecutiveTimelineExperiencePlatformReasonCode[]);

const detailByCode: Readonly<
  Record<ExecutiveTimelineExperiencePlatformReasonCode, string>
> = Object.freeze({
  ManifestMissing: "The canonical Manifest is missing.",
  ManifestMalformed: "The Platform input or Manifest is malformed.",
  ManifestCloned: "The Manifest is not the exact canonical aggregate reference.",
  ManifestIdentityMismatch: "The Manifest identity does not match.",
  ManifestReadinessMismatch: "The Manifest readiness is not ReadyForPlatform.",
  CapabilityBindingIncomplete:
    "Capability bindings are incomplete or misordered.",
  ContractIncomplete: "Platform contracts are incomplete.",
  LifecycleInvalid: "Lifecycle state is not ReadyForCertification.",
  MetadataIntegrityFailure: "Platform metadata integrity checks failed.",
  UpstreamReadinessMismatch:
    "Upstream Manifest readiness is not ReadyForPlatform.",
});

export const ExecutiveTimelineExperiencePlatformReasonDefinitions =
  Object.freeze(
    ExecutiveTimelineExperiencePlatformReasonCodes.map((code, index) =>
      Object.freeze({
        code,
        order: index + 1,
        detail: detailByCode[code],
      })
    ),
  );

export const ExecutiveTimelineExperiencePlatformContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-3:6/Contract/Upstream",
    name: "Upstream",
    order: 1,
    subject:
      "Platform consumes only the exact EX-3:5 Manifest aggregate.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Platform",
    name: "Platform",
    order: 2,
    subject: "Platform remains a metadata-only certification preparation surface.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Metadata",
    name: "Metadata",
    order: 3,
    subject: "Platform metadata remains immutable and side-effect free.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Boundary",
    name: "Boundary",
    order: 4,
    subject:
      "Architectural boundaries prohibit runtime, UI, RTC, and providers.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Authorization",
    name: "Authorization",
    order: 5,
    subject:
      "ReadyForCertification does not authorize EX-3:7 Certification.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Capability",
    name: "Capability",
    order: 6,
    subject:
      "Each Manifest capability has exactly one immutable Platform binding.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Dependency",
    name: "Dependency",
    order: 7,
    subject: "Dependency summary remains Manifest-rooted and descriptive.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Lifecycle",
    name: "Lifecycle",
    order: 8,
    subject: "Lifecycle advances forward-only through five immutable states.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Readiness",
    name: "Readiness",
    order: 9,
    subject: "Readiness equals ReadyForCertification without runtime authority.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:6/Contract/Aggregate",
    name: "Aggregate",
    order: 10,
    subject:
      "Platform aggregate publishes sealed bindings, contracts, and eligibility.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveTimelineExperiencePlatformContract[]);

export const ExecutiveTimelineExperiencePlatformContractCount = 10 as const;

export const createExecutiveTimelineExperiencePlatformReason = (
  code: ExecutiveTimelineExperiencePlatformReasonCode,
) =>
  Object.freeze({
    reasonId: `EX-3:6/Reason/${code}` as const,
    code,
    order: ExecutiveTimelineExperiencePlatformReasonCodes.indexOf(code) + 1,
    detail: detailByCode[code],
    safeStructuralDetailOnly: true as const,
    echoesInput: false as const,
    immutable: true as const,
  });
