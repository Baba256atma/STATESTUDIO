import assert from "node:assert/strict";
import test from "node:test";

import {
  createGithubRepositoryConnector,
  createNexoraLiveConnection,
  prepareNexoraLiveObservation,
  transitionNexoraLiveConnection,
  type NexoraLiveFetch,
} from "./liveDataConnectorFoundation.ts";
import {
  alignPresentationViewModelToStageKpiTruth,
  getDataRealityAwareStageObjectBindingFromExperience,
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "../nex-mvp/nexoraMVPDataRealityAwareStageExperience.ts";
import { deriveNexoraMVPPresentationViewModel } from "../nex-mvp/nexoraMVPPresentationState.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const NOW = "2026-08-16T18:00:00.000Z";

function githubFetch(open: number, closed: number): NexoraLiveFetch {
  return async (url) => {
    if (url.includes("/issues?")) {
      return {
        ok: true,
        status: 200,
        json: async () => [
          ...Array.from({ length: open }, (_, index) => ({
            id: index + 1,
            state: "open",
          })),
          ...Array.from({ length: closed }, (_, index) => ({
            id: open + index + 1,
            state: "closed",
          })),
        ],
      };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        full_name: "nexora/reference",
        html_url: "https://github.com/nexora/reference",
        stargazers_count: 42,
        forks_count: 7,
        open_issues_count: open,
      }),
    };
  };
}

async function liveExperience(open: number, closed: number, id: string) {
  const connector = createGithubRepositoryConnector(githubFetch(open, closed));
  const connection = transitionNexoraLiveConnection(
    createNexoraLiveConnection({
      connectionId: "github:reference",
      workspaceId: "executive",
      providerId: "github",
      providerType: "source-control",
      displayName: "Engineering Source",
      capabilities: connector.capabilities(),
      createdAt: NOW,
      configurationReference: "github:nexora/reference",
    }),
    "connected",
    NOW,
  );
  const prepared = await prepareNexoraLiveObservation({
    connector,
    connection,
    configuration: Object.freeze({ owner: "nexora", repository: "reference" }),
    observationId: id,
    observedAt: NOW,
  });
  assert.equal(prepared.ready, true);
  assert.ok(prepared.handoff);
  assert.ok(prepared.dataReality);
  return {
    prepared,
    experience: resolveNexoraMVPDataRealityAwareStageExperience({
      dataset: prepared.handoff.dataset,
      focusedObjectId: "obj-capacity",
      selectedObjectId: "obj-capacity",
      currentWorkspace: "executive",
      presentationState: "minimum",
    }),
  };
}

function basePresentation(subjectId: string, subjectLabel: string) {
  return deriveNexoraMVPPresentationViewModel({
    presentationState: "minimum",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId,
    subjectKind: "object",
    subjectLabel,
  });
}

test("GitHub canonical Capacity and Customer KPIs reach Stage unchanged", async () => {
  const { prepared, experience } = await liveExperience(2, 8, "OBS-STAGE");
  const capacityKpi = prepared.dataReality!.kpis.find(
    (entry) => entry.objectKey === "production",
  )!;
  const customerKpi = prepared.dataReality!.kpis.find(
    (entry) => entry.objectKey === "customer",
  )!;
  const capacity = getDataRealityAwareStageObjectBindingFromExperience(
    experience,
    "obj-capacity",
  )!;
  const customer = getDataRealityAwareStageObjectBindingFromExperience(
    experience,
    "obj-customer",
  )!;

  assert.equal(capacity.primaryKPI?.value, capacityKpi.value);
  assert.equal(customer.primaryKPI?.value, customerKpi.value);
  assert.equal(
    experience.catalog.objects.find((entry) => entry.id === "obj-capacity")
      ?.primaryValue,
    "20.0%",
  );
  assert.equal(
    experience.catalog.objects.find((entry) => entry.id === "obj-customer")
      ?.primaryValue,
    "80.0%",
  );

  const capacityView = alignPresentationViewModelToStageKpiTruth(
    basePresentation("obj-capacity", "Capacity"),
    capacity,
  );
  const customerView = alignPresentationViewModelToStageKpiTruth(
    basePresentation("obj-customer", "Customer"),
    customer,
  );
  assert.equal(capacityView.primaryKpi?.value, "20.0%");
  assert.equal(customerView.primaryKpi?.value, "80.0%");
  assert.equal(capacityView.primaryKpi?.delta, undefined);

  const selected = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    "obj-capacity",
    experience.catalog,
  );
  const stage = deriveNexoraMVPStageInteractionPresentation(
    selected,
    experience.catalog,
  );
  assert.equal(
    stage.scene.objects.find((entry) => entry.id === "obj-capacity")
      ?.primaryValue,
    "20.0%",
  );
});

test("Stage KPI value and state are projected from the same observation", async () => {
  const { prepared, experience } = await liveExperience(2, 8, "OBS-SAME");
  const binding = getDataRealityAwareStageObjectBindingFromExperience(
    experience,
    "obj-capacity",
  )!;
  const state = prepared.dataReality!.objectStates.find(
    (entry) => entry.objectKey === "production",
  )!;
  const kpi = prepared.dataReality!.kpis.find(
    (entry) => entry.objectKey === "production",
  )!;

  assert.equal(binding.primaryKPI?.kpiId, state.reasons[0]?.kpiId);
  assert.equal(binding.primaryKPI?.calculatedAt, prepared.observedAt);
  assert.equal(binding.realityState, "stable");
  assert.equal(binding.mvpStatus, "stable");
  assert.equal(state.state, "normal");
  assert.equal(binding.primaryKPI?.value, kpi.value);
  assert.equal(
    experience.runtimeState.datasetIdentity.datasetId,
    prepared.handoff!.dataset.id,
  );
});

test("refresh updates Stage while an unactivated historical observation cannot", async () => {
  const active = await liveExperience(2, 8, "OBS-ACTIVE");
  const refreshed = await liveExperience(7, 3, "OBS-REFRESHED");
  const activeCapacity = active.experience.catalog.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;
  const refreshedCapacity = refreshed.experience.catalog.objects.find(
    (entry) => entry.id === "obj-capacity",
  )!;

  assert.equal(activeCapacity.primaryValue, "20.0%");
  assert.equal(refreshedCapacity.primaryValue, "70.0%");
  // Merely resolving/viewing history is pure and cannot mutate active truth.
  assert.equal(active.experience.catalog.objects.find(
    (entry) => entry.id === "obj-capacity",
  )?.primaryValue, "20.0%");
  assert.equal(Object.isFrozen(active.experience.catalog.objects), true);
});

test("no active real source preserves the existing catalog presentation fallback", () => {
  const fallbackExperience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    presentationState: "minimum",
  });
  const fallbackBase = basePresentation("obj-capacity", "Capacity");

  assert.equal(fallbackExperience.usesActiveDataSource, false);
  assert.equal(
    fallbackExperience.catalog.objects.find((entry) => entry.id === "obj-capacity")
      ?.primaryValue,
    undefined,
  );
  assert.equal(
    alignPresentationViewModelToStageKpiTruth(fallbackBase, undefined).primaryKpi
      ?.value,
    "88%",
  );
});
