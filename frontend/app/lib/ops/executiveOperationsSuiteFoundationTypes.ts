export type ExecutiveOperationsSuiteSection = "execution" | "task" | "workflow" | "project" | "resource" | "scheduling" | "monitoring" | "automation" | "dashboard";

export interface ExecutiveOperationsSuiteFoundationStatusDescriptor {
  readonly metadataOnly: true;
  readonly phase: "Foundation";
  readonly scope: "Suite";
  readonly immutable: true;
  readonly visibility: "Public";
  readonly releaseStatus: "Draft";
}

export interface ExecutiveOperationsSuitePlatformEntry {
  readonly phaseId: `OPS-${number}`;
  readonly section: ExecutiveOperationsSuiteSection;
  readonly platformName: string;
  readonly publicFoundationExport: string;
  readonly dependencyOrder: number;
  readonly metadataOnly: true;
}

export interface ExecutiveOperationsSuiteFoundationMetadata {
  readonly id: "OPS-10:1";
  readonly name: string;
  readonly description: string;
  readonly version: "1.0.0";
  readonly namespace: "nexora.ops.executive-operations-suite.foundation";
  readonly status: ExecutiveOperationsSuiteFoundationStatusDescriptor;
  readonly platformCount: 9;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveOperationsSuiteFoundationManifestDescriptor {
  readonly manifestId: string;
  readonly manifestVersion: "1.0.0";
  readonly consumedPlatforms: readonly ExecutiveOperationsSuitePlatformEntry[];
  readonly suiteComposition: readonly ExecutiveOperationsSuiteSection[];
  readonly dependencyOrder: readonly `OPS-${number}`[];
  readonly publicFoundationInventory: readonly string[];
  readonly platformCount: 9;
  readonly architecturalBoundaries: readonly string[];
  readonly publicApiPolicy: Readonly<{ publicIndicesOnly: true; stableExportsOnly: true; internalImportsAllowed: false; metadataOnly: true }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveOperationsSuiteFoundationDescriptor {
  readonly execution: object; readonly task: object; readonly workflow: object;
  readonly project: object; readonly resource: object; readonly scheduling: object;
  readonly monitoring: object; readonly automation: object; readonly dashboard: object;
  readonly metadata: ExecutiveOperationsSuiteFoundationMetadata;
}
