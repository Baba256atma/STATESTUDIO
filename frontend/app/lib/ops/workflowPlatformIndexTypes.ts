export interface WorkflowPlatformIndexRegistryEntry {
  readonly name: string;
  readonly phaseId: string;
  readonly kind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}

export interface WorkflowPlatformReleaseSummaryDescriptor {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly phaseCount: number;
  readonly validationStatus: "PASS" | "FAIL";
  readonly manifestStatus: "PASS" | "FAIL";
  readonly taskCompatibilityStatus: "PASS" | "FAIL";
  readonly publicApiStatus: "Stable";
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface WorkflowPlatformIndexValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
}
