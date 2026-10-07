/** NPA-T STAGE-LAYOUT:1 — collision-safe overlay slots and visual validity. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import { NexoraSubjectOperation } from "@/app/executive/nex-mvp/presentation/NexoraSubjectOperation.tsx";
import { SCENE_ORG_NORMAL_STAGE_CARD_RULE } from "@/app/lib/scene-org/sceneOrgWorkspacePlacementContract.ts";
import { resolveNexoraVisualView } from "@/app/lib/director/nexoraVisualIntelligence.ts";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { projectStageProdDirectorComposition } from "./stageProdDirectorComposition.ts";
import {
  projectStageProdOverlayRects,
  resolveStageProdOverlayPlacement,
  stageProdOverlayPlacementIdentity,
  stageProdOverlayRectsIntersect,
  STAGE_PROD_OVERLAY_PLACEMENT_BOUNDARY,
} from "./stageProdOverlayPlacement.ts";
import {
  projectStageProdContextualVisuals,
  stageProdRequestedVisualRemainsValid,
} from "./stageProdVisualSpecification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
}

function focus(id: string) {
  const state = selectNexoraMVPInteractionSubject(initial(), id, catalog);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
  const composition = projectStageProdDirectorComposition({
    presentation: deriveNexoraMVPStageInteractionPresentation(state, catalog, {
      consultExecutiveChangeSessionStore: false,
    }),
    theatre,
  });
  return { state, theatre, composition };
}

function inventoryView() {
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
          unit: "units",
          sourceLabel: "inventory-observations.csv",
          example: false,
          points: Object.freeze([
            Object.freeze({ periodLabel: "2026-01-01", value: 80 }),
            Object.freeze({ periodLabel: "2026-02-01", value: 95 }),
          ]),
        }),
      ]),
    }),
    subjectId: "obj-inventory",
  });
  assert.equal(resolution.status, "SUPPORTED");
  return resolution.view;
}

function barView() {
  const resolution = resolveNexoraVisualView({
    purpose: "TREND",
    requestedRepresentation: "COMPARISON_BARS",
    evidence: Object.freeze({
      acceptedIntoDataReality: true,
      series: inventoryView().series,
    }),
    subjectId: "obj-inventory",
  });
  assert.equal(resolution.status, "SUPPORTED");
  return resolution.view;
}

test("A — Report card and chart slots do not intersect", () => {
  const projected = projectStageProdOverlayRects({
    investigation: true,
    report: true,
    operation: true,
    chart: true,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  const report = projected.rects.report;
  const chart = projected.rects.chart;
  assert.ok(report);
  assert.ok(chart);
  assert.equal(stageProdOverlayRectsIntersect(report, chart), false);
  assert.deepEqual(projected.persistentIntersections, []);
});

test("B — Actions menu occupies the transient slot beside the Problem card", () => {
  const placement = resolveStageProdOverlayPlacement({
    investigation: true,
    report: true,
    operation: true,
    chart: true,
  });
  assert.ok(placement.operation);
  assert.match(String(placement.operation.right), /min\(272px, 42%\)/);
  assert.equal(placement.operation.zIndex, 8);
  const rects = projectStageProdOverlayRects({
    investigation: true,
    report: true,
    operation: true,
    chart: false,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  assert.equal(
    stageProdOverlayRectsIntersect(rects.rects.investigation!, rects.rects.operation!),
    false,
  );
  const html = renderToStaticMarkup(
    React.createElement(NexoraSubjectOperation, {
      viewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: "operation",
        workspace: "overview",
        environmentIntent: "neutral",
        subjectId: "ctx-problem-capacity",
        subjectKind: "problem",
        subjectLabel: "Capacity Gap",
      }),
      overlayPlacement: placement.operation,
      onAction: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-subject-operation"/);
  assert.match(html, /data-stage-overlay-slot="transient-actions"/);
  assert.match(html, /data-subject-id="ctx-problem-capacity"/);
});

test("C — Inventory chart is omitted after Capacity Gap focus", () => {
  const view = inventoryView();
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view,
      focalSubjectId: "ctx-problem-capacity",
    }),
    false,
  );
  const capacity = focus("ctx-problem-capacity");
  const projection = projectStageProdContextualVisuals({
    theatre: capacity.theatre,
    composition: capacity.composition,
    requestedVisual: view,
    focalSubjectId: "ctx-problem-capacity",
  });
  assert.equal(projection.status, "omitted");
  assert.equal(projection.omissionReason, "requested-visual-not-valid-for-focal-subject");
});

test("D — same-subject bar chart refinement remains valid", () => {
  const chart = inventoryView();
  const bars = barView();
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view: chart,
      focalSubjectId: "obj-inventory",
    }),
    true,
  );
  assert.equal(
    stageProdRequestedVisualRemainsValid({
      view: bars,
      focalSubjectId: "obj-inventory",
    }),
    true,
  );
  const inventory = focus("obj-inventory");
  const projection = projectStageProdContextualVisuals({
    theatre: inventory.theatre,
    composition: inventory.composition,
    requestedVisual: bars,
    focalSubjectId: "obj-inventory",
  });
  assert.equal(projection.status, "renderable");
  assert.equal(projection.specs[0]?.family, "TREND");
  assert.equal(
    projection.specs[0] && "view" in projection.specs[0]
      ? projection.specs[0].view.representation
      : null,
    "COMPARISON_BARS",
  );
});

test("E — Capacity without accepted evidence does not inherit Inventory chart identity", () => {
  const inventory = focus("obj-inventory");
  const shown = projectStageProdContextualVisuals({
    theatre: inventory.theatre,
    composition: inventory.composition,
    requestedVisual: inventoryView(),
    focalSubjectId: "obj-inventory",
  });
  assert.deepEqual(shown.specs[0]?.canonicalObjectIds, ["obj-inventory"]);
  const capacity = focus("ctx-problem-capacity");
  const switched = projectStageProdContextualVisuals({
    theatre: capacity.theatre,
    composition: capacity.composition,
    requestedVisual: inventoryView(),
    focalSubjectId: "ctx-problem-capacity",
  });
  assert.equal(switched.status, "omitted");
  assert.ok(!switched.specs.some((spec) => spec.canonicalObjectIds.includes("obj-inventory")));
});

test("F — persistent overlay slots remain inside the Stage viewport", () => {
  const projected = projectStageProdOverlayRects({
    investigation: true,
    report: true,
    operation: true,
    chart: true,
    viewportWidth: 1100,
    viewportHeight: 640,
  });
  for (const [name, rect] of Object.entries(projected.rects)) {
    assert.ok(rect.x >= 0, `${name} x`);
    assert.ok(rect.y >= 0, `${name} y`);
    assert.ok(rect.x + rect.width <= projected.viewport.width + 0.01, `${name} right`);
    assert.ok(rect.y + rect.height <= projected.viewport.height + 0.01, `${name} bottom`);
  }
});

test("G — overlay placement honors the existing 0–3 card rule", () => {
  const placement = resolveStageProdOverlayPlacement({
    investigation: true,
    report: true,
    operation: true,
    chart: true,
  });
  assert.equal(placement.cardLimitHonored, true);
  assert.equal(SCENE_ORG_NORMAL_STAGE_CARD_RULE.maximum, 3);
  assert.equal(STAGE_PROD_OVERLAY_PLACEMENT_BOUNDARY.createsCardSystem, false);
});

test("H — omitting a stale visual does not change the canonical subject", () => {
  const capacity = focus("ctx-problem-capacity");
  const before = capacity.composition.presentation.focusedSubjectId;
  projectStageProdContextualVisuals({
    theatre: capacity.theatre,
    composition: capacity.composition,
    requestedVisual: inventoryView(),
    focalSubjectId: "ctx-problem-capacity",
  });
  assert.equal(capacity.composition.presentation.focusedSubjectId, before);
  assert.equal(before, "ctx-problem-capacity");
});

test("I — layout slots do not alter chart values, source, or acceptance", () => {
  const view = inventoryView();
  const inventory = focus("obj-inventory");
  const projection = projectStageProdContextualVisuals({
    theatre: inventory.theatre,
    composition: inventory.composition,
    requestedVisual: view,
    focalSubjectId: "obj-inventory",
  });
  resolveStageProdOverlayPlacement({
    investigation: true,
    report: true,
    operation: false,
    chart: true,
  });
  assert.deepEqual(
    projection.specs[0] && "view" in projection.specs[0]
      ? projection.specs[0].view.series[0]?.points.map((point) => point.value)
      : [],
    [80, 95],
  );
  assert.equal(projection.specs[0]?.sourceIds[0], "inventory-observations.csv");
  assert.equal(projection.fabricatedValues, false);
  assert.equal(view.provenance.example, false);
});

test("J — Saved Scene layout is not a second overlay authority", () => {
  assert.equal(stageProdOverlayPlacementIdentity, "NPA-T STAGE-PROD:4/OverlayPlacement");
  assert.equal(STAGE_PROD_OVERLAY_PLACEMENT_BOUNDARY.createsLayoutEngine, false);
  assert.equal(STAGE_PROD_OVERLAY_PLACEMENT_BOUNDARY.ownsSceneOrg, false);
  const overlay = readFileSync(join(HERE, "stageProdOverlayPlacement.ts"), "utf8");
  assert.doesNotMatch(overlay, /SAVED_SCENE|TEMPORARY.*layout/);
  const inventory = focus("obj-inventory");
  const html = renderToStaticMarkup(
    React.createElement(Nexora3DExecutiveStage, {
      workspaceLabel: "Overview",
      interaction: deriveNexoraMVPStageInteractionPresentation(inventory.state, catalog, {
        consultExecutiveChangeSessionStore: false,
      }),
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: "report",
        workspace: "overview",
        environmentIntent: "neutral",
        subjectId: "obj-inventory",
        subjectKind: "object",
        subjectLabel: "Inventory",
      }),
      advisorBridge: buildNexoraMVPAdvisorContextBridge(
        inventory.state,
        deriveNexoraMVPStageInteractionPresentation(inventory.state, catalog, {
          consultExecutiveChangeSessionStore: false,
        }),
      ),
      theatreComposition: inventory.theatre,
      requestedVisual: inventoryView(),
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-evidence-visual-view"/);
  assert.match(html, /data-testid="nexora-subject-report"/);
  assert.match(html, /data-stage-overlay-slot="evidence-visual"/);
  assert.match(html, /data-stage-overlay-slot="report-detail"/);
});
