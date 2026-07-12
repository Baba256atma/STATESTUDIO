export interface SchedulingPlatformIndexRegistryEntry {
  readonly name: string;
  readonly phaseId: string;
  readonly kind: "Object" | "Function" | "Constant" | "TypeGroup";
  readonly stability: "Stable";
  readonly metadataOnly: true;
}

export interface SchedulingPlatformReleaseSummaryDescriptor {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly phaseCount: number;
  readonly validationStatus: "PASS" | "FAIL";
  readonly manifestStatus: "PASS" | "FAIL";
  readonly publicApiStatus: "Stable";
  readonly taskCompatibilityStatus: "PASS" | "FAIL";
  readonly workflowCompatibilityStatus: "PASS" | "FAIL";
  readonly projectCompatibilityStatus: "PASS" | "FAIL";
  readonly resourceCompatibilityStatus: "PASS" | "FAIL";
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly certificationState: "Pending" | "Certified";
  readonly architectureCompleteness: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface SchedulingPlatformIndexValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
}
