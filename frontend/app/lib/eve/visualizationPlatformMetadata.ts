import { VisualizationManifest } from "./visualizationManifest.ts";
import { VisualizationPlatformCapabilities } from "./visualizationPlatformCapabilities.ts";
import { VisualizationPlatformCompatibility } from "./visualizationPlatformCompatibility.ts";
import { VisualizationPlatformGuarantees } from "./visualizationPlatformGuarantees.ts";
import { VisualizationPlatformInventory } from "./visualizationPlatformInventory.ts";

export const VisualizationPlatformMetadata = Object.freeze({
  id: "EVE-1:6/VisualizationPlatform",
  name: "Visualization Platform",
  version: "1.0.0",
  namespace: "nexora.eve.visualization.platform",
  layer: "Visualization Engine (EVE)",
  status: "Platform",
  readiness: "ReadyForCertification",
  composition: Object.freeze([
    ...VisualizationManifest.metadata.phaseComposition,
    Object.freeze({
      phase: "Platform",
      canonicalReference: "EVE-1:6/VisualizationPlatform",
      deterministicOrder: VisualizationManifest.metadata.phaseComposition.length + 1,
    }),
  ]),
  manifestReference: VisualizationManifest.metadata.id,
  inventory: VisualizationPlatformInventory,
  capabilities: VisualizationPlatformCapabilities,
  guarantees: VisualizationPlatformGuarantees,
  compatibility: VisualizationPlatformCompatibility,
  readinessDeclaration: Object.freeze({
    status: "ReadyForCertification",
    manifestReady: VisualizationManifest.metadata.readiness === "ReadyForPlatform",
    certificationInputPublished: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependency: Object.freeze({
    visualizationManifestOnly: true,
    directPreviousPhaseModule: "visualizationManifest.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    otherEvePhases: false,
    externalDependencies: false,
  }),
  execution: false,
  visualizationExecution: false,
  orchestration: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

