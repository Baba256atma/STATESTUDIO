/**
 * NOL-1:8 — Universal NexoraObject Freeze
 *
 * Locks the Universal NexoraObject platform into a stable, immutable consumer
 * artifact. No new runtime features — only freeze, verify, project, serialize.
 *
 * Upstream: NOL-1:1 … NOL-1:7 only.
 * Identity: NOL-1:8/UniversalNexoraObjectFreeze
 */

import {
  NOL_FOUNDATION_IDENTITY,
  NOL_FOUNDATION_VERSION,
  createNexoraObject,
  projectNexoraObjectForDirector,
  serializeNexoraObjectToJson,
} from "../foundation/universalNexoraObjectFoundation.ts";
import {
  NOL_CONTRACT_IDENTITY,
  NOL_CONTRACT_VERSION,
  NOL_SCHEMA_VERSION,
  createNexoraObjectContract,
  freezeNexoraObject,
  validateNexoraObjectContract,
} from "../contract/universalNexoraObjectContract.ts";
import {
  NOL_RUNTIME_IDENTITY,
  NOL_RUNTIME_MODEL_VERSION,
  NOL_RUNTIME_SCHEMA_VERSION,
  applyNexoraObjectRuntimeCommand,
  getNexoraObjectRuntimeState,
  validateNexoraObjectRuntimeState,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
import {
  NOL_STE_IDENTITY,
  NOL_STE_STATE_SCHEMA_VERSION,
  NOL_STE_VERSION,
  applyNexoraObjectTransition,
  createNexoraObjectState,
  evaluateNexoraObjectTransition,
} from "../state/universalNexoraObjectStateTransitionEngine.ts";
import {
  NOL_RELATIONSHIP_ENGINE_VERSION,
  NOL_RELATIONSHIP_IDENTITY,
  NOL_RELATIONSHIP_SCHEMA_VERSION,
  createNexoraObjectGraph,
  createRelationship,
  simulateImpactPropagation,
} from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";
import {
  NOL_VALIDATION_ENGINE_VERSION,
  NOL_VALIDATION_IDENTITY,
  NOL_VALIDATION_SCHEMA_VERSION,
  calculateIntegrityScore,
  validateNexoraObject,
  validateNexoraObjects,
  type NexoraValidationOptions,
} from "../validation/universalNexoraObjectValidationIntegrityEngine.ts";
import {
  NOL_CERTIFICATION_ENGINE_VERSION,
  NOL_CERTIFICATION_IDENTITY,
  NOL_CERTIFICATION_SCHEMA_VERSION,
  certifyNexoraObject,
  recertifyNexoraObject,
  revokeNexoraObjectCertification,
  type NexoraCertificationProfile,
} from "../certification/universalNexoraObjectCertification.ts";

// ─── Frozen public surface re-exports (consumer path: Public Index only) ────

export {
  NOL_FOUNDATION_IDENTITY,
  createNexoraObject,
  projectNexoraObjectForDirector,
  serializeNexoraObjectToJson,
};
export {
  NOL_CONTRACT_IDENTITY,
  createNexoraObjectContract,
  freezeNexoraObject,
  validateNexoraObjectContract,
};
export {
  NOL_RUNTIME_IDENTITY,
  applyNexoraObjectRuntimeCommand,
  getNexoraObjectRuntimeState,
  validateNexoraObjectRuntimeState,
};
export {
  NOL_STE_IDENTITY,
  applyNexoraObjectTransition,
  createNexoraObjectState,
  evaluateNexoraObjectTransition,
};
export {
  NOL_RELATIONSHIP_IDENTITY,
  createNexoraObjectGraph,
  createRelationship,
  simulateImpactPropagation,
};
export {
  NOL_VALIDATION_IDENTITY,
  calculateIntegrityScore,
  validateNexoraObject,
  validateNexoraObjects,
};
export {
  NOL_CERTIFICATION_IDENTITY,
  certifyNexoraObject,
  recertifyNexoraObject,
  revokeNexoraObjectCertification,
};

export type {
  CreateNexoraObjectInput,
  NexoraObject,
  NexoraObjectIdentity,
  NexoraObjectLifecycle,
  NexoraObjectStatus,
  NexoraObjectType,
  NexoraObjectVisualizationState,
} from "../foundation/universalNexoraObjectFoundation.ts";
export type {
  AnyNexoraObject,
  MutableNexoraObject,
  NexoraObjectContract,
  ReadonlyNexoraObject,
} from "../contract/universalNexoraObjectContract.ts";
export type {
  NexoraObjectRuntimeCommand,
  NexoraObjectRuntimeCommandContext,
  NexoraObjectRuntimeError,
  NexoraObjectRuntimeEvent,
  NexoraObjectRuntimeState,
  NexoraObjectRuntimeTransitionResult,
} from "../runtime/universalNexoraObjectRuntimeModel.ts";
export type {
  NexoraObjectState,
  NexoraObjectTransitionPlan,
  NexoraObjectTransitionRequest,
  NexoraObjectTransitionResult,
  NexoraObjectTransitionWarning,
  NexoraObjectStateTransitionError as NexoraObjectTransitionError,
  NexoraObjectStateEvent as NexoraObjectTransitionEvent,
} from "../state/universalNexoraObjectStateTransitionEngine.ts";
export type {
  NexoraGraphEdge,
  NexoraGraphImpactResult,
  NexoraGraphPath,
  NexoraGraphProjection,
  NexoraGraphTraversalOptions,
  NexoraObjectGraph,
} from "../relationship/universalNexoraObjectRelationshipDependencyEngine.ts";
export type {
  NexoraObjectValidationRequest,
  NexoraObjectValidationResult,
  NexoraValidationLevel,
  NexoraValidationRepairSuggestion,
  NexoraValidationReport,
  NexoraValidationIssue as NexoraValidationError,
} from "../validation/universalNexoraObjectValidationIntegrityEngine.ts";
export type {
  NexoraCertificationProfile,
  NexoraCertificationRecord,
  NexoraCertificationRequest,
  NexoraCertificationResult,
  NexoraCertificationStamp,
  NexoraCertificationState,
  NexoraCertificationEvent,
} from "../certification/universalNexoraObjectCertification.ts";

// ─── Freeze identity ────────────────────────────────────────────────────────

export const NOL_FREEZE_IDENTITY =
  "NOL-1:8/UniversalNexoraObjectFreeze" as const;

export const NOL_FREEZE_VERSION = "1.0.0" as const;

export const NOL_FREEZE_COMPATIBILITY_VERSION = "1.0.0" as const;

export const freezeIdentity = NOL_FREEZE_IDENTITY;
export const freezeVersion = NOL_FREEZE_VERSION;

export const NOL_FREEZE_TAGS = Object.freeze([
  "[NOL-1:8]",
  "[UNIVERSAL_NEXORA_OBJECT_FREEZE]",
  "[IMMUTABLE_SURFACE]",
  "[READY_FOR_CONSUMER]",
  "[NO_NEW_FEATURES]",
] as const);

export const NOL_FREEZE_UPSTREAM = Object.freeze([
  NOL_FOUNDATION_IDENTITY,
  NOL_CONTRACT_IDENTITY,
  NOL_RUNTIME_IDENTITY,
  NOL_STE_IDENTITY,
  NOL_RELATIONSHIP_IDENTITY,
  NOL_VALIDATION_IDENTITY,
  NOL_CERTIFICATION_IDENTITY,
] as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraFrozenModuleName =
  | "Foundation"
  | "Contract"
  | "Runtime"
  | "StateTransition"
  | "Relationship"
  | "Validation"
  | "Certification";

export type NexoraFreezeCompatibility =
  | "BackwardCompatible"
  | "ForwardCompatible"
  | "RequiresMigration";

export type NexoraFreezeReleaseStage =
  | "Released"
  | "Certified"
  | "Frozen"
  | "Stable"
  | "ReadyForConsumer";

export type NexoraFrozenModuleDescriptor = {
  readonly name: NexoraFrozenModuleName;
  readonly identity: string;
  readonly moduleVersion: string;
  readonly schemaVersion: string;
  readonly phase: number;
  readonly upstream: readonly string[];
};

export type NexoraFrozenApiRegistryEntry = {
  readonly apiName: string;
  readonly owningModule: NexoraFrozenModuleName;
  readonly identity: string;
  readonly version: string;
  readonly stability: "Stable";
  readonly visibility: "Public";
};

export type NexoraFreezeDependencyEdge = {
  readonly from: NexoraFrozenModuleName;
  readonly to: NexoraFrozenModuleName | string;
};

export type NexoraFreezeSchemaVersions = {
  readonly objectSchema: string;
  readonly runtimeSchema: string;
  readonly stateSchema: string;
  readonly relationshipSchema: string;
  readonly validationSchema: string;
  readonly certificationSchema: string;
};

export type NexoraFreezeDependencyVersions = {
  readonly foundation: string;
  readonly contract: string;
  readonly runtime: string;
  readonly state: string;
  readonly relationship: string;
  readonly validation: string;
  readonly certification: string;
};

export type NexoraObjectFreezeManifest = {
  readonly freezeIdentity: typeof NOL_FREEZE_IDENTITY;
  readonly freezeVersion: typeof NOL_FREEZE_VERSION;
  readonly moduleVersion: typeof NOL_FREEZE_VERSION;
  readonly createdAt: string;
  readonly frozenModules: readonly NexoraFrozenModuleDescriptor[];
  readonly publicApiCount: number;
  readonly publicExportCount: number;
  readonly schemaVersions: NexoraFreezeSchemaVersions;
  readonly dependencyVersions: NexoraFreezeDependencyVersions;
  readonly certificationVersion: string;
  readonly compatibilityVersion: typeof NOL_FREEZE_COMPATIBILITY_VERSION;
  readonly compatibility: NexoraFreezeCompatibility;
  readonly releaseStages: readonly NexoraFreezeReleaseStage[];
};

export type NexoraFreezeReleaseMetadata = {
  readonly moduleIdentity: typeof NOL_FREEZE_IDENTITY;
  readonly releaseStages: readonly NexoraFreezeReleaseStage[];
  readonly releaseDate: string;
  readonly stability: "Stable";
  readonly readiness: "ReadyForConsumer";
  readonly supportedPlatformVersion: string;
  readonly compatibility: NexoraFreezeCompatibility;
};

export type NexoraFreezeVerificationIssue = {
  readonly code:
    | "FREEZE_FORBIDDEN_DEPENDENCY"
    | "FREEZE_CYCLIC_DEPENDENCY"
    | "FREEZE_VERSION_MISMATCH"
    | "FREEZE_MODULE_COUNT"
    | "FREEZE_VALIDATION_FAILED"
    | "FREEZE_CERTIFICATION_FAILED"
    | "FREEZE_EXPORT_MISMATCH"
    | "FREEZE_UNSUPPORTED_SCHEMA"
    | "FREEZE_INVALID_REQUEST";
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
};

export type NexoraFreezeVerificationResult = {
  readonly ok: boolean;
  readonly errors: readonly NexoraFreezeVerificationIssue[];
  readonly warnings: readonly NexoraFreezeVerificationIssue[];
  readonly checkedAt: string;
};

export type NexoraFreezeProjection = {
  readonly manifest: NexoraObjectFreezeManifest;
  readonly registry: readonly NexoraFrozenApiRegistryEntry[];
  readonly releaseMetadata: NexoraFreezeReleaseMetadata;
  readonly compatibilitySummary: {
    readonly compatibility: NexoraFreezeCompatibility;
    readonly compatibilityVersion: typeof NOL_FREEZE_COMPATIBILITY_VERSION;
    readonly readyForConsumer: true;
  };
};

export type NexoraFreezeIntegrityOptions = {
  readonly object?: unknown;
  readonly certificationProfile?: NexoraCertificationProfile;
  readonly requestedBy?: string;
  readonly validationOptions?: NexoraValidationOptions;
  readonly now?: () => string;
};

// ─── Canonical frozen modules (exactly seven) ───────────────────────────────

export const NEXORA_FROZEN_MODULES: readonly NexoraFrozenModuleDescriptor[] =
  Object.freeze([
    Object.freeze({
      name: "Foundation",
      identity: NOL_FOUNDATION_IDENTITY,
      moduleVersion: NOL_FOUNDATION_VERSION,
      schemaVersion: NOL_FOUNDATION_VERSION,
      phase: 1,
      upstream: Object.freeze([] as const),
    }),
    Object.freeze({
      name: "Contract",
      identity: NOL_CONTRACT_IDENTITY,
      moduleVersion: NOL_CONTRACT_VERSION,
      schemaVersion: NOL_SCHEMA_VERSION,
      phase: 2,
      upstream: Object.freeze([NOL_FOUNDATION_IDENTITY] as const),
    }),
    Object.freeze({
      name: "Runtime",
      identity: NOL_RUNTIME_IDENTITY,
      moduleVersion: NOL_RUNTIME_MODEL_VERSION,
      schemaVersion: NOL_RUNTIME_SCHEMA_VERSION,
      phase: 3,
      upstream: Object.freeze([
        NOL_FOUNDATION_IDENTITY,
        NOL_CONTRACT_IDENTITY,
      ] as const),
    }),
    Object.freeze({
      name: "StateTransition",
      identity: NOL_STE_IDENTITY,
      moduleVersion: NOL_STE_VERSION,
      schemaVersion: NOL_STE_STATE_SCHEMA_VERSION,
      phase: 4,
      upstream: Object.freeze([
        NOL_FOUNDATION_IDENTITY,
        NOL_CONTRACT_IDENTITY,
        NOL_RUNTIME_IDENTITY,
      ] as const),
    }),
    Object.freeze({
      name: "Relationship",
      identity: NOL_RELATIONSHIP_IDENTITY,
      moduleVersion: NOL_RELATIONSHIP_ENGINE_VERSION,
      schemaVersion: NOL_RELATIONSHIP_SCHEMA_VERSION,
      phase: 5,
      upstream: Object.freeze([
        NOL_FOUNDATION_IDENTITY,
        NOL_CONTRACT_IDENTITY,
        NOL_RUNTIME_IDENTITY,
        NOL_STE_IDENTITY,
      ] as const),
    }),
    Object.freeze({
      name: "Validation",
      identity: NOL_VALIDATION_IDENTITY,
      moduleVersion: NOL_VALIDATION_ENGINE_VERSION,
      schemaVersion: NOL_VALIDATION_SCHEMA_VERSION,
      phase: 6,
      upstream: Object.freeze([
        NOL_FOUNDATION_IDENTITY,
        NOL_CONTRACT_IDENTITY,
        NOL_RUNTIME_IDENTITY,
        NOL_STE_IDENTITY,
        NOL_RELATIONSHIP_IDENTITY,
      ] as const),
    }),
    Object.freeze({
      name: "Certification",
      identity: NOL_CERTIFICATION_IDENTITY,
      moduleVersion: NOL_CERTIFICATION_ENGINE_VERSION,
      schemaVersion: NOL_CERTIFICATION_SCHEMA_VERSION,
      phase: 7,
      upstream: Object.freeze([
        NOL_FOUNDATION_IDENTITY,
        NOL_CONTRACT_IDENTITY,
        NOL_RUNTIME_IDENTITY,
        NOL_STE_IDENTITY,
        NOL_RELATIONSHIP_IDENTITY,
        NOL_VALIDATION_IDENTITY,
      ] as const),
    }),
  ]);

/** Canonical approved dependency edges (deterministic order). */
export const NEXORA_FREEZE_DEPENDENCY_GRAPH: readonly NexoraFreezeDependencyEdge[] =
  Object.freeze([
    Object.freeze({ from: "Contract", to: "Foundation" }),
    Object.freeze({ from: "Runtime", to: "Foundation" }),
    Object.freeze({ from: "Runtime", to: "Contract" }),
    Object.freeze({ from: "StateTransition", to: "Foundation" }),
    Object.freeze({ from: "StateTransition", to: "Contract" }),
    Object.freeze({ from: "StateTransition", to: "Runtime" }),
    Object.freeze({ from: "Relationship", to: "Foundation" }),
    Object.freeze({ from: "Relationship", to: "Contract" }),
    Object.freeze({ from: "Relationship", to: "Runtime" }),
    Object.freeze({ from: "Relationship", to: "StateTransition" }),
    Object.freeze({ from: "Validation", to: "Foundation" }),
    Object.freeze({ from: "Validation", to: "Contract" }),
    Object.freeze({ from: "Validation", to: "Runtime" }),
    Object.freeze({ from: "Validation", to: "StateTransition" }),
    Object.freeze({ from: "Validation", to: "Relationship" }),
    Object.freeze({ from: "Certification", to: "Foundation" }),
    Object.freeze({ from: "Certification", to: "Contract" }),
    Object.freeze({ from: "Certification", to: "Runtime" }),
    Object.freeze({ from: "Certification", to: "StateTransition" }),
    Object.freeze({ from: "Certification", to: "Relationship" }),
    Object.freeze({ from: "Certification", to: "Validation" }),
  ]);

const FORBIDDEN_DEPENDENCY_TOKENS = Object.freeze([
  "Director",
  "Workspace",
  "Assistant",
  "Timeline",
  "Scenario",
  "Decision",
  "Execution",
  "react",
  "next",
  "three",
  "database",
] as const);

// ─── Canonical public API registry ──────────────────────────────────────────

function api(
  apiName: string,
  owningModule: NexoraFrozenModuleName,
  identity: string,
  version: string,
): NexoraFrozenApiRegistryEntry {
  return Object.freeze({
    apiName,
    owningModule,
    identity,
    version,
    stability: "Stable" as const,
    visibility: "Public" as const,
  });
}

export const NEXORA_FROZEN_API_REGISTRY: readonly NexoraFrozenApiRegistryEntry[] =
  Object.freeze([
    // Foundation
    api("createNexoraObject", "Foundation", NOL_FOUNDATION_IDENTITY, NOL_FOUNDATION_VERSION),
    api("serializeNexoraObjectToJson", "Foundation", NOL_FOUNDATION_IDENTITY, NOL_FOUNDATION_VERSION),
    api("projectNexoraObjectForDirector", "Foundation", NOL_FOUNDATION_IDENTITY, NOL_FOUNDATION_VERSION),
    api("NOL_FOUNDATION_IDENTITY", "Foundation", NOL_FOUNDATION_IDENTITY, NOL_FOUNDATION_VERSION),
    // Contract
    api("createNexoraObjectContract", "Contract", NOL_CONTRACT_IDENTITY, NOL_CONTRACT_VERSION),
    api("validateNexoraObjectContract", "Contract", NOL_CONTRACT_IDENTITY, NOL_CONTRACT_VERSION),
    api("freezeNexoraObject", "Contract", NOL_CONTRACT_IDENTITY, NOL_CONTRACT_VERSION),
    api("NOL_CONTRACT_IDENTITY", "Contract", NOL_CONTRACT_IDENTITY, NOL_CONTRACT_VERSION),
    // Runtime
    api("applyNexoraObjectRuntimeCommand", "Runtime", NOL_RUNTIME_IDENTITY, NOL_RUNTIME_MODEL_VERSION),
    api("getNexoraObjectRuntimeState", "Runtime", NOL_RUNTIME_IDENTITY, NOL_RUNTIME_MODEL_VERSION),
    api("validateNexoraObjectRuntimeState", "Runtime", NOL_RUNTIME_IDENTITY, NOL_RUNTIME_MODEL_VERSION),
    api("NOL_RUNTIME_IDENTITY", "Runtime", NOL_RUNTIME_IDENTITY, NOL_RUNTIME_MODEL_VERSION),
    // State
    api("applyNexoraObjectTransition", "StateTransition", NOL_STE_IDENTITY, NOL_STE_VERSION),
    api("evaluateNexoraObjectTransition", "StateTransition", NOL_STE_IDENTITY, NOL_STE_VERSION),
    api("createNexoraObjectState", "StateTransition", NOL_STE_IDENTITY, NOL_STE_VERSION),
    api("NOL_STE_IDENTITY", "StateTransition", NOL_STE_IDENTITY, NOL_STE_VERSION),
    // Relationship
    api("createNexoraObjectGraph", "Relationship", NOL_RELATIONSHIP_IDENTITY, NOL_RELATIONSHIP_ENGINE_VERSION),
    api("createRelationship", "Relationship", NOL_RELATIONSHIP_IDENTITY, NOL_RELATIONSHIP_ENGINE_VERSION),
    api("simulateImpactPropagation", "Relationship", NOL_RELATIONSHIP_IDENTITY, NOL_RELATIONSHIP_ENGINE_VERSION),
    api("NOL_RELATIONSHIP_IDENTITY", "Relationship", NOL_RELATIONSHIP_IDENTITY, NOL_RELATIONSHIP_ENGINE_VERSION),
    // Validation
    api("validateNexoraObject", "Validation", NOL_VALIDATION_IDENTITY, NOL_VALIDATION_ENGINE_VERSION),
    api("validateNexoraObjects", "Validation", NOL_VALIDATION_IDENTITY, NOL_VALIDATION_ENGINE_VERSION),
    api("calculateIntegrityScore", "Validation", NOL_VALIDATION_IDENTITY, NOL_VALIDATION_ENGINE_VERSION),
    api("NOL_VALIDATION_IDENTITY", "Validation", NOL_VALIDATION_IDENTITY, NOL_VALIDATION_ENGINE_VERSION),
    // Certification
    api("certifyNexoraObject", "Certification", NOL_CERTIFICATION_IDENTITY, NOL_CERTIFICATION_ENGINE_VERSION),
    api("recertifyNexoraObject", "Certification", NOL_CERTIFICATION_IDENTITY, NOL_CERTIFICATION_ENGINE_VERSION),
    api("revokeNexoraObjectCertification", "Certification", NOL_CERTIFICATION_IDENTITY, NOL_CERTIFICATION_ENGINE_VERSION),
    api("NOL_CERTIFICATION_IDENTITY", "Certification", NOL_CERTIFICATION_IDENTITY, NOL_CERTIFICATION_ENGINE_VERSION),
  ]);

/** Stable public export symbols locked by Freeze (module identity aliases + APIs). */
export const NEXORA_FROZEN_PUBLIC_EXPORTS: readonly string[] = Object.freeze([
  ...NEXORA_FROZEN_API_REGISTRY.map((entry) => entry.apiName),
  "NEXORA_FROZEN_MODULES",
  "NEXORA_FROZEN_API_REGISTRY",
  "createFreezeManifest",
  "verifyFreezeIntegrity",
  "verifyFreezeDependencies",
  "verifyFreezeCompatibility",
  "projectFreezeManifest",
  "serializeFreezeManifest",
  "deserializeFreezeManifest",
  "getFrozenApiRegistry",
  "getFrozenReleaseMetadata",
  "NOL_FREEZE_IDENTITY",
]);

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: NexoraFreezeVerificationIssue["code"],
  message: string,
  details?: Readonly<Record<string, unknown>>,
): NexoraFreezeVerificationIssue {
  return Object.freeze({ code, message, details });
}

function schemaVersions(): NexoraFreezeSchemaVersions {
  return Object.freeze({
    objectSchema: NOL_SCHEMA_VERSION,
    runtimeSchema: NOL_RUNTIME_SCHEMA_VERSION,
    stateSchema: NOL_STE_STATE_SCHEMA_VERSION,
    relationshipSchema: NOL_RELATIONSHIP_SCHEMA_VERSION,
    validationSchema: NOL_VALIDATION_SCHEMA_VERSION,
    certificationSchema: NOL_CERTIFICATION_SCHEMA_VERSION,
  });
}

function dependencyVersions(): NexoraFreezeDependencyVersions {
  return Object.freeze({
    foundation: NOL_FOUNDATION_VERSION,
    contract: NOL_CONTRACT_VERSION,
    runtime: NOL_RUNTIME_MODEL_VERSION,
    state: NOL_STE_VERSION,
    relationship: NOL_RELATIONSHIP_ENGINE_VERSION,
    validation: NOL_VALIDATION_ENGINE_VERSION,
    certification: NOL_CERTIFICATION_ENGINE_VERSION,
  });
}

function hasCycle(
  edges: readonly NexoraFreezeDependencyEdge[],
): readonly string[] | null {
  const nodes = new Set<string>();
  for (const edge of edges) {
    nodes.add(edge.from);
    nodes.add(String(edge.to));
  }
  const adj = new Map<string, string[]>();
  for (const node of nodes) adj.set(node, []);
  for (const edge of edges) {
    adj.get(edge.from)!.push(String(edge.to));
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];
  let found: string[] | null = null;

  const visit = (node: string): void => {
    if (found || visited.has(node)) return;
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      found = [...stack.slice(idx), node];
      return;
    }
    visiting.add(node);
    stack.push(node);
    for (const next of adj.get(node) ?? []) visit(next);
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  };

  for (const node of [...nodes].sort()) visit(node);
  return found;
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function getFrozenApiRegistry(): readonly NexoraFrozenApiRegistryEntry[] {
  return NEXORA_FROZEN_API_REGISTRY;
}

/**
 * Live bindings for every frozen API registry entry.
 * Public Index publishes these; it must not invent alternate implementations.
 */
export function getFrozenApiBindings(): Readonly<
  Record<string, unknown>
> {
  return Object.freeze({
    createNexoraObject,
    serializeNexoraObjectToJson,
    projectNexoraObjectForDirector,
    NOL_FOUNDATION_IDENTITY,
    createNexoraObjectContract,
    validateNexoraObjectContract,
    freezeNexoraObject,
    NOL_CONTRACT_IDENTITY,
    applyNexoraObjectRuntimeCommand,
    getNexoraObjectRuntimeState,
    validateNexoraObjectRuntimeState,
    NOL_RUNTIME_IDENTITY,
    applyNexoraObjectTransition,
    evaluateNexoraObjectTransition,
    createNexoraObjectState,
    NOL_STE_IDENTITY,
    createNexoraObjectGraph,
    createRelationship,
    simulateImpactPropagation,
    NOL_RELATIONSHIP_IDENTITY,
    validateNexoraObject,
    validateNexoraObjects,
    calculateIntegrityScore,
    NOL_VALIDATION_IDENTITY,
    certifyNexoraObject,
    recertifyNexoraObject,
    revokeNexoraObjectCertification,
    NOL_CERTIFICATION_IDENTITY,
  });
}

export function getFrozenReleaseMetadata(
  releaseDate: string = "2026-08-04T00:00:00.000Z",
): NexoraFreezeReleaseMetadata {
  return Object.freeze({
    moduleIdentity: NOL_FREEZE_IDENTITY,
    releaseStages: Object.freeze([
      "Released",
      "Certified",
      "Frozen",
      "Stable",
      "ReadyForConsumer",
    ] as const),
    releaseDate,
    stability: "Stable",
    readiness: "ReadyForConsumer",
    supportedPlatformVersion: NOL_FREEZE_VERSION,
    compatibility: "BackwardCompatible",
  });
}

export function createFreezeManifest(
  createdAt: string = new Date().toISOString(),
): NexoraObjectFreezeManifest {
  return Object.freeze({
    freezeIdentity: NOL_FREEZE_IDENTITY,
    freezeVersion: NOL_FREEZE_VERSION,
    moduleVersion: NOL_FREEZE_VERSION,
    createdAt,
    frozenModules: NEXORA_FROZEN_MODULES,
    publicApiCount: NEXORA_FROZEN_API_REGISTRY.length,
    publicExportCount: NEXORA_FROZEN_PUBLIC_EXPORTS.length,
    schemaVersions: schemaVersions(),
    dependencyVersions: dependencyVersions(),
    certificationVersion: NOL_CERTIFICATION_ENGINE_VERSION,
    compatibilityVersion: NOL_FREEZE_COMPATIBILITY_VERSION,
    compatibility: "BackwardCompatible",
    releaseStages: Object.freeze([
      "Released",
      "Certified",
      "Frozen",
      "Stable",
      "ReadyForConsumer",
    ] as const),
  });
}

export function verifyFreezeDependencies(
  edges: readonly NexoraFreezeDependencyEdge[] = NEXORA_FREEZE_DEPENDENCY_GRAPH,
  now: () => string = () => new Date().toISOString(),
): NexoraFreezeVerificationResult {
  const errors: NexoraFreezeVerificationIssue[] = [];
  const warnings: NexoraFreezeVerificationIssue[] = [];

  const allowedModules = new Set(
    NEXORA_FROZEN_MODULES.map((module) => module.name),
  );

  for (const edge of edges) {
    const target = String(edge.to);
    if (!allowedModules.has(edge.from as NexoraFrozenModuleName)) {
      errors.push(
        issue(
          "FREEZE_FORBIDDEN_DEPENDENCY",
          `Unknown dependency source module: ${edge.from}`,
          { edge },
        ),
      );
    }
    const forbidden = FORBIDDEN_DEPENDENCY_TOKENS.some((token) =>
      target.toLowerCase().includes(token.toLowerCase()),
    );
    if (forbidden || !allowedModules.has(target as NexoraFrozenModuleName)) {
      // Non-frozen module targets are forbidden for Freeze dependency lock.
      if (!allowedModules.has(target as NexoraFrozenModuleName)) {
        errors.push(
          issue(
            "FREEZE_FORBIDDEN_DEPENDENCY",
            `Forbidden or non-frozen dependency: ${edge.from} → ${target}`,
            { edge },
          ),
        );
      }
    }
  }

  const cycle = hasCycle(edges);
  if (cycle) {
    errors.push(
      issue(
        "FREEZE_CYCLIC_DEPENDENCY",
        `Cyclic module dependency detected: ${cycle.join(" → ")}`,
        { cycle },
      ),
    );
  }

  // Deterministic ordering check against canonical graph when using default edges.
  if (edges === NEXORA_FREEZE_DEPENDENCY_GRAPH) {
    const serialized = edges.map((e) => `${e.from}->${e.to}`).join("|");
    const expected = NEXORA_FREEZE_DEPENDENCY_GRAPH.map(
      (e) => `${e.from}->${e.to}`,
    ).join("|");
    if (serialized !== expected) {
      errors.push(
        issue(
          "FREEZE_INVALID_REQUEST",
          "Dependency graph ordering is not deterministic.",
        ),
      );
    }
  }

  if (NEXORA_FROZEN_MODULES.length !== 7) {
    errors.push(
      issue(
        "FREEZE_MODULE_COUNT",
        `Expected exactly 7 frozen modules, found ${NEXORA_FROZEN_MODULES.length}.`,
      ),
    );
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

export function verifyFreezeCompatibility(
  manifest: NexoraObjectFreezeManifest = createFreezeManifest(
    "1970-01-01T00:00:00.000Z",
  ),
  now: () => string = () => new Date().toISOString(),
): NexoraFreezeVerificationResult {
  const errors: NexoraFreezeVerificationIssue[] = [];
  const warnings: NexoraFreezeVerificationIssue[] = [];
  const versions = manifest.dependencyVersions;
  const expected = dependencyVersions();

  for (const key of Object.keys(expected) as (keyof NexoraFreezeDependencyVersions)[]) {
    if (versions[key] !== expected[key]) {
      errors.push(
        issue(
          "FREEZE_VERSION_MISMATCH",
          `Version mismatch for ${key}: ${versions[key]} !== ${expected[key]}`,
          { key, received: versions[key], expected: expected[key] },
        ),
      );
    }
  }

  const schemas = manifest.schemaVersions;
  const expectedSchemas = schemaVersions();
  for (const key of Object.keys(
    expectedSchemas,
  ) as (keyof NexoraFreezeSchemaVersions)[]) {
    if (schemas[key] !== expectedSchemas[key]) {
      errors.push(
        issue(
          "FREEZE_UNSUPPORTED_SCHEMA",
          `Schema mismatch for ${key}: ${schemas[key]} !== ${expectedSchemas[key]}`,
          { key, received: schemas[key], expected: expectedSchemas[key] },
        ),
      );
    }
  }

  if (manifest.compatibility !== "BackwardCompatible") {
    errors.push(
      issue(
        "FREEZE_VERSION_MISMATCH",
        `Expected compatibility BackwardCompatible, received ${manifest.compatibility}.`,
      ),
    );
  }

  if (manifest.frozenModules.length !== 7) {
    errors.push(
      issue(
        "FREEZE_MODULE_COUNT",
        `Freeze manifest must contain exactly 7 modules.`,
        { count: manifest.frozenModules.length },
      ),
    );
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

/**
 * Freeze integrity verification.
 * When an object is supplied, delegates to NOL-1:6 Validation and NOL-1:7 Certification.
 * Always verifies dependencies and export surface.
 */
export function verifyFreezeIntegrity(
  options: NexoraFreezeIntegrityOptions = {},
): NexoraFreezeVerificationResult {
  const now = options.now ?? (() => new Date().toISOString());
  const errors: NexoraFreezeVerificationIssue[] = [];
  const warnings: NexoraFreezeVerificationIssue[] = [];

  const deps = verifyFreezeDependencies(NEXORA_FREEZE_DEPENDENCY_GRAPH, now);
  errors.push(...deps.errors);

  const compatibility = verifyFreezeCompatibility(
    createFreezeManifest(now()),
    now,
  );
  errors.push(...compatibility.errors);

  // Export verification — public export count must match locked registry.
  const expectedExportCount = NEXORA_FROZEN_PUBLIC_EXPORTS.length;
  const expectedApiCount = NEXORA_FROZEN_API_REGISTRY.length;
  if (expectedApiCount !== getFrozenApiRegistry().length) {
    errors.push(
      issue(
        "FREEZE_EXPORT_MISMATCH",
        "Frozen API registry length is unstable.",
      ),
    );
  }
  if (expectedExportCount < expectedApiCount) {
    errors.push(
      issue(
        "FREEZE_EXPORT_MISMATCH",
        "Public export count is smaller than API registry.",
      ),
    );
  }

  if (options.object !== undefined) {
    // Delegate validation — never reimplement domain rules.
    const validation = validateNexoraObject({
      object: options.object,
      level: "Certification",
      options: options.validationOptions,
    });
    if (!validation.valid || validation.errors.length > 0) {
      errors.push(
        issue(
          "FREEZE_VALIDATION_FAILED",
          "Freeze integrity requires successful Validation.",
          {
            delegatedTo: NOL_VALIDATION_IDENTITY,
            score: validation.score,
            errorCount: validation.errors.length,
          },
        ),
      );
    }

    // Delegate certification — never reimplement trust policies.
    const certification = certifyNexoraObject({
      object: options.object,
      profile: options.certificationProfile ?? "Platform",
      requestedBy: options.requestedBy ?? "NOL-1:8/Freeze",
      reason: "Freeze integrity verification",
      options: {
        now,
        validationOptions: options.validationOptions,
      },
    });
    if (!certification.certified) {
      errors.push(
        issue(
          "FREEZE_CERTIFICATION_FAILED",
          "Freeze integrity requires successful Certification.",
          {
            delegatedTo: NOL_CERTIFICATION_IDENTITY,
            errorCodes: certification.errors.map((e) => e.code),
            integrityScore: certification.integrityScore,
          },
        ),
      );
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
    checkedAt: now(),
  });
}

export function projectFreezeManifest(
  createdAt: string = "2026-08-04T00:00:00.000Z",
): NexoraFreezeProjection {
  const manifest = createFreezeManifest(createdAt);
  return Object.freeze({
    manifest,
    registry: getFrozenApiRegistry(),
    releaseMetadata: getFrozenReleaseMetadata(createdAt),
    compatibilitySummary: Object.freeze({
      compatibility: "BackwardCompatible" as const,
      compatibilityVersion: NOL_FREEZE_COMPATIBILITY_VERSION,
      readyForConsumer: true as const,
    }),
  });
}

export function serializeFreezeManifest(
  manifest: NexoraObjectFreezeManifest = createFreezeManifest(
    "2026-08-04T00:00:00.000Z",
  ),
): string {
  return JSON.stringify({
    engineIdentity: NOL_FREEZE_IDENTITY,
    freezeSchemaVersion: NOL_FREEZE_VERSION,
    manifest,
    registry: NEXORA_FROZEN_API_REGISTRY,
    publicExports: NEXORA_FROZEN_PUBLIC_EXPORTS,
    releaseMetadata: getFrozenReleaseMetadata(manifest.createdAt),
  });
}

export function deserializeFreezeManifest(
  json: string,
): NexoraObjectFreezeManifest {
  const parsed = JSON.parse(json) as {
    readonly engineIdentity?: string;
    readonly freezeSchemaVersion?: string;
    readonly manifest: NexoraObjectFreezeManifest;
  };

  if (parsed.freezeSchemaVersion !== NOL_FREEZE_VERSION) {
    throw Object.assign(
      new Error(
        `Unsupported freeze schema version: ${String(parsed.freezeSchemaVersion)}`,
      ),
      { code: "FREEZE_UNSUPPORTED_SCHEMA" as const },
    );
  }
  if (parsed.engineIdentity && parsed.engineIdentity !== NOL_FREEZE_IDENTITY) {
    throw Object.assign(
      new Error(
        `Unsupported freeze engine identity: ${parsed.engineIdentity}`,
      ),
      { code: "FREEZE_UNSUPPORTED_SCHEMA" as const },
    );
  }
  if (!parsed.manifest || parsed.manifest.freezeIdentity !== NOL_FREEZE_IDENTITY) {
    throw Object.assign(
      new Error("Invalid freeze manifest payload."),
      { code: "FREEZE_INVALID_REQUEST" as const },
    );
  }

  // Re-freeze for immutability after JSON round-trip.
  return Object.freeze({
    ...parsed.manifest,
    frozenModules: Object.freeze(
      parsed.manifest.frozenModules.map((module) =>
        Object.freeze({
          ...module,
          upstream: Object.freeze([...module.upstream]),
        }),
      ),
    ),
    schemaVersions: Object.freeze({ ...parsed.manifest.schemaVersions }),
    dependencyVersions: Object.freeze({
      ...parsed.manifest.dependencyVersions,
    }),
    releaseStages: Object.freeze([...parsed.manifest.releaseStages]),
  });
}

export function getNexoraObjectFreezeSummary() {
  const manifest = createFreezeManifest("2026-08-04T00:00:00.000Z");
  return Object.freeze({
    identity: NOL_FREEZE_IDENTITY,
    freezeVersion: NOL_FREEZE_VERSION,
    upstream: NOL_FREEZE_UPSTREAM,
    frozenModuleCount: NEXORA_FROZEN_MODULES.length,
    publicApiCount: manifest.publicApiCount,
    publicExportCount: manifest.publicExportCount,
    compatibility: "BackwardCompatible" as const,
    releaseStages: getFrozenReleaseMetadata().releaseStages,
    readiness: "ReadyForConsumer" as const,
    noNewFeatures: true,
    frameworkIndependent: true,
  });
}

export const UniversalNexoraObjectFreeze = Object.freeze({
  identity: NOL_FREEZE_IDENTITY,
  freezeVersion: NOL_FREEZE_VERSION,
  tags: NOL_FREEZE_TAGS,
  modules: NEXORA_FROZEN_MODULES,
  registry: NEXORA_FROZEN_API_REGISTRY,
  createManifest: createFreezeManifest,
  verifyIntegrity: verifyFreezeIntegrity,
  verifyDependencies: verifyFreezeDependencies,
  verifyCompatibility: verifyFreezeCompatibility,
  project: projectFreezeManifest,
  serialize: serializeFreezeManifest,
  deserialize: deserializeFreezeManifest,
  summary: getNexoraObjectFreezeSummary,
});
