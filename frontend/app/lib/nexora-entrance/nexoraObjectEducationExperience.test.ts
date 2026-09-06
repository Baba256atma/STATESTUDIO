/**
 * NEX-ENT:3 — Object Language Education.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { resolveCanonicalExecutiveObjectType } from "../decision-theatre/nexoraDecisionTheatreVisualFamily.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  isNexoraGuidedEntranceActive,
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_OBJECT_EDUCATION_BOUNDARY,
  acknowledgeNexoraObjectEducationInteraction,
  educationalObjectIds,
  isNexoraObjectEducationActive,
  objectEducationOf,
  overlayObjectEducationOnEntranceCatalog,
  verifyNexoraObjectEducation,
} from "./nexoraObjectEducationExperience.ts";

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
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    messageIdSeed: `nex-ent3-${utterance}`,
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

function assertNoBusinessTruth(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.realityDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.scenarioDiscovery, null);
  assert.equal(session?.scenarioComparison, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

describe("NEX-ENT:3 Object Language Education", () => {
  it("identity and boundary preserve presentation-only Objects", () => {
    assert.equal(verifyNexoraObjectEducation().ok, true);
    assert.equal(NEXORA_OBJECT_EDUCATION_BOUNDARY.secondObjectSystem, false);
    assert.equal(NEXORA_OBJECT_EDUCATION_BOUNDARY.fabricatesBusinessObjects, false);
    assert.equal(NEXORA_OBJECT_EDUCATION_BOUNDARY.writesDecisionCommitment, false);
    assert.equal(NEXORA_OBJECT_EDUCATION_BOUNDARY.implementsDataEducation, false);
    assert.equal(NEXORA_OBJECT_EDUCATION_BOUNDARY.implementsChartEducation, false);
    for (const id of educationalObjectIds()) {
      assert.match(id, /^obj-nex-ent3-/);
    }
  });

  it("Proof A — completing Stage education continues into Object education", () => {
    const next = atGoal();
    assert.equal(objectEducationOf(next.nextEntranceSession).state, "GOAL");
    assert.equal(isNexoraObjectEducationActive(next.nextEntranceSession), true);
    assert.match(next.nexoraMessage.text, /now that you know the stage/i);
    assert.match(next.nexoraMessage.text, /goal/i);
    const catalog = projectNexoraEntranceCatalog(next.nextEntranceSession!);
    assert.equal(catalog.objects.some((object) => object.id === "obj-nex-ent3-goal"), true);
    assert.equal(next.nextRuntimeState.focusedSubject?.id, "obj-nex-ent3-goal");
    assertNoBusinessTruth(next);
  });

  it("Proof B — What is this? explains the educational Goal", () => {
    const asked = run("What is this?", atGoal());
    assert.match(asked.nexoraMessage.text, /goal/i);
    assert.doesNotMatch(asked.nexoraMessage.text, /database|graph vertex|runtime subject/i);
  });

  it("Proof C — Goal versus KPI", () => {
    const kpi = advance(1);
    assert.equal(objectEducationOf(kpi.nextEntranceSession).state, "KPI");
    const asked = run("What's the difference between this and the Goal?", kpi);
    assert.match(asked.nexoraMessage.text, /kpi/i);
    assert.match(asked.nexoraMessage.text, /goal/i);
    assert.doesNotMatch(asked.nexoraMessage.text, /91%|96%/);
    assertNoBusinessTruth(asked);
  });

  it("Proof D — Risk is not Problem", () => {
    const issue = advance(2);
    assert.equal(objectEducationOf(issue.nextEntranceSession).state, "ISSUE");
    const asked = run("Is Risk the same as Problem?", issue);
    assert.match(asked.nexoraMessage.text, /not the same/i);
  });

  it("Proof E — Scenario is not Decision", () => {
    const scenario = advance(3);
    assert.equal(objectEducationOf(scenario.nextEntranceSession).state, "SCENARIO");
    const asked = run("Is this the Decision?", scenario);
    assert.match(asked.nexoraMessage.text, /not a decision/i);
  });

  it("Proof F — Nexora does not decide for the manager", () => {
    const decision = advance(4);
    assert.equal(objectEducationOf(decision.nextEntranceSession).state, "DECISION");
    const asked = run("Can you decide for me?", decision);
    assert.match(asked.nexoraMessage.text, /do not silently commit/i);
    assert.equal(asked.nextEntranceSession?.decisionExperience, null);
    assertNoBusinessTruth(asked);
  });

  it("Proof G — after Decision is Execution without writes", () => {
    const asked = run("What happens after a Decision?", advance(4));
    assert.match(asked.nexoraMessage.text, /execution/i);
    assert.equal(asked.nextEntranceSession?.executionPlanning, null);
  });

  it("Proof H — Outcome does not prove causation", () => {
    const asked = run(
      "Does a good Outcome prove the Decision caused it?",
      advance(6),
    );
    assert.match(asked.nexoraMessage.text, /does not prove/i);
    assert.equal(asked.nextEntranceSession?.outcomeMonitoring, null);
  });

  it("Proof I — deictic continuity stays on Scenario", () => {
    const scenario = advance(3);
    const ack = acknowledgeNexoraObjectEducationInteraction({
      session: scenario.nextEntranceSession!,
      runtimeState: scenario.nextRuntimeState,
      subjectId: "obj-nex-ent3-scenario",
    });
    assert.match(ack?.response ?? "", /scenario/i);
    const explained = run("Explain this", {
      ...scenario,
      nextEntranceSession: ack!.session,
    });
    assert.match(explained.nexoraMessage.text, /scenario/i);
    const different = run("Why is it different?", explained);
    assert.match(different.nexoraMessage.text, /decision/i);
  });

  it("Proof J — Show problems is not hijacked", () => {
    const started = atGoal();
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(started.nextEntranceSession, "Show problems"),
      false,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        started.nextEntranceSession,
        "Explain Delivery Delay",
      ),
      false,
    );
    const unrelated = run("Show problems", started);
    assert.doesNotMatch(unrelated.nexoraMessage.text, /now that you know the stage/i);
    assert.equal(objectEducationOf(unrelated.nextEntranceSession).state, "GOAL");
  });

  it("Proof K — skip exits safely and removes educational actors", () => {
    const skipped = run("Skip this", atGoal());
    assert.equal(skipped.nextEntranceSession?.workspaceResolution, "existing-workspace");
    assert.equal(objectEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(isNexoraEntranceRestrained(skipped.nextEntranceSession), false);
    assert.equal(isNexoraGuidedEntranceActive(skipped.nextEntranceSession), false);
    const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
    assert.equal(catalog.objects.some((object) => object.id.startsWith("obj-nex-ent3-")), false);
    assertNoBusinessTruth(skipped);
  });

  it("full Object education creates zero canonical business writes", () => {
    const recap = advance(7);
    assert.equal(objectEducationOf(recap.nextEntranceSession).state, "REVIEW");
    assert.match(recap.nexoraMessage.text, /object language/i);
    assertNoBusinessTruth(recap);
    const catalog = projectNexoraEntranceCatalog(recap.nextEntranceSession!);
    assert.ok(catalog.objects.length >= 4);
    assert.ok(catalog.objects.length <= 8);
    assert.equal(catalog.objects.every((object) => object.id.startsWith("obj-nex-ent3-")), true);
  });

  it("educational overlay never publishes discovery sessions", () => {
    const catalog = overlayObjectEducationOnEntranceCatalog(
      projectNexoraEntranceCatalog(guidedSession()),
      objectEducationOf(atGoal().nextEntranceSession),
    );
    assert.equal(catalog.relationships.length, 0);
    assert.equal(
      resolveCanonicalExecutiveObjectType({
        id: "obj-nex-ent3-goal",
        kind: "object",
        label: "Goal · Improve delivery",
      }),
      "goal",
    );
    assert.equal(
      resolveCanonicalExecutiveObjectType({
        id: "obj-nex-ent3-kpi",
        kind: "object",
        label: "KPI · On-time delivery",
      }),
      "kpi",
    );
  });
});
