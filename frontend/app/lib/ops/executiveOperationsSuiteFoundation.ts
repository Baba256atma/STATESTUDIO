import { ExecutiveOperationsPlatformPublicFoundation } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePlatformPublicFoundation } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePlatformPublicFoundation } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPlatformPublicFoundation } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePlatformPublicFoundation } from "./executiveResourceIntelligencePublicIndex.ts";
import { ExecutiveSchedulingIntelligencePlatformPublicFoundation } from "./executiveSchedulingPublicIndex.ts";
import { ExecutiveDependencyIntelligencePlatformPublicFoundation } from "./executiveDependencyPublicIndex.ts";
import { ExecutiveAutomationPlatformPublicFoundation } from "./executiveAutomationPublicIndex.ts";
import { ExecutiveExecutionMonitoringPlatformPublicFoundation } from "./executiveExecutionMonitoringPublicIndex.ts";
import type { ExecutiveOperationsSuiteFoundationDescriptor, ExecutiveOperationsSuiteFoundationMetadata } from "./executiveOperationsSuiteFoundationTypes.ts";

export const ExecutiveOperationsSuiteFoundationId = "OPS-10:1" as const;
export const ExecutiveOperationsSuiteFoundationName = "Executive Operations Suite Foundation" as const;
export const ExecutiveOperationsSuiteFoundationDescription = "Canonical metadata-only foundation aggregating the nine Executive Operations public platforms." as const;
export const ExecutiveOperationsSuiteFoundationVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteFoundationNamespace = "nexora.ops.executive-operations-suite.foundation" as const;
export const ExecutiveOperationsSuiteFoundationStatus = Object.freeze({
  metadataOnly: true, phase: "Foundation", scope: "Suite", immutable: true,
  visibility: "Public", releaseStatus: "Draft",
} as const);

const metadata = Object.freeze({
  id: ExecutiveOperationsSuiteFoundationId, name: ExecutiveOperationsSuiteFoundationName,
  description: ExecutiveOperationsSuiteFoundationDescription, version: ExecutiveOperationsSuiteFoundationVersion,
  namespace: ExecutiveOperationsSuiteFoundationNamespace, status: ExecutiveOperationsSuiteFoundationStatus,
  platformCount: 9, metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveOperationsSuiteFoundationMetadata);

export const ExecutiveOperationsSuiteFoundation = Object.freeze({
  execution: ExecutiveOperationsPlatformPublicFoundation,
  task: ExecutiveTaskIntelligencePlatformPublicFoundation,
  workflow: ExecutiveWorkflowIntelligencePlatformPublicFoundation,
  project: ExecutiveProjectExecutionPlatformPublicFoundation,
  resource: ExecutiveResourceIntelligencePlatformPublicFoundation,
  scheduling: ExecutiveSchedulingIntelligencePlatformPublicFoundation,
  monitoring: ExecutiveDependencyIntelligencePlatformPublicFoundation,
  automation: ExecutiveAutomationPlatformPublicFoundation,
  dashboard: ExecutiveExecutionMonitoringPlatformPublicFoundation,
  metadata,
} as const satisfies ExecutiveOperationsSuiteFoundationDescriptor);

export const getExecutiveOperationsSuiteFoundation = () => ExecutiveOperationsSuiteFoundation;
export const getExecutiveOperationsSuiteMetadata = () => metadata;
