/**
 * NEX-ENT:1 — Entrance & Nexora Introduction.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  NEXORA_ENTRANCE_OBJECT_ID,
  projectNexoraEntranceCatalog,
  resolveNexoraEntranceTurn,
} from "./nexoraEntranceExperience.ts";
import {
  acknowledgeNexoraStageEducationInteraction,
  beginNexoraGuidedEntranceIntroduction,
  isNexoraGuidedEntranceActive,
  isNexoraStageEducationActive,
  NEXORA_GUIDED_ENTRANCE_BOUNDARY,
  NEXORA_GUIDED_ENTRANCE_INTRO,
  NEXORA_STAGE_EDUCATION_BOUNDARY,
  nexoraGuidedEntranceCopyIsManagerReadable,
  resolveNexoraGuidedEntranceTurn,
  shouldNexoraGuidedEntranceOwnUtterance,
  verifyNexoraGuidedEntrance,
  verifyNexoraStageEducation,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function guidedSession() {
  return withActiveNexoraGuidedEntrance(
    createNexoraEntranceSession({ workspaceResolution: "first-time" }),
  );
}

function run(utterance: string, previous?: ReturnType<typeof executeNexoraConversationalExperience>) {
  const session = previous?.nextEntranceSession ?? guidedSession();
  const catalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ??
      applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-ent1-${utterance}`,
  });
}

describe("NEX-ENT:1 Entrance & Nexora Introduction", () => {
  it("identity, boundary, and manager-readable intro", () => {
    assert.equal(verifyNexoraGuidedEntrance().ok, true);
    assert.equal(NEXORA_GUIDED_ENTRANCE_BOUNDARY.secondExecutiveRoute, false);
    assert.equal(NEXORA_GUIDED_ENTRANCE_BOUNDARY.secondAdvisor, false);
    assert.equal(NEXORA_GUIDED_ENTRANCE_BOUNDARY.implementsGuidedAttention, false);
    assert.equal(NEXORA_GUIDED_ENTRANCE_BOUNDARY.fabricatesBusinessObjects, false);
    assert.equal(nexoraGuidedEntranceCopyIsManagerReadable(NEXORA_GUIDED_ENTRANCE_INTRO), true);
  });

  it("activates only on explicit first-time entrance, not existing workspace", () => {
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    assert.equal(isNexoraGuidedEntranceActive(existing), false);
    assert.equal(
      withActiveNexoraGuidedEntrance(existing).guidedIntroduction?.state,
      "INACTIVE",
    );
    const first = guidedSession();
    assert.equal(isNexoraGuidedEntranceActive(first), true);
    assert.equal(first.workspaceResolution, "first-time");
  });

  it("keeps the Stage catalog minimal with NEXORA presence", () => {
    const session = beginNexoraGuidedEntranceIntroduction(
      guidedSession(),
      initialState(),
    ).session;
    const catalog = projectNexoraEntranceCatalog(session);
    assert.equal(catalog.objects.length, 1);
    assert.equal(catalog.objects[0]?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(catalog.objects[0]?.label, "NEXORA");
    assert.equal(catalog.contextSubjects.length, 0);
    assert.equal(session.identity.sufficiency, "INSUFFICIENT");
    assert.equal(session.goalDiscovery, null);
  });

  it("Advisor introduction uses existing conversation and suggested actions", () => {
    const intro = beginNexoraGuidedEntranceIntroduction(
      guidedSession(),
      initialState(),
    );
    assert.match(intro.response, /Welcome to Nexora/i);
    assert.equal(intro.suggestedActions.length, 3);
    assert.deepEqual(
      intro.suggestedActions.map((action) => action.label),
      ["Show me", "What can Nexora do?", "Skip introduction"],
    );
    const capability = run("What can Nexora do?");
    assert.match(capability.nexoraMessage.text, /understand what matters/i);
    assert.equal(
      capability.nexoraMessage.suggestedActions?.some((action) => action.id === "skip"),
      true,
    );
    assert.equal(capability.nextEntranceSession?.identity.sufficiency, "INSUFFICIENT");
  });

  it("manager can ask naturally during introduction without a keyword router", () => {
    const what = run("What is Nexora?");
    assert.match(what.nexoraMessage.text, /executive decision workspace/i);
    const why = run("Why am I here?");
    assert.match(why.nexoraMessage.text, /already inside/i);
    assert.equal(shouldNexoraGuidedEntranceOwnUtterance(guidedSession(), "Show problems"), false);
  });

  it("suggested continue does not create business truth", () => {
    const next = run("Show me");
    assert.equal(next.nextEntranceSession?.guidedIntroduction?.state, "COMPLETED");
    assert.equal(
      next.nextEntranceSession?.guidedIntroduction?.stageEducation.state,
      "INTRODUCING",
    );
    assert.equal(next.nextEntranceSession?.identity.sufficiency, "INSUFFICIENT");
    assert.equal(next.nextEntranceSession?.goalDiscovery, null);
    assert.equal(next.nextEntranceSession?.decisionExperience, null);
    const catalog = projectNexoraEntranceCatalog(next.nextEntranceSession!);
    assert.equal(catalog.objects.length, 1);
    assert.equal(catalog.objects[0]?.id, NEXORA_ENTRANCE_OBJECT_ID);
  });

  it("skip exits to the existing Executive experience without fabricating objects", () => {
    const skipped = run("Skip introduction");
    assert.equal(skipped.nextEntranceSession?.workspaceResolution, "existing-workspace");
    assert.equal(skipped.nextEntranceSession?.guidedIntroduction?.state, "SKIPPED");
    assert.equal(skipped.shouldCommitRuntime, true);
    assert.equal(isNexoraEntranceRestrained(skipped.nextEntranceSession), false);
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    assert.ok(catalog.objects.length > 1);
    assert.equal(skipped.nextEntranceSession?.identity.sufficiency, "INSUFFICIENT");
    assert.equal(skipped.nextEntranceSession?.goalDiscovery, null);
  });

  it("refresh-safe introduction does not duplicate Nexora Stage actors", () => {
    const first = beginNexoraGuidedEntranceIntroduction(guidedSession(), initialState());
    const second = beginNexoraGuidedEntranceIntroduction(first.session, initialState());
    const catalog = projectNexoraEntranceCatalog(second.session);
    assert.equal(catalog.objects.length, 1);
    assert.equal(second.session.guidedIntroduction?.introductionSeeded, true);
  });

  it("does not steal NEX-EXP:1 identity when guided entrance is inactive", () => {
    const turn = resolveNexoraEntranceTurn({
      utterance: "I'm Sarah. I run operations for a logistics company.",
      session: createNexoraEntranceSession({ workspaceResolution: "first-time" }),
      runtimeState: initialState(),
    });
    assert.equal(turn.session.identity.sufficiency, "SUFFICIENT");
    assert.equal(turn.session.guidedIntroduction?.state, "INACTIVE");
  });

  it("identity statements during introduction do not become NEX-ENT business truth", () => {
    const intro = beginNexoraGuidedEntranceIntroduction(guidedSession(), initialState());
    const turn = resolveNexoraGuidedEntranceTurn({
      utterance: "I'm Dana.",
      session: intro.session,
      runtimeState: initialState(),
    });
    assert.equal(turn.ownsResponse, false);
    assert.equal(intro.session.identity.sufficiency, "INSUFFICIENT");
  });
});

describe("NEX-ENT:2 Stage / Workspace Education", () => {
  it("identity and boundary preserve the real Stage", () => {
    assert.equal(verifyNexoraStageEducation().ok, true);
    assert.equal(NEXORA_STAGE_EDUCATION_BOUNDARY.secondStage, false);
    assert.equal(NEXORA_STAGE_EDUCATION_BOUNDARY.implementsObjectEducation, false);
    assert.equal(NEXORA_STAGE_EDUCATION_BOUNDARY.implementsGuidedAttention, false);
    assert.equal(NEXORA_GUIDED_ENTRANCE_BOUNDARY.implementsStageEducation, false);
  });

  it("Show me transitions into Stage education without fabricating Objects", () => {
    const next = run("Show me");
    assert.equal(isNexoraStageEducationActive(next.nextEntranceSession), true);
    assert.match(next.nexoraMessage.text, /this is your stage/i);
    assert.equal(next.shouldCommitRuntime, true);
    assert.equal(next.nextRuntimeState.environmentIntent, "investigate");
    assert.equal(next.nextRuntimeState.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(next.nextEntranceSession?.goalDiscovery, null);
    assert.equal(next.nextEntranceSession?.identity.sufficiency, "INSUFFICIENT");
    const catalog = projectNexoraEntranceCatalog(next.nextEntranceSession!);
    assert.equal(catalog.objects.length, 1);
    assert.doesNotMatch(next.nexoraMessage.text, /Goal|KPI|Problem|Scenario|Decision/);
  });

  it("explains Stage, dashboard distinction, and what appears", () => {
    const started = run("Show me");
    const stage = run("What is the Stage?", started);
    assert.match(stage.nexoraMessage.text, /active executive workspace/i);
    const dashboard = run("Is this a dashboard?", started);
    assert.match(dashboard.nexoraMessage.text, /isn.t a fixed dashboard/i);
    const appears = run("What appears here?", started);
    assert.match(appears.nexoraMessage.text, /relevant things/i);
    assert.doesNotMatch(appears.nexoraMessage.text, /Goal → KPI|object families/i);
    assert.equal(
      appears.nexoraMessage.suggestedActions?.some((action) => action.kind === "question"),
      true,
    );
  });

  it("focus demonstration uses existing Stage select behavior", () => {
    const started = run("Show me");
    const focus = run("Show me how focus works", started);
    assert.equal(focus.nextEntranceSession?.guidedIntroduction?.stageEducation.focusDemonstrated, true);
    assert.equal(focus.nextRuntimeState.mode, "object-focused");
    assert.equal(focus.nextRuntimeState.focusedSubject?.id, NEXORA_ENTRANCE_OBJECT_ID);
    assert.equal(focus.shouldCommitRuntime, true);
    assert.match(focus.nexoraMessage.text, /brought Nexora into focus/i);
    const catalog = projectNexoraEntranceCatalog(focus.nextEntranceSession!);
    assert.equal(catalog.objects.length, 1);
  });

  it("manager Stage interaction is acknowledged without business truth", () => {
    const started = run("Show me");
    const focus = run("Show me how focus works", started);
    const ack = acknowledgeNexoraStageEducationInteraction({
      session: focus.nextEntranceSession!,
      runtimeState: focus.nextRuntimeState,
      subjectId: NEXORA_ENTRANCE_OBJECT_ID,
    });
    assert.equal(ack?.ownsResponse, true);
    assert.match(ack?.response ?? "", /focus the workspace/i);
    assert.equal(ack?.session.identity.sufficiency, "INSUFFICIENT");
    assert.equal(ack?.session.goalDiscovery, null);
  });

  it("unrelated conversation is not hijacked and skip remains safe", () => {
    const started = run("Show me");
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Show problems"),
      false,
    );
    const skipped = run("Skip this", started);
    assert.equal(skipped.nextEntranceSession?.workspaceResolution, "existing-workspace");
    assert.equal(skipped.nextEntranceSession?.guidedIntroduction?.state, "SKIPPED");
    assert.equal(isNexoraEntranceRestrained(skipped.nextEntranceSession), false);
  });

  it("copy stays manager-readable", () => {
    const started = run("Show me");
    assert.equal(nexoraGuidedEntranceCopyIsManagerReadable(started.nexoraMessage.text), true);
    const focus = run("Show me how focus works", started);
    assert.equal(nexoraGuidedEntranceCopyIsManagerReadable(focus.nexoraMessage.text), true);
  });
});

