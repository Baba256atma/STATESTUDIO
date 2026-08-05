/**
 * NOL-1:6 — Universal NexoraObject Validation & Integrity Engine
 *
 * Single deterministic validation authority for every NexoraObject.
 * Side-effect free. Delegates domain checks to NOL-1:1 … NOL-1:5.
 *
 * Identity: NOL-1:6/UniversalNexoraObjectValidationIntegrityEngine
 */

import {
  NOL_FOUNDATION_VERSION,
  isNexoraObjectLifecycle,
  isNexoraObjectStatus,
  isNexoraObjectType,
  type NexoraObjectKpiFacet,
  type NexoraObjectVisualizationState,
} from "../foundation/universalNexoraObjectFoundation.ts";
import {
  NEXORA_OBJECT_CONTRACT_SECTIONS,
  NOL_CONTRACT_VERSION,
  NOL_SCHEMA_VERSION,
  RESERVED_METADATA_KEYS,
  isNexoraObject,
  validateNexoraObjectContract,
  type MutableNexoraObject,
  type ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";
import {
  getNexoraObjectRuntimeState,
  validateNexoraObjectRuntimeState,
  NOL_RUNTIME_SCHEMA_VERSION,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
import {
  NEXORA_OBJECT_EXECUTIVE_MAX,
  NEXORA_OBJECT_EXECUTIVE_MIN,
  NOL_STE_STATE_SCHEMA_VERSION,
  createNexoraObjectState,
  validateNexoraObjectState,
} from "../state/universalNexoraObjectStateTransitionEngine.ts";
import {
  NOL_RELATIONSHIP_SCHEMA_VERSION,
  detectCycles,
  getNexoraObjectGraph,
  listRelationships,
  projectGraph,
} from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";

// ─── Identity & versions ────────────────────────────────────────────────────

export const NOL_VALIDATION_IDENTITY =
  "NOL-1:6/UniversalNexoraObjectValidationIntegrityEngine" as const;

export const NOL_VALIDATION_ENGINE_VERSION = "1.0.0" as const;

export const NOL_VALIDATION_SCHEMA_VERSION = "1.0.0" as const;

export const validatorIdentity = NOL_VALIDATION_IDENTITY;
export const validationEngineVersion = NOL_VALIDATION_ENGINE_VERSION;
export const validationSchemaVersion = NOL_VALIDATION_SCHEMA_VERSION;

export const NOL_VALIDATION_TAGS = Object.freeze([
  "[NOL-1:6]",
  "[UNIVERSAL_NEXORA_OBJECT_VALIDATION]",
  "[INTEGRITY_ENGINE]",
  "[SIDE_EFFECT_FREE]",
  "[DELEGATED_DOMAINS]",
] as const);

export const NOL_VALIDATION_UPSTREAM = Object.freeze([
  "NOL-1:1/UniversalNexoraObjectFoundation",
  "NOL-1:2/UniversalNexoraObjectContractModel",
  "NOL-1:3/UniversalNexoraObjectRuntimeModel",
  "NOL-1:4/UniversalNexoraObjectStateTransitionEngine",
  "NOL-1:5/UniversalNexoraObjectRelationshipDependencyEngine",
] as const);

// ─── Levels, domains, profiles ──────────────────────────────────────────────

export type NexoraValidationLevel =
  | "Minimal"
  | "Standard"
  | "Strict"
  | "Certification";

export type NexoraValidationDomain =
  | "Identity"
  | "Contract"
  | "Runtime"
  | "State"
  | "Relationship"
  | "Visualization"
  | "Timeline"
  | "Knowledge"
  | "Executive"
  | "Metadata"
  | "Serialization"
  | "Graph"
  | "Composite"
  | "KPI";

export type NexoraValidationSeverity = "error" | "warning";

export type NexoraValidationIssueCode =
  | "VALIDATION_MISSING_IDENTITY"
  | "VALIDATION_INVALID_IDENTITY"
  | "VALIDATION_DUPLICATE_ID"
  | "VALIDATION_INVALID_CONTRACT"
  | "VALIDATION_CONTRACT_ORDER"
  | "VALIDATION_RUNTIME_INVARIANT"
  | "VALIDATION_STATE_INVARIANT"
  | "VALIDATION_RELATIONSHIP_BROKEN"
  | "VALIDATION_GRAPH_CYCLE"
  | "VALIDATION_GRAPH_DUPLICATE_EDGE"
  | "VALIDATION_GRAPH_ORPHAN"
  | "VALIDATION_METADATA_RESERVED"
  | "VALIDATION_METADATA_INVALID"
  | "VALIDATION_VISUALIZATION_INVALID"
  | "VALIDATION_EXECUTIVE_RANGE"
  | "VALIDATION_KPI_INVALID"
  | "VALIDATION_SERIALIZATION_VERSION"
  | "VALIDATION_UNSUPPORTED_SCHEMA"
  | "VALIDATION_TIMELINE_INVALID"
  | "VALIDATION_KNOWLEDGE_INVALID"
  | "VALIDATION_COMPOSITE_INVALID"
  | "VALIDATION_POLICY_REJECTED";

export type NexoraValidationIssue = {
  readonly code: NexoraValidationIssueCode;
  readonly severity: NexoraValidationSeverity;
  readonly domain: NexoraValidationDomain;
  readonly message: string;
  readonly objectId?: string;
  readonly path?: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type NexoraValidationRepairSuggestion = {
  readonly suggestionId: string;
  readonly code: NexoraValidationIssueCode;
  readonly domain: NexoraValidationDomain;
  readonly message: string;
  readonly objectId?: string;
  readonly proposedAction: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type NexoraValidationEventType =
  | "ValidationStarted"
  | "ValidationCompleted"
  | "ValidationFailed"
  | "RepairSuggested";

export type NexoraValidationEvent = {
  readonly eventId: string;
  readonly type: NexoraValidationEventType;
  readonly occurredAt: string;
  readonly objectId?: string;
  readonly validationLevel: NexoraValidationLevel;
  readonly payload: Readonly<Record<string, unknown>>;
};

export type NexoraValidationOptions = {
  readonly detectCycles?: boolean;
  readonly rejectWarnings?: boolean;
  readonly graphId?: string;
  readonly serializationEnvelope?: Readonly<Record<string, unknown>>;
  readonly contractSectionOrder?: readonly string[];
  readonly metadataProperties?: Readonly<Record<string, unknown>>;
  readonly now?: () => string;
  readonly createEventId?: () => string;
  readonly createSuggestionId?: () => string;
};

export type NexoraObjectValidationRequest = {
  readonly object: unknown;
  readonly level?: NexoraValidationLevel;
  readonly domains?: readonly NexoraValidationDomain[];
  readonly options?: NexoraValidationOptions;
};

export type NexoraObjectValidationResult = {
  readonly valid: boolean;
  readonly score: number;
  readonly warnings: readonly NexoraValidationIssue[];
  readonly errors: readonly NexoraValidationIssue[];
  readonly checkedDomains: readonly NexoraValidationDomain[];
  readonly elapsedTimeMs: number;
  readonly validationLevel: NexoraValidationLevel;
  readonly validatorIdentity: typeof NOL_VALIDATION_IDENTITY;
  readonly repairSuggestions: readonly NexoraValidationRepairSuggestion[];
  readonly events: readonly NexoraValidationEvent[];
  readonly objectId?: string;
};

export type NexoraValidationReport = {
  readonly reportId: string;
  readonly summary: string;
  readonly score: number;
  readonly valid: boolean;
  readonly warnings: readonly NexoraValidationIssue[];
  readonly errors: readonly NexoraValidationIssue[];
  readonly repairSuggestions: readonly NexoraValidationRepairSuggestion[];
  readonly checkedDomains: readonly NexoraValidationDomain[];
  readonly elapsedTimeMs: number;
  readonly validationLevel: NexoraValidationLevel;
  readonly validatorIdentity: typeof NOL_VALIDATION_IDENTITY;
  readonly objectIds: readonly string[];
  readonly createdAt: string;
};

export type NexoraBatchValidationResult = {
  readonly valid: boolean;
  readonly score: number;
  readonly results: readonly NexoraObjectValidationResult[];
  readonly aggregateErrors: readonly NexoraValidationIssue[];
  readonly aggregateWarnings: readonly NexoraValidationIssue[];
  readonly repairSuggestions: readonly NexoraValidationRepairSuggestion[];
  readonly checkedDomains: readonly NexoraValidationDomain[];
  readonly elapsedTimeMs: number;
  readonly validationLevel: NexoraValidationLevel;
  readonly objectIds: readonly string[];
  readonly events: readonly NexoraValidationEvent[];
};

export type NexoraValidationProfile = {
  readonly level: NexoraValidationLevel;
  readonly domains: readonly NexoraValidationDomain[];
  readonly rejectWarnings: boolean;
  readonly detectCycles: boolean;
};

export type NexoraValidationPolicy = {
  readonly policyId: string;
  readonly level: NexoraValidationLevel;
  readonly evaluate: (result: NexoraObjectValidationResult) => {
    readonly allowed: boolean;
    readonly message?: string;
  };
};

// ─── Profiles ───────────────────────────────────────────────────────────────

const ALL_DOMAINS: readonly NexoraValidationDomain[] = Object.freeze([
  "Identity",
  "Contract",
  "Runtime",
  "State",
  "Relationship",
  "Visualization",
  "Timeline",
  "Knowledge",
  "Executive",
  "Metadata",
  "Serialization",
  "Graph",
  "Composite",
  "KPI",
]);

export const NEXORA_VALIDATION_PROFILES: Readonly<
  Record<NexoraValidationLevel, NexoraValidationProfile>
> = Object.freeze({
  Minimal: Object.freeze({
    level: "Minimal",
    domains: Object.freeze([
      "Identity",
      "Contract",
      "Runtime",
    ] as const),
    rejectWarnings: false,
    detectCycles: false,
  }),
  Standard: Object.freeze({
    level: "Standard",
    domains: Object.freeze([
      "Identity",
      "Contract",
      "Runtime",
      "State",
      "Relationship",
      "Visualization",
      "Executive",
      "Metadata",
      "KPI",
    ] as const),
    rejectWarnings: false,
    detectCycles: false,
  }),
  Strict: Object.freeze({
    level: "Strict",
    domains: Object.freeze([
      "Identity",
      "Contract",
      "Runtime",
      "State",
      "Relationship",
      "Visualization",
      "Timeline",
      "Knowledge",
      "Executive",
      "Metadata",
      "Serialization",
      "KPI",
      "Graph",
    ] as const),
    rejectWarnings: false,
    detectCycles: true,
  }),
  Certification: Object.freeze({
    level: "Certification",
    domains: Object.freeze([...ALL_DOMAINS]),
    rejectWarnings: true,
    detectCycles: true,
  }),
});

export const certificationValidationPolicy: NexoraValidationPolicy =
  Object.freeze({
    policyId: "certification-zero-tolerance",
    level: "Certification",
    evaluate: (result) => {
      if (result.errors.length > 0 || result.warnings.length > 0) {
        return Object.freeze({
          allowed: false,
          message: "Certification requires zero errors and zero warnings.",
        });
      }
      return Object.freeze({ allowed: true });
    },
  });

export const strictRejectWarningsPolicy: NexoraValidationPolicy = Object.freeze({
  policyId: "strict-reject-warnings",
  level: "Strict",
  evaluate: (result) => {
    if (result.warnings.length > 0) {
      return Object.freeze({
        allowed: false,
        message: "Strict reject-warnings policy forbids warnings.",
      });
    }
    return Object.freeze({ allowed: true });
  },
});

// ─── Internal helpers ───────────────────────────────────────────────────────

let defaultEventSeq = 0;
let defaultSuggestionSeq = 0;
let defaultReportSeq = 0;

export function resetNexoraValidationStoreForTests(): void {
  defaultEventSeq = 0;
  defaultSuggestionSeq = 0;
  defaultReportSeq = 0;
}

function issue(
  code: NexoraValidationIssueCode,
  severity: NexoraValidationSeverity,
  domain: NexoraValidationDomain,
  message: string,
  extras?: Partial<NexoraValidationIssue>,
): NexoraValidationIssue {
  return Object.freeze({ code, severity, domain, message, ...extras });
}

function repair(
  code: NexoraValidationIssueCode,
  domain: NexoraValidationDomain,
  message: string,
  proposedAction: string,
  suggestionId: string,
  extras?: Partial<NexoraValidationRepairSuggestion>,
): NexoraValidationRepairSuggestion {
  return Object.freeze({
    suggestionId,
    code,
    domain,
    message,
    proposedAction,
    ...extras,
  });
}

function asObject(
  value: unknown,
): ReadonlyNexoraObject | MutableNexoraObject | null {
  if (isNexoraObject(value)) return value;
  return null;
}

function objectIdOf(value: unknown): string | undefined {
  const object = asObject(value);
  if (object) return object.identity.id;
  if (value && typeof value === "object") {
    const id = (value as { identity?: { id?: string }; id?: string }).identity
      ?.id;
    if (typeof id === "string") return id;
    const bare = (value as { id?: string }).id;
    if (typeof bare === "string") return bare;
  }
  return undefined;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function inExecutiveRange(value: number): boolean {
  return (
    value >= NEXORA_OBJECT_EXECUTIVE_MIN && value <= NEXORA_OBJECT_EXECUTIVE_MAX
  );
}

function resolveDomains(
  level: NexoraValidationLevel,
  domains?: readonly NexoraValidationDomain[],
): readonly NexoraValidationDomain[] {
  if (domains && domains.length > 0) return Object.freeze([...domains]);
  return NEXORA_VALIDATION_PROFILES[level].domains;
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// ─── Domain validators ──────────────────────────────────────────────────────

function validateIdentityDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);

  if (!object) {
    const identity = (value as { identity?: Partial<Record<string, unknown>> })
      ?.identity;
    if (!identity || !String(identity.id ?? "").trim()) {
      errors.push(
        issue(
          "VALIDATION_MISSING_IDENTITY",
          "error",
          "Identity",
          "Object identity.id is required.",
          { objectId, path: "identity.id" },
        ),
      );
      return { errors, warnings, repairs };
    }
  }

  const identity = (object?.identity ??
    (value as { identity?: {
      id?: string;
      type?: string;
      caption?: string;
      owner?: string;
      version?: number;
      createdAt?: string;
      updatedAt?: string;
    } }).identity) as
    | {
        id?: string;
        type?: string;
        caption?: string;
        owner?: string;
        version?: number;
        createdAt?: string;
        updatedAt?: string;
      }
    | undefined;

  if (!identity?.id?.trim()) {
    errors.push(
      issue(
        "VALIDATION_MISSING_IDENTITY",
        "error",
        "Identity",
        "Object identity.id is required.",
        { objectId, path: "identity.id" },
      ),
    );
  }
  if (!identity?.type || !isNexoraObjectType(String(identity.type))) {
    errors.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "error",
        "Identity",
        "Object identity.type is invalid.",
        { objectId, path: "identity.type" },
      ),
    );
  }
  if (!identity?.caption?.trim()) {
    errors.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "error",
        "Identity",
        "Object identity.caption is required.",
        { objectId, path: "identity.caption" },
      ),
    );
  }
  if (!identity?.owner?.trim()) {
    errors.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "error",
        "Identity",
        "Object identity.owner is required.",
        { objectId, path: "identity.owner" },
      ),
    );
  }
  if (typeof identity?.version !== "number" || identity.version < 1) {
    errors.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "error",
        "Identity",
        "Object identity.version must be >= 1.",
        { objectId, path: "identity.version" },
      ),
    );
  }
  if (!identity?.createdAt || Number.isNaN(Date.parse(identity.createdAt))) {
    errors.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "error",
        "Identity",
        "Object identity.createdAt must be a valid ISO timestamp.",
        { objectId, path: "identity.createdAt" },
      ),
    );
  }
  if (
    identity?.updatedAt &&
    Number.isNaN(Date.parse(String(identity.updatedAt)))
  ) {
    warnings.push(
      issue(
        "VALIDATION_INVALID_IDENTITY",
        "warning",
        "Identity",
        "Object identity.updatedAt is not a valid ISO timestamp.",
        { objectId, path: "identity.updatedAt" },
      ),
    );
  }

  return { errors, warnings, repairs };
}

function validateContractDomain(
  value: unknown,
  objectId: string | undefined,
  options?: NexoraValidationOptions,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);

  const candidate = object
    ? {
        contractVersion: object.contractVersion,
        schemaVersion: object.schemaVersion,
        foundationVersion: object.foundationVersion,
        identity: object.identity,
        classification: object.classification,
        status: object.status,
        lifecycle: object.lifecycle,
        metadata: object.metadata,
        runtime: object.runtime,
        visualization: object.visualization,
        timeline: object.timeline,
        knowledge: object.knowledge,
        kpi: object.kpi,
        executive: object.executive,
        events: object.events,
      }
    : value;

  const result = validateNexoraObjectContract(candidate);
  if (!result.ok) {
    for (const err of result.errors) {
      errors.push(
        issue(
          "VALIDATION_INVALID_CONTRACT",
          "error",
          "Contract",
          err.message,
          { objectId, path: err.field, details: { code: err.code } },
        ),
      );
    }
  }

  const order = options?.contractSectionOrder;
  if (order) {
    const expected = [...NEXORA_OBJECT_CONTRACT_SECTIONS];
    const mismatch =
      order.length !== expected.length ||
      order.some((section, index) => section !== expected[index]);
    if (mismatch) {
      errors.push(
        issue(
          "VALIDATION_CONTRACT_ORDER",
          "error",
          "Contract",
          "Contract section ordering does not match the canonical contract order.",
          {
            objectId,
            path: "contract.sections",
            details: { expected, received: [...order] },
          },
        ),
      );
      repairs.push(
        repair(
          "VALIDATION_CONTRACT_ORDER",
          "Contract",
          "Contract sections are out of order.",
          "Reorder sections to match NEXORA_OBJECT_CONTRACT_SECTIONS.",
          `repair-contract-order-${objectId ?? "unknown"}`,
          { objectId },
        ),
      );
    }
  }

  return { errors, warnings, repairs };
}

function validateRuntimeDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) {
    errors.push(
      issue(
        "VALIDATION_RUNTIME_INVARIANT",
        "error",
        "Runtime",
        "Runtime validation requires a NexoraObject contract handle.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  // Delegate to NOL-1:3 — never reimplement interaction/execution rules.
  const runtime = getNexoraObjectRuntimeState(object);
  const result = validateNexoraObjectRuntimeState(runtime, object.lifecycle);
  if (!result.ok) {
    for (const message of result.errors) {
      errors.push(
        issue(
          "VALIDATION_RUNTIME_INVARIANT",
          "error",
          "Runtime",
          message,
          {
            objectId,
            details: {
              delegatedTo: "NOL-1:3",
              runtimeRevision: runtime.runtimeRevision,
            },
          },
        ),
      );
    }
  }
  return { errors, warnings, repairs };
}

function validateStateDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) {
    errors.push(
      issue(
        "VALIDATION_STATE_INVARIANT",
        "error",
        "State",
        "State validation requires a NexoraObject contract handle.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  // Delegate to NOL-1:4.
  const state = createNexoraObjectState(object);
  const result = validateNexoraObjectState(state);
  if (!result.ok) {
    for (const message of result.errors) {
      errors.push(
        issue(
          "VALIDATION_STATE_INVARIANT",
          "error",
          "State",
          message,
          {
            objectId,
            details: {
              delegatedTo: "NOL-1:4",
              stateRevision: state.stateRevision,
              lifecycle: state.lifecycle,
              status: state.status,
            },
          },
        ),
      );
    }
  }
  return { errors, warnings, repairs };
}

function validateRelationshipDomain(
  value: unknown,
  objectId: string | undefined,
  options?: NexoraValidationOptions,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) {
    return { errors, warnings, repairs };
  }

  const knownIds = new Set<string>([object.identity.id]);
  // Relationships on the object may point outside; broken refs are errors when
  // a graph context is not supplied. With graphId, delegate to graph projection.
  if (options?.graphId) {
    try {
      const projection = projectGraph(options.graphId);
      const nodeIds = new Set(projection.nodes.map((n) => n.objectId));
      const edgeIds = new Set<string>();
      for (const edge of projection.edges) {
        if (edgeIds.has(edge.edgeId)) {
          errors.push(
            issue(
              "VALIDATION_GRAPH_DUPLICATE_EDGE",
              "error",
              "Relationship",
              `Duplicate edge identity: ${edge.edgeId}`,
              {
                objectId,
                details: { delegatedTo: "NOL-1:5", edgeId: edge.edgeId },
              },
            ),
          );
          repairs.push(
            repair(
              "VALIDATION_GRAPH_DUPLICATE_EDGE",
              "Relationship",
              `Duplicate relationship ${edge.edgeId}.`,
              "Remove the duplicated edge from the graph.",
              `repair-dup-edge-${edge.edgeId}`,
              { objectId, details: { edgeId: edge.edgeId } },
            ),
          );
        }
        edgeIds.add(edge.edgeId);
        if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId)) {
          errors.push(
            issue(
              "VALIDATION_RELATIONSHIP_BROKEN",
              "error",
              "Relationship",
              `Broken relationship reference on edge ${edge.edgeId}.`,
              {
                objectId,
                details: {
                  delegatedTo: "NOL-1:5",
                  edgeId: edge.edgeId,
                  fromId: edge.fromId,
                  toId: edge.toId,
                },
              },
            ),
          );
          repairs.push(
            repair(
              "VALIDATION_RELATIONSHIP_BROKEN",
              "Relationship",
              `Edge ${edge.edgeId} references a missing node.`,
              "Remove the broken edge or add the missing node to the graph.",
              `repair-broken-${edge.edgeId}`,
              { objectId },
            ),
          );
        }
      }
      if (options.detectCycles) {
        const cycles = detectCycles(options.graphId);
        if (cycles.length > 0) {
          errors.push(
            issue(
              "VALIDATION_GRAPH_CYCLE",
              "error",
              "Relationship",
              `Graph contains ${cycles.length} cycle(s).`,
              {
                objectId,
                details: {
                  delegatedTo: "NOL-1:5",
                  cycles: cycles.map((c) => [...c]),
                },
              },
            ),
          );
          repairs.push(
            repair(
              "VALIDATION_GRAPH_CYCLE",
              "Relationship",
              "Cyclic dependency detected.",
              "Remove one edge from each cycle (see breakCycleProposal).",
              `repair-cycle-${options.graphId}`,
              { objectId },
            ),
          );
        }
      }
    } catch (cause) {
      errors.push(
        issue(
          "VALIDATION_RELATIONSHIP_BROKEN",
          "error",
          "Relationship",
          cause instanceof Error
            ? cause.message
            : "Graph relationship validation failed.",
          { objectId, details: { delegatedTo: "NOL-1:5" } },
        ),
      );
    }
    return { errors, warnings, repairs };
  }

  for (const rel of object.getRelationships()) {
    if (!rel.id?.trim() || !rel.toId?.trim() || !rel.fromId?.trim()) {
      errors.push(
        issue(
          "VALIDATION_RELATIONSHIP_BROKEN",
          "error",
          "Relationship",
          "Relationship is missing identity or endpoints.",
          { objectId, path: "relationships" },
        ),
      );
      continue;
    }
    // Without a graph, external toId is a warning (may exist elsewhere).
    if (rel.toId !== object.identity.id && !knownIds.has(rel.toId)) {
      warnings.push(
        issue(
          "VALIDATION_RELATIONSHIP_BROKEN",
          "warning",
          "Relationship",
          `Relationship ${rel.id} references external object ${rel.toId} outside the current validation scope.`,
          {
            objectId,
            details: { delegatedTo: "NOL-1:5", toId: rel.toId },
          },
        ),
      );
    }
  }

  return { errors, warnings, repairs };
}

function validateGraphDomain(
  value: unknown,
  objectId: string | undefined,
  options?: NexoraValidationOptions,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];

  if (!options?.graphId) {
    warnings.push(
      issue(
        "VALIDATION_GRAPH_ORPHAN",
        "warning",
        "Graph",
        "Graph domain requested without graphId; graph-wide checks skipped.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  try {
    getNexoraObjectGraph(options.graphId);
    const projection = projectGraph(options.graphId);
    const nodeIds = new Set(projection.nodes.map((n) => n.objectId));
    const referenced = new Set<string>();
    const edgeIds = new Set<string>();

    for (const edge of listRelationships(options.graphId)) {
      if (edgeIds.has(edge.edgeId)) {
        errors.push(
          issue(
            "VALIDATION_GRAPH_DUPLICATE_EDGE",
            "error",
            "Graph",
            `Duplicated edge identity: ${edge.edgeId}`,
            { objectId, details: { edgeId: edge.edgeId } },
          ),
        );
      }
      edgeIds.add(edge.edgeId);
      referenced.add(edge.fromId);
      referenced.add(edge.toId);
      if (!nodeIds.has(edge.fromId) || !nodeIds.has(edge.toId)) {
        errors.push(
          issue(
            "VALIDATION_RELATIONSHIP_BROKEN",
            "error",
            "Graph",
            `Invalid graph reference on edge ${edge.edgeId}.`,
            { objectId, details: { edgeId: edge.edgeId } },
          ),
        );
      }
    }

    for (const node of projection.nodes) {
      if (!referenced.has(node.objectId) && projection.nodes.length > 1) {
        warnings.push(
          issue(
            "VALIDATION_GRAPH_ORPHAN",
            "warning",
            "Graph",
            `Disconnected/orphan node: ${node.objectId}`,
            { objectId: node.objectId },
          ),
        );
      }
    }

    if (options.detectCycles) {
      const cycles = detectCycles(options.graphId);
      if (cycles.length > 0) {
        errors.push(
          issue(
            "VALIDATION_GRAPH_CYCLE",
            "error",
            "Graph",
            `Graph cycle(s) detected: ${cycles.length}`,
            {
              objectId,
              details: { cycles: cycles.map((c) => [...c]) },
            },
          ),
        );
      }
    }
  } catch (cause) {
    errors.push(
      issue(
        "VALIDATION_RELATIONSHIP_BROKEN",
        "error",
        "Graph",
        cause instanceof Error ? cause.message : "Graph validation failed.",
        { objectId },
      ),
    );
  }

  return { errors, warnings, repairs };
}

function validateMetadataDomain(
  value: unknown,
  objectId: string | undefined,
  options?: NexoraValidationOptions,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);

  const properties =
    options?.metadataProperties ??
    object?.metadata.properties ??
    (value as { metadata?: { properties?: Record<string, unknown> } })?.metadata
      ?.properties ??
    {};

  const attributes =
    object?.metadata.attributes ??
    (value as { metadata?: { attributes?: Record<string, unknown> } })?.metadata
      ?.attributes ??
    {};

  const customFields =
    object?.metadata.customFields ??
    (value as { metadata?: { customFields?: Record<string, unknown> } })
      ?.metadata?.customFields ??
    {};

  const keys = [
    ...Object.keys(properties),
    ...Object.keys(attributes),
    ...Object.keys(customFields),
  ];
  const seen = new Set<string>();
  for (const key of keys) {
    if ((RESERVED_METADATA_KEYS as readonly string[]).includes(key)) {
      errors.push(
        issue(
          "VALIDATION_METADATA_RESERVED",
          "error",
          "Metadata",
          `Metadata key “${key}” is reserved.`,
          { objectId, path: `metadata.${key}` },
        ),
      );
      repairs.push(
        repair(
          "VALIDATION_METADATA_RESERVED",
          "Metadata",
          `Reserved metadata key “${key}”.`,
          `Rename or remove metadata key “${key}”.`,
          `repair-meta-${key}`,
          { objectId },
        ),
      );
    }
    if (!/^[A-Za-z_][A-Za-z0-9_:-]*$/.test(key)) {
      errors.push(
        issue(
          "VALIDATION_METADATA_INVALID",
          "error",
          "Metadata",
          `Metadata key “${key}” has an invalid name.`,
          { objectId, path: `metadata.${key}` },
        ),
      );
    }
    if (seen.has(key)) {
      warnings.push(
        issue(
          "VALIDATION_METADATA_INVALID",
          "warning",
          "Metadata",
          `Duplicate metadata key “${key}” across facets.`,
          { objectId, path: `metadata.${key}` },
        ),
      );
    }
    seen.add(key);
  }

  for (const [key, val] of Object.entries(properties)) {
    const t = typeof val;
    if (
      val !== null &&
      t !== "string" &&
      t !== "number" &&
      t !== "boolean"
    ) {
      errors.push(
        issue(
          "VALIDATION_METADATA_INVALID",
          "error",
          "Metadata",
          `Unsupported metadata property type for “${key}”.`,
          { objectId, path: `metadata.properties.${key}` },
        ),
      );
    }
  }

  return { errors, warnings, repairs };
}

function validateVisualizationDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  const viz =
    object?.visualization ??
    ((value as { visualization?: NexoraObjectVisualizationState })
      .visualization as NexoraObjectVisualizationState | undefined);

  if (!viz) {
    errors.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "error",
        "Visualization",
        "Visualization facet is required.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  const checkVec = (
    name: "position" | "rotation" | "scale",
    vec: readonly number[],
  ) => {
    if (!Array.isArray(vec) || vec.length !== 3 || !vec.every(isFiniteNumber)) {
      errors.push(
        issue(
          "VALIDATION_VISUALIZATION_INVALID",
          "error",
          "Visualization",
          `Visualization.${name} must be a finite [x,y,z] vector.`,
          { objectId, path: `visualization.${name}` },
        ),
      );
      repairs.push(
        repair(
          "VALIDATION_VISUALIZATION_INVALID",
          "Visualization",
          `Invalid ${name} vector.`,
          `Replace ${name} with finite numeric triples.`,
          `repair-viz-${name}-${objectId ?? "unknown"}`,
          { objectId },
        ),
      );
    }
  };

  checkVec("position", viz.position);
  checkVec("rotation", viz.rotation);
  checkVec("scale", viz.scale);

  if (!isFiniteNumber(viz.opacity) || viz.opacity < 0 || viz.opacity > 1) {
    errors.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "error",
        "Visualization",
        "Visualization.opacity must be a finite number in [0, 1].",
        { objectId, path: "visualization.opacity" },
      ),
    );
  }
  if (!isFiniteNumber(viz.priority)) {
    errors.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "error",
        "Visualization",
        "Visualization.priority must be finite.",
        { objectId, path: "visualization.priority" },
      ),
    );
  }
  if (!isFiniteNumber(viz.cameraWeight)) {
    errors.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "error",
        "Visualization",
        "Visualization.cameraWeight must be finite.",
        { objectId, path: "visualization.cameraWeight" },
      ),
    );
  }
  if (!viz.animationState?.trim()) {
    warnings.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "warning",
        "Visualization",
        "Visualization.animationState is empty.",
        { objectId, path: "visualization.animationState" },
      ),
    );
  }
  if (!isNexoraObjectStatus(viz.colorState)) {
    errors.push(
      issue(
        "VALIDATION_VISUALIZATION_INVALID",
        "error",
        "Visualization",
        "Visualization.colorState is not a valid Seed status.",
        { objectId, path: "visualization.colorState" },
      ),
    );
  }

  return { errors, warnings, repairs };
}

function validateExecutiveDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  const executive = object?.executive;
  if (!executive) {
    errors.push(
      issue(
        "VALIDATION_EXECUTIVE_RANGE",
        "error",
        "Executive",
        "Executive facet is required.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  const fields: [string, number][] = [
    ["importance", executive.importance],
    ["urgency", executive.urgency],
    ["priority", executive.priority],
    ["attentionScore", executive.attentionScore],
    ["impactScore", executive.impactScore],
    ["confidence", executive.confidence],
  ];

  for (const [name, score] of fields) {
    if (!isFiniteNumber(score) || !inExecutiveRange(score)) {
      errors.push(
        issue(
          "VALIDATION_EXECUTIVE_RANGE",
          "error",
          "Executive",
          `Executive.${name} must be a finite number in [${NEXORA_OBJECT_EXECUTIVE_MIN}, ${NEXORA_OBJECT_EXECUTIVE_MAX}].`,
          { objectId, path: `executive.${name}`, details: { value: score } },
        ),
      );
      repairs.push(
        repair(
          "VALIDATION_EXECUTIVE_RANGE",
          "Executive",
          `Executive.${name} out of range.`,
          `Clamp ${name} to [${NEXORA_OBJECT_EXECUTIVE_MIN}, ${NEXORA_OBJECT_EXECUTIVE_MAX}].`,
          `repair-exec-${name}-${objectId ?? "unknown"}`,
          { objectId },
        ),
      );
    }
  }

  return { errors, warnings, repairs };
}

function validateKpiDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
  /** Captures original metrics to prove no recalculation. */
  readonly metricsSnapshot?: Readonly<Record<string, number>>;
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  const kpi: NexoraObjectKpiFacet | undefined =
    object?.kpi ??
    (value as { kpi?: NexoraObjectKpiFacet }).kpi;

  if (!kpi) {
    errors.push(
      issue(
        "VALIDATION_KPI_INVALID",
        "error",
        "KPI",
        "KPI facet is required.",
        { objectId },
      ),
    );
    return { errors, warnings, repairs };
  }

  const metricsSnapshot = Object.freeze({ ...kpi.metrics });

  for (const [key, metric] of Object.entries(kpi.metrics)) {
    if (!isFiniteNumber(metric)) {
      errors.push(
        issue(
          "VALIDATION_KPI_INVALID",
          "error",
          "KPI",
          `KPI metric “${key}” must be a finite number.`,
          { objectId, path: `kpi.metrics.${key}` },
        ),
      );
    }
  }
  for (const [key, threshold] of Object.entries(kpi.thresholds)) {
    if (!isFiniteNumber(threshold)) {
      errors.push(
        issue(
          "VALIDATION_KPI_INVALID",
          "error",
          "KPI",
          `KPI threshold “${key}” must be a finite number.`,
          { objectId, path: `kpi.thresholds.${key}` },
        ),
      );
    }
  }
  if (kpi.healthScore !== null && !isFiniteNumber(kpi.healthScore)) {
    errors.push(
      issue(
        "VALIDATION_KPI_INVALID",
        "error",
        "KPI",
        "KPI healthScore must be finite or null.",
        { objectId, path: "kpi.healthScore" },
      ),
    );
  }
  if (kpi.confidence !== null && !isFiniteNumber(kpi.confidence)) {
    errors.push(
      issue(
        "VALIDATION_KPI_INVALID",
        "error",
        "KPI",
        "KPI confidence must be finite or null.",
        { objectId, path: "kpi.confidence" },
      ),
    );
  }
  if (!Array.isArray(kpi.kpis) || !Array.isArray(kpi.kois)) {
    errors.push(
      issue(
        "VALIDATION_KPI_INVALID",
        "error",
        "KPI",
        "KPI kpis/kois must be arrays.",
        { objectId },
      ),
    );
  }

  // Never calculate — only validate existing values.
  return { errors, warnings, repairs, metricsSnapshot };
}

function validateSerializationDomain(
  value: unknown,
  objectId: string | undefined,
  options?: NexoraValidationOptions,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  const envelope = options?.serializationEnvelope;

  if (object) {
    if (object.contractVersion !== NOL_CONTRACT_VERSION) {
      errors.push(
        issue(
          "VALIDATION_SERIALIZATION_VERSION",
          "error",
          "Serialization",
          `Unsupported contract version: ${object.contractVersion}`,
          { objectId, path: "contractVersion" },
        ),
      );
    }
    if (object.schemaVersion !== NOL_SCHEMA_VERSION) {
      errors.push(
        issue(
          "VALIDATION_SERIALIZATION_VERSION",
          "error",
          "Serialization",
          `Unsupported schema version: ${object.schemaVersion}`,
          { objectId, path: "schemaVersion" },
        ),
      );
    }
    if (object.foundationVersion !== NOL_FOUNDATION_VERSION) {
      warnings.push(
        issue(
          "VALIDATION_SERIALIZATION_VERSION",
          "warning",
          "Serialization",
          `Foundation version mismatch: ${object.foundationVersion}`,
          { objectId, path: "foundationVersion" },
        ),
      );
    }
  }

  if (envelope) {
    const checks: [string, string | undefined, string][] = [
      ["schemaVersion", String(envelope.schemaVersion ?? ""), NOL_SCHEMA_VERSION],
      [
        "runtimeSchemaVersion",
        envelope.runtimeSchemaVersion != null
          ? String(envelope.runtimeSchemaVersion)
          : undefined,
        NOL_RUNTIME_SCHEMA_VERSION,
      ],
      [
        "stateSchemaVersion",
        envelope.stateSchemaVersion != null
          ? String(envelope.stateSchemaVersion)
          : undefined,
        NOL_STE_STATE_SCHEMA_VERSION,
      ],
      [
        "graphSchemaVersion",
        envelope.graphSchemaVersion != null
          ? String(envelope.graphSchemaVersion)
          : undefined,
        NOL_RELATIONSHIP_SCHEMA_VERSION,
      ],
      [
        "validationSchemaVersion",
        envelope.validationSchemaVersion != null
          ? String(envelope.validationSchemaVersion)
          : undefined,
        NOL_VALIDATION_SCHEMA_VERSION,
      ],
    ];

    for (const [path, received, expected] of checks) {
      if (received === undefined) continue;
      if (received !== expected) {
        errors.push(
          issue(
            received === "" || received === "undefined"
              ? "VALIDATION_UNSUPPORTED_SCHEMA"
              : "VALIDATION_SERIALIZATION_VERSION",
            "error",
            "Serialization",
            `Unsupported ${path}: ${received} (expected ${expected}).`,
            { objectId, path, details: { expected, received } },
          ),
        );
        repairs.push(
          repair(
            "VALIDATION_SERIALIZATION_VERSION",
            "Serialization",
            `Version mismatch on ${path}.`,
            `Re-serialize with ${path}=${expected}.`,
            `repair-ser-${path}`,
            { objectId },
          ),
        );
      }
    }
  }

  return { errors, warnings, repairs };
}

function validateTimelineDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) return { errors, warnings, repairs };

  if (
    object.lifecycle === "Created" &&
    object.timeline.history.length > 0
  ) {
    errors.push(
      issue(
        "VALIDATION_TIMELINE_INVALID",
        "error",
        "Timeline",
        "Created objects must not accumulate timeline history.",
        { objectId, path: "timeline.history" },
      ),
    );
  }
  if (
    object.timeline.replayPosition !== null &&
    !isFiniteNumber(object.timeline.replayPosition)
  ) {
    errors.push(
      issue(
        "VALIDATION_TIMELINE_INVALID",
        "error",
        "Timeline",
        "timeline.replayPosition must be finite or null.",
        { objectId, path: "timeline.replayPosition" },
      ),
    );
  }
  return { errors, warnings, repairs };
}

function validateKnowledgeDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) return { errors, warnings, repairs };

  const facets = [
    "facts",
    "assumptions",
    "insights",
    "recommendations",
    "risks",
    "evidence",
  ] as const;
  for (const facet of facets) {
    if (!Array.isArray(object.knowledge[facet])) {
      errors.push(
        issue(
          "VALIDATION_KNOWLEDGE_INVALID",
          "error",
          "Knowledge",
          `knowledge.${facet} must be an array.`,
          { objectId, path: `knowledge.${facet}` },
        ),
      );
    }
  }
  return { errors, warnings, repairs };
}

function validateCompositeDomain(
  value: unknown,
  objectId: string | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
} {
  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const object = asObject(value);
  if (!object) return { errors, warnings, repairs };

  if (!isNexoraObjectLifecycle(object.lifecycle)) {
    errors.push(
      issue(
        "VALIDATION_COMPOSITE_INVALID",
        "error",
        "Composite",
        "Composite validation found invalid lifecycle.",
        { objectId },
      ),
    );
  }
  if (!isNexoraObjectStatus(object.status)) {
    errors.push(
      issue(
        "VALIDATION_COMPOSITE_INVALID",
        "error",
        "Composite",
        "Composite validation found invalid status.",
        { objectId },
      ),
    );
  }
  if (
    object.lifecycle === "Deleted" &&
    (!object.runtime.locked || object.runtime.selected || object.runtime.focused)
  ) {
    warnings.push(
      issue(
        "VALIDATION_COMPOSITE_INVALID",
        "warning",
        "Composite",
        "Deleted object runtime flags are inconsistent with lifecycle expectations.",
        { objectId },
      ),
    );
  }
  return { errors, warnings, repairs };
}

// ─── Integrity score ────────────────────────────────────────────────────────

export function calculateIntegrityScore(input: {
  readonly checkedDomains: readonly NexoraValidationDomain[];
  readonly errors: readonly NexoraValidationIssue[];
  readonly warnings: readonly NexoraValidationIssue[];
}): number {
  const domains = input.checkedDomains.length || 1;
  const errorsByDomain = new Map<NexoraValidationDomain, number>();
  const warningsByDomain = new Map<NexoraValidationDomain, number>();

  for (const domain of input.checkedDomains) {
    errorsByDomain.set(domain, 0);
    warningsByDomain.set(domain, 0);
  }
  for (const err of input.errors) {
    errorsByDomain.set(err.domain, (errorsByDomain.get(err.domain) ?? 0) + 1);
  }
  for (const warn of input.warnings) {
    warningsByDomain.set(
      warn.domain,
      (warningsByDomain.get(warn.domain) ?? 0) + 1,
    );
  }

  let total = 0;
  for (const domain of input.checkedDomains) {
    const errorCount = errorsByDomain.get(domain) ?? 0;
    const warningCount = warningsByDomain.get(domain) ?? 0;
    let domainScore = 100;
    domainScore -= Math.min(100, errorCount * 35);
    domainScore -= Math.min(40, warningCount * 8);
    total += Math.max(0, domainScore);
  }

  return clampScore(total / domains);
}

// ─── Core validate ──────────────────────────────────────────────────────────

function runDomain(
  domain: NexoraValidationDomain,
  value: unknown,
  objectId: string | undefined,
  options: NexoraValidationOptions | undefined,
): {
  readonly errors: NexoraValidationIssue[];
  readonly warnings: NexoraValidationIssue[];
  readonly repairs: NexoraValidationRepairSuggestion[];
  readonly metricsSnapshot?: Readonly<Record<string, number>>;
} {
  switch (domain) {
    case "Identity":
      return validateIdentityDomain(value, objectId);
    case "Contract":
      return validateContractDomain(value, objectId, options);
    case "Runtime":
      return validateRuntimeDomain(value, objectId);
    case "State":
      return validateStateDomain(value, objectId);
    case "Relationship":
      return validateRelationshipDomain(value, objectId, options);
    case "Graph":
      return validateGraphDomain(value, objectId, options);
    case "Visualization":
      return validateVisualizationDomain(value, objectId);
    case "Executive":
      return validateExecutiveDomain(value, objectId);
    case "Metadata":
      return validateMetadataDomain(value, objectId, options);
    case "KPI":
      return validateKpiDomain(value, objectId);
    case "Serialization":
      return validateSerializationDomain(value, objectId, options);
    case "Timeline":
      return validateTimelineDomain(value, objectId);
    case "Knowledge":
      return validateKnowledgeDomain(value, objectId);
    case "Composite":
      return validateCompositeDomain(value, objectId);
    default: {
      const _exhaustive: never = domain;
      void _exhaustive;
      return { errors: [], warnings: [], repairs: [] };
    }
  }
}

export function validateNexoraObject(
  request: NexoraObjectValidationRequest,
): NexoraObjectValidationResult {
  const started = Date.now();
  const level = request.level ?? "Standard";
  const profile = NEXORA_VALIDATION_PROFILES[level];
  const options: NexoraValidationOptions = {
    detectCycles: request.options?.detectCycles ?? profile.detectCycles,
    rejectWarnings: request.options?.rejectWarnings ?? profile.rejectWarnings,
    graphId: request.options?.graphId,
    serializationEnvelope: request.options?.serializationEnvelope,
    contractSectionOrder: request.options?.contractSectionOrder,
    metadataProperties: request.options?.metadataProperties,
    now: request.options?.now ?? (() => new Date().toISOString()),
    createEventId:
      request.options?.createEventId ??
      (() => {
        defaultEventSeq += 1;
        return `nval-evt-${defaultEventSeq}`;
      }),
    createSuggestionId:
      request.options?.createSuggestionId ??
      (() => {
        defaultSuggestionSeq += 1;
        return `nval-fix-${defaultSuggestionSeq}`;
      }),
  };

  const domains = resolveDomains(level, request.domains);
  const objectId = objectIdOf(request.object);
  const events: NexoraValidationEvent[] = [
    Object.freeze({
      eventId: options.createEventId!(),
      type: "ValidationStarted",
      occurredAt: options.now!(),
      objectId,
      validationLevel: level,
      payload: Object.freeze({ domains: [...domains] }),
    }),
  ];

  const errors: NexoraValidationIssue[] = [];
  const warnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];

  for (const domain of domains) {
    const result = runDomain(domain, request.object, objectId, options);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    for (const suggestion of result.repairs) {
      repairs.push(suggestion);
      events.push(
        Object.freeze({
          eventId: options.createEventId!(),
          type: "RepairSuggested",
          occurredAt: options.now!(),
          objectId,
          validationLevel: level,
          payload: Object.freeze({
            suggestionId: suggestion.suggestionId,
            code: suggestion.code,
            proposedAction: suggestion.proposedAction,
          }),
        }),
      );
    }
  }

  let score = calculateIntegrityScore({
    checkedDomains: domains,
    errors,
    warnings,
  });

  let valid = errors.length === 0;
  if (options.rejectWarnings && warnings.length > 0) {
    valid = false;
    errors.push(
      issue(
        "VALIDATION_POLICY_REJECTED",
        "error",
        "Composite",
        "Validation policy rejects warnings at this level.",
        {
          objectId,
          details: { level, warningCount: warnings.length },
        },
      ),
    );
    score = calculateIntegrityScore({
      checkedDomains: domains,
      errors,
      warnings,
    });
  }

  if (level === "Certification") {
    const policy = certificationValidationPolicy.evaluate({
      valid,
      score,
      warnings: Object.freeze(warnings),
      errors: Object.freeze(errors.filter((e) => e.code !== "VALIDATION_POLICY_REJECTED")),
      checkedDomains: domains,
      elapsedTimeMs: 0,
      validationLevel: level,
      validatorIdentity: NOL_VALIDATION_IDENTITY,
      repairSuggestions: Object.freeze(repairs),
      events: Object.freeze([]),
      objectId,
    });
    if (!policy.allowed) {
      valid = false;
      if (!errors.some((e) => e.code === "VALIDATION_POLICY_REJECTED")) {
        errors.push(
          issue(
            "VALIDATION_POLICY_REJECTED",
            "error",
            "Composite",
            policy.message ?? "Certification policy rejected the object.",
            { objectId },
          ),
        );
      }
      score = calculateIntegrityScore({
        checkedDomains: domains,
        errors,
        warnings,
      });
    }
  }

  events.push(
    Object.freeze({
      eventId: options.createEventId!(),
      type: valid ? "ValidationCompleted" : "ValidationFailed",
      occurredAt: options.now!(),
      objectId,
      validationLevel: level,
      payload: Object.freeze({
        valid,
        score,
        errorCount: errors.length,
        warningCount: warnings.length,
      }),
    }),
  );

  return Object.freeze({
    valid,
    score,
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze([...errors]),
    checkedDomains: Object.freeze([...domains]),
    elapsedTimeMs: Math.max(0, Date.now() - started),
    validationLevel: level,
    validatorIdentity: NOL_VALIDATION_IDENTITY,
    repairSuggestions: Object.freeze([...repairs]),
    events: Object.freeze(events),
    objectId,
  });
}

export function validateNexoraObjects(
  objects: readonly unknown[],
  options?: {
    readonly level?: NexoraValidationLevel;
    readonly domains?: readonly NexoraValidationDomain[];
    readonly options?: NexoraValidationOptions;
  },
): NexoraBatchValidationResult {
  const started = Date.now();
  const level = options?.level ?? "Standard";
  const results: NexoraObjectValidationResult[] = [];
  const aggregateErrors: NexoraValidationIssue[] = [];
  const aggregateWarnings: NexoraValidationIssue[] = [];
  const repairs: NexoraValidationRepairSuggestion[] = [];
  const events: NexoraValidationEvent[] = [];
  const objectIds: string[] = [];
  const seen = new Map<string, number>();

  // Deterministic ordering: stable input order.
  objects.forEach((object, index) => {
    const id = objectIdOf(object) ?? `__anonymous_${index}`;
    objectIds.push(id);
    const prior = seen.get(id);
    if (prior !== undefined && !id.startsWith("__anonymous_")) {
      aggregateErrors.push(
        issue(
          "VALIDATION_DUPLICATE_ID",
          "error",
          "Identity",
          `Duplicate object id “${id}” in batch (indexes ${prior} and ${index}).`,
          { objectId: id, details: { firstIndex: prior, secondIndex: index } },
        ),
      );
      repairs.push(
        repair(
          "VALIDATION_DUPLICATE_ID",
          "Identity",
          `Duplicate id ${id}.`,
          "Ensure each object in the batch has a unique identity.id.",
          `repair-dup-id-${id}-${index}`,
          { objectId: id },
        ),
      );
    } else {
      seen.set(id, index);
    }

    const result = validateNexoraObject({
      object,
      level,
      domains: options?.domains,
      options: options?.options,
    });
    results.push(result);
    aggregateErrors.push(...result.errors);
    aggregateWarnings.push(...result.warnings);
    repairs.push(...result.repairSuggestions);
    events.push(...result.events);
  });

  const checkedDomains = resolveDomains(level, options?.domains);
  const score = calculateIntegrityScore({
    checkedDomains,
    errors: aggregateErrors,
    warnings: aggregateWarnings,
  });
  const valid =
    aggregateErrors.length === 0 &&
    !(
      (options?.options?.rejectWarnings ??
        NEXORA_VALIDATION_PROFILES[level].rejectWarnings) &&
      aggregateWarnings.length > 0
    );

  return Object.freeze({
    valid,
    score,
    results: Object.freeze(results),
    aggregateErrors: Object.freeze(aggregateErrors),
    aggregateWarnings: Object.freeze(aggregateWarnings),
    repairSuggestions: Object.freeze(repairs),
    checkedDomains: Object.freeze([...checkedDomains]),
    elapsedTimeMs: Math.max(0, Date.now() - started),
    validationLevel: level,
    objectIds: Object.freeze(objectIds),
    events: Object.freeze(events),
  });
}

// ─── Domain convenience APIs ────────────────────────────────────────────────

function domainOnly(
  domain: NexoraValidationDomain,
  object: unknown,
  options?: NexoraValidationOptions,
): NexoraObjectValidationResult {
  return validateNexoraObject({
    object,
    level: "Standard",
    domains: [domain],
    options,
  });
}

export function validateIdentity(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Identity", object, options);
}

export function validateContract(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Contract", object, options);
}

export function validateRuntime(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Runtime", object, options);
}

export function validateState(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("State", object, options);
}

export function validateRelationships(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Relationship", object, options);
}

export function validateGraph(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Graph", object, options);
}

export function validateExecutive(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Executive", object, options);
}

export function validateVisualization(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Visualization", object, options);
}

export function validateMetadata(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Metadata", object, options);
}

export function validateSerialization(
  object: unknown,
  options?: NexoraValidationOptions,
) {
  return domainOnly("Serialization", object, options);
}

export function suggestRepairs(
  request: NexoraObjectValidationRequest,
): readonly NexoraValidationRepairSuggestion[] {
  return validateNexoraObject(request).repairSuggestions;
}

export function createValidationReport(
  result: NexoraObjectValidationResult | NexoraBatchValidationResult,
  reportId?: string,
): NexoraValidationReport {
  defaultReportSeq += 1;
  const id = reportId?.trim() || `nval-report-${defaultReportSeq}`;
  const isBatch = "results" in result;
  const objectIds = isBatch
    ? result.objectIds
    : Object.freeze(result.objectId ? [result.objectId] : []);
  const errors = isBatch ? result.aggregateErrors : result.errors;
  const warnings = isBatch ? result.aggregateWarnings : result.warnings;

  return Object.freeze({
    reportId: id,
    summary: result.valid
      ? `Validation passed with score ${result.score}.`
      : `Validation failed with score ${result.score} (${errors.length} error(s), ${warnings.length} warning(s)).`,
    score: result.score,
    valid: result.valid,
    warnings: Object.freeze([...warnings]),
    errors: Object.freeze([...errors]),
    repairSuggestions: Object.freeze([...result.repairSuggestions]),
    checkedDomains: Object.freeze([...result.checkedDomains]),
    elapsedTimeMs: result.elapsedTimeMs,
    validationLevel: result.validationLevel,
    validatorIdentity: NOL_VALIDATION_IDENTITY,
    objectIds: Object.freeze([...objectIds]),
    createdAt: new Date().toISOString(),
  });
}

export function getNexoraObjectValidationEngineSummary() {
  return Object.freeze({
    identity: NOL_VALIDATION_IDENTITY,
    engineVersion: NOL_VALIDATION_ENGINE_VERSION,
    schemaVersion: NOL_VALIDATION_SCHEMA_VERSION,
    upstream: NOL_VALIDATION_UPSTREAM,
    levels: Object.freeze([
      "Minimal",
      "Standard",
      "Strict",
      "Certification",
    ] as const),
    domainCount: ALL_DOMAINS.length,
    sideEffectFree: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectValidationIntegrityEngine = Object.freeze({
  identity: NOL_VALIDATION_IDENTITY,
  engineVersion: NOL_VALIDATION_ENGINE_VERSION,
  schemaVersion: NOL_VALIDATION_SCHEMA_VERSION,
  tags: NOL_VALIDATION_TAGS,
  profiles: NEXORA_VALIDATION_PROFILES,
  validate: validateNexoraObject,
  validateMany: validateNexoraObjects,
  calculateIntegrityScore,
  createValidationReport,
  suggestRepairs,
  summary: getNexoraObjectValidationEngineSummary,
});
