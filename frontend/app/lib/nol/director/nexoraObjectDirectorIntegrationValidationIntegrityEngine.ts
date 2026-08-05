/**
 * NOL-3:6 — NexoraObject Director Integration Validation & Integrity Engine
 *
 * Deterministic validation authority for the Director Integration surface
 * exposed by NOL-3:5. Side-effect free. No renderer execution.
 *
 * Upstream: NOL-3:5 only.
 * Identity: NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine
 */

import {
  assertDirectorSceneBindingInvariants,
  assertInteractionRoutingInvariants,
  assertNexoraDirectorCameraFocusInvariants,
  assertNexoraDirectorSceneSynchronizationInvariants,
  assertNexoraObjectDirectorIntegrationInvariants,
  deserializeDirectorSceneBindingRegistry,
  deserializeInteractionRoutingPlan,
  deserializeInteractionRoutingSnapshot,
  deserializeNexoraDirectorCameraFocusSnapshot,
  deserializeNexoraDirectorCameraFocusState,
  deserializeNexoraDirectorFocusStack,
  deserializeNexoraDirectorSceneSynchronizationPlan,
  deserializeNexoraDirectorSceneSynchronizationSnapshot,
  deserializeNexoraDirectorSceneSynchronizationState,
  deserializeNexoraObjectDirectorIntegrationCollection,
  deserializeNexoraObjectDirectorIntegrationSnapshot,
  findBindingByObjectId,
  listBindings,
  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
  nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
  nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  nexoraObjectDirectorIntegrationFoundationVersion,
  nexoraObjectDirectorIntegrationSchemaVersion,
  nexoraObjectDirectorInteractionRoutingEngineIdentity,
  nexoraObjectDirectorInteractionRoutingEngineVersion,
  nexoraObjectDirectorInteractionRoutingSchemaVersion,
  nexoraObjectDirectorSceneSynchronizationEngineIdentity,
  nexoraObjectDirectorSceneSynchronizationEngineVersion,
  nexoraObjectDirectorSceneSynchronizationSchemaVersion,
  serializeInteractionRoutingSnapshot,
  serializeNexoraDirectorCameraFocusSnapshot,
  serializeNexoraDirectorSceneSynchronizationSnapshot,
  serializeNexoraObjectDirectorIntegrationSnapshot,
  validateDirectorSceneBindingRegistry,
  validateInteractionEvent,
  validateNexoraDirectorCameraFocusState,
  validateNexoraDirectorFocusStack,
  validateNexoraDirectorSceneSynchronizationPlan,
  validateNexoraDirectorSceneSynchronizationState,
  validateNexoraObjectDirectorIntegrationCollection,
  validateRoutingPlan,
  directorSceneBindingModelIdentity,
  directorSceneBindingModelVersion,
  directorSceneBindingSchemaVersion,
  type NexoraDirectorCameraFocusSnapshot,
  type NexoraDirectorCameraFocusState,
  type NexoraDirectorFocusStack,
  type NexoraDirectorInteractionRoutingPlan,
  type NexoraDirectorInteractionRoutingSnapshot,
  type NexoraDirectorSceneBindingRegistry,
  type NexoraDirectorSceneSynchronizationPlan,
  type NexoraDirectorSceneSynchronizationSnapshot,
  type NexoraDirectorSceneSynchronizationState,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationSnapshot,
} from "./nexoraObjectDirectorCameraFocusCoordinationEngine.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity =
  "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine" as const;

export const nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion =
  "1.0.0" as const;

export const nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion =
  "1.0.0" as const;

export const NOL_DIRECTOR_VALIDATION_IDENTITY =
  nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity;
export const NOL_DIRECTOR_VALIDATION_VERSION =
  nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion;
export const NOL_DIRECTOR_VALIDATION_SCHEMA_VERSION =
  nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion;

export const NOL_DIRECTOR_VALIDATION_UPSTREAM = Object.freeze([
  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
] as const);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraDirectorValidationProfile =
  | "Minimal"
  | "Standard"
  | "Strict"
  | "Certification";

export type NexoraDirectorValidationDomain =
  | "Identity"
  | "Packages"
  | "Bindings"
  | "Synchronization"
  | "Routing"
  | "Focus"
  | "Serialization"
  | "Compatibility"
  | "Version"
  | "Immutability"
  | "PublicAPI"
  | "Registry"
  | "Snapshots";

export type NexoraDirectorValidationErrorCode =
  | "InvalidIdentity"
  | "InvalidBinding"
  | "InvalidSynchronization"
  | "InvalidRouting"
  | "InvalidFocus"
  | "InvalidSnapshot"
  | "InvalidSerialization"
  | "InvalidCompatibility"
  | "UnsupportedVersion"
  | "InvalidPackage"
  | "InvalidImmutability"
  | "InvalidPublicAPI"
  | "InvariantViolation"
  | "RendererObjectForbidden";

export interface NexoraDirectorValidationIssue {
  readonly code: NexoraDirectorValidationErrorCode;
  readonly message: string;
  readonly domain: NexoraDirectorValidationDomain;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorRepairSuggestion {
  readonly suggestionId: string;
  readonly code: string;
  readonly message: string;
  readonly domain: NexoraDirectorValidationDomain;
  readonly severity: "Info" | "Warning" | "Error";
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorValidationDomainResult {
  readonly passed: boolean;
  readonly score: number;
  readonly errorCount: number;
  readonly warningCount: number;
}

export interface NexoraDirectorValidationReport {
  readonly reportId: string;
  readonly profile: NexoraDirectorValidationProfile;
  readonly score: number;
  readonly passed: boolean;
  readonly warnings: readonly NexoraDirectorValidationIssue[];
  readonly errors: readonly NexoraDirectorValidationIssue[];
  readonly repairSuggestions: readonly NexoraDirectorRepairSuggestion[];
  readonly validatedSections: readonly NexoraDirectorValidationDomain[];
  readonly domainResults: Readonly<
    Partial<Record<NexoraDirectorValidationDomain, NexoraDirectorValidationDomainResult>>
  >;
  readonly validationDurationMs: number;
  readonly createdAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorIntegrationValidationInput {
  readonly integrationCollection?: NexoraObjectDirectorIntegrationCollection;
  readonly bindingRegistry?: NexoraDirectorSceneBindingRegistry;
  readonly synchronizationState?: NexoraDirectorSceneSynchronizationState;
  readonly synchronizationPlan?: NexoraDirectorSceneSynchronizationPlan;
  readonly routingPlans?: readonly NexoraDirectorInteractionRoutingPlan[];
  readonly focusState?: NexoraDirectorCameraFocusState;
  readonly focusStack?: NexoraDirectorFocusStack;
  readonly integrationSnapshot?: NexoraObjectDirectorIntegrationSnapshot;
  readonly synchronizationSnapshot?: NexoraDirectorSceneSynchronizationSnapshot;
  readonly routingSnapshot?: NexoraDirectorInteractionRoutingSnapshot;
  readonly focusSnapshot?: NexoraDirectorCameraFocusSnapshot;
  readonly serializedArtifacts?: readonly {
    readonly kind: string;
    readonly payload: string;
  }[];
  readonly expectedSchemaVersion?: string;
  readonly expectedEngineVersions?: Readonly<Record<string, string>>;
}

export interface NexoraDirectorValidationDependencies {
  readonly now: () => string;
  readonly createReportId: () => string;
  readonly createSuggestionId: () => string;
  readonly elapsedMs?: () => number;
}

export interface NexoraDirectorValidationBatchRequest {
  readonly items: readonly {
    readonly input: NexoraDirectorIntegrationValidationInput;
    readonly profile?: NexoraDirectorValidationProfile;
  }[];
  readonly mode: "Atomic" | "BestEffort";
}

export interface NexoraDirectorValidationBatchResult {
  readonly accepted: boolean;
  readonly mode: "Atomic" | "BestEffort";
  readonly reports: readonly NexoraDirectorValidationReport[];
  readonly acceptedIndexes: readonly number[];
  readonly rejectedIndexes: readonly number[];
}

export interface NexoraDirectorSnapshotBundle {
  readonly integrationSnapshot?: NexoraObjectDirectorIntegrationSnapshot;
  readonly synchronizationSnapshot?: NexoraDirectorSceneSynchronizationSnapshot;
  readonly routingSnapshot?: NexoraDirectorInteractionRoutingSnapshot;
  readonly focusSnapshot?: NexoraDirectorCameraFocusSnapshot;
}

export interface NexoraDirectorValidationReportComparison {
  readonly scoreDelta: number;
  readonly passedChanged: boolean;
  readonly previousPassed: boolean;
  readonly nextPassed: boolean;
  readonly previousScore: number;
  readonly nextScore: number;
  readonly addedErrorCodes: readonly NexoraDirectorValidationErrorCode[];
  readonly removedErrorCodes: readonly NexoraDirectorValidationErrorCode[];
  readonly addedDomains: readonly NexoraDirectorValidationDomain[];
  readonly removedDomains: readonly NexoraDirectorValidationDomain[];
}

export type NexoraDirectorValidationErrorDetails = {
  readonly code: NexoraDirectorValidationErrorCode;
  readonly message: string;
  readonly domain?: NexoraDirectorValidationDomain;
  readonly details?: Readonly<Record<string, unknown>>;
};

export class NexoraObjectDirectorIntegrationValidationException extends Error {
  readonly code: NexoraDirectorValidationErrorCode;
  readonly domain?: NexoraDirectorValidationDomain;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorValidationErrorDetails) {
    super(error.message);
    this.name = "NexoraObjectDirectorIntegrationValidationException";
    this.code = error.code;
    this.domain = error.domain;
    this.details = error.details;
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const DOMAIN_WEIGHTS: Readonly<
  Partial<Record<NexoraDirectorValidationDomain, number>>
> = Object.freeze({
  Identity: 20,
  Synchronization: 20,
  Bindings: 20,
  Routing: 15,
  Focus: 15,
  Serialization: 10,
  Packages: 20,
  Compatibility: 10,
  Version: 10,
  Immutability: 10,
  PublicAPI: 10,
  Registry: 20,
  Snapshots: 10,
});

const SCORE_WEIGHT_DOMAINS = Object.freeze([
  "Identity",
  "Synchronization",
  "Bindings",
  "Routing",
  "Focus",
  "Serialization",
] as const satisfies readonly NexoraDirectorValidationDomain[]);

const PUBLIC_API_NAMES = Object.freeze([
  "validateDirectorIntegration",
  "validateDirectorIntegrationBatch",
  "validateDirectorBindings",
  "validateDirectorSynchronization",
  "validateDirectorRouting",
  "validateDirectorFocus",
  "validateDirectorSnapshots",
  "validateDirectorSerialization",
  "calculateDirectorIntegrityScore",
  "generateDirectorRepairSuggestions",
  "compareDirectorValidationReports",
  "assertDirectorIntegrationInvariants",
  "serializeNexoraDirectorValidationReport",
  "deserializeNexoraDirectorValidationReport",
] as const);

const ENGINE_VERSION_MAP = Object.freeze({
  [nexoraObjectDirectorIntegrationFoundationIdentity]:
    nexoraObjectDirectorIntegrationFoundationVersion,
  [directorSceneBindingModelIdentity]: directorSceneBindingModelVersion,
  [nexoraObjectDirectorSceneSynchronizationEngineIdentity]:
    nexoraObjectDirectorSceneSynchronizationEngineVersion,
  [nexoraObjectDirectorInteractionRoutingEngineIdentity]:
    nexoraObjectDirectorInteractionRoutingEngineVersion,
  [nexoraObjectDirectorCameraFocusCoordinationEngineIdentity]:
    nexoraObjectDirectorCameraFocusCoordinationEngineVersion,
  [nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity]:
    nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
} as const);

const SCHEMA_VERSION_MAP = Object.freeze({
  foundation: nexoraObjectDirectorIntegrationSchemaVersion,
  binding: directorSceneBindingSchemaVersion,
  synchronization: nexoraObjectDirectorSceneSynchronizationSchemaVersion,
  routing: nexoraObjectDirectorInteractionRoutingSchemaVersion,
  focus: nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
  validation: nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
} as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item);
    return Object.isFrozen(value) ? value : Object.freeze(value);
  }
  for (const key of Object.keys(value as object)) {
    deepFreeze((value as Record<string, unknown>)[key]);
  }
  return Object.isFrozen(value) ? value : Object.freeze(value);
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object") return true;
  if (seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isDeeplyFrozen(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isDeeplyFrozen(item, seen),
  );
}

function containsForbiddenRendererKeys(
  value: unknown,
  path = "",
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "function") return path || "<root>";
  if (typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = containsForbiddenRendererKeys(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    // `camera` is a legitimate Director projection section (intent/framing).
    // Forbid concrete renderer/camera-instance keys only.
    if (
      lower.includes("mesh") ||
      lower.includes("three") ||
      lower.includes("webgl") ||
      lower.includes("webgpu") ||
      lower.includes("html") ||
      lower.includes("dom") ||
      lower.includes("react") ||
      lower === "geometryref" ||
      lower === "materialref" ||
      lower === "sceneref" ||
      lower === "camerainstance" ||
      lower === "coordinates" ||
      lower === "worldposition" ||
      lower === "matrix4" ||
      lower === "vector3" ||
      lower === "quaternion"
    ) {
      return path ? `${path}.${key}` : key;
    }
    const found = containsForbiddenRendererKeys(
      record[key],
      path ? `${path}.${key}` : key,
    );
    if (found) return found;
  }
  return null;
}

function containsFunctions(value: unknown, path = ""): string | null {
  if (typeof value === "function") return path || "<root>";
  if (value === null || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) {
      const found = containsFunctions(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    const found = containsFunctions(
      record[key],
      path ? `${path}.${key}` : key,
    );
    if (found) return found;
  }
  return null;
}

function issue(
  code: NexoraDirectorValidationErrorCode,
  message: string,
  domain: NexoraDirectorValidationDomain,
  extras?: Partial<NexoraDirectorValidationIssue>,
): NexoraDirectorValidationIssue {
  return Object.freeze({ code, message, domain, ...extras });
}

function throwValidation(error: NexoraDirectorValidationErrorDetails): never {
  throw new NexoraObjectDirectorIntegrationValidationException(error);
}

export function defaultDeps(): NexoraDirectorValidationDependencies {
  let seq = 0;
  return Object.freeze({
    now: (): string => new Date().toISOString(),
    createReportId: (): string => {
      seq += 1;
      return `dir-val-report:${seq}`;
    },
    createSuggestionId: (): string => {
      seq += 1;
      return `dir-val-suggestion:${seq}`;
    },
    elapsedMs: (): number => 0,
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationDependencies {
  if (!dependencies) return defaultDeps();
  return Object.freeze({
    now: dependencies.now,
    createReportId: dependencies.createReportId,
    createSuggestionId: dependencies.createSuggestionId,
    elapsedMs: dependencies.elapsedMs ?? ((): number => 0),
  });
}

function domainScore(errorCount: number, warningCount: number): number {
  const errorPenalty = 25 * errorCount;
  const warningPenalty = 5 * warningCount;
  return Math.max(0, 100 - errorPenalty - warningPenalty);
}

function mapDomainToScoreBucket(
  domain: NexoraDirectorValidationDomain,
): (typeof SCORE_WEIGHT_DOMAINS)[number] {
  switch (domain) {
    case "Identity":
    case "Version":
    case "PublicAPI":
      return "Identity";
    case "Packages":
    case "Bindings":
    case "Registry":
      return "Bindings";
    case "Synchronization":
      return "Synchronization";
    case "Routing":
      return "Routing";
    case "Focus":
      return "Focus";
    case "Serialization":
    case "Compatibility":
    case "Immutability":
    case "Snapshots":
      return "Serialization";
    default: {
      const _exhaustive: never = domain;
      void _exhaustive;
      return "Identity";
    }
  }
}

function profilesFor(
  profile: NexoraDirectorValidationProfile,
): ReadonlySet<NexoraDirectorValidationDomain> {
  switch (profile) {
    case "Minimal":
      return new Set<NexoraDirectorValidationDomain>(["Identity", "Version"]);
    case "Standard":
      return new Set<NexoraDirectorValidationDomain>([
        "Identity",
        "Version",
        "Packages",
        "Bindings",
        "Synchronization",
        "Routing",
        "Focus",
        "Registry",
      ]);
    case "Strict":
      return new Set<NexoraDirectorValidationDomain>([
        "Identity",
        "Version",
        "Packages",
        "Bindings",
        "Synchronization",
        "Routing",
        "Focus",
        "Registry",
        "Immutability",
        "Compatibility",
      ]);
    case "Certification":
      return new Set<NexoraDirectorValidationDomain>([
        "Identity",
        "Version",
        "Packages",
        "Bindings",
        "Synchronization",
        "Routing",
        "Focus",
        "Registry",
        "Immutability",
        "Compatibility",
        "Serialization",
        "Snapshots",
        "PublicAPI",
      ]);
    default: {
      const _exhaustive: never = profile;
      void _exhaustive;
      return new Set();
    }
  }
}

function inputProvidesDomain(
  input: NexoraDirectorIntegrationValidationInput,
  domain: NexoraDirectorValidationDomain,
): boolean {
  switch (domain) {
    case "Identity":
    case "Version":
    case "PublicAPI":
      return true;
    case "Packages":
      return input.integrationCollection !== undefined;
    case "Bindings":
    case "Registry":
      return input.bindingRegistry !== undefined;
    case "Synchronization":
      return (
        input.synchronizationState !== undefined ||
        input.synchronizationPlan !== undefined
      );
    case "Routing":
      return input.routingPlans !== undefined;
    case "Focus":
      return (
        input.focusState !== undefined || input.focusStack !== undefined
      );
    case "Serialization":
      return input.serializedArtifacts !== undefined;
    case "Snapshots":
      return (
        input.integrationSnapshot !== undefined ||
        input.synchronizationSnapshot !== undefined ||
        input.routingSnapshot !== undefined ||
        input.focusSnapshot !== undefined
      );
    case "Compatibility":
      return (
        input.expectedSchemaVersion !== undefined ||
        input.expectedEngineVersions !== undefined ||
        (input.integrationCollection !== undefined &&
          input.bindingRegistry !== undefined) ||
        input.focusState !== undefined ||
        input.routingPlans !== undefined ||
        input.synchronizationState !== undefined
      );
    case "Immutability":
      return (
        input.integrationCollection !== undefined ||
        input.bindingRegistry !== undefined ||
        input.synchronizationState !== undefined ||
        input.synchronizationPlan !== undefined ||
        input.routingPlans !== undefined ||
        input.focusState !== undefined ||
        input.focusStack !== undefined
      );
    default: {
      const _exhaustive: never = domain;
      void _exhaustive;
      return false;
    }
  }
}

function collectDomainIssues(
  domain: NexoraDirectorValidationDomain,
  input: NexoraDirectorIntegrationValidationInput,
  profile: NexoraDirectorValidationProfile,
): {
  readonly errors: NexoraDirectorValidationIssue[];
  readonly warnings: NexoraDirectorValidationIssue[];
} {
  const errors: NexoraDirectorValidationIssue[] = [];
  const warnings: NexoraDirectorValidationIssue[] = [];
  void profile;

  switch (domain) {
    case "Identity": {
      if (
        nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity !==
        "NOL-3:6/NexoraObjectDirectorIntegrationValidationIntegrityEngine"
      ) {
        errors.push(
          issue(
            "InvalidIdentity",
            "Validation engine identity is corrupted.",
            "Identity",
          ),
        );
      }
      if (NOL_DIRECTOR_VALIDATION_UPSTREAM.length !== 1) {
        errors.push(
          issue(
            "InvalidIdentity",
            "Validation engine upstream must be frozen to NOL-3:5 only.",
            "Identity",
          ),
        );
      } else if (
        NOL_DIRECTOR_VALIDATION_UPSTREAM[0] !==
        nexoraObjectDirectorCameraFocusCoordinationEngineIdentity
      ) {
        errors.push(
          issue(
            "InvalidIdentity",
            "Validation engine upstream identity mismatch.",
            "Identity",
            {
              details: {
                expected:
                  nexoraObjectDirectorCameraFocusCoordinationEngineIdentity,
                received: NOL_DIRECTOR_VALIDATION_UPSTREAM[0],
              },
            },
          ),
        );
      }
      break;
    }
    case "Version": {
      if (
        nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion !==
          "1.0.0" ||
        nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion !==
          "1.0.0"
      ) {
        errors.push(
          issue(
            "UnsupportedVersion",
            "Validation engine version/schema must be 1.0.0.",
            "Version",
          ),
        );
      }
      if (
        input.expectedSchemaVersion !== undefined &&
        input.expectedSchemaVersion !==
          nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion
      ) {
        errors.push(
          issue(
            "UnsupportedVersion",
            `Unsupported expected schema version: ${input.expectedSchemaVersion}`,
            "Version",
            { details: { expectedSchemaVersion: input.expectedSchemaVersion } },
          ),
        );
      }
      if (input.expectedEngineVersions) {
        for (const [engineId, expected] of Object.entries(
          input.expectedEngineVersions,
        )) {
          const actual =
            ENGINE_VERSION_MAP[engineId as keyof typeof ENGINE_VERSION_MAP];
          if (actual === undefined) {
            warnings.push(
              issue(
                "InvalidCompatibility",
                `Unknown engine identity in expected versions: ${engineId}`,
                "Version",
                { details: { engineId, expected } },
              ),
            );
            continue;
          }
          if (actual !== expected) {
            errors.push(
              issue(
                "UnsupportedVersion",
                `Engine version mismatch for ${engineId}.`,
                "Version",
                { details: { engineId, expected, actual } },
              ),
            );
          }
        }
      }
      break;
    }
    case "Packages": {
      const collection = input.integrationCollection;
      if (!collection) break;
      for (const pkg of collection.packages) {
        try {
          assertNexoraObjectDirectorIntegrationInvariants(pkg);
        } catch (error) {
          errors.push(
            issue(
              "InvalidPackage",
              error instanceof Error
                ? error.message
                : "Integration package invariants failed.",
              "Packages",
              { objectId: pkg.objectId, sceneObjectId: pkg.sceneObject.sceneObjectId },
            ),
          );
        }
      }
      const packageErrors =
        validateNexoraObjectDirectorIntegrationCollection(collection);
      for (const pkgError of packageErrors) {
        errors.push(
          issue("InvalidPackage", pkgError.message, "Packages", {
            objectId: pkgError.objectId,
            sceneObjectId: pkgError.sceneObjectId,
            details: pkgError.details,
          }),
        );
      }
      break;
    }
    case "Bindings":
    case "Registry": {
      const registry = input.bindingRegistry;
      if (!registry) break;
      for (const binding of listBindings(registry)) {
        try {
          assertDirectorSceneBindingInvariants(binding);
        } catch (error) {
          errors.push(
            issue(
              "InvalidBinding",
              error instanceof Error
                ? error.message
                : "Binding invariants failed.",
              domain,
              {
                objectId: binding.objectId,
                sceneObjectId: binding.sceneObjectId,
              },
            ),
          );
        }
      }
      const validation = validateDirectorSceneBindingRegistry(registry);
      if (!validation.ok) {
        for (const bindingError of validation.errors) {
          errors.push(
            issue("InvalidBinding", bindingError.message, domain, {
              objectId: bindingError.objectId,
              sceneObjectId: bindingError.sceneObjectId,
              details: bindingError.details,
            }),
          );
        }
      }
      const objectIds = new Set<string>();
      const sceneIds = new Set<string>();
      const bindingIds = new Set<string>();
      for (const binding of listBindings(registry)) {
        if (objectIds.has(binding.objectId)) {
          errors.push(
            issue(
              "InvalidBinding",
              `Duplicate binding objectId: ${binding.objectId}`,
              domain,
              { objectId: binding.objectId, sceneObjectId: binding.sceneObjectId },
            ),
          );
        }
        objectIds.add(binding.objectId);
        if (sceneIds.has(binding.sceneObjectId)) {
          errors.push(
            issue(
              "InvalidBinding",
              `Duplicate binding sceneObjectId: ${binding.sceneObjectId}`,
              domain,
              { objectId: binding.objectId, sceneObjectId: binding.sceneObjectId },
            ),
          );
        }
        sceneIds.add(binding.sceneObjectId);
        if (bindingIds.has(binding.bindingId)) {
          errors.push(
            issue(
              "InvalidBinding",
              `Duplicate bindingId: ${binding.bindingId}`,
              domain,
              { objectId: binding.objectId, sceneObjectId: binding.sceneObjectId },
            ),
          );
        }
        bindingIds.add(binding.bindingId);
      }
      break;
    }
    case "Synchronization": {
      if (input.synchronizationState) {
        try {
          assertNexoraDirectorSceneSynchronizationInvariants(
            input.synchronizationState,
          );
        } catch (error) {
          errors.push(
            issue(
              "InvalidSynchronization",
              error instanceof Error
                ? error.message
                : "Synchronization state invariants failed.",
              "Synchronization",
            ),
          );
        }
        const validation = validateNexoraDirectorSceneSynchronizationState(
          input.synchronizationState,
        );
        if (!validation.ok) {
          for (const syncError of validation.errors) {
            errors.push(
              issue(
                "InvalidSynchronization",
                syncError.message,
                "Synchronization",
                {
                  objectId: syncError.objectId,
                  sceneObjectId: syncError.sceneObjectId,
                  details: syncError.details,
                },
              ),
            );
          }
        }
        if (input.synchronizationState.revision < 0) {
          errors.push(
            issue(
              "InvalidSynchronization",
              "Synchronization revision must be non-negative.",
              "Synchronization",
              { details: { revision: input.synchronizationState.revision } },
            ),
          );
        }
        if (
          input.integrationCollection &&
          input.synchronizationState.packageCount !==
            input.integrationCollection.packages.length
        ) {
          errors.push(
            issue(
              "InvalidSynchronization",
              "packageCount is inconsistent with integration collection.",
              "Synchronization",
              {
                details: {
                  packageCount: input.synchronizationState.packageCount,
                  actual: input.integrationCollection.packages.length,
                },
              },
            ),
          );
        }
        if (
          input.bindingRegistry &&
          input.synchronizationState.bindingCount !==
            input.bindingRegistry.bindings.length
        ) {
          errors.push(
            issue(
              "InvalidSynchronization",
              "bindingCount is inconsistent with binding registry.",
              "Synchronization",
              {
                details: {
                  bindingCount: input.synchronizationState.bindingCount,
                  actual: input.bindingRegistry.bindings.length,
                },
              },
            ),
          );
        }
        if (
          input.synchronizationState.status === "Failed" ||
          input.synchronizationState.status === "RolledBack"
        ) {
          warnings.push(
            issue(
              "InvalidSynchronization",
              `Synchronization status indicates staleness: ${input.synchronizationState.status}`,
              "Synchronization",
              { details: { status: input.synchronizationState.status } },
            ),
          );
        }
      }
      if (input.synchronizationPlan) {
        try {
          assertNexoraDirectorSceneSynchronizationInvariants(
            input.synchronizationPlan,
          );
        } catch (error) {
          errors.push(
            issue(
              "InvalidSynchronization",
              error instanceof Error
                ? error.message
                : "Synchronization plan invariants failed.",
              "Synchronization",
            ),
          );
        }
        const validation = validateNexoraDirectorSceneSynchronizationPlan(
          input.synchronizationPlan,
        );
        if (!validation.ok) {
          for (const syncError of validation.errors) {
            errors.push(
              issue(
                "InvalidSynchronization",
                syncError.message,
                "Synchronization",
                {
                  objectId: syncError.objectId,
                  sceneObjectId: syncError.sceneObjectId,
                  details: syncError.details,
                },
              ),
            );
          }
        }
      }
      break;
    }
    case "Routing": {
      const plans = input.routingPlans;
      if (!plans) break;
      for (const plan of plans) {
        try {
          assertInteractionRoutingInvariants(plan);
        } catch (error) {
          errors.push(
            issue(
              "InvalidRouting",
              error instanceof Error
                ? error.message
                : "Routing plan invariants failed.",
              "Routing",
              { objectId: plan.interaction.objectId },
            ),
          );
        }
        const eventValidation = validateInteractionEvent(plan.interaction);
        if (!eventValidation.ok) {
          for (const routingError of eventValidation.errors) {
            errors.push(
              issue("InvalidRouting", routingError.message, "Routing", {
                objectId: routingError.objectId,
                sceneObjectId: routingError.sceneObjectId,
                details: routingError.details,
              }),
            );
          }
        }
        const planValidation = validateRoutingPlan(plan);
        if (!planValidation.ok) {
          for (const routingError of planValidation.errors) {
            errors.push(
              issue("InvalidRouting", routingError.message, "Routing", {
                objectId: routingError.objectId,
                sceneObjectId: routingError.sceneObjectId,
                details: routingError.details,
              }),
            );
          }
        }
        if (!plan.accepted && plan.errors.length > 0) {
          warnings.push(
            issue(
              "InvalidRouting",
              "Routing plan is not accepted.",
              "Routing",
              {
                objectId: plan.interaction.objectId,
                sceneObjectId: plan.interaction.sceneObjectId,
                details: { planId: plan.planId },
              },
            ),
          );
        }
      }
      break;
    }
    case "Focus": {
      if (input.focusState) {
        try {
          assertNexoraDirectorCameraFocusInvariants(input.focusState);
        } catch (error) {
          errors.push(
            issue(
              "InvalidFocus",
              error instanceof Error
                ? error.message
                : "Focus state invariants failed.",
              "Focus",
            ),
          );
        }
        const validation = validateNexoraDirectorCameraFocusState(
          input.focusState,
        );
        if (!validation.ok) {
          for (const focusError of validation.errors) {
            errors.push(
              issue("InvalidFocus", focusError.message, "Focus", {
                objectId: focusError.objectId,
                sceneObjectId: focusError.sceneObjectId,
                details: focusError.details,
              }),
            );
          }
        }
      }
      if (input.focusStack) {
        try {
          assertNexoraDirectorCameraFocusInvariants(input.focusStack);
        } catch (error) {
          errors.push(
            issue(
              "InvalidFocus",
              error instanceof Error
                ? error.message
                : "Focus stack invariants failed.",
              "Focus",
            ),
          );
        }
        const validation = validateNexoraDirectorFocusStack(input.focusStack);
        if (!validation.ok) {
          for (const focusError of validation.errors) {
            errors.push(
              issue("InvalidFocus", focusError.message, "Focus", {
                objectId: focusError.objectId,
                sceneObjectId: focusError.sceneObjectId,
                details: focusError.details,
              }),
            );
          }
        }
      }
      break;
    }
    case "Immutability": {
      const candidates: readonly { readonly label: string; readonly value: unknown }[] =
        [
          { label: "integrationCollection", value: input.integrationCollection },
          { label: "bindingRegistry", value: input.bindingRegistry },
          { label: "synchronizationState", value: input.synchronizationState },
          { label: "synchronizationPlan", value: input.synchronizationPlan },
          { label: "routingPlans", value: input.routingPlans },
          { label: "focusState", value: input.focusState },
          { label: "focusStack", value: input.focusStack },
        ];
      for (const candidate of candidates) {
        if (candidate.value === undefined) continue;
        if (!isDeeplyFrozen(candidate.value)) {
          errors.push(
            issue(
              "InvalidImmutability",
              `${candidate.label} must be deeply immutable.`,
              "Immutability",
              { details: { label: candidate.label } },
            ),
          );
        }
        const fnPath = containsFunctions(candidate.value);
        if (fnPath) {
          errors.push(
            issue(
              "InvalidImmutability",
              `${candidate.label} contains functions/callbacks at ${fnPath}.`,
              "Immutability",
              { details: { label: candidate.label, path: fnPath } },
            ),
          );
        }
        const rendererPath = containsForbiddenRendererKeys(candidate.value);
        if (rendererPath) {
          errors.push(
            issue(
              "RendererObjectForbidden",
              `${candidate.label} contains renderer-forbidden key at ${rendererPath}.`,
              "Immutability",
              { details: { label: candidate.label, path: rendererPath } },
            ),
          );
        }
      }
      break;
    }
    case "Compatibility": {
      const collection = input.integrationCollection;
      const registry = input.bindingRegistry;
      if (collection && registry) {
        const packageObjectIds = new Set(
          collection.packages.map((pkg) => pkg.objectId),
        );
        const packageByObjectId = new Map(
          collection.packages.map((pkg) => [pkg.objectId, pkg] as const),
        );
        for (const binding of listBindings(registry)) {
          if (!packageObjectIds.has(binding.objectId)) {
            errors.push(
              issue(
                "InvalidCompatibility",
                `Binding objectId is not present in integration collection: ${binding.objectId}`,
                "Compatibility",
                {
                  objectId: binding.objectId,
                  sceneObjectId: binding.sceneObjectId,
                },
              ),
            );
            continue;
          }
          const pkg = packageByObjectId.get(binding.objectId);
          if (
            pkg &&
            (pkg.sceneObject.sceneObjectId !== binding.sceneObjectId ||
              pkg.packageId !== binding.packageId)
          ) {
            errors.push(
              issue(
                "InvalidCompatibility",
                "Binding scene/package identity does not match package.",
                "Compatibility",
                {
                  objectId: binding.objectId,
                  sceneObjectId: binding.sceneObjectId,
                  details: {
                    packageSceneObjectId: pkg.sceneObject.sceneObjectId,
                    packageId: pkg.packageId,
                    bindingPackageId: binding.packageId,
                  },
                },
              ),
            );
          }
        }
      }
      if (input.focusState?.focusedObjectId && registry) {
        const binding = findBindingByObjectId(
          registry,
          input.focusState.focusedObjectId,
        );
        if (!binding) {
          errors.push(
            issue(
              "InvalidCompatibility",
              "Focused object does not resolve through bindings.",
              "Compatibility",
              {
                objectId: input.focusState.focusedObjectId,
                sceneObjectId: input.focusState.focusedSceneObjectId,
              },
            ),
          );
        } else if (
          input.focusState.focusedSceneObjectId !== undefined &&
          binding.sceneObjectId !== input.focusState.focusedSceneObjectId
        ) {
          errors.push(
            issue(
              "InvalidCompatibility",
              "Focused sceneObjectId does not match binding.",
              "Compatibility",
              {
                objectId: input.focusState.focusedObjectId,
                sceneObjectId: input.focusState.focusedSceneObjectId,
                details: { bindingSceneObjectId: binding.sceneObjectId },
              },
            ),
          );
        }
      }
      if (input.routingPlans) {
        for (const plan of input.routingPlans) {
          const objectId = plan.interaction.objectId;
          if (collection) {
            const pkg = collection.packages.find((p) => p.objectId === objectId);
            if (!pkg) {
              errors.push(
                issue(
                  "InvalidRouting",
                  `Routing plan objectId missing from collection: ${objectId}`,
                  "Compatibility",
                  {
                    objectId,
                    sceneObjectId: plan.interaction.sceneObjectId,
                    details: { planId: plan.planId },
                  },
                ),
              );
            }
          }
          if (registry) {
            const binding = findBindingByObjectId(registry, objectId);
            if (!binding) {
              errors.push(
                issue(
                  "InvalidRouting",
                  `Routing plan objectId missing from bindings: ${objectId}`,
                  "Compatibility",
                  {
                    objectId,
                    sceneObjectId: plan.interaction.sceneObjectId,
                    details: { planId: plan.planId },
                  },
                ),
              );
            } else if (binding.bindingId !== plan.interaction.bindingId) {
              errors.push(
                issue(
                  "InvalidRouting",
                  "Routing plan bindingId does not match registry binding.",
                  "Compatibility",
                  {
                    objectId,
                    sceneObjectId: plan.interaction.sceneObjectId,
                    details: {
                      planId: plan.planId,
                      expectedBindingId: binding.bindingId,
                      receivedBindingId: plan.interaction.bindingId,
                    },
                  },
                ),
              );
            }
          }
        }
      }
      break;
    }
    case "Serialization": {
      const artifacts = input.serializedArtifacts;
      if (!artifacts) break;
      for (const artifact of artifacts) {
        try {
          const parsed = JSON.parse(artifact.payload) as Record<string, unknown>;
          if (
            typeof parsed.schemaVersion === "string" &&
            ![
              ...Object.values(SCHEMA_VERSION_MAP),
              nexoraObjectDirectorCameraFocusCoordinationSchemaVersion,
            ].includes(parsed.schemaVersion as never)
          ) {
            errors.push(
              issue(
                "UnsupportedVersion",
                `Unsupported serialized schema version: ${String(parsed.schemaVersion)}`,
                "Serialization",
                {
                  details: {
                    kind: artifact.kind,
                    schemaVersion: parsed.schemaVersion,
                  },
                },
              ),
            );
            continue;
          }
          const fnPath = containsFunctions(parsed);
          if (fnPath) {
            errors.push(
              issue(
                "InvalidSerialization",
                `Serialized artifact contains functions at ${fnPath}.`,
                "Serialization",
                { details: { kind: artifact.kind, path: fnPath } },
              ),
            );
          }
          const rendererPath = containsForbiddenRendererKeys(parsed);
          if (rendererPath) {
            errors.push(
              issue(
                "RendererObjectForbidden",
                `Serialized artifact contains renderer-forbidden key at ${rendererPath}.`,
                "Serialization",
                { details: { kind: artifact.kind, path: rendererPath } },
              ),
            );
          }
          switch (artifact.kind) {
            case "integrationCollection":
              deserializeNexoraObjectDirectorIntegrationCollection(
                artifact.payload,
              );
              break;
            case "integrationSnapshot":
              deserializeNexoraObjectDirectorIntegrationSnapshot(
                artifact.payload,
              );
              break;
            case "bindingRegistry":
              deserializeDirectorSceneBindingRegistry(artifact.payload);
              break;
            case "synchronizationState":
              deserializeNexoraDirectorSceneSynchronizationState(
                artifact.payload,
              );
              break;
            case "synchronizationPlan":
              deserializeNexoraDirectorSceneSynchronizationPlan(
                artifact.payload,
              );
              break;
            case "synchronizationSnapshot":
              deserializeNexoraDirectorSceneSynchronizationSnapshot(
                artifact.payload,
              );
              break;
            case "routingPlan":
              deserializeInteractionRoutingPlan(artifact.payload);
              break;
            case "routingSnapshot":
              deserializeInteractionRoutingSnapshot(artifact.payload);
              break;
            case "focusState":
              deserializeNexoraDirectorCameraFocusState(artifact.payload);
              break;
            case "focusStack":
              deserializeNexoraDirectorFocusStack(artifact.payload);
              break;
            case "focusSnapshot":
              deserializeNexoraDirectorCameraFocusSnapshot(artifact.payload);
              break;
            case "validationReport":
              deserializeNexoraDirectorValidationReport(artifact.payload);
              break;
            default:
              warnings.push(
                issue(
                  "InvalidSerialization",
                  `Unknown serialized artifact kind: ${artifact.kind}`,
                  "Serialization",
                  { details: { kind: artifact.kind } },
                ),
              );
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Serialized artifact failed to deserialize.";
          const unsupported =
            /unsupported|schema/i.test(message) ||
            (error instanceof NexoraObjectDirectorIntegrationValidationException &&
              error.code === "UnsupportedVersion");
          errors.push(
            issue(
              unsupported ? "UnsupportedVersion" : "InvalidSerialization",
              message,
              "Serialization",
              { details: { kind: artifact.kind } },
            ),
          );
        }
      }
      break;
    }
    case "Snapshots": {
      if (input.integrationSnapshot) {
        try {
          const serialized = serializeNexoraObjectDirectorIntegrationSnapshot(
            input.integrationSnapshot,
          );
          deserializeNexoraObjectDirectorIntegrationSnapshot(serialized);
        } catch (error) {
          errors.push(
            issue(
              "InvalidSnapshot",
              error instanceof Error
                ? error.message
                : "Integration snapshot validation failed.",
              "Snapshots",
            ),
          );
        }
      }
      if (input.synchronizationSnapshot) {
        try {
          const serialized =
            serializeNexoraDirectorSceneSynchronizationSnapshot(
              input.synchronizationSnapshot,
            );
          deserializeNexoraDirectorSceneSynchronizationSnapshot(serialized);
        } catch (error) {
          errors.push(
            issue(
              "InvalidSnapshot",
              error instanceof Error
                ? error.message
                : "Synchronization snapshot validation failed.",
              "Snapshots",
            ),
          );
        }
      }
      if (input.routingSnapshot) {
        try {
          const serialized = serializeInteractionRoutingSnapshot(
            input.routingSnapshot,
          );
          deserializeInteractionRoutingSnapshot(serialized);
        } catch (error) {
          errors.push(
            issue(
              "InvalidSnapshot",
              error instanceof Error
                ? error.message
                : "Routing snapshot validation failed.",
              "Snapshots",
            ),
          );
        }
      }
      if (input.focusSnapshot) {
        try {
          const serialized = serializeNexoraDirectorCameraFocusSnapshot(
            input.focusSnapshot,
          );
          deserializeNexoraDirectorCameraFocusSnapshot(serialized);
        } catch (error) {
          errors.push(
            issue(
              "InvalidSnapshot",
              error instanceof Error
                ? error.message
                : "Focus snapshot validation failed.",
              "Snapshots",
            ),
          );
        }
      }
      break;
    }
    case "PublicAPI": {
      const apiSurface: Readonly<Record<string, unknown>> = {
        validateDirectorIntegration,
        validateDirectorIntegrationBatch,
        validateDirectorBindings,
        validateDirectorSynchronization,
        validateDirectorRouting,
        validateDirectorFocus,
        validateDirectorSnapshots,
        validateDirectorSerialization,
        calculateDirectorIntegrityScore,
        generateDirectorRepairSuggestions,
        compareDirectorValidationReports,
        assertDirectorIntegrationInvariants,
        serializeNexoraDirectorValidationReport,
        deserializeNexoraDirectorValidationReport,
      };
      for (const name of PUBLIC_API_NAMES) {
        if (typeof apiSurface[name] !== "function") {
          errors.push(
            issue(
              "InvalidPublicAPI",
              `Missing public API: ${name}`,
              "PublicAPI",
              { details: { name } },
            ),
          );
        }
      }
      break;
    }
    default: {
      const _exhaustive: never = domain;
      void _exhaustive;
      break;
    }
  }

  return { errors, warnings };
}

// ─── Public APIs ────────────────────────────────────────────────────────────

export function calculateDirectorIntegrityScore(
  reportOrScores:
    | Pick<NexoraDirectorValidationReport, "domainResults" | "validatedSections">
    | Readonly<Partial<Record<NexoraDirectorValidationDomain, number>>>,
): number {
  const isReportLike =
    typeof reportOrScores === "object" &&
    reportOrScores !== null &&
    "domainResults" in reportOrScores;

  if (isReportLike) {
    const report = reportOrScores as Pick<
      NexoraDirectorValidationReport,
      "domainResults" | "validatedSections"
    >;
    const buckets = new Map<
      (typeof SCORE_WEIGHT_DOMAINS)[number],
      { scoreSum: number; weightSum: number }
    >();
    for (const domain of report.validatedSections) {
      const result = report.domainResults[domain];
      if (!result) continue;
      const bucket = mapDomainToScoreBucket(domain);
      const weight = DOMAIN_WEIGHTS[domain] ?? DOMAIN_WEIGHTS[bucket] ?? 10;
      const current = buckets.get(bucket) ?? { scoreSum: 0, weightSum: 0 };
      current.scoreSum += result.score * weight;
      current.weightSum += weight;
      buckets.set(bucket, current);
    }
    let totalWeight = 0;
    let weighted = 0;
    for (const bucket of SCORE_WEIGHT_DOMAINS) {
      const entry = buckets.get(bucket);
      if (!entry || entry.weightSum === 0) continue;
      const bucketScore = entry.scoreSum / entry.weightSum;
      const bucketWeight = DOMAIN_WEIGHTS[bucket] ?? 10;
      weighted += bucketScore * bucketWeight;
      totalWeight += bucketWeight;
    }
    if (totalWeight === 0) return 100;
    return Math.round(weighted / totalWeight);
  }

  const scores = reportOrScores as Readonly<
    Partial<Record<NexoraDirectorValidationDomain, number>>
  >;
  let totalWeight = 0;
  let weighted = 0;
  for (const domain of SCORE_WEIGHT_DOMAINS) {
    const score = scores[domain];
    if (score === undefined) continue;
    const weight = DOMAIN_WEIGHTS[domain] ?? 10;
    weighted += score * weight;
    totalWeight += weight;
  }
  if (totalWeight === 0) return 100;
  return Math.round(weighted / totalWeight);
}

export function generateDirectorRepairSuggestions(
  errors: readonly NexoraDirectorValidationIssue[],
  warnings: readonly NexoraDirectorValidationIssue[],
  dependencies?: NexoraDirectorValidationDependencies,
): readonly NexoraDirectorRepairSuggestion[] {
  const deps = resolveDeps(dependencies);
  const suggestions: NexoraDirectorRepairSuggestion[] = [];

  const push = (
    code: string,
    message: string,
    domain: NexoraDirectorValidationDomain,
    severity: NexoraDirectorRepairSuggestion["severity"],
    details?: Readonly<Record<string, unknown>>,
  ): void => {
    suggestions.push(
      deepFreeze({
        suggestionId: deps.createSuggestionId(),
        code,
        message,
        domain,
        severity,
        ...(details ? { details: deepFreeze({ ...details }) } : {}),
      }),
    );
  };

  for (const error of errors) {
    if (
      error.code === "InvalidBinding" &&
      /duplicate/i.test(error.message)
    ) {
      push(
        "DUPLICATE_BINDING",
        "Remove or reconcile duplicate bindings before revalidation.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    if (
      error.code === "InvalidSynchronization" ||
      (error.domain === "Synchronization" && /stale|status/i.test(error.message))
    ) {
      push(
        "STALE_SYNCHRONIZATION",
        "Re-run scene synchronization to refresh revision and counts.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    if (error.code === "InvalidRouting") {
      push(
        "INVALID_ROUTING_TARGET",
        "Align routing plan object/binding identity with collection bindings.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    if (error.code === "UnsupportedVersion") {
      push(
        "UNSUPPORTED_SCHEMA",
        "Upgrade or re-serialize artifacts to a supported schema version.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    if (error.code === "InvalidFocus") {
      push(
        "INVALID_FOCUS_STACK",
        "Rebuild focus state/stack from valid bound scene objects.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    if (error.code === "RendererObjectForbidden") {
      push(
        "RENDERER_OBJECT_FORBIDDEN",
        "Strip renderer-specific keys from Director Integration artifacts.",
        error.domain,
        "Error",
        error.details,
      );
      continue;
    }
    push(
      error.code,
      error.message,
      error.domain,
      "Error",
      error.details,
    );
  }

  for (const warning of warnings) {
    if (
      warning.domain === "Synchronization" ||
      /stale/i.test(warning.message)
    ) {
      push(
        "STALE_SYNCHRONIZATION",
        warning.message,
        warning.domain,
        "Warning",
        warning.details,
      );
      continue;
    }
    push(
      warning.code,
      warning.message,
      warning.domain,
      "Warning",
      warning.details,
    );
  }

  return Object.freeze(suggestions);
}

export function validateDirectorIntegration(
  input: NexoraDirectorIntegrationValidationInput,
  profile: NexoraDirectorValidationProfile = "Standard",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  const deps = resolveDeps(dependencies);
  const enabled = profilesFor(profile);
  const errors: NexoraDirectorValidationIssue[] = [];
  const warnings: NexoraDirectorValidationIssue[] = [];
  const validatedSections: NexoraDirectorValidationDomain[] = [];
  const domainResults: Partial<
    Record<NexoraDirectorValidationDomain, NexoraDirectorValidationDomainResult>
  > = {};

  for (const domain of enabled) {
    if (!inputProvidesDomain(input, domain)) continue;
    validatedSections.push(domain);
    const collected = collectDomainIssues(domain, input, profile);
    errors.push(...collected.errors);
    warnings.push(...collected.warnings);
    domainResults[domain] = deepFreeze({
      passed: collected.errors.length === 0,
      score: domainScore(collected.errors.length, collected.warnings.length),
      errorCount: collected.errors.length,
      warningCount: collected.warnings.length,
    });
  }

  const frozenErrors = Object.freeze(errors.map((item) => deepFreeze(item)));
  const frozenWarnings = Object.freeze(
    warnings.map((item) => deepFreeze(item)),
  );
  const frozenSections = Object.freeze([...validatedSections]);
  const frozenDomainResults = deepFreeze(domainResults);
  const score = calculateDirectorIntegrityScore({
    domainResults: frozenDomainResults,
    validatedSections: frozenSections,
  });
  const repairSuggestions = generateDirectorRepairSuggestions(
    frozenErrors,
    frozenWarnings,
    deps,
  );

  return deepFreeze({
    reportId: deps.createReportId(),
    profile,
    score,
    passed: frozenErrors.length === 0,
    warnings: frozenWarnings,
    errors: frozenErrors,
    repairSuggestions,
    validatedSections: frozenSections,
    domainResults: frozenDomainResults,
    validationDurationMs: deps.elapsedMs?.() ?? 0,
    createdAt: deps.now(),
    metadata: deepFreeze({
      engineIdentity:
        nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
      engineVersion:
        nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
      schemaVersion:
        nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
      upstream: [...NOL_DIRECTOR_VALIDATION_UPSTREAM],
    }),
  });
}

export function validateDirectorIntegrationBatch(
  request: NexoraDirectorValidationBatchRequest,
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationBatchResult {
  const deps = resolveDeps(dependencies);
  const reports: NexoraDirectorValidationReport[] = [];
  const acceptedIndexes: number[] = [];
  const rejectedIndexes: number[] = [];

  for (let index = 0; index < request.items.length; index += 1) {
    const item = request.items[index]!;
    const report = validateDirectorIntegration(
      item.input,
      item.profile ?? "Standard",
      deps,
    );
    reports.push(report);
    if (report.passed) acceptedIndexes.push(index);
    else rejectedIndexes.push(index);
  }

  if (request.mode === "Atomic" && rejectedIndexes.length > 0) {
    return deepFreeze({
      accepted: false,
      mode: request.mode,
      reports: Object.freeze([]),
      acceptedIndexes: Object.freeze([]),
      rejectedIndexes: Object.freeze([...rejectedIndexes]),
    });
  }

  return deepFreeze({
    accepted: rejectedIndexes.length === 0,
    mode: request.mode,
    reports: Object.freeze([...reports]),
    acceptedIndexes: Object.freeze([...acceptedIndexes]),
    rejectedIndexes: Object.freeze([...rejectedIndexes]),
  });
}

export function validateDirectorBindings(
  registry: NexoraDirectorSceneBindingRegistry,
  profile: NexoraDirectorValidationProfile = "Standard",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  return validateDirectorIntegration(
    { bindingRegistry: registry },
    profile,
    dependencies,
  );
}

export function validateDirectorSynchronization(
  stateOrPlan:
    | NexoraDirectorSceneSynchronizationState
    | NexoraDirectorSceneSynchronizationPlan,
  profile: NexoraDirectorValidationProfile = "Standard",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  const isPlan =
    typeof stateOrPlan === "object" &&
    stateOrPlan !== null &&
    "commands" in stateOrPlan &&
    "projectedState" in stateOrPlan;
  return validateDirectorIntegration(
    isPlan
      ? { synchronizationPlan: stateOrPlan }
      : { synchronizationState: stateOrPlan },
    profile,
    dependencies,
  );
}

export function validateDirectorRouting(
  plans: readonly NexoraDirectorInteractionRoutingPlan[],
  profile: NexoraDirectorValidationProfile = "Standard",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  return validateDirectorIntegration(
    { routingPlans: plans },
    profile,
    dependencies,
  );
}

export function validateDirectorFocus(
  state: NexoraDirectorCameraFocusState,
  stack?: NexoraDirectorFocusStack,
  profile: NexoraDirectorValidationProfile = "Standard",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  return validateDirectorIntegration(
    { focusState: state, focusStack: stack },
    profile,
    dependencies,
  );
}

export function validateDirectorSnapshots(
  snapshots: NexoraDirectorSnapshotBundle,
  profile: NexoraDirectorValidationProfile = "Certification",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  return validateDirectorIntegration(
    {
      integrationSnapshot: snapshots.integrationSnapshot,
      synchronizationSnapshot: snapshots.synchronizationSnapshot,
      routingSnapshot: snapshots.routingSnapshot,
      focusSnapshot: snapshots.focusSnapshot,
    },
    profile,
    dependencies,
  );
}

export function validateDirectorSerialization(
  artifacts: readonly { readonly kind: string; readonly payload: string }[],
  profile: NexoraDirectorValidationProfile = "Certification",
  dependencies?: NexoraDirectorValidationDependencies,
): NexoraDirectorValidationReport {
  return validateDirectorIntegration(
    { serializedArtifacts: artifacts },
    profile,
    dependencies,
  );
}

export function compareDirectorValidationReports(
  a: NexoraDirectorValidationReport,
  b: NexoraDirectorValidationReport,
): NexoraDirectorValidationReportComparison {
  const previousCodes = a.errors.map((item) => item.code).sort();
  const nextCodes = b.errors.map((item) => item.code).sort();
  const previousSet = new Set(previousCodes);
  const nextSet = new Set(nextCodes);
  const addedErrorCodes = nextCodes.filter((code) => !previousSet.has(code));
  const removedErrorCodes = previousCodes.filter((code) => !nextSet.has(code));
  const previousDomains = [...a.validatedSections].sort();
  const nextDomains = [...b.validatedSections].sort();
  const previousDomainSet = new Set(previousDomains);
  const nextDomainSet = new Set(nextDomains);

  return deepFreeze({
    scoreDelta: b.score - a.score,
    passedChanged: a.passed !== b.passed,
    previousPassed: a.passed,
    nextPassed: b.passed,
    previousScore: a.score,
    nextScore: b.score,
    addedErrorCodes: Object.freeze([
      ...new Set(addedErrorCodes),
    ] as NexoraDirectorValidationErrorCode[]),
    removedErrorCodes: Object.freeze([
      ...new Set(removedErrorCodes),
    ] as NexoraDirectorValidationErrorCode[]),
    addedDomains: Object.freeze(
      nextDomains.filter(
        (domain) => !previousDomainSet.has(domain),
      ) as NexoraDirectorValidationDomain[],
    ),
    removedDomains: Object.freeze(
      previousDomains.filter(
        (domain) => !nextDomainSet.has(domain),
      ) as NexoraDirectorValidationDomain[],
    ),
  });
}

export function assertDirectorIntegrationInvariants(
  input: NexoraDirectorIntegrationValidationInput,
): void {
  const report = validateDirectorIntegration(input, "Strict", {
    now: () => "1970-01-01T00:00:00.000Z",
    createReportId: () => "dir-val-assert",
    createSuggestionId: () => "dir-val-assert-suggestion",
    elapsedMs: () => 0,
  });
  if (!report.passed) {
    const first = report.errors[0];
    throwValidation({
      code: first?.code ?? "InvariantViolation",
      message: first?.message ?? "Director integration invariants failed.",
      domain: first?.domain ?? "Identity",
      details: {
        errorCount: report.errors.length,
        warningCount: report.warnings.length,
        score: report.score,
      },
    });
  }
}

export function serializeNexoraDirectorValidationReport(
  report: NexoraDirectorValidationReport,
): string {
  return JSON.stringify({
    identity: nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
    version: nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
    schemaVersion:
      nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
    kind: "validationReport",
    report,
  });
}

export function deserializeNexoraDirectorValidationReport(
  json: string,
): NexoraDirectorValidationReport {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json) as Record<string, unknown>;
  } catch {
    throwValidation({
      code: "InvalidSerialization",
      message: "Validation report JSON is corrupted.",
      domain: "Serialization",
    });
  }
  if (
    parsed.schemaVersion !==
    nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion
  ) {
    throwValidation({
      code: "UnsupportedVersion",
      message: `Unsupported validation report schema: ${String(parsed.schemaVersion)}`,
      domain: "Serialization",
      details: { schemaVersion: parsed.schemaVersion },
    });
  }
  if (parsed.kind !== "validationReport") {
    throwValidation({
      code: "InvalidSerialization",
      message: `Expected envelope kind validationReport, received ${String(parsed.kind)}.`,
      domain: "Serialization",
      details: { expected: "validationReport", received: parsed.kind },
    });
  }
  if (
    parsed.identity !==
    nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity
  ) {
    throwValidation({
      code: "InvalidIdentity",
      message: "Validation report identity is corrupted.",
      domain: "Identity",
      details: { identity: parsed.identity },
    });
  }
  return deepFreeze(parsed.report as NexoraDirectorValidationReport);
}

export function getNexoraObjectDirectorIntegrationValidationIntegrityEngineSummary() {
  return Object.freeze({
    identity: nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
    version: nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
    schemaVersion:
      nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
    upstream: NOL_DIRECTOR_VALIDATION_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    sideEffectFree: true,
  });
}

export const NexoraObjectDirectorIntegrationValidationIntegrityEngine =
  Object.freeze({
    identity: nexoraObjectDirectorIntegrationValidationIntegrityEngineIdentity,
    version: nexoraObjectDirectorIntegrationValidationIntegrityEngineVersion,
    schemaVersion:
      nexoraObjectDirectorIntegrationValidationIntegritySchemaVersion,
    validateDirectorIntegration,
    validateDirectorIntegrationBatch,
    validateDirectorBindings,
    validateDirectorSynchronization,
    validateDirectorRouting,
    validateDirectorFocus,
    validateDirectorSnapshots,
    validateDirectorSerialization,
    calculateDirectorIntegrityScore,
    generateDirectorRepairSuggestions,
    compareDirectorValidationReports,
    assertDirectorIntegrationInvariants,
    serializeNexoraDirectorValidationReport,
    deserializeNexoraDirectorValidationReport,
    summary: getNexoraObjectDirectorIntegrationValidationIntegrityEngineSummary,
  });
