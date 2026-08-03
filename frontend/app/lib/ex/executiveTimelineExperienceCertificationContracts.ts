/** EX-3:7 Certification contracts (descriptive only). */

import type { ExecutiveTimelineExperienceCertificationContract } from "./executiveTimelineExperienceCertificationTypes.ts";

export const ExecutiveTimelineExperienceCertificationCriterionOutcomeValues =
  Object.freeze(["Satisfied", "Unsatisfied", "NotEvaluated"] as const);

export const ExecutiveTimelineExperienceCertificationContracts = Object.freeze([
  Object.freeze({
    contractId: "EX-3:7/Contract/Upstream",
    name: "Upstream",
    order: 1,
    subject:
      "Certification consumes only the exact EX-3:6 Platform aggregate.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Certification",
    name: "Certification",
    order: 2,
    subject:
      "Certification remains a metadata-only readiness gate for Freeze.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Metadata",
    name: "Metadata",
    order: 3,
    subject: "Certification metadata remains immutable and side-effect free.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Boundary",
    name: "Boundary",
    order: 4,
    subject:
      "No Manifest, Validation, Model, Registry, Foundation, RTC, Scene, UI, or provider imports.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Authorization",
    name: "Authorization",
    order: 5,
    subject:
      "ReadyForFreeze does not authorize EX-3:8 Freeze implementation.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Evidence",
    name: "Evidence",
    order: 6,
    subject:
      "Evidence references remain read-only and never duplicate upstream content.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Lifecycle",
    name: "Lifecycle",
    order: 7,
    subject: "Lifecycle advances forward-only through five immutable states.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Readiness",
    name: "Readiness",
    order: 8,
    subject: "Certified status produces ReadyForFreeze without Freeze authority.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Integrity",
    name: "Integrity",
    order: 9,
    subject:
      "Sixteen criteria certify Platform architectural integrity descriptively.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    contractId: "EX-3:7/Contract/Aggregate",
    name: "Aggregate",
    order: 10,
    subject:
      "Certification aggregate publishes identity, lifecycle, evidence, and contracts.",
    descriptiveOnly: true,
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveTimelineExperienceCertificationContract[]);

export const ExecutiveTimelineExperienceCertificationContractCount = 10 as const;
