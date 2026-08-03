import type { ExecutiveJournalExperienceCertificationContract } from "./executiveJournalExperienceCertificationTypes.ts";

export const ExecutiveJournalExperienceCertificationCriterionOutcomeValues =
  Object.freeze(["Satisfied", "Unsatisfied", "NotEvaluated"] as const);

export const ExecutiveJournalExperienceCertificationResultStatusValues =
  Object.freeze(["Pending", "Failed", "Certified"] as const);

export const ExecutiveJournalExperienceCertificationEvidenceKindValues =
  Object.freeze([
    "PlatformAggregate",
    "ProductionBuild",
    "TypeScript",
    "TestVerification",
    "RouteVerification",
    "DependencyVerification",
    "AuthorizationDecision",
  ] as const);

export const ExecutiveJournalExperienceCertificationContracts = Object.freeze(
  ([
    [
      "Upstream",
      "Certification consumes only the exact EX-2:6 Platform aggregate.",
    ],
    [
      "Evidence",
      "Evidence references remain read-only and never duplicate upstream content.",
    ],
    [
      "Readiness",
      "Certified status produces ReadyForFreeze without authorizing Freeze.",
    ],
    [
      "Boundary",
      "No Manifest, Validation, Model, Registry, Foundation, RTC, Scene, UI, or provider imports.",
    ],
    [
      "Authorization",
      "Certification verifies only AD-EX2-14; no new authority, delegation, or expansion.",
    ],
    [
      "PackageIntegrity",
      "Exactly eight Certification files form the sealed package.",
    ],
    [
      "DeterministicEvaluation",
      "All criterion outcomes are immutable, deterministic, and metadata-only.",
    ],
    [
      "Metadata",
      "Certification remains metadata-only with zero runtime behavior.",
    ],
    [
      "CertificationSummary",
      "The summary contains safe counts and authority metadata only.",
    ],
    [
      "AggregatePublication",
      "The aggregate publishes identity, lifecycle, evidence, contracts, and result.",
    ],
  ] as const).map(([name, subject], index) =>
    Object.freeze({
      contractId: `EX-2:7/Contract/${name}`,
      order: index + 1,
      subject,
      metadataOnly: true,
      descriptiveOnly: true,
      repairsInput: false,
      mutatesInput: false,
      runtimeEffects: false,
      authorityCreation: false,
      productionAuthorization: false,
      freezeAuthorized: false,
      immutable: true,
    } satisfies ExecutiveJournalExperienceCertificationContract)),
);

const isMember = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T =>
  typeof value === "string" && values.some((candidate) => candidate === value);

export const isExecutiveJournalExperienceCertificationCriterionOutcome = (
  value: unknown,
): value is (typeof ExecutiveJournalExperienceCertificationCriterionOutcomeValues)[number] =>
  isMember(ExecutiveJournalExperienceCertificationCriterionOutcomeValues, value);

export const isExecutiveJournalExperienceCertificationResultStatus = (
  value: unknown,
): value is (typeof ExecutiveJournalExperienceCertificationResultStatusValues)[number] =>
  isMember(ExecutiveJournalExperienceCertificationResultStatusValues, value);

export const isExecutiveJournalExperienceCertificationEvidenceKind = (
  value: unknown,
): value is (typeof ExecutiveJournalExperienceCertificationEvidenceKindValues)[number] =>
  isMember(ExecutiveJournalExperienceCertificationEvidenceKindValues, value);
