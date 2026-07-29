/**
 * RTC-1:3 — Executive Context Model.
 *
 * Canonical root ExecutiveContext entity and companion first-level entities
 * without dedicated deliverable files (Identity, Lifecycle, Manager, Company,
 * Focus, Journal, Advisor, Director, Metadata). Structure only.
 *
 * Ownership: owned exclusively by RTC-1:3.
 */

/** Shared entity field declaration — structure only. */
export interface ExecutiveRuntimeEntityField {
  readonly fieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly required: boolean;
  readonly isReference: boolean;
  readonly order: number;
  readonly mutable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Shared entity model declaration. */
export interface ExecutiveRuntimeEntityModel {
  readonly entityId: string;
  readonly entityName: string;
  readonly description: string;
  readonly root: boolean;
  readonly fields: readonly ExecutiveRuntimeEntityField[];
  readonly fieldCount: number;
  readonly stableIdentity: true;
  readonly storesRuntimeValues: false;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const field = (
  entityName: string,
  fieldName: string,
  description: string,
  order: number,
  required = true,
  isReference = false,
): ExecutiveRuntimeEntityField =>
  Object.freeze({
    fieldId: `RTC-1:3/${entityName}/Field/${fieldName}`,
    fieldName,
    description,
    required,
    isReference,
    order,
    mutable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const entity = (
  entityName: string,
  description: string,
  fields: readonly ExecutiveRuntimeEntityField[],
  order: number,
  root = false,
): ExecutiveRuntimeEntityModel =>
  Object.freeze({
    entityId: `RTC-1:3/Entity/${entityName}`,
    entityName,
    description,
    root,
    fields: Object.freeze([...fields]),
    fieldCount: fields.length,
    stableIdentity: true as const,
    storesRuntimeValues: false as const,
    executable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Supported Executive Context types. Only one context is active at any moment. */
export const ExecutiveContextTypes = Object.freeze([
  Object.freeze({
    typeId: "RTC-1:3/ContextType/01",
    name: "Global Context",
    description: "Global executive runtime context type.",
    order: 1,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    typeId: "RTC-1:3/ContextType/02",
    name: "Workspace Context",
    description: "Workspace-scoped executive runtime context type.",
    order: 2,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    typeId: "RTC-1:3/ContextType/03",
    name: "Pack Context",
    description: "Pack-scoped executive runtime context type.",
    order: 3,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    typeId: "RTC-1:3/ContextType/04",
    name: "Object Context",
    description: "Object-scoped executive runtime context type.",
    order: 4,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  Object.freeze({
    typeId: "RTC-1:3/ContextType/05",
    name: "Timeline Context",
    description: "Timeline-scoped executive runtime context type.",
    order: 5,
    metadataOnly: true as const,
    immutable: true as const,
  }),
] as const);

/** Identity entity fields. */
export const ExecutiveIdentityModel = entity(
  "Identity",
  "Immutable runtime context identity structure.",
  Object.freeze([
    field("Identity", "contextId", "Stable Executive Context identity.", 1),
    field("Identity", "prefix", "Identity prefix (RTC-CTX).", 2),
    field("Identity", "sequence", "Identity sequence component.", 3),
  ]),
  1,
);

/** Lifecycle entity fields — reference only; transitions excluded. */
export const ExecutiveLifecycleModel = entity(
  "Lifecycle",
  "Lifecycle reference structure for the Executive Context.",
  Object.freeze([
    field("Lifecycle", "lifecycleState", "Current lifecycle state reference.", 1),
    field(
      "Lifecycle",
      "lifecycleReference",
      "Immutable lifecycle vocabulary reference.",
      2,
      true,
      true,
    ),
  ]),
  2,
);

/** Manager entity fields. */
export const ExecutiveManagerModel = entity(
  "Manager",
  "Manager participation structure within Executive Context.",
  Object.freeze([
    field("Manager", "managerId", "Manager identity.", 1),
    field("Manager", "managerType", "Registered manager type reference.", 2, true, true),
    field("Manager", "metadata", "Manager metadata structure.", 3, false),
  ]),
  3,
);

/** Company entity fields. */
export const ExecutiveCompanyModel = entity(
  "Company",
  "Company scope structure within Executive Context.",
  Object.freeze([
    field("Company", "companyId", "Company identity.", 1),
    field("Company", "companyType", "Registered company category reference.", 2, true, true),
    field("Company", "metadata", "Company metadata structure.", 3, false),
  ]),
  4,
);

/** Focus entity — only one active focus exists. */
export const ExecutiveFocusModel = entity(
  "Focus",
  "Executive attention focus structure. Zero or one active focus.",
  Object.freeze([
    field("Focus", "focusId", "Focus identity.", 1),
    field("Focus", "targetType", "Focused target type.", 2),
    field("Focus", "targetId", "Focused target identity reference.", 3, true, true),
    field("Focus", "reason", "Reason the focus was established.", 4, false),
    field("Focus", "timestamp", "Focus timestamp metadata.", 5),
  ]),
  8,
);

/** Journal entity — conversation logic deferred. */
export const ExecutiveJournalModel = entity(
  "Journal",
  "Journal structure within Executive Context. Conversation logic deferred.",
  Object.freeze([
    field("Journal", "journalId", "Journal identity.", 1),
    field("Journal", "currentThread", "Current journal thread reference.", 2, false, true),
    field("Journal", "selectedPack", "Selected pack reference.", 3, false, true),
    field("Journal", "metadata", "Journal metadata structure.", 4, false),
  ]),
  10,
);

/** Advisor entity — AI reasoning excluded. */
export const ExecutiveAdvisorModel = entity(
  "Advisor",
  "Advisor structure within Executive Context. AI reasoning excluded.",
  Object.freeze([
    field("Advisor", "advisorId", "Advisor identity.", 1),
    field("Advisor", "mode", "Advisor mode reference.", 2, true, true),
    field(
      "Advisor",
      "conversationReference",
      "Conversation reference.",
      3,
      false,
      true,
    ),
    field(
      "Advisor",
      "suggestionReference",
      "Suggestion reference.",
      4,
      false,
      true,
    ),
  ]),
  12,
);

/** Director entity — animation outside Runtime. */
export const ExecutiveDirectorModel = entity(
  "Director",
  "Director structure within Executive Context. Animation excluded.",
  Object.freeze([
    field("Director", "directorId", "Director identity.", 1),
    field("Director", "sceneMode", "Scene mode reference.", 2, true, true),
    field(
      "Director",
      "transitionReference",
      "Transition reference.",
      3,
      false,
      true,
    ),
    field("Director", "metadata", "Director metadata structure.", 4, false),
  ]),
  13,
);

/** Metadata entity fields. */
export const ExecutiveMetadataModel = entity(
  "Metadata",
  "Immutable runtime metadata structure for Executive Context.",
  Object.freeze([
    field("Metadata", "identity", "Metadata identity category.", 1),
    field("Metadata", "version", "Metadata version category.", 2),
    field("Metadata", "timestamp", "Metadata timestamp category.", 3),
    field("Metadata", "snapshot", "Metadata snapshot category.", 4, false),
    field("Metadata", "runtimeSource", "Runtime source category.", 5, false),
    field("Metadata", "contextOrigin", "Context origin category.", 6, false),
  ]),
  14,
);

/**
 * Root ExecutiveContext entity model.
 * Everything belongs to this root.
 */
export const ExecutiveContextModel = entity(
  "ExecutiveContext",
  "Canonical root runtime entity. Everything belongs to this root.",
  Object.freeze([
    field("ExecutiveContext", "identity", "Root identity structure.", 1),
    field("ExecutiveContext", "lifecycle", "Lifecycle reference structure.", 2),
    field("ExecutiveContext", "manager", "Manager participation structure.", 3),
    field("ExecutiveContext", "company", "Company scope structure.", 4),
    field("ExecutiveContext", "workspace", "Active workspace structure.", 5),
    field("ExecutiveContext", "pack", "Active pack structure.", 6, false),
    field("ExecutiveContext", "focus", "Active focus structure.", 7, false),
    field("ExecutiveContext", "timeline", "Timeline structure.", 8),
    field("ExecutiveContext", "journal", "Journal structure.", 9),
    field("ExecutiveContext", "stage", "Stage structure.", 10),
    field("ExecutiveContext", "advisor", "Advisor structure.", 11),
    field("ExecutiveContext", "director", "Director structure.", 12),
    field("ExecutiveContext", "metadata", "Metadata structure.", 13),
  ]),
  0,
  true,
);

/** Ordered first-level entity models under ExecutiveContext. */
export const ExecutiveContextFirstLevelEntities = Object.freeze([
  ExecutiveIdentityModel,
  ExecutiveLifecycleModel,
  ExecutiveManagerModel,
  ExecutiveCompanyModel,
  ExecutiveFocusModel,
  ExecutiveJournalModel,
  ExecutiveAdvisorModel,
  ExecutiveDirectorModel,
  ExecutiveMetadataModel,
] as const);

/** First-level entity names declared by the specification. */
export const ExecutiveContextEntityNames = Object.freeze([
  "Identity",
  "Lifecycle",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "Focus",
  "Timeline",
  "Journal",
  "Stage",
  "Advisor",
  "Director",
  "Metadata",
] as const);
