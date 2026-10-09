/**
 * NPA-T STAGE-COMPOSITION:3 — Report / Data Reality / evidence / Advisor
 * truth-governance. Consumers only. No new truth registry.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraSubjectReport } from "@/app/executive/nex-mvp/presentation/NexoraSubjectReport.tsx";
import {
  createGithubRepositoryConnector,
  createNexoraLiveConnection,
  prepareNexoraLiveObservation,
  transitionNexoraLiveConnection,
  type NexoraLiveFetch,
} from "@/app/lib/data-reality/liveDataConnectorFoundation.ts";
import { NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE } from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicFixtures.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { composeNexoraExecutiveIntelligenceExperience } from "./nexoraExecutiveIntelligenceExperience.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "./nexoraMVPExecutiveIntelligence.ts";
import { resolveNexoraMVPDataRealityAwareAdvisorExperience } from "./nexoraMVPDataRealityAwareAdvisorExperience.ts";
import {
  alignPresentationViewModelToStageKpiTruth,
  getDataRealityAwareStageObjectBindingFromExperience,
  resolveNexoraMVPDataRealityAwareStageExperience,
} from "./nexoraMVPDataRealityAwareStageExperience.ts";
import { projectNexoraLiveSharedEpistemicFoundation } from "./nexoraLiveEpistemicProjection.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
} from "./nexoraMVPPresentationState.ts";

const NOW = "2026-08-16T18:00:00.000Z";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function detailsCapacity() {
  const focused = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    "obj-capacity",
  );
  const details = applyNexoraMVPPresentationStateChange(focused, "report");
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: details.presentationState,
    workspace: details.workspace,
    environmentIntent: details.environmentIntent,
    subjectId: details.focusedSubject?.id ?? null,
    subjectKind: details.focusedSubject?.kind ?? null,
    subjectLabel: details.focusedSubject?.label ?? null,
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(details);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(details, presentation);
  const intelligenceContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge,
    presentationViewModel,
    focusedSubject: details.focusedSubject,
    selectedSubject: details.selectedSubject,
    breadcrumb: advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(intelligenceContext);
  return Object.freeze({
    details,
    presentationViewModel,
    advisorBridge,
    intelligenceContext,
    resolution,
  });
}

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

async function liveCapacityExperience() {
  const connector = createGithubRepositoryConnector(githubFetch(2, 8));
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
    observationId: "OBS-SC3",
    observedAt: NOW,
  });
  assert.equal(prepared.ready, true);
  assert.ok(prepared.handoff);
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    dataset: prepared.handoff.dataset,
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    currentWorkspace: "executive",
    presentationState: "report",
  });
  return Object.freeze({ prepared, experience });
}

test("STAGE-COMPOSITION:3 demo-only Report is presentation data, not confirmed live truth", () => {
  const pack = detailsCapacity();
  assert.equal(pack.presentationViewModel.primaryKpi?.value, "88%");
  assert.equal(pack.presentationViewModel.primaryKpi?.provenance, "presentation-fixture");
  assert.equal(pack.presentationViewModel.showReportSurface, true);

  const html = renderToStaticMarkup(
    React.createElement(NexoraSubjectReport, {
      viewModel: pack.presentationViewModel,
    }),
  );
  assert.match(html, /data-kpi-provenance="presentation-fixture"/);
  assert.match(html, /Presentation baseline, not accepted manager data/);
  assert.doesNotMatch(html, /Accepted observation/);
  assert.doesNotMatch(html, /current data confirms/i);

  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: pack.resolution.advisor,
    insight: pack.resolution.insight,
    intelligence: pack.intelligenceContext,
    advisorBridge: pack.advisorBridge,
    nextBestAction: pack.advisorBridge.nextBestAction,
    decisionBrief: pack.advisorBridge.decisionBrief,
    decisionMemory: pack.advisorBridge.decisionMemory,
    validatedDataSource: false,
  });
  assert.doesNotMatch(narrative.situation ?? "", /current data confirms/i);
  assert.doesNotMatch(narrative.situation ?? "", /88%/);
  assert.notEqual(narrative.evidenceState, "strong");

  const epistemic = projectNexoraLiveSharedEpistemicFoundation({
    narrative,
    validatedDataSource: false,
  });
  assert.equal(epistemic.observation?.claim.type, "UNKNOWN");
  assert.doesNotMatch(epistemic.observation?.managerStatement ?? "", /current data confirms/i);

  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: pack.details,
    catalog,
    iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE],
  });
  assert.match(
    theatre.objectInvestigation?.advisorReadable.evidence ?? "",
    /does not yet have enough evidence/i,
  );
});

test("STAGE-COMPOSITION:3 pending / unvalidated source is not accepted truth", () => {
  const pack = detailsCapacity();
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: pack.resolution.advisor,
    insight: pack.resolution.insight,
    intelligence: pack.intelligenceContext,
    advisorBridge: pack.advisorBridge,
    nextBestAction: pack.advisorBridge.nextBestAction,
    decisionBrief: pack.advisorBridge.decisionBrief,
    decisionMemory: pack.advisorBridge.decisionMemory,
    validatedDataSource: false,
  });
  assert.notEqual(narrative.evidenceState, "strong");
  assert.match(
    narrative.evidenceSummary ?? "",
    /validated evidence|Evidence limited|local data|No validated evidence/i,
  );
  assert.doesNotMatch(narrative.situation ?? "", /current data confirms/i);

  const fallback = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    presentationState: "report",
  });
  assert.equal(fallback.usesActiveDataSource, false);
  const aligned = alignPresentationViewModelToStageKpiTruth(
    pack.presentationViewModel,
    undefined,
  );
  assert.equal(aligned.primaryKpi?.value, "88%");
  assert.equal(aligned.primaryKpi?.provenance, "presentation-fixture");
});

test("STAGE-COMPOSITION:3 accepted Data Reality overlays fixture for the same subject", async () => {
  const { prepared, experience } = await liveCapacityExperience();
  const pack = detailsCapacity();
  const binding = getDataRealityAwareStageObjectBindingFromExperience(
    experience,
    "obj-capacity",
  );
  const aligned = alignPresentationViewModelToStageKpiTruth(
    pack.presentationViewModel,
    binding,
  );
  const liveValue = prepared.dataReality!.kpis.find(
    (entry) => entry.objectKey === "production",
  )!.value;
  assert.equal(aligned.primaryKpi?.value, `${liveValue.toFixed(1)}%`);
  assert.equal(aligned.primaryKpi?.provenance, "accepted-observation");
  assert.notEqual(aligned.primaryKpi?.value, "88%");
  assert.equal(aligned.primaryKpi?.target, undefined);
  assert.equal(aligned.primaryKpi?.delta, undefined);

  const report = renderToStaticMarkup(
    React.createElement(NexoraSubjectReport, { viewModel: aligned }),
  );
  assert.match(report, /data-kpi-provenance="accepted-observation"/);
  assert.match(report, /Accepted observation/);
  assert.doesNotMatch(report, /Presentation baseline/);

  const intelligenceContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: pack.advisorBridge,
    presentationViewModel: aligned,
    focusedSubject: pack.details.focusedSubject,
    selectedSubject: pack.details.selectedSubject,
    breadcrumb: pack.advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(intelligenceContext);
  const { advisorBinding } = resolveNexoraMVPDataRealityAwareAdvisorExperience({
    runtimeState: experience.runtimeState,
    selectedObjectId: "obj-capacity",
    focusedObjectId: "obj-capacity",
    presentationState: "report",
    workspace: "overview",
  });
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolution.advisor,
    insight: resolution.insight,
    intelligence: intelligenceContext,
    advisorBridge: pack.advisorBridge,
    nextBestAction: pack.advisorBridge.nextBestAction,
    decisionBrief: pack.advisorBridge.decisionBrief,
    decisionMemory: pack.advisorBridge.decisionMemory,
    advisorBinding,
    validatedDataSource: true,
  });
  assert.doesNotMatch(narrative.situation ?? "", /88%/);
  assert.doesNotMatch(narrative.situation ?? "", /current data confirms/i);

  const epistemic = projectNexoraLiveSharedEpistemicFoundation({
    narrative,
    validatedDataSource: true,
    advisorBinding,
  });
  assert.equal(epistemic.observation?.claim.type, "FACT");
  assert.match(epistemic.observation?.managerStatement ?? "", /current data confirms/i);
  assert.match(
    epistemic.observation?.managerStatement ?? "",
    new RegExp(liveValue.toFixed(1).replace(".", "\\.")),
  );
  assert.doesNotMatch(epistemic.observation?.managerStatement ?? "", /88%/);

  const experiencePack = composeNexoraExecutiveIntelligenceExperience({
    narrative,
    presentationMode: pack.advisorBridge.presentationMode,
    liveOutcomeAvailable: false,
    liveLearningAvailable: false,
    cc11Live: false,
    validatedDataSource: true,
    advisorBinding,
  });
  assert.equal(experiencePack.situation.epistemic, "fact");
});

test("STAGE-COMPOSITION:3 fixture and live values stay distinct across subjects and periods", async () => {
  const { experience } = await liveCapacityExperience();
  const inventory = deriveNexoraMVPPresentationViewModel({
    presentationState: "report",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId: "obj-inventory",
    subjectKind: "object",
    subjectLabel: "Inventory",
  });
  assert.equal(inventory.primaryKpi?.label, "Turns");
  assert.equal(inventory.primaryKpi?.value, "6.1");
  const inventoryBinding = getDataRealityAwareStageObjectBindingFromExperience(
    experience,
    "obj-inventory",
  );
  const inventoryAligned = alignPresentationViewModelToStageKpiTruth(
    inventory,
    inventoryBinding,
  );
  const capacityLive = alignPresentationViewModelToStageKpiTruth(
    detailsCapacity().presentationViewModel,
    getDataRealityAwareStageObjectBindingFromExperience(experience, "obj-capacity"),
  );
  assert.notEqual(inventory.primaryKpi?.id, capacityLive.primaryKpi?.id);
  if (inventoryBinding?.primaryKPI == null) {
    assert.equal(inventoryAligned.primaryKpi?.value, "6.1");
    assert.equal(inventoryAligned.primaryKpi?.provenance, "presentation-fixture");
  } else {
    assert.equal(inventoryAligned.primaryKpi?.provenance, "accepted-observation");
    assert.notEqual(inventoryAligned.primaryKpi?.value, capacityLive.primaryKpi?.value);
  }

  assert.equal(
    getDataRealityAwareStageObjectBindingFromExperience(experience, "obj-capacity")
      ?.primaryKPI?.calculatedAt,
    NOW,
  );
  assert.equal(
    detailsCapacity().presentationViewModel.primaryKpi?.provenance,
    "presentation-fixture",
  );
});

test("STAGE-COMPOSITION:3 Focus still omits Report after truth repair", () => {
  const focused = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    "obj-capacity",
  );
  const vm = deriveNexoraMVPPresentationViewModel({
    presentationState: focused.presentationState,
    workspace: focused.workspace,
    environmentIntent: focused.environmentIntent,
    subjectId: focused.focusedSubject?.id ?? null,
    subjectKind: focused.focusedSubject?.kind ?? null,
    subjectLabel: focused.focusedSubject?.label ?? null,
  });
  assert.equal(vm.showReportSurface, false);
  assert.equal(vm.showOperationSurface, false);
});
