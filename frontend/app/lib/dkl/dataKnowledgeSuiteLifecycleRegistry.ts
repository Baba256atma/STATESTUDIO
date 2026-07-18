/**
 * DKL-9:2 — Data Knowledge Suite Lifecycle Registry.
 *
 * Registers suite lifecycle states/transitions and registry guarantees.
 * Lifecycle derived from Foundation; guarantees are Registry-owned metadata.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

import { DataKnowledgeSuiteFoundationPlatform } from "./dataKnowledgeSuiteFoundation.ts";
import type {
  DataKnowledgeSuiteGuarantee,
  DataKnowledgeSuiteRegistryEntryBase,
} from "./dataKnowledgeSuiteRegistryTypes.ts";

const foundation = DataKnowledgeSuiteFoundationPlatform;
const lifecycle = foundation.lifecycle;

export interface DataKnowledgeSuiteLifecycleStateRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly state: (typeof lifecycle.states)[number];
  readonly lifecycleReference: typeof lifecycle;
  readonly preservesCanonicalReference: true;
}

/** Lifecycle state registrations from Foundation lifecycle.states. */
export const DataKnowledgeSuiteLifecycleStateRegistry: readonly DataKnowledgeSuiteLifecycleStateRegistration[] =
  Object.freeze(
    lifecycle.states.map((state, index) =>
      Object.freeze({
        id: `DKL-9:2/LifecycleState/${state}`,
        name: state,
        state,
        lifecycleReference: lifecycle,
        preservesCanonicalReference: true as const,
        deterministicOrder: index + 1,
        metadataOnly: true as const,
        immutable: true as const,
        runtimeBehavior: "None" as const,
      }),
    ),
  );

/** Canonical lifecycle aggregate preserved by Foundation reference. */
export const DataKnowledgeSuiteLifecycleAggregate = Object.freeze({
  lifecycle,
  stateCount: lifecycle.stateCount,
  currentState: lifecycle.currentState,
  transitions: lifecycle.transitions,
  preservedByReference: true as const,
});

const guarantee = (
  order: number,
  statement: string,
): DataKnowledgeSuiteGuarantee =>
  Object.freeze({
    guaranteeId: `DKL-9:2/Guarantee/${String(order).padStart(2, "0")}`,
    statement,
    status: "Guaranteed" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Registry guarantees — suite registry metadata only. */
export const DataKnowledgeSuiteRegistryGuarantees: readonly DataKnowledgeSuiteGuarantee[] =
  Object.freeze([
    guarantee(1, "Single Source of Truth through Foundation catalog."),
    guarantee(2, "Immutable Metadata for all registry collections."),
    guarantee(3, "Canonical References preserved from Foundation."),
    guarantee(4, "Deterministic Results for all registry lookups and counts."),
    guarantee(5, "No Runtime behavior in the Suite Registry."),
    guarantee(6, "No Reconstruction of DKL-1 through DKL-8 registries."),
    guarantee(7, "No Duplicate Registries of upstream capability registries."),
  ]);
