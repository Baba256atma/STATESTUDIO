/** NPA-T STAGE-PROD:6A — focused Motion Foundation tests. */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import { NexoraStageContextualVisual } from "@/app/executive/nex-mvp/stage/NexoraStageContextualVisual.tsx";
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
import type { StageProdStatusCardVisualSpec } from "./stageProdVisualSpecification.ts";
import {
  projectStageProdObjectMotion,
  stageProdObjectMotionIdentity,
} from "./stageProdObjectMotion.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");
const CAPACITY_GAP_ID = "ctx-problem-capacity";
const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function renderCapacityStage(): string {
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    CAPACITY_GAP_ID,
    catalog,
  );
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const theatre = projectNexoraDecisionTheatreFoundation({ stageState: state, catalog });
  return renderToStaticMarkup(
    React.createElement(Nexora3DExecutiveStage, {
      workspaceLabel: "Overview",
      interaction,
      environment: deriveNexoraMVPSceneEnvironmentVisualState("neutral"),
      presentationViewModel: deriveNexoraMVPPresentationViewModel({
        presentationState: "minimum",
        workspace: "overview",
        environmentIntent: "neutral",
        subjectId: CAPACITY_GAP_ID,
        subjectKind: "problem",
        subjectLabel: "Capacity Gap",
      }),
      advisorBridge: buildNexoraMVPAdvisorContextBridge(state, interaction),
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
      theatreComposition: theatre,
    }),
  );
}

test("A — existing focus/selection maps to EMPHASIZED semantic motion", () => {
  const focused = projectStageProdObjectMotion({
    canonicalObjectId: CAPACITY_GAP_ID,
    focused: true,
    selected: true,
  });
  assert.equal(focused.state, "EMPHASIZED");
  assert.equal(focused.reason, "focus");
  assert.equal(focused.treatment, "subtle-emphasis");
  assert.equal(focused.durationMs, 180);
});

test("B — Capacity Gap canonical identity is unchanged by motion presentation", () => {
  const motion = projectStageProdObjectMotion({
    canonicalObjectId: CAPACITY_GAP_ID,
    focused: true,
    selected: true,
  });
  assert.equal(motion.canonicalObjectId, CAPACITY_GAP_ID);
  assert.match(
    renderCapacityStage(),
    /data-testid="nexora-stage-object-control-ctx-problem-capacity"[^>]*data-stage-prod-motion-object-id="ctx-problem-capacity"/,
  );
});

test("C — focused Capacity Gap receives the visible semantic motion hook", () => {
  const html = renderCapacityStage();
  assert.match(
    html,
    /data-testid="nexora-stage-object-control-ctx-problem-capacity"[^>]*data-stage-prod-motion-state="EMPHASIZED"/,
  );
  assert.match(html, /class="nexora-stage-object-motion"/);
  assert.match(html, /data-stage-motion-authority="stage-motion-1"/);
});

test("D — removing focus/selection returns the same Object to REST", () => {
  const rest = projectStageProdObjectMotion({
    canonicalObjectId: CAPACITY_GAP_ID,
    focused: false,
    selected: false,
  });
  assert.equal(rest.state, "REST");
  assert.equal(rest.reason, "none");
  assert.equal(rest.transform, "translateY(0) scale(1)");
  assert.equal(rest.canonicalObjectId, CAPACITY_GAP_ID);
});

test("E — reduced motion keeps stable emphasis without continuous movement", () => {
  const reduced = projectStageProdObjectMotion({
    canonicalObjectId: CAPACITY_GAP_ID,
    focused: true,
    selected: true,
    reducedMotion: true,
  });
  const css = readFileSync(join(FRONTEND, "app/globals.css"), "utf8");
  assert.equal(reduced.state, "EMPHASIZED");
  assert.equal(reduced.treatment, "stable-emphasis");
  assert.equal(reduced.durationMs, 0);
  assert.equal(reduced.transform, "none");
  assert.equal(reduced.continuousAnimation, false);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.nexora-stage-object-motion[\s\S]*transition: none !important/);
});

test("F — Cards and Charts remain stationary and outside Object motion", () => {
  const spec: StageProdStatusCardVisualSpec = Object.freeze({
    identity: "NPA-T STAGE-PROD:4/ContextualVisualSpecification:motion-isolation",
    family: "STATUS_CARD",
    title: "Capacity Gap",
    status: "watch",
    evidenceSummary: "Existing evidence",
    provenance: Object.freeze(["evidence:capacity"]),
    sceneScriptId: "scene:capacity",
    canonicalObjectIds: Object.freeze([CAPACITY_GAP_ID]),
    sourceIds: Object.freeze(["evidence:capacity"]),
    evidenceStates: Object.freeze(["inferred"]),
    sceneRole: "contextual-support",
    writesCanonicalManagementState: false,
    isBusinessObject: false,
    isDataObject: false,
  });
  const html = renderToStaticMarkup(React.createElement(NexoraStageContextualVisual, { spec }));
  assert.doesNotMatch(html, /nexora-stage-object-motion|data-stage-prod-motion-state/);
  assert.match(html, /data-stage-visual-writes="false"/);
});

test("G — motion adapter is read-only and introduces no animation runtime", () => {
  const motion = projectStageProdObjectMotion({
    canonicalObjectId: CAPACITY_GAP_ID,
    focused: true,
    selected: true,
  });
  const source = readFileSync(join(HERE, "stageProdObjectMotion.ts"), "utf8");
  assert.equal(motion.identity, stageProdObjectMotionIdentity);
  assert.equal(motion.writesCanonicalManagementState, false);
  assert.equal(motion.continuousAnimation, false);
  assert.doesNotMatch(source, /requestAnimationFrame|setInterval|setTimeout/);
  assert.doesNotMatch(source, /createDecision|startExecution|updateEvidence|referent/);
});
