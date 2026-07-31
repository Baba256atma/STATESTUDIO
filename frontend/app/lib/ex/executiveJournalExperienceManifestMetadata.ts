/**
 * EX-2:5 — scoped authorization, phase decisions, and boundary metadata.
 */

export const ExecutiveJournalExperienceManifestAuthorization = Object.freeze({
  authorizationDecisionId: "AD-EX2-13" as const,
  authorizationStatus: "Accepted" as const,
  decisionDate: "2026-07-30" as const,
  selectedOption:
    "MetadataOnlyValidatedExperienceCapabilityManifest" as const,
  scope: "Ex25ManifestImplementationAndVerificationOnly" as const,
  ex25MetadataOnlyManifestAuthorized: true as const,
  ex25ImplementationAuthorized: true as const,
  ex26Created: false as const,
  ex26Authorized: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceManifestDecisions = Object.freeze([
  Object.freeze({ decisionId: "EX-2:5/D-15" as const, order: 1, statement: "Manifest entries declare validated metadata capabilities only." as const }),
  Object.freeze({ decisionId: "EX-2:5/D-16" as const, order: 2, statement: "Manifest construction requires exact Valid EX-2:4 evidence." as const }),
  Object.freeze({ decisionId: "EX-2:5/D-17" as const, order: 3, statement: "Unknown or unsupported capabilities fail closed." as const }),
  Object.freeze({ decisionId: "EX-2:5/D-18" as const, order: 4, statement: "Prohibited capabilities remain explicit." as const }),
  Object.freeze({ decisionId: "EX-2:5/D-19" as const, order: 5, statement: "Manifest declaration creates no runtime authority." as const }),
  Object.freeze({ decisionId: "EX-2:5/D-20" as const, order: 6, statement: "EX-2:5 consumes only EX-2:4 Validation at runtime." as const }),
] as const);

export const ExecutiveJournalExperienceManifestBoundaries = Object.freeze({
  boundariesId: "EX-2:5/ExecutiveJournalExperienceManifestBoundaries" as const,
  importsValidationOnlyAtRuntime: true as const,
  directModelImport: false as const,
  directRegistryImport: false as const,
  directFoundationImport: false as const,
  directArchitectureImport: false as const,
  rtcImport: false as const,
  app8Import: false as const,
  ex1PublicIndexImport: false as const,
  reactNextUiImport: false as const,
  routeNavigationImport: false as const,
  providerAdapterFixtureImport: false as const,
  tier0RuntimeImport: false as const,
  dynamicImport: false as const,
  requireCall: false as const,
  network: false as const,
  persistence: false as const,
  browserStorage: false as const,
  telemetry: false as const,
  analytics: false as const,
  clock: false as const,
  randomness: false as const,
  cloud: false as const,
  mutation: false as const,
  execution: false as const,
  deployment: false as const,
  repair: false as const,
  normalization: false as const,
  coercion: false as const,
  silentStripping: false as const,
  authorityCreation: false as const,
  confirmationCreation: false as const,
  ownershipCreation: false as const,
  disclosurePermissionCreation: false as const,
  runtimeEffects: false as const,
  platformBehavior: false as const,
  productionAuthorization: false as const,
  realRtc2CompatibilityClaim: false as const,
  createsEx26: false as const,
  authorizesEx26: false as const,
  metadataOnly: true as const,
  sideEffectFree: true as const,
  deterministic: true as const,
  failClosed: true as const,
  immutable: true as const,
});

export const ExecutiveJournalExperienceManifestMetadata = Object.freeze({
  authorization: ExecutiveJournalExperienceManifestAuthorization,
  decisions: ExecutiveJournalExperienceManifestDecisions,
  boundaries: ExecutiveJournalExperienceManifestBoundaries,
  openIssuesRemainUnresolved: true as const,
  pendingProductionGatesRemainPending: true as const,
  eligibilityDoesNotSatisfyProductionGates: true as const,
  readyForPlatformDoesNotAuthorizeEx26: true as const,
  tier0EvidenceDoesNotAuthorizeProduction: true as const,
  adEx213InjectedIntoSealedUpstreamLedgers: false as const,
  phaseDecisionsSeparateFromArchitectureDecisions: true as const,
  ciLintClassification:
    "CiStillBlockedByParkedReactCompilerDebt" as const,
  lintAuthorizationClassification:
    "AllowMetadataOnlyEx25WithLintBlockerRecorded" as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const isExecutiveJournalExperienceManifestBoundaryIdentity = (
  value: unknown,
): value is typeof ExecutiveJournalExperienceManifestBoundaries.boundariesId =>
  value === ExecutiveJournalExperienceManifestBoundaries.boundariesId;

export const assertExecutiveJournalExperienceManifestBoundaryIdentity = (
  value: unknown,
): typeof ExecutiveJournalExperienceManifestBoundaries.boundariesId => {
  if (!isExecutiveJournalExperienceManifestBoundaryIdentity(value)) {
    throw new Error("Unknown EX-2:5 Manifest boundary identity.");
  }
  return value;
};
