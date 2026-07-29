/**
 * EX-2:1 — Executive Journal Experience Foundation Boundaries.
 *
 * EX-owned vs RTC-owned responsibility boundaries, allowed metadata-only
 * behavior, absolute prohibitions, and dependency/authority limits.
 * Metadata-only. Does not recreate or override RTC-2 semantics.
 *
 * Ownership: owned exclusively by EX-2:1.
 */

import type { ExecutiveJournalExperienceBoundaryId } from "./executiveJournalExperienceTypes.ts";

export const ExecutiveJournalExperienceBoundaryIds = Object.freeze([
  "ExperienceOwnership",
  "GovernanceAuthority",
  "MetadataOnly",
  "ReadOnly",
  "NoSystemOfRecord",
  "NoAuthorityCreation",
  "NoMutation",
  "NoPrivateReflectionExposure",
  "NoEvidencePayload",
  "NoActorPii",
  "NoNetwork",
  "NoPersistence",
  "NoTelemetry",
  "NoRoute",
  "NoProduction",
  "NoDeployment",
  "NoApp8Integration",
  "NoRtc3Integration",
  "NoPublicIndexPublication",
] as const satisfies readonly ExecutiveJournalExperienceBoundaryId[]);

export const assertExecutiveJournalExperienceBoundaryId = (
  value: string,
): ExecutiveJournalExperienceBoundaryId => {
  if (
    !(ExecutiveJournalExperienceBoundaryIds as readonly string[]).includes(
      value,
    )
  ) {
    throw new Error(
      `Unknown EX-2:1 boundary identifier fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalExperienceBoundaryId;
};

/** Ordered immutable Foundation principles. */
export const ExecutiveJournalExperiencePrinciples = Object.freeze([
  Object.freeze({
    order: 1 as const,
    principleId: "EX-2:1/Principle/01" as const,
    statement:
      "EX-2 is an experience and consumer layer, not the journal system of record." as const,
  }),
  Object.freeze({
    order: 2 as const,
    principleId: "EX-2:1/Principle/02" as const,
    statement:
      "EX-2 cannot create, confirm, broaden or exercise journal authority." as const,
  }),
  Object.freeze({
    order: 3 as const,
    principleId: "EX-2:1/Principle/03" as const,
    statement:
      "EX-2 cannot mutate journal records or lifecycle state." as const,
  }),
  Object.freeze({
    order: 4 as const,
    principleId: "EX-2:1/Principle/04" as const,
    statement:
      "Private-reflection existence and content remain undisclosed." as const,
  }),
  Object.freeze({
    order: 5 as const,
    principleId: "EX-2:1/Principle/05" as const,
    statement:
      "Metadata consumption must be explicitly authorized and fail closed." as const,
  }),
  Object.freeze({
    order: 6 as const,
    principleId: "EX-2:1/Principle/06" as const,
    statement:
      "Tier-0 evidence remains synthetic and non-production." as const,
  }),
  Object.freeze({
    order: 7 as const,
    principleId: "EX-2:1/Principle/07" as const,
    statement:
      "Existing evidence is adopted by exact reference, never relabelled." as const,
  }),
  Object.freeze({
    order: 8 as const,
    principleId: "EX-2:1/Principle/08" as const,
    statement:
      "Foundation readiness does not imply Platform, route, production or deployment readiness." as const,
  }),
  Object.freeze({
    order: 9 as const,
    principleId: "EX-2:1/Principle/09" as const,
    statement:
      "Later phases must consume only the preceding formal EX-2 phase." as const,
  }),
  Object.freeze({
    order: 10 as const,
    principleId: "EX-2:1/Principle/10" as const,
    statement:
      "Unknown identities, fields, states and authority claims fail closed." as const,
  }),
] as const);

/** EX-owned responsibilities. */
export const ExecutiveJournalExperienceExOwnedResponsibilities = Object.freeze([
  "Executive Journal experience composition",
  "Presentation-facing metadata contracts",
  "Navigation and consumer-boundary declarations",
  "Experience-level privacy and authority presentation constraints",
  "Future registry/model/validation/manifest/platform surfaces",
  "Tier-0 evidence references",
] as const);

/** RTC-2-owned responsibilities — not recreated or overridden by EX-2:1. */
export const ExecutiveJournalExperienceRtc2OwnedResponsibilities =
  Object.freeze([
    "Executive Journal governance contracts",
    "Journal lifecycle authority",
    "Authority and confirmation semantics",
    "Privacy and private-reflection controls",
    "Append-only and correction lineage",
    "Evidence and provenance rules",
    "Disclosure, retention and disposition constraints",
  ] as const);

/** Allowed metadata-only Foundation behavior. */
export const ExecutiveJournalExperienceAllowedMetadataOnlyBehavior =
  Object.freeze([
    "Declare canonical Foundation identity and namespace",
    "Record closed boundary and principle catalogues",
    "Reference architecture decisions by exact identity",
    "Reference Tier-0 evidence by ExactReferenceEvidenceLedger",
    "Preserve unresolved open issues and pending gates",
    "Declare ReadyForRegistry readiness for EX-2:2 metadata",
  ] as const);

/** Absolute prohibitions. */
export const ExecutiveJournalExperienceAbsoluteProhibitions = Object.freeze([
  "UI mounting or React/Next.js implementation as EX-2:1 authority",
  "App Router route or navigation publication",
  "Live RTC-2 provider or runtime consumption",
  "RTC-1 / RTC-3 runtime module imports",
  "APP-8 Decision Journal integration",
  "Network, persistence, filesystem, or browser storage",
  "Telemetry or analytics emission",
  "Production data, cloud, KMS, or deployment",
  "Authority creation, confirmation, or exercise",
  "Journal mutation or lifecycle state change",
  "Private-reflection existence or content exposure",
  "Evidence payload, actor PII, or sensitive authority evidence exposure",
  "Public Index publication",
  "Creating or authorizing EX-2:2 through EX-2:9",
  "Relabelling Tier-0 evidence as formal EX-2 phase completion",
] as const);

/**
 * Closed boundary catalogue with independent enforcement flags.
 */
export const ExecutiveJournalExperienceBoundaryCatalogue = Object.freeze({
  ExperienceOwnership: Object.freeze({
    boundaryId: "ExperienceOwnership" as const,
    owner: "EX-2" as const,
    description:
      "EX owns experience composition and presentation-facing contracts only." as const,
    enforced: true as const,
  }),
  GovernanceAuthority: Object.freeze({
    boundaryId: "GovernanceAuthority" as const,
    owner: "RTC-2" as const,
    description:
      "RTC-2 retains journal governance, authority, and lifecycle semantics." as const,
    enforced: true as const,
    exMustNotOverride: true as const,
  }),
  MetadataOnly: Object.freeze({
    boundaryId: "MetadataOnly" as const,
    value: true as const,
    enforced: true as const,
  }),
  ReadOnly: Object.freeze({
    boundaryId: "ReadOnly" as const,
    value: true as const,
    enforced: true as const,
  }),
  NoSystemOfRecord: Object.freeze({
    boundaryId: "NoSystemOfRecord" as const,
    value: true as const,
    enforced: true as const,
  }),
  NoAuthorityCreation: Object.freeze({
    boundaryId: "NoAuthorityCreation" as const,
    value: true as const,
    enforced: true as const,
  }),
  NoMutation: Object.freeze({
    boundaryId: "NoMutation" as const,
    value: true as const,
    enforced: true as const,
  }),
  NoPrivateReflectionExposure: Object.freeze({
    boundaryId: "NoPrivateReflectionExposure" as const,
    value: true as const,
    privateReflectionExistenceExposed: false as const,
    privateReflectionContentExposed: false as const,
    enforced: true as const,
  }),
  NoEvidencePayload: Object.freeze({
    boundaryId: "NoEvidencePayload" as const,
    value: true as const,
    evidencePayloadExposed: false as const,
    authorityEvidenceExposed: false as const,
    enforced: true as const,
  }),
  NoActorPii: Object.freeze({
    boundaryId: "NoActorPii" as const,
    value: true as const,
    actorPiiExposed: false as const,
    enforced: true as const,
  }),
  NoNetwork: Object.freeze({
    boundaryId: "NoNetwork" as const,
    value: true as const,
    networkAuthorized: false as const,
    enforced: true as const,
  }),
  NoPersistence: Object.freeze({
    boundaryId: "NoPersistence" as const,
    value: true as const,
    persistenceAuthorized: false as const,
    enforced: true as const,
  }),
  NoTelemetry: Object.freeze({
    boundaryId: "NoTelemetry" as const,
    value: true as const,
    telemetryEnabled: false as const,
    enforced: true as const,
  }),
  NoRoute: Object.freeze({
    boundaryId: "NoRoute" as const,
    value: true as const,
    routeAuthorized: false as const,
    enforced: true as const,
  }),
  NoProduction: Object.freeze({
    boundaryId: "NoProduction" as const,
    value: true as const,
    productionAuthorized: false as const,
    enforced: true as const,
  }),
  NoDeployment: Object.freeze({
    boundaryId: "NoDeployment" as const,
    value: true as const,
    deploymentAuthorized: false as const,
    enforced: true as const,
  }),
  NoApp8Integration: Object.freeze({
    boundaryId: "NoApp8Integration" as const,
    value: true as const,
    app8IntegrationAuthorized: false as const,
    enforced: true as const,
  }),
  NoRtc3Integration: Object.freeze({
    boundaryId: "NoRtc3Integration" as const,
    value: true as const,
    rtc3IntegrationAuthorized: false as const,
    enforced: true as const,
  }),
  NoPublicIndexPublication: Object.freeze({
    boundaryId: "NoPublicIndexPublication" as const,
    value: true as const,
    publicIndexAuthorized: false as const,
    enforced: true as const,
  }),
} as const);

export const getExecutiveJournalExperienceBoundary = (
  boundaryId: string,
) => {
  const id = assertExecutiveJournalExperienceBoundaryId(boundaryId);
  return ExecutiveJournalExperienceBoundaryCatalogue[id];
};

/**
 * Dependency and authority boundary declaration.
 * One-way: Foundation may reference architecture metadata; architecture
 * must not import Foundation (avoids circular dependency).
 */
export const ExecutiveJournalExperienceDependencyBoundaries = Object.freeze({
  allowed: Object.freeze([
    "EX-owned architecture metadata proving AD-EX2-08 and evidence references",
    "Type-only imports where required",
    "Pure immutable metadata",
  ] as const),
  prohibited: Object.freeze([
    "React or Next.js",
    "App Router or route modules",
    "EX-1 runtime components or Public Index as EX-2 authority",
    "RTC-1, RTC-2 or RTC-3 runtime modules",
    "APP-8 Decision Journal",
    "Network clients",
    "Database or persistence libraries",
    "Filesystem APIs",
    "Browser storage",
    "Telemetry or analytics",
    "Runtime clock or randomness",
    "Cloud SDKs",
    "Mutation, command or authority APIs",
  ] as const),
  architectureImportDirection: "FoundationMayImportArchitectureOneWay" as const,
  architectureMustNotImportFoundation: true as const,
  liveRtc2RuntimeImportAuthorized: false as const,
  ex1RuntimeImportAuthorized: false as const,
  circularDependency: false as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

export const ExecutiveJournalExperienceBoundaries = Object.freeze({
  catalogue: ExecutiveJournalExperienceBoundaryCatalogue,
  boundaryIds: ExecutiveJournalExperienceBoundaryIds,
  principles: ExecutiveJournalExperiencePrinciples,
  exOwned: ExecutiveJournalExperienceExOwnedResponsibilities,
  rtc2Owned: ExecutiveJournalExperienceRtc2OwnedResponsibilities,
  allowedMetadataOnlyBehavior:
    ExecutiveJournalExperienceAllowedMetadataOnlyBehavior,
  absoluteProhibitions: ExecutiveJournalExperienceAbsoluteProhibitions,
  dependency: ExecutiveJournalExperienceDependencyBoundaries,
  getBoundary: getExecutiveJournalExperienceBoundary,
  assertBoundaryId: assertExecutiveJournalExperienceBoundaryId,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
