/**
 * NPA-T STAGE-DENSITY-RESPONSIVENESS:1 — semantic depth authority.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  NEXORA_MVP_DEFAULT_PRESENTATION_STATE,
  createNexoraMVPApplication,
} from "./nexoraMVPApplicationFoundation.ts";
import {
  applyNexoraMVPPresentationStateChange,
  explainNexoraMVPStagePresentationDepth,
  NEXORA_MVP_PRESENTATION_STATE_BOUNDARY,
  resolveNexoraMVPPresentationStateChange,
} from "./nexoraMVPPresentationState.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "./nexoraMVPObjectInteraction.ts";
import {
  resolveExecutiveStageDisclosure,
  resolveExecutiveStageWatchBudget,
} from "../spatial-presentation/executiveStageProductivityContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: NEXORA_MVP_DEFAULT_PRESENTATION_STATE,
    environmentIntent: "neutral",
  });
}

function request(targetPresentationState: unknown) {
  return resolveNexoraMVPPresentationStateChange({
    targetPresentationState,
    currentPresentationState: "minimum",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId: "obj-capacity",
  });
}

test("fresh Executive Stage context has one explicit minimum authority and reason", () => {
  assert.equal(NEXORA_MVP_PRESENTATION_STATE_BOUNDARY.ownsPresentationAuthority, true);
  assert.equal(NEXORA_MVP_DEFAULT_PRESENTATION_STATE, "minimum");
  assert.equal(createNexoraMVPApplication().snapshot.presentationState, "minimum");
  assert.equal(
    explainNexoraMVPStagePresentationDepth({
      presentationState: "minimum",
      subjectId: null,
    }),
    "default-executive-stage-context",
  );
});

test("same semantic request resolves deterministically and preserves workspace context", () => {
  const first = request("report");
  const second = request("report");
  assert.deepEqual(first, second);
  assert.deepEqual(first, {
    ok: true,
    presentationState: "report",
    changed: true,
    workspace: "overview",
    environmentIntent: "neutral",
    reason: "details-view",
  });
});

test("focused manual view transitions make report and operation production-capable", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-capacity");
  const report = applyNexoraMVPPresentationStateChange(focused, "report");
  const operation = applyNexoraMVPPresentationStateChange(report, "operation");
  const returned = applyNexoraMVPPresentationStateChange(operation, "minimum");
  assert.equal(report.presentationState, "report");
  assert.equal(operation.presentationState, "operation");
  assert.equal(returned.presentationState, "minimum");
  assert.equal(returned.focusedSubject?.id, "obj-capacity");
});

test("capability constraints fail closed with explicit downgrade provenance", () => {
  const unsupportedOperation = resolveNexoraMVPPresentationStateChange({
    targetPresentationState: "operation",
    currentPresentationState: "minimum",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId: "obj-unknown",
  });
  assert.equal(unsupportedOperation.ok, true);
  if (unsupportedOperation.ok) {
    assert.equal(unsupportedOperation.presentationState, "report");
    assert.equal(unsupportedOperation.reason, "operation-downgraded-to-report");
  }
  assert.equal(request(undefined).ok, false);
});

test("depth selection is semantic and has no geometry, identity, ranking, truth, or visual inputs", () => {
  const source = readFileSync(
    new URL("./nexoraMVPPresentationState.ts", import.meta.url),
    "utf8",
  );
  const resolver = source.slice(
    source.indexOf("export function resolveNexoraMVPPresentationStateChange"),
    source.indexOf("export function applyNexoraMVPPresentationStateChange"),
  );
  for (const forbidden of [
    "innerWidth",
    "clientWidth",
    "ResizeObserver",
    "watchObjectIds",
    "attention",
    "material",
    "label",
    "objectKind",
  ]) {
    assert.equal(resolver.includes(forbidden), false, forbidden);
  }
});

test("workspace changes preserve depth rather than becoming another authority", () => {
  const source = readFileSync(
    new URL("./nexoraMVPWorkspacePresentation.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /Presentation state is preserved/);
  assert.match(source, /presentationState: request\.presentationState/);
});

test("the single depth result feeds the sealed 2/3/3 Watch-budget authority", () => {
  assert.equal(resolveExecutiveStageWatchBudget({ presentationDepth: "minimum" }), 2);
  assert.equal(resolveExecutiveStageWatchBudget({ presentationDepth: "report" }), 3);
  assert.equal(resolveExecutiveStageWatchBudget({ presentationDepth: "operation" }), 3);
});

test("larger supported depth changes capacity without changing ranked canonical IDs", () => {
  const subjects = ["obj-a", "obj-b", "obj-c", "obj-d"].map((subjectId) => ({
    subjectId,
    objectKind: "object",
    family: "business-object" as const,
    attention: "critical",
    status: "watch",
  }));
  const resolve = (presentationDepth: "minimum" | "report") =>
    resolveExecutiveStageDisclosure({
      subjects,
      relationships: [],
      presentationMode: "overview",
      presentationDepth,
    });
  const minimum = resolve("minimum");
  const report = resolve("report");
  assert.deepEqual(report.rankedWatchObjectIds, minimum.rankedWatchObjectIds);
  assert.deepEqual(report.watchObjectIds.slice(0, 2), minimum.watchObjectIds);
  assert.equal(new Set(report.watchObjectIds).size, report.watchObjectIds.length);
});

test("Stage exposes authority and reason as non-visible runtime metadata", () => {
  const source = readFileSync(
    new URL(
      "../../executive/nex-mvp/stage/Nexora3DExecutiveStage.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(source, /data-presentation-depth-authority/);
  assert.match(source, /data-presentation-depth-reason/);
});
