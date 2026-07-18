/**
 * DKL-7:1 — Knowledge Services Lifecycle.
 *
 * Ordered lifecycle stages and a deeply frozen transition map.
 * Metadata only — no transition execution function.
 *
 * Ownership: owned exclusively by DKL-7:1.
 */

import type { KnowledgeServiceLifecycleStage } from "./knowledgeServicesFoundationTypes.ts";

export const KNOWLEDGE_SERVICES_LIFECYCLE_STAGES: readonly KnowledgeServiceLifecycleStage[] =
  Object.freeze([
    "Declared",
    "Registered",
    "Available",
    "Certified",
    "Frozen",
    "Released",
    "Deprecated",
    "Retired",
  ]);

const TRANSITIONS = Object.freeze({
  Declared: Object.freeze([
    "Registered",
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Registered: Object.freeze([
    "Available",
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Available: Object.freeze([
    "Certified",
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Certified: Object.freeze([
    "Frozen",
    "Released",
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Frozen: Object.freeze([
    "Released",
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Released: Object.freeze([
    "Deprecated",
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Deprecated: Object.freeze([
    "Retired",
  ]) as readonly KnowledgeServiceLifecycleStage[],
  Retired: Object.freeze([]) as readonly KnowledgeServiceLifecycleStage[],
}) as Readonly<
  Record<KnowledgeServiceLifecycleStage, readonly KnowledgeServiceLifecycleStage[]>
>;

/** Canonical immutable Knowledge Services lifecycle metadata. */
export const KnowledgeServicesLifecycle = Object.freeze({
  lifecycleId: "DKL-7:1/KnowledgeServicesLifecycle",
  sourcePhase: "DKL-7:1" as const,
  stages: KNOWLEDGE_SERVICES_LIFECYCLE_STAGES,
  stageCount: KNOWLEDGE_SERVICES_LIFECYCLE_STAGES.length,
  transitions: TRANSITIONS,
  notes: Object.freeze({
    metadataOnly: true as const,
    noTransitionExecution: true as const,
    noRuntimeBehavior: true as const,
    terminalStage: "Retired" as const,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
