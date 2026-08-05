/**
 * NOL-1:5 — Universal NexoraObject Relationship & Dependency Engine
 *
 * Canonical directed graph over every NexoraObject. Owns edge storage,
 * traversal, cycle detection and impact simulation. Independent from Runtime.
 *
 * Upstream: NOL-1:1 Foundation + NOL-1:2 Contract + NOL-1:3 Runtime + NOL-1:4 State.
 * Identity: NOL-1:5/UniversalNexoraObjectRelationshipDependencyEngine
 */

import {
  type NexoraObjectLifecycle,
  type NexoraObjectStatus,
  type NexoraObjectType,
  type NexoraRelationshipKindId,
} from "../foundation/universalNexoraObjectFoundation.ts";
import {
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";
import { getNexoraObjectRuntimeState } from "../runtime/universalNexoraObjectRuntimeModel.ts";
import { createNexoraObjectState } from "../state/universalNexoraObjectStateTransitionEngine.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const NOL_RELATIONSHIP_IDENTITY =
  "NOL-1:5/UniversalNexoraObjectRelationshipDependencyEngine" as const;

export const NOL_RELATIONSHIP_ENGINE_VERSION = "1.0.0" as const;

export const NOL_RELATIONSHIP_SCHEMA_VERSION = "1.0.0" as const;

export const relationshipEngineIdentity = NOL_RELATIONSHIP_IDENTITY;
export const relationshipEngineVersion = NOL_RELATIONSHIP_ENGINE_VERSION;
export const relationshipSchemaVersion = NOL_RELATIONSHIP_SCHEMA_VERSION;

export const NOL_RELATIONSHIP_TAGS = Object.freeze([
  "[NOL-1:5]",
  "[UNIVERSAL_NEXORA_OBJECT_GRAPH]",
  "[RELATIONSHIP_DEPENDENCY_ENGINE]",
  "[DIRECTED_GRAPH]",
  "[RUNTIME_INDEPENDENT]",
  "[PROJECTION_SAFE]",
] as const);

export const NOL_RELATIONSHIP_UPSTREAM = Object.freeze([
  "NOL-1:1/UniversalNexoraObjectFoundation",
  "NOL-1:2/UniversalNexoraObjectContractModel",
  "NOL-1:3/UniversalNexoraObjectRuntimeModel",
  "NOL-1:4/UniversalNexoraObjectStateTransitionEngine",
] as const);

// ─── Relationship catalogue ─────────────────────────────────────────────────

export const NEXORA_GRAPH_RELATIONSHIP_TYPES = Object.freeze([
  "depends_on",
  "affects",
  "contains",
  "belongs_to",
  "parent_of",
  "child_of",
  "measures",
  "measured_by",
  "supports",
  "blocks",
  "owns",
  "owned_by",
  "produces",
  "consumes",
  "generated_from",
  "derived_from",
  "causes",
  "mitigates",
  "relates_to",
  "references",
  // Foundation-compatible aliases
  "related_to",
  "executed_by",
] as const);

export type NexoraGraphRelationshipType =
  | (typeof NEXORA_GRAPH_RELATIONSHIP_TYPES)[number]
  | (string & {});

/** Inverse pairs used when creating optional bidirectional edges. */
export const NEXORA_GRAPH_INVERSE_TYPES: Readonly<
  Record<string, NexoraGraphRelationshipType>
> = Object.freeze({
  depends_on: "supports",
  supports: "depends_on",
  contains: "belongs_to",
  belongs_to: "contains",
  parent_of: "child_of",
  child_of: "parent_of",
  measures: "measured_by",
  measured_by: "measures",
  owns: "owned_by",
  owned_by: "owns",
  produces: "consumes",
  consumes: "produces",
  causes: "mitigates",
  mitigates: "causes",
  generated_from: "derived_from",
  derived_from: "generated_from",
  affects: "affected_by",
  relates_to: "relates_to",
  related_to: "related_to",
  references: "references",
});

// ─── Core types ─────────────────────────────────────────────────────────────

export type NexoraGraphNodeRef = {
  readonly objectId: string;
  readonly objectType: NexoraObjectType | string;
  readonly caption: string;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
};

export type NexoraGraphEdge = {
  readonly edgeId: string;
  readonly type: NexoraGraphRelationshipType;
  readonly fromId: string;
  readonly toId: string;
  readonly label?: string;
  readonly weight: number;
  readonly bidirectional: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly revision: number;
};

export type NexoraGraphEventType =
  | "RelationshipCreated"
  | "RelationshipDeleted"
  | "RelationshipUpdated"
  | "DependencyChanged"
  | "GraphChanged"
  | "CycleDetected";

export type NexoraGraphEvent = {
  readonly eventId: string;
  readonly type: NexoraGraphEventType;
  readonly graphId: string;
  readonly occurredAt: string;
  readonly graphRevision: number;
  readonly edgeId?: string;
  readonly fromId?: string;
  readonly toId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
};

export type NexoraGraphErrorCode =
  | "GRAPH_OBJECT_NOT_FOUND"
  | "GRAPH_EDGE_NOT_FOUND"
  | "GRAPH_DUPLICATE_EDGE_ID"
  | "GRAPH_DUPLICATE_RELATIONSHIP"
  | "GRAPH_SELF_REFERENCE_FORBIDDEN"
  | "GRAPH_OBJECT_DELETED"
  | "GRAPH_INVALID_REQUEST"
  | "GRAPH_CYCLE_DETECTED"
  | "GRAPH_UNSUPPORTED_VERSION"
  | "GRAPH_COMPOSITE_REJECTED"
  | "GRAPH_INVARIANT_VIOLATION";

export type NexoraGraphError = {
  readonly code: NexoraGraphErrorCode;
  readonly message: string;
  readonly graphId: string;
  readonly edgeId?: string;
  readonly objectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export class NexoraObjectRelationshipException extends Error {
  readonly code: NexoraGraphErrorCode;
  readonly graphId: string;
  constructor(error: NexoraGraphError) {
    super(error.message);
    this.name = "NexoraObjectRelationshipException";
    this.code = error.code;
    this.graphId = error.graphId;
  }
}

export type NexoraGraphMutationResult = {
  readonly accepted: boolean;
  readonly changed: boolean;
  readonly graph: NexoraObjectGraph;
  readonly edge?: NexoraGraphEdge;
  readonly events: readonly NexoraGraphEvent[];
  readonly errors: readonly NexoraGraphError[];
  readonly warnings: readonly string[];
};

export type NexoraGraphCompositeOperation =
  | {
      readonly op: "create";
      readonly input: NexoraGraphCreateRelationshipInput;
    }
  | {
      readonly op: "remove";
      readonly edgeId: string;
    }
  | {
      readonly op: "update";
      readonly edgeId: string;
      readonly patch: NexoraGraphUpdateRelationshipInput;
    };

export type NexoraGraphCompositeResult = {
  readonly accepted: boolean;
  readonly results: readonly NexoraGraphMutationResult[];
  readonly events: readonly NexoraGraphEvent[];
  readonly errors: readonly NexoraGraphError[];
};

export type NexoraGraphCreateRelationshipInput = {
  readonly edgeId: string;
  readonly type: NexoraGraphRelationshipType;
  readonly fromId: string;
  readonly toId: string;
  readonly label?: string;
  readonly weight?: number;
  readonly bidirectional?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly allowSelfReference?: boolean;
  readonly syncToContract?: boolean;
};

export type NexoraGraphUpdateRelationshipInput = {
  readonly label?: string;
  readonly weight?: number;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly type?: NexoraGraphRelationshipType;
};

export type NexoraGraphTraversalOptions = {
  readonly maxDepth?: number;
  readonly relationshipTypes?: readonly NexoraGraphRelationshipType[];
  readonly nodeFilter?: (node: NexoraGraphNodeRef) => boolean;
  readonly edgeFilter?: (edge: NexoraGraphEdge) => boolean;
  readonly direction?: "outbound" | "inbound" | "both";
};

export type NexoraGraphPath = {
  readonly nodes: readonly string[];
  readonly edges: readonly NexoraGraphEdge[];
  readonly length: number;
  readonly totalWeight: number;
};

export type NexoraGraphImpactSeed = {
  readonly objectId: string;
  readonly status?: NexoraObjectStatus;
  readonly signal?: string;
};

export type NexoraGraphImpactStep = {
  readonly objectId: string;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
  readonly viaEdgeId?: string;
  readonly viaType?: NexoraGraphRelationshipType;
  readonly depth: number;
  readonly signal: string;
};

export type NexoraGraphImpactResult = {
  readonly seedObjectId: string;
  readonly path: readonly NexoraGraphImpactStep[];
  readonly reachedObjectIds: readonly string[];
  readonly truncated: boolean;
};

export type NexoraGraphProjection = {
  readonly graphId: string;
  readonly graphRevision: number;
  readonly schemaVersion: typeof NOL_RELATIONSHIP_SCHEMA_VERSION;
  readonly engineIdentity: typeof NOL_RELATIONSHIP_IDENTITY;
  readonly nodes: readonly NexoraGraphNodeRef[];
  readonly edges: readonly NexoraGraphEdge[];
  readonly nodeCount: number;
  readonly edgeCount: number;
};

export type NexoraGraphSnapshot = {
  readonly snapshotId: string;
  readonly graphId: string;
  readonly capturedAt: string;
  readonly graphRevision: number;
  readonly schemaVersion: typeof NOL_RELATIONSHIP_SCHEMA_VERSION;
  readonly nodes: readonly NexoraGraphNodeRef[];
  readonly edges: readonly NexoraGraphEdge[];
};

export type NexoraGraphDependencies = {
  readonly now: () => string;
  readonly createEventId: () => string;
  readonly createEdgeId?: () => string;
};

export type NexoraObjectGraph = {
  readonly graphId: string;
  readonly graphRevision: number;
  readonly schemaVersion: typeof NOL_RELATIONSHIP_SCHEMA_VERSION;
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Internal mutable store (never exported)
type GraphStore = {
  graphId: string;
  graphRevision: number;
  createdAt: string;
  updatedAt: string;
  nodes: Map<string, ReadonlyNexoraObject | MutableNexoraObject>;
  edges: Map<string, NexoraGraphEdge>;
  /** fromId → edgeIds */
  outbound: Map<string, string[]>;
  /** toId → edgeIds */
  inbound: Map<string, string[]>;
  events: NexoraGraphEvent[];
};

const graphs = new Map<string, GraphStore>();
let defaultEventSeq = 0;
let defaultEdgeSeq = 0;

export const defaultNexoraGraphDependencies: NexoraGraphDependencies =
  Object.freeze({
    now: () => new Date().toISOString(),
    createEventId: () => {
      defaultEventSeq += 1;
      return `ngr-evt-${defaultEventSeq}`;
    },
    createEdgeId: () => {
      defaultEdgeSeq += 1;
      return `ngr-edge-${defaultEdgeSeq}`;
    },
  });

export function resetNexoraObjectGraphStoreForTests(): void {
  graphs.clear();
  defaultEventSeq = 0;
  defaultEdgeSeq = 0;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function err(
  code: NexoraGraphErrorCode,
  message: string,
  graphId: string,
  extras?: Partial<NexoraGraphError>,
): NexoraGraphError {
  return Object.freeze({ code, message, graphId, ...extras });
}

function freezeEdge(edge: NexoraGraphEdge): NexoraGraphEdge {
  return Object.freeze({
    ...edge,
    metadata: Object.freeze({ ...edge.metadata }),
  });
}

function freezeEvent(event: NexoraGraphEvent): NexoraGraphEvent {
  return Object.freeze({
    ...event,
    payload: Object.freeze({ ...event.payload }),
  });
}

function resolveDeps(
  deps?: Partial<NexoraGraphDependencies>,
): NexoraGraphDependencies {
  return Object.freeze({
    ...defaultNexoraGraphDependencies,
    ...deps,
  });
}

function getStore(graphId: string): GraphStore {
  const store = graphs.get(graphId);
  if (!store) {
    throw new NexoraObjectRelationshipException(
      err("GRAPH_OBJECT_NOT_FOUND", `Graph not found: ${graphId}`, graphId),
    );
  }
  return store;
}

function publicGraph(store: GraphStore): NexoraObjectGraph {
  return Object.freeze({
    graphId: store.graphId,
    graphRevision: store.graphRevision,
    schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  });
}

function nodeRef(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): NexoraGraphNodeRef {
  return Object.freeze({
    objectId: object.identity.id,
    objectType: object.identity.type,
    caption: object.identity.caption,
    status: object.status,
    lifecycle: object.lifecycle,
  });
}

function emit(
  store: GraphStore,
  type: NexoraGraphEventType,
  deps: NexoraGraphDependencies,
  payload: Readonly<Record<string, unknown>> = {},
  refs: {
    readonly edgeId?: string;
    readonly fromId?: string;
    readonly toId?: string;
  } = {},
): NexoraGraphEvent {
  const event = freezeEvent({
    eventId: deps.createEventId(),
    type,
    graphId: store.graphId,
    occurredAt: deps.now(),
    graphRevision: store.graphRevision,
    edgeId: refs.edgeId,
    fromId: refs.fromId,
    toId: refs.toId,
    payload,
  });
  store.events.push(event);
  return event;
}

function bump(store: GraphStore, deps: NexoraGraphDependencies): void {
  store.graphRevision += 1;
  store.updatedAt = deps.now();
}

function indexEdge(store: GraphStore, edge: NexoraGraphEdge): void {
  store.edges.set(edge.edgeId, edge);
  const out = store.outbound.get(edge.fromId) ?? [];
  out.push(edge.edgeId);
  store.outbound.set(edge.fromId, out);
  const inn = store.inbound.get(edge.toId) ?? [];
  inn.push(edge.edgeId);
  store.inbound.set(edge.toId, inn);
}

function unindexEdge(store: GraphStore, edge: NexoraGraphEdge): void {
  store.edges.delete(edge.edgeId);
  const out = (store.outbound.get(edge.fromId) ?? []).filter(
    (id) => id !== edge.edgeId,
  );
  if (out.length) store.outbound.set(edge.fromId, out);
  else store.outbound.delete(edge.fromId);
  const inn = (store.inbound.get(edge.toId) ?? []).filter(
    (id) => id !== edge.edgeId,
  );
  if (inn.length) store.inbound.set(edge.toId, inn);
  else store.inbound.delete(edge.toId);
}

function requireNode(
  store: GraphStore,
  objectId: string,
): ReadonlyNexoraObject | MutableNexoraObject {
  const node = store.nodes.get(objectId);
  if (!node) {
    throw new NexoraObjectRelationshipException(
      err(
        "GRAPH_OBJECT_NOT_FOUND",
        `Object not found in graph: ${objectId}`,
        store.graphId,
        { objectId },
      ),
    );
  }
  return node;
}

function isMutable(
  object: ReadonlyNexoraObject | MutableNexoraObject,
): object is MutableNexoraObject {
  return object.mode === "mutable";
}

function edgeMatchesFilter(
  edge: NexoraGraphEdge,
  options?: NexoraGraphTraversalOptions,
): boolean {
  if (
    options?.relationshipTypes &&
    !options.relationshipTypes.includes(edge.type)
  ) {
    return false;
  }
  if (options?.edgeFilter && !options.edgeFilter(edge)) return false;
  return true;
}

function nodeMatchesFilter(
  store: GraphStore,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): boolean {
  if (!options?.nodeFilter) return true;
  const object = store.nodes.get(objectId);
  if (!object) return false;
  return options.nodeFilter(nodeRef(object));
}

function neighbors(
  store: GraphStore,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly { readonly edge: NexoraGraphEdge; readonly nextId: string }[] {
  const direction = options?.direction ?? "outbound";
  const result: { edge: NexoraGraphEdge; nextId: string }[] = [];

  if (direction === "outbound" || direction === "both") {
    for (const edgeId of store.outbound.get(objectId) ?? []) {
      const edge = store.edges.get(edgeId)!;
      if (!edgeMatchesFilter(edge, options)) continue;
      if (!nodeMatchesFilter(store, edge.toId, options)) continue;
      result.push({ edge, nextId: edge.toId });
    }
  }
  if (direction === "inbound" || direction === "both") {
    for (const edgeId of store.inbound.get(objectId) ?? []) {
      const edge = store.edges.get(edgeId)!;
      if (!edgeMatchesFilter(edge, options)) continue;
      if (!nodeMatchesFilter(store, edge.fromId, options)) continue;
      result.push({ edge, nextId: edge.fromId });
    }
  }
  return Object.freeze(result);
}

// ─── Graph lifecycle ────────────────────────────────────────────────────────

export function createNexoraObjectGraph(
  graphId: string,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  deps?: Partial<NexoraGraphDependencies>,
): NexoraObjectGraph {
  const d = resolveDeps(deps);
  if (!graphId.trim()) {
    throw new NexoraObjectRelationshipException(
      err("GRAPH_INVALID_REQUEST", "graphId is required.", graphId || "unknown"),
    );
  }
  if (graphs.has(graphId)) {
    throw new NexoraObjectRelationshipException(
      err(
        "GRAPH_INVALID_REQUEST",
        `Graph already exists: ${graphId}`,
        graphId,
      ),
    );
  }

  const nodes = new Map<string, ReadonlyNexoraObject | MutableNexoraObject>();
  for (const object of objects) {
    const id = object.identity.id;
    if (nodes.has(id)) {
      throw new NexoraObjectRelationshipException(
        err(
          "GRAPH_INVALID_REQUEST",
          `Duplicate object id in graph: ${id}`,
          graphId,
          { objectId: id },
        ),
      );
    }
    nodes.set(id, object);
  }

  const now = d.now();
  const store: GraphStore = {
    graphId,
    graphRevision: 0,
    createdAt: now,
    updatedAt: now,
    nodes,
    edges: new Map(),
    outbound: new Map(),
    inbound: new Map(),
    events: [],
  };
  graphs.set(graphId, store);

  // Seed edges from existing contract relationships when present.
  for (const object of objects) {
    for (const rel of object.getRelationships()) {
      if (!nodes.has(rel.toId) || !nodes.has(rel.fromId)) continue;
      if (store.edges.has(rel.id)) continue;
      const edge = freezeEdge({
        edgeId: rel.id,
        type: rel.kind as NexoraGraphRelationshipType,
        fromId: rel.fromId,
        toId: rel.toId,
        label: rel.label,
        weight: rel.weight ?? 1,
        bidirectional: false,
        metadata: Object.freeze({}),
        createdAt: rel.createdAt,
        updatedAt: rel.createdAt,
        revision: 0,
      });
      indexEdge(store, edge);
    }
  }

  return publicGraph(store);
}

export function getNexoraObjectGraph(graphId: string): NexoraObjectGraph {
  return publicGraph(getStore(graphId));
}

export function addNexoraObjectGraphNodes(
  graphId: string,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
): NexoraObjectGraph {
  const store = getStore(graphId);
  for (const object of objects) {
    const id = object.identity.id;
    if (store.nodes.has(id)) {
      store.nodes.set(id, object);
      continue;
    }
    store.nodes.set(id, object);
  }
  return publicGraph(store);
}

// ─── Relationship CRUD ──────────────────────────────────────────────────────

export function createRelationship(
  graphId: string,
  input: NexoraGraphCreateRelationshipInput,
  deps?: NexoraGraphDependencies,
): NexoraGraphMutationResult {
  const d = resolveDeps(deps);
  const store = getStore(graphId);
  const events: NexoraGraphEvent[] = [];
  const warnings: string[] = [];

  if (!input.edgeId.trim()) {
    return rejectMutation(store, [
      err("GRAPH_INVALID_REQUEST", "edgeId is required.", graphId),
    ]);
  }
  if (store.edges.has(input.edgeId)) {
    return rejectMutation(store, [
      err(
        "GRAPH_DUPLICATE_EDGE_ID",
        `Duplicate edge identity: ${input.edgeId}`,
        graphId,
        { edgeId: input.edgeId },
      ),
    ]);
  }

  let from: ReadonlyNexoraObject | MutableNexoraObject;
  let to: ReadonlyNexoraObject | MutableNexoraObject;
  try {
    from = requireNode(store, input.fromId);
    to = requireNode(store, input.toId);
  } catch (cause) {
    if (cause instanceof NexoraObjectRelationshipException) {
      return rejectMutation(store, [
        err(cause.code, cause.message, graphId, {
          objectId:
            cause.message.includes(input.fromId) ? input.fromId : input.toId,
        }),
      ]);
    }
    throw cause;
  }

  if (from.lifecycle === "Deleted" || to.lifecycle === "Deleted") {
    return rejectMutation(store, [
      err(
        "GRAPH_OBJECT_DELETED",
        "Deleted objects cannot create new edges.",
        graphId,
        {
          objectId:
            from.lifecycle === "Deleted" ? input.fromId : input.toId,
        },
      ),
    ]);
  }

  if (input.fromId === input.toId && !input.allowSelfReference) {
    return rejectMutation(store, [
      err(
        "GRAPH_SELF_REFERENCE_FORBIDDEN",
        "Self-reference requires allowSelfReference: true.",
        graphId,
        { edgeId: input.edgeId, objectId: input.fromId },
      ),
    ]);
  }

  const duplicate = [...store.edges.values()].find(
    (edge) =>
      edge.fromId === input.fromId &&
      edge.toId === input.toId &&
      edge.type === input.type,
  );
  if (duplicate) {
    return rejectMutation(store, [
      err(
        "GRAPH_DUPLICATE_RELATIONSHIP",
        `Relationship ${input.type} already exists from ${input.fromId} to ${input.toId}.`,
        graphId,
        { edgeId: duplicate.edgeId },
      ),
    ]);
  }

  const now = d.now();
  const edge = freezeEdge({
    edgeId: input.edgeId,
    type: input.type,
    fromId: input.fromId,
    toId: input.toId,
    label: input.label,
    weight: input.weight ?? 1,
    bidirectional: Boolean(input.bidirectional),
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    createdAt: now,
    updatedAt: now,
    revision: 0,
  });

  // Opt-in Contract sync — graph storage is canonical by default.
  if (input.syncToContract === true && isMutable(from)) {
    try {
      from.addRelationship({
        id: edge.edgeId,
        kind: edge.type as NexoraRelationshipKindId,
        toId: edge.toId,
        label: edge.label,
        weight: edge.weight,
        createdAt: edge.createdAt,
      });
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Contract sync failed.";
      return rejectMutation(store, [
        err("GRAPH_INVALID_REQUEST", message, graphId, {
          edgeId: edge.edgeId,
          objectId: edge.fromId,
        }),
      ]);
    }
  }

  indexEdge(store, edge);
  bump(store, d);
  events.push(
    emit(
      store,
      "RelationshipCreated",
      d,
      { type: edge.type, weight: edge.weight },
      { edgeId: edge.edgeId, fromId: edge.fromId, toId: edge.toId },
    ),
  );
  events.push(
    emit(store, "DependencyChanged", d, { reason: "create" }, {
      edgeId: edge.edgeId,
      fromId: edge.fromId,
      toId: edge.toId,
    }),
  );
  events.push(emit(store, "GraphChanged", d, { mutation: "create" }));

  // Optional inverse edge for bidirectional semantics.
  if (edge.bidirectional) {
    const inverseType =
      NEXORA_GRAPH_INVERSE_TYPES[edge.type] ?? edge.type;
    const inverseId = `${edge.edgeId}::inverse`;
    if (!store.edges.has(inverseId) && edge.fromId !== edge.toId) {
      const inverse = freezeEdge({
        edgeId: inverseId,
        type: inverseType,
        fromId: edge.toId,
        toId: edge.fromId,
        label: edge.label,
        weight: edge.weight,
        bidirectional: false,
        metadata: Object.freeze({ inverseOf: edge.edgeId }),
        createdAt: now,
        updatedAt: now,
        revision: 0,
      });
      indexEdge(store, inverse);
      events.push(
        emit(
          store,
          "RelationshipCreated",
          d,
          { type: inverse.type, inverseOf: edge.edgeId },
          {
            edgeId: inverse.edgeId,
            fromId: inverse.fromId,
            toId: inverse.toId,
          },
        ),
      );
      warnings.push(`Created inverse edge ${inverseId} (${inverseType}).`);
    }
  }

  return Object.freeze({
    accepted: true,
    changed: true,
    graph: publicGraph(store),
    edge,
    events: Object.freeze(events),
    errors: Object.freeze([]),
    warnings: Object.freeze(warnings),
  });
}

function rejectMutation(
  store: GraphStore,
  errors: readonly NexoraGraphError[],
): NexoraGraphMutationResult {
  return Object.freeze({
    accepted: false,
    changed: false,
    graph: publicGraph(store),
    events: Object.freeze([]),
    errors: Object.freeze([...errors]),
    warnings: Object.freeze([]),
  });
}

export function removeRelationship(
  graphId: string,
  edgeId: string,
  deps?: NexoraGraphDependencies,
  options?: { readonly syncToContract?: boolean },
): NexoraGraphMutationResult {
  const d = resolveDeps(deps);
  const store = getStore(graphId);
  const edge = store.edges.get(edgeId);
  if (!edge) {
    return rejectMutation(store, [
      err(
        "GRAPH_EDGE_NOT_FOUND",
        `Edge not found: ${edgeId}`,
        graphId,
        { edgeId },
      ),
    ]);
  }

  if (options?.syncToContract === true) {
    const from = store.nodes.get(edge.fromId);
    if (from && isMutable(from)) {
      try {
        from.removeRelationship(edgeId);
      } catch {
        // Graph remains authoritative if contract edge was already absent.
      }
    }
  }

  unindexEdge(store, edge);
  // Remove inverse if present.
  const inverseId = `${edgeId}::inverse`;
  const inverse = store.edges.get(inverseId);
  if (inverse) unindexEdge(store, inverse);

  bump(store, d);
  const events = [
    emit(
      store,
      "RelationshipDeleted",
      d,
      { type: edge.type },
      { edgeId, fromId: edge.fromId, toId: edge.toId },
    ),
    emit(store, "DependencyChanged", d, { reason: "remove" }, {
      edgeId,
      fromId: edge.fromId,
      toId: edge.toId,
    }),
    emit(store, "GraphChanged", d, { mutation: "remove" }),
  ];

  return Object.freeze({
    accepted: true,
    changed: true,
    graph: publicGraph(store),
    edge,
    events: Object.freeze(events),
    errors: Object.freeze([]),
    warnings: Object.freeze([]),
  });
}

export function updateRelationship(
  graphId: string,
  edgeId: string,
  patch: NexoraGraphUpdateRelationshipInput,
  deps?: NexoraGraphDependencies,
): NexoraGraphMutationResult {
  const d = resolveDeps(deps);
  const store = getStore(graphId);
  const previous = store.edges.get(edgeId);
  if (!previous) {
    return rejectMutation(store, [
      err(
        "GRAPH_EDGE_NOT_FOUND",
        `Edge not found: ${edgeId}`,
        graphId,
        { edgeId },
      ),
    ]);
  }

  const keys = Object.keys(patch);
  if (keys.length === 0) {
    return Object.freeze({
      accepted: true,
      changed: false,
      graph: publicGraph(store),
      edge: previous,
      events: Object.freeze([]),
      errors: Object.freeze([]),
      warnings: Object.freeze(["No relationship fields changed."]),
    });
  }

  const next = freezeEdge({
    ...previous,
    type: patch.type ?? previous.type,
    label: patch.label ?? previous.label,
    weight: patch.weight ?? previous.weight,
    metadata: Object.freeze({
      ...previous.metadata,
      ...(patch.metadata ?? {}),
    }),
    updatedAt: d.now(),
    revision: previous.revision + 1,
  });

  store.edges.set(edgeId, next);
  bump(store, d);
  const events = [
    emit(
      store,
      "RelationshipUpdated",
      d,
      { previousRevision: previous.revision, nextRevision: next.revision },
      { edgeId, fromId: next.fromId, toId: next.toId },
    ),
    emit(store, "GraphChanged", d, { mutation: "update" }),
  ];

  return Object.freeze({
    accepted: true,
    changed: true,
    graph: publicGraph(store),
    edge: next,
    events: Object.freeze(events),
    errors: Object.freeze([]),
    warnings: Object.freeze([]),
  });
}

export function findRelationship(
  graphId: string,
  predicate: (edge: NexoraGraphEdge) => boolean,
): NexoraGraphEdge | null {
  const store = getStore(graphId);
  for (const edge of store.edges.values()) {
    if (predicate(edge)) return edge;
  }
  return null;
}

export function getRelationship(
  graphId: string,
  edgeId: string,
): NexoraGraphEdge | null {
  return getStore(graphId).edges.get(edgeId) ?? null;
}

export function listRelationships(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
): readonly NexoraGraphEdge[] {
  const store = getStore(graphId);
  const edges = [...store.edges.values()].filter((edge) =>
    edgeMatchesFilter(edge, options),
  );
  edges.sort((a, b) => a.edgeId.localeCompare(b.edgeId));
  return Object.freeze(edges);
}

// ─── Dependency engine ──────────────────────────────────────────────────────

function collectReachable(
  store: GraphStore,
  startId: string,
  options: NexoraGraphTraversalOptions | undefined,
  includeStart: boolean,
): readonly string[] {
  const maxDepth = options?.maxDepth ?? Number.POSITIVE_INFINITY;
  const visited = new Set<string>();
  const ordered: string[] = [];
  const queue: { id: string; depth: number }[] = [{ id: startId, depth: 0 }];
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    ordered.push(current.id);
    if (current.depth >= maxDepth) continue;
    const nextItems = [...neighbors(store, current.id, options)].sort((a, b) =>
      a.edge.edgeId.localeCompare(b.edge.edgeId),
    );
    for (const { nextId } of nextItems) {
      if (visited.has(nextId)) continue;
      visited.add(nextId);
      queue.push({ id: nextId, depth: current.depth + 1 });
    }
  }

  return Object.freeze(
    includeStart ? ordered : ordered.filter((id) => id !== startId),
  );
}

export function findDependencies(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, objectId);
  return collectReachable(
    store,
    objectId,
    {
      ...options,
      direction: "outbound",
      relationshipTypes: options?.relationshipTypes ?? ["depends_on"],
    },
    false,
  );
}

export function findDependents(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, objectId);
  return collectReachable(
    store,
    objectId,
    {
      ...options,
      direction: "inbound",
      relationshipTypes: options?.relationshipTypes ?? ["depends_on"],
    },
    false,
  );
}

export function findUpstream(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, objectId);
  return collectReachable(
    store,
    objectId,
    { ...options, direction: "inbound" },
    false,
  );
}

export function findDownstream(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, objectId);
  return collectReachable(
    store,
    objectId,
    { ...options, direction: "outbound" },
    false,
  );
}

export function findAncestors(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  return findUpstream(graphId, objectId, {
    ...options,
    relationshipTypes: options?.relationshipTypes ?? [
      "parent_of",
      "contains",
      "owns",
    ],
    // Ancestors: walk inbound of child_of / belongs_to, or outbound inverse.
    // Prefer inbound of parent_of edges (parent → child means parent is upstream via inbound from child).
    direction: "inbound",
  });
}

export function findDescendants(
  graphId: string,
  objectId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  return findDownstream(graphId, objectId, {
    ...options,
    relationshipTypes: options?.relationshipTypes ?? [
      "parent_of",
      "contains",
      "owns",
    ],
    direction: "outbound",
  });
}

export function findRootNodes(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  const roots: string[] = [];
  for (const objectId of store.nodes.keys()) {
    if (!nodeMatchesFilter(store, objectId, options)) continue;
    const inbound = neighbors(store, objectId, {
      ...options,
      direction: "inbound",
    });
    if (inbound.length === 0) roots.push(objectId);
  }
  roots.sort();
  return Object.freeze(roots);
}

export function findLeafNodes(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  const leaves: string[] = [];
  for (const objectId of store.nodes.keys()) {
    if (!nodeMatchesFilter(store, objectId, options)) continue;
    const outbound = neighbors(store, objectId, {
      ...options,
      direction: "outbound",
    });
    if (outbound.length === 0) leaves.push(objectId);
  }
  leaves.sort();
  return Object.freeze(leaves);
}

// ─── Traversal ──────────────────────────────────────────────────────────────

export function traverseBfs(
  graphId: string,
  startId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, startId);
  return collectReachable(store, startId, options, true);
}

export function traverseDfs(
  graphId: string,
  startId: string,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  const store = getStore(graphId);
  requireNode(store, startId);
  const maxDepth = options?.maxDepth ?? Number.POSITIVE_INFINITY;
  const visited = new Set<string>();
  const ordered: string[] = [];

  const visit = (id: string, depth: number): void => {
    if (visited.has(id)) return;
    visited.add(id);
    ordered.push(id);
    if (depth >= maxDepth) return;
    // Deterministic neighbor order by edgeId.
    const next = [...neighbors(store, id, options)].sort((a, b) =>
      a.edge.edgeId.localeCompare(b.edge.edgeId),
    );
    for (const item of next) visit(item.nextId, depth + 1);
  };

  visit(startId, 0);
  return Object.freeze(ordered);
}

export function findShortestPath(
  graphId: string,
  fromId: string,
  toId: string,
  options?: NexoraGraphTraversalOptions,
): NexoraGraphPath | null {
  const store = getStore(graphId);
  requireNode(store, fromId);
  requireNode(store, toId);
  if (fromId === toId) {
    return Object.freeze({
      nodes: Object.freeze([fromId]),
      edges: Object.freeze([]),
      length: 0,
      totalWeight: 0,
    });
  }

  const maxDepth = options?.maxDepth ?? Number.POSITIVE_INFINITY;
  const visited = new Set<string>([fromId]);
  const parent = new Map<
    string,
    { readonly prev: string; readonly edge: NexoraGraphEdge }
  >();
  const queue: { id: string; depth: number }[] = [{ id: fromId, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= maxDepth) continue;
    const nextItems = [...neighbors(store, current.id, {
      ...options,
      direction: options?.direction ?? "outbound",
    })].sort((a, b) => a.edge.edgeId.localeCompare(b.edge.edgeId));

    for (const { edge, nextId } of nextItems) {
      if (visited.has(nextId)) continue;
      visited.add(nextId);
      parent.set(nextId, { prev: current.id, edge });
      if (nextId === toId) {
        const nodes: string[] = [toId];
        const edges: NexoraGraphEdge[] = [];
        let cursor = toId;
        while (cursor !== fromId) {
          const step = parent.get(cursor)!;
          edges.unshift(step.edge);
          nodes.unshift(step.prev);
          cursor = step.prev;
        }
        const totalWeight = edges.reduce((sum, e) => sum + e.weight, 0);
        return Object.freeze({
          nodes: Object.freeze(nodes),
          edges: Object.freeze(edges),
          length: edges.length,
          totalWeight,
        });
      }
      queue.push({ id: nextId, depth: current.depth + 1 });
    }
  }
  return null;
}

export function findAllPaths(
  graphId: string,
  fromId: string,
  toId: string,
  options?: NexoraGraphTraversalOptions,
): readonly NexoraGraphPath[] {
  const store = getStore(graphId);
  requireNode(store, fromId);
  requireNode(store, toId);
  const maxDepth = options?.maxDepth ?? 32;
  const paths: NexoraGraphPath[] = [];

  const walk = (
    current: string,
    nodes: string[],
    edges: NexoraGraphEdge[],
    depth: number,
  ): void => {
    if (current === toId && nodes.length > 0) {
      paths.push(
        Object.freeze({
          nodes: Object.freeze([...nodes]),
          edges: Object.freeze([...edges]),
          length: edges.length,
          totalWeight: edges.reduce((sum, e) => sum + e.weight, 0),
        }),
      );
      return;
    }
    if (depth >= maxDepth) return;
    const nextItems = [...neighbors(store, current, {
      ...options,
      direction: options?.direction ?? "outbound",
    })].sort((a, b) => a.edge.edgeId.localeCompare(b.edge.edgeId));

    for (const { edge, nextId } of nextItems) {
      if (nodes.includes(nextId)) continue; // avoid cycles in path search
      walk(nextId, [...nodes, nextId], [...edges, edge], depth + 1);
    }
  };

  walk(fromId, [fromId], [], 0);
  paths.sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.nodes.join(">").localeCompare(b.nodes.join(">"));
  });
  return Object.freeze(paths);
}

export function findNeighborhood(
  graphId: string,
  objectId: string,
  depth = 1,
  options?: NexoraGraphTraversalOptions,
): readonly string[] {
  return traverseBfs(graphId, objectId, {
    ...options,
    maxDepth: depth,
    direction: options?.direction ?? "both",
  }).filter((id) => id !== objectId);
}

// ─── Cycle detection ────────────────────────────────────────────────────────

export function hasCycle(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
): boolean {
  return detectCycles(graphId, options).length > 0;
}

export function detectCycles(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
  deps?: NexoraGraphDependencies,
): readonly (readonly string[])[] {
  const store = getStore(graphId);
  const d = resolveDeps(deps);
  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const visit = (id: string): void => {
    if (visited.has(id)) return;
    if (visiting.has(id)) {
      const idx = stack.indexOf(id);
      if (idx >= 0) {
        const cycle = [...stack.slice(idx), id];
        cycles.push(cycle);
      }
      return;
    }
    visiting.add(id);
    stack.push(id);
    for (const { nextId } of neighbors(store, id, {
      ...options,
      direction: "outbound",
    })) {
      visit(nextId);
    }
    stack.pop();
    visiting.delete(id);
    visited.add(id);
  };

  const nodeIds = [...store.nodes.keys()].sort();
  for (const id of nodeIds) visit(id);

  // Deduplicate cycles by normalized rotation.
  const seen = new Set<string>();
  const unique: string[][] = [];
  for (const cycle of cycles) {
    if (cycle.length < 2) continue;
    const body = cycle.slice(0, -1);
    const rotations = body.map((_, i) =>
      [...body.slice(i), ...body.slice(0, i)].join(">"),
    );
    const key = rotations.sort()[0]!;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(cycle);
  }

  if (unique.length > 0) {
    emit(store, "CycleDetected", d, {
      cycleCount: unique.length,
      cycles: Object.freeze(unique.map((c) => Object.freeze([...c]))),
    });
  }

  return Object.freeze(unique.map((c) => Object.freeze([...c])));
}

export function breakCycleProposal(
  graphId: string,
  options?: NexoraGraphTraversalOptions,
): readonly {
  readonly removeEdgeId: string;
  readonly fromId: string;
  readonly toId: string;
  readonly type: NexoraGraphRelationshipType;
  readonly reason: string;
}[] {
  const store = getStore(graphId);
  const cycles = detectCycles(graphId, options);
  const proposals: {
    removeEdgeId: string;
    fromId: string;
    toId: string;
    type: NexoraGraphRelationshipType;
    reason: string;
  }[] = [];

  for (const cycle of cycles) {
    // Propose removing the last edge in the cycle (deterministic by edgeId max).
    const candidates: NexoraGraphEdge[] = [];
    for (let i = 0; i < cycle.length - 1; i += 1) {
      const fromId = cycle[i]!;
      const toId = cycle[i + 1]!;
      for (const edgeId of store.outbound.get(fromId) ?? []) {
        const edge = store.edges.get(edgeId)!;
        if (edge.toId === toId && edgeMatchesFilter(edge, options)) {
          candidates.push(edge);
        }
      }
    }
    if (candidates.length === 0) continue;
    candidates.sort((a, b) => b.edgeId.localeCompare(a.edgeId));
    const chosen = candidates[0]!;
    proposals.push({
      removeEdgeId: chosen.edgeId,
      fromId: chosen.fromId,
      toId: chosen.toId,
      type: chosen.type,
      reason: `Break cycle ${cycle.join(" → ")} by removing highest edgeId.`,
    });
  }

  return Object.freeze(proposals.map((p) => Object.freeze(p)));
}

// ─── Impact propagation (simulation only) ───────────────────────────────────

export function simulateImpactPropagation(
  graphId: string,
  seed: NexoraGraphImpactSeed,
  options?: NexoraGraphTraversalOptions & {
    readonly relationshipTypes?: readonly NexoraGraphRelationshipType[];
  },
): NexoraGraphImpactResult {
  const store = getStore(graphId);
  const start = requireNode(store, seed.objectId);
  const maxDepth = options?.maxDepth ?? 32;
  const signal = seed.signal ?? seed.status ?? start.status;
  const path: NexoraGraphImpactStep[] = [
    Object.freeze({
      objectId: seed.objectId,
      status: seed.status ?? start.status,
      lifecycle: start.lifecycle,
      depth: 0,
      signal,
    }),
  ];
  const reached = new Set<string>([seed.objectId]);
  let truncated = false;

  const queue: { id: string; depth: number }[] = [
    { id: seed.objectId, depth: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= maxDepth) {
      truncated = true;
      continue;
    }
    const nextItems = [...neighbors(store, current.id, {
      ...options,
      direction: "outbound",
      relationshipTypes:
        options?.relationshipTypes ?? ["affects", "depends_on", "causes"],
    })].sort((a, b) => a.edge.edgeId.localeCompare(b.edge.edgeId));

    for (const { edge, nextId } of nextItems) {
      if (reached.has(nextId)) continue;
      const object = store.nodes.get(nextId);
      if (!object) continue;
      reached.add(nextId);
      path.push(
        Object.freeze({
          objectId: nextId,
          status: object.status,
          lifecycle: object.lifecycle,
          viaEdgeId: edge.edgeId,
          viaType: edge.type,
          depth: current.depth + 1,
          signal,
        }),
      );
      queue.push({ id: nextId, depth: current.depth + 1 });
    }
  }

  return Object.freeze({
    seedObjectId: seed.objectId,
    path: Object.freeze(path),
    reachedObjectIds: Object.freeze([...reached]),
    truncated,
  });
}

// ─── Composite operations ───────────────────────────────────────────────────

export function applyNexoraGraphComposite(
  graphId: string,
  operations: readonly NexoraGraphCompositeOperation[],
  deps?: NexoraGraphDependencies,
): NexoraGraphCompositeResult {
  const d = resolveDeps(deps);
  const store = getStore(graphId);

  // Snapshot for rollback
  const edgeSnapshot = new Map(store.edges);
  const outboundSnapshot = new Map(
    [...store.outbound.entries()].map(([k, v]) => [k, [...v]]),
  );
  const inboundSnapshot = new Map(
    [...store.inbound.entries()].map(([k, v]) => [k, [...v]]),
  );
  const revisionSnapshot = store.graphRevision;
  const updatedSnapshot = store.updatedAt;
  const eventsSnapshotLength = store.events.length;

  const results: NexoraGraphMutationResult[] = [];
  const events: NexoraGraphEvent[] = [];
  const errors: NexoraGraphError[] = [];

  for (const operation of operations) {
    let result: NexoraGraphMutationResult;
    if (operation.op === "create") {
      result = createRelationship(graphId, operation.input, d);
    } else if (operation.op === "remove") {
      result = removeRelationship(graphId, operation.edgeId, d);
    } else {
      result = updateRelationship(
        graphId,
        operation.edgeId,
        operation.patch,
        d,
      );
    }
    results.push(result);
    events.push(...result.events);
    if (!result.accepted) {
      errors.push(...result.errors);
      // Rollback
      store.edges = edgeSnapshot;
      store.outbound = outboundSnapshot;
      store.inbound = inboundSnapshot;
      store.graphRevision = revisionSnapshot;
      store.updatedAt = updatedSnapshot;
      store.events.length = eventsSnapshotLength;
      return Object.freeze({
        accepted: false,
        results: Object.freeze(results),
        events: Object.freeze([]),
        errors: Object.freeze([
          ...errors,
          err(
            "GRAPH_COMPOSITE_REJECTED",
            "Composite graph operation rolled back.",
            graphId,
          ),
        ]),
      });
    }
  }

  return Object.freeze({
    accepted: true,
    results: Object.freeze(results),
    events: Object.freeze(events),
    errors: Object.freeze([]),
  });
}

// ─── Projection / events / snapshot ─────────────────────────────────────────

export function projectGraph(graphId: string): NexoraGraphProjection {
  const store = getStore(graphId);
  const nodes = [...store.nodes.values()]
    .map(nodeRef)
    .sort((a, b) => a.objectId.localeCompare(b.objectId));
  const edges = [...store.edges.values()].sort((a, b) =>
    a.edgeId.localeCompare(b.edgeId),
  );
  return Object.freeze({
    graphId: store.graphId,
    graphRevision: store.graphRevision,
    schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
    engineIdentity: NOL_RELATIONSHIP_IDENTITY,
    nodes: Object.freeze(nodes),
    edges: Object.freeze(edges),
    nodeCount: nodes.length,
    edgeCount: edges.length,
  });
}

export function listNexoraGraphEvents(
  graphId: string,
): readonly NexoraGraphEvent[] {
  return Object.freeze([...getStore(graphId).events]);
}

export function createNexoraGraphSnapshot(
  graphId: string,
  snapshotId: string,
  deps?: NexoraGraphDependencies,
): NexoraGraphSnapshot {
  const d = resolveDeps(deps);
  const projection = projectGraph(graphId);
  return Object.freeze({
    snapshotId,
    graphId: projection.graphId,
    capturedAt: d.now(),
    graphRevision: projection.graphRevision,
    schemaVersion: projection.schemaVersion,
    nodes: projection.nodes,
    edges: projection.edges,
  });
}

export function restoreNexoraGraphSnapshot(
  snapshot: NexoraGraphSnapshot,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  deps?: NexoraGraphDependencies,
): NexoraObjectGraph {
  const d = resolveDeps(deps);
  if (snapshot.schemaVersion !== NOL_RELATIONSHIP_SCHEMA_VERSION) {
    throw new NexoraObjectRelationshipException(
      err(
        "GRAPH_UNSUPPORTED_VERSION",
        `Unsupported graph schema version: ${snapshot.schemaVersion}`,
        snapshot.graphId,
      ),
    );
  }

  // Replace store entirely from snapshot edges; nodes come from provided objects.
  if (graphs.has(snapshot.graphId)) {
    graphs.delete(snapshot.graphId);
  }
  createNexoraObjectGraph(snapshot.graphId, objects, d);
  const store = getStore(snapshot.graphId);
  // Clear seeded edges and restore snapshot edges exactly.
  store.edges.clear();
  store.outbound.clear();
  store.inbound.clear();
  for (const edge of snapshot.edges) {
    indexEdge(store, freezeEdge(edge));
  }
  store.graphRevision = snapshot.graphRevision;
  store.updatedAt = d.now();
  emit(store, "GraphChanged", d, {
    mutation: "restore",
    snapshotId: snapshot.snapshotId,
  });
  return publicGraph(store);
}

// ─── Serialization ──────────────────────────────────────────────────────────

export function serializeGraph(graphId: string): string {
  const projection = projectGraph(graphId);
  return JSON.stringify({
    engineIdentity: NOL_RELATIONSHIP_IDENTITY,
    engineVersion: NOL_RELATIONSHIP_ENGINE_VERSION,
    schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
    graphId: projection.graphId,
    graphRevision: projection.graphRevision,
    nodes: projection.nodes,
    edges: projection.edges,
  });
}

export function deserializeGraph(
  json: string,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  deps?: NexoraGraphDependencies,
): NexoraObjectGraph {
  const parsed = JSON.parse(json) as {
    readonly engineIdentity?: string;
    readonly schemaVersion?: string;
    readonly graphId: string;
    readonly graphRevision: number;
    readonly nodes: readonly NexoraGraphNodeRef[];
    readonly edges: readonly NexoraGraphEdge[];
  };

  if (parsed.schemaVersion !== NOL_RELATIONSHIP_SCHEMA_VERSION) {
    throw new NexoraObjectRelationshipException(
      err(
        "GRAPH_UNSUPPORTED_VERSION",
        `Unsupported graph schema version: ${String(parsed.schemaVersion)}`,
        parsed.graphId ?? "unknown",
      ),
    );
  }
  if (
    parsed.engineIdentity &&
    parsed.engineIdentity !== NOL_RELATIONSHIP_IDENTITY
  ) {
    throw new NexoraObjectRelationshipException(
      err(
        "GRAPH_UNSUPPORTED_VERSION",
        `Unsupported graph engine identity: ${parsed.engineIdentity}`,
        parsed.graphId,
      ),
    );
  }

  return restoreNexoraGraphSnapshot(
    {
      snapshotId: `import-${parsed.graphId}`,
      graphId: parsed.graphId,
      capturedAt: resolveDeps(deps).now(),
      graphRevision: parsed.graphRevision,
      schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
      nodes: Object.freeze([...(parsed.nodes ?? [])]),
      edges: Object.freeze(
        (parsed.edges ?? []).map((edge) => freezeEdge(edge)),
      ),
    },
    objects,
    deps,
  );
}

export function cloneNexoraObjectGraph(
  graphId: string,
  newGraphId: string,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  deps?: NexoraGraphDependencies,
): NexoraObjectGraph {
  const json = serializeGraph(graphId);
  const parsed = JSON.parse(json) as {
    graphRevision: number;
    nodes: NexoraGraphNodeRef[];
    edges: NexoraGraphEdge[];
  };
  return restoreNexoraGraphSnapshot(
    {
      snapshotId: `clone-${newGraphId}`,
      graphId: newGraphId,
      capturedAt: resolveDeps(deps).now(),
      graphRevision: parsed.graphRevision,
      schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
      nodes: Object.freeze(parsed.nodes),
      edges: Object.freeze(parsed.edges.map((e) => freezeEdge(e))),
    },
    objects,
    deps,
  );
}

export function exportNexoraObjectGraph(graphId: string): {
  readonly json: string;
  readonly projection: NexoraGraphProjection;
} {
  return Object.freeze({
    json: serializeGraph(graphId),
    projection: projectGraph(graphId),
  });
}

export function importNexoraObjectGraph(
  json: string,
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  deps?: NexoraGraphDependencies,
): NexoraObjectGraph {
  return deserializeGraph(json, objects, deps);
}

// ─── Validation helpers (side-effect free fingerprints) ─────────────────────

export function assertGraphDoesNotMutateRuntimeOrState(
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
  before: readonly {
    readonly id: string;
    readonly runtimeRevision: number;
    readonly stateRevision: number;
    readonly identityId: string;
    readonly status: NexoraObjectStatus;
    readonly lifecycle: NexoraObjectLifecycle;
  }[],
): void {
  for (const fingerprint of before) {
    const object = objects.find((o) => o.identity.id === fingerprint.id);
    if (!object) continue;
    const runtime = getNexoraObjectRuntimeState(object);
    const state = createNexoraObjectState(object);
    if (runtime.runtimeRevision !== fingerprint.runtimeRevision) {
      throw new NexoraObjectRelationshipException(
        err(
          "GRAPH_INVARIANT_VIOLATION",
          "Graph operation mutated runtime revision.",
          "assert",
          { objectId: fingerprint.id },
        ),
      );
    }
    if (state.stateRevision !== fingerprint.stateRevision) {
      throw new NexoraObjectRelationshipException(
        err(
          "GRAPH_INVARIANT_VIOLATION",
          "Graph operation mutated state revision.",
          "assert",
          { objectId: fingerprint.id },
        ),
      );
    }
    if (object.identity.id !== fingerprint.identityId) {
      throw new NexoraObjectRelationshipException(
        err(
          "GRAPH_INVARIANT_VIOLATION",
          "Graph operation mutated identity.",
          "assert",
          { objectId: fingerprint.id },
        ),
      );
    }
    if (
      object.status !== fingerprint.status ||
      object.lifecycle !== fingerprint.lifecycle
    ) {
      throw new NexoraObjectRelationshipException(
        err(
          "GRAPH_INVARIANT_VIOLATION",
          "Graph operation mutated status or lifecycle.",
          "assert",
          { objectId: fingerprint.id },
        ),
      );
    }
  }
}

export function captureObjectFingerprints(
  objects: readonly (ReadonlyNexoraObject | MutableNexoraObject)[],
): readonly {
  readonly id: string;
  readonly runtimeRevision: number;
  readonly stateRevision: number;
  readonly identityId: string;
  readonly status: NexoraObjectStatus;
  readonly lifecycle: NexoraObjectLifecycle;
}[] {
  return Object.freeze(
    objects.map((object) =>
      Object.freeze({
        id: object.identity.id,
        runtimeRevision: getNexoraObjectRuntimeState(object).runtimeRevision,
        stateRevision: createNexoraObjectState(object).stateRevision,
        identityId: object.identity.id,
        status: object.status,
        lifecycle: object.lifecycle,
      }),
    ),
  );
}

export function getNexoraObjectRelationshipEngineSummary() {
  return Object.freeze({
    identity: NOL_RELATIONSHIP_IDENTITY,
    engineVersion: NOL_RELATIONSHIP_ENGINE_VERSION,
    schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
    upstream: NOL_RELATIONSHIP_UPSTREAM,
    relationshipTypeCount: NEXORA_GRAPH_RELATIONSHIP_TYPES.length,
    directed: true,
    runtimeIndependent: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectRelationshipDependencyEngine = Object.freeze({
  identity: NOL_RELATIONSHIP_IDENTITY,
  engineVersion: NOL_RELATIONSHIP_ENGINE_VERSION,
  schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
  tags: NOL_RELATIONSHIP_TAGS,
  createGraph: createNexoraObjectGraph,
  createRelationship,
  removeRelationship,
  updateRelationship,
  findRelationship,
  findDependencies,
  findDependents,
  findShortestPath,
  findAllPaths,
  detectCycles,
  simulateImpactPropagation,
  serializeGraph,
  deserializeGraph,
  projectGraph,
  summary: getNexoraObjectRelationshipEngineSummary,
});
