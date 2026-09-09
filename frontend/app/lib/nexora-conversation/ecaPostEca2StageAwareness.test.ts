/**
 * NPA-T POST-ECA:2 — live Stage awareness. Read-only. Does not start ECA:13.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  projectManagerObjectConversationalSubjects,
} from "../manager-object/managerObjectCatalog.ts";
import {
  composeStageVisibilityCorrectionReply,
  isStageVisibilityCorrection,
  projectAuthoritativeStageContext,
} from "../manager-object/nexoraNxa5Fix4StageContextIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  stepBackNexoraMVPObjectInteraction,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: Turn,
  runtimeState = previous?.nextRuntimeState ?? overview(),
): Turn {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState,
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `post-eca-2-${utterance}`,
  });
}

function visibleOf(state = overview()) {
  return projectAuthoritativeStageContext({ runtimeState: state, catalog }).visibleMembers;
}

describe("POST-ECA:2 Stage awareness", () => {
  it("A — Overview membership reports presentation-visible actors, not empty executive objects", () => {
    const visible = visibleOf();
    assert.ok(visible.length > 0, "Overview Stage presentation must have visible actors");
    const turn = run("what is on stage?");
    assert.doesNotMatch(turn.response, /does not currently show any executive objects/i);
    for (const actor of visible) {
      assert.match(turn.response, new RegExp(actor.label.replace(/\s+Watch$/i, ""), "i"));
    }
    assert.equal(turn.shouldCommitRuntime, false);
    assert.deepEqual(turn.nextRuntimeState, overview());
  });

  it("B — explicit objects question uses Stage composition, not Problems collection", () => {
    const visible = visibleOf();
    const turn = run("what objects are on stage?");
    assert.doesNotMatch(turn.response, /Capacity Gap|Margin Pressure/i);
    for (const actor of visible) {
      assert.match(turn.response, new RegExp(actor.label.replace(/\s+Watch$/i, ""), "i"));
    }
  });

  it("C/F — focused Risk reports focus plus remaining visible actors", () => {
    const focused = run("Focus on Risk.");
    assert.equal(focused.nextRuntimeState.focusedSubject?.label, "Risk");
    const stage = projectAuthoritativeStageContext({
      runtimeState: focused.nextRuntimeState,
      catalog,
    });
    const asked = run("what is on stage?", focused);
    assert.match(asked.response, /Risk/i);
    if (stage.visibleMembers.length > 1) {
      assert.match(asked.response, /focused/i);
      assert.match(asked.response, /also visible/i);
      assert.doesNotMatch(asked.response, /does not currently show any executive objects/i);
    }
  });

  it("D — focus question answers focus only", () => {
    const focused = run("Focus on Risk.");
    const asked = run("what am I focused on?", focused);
    assert.match(asked.response, /Risk/i);
    assert.doesNotMatch(asked.response, /also visible/i);
  });

  it("E — empty focus / nonempty Stage", () => {
    const stage = projectAuthoritativeStageContext({ runtimeState: overview(), catalog });
    assert.equal(stage.focus, null);
    assert.ok(stage.visibleMembers.length > 0);
    const turn = run("what is on stage?");
    assert.doesNotMatch(turn.response, /currently empty|executive objects/i);
  });

  it("G — Queue contents are not Stage membership", () => {
    const turn = run("what is on stage?");
    const queueCount = catalog.contextSubjects.length;
    assert.ok(queueCount > 2);
    assert.doesNotMatch(turn.response, new RegExp(`${queueCount} `));
    assert.doesNotMatch(turn.response, /queue contains/i);
  });

  it("H — Problems collection does not substitute for Overview Stage", () => {
    const turn = run("what is on stage?");
    assert.doesNotMatch(turn.response, /Current Problems: Capacity Gap/i);
    assert.doesNotMatch(turn.response, /Capacity Gap and Margin Pressure/i);
  });

  it("I — Current Subject Executive Overview is not an empty Stage", () => {
    const turn = run("what is on stage?");
    assert.doesNotMatch(turn.response, /does not currently show any executive objects/i);
    assert.match(turn.response, /currently visible/i);
  });

  it("J/K/L — Stage correction binds to visibility, not You, and acknowledges when runtime confirms", () => {
    const stage = projectAuthoritativeStageContext({ runtimeState: overview(), catalog });
    const correction =
      `No, you're wrong. There is ${stage.visibleMembers.map((item) => item.label).join(" and ")} on it. Do you understand?`;
    assert.equal(isStageVisibilityCorrection(correction, stage.visibleMembers), true);
    const prior = run("what is on stage?");
    const turned = run(correction, prior);
    assert.equal(turned.ecaAnswerIntakeJudgment?.answerType, "CORRECTION");
    assert.equal(turned.ecaAnswerIntakeJudgment?.subject?.label, "Stage visibility");
    assert.notEqual(turned.ecaAnswerIntakeJudgment?.subject?.label, "You");
    assert.doesNotMatch(turned.response, /observation about You/i);
    assert.match(turned.response, /You're right|wrong context|currently visible/i);
    assert.deepEqual(turned.nextRuntimeState, prior.nextRuntimeState);
  });

  it("M — runtime disagreement does not mutate Stage", () => {
    const reply = composeStageVisibilityCorrectionReply({
      utterance: "No, there is Completely Invented Watch on it.",
      stage: projectAuthoritativeStageContext({ runtimeState: overview(), catalog }),
    });
    assert.match(reply, /doesn[’']t match|shouldn[’']t treat either view as confirmed/i);
    const prior = run("what is on stage?");
    const turned = run("No, Completely Invented Watch is on it.", prior);
    assert.deepEqual(turned.nextRuntimeState, prior.nextRuntimeState);
  });

  it("N — Explain visible actor without prior focus", () => {
    const visible = visibleOf();
    const target = visible[0];
    assert.ok(target);
    const explained = run(`Explain ${target.label}.`);
    assert.match(explained.response, new RegExp(target.label.replace(/\s+Watch$/i, ""), "i"));
    assert.equal(explained.shouldCommitRuntime, false);
  });

  it("O — pronoun continuity uses Stage order", () => {
    const visible = visibleOf();
    assert.ok(visible.length >= 2);
    const listed = run("what is on stage?");
    const second = run("Explain the second one.", listed);
    assert.match(second.response, new RegExp(visible[1]!.label.replace(/\s+Watch$/i, ""), "i"));
  });

  it("P — why visible uses known presentation reason or unknown", () => {
    const why = run("Why are these objects here?");
    assert.match(why.response, /Overview presentation|Stage (?:view|presentation)|don[’']t have enough information/i);
    assert.doesNotMatch(why.response, /because they are the most important/i);
  });

  it("Q — navigation answers follow current projection", () => {
    const overviewAsk = run("what is on stage?");
    const focused = run("Focus on Risk.", overviewAsk);
    const riskAsk = run("what is on stage?", focused);
    assert.match(riskAsk.response, /Risk/i);
    const restoredState = stepBackNexoraMVPObjectInteraction(focused.nextRuntimeState, catalog);
    const back = run("What's on Stage now?", focused, restoredState);
    assert.equal(back.nextRuntimeState.focusedSubject, restoredState.focusedSubject);
  });

  it("R — refresh uses canonical restored presentation", () => {
    const first = run("what is on stage?");
    const refreshed = run("what is on stage?");
    assert.equal(first.response, refreshed.response);
  });

  it("S — visibility is not importance, priority, or causality", () => {
    const visible = visibleOf();
    const name = visible[0]?.label ?? "Customer";
    const importance = run(`${name} is on Stage, so is it important?`);
    assert.match(importance.response, /Not by itself|does not by itself/i);
    const causality = run(`${name} is on Stage, so is it the cause?`);
    assert.match(causality.response, /does not by itself establish causality/i);
    if (visible.length >= 2) {
      const proximity = run(
        `${visible[0]!.label} is next to ${visible[1]!.label}. Does that mean they're related?`,
      );
      assert.match(proximity.response, /does not by itself mean they are related/i);
    }
  });

  it("T — read-only Stage questions do not write business or Stage state", () => {
    const before = overview();
    const turn = run("what is on stage?");
    assert.equal(turn.shouldCommitRuntime, false);
    assert.deepEqual(turn.nextRuntimeState, before);
    assert.equal(turn.ecaAnswerIntakeJudgment?.boundaries.mutatesBusinessState, false);
    assert.equal(turn.ecaAnswerIntakeJudgment?.boundaries.writesStage, false);
  });

  it("Sequence 1 — objects follow-up does not switch to Problems", () => {
    let turn = run("what is on stage?");
    turn = run("I mean what objects on stage?", turn);
    assert.doesNotMatch(turn.response, /Capacity Gap and Margin Pressure/i);
    assert.match(turn.response, /currently visible/i);
  });

  it("Sequence 5 — Stage inspection is a side question", () => {
    const investigate = run("Investigate Risk.");
    const stage = run("What’s on Stage?", investigate);
    assert.match(stage.response, /visible|focused/i);
    const continued = run("Continue the investigation.", stage);
    assert.ok(
      continued.ecaDialogueStrategy?.objectiveType === "INVESTIGATE_ISSUE" ||
        continued.ecaDialogueStrategy?.lifecycle === "RESUMED" ||
        /Risk/i.test(continued.response),
    );
  });
});
