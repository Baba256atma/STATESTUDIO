import type {
  ExecutiveJournalExperiencePlatformCapabilityBinding,
  ExecutiveJournalExperiencePlatformConsumerBinding,
  ExecutiveJournalExperiencePlatformNonCapabilityEnforcement,
} from "./executiveJournalExperiencePlatformTypes.ts";

export const createExecutiveJournalExperiencePlatformBindings = (manifest: {
  readonly capabilities: readonly unknown[];
  readonly nonCapabilities: readonly unknown[];
}) => {
  const capabilityBindings = Object.freeze(manifest.capabilities.map((manifestCapability, index) =>
    Object.freeze({
      bindingId: `EX26-CAP-BIND-${String(index + 1).padStart(2, "0")}`,
      order: index + 1,
      bindingKind: "CapabilityExposure",
      manifestCapability,
      exposure: "Exposed",
      exactManifestReferenceRequired: true,
      metadataOnly: true,
      runtimeImplementation: false,
      createsAuthority: false,
      productionApplicable: false,
      immutable: true,
    } satisfies ExecutiveJournalExperiencePlatformCapabilityBinding)));
  const nonCapabilityEnforcement = Object.freeze(manifest.nonCapabilities.map((manifestNonCapability, index) =>
    Object.freeze({
      enforcementId: `EX26-NONCAP-ENFORCE-${String(index + 1).padStart(2, "0")}`,
      order: index + 1,
      bindingKind: "NonCapabilityEnforcement",
      manifestNonCapability,
      exposure: "Prohibited",
      exactManifestReferenceRequired: true,
      metadataOnly: true,
      productionApplicable: false,
      immutable: true,
    } satisfies ExecutiveJournalExperiencePlatformNonCapabilityEnforcement)));
  return Object.freeze({ capabilityBindings, nonCapabilityEnforcement });
};

export const ExecutiveJournalExperiencePlatformConsumerBindingFields = Object.freeze([
  "consumerIdentity", "manifestIdentity", "allowedCapabilityReferences",
  "prohibitedCapabilityReferences", "accessClassification", "sourceClassification",
  "isolationRequirement", "compatibilityStatus", "authorizationEvidence",
  "certificationRequirement",
] as const);

export const createExecutiveJournalExperiencePlatformConsumerBinding = (input: {
  readonly consumerIdentity: unknown;
  readonly manifestIdentity: unknown;
  readonly allowedCapabilityReferences: unknown;
  readonly prohibitedCapabilityReferences: unknown;
  readonly accessClassification: unknown;
  readonly sourceClassification: unknown;
  readonly isolationRequirement: unknown;
  readonly authorizationEvidence: unknown;
}): ExecutiveJournalExperiencePlatformConsumerBinding | null => {
  if (
    input.consumerIdentity !== "EX-2:6/AuthorizedMetadataConsumer"
    || input.manifestIdentity !== "EX-2:5/ExecutiveJournalExperienceManifest"
    || !Array.isArray(input.allowedCapabilityReferences)
    || !Array.isArray(input.prohibitedCapabilityReferences)
    || input.accessClassification !== "MetadataOnlyAccess"
    || input.sourceClassification !== "SyntheticEvidenceReferenceOnly"
    || input.isolationRequirement !== "MetadataOnlyIsolated"
    || input.authorizationEvidence !== "AD-EX2-14"
  ) return null;
  return Object.freeze({
    consumerIdentity: input.consumerIdentity,
    manifestIdentity: input.manifestIdentity,
    allowedCapabilityReferences: Object.freeze([...input.allowedCapabilityReferences]),
    prohibitedCapabilityReferences: Object.freeze([...input.prohibitedCapabilityReferences]),
    accessClassification: input.accessClassification,
    sourceClassification: input.sourceClassification,
    isolationRequirement: input.isolationRequirement,
    compatibilityStatus: "Compatible",
    authorizationEvidence: input.authorizationEvidence,
    certificationRequirement: "SeparateEX27AuthorizationRequired",
  });
};
