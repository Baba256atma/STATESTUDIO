import type { ExecutionMonitoringPhaseEntry } from "./executionMonitoringManifestTypes.ts";

const metadata = () => Object.freeze({ metadataOnly: true, immutable: true, deterministic: true } as const);
const phase = (phaseId: string, phaseName: string, phaseStatus: string, description: string) => Object.freeze({
  phaseId, phaseName, phaseVersion: "1.0.0", phaseStatus, description,
  metadata: metadata(), metadataOnly: true,
} as const satisfies ExecutionMonitoringPhaseEntry);

export const ExecutionMonitoringPlatformPhaseRegistry = Object.freeze([
  phase("OPS-9:1", "Executive Execution Monitoring Foundation", "Foundation", "Foundational metadata-only monitoring contracts and platform identity."),
  phase("OPS-9:2", "Executive Execution Monitoring Registry", "Registry", "Canonical metadata-only monitoring registries and catalogs."),
  phase("OPS-9:3", "Executive Execution Monitoring Model", "Model", "Canonical metadata-only structural model for monitoring entities."),
  phase("OPS-9:4", "Executive Execution Monitoring Validation", "Validation", "Canonical metadata-only architectural validation framework."),
] as const);

export const ExecutionMonitoringPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops-9-5-execution-monitoring-phase-registry",
  phaseCount: ExecutionMonitoringPlatformPhaseRegistry.length,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
