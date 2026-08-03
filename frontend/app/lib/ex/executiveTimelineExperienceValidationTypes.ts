/** EX-3:4 closed metadata-only Validation types. */

export type ExecutiveTimelineExperienceValidationCategoryName =
  | "IdentityIntegrity"
  | "NamespaceIntegrity"
  | "EntityIntegrity"
  | "RelationshipIntegrity"
  | "SchemaIntegrity"
  | "MetadataIntegrity"
  | "ManifestIntegrity"
  | "DependencyIntegrity"
  | "DeterministicOrdering"
  | "ReadinessIntegrity"
  | "ArchitecturalBoundaryIntegrity"
  | "AggregateConsistency";

export interface ExecutiveTimelineExperienceValidationCategory {
  readonly categoryId: `EX-3:4/Category/${ExecutiveTimelineExperienceValidationCategoryName}`;
  readonly name: ExecutiveTimelineExperienceValidationCategoryName;
  readonly order: number;
  readonly statement: string;
  readonly ruleCount: 3;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceValidationRule {
  readonly ruleId: `EX-3:4/Rule/${string}`;
  readonly category: ExecutiveTimelineExperienceValidationCategoryName;
  readonly order: number;
  readonly localOrder: 1 | 2 | 3;
  readonly statement: string;
  readonly result: "Pass";
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveTimelineExperienceValidationSummary {
  readonly identity: "EX-3:4/ExecutiveTimelineExperienceValidation";
  readonly namespace: "nexora.ex.executive.timeline.experience.validation";
  readonly version: "1.0.0";
  readonly status: "Validation";
  readonly readiness: "ReadyForManifest";
  readonly previousPhase: "EX-3:3 — Executive Timeline Experience Model";
  readonly nextPhase: "EX-3:5 — Executive Timeline Experience Manifest";
  readonly categoryCount: 12;
  readonly ruleCount: 36;
  readonly modelIdentity: "EX-3:3/ExecutiveTimelineExperienceModel";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly sideEffectFree: true;
  readonly manifestCreated: false;
  readonly manifestAuthorized: false;
}
