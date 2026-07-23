/**
 * EIL-8:1 — Executive Integration Suite Foundation Lifecycle.
 *
 * Exactly nine immutable suite lifecycle stages.
 * Metadata only. No runtime state machine.
 *
 * Ownership: owned exclusively by EIL-8:1.
 */

/** Closed suite lifecycle-stage vocabulary. */
export type SuiteLifecycleStage =
  | "Declared"
  | "Registered"
  | "Modeled"
  | "Validated"
  | "Manifested"
  | "Platform"
  | "Certified"
  | "Frozen"
  | "PublicIndex";

/** Immutable lifecycle stage descriptor. */
export interface ExecutiveIntegrationSuiteLifecycleStage {
  readonly stageId: `EIL-8:1/Lifecycle/${SuiteLifecycleStage}`;
  readonly stageKey: SuiteLifecycleStage;
  readonly canonicalName: string;
  readonly description: string;
  readonly order: number;
  readonly namespace: "nexora.eil.executive-integration-suite.foundation";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const stage = (
  stageKey: SuiteLifecycleStage,
  canonicalName: string,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteLifecycleStage =>
  Object.freeze({
    stageId: `EIL-8:1/Lifecycle/${stageKey}` as const,
    stageKey,
    canonicalName,
    description,
    order,
    namespace: "nexora.eil.executive-integration-suite.foundation" as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly nine immutable suite lifecycle stages in deterministic order.
 */
export const ExecutiveIntegrationSuiteLifecycleStages: readonly ExecutiveIntegrationSuiteLifecycleStage[] =
  Object.freeze([
    stage("Declared", "Declared", "Suite foundation identity is declared.", 1),
    stage(
      "Registered",
      "Registered",
      "Suite modules and surfaces are registered.",
      2,
    ),
    stage("Modeled", "Modeled", "Suite architecture is modeled.", 3),
    stage("Validated", "Validated", "Suite architecture is validated.", 4),
    stage(
      "Manifested",
      "Manifested",
      "Suite architecture is manifested for packaging.",
      5,
    ),
    stage(
      "Platform",
      "Platform",
      "Suite architecture is packaged as a platform.",
      6,
    ),
    stage(
      "Certified",
      "Certified",
      "Suite architecture is certified for freeze.",
      7,
    ),
    stage("Frozen", "Frozen", "Suite architecture is frozen as baseline.", 8),
    stage(
      "PublicIndex",
      "Public Index",
      "Suite architecture is published through Public Index.",
      9,
    ),
  ]);

/**
 * Immutable Suite Foundation lifecycle aggregate.
 */
export const ExecutiveIntegrationSuiteLifecycle = Object.freeze({
  lifecycleId: "EIL-8:1/ExecutiveIntegrationSuiteLifecycle" as const,
  sourcePhase: "EIL-8:1" as const,
  stages: ExecutiveIntegrationSuiteLifecycleStages,
  stageCount: ExecutiveIntegrationSuiteLifecycleStages.length,
  currentStage: "Declared" as const,
  foundationReadiness: "ReadyForRegistry" as const,
  executesTransitions: false as const,
  runtimeStateMachine: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
