/** EX-3:8 Freeze contracts (descriptive only). */

import type { ExecutiveTimelineExperienceFreezeContract } from "./executiveTimelineExperienceFreezeTypes.ts";

export const ExecutiveTimelineExperienceFreezeLockOutcomeValues = Object.freeze([
  "Locked",
  "Unlocked",
  "NotEvaluated",
] as const);

export const ExecutiveTimelineExperienceFreezeContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-3:8/Contract/Upstream",
    name: "Upstream",
    order: 1,
    subject:
      "Freeze consumes only the exact EX-3:7 Certification aggregate.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Freeze",
    name: "Freeze",
    order: 2,
    subject:
      "Freeze permanently seals certified metadata without runtime behavior.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Metadata",
    name: "Metadata",
    order: 3,
    subject:
      "Freeze metadata remains immutable, deterministic, and side-effect-free.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Boundary",
    name: "Boundary",
    order: 4,
    subject:
      "No Platform, Manifest, Validation, Model, Registry, Foundation, RTC, Scene, UI, or provider imports.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Authorization",
    name: "Authorization",
    order: 5,
    subject:
      "ReadyForPublicIndex does not authorize EX-3:9 Public Index implementation.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Lifecycle",
    name: "Lifecycle",
    order: 6,
    subject:
      "Lifecycle advances forward-only to ReadyForPublicIndex without rollback.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Integrity",
    name: "Integrity",
    order: 7,
    subject:
      "Twelve architectural locks remain Locked, fail-closed, and immutable.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Readiness",
    name: "Readiness",
    order: 8,
    subject:
      "Frozen status produces ReadyForPublicIndex without Public Index authority.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Publication",
    name: "Publication",
    order: 9,
    subject: "A single immutable Freeze aggregate is the publication surface.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:8/Contract/Aggregate",
    name: "Aggregate",
    order: 10,
    subject:
      "The aggregate publishes identity, locks, contracts, readiness, and upstream certification.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveTimelineExperienceFreezeContract[]);

export const ExecutiveTimelineExperienceFreezeContractCount = 10 as const;
