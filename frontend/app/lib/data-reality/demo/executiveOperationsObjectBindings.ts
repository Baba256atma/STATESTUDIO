/**
 * P0:2 — Executive Operations canonical object binding registry.
 *
 * Same registry is shared by Dataset A (baseline) and Dataset B
 * (operational-pressure). Only data values differ across scenarios.
 *
 * Stage must never import this module.
 *
 * NOL limitation: Public Index exposes NexoraObjectIdentity / createNexoraObject
 * but no global business-object registry. Canonical ids below are stable
 * Data Reality → NOL identity.id values validated structurally via Public Index.
 *
 * MVP Stage alignment (documentation only — Stage unchanged in P0:2):
 *   objectKey     | nexoraObjectId                              | mvpStageObjectId | alignment
 *   revenue       | nexora.executive-operations.object.revenue  | obj-revenue      | exact label match
 *   cost          | nexora.executive-operations.object.cost     | (none)           | missing — Budget ≠ Cost
 *   production    | nexora.executive-operations.object.production | obj-capacity   | semantic approximate
 *   warehouse     | nexora.executive-operations.object.warehouse | obj-inventory   | semantic approximate
 *   shipping      | nexora.executive-operations.object.shipping | obj-delivery     | semantic approximate
 *   customer      | nexora.executive-operations.object.customer | obj-customer     | exact label match
 */

import type {
  NexoraObjectDataBinding,
  NexoraResolvedObjectDataBinding,
} from "../dataRealityContracts.ts";
import {
  validateAndResolveObjectDataBindings,
  type NexoraObjectBindingRegistryValidationResult,
} from "../objectDataBinding.ts";

/** Expected demo objectKeys — kept local to avoid circular demo imports. */
const EXPECTED_OBJECT_KEYS = Object.freeze([
  "revenue",
  "cost",
  "production",
  "warehouse",
  "shipping",
  "customer",
] as const);

export type ExecutiveOperationsMvpStageAlignment =
  | "exact"
  | "semantic-approximate"
  | "missing";

/** Documented projection toward current NEX-MVP Stage fixtures. Not used by binding. */
export type ExecutiveOperationsObjectIdentityMap = {
  readonly objectKey: string;
  readonly caption: string;
  readonly nexoraObjectId: string;
  readonly mvpStageObjectId: string | null;
  readonly mvpAlignment: ExecutiveOperationsMvpStageAlignment;
};

export const EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP: readonly ExecutiveOperationsObjectIdentityMap[] =
  Object.freeze([
    Object.freeze({
      objectKey: "revenue",
      caption: "Revenue",
      nexoraObjectId: "nexora.executive-operations.object.revenue",
      mvpStageObjectId: "obj-revenue",
      mvpAlignment: "exact" as const,
    }),
    Object.freeze({
      objectKey: "cost",
      caption: "Cost",
      nexoraObjectId: "nexora.executive-operations.object.cost",
      mvpStageObjectId: null,
      mvpAlignment: "missing" as const,
    }),
    Object.freeze({
      objectKey: "production",
      caption: "Production",
      nexoraObjectId: "nexora.executive-operations.object.production",
      mvpStageObjectId: "obj-capacity",
      mvpAlignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "warehouse",
      caption: "Warehouse",
      nexoraObjectId: "nexora.executive-operations.object.warehouse",
      mvpStageObjectId: "obj-inventory",
      mvpAlignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "shipping",
      caption: "Shipping",
      nexoraObjectId: "nexora.executive-operations.object.shipping",
      mvpStageObjectId: "obj-delivery",
      mvpAlignment: "semantic-approximate" as const,
    }),
    Object.freeze({
      objectKey: "customer",
      caption: "Customer",
      nexoraObjectId: "nexora.executive-operations.object.customer",
      mvpStageObjectId: "obj-customer",
      mvpAlignment: "exact" as const,
    }),
  ]);

/**
 * Canonical resolved bindings for Executive Operations.
 * Immutable. Shared by Dataset A and Dataset B.
 */
export const EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS: readonly NexoraResolvedObjectDataBinding[] =
  Object.freeze([
    Object.freeze({
      objectKey: "revenue",
      nexoraObjectId: "nexora.executive-operations.object.revenue",
      metricKeys: Object.freeze(["currentRevenue", "previousRevenue"]),
    }),
    Object.freeze({
      objectKey: "cost",
      nexoraObjectId: "nexora.executive-operations.object.cost",
      metricKeys: Object.freeze(["operatingCost"]),
    }),
    Object.freeze({
      objectKey: "production",
      nexoraObjectId: "nexora.executive-operations.object.production",
      metricKeys: Object.freeze(["usedCapacity", "totalCapacity"]),
    }),
    Object.freeze({
      objectKey: "warehouse",
      nexoraObjectId: "nexora.executive-operations.object.warehouse",
      metricKeys: Object.freeze(["usedCapacity", "totalCapacity"]),
    }),
    Object.freeze({
      objectKey: "shipping",
      nexoraObjectId: "nexora.executive-operations.object.shipping",
      metricKeys: Object.freeze(["onTimeDeliveries", "totalDeliveries"]),
    }),
    Object.freeze({
      objectKey: "customer",
      nexoraObjectId: "nexora.executive-operations.object.customer",
      metricKeys: Object.freeze([
        "satisfactionScore",
        "maximumSatisfactionScore",
      ]),
    }),
  ]);

/** Definition-form view (includes nexoraObjectId) for P0:1-compatible accessors. */
export const EXECUTIVE_OPERATIONS_OBJECT_BINDINGS: readonly NexoraObjectDataBinding[] =
  EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS;

export function getExecutiveOperationsResolvedObjectBindings(): readonly NexoraResolvedObjectDataBinding[] {
  return EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS;
}

export function getExecutiveOperationsObjectBindings(): readonly NexoraObjectDataBinding[] {
  return EXECUTIVE_OPERATIONS_OBJECT_BINDINGS;
}

export function getExecutiveOperationsObjectIdentityMap(): readonly ExecutiveOperationsObjectIdentityMap[] {
  return EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP;
}

export function validateExecutiveOperationsObjectBindings(): NexoraObjectBindingRegistryValidationResult {
  const result = validateAndResolveObjectDataBindings(
    EXECUTIVE_OPERATIONS_OBJECT_BINDINGS,
  );
  const keySet = new Set<string>(EXPECTED_OBJECT_KEYS);
  const issues = [...result.issues];

  for (const binding of EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS) {
    if (!keySet.has(binding.objectKey)) {
      issues.push(
        Object.freeze({
          code: "UNKNOWN_OBJECT_KEY" as const,
          message: `Resolved binding objectKey "${binding.objectKey}" is not in the demo object catalog.`,
          objectKey: binding.objectKey,
        }),
      );
    }
  }

  for (const expected of EXPECTED_OBJECT_KEYS) {
    if (
      !EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.some(
        (binding) => binding.objectKey === expected,
      )
    ) {
      issues.push(
        Object.freeze({
          code: "UNKNOWN_OBJECT_KEY" as const,
          message: `Expected demo objectKey "${expected}" is missing from the binding registry.`,
          objectKey: expected,
        }),
      );
    }
  }

  if (
    EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.length !==
    EXPECTED_OBJECT_KEYS.length
  ) {
    issues.push(
      Object.freeze({
        code: "UNKNOWN_OBJECT_KEY" as const,
        message:
          "Resolved binding count does not match Executive Operations object catalog size.",
      }),
    );
  }

  return Object.freeze({
    ok: issues.length === 0,
    resolved: result.resolved,
    issues: Object.freeze(issues),
  });
}

export function countExecutiveOperationsOwnedMetrics(): number {
  return EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.reduce(
    (total, binding) => total + binding.metricKeys.length,
    0,
  );
}
