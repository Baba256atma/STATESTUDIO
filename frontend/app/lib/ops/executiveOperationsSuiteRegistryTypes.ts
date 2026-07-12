export type ExecutiveOperationsSuitePlatformId = "execution" | "task" | "workflow" | "project" | "resource" | "scheduling" | "dependency" | "automation" | "monitoring";
export type ExecutiveOperationsSuitePhaseId = "OPS-1" | "OPS-2" | "OPS-3" | "OPS-4" | "OPS-5" | "OPS-6" | "OPS-7" | "OPS-8" | "OPS-9";
export type ExecutiveOperationsSuiteFoundationSection = "execution" | "task" | "workflow" | "project" | "resource" | "scheduling" | "monitoring" | "automation" | "dashboard";

export interface ExecutiveOperationsSuitePlatformRegistryEntry {
  readonly platformId: ExecutiveOperationsSuitePlatformId;
  readonly phaseId: ExecutiveOperationsSuitePhaseId;
  readonly name: string; readonly description: string; readonly namespace: string;
  readonly order: number; readonly category: "ExecutiveOperations";
  readonly status: "Registered"; readonly publicApiStatus: "Stable";
  readonly metadataOnly: true; readonly immutable: true;
  readonly foundationSection: ExecutiveOperationsSuiteFoundationSection;
}

export interface ExecutiveOperationsSuitePhaseRegistryEntry {
  readonly phaseId: ExecutiveOperationsSuitePhaseId;
  readonly platformId: ExecutiveOperationsSuitePlatformId;
  readonly order: number;
  readonly owns: readonly string[];
  readonly consumes: readonly ExecutiveOperationsSuitePhaseId[];
  readonly provides: readonly string[];
  readonly suiteRole: string;
  readonly releaseState: "Public";
  readonly metadataOnly: true;
}

export interface ExecutiveOperationsSuiteRegistryStatus {
  readonly metadataOnly: true; readonly phase: "Registry"; readonly immutable: true;
  readonly visibility: "Public"; readonly deterministic: true; readonly releaseStatus: "Draft";
}

export interface ExecutiveOperationsSuiteRegistryManifest {
  readonly registryMetadata: object;
  readonly platformRegistryInventory: readonly ExecutiveOperationsSuitePlatformRegistryEntry[];
  readonly phaseRegistryInventory: readonly ExecutiveOperationsSuitePhaseRegistryEntry[];
  readonly platformCount: 9; readonly phaseCount: 9;
  readonly canonicalPlatformOrder: readonly ExecutiveOperationsSuitePlatformId[];
  readonly canonicalPhaseOrder: readonly ExecutiveOperationsSuitePhaseId[];
  readonly platformToPhaseOwnershipMap: Readonly<Record<ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuitePhaseId>>;
  readonly foundationSectionMap: Readonly<Record<ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuiteFoundationSection>>;
  readonly publicApiPolicy: object; readonly architecturalBoundaries: readonly string[];
  readonly duplicateRegistrationPolicy: "RejectDuplicates";
  readonly registryStabilityState: "Stable";
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
