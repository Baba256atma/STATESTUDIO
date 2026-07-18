/**
 * DKL-7:2 — Knowledge Services Lifecycle Registry.
 *
 * Registers approved DKL-7:1 lifecycle stages by canonical reference.
 * Ordering and architectural meaning only — no transition execution.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
} from "./knowledgeServicesFoundation.ts";
import type { KnowledgeServiceLifecycleRegistration } from "./knowledgeServicesRegistryTypes.ts";

const STAGE_MEANINGS = Object.freeze({
  Declared:
    "Service architecture is declared as metadata without availability.",
  Registered:
    "Service architecture is registered in the Knowledge Services Registry.",
  Available:
    "Service architecture is marked available for later certification phases.",
  Certified:
    "Service architecture is certified against Foundation guarantees.",
  Frozen: "Service architecture is frozen against incompatible change.",
  Released: "Service architecture is released for approved consumers.",
  Deprecated: "Service architecture is deprecated pending retirement.",
  Retired: "Service architecture is retired and terminal.",
} as const);

/** Foundation lifecycle stages registered by canonical reference. */
export const KnowledgeServiceLifecycleRegistrations: readonly KnowledgeServiceLifecycleRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.lifecycle.stages.map((stage, index) =>
      Object.freeze({
        id: `DKL-7:2/Lifecycle/${stage}`,
        name: stage,
        category: "lifecycle" as const,
        description: STAGE_MEANINGS[stage],
        owner: "DKL-7" as const,
        status: "Registered" as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        stage,
        foundationReference: `${KnowledgeServicesFoundation.lifecycle.lifecycleId}#${stage}`,
        orderIndex: index + 1,
        terminal: stage === "Retired",
      }),
    ),
  );

/** Canonical immutable lifecycle registry. */
export const KnowledgeServicesLifecycleRegistry = Object.freeze({
  registryId: "DKL-7:2/KnowledgeServicesLifecycleRegistry",
  sourcePhase: "DKL-7:2" as const,
  foundationId: KnowledgeServicesFoundationId,
  stages: KnowledgeServiceLifecycleRegistrations,
  stageCount: KnowledgeServiceLifecycleRegistrations.length,
  orderedStageNames: Object.freeze(
    KnowledgeServiceLifecycleRegistrations.map((entry) => entry.stage),
  ),
  notes: Object.freeze({
    metadataOnly: true,
    noStateTransitions: true,
    noLifecycleMachines: true,
    noRuntimeMutations: true,
    noActivation: true,
    noDeactivation: true,
    noScheduling: true,
    noReleaseAutomation: true,
    architecturalMeaningOnly: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
