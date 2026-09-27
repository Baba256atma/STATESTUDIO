import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraAdvisorInsightRegion } from "@/app/executive/nex-mvp/NexoraAdvisorInsightRegion.tsx";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  openNexoraMVPExecutiveQueueCollection,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "@/app/lib/nex-mvp/nexoraMVPPresentationState.ts";
import {
  SCENE_ORG_RIGHT_CONTEXT_AUTHORITY_GUARD,
  createSceneOrgRightPanelChromeState,
  projectSceneOrgRightContext,
  updateSceneOrgRightPanelChrome,
} from "./sceneOrgRightContextContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function bridgeOf(
  state: ReturnType<typeof createInitialNexoraMVPObjectInteractionState>,
) {
  return buildNexoraMVPAdvisorContextBridge(
    state,
    deriveNexoraMVPStageInteractionPresentation(state, catalog),
  );
}

function projectionOf(
  state: ReturnType<typeof createInitialNexoraMVPObjectInteractionState>,
) {
  return projectSceneOrgRightContext({
    advisorBridge: bridgeOf(state),
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
  });
}

test("ORG:5 Stage focus and Right Details use the same canonical ID", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const focused = selectNexoraMVPInteractionSubject(initial, "obj-capacity", catalog);
  assert.equal(focused.focusedSubject?.id, "obj-capacity");
  assert.equal(projectionOf(focused).canonicalId, "obj-capacity");
});

test("ORG:5 collection change replaces stale subject context", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const focused = selectNexoraMVPInteractionSubject(initial, "obj-capacity", catalog);
  const collection = openNexoraMVPExecutiveQueueCollection(focused, "scenario", catalog);
  const projection = projectionOf(collection);
  assert.equal(projection.kind, "COLLECTION");
  assert.equal(projection.collectionCategory, "scenario");
  assert.equal(projection.canonicalId, null);
  assert.doesNotMatch(projection.contextKey, /obj-capacity/);
});

test("ORG:5 Advisor Show scenarios produces Stage and Right Scenario context", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const result = executeNexoraConversationalExperience({
    utterance: "Show scenarios",
    runtimeState: initial,
    catalog,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    previousManagerObjectSession: createEmptyManagerObjectSession(),
    messageIdSeed: "org5-show-scenarios",
  });
  assert.equal(result.nextRuntimeState.collectionContext?.category, "scenario");
  assert.equal(projectionOf(result.nextRuntimeState).collectionCategory, "scenario");
});

test("ORG:5 NMI/Attention selection preserves identity through Stage to Right", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const selected = selectNexoraMVPInteractionSubject(initial, "obj-risk", catalog);
  assert.equal(bridgeOf(selected).primaryStageSubjectId, "obj-risk");
  assert.equal(projectionOf(selected).canonicalId, "obj-risk");
});

test("ORG:5 cleared authoritative context ignores stale subject props", () => {
  const cleared = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const stale = Object.freeze({ id: "obj-risk", kind: "object" as const, label: "Risk" });
  const projection = projectSceneOrgRightContext({
    advisorBridge: bridgeOf(cleared),
    focusedSubject: stale,
    selectedSubject: stale,
  });
  assert.equal(projection.kind, "EMPTY");
  assert.equal(projection.canonicalId, null);
});

test("ORG:5 collapse and resize are presentation-only", () => {
  const managementState = Object.freeze({ canonicalId: "obj-capacity", stageMode: "object-focus" });
  const before = JSON.stringify(managementState);
  const resized = updateSceneOrgRightPanelChrome(
    createSceneOrgRightPanelChromeState(),
    { kind: "RESIZE", width: 420 },
  );
  const collapsed = updateSceneOrgRightPanelChrome(resized, {
    kind: "TOGGLE_COLLAPSE",
  });
  assert.deepEqual(collapsed, { width: 420, collapsed: true });
  assert.equal(JSON.stringify(managementState), before);
});

test("ORG:5 renders collection Details without stale Overview while preserving Advisor", () => {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  const collection = openNexoraMVPExecutiveQueueCollection(initial, "scenario", catalog);
  const bridge = bridgeOf(collection);
  const vm = deriveNexoraMVPPresentationViewModel({
    presentationState: collection.presentationState,
    workspace: collection.workspace,
    environmentIntent: collection.environmentIntent,
    subjectId: null,
    subjectKind: null,
    subjectLabel: null,
  });
  const html = renderToStaticMarkup(
    React.createElement(NexoraAdvisorInsightRegion, {
      tab: "Insight",
      onTabChange: () => undefined,
      advisorBridge: bridge,
      presentationViewModel: vm,
      focusedSubject: collection.focusedSubject,
      selectedSubject: collection.selectedSubject,
      onIntelligenceAction: () => undefined,
    }),
  );
  assert.match(html, /data-right-context-kind="COLLECTION"/);
  assert.match(html, /data-collection-category="scenario"/);
  assert.match(html, /Scenarios Collection/);
  assert.doesNotMatch(html, /nexora-insight-view-title[^>]*>Overview/);
});

test("ORG:5 introduces no second context, referent, or Advisor authority", () => {
  assert.deepEqual(SCENE_ORG_RIGHT_CONTEXT_AUTHORITY_GUARD, {
    consumesFinalStageBridge: true,
    advisorAuthority: "CC:5/NCA/NXA/ECA",
    createsContextAuthority: false,
    createsReferentSystem: false,
    createsAdvisor: false,
    ownsConversationState: false,
    mutatesStageState: false,
    panelChromeIsPresentationOnly: true,
  });
});
