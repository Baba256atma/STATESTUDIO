/** NPA-T STAGE-PROD:3 — Director/Theatre composition → production Stage. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  projectNexoraDecisionTheatreFoundation,
} from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { ExecutiveShell } from "@/app/executive/components/ExecutiveShell.tsx";
import {
  projectStageProdDirectorComposition,
  stageProdDirectorCompositionIdentity,
} from "./stageProdDirectorComposition.ts";

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

function compareSemantic() {
  return emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `stage-prod-3:${scenarioIds.join(",")}`,
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
}

function basePresentation(state: NexoraMVPObjectInteractionState) {
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
  return { state, theatre };
}

function comparison() {
  const state = initial();
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput: compareSemantic(),
    comparisonLevel: "compare",
  });
  return { state, theatre };
}

function commitment() {
  const state = selectNexoraMVPInteractionSubject(
    initial(),
    "ctx-scenario-pricing",
    catalog,
  );
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    sceneSemanticInput: compareSemantic(),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  return { state, theatre };
}

function renderStage(
  state: NexoraMVPObjectInteractionState,
  theatre: ReturnType<typeof projectNexoraDecisionTheatreFoundation>,
): string {
  const interaction = basePresentation(state);
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
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
    }),
  );
}

test("A — existing Director/Theatre scene intent reaches production Stage", () => {
  const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
  assert.match(
    html,
    /data-stage-prod-composition="NPA-T STAGE-PROD:3\/DirectorStageComposition"/,
  );
  assert.match(html, /data-stage-prod-scene-intent=/);
  const shell = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /theatreComposition=\{theatreProjection\}/);
});

test("B — Problem investigation composes around Capacity Gap", () => {
  const { state, theatre } = investigation();
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-problem-capacity");
  const composition = projectStageProdDirectorComposition({
    presentation: basePresentation(state),
    theatre,
  });
  assert.equal(composition.family, "investigation");
  assert.equal(composition.status, "applied");
  const focused = composition.presentation.scene.objects.find(
    (object) => object.id === "ctx-problem-capacity",
  );
  assert.equal(focused?.focused, true);
  assert.deepEqual(focused?.targetPosition, [0, 0.45, 0]);
});

test("C — Scenario comparison renders both canonical participants as a pair", () => {
  const { state, theatre } = comparison();
  assert.deepEqual(theatre.decisionComparison?.candidateIds, scenarioIds);
  const composition = projectStageProdDirectorComposition({
    presentation: basePresentation(state),
    theatre,
  });
  assert.equal(composition.family, "comparison");
  const candidates = scenarioIds.map((id) =>
    composition.presentation.scene.objects.find((object) => object.id === id),
  );
  assert.ok(candidates.every(Boolean));
  assert.notDeepEqual(
    candidates[0]?.targetPosition,
    candidates[1]?.targetPosition,
  );
  const html = renderStage(state, theatre);
  for (const id of scenarioIds) {
    assert.match(html, new RegExp(`data-canonical-id="${id}"`));
  }
});

test("D — commitment review centers the existing candidate without creating a Decision", () => {
  const { state, theatre } = commitment();
  assert.equal(theatre.decisionCommitment?.candidateId, "ctx-scenario-pricing");
  assert.equal(theatre.decisionCommitment?.authoritativeDecisionId, null);
  assert.equal(theatre.writes.decisionState, false);
  const composition = projectStageProdDirectorComposition({
    presentation: basePresentation(state),
    theatre,
  });
  assert.equal(composition.family, "commitment");
  assert.deepEqual(
    composition.presentation.scene.objects.find(
      (object) => object.id === "ctx-scenario-pricing",
    )?.targetPosition,
    [0, 0.45, 0],
  );
  assert.equal(composition.writesCanonicalManagementState, false);
});

test("E — investigation and comparison have different rendered structure", () => {
  const investigate = investigation();
  const compare = comparison();
  const first = projectStageProdDirectorComposition({
    presentation: basePresentation(investigate.state),
    theatre: investigate.theatre,
  });
  const second = projectStageProdDirectorComposition({
    presentation: basePresentation(compare.state),
    theatre: compare.theatre,
  });
  assert.notEqual(first.structuralSignature, second.structuralSignature);
  assert.notDeepEqual(first.canonicalObjectIds, second.canonicalObjectIds);
});

test("F — canonical IDs survive Theatre composition and renderer", () => {
  const { state, theatre } = comparison();
  const composition = projectStageProdDirectorComposition({
    presentation: basePresentation(state),
    theatre,
  });
  assert.deepEqual(
    scenarioIds.filter((id) => composition.canonicalObjectIds.includes(id)),
    [...scenarioIds],
  );
  const html = renderStage(state, theatre);
  assert.match(html, /data-stage-prod-composition-object-ids="[^"]*ctx-scenario-pricing/);
  assert.match(html, /data-stage-prod-composition-object-ids="[^"]*ctx-scenario-demand/);
});

test("G — Capacity Gap remains the referent and focused Object", () => {
  const { state, theatre } = investigation();
  const composition = projectStageProdDirectorComposition({
    presentation: basePresentation(state),
    theatre,
  });
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  assert.equal(composition.presentation.focusedSubjectId, "ctx-problem-capacity");
  assert.equal(
    composition.presentation.scene.focusedObjectId,
    "ctx-problem-capacity",
  );
  assert.equal(
    composition.presentation.scene.objects.find((object) => object.focused)?.id,
    "ctx-problem-capacity",
  );
});

test("H — composition is read-only", () => {
  const { state, theatre } = commitment();
  const presentation = basePresentation(state);
  const before = JSON.stringify({ presentation, theatre });
  const composition = projectStageProdDirectorComposition({
    presentation,
    theatre,
  });
  assert.equal(JSON.stringify({ presentation, theatre }), before);
  assert.equal(composition.writesCanonicalManagementState, false);
  assert.equal(composition.inventedObjects, false);
});

test("I — STAGE-PROD:1/2 host and Object renderer remain authoritative", () => {
  assert.equal(
    stageProdDirectorCompositionIdentity,
    "NPA-T STAGE-PROD:3/DirectorStageComposition",
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
  assert.match(scene, /<NexoraStageObject/);
  assert.doesNotMatch(host, /StageProdDirectorStore|create.*Director/);
});

test("J — missing composition preserves Stage safely", () => {
  const presentation = basePresentation(initial());
  const composition = projectStageProdDirectorComposition({ presentation });
  assert.equal(composition.status, "missing");
  assert.equal(composition.family, "preserved");
  assert.equal(composition.presentation, presentation);
  assert.equal(composition.inventedObjects, false);
  assert.equal(composition.sceneIntentKind, null);
});
