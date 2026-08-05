/**
 * NOL-3:2 — NexoraObject Director Scene Binding Model
 *
 * Canonical binding between immutable Director Integration Packages (NOL-3:1)
 * and persistent Director Scene Objects. Maintains stable scene bindings across
 * updates — no rendering, layout, animation execution, or runtime mutation.
 *
 * Upstream: NOL-3:1 NexoraObjectDirectorIntegrationFoundation only.
 * Identity: NOL-3:2/NexoraObjectDirectorSceneBindingModel
 */

import {
  createNexoraDirectorSceneObjectId,
  nexoraObjectDirectorIntegrationFoundationIdentity,
  type NexoraObjectDirectorIntegrationCollection,
  type NexoraObjectDirectorIntegrationPackage,
} from "./nexoraObjectDirectorIntegrationFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorSceneBindingModelIdentity =
  "NOL-3:2/NexoraObjectDirectorSceneBindingModel" as const;

export const directorSceneBindingModelVersion = "1.0.0" as const;

export const directorSceneBindingSchemaVersion = "1.0.0" as const;

export const NOL_DIRECTOR_SCENE_BINDING_IDENTITY =
  directorSceneBindingModelIdentity;
export const NOL_DIRECTOR_SCENE_BINDING_VERSION =
  directorSceneBindingModelVersion;
export const NOL_DIRECTOR_SCENE_BINDING_SCHEMA_VERSION =
  directorSceneBindingSchemaVersion;

export const NOL_DIRECTOR_SCENE_BINDING_UPSTREAM = Object.freeze([
  nexoraObjectDirectorIntegrationFoundationIdentity,
] as const);

// ─── Lifecycle ────────────────────────────────────────────────────────────────

/**
 * Allowed binding state transitions:
 *
 * Created → Bound
 * Bound → Updated | Hidden | Detached | Removed
 * Updated → Updated | Hidden | Detached | Removed | Bound
 * Hidden → Bound | Updated | Detached | Removed
 * Detached → Bound | Updated | Hidden | Removed
 * Removed → (terminal)
 *
 * Forbidden: Removed → *, Detached → Created, Hidden → Created,
 * any → Created except initial create, Created → Updated/Hidden/Detached/Removed.
 */

const ALLOWED_TRANSITIONS: Readonly<
  Record<NexoraDirectorSceneBindingState, readonly NexoraDirectorSceneBindingState[]>
> = Object.freeze({
  Created: Object.freeze(["Bound"] as const),
  Bound: Object.freeze(["Updated", "Hidden", "Detached", "Removed"] as const),
  Updated: Object.freeze([
    "Updated",
    "Hidden",
    "Detached",
    "Removed",
    "Bound",
  ] as const),
  Hidden: Object.freeze(["Bound", "Updated", "Detached", "Removed"] as const),
  Detached: Object.freeze(["Bound", "Updated", "Hidden", "Removed"] as const),
  Removed: Object.freeze([] as const),
});

const VALID_BINDING_STATES = Object.freeze([
  "Created",
  "Bound",
  "Updated",
  "Hidden",
  "Detached",
  "Removed",
] as const satisfies readonly NexoraDirectorSceneBindingState[]);

// ─── Types ──────────────────────────────────────────────────────────────────

export type NexoraDirectorSceneBindingState =
  | "Created"
  | "Bound"
  | "Updated"
  | "Hidden"
  | "Detached"
  | "Removed";

export interface NexoraDirectorSceneBinding {
  readonly bindingId: string;
  readonly objectId: string;
  readonly sceneObjectId: string;
  readonly packageId: string;
  readonly state: NexoraDirectorSceneBindingState;
  readonly generation: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: Readonly<Record<string, unknown>>;
}

export interface NexoraDirectorSceneBindingRegistry {
  readonly registryId: string;
  readonly bindings: readonly NexoraDirectorSceneBinding[];
}

export interface NexoraDirectorSceneBindingDiff {
  readonly created: readonly NexoraDirectorSceneBinding[];
  readonly updated: readonly NexoraDirectorSceneBinding[];
  readonly hidden: readonly NexoraDirectorSceneBinding[];
  readonly detached: readonly NexoraDirectorSceneBinding[];
  readonly removed: readonly NexoraDirectorSceneBinding[];
  readonly unchanged: readonly NexoraDirectorSceneBinding[];
}

export interface NexoraDirectorSceneBindingSnapshot {
  readonly snapshotId: string;
  readonly registry: NexoraDirectorSceneBindingRegistry;
  readonly createdAt: string;
}

export interface NexoraDirectorSceneBindingSnapshotComparison {
  readonly newBindings: readonly string[];
  readonly removedBindings: readonly string[];
  readonly hiddenBindings: readonly string[];
  readonly updatedGenerations: readonly {
    readonly bindingId: string;
    readonly from: number;
    readonly to: number;
  }[];
  readonly stateTransitions: readonly {
    readonly bindingId: string;
    readonly from: NexoraDirectorSceneBindingState;
    readonly to: NexoraDirectorSceneBindingState;
  }[];
}

export interface NexoraDirectorSceneBindingDependencies {
  readonly now: () => string;
  readonly createBindingId: (
    objectId: string,
    sceneObjectId: string,
  ) => string;
  readonly createRegistryId: (bindingIds: readonly string[]) => string;
  readonly createSnapshotId: () => string;
}

export type NexoraDirectorSceneBindingErrorCode =
  | "BINDING_INVALID"
  | "BINDING_DUPLICATE_OBJECT_ID"
  | "BINDING_DUPLICATE_SCENE_OBJECT_ID"
  | "BINDING_DUPLICATE_BINDING_ID"
  | "BINDING_INVALID_TRANSITION"
  | "BINDING_NOT_FOUND"
  | "BINDING_REMOVED_CANNOT_REBIND"
  | "BINDING_UNSUPPORTED_SCHEMA"
  | "BINDING_INVARIANT_VIOLATION";

export interface NexoraDirectorSceneBindingError {
  readonly code: NexoraDirectorSceneBindingErrorCode;
  readonly message: string;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly bindingId?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export class NexoraDirectorSceneBindingException extends Error {
  readonly code: NexoraDirectorSceneBindingErrorCode;
  readonly objectId?: string;
  readonly sceneObjectId?: string;
  readonly bindingId?: string;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(error: NexoraDirectorSceneBindingError) {
    super(error.message);
    this.name = "NexoraDirectorSceneBindingException";
    this.code = error.code;
    this.objectId = error.objectId;
    this.sceneObjectId = error.sceneObjectId;
    this.bindingId = error.bindingId;
    this.details = error.details;
  }
}

export type NexoraDirectorSceneBindingValidationResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly errors: readonly NexoraDirectorSceneBindingError[];
    };

// ─── Helpers ────────────────────────────────────────────────────────────────

export function deepFreeze<T>(value: T): T {
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

function err(
  code: NexoraDirectorSceneBindingErrorCode,
  message: string,
  extras?: Partial<NexoraDirectorSceneBindingError>,
): NexoraDirectorSceneBindingError {
  return Object.freeze({ code, message, ...extras });
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

function isJsonSafe(value: unknown, seen = new Set<object>()): boolean {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    return typeof value !== "number" || Number.isFinite(value);
  }
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (typeof value !== "object") return false;
  if (seen.has(value as object)) return true;
  seen.add(value as object);
  if (Array.isArray(value)) {
    return value.every((item) => isJsonSafe(item, seen));
  }
  return Object.values(value as Record<string, unknown>).every((item) =>
    isJsonSafe(item, seen),
  );
}

export function defaultDeps(): NexoraDirectorSceneBindingDependencies {
  let seq = 0;
  return Object.freeze({
    now: () => new Date().toISOString(),
    createBindingId: (objectId: string, sceneObjectId: string) => {
      void sceneObjectId;
      return `nexora-binding:${objectId}`;
    },
    createRegistryId: (bindingIds: readonly string[]) => {
      seq += 1;
      return `dir-bind-reg:${bindingIds.join("|")}:${seq}`;
    },
    createSnapshotId: () => {
      seq += 1;
      return `dir-bind-snap:${seq}`;
    },
  });
}

function resolveDeps(
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBindingDependencies {
  return dependencies ?? defaultDeps();
}

function throwBinding(error: NexoraDirectorSceneBindingError): never {
  throw new NexoraDirectorSceneBindingException(error);
}

function assertTransition(
  from: NexoraDirectorSceneBindingState,
  to: NexoraDirectorSceneBindingState,
  binding: Pick<
    NexoraDirectorSceneBinding,
    "bindingId" | "objectId" | "sceneObjectId"
  >,
): void {
  if (from === to) return;
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!(allowed as readonly string[]).includes(to)) {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        `Invalid binding transition: ${from} → ${to}.`,
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
          details: { from, to },
        },
      ),
    );
  }
}

function withState(
  binding: NexoraDirectorSceneBinding,
  state: NexoraDirectorSceneBindingState,
  deps: NexoraDirectorSceneBindingDependencies,
  overrides: Partial<
    Pick<
      NexoraDirectorSceneBinding,
      "generation" | "packageId" | "metadata" | "updatedAt"
    >
  > = {},
): NexoraDirectorSceneBinding {
  assertTransition(binding.state, state, binding);
  return deepFreeze({
    ...binding,
    state,
    updatedAt: overrides.updatedAt ?? deps.now(),
    ...(overrides.generation !== undefined
      ? { generation: overrides.generation }
      : {}),
    ...(overrides.packageId !== undefined
      ? { packageId: overrides.packageId }
      : {}),
    ...(overrides.metadata !== undefined
      ? { metadata: overrides.metadata }
      : {}),
  });
}

function bindingMetadata(
  pkg: NexoraObjectDirectorIntegrationPackage,
): Readonly<Record<string, unknown>> {
  return deepFreeze({
    lastUpdateStrategy: pkg.rendering.updateStrategy,
    integrationIdentity: pkg.metadata.integrationIdentity,
  });
}

function sortBindingsBySceneOrder(
  bindings: readonly NexoraDirectorSceneBinding[],
  sceneOrder: readonly string[],
): readonly NexoraDirectorSceneBinding[] {
  const orderIndex = new Map(sceneOrder.map((id, index) => [id, index]));
  return Object.freeze(
    [...bindings].sort((left, right) => {
      const leftIndex = orderIndex.get(left.sceneObjectId);
      const rightIndex = orderIndex.get(right.sceneObjectId);
      if (leftIndex !== undefined && rightIndex !== undefined) {
        if (leftIndex !== rightIndex) return leftIndex - rightIndex;
      } else if (leftIndex !== undefined) {
        return -1;
      } else if (rightIndex !== undefined) {
        return 1;
      }
      return left.sceneObjectId.localeCompare(right.sceneObjectId);
    }),
  );
}

function buildRegistry(
  bindings: readonly NexoraDirectorSceneBinding[],
  sceneOrder: readonly string[],
  deps: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBindingRegistry {
  const sorted = sortBindingsBySceneOrder(bindings, sceneOrder);
  return deepFreeze({
    registryId: deps.createRegistryId(sorted.map((item) => item.bindingId)),
    bindings: sorted,
  });
}

function validateCollectionUniqueness(
  collection: NexoraObjectDirectorIntegrationCollection,
): readonly NexoraDirectorSceneBindingError[] {
  const errors: NexoraDirectorSceneBindingError[] = [];
  const objectIds = new Set<string>();
  const sceneObjectIds = new Set<string>();

  for (const pkg of collection.packages) {
    if (objectIds.has(pkg.objectId)) {
      errors.push(
        err(
          "BINDING_DUPLICATE_OBJECT_ID",
          `Duplicate objectId in collection: ${pkg.objectId}`,
          { objectId: pkg.objectId },
        ),
      );
    }
    objectIds.add(pkg.objectId);

    const sceneObjectId = pkg.sceneObject.sceneObjectId;
    if (sceneObjectIds.has(sceneObjectId)) {
      errors.push(
        err(
          "BINDING_DUPLICATE_SCENE_OBJECT_ID",
          `Duplicate sceneObjectId in collection: ${sceneObjectId}`,
          {
            objectId: pkg.objectId,
            sceneObjectId,
          },
        ),
      );
    }
    sceneObjectIds.add(sceneObjectId);
  }

  return Object.freeze(errors);
}

function assertPackageMatchesBinding(
  binding: NexoraDirectorSceneBinding,
  pkg: NexoraObjectDirectorIntegrationPackage,
): void {
  if (binding.objectId !== pkg.objectId) {
    throwBinding(
      err(
        "BINDING_INVALID",
        "Package objectId does not match binding objectId.",
        {
          bindingId: binding.bindingId,
          objectId: pkg.objectId,
          details: { bindingObjectId: binding.objectId },
        },
      ),
    );
  }
  if (binding.sceneObjectId !== pkg.sceneObject.sceneObjectId) {
    throwBinding(
      err(
        "BINDING_INVALID",
        "Package sceneObjectId does not match binding sceneObjectId.",
        {
          bindingId: binding.bindingId,
          objectId: pkg.objectId,
          sceneObjectId: pkg.sceneObject.sceneObjectId,
          details: { bindingSceneObjectId: binding.sceneObjectId },
        },
      ),
    );
  }
}

function bindCreatedBinding(
  binding: NexoraDirectorSceneBinding,
  deps: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  return withState(binding, "Bound", deps);
}

// ─── Primary binding APIs ─────────────────────────────────────────────────────

export function createDirectorSceneBinding(
  pkg: NexoraObjectDirectorIntegrationPackage,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);
  const sceneObjectId =
    pkg.sceneObject.sceneObjectId ||
    createNexoraDirectorSceneObjectId(pkg.objectId);
  const timestamp = deps.now();

  const binding = deepFreeze({
    bindingId: deps.createBindingId(pkg.objectId, sceneObjectId),
    objectId: pkg.objectId,
    sceneObjectId,
    packageId: pkg.packageId,
    state: "Created" as const,
    generation: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: bindingMetadata(pkg),
  });

  assertDirectorSceneBindingInvariants(binding);
  return binding;
}

export function updateDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
  pkg: NexoraObjectDirectorIntegrationPackage,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);

  if (binding.state === "Removed") {
    throwBinding(
      err(
        "BINDING_REMOVED_CANNOT_REBIND",
        "Removed bindings cannot be updated.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  assertPackageMatchesBinding(binding, pkg);

  const nextGeneration = binding.generation + 1;
  const updated = withState(binding, "Updated", deps, {
    generation: nextGeneration,
    packageId: pkg.packageId,
    metadata: bindingMetadata(pkg),
  });

  assertDirectorSceneBindingInvariants(updated);
  return updated;
}

export function hideDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);

  if (binding.state === "Removed") {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        "Removed bindings cannot be hidden.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  if (binding.state === "Created") {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        "Created bindings must become Bound before hiding.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  if (binding.state === "Hidden") {
    return binding;
  }

  const hidden = withState(binding, "Hidden", deps);
  assertDirectorSceneBindingInvariants(hidden);
  return hidden;
}

export function detachDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);

  if (binding.state === "Removed") {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        "Removed bindings cannot be detached.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  if (binding.state === "Created") {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        "Created bindings must become Bound before detaching.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  if (binding.state === "Detached") {
    return binding;
  }

  const detached = withState(binding, "Detached", deps);
  assertDirectorSceneBindingInvariants(detached);
  return detached;
}

export function removeDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);

  if (binding.state === "Removed") {
    return binding;
  }

  if (binding.state === "Created") {
    throwBinding(
      err(
        "BINDING_INVALID_TRANSITION",
        "Created bindings must become Bound before removal.",
        {
          bindingId: binding.bindingId,
          objectId: binding.objectId,
          sceneObjectId: binding.sceneObjectId,
        },
      ),
    );
  }

  const removed = withState(binding, "Removed", deps);
  assertDirectorSceneBindingInvariants(removed);
  return removed;
}

export function reconcileDirectorSceneBinding(
  existing: NexoraDirectorSceneBinding | undefined,
  pkg: NexoraObjectDirectorIntegrationPackage,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBinding {
  const deps = resolveDeps(dependencies);

  if (!existing) {
    let next = bindCreatedBinding(createDirectorSceneBinding(pkg, deps), deps);
    if (pkg.rendering.updateStrategy === "Remove") {
      return removeDirectorSceneBinding(next, deps);
    }
    if (!pkg.sceneObject.visible || pkg.rendering.updateStrategy === "Hide") {
      next = hideDirectorSceneBinding(next, deps);
    }
    assertDirectorSceneBindingInvariants(next);
    return next;
  }

  if (existing.state === "Removed") {
    throwBinding(
      err(
        "BINDING_REMOVED_CANNOT_REBIND",
        "Removed bindings cannot be reconciled.",
        {
          bindingId: existing.bindingId,
          objectId: existing.objectId,
          sceneObjectId: existing.sceneObjectId,
        },
      ),
    );
  }

  assertPackageMatchesBinding(existing, pkg);

  if (pkg.rendering.updateStrategy === "Remove") {
    return removeDirectorSceneBinding(existing, deps);
  }

  const packageChanged = existing.packageId !== pkg.packageId;
  let next = existing;

  if (packageChanged) {
    next = updateDirectorSceneBinding(existing, pkg, deps);
  } else if (
    existing.state === "Hidden" &&
    pkg.sceneObject.visible
  ) {
    next = withState(existing, "Bound", deps, {
      metadata: bindingMetadata(pkg),
    });
  } else if (
    existing.state === "Detached" &&
    pkg.sceneObject.visible
  ) {
    next = withState(existing, "Bound", deps, {
      metadata: bindingMetadata(pkg),
    });
  } else if (
    existing.state === "Created"
  ) {
    next = bindCreatedBinding(existing, deps);
  }

  if (!pkg.sceneObject.visible || pkg.rendering.updateStrategy === "Hide") {
    if (next.state !== "Hidden" && next.state !== "Removed") {
      next = hideDirectorSceneBinding(next, deps);
    }
  } else if (next.state === "Hidden" && pkg.sceneObject.visible) {
    next = withState(next, "Bound", deps, {
      metadata: bindingMetadata(pkg),
    });
  }

  assertDirectorSceneBindingInvariants(next);
  return next;
}

// ─── Collection binding ───────────────────────────────────────────────────────

export function bindDirectorSceneCollection(
  collection: NexoraObjectDirectorIntegrationCollection,
  previousRegistry?: NexoraDirectorSceneBindingRegistry,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBindingRegistry {
  const deps = resolveDeps(dependencies);
  const collectionErrors = validateCollectionUniqueness(collection);
  if (collectionErrors.length > 0) {
    throwBinding(collectionErrors[0]!);
  }

  const previousByObjectId = new Map<string, NexoraDirectorSceneBinding>();
  if (previousRegistry) {
    for (const binding of previousRegistry.bindings) {
      previousByObjectId.set(binding.objectId, binding);
    }
  }

  const nextObjectIds = new Set(collection.packages.map((pkg) => pkg.objectId));
  const reconciled: NexoraDirectorSceneBinding[] = [];

  for (const pkg of collection.packages) {
    const previous = previousByObjectId.get(pkg.objectId);
    reconciled.push(reconcileDirectorSceneBinding(previous, pkg, deps));
  }

  if (previousRegistry) {
    for (const previous of previousRegistry.bindings) {
      if (nextObjectIds.has(previous.objectId)) continue;
      if (previous.state === "Removed") {
        reconciled.push(previous);
        continue;
      }

      const lastStrategy = previous.metadata.lastUpdateStrategy;
      if (lastStrategy === "Remove") {
        reconciled.push(removeDirectorSceneBinding(previous, deps));
      } else {
        reconciled.push(hideDirectorSceneBinding(previous, deps));
      }
    }
  }

  const registry = buildRegistry(reconciled, collection.sceneOrder, deps);
  const validation = validateDirectorSceneBindingRegistry(registry);
  if (!validation.ok) {
    throwBinding(validation.errors[0]!);
  }
  return registry;
}

export function reconcileDirectorSceneBindingRegistry(
  registry: NexoraDirectorSceneBindingRegistry,
  collection: NexoraObjectDirectorIntegrationCollection,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBindingRegistry {
  return bindDirectorSceneCollection(collection, registry, dependencies);
}

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function findBindingByObjectId(
  registry: NexoraDirectorSceneBindingRegistry,
  objectId: string,
): NexoraDirectorSceneBinding | undefined {
  return registry.bindings.find((binding) => binding.objectId === objectId);
}

export function findBindingBySceneObjectId(
  registry: NexoraDirectorSceneBindingRegistry,
  sceneObjectId: string,
): NexoraDirectorSceneBinding | undefined {
  return registry.bindings.find(
    (binding) => binding.sceneObjectId === sceneObjectId,
  );
}

export function findBindingByBindingId(
  registry: NexoraDirectorSceneBindingRegistry,
  bindingId: string,
): NexoraDirectorSceneBinding | undefined {
  return registry.bindings.find((binding) => binding.bindingId === bindingId);
}

export function hasBinding(
  registry: NexoraDirectorSceneBindingRegistry,
  objectId: string,
): boolean {
  const binding = findBindingByObjectId(registry, objectId);
  return binding !== undefined && binding.state !== "Removed";
}

export function listBindings(
  registry: NexoraDirectorSceneBindingRegistry,
): readonly NexoraDirectorSceneBinding[] {
  return registry.bindings;
}

// ─── Diff ─────────────────────────────────────────────────────────────────────

export function calculateDirectorSceneBindingDiff(
  previous: NexoraDirectorSceneBindingRegistry,
  next: NexoraDirectorSceneBindingRegistry,
): NexoraDirectorSceneBindingDiff {
  const previousById = new Map(
    previous.bindings.map((binding) => [binding.bindingId, binding]),
  );
  const nextById = new Map(
    next.bindings.map((binding) => [binding.bindingId, binding]),
  );

  const created: NexoraDirectorSceneBinding[] = [];
  const updated: NexoraDirectorSceneBinding[] = [];
  const hidden: NexoraDirectorSceneBinding[] = [];
  const detached: NexoraDirectorSceneBinding[] = [];
  const removed: NexoraDirectorSceneBinding[] = [];
  const unchanged: NexoraDirectorSceneBinding[] = [];

  for (const [bindingId, nextBinding] of nextById) {
    const prevBinding = previousById.get(bindingId);
    if (!prevBinding) {
      created.push(nextBinding);
      continue;
    }

    const stateChanged = prevBinding.state !== nextBinding.state;
    const generationChanged = prevBinding.generation !== nextBinding.generation;

    if (
      nextBinding.state === "Removed" &&
      (prevBinding.state !== "Removed" || !previousById.has(bindingId))
    ) {
      removed.push(nextBinding);
    } else if (
      nextBinding.state === "Hidden" &&
      (prevBinding.state !== "Hidden" || stateChanged)
    ) {
      hidden.push(nextBinding);
    } else if (
      nextBinding.state === "Detached" &&
      prevBinding.state !== "Detached"
    ) {
      detached.push(nextBinding);
    } else if (
      generationChanged ||
      (nextBinding.state === "Updated" && prevBinding.state !== "Updated")
    ) {
      updated.push(nextBinding);
    } else if (
      !stateChanged &&
      !generationChanged &&
      prevBinding.packageId === nextBinding.packageId
    ) {
      unchanged.push(nextBinding);
    } else {
      updated.push(nextBinding);
    }
  }

  for (const [bindingId, prevBinding] of previousById) {
    if (!nextById.has(bindingId) && prevBinding.state === "Removed") {
      removed.push(prevBinding);
    }
  }

  return deepFreeze({
    created: Object.freeze(created),
    updated: Object.freeze(updated),
    hidden: Object.freeze(hidden),
    detached: Object.freeze(detached),
    removed: Object.freeze(removed),
    unchanged: Object.freeze(unchanged),
  });
}

// ─── Snapshots ────────────────────────────────────────────────────────────────

export function createDirectorSceneBindingSnapshot(
  registry: NexoraDirectorSceneBindingRegistry,
  dependencies?: NexoraDirectorSceneBindingDependencies,
): NexoraDirectorSceneBindingSnapshot {
  const deps = resolveDeps(dependencies);
  const validation = validateDirectorSceneBindingRegistry(registry);
  if (!validation.ok) {
    throwBinding(validation.errors[0]!);
  }
  return deepFreeze({
    snapshotId: deps.createSnapshotId(),
    registry,
    createdAt: deps.now(),
  });
}

export function compareDirectorSceneBindingSnapshots(
  left: NexoraDirectorSceneBindingSnapshot,
  right: NexoraDirectorSceneBindingSnapshot,
): NexoraDirectorSceneBindingSnapshotComparison {
  const diff = calculateDirectorSceneBindingDiff(left.registry, right.registry);

  const leftById = new Map(
    left.registry.bindings.map((binding) => [binding.bindingId, binding]),
  );
  const rightById = new Map(
    right.registry.bindings.map((binding) => [binding.bindingId, binding]),
  );

  const newBindings = diff.created.map((binding) => binding.bindingId);
  const removedBindings = diff.removed.map((binding) => binding.bindingId);
  const hiddenBindings = diff.hidden.map((binding) => binding.bindingId);

  const updatedGenerations: {
    bindingId: string;
    from: number;
    to: number;
  }[] = [];

  const stateTransitions: {
    bindingId: string;
    from: NexoraDirectorSceneBindingState;
    to: NexoraDirectorSceneBindingState;
  }[] = [];

  for (const [bindingId, rightBinding] of rightById) {
    const leftBinding = leftById.get(bindingId);
    if (!leftBinding) continue;
    if (leftBinding.generation !== rightBinding.generation) {
      updatedGenerations.push({
        bindingId,
        from: leftBinding.generation,
        to: rightBinding.generation,
      });
    }
    if (leftBinding.state !== rightBinding.state) {
      stateTransitions.push({
        bindingId,
        from: leftBinding.state,
        to: rightBinding.state,
      });
    }
  }

  return deepFreeze({
    newBindings: Object.freeze(newBindings),
    removedBindings: Object.freeze(removedBindings),
    hiddenBindings: Object.freeze(hiddenBindings),
    updatedGenerations: Object.freeze(updatedGenerations),
    stateTransitions: Object.freeze(stateTransitions),
  });
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
): NexoraDirectorSceneBindingValidationResult {
  const errors: NexoraDirectorSceneBindingError[] = [];
  const { bindingId, objectId, sceneObjectId } = binding;

  if (!bindingId) {
    errors.push(
      err("BINDING_INVALID", "bindingId must be non-empty.", { bindingId }),
    );
  }
  if (!objectId) {
    errors.push(err("BINDING_INVALID", "objectId must be non-empty.", { bindingId }));
  }
  if (!sceneObjectId) {
    errors.push(
      err("BINDING_INVALID", "sceneObjectId must be non-empty.", {
        bindingId,
        objectId,
      }),
    );
  }
  if (!binding.packageId) {
    errors.push(
      err("BINDING_INVALID", "packageId must be non-empty.", {
        bindingId,
        objectId,
        sceneObjectId,
      }),
    );
  }
  if (!(VALID_BINDING_STATES as readonly string[]).includes(binding.state)) {
    errors.push(
      err("BINDING_INVALID", `Invalid binding state: ${String(binding.state)}.`, {
        bindingId,
        objectId,
        sceneObjectId,
      }),
    );
  }
  if (
    !Number.isInteger(binding.generation) ||
    binding.generation < 1
  ) {
    errors.push(
      err("BINDING_INVALID", "generation must be a positive integer.", {
        bindingId,
        objectId,
        sceneObjectId,
        details: { generation: binding.generation },
      }),
    );
  }
  if (
    objectId &&
    sceneObjectId !== createNexoraDirectorSceneObjectId(objectId)
  ) {
    errors.push(
      err(
        "BINDING_INVALID",
        "sceneObjectId must be deterministic for objectId.",
        { bindingId, objectId, sceneObjectId },
      ),
    );
  }
  if (!binding.createdAt || !binding.updatedAt) {
    errors.push(
      err("BINDING_INVALID", "createdAt and updatedAt are required.", {
        bindingId,
        objectId,
        sceneObjectId,
      }),
    );
  }
  if (!isDeeplyFrozen(binding)) {
    errors.push(
      err("BINDING_INVARIANT_VIOLATION", "Binding must be deeply immutable.", {
        bindingId,
        objectId,
        sceneObjectId,
      }),
    );
  }
  if (!isJsonSafe(binding.metadata)) {
    errors.push(
      err("BINDING_INVALID", "metadata must be JSON-safe.", {
        bindingId,
        objectId,
        sceneObjectId,
      }),
    );
  }

  return errors.length === 0
    ? { ok: true }
    : { ok: false, errors: Object.freeze(errors) };
}

export function validateDirectorSceneBindingRegistry(
  registry: NexoraDirectorSceneBindingRegistry,
): NexoraDirectorSceneBindingValidationResult {
  const errors: NexoraDirectorSceneBindingError[] = [];

  if (!registry.registryId) {
    errors.push(
      err("BINDING_INVALID", "registryId must be non-empty."),
    );
  }

  const bindingIds = new Set<string>();
  const activeObjectIds = new Set<string>();
  const activeSceneObjectIds = new Set<string>();

  for (const binding of registry.bindings) {
    const result = validateDirectorSceneBinding(binding);
    if (!result.ok) {
      errors.push(...result.errors);
    }

    if (bindingIds.has(binding.bindingId)) {
      errors.push(
        err(
          "BINDING_DUPLICATE_BINDING_ID",
          `Duplicate bindingId: ${binding.bindingId}`,
          { bindingId: binding.bindingId, objectId: binding.objectId },
        ),
      );
    }
    bindingIds.add(binding.bindingId);

    if (binding.state !== "Removed") {
      if (activeObjectIds.has(binding.objectId)) {
        errors.push(
          err(
            "BINDING_DUPLICATE_OBJECT_ID",
            `Duplicate active objectId: ${binding.objectId}`,
            { objectId: binding.objectId, bindingId: binding.bindingId },
          ),
        );
      }
      activeObjectIds.add(binding.objectId);

      if (activeSceneObjectIds.has(binding.sceneObjectId)) {
        errors.push(
          err(
            "BINDING_DUPLICATE_SCENE_OBJECT_ID",
            `Duplicate active sceneObjectId: ${binding.sceneObjectId}`,
            {
              sceneObjectId: binding.sceneObjectId,
              objectId: binding.objectId,
              bindingId: binding.bindingId,
            },
          ),
        );
      }
      activeSceneObjectIds.add(binding.sceneObjectId);
    }
  }

  if (!isDeeplyFrozen(registry)) {
    errors.push(
      err(
        "BINDING_INVARIANT_VIOLATION",
        "Binding registry must be deeply immutable.",
      ),
    );
  }

  return errors.length === 0
    ? { ok: true }
    : { ok: false, errors: Object.freeze(errors) };
}

export function assertDirectorSceneBindingInvariants(
  binding: NexoraDirectorSceneBinding,
): void {
  const result = validateDirectorSceneBinding(binding);
  if (!result.ok) {
    throwBinding(result.errors[0]!);
  }
}

// ─── Serialization ────────────────────────────────────────────────────────────

export function serializeDirectorSceneBinding(
  binding: NexoraDirectorSceneBinding,
): string {
  assertDirectorSceneBindingInvariants(binding);
  return JSON.stringify({
    identity: directorSceneBindingModelIdentity,
    version: directorSceneBindingModelVersion,
    schemaVersion: directorSceneBindingSchemaVersion,
    binding,
  });
}

export function deserializeDirectorSceneBinding(
  json: string,
): NexoraDirectorSceneBinding {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly binding?: NexoraDirectorSceneBinding;
  };
  if (parsed.schemaVersion !== directorSceneBindingSchemaVersion) {
    throwBinding(
      err(
        "BINDING_UNSUPPORTED_SCHEMA",
        `Unsupported director scene binding schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.binding) {
    throwBinding(
      err(
        "BINDING_INVALID",
        "Missing director scene binding payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.binding);
  assertDirectorSceneBindingInvariants(restored);
  return restored;
}

export function serializeDirectorSceneBindingRegistry(
  registry: NexoraDirectorSceneBindingRegistry,
): string {
  const validation = validateDirectorSceneBindingRegistry(registry);
  if (!validation.ok) {
    throwBinding(validation.errors[0]!);
  }
  return JSON.stringify({
    identity: directorSceneBindingModelIdentity,
    version: directorSceneBindingModelVersion,
    schemaVersion: directorSceneBindingSchemaVersion,
    registry,
  });
}

export function deserializeDirectorSceneBindingRegistry(
  json: string,
): NexoraDirectorSceneBindingRegistry {
  const parsed = JSON.parse(json) as {
    readonly schemaVersion?: string;
    readonly registry?: NexoraDirectorSceneBindingRegistry;
  };
  if (parsed.schemaVersion !== directorSceneBindingSchemaVersion) {
    throwBinding(
      err(
        "BINDING_UNSUPPORTED_SCHEMA",
        `Unsupported director scene binding schema: ${String(parsed.schemaVersion)}`,
      ),
    );
  }
  if (!parsed.registry) {
    throwBinding(
      err(
        "BINDING_INVALID",
        "Missing director scene binding registry payload.",
      ),
    );
  }
  const restored = deepFreeze(parsed.registry);
  const validation = validateDirectorSceneBindingRegistry(restored);
  if (!validation.ok) {
    throwBinding(validation.errors[0]!);
  }
  return restored;
}

export function getNexoraDirectorSceneBindingModelSummary() {
  return Object.freeze({
    identity: directorSceneBindingModelIdentity,
    version: directorSceneBindingModelVersion,
    schemaVersion: directorSceneBindingSchemaVersion,
    upstream: NOL_DIRECTOR_SCENE_BINDING_UPSTREAM,
    frameworkIndependent: true,
    rendererIndependent: true,
    noRuntimeMutation: true,
  });
}

export const NexoraDirectorSceneBindingModel = Object.freeze({
  identity: directorSceneBindingModelIdentity,
  version: directorSceneBindingModelVersion,
  schemaVersion: directorSceneBindingSchemaVersion,
  createDirectorSceneBinding,
  updateDirectorSceneBinding,
  hideDirectorSceneBinding,
  detachDirectorSceneBinding,
  removeDirectorSceneBinding,
  reconcileDirectorSceneBinding,
  bindDirectorSceneCollection,
  reconcileDirectorSceneBindingRegistry,
  findBindingByObjectId,
  findBindingBySceneObjectId,
  findBindingByBindingId,
  hasBinding,
  listBindings,
  calculateDirectorSceneBindingDiff,
  createDirectorSceneBindingSnapshot,
  compareDirectorSceneBindingSnapshots,
  validateDirectorSceneBinding,
  validateDirectorSceneBindingRegistry,
  assertDirectorSceneBindingInvariants,
  serializeDirectorSceneBinding,
  deserializeDirectorSceneBinding,
  serializeDirectorSceneBindingRegistry,
  deserializeDirectorSceneBindingRegistry,
  summary: getNexoraDirectorSceneBindingModelSummary,
});
