import { ExecutiveOperationsSuiteFoundationNamespace, getExecutiveOperationsSuiteMetadata } from "./executiveOperationsSuiteFoundationIndex.ts";
import type { ExecutiveOperationsSuitePlatformId, ExecutiveOperationsSuitePlatformRegistryEntry, ExecutiveOperationsSuiteRegistryStatus as RegistryStatusShape } from "./executiveOperationsSuiteRegistryTypes.ts";

export const ExecutiveOperationsSuiteRegistryId = "executive-operations-suite-registry" as const;
export const ExecutiveOperationsSuiteRegistryName = "Executive Operations Suite Registry" as const;
export const ExecutiveOperationsSuiteRegistryDescription = "Canonical metadata registry for all nine Executive Operations Suite platforms." as const;
export const ExecutiveOperationsSuiteRegistryVersion = "1.0.0" as const;
export const ExecutiveOperationsSuiteRegistryNamespace = "nexora.ops.suite.registry" as const;
export const ExecutiveOperationsSuiteRegistryStatus = Object.freeze({
  metadataOnly: true, phase: "Registry", immutable: true, visibility: "Public",
  deterministic: true, releaseStatus: "Draft",
} as const satisfies RegistryStatusShape);

const platform = (platformId: ExecutiveOperationsSuitePlatformId, phaseId: ExecutiveOperationsSuitePlatformRegistryEntry["phaseId"], name: string, foundationSection: ExecutiveOperationsSuitePlatformRegistryEntry["foundationSection"], order: number) => Object.freeze({
  platformId, phaseId, name, description: `${name} public metadata registration.`,
  namespace: `${ExecutiveOperationsSuiteFoundationNamespace}.${platformId}`,
  order, category: "ExecutiveOperations", status: "Registered", publicApiStatus: "Stable",
  metadataOnly: true, immutable: true, foundationSection,
} as const satisfies ExecutiveOperationsSuitePlatformRegistryEntry);

export const ExecutiveOperationsSuitePlatformRegistry = Object.freeze([
  platform("execution", "OPS-1", "Executive Execution Platform", "execution", 1),
  platform("task", "OPS-2", "Executive Task Intelligence", "task", 2),
  platform("workflow", "OPS-3", "Executive Workflow Intelligence", "workflow", 3),
  platform("project", "OPS-4", "Executive Project Execution", "project", 4),
  platform("resource", "OPS-5", "Executive Resource Intelligence", "resource", 5),
  platform("scheduling", "OPS-6", "Executive Scheduling Intelligence", "scheduling", 6),
  platform("dependency", "OPS-7", "Executive Dependency Intelligence", "monitoring", 7),
  platform("automation", "OPS-8", "Executive Automation Platform", "automation", 8),
  platform("monitoring", "OPS-9", "Executive Execution Monitoring Platform", "dashboard", 9),
] as const);

export const ExecutiveOperationsSuiteRegistryMetadata = Object.freeze({
  id: ExecutiveOperationsSuiteRegistryId, name: ExecutiveOperationsSuiteRegistryName,
  description: ExecutiveOperationsSuiteRegistryDescription, version: ExecutiveOperationsSuiteRegistryVersion,
  namespace: ExecutiveOperationsSuiteRegistryNamespace, status: ExecutiveOperationsSuiteRegistryStatus,
  foundationId: getExecutiveOperationsSuiteMetadata().id, platformCount: 9,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const getExecutiveOperationsSuitePlatformRegistry = () => ExecutiveOperationsSuitePlatformRegistry;
export const getExecutiveOperationsSuitePlatformById = (platformId: string) => ExecutiveOperationsSuitePlatformRegistry.find((entry) => entry.platformId === platformId);
export const getExecutiveOperationsSuiteRegistryMetadata = () => ExecutiveOperationsSuiteRegistryMetadata;
