/** NPA-T STAGE-COMPOSITION:4 — Report vs textual STATUS_CARD responsibility. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "@/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import { NexoraStageMount } from "@/app/executive/nex-mvp/NexoraStageMount.tsx";
import { NexoraSubjectReport } from "@/app/executive/nex-mvp/presentation/NexoraSubjectReport.tsx";
import {
  NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
  NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicFixtures.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import {
  nexoraExampleOperationsVisualEvidence,
  resolveNexoraVisualView,
  type NexoraVisualView,
} from "@/app/lib/director/nexoraVisualIntelligence.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  presentNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyNexoraMVPPresentationStateChange,
  deriveNexoraMVPPresentationViewModel,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import {
  createEmptySceneOrgRightPackageTabSession,
  openSceneOrgRightPackageTab,
  syncSceneOrgRightSelectedObjectTab,
} from "@/app/lib/scene-org/sceneOrgRightPackageTabContract.ts";
import { projectStageProdDirectorComposition } from "@/app/lib/stage-prod/stageProdDirectorComposition.ts";
import { projectStageProdContextualVisuals } from "@/app/lib/stage-prod/stageProdVisualSpecification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const emptyDataObjectStage = projectNexoraDecisionTheatreDataObjectsToStage({
  dataObjects: Object.freeze([]),
  visibleDataObjectIds: Object.freeze([]),
  selectedDataObjectId: null,
  businessFocusId: null,
  stageObjects: Object.freeze([]),
});
const scenarioIds = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

function pack(
  subjectId: string,
  presentationState: "minimum" | "report" | "operation" = "minimum",
  extra?: Omit<
    Parameters<typeof projectNexoraDecisionTheatreFoundation>[0],
    "stageState" | "catalog"
  >,
) {
  const focused = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    subjectId,
    catalog,
  );
  const state = applyNexoraMVPPresentationStateChange(focused, presentationState);
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
    ...extra,
  });
  const subject = state.focusedSubject ?? state.selectedSubject;
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: subject?.id ?? null,
    subjectKind: subject?.kind ?? null,
    subjectLabel: subject?.label ?? null,
  });
  const composition = projectStageProdDirectorComposition({
    presentation: interaction,
    theatre,
  });
  const session = openSceneOrgRightPackageTab(
    syncSceneOrgRightSelectedObjectTab(createEmptySceneOrgRightPackageTabSession(), {
      package: "investigation",
      canonicalId: subjectId,
      label: subject?.label ?? subjectId,
    }),
    {
      package: "investigation",
      canonicalId: subjectId,
      label: subject?.label ?? subjectId,
    },
  );
  return Object.freeze({
    state,
    interaction,
    theatre,
    composition,
    presentationViewModel,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
    session,
  });
}

function renderStage(
  fixture: ReturnType<typeof pack>,
  requestedVisual?: NexoraVisualView | null,
) {
  return renderToStaticMarkup(
    React.createElement(NexoraStageMount, {
      workspaceLabel: "Overview",
      interaction: fixture.interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: fixture.presentationViewModel,
      advisorBridge: fixture.advisorBridge,
      theatreComposition: fixture.theatre,
      objectInvestigation: fixture.theatre.objectInvestigation,
      investigationVisible: true,
      requestedVisual,
      dataObjectStage: emptyDataObjectStage,
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
      onSelectDataObject: () => undefined,
      onRemoveDataObjectFromStage: () => undefined,
      onOpenDataRail: () => undefined,
      onAskDataObject: () => undefined,
    }),
  );
}

function renderSelectedObject(fixture: ReturnType<typeof pack>) {
  return renderToStaticMarkup(
    React.createElement(NexoraAdvisorInsightRegion, {
      tab: "Assist",
      onTabChange: () => undefined,
      advisorBridge: fixture.advisorBridge,
      presentationViewModel: fixture.presentationViewModel,
      focusedSubject: fixture.state.focusedSubject,
      selectedSubject: fixture.state.selectedSubject,
      onIntelligenceAction: () => undefined,
      packageTabSession: fixture.session,
      theatreComposition: fixture.theatre,
      investigationLevel: "understand",
    }),
  );
}

function renderAdvisor(fixture: ReturnType<typeof pack>) {
  return renderToStaticMarkup(
    React.createElement(NexoraAdvisorInsightRegion, {
      tab: "Assist",
      onTabChange: () => undefined,
      advisorBridge: fixture.advisorBridge,
      presentationViewModel: fixture.presentationViewModel,
      focusedSubject: fixture.state.focusedSubject,
      selectedSubject: fixture.state.selectedSubject,
      onIntelligenceAction: () => undefined,
      theatreComposition: fixture.theatre,
    }),
  );
}

function inventoryTrend() {
  const resolution = resolveNexoraVisualView({
    purpose: "TREND",
    evidence: Object.freeze({
      acceptedIntoDataReality: true,
      series: Object.freeze([
        Object.freeze({
          id: "obj-inventory",
          fieldLabel: "Inventory On Hand",
          displayLabel: "Inventory",
          confidence: "CONFIRMED" as const,
          unit: null,
          sourceLabel: "inventory-observations.csv",
          example: false,
          points: Object.freeze([
            Object.freeze({ periodLabel: "2026-01-01", value: 80 }),
            Object.freeze({ periodLabel: "2026-02-01", value: 95 }),
            Object.freeze({ periodLabel: "2026-03-01", value: 88 }),
            Object.freeze({ periodLabel: "2026-04-01", value: 72 }),
            Object.freeze({ periodLabel: "2026-05-01", value: 67 }),
            Object.freeze({ periodLabel: "2026-06-01", value: 74 }),
          ]),
        }),
      ]),
    }),
    subjectId: "obj-inventory",
  });
  assert.equal(resolution.status, "SUPPORTED");
  return resolution.view;
}

test("STAGE-COMPOSITION:4 Capacity Focus is Object-first without textual STATUS_CARD", () => {
  const fixture = pack("obj-capacity", "minimum");
  const visuals = projectStageProdContextualVisuals({
    theatre: fixture.theatre,
    composition: fixture.composition,
  });
  assert.equal(fixture.presentationViewModel.showReportSurface, false);
  assert.equal(fixture.presentationViewModel.showOperationSurface, false);
  assert.ok(fixture.theatre.objectInvestigation);
  assert.equal(visuals.status, "omitted");
  const html = renderStage(fixture);
  assert.match(html, /data-focused-object="obj-capacity"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
  assert.doesNotMatch(html, /data-testid="nexora-stage-contextual-visual"/);
  assert.doesNotMatch(html, /data-testid="nexora-theatre-investigation"/);
});

test("STAGE-COMPOSITION:4 Capacity Details is Object + Report without STATUS_CARD", () => {
  const fixture = pack("obj-capacity", "report");
  assert.equal(fixture.presentationViewModel.showReportSurface, true);
  assert.equal(fixture.presentationViewModel.showOperationSurface, false);
  const html = renderStage(fixture);
  const report = renderToStaticMarkup(
    React.createElement(NexoraSubjectReport, {
      viewModel: fixture.presentationViewModel,
    }),
  );
  assert.match(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
  assert.match(report, /data-kpi-provenance="presentation-fixture"/);
  assert.match(report, /Presentation baseline, not accepted manager data/);
});

test("STAGE-COMPOSITION:4 Capacity Actions is Object + ACTIONS without STATUS_CARD", () => {
  const fixture = pack("obj-capacity", "operation");
  assert.equal(fixture.presentationViewModel.showReportSurface, false);
  assert.equal(fixture.presentationViewModel.showOperationSurface, true);
  const html = renderStage(fixture);
  assert.match(html, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
});

test("STAGE-COMPOSITION:4 evidence insufficiency remains discoverable without Stage STATUS_CARD", () => {
  const fixture = pack("obj-capacity", "minimum", {
    iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE],
  });
  assert.match(
    fixture.theatre.objectInvestigation?.advisorReadable.evidence ?? "",
    /does not yet have enough evidence/i,
  );
  const selected = renderSelectedObject(fixture);
  const advisor = renderAdvisor(fixture);
  assert.doesNotMatch(renderStage(fixture), /data-stage-visual-family="STATUS_CARD"/);
  assert.match(selected, /data-testid="nexora-theatre-investigation"/);
  assert.match(selected, /does not yet have enough evidence/i);
  assert.match(selected, /data-testid="nexora-theatre-investigation-source"/);
  assert.match(advisor, /data-testid="nexora-advisor-situation"/);
});

test("STAGE-COMPOSITION:4 requested Inventory chart remains Stage-owned visual evidence", () => {
  const fixture = pack("obj-inventory", "minimum");
  const view = inventoryTrend();
  const visuals = projectStageProdContextualVisuals({
    theatre: fixture.theatre,
    composition: fixture.composition,
    requestedVisual: view,
    focalSubjectId: "obj-inventory",
  });
  assert.equal(visuals.specs[0]?.family, "TREND");
  const html = renderStage(fixture, view);
  assert.match(html, /data-visual-representation="TREND_LINE"/);
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
  assert.match(html, /data-testid="nexora-stage-visual-inspection"/);
  assert.deepEqual(
    view.series[0]?.points.map((point) => point.value),
    [80, 95, 88, 72, 67, 74],
  );
});

test("STAGE-COMPOSITION:4 comparison remains Stage-owned Theatre visual, not STATUS_CARD", () => {
  const state = presentNexoraMVPExecutiveQueueCollection(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    { category: "scenario", objectIds: scenarioIds },
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: `sc4:${scenarioIds.join(",")}`,
      canonicalOperation: "COMPARE",
      conversationIntentKind: "compare-scenarios",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze([...scenarioIds]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
    iconicAuthoritativeSources: Object.freeze([
      Object.freeze({
        ...NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
        ownerExecutiveObjectId: scenarioIds[0],
        sourceRef: "sc4-pricing-cost",
      }),
      Object.freeze({
        ...NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES[0]!,
        ownerExecutiveObjectId: scenarioIds[1],
        sourceRef: "sc4-demand-cost",
      }),
    ]),
  });
  const composition = projectStageProdDirectorComposition({
    presentation: deriveNexoraMVPStageInteractionPresentation(state, catalog, {
      consultExecutiveChangeSessionStore: false,
    }),
    theatre,
  });
  const visuals = projectStageProdContextualVisuals({ theatre, composition });
  assert.equal(visuals.specs[0]?.family, "COMPARISON");
  assert.equal(
    visuals.specs.some((spec) => spec.family === "STATUS_CARD"),
    false,
  );
});

test("STAGE-COMPOSITION:4 DTH:6 semantic investigation remains even without Stage STATUS_CARD", () => {
  const fixture = pack("ctx-problem-capacity", "minimum");
  assert.equal(
    fixture.theatre.objectInvestigation?.identity,
    "DTH:6/ObjectInvestigation",
  );
  assert.equal(fixture.theatre.objectInvestigation?.objectId, "ctx-problem-capacity");
  const visuals = projectStageProdContextualVisuals({
    theatre: fixture.theatre,
    composition: fixture.composition,
  });
  assert.equal(
    visuals.specs.some((spec) => spec.family === "STATUS_CARD"),
    false,
  );
});

test("STAGE-COMPOSITION:4 does not add evidence panels, stores, or layout engines", () => {
  const projection = readFileSync(
    join(FRONTEND, "app/lib/stage-prod/stageProdVisualSpecification.ts"),
    "utf8",
  );
  const investigation = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx"),
    "utf8",
  );
  const presentation = readFileSync(
    join(FRONTEND, "app/lib/nex-mvp/nexoraMVPPresentationState.ts"),
    "utf8",
  );
  assert.doesNotMatch(projection, /showStatusCard|evidenceCardOpen|sceneEvidenceMode|statusCardDismissed/);
  assert.doesNotMatch(investigation, /Evidence Panel|Evidence Drawer|Evidence Tab/);
  assert.doesNotMatch(presentation, /showStatusCard/);
  assert.match(projection, /requestedSpec \?\?/);
  assert.doesNotMatch(projection, /statusCardSpec\(/);
});

test("STAGE-COMPOSITION:4 requested chart still replaces any textual evidence fallback", () => {
  const fixture = pack("obj-inventory", "minimum");
  const unsupported = resolveNexoraVisualView({
    purpose: "TREND",
    evidence: nexoraExampleOperationsVisualEvidence(),
    subjectId: "otd",
  });
  assert.equal(unsupported.status, "SUPPORTED");
  const omitted = projectStageProdContextualVisuals({
    theatre: fixture.theatre,
    composition: fixture.composition,
    requestedVisual: unsupported.view,
    focalSubjectId: "obj-inventory",
  });
  assert.equal(omitted.status, "omitted");
  assert.equal(omitted.omissionReason, "requested-visual-not-valid-for-focal-subject");
  assert.equal(
    omitted.specs.some((spec) => spec.family === "STATUS_CARD"),
    false,
  );
});
