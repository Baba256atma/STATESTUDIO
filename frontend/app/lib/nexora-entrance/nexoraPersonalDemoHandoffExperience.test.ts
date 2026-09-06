/**
 * NEX-ENT:10 — Personal Demo Handoff. Lesson state is not business state.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
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
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  resolveNexoraGuidedEntranceTurn,
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { trustReviewOf } from "./nexoraTrustReviewExperience.ts";
import {
  NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY,
  classifyPersonalDemoHandoffMove,
  personalDemoHandoffOf,
  shouldNexoraPersonalDemoHandoffOwnUtterance,
  verifyNexoraPersonalDemoHandoff,
} from "./nexoraPersonalDemoHandoffExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";
import { NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID } from "./nexoraEntranceTypes.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import { educationalObjectIds } from "./nexoraObjectEducationExperience.ts";
import { applyManagerIdentityUtterance, emptyManagerIdentityContext } from "./nexoraEntranceIdentity.ts";

const here = dirname(fileURLToPath(import.meta.url));

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

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
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
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    previousGuidedAttention: previous?.guidedAttention ?? null,
    previousVisualView: previous?.visualView ?? null,
    mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: previous ? 2_000 : 0,
    messageIdSeed: `nex-ent10-${utterance}`,
  });
}

function afterStage() {
  return run("Show me how focus works", run("Show me"));
}

function atGoal() {
  return run("Show me the next one", afterStage());
}

function advance(steps: number, from = atGoal()) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atConversationAsk() {
  return run("Show me the next one", advance(7));
}

function atAttentionIntro() {
  return run("Show me the next one", advance(5, atConversationAsk()));
}

let sourceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let purposeSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let evidenceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let trustSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let readySeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;

function atDataSource() {
  sourceSeed ??= run("Show me the next one", advance(3, atAttentionIntro()));
  return sourceSeed;
}

function atVisualPurpose() {
  if (!purposeSeed) {
    let current = run("Show me an example", atDataSource());
    for (let index = 0; index < 5; index += 1) {
      current = run("Show me the next one", current);
    }
    purposeSeed = run("Show me the next one", current);
  }
  return purposeSeed;
}

function atEvidence() {
  if (!evidenceSeed) {
    let current = atVisualPurpose();
    for (let index = 0; index < 4; index += 1) {
      current = run("Show me the next one", current);
    }
    evidenceSeed = run("Show me the next one", current);
  }
  return evidenceSeed;
}

function atTrustSource() {
  if (!trustSeed) {
    let current = atEvidence();
    for (let index = 0; index < 9; index += 1) {
      current = run("Show me the next one", current);
    }
    trustSeed = run("Show me the next one", current);
  }
  return trustSeed;
}

function atQuickReview() {
  let current = atTrustSource();
  for (let index = 0; index < 5; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atTrustReady() {
  if (!readySeed) {
    readySeed = run(
      "No, I still decide",
      run("No", run("Ask me or keep it unresolved", atQuickReview())),
    );
  }
  return readySeed;
}

function atHandoffIntro() {
  return run("Let's do it", atTrustReady());
}

describe("NEX-ENT:10 Personal Demo Handoff", () => {
  it("handoffs without a second Executive, Goal store, or generic rename", () => {
    assert.equal(verifyNexoraPersonalDemoHandoff().ok, true);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.secondExecutive, false);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.parallelIdentityStore, false);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.writesGoal, false);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.genericObjectRename, false);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.bcaPersists, false);
    assert.equal(NEXORA_PERSONAL_DEMO_HANDOFF_BOUNDARY.centralWorkspace, "NEX-EXP:1/obj-executive-context");
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof A — ENT:9 READY continues into Personal Demo Handoff", () => {
    const intro = atHandoffIntro();
    assert.equal(trustReviewOf(intro.nextEntranceSession).state, "COMPLETED");
    assert.equal(personalDemoHandoffOf(intro.nextEntranceSession).state, "INTRO");
    assert.match(intro.nexoraMessage.text, /make this workspace yours/i);
    assert.doesNotMatch(intro.nexoraMessage.text, /demo business store|ent10Identity/i);
    assert.equal(intro.nextEntranceSession?.decisionExperience, null);
  });

  it("Proof C/D/E — identity and context fall through; UNKNOWN does not block", () => {
    assert.equal(
      classifyPersonalDemoHandoffMove("I'm Alex. I run operations for a logistics company."),
      null,
    );
    const named = run(
      "I'm Alex. I run operations for a logistics company.",
      atHandoffIntro(),
    );
    assert.ok(named.nextEntranceSession?.identity.managerName);
    assert.equal(personalDemoHandoffOf(named.nextEntranceSession).state, "INTRO");
    const next = run("Continue", named);
    assert.match(next.nexoraMessage.text, /managing here|workspace|Goal|data|call you|company is/i);
    assert.equal(classifyPersonalDemoHandoffMove("I'm not sure"), "UNSURE");
    const introForUnknown = atHandoffIntro();
    const unknownTurn = resolveNexoraGuidedEntranceTurn({
      utterance: "I'm not sure",
      session: introForUnknown.nextEntranceSession!,
      runtimeState: introForUnknown.nextRuntimeState,
    });
    assert.match(unknownTurn.response, /Unknown is valid/i);
    const both = run("Both", introForUnknown);
    assert.match(both.nexoraMessage.text, /mixed business and project|Unknown is valid|workspace|Goal|data/i);
    assert.equal(both.nextEntranceSession?.issueDiscovery, null);
  });

  it("Proof J/K — Improve delivery uses Goal authority without invented targets", () => {
    const named = run(
      "I'm Alex. I run operations for a logistics company.",
      atHandoffIntro(),
    );
    const goalAsk = run("Continue", run("Continue", named));
    assert.equal(
      shouldNexoraPersonalDemoHandoffOwnUtterance(
        goalAsk.nextEntranceSession,
        "Improve delivery.",
      ),
      false,
    );
    const goal = run("Improve delivery.", goalAsk);
    assert.doesNotMatch(goal.nexoraMessage.text, /96%/);
    assert.equal(goal.nextEntranceSession?.issueDiscovery, null);
    assert.equal(goal.nextEntranceSession?.decisionExperience, null);
  });

  it("Proof M/O/R — start without data; Use my data does not open a picker; example data is not yours", () => {
    const intro = atHandoffIntro();
    const skippedName = run("Continue", intro);
    const data = run("Start without data", run("Continue", run("Continue", skippedName)));
    assert.equal(personalDemoHandoffOf(data.nextEntranceSession).state, "COMPLETED");
    assert.match(data.nexoraMessage.text, /your workspace now|no accepted data|not your Data Library/i);
    assert.equal(data.nextEntranceSession?.decisionExperience, null);
    const use = run("Use my data", run("Continue", run("Continue", run("Continue", intro))));
    assert.equal(use.guidedAttention?.pendingOfferTarget, "DATA_ENTRY");
    assert.match(use.nexoraMessage.text, /won.t open the file picker/i);
  });

  it("Proof V — skip preserves identity and does not invent Goal or Data", () => {
    const named = run(
      "I'm Alex. I run operations for a logistics company.",
      atHandoffIntro(),
    );
    const skipped = run("Skip for now", named);
    assert.equal(personalDemoHandoffOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.ok(skipped.nextEntranceSession?.identity.managerName);
    assert.equal(skipped.nextEntranceSession?.workspaceResolution, "first-time");
    assert.equal(skipped.nextEntranceSession?.goalDiscovery?.object ?? null, null);
    assert.notEqual(skipped.nextEntranceSession?.goalDiscovery?.context.managerConfirmed, true);
    assert.equal(skipped.nextEntranceSession?.decisionExperience, null);
    assert.equal(skipped.nextEntranceSession?.issueDiscovery, null);
    const catalog = projectNexoraEntranceCatalog(skipped.nextEntranceSession!);
    for (const id of educationalObjectIds()) {
      assert.equal(catalog.objects.some((object) => object.id === id), false);
    }
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(skipped.nextEntranceSession, "Show me the next one", []),
      false,
    );
  });

  it("Proof AE — after completion ENT no longer hijacks ordinary turns", () => {
    const done = run("Start without data", run("Continue", run("Continue", atHandoffIntro())));
    assert.equal(personalDemoHandoffOf(done.nextEntranceSession).state, "COMPLETED");
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        done.nextEntranceSession,
        "What do you know about my situation so far?",
        [],
      ),
      false,
    );
    const ask = run("What do you know about my situation so far?", done);
    assert.ok(ask.nexoraMessage.text.length > 8);
    assert.doesNotMatch(ask.nexoraMessage.text, /Let's do it/i);
  });

  it("Proof G — central workspace is executive context, not a new family", () => {
    assert.equal(NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID, "obj-executive-context");
    assert.notEqual(NEXORA_EXECUTIVE_GOAL_OBJECT_ID, NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID);
  });

  it("default /executive stays outside ENT:10", () => {
    const existing = executeNexoraConversationalExperience({
      utterance: "Let's do it",
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-ent10-outside",
    });
    assert.equal(personalDemoHandoffOf(existing.nextEntranceSession).state, "NOT_STARTED");
  });

  it("reset educational re-entry keeps sufficient identity", () => {
    const identity = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Alex. I run operations for a logistics company.",
    );
    const reentry = createNexoraEntranceSession({
      workspaceResolution: "first-time",
      identity,
      educationalReentry: true,
    });
    assert.equal(reentry.workspaceResolution, "first-time");
    assert.ok(reentry.identity.managerName);
    const returning = createNexoraEntranceSession({
      workspaceResolution: "first-time",
      identity,
    });
    assert.equal(returning.workspaceResolution, "returning-sufficient");
  });

  it("source has no parallel demo stores", () => {
    const source = readFileSync(join(here, "nexoraPersonalDemoHandoffExperience.ts"), "utf8");
    assert.doesNotMatch(source, /ent10IdentityStore|demoGoalStore|personalDemoStore|demoDataStore/);
    assert.doesNotMatch(source, /applyManagerIdentityUtterance\(/);
    assert.doesNotMatch(source, /applyGoalUtterance\(/);
    assert.match(source, /shouldCommitRuntime: false/);
  });
});
