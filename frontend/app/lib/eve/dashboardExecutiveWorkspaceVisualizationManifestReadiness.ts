import type { DashboardExecutiveWorkspaceManifestReadinessEntry } from "./dashboardExecutiveWorkspaceVisualizationManifestTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationValidationPlatform } from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";

const validation = DashboardExecutiveWorkspaceVisualizationValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phaseSources = Object.freeze([
  ["Foundation", foundation.metadata.id, foundation],
  ["Registry", registry.metadata.id, registry],
  ["Model", model.metadata.id, model],
  ["Validation", validation.metadata.id, validation],
  ["Manifest", "EVE-6:5/DashboardExecutiveWorkspaceVisualizationManifest", null],
] as const);

export const DashboardExecutiveWorkspaceVisualizationManifestComposition =
  Object.freeze(phaseSources.map(
    ([phase, canonicalReference, canonicalSource], index) => Object.freeze({
      id: `EVE-6:5/Composition/${phase}` as const,
      phase,
      canonicalReference,
      canonicalSource,
      preservedByReference: true,
      deterministicOrder: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ));

const readinessNames = Object.freeze([
  "FoundationReady", "RegistryReady", "ModelReady", "ValidationReady",
  "InventoryReady", "MetadataReady", "ReadyForPlatform",
] as const);

export const DashboardExecutiveWorkspaceVisualizationManifestReadiness:
readonly DashboardExecutiveWorkspaceManifestReadinessEntry[] = Object.freeze(
  readinessNames.map((name, index) => Object.freeze({
    id: `EVE-6:5/Readiness/${name}` as const,
    name,
    ready: true as const,
    deterministicOrder: index + 1,
    executes: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
