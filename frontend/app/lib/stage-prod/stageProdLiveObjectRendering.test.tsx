/**
 * NPA-T STAGE-PROD:2 — certify the existing production Object rendering seam.
 * No second Object projection, renderer authority, Stage store, or composer.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Nexora3DExecutiveStage } from "@/app/executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionState,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import { deriveNexoraMVPSceneEnvironmentVisualState } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation.ts";
import { ExecutiveShell } from "@/app/executive/components/ExecutiveShell.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");

function initial(): NexoraMVPObjectInteractionState {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function renderStage(
  state: NexoraMVPObjectInteractionState,
  catalog: NexoraMVPObjectInteractionCatalog =
    getDefaultNexoraMVPObjectInteractionCatalog(),
): string {
  const interaction = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
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
      onSelectSubject: () => undefined,
      onStepBack: () => undefined,
      onOverview: () => undefined,
      onPresentationStateChange: () => undefined,
      onPresentationAction: () => undefined,
    }),
  );
}

test("A — canonical projected Object becomes a visible production Stage Object", () => {
  const html = renderStage(initial());
  assert.match(html, /data-testid="nexora-stage-object-control-obj-revenue"/);
  assert.match(html, /data-canonical-id="obj-revenue"/);
  assert.match(html, />Revenue</);
});

test("B — canonical Object type survives projection into the renderer", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    initial(),
    "ctx-problem-capacity",
    catalog,
  );
  const projection = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const capacity = projection.scene.objects.find(
    (object) => object.id === "ctx-problem-capacity",
  );
  assert.equal(capacity?.kind, "problem");
  const html = renderStage(state, catalog);
  assert.match(
    html,
    /data-testid="nexora-stage-object-control-ctx-problem-capacity"[^>]*data-object-type="problem"/,
  );
});

test("C — canonical Object ID is unchanged through visible rendering", () => {
  const canonicalId = "ctx-problem-capacity";
  const state = selectNexoraMVPInteractionSubject(initial(), canonicalId);
  assert.equal(state.focusedSubject?.id, canonicalId);
  const html = renderStage(state);
  assert.match(
    html,
    /data-testid="nexora-stage-object-control-ctx-problem-capacity"[^>]*data-canonical-id="ctx-problem-capacity"/,
  );
});

test("D — duplicate labels retain distinct canonical identities", () => {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  const first = Object.freeze({
    ...base.objects[0],
    id: "duplicate-capacity-a",
    label: "Capacity",
  });
  const second = Object.freeze({
    ...base.objects[1],
    id: "duplicate-capacity-b",
    label: "Capacity",
  });
  const catalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...base,
    objects: Object.freeze([first, second]),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
  const html = renderStage(initial(), catalog);
  assert.match(html, /data-canonical-id="duplicate-capacity-a"/);
  assert.match(html, /data-canonical-id="duplicate-capacity-b"/);
  assert.equal((html.match(/>Capacity</g) ?? []).length, 2);
});

test("E — Capacity Gap canonical focus remains the rendered focus", () => {
  const canonicalId = "ctx-problem-capacity";
  const state = selectNexoraMVPInteractionSubject(initial(), canonicalId);
  const projection = deriveNexoraMVPStageInteractionPresentation(state);
  assert.equal(projection.focusedSubjectId, canonicalId);
  const focused = projection.scene.objects.filter((object) => object.focused);
  assert.deepEqual(focused.map((object) => object.id), [canonicalId]);
  const html = renderStage(state);
  assert.match(html, /data-focused-object="ctx-problem-capacity"/);
  assert.match(
    html,
    /data-testid="nexora-stage-object-control-ctx-problem-capacity"[^>]*aria-pressed="true"/,
  );
});

test("F — existing Problem, Scenario, Decision, and Execution categories coexist", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const operation = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "operation",
    environmentIntent: "neutral",
  });
  const focused = selectNexoraMVPInteractionSubject(
    operation,
    "obj-capacity",
    catalog,
  );
  const expanded = selectNexoraMVPInteractionSubject(
    focused,
    "thread-obj-capacity",
    catalog,
  );
  const projection = deriveNexoraMVPStageInteractionPresentation(expanded, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  assert.deepEqual(
    [
      ...new Set(
        projection.scene.objects
          .filter((object) =>
            ["problem", "scenario", "decision", "execution"].includes(
              object.kind,
            ),
          )
          .map((object) => object.kind),
      ),
    ].sort(),
    ["decision", "execution", "problem", "scenario"],
  );
  const html = renderStage(expanded, catalog);
  for (const kind of ["problem", "scenario", "decision", "execution"]) {
    assert.match(html, new RegExp(`data-object-type="${kind}"`));
  }
});

test("G — absent optional display metadata renders without fabricated values", () => {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  const sparse = Object.freeze({
    id: "sparse-object",
    label: "Sparse Object",
    kind: "object" as const,
    position: [0, 0, 0] as const,
    status: "unresolved" as const,
    attention: "normal" as const,
  });
  const catalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...base,
    objects: Object.freeze([sparse]),
    relationships: Object.freeze([]),
    contextSubjects: Object.freeze([]),
    contextLinks: Object.freeze([]),
  });
  const html = renderStage(initial(), catalog);
  assert.match(html, /data-canonical-id="sparse-object"/);
  assert.match(html, />Sparse Object</);
  assert.match(html, /data-status="unresolved"/);
  assert.doesNotMatch(html, /undefined|null/);
});

test("H — rendering is read-only over canonical interaction input", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = selectNexoraMVPInteractionSubject(
    initial(),
    "ctx-problem-capacity",
    catalog,
  );
  const before = JSON.stringify({ state, catalog });
  renderStage(state, catalog);
  assert.equal(JSON.stringify({ state, catalog }), before);
  const objectRenderer = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraStageObject.tsx"),
    "utf8",
  );
  assert.doesNotMatch(objectRenderer, /commitDecision|startExecution|\.push\(/);
});

test("I — STAGE-PROD:1 production host remains authoritative", () => {
  const html = renderToStaticMarkup(React.createElement(ExecutiveShell));
  assert.match(html, /data-stage-prod-live="NPA-T STAGE-PROD:1\/LiveStageFoundation"/);
  assert.match(html, /data-stage-identity="NEX-MVP:3\/Nexora3DExecutiveStage"/);
  const scene = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/stage/NexoraStageScene.tsx"),
    "utf8",
  );
  assert.match(scene, /<NexoraStageObject/);
  assert.match(scene, /<NexoraStageContextNodes/);
  assert.doesNotMatch(scene, /StageProdObjectStore|StageProdObjectComposer/);
});
