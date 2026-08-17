/**
 * P0:2 — Dataset → NexoraObject Binding.
 *
 * Deterministic attribution of business facts to canonical NOL identities.
 *
 * Chain for this phase:
 *   Dataset → Business Facts → Canonical NexoraObject Binding
 *
 * No KPI computation. No executive-state resolution. No Stage mutation.
 *
 * NOL identity is consumed only via the approved Public Index surface.
 * There is no global NOL object registry — IDs are validated structurally
 * against the NexoraObjectIdentity.id contract (non-empty string).
 */

import {
  universalNexoraObjectPublicIndex,
  type NexoraObjectIdentity,
  type NexoraObjectType,
} from "../nol/universalNexoraObjectPublicIndex.ts";

import type {
  NexoraBoundBusinessFact,
  NexoraBusinessFact,
  NexoraObjectDataBinding,
  NexoraResolvedObjectDataBinding,
} from "./dataRealityContracts.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const objectDataBindingIdentity =
  "P0:2/NexoraObjectDataBinding" as const;

export const objectDataBindingVersion = "1.0.0" as const;

export const objectDataBindingNamespace =
  "nexora.data-reality.object-binding" as const;

export const objectDataBindingPhase = "DatasetNexoraObjectBinding" as const;

export const objectDataBindingArchitecturalRole =
  "DeterministicBusinessFactToNexoraObjectAttribution" as const;

export const OBJECT_DATA_BINDING_BOUNDARY = Object.freeze({
  architecturalRole: objectDataBindingArchitecturalRole,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  ownsStageMutation: false as const,
  ownsThreeJs: false as const,
  ownsReactState: false as const,
  duplicatesNexoraObjectModel: false as const,
  consumesNolPublicIndexOnly: true as const,
  nolPublicImportPath:
    "@/app/lib/nol/universalNexoraObjectPublicIndex" as const,
  nolIdentityType: "NexoraObjectIdentity.id" as const,
  globalNolObjectRegistryAvailable: false as const,
  datasetABShareSameBindings: true as const,
});

export type NexoraObjectDataBindingIdentity = {
  readonly id: typeof objectDataBindingIdentity;
  readonly version: typeof objectDataBindingVersion;
  readonly namespace: typeof objectDataBindingNamespace;
  readonly phase: typeof objectDataBindingPhase;
  readonly architecturalRole: typeof objectDataBindingArchitecturalRole;
};

const IDENTITY: NexoraObjectDataBindingIdentity = Object.freeze({
  id: objectDataBindingIdentity,
  version: objectDataBindingVersion,
  namespace: objectDataBindingNamespace,
  phase: objectDataBindingPhase,
  architecturalRole: objectDataBindingArchitecturalRole,
});

export function getObjectDataBindingIdentity(): NexoraObjectDataBindingIdentity {
  return IDENTITY;
}

// ─── Issue / result contracts ───────────────────────────────────────────────

export const NEXORA_OBJECT_BINDING_ISSUE_CODES = Object.freeze([
  "UNKNOWN_OBJECT_KEY",
  "UNKNOWN_METRIC_KEY",
  "DUPLICATE_OBJECT_BINDING",
  "METRIC_OWNERSHIP_CONFLICT",
  "MISSING_NEXORA_OBJECT_ID",
  "INVALID_NEXORA_OBJECT_ID",
  "UNBOUND_BUSINESS_FACT",
] as const);

export type NexoraObjectBindingIssueCode =
  (typeof NEXORA_OBJECT_BINDING_ISSUE_CODES)[number];

export type NexoraObjectBindingIssue = {
  readonly code: NexoraObjectBindingIssueCode;
  readonly message: string;
  readonly objectKey?: string;
  readonly metricKey?: string;
  readonly nexoraObjectId?: string;
  readonly path?: string;
};

export type NexoraObjectBindingResult = {
  readonly status: "bound" | "invalid";
  readonly boundFacts: readonly NexoraBoundBusinessFact[];
  readonly issues: readonly NexoraObjectBindingIssue[];
};

export type NexoraObjectBindingRegistryValidationResult = {
  readonly ok: boolean;
  readonly resolved: readonly NexoraResolvedObjectDataBinding[];
  readonly issues: readonly NexoraObjectBindingIssue[];
};

function bindingIssue(
  code: NexoraObjectBindingIssueCode,
  message: string,
  extras?: Omit<NexoraObjectBindingIssue, "code" | "message">,
): NexoraObjectBindingIssue {
  return Object.freeze({
    code,
    message,
    ...extras,
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Structural NOL identity.id validation via Public Index contract.
 * NOL exposes no global business-object registry — cannot look up live objects.
 */
export function isValidNexoraObjectIdentityId(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false;
  // Mirror NOL createNexoraObject requireNonEmpty(identity.id).
  try {
    const create =
      universalNexoraObjectPublicIndex.objectContracts.createNexoraObject;
    const probe = create({
      id: value.trim(),
      type: "Custom" as NexoraObjectType,
      caption: "DataRealityIdentityProbe",
      createdAt: "1970-01-01T00:00:00.000Z",
    });
    const identity: NexoraObjectIdentity = probe.identity;
    return identity.id === value.trim();
  } catch {
    return false;
  }
}

function ownershipKey(objectKey: string, metricKey: string): string {
  return `${objectKey}\u0000${metricKey}`;
}

/**
 * Validate and resolve a binding registry.
 * Ensures unique objectKeys, unique (objectKey, metricKey) ownership,
 * and structurally valid NOL identity ids.
 */
export function validateAndResolveObjectDataBindings(
  bindings: readonly NexoraObjectDataBinding[],
): NexoraObjectBindingRegistryValidationResult {
  const issues: NexoraObjectBindingIssue[] = [];
  const seenObjectKeys = new Map<string, number>();
  const seenOwnership = new Map<string, string>();
  const resolved: NexoraResolvedObjectDataBinding[] = [];

  for (let i = 0; i < bindings.length; i += 1) {
    const binding = bindings[i]!;
    const path = `bindings[${i}]`;

    if (!isNonEmptyString(binding.objectKey)) {
      issues.push(
        bindingIssue("UNKNOWN_OBJECT_KEY", "Binding is missing objectKey.", {
          path,
        }),
      );
      continue;
    }

    const priorIndex = seenObjectKeys.get(binding.objectKey);
    if (priorIndex !== undefined) {
      issues.push(
        bindingIssue(
          "DUPLICATE_OBJECT_BINDING",
          `Duplicate object binding for objectKey "${binding.objectKey}".`,
          { objectKey: binding.objectKey, path },
        ),
      );
    } else {
      seenObjectKeys.set(binding.objectKey, i);
    }

    if (!isNonEmptyString(binding.nexoraObjectId)) {
      issues.push(
        bindingIssue(
          "MISSING_NEXORA_OBJECT_ID",
          `Binding for "${binding.objectKey}" is missing nexoraObjectId.`,
          { objectKey: binding.objectKey, path: `${path}.nexoraObjectId` },
        ),
      );
    } else if (!isValidNexoraObjectIdentityId(binding.nexoraObjectId)) {
      issues.push(
        bindingIssue(
          "INVALID_NEXORA_OBJECT_ID",
          `Binding for "${binding.objectKey}" has invalid nexoraObjectId.`,
          {
            objectKey: binding.objectKey,
            nexoraObjectId: binding.nexoraObjectId,
            path: `${path}.nexoraObjectId`,
          },
        ),
      );
    }

    if (!Array.isArray(binding.metricKeys) || binding.metricKeys.length === 0) {
      issues.push(
        bindingIssue(
          "UNKNOWN_METRIC_KEY",
          `Binding for "${binding.objectKey}" has no metricKeys.`,
          { objectKey: binding.objectKey, path: `${path}.metricKeys` },
        ),
      );
      continue;
    }

    for (const metricKey of binding.metricKeys) {
      if (!isNonEmptyString(metricKey)) {
        issues.push(
          bindingIssue(
            "UNKNOWN_METRIC_KEY",
            `Binding for "${binding.objectKey}" contains an empty metricKey.`,
            { objectKey: binding.objectKey, path: `${path}.metricKeys` },
          ),
        );
        continue;
      }
      const key = ownershipKey(binding.objectKey, metricKey);
      const priorOwner = seenOwnership.get(key);
      if (priorOwner !== undefined) {
        issues.push(
          bindingIssue(
            "METRIC_OWNERSHIP_CONFLICT",
            `Metric "${binding.objectKey}.${metricKey}" is owned more than once.`,
            { objectKey: binding.objectKey, metricKey, path },
          ),
        );
      } else {
        seenOwnership.set(key, binding.objectKey);
      }
    }

    if (
      isNonEmptyString(binding.nexoraObjectId) &&
      isValidNexoraObjectIdentityId(binding.nexoraObjectId) &&
      priorIndex === undefined
    ) {
      resolved.push(
        Object.freeze({
          objectKey: binding.objectKey,
          nexoraObjectId: binding.nexoraObjectId.trim(),
          metricKeys: Object.freeze([...binding.metricKeys]),
        }),
      );
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    resolved: Object.freeze(resolved),
    issues: Object.freeze(issues),
  });
}

export function resolveNexoraObjectBinding(
  objectKey: string,
  bindings: readonly NexoraResolvedObjectDataBinding[],
): NexoraResolvedObjectDataBinding | null {
  if (!isNonEmptyString(objectKey)) return null;
  return bindings.find((binding) => binding.objectKey === objectKey) ?? null;
}

export function bindBusinessFactToNexoraObject(
  fact: NexoraBusinessFact,
  bindings: readonly NexoraResolvedObjectDataBinding[],
): NexoraObjectBindingResult {
  return bindBusinessFactsToNexoraObjects([fact], bindings);
}

/**
 * Deterministically bind facts to canonical NexoraObjects.
 * Exact match only: objectKey + metricKey ∈ binding.metricKeys.
 * Does not mutate input facts or the registry.
 */
export function bindBusinessFactsToNexoraObjects(
  facts: readonly NexoraBusinessFact[],
  bindings: readonly NexoraResolvedObjectDataBinding[],
): NexoraObjectBindingResult {
  const issues: NexoraObjectBindingIssue[] = [];
  const boundFacts: NexoraBoundBusinessFact[] = [];
  const byObjectKey = new Map<string, NexoraResolvedObjectDataBinding>();

  for (const binding of bindings) {
    byObjectKey.set(binding.objectKey, binding);
  }

  for (let i = 0; i < facts.length; i += 1) {
    const fact = facts[i]!;
    const path = `facts[${i}]`;

    if (!isNonEmptyString(fact.objectKey)) {
      issues.push(
        bindingIssue(
          "UNKNOWN_OBJECT_KEY",
          "Business fact is missing objectKey.",
          { path },
        ),
      );
      issues.push(
        bindingIssue(
          "UNBOUND_BUSINESS_FACT",
          "Business fact could not be bound to a NexoraObject.",
          { path, metricKey: fact.metricKey },
        ),
      );
      continue;
    }

    const binding = byObjectKey.get(fact.objectKey);
    if (!binding) {
      issues.push(
        bindingIssue(
          "UNKNOWN_OBJECT_KEY",
          `No binding registry entry for objectKey "${fact.objectKey}".`,
          { objectKey: fact.objectKey, metricKey: fact.metricKey, path },
        ),
      );
      issues.push(
        bindingIssue(
          "UNBOUND_BUSINESS_FACT",
          `Fact ${fact.objectKey}.${fact.metricKey} is unbound.`,
          {
            objectKey: fact.objectKey,
            metricKey: fact.metricKey,
            path,
          },
        ),
      );
      continue;
    }

    if (!isNonEmptyString(fact.metricKey)) {
      issues.push(
        bindingIssue(
          "UNKNOWN_METRIC_KEY",
          `Fact on "${fact.objectKey}" is missing metricKey.`,
          { objectKey: fact.objectKey, path },
        ),
      );
      issues.push(
        bindingIssue(
          "UNBOUND_BUSINESS_FACT",
          `Fact on "${fact.objectKey}" is unbound due to missing metricKey.`,
          { objectKey: fact.objectKey, path },
        ),
      );
      continue;
    }

    if (!binding.metricKeys.includes(fact.metricKey)) {
      issues.push(
        bindingIssue(
          "UNKNOWN_METRIC_KEY",
          `Metric "${fact.metricKey}" is not owned by objectKey "${fact.objectKey}".`,
          {
            objectKey: fact.objectKey,
            metricKey: fact.metricKey,
            nexoraObjectId: binding.nexoraObjectId,
            path,
          },
        ),
      );
      issues.push(
        bindingIssue(
          "UNBOUND_BUSINESS_FACT",
          `Fact ${fact.objectKey}.${fact.metricKey} is unbound.`,
          {
            objectKey: fact.objectKey,
            metricKey: fact.metricKey,
            nexoraObjectId: binding.nexoraObjectId,
            path,
          },
        ),
      );
      continue;
    }

    boundFacts.push(
      Object.freeze({
        objectKey: fact.objectKey,
        metricKey: fact.metricKey,
        value: fact.value,
        sourceDatasetId: fact.sourceDatasetId,
        nexoraObjectId: binding.nexoraObjectId,
        ...(fact.unit !== undefined ? { unit: fact.unit } : {}),
      }),
    );
  }

  return Object.freeze({
    status: issues.length === 0 ? "bound" : "invalid",
    boundFacts: Object.freeze(boundFacts),
    issues: Object.freeze(issues),
  });
}

export type {
  NexoraBoundBusinessFact,
  NexoraResolvedObjectDataBinding,
} from "./dataRealityContracts.ts";
