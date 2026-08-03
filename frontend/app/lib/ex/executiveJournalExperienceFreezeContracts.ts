import type { ExecutiveJournalExperienceFreezeContract } from "./executiveJournalExperienceFreezeTypes.ts";

export const ExecutiveJournalExperienceFreezeLockOutcomeValues = Object.freeze([
  "Locked",
  "Unlocked",
  "NotEvaluated",
] as const);

export const ExecutiveJournalExperienceFreezeContracts = Object.freeze(
  ([
    [
      "Upstream",
      "Freeze consumes only the exact EX-2:7 Certification aggregate.",
    ],
    [
      "Freeze",
      "Freeze permanently seals certified metadata without runtime behavior.",
    ],
    [
      "Metadata",
      "Freeze metadata remains immutable, deterministic, and side-effect-free.",
    ],
    [
      "Boundary",
      "No Platform, Manifest, Validation, Model, Registry, Foundation, RTC, Scene, UI, or provider imports.",
    ],
    [
      "Authorization",
      "Freeze verifies only AD-EX2-14; no new authority, delegation, or expansion.",
    ],
    [
      "Integrity",
      "Twelve architectural locks remain Locked, fail-closed, and immutable.",
    ],
    [
      "Publication",
      "A single immutable Freeze aggregate is the publication surface.",
    ],
    [
      "Lifecycle",
      "Lifecycle advances forward-only to ReadyForPublicIndex without rollback.",
    ],
    [
      "Readiness",
      "Frozen status produces ReadyForPublicIndex without authorizing Public Index.",
    ],
    [
      "Aggregate",
      "The aggregate publishes identity, locks, contracts, readiness, and upstream certification.",
    ],
  ] as const).map(([name, subject], index) =>
    Object.freeze({
      contractId: `EX-2:8/Contract/${name}`,
      order: index + 1,
      subject,
      metadataOnly: true,
      descriptiveOnly: true,
      repairsInput: false,
      mutatesInput: false,
      runtimeEffects: false,
      authorityCreation: false,
      productionAuthorization: false,
      publicIndexAuthorized: false,
      immutable: true,
    } satisfies ExecutiveJournalExperienceFreezeContract)),
);

const isMember = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T =>
  typeof value === "string" && values.some((candidate) => candidate === value);

export const isExecutiveJournalExperienceFreezeLockOutcome = (
  value: unknown,
): value is (typeof ExecutiveJournalExperienceFreezeLockOutcomeValues)[number] =>
  isMember(ExecutiveJournalExperienceFreezeLockOutcomeValues, value);
