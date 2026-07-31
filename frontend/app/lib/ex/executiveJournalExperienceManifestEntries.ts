/**
 * EX-2:5 — canonical capability, non-capability, and prerequisite entries.
 *
 * The factory receives exact EX-2:4-owned references from the aggregate so
 * this module creates no additional upstream runtime dependency.
 */

import type {
  ExecutiveJournalExperienceManifestCapabilityEntry,
  ExecutiveJournalExperienceManifestNonCapabilityEntry,
  ExecutiveJournalExperienceManifestPlatformPrerequisite,
  ExecutiveJournalExperienceManifestRequirementStatus,
} from "./executiveJournalExperienceManifestTypes.ts";

export const ExecutiveJournalExperienceManifestCapabilityDefinitions =
  Object.freeze([
    Object.freeze({ capabilityId: "EX25-CAP-01", capability: "Metadata-only journal experience composition", supportingReferenceKey: "experience", supportingReferenceIdentity: "EX-2:3/Entity/ExecutiveJournalExperience" }),
    Object.freeze({ capabilityId: "EX25-CAP-02", capability: "Journal projection presentation metadata", supportingReferenceKey: "projection", supportingReferenceIdentity: "EX-2:3/Entity/JournalProjection" }),
    Object.freeze({ capabilityId: "EX25-CAP-03", capability: "Entry-list metadata", supportingReferenceKey: "entryList", supportingReferenceIdentity: "EX-2:3/Entity/JournalEntryList" }),
    Object.freeze({ capabilityId: "EX25-CAP-04", capability: "Entry-summary metadata", supportingReferenceKey: "entrySummary", supportingReferenceIdentity: "EX-2:3/Entity/JournalEntrySummary" }),
    Object.freeze({ capabilityId: "EX25-CAP-05", capability: "Entry-detail metadata", supportingReferenceKey: "entryDetail", supportingReferenceIdentity: "EX-2:3/Entity/JournalEntryDetail" }),
    Object.freeze({ capabilityId: "EX25-CAP-06", capability: "Category presentation", supportingReferenceKey: "category", supportingReferenceIdentity: "EX-2:3/Entity/EntryCategoryPresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-07", capability: "Lifecycle presentation", supportingReferenceKey: "lifecycle", supportingReferenceIdentity: "EX-2:3/Entity/LifecyclePresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-08", capability: "Origin presentation", supportingReferenceKey: "origin", supportingReferenceIdentity: "EX-2:3/Entity/OriginPresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-09", capability: "Authority-state presentation", supportingReferenceKey: "authority", supportingReferenceIdentity: "EX-2:3/Entity/AuthorityPresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-10", capability: "Integrity-state presentation", supportingReferenceKey: "integrity", supportingReferenceIdentity: "EX-2:3/Entity/IntegrityPresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-11", capability: "Provenance references", supportingReferenceKey: "provenance", supportingReferenceIdentity: "EX-2:3/Entity/ProvenancePresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-12", capability: "Correction and supersession references", supportingReferenceKey: "correctionSupersession", supportingReferenceIdentity: "EX-2:3/Entity/CorrectionSupersessionPresentation" }),
    Object.freeze({ capabilityId: "EX25-CAP-13", capability: "Filter-model metadata", supportingReferenceKey: "filterModel", supportingReferenceIdentity: "EX-2:3/Entity/JournalFilterModel" }),
    Object.freeze({ capabilityId: "EX25-CAP-14", capability: "Tier-0 evidence references", supportingReferenceKey: "tier0Evidence", supportingReferenceIdentity: "EX-2:3/Entity/Tier0EvidenceReference" }),
    Object.freeze({ capabilityId: "EX25-CAP-15", capability: "Deterministic summaries", supportingReferenceKey: "validationSummary", supportingReferenceIdentity: "EX-2:4/ValidationSummary" }),
    Object.freeze({ capabilityId: "EX25-CAP-16", capability: "Fail-closed consumer-boundary metadata", supportingReferenceKey: "validationBoundaries", supportingReferenceIdentity: "EX-2:4/ExecutiveJournalExperienceValidationBoundaries" }),
  ] as const);

export const ExecutiveJournalExperienceManifestNonCapabilityDefinitions =
  Object.freeze([
    "Journal body or narrative",
    "Rationale",
    "Private reflection or its existence signals",
    "Evidence content or resolvable evidence URI",
    "Authority evidence",
    "Actor PII",
    "Jurisdiction/location",
    "Retention or disclosure instructions",
    "Commands and mutations",
    "Real RTC-2 payload consumption",
    "Production provider access",
    "React UI or routes",
    "Navigation",
    "Network",
    "Persistence or browser storage",
    "Telemetry or analytics",
    "Clock or randomness",
    "Cloud or deployment",
    "EX-2:6 Platform implementation",
  ] as const);

export const ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions =
  Object.freeze([
    Object.freeze({ prerequisite: "Exact EX-2:5 Manifest identity", supportingReferenceKey: "manifestIdentity", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "Exact EX-2:4 Valid evidence", supportingReferenceKey: "validationResult", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "Canonical dependency chain intact", supportingReferenceKey: "validationUpstream", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "All manifest entries sealed", supportingReferenceKey: "manifestLifecycle", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "No prohibited capability declared", supportingReferenceKey: "nonCapabilities", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "Open issues carried forward", supportingReferenceKey: "openIssues", status: "Satisfied", productionApplicable: false }),
    Object.freeze({ prerequisite: "Production gates disclosed as Pending", supportingReferenceKey: "pendingGates", status: "Pending", productionApplicable: false }),
    Object.freeze({ prerequisite: "Separate EX-2:6 architecture authorization", supportingReferenceKey: "manifestAuthorization", status: "Pending", productionApplicable: false }),
    Object.freeze({ prerequisite: "No inference that Tier-0 evidence authorizes production", supportingReferenceKey: "tier0EvidenceLedger", status: "Satisfied", productionApplicable: false }),
  ] as const satisfies readonly Readonly<{
    prerequisite: string;
    supportingReferenceKey: string;
    status: ExecutiveJournalExperienceManifestRequirementStatus;
    productionApplicable: boolean;
  }>[]);

export interface ExecutiveJournalExperienceManifestEntryReferenceContext {
  readonly experience: unknown;
  readonly projection: unknown;
  readonly entryList: unknown;
  readonly entrySummary: unknown;
  readonly entryDetail: unknown;
  readonly category: unknown;
  readonly lifecycle: unknown;
  readonly origin: unknown;
  readonly authority: unknown;
  readonly integrity: unknown;
  readonly provenance: unknown;
  readonly correctionSupersession: unknown;
  readonly filterModel: unknown;
  readonly tier0Evidence: unknown;
  readonly validationSummary: unknown;
  readonly validationBoundaries: unknown;
  readonly manifestIdentity: unknown;
  readonly validationResult: unknown;
  readonly validationUpstream: unknown;
  readonly manifestLifecycle: unknown;
  readonly nonCapabilities: unknown;
  readonly openIssues: unknown;
  readonly pendingGates: unknown;
  readonly manifestAuthorization: unknown;
  readonly tier0EvidenceLedger: unknown;
}

type ReferenceKey = keyof ExecutiveJournalExperienceManifestEntryReferenceContext;

export const createExecutiveJournalExperienceManifestEntries = (
  references: ExecutiveJournalExperienceManifestEntryReferenceContext,
) => {
  const capabilities = Object.freeze(
    ExecutiveJournalExperienceManifestCapabilityDefinitions.map(
      (definition, index) =>
        Object.freeze({
          capabilityId: definition.capabilityId,
          order: index + 1,
          capability: definition.capability,
          entryKind: "Capability" as const,
          support: "Declared" as const,
          supportingReference:
            references[definition.supportingReferenceKey as ReferenceKey],
          supportingReferenceIdentity:
            definition.supportingReferenceIdentity,
          metadataOnly: true as const,
          runtimeBehavior: false as const,
          createsAuthority: false as const,
          productionApplicable: false as const,
          immutable: true as const,
        } satisfies ExecutiveJournalExperienceManifestCapabilityEntry),
    ),
  );

  const nonCapabilities = Object.freeze(
    ExecutiveJournalExperienceManifestNonCapabilityDefinitions.map(
      (nonCapability, index) =>
        Object.freeze({
          nonCapabilityId:
            `EX25-NONCAP-${String(index + 1).padStart(2, "0")}` as const,
          order: index + 1,
          nonCapability,
          entryKind: "NonCapability" as const,
          support: "Prohibited" as const,
          supportingReference: references.validationBoundaries,
          metadataOnly: true as const,
          runtimeBehavior: false as const,
          createsAuthority: false as const,
          productionApplicable: false as const,
          immutable: true as const,
        } satisfies ExecutiveJournalExperienceManifestNonCapabilityEntry),
    ),
  );

  const platformPrerequisites = Object.freeze(
    ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions.map(
      (definition, index) =>
        Object.freeze({
          prerequisiteId:
            `EX25-PREREQ-${String(index + 1).padStart(2, "0")}` as const,
          order: index + 1,
          prerequisite: definition.prerequisite,
          entryKind: "PlatformPrerequisite" as const,
          status: definition.status,
          supportingReference:
            references[definition.supportingReferenceKey as ReferenceKey],
          productionApplicable: definition.productionApplicable,
          authorizesPlatformImplementation: false as const,
          metadataOnly: true as const,
          immutable: true as const,
        } satisfies ExecutiveJournalExperienceManifestPlatformPrerequisite),
    ),
  );

  return Object.freeze({
    capabilities,
    nonCapabilities,
    platformPrerequisites,
    capabilityCount: 16 as const,
    nonCapabilityCount: 19 as const,
    platformPrerequisiteCount: 9 as const,
    complete: true as const,
    sealed: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });
};
