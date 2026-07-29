/**
 * EX-2 Tier-0 Synthetic Metadata Contract Package — canonical aggregate.
 *
 * Pure public API. One-way dependency to architecture authorization metadata.
 * Does not import RTC-2/RTC-3/APP-8. No React UI, networking, or persistence.
 *
 * Authorized by EX2-AUTH-T0-2026-07-26-01.
 */

import {
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  ExecutiveJournalProductArchitectureTier0AuthorityReview,
  ExecutiveJournalProductArchitectureTier0PrivacyReview,
} from "./executiveJournalProductArchitecture.ts";
import {
  adaptExecutiveJournalSyntheticMetadata,
  ExecutiveJournalSyntheticMetadataAdapterContract,
} from "./executiveJournalSyntheticMetadataAdapter.ts";
import {
  ExecutiveJournalSyntheticMetadataFixtureCatalogue,
  ExecutiveJournalSyntheticMetadataFixtures,
} from "./executiveJournalSyntheticMetadataFixtures.ts";
import {
  assertExecutiveJournalSyntheticMetadataConsumerAlias,
  assertExecutiveJournalSyntheticMetadataConsumerId,
  assertExecutiveJournalSyntheticMetadataPackageId,
  assertExecutiveJournalSyntheticSafeReference,
  ExecutiveJournalSyntheticMetadataIdentity,
  ExecutiveJournalSyntheticMetadataPackageId,
  ExecutiveJournalSyntheticMetadataPackageReadiness,
  ExecutiveJournalSyntheticMetadataPackageStatus,
  ExecutiveJournalSyntheticMetadataPreCertificationReadiness,
  ExecutiveJournalSyntheticProjectionSchemaVersion,
  ExecutiveJournalSyntheticProviderVersion,
  ExecutiveJournalSyntheticSourceClassificationValue,
} from "./executiveJournalSyntheticMetadataIdentity.ts";
import {
  createExecutiveJournalSyntheticMetadataProvider,
  ExecutiveJournalSyntheticMetadataProviderContract,
  ExecutiveJournalSyntheticMetadataProviderDefault,
} from "./executiveJournalSyntheticMetadataProvider.ts";
import {
  ExecutiveJournalSyntheticAdapterRejectionCodes,
  ExecutiveJournalSyntheticAdapterResults,
  ExecutiveJournalSyntheticAllowlistFieldCoverage,
  ExecutiveJournalSyntheticAllowlistFields,
  ExecutiveJournalSyntheticArchitectureDenylistMapping,
  ExecutiveJournalSyntheticAuthorityStates,
  ExecutiveJournalSyntheticCertificationGateIds,
  ExecutiveJournalSyntheticDeniedFields,
  ExecutiveJournalSyntheticDenylistFieldCoverage,
  ExecutiveJournalSyntheticEntryCategories,
  ExecutiveJournalSyntheticIntegrityStates,
  ExecutiveJournalSyntheticLifecycleStates,
  ExecutiveJournalSyntheticOriginClassifications,
  ExecutiveJournalSyntheticPackageLocalDeniedFields,
  ExecutiveJournalSyntheticProviderModes,
  ExecutiveJournalSyntheticProviderResults,
  ExecutiveJournalSyntheticRejectionCodeCoverage,
  ExecutiveJournalSyntheticSourceClassifications,
  ExecutiveJournalSyntheticViewStates,
  type ExecutiveJournalSyntheticCertificationGateId,
  type ExecutiveJournalSyntheticCertificationGateResult,
} from "./executiveJournalSyntheticMetadataTypes.ts";
import {
  createExecutiveJournalSyntheticLoadingView,
  createExecutiveJournalSyntheticReadyView,
  ExecutiveJournalSyntheticMetadataViewContractSurface,
  ExecutiveJournalSyntheticNonProductionMarkerValue,
  filterSyntheticProjectionsByCategory,
  filterSyntheticProjectionsByLifecycle,
  mapAdapterOutcomeToViewContract,
  mapProviderGetResultToViewContract,
  mapProviderListResultToViewContract,
} from "./executiveJournalSyntheticMetadataViewContracts.ts";

export * from "./executiveJournalSyntheticMetadataTypes.ts";
export * from "./executiveJournalSyntheticMetadataIdentity.ts";
export * from "./executiveJournalSyntheticMetadataFixtures.ts";
export * from "./executiveJournalSyntheticMetadataProvider.ts";
export * from "./executiveJournalSyntheticMetadataAdapter.ts";
export * from "./executiveJournalSyntheticMetadataViewContracts.ts";

const certGate = (
  gateId: ExecutiveJournalSyntheticCertificationGateId,
  name: string,
  result: ExecutiveJournalSyntheticCertificationGateResult,
  evidenceRef: string,
  notes: string | null = null,
) =>
  Object.freeze({
    gateId,
    name,
    result,
    evidenceRef,
    notes,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Closed Tier-0 certification-gate catalogue (C-01..C-25).
 * C-01..C-24 must be Pass for Certified status. C-25 is disclosure-only.
 */
export const ExecutiveJournalSyntheticMetadataCertificationGates =
  Object.freeze([
    certGate("C-01", "Authorization reference", "Pass", "EX2-AUTH-T0-2026-07-26-01"),
    certGate("C-02", "Privacy review validity", "Pass", "EX2-T0-PRIVACY-REVIEW-01"),
    certGate("C-03", "Authority review validity", "Pass", "EX2-T0-AUTHORITY-REVIEW-01"),
    certGate("C-04", "Identity conformance", "Pass", "ExecutiveJournalSyntheticMetadataIdentity"),
    certGate("C-05", "Allowlist completeness", "Pass", "ExecutiveJournalSyntheticAllowlistFieldCoverage"),
    certGate("C-06", "Denylist completeness", "Pass", "ExecutiveJournalSyntheticDenylistFieldCoverage"),
    certGate("C-07", "Unknown-field rejection", "Pass", "adaptExecutiveJournalSyntheticMetadata"),
    certGate("C-08", "Rejection-code traceability", "Pass", "ExecutiveJournalSyntheticRejectionCodeCoverage"),
    certGate("C-09", "Vocabulary closure", "Pass", "executiveJournalSyntheticMetadataTypes"),
    certGate("C-10", "Fixture safety", "Pass", "ExecutiveJournalSyntheticMetadataFixtures"),
    certGate("C-11", "Provider result safety", "Pass", "createExecutiveJournalSyntheticMetadataProvider"),
    certGate("C-12", "Adapter fail-closed behavior", "Pass", "adaptExecutiveJournalSyntheticMetadata"),
    certGate("C-13", "View-state completeness", "Pass", "ExecutiveJournalSyntheticViewStates"),
    certGate("C-14", "Immutability", "Pass", "Object.freeze catalogues"),
    certGate("C-15", "Dependency boundaries", "Pass", "static package source inspection"),
    certGate("C-16", "Side-effect absence", "Pass", "provider/adapter contracts"),
    certGate("C-17", "Strict TypeScript", "Pass", "targeted strict tsc package+architecture"),
    certGate("C-18", "Production-source TypeScript", "Pass", "targeted strict tsc production sources"),
    certGate("C-19", "ESLint", "Pass", "eslint --max-warnings 0"),
    certGate("C-20", "Package tests", "Pass", "executiveJournalSyntheticMetadata.test.ts"),
    certGate("C-21", "EX regressions", "Pass", "EX-2 architecture + EX-1 suites"),
    certGate("C-22", "RTC boundary regressions", "Pass", "RTC-2:9 + RTC-3:9"),
    certGate("C-23", "G-EX2-08 enforcement", "Pass", "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage"),
    certGate("C-24", "Authorization-boundary preservation", "Pass", "EX2-AUTH-T0-2026-07-26-01"),
    certGate(
      "C-25",
      "Full-project TypeScript disclosure",
      "DisclosureOnly",
      "NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit",
      "DisclosureOnlyNonEx2Diagnostics",
    ),
  ] as const);

/**
 * Canonical certification record EX2-CERT-T0-2026-07-26-01.
 * Certified for Tier-0 synthetic metadata contract use only.
 */
export const ExecutiveJournalSyntheticMetadataCertification = Object.freeze({
  certificationId: "EX2-CERT-T0-2026-07-26-01" as const,
  title:
    "EX-2 Tier-0 Synthetic Metadata Contract Package Certification" as const,
  status: "Certified" as const,
  result: "CertifiedForTier0SyntheticMetadataContractUse" as const,
  certifyingAuthority: "Bahadoor" as const,
  authorityRole: "Nexora Product and Architecture Authority" as const,
  certificationDate: "2026-07-26" as const,
  packageId: ExecutiveJournalSyntheticMetadataPackageId,
  consumerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer" as const,
  authorizationId: "EX2-AUTH-T0-2026-07-26-01" as const,
  privacyReviewId: "EX2-T0-PRIVACY-REVIEW-01" as const,
  authorityReviewId: "EX2-T0-AUTHORITY-REVIEW-01" as const,
  governanceDecisionId: "GOV-EX2-T0-01" as const,
  preCertificationReadiness:
    ExecutiveJournalSyntheticMetadataPreCertificationReadiness,
  readiness: ExecutiveJournalSyntheticMetadataPackageReadiness,
  productionApplicability: false as const,
  realRtc2Applicability: false as const,
  uiImplementationAuthorized: false as const,
  deploymentAuthorized: false as const,
  nextArchitectureDecisionRequiredBeforeUi: true as const,
  meaning:
    "The Tier-0 synthetic metadata contract package is certified for use in separately authorized synthetic contract consumers and future UI-readiness assessment. Certification does not authorize React UI implementation, EX-2:1 activation, real RTC-2 integration, networking, persistence, production use, cloud infrastructure, or deployment." as const,
  gates: ExecutiveJournalSyntheticMetadataCertificationGates,
  blockingGateCount: 24 as const,
  disclosureGateCount: 1 as const,
  gEx208Tier0Pass: true as const,
  gEx208ProductionPass: false as const,
  gEx208RealRtc2Pass: false as const,
  createsAdEx207: false as const,
  createsEx21: false as const,
  createsReactUi: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sideEffectFree: true as const,
});

export const validateExecutiveJournalSyntheticMetadataCertificationGates =
  (): boolean => {
    if (
      ExecutiveJournalSyntheticMetadataCertificationGates.length
        !== ExecutiveJournalSyntheticCertificationGateIds.length
    ) {
      return false;
    }
    const ids = new Set(
      ExecutiveJournalSyntheticMetadataCertificationGates.map((g) => g.gateId),
    );
    if (ids.size !== ExecutiveJournalSyntheticCertificationGateIds.length) {
      return false;
    }
    for (const id of ExecutiveJournalSyntheticCertificationGateIds) {
      if (!ids.has(id)) {
        return false;
      }
    }
    for (const gate of ExecutiveJournalSyntheticMetadataCertificationGates) {
      if (gate.gateId === "C-25") {
        if (gate.result !== "DisclosureOnly") {
          return false;
        }
        continue;
      }
      if (gate.result !== "Pass") {
        return false;
      }
    }
    return true;
  };

export interface ExecutiveJournalSyntheticMetadataSummary {
  readonly packageId: typeof ExecutiveJournalSyntheticMetadataPackageId;
  readonly consumerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer";
  readonly providerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataProvider";
  readonly adapterId: "EX-2:T0/ExecutiveJournalSyntheticMetadataPrivacyAdapter";
  readonly viewContractId: "EX-2:T0/ExecutiveJournalSyntheticMetadataViewContract";
  readonly status: typeof ExecutiveJournalSyntheticMetadataPackageStatus;
  readonly readiness: typeof ExecutiveJournalSyntheticMetadataPackageReadiness;
  readonly certificationId: "EX2-CERT-T0-2026-07-26-01";
  readonly certificationStatus: "Certified";
  readonly certificationResult: "CertifiedForTier0SyntheticMetadataContractUse";
  readonly projectionSchemaVersion: typeof ExecutiveJournalSyntheticProjectionSchemaVersion;
  readonly providerVersion: typeof ExecutiveJournalSyntheticProviderVersion;
  readonly sourceClassification: typeof ExecutiveJournalSyntheticSourceClassificationValue;
  readonly allowlistFieldCount: 12;
  readonly deniedFieldCount: number;
  readonly fixtureCatalogueCount: number;
  readonly viewStateCount: 9;
  readonly providerResultCount: 6;
  readonly authorizationId: "EX2-AUTH-T0-2026-07-26-01";
  readonly privacyReviewId: "EX2-T0-PRIVACY-REVIEW-01";
  readonly authorityReviewId: "EX2-T0-AUTHORITY-REVIEW-01";
  readonly governanceDecisionId: "GOV-EX2-T0-01";
  readonly authorizationResult: "AuthorizedForTier0SyntheticExMetadataContractsAndTests";
  readonly reactUiCreated: false;
  readonly ex21Created: false;
  readonly networked: false;
  readonly persistent: false;
  readonly telemetryEnabled: false;
  readonly deploymentAuthorized: false;
  readonly productionApplicability: false;
  readonly realRtc2Applicability: false;
  readonly uiImplementationAuthorized: false;
  readonly nextArchitectureDecisionRequiredBeforeUi: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export function getExecutiveJournalSyntheticMetadataSummary():
  ExecutiveJournalSyntheticMetadataSummary {
  return Object.freeze({
    packageId: ExecutiveJournalSyntheticMetadataPackageId,
    consumerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
    providerId: "EX-2:T0/ExecutiveJournalSyntheticMetadataProvider",
    adapterId: "EX-2:T0/ExecutiveJournalSyntheticMetadataPrivacyAdapter",
    viewContractId: "EX-2:T0/ExecutiveJournalSyntheticMetadataViewContract",
    status: ExecutiveJournalSyntheticMetadataPackageStatus,
    readiness: ExecutiveJournalSyntheticMetadataPackageReadiness,
    certificationId: "EX2-CERT-T0-2026-07-26-01" as const,
    certificationStatus: "Certified" as const,
    certificationResult: "CertifiedForTier0SyntheticMetadataContractUse" as const,
    projectionSchemaVersion: ExecutiveJournalSyntheticProjectionSchemaVersion,
    providerVersion: ExecutiveJournalSyntheticProviderVersion,
    sourceClassification: ExecutiveJournalSyntheticSourceClassificationValue,
    allowlistFieldCount: 12 as const,
    deniedFieldCount: ExecutiveJournalSyntheticDeniedFields.length,
    fixtureCatalogueCount: ExecutiveJournalSyntheticMetadataFixtures.length,
    viewStateCount: 9 as const,
    providerResultCount: 6 as const,
    authorizationId: "EX2-AUTH-T0-2026-07-26-01",
    privacyReviewId: "EX2-T0-PRIVACY-REVIEW-01",
    authorityReviewId: "EX2-T0-AUTHORITY-REVIEW-01",
    governanceDecisionId: "GOV-EX2-T0-01" as const,
    authorizationResult:
      "AuthorizedForTier0SyntheticExMetadataContractsAndTests",
    reactUiCreated: false,
    ex21Created: false,
    networked: false,
    persistent: false,
    telemetryEnabled: false,
    deploymentAuthorized: false,
    productionApplicability: false,
    realRtc2Applicability: false,
    uiImplementationAuthorized: false,
    nextArchitectureDecisionRequiredBeforeUi: true,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}

/**
 * Canonical immutable aggregate for the Tier-0 synthetic metadata package.
 */
export const ExecutiveJournalSyntheticMetadata = Object.freeze({
  packageId: ExecutiveJournalSyntheticMetadataPackageId,
  identity: ExecutiveJournalSyntheticMetadataIdentity,
  status: ExecutiveJournalSyntheticMetadataPackageStatus,
  readiness: ExecutiveJournalSyntheticMetadataPackageReadiness,
  allowlistFields: ExecutiveJournalSyntheticAllowlistFields,
  allowlistFieldCoverage: ExecutiveJournalSyntheticAllowlistFieldCoverage,
  deniedFields: ExecutiveJournalSyntheticDeniedFields,
  denylistFieldCoverage: ExecutiveJournalSyntheticDenylistFieldCoverage,
  architectureDenylistMapping:
    ExecutiveJournalSyntheticArchitectureDenylistMapping,
  packageLocalDeniedFields: ExecutiveJournalSyntheticPackageLocalDeniedFields,
  rejectionCodeCoverage: ExecutiveJournalSyntheticRejectionCodeCoverage,
  entryCategories: ExecutiveJournalSyntheticEntryCategories,
  lifecycleStates: ExecutiveJournalSyntheticLifecycleStates,
  originClassifications: ExecutiveJournalSyntheticOriginClassifications,
  authorityStates: ExecutiveJournalSyntheticAuthorityStates,
  integrityStates: ExecutiveJournalSyntheticIntegrityStates,
  sourceClassifications: ExecutiveJournalSyntheticSourceClassifications,
  providerResults: ExecutiveJournalSyntheticProviderResults,
  adapterResults: ExecutiveJournalSyntheticAdapterResults,
  adapterRejectionCodes: ExecutiveJournalSyntheticAdapterRejectionCodes,
  viewStates: ExecutiveJournalSyntheticViewStates,
  providerModes: ExecutiveJournalSyntheticProviderModes,
  fixtures: ExecutiveJournalSyntheticMetadataFixtures,
  fixtureCatalogue: ExecutiveJournalSyntheticMetadataFixtureCatalogue,
  provider: ExecutiveJournalSyntheticMetadataProviderDefault,
  providerContract: ExecutiveJournalSyntheticMetadataProviderContract,
  createProvider: createExecutiveJournalSyntheticMetadataProvider,
  adapter: adaptExecutiveJournalSyntheticMetadata,
  adapterContract: ExecutiveJournalSyntheticMetadataAdapterContract,
  viewContractSurface: ExecutiveJournalSyntheticMetadataViewContractSurface,
  nonProductionMarker: ExecutiveJournalSyntheticNonProductionMarkerValue,
  createLoadingView: createExecutiveJournalSyntheticLoadingView,
  createReadyView: createExecutiveJournalSyntheticReadyView,
  mapProviderListResultToViewContract,
  mapProviderGetResultToViewContract,
  mapAdapterOutcomeToViewContract,
  filterByCategory: filterSyntheticProjectionsByCategory,
  filterByLifecycle: filterSyntheticProjectionsByLifecycle,
  authorization:
    ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  privacyReview: ExecutiveJournalProductArchitectureTier0PrivacyReview,
  authorityReview: ExecutiveJournalProductArchitectureTier0AuthorityReview,
  certification: ExecutiveJournalSyntheticMetadataCertification,
  certificationGates: ExecutiveJournalSyntheticMetadataCertificationGates,
  validateCertificationGates:
    validateExecutiveJournalSyntheticMetadataCertificationGates,
  assertPackageId: assertExecutiveJournalSyntheticMetadataPackageId,
  assertConsumerId: assertExecutiveJournalSyntheticMetadataConsumerId,
  assertConsumerAlias: assertExecutiveJournalSyntheticMetadataConsumerAlias,
  assertSafeReference: assertExecutiveJournalSyntheticSafeReference,
  getSummary: getExecutiveJournalSyntheticMetadataSummary,
  boundaries: Object.freeze({
    importsReact: false as const,
    importsNext: false as const,
    importsRtc1: false as const,
    importsRtc2: false as const,
    importsRtc3: false as const,
    importsApp8: false as const,
    usesNetwork: false as const,
    usesPersistence: false as const,
    usesTelemetry: false as const,
    usesRuntimeClock: false as const,
    usesRandomness: false as const,
    createsEx21: false as const,
    createsReactUi: false as const,
    deploymentAuthorized: false as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sideEffectFree: true as const,
});
