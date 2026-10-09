/** NPA-T STAGE-COMPOSITION:5 — DTH:7 comparison participates in overlay placement. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraStageMount } from "@/app/executive/nex-mvp/NexoraStageMount.tsx";
import {
  NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicFixtures.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectNexoraDecisionTheatreDataObjectsToStage } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectStageProjection.ts";
import { resolveNexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";
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
import { projectStageProdDirectorComposition } from "@/app/lib/stage-prod/stageProdDirectorComposition.ts";
import {
  projectStageProdOverlayRects,
  resolveStageProdOverlayPlacement,
  stageProdOverlayRectsIntersect,
} from "@/app/lib/stage-prod/stageProdOverlayPlacement.ts";
import { projectStageProdContextualVisuals } from "@/app/lib/stage-prod/stageProdVisualSpecification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const scenarioIds = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
const emptyDataObjectStage = projectNexoraDecisionTheatreDataObjectsToStage({
  dataObjects: Object.freeze([]),
  visibleDataObjectIds: Object.freeze([]),
  selectedDataObjectId: null,
  businessFocusId: null,
  stageObjects: Object.freeze([]),
});

function compareTheatre(
  presentationState: "minimum" | "report" | "operation" = "minimum",
) {
  const collected = presentNexoraMVPExecutiveQueueCollection(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    { category: "scenario", objectIds: scenarioIds },
    catalog,
  );
  const focused = selectNexoraMVPInteractionSubject(
    collected,
    scenarioIds[0],
    catalog,
  );
  const state = applyNexoraMVPPresentationStateChange(focused, presentationState);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: `sc5:${scenarioIds.join(",")}`,
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
        sourceRef: "stage-prod-4-pricing-cost",
      }),
      Object.freeze({
        ...NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES[0]!,
        ownerExecutiveObjectId: scenarioIds[1],
        sourceRef: "stage-prod-4-demand-cost",
      }),
    ]),
  });
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
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
  return Object.freeze({
    state,
    theatre,
    interaction,
    presentationViewModel,
    advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
  });
}

function renderMount(
  pack: ReturnType<typeof compareTheatre>,
  requestedVisual?: Parameters<typeof NexoraStageMount>[0]["requestedVisual"],
) {
  return renderToStaticMarkup(
    React.createElement(NexoraStageMount, {
      workspaceLabel: "Overview",
      interaction: pack.interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: pack.presentationViewModel,
      advisorBridge: pack.advisorBridge,
      theatreComposition: pack.theatre,
      requestedVisual,
      decisionComparison: pack.theatre.decisionComparison,
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

test("STAGE-COMPOSITION:5 comparison-only occupies existing context overlay slot", () => {
  const pack = compareTheatre("minimum");
  assert.ok(pack.theatre.decisionComparison);
  const placement = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: true,
    report: false,
    operation: false,
    chart: false,
  });
  assert.ok(placement.comparison);
  assert.equal(placement.investigation, null);
  assert.equal(placement.report, null);
  assert.equal(placement.operation, null);
  const html = renderMount(pack);
  assert.match(html, /data-testid="nexora-theatre-comparison"/);
  assert.match(html, /data-stage-overlay-slot="comparison"/);
  assert.match(html, /data-theatre-comparison-id="/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
  assert.equal(
    pack.theatre.decisionComparison.identity,
    "DTH:7/DecisionComparison",
  );
});

test("STAGE-COMPOSITION:5 comparison + Details is supported coexistence without intersection", () => {
  const pack = compareTheatre("report");
  assert.equal(pack.presentationViewModel.showReportSurface, true);
  const rects = projectStageProdOverlayRects({
    investigation: false,
    comparison: true,
    report: true,
    operation: false,
    chart: false,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  assert.ok(rects.rects.comparison);
  assert.ok(rects.rects.report);
  assert.equal(
    stageProdOverlayRectsIntersect(rects.rects.comparison, rects.rects.report),
    false,
  );
  const html = renderMount(pack);
  assert.match(html, /data-testid="nexora-theatre-comparison"/);
  assert.match(html, /data-testid="nexora-subject-report"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-operation"/);
});

test("STAGE-COMPOSITION:5 comparison + chart is supported coexistence without intersection", () => {
  const pack = compareTheatre("minimum");
  const composition = projectStageProdDirectorComposition({
    presentation: pack.interaction,
    theatre: pack.theatre,
  });
  const visuals = projectStageProdContextualVisuals({
    theatre: pack.theatre,
    composition,
  });
  const rects = projectStageProdOverlayRects({
    investigation: false,
    comparison: true,
    report: false,
    operation: false,
    chart: true,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  assert.ok(rects.rects.comparison);
  assert.ok(rects.rects.chart);
  assert.equal(
    stageProdOverlayRectsIntersect(rects.rects.comparison, rects.rects.chart),
    false,
  );
  const html = renderMount(pack);
  assert.match(html, /data-testid="nexora-theatre-comparison"/);
  if (visuals.status === "renderable") {
    assert.match(html, /data-testid="nexora-evidence-visual-view"|data-visual-representation/);
  }
  assert.doesNotMatch(html, /data-stage-visual-family="STATUS_CARD"/);
});

test("STAGE-COMPOSITION:5 comparison + ACTIONS is transient coexistence without intersection", () => {
  const pack = compareTheatre("operation");
  assert.equal(pack.presentationViewModel.showOperationSurface, true);
  const placement = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: true,
    report: false,
    operation: true,
    chart: false,
  });
  assert.ok(placement.comparison);
  assert.ok(placement.operation);
  assert.match(String(placement.operation.right), /min\(272px, 42%\)/);
  const rects = projectStageProdOverlayRects({
    investigation: false,
    comparison: true,
    report: false,
    operation: true,
    chart: false,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  assert.equal(
    stageProdOverlayRectsIntersect(rects.rects.comparison!, rects.rects.operation!),
    false,
  );
  const html = renderMount(pack);
  assert.match(html, /data-testid="nexora-theatre-comparison"/);
  assert.match(html, /data-testid="nexora-subject-operation"/);
  assert.doesNotMatch(html, /data-testid="nexora-subject-report"/);
});

test("STAGE-COMPOSITION:5 comparison does not obscure the Object working region", () => {
  const rects = projectStageProdOverlayRects({
    investigation: false,
    comparison: true,
    report: true,
    operation: true,
    chart: true,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  const comparison = rects.rects.comparison!;
  const objectRegion = Object.freeze({
    x: 12,
    y: 72,
    width: comparison.x - 12 - 8,
    height: 640 - 72 - 20,
  });
  assert.ok(objectRegion.width > 400);
  assert.equal(stageProdOverlayRectsIntersect(comparison, objectRegion), false);
  assert.deepEqual(rects.persistentIntersections, []);
});

test("STAGE-COMPOSITION:5 ending comparison restores Details Report without new state", () => {
  const details = compareTheatre("report");
  assert.equal(details.presentationViewModel.showReportSurface, true);
  const during = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: true,
    report: true,
    operation: false,
    chart: false,
  });
  const after = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: false,
    report: true,
    operation: false,
    chart: false,
  });
  assert.ok(during.comparison);
  assert.ok(during.report);
  assert.equal(after.comparison, null);
  assert.ok(after.report);
  assert.equal(details.presentationViewModel.state, "report");
});

test("STAGE-COMPOSITION:5 chart request remains valid while comparison is primary", () => {
  const view = inventoryTrend();
  const during = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: true,
    report: false,
    operation: false,
    chart: true,
  });
  const after = resolveStageProdOverlayPlacement({
    investigation: false,
    comparison: false,
    report: false,
    operation: false,
    chart: true,
  });
  assert.ok(during.chart);
  assert.ok(after.chart);
  assert.equal(during.comparison != null, true);
  assert.equal(after.comparison, null);
  assert.equal(view.series[0]?.sourceLabel, "inventory-observations.csv");
});

test("STAGE-COMPOSITION:5 does not add a layout engine, store, or comparison visibility state", () => {
  const overlay = readFileSync(
    join(FRONTEND, "app/lib/stage-prod/stageProdOverlayPlacement.ts"),
    "utf8",
  );
  const mount = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraStageMount.tsx"),
    "utf8",
  );
  const surface = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraDecisionTheatreComparisonSurface.tsx"),
    "utf8",
  );
  assert.doesNotMatch(overlay, /resolveDth7Placement|TheatreOverlayRegistry|comparisonLayoutStore|isComparisonOpen/);
  assert.doesNotMatch(mount, /isComparisonOpen|showComparisonSurface/);
  assert.doesNotMatch(surface, /if \(comparisonVisible && reportVisible\)/);
  assert.match(mount, /comparison:/);
  assert.doesNotMatch(mount, /NexoraDecisionTheatreComparisonSurface/);
  assert.match(surface, /overlayPlacement/);
});
