/**
 * EX-2:3 — Executive Journal Experience Model types.
 *
 * Closed metadata-only presentation/consumer contracts. No runtime values,
 * UI behavior, validation, persistence, or governance authority.
 */

export type ExecutiveJournalExperienceModelStatus = "Model";
export type ExecutiveJournalExperienceModelReadiness = "ReadyForValidation";
export type ExecutiveJournalExperienceModelPhase = "EX-2:3";

export type ExecutiveJournalExperienceModelLifecycleState =
  | "Declared"
  | "UpstreamBound"
  | "EntityModelConstructed"
  | "Sealed"
  | "ReadyForValidation";

export type ExecutiveJournalExperienceModelEntityKind =
  | "ExecutiveJournalExperience"
  | "JournalProjection"
  | "JournalEntryList"
  | "JournalEntrySummary"
  | "JournalEntryDetail"
  | "EntryCategoryPresentation"
  | "LifecyclePresentation"
  | "OriginPresentation"
  | "AuthorityPresentation"
  | "IntegrityPresentation"
  | "ProvenancePresentation"
  | "CorrectionSupersessionPresentation"
  | "JournalFilterModel"
  | "Tier0EvidenceReference";

export type ExecutiveJournalExperienceModelFieldValueKind =
  | "OpaqueReference"
  | "ClosedVocabulary"
  | "PresentationLabel"
  | "MetadataBoolean"
  | "MetadataCollection";

export interface ExecutiveJournalExperienceModelFieldDescriptor {
  readonly fieldId: `EX-2:3/Entity/${ExecutiveJournalExperienceModelEntityKind}/Field/${string}`;
  readonly fieldName: string;
  readonly valueKind: ExecutiveJournalExperienceModelFieldValueKind;
  readonly required: boolean;
  readonly opaqueReference: boolean;
  readonly allowlistedPresentationMetadataOnly: true;
  readonly mutable: false;
  readonly order: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceModelEntityDescriptor {
  readonly entityId: `EX-2:3/Entity/${ExecutiveJournalExperienceModelEntityKind}`;
  readonly kind: ExecutiveJournalExperienceModelEntityKind;
  readonly description: string;
  readonly root: boolean;
  readonly order: number;
  readonly fields: readonly ExecutiveJournalExperienceModelFieldDescriptor[];
  readonly fieldCount: number;
  readonly owner: "EX";
  readonly ownership: "PresentationConsumer";
  readonly narrativePayloadAllowed: false;
  readonly authorityCreationAllowed: false;
  readonly mutationCommandsAllowed: false;
  readonly storesRuntimeValues: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export type ExecutiveJournalExperienceModelRelationshipKind =
  | "ExperienceContainsProjection"
  | "ProjectionContainsEntryList"
  | "EntryListContainsSummaries"
  | "SelectedSummaryPresentsDetail"
  | "DetailPresentsCategory"
  | "DetailPresentsLifecycle"
  | "DetailPresentsOrigin"
  | "DetailPresentsAuthority"
  | "DetailPresentsIntegrity"
  | "DetailPresentsProvenance"
  | "DetailPresentsCorrectionSupersession"
  | "FilterConstrainsEntryList"
  | "Tier0EvidenceSupportsModelProvenance";

export interface ExecutiveJournalExperienceModelRelationshipDescriptor {
  readonly relationshipId:
    `EX-2:3/Relationship/${ExecutiveJournalExperienceModelRelationshipKind}`;
  readonly kind: ExecutiveJournalExperienceModelRelationshipKind;
  readonly from: ExecutiveJournalExperienceModelEntityKind;
  readonly to: ExecutiveJournalExperienceModelEntityKind;
  readonly cardinality: "OneToOne" | "OneToMany" | "OptionalOne";
  readonly description: string;
  readonly order: number;
  readonly authorityCreating: false;
  readonly ownershipCreating: false;
  readonly confirmationCreating: false;
  readonly disclosurePermissionCreating: false;
  readonly lifecycleTruthCreating: false;
  readonly lineageErasing: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveJournalExperienceModelSummary {
  readonly identity: "EX-2:3/ExecutiveJournalExperienceModel";
  readonly namespace: "nexora.ex.executive.journal.experience.model";
  readonly status: "Model";
  readonly readiness: "ReadyForValidation";
  readonly phase: "EX-2:3";
  readonly rootEntity: "ExecutiveJournalExperience";
  readonly entityCount: 14;
  readonly relationshipCount: 13;
  readonly decisionCount: 8;
  readonly previousPhase: "EX-2:2 — Executive Journal Experience Registry";
  readonly nextPhaseMetadata:
    "EX-2:4 — Executive Journal Experience Validation";
  readonly nextPhase: "EX-2:4 — Executive Journal Experience Validation";
  readonly metadataOnly: true;
  readonly sideEffectFree: true;
  readonly upstreamIdentityChain: readonly [
    "EX-2:3/ExecutiveJournalExperienceModel",
    "EX-2:2/ExecutiveJournalExperienceRegistry",
    "EX-2:1/ExecutiveJournalExperienceFoundation",
  ];
  readonly openIssueCount: number;
  readonly pendingGateCount: 3;
  readonly authorizationDecisionId: "AD-EX2-10";
  readonly ex24Created: false;
  readonly ex24Authorized: false;
}
