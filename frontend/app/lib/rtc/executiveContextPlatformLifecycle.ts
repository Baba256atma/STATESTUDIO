/**
 * RTC-1:6 — Executive Context Platform Lifecycle.
 *
 * Lifecycle operations exposed by the Platform.
 * Business transition rules belong to later Runtime phases.
 *
 * Ownership: owned exclusively by RTC-1:6.
 */

/** Canonical lifecycle operation name. */
export type ExecutiveContextPlatformLifecycleOperationName =
  | "Initialize"
  | "Activate"
  | "Update"
  | "Archive"
  | "Restore"
  | "Inspect";

/** Lifecycle operation declaration. */
export interface ExecutiveContextPlatformLifecycleOperation {
  readonly operationId:
    `RTC-1:6/Lifecycle/${ExecutiveContextPlatformLifecycleOperationName}`;
  readonly operationName: ExecutiveContextPlatformLifecycleOperationName;
  readonly description: string;
  readonly order: number;
  readonly mutatesBusinessState: false;
  readonly businessTransitionRules: false;
  readonly contractsOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const operation = (
  operationName: ExecutiveContextPlatformLifecycleOperationName,
  description: string,
  order: number,
): ExecutiveContextPlatformLifecycleOperation =>
  Object.freeze({
    operationId: `RTC-1:6/Lifecycle/${operationName}` as const,
    operationName,
    description,
    order,
    mutatesBusinessState: false as const,
    businessTransitionRules: false as const,
    contractsOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly six lifecycle operations. */
export const ExecutiveContextPlatformLifecycleOperations = Object.freeze([
  operation(
    "Initialize",
    "Initialize a new Executive Context identity.",
    1,
  ),
  operation(
    "Activate",
    "Activate an Executive Context as the single active context.",
    2,
  ),
  operation(
    "Update",
    "Replace active context with a new immutable snapshot.",
    3,
  ),
  operation(
    "Archive",
    "Archive an Executive Context from the active path.",
    4,
  ),
  operation(
    "Restore",
    "Restore a prior Executive Context snapshot.",
    5,
  ),
  operation(
    "Inspect",
    "Inspect Runtime lifecycle state without mutation.",
    6,
  ),
] as const);

export const ExecutiveContextPlatformLifecycleOperationNames = Object.freeze([
  "Initialize",
  "Activate",
  "Update",
  "Archive",
  "Restore",
  "Inspect",
] as const satisfies readonly ExecutiveContextPlatformLifecycleOperationName[]);

/** Snapshot platform responsibilities — storage outside this phase. */
export const ExecutiveContextPlatformSnapshotResponsibilities = Object.freeze([
  "identity",
  "timestamp",
  "source",
  "lifecycle reference",
  "context reference",
  "metadata",
] as const);

export const ExecutiveContextPlatformSnapshotModel = Object.freeze({
  snapshotModelId: "RTC-1:6/SnapshotPlatform",
  responsibilities: ExecutiveContextPlatformSnapshotResponsibilities,
  storageOutsidePhase: true as const,
  reproducible: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

/** Lifecycle platform catalogue. */
export const ExecutiveContextPlatformLifecycle = Object.freeze({
  lifecycleId: "RTC-1:6/LifecyclePlatform",
  operations: ExecutiveContextPlatformLifecycleOperations,
  operationCount: ExecutiveContextPlatformLifecycleOperations.length,
  snapshot: ExecutiveContextPlatformSnapshotModel,
  businessTransitionRules: false as const,
  contractsOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
