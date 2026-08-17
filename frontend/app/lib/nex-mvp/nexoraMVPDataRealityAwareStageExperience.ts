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
import type { NexoraDataset } from "@/app/lib/data-reality/dataRealityContracts";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import type { NexoraMVPPresentationKpiFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures";
import type { NexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
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
  /** Validated dataset supplied by the canonical RDI/Data Reality boundary. */
  readonly dataset?: NexoraDataset;
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
  /** True only for a validated dataset explicitly supplied by RDI. */
  readonly usesActiveDataSource: boolean;
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
  options: Readonly<{ useCanonicalKpis?: boolean }> = {},
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
        ...(options.useCanonicalKpis && binding.primaryKPI !== undefined
          ? {
              primaryValue: formatCanonicalStageKpiValue(
                binding.primaryKPI.value,
                binding.primaryKPI.unit,
              ),
              primaryMetricLabel: object.label,
            }
          : {}),
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

/** Presentation formatting only; the canonical numeric value is unchanged. */
export function formatCanonicalStageKpiValue(
  value: number,
  unit: string,
): string {
  const suffix = unit === "%" ? "%" : unit.length > 0 ? ` ${unit}` : "";
  return `${value.toFixed(1)}${suffix}`;
}

/**
 * Replaces fixture KPI presentation only when a bound Runtime KPI exists.
 * Target/delta are intentionally omitted because they belong to the fixture
 * observation and must never accompany a live value.
 */
export function alignPresentationViewModelToStageKpiTruth(
  base: NexoraMVPPresentationViewModel,
  binding: DataRealityAwareStageObjectBinding | undefined,
): NexoraMVPPresentationViewModel {
  if (binding?.primaryKPI === undefined || binding.bindingStatus !== "bound") {
    return base;
  }

  const status: NexoraMVPPresentationKpiFixture["status"] =
    binding.mvpStatus === "unresolved" ? undefined : binding.mvpStatus;
  const primaryKpi: NexoraMVPPresentationKpiFixture = Object.freeze({
    id: binding.primaryKPI.kpiId,
    label: base.primaryKpi?.label ?? base.subjectLabel ?? "Current KPI",
    value: formatCanonicalStageKpiValue(
      binding.primaryKPI.value,
      binding.primaryKPI.unit,
    ),
    ...(status !== undefined ? { status } : {}),
  });

  return Object.freeze({
    ...base,
    primaryKpi,
    showKPIs: true,
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
  const dataset = input.dataset ?? (
    scenario === "operational-pressure"
      ? getExecutiveOperationsPressureDataset()
      : getExecutiveOperationsDemoDataset()
  );

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
    { useCanonicalKpis: input.dataset !== undefined },
  );

  return Object.freeze({
    scenario,
    runtimeState,
    stageBinding,
    catalog,
    usesActiveDataSource: input.dataset !== undefined,
  });
}
