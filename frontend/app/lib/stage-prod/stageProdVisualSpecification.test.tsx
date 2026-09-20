/** NPA-T STAGE-PROD:4 — contextual Chart/Card → production Stage. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import {
  NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatreIconicFixtures.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
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
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { projectStageProdDirectorComposition } from "./stageProdDirectorComposition.ts";
import {
  projectStageProdContextualVisuals,
  stageProdVisualSpecificationIdentity,
} from "./stageProdVisualSpecification.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const scenarioIds = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function presentation(state: NexoraMVPObjectInteractionState) {
  return deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
}

function investigation() {
  const state = selectNexoraMVPInteractionSubject(
    initial(),
    "ctx-problem-capacity",
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(state),
    theatre,
  });
  return { state, theatre, composition };
}

function trendView(): NexoraVisualView {
  const resolution = resolveNexoraVisualView({
    purpose: "TREND",
    evidence: nexoraExampleOperationsVisualEvidence(),
    subjectId: "otd",
  });
  assert.equal(resolution.status, "SUPPORTED");
  return resolution.view;
}

function comparison() {
  const state = presentNexoraMVPExecutiveQueueCollection(
    initial(),
    { category: "scenario", objectIds: scenarioIds },
    catalog,
  );
  const sceneSemanticInput = emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `stage-prod-4:${scenarioIds.join(",")}`,
    canonicalOperation: "COMPARE",
    conversationIntentKind: "compare-scenarios",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...scenarioIds]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
  });
  const capacityCost = NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES[0]!;
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput,
    iconicAuthoritativeSources: Object.freeze([
      Object.freeze({
        ...NEXORA_DECISION_THEATRE_DTH2_MANAGER_REPORTED_COST,
        ownerExecutiveObjectId: scenarioIds[0],
        sourceRef: "stage-prod-4-pricing-cost",
      }),
      Object.freeze({
        ...capacityCost,
        ownerExecutiveObjectId: scenarioIds[1],
        sourceRef: "stage-prod-4-demand-cost",
      }),
    ]),
  });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(state),
    theatre,
  });
  return { state, theatre, composition };
}

function renderStage(
  state: NexoraMVPObjectInteractionState,
  theatre: ReturnType<typeof projectNexoraDecisionTheatreFoundation>,
  requestedVisual: NexoraVisualView | null = null,
): string {
  const interaction = presentation(state);
  const subject = state.focusedSubject ?? state.selectedSubject;
  return renderToStaticMarkup(
    React.createElement(Nexora3DExecutiveStage, {
      workspaceLabel: "Overview",
      interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState(
        state.environmentIntent,
      ),
      presentationViewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: state.presentationState,
        workspace: state.workspace,
        environmentIntent: state.environmentIntent,
        subjectId: subject?.id ?? null,
        subjectKind: subject?.kind ?? null,
        subjectLabel: subject?.label ?? null,
      }),
      advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
      theatreComposition: theatre,
      requestedVisual,
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
    }),
  );
}

test("A — canonical evidence reaches a visible visual in the production Stage", () => {
  const context = investigation();
  const html = renderStage(context.state, context.theatre, trendView());
  assert.match(html, /data-stage-prod-visual="NPA-T STAGE-PROD:4\/ContextualVisualSpecification"/);
  assert.match(html, /data-testid="nexora-stage-contextual-visual"/);
  assert.match(html, /data-visual-representation="TREND_LINE"/);
});

test("B — valid ordered fixture observations produce a Trend", () => {
  const context = investigation();
  const projection = projectStageProdContextualVisuals({
    theatre: context.theatre,
    composition: context.composition,
    requestedVisual: trendView(),
  });
  const spec = projection.specs[0];
  assert.equal(spec?.family, "TREND");
  assert.deepEqual(
    spec?.family === "TREND"
      ? spec.view.series[0]?.points.map((point) => point.value)
      : [],
    [89.8, 90.1],
  );
});

test("C — comparable Scenario evidence produces a comparison without changing IDs", () => {
  const context = comparison();
  const projection = projectStageProdContextualVisuals({
    theatre: context.theatre,
    composition: context.composition,
  });
  const spec = projection.specs[0];
  assert.equal(spec?.family, "COMPARISON");
  assert.deepEqual(spec?.canonicalObjectIds, scenarioIds);
  assert.deepEqual(
    spec?.family === "COMPARISON"
      ? spec.view.series.map((series) => series.id)
      : [],
    scenarioIds,
  );
  assert.match(renderStage(context.state, context.theatre), /COMPARISON_BARS/);
});

test("D — existing Capacity Gap state renders as a compact Status Card", () => {
  const context = investigation();
  const projection = projectStageProdContextualVisuals({
    theatre: context.theatre,
    composition: context.composition,
  });
  const spec = projection.specs[0];
  assert.equal(spec?.family, "STATUS_CARD");
  assert.equal(spec?.canonicalObjectIds[0], "ctx-problem-capacity");
  assert.ok(spec?.family === "STATUS_CARD" && spec.status?.length);
  const html = renderStage(context.state, context.theatre);
  assert.match(html, /data-stage-visual-family="STATUS_CARD"/);
  assert.match(html, /Capacity Gap/);
});

test("E — contextual visuals appear only with a supported need", () => {
  const state = initial();
  const theatre = projectNexoraDecisionTheatreFoundation({ stageState: state, catalog });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(state),
    theatre,
  });
  const projection = projectStageProdContextualVisuals({ theatre, composition });
  assert.equal(projection.status, "omitted");
  assert.equal(projection.specs.length, 0);
  assert.doesNotMatch(renderStage(state, theatre), /data-testid="nexora-stage-contextual-visual"/);
});

test("F — visual association preserves the Capacity Gap canonical referent", () => {
  const context = investigation();
  const projection = projectStageProdContextualVisuals({
    theatre: context.theatre,
    composition: context.composition,
    requestedVisual: trendView(),
  });
  assert.deepEqual(projection.specs[0]?.canonicalObjectIds, ["ctx-problem-capacity"]);
  assert.match(
    renderStage(context.state, context.theatre, trendView()),
    /data-stage-visual-object-ids="ctx-problem-capacity"/,
  );
});

test("G — evidence confidence and expectation semantics remain unchanged", () => {
  const investigate = investigation();
  const trend = projectStageProdContextualVisuals({
    theatre: investigate.theatre,
    composition: investigate.composition,
    requestedVisual: trendView(),
  });
  assert.deepEqual(trend.specs[0]?.evidenceStates, ["LIKELY"]);
  const compare = comparison();
  const bars = projectStageProdContextualVisuals({
    theatre: compare.theatre,
    composition: compare.composition,
  });
  assert.deepEqual(bars.specs[0]?.evidenceStates, ["expectation", "expectation"]);
});

test("H — missing comparable data produces no invented series or value", () => {
  const state = presentNexoraMVPExecutiveQueueCollection(
    initial(),
    { category: "scenario", objectIds: scenarioIds },
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: "stage-prod-4:missing-comparison",
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
  });
  const composition = projectStageProdDirectorComposition({
    presentation: presentation(state),
    theatre,
  });
  const projection = projectStageProdContextualVisuals({ theatre, composition });
  assert.equal(projection.status, "omitted");
  assert.equal(projection.specs.length, 0);
  assert.equal(projection.fabricatedValues, false);
});

test("I — visual specification and rendering are read-only", () => {
  const context = comparison();
  const before = JSON.stringify(context);
  const projection = projectStageProdContextualVisuals({
    theatre: context.theatre,
    composition: context.composition,
  });
  renderStage(context.state, context.theatre);
  assert.equal(JSON.stringify(context), before);
  assert.equal(projection.writesCanonicalManagementState, false);
  assert.ok(projection.specs.every((spec) => !spec.writesCanonicalManagementState));
});

test("J — STAGE-PROD:1–3 host, Object renderer, and composition remain authoritative", () => {
  assert.equal(
    stageProdVisualSpecificationIdentity,
    "NPA-T STAGE-PROD:4/ContextualVisualSpecification",
  );
  const host = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx"),
    "utf8",
  );
  const scene = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(host, /projectStageProdDirectorComposition/);
  assert.match(host, /projectStageProdContextualVisuals/);
  assert.match(scene, /<NexoraStageObject/);
  assert.doesNotMatch(host, /VisualStore|ChartTruthStore|create.*Director/);
});
