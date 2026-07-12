import type { ExecutionMonitoringPublicSurfaceEntry } from "./executionMonitoringManifestTypes.ts";

const item = (exportName: string, phaseId: string, exportKind: ExecutionMonitoringPublicSurfaceEntry["exportKind"]) => Object.freeze({
  exportName, phaseId, exportKind, stability: "Stable", metadataOnly: true,
} as const satisfies ExecutionMonitoringPublicSurfaceEntry);

export const ExecutionMonitoringPlatformPublicSurface = Object.freeze([
  item("ExecutiveExecutionMonitoringFoundation", "OPS-9:1", "Object"),
  item("getExecutiveExecutionMonitoringFoundation", "OPS-9:1", "Function"),
  item("getExecutiveExecutionMonitoringMetadata", "OPS-9:1", "Function"),
  item("ExecutionMonitoringContracts", "OPS-9:1", "Object"),
  item("ExecutionMonitoringRegistry", "OPS-9:1", "Object"),
  item("ExecutionMonitoringMetadataCatalog", "OPS-9:1", "Object"),
  item("ExecutiveExecutionMonitoringRegistry", "OPS-9:2", "Object"),
  item("getExecutiveExecutionMonitoringRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringTargetRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringStateRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringHealthRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringAlertRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringMetricRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringLifecycleRegistry", "OPS-9:2", "Function"),
  item("getExecutionMonitoringSeverityRegistry", "OPS-9:2", "Function"),
  item("ExecutiveExecutionMonitoringModel", "OPS-9:3", "Object"),
  item("getExecutiveExecutionMonitoringModel", "OPS-9:3", "Function"),
  item("getExecutionMonitoringSnapshotModel", "OPS-9:3", "Function"),
  item("getExecutionMonitoringPolicyModel", "OPS-9:3", "Function"),
  item("ExecutionMonitoringValidationRegistry", "OPS-9:4", "Object"),
  item("ExecutionMonitoringValidationGroups", "OPS-9:4", "Object"),
  item("ExecutionMonitoringValidationRuleCatalog", "OPS-9:4", "Object"),
  item("buildExecutionMonitoringValidationManifest", "OPS-9:4", "Function"),
  item("getExecutionMonitoringValidationSummary", "OPS-9:4", "Function"),
  item("validateExecutionMonitoringFoundation", "OPS-9:4", "Function"),
  item("validateExecutionMonitoringRegistry", "OPS-9:4", "Function"),
  item("validateExecutionMonitoringModel", "OPS-9:4", "Function"),
  item("validateExecutionMonitoringPlatform", "OPS-9:4", "Function"),
  item("validateExecutiveExecutionMonitoringPlatform", "OPS-9:4", "Function"),
] as const);

export const ExecutionMonitoringPlatformPublicSurfaceMetadata = Object.freeze({
  surfaceId: "ops-9-5-execution-monitoring-public-surface",
  exportCount: ExecutionMonitoringPlatformPublicSurface.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
