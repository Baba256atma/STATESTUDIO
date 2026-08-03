/** EX-3:2 closed metadata-only Registry types. */

export type ExecutiveTimelineExperienceRegistryCatalogueKind =
  | "EventTypes"
  | "NavigationModes"
  | "MarkerTypes"
  | "PlaybackStates"
  | "SynchronizationModes"
  | "ViewModes"
  | "InteractionTypes"
  | "ReadinessStates";

export type ExecutiveTimelineExperienceRegistryValidationRuleId =
  | "UniqueIdentifiers"
  | "UniqueNames"
  | "DeterministicOrdering"
  | "ImmutableCollections"
  | "FailClosedLookup"
  | "NoDuplicateAliases"
  | "CanonicalNaming"
  | "RegistryCompleteness"
  | "CatalogueIntegrity"
  | "MetadataConsistency";

export interface ExecutiveTimelineExperienceRegistryEntry {
  readonly entryId: string;
  readonly name: string;
  readonly order: number;
  readonly aliases: readonly string[];
  readonly catalogueKind: ExecutiveTimelineExperienceRegistryCatalogueKind;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceRegistryCatalogue {
  readonly catalogueId: `EX-3:2/Catalogue/${ExecutiveTimelineExperienceRegistryCatalogueKind}`;
  readonly kind: ExecutiveTimelineExperienceRegistryCatalogueKind;
  readonly order: number;
  readonly entryCount: number;
  readonly entries: readonly ExecutiveTimelineExperienceRegistryEntry[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveTimelineExperienceRegistryValidationRule {
  readonly ruleId: `EX-3:2/Validation/${ExecutiveTimelineExperienceRegistryValidationRuleId}`;
  readonly name: ExecutiveTimelineExperienceRegistryValidationRuleId;
  readonly order: number;
  readonly statement: string;
  readonly result: "Pass";
  readonly failClosed: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceRegistrySummary {
  readonly identity: "EX-3:2/ExecutiveTimelineExperienceRegistry";
  readonly namespace: "nexora.ex.executive.timeline.experience.registry";
  readonly version: "1.0.0";
  readonly status: "Registry";
  readonly readiness: "ReadyForModel";
  readonly previousPhase: "EX-3:1 — Executive Timeline Experience Foundation";
  readonly nextPhase: "EX-3:3 — Executive Timeline Experience Model";
  readonly catalogueCount: 8;
  readonly totalRegisteredEntries: 65;
  readonly validationRuleCount: 10;
  readonly foundationIdentity: "EX-3:1/ExecutiveTimelineExperienceFoundation";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly modelCreated: false;
  readonly modelAuthorized: false;
}
