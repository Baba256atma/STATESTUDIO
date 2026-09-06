/**
 * NEX-CONV:2-FIX1 — Entrance intent routing, relevance WHY, action handoff.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { interpretCanonicalManagerMeaning } from "../manager-object/canonicalManagerMeaningInterpreter.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "../nexora-entrance/nexoraEntranceExperience.ts";
import { conversationContinuityOf } from "../nexora-entrance/nexoraEntranceConversationContinuity.ts";
import { withActiveNexoraGuidedEntrance } from "../nexora-entrance/nexoraGuidedEntranceExperience.ts";
import { conversationPurposeFromMeaning } from "./nexoraConversationPolicy.ts";
import { coverageOf } from "./nexoraConversationWorkingContext.ts";

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
    messageIdSeed: `nex-conv2-fix1-${utterance}`,
  });
}

function atGoal() {
  return run("Show me the next one", run("Show me how focus works", run("Show me")));
}

function labels(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  return (result.nexoraMessage.suggestedActions ?? []).map((action) => action.label);
}

describe("NEX-CONV:2-FIX1 entrance relevance routing", () => {
  it("NCA treats importance WHY as GOAL_RELEVANCE, not CAUSE or STATUS", () => {
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Why is this important?",
      subjects: Object.freeze([]),
    });
    assert.equal(meaning.questionType, "GOAL_RELEVANCE");
    assert.notEqual(meaning.requestedOperation, "CAUSE");
    assert.notEqual(meaning.requestedOperation, "STATUS");
    assert.equal(conversationPurposeFromMeaning(meaning), "WHY_RELEVANT");
  });

  it("WHY matrix does not collapse into one purpose", () => {
    const relevance = conversationPurposeFromMeaning(
      interpretCanonicalManagerMeaning({
        utterance: "Why does this matter?",
        subjects: Object.freeze([]),
      }),
    );
    const present = conversationPurposeFromMeaning(
      interpretCanonicalManagerMeaning({
        utterance: "Why is it on Stage?",
        subjects: Object.freeze([]),
      }),
    );
    const causal = conversationPurposeFromMeaning(
      interpretCanonicalManagerMeaning({
        utterance: "Why did this happen?",
        subjects: Object.freeze([]),
      }),
    );
    const status = interpretCanonicalManagerMeaning({
      utterance: "Is this stable?",
      subjects: Object.freeze([]),
    });
    const investigate = conversationPurposeFromMeaning(
      interpretCanonicalManagerMeaning({
        utterance: "Why should I investigate it?",
        subjects: Object.freeze([]),
      }),
    );
    const recommend = conversationPurposeFromMeaning(
      interpretCanonicalManagerMeaning({
        utterance: "Why do you recommend this?",
        subjects: Object.freeze([]),
      }),
    );
    const uncertain = interpretCanonicalManagerMeaning({
      utterance: "Why is this uncertain?",
      subjects: Object.freeze([]),
    });
    assert.equal(relevance, "WHY_RELEVANT");
    assert.equal(present, "WHY_PRESENT");
    assert.equal(causal, "CAUSE");
    assert.equal(status.requestedOperation, "STATUS");
    assert.notEqual(investigate, "WHY_RELEVANT");
    assert.notEqual(recommend, "WHY_RELEVANT");
    assert.notEqual(uncertain.questionType, "GOAL_RELEVANCE");
  });

  it("repeated Why is this important? is relevant, progresses, and offers Show me", () => {
    const t1 = run("Why is this important?");
    const t2 = run("Why is this important?", t1);
    const t3 = run("Why is this important?", t2);
    const t4 = run("Why is this important?", t3);
    assert.doesNotMatch(t1.nexoraMessage.text, /NEXORA is stable/i);
    assert.match(t1.nexoraMessage.text, /situation|evidence|decision/i);
    assert.notEqual(t2.nexoraMessage.text, t1.nexoraMessage.text);
    assert.match(t3.nexoraMessage.text, /show you/i);
    assert.ok(labels(t1).some((item) => /show me/i.test(item)));
    const working = conversationContinuityOf(t4.nextEntranceSession).working;
    assert.equal(working.lastDecision?.purpose, "WHY_RELEVANT");
    assert.ok(coverageOf(working, "obj-nexora-entrance", "WHY_RELEVANT") !== "NONE");
    assert.equal(working.conversationThread?.objective, "LEARN_CAPABILITY");
    assert.equal(t4.nextEntranceSession?.decisionExperience, null);
    assert.equal(t4.nextEntranceSession?.goalDiscovery, null);
  });

  it("semantic equivalents and follow-ups stay on the relevance thread", () => {
    const first = run("Why is this important?");
    const equivalent = run("Why does this matter?", first);
    assert.doesNotMatch(equivalent.nexoraMessage.text, /NEXORA is stable/i);
    const why = run("Why?", equivalent);
    assert.doesNotMatch(why.nexoraMessage.text, /NEXORA is stable/i);
    const mean = run("What do you mean?", why);
    assert.ok(mean.nexoraMessage.text.length > 8);
  });

  it("Show me after relevance uses existing Continue/Stage handoff", () => {
    const ready = run("Why is this important?", run("Why is this important?", run("Why is this important?")));
    const shown = run("Show me", ready);
    assert.match(shown.nexoraMessage.text, /Stage/i);
    assert.equal(shown.shouldCommitRuntime, true);
  });

  it("status questions can still use stable", () => {
    const status = run("Is NEXORA stable?");
    assert.match(status.nexoraMessage.text, /stable/i);
    assert.doesNotMatch(status.nexoraMessage.text, /No immediate action is recommended/i);
  });

  it("priority WHY is not product relevance", () => {
    const existing = executeNexoraConversationalExperience({
      utterance: "Why should I investigate this first?",
      conversationContext: undefined,
      executiveContext: undefined,
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousManagerObjectSession: null,
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-conv2-fix1-priority",
    });
    assert.doesNotMatch(existing.nexoraMessage.text, /keeps the situation, evidence, options/i);
  });

  it("Goal importance is not WHY_PRESENT and does not invent priority", () => {
    const asked = run("Why is this Goal important?", atGoal());
    assert.doesNotMatch(asked.nexoraMessage.text, /is stable/i);
    assert.doesNotMatch(asked.nexoraMessage.text, /HIGH priority|high importance/i);
    const present = run("Why is it on Stage?", asked);
    assert.match(present.nexoraMessage.text, /on Stage|present in this lesson/i);
    assert.notEqual(asked.nexoraMessage.text, present.nexoraMessage.text);
  });

  it("causal WHY is not hijacked by relevance", () => {
    const existing = executeNexoraConversationalExperience({
      utterance: "Why did this happen?",
      conversationContext: undefined,
      executiveContext: undefined,
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousManagerObjectSession: null,
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-conv2-fix1-causal",
    });
    assert.doesNotMatch(existing.nexoraMessage.text, /keeps the situation, evidence, options/i);
    const meaning = interpretCanonicalManagerMeaning({
      utterance: "Why did this happen?",
      subjects: Object.freeze([]),
    });
    assert.equal(conversationPurposeFromMeaning(meaning), "CAUSE");
  });

  it("does not use a phrase patch or NEXORA-specific router", () => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const guided = readFileSync(
      join(dir, "../nexora-entrance/nexoraGuidedEntranceExperience.ts"),
      "utf8",
    );
    assert.doesNotMatch(guided, /Why is this important\?/);
    assert.doesNotMatch(guided, /if \(subject === "NEXORA"\)/);
    assert.match(guided, /GOAL_RELEVANCE/);
    const explain = readFileSync(
      join(dir, "../manager-object/managerObjectExplainEngine.ts"),
      "utf8",
    );
    assert.doesNotMatch(explain, /why is this important\|why does this matter/);
  });

  it("Decision relevance does not write Decision authority", () => {
    const existing = executeNexoraConversationalExperience({
      utterance: "Why is this Decision important?",
      conversationContext: undefined,
      executiveContext: undefined,
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousManagerObjectSession: null,
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-conv2-fix1-decision",
    });
    assert.equal(existing.nextEntranceSession?.decisionExperience, null);
    assert.doesNotMatch(existing.nexoraMessage.text, /approved|I will decide/i);
  });
});
