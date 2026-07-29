/**
 * EX-2 Tier-0 Synthetic Metadata — identity and fail-closed guards.
 *
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

export const ExecutiveJournalSyntheticMetadataPackageId =
  "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage" as const;

export const ExecutiveJournalSyntheticMetadataConsumerId =
  "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer" as const;

export const ExecutiveJournalSyntheticMetadataConsumerNamespace =
  "nexora.ex.executive.journal.synthetic.metadata.consumer" as const;

export const ExecutiveJournalSyntheticMetadataConsumerAliases = Object.freeze([
  "ExecutiveJournalSyntheticMetadataConsumer",
  "EX-2:T0",
] as const);

export const ExecutiveJournalSyntheticMetadataFormerConsumerId =
  "EX2-SYNTHETIC-TIER0-CONSUMER-01" as const;

export const ExecutiveJournalSyntheticMetadataProviderId =
  "EX-2:T0/ExecutiveJournalSyntheticMetadataProvider" as const;

export const ExecutiveJournalSyntheticMetadataProviderNamespace =
  "nexora.ex.executive.journal.synthetic.metadata.provider" as const;

export const ExecutiveJournalSyntheticMetadataAdapterId =
  "EX-2:T0/ExecutiveJournalSyntheticMetadataPrivacyAdapter" as const;

export const ExecutiveJournalSyntheticMetadataAdapterNamespace =
  "nexora.ex.executive.journal.synthetic.metadata.adapter" as const;

export const ExecutiveJournalSyntheticMetadataViewContractId =
  "EX-2:T0/ExecutiveJournalSyntheticMetadataViewContract" as const;

export const ExecutiveJournalSyntheticMetadataViewContractNamespace =
  "nexora.ex.executive.journal.synthetic.metadata.view" as const;

export const ExecutiveJournalSyntheticProjectionSchemaVersion =
  "ex2-tier0-synthetic-projection/v1" as const;

export const ExecutiveJournalSyntheticProviderVersion =
  "ex2-tier0-synthetic-provider/v1" as const;

export const ExecutiveJournalSyntheticSourceClassificationValue =
  "SyntheticSourceOnly" as const;

export const ExecutiveJournalSyntheticMetadataPackageStatus =
  "SyntheticContractPackage" as const;

/**
 * Post-certification readiness. Pre-certification value was
 * ReadyForTier0ContractVerification (recorded on the certification record).
 */
export const ExecutiveJournalSyntheticMetadataPackageReadiness =
  "ReadyForTier0UiAuthorizationAssessment" as const;

export const ExecutiveJournalSyntheticMetadataPreCertificationReadiness =
  "ReadyForTier0ContractVerification" as const;

export const ExecutiveJournalSyntheticMetadataIdentity = Object.freeze({
  packageId: ExecutiveJournalSyntheticMetadataPackageId,
  consumerId: ExecutiveJournalSyntheticMetadataConsumerId,
  consumerNamespace: ExecutiveJournalSyntheticMetadataConsumerNamespace,
  consumerAliases: ExecutiveJournalSyntheticMetadataConsumerAliases,
  formerConsumerIdNotCanonical: ExecutiveJournalSyntheticMetadataFormerConsumerId,
  formerConsumerIdApproved: false as const,
  providerId: ExecutiveJournalSyntheticMetadataProviderId,
  providerNamespace: ExecutiveJournalSyntheticMetadataProviderNamespace,
  adapterId: ExecutiveJournalSyntheticMetadataAdapterId,
  adapterNamespace: ExecutiveJournalSyntheticMetadataAdapterNamespace,
  viewContractId: ExecutiveJournalSyntheticMetadataViewContractId,
  viewContractNamespace: ExecutiveJournalSyntheticMetadataViewContractNamespace,
  projectionSchemaVersion: ExecutiveJournalSyntheticProjectionSchemaVersion,
  providerVersion: ExecutiveJournalSyntheticProviderVersion,
  sourceClassification: ExecutiveJournalSyntheticSourceClassificationValue,
  status: ExecutiveJournalSyntheticMetadataPackageStatus,
  readiness: ExecutiveJournalSyntheticMetadataPackageReadiness,
  preCertificationReadiness:
    ExecutiveJournalSyntheticMetadataPreCertificationReadiness,
  authorizationId: "EX2-AUTH-T0-2026-07-26-01" as const,
  privacyReviewId: "EX2-T0-PRIVACY-REVIEW-01" as const,
  authorityReviewId: "EX2-T0-AUTHORITY-REVIEW-01" as const,
  governanceDecisionId: "GOV-EX2-T0-01" as const,
  certificationId: "EX2-CERT-T0-2026-07-26-01" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const assertExecutiveJournalSyntheticMetadataConsumerId = (
  value: string,
): typeof ExecutiveJournalSyntheticMetadataConsumerId => {
  if (value !== ExecutiveJournalSyntheticMetadataConsumerId) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic consumer ID fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalSyntheticMetadataConsumerId;
};

export const assertExecutiveJournalSyntheticMetadataConsumerAlias = (
  value: string,
): (typeof ExecutiveJournalSyntheticMetadataConsumerAliases)[number] => {
  if (
    !(
      ExecutiveJournalSyntheticMetadataConsumerAliases as readonly string[]
    ).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic consumer alias fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as (typeof ExecutiveJournalSyntheticMetadataConsumerAliases)[number];
};

export const assertExecutiveJournalSyntheticMetadataPackageId = (
  value: string,
): typeof ExecutiveJournalSyntheticMetadataPackageId => {
  if (value !== ExecutiveJournalSyntheticMetadataPackageId) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic package ID fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalSyntheticMetadataPackageId;
};

const SYNTHETIC_REF_PATTERN = /^syn-(journal|entry|provenance|correction|supersession)-[0-9]{3}$/;

const REJECTED_REF_PATTERNS = Object.freeze([
  /^https?:\/\//i,
  /^file:\/\//i,
  /^[A-Za-z]:\\/,
  /^\//,
  /^\.\.?(\/|\\)/,
  /@/,
  /\s/,
  /^prod-/i,
  /^rtc2-/i,
  /^uuid:/i,
  /^urn:/i,
]);

export const isExecutiveJournalSyntheticSafeReference = (
  value: unknown,
): value is string => {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }
  for (const pattern of REJECTED_REF_PATTERNS) {
    if (pattern.test(value)) {
      return false;
    }
  }
  return SYNTHETIC_REF_PATTERN.test(value);
};

export const assertExecutiveJournalSyntheticSafeReference = (
  value: string,
): string => {
  if (!isExecutiveJournalSyntheticSafeReference(value)) {
    throw new Error(
      `Unsafe EX-2 Tier-0 synthetic reference fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value;
};
