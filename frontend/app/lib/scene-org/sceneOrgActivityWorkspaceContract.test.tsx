import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraFlowJournalExplorer } from "@/app/executive/nex-mvp/flow/NexoraFlowJournalExplorer.tsx";
import type { NexoraConversationalCommand } from "@/app/lib/conversational-control/conversationalCommand.ts";
import { mapNexoraConversationalCommand } from "@/app/lib/conversational-control/conversationalCommandMapper.ts";
import { resolveNexoraExecutiveConversationalContext } from "@/app/lib/conversational-control/conversationalContextResolver.ts";
import { resolveNexoraConversationalIntent } from "@/app/lib/conversational-control/conversationalIntentResolver.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { toNexoraConversationContextSnapshot } from "@/app/lib/conversational-control/executiveContextProjection.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  applyNexoraMVPConversationalCommand,
} from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts";
import { createInitialNexoraMVPFlowDomainState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  SCENE_ORG_ACTIVITY_AUTHORITY_GUARD,
  projectSceneOrgManagerActivity,
} from "./sceneOrgActivityWorkspaceContract.ts";
import { createSceneOrgCanonicalReference } from "./sceneOrgRegionContract.ts";
import {
  createSceneOrgSavedScene,
  resolveSceneOrgSavedScene,
} from "./sceneOrgWorkspacePlacementContract.ts";

function workspacePipeline(
  utterance: string,
  currentSubjectId: string | null = null,
  activeStageSubjectId: string | null = null,
) {
  const { intent } = resolveNexoraConversationalIntent({ utterance });
  const { context } = resolveNexoraExecutiveConversationalContext({
    intent,
    targetHints: intent.targetHints,
    conversationContext: currentSubjectId ? { currentSubjectId } : null,
    activeStageContext: activeStageSubjectId
      ? { focusedSubjectId: activeStageSubjectId }
      : null,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
  });
  const mapping = mapNexoraConversationalCommand({ intent, context });
  assert.ok(mapping.command);
  return { intent, context, command: mapping.command };
}

function initialInteraction() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function fullWorkspacePipeline(utterance: string) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: initialInteraction(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: `org7-${utterance}`,
  });
}

test("ORG:7 proof 1 — Activity is one reverse-chronological projection of recorded timeline events", () => {
  const state = createInitialNexoraMVPFlowDomainState();
  const activity = projectSceneOrgManagerActivity(state);
  assert.equal(activity.length, state.timelineEvents.length);
  assert.deepEqual(
    activity.map((entry) => entry.occurredAt),
    [...state.timelineEvents]
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
      .map((event) => event.occurredAt),
  );
});

test("ORG:7 proof 2 — Activity retains exact event, Journal, subject, and related canonical identities", () => {
  const state = createInitialNexoraMVPFlowDomainState();
  const entry = projectSceneOrgManagerActivity(state).find(
    (candidate) => candidate.id === "activity:tl-margin-identified",
  );
  assert.ok(entry);
  assert.equal(entry.canonicalSubjectId, "ctx-problem-margin");
  assert.deepEqual(entry.sourceRecordIds, [
    "tl-margin-identified",
    "pack-problem-margin",
  ]);
  assert.deepEqual(entry.relatedCanonicalIds, ["obj-revenue", "obj-risk"]);
});

test("ORG:7 proof 3 — Activity surface exposes canonical navigation targets without replay controls", () => {
  const activity = projectSceneOrgManagerActivity(
    createInitialNexoraMVPFlowDomainState(),
  );
  const html = renderToStaticMarkup(
    React.createElement(NexoraFlowJournalExplorer, {
      entries: activity,
      selectedId: null,
      onSelect: () => undefined,
    }),
  );
  assert.match(html, /aria-label="Manager Activity"/);
  assert.match(html, /Recent Activity/);
  assert.match(html, /nexora-activity-entry-activity:tl-margin-identified/);
  assert.doesNotMatch(html, /Replay|Restore state|Undo event/i);
});

test("ORG:7 proof 4 — show history traverses existing intent, command, and Runtime seams", () => {
  const { intent, command } = workspacePipeline("Show history");
  assert.equal(intent.kind, "workspace-action");
  assert.equal(command.kind, "workspace-presentation");
  assert.equal(command.workspaceAction?.action, "SHOW_ACTIVITY");
  const state = initialInteraction();
  const applied = applyNexoraMVPConversationalCommand({ command, state });
  assert.equal(applied.result.runtimeActionKind, "apply-workspace-presentation");
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState, state);
  assert.equal(fullWorkspacePipeline("Show history").status, "applied");
});

test("ORG:7 proof 5 — open data for this preserves authoritative Stage focus when conversation has no single referent", () => {
  const { context, command } = workspacePipeline(
    "Open data for this",
    null,
    "obj-capacity",
  );
  assert.equal(context.source, "active-stage-context");
  assert.equal(command.primaryTargetId, "obj-capacity");
  assert.equal(command.workspaceAction?.action, "OPEN_DETAIL");
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state: initialInteraction(),
  });
  assert.equal(applied.result.plan?.primaryTargetId, "obj-capacity");
});

test("ORG:7 proof 6 — Right Details, Advisor, and collapse are typed presentation-only actions", () => {
  for (const [utterance, expected] of [
    ["Show details", "SHOW_RIGHT_DETAILS"],
    ["Open Advisor", "OPEN_ADVISOR"],
    ["Collapse the right panel", "COLLAPSE_RIGHT"],
  ] as const) {
    const { command } = workspacePipeline(utterance);
    assert.equal(command.workspaceAction?.action, expected);
    const state = initialInteraction();
    const applied = applyNexoraMVPConversationalCommand({ command, state });
    assert.equal(applied.result.status, "applied");
    assert.equal(applied.nextState, state);
  }
  const close = fullWorkspacePipeline("Close detail");
  assert.equal(close.intentResult.intent.kind, "workspace-action");
  assert.equal(close.commandResult?.command?.workspaceAction?.action, "CLOSE_DETAIL");
  assert.equal(close.runtimeResult?.status, "applied");
  const staleGoalClose = workspacePipeline(
    "Close detail",
    "goal-capacity-availability",
  ).command;
  assert.equal(staleGoalClose.primaryTargetId, null);
  assert.equal(
    applyNexoraMVPConversationalCommand({
      command: staleGoalClose,
      state: initialInteraction(),
    }).result.status,
    "applied",
  );

  const focused = fullWorkspacePipeline("Focus on Capacity");
  const opened = executeNexoraConversationalExperience({
    utterance: "Open data for this",
    executiveContext: focused.nextExecutiveContext,
    conversationContext: toNexoraConversationContextSnapshot(
      focused.nextExecutiveContext,
    ),
    activeStageContext: { focusedSubjectId: "obj-capacity" },
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: focused.nextRuntimeState,
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: focused.managerObjectTurn.session,
    messageIdSeed: "org7-sequence-open",
  });
  const closed = executeNexoraConversationalExperience({
    utterance: "Close detail",
    executiveContext: opened.nextExecutiveContext,
    conversationContext: toNexoraConversationContextSnapshot(
      opened.nextExecutiveContext,
    ),
    activeStageContext: { focusedSubjectId: "obj-capacity" },
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: opened.nextRuntimeState,
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: opened.managerObjectTurn.session,
    lastAppliedCommandId: opened.commandResult?.command?.commandId ?? null,
    messageIdSeed: "org7-sequence-close",
  });
  assert.equal(opened.status, "applied");
  assert.equal(closed.status, "applied");
});

test("ORG:7 proof 7 — save-scene language maps to ORG:4 view/reference metadata only", () => {
  const { command } = workspacePipeline(
    "Save this scene as Capacity Review",
    "obj-capacity",
  );
  assert.deepEqual(command.workspaceAction, {
    action: "SAVE_SCENE",
    sceneName: "capacity review",
    useCurrentReferent: true,
  });
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-capacity-review",
    name: "Capacity Review",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId: command.primaryTargetId!,
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
    ...({ copiedBusinessState: { value: 99 } } as object),
  });
  assert.equal(JSON.stringify(scene).includes("copiedBusinessState"), false);
});

test("ORG:7 proof 8 — opening a named Saved Scene resolves current live canonical content", () => {
  const scene = createSceneOrgSavedScene({
    sceneId: "scene-capacity-review",
    name: "Capacity Review",
    kind: "SAVED",
    sceneIntentType: "manager-view",
    canonicalReferences: [
      createSceneOrgCanonicalReference({
        canonicalId: "obj-capacity",
        kind: "object",
        owner: "canonical MO/Object catalog",
      }),
    ],
    layout: {
      presentationDepth: "report",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "open",
    },
  });
  let live = "current";
  const first = resolveSceneOrgSavedScene(scene, () => ({ live }));
  live = "newer";
  const reopened = resolveSceneOrgSavedScene(scene, () => ({ live }));
  assert.equal(first.live[0]?.content?.live, "current");
  assert.equal(reopened.live[0]?.content?.live, "newer");
  assert.equal(
    workspacePipeline("Open Capacity Review").command.workspaceAction?.action,
    "OPEN_SCENE",
  );
});

test("ORG:7 proof 9 — existing confirmation gates remain authoritative", () => {
  const state = initialInteraction();
  const command: NexoraConversationalCommand = Object.freeze({
    commandId: "org7-confirmation-proof",
    kind: "focus-subject",
    source: "conversation",
    executionClass: "navigation",
    primaryTargetId: "obj-capacity",
    secondaryTargetIds: Object.freeze([]),
    requiresConfirmation: true,
    executable: true,
    reasons: Object.freeze(["existing-confirmation-authority"]),
  });
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state,
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
  });
  assert.equal(applied.result.status, "confirmation-required");
  assert.equal(applied.nextState, state);
});

test("ORG:7 proof 10 — no event ledger, replay, NLU, referent, Runtime, or business-state authority is added", () => {
  assert.deepEqual(SCENE_ORG_ACTIVITY_AUTHORITY_GUARD, {
    readsTimelineEvents: true,
    readsJournalPacks: true,
    createsEventLedger: false,
    reconstructsHistoricalBusinessState: false,
    implementsReplay: false,
    mutatesBusinessTruth: false,
    createsNaturalLanguageParser: false,
    createsCommandRouter: false,
    createsReferentResolver: false,
    createsWorkspaceRuntime: false,
    storesSavedBusinessState: false,
  });
});
