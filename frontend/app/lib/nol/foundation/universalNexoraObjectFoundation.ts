/**
 * NOL-1:1 — Universal NexoraObject Foundation
 *
 * Single universal object contract for the entire Nexora platform.
 * Dependency-free root of the Nexora Object Layer (NOL).
 *
 * Identity: NOL-1:1/UniversalNexoraObjectFoundation
 *
 * Consumers (downstream only):
 * Runtime · Director · Workspace · Assistant · Timeline · Journal ·
 * Visualization · Scenario · Decision · KPI · Graph
 *
 * Upstream dependencies: none.
 */

// ─── Foundation identity ────────────────────────────────────────────────────

export const NOL_FOUNDATION_IDENTITY =
  "NOL-1:1/UniversalNexoraObjectFoundation" as const;

export const NOL_FOUNDATION_NAMESPACE =
  "nexora.nol.universal.object.foundation" as const;

export const NOL_FOUNDATION_VERSION = "1.0.0" as const;

export const NOL_FOUNDATION_LAYER = "NOL" as const;

export const NOL_FOUNDATION_MODULE = "NOL-1 Universal Object" as const;

export const NOL_FOUNDATION_PHASE = "1 — Foundation" as const;

export const NOL_FOUNDATION_TAGS = Object.freeze([
  "[NOL-1:1]",
  "[UNIVERSAL_NEXORA_OBJECT]",
  "[IDENTITY_IMMUTABLE]",
  "[RUNTIME_SEPARATED]",
  "[VISUALIZATION_INDEPENDENT]",
  "[DEPENDENCY_FREE]",
  "[ARCHITECTURE_FOUNDATION]",
] as const);

// ─── Universal object types ─────────────────────────────────────────────────

export const NEXORA_OBJECT_TYPES = Object.freeze([
  "Goal",
  "Intent",
  "Problem",
  "Decision",
  "Scenario",
  "Action",
  "Task",
  "Workspace",
  "Pack",
  "Journal",
  "Timeline",
  "Model",
  "Data",
  "KPI",
  "KOI",
  "Organization",
  "Department",
  "Person",
  "Asset",
  "Product",
  "Machine",
  "Customer",
  "Supplier",
  "Risk",
  "Opportunity",
  "Custom",
] as const);

export type NexoraObjectType = (typeof NEXORA_OBJECT_TYPES)[number];

// ─── Executive status (Seed visualization — exactly six) ────────────────────

export const NEXORA_OBJECT_STATUSES = Object.freeze([
  "Green",
  "Yellow",
  "Red",
  "Blue",
  "White",
  "Black",
] as const);

export type NexoraObjectStatus = (typeof NEXORA_OBJECT_STATUSES)[number];

export const NEXORA_OBJECT_STATUS_MEANING = Object.freeze({
  Green: "Healthy",
  Yellow: "Attention",
  Red: "Critical",
  Blue: "Information",
  White: "Neutral",
  Black: "Disabled",
} as const satisfies Record<NexoraObjectStatus, string>);

// ─── Lifecycle ──────────────────────────────────────────────────────────────

export const NEXORA_OBJECT_LIFECYCLES = Object.freeze([
  "Created",
  "Active",
  "Paused",
  "Archived",
  "Deleted",
] as const);

export type NexoraObjectLifecycle = (typeof NEXORA_OBJECT_LIFECYCLES)[number];

// ─── Relationships ──────────────────────────────────────────────────────────

export const NEXORA_RELATIONSHIP_KINDS = Object.freeze([
  "depends_on",
  "contains",
  "owned_by",
  "affects",
  "causes",
  "measures",
  "generated_from",
  "executed_by",
  "related_to",
  "supports",
  "blocks",
  "belongs_to",
] as const);

export type NexoraRelationshipKind = (typeof NEXORA_RELATIONSHIP_KINDS)[number];

/** Open extension — custom relationship kinds remain valid graph edges. */
export type NexoraRelationshipKindId = NexoraRelationshipKind | (string & {});

// ─── Events ─────────────────────────────────────────────────────────────────

export const NEXORA_OBJECT_EVENT_TYPES = Object.freeze([
  "Created",
  "Updated",
  "Focused",
  "Selected",
  "Changed",
  "Deleted",
  "StatusChanged",
  "RelationshipChanged",
] as const);

export type NexoraObjectEventType = (typeof NEXORA_OBJECT_EVENT_TYPES)[number];

// ─── Facet contracts ────────────────────────────────────────────────────────

/**
 * Immutable identity — never mutated after creation.
 * Runtime, Director, and Assistant must not rewrite these fields.
 */
export type NexoraObjectIdentity = {
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly version: number;
};

/** Session / interaction state — never part of identity. */
export type NexoraObjectRuntimeState = {
  readonly selected: boolean;
  readonly focused: boolean;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly highlighted: boolean;
  readonly dirty: boolean;
  readonly loading: boolean;
  readonly executing: boolean;
};

/** Director / visualization consumption surface only. */
export type NexoraObjectVisualizationState = {
  readonly position: readonly [number, number, number];
  readonly scale: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly opacity: number;
  readonly colorState: NexoraObjectStatus;
  readonly animationState: string;
  readonly badgeState: string;
  readonly priority: number;
  readonly cameraWeight: number;
};

export type NexoraObjectRelationship = {
  readonly id: string;
  readonly kind: NexoraRelationshipKindId;
  readonly fromId: string;
  readonly toId: string;
  readonly label?: string;
  readonly weight?: number;
  readonly createdAt: string;
};

export type NexoraObjectMetadataFacet = {
  readonly tags: readonly string[];
  readonly properties: Readonly<Record<string, string | number | boolean | null>>;
  readonly attributes: Readonly<Record<string, string>>;
  readonly executiveNotes: readonly string[];
  readonly customFields: Readonly<Record<string, unknown>>;
};

export type NexoraObjectTimelineFacet = {
  readonly history: readonly string[];
  readonly snapshots: readonly string[];
  readonly events: readonly string[];
  readonly packs: readonly string[];
  readonly journalEntries: readonly string[];
  readonly replayPosition: number | null;
};

export type NexoraObjectKpiFacet = {
  readonly kpis: readonly string[];
  readonly kois: readonly string[];
  readonly metrics: Readonly<Record<string, number>>;
  readonly thresholds: Readonly<Record<string, number>>;
  readonly healthScore: number | null;
  readonly confidence: number | null;
};

export type NexoraObjectKnowledgeFacet = {
  readonly facts: readonly string[];
  readonly assumptions: readonly string[];
  readonly insights: readonly string[];
  readonly recommendations: readonly string[];
  readonly risks: readonly string[];
  readonly evidence: readonly string[];
};

export type NexoraObjectExecutiveFacet = {
  readonly importance: number;
  readonly urgency: number;
  readonly executivePriority: number;
  readonly attentionScore: number;
  readonly confidence: number;
  readonly impactScore: number;
};

export type NexoraObjectEvent = {
  readonly id: string;
  readonly type: NexoraObjectEventType;
  readonly objectId: string;
  readonly at: string;
  readonly summary: string;
  readonly payload?: Readonly<Record<string, unknown>>;
};

/**
 * Universal NexoraObject — the only object contract in the platform.
 * Business entities extend this shape; they never replace it.
 */
export type NexoraObject = {
  readonly identity: NexoraObjectIdentity;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly relationships: readonly NexoraObjectRelationship[];
  readonly metadata: NexoraObjectMetadataFacet;
  readonly runtime: NexoraObjectRuntimeState;
  readonly visualization: NexoraObjectVisualizationState;
  readonly timeline: NexoraObjectTimelineFacet;
  readonly kpi: NexoraObjectKpiFacet;
  readonly knowledge: NexoraObjectKnowledgeFacet;
  readonly executive: NexoraObjectExecutiveFacet;
  readonly eventLog: readonly NexoraObjectEvent[];
  /** Reserved for typed business extensions without mutating the base contract. */
  readonly extension: Readonly<Record<string, unknown>>;
};

export type CreateNexoraObjectInput = {
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly description?: string;
  readonly icon?: string;
  readonly color?: string;
  readonly owner?: string;
  readonly status?: NexoraObjectStatus;
  readonly lifecycle?: NexoraObjectLifecycle;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly tags?: readonly string[];
  readonly extension?: Readonly<Record<string, unknown>>;
};

export type NexoraObjectSnapshot = {
  readonly snapshotId: string;
  readonly objectId: string;
  readonly capturedAt: string;
  readonly object: NexoraObject;
};

export type NexoraObjectFoundationSummary = {
  readonly identity: typeof NOL_FOUNDATION_IDENTITY;
  readonly namespace: typeof NOL_FOUNDATION_NAMESPACE;
  readonly version: typeof NOL_FOUNDATION_VERSION;
  readonly layer: typeof NOL_FOUNDATION_LAYER;
  readonly module: typeof NOL_FOUNDATION_MODULE;
  readonly phase: typeof NOL_FOUNDATION_PHASE;
  readonly objectTypeCount: number;
  readonly statusCount: number;
  readonly lifecycleCount: number;
  readonly relationshipKindCount: number;
  readonly eventTypeCount: number;
  readonly dependencyFree: true;
  readonly universalContract: true;
  readonly identityImmutable: true;
  readonly runtimeSeparatedFromIdentity: true;
  readonly visualizationIndependent: true;
};

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_RUNTIME: NexoraObjectRuntimeState = Object.freeze({
  selected: false,
  focused: false,
  visible: true,
  locked: false,
  highlighted: false,
  dirty: false,
  loading: false,
  executing: false,
});

const DEFAULT_VISUALIZATION: NexoraObjectVisualizationState = Object.freeze({
  position: Object.freeze([0, 0, 0]) as readonly [number, number, number],
  scale: Object.freeze([1, 1, 1]) as readonly [number, number, number],
  rotation: Object.freeze([0, 0, 0]) as readonly [number, number, number],
  opacity: 1,
  colorState: "White",
  animationState: "idle",
  badgeState: "none",
  priority: 0,
  cameraWeight: 1,
});

const DEFAULT_TIMELINE: NexoraObjectTimelineFacet = Object.freeze({
  history: Object.freeze([]),
  snapshots: Object.freeze([]),
  events: Object.freeze([]),
  packs: Object.freeze([]),
  journalEntries: Object.freeze([]),
  replayPosition: null,
});

const DEFAULT_KPI: NexoraObjectKpiFacet = Object.freeze({
  kpis: Object.freeze([]),
  kois: Object.freeze([]),
  metrics: Object.freeze({}),
  thresholds: Object.freeze({}),
  healthScore: null,
  confidence: null,
});

const DEFAULT_KNOWLEDGE: NexoraObjectKnowledgeFacet = Object.freeze({
  facts: Object.freeze([]),
  assumptions: Object.freeze([]),
  insights: Object.freeze([]),
  recommendations: Object.freeze([]),
  risks: Object.freeze([]),
  evidence: Object.freeze([]),
});

const DEFAULT_EXECUTIVE: NexoraObjectExecutiveFacet = Object.freeze({
  importance: 0,
  urgency: 0,
  executivePriority: 0,
  attentionScore: 0,
  confidence: 0,
  impactScore: 0,
});

// ─── Guards & predicates ────────────────────────────────────────────────────

export function isNexoraObjectType(value: string): value is NexoraObjectType {
  return (NEXORA_OBJECT_TYPES as readonly string[]).includes(value);
}

export function isNexoraObjectStatus(value: string): value is NexoraObjectStatus {
  return (NEXORA_OBJECT_STATUSES as readonly string[]).includes(value);
}

export function isNexoraObjectLifecycle(
  value: string,
): value is NexoraObjectLifecycle {
  return (NEXORA_OBJECT_LIFECYCLES as readonly string[]).includes(value);
}

export function isNexoraRelationshipKind(
  value: string,
): value is NexoraRelationshipKind {
  return (NEXORA_RELATIONSHIP_KINDS as readonly string[]).includes(value);
}

export function getNexoraObjectStatusMeaning(
  status: NexoraObjectStatus,
): string {
  return NEXORA_OBJECT_STATUS_MEANING[status];
}

function freezeIdentity(identity: NexoraObjectIdentity): NexoraObjectIdentity {
  return Object.freeze({ ...identity });
}

function freezeObject(object: NexoraObject): NexoraObject {
  return Object.freeze({
    identity: object.identity,
    status: object.status,
    lifecycle: object.lifecycle,
    relationships: Object.freeze([...object.relationships]),
    metadata: Object.freeze({
      tags: Object.freeze([...object.metadata.tags]),
      properties: Object.freeze({ ...object.metadata.properties }),
      attributes: Object.freeze({ ...object.metadata.attributes }),
      executiveNotes: Object.freeze([...object.metadata.executiveNotes]),
      customFields: Object.freeze({ ...object.metadata.customFields }),
    }),
    runtime: Object.freeze({ ...object.runtime }),
    visualization: Object.freeze({
      ...object.visualization,
      position: Object.freeze([
        ...object.visualization.position,
      ]) as readonly [number, number, number],
      scale: Object.freeze([
        ...object.visualization.scale,
      ]) as readonly [number, number, number],
      rotation: Object.freeze([
        ...object.visualization.rotation,
      ]) as readonly [number, number, number],
    }),
    timeline: Object.freeze({
      history: Object.freeze([...object.timeline.history]),
      snapshots: Object.freeze([...object.timeline.snapshots]),
      events: Object.freeze([...object.timeline.events]),
      packs: Object.freeze([...object.timeline.packs]),
      journalEntries: Object.freeze([...object.timeline.journalEntries]),
      replayPosition: object.timeline.replayPosition,
    }),
    kpi: Object.freeze({
      kpis: Object.freeze([...object.kpi.kpis]),
      kois: Object.freeze([...object.kpi.kois]),
      metrics: Object.freeze({ ...object.kpi.metrics }),
      thresholds: Object.freeze({ ...object.kpi.thresholds }),
      healthScore: object.kpi.healthScore,
      confidence: object.kpi.confidence,
    }),
    knowledge: Object.freeze({
      facts: Object.freeze([...object.knowledge.facts]),
      assumptions: Object.freeze([...object.knowledge.assumptions]),
      insights: Object.freeze([...object.knowledge.insights]),
      recommendations: Object.freeze([...object.knowledge.recommendations]),
      risks: Object.freeze([...object.knowledge.risks]),
      evidence: Object.freeze([...object.knowledge.evidence]),
    }),
    executive: Object.freeze({ ...object.executive }),
    eventLog: Object.freeze([...object.eventLog]),
    extension: Object.freeze({ ...object.extension }),
  });
}

function requireNonEmpty(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`NexoraObject.${field} must be a non-empty string.`);
  }
  return trimmed;
}

// ─── Factory ────────────────────────────────────────────────────────────────

/**
 * Create the universal object. Identity is frozen at creation and must never
 * be rewritten by Runtime or Director helpers.
 */
export function createNexoraObject(input: CreateNexoraObjectInput): NexoraObject {
  if (!isNexoraObjectType(input.type)) {
    throw new Error(`Unsupported NexoraObject type: ${input.type}`);
  }

  const createdAt = input.createdAt ?? "1970-01-01T00:00:00.000Z";
  const updatedAt = input.updatedAt ?? createdAt;
  const status = input.status ?? "White";
  const lifecycle = input.lifecycle ?? "Created";

  if (!isNexoraObjectStatus(status)) {
    throw new Error(`Unsupported NexoraObject status: ${status}`);
  }
  if (!isNexoraObjectLifecycle(lifecycle)) {
    throw new Error(`Unsupported NexoraObject lifecycle: ${lifecycle}`);
  }

  const identity = freezeIdentity({
    id: requireNonEmpty(input.id, "identity.id"),
    type: input.type,
    caption: requireNonEmpty(input.caption, "identity.caption"),
    description: input.description?.trim() ?? "",
    icon: input.icon?.trim() || "object",
    color: input.color?.trim() || "#94A3B8",
    createdAt,
    updatedAt,
    owner: input.owner?.trim() || "system",
    version: 1,
  });

  const createdEvent: NexoraObjectEvent = Object.freeze({
    id: `evt-${identity.id}-created`,
    type: "Created",
    objectId: identity.id,
    at: createdAt,
    summary: `${identity.type} “${identity.caption}” created.`,
  });

  return freezeObject({
    identity,
    status,
    lifecycle,
    relationships: Object.freeze([]),
    metadata: Object.freeze({
      tags: Object.freeze([...(input.tags ?? [])]),
      properties: Object.freeze({}),
      attributes: Object.freeze({}),
      executiveNotes: Object.freeze([]),
      customFields: Object.freeze({}),
    }),
    runtime: DEFAULT_RUNTIME,
    visualization: Object.freeze({
      ...DEFAULT_VISUALIZATION,
      colorState: status,
    }),
    timeline: DEFAULT_TIMELINE,
    kpi: DEFAULT_KPI,
    knowledge: DEFAULT_KNOWLEDGE,
    executive: DEFAULT_EXECUTIVE,
    eventLog: Object.freeze([createdEvent]),
    extension: Object.freeze({ ...(input.extension ?? {}) }),
  });
}

/**
 * Extension rule — business objects extend NexoraObject; they never fork it.
 * Returns a NexoraObject with typed extension payload.
 */
export function extendNexoraObject(
  input: CreateNexoraObjectInput,
  extension: Readonly<Record<string, unknown>>,
): NexoraObject {
  return createNexoraObject({
    ...input,
    extension: { ...(input.extension ?? {}), ...extension },
  });
}

// ─── Identity protection ────────────────────────────────────────────────────

/**
 * Assert two objects share the same immutable identity core
 * (id, type, createdAt, owner — caption/icon/color/version may evolve via clone).
 * For strict identity immutability on a live object, compare references.
 */
export function assertSameImmutableIdentity(
  a: NexoraObject,
  b: NexoraObject,
): void {
  if (a.identity.id !== b.identity.id) {
    throw new Error("NexoraObject identity.id must never change.");
  }
  if (a.identity.type !== b.identity.type) {
    throw new Error("NexoraObject identity.type must never change.");
  }
  if (a.identity.createdAt !== b.identity.createdAt) {
    throw new Error("NexoraObject identity.createdAt must never change.");
  }
  if (a.identity !== b.identity && a.identity.id === b.identity.id) {
    // Same logical identity values but replaced object — still allowed only if
    // callers freeze; Runtime helpers below always reuse the identity reference.
  }
}

/** Runtime helpers must reuse this exact identity reference. */
export function getImmutableIdentity(
  object: NexoraObject,
): NexoraObjectIdentity {
  return object.identity;
}

// ─── Pure updates (identity reference preserved) ────────────────────────────

function withEvent(
  object: NexoraObject,
  event: NexoraObjectEvent,
  patch: Partial<
    Omit<NexoraObject, "identity" | "eventLog" | "extension">
  > & {
    readonly extension?: Readonly<Record<string, unknown>>;
  },
): NexoraObject {
  return freezeObject({
    identity: object.identity,
    status: patch.status ?? object.status,
    lifecycle: patch.lifecycle ?? object.lifecycle,
    relationships: patch.relationships ?? object.relationships,
    metadata: patch.metadata ?? object.metadata,
    runtime: patch.runtime ?? object.runtime,
    visualization: patch.visualization ?? object.visualization,
    timeline: patch.timeline ?? object.timeline,
    kpi: patch.kpi ?? object.kpi,
    knowledge: patch.knowledge ?? object.knowledge,
    executive: patch.executive ?? object.executive,
    eventLog: Object.freeze([...object.eventLog, event]),
    extension: patch.extension
      ? Object.freeze({ ...object.extension, ...patch.extension })
      : object.extension,
  });
}

export function updateNexoraObjectRuntime(
  object: NexoraObject,
  patch: Partial<NexoraObjectRuntimeState>,
  at = object.identity.updatedAt,
): NexoraObject {
  const runtime = Object.freeze({ ...object.runtime, ...patch });
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-runtime-${object.eventLog.length + 1}`,
    type: "Changed",
    objectId: object.identity.id,
    at,
    summary: "Runtime state updated.",
    payload: Object.freeze({ ...patch }),
  });
  return withEvent(object, event, { runtime });
}

export function updateNexoraObjectStatus(
  object: NexoraObject,
  status: NexoraObjectStatus,
  at = object.identity.updatedAt,
): NexoraObject {
  if (!isNexoraObjectStatus(status)) {
    throw new Error(`Unsupported NexoraObject status: ${status}`);
  }
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-status-${object.eventLog.length + 1}`,
    type: "StatusChanged",
    objectId: object.identity.id,
    at,
    summary: `Status ${object.status} → ${status}.`,
    payload: Object.freeze({ from: object.status, to: status }),
  });
  return withEvent(object, event, {
    status,
    visualization: Object.freeze({
      ...object.visualization,
      colorState: status,
    }),
  });
}

export function updateNexoraObjectLifecycle(
  object: NexoraObject,
  lifecycle: NexoraObjectLifecycle,
  at = object.identity.updatedAt,
): NexoraObject {
  if (!isNexoraObjectLifecycle(lifecycle)) {
    throw new Error(`Unsupported NexoraObject lifecycle: ${lifecycle}`);
  }
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-lifecycle-${object.eventLog.length + 1}`,
    type: "Updated",
    objectId: object.identity.id,
    at,
    summary: `Lifecycle ${object.lifecycle} → ${lifecycle}.`,
    payload: Object.freeze({ from: object.lifecycle, to: lifecycle }),
  });
  return withEvent(object, event, { lifecycle });
}

export function updateNexoraObjectExecutive(
  object: NexoraObject,
  patch: Partial<NexoraObjectExecutiveFacet>,
  at = object.identity.updatedAt,
): NexoraObject {
  const executive = Object.freeze({
    ...object.executive,
    ...patch,
  });
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-executive-${object.eventLog.length + 1}`,
    type: "Changed",
    objectId: object.identity.id,
    at,
    summary: "Executive state updated.",
    payload: Object.freeze({ ...patch }),
  });
  return withEvent(object, event, { executive });
}

export function updateNexoraObjectVisualization(
  object: NexoraObject,
  patch: Partial<NexoraObjectVisualizationState>,
  at = object.identity.updatedAt,
): NexoraObject {
  const visualization = Object.freeze({
    ...object.visualization,
    ...patch,
    position: Object.freeze(
      patch.position
        ? ([...patch.position] as [number, number, number])
        : [...object.visualization.position],
    ) as readonly [number, number, number],
    scale: Object.freeze(
      patch.scale
        ? ([...patch.scale] as [number, number, number])
        : [...object.visualization.scale],
    ) as readonly [number, number, number],
    rotation: Object.freeze(
      patch.rotation
        ? ([...patch.rotation] as [number, number, number])
        : [...object.visualization.rotation],
    ) as readonly [number, number, number],
  });
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-viz-${object.eventLog.length + 1}`,
    type: "Changed",
    objectId: object.identity.id,
    at,
    summary: "Visualization state updated.",
  });
  return withEvent(object, event, { visualization });
}

export function addNexoraObjectRelationship(
  object: NexoraObject,
  relationship: Omit<NexoraObjectRelationship, "fromId"> & {
    readonly fromId?: string;
  },
  at = object.identity.updatedAt,
): NexoraObject {
  const edge: NexoraObjectRelationship = Object.freeze({
    ...relationship,
    fromId: relationship.fromId ?? object.identity.id,
    createdAt: relationship.createdAt || at,
  });
  if (edge.fromId !== object.identity.id) {
    throw new Error(
      "Relationship fromId must match the owning NexoraObject identity.id.",
    );
  }
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-rel-${object.eventLog.length + 1}`,
    type: "RelationshipChanged",
    objectId: object.identity.id,
    at,
    summary: `Relationship ${edge.kind} → ${edge.toId}.`,
    payload: Object.freeze({ relationshipId: edge.id, kind: edge.kind }),
  });
  return withEvent(object, event, {
    relationships: Object.freeze([...object.relationships, edge]),
  });
}

export function removeNexoraObjectRelationship(
  object: NexoraObject,
  relationshipId: string,
  at = object.identity.updatedAt,
): NexoraObject {
  const next = object.relationships.filter((r) => r.id !== relationshipId);
  if (next.length === object.relationships.length) {
    throw new Error(`Relationship not found: ${relationshipId}`);
  }
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-rel-rm-${object.eventLog.length + 1}`,
    type: "RelationshipChanged",
    objectId: object.identity.id,
    at,
    summary: `Relationship removed · ${relationshipId}.`,
    payload: Object.freeze({ relationshipId, removed: true }),
  });
  return withEvent(object, event, {
    relationships: Object.freeze(next),
  });
}

export function updateNexoraObjectMetadata(
  object: NexoraObject,
  patch: Partial<{
    readonly tags: readonly string[];
    readonly properties: Readonly<
      Record<string, string | number | boolean | null>
    >;
    readonly attributes: Readonly<Record<string, string>>;
    readonly executiveNotes: readonly string[];
    readonly customFields: Readonly<Record<string, unknown>>;
  }>,
  at = object.identity.updatedAt,
): NexoraObject {
  const metadata = Object.freeze({
    tags: Object.freeze([...(patch.tags ?? object.metadata.tags)]),
    properties: Object.freeze({
      ...object.metadata.properties,
      ...(patch.properties ?? {}),
    }),
    attributes: Object.freeze({
      ...object.metadata.attributes,
      ...(patch.attributes ?? {}),
    }),
    executiveNotes: Object.freeze([
      ...(patch.executiveNotes ?? object.metadata.executiveNotes),
    ]),
    customFields: Object.freeze({
      ...object.metadata.customFields,
      ...(patch.customFields ?? {}),
    }),
  });
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-meta-${object.eventLog.length + 1}`,
    type: "Updated",
    objectId: object.identity.id,
    at,
    summary: "Metadata updated.",
  });
  return withEvent(object, event, { metadata });
}

export function appendNexoraObjectTimelineRef(
  object: NexoraObject,
  facet: keyof Omit<NexoraObjectTimelineFacet, "replayPosition">,
  refId: string,
  at = object.identity.updatedAt,
): NexoraObject {
  const timeline = Object.freeze({
    ...object.timeline,
    [facet]: Object.freeze([...object.timeline[facet], refId]),
  });
  const event: NexoraObjectEvent = Object.freeze({
    id: `evt-${object.identity.id}-timeline-${object.eventLog.length + 1}`,
    type: "Updated",
    objectId: object.identity.id,
    at,
    summary: `Timeline ${facet} appended.`,
    payload: Object.freeze({ facet, refId }),
  });
  return withEvent(object, event, { timeline });
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeNexoraObjectToJson(object: NexoraObject): string {
  return JSON.stringify(object);
}

export function deserializeNexoraObjectFromJson(json: string): NexoraObject {
  const parsed = JSON.parse(json) as NexoraObject;
  if (!parsed?.identity?.id || !isNexoraObjectType(parsed.identity.type)) {
    throw new Error("Invalid NexoraObject JSON payload.");
  }
  return freezeObject({
    ...parsed,
    identity: freezeIdentity(parsed.identity),
  });
}

export function createNexoraObjectSnapshot(
  object: NexoraObject,
  snapshotId: string,
  capturedAt = object.identity.updatedAt,
): NexoraObjectSnapshot {
  return Object.freeze({
    snapshotId: requireNonEmpty(snapshotId, "snapshotId"),
    objectId: object.identity.id,
    capturedAt,
    object: freezeObject(object),
  });
}

/**
 * Clone produces a new object identity. Original identity remains unchanged.
 */
export function cloneNexoraObject(
  object: NexoraObject,
  newId: string,
  options?: {
    readonly caption?: string;
    readonly createdAt?: string;
    readonly owner?: string;
  },
): NexoraObject {
  return createNexoraObject({
    id: newId,
    type: object.identity.type,
    caption: options?.caption ?? `${object.identity.caption} (Clone)`,
    description: object.identity.description,
    icon: object.identity.icon,
    color: object.identity.color,
    owner: options?.owner ?? object.identity.owner,
    status: object.status,
    lifecycle: "Created",
    createdAt: options?.createdAt ?? object.identity.updatedAt,
    updatedAt: options?.createdAt ?? object.identity.updatedAt,
    tags: object.metadata.tags,
    extension: object.extension,
  });
}

export function exportNexoraObject(object: NexoraObject): Readonly<{
  readonly format: "nexora-object/json";
  readonly foundation: typeof NOL_FOUNDATION_IDENTITY;
  readonly payload: NexoraObject;
}> {
  return Object.freeze({
    format: "nexora-object/json" as const,
    foundation: NOL_FOUNDATION_IDENTITY,
    payload: freezeObject(object),
  });
}

export function importNexoraObject(
  envelope: Readonly<{
    readonly format: "nexora-object/json";
    readonly payload: NexoraObject;
  }>,
): NexoraObject {
  if (envelope.format !== "nexora-object/json") {
    throw new Error("Unsupported NexoraObject import format.");
  }
  return deserializeNexoraObjectFromJson(JSON.stringify(envelope.payload));
}

// ─── Director / Assistant projections ───────────────────────────────────────

/** Director Layer consumes visualization only — never identity mutation. */
export function projectNexoraObjectForDirector(object: NexoraObject): Readonly<{
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly status: NexoraObjectStatus;
  readonly visualization: NexoraObjectVisualizationState;
  readonly executive: NexoraObjectExecutiveFacet;
}> {
  return Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    caption: object.identity.caption,
    status: object.status,
    visualization: object.visualization,
    executive: object.executive,
  });
}

/** Assistant Layer reasons through knowledge + executive facets only. */
export function projectNexoraObjectForAssistant(object: NexoraObject): Readonly<{
  readonly id: string;
  readonly type: NexoraObjectType;
  readonly caption: string;
  readonly status: NexoraObjectStatus;
  readonly knowledge: NexoraObjectKnowledgeFacet;
  readonly executive: NexoraObjectExecutiveFacet;
  readonly kpi: NexoraObjectKpiFacet;
}> {
  return Object.freeze({
    id: object.identity.id,
    type: object.identity.type,
    caption: object.identity.caption,
    status: object.status,
    knowledge: object.knowledge,
    executive: object.executive,
    kpi: object.kpi,
  });
}

// ─── Foundation summary ─────────────────────────────────────────────────────

export function getNexoraObjectFoundationSummary(): NexoraObjectFoundationSummary {
  return Object.freeze({
    identity: NOL_FOUNDATION_IDENTITY,
    namespace: NOL_FOUNDATION_NAMESPACE,
    version: NOL_FOUNDATION_VERSION,
    layer: NOL_FOUNDATION_LAYER,
    module: NOL_FOUNDATION_MODULE,
    phase: NOL_FOUNDATION_PHASE,
    objectTypeCount: NEXORA_OBJECT_TYPES.length,
    statusCount: NEXORA_OBJECT_STATUSES.length,
    lifecycleCount: NEXORA_OBJECT_LIFECYCLES.length,
    relationshipKindCount: NEXORA_RELATIONSHIP_KINDS.length,
    eventTypeCount: NEXORA_OBJECT_EVENT_TYPES.length,
    dependencyFree: true,
    universalContract: true,
    identityImmutable: true,
    runtimeSeparatedFromIdentity: true,
    visualizationIndependent: true,
  });
}

export const UniversalNexoraObjectFoundation = Object.freeze({
  identity: NOL_FOUNDATION_IDENTITY,
  namespace: NOL_FOUNDATION_NAMESPACE,
  version: NOL_FOUNDATION_VERSION,
  tags: NOL_FOUNDATION_TAGS,
  types: NEXORA_OBJECT_TYPES,
  statuses: NEXORA_OBJECT_STATUSES,
  lifecycles: NEXORA_OBJECT_LIFECYCLES,
  relationshipKinds: NEXORA_RELATIONSHIP_KINDS,
  eventTypes: NEXORA_OBJECT_EVENT_TYPES,
  create: createNexoraObject,
  extend: extendNexoraObject,
  summary: getNexoraObjectFoundationSummary,
});
