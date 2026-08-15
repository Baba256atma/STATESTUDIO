/**
 * P0:5 — NEX-MVP bridge: Data Reality projections → existing Stage catalog.
 *
 * Applies already-resolved Stage projections onto MVP fixture geometry.
 * Does not invent a parallel runtime, recompute KPIs, or resolve thresholds.
 * Selection/focus remain owned by interaction state (not mutated here).
 *
 * Shell may import this bridge. Low-level Stage mesh components must not.
 */

import {
  projectDataRealityToExecutiveRuntime,
  type NexoraDataRealityStageObjectProjection,
  type NexoraDataRealityStageProjectionResult,
} from "@/app/lib/data-reality/dataRealityStageProjection";
import { resolveDatasetExecutiveReality } from "@/app/lib/data-reality/dataRealityFoundation";
import type { NexoraDataRealitySnapshot } from "@/app/lib/data-reality/dataRealityContracts";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "@/app/lib/data-reality/demo/executiveOperationsDemoDataset";
import { getExecutiveOperationsKpiDefinitions } from "@/app/lib/data-reality/demo/executiveOperationsKPIDefinitions";
import { getExecutiveOperationsResolvedObjectBindings } from "@/app/lib/data-reality/demo/executiveOperationsObjectBindings";
import { getExecutiveOperationsExecutiveStateRules } from "@/app/lib/data-reality/demo/executiveOperationsExecutiveStateRules";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

export const nexoraMVPDataRealityStageBridgeIdentity =
  "P0:5/NexoraMVPDataRealityStageBridge" as const;

export const nexoraMVPDataRealityStageBridgeVersion = "1.0.0" as const;

export const NEXORA_MVP_DATA_REALITY_STAGE_BRIDGE_BOUNDARY = Object.freeze({
  ownsParallelRuntime: false as const,
  ownsKpiComputation: false as const,
  ownsExecutiveStateResolution: false as const,
  mutatesSelectionFocus: false as const,
  mutatesWorkspaceEnvironment: false as const,
  lowLevelMeshesMayImportBridge: false as const,
  consumesExistingCatalogFixtures: true as const,
});

export type NexoraMVPDataRealityDatasetScenario =
  | "baseline"
  | "operational-pressure";

export function parseNexoraMVPDataRealityDatasetScenario(
  value: string | null | undefined,
): NexoraMVPDataRealityDatasetScenario {
  return value === "operational-pressure" ? "operational-pressure" : "baseline";
}

export function applyDataRealityProjectionsToStageCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  projections: readonly NexoraDataRealityStageObjectProjection[],
): NexoraMVPObjectInteractionCatalog {
  const byStageId = new Map(
    projections.map((projection) => [projection.stageObjectId, projection]),
  );

  const objects = Object.freeze(
    catalog.objects.map((object): NexoraMVPStageObjectFixture => {
      const projection = byStageId.get(object.id);
      if (!projection) {
        return object;
      }
      return Object.freeze({
        ...object,
        status: projection.mvpStatus,
        attention: projection.mvpAttention,
      });
    }),
  );

  return Object.freeze({
    objects,
    relationships: catalog.relationships,
    contextSubjects: catalog.contextSubjects,
    contextLinks: catalog.contextLinks,
  });
}

export type NexoraMVPDataRealityStageBridgeResult = {
  readonly scenario: NexoraMVPDataRealityDatasetScenario;
  readonly snapshot: NexoraDataRealitySnapshot;
  readonly projection: NexoraDataRealityStageProjectionResult;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

/**
 * Compose Dataset → Data Reality Snapshot → Stage projection → catalog.
 * Pure relative to interaction state (does not read/write selection/focus).
 */
export function resolveNexoraMVPDataRealityStageBridge(
  scenario: NexoraMVPDataRealityDatasetScenario = "baseline",
  baseCatalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): NexoraMVPDataRealityStageBridgeResult {
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();

  const reality = resolveDatasetExecutiveReality(dataset, {
    bindings: getExecutiveOperationsResolvedObjectBindings(),
    definitions: getExecutiveOperationsKpiDefinitions(),
    rules: getExecutiveOperationsExecutiveStateRules(),
  });

  const projection = projectDataRealityToExecutiveRuntime(reality.snapshot);
  const catalog = applyDataRealityProjectionsToStageCatalog(
    baseCatalog,
    projection.projections,
  );

  return Object.freeze({
    scenario,
    snapshot: reality.snapshot,
    projection,
    catalog,
  });
}
