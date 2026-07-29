/**
 * EX-1:4 — Executive Stage Validation Rules.
 *
 * Canonical validation rule baseline for non-integrity categories.
 * Policies only — evaluation is declared, not executed.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

import type { ExecutiveStageValidationCategoryName } from "./executiveStageValidationCategories.ts";
import type { ExecutiveStageValidationSeverityLevel } from "./executiveStageValidationSeverity.ts";

/** Canonical validation rule declaration. */
export interface ExecutiveStageValidationRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveStageValidationCategoryName;
  readonly severity: ExecutiveStageValidationSeverityLevel;
  readonly preventsRendering: boolean;
  readonly executionOrder: number;
  readonly categoryOrder: number;
  readonly evaluatesOnly: true;
  readonly mutatesState: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  category: ExecutiveStageValidationCategoryName,
  categoryOrder: number,
  executionOrder: number,
  ruleKey: string,
  name: string,
  description: string,
  severity: ExecutiveStageValidationSeverityLevel,
): ExecutiveStageValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `EX-1:4/Rule/${String(executionOrder).padStart(2, "0")}`,
    ruleKey,
    name,
    description,
    category,
    severity,
    preventsRendering: severity === "Error" || severity === "Critical",
    executionOrder,
    categoryOrder,
    evaluatesOnly: true as const,
    mutatesState: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Non-integrity validation rules (36).
 * Integrity rules live in executiveStageIntegrityValidation.ts.
 */
export const ExecutiveStageValidationRules = Object.freeze([
  // Identity — 01..04
  rule(
    "Identity",
    1,
    1,
    "StageIdentityMustExist",
    "Stage identity exists",
    "Executive Stage identity must be present.",
    "Critical",
  ),
  rule(
    "Identity",
    2,
    2,
    "EntityIdentitiesMustBeUnique",
    "Entity identities are unique",
    "All visual entity identities within a Stage must be unique.",
    "Error",
  ),
  rule(
    "Identity",
    3,
    3,
    "RootIdentityMustBeImmutable",
    "Root identity is immutable",
    "Root ExecutiveStage identity must never change after creation.",
    "Critical",
  ),
  rule(
    "Identity",
    4,
    4,
    "RegistryIdentitiesMustBeRecognised",
    "Registry identities are recognised",
    "Stage identities must be recognised by the Executive Stage Registry.",
    "Error",
  ),

  // Structure — 05..08
  rule(
    "Structure",
    1,
    5,
    "ExecutiveStageRootExists",
    "ExecutiveStage root exists",
    "Canonical root ExecutiveStage entity must exist.",
    "Critical",
  ),
  rule(
    "Structure",
    2,
    6,
    "RequiredChildEntitiesExist",
    "Required child entities exist",
    "All required first-level Stage entities must be present.",
    "Error",
  ),
  rule(
    "Structure",
    3,
    7,
    "OwnershipHierarchyIsComplete",
    "Ownership hierarchy is complete",
    "Declared Stage ownership hierarchy must be complete.",
    "Error",
  ),
  rule(
    "Structure",
    4,
    8,
    "NoUnsupportedEntitiesExist",
    "No unsupported entities exist",
    "Unsupported Stage entities are rejected.",
    "Error",
  ),

  // Layers — 09..12
  rule(
    "Layers",
    1,
    9,
    "SixCanonicalLayersExist",
    "Six canonical layers exist",
    "Stage must declare exactly six canonical layers.",
    "Critical",
  ),
  rule(
    "Layers",
    2,
    10,
    "LayerOrderIsCorrect",
    "Layer order is correct",
    "Canonical layer order must match the Stage Model.",
    "Critical",
  ),
  rule(
    "Layers",
    3,
    11,
    "DuplicateLayersAreRejected",
    "Duplicate layers are rejected",
    "Duplicate layer identities are rejected.",
    "Error",
  ),
  rule(
    "Layers",
    4,
    12,
    "RequiredLayersArePresent",
    "Required layers are present",
    "All required canonical layers must be present.",
    "Error",
  ),

  // Objects — 13..16
  rule(
    "Objects",
    1,
    13,
    "ObjectIdentitiesAreUnique",
    "Object identities are unique",
    "Stage object identities must be unique.",
    "Error",
  ),
  rule(
    "Objects",
    2,
    14,
    "ObjectRuntimeReferencesExist",
    "Runtime references exist",
    "Stage objects must carry immutable Runtime object references.",
    "Error",
  ),
  rule(
    "Objects",
    3,
    15,
    "VisibilityStatesAreValid",
    "Visibility states are valid",
    "Object visibility states must be valid Stage visibility values.",
    "Error",
  ),
  rule(
    "Objects",
    4,
    16,
    "SelectionStateIsConsistent",
    "Selection state is consistent",
    "Object selection state must be internally consistent.",
    "Warning",
  ),

  // Relationships — 17..20
  rule(
    "Relationships",
    1,
    17,
    "SourceObjectExists",
    "Source object exists",
    "Relationship source object must exist on the Stage.",
    "Error",
  ),
  rule(
    "Relationships",
    2,
    18,
    "TargetObjectExists",
    "Target object exists",
    "Relationship target object must exist on the Stage.",
    "Error",
  ),
  rule(
    "Relationships",
    3,
    19,
    "RelationshipTypeIsRegistered",
    "Relationship type is registered",
    "Relationship type must exist in the Stage Registry.",
    "Error",
  ),
  rule(
    "Relationships",
    4,
    20,
    "SelfReferentialRelationshipsFollowModelRules",
    "Self-referential relationships follow model rules",
    "Self-referential relationships must follow Stage Model rules.",
    "Warning",
  ),

  // Focus — 21..24
  rule(
    "Focus",
    1,
    21,
    "ZeroOrOneActiveFocus",
    "Zero or one active focus",
    "At most one active focus may exist.",
    "Error",
  ),
  rule(
    "Focus",
    2,
    22,
    "FocusTargetExists",
    "Focus target exists",
    "When focus is present, its target must exist.",
    "Error",
  ),
  rule(
    "Focus",
    3,
    23,
    "FocusTypeIsValid",
    "Focus type is valid",
    "Focus type must be a registered Stage focus type.",
    "Error",
  ),
  rule(
    "Focus",
    4,
    24,
    "FocusTimestampExists",
    "Focus timestamp exists",
    "When focus is present, timestamp metadata must exist.",
    "Warning",
  ),

  // Interactions — 25..28
  rule(
    "Interactions",
    1,
    25,
    "RegisteredInteractionTypesOnly",
    "Registered interaction types only",
    "Only registered Stage interaction types are permitted.",
    "Error",
  ),
  rule(
    "Interactions",
    2,
    26,
    "InteractionTargetsExist",
    "Interaction targets exist",
    "Interaction targets must resolve to known Stage identities.",
    "Error",
  ),
  rule(
    "Interactions",
    3,
    27,
    "DuplicateInteractionIdentitiesRejected",
    "Duplicate interaction identities are rejected",
    "Duplicate interaction identities are rejected.",
    "Error",
  ),
  rule(
    "Interactions",
    4,
    28,
    "InteractionAvailabilityIsDefined",
    "Interaction availability is defined",
    "Interaction availability must be defined for every interaction.",
    "Warning",
  ),

  // Runtime Binding — 29..32
  rule(
    "Runtime Binding",
    1,
    29,
    "RuntimeReferencesResolve",
    "Runtime references resolve",
    "All Stage Runtime references must resolve to known identities.",
    "Error",
  ),
  rule(
    "Runtime Binding",
    2,
    30,
    "RuntimeContextExists",
    "Runtime Context exists",
    "Stage surface must bind to an existing Runtime Context identity.",
    "Critical",
  ),
  rule(
    "Runtime Binding",
    3,
    31,
    "RuntimeBindingTypesAreValid",
    "Runtime binding types are valid",
    "Runtime binding types must match the Stage Model binding catalogue.",
    "Error",
  ),
  rule(
    "Runtime Binding",
    4,
    32,
    "NoDirectRuntimeMutationPaths",
    "No direct Runtime mutation paths exist",
    "Stage validation rejects any direct Runtime mutation path.",
    "Critical",
  ),

  // Metadata — 33..36
  rule(
    "Metadata",
    1,
    33,
    "MetadataExists",
    "Metadata exists",
    "Stage metadata structure must exist.",
    "Error",
  ),
  rule(
    "Metadata",
    2,
    34,
    "VersionExists",
    "Version exists",
    "Stage metadata version must exist.",
    "Error",
  ),
  rule(
    "Metadata",
    3,
    35,
    "RuntimeVersionExists",
    "Runtime version exists",
    "Stage metadata must include Runtime version.",
    "Error",
  ),
  rule(
    "Metadata",
    4,
    36,
    "CreationMetadataIsComplete",
    "Creation metadata is complete",
    "Stage creation metadata must be complete.",
    "Warning",
  ),
] as const);
