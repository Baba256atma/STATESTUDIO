/**
 * NOL-1:2 — Universal NexoraObject Contract Model
 *
 * Official immutable public contract for every Nexora component.
 * Upstream: NOL-1:1 UniversalNexoraObjectFoundation only.
 *
 * Identity: NOL-1:2/UniversalNexoraObjectContractModel
 */

import {
  NOL_FOUNDATION_IDENTITY,
  NOL_FOUNDATION_VERSION,
  NEXORA_OBJECT_LIFECYCLES,
  NEXORA_OBJECT_STATUSES,
  NEXORA_OBJECT_TYPES,
  addNexoraObjectRelationship,
  appendNexoraObjectTimelineRef,
  cloneNexoraObject as foundationClone,
  createNexoraObject,
  createNexoraObjectSnapshot,
  deserializeNexoraObjectFromJson,
  exportNexoraObject as foundationExport,
  importNexoraObject as foundationImport,
  isNexoraObjectLifecycle,
  isNexoraObjectStatus,
  isNexoraObjectType,
  projectNexoraObjectForAssistant,
  projectNexoraObjectForDirector,
  removeNexoraObjectRelationship,
  serializeNexoraObjectToJson,
  updateNexoraObjectExecutive,
  updateNexoraObjectLifecycle,
  updateNexoraObjectMetadata,
  updateNexoraObjectRuntime,
  updateNexoraObjectStatus,
  updateNexoraObjectVisualization,
  type CreateNexoraObjectInput,
  type NexoraObject,
  type NexoraObjectEvent,
  type NexoraObjectEventType,
  type NexoraObjectKnowledgeFacet,
  type NexoraObjectKpiFacet,
  type NexoraObjectLifecycle,
  type NexoraObjectRelationship,
  type NexoraObjectRuntimeState,
  type NexoraObjectSnapshot,
  type NexoraObjectStatus,
  type NexoraObjectTimelineFacet,
  type NexoraObjectType,
  type NexoraObjectVisualizationState,
} from "../foundation/universalNexoraObjectFoundation.ts";

// ─── Contract identity & versions ───────────────────────────────────────────

export const NOL_CONTRACT_IDENTITY =
  "NOL-1:2/UniversalNexoraObjectContractModel" as const;

export const NOL_CONTRACT_NAMESPACE =
  "nexora.nol.universal.object.contract" as const;

export const NOL_CONTRACT_VERSION = "1.0.0" as const;

export const NOL_SCHEMA_VERSION = "1.0.0" as const;

export const NOL_CONTRACT_TAGS = Object.freeze([
  "[NOL-1:2]",
  "[UNIVERSAL_NEXORA_OBJECT_CONTRACT]",
  "[READ_WRITE_SEPARATED]",
  "[PUBLIC_API_ONLY]",
  "[FOUNDATION_BOUND]",
] as const);

/** Fixed section order — permanently frozen. */
export const NEXORA_OBJECT_CONTRACT_SECTIONS = Object.freeze([
  "Identity",
  "Classification",
  "Status",
  "Lifecycle",
  "Relationships",
  "Metadata",
  "Runtime",
  "Visualization",
  "Timeline",
  "Knowledge",
  "KPI",
  "Executive",
  "Events",
  "Serialization",
] as const);

export type NexoraObjectContractSection =
  (typeof NEXORA_OBJECT_CONTRACT_SECTIONS)[number];

export const RESERVED_METADATA_KEYS = Object.freeze([
  "id",
  "type",
  "caption",
  "owner",
  "version",
  "status",
  "lifecycle",
  "contractVersion",
  "schemaVersion",
  "foundationVersion",
] as const);

// ─── Classification ─────────────────────────────────────────────────────────

export const NEXORA_OBJECT_CATEGORIES = Object.freeze([
  "Strategy",
  "Execution",
  "Platform",
  "Measurement",
  "Organization",
  "Operations",
  "Intelligence",
  "Custom",
] as const);

export type NexoraObjectCategory = (typeof NEXORA_OBJECT_CATEGORIES)[number];

export const NEXORA_WORKSPACE_AFFINITIES = Object.freeze([
  "Goal",
  "Problem",
  "Analysis",
  "Scenario",
  "Decision",
  "Execution",
  "Monitoring",
  "War Room",
  "Data",
  "General",
] as const);

export type NexoraWorkspaceAffinity =
  (typeof NEXORA_WORKSPACE_AFFINITIES)[number];

export type NexoraObjectClassification = {
  readonly objectType: NexoraObjectType;
  readonly objectCategory: NexoraObjectCategory;
  readonly workspaceAffinity: NexoraWorkspaceAffinity;
  readonly systemObject: boolean;
  readonly customObject: boolean;
};

// ─── Contract section types ─────────────────────────────────────────────────

export type NexoraObjectContractIdentity = {
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly description: string;
  readonly createdAt: string;
  readonly owner: string;
  readonly version: number;
};

export type NexoraObjectContractMetadata = {
  readonly properties: Readonly<
    Record<string, string | number | boolean | null>
  >;
  readonly attributes: Readonly<Record<string, string>>;
  readonly tags: readonly string[];
  readonly notes: readonly string[];
  readonly customFields: Readonly<Record<string, unknown>>;
};

export type NexoraObjectContractRuntime = {
  readonly selected: boolean;
  readonly focused: boolean;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly dirty: boolean;
  readonly loading: boolean;
  readonly executing: boolean;
};

export type NexoraObjectContractExecutive = {
  readonly importance: number;
  readonly urgency: number;
  readonly priority: number;
  readonly attentionScore: number;
  readonly impactScore: number;
  readonly confidence: number;
};

export type NexoraObjectContractEvent = {
  readonly eventId: string;
  readonly objectId: string;
  readonly timestamp: string;
  readonly eventType: NexoraObjectEventType;
  readonly payload: Readonly<Record<string, unknown>>;
};

export type NexoraObjectContractVersions = {
  readonly contractVersion: typeof NOL_CONTRACT_VERSION;
  readonly schemaVersion: typeof NOL_SCHEMA_VERSION;
  readonly foundationVersion: typeof NOL_FOUNDATION_VERSION;
};

/**
 * Canonical public contract — every NexoraObject must satisfy this interface.
 * Section ordering is fixed permanently.
 */
export type NexoraObjectContract = NexoraObjectContractVersions & {
  readonly identity: NexoraObjectContractIdentity;
  readonly classification: NexoraObjectClassification;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly metadata: NexoraObjectContractMetadata;
  readonly runtime: NexoraObjectContractRuntime;
  readonly visualization: NexoraObjectVisualizationState;
  readonly timeline: NexoraObjectTimelineFacet;
  readonly knowledge: NexoraObjectKnowledgeFacet;
  readonly kpi: NexoraObjectKpiFacet;
  readonly executive: NexoraObjectContractExecutive;
  readonly events: readonly NexoraObjectContractEvent[];
};

// ─── Validation errors ──────────────────────────────────────────────────────

export type NexoraObjectContractErrorCode =
  | "INVALID_IDENTITY"
  | "INVALID_TYPE"
  | "INVALID_STATUS"
  | "INVALID_LIFECYCLE"
  | "INVALID_STATUS_TRANSITION"
  | "INVALID_LIFECYCLE_RULE"
  | "INVALID_RELATIONSHIP"
  | "INVALID_SERIALIZATION"
  | "MISSING_REQUIRED_FIELD"
  | "CONTRACT_VERSION_MISMATCH"
  | "READ_ONLY"
  | "EXECUTION_FORBIDDEN"
  | "RESERVED_METADATA_KEY";

export type NexoraObjectContractError = {
  readonly code: NexoraObjectContractErrorCode;
  readonly field: string;
  readonly message: string;
};

export class NexoraObjectContractException extends Error {
  readonly code: NexoraObjectContractErrorCode;
  readonly field: string;
  constructor(err: NexoraObjectContractError) {
    super(err.message);
    this.name = "NexoraObjectContractException";
    this.code = err.code;
    this.field = err.field;
  }
}

export type NexoraObjectContractValidationResult =
  | {
      readonly ok: true;
      readonly contract: NexoraObjectContract;
      readonly errors: readonly [];
    }
  | {
      readonly ok: false;
      readonly contract: null;
      readonly errors: readonly NexoraObjectContractError[];
    };

// ─── Read / Mutation public views ───────────────────────────────────────────

type NexoraObjectHandleBase = NexoraObjectContract & {
  getRelationships(): readonly NexoraObjectRelationship[];
  findRelationship(
    predicate: (edge: NexoraObjectRelationship) => boolean,
  ): NexoraObjectRelationship | null;
  hasRelationship(
    predicate: (edge: NexoraObjectRelationship) => boolean,
  ): boolean;
  toJSON(): string;
  snapshot(snapshotId: string): NexoraObjectSnapshot;
  export(): ReturnType<typeof foundationExport>;
};

export type ReadonlyNexoraObject = NexoraObjectHandleBase & {
  readonly mode: "readonly";
};

export type MutableNexoraObject = NexoraObjectHandleBase & {
  readonly mode: "mutable";
  addRelationship(
    edge: Omit<NexoraObjectRelationship, "fromId"> & { readonly fromId?: string },
  ): MutableNexoraObject;
  removeRelationship(relationshipId: string): MutableNexoraObject;
  setStatus(status: NexoraObjectStatus): MutableNexoraObject;
  setLifecycle(lifecycle: NexoraObjectLifecycle): MutableNexoraObject;
  setRuntime(patch: Partial<NexoraObjectRuntimeState>): MutableNexoraObject;
  setVisualization(
    patch: Partial<NexoraObjectVisualizationState>,
  ): MutableNexoraObject;
  setExecutive(
    patch: Partial<{
      readonly importance: number;
      readonly urgency: number;
      readonly priority: number;
      readonly attentionScore: number;
      readonly impactScore: number;
      readonly confidence: number;
    }>,
  ): MutableNexoraObject;
  setMetadata(
    patch: Partial<{
      readonly tags: readonly string[];
      readonly properties: Readonly<
        Record<string, string | number | boolean | null>
      >;
      readonly attributes: Readonly<Record<string, string>>;
      readonly notes: readonly string[];
      readonly customFields: Readonly<Record<string, unknown>>;
    }>,
  ): MutableNexoraObject;
  appendTimelineRef(
    facet: keyof Omit<NexoraObjectTimelineFacet, "replayPosition">,
    refId: string,
  ): MutableNexoraObject;
  clone(newId: string): MutableNexoraObject;
  restore(snapshot: NexoraObjectSnapshot): MutableNexoraObject;
};

export type AnyNexoraObject = ReadonlyNexoraObject | MutableNexoraObject;

// ─── Projections ────────────────────────────────────────────────────────────

export type DirectorObjectView = ReturnType<
  typeof projectNexoraObjectForDirector
> & { readonly contractVersion: typeof NOL_CONTRACT_VERSION };

export type AssistantObjectView = ReturnType<
  typeof projectNexoraObjectForAssistant
> & { readonly contractVersion: typeof NOL_CONTRACT_VERSION };

export type TimelineObjectView = {
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly timeline: NexoraObjectTimelineFacet;
  readonly events: readonly NexoraObjectContractEvent[];
  readonly contractVersion: typeof NOL_CONTRACT_VERSION;
};

export type RuntimeObjectView = {
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly runtime: NexoraObjectContractRuntime;
  readonly classification: NexoraObjectClassification;
  readonly contractVersion: typeof NOL_CONTRACT_VERSION;
};

// ─── Internal brand ─────────────────────────────────────────────────────────

const CONTRACT_BRAND = Symbol.for("nexora.nol.contract.v1");

function error(
  code: NexoraObjectContractErrorCode,
  field: string,
  message: string,
): NexoraObjectContractError {
  return Object.freeze({ code, field, message });
}

function fail(
  code: NexoraObjectContractErrorCode,
  field: string,
  message: string,
): never {
  throw new NexoraObjectContractException(error(code, field, message));
}

function classifyType(type: NexoraObjectType): NexoraObjectClassification {
  const customObject = type === "Custom";
  const systemObject = !customObject;

  let objectCategory: NexoraObjectCategory = "Custom";
  let workspaceAffinity: NexoraWorkspaceAffinity = "General";

  switch (type) {
    case "Goal":
    case "Intent":
    case "Problem":
      objectCategory = "Strategy";
      workspaceAffinity = type === "Goal" ? "Goal" : "Problem";
      break;
    case "Decision":
    case "Scenario":
    case "Action":
    case "Task":
      objectCategory = "Execution";
      workspaceAffinity =
        type === "Decision"
          ? "Decision"
          : type === "Scenario"
            ? "Scenario"
            : "Execution";
      break;
    case "Workspace":
    case "Pack":
    case "Journal":
    case "Timeline":
    case "Model":
      objectCategory = "Platform";
      workspaceAffinity = "General";
      break;
    case "Data":
    case "KPI":
    case "KOI":
      objectCategory = "Measurement";
      workspaceAffinity = type === "Data" ? "Data" : "Monitoring";
      break;
    case "Organization":
    case "Department":
    case "Person":
      objectCategory = "Organization";
      workspaceAffinity = "General";
      break;
    case "Asset":
    case "Product":
    case "Machine":
    case "Customer":
    case "Supplier":
      objectCategory = "Operations";
      workspaceAffinity = "Execution";
      break;
    case "Risk":
    case "Opportunity":
      objectCategory = "Intelligence";
      workspaceAffinity = "Analysis";
      break;
    case "Custom":
    default:
      objectCategory = "Custom";
      workspaceAffinity = "General";
      break;
  }

  return Object.freeze({
    objectType: type,
    objectCategory,
    workspaceAffinity,
    systemObject,
    customObject,
  });
}

function mapEvent(event: NexoraObjectEvent): NexoraObjectContractEvent {
  return Object.freeze({
    eventId: event.id,
    objectId: event.objectId,
    timestamp: event.at,
    eventType: event.type,
    payload: Object.freeze({ ...(event.payload ?? {}) }),
  });
}

function projectContract(object: NexoraObject): NexoraObjectContract {
  const executive: NexoraObjectContractExecutive = Object.freeze({
    importance: object.executive.importance,
    urgency: object.executive.urgency,
    priority: object.executive.executivePriority,
    attentionScore: object.executive.attentionScore,
    impactScore: object.executive.impactScore,
    confidence: object.executive.confidence,
  });

  return Object.freeze({
    contractVersion: NOL_CONTRACT_VERSION,
    schemaVersion: NOL_SCHEMA_VERSION,
    foundationVersion: NOL_FOUNDATION_VERSION,
    identity: Object.freeze({
      id: object.identity.id,
      type: object.identity.type,
      caption: object.identity.caption,
      description: object.identity.description,
      createdAt: object.identity.createdAt,
      owner: object.identity.owner,
      version: object.identity.version,
    }),
    classification: classifyType(object.identity.type),
    status: object.status,
    lifecycle: object.lifecycle,
    metadata: Object.freeze({
      properties: object.metadata.properties,
      attributes: object.metadata.attributes,
      tags: object.metadata.tags,
      notes: object.metadata.executiveNotes,
      customFields: object.metadata.customFields,
    }),
    runtime: Object.freeze({
      selected: object.runtime.selected,
      focused: object.runtime.focused,
      visible: object.runtime.visible,
      locked: object.runtime.locked,
      dirty: object.runtime.dirty,
      loading: object.runtime.loading,
      executing: object.runtime.executing,
    }),
    visualization: object.visualization,
    timeline: object.timeline,
    knowledge: object.knowledge,
    kpi: object.kpi,
    executive,
    events: Object.freeze(object.eventLog.map(mapEvent)),
  });
}

// ─── Status / lifecycle rules ───────────────────────────────────────────────

/** All Seed statuses may transition to any Seed status; STE owns policy limits. */
const STATUS_TRANSITIONS: Readonly<
  Record<NexoraObjectStatus, readonly NexoraObjectStatus[]>
> = Object.freeze({
  Green: Object.freeze([...NEXORA_OBJECT_STATUSES]),
  Yellow: Object.freeze([...NEXORA_OBJECT_STATUSES]),
  Red: Object.freeze([...NEXORA_OBJECT_STATUSES]),
  Blue: Object.freeze([...NEXORA_OBJECT_STATUSES]),
  White: Object.freeze([...NEXORA_OBJECT_STATUSES]),
  Black: Object.freeze([...NEXORA_OBJECT_STATUSES]),
});

export function canTransitionStatus(
  from: NexoraObjectStatus,
  to: NexoraObjectStatus,
): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}

export function assertLifecycleAllowsMutation(
  lifecycle: NexoraObjectLifecycle,
): NexoraObjectContractError | null {
  if (lifecycle === "Deleted") {
    return error(
      "READ_ONLY",
      "lifecycle",
      "Deleted objects are read-only and cannot be mutated.",
    );
  }
  return null;
}

export function assertLifecycleAllowsExecution(
  lifecycle: NexoraObjectLifecycle,
): NexoraObjectContractError | null {
  if (lifecycle === "Archived" || lifecycle === "Deleted") {
    return error(
      "EXECUTION_FORBIDDEN",
      "lifecycle",
      `${lifecycle} objects cannot execute.`,
    );
  }
  return null;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateNexoraObjectContract(
  value: unknown,
): NexoraObjectContractValidationResult {
  const errors: NexoraObjectContractError[] = [];

  if (!value || typeof value !== "object") {
    return {
      ok: false,
      contract: null,
      errors: Object.freeze([
        error("MISSING_REQUIRED_FIELD", "contract", "Contract must be an object."),
      ]),
    };
  }

  const candidate = value as Partial<NexoraObjectContract> & {
    readonly identity?: Partial<NexoraObjectContractIdentity>;
  };

  if (candidate.contractVersion && candidate.contractVersion !== NOL_CONTRACT_VERSION) {
    errors.push(
      error(
        "CONTRACT_VERSION_MISMATCH",
        "contractVersion",
        `Expected ${NOL_CONTRACT_VERSION}, received ${candidate.contractVersion}.`,
      ),
    );
  }

  if (!candidate.identity?.id?.trim()) {
    errors.push(error("INVALID_IDENTITY", "identity.id", "id is required."));
  }
  if (!candidate.identity?.type || !isNexoraObjectType(candidate.identity.type)) {
    errors.push(error("INVALID_TYPE", "identity.type", "type is invalid."));
  }
  if (!candidate.identity?.caption?.trim()) {
    errors.push(
      error("MISSING_REQUIRED_FIELD", "identity.caption", "caption is required."),
    );
  }
  if (!candidate.identity?.createdAt) {
    errors.push(
      error(
        "MISSING_REQUIRED_FIELD",
        "identity.createdAt",
        "createdAt is required.",
      ),
    );
  }
  if (!candidate.identity?.owner?.trim()) {
    errors.push(
      error("MISSING_REQUIRED_FIELD", "identity.owner", "owner is required."),
    );
  }
  if (
    typeof candidate.identity?.version !== "number" ||
    candidate.identity.version < 1
  ) {
    errors.push(
      error("INVALID_IDENTITY", "identity.version", "version must be >= 1."),
    );
  }

  if (!candidate.status || !isNexoraObjectStatus(candidate.status)) {
    errors.push(error("INVALID_STATUS", "status", "status is invalid."));
  }
  if (!candidate.lifecycle || !isNexoraObjectLifecycle(candidate.lifecycle)) {
    errors.push(
      error("INVALID_LIFECYCLE", "lifecycle", "lifecycle is invalid."),
    );
  }

  if (
    candidate.lifecycle === "Created" &&
    candidate.timeline &&
    candidate.timeline.history.length > 0
  ) {
    errors.push(
      error(
        "INVALID_LIFECYCLE_RULE",
        "timeline.history",
        "Created objects must have empty timeline history.",
      ),
    );
  }

  if (candidate.classification) {
    if (candidate.classification.objectType !== candidate.identity?.type) {
      errors.push(
        error(
          "INVALID_TYPE",
          "classification.objectType",
          "classification.objectType must match identity.type.",
        ),
      );
    }
  } else {
    errors.push(
      error(
        "MISSING_REQUIRED_FIELD",
        "classification",
        "classification section is required.",
      ),
    );
  }

  for (const section of NEXORA_OBJECT_CONTRACT_SECTIONS) {
    if (section === "Relationships" || section === "Serialization") continue;
    const key = section.toLowerCase() as keyof NexoraObjectContract;
    if (section === "Identity" && !candidate.identity) {
      errors.push(
        error("MISSING_REQUIRED_FIELD", "identity", "Identity section missing."),
      );
    }
    if (section === "KPI" && !candidate.kpi) {
      errors.push(error("MISSING_REQUIRED_FIELD", "kpi", "KPI section missing."));
    }
    if (section === "Events" && !candidate.events) {
      errors.push(
        error("MISSING_REQUIRED_FIELD", "events", "Events section missing."),
      );
    }
    void key;
  }

  if (errors.length > 0) {
    return { ok: false, contract: null, errors: Object.freeze(errors) };
  }

  return {
    ok: true,
    contract: Object.freeze(candidate as NexoraObjectContract),
    errors: Object.freeze([]) as readonly [],
  };
}

type ContractInternal = {
  readonly [CONTRACT_BRAND]: true;
};

export function isNexoraObject(value: unknown): value is AnyNexoraObject {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as ContractInternal)[CONTRACT_BRAND] === true,
  );
}

// ─── Handle factory ─────────────────────────────────────────────────────────

class NexoraObjectContractHandle {
  readonly [CONTRACT_BRAND] = true as const;
  readonly mode: "mutable" | "readonly";
  #object: NexoraObject;
  readonly #mutable: boolean;

  constructor(object: NexoraObject, mutable: boolean) {
    this.#object = object;
    this.#mutable = mutable;
    this.mode = mutable ? "mutable" : "readonly";
  }

  get contractVersion() {
    return NOL_CONTRACT_VERSION;
  }
  get schemaVersion() {
    return NOL_SCHEMA_VERSION;
  }
  get foundationVersion() {
    return NOL_FOUNDATION_VERSION;
  }
  get identity() {
    return projectContract(this.#object).identity;
  }
  get classification() {
    return projectContract(this.#object).classification;
  }
  get status() {
    return this.#object.status;
  }
  get lifecycle() {
    return this.#object.lifecycle;
  }
  get metadata() {
    return projectContract(this.#object).metadata;
  }
  get runtime() {
    return projectContract(this.#object).runtime;
  }
  get visualization() {
    return this.#object.visualization;
  }
  get timeline() {
    return this.#object.timeline;
  }
  get knowledge() {
    return this.#object.knowledge;
  }
  get kpi() {
    return this.#object.kpi;
  }
  get executive() {
    return projectContract(this.#object).executive;
  }
  get events() {
    return projectContract(this.#object).events;
  }

  getRelationships(): readonly NexoraObjectRelationship[] {
    return this.#object.relationships;
  }

  findRelationship(
    predicate: (edge: NexoraObjectRelationship) => boolean,
  ): NexoraObjectRelationship | null {
    return this.#object.relationships.find(predicate) ?? null;
  }

  hasRelationship(
    predicate: (edge: NexoraObjectRelationship) => boolean,
  ): boolean {
    return this.#object.relationships.some(predicate);
  }

  toJSON(): string {
    return serializeNexoraObjectToJson(this.#object);
  }

  snapshot(snapshotId: string): NexoraObjectSnapshot {
    return createNexoraObjectSnapshot(this.#object, snapshotId);
  }

  export() {
    return foundationExport(this.#object);
  }

  #assertMutable(): void {
    if (!this.#mutable) {
      fail("READ_ONLY", "mode", "ReadonlyNexoraObject cannot mutate.");
    }
    const lifecycleError = assertLifecycleAllowsMutation(this.#object.lifecycle);
    if (lifecycleError) {
      throw new NexoraObjectContractException(lifecycleError);
    }
  }

  addRelationship(
    edge: Omit<NexoraObjectRelationship, "fromId"> & { readonly fromId?: string },
  ): MutableNexoraObject {
    this.#assertMutable();
    if (edge.fromId && edge.fromId !== this.#object.identity.id) {
      fail(
        "INVALID_RELATIONSHIP",
        "relationship.fromId",
        "fromId must match object identity.",
      );
    }
    this.#object = addNexoraObjectRelationship(this.#object, edge);
    return this as unknown as MutableNexoraObject;
  }

  removeRelationship(relationshipId: string): MutableNexoraObject {
    this.#assertMutable();
    this.#object = removeNexoraObjectRelationship(this.#object, relationshipId);
    return this as unknown as MutableNexoraObject;
  }

  setStatus(status: NexoraObjectStatus): MutableNexoraObject {
    this.#assertMutable();
    if (!isNexoraObjectStatus(status)) {
      fail("INVALID_STATUS", "status", `Invalid status: ${status}`);
    }
    if (!canTransitionStatus(this.#object.status, status)) {
      fail(
        "INVALID_STATUS_TRANSITION",
        "status",
        `Cannot transition ${this.#object.status} → ${status}.`,
      );
    }
    this.#object = updateNexoraObjectStatus(this.#object, status);
    return this as unknown as MutableNexoraObject;
  }

  setLifecycle(lifecycle: NexoraObjectLifecycle): MutableNexoraObject {
    if (!this.#mutable) {
      fail("READ_ONLY", "mode", "ReadonlyNexoraObject cannot mutate.");
    }
    if (this.#object.lifecycle === "Deleted" && lifecycle !== "Deleted") {
      fail(
        "READ_ONLY",
        "lifecycle",
        "Deleted objects cannot leave Deleted lifecycle.",
      );
    }
    if (!isNexoraObjectLifecycle(lifecycle)) {
      fail(
        "INVALID_LIFECYCLE",
        "lifecycle",
        `Invalid lifecycle: ${lifecycle}`,
      );
    }
    this.#object = updateNexoraObjectLifecycle(this.#object, lifecycle);
    return this as unknown as MutableNexoraObject;
  }

  setRuntime(patch: Partial<NexoraObjectRuntimeState>): MutableNexoraObject {
    this.#assertMutable();
    if (patch.executing === true) {
      const execError = assertLifecycleAllowsExecution(this.#object.lifecycle);
      if (execError) {
        throw new NexoraObjectContractException(execError);
      }
    }
    this.#object = updateNexoraObjectRuntime(this.#object, patch);
    return this as unknown as MutableNexoraObject;
  }

  setVisualization(
    patch: Partial<NexoraObjectVisualizationState>,
  ): MutableNexoraObject {
    this.#assertMutable();
    this.#object = updateNexoraObjectVisualization(this.#object, patch);
    return this as unknown as MutableNexoraObject;
  }

  setExecutive(
    patch: Partial<{
      readonly importance: number;
      readonly urgency: number;
      readonly priority: number;
      readonly attentionScore: number;
      readonly impactScore: number;
      readonly confidence: number;
    }>,
  ): MutableNexoraObject {
    this.#assertMutable();
    this.#object = updateNexoraObjectExecutive(this.#object, {
      importance: patch.importance,
      urgency: patch.urgency,
      executivePriority: patch.priority,
      attentionScore: patch.attentionScore,
      impactScore: patch.impactScore,
      confidence: patch.confidence,
    });
    return this as unknown as MutableNexoraObject;
  }

  setMetadata(
    patch: Partial<{
      readonly tags: readonly string[];
      readonly properties: Readonly<
        Record<string, string | number | boolean | null>
      >;
      readonly attributes: Readonly<Record<string, string>>;
      readonly notes: readonly string[];
      readonly customFields: Readonly<Record<string, unknown>>;
    }>,
  ): MutableNexoraObject {
    this.#assertMutable();
    const keys = [
      ...Object.keys(patch.properties ?? {}),
      ...Object.keys(patch.attributes ?? {}),
      ...Object.keys(patch.customFields ?? {}),
    ];
    for (const key of keys) {
      if ((RESERVED_METADATA_KEYS as readonly string[]).includes(key)) {
        fail(
          "RESERVED_METADATA_KEY",
          `metadata.${key}`,
          `Metadata key “${key}” is reserved.`,
        );
      }
    }
    this.#object = updateNexoraObjectMetadata(this.#object, {
      tags: patch.tags,
      properties: patch.properties,
      attributes: patch.attributes,
      executiveNotes: patch.notes,
      customFields: patch.customFields,
    });
    return this as unknown as MutableNexoraObject;
  }

  appendTimelineRef(
    facet: keyof Omit<NexoraObjectTimelineFacet, "replayPosition">,
    refId: string,
  ): MutableNexoraObject {
    this.#assertMutable();
    if (this.#object.lifecycle === "Created" && facet === "history") {
      fail(
        "INVALID_LIFECYCLE_RULE",
        "timeline.history",
        "Created objects cannot accumulate timeline history. Activate first.",
      );
    }
    this.#object = appendNexoraObjectTimelineRef(this.#object, facet, refId);
    return this as unknown as MutableNexoraObject;
  }

  clone(newId: string): MutableNexoraObject {
    return new NexoraObjectContractHandle(
      foundationClone(this.#object, newId),
      true,
    ) as unknown as MutableNexoraObject;
  }

  restore(snapshot: NexoraObjectSnapshot): MutableNexoraObject {
    this.#assertMutable();
    if (snapshot.objectId !== this.#object.identity.id) {
      fail(
        "INVALID_SERIALIZATION",
        "snapshot.objectId",
        "Snapshot objectId must match current identity.",
      );
    }
    this.#object = snapshot.object;
    return this as unknown as MutableNexoraObject;
  }
}

function createHandle(
  object: NexoraObject,
  mutable: boolean,
): MutableNexoraObject | ReadonlyNexoraObject {
  return new NexoraObjectContractHandle(object, mutable) as
    | MutableNexoraObject
    | ReadonlyNexoraObject;
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export type CreateNexoraObjectContractInput = CreateNexoraObjectInput;

export function createNexoraObjectContract(
  input: CreateNexoraObjectContractInput,
): MutableNexoraObject {
  if (!isNexoraObjectType(input.type)) {
    fail("INVALID_TYPE", "type", `Unsupported type: ${input.type}`);
  }
  const object = createNexoraObject(input);
  const handle = createHandle(object, true) as MutableNexoraObject;
  const validation = validateNexoraObjectContract(projectContract(object));
  if (!validation.ok) {
    throw new NexoraObjectContractException(validation.errors[0]!);
  }
  return handle;
}

export function freezeNexoraObject(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): ReadonlyNexoraObject {
  if (!isNexoraObject(object)) {
    fail(
      "INVALID_SERIALIZATION",
      "object",
      "Value is not a NexoraObject contract handle.",
    );
  }
  // Re-bind from JSON to ensure a clean readonly handle.
  const json = object.toJSON();
  const restored = deserializeNexoraObjectFromJson(json);
  return createHandle(restored, false) as ReadonlyNexoraObject;
}

export function cloneNexoraObject(
  object: ReadonlyNexoraObject | MutableNexoraObject,
  newId: string,
): MutableNexoraObject {
  if (!isNexoraObject(object)) {
    fail(
      "INVALID_SERIALIZATION",
      "object",
      "Value is not a NexoraObject contract handle.",
    );
  }
  if (object.mode === "mutable") {
    return (object as MutableNexoraObject).clone(newId);
  }
  const restored = deserializeNexoraObjectFromJson(object.toJSON());
  return createHandle(foundationClone(restored, newId), true) as MutableNexoraObject;
}

export function projectDirectorView(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): DirectorObjectView {
  const restored = deserializeNexoraObjectFromJson(object.toJSON());
  return Object.freeze({
    ...projectNexoraObjectForDirector(restored),
    contractVersion: NOL_CONTRACT_VERSION,
  });
}

export function projectAssistantView(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): AssistantObjectView {
  const restored = deserializeNexoraObjectFromJson(object.toJSON());
  return Object.freeze({
    ...projectNexoraObjectForAssistant(restored),
    contractVersion: NOL_CONTRACT_VERSION,
  });
}

export function projectTimelineView(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): TimelineObjectView {
  return Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    caption: object.identity.caption,
    lifecycle: object.lifecycle,
    timeline: object.timeline,
    events: object.events,
    contractVersion: NOL_CONTRACT_VERSION,
  });
}

export function projectRuntimeView(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): RuntimeObjectView {
  return Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    caption: object.identity.caption,
    status: object.status,
    lifecycle: object.lifecycle,
    runtime: object.runtime,
    classification: object.classification,
    contractVersion: NOL_CONTRACT_VERSION,
  });
}

export function fromJSON(json: string): MutableNexoraObject {
  try {
    const object = deserializeNexoraObjectFromJson(json);
    return createHandle(object, true) as MutableNexoraObject;
  } catch (cause) {
    fail(
      "INVALID_SERIALIZATION",
      "json",
      cause instanceof Error ? cause.message : "Invalid JSON payload.",
    );
  }
}

export function importNexoraObjectContract(
  envelope: Parameters<typeof foundationImport>[0],
): MutableNexoraObject {
  const object = foundationImport(envelope);
  return createHandle(object, true) as MutableNexoraObject;
}

export function getNexoraObjectContractSummary() {
  return Object.freeze({
    identity: NOL_CONTRACT_IDENTITY,
    namespace: NOL_CONTRACT_NAMESPACE,
    contractVersion: NOL_CONTRACT_VERSION,
    schemaVersion: NOL_SCHEMA_VERSION,
    foundationVersion: NOL_FOUNDATION_VERSION,
    foundationIdentity: NOL_FOUNDATION_IDENTITY,
    sectionCount: NEXORA_OBJECT_CONTRACT_SECTIONS.length,
    sections: NEXORA_OBJECT_CONTRACT_SECTIONS,
    statusCount: NEXORA_OBJECT_STATUSES.length,
    lifecycleCount: NEXORA_OBJECT_LIFECYCLES.length,
    typeCount: NEXORA_OBJECT_TYPES.length,
    upstream: NOL_FOUNDATION_IDENTITY,
    dependencyFreeExceptFoundation: true,
    canonicalPublicInterface: true,
  });
}

export const UniversalNexoraObjectContract = Object.freeze({
  identity: NOL_CONTRACT_IDENTITY,
  contractVersion: NOL_CONTRACT_VERSION,
  schemaVersion: NOL_SCHEMA_VERSION,
  foundationVersion: NOL_FOUNDATION_VERSION,
  sections: NEXORA_OBJECT_CONTRACT_SECTIONS,
  tags: NOL_CONTRACT_TAGS,
  create: createNexoraObjectContract,
  validate: validateNexoraObjectContract,
  isNexoraObject,
  freeze: freezeNexoraObject,
  clone: cloneNexoraObject,
  fromJSON,
  projectDirectorView,
  projectAssistantView,
  projectTimelineView,
  projectRuntimeView,
  summary: getNexoraObjectContractSummary,
});
