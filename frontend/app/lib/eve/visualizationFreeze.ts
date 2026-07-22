import { VisualizationCertification } from "./visualizationCertification.ts";
import { VisualizationFrozenBaselines } from "./visualizationFreezeBaselines.ts";
import { VisualizationFreezeCompatibility } from "./visualizationFreezeCompatibility.ts";
import { VisualizationFreezeExtensions } from "./visualizationFreezeExtensions.ts";
import { VisualizationFreezeLocks } from "./visualizationFreezeLocks.ts";
import { VisualizationFreezeRegistry } from "./visualizationFreezeRegistry.ts";

export const VisualizationFreezeId = "EVE-1:8/VisualizationFreeze" as const;
export const VisualizationFreezeVersion = "1.0.0" as const;
export const VisualizationFreezeName = "Visualization Freeze" as const;
export const VisualizationFreezeNamespace = "nexora.eve.visualization.freeze" as const;
export const VisualizationFreezeStatus = "Frozen" as const;
export const VisualizationFreezeReadiness = "ReadyForPublicIndex" as const;
export const VisualizationFreezeLockId = "EVE-1-VISUALIZATION-LOCKED" as const;

export const VisualizationFreeze = Object.freeze({
  identity: Object.freeze({
    id: VisualizationFreezeId,
    name: VisualizationFreezeName,
    version: VisualizationFreezeVersion,
    namespace: VisualizationFreezeNamespace,
    layer: "Visualization Engine (EVE)",
    status: VisualizationFreezeStatus,
    readiness: VisualizationFreezeReadiness,
    lockId: VisualizationFreezeLockId,
  }),
  certification: VisualizationCertification,
  frozenPlatformReference: VisualizationCertification.platform,
  registry: VisualizationFreezeRegistry,
  locks: VisualizationFreezeLocks,
  baselines: VisualizationFrozenBaselines,
  compatibility: VisualizationFreezeCompatibility,
  extensions: VisualizationFreezeExtensions,
  inventory: VisualizationFreezeRegistry.frozenInventory,
  releaseMetadata: Object.freeze({
    certified: VisualizationCertification.metadata.status === "Certified",
    frozen: true,
    stable: true,
    readyForPublicIndex: true,
  }),
  dependency: Object.freeze({
    visualizationCertificationOnly: true,
    directPreviousPhaseModule: "visualizationCertification.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    directPlatformImport: false,
    otherEvePhases: false,
    externalDependencies: false,
  }),
  runtimeLocking: false,
  freezeManagement: false,
  execution: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

