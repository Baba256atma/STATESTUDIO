/**
 * NEX-MVP consumer of P2:3 Stage Experience Binding.
 *
 * Orchestrates:
 *   dataset scenario → P2:2 runtime state → P2:3 Stage binding → catalog stamp
 *
 * Shell may import this module. Low-level Stage mesh components must not.
 * Does not recompute KPI / executive-state / advisor logic.
 */

import {
  resolveDataRealityAwareMVPRuntimeState,
  type DataRealityAwareMVPRuntimeState,
} from "@/app/lib/data-reality/dataRealityAwareMVPRuntimeState";
import {
  resolveDataRealityAwareStageBinding,
  type DataRealityAwareStageBindingResult,
  type DataRealityAwareStageMvpAttention,
  type DataRealityAwareStageMvpStatus,
  type DataRealityAwareStageObjectBinding,
} from "@/app/lib/data-reality/dataRealityAwareStageExperienceBinding";
import {
  getExecutiveOperationsDemoDataset,
  getExecutiveOperationsPressureDataset,
} from "@/app/lib/data-reality/demo/executiveOperationsDemoDataset";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  getDefaultNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import type { NexoraMVPDataRealityDatasetScenario } from "@/app/lib/nex-mvp/nexoraMVPDataRealityStageBridge";

export const nexoraMVPDataRealityAwareStageExperienceIdentity =
  "NEX-MVP/P2:3/DataRealityAwareStageExperienceConsumer" as const;

export const NEXORA_MVP_DATA_REALITY_AWARE_STAGE_EXPERIENCE_BOUNDARY =
  Object.freeze({
    consumesP22RuntimeState: true as const,
    consumesP23StageBinding: true as const,
    ownsKpiComputation: false as const,
    ownsExecutiveStateResolution: false as const,
    ownsAdvisorReasoning: false as const,
    createsStageGeometry: false as const,
    lowLevelMeshesMayImport: false as const,
  });

export type ResolveNexoraMVPDataRealityAwareStageExperienceInput = {
  readonly datasetScenario?: NexoraMVPDataRealityDatasetScenario;
  readonly focusedObjectId?: string;
  readonly selectedObjectId?: string;
  readonly selectedObjectIds?: readonly string[];
  readonly currentWorkspace?: string;
  readonly presentationState?: string;
  readonly requestedIntent?: "investigate" | "observe" | "explain" | "prioritize" | "recommend";
  readonly baseCatalog?: NexoraMVPObjectInteractionCatalog;
};

export type NexoraMVPDataRealityAwareStageExperienceResult = {
  readonly scenario: NexoraMVPDataRealityDatasetScenario;
  readonly runtimeState: DataRealityAwareMVPRuntimeState;
  readonly stageBinding: DataRealityAwareStageBindingResult;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
};

function toFixtureStatus(
  status: DataRealityAwareStageMvpStatus,
): NexoraMVPStageObjectFixture["status"] {
  return status;
}

function toFixtureAttention(
  attention: DataRealityAwareStageMvpAttention,
): NexoraMVPStageObjectFixture["attention"] {
  return attention;
}

/**
 * Apply P2:3 object bindings onto existing Stage catalog fixtures.
 * Never invents geometry. Unmatched Stage objects receive unresolved bindings.
 */
export function applyDataRealityAwareStageBindingsToCatalog(
  catalog: NexoraMVPObjectInteractionCatalog,
  stageBinding: DataRealityAwareStageBindingResult,
): NexoraMVPObjectInteractionCatalog {
  const byId = new Map(
    stageBinding.objects.map((entry) => [entry.objectId, entry]),
  );

  const objects = Object.freeze(
    catalog.objects.map((object): NexoraMVPStageObjectFixture => {
      const binding = byId.get(object.id);
      if (!binding) {
        // Safety: never leave an unbound Stage object looking healthy.
        return Object.freeze({
          ...object,
          status: "unresolved",
          attention: "normal",
        });
      }
      return Object.freeze({
        ...object,
        status: toFixtureStatus(binding.mvpStatus),
        attention: toFixtureAttention(binding.mvpAttention),
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

export function getDataRealityAwareStageObjectBindingFromExperience(
  experience: NexoraMVPDataRealityAwareStageExperienceResult,
  objectId: string,
): DataRealityAwareStageObjectBinding | undefined {
  return experience.stageBinding.objects.find(
    (entry) => entry.objectId === objectId,
  );
}

/**
 * Canonical NEX-MVP Stage experience resolution for Data Reality.
 * Resolves P2:2 once, binds via P2:3 once, stamps existing catalog.
 */
export function resolveNexoraMVPDataRealityAwareStageExperience(
  input: ResolveNexoraMVPDataRealityAwareStageExperienceInput = {},
): NexoraMVPDataRealityAwareStageExperienceResult {
  const scenario = input.datasetScenario ?? "baseline";
  const baseCatalog =
    input.baseCatalog ?? getDefaultNexoraMVPObjectInteractionCatalog();
  const dataset =
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset();

  const selectedObjectIds =
    input.selectedObjectIds ??
    (input.selectedObjectId ? [input.selectedObjectId] : undefined);

  const runtimeState = resolveDataRealityAwareMVPRuntimeState({
    dataset,
    ...(input.focusedObjectId !== undefined
      ? { focusedObjectId: input.focusedObjectId }
      : {}),
    ...(selectedObjectIds !== undefined ? { selectedObjectIds } : {}),
    ...(input.selectedObjectId !== undefined
      ? { selectedObjectId: input.selectedObjectId }
      : {}),
    ...(input.currentWorkspace !== undefined
      ? { currentWorkspace: input.currentWorkspace }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.requestedIntent !== undefined
      ? { requestedIntent: input.requestedIntent }
      : { requestedIntent: "investigate" }),
    responseMode: "standard",
  });

  const stageBinding = resolveDataRealityAwareStageBinding({
    runtimeState,
    stageObjects: baseCatalog.objects.map((object) =>
      Object.freeze({ id: object.id }),
    ),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.selectedObjectId !== undefined
      ? { selectedObjectId: input.selectedObjectId }
      : {}),
    ...(input.focusedObjectId !== undefined
      ? { focusedObjectId: input.focusedObjectId }
      : {}),
  });

  const catalog = applyDataRealityAwareStageBindingsToCatalog(
    baseCatalog,
    stageBinding,
  );

  return Object.freeze({
    scenario,
    runtimeState,
    stageBinding,
    catalog,
  });
}
