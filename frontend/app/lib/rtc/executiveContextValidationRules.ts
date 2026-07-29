/**
 * RTC-1:4 — Executive Context Validation Rules.
 *
 * Canonical validation rule baseline for non-integrity categories.
 * Policies only — evaluation is declared, not executed.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

import type { ExecutiveContextValidationCategoryName } from "./executiveContextValidationCategories.ts";
import type { ExecutiveContextValidationSeverityLevel } from "./executiveContextValidationSeverity.ts";

/** Canonical validation rule declaration. */
export interface ExecutiveContextValidationRuleDeclaration {
  readonly ruleId: string;
  readonly ruleKey: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveContextValidationCategoryName;
  readonly severity: ExecutiveContextValidationSeverityLevel;
  readonly preventsActivation: boolean;
  readonly executionOrder: number;
  readonly categoryOrder: number;
  readonly evaluatesOnly: true;
  readonly mutatesState: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const rule = (
  category: ExecutiveContextValidationCategoryName,
  categoryOrder: number,
  executionOrder: number,
  ruleKey: string,
  name: string,
  description: string,
  severity: ExecutiveContextValidationSeverityLevel,
): ExecutiveContextValidationRuleDeclaration =>
  Object.freeze({
    ruleId: `RTC-1:4/Rule/${String(executionOrder).padStart(2, "0")}`,
    ruleKey,
    name,
    description,
    category,
    severity,
    preventsActivation: severity === "Error" || severity === "Critical",
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
 * Integrity rules live in executiveContextIntegrityValidation.ts.
 */
export const ExecutiveContextValidationRules = Object.freeze([
  // Identity — 01..04
  rule(
    "Identity",
    1,
    1,
    "ContextIdMustExist",
    "Context ID must exist",
    "Executive Context identity must be present.",
    "Critical",
  ),
  rule(
    "Identity",
    2,
    2,
    "ContextIdMustBeImmutable",
    "Context ID must be immutable",
    "Executive Context identity must never change after creation.",
    "Critical",
  ),
  rule(
    "Identity",
    3,
    3,
    "EntityIdsMustBeUnique",
    "Entity IDs must be unique",
    "All entity identities within a context must be unique.",
    "Error",
  ),
  rule(
    "Identity",
    4,
    4,
    "RootIdentityMustBePresent",
    "Root identity must be present",
    "Root ExecutiveContext identity structure must be present.",
    "Critical",
  ),

  // Structure — 05..08
  rule(
    "Structure",
    1,
    5,
    "RootExecutiveContextExists",
    "Root ExecutiveContext exists",
    "Canonical root ExecutiveContext entity must exist.",
    "Critical",
  ),
  rule(
    "Structure",
    2,
    6,
    "RequiredEntitiesArePresent",
    "Required entities are present",
    "All required first-level entities must be present.",
    "Error",
  ),
  rule(
    "Structure",
    3,
    7,
    "EntityHierarchyIsComplete",
    "Entity hierarchy is complete",
    "Declared entity hierarchy must be complete.",
    "Error",
  ),
  rule(
    "Structure",
    4,
    8,
    "NoUnsupportedRootEntities",
    "No unsupported root entities exist",
    "Unsupported root-level entities are rejected.",
    "Error",
  ),

  // Ownership — 09..12
  rule(
    "Ownership",
    1,
    9,
    "EveryChildHasExactlyOneOwner",
    "Every child has exactly one owner",
    "Each child entity must have exactly one owner.",
    "Error",
  ),
  rule(
    "Ownership",
    2,
    10,
    "NoCircularOwnership",
    "No circular ownership",
    "Circular ownership graphs are rejected.",
    "Critical",
  ),
  rule(
    "Ownership",
    3,
    11,
    "OwnershipFollowsRuntimeModel",
    "Ownership hierarchy follows the Runtime Model",
    "Ownership must match the RTC-1:3 hierarchy.",
    "Error",
  ),
  rule(
    "Ownership",
    4,
    12,
    "DetachedEntitiesAreRejected",
    "Detached entities are rejected",
    "Entities without a valid owner are rejected.",
    "Error",
  ),

  // References — 13..16
  rule(
    "References",
    1,
    13,
    "EveryReferenceResolves",
    "Every reference resolves",
    "All immutable references must resolve to known identities.",
    "Error",
  ),
  rule(
    "References",
    2,
    14,
    "NoOrphanReferences",
    "No orphan references",
    "Orphan references are rejected.",
    "Error",
  ),
  rule(
    "References",
    3,
    15,
    "NoDuplicatePrimaryReferences",
    "No duplicate primary references",
    "Primary references must not be duplicated.",
    "Error",
  ),
  rule(
    "References",
    4,
    16,
    "CrossEntityReferencesRemainTypeSafe",
    "Cross-entity references remain type-safe",
    "Cross-entity references must preserve registered types.",
    "Error",
  ),

  // Lifecycle — 17..20
  rule(
    "Lifecycle",
    1,
    17,
    "LifecycleStateIsValid",
    "Context lifecycle state is valid",
    "Lifecycle state must be one of the formal lifecycle states.",
    "Error",
  ),
  rule(
    "Lifecycle",
    2,
    18,
    "ActiveLifecycleIsUnique",
    "Active lifecycle is unique",
    "Only one context may remain in Active lifecycle.",
    "Critical",
  ),
  rule(
    "Lifecycle",
    3,
    19,
    "ArchivedCannotBecomeActiveDirectly",
    "Archived contexts cannot become Active directly",
    "Archived contexts cannot transition directly to Active.",
    "Error",
  ),
  rule(
    "Lifecycle",
    4,
    20,
    "SnapshotReferencesAreConsistent",
    "Snapshot references are internally consistent",
    "Snapshot references must be internally consistent.",
    "Error",
  ),

  // Workspace — 21..24
  rule(
    "Workspace",
    1,
    21,
    "ActiveWorkspaceExists",
    "Active Workspace exists",
    "Exactly one active Workspace must exist.",
    "Critical",
  ),
  rule(
    "Workspace",
    2,
    22,
    "WorkspaceTypeIsRegistered",
    "Workspace type is registered",
    "Workspace type must exist in the Runtime Registry.",
    "Error",
  ),
  rule(
    "Workspace",
    3,
    23,
    "WorkspaceIdentityIsValid",
    "Workspace identity is valid",
    "Workspace identity must be present and stable.",
    "Error",
  ),
  rule(
    "Workspace",
    4,
    24,
    "WorkspaceStatusIsRecognised",
    "Workspace status is recognised",
    "Workspace status must be a recognised runtime status.",
    "Warning",
  ),

  // Timeline — 25..28
  rule(
    "Timeline",
    1,
    25,
    "TimelineEntityExists",
    "Timeline entity exists",
    "Timeline entity must exist within the Executive Context.",
    "Critical",
  ),
  rule(
    "Timeline",
    2,
    26,
    "TimelineModeIsRegistered",
    "Timeline mode is registered",
    "Timeline mode must exist in the Runtime Registry.",
    "Error",
  ),
  rule(
    "Timeline",
    3,
    27,
    "SnapshotReferenceIsValid",
    "Snapshot reference is valid",
    "Optional snapshot reference must resolve when present.",
    "Error",
  ),
  rule(
    "Timeline",
    4,
    28,
    "TimelinePositionIsConsistent",
    "Timeline position is internally consistent",
    "Timeline position must be internally consistent.",
    "Warning",
  ),

  // Focus — 29..32
  rule(
    "Focus",
    1,
    29,
    "ZeroOrOneActiveFocus",
    "Zero or one active focus",
    "At most one active focus may exist.",
    "Error",
  ),
  rule(
    "Focus",
    2,
    30,
    "FocusTargetExists",
    "Focus target exists",
    "When focus is present, its target must exist.",
    "Error",
  ),
  rule(
    "Focus",
    3,
    31,
    "FocusTargetTypeIsRegistered",
    "Focus target type is registered",
    "Focus target type must be a registered runtime type.",
    "Error",
  ),
  rule(
    "Focus",
    4,
    32,
    "FocusTimestampIsPresent",
    "Focus timestamp is present",
    "When focus is present, timestamp metadata must exist.",
    "Warning",
  ),

  // Metadata — 33..36
  rule(
    "Metadata",
    1,
    33,
    "VersionExists",
    "Version exists",
    "Runtime metadata version must exist.",
    "Error",
  ),
  rule(
    "Metadata",
    2,
    34,
    "TimestampExists",
    "Timestamp exists",
    "Runtime metadata timestamp must exist.",
    "Error",
  ),
  rule(
    "Metadata",
    3,
    35,
    "RuntimeOriginExists",
    "Runtime origin exists",
    "Runtime origin metadata must exist.",
    "Error",
  ),
  rule(
    "Metadata",
    4,
    36,
    "MetadataSchemaIsComplete",
    "Metadata schema is complete",
    "Metadata schema must include all required categories.",
    "Warning",
  ),
] as const);
