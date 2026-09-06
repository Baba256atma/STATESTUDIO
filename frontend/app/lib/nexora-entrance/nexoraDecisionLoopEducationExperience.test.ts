/**
 * NEX-ENT:8 — Decision Loop education. Lesson state is not Decision/Execution/Outcome.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
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
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { visualEducationOf } from "./nexoraVisualEducationExperience.ts";
import {
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";
import {
  NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY,
  classifyDecisionLoopEducationMove,
  decisionLoopEducationOf,
  shouldNexoraDecisionLoopEducationOwnUtterance,
  verifyNexoraDecisionLoopEducation,
} from "./nexoraDecisionLoopEducationExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";

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
    messageIdSeed: `nex-ent8-${utterance}`,
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

function stepFromEvidence(steps: number) {
  let current = atEvidence();
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.scenarioDiscovery, null);
  assert.equal(session?.scenarioComparison, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
  assert.equal(result.shouldCommitRuntime, false);
}

describe("NEX-ENT:8 Decision Loop education", () => {
  it("teaches the loop without owning Decision/Execution/Outcome", () => {
    assert.equal(verifyNexoraDecisionLoopEducation().ok, true);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesDecision, false);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesExecution, false);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesOutcome, false);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.writesLearning, false);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.secondDecisionLoop, false);
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.decisionWriter, "CC:10R/CanonicalDecisionRuntime");
    assert.equal(NEXORA_DECISION_LOOP_EDUCATION_BOUNDARY.executionWriter, "CC:11/CanonicalExecution");
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
  });

  it("Proof A — ENT:7 review continues into Decision Loop education", () => {
    const evidence = atEvidence();
    assert.equal(visualEducationOf(evidence.nextEntranceSession).state, "COMPLETED");
    assert.equal(decisionLoopEducationOf(evidence.nextEntranceSession).state, "EVIDENCE");
    assert.match(evidence.nexoraMessage.text, /managed decision/i);
    assert.match(evidence.nexoraMessage.text, /not automatically a confirmed Problem/i);
    assertNoBusinessTruth(evidence);
  });

  it("Proof B — evidence is grounded and not fabricated", () => {
    const known = run("What do we know?", atEvidence());
    assert.match(known.nexoraMessage.text, /OTD around 90|two months/i);
    assert.doesNotMatch(known.nexoraMessage.text, /96\.8%|91% to 94%/);
    assertNoBusinessTruth(known);
  });

  it("Proof C — issue is not cause", () => {
    const issue = run("Show me the next one", atEvidence());
    assert.equal(decisionLoopEducationOf(issue.nextEntranceSession).state, "ISSUE");
    assert.match(issue.nexoraMessage.text, /not the same as a cause/i);
    const cause = run("Is capacity the cause?", issue);
    assert.match(cause.nexoraMessage.text, /do not prove capacity caused/i);
    assert.equal(decisionLoopEducationOf(cause.nextEntranceSession).state, "ISSUE");
    assertNoBusinessTruth(cause);
  });

  it("Proof D/E — investigation reuses existing copy; Why is evidence-based", () => {
    const investigate = stepFromEvidence(2);
    assert.equal(decisionLoopEducationOf(investigate.nextEntranceSession).state, "INVESTIGATE");
    assert.match(investigate.nexoraMessage.text, /isn.t established as the cause/i);
    const why = run("Why are we investigating this?", investigate);
    assert.match(why.nexoraMessage.text, /worth investigating/i);
    assert.doesNotMatch(why.nexoraMessage.text, /INVESTIGATE step/i);
    assertNoBusinessTruth(why);
  });

  it("Proof F/G — scenarios appear without a Decision", () => {
    const scenarios = stepFromEvidence(3);
    assert.equal(decisionLoopEducationOf(scenarios.nextEntranceSession).state, "SCENARIOS");
    assert.match(scenarios.nexoraMessage.text, /not yet a Decision/i);
    assert.match(scenarios.nexoraMessage.text, /Temporary Capacity/i);
    const session = scenarios.nextEntranceSession;
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(session, "Approve Temporary Capacity."),
      false,
    );
    assert.equal(classifyDecisionLoopEducationMove("Approve Temporary Capacity."), null);
    assertNoBusinessTruth(scenarios);
  });

  it("Proof H/I — comparison does not rank or invent cost", () => {
    const compared = stepFromEvidence(4);
    assert.equal(decisionLoopEducationOf(compared.nextEntranceSession).state, "COMPARE");
    assert.match(compared.nexoraMessage.text, /does not pick a winner/i);
    assert.match(compared.nexoraMessage.text, /unknown/i);
    assert.doesNotMatch(compared.nexoraMessage.text, /\b92\b|\b77\b|\b54\b/);
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        compared.nextEntranceSession,
        "What is a Scenario?",
      ),
      true,
    );
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        compared.nextEntranceSession,
        "What is a Scenario?",
        [],
      ),
      true,
    );
    const scenarioQ = run("What is a Scenario?", compared);
    assert.equal(decisionLoopEducationOf(scenarioQ.nextEntranceSession).state, "COMPARE");
    assert.match(scenarioQ.nexoraMessage.text, /not yet a Decision/i);
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        compared.nextEntranceSession,
        "Compare the scenarios",
      ),
      false,
    );
    assertNoBusinessTruth(compared);
  });

  it("Proof J/K/L — recommendation is not a Decision and can withhold ranking", () => {
    const recommend = run("Which would you recommend?", stepFromEvidence(4));
    assert.equal(decisionLoopEducationOf(recommend.nextEntranceSession).state, "RECOMMEND");
    assert.match(recommend.nexoraMessage.text, /recommendation, not a Decision/i);
    assert.match(recommend.nexoraMessage.text, /don.t have enough comparable cost/i);
    const why = run("Why?", recommend);
    assert.match(why.nexoraMessage.text, /not scoring/i);
    assert.equal(decisionLoopEducationOf(why.nextEntranceSession).state, "RECOMMEND");
    assert.equal(why.nextEntranceSession?.decisionExperience, null);
    assertNoBusinessTruth(why);
  });

  it("Proof M — Not yet does not write a Decision", () => {
    const commit = stepFromEvidence(6);
    assert.equal(decisionLoopEducationOf(commit.nextEntranceSession).state, "COMMIT");
    const declined = run("Not yet", commit);
    assert.equal(decisionLoopEducationOf(declined.nextEntranceSession).state, "COMMIT");
    assert.match(declined.nexoraMessage.text, /No Decision was committed/i);
    assertNoBusinessTruth(declined);
  });

  it("Proof N/O/P — Approve and Start are not ENT writers", () => {
    const commit = stepFromEvidence(6);
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        commit.nextEntranceSession,
        "Approve Temporary Capacity.",
      ),
      false,
    );
    const approve = run("Approve Temporary Capacity.", commit);
    assert.equal(approve.nextEntranceSession?.decisionExperience, null);
    assert.equal(decisionLoopEducationOf(approve.nextEntranceSession).state, "COMMIT");
    const start = run("Start the execution.", commit);
    assert.equal(start.nextEntranceSession?.executionPlanning, null);
    assert.equal(start.nextEntranceSession?.decisionExperience, null);
    assertNoBusinessTruth(approve);
  });

  it("Proof Q–W — execution, outcome, and learning remain lesson-only on ENT", () => {
    const execution = stepFromEvidence(7);
    assert.equal(decisionLoopEducationOf(execution.nextEntranceSession).state, "EXECUTION");
    assert.match(execution.nexoraMessage.text, /does not mean work has started/i);
    const notYet = run("Not yet", execution);
    assert.equal(decisionLoopEducationOf(notYet.nextEntranceSession).state, "EXECUTION");
    assert.equal(notYet.nextEntranceSession?.executionPlanning, null);
    const happenedEarly = run("What happened?", execution);
    assert.equal(decisionLoopEducationOf(happenedEarly.nextEntranceSession).state, "EXECUTION");
    assert.match(happenedEarly.nexoraMessage.text, /have not observed an Outcome/i);
    const outcome = stepFromEvidence(8);
    assert.match(outcome.nexoraMessage.text, /does not prove the Decision caused/i);
    assert.doesNotMatch(outcome.nexoraMessage.text, /\bSUCCESS\b/);
    const review = stepFromEvidence(9);
    assert.equal(decisionLoopEducationOf(review.nextEntranceSession).state, "REVIEW");
    assert.match(review.nexoraMessage.text, /You remain the Decision authority/i);
    assert.doesNotMatch(review.nexoraMessage.text, /proficiency|trust score|ENT:9/i);
    assertNoBusinessTruth(review);
  });

  it("Proof X — routing precedence for problems, data, and visual", () => {
    const evidence = atEvidence();
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        evidence.nextEntranceSession,
        "Show me the problems",
      ),
      false,
    );
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        evidence.nextEntranceSession,
        "Where is Data?",
      ),
      false,
    );
    assert.equal(
      shouldNexoraDecisionLoopEducationOwnUtterance(
        evidence.nextEntranceSession,
        "Show me delivery over time",
      ),
      false,
    );
    const problems = run("Show me the problems", evidence);
    assert.match(problems.nexoraMessage.text, /problem/i);
    const locate = run("Where is Data?", evidence);
    assert.equal(locate.guidedAttention?.presentation?.target, "DATA_ENTRY");
    const trend = run("Show me delivery over time", evidence);
    assert.equal(trend.visualView?.view?.purpose, "TREND");
    assert.equal(decisionLoopEducationOf(trend.nextEntranceSession).state, "EVIDENCE");
  });

  it("Proof Y — conversation continues without wizard lock", () => {
    const follow = run("Explain this.", atEvidence());
    assert.ok(follow.nexoraMessage.text.length > 8);
    assert.equal(decisionLoopEducationOf(follow.nextEntranceSession).state, "EVIDENCE");
  });

  it("Proof Z — skip before commitment does not write business state", () => {
    const skipped = run("Skip for now", atEvidence());
    assert.equal(decisionLoopEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assertNoBusinessTruth(skipped);
  });

  it("education COMMIT is not a Decision; default /executive stays outside ENT", () => {
    const commit = stepFromEvidence(6);
    assert.equal(decisionLoopEducationOf(commit.nextEntranceSession).state, "COMMIT");
    assert.equal(commit.nextEntranceSession?.decisionExperience, null);
    const existing = executeNexoraConversationalExperience({
      utterance: "Which would you recommend?",
      executiveSubjects: projectManagerObjectConversationalSubjects(
        getDefaultNexoraMVPObjectInteractionCatalog(),
      ),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: createNexoraEntranceSession({
        workspaceResolution: "existing-workspace",
      }),
      messageIdSeed: "nex-ent8-outside",
    });
    assert.equal(
      decisionLoopEducationOf(existing.nextEntranceSession).state,
      "NOT_STARTED",
    );
    assert.equal(existing.nextEntranceSession?.decisionExperience, null);
    assert.equal(existing.nextEntranceSession?.workspaceResolution, "existing-workspace");
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(
        createNexoraEntranceSession({ workspaceResolution: "existing-workspace" }),
        "Show me the next one",
        [],
      ),
      false,
    );
  });

  it("callable NEX-EXP loop outside ENT writes Decision once via CC:10R then Execution via CC:11", () => {
    const identity = applyManagerIdentityUtterance(
      emptyManagerIdentityContext(),
      "I'm Dana. I run operations for a logistics company.",
    );
    const decision = createNexoraCanonicalDecisionRuntime();
    const execution = createNexoraCanonicalExecutionRuntime({
      decisionRuntime: decision.adapter,
    });
    function exp(
      utterance: string,
      previous?: ReturnType<typeof executeNexoraConversationalExperience>,
    ) {
      const session = previous?.nextEntranceSession ?? createNexoraEntranceSession({
        workspaceResolution: "first-time",
        identity,
      });
      const catalog = projectNexoraEntranceCatalog(session);
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
        decisionRuntime: decision.adapter,
        executionRuntime: execution,
        messageIdSeed: `nex-ent8-exp-${utterance}`,
      });
    }
    const ready = exp(
      "Which one do you recommend?",
      exp(
        "Compare the scenarios.",
        exp(
          "Compare these scenarios.",
          exp(
            "What if we do nothing?",
            exp(
              "We could add weekend capacity.",
              exp(
                "Are we ready to explore scenarios?",
                exp(
                  "Capacity is our biggest problem.",
                  exp(
                    "Our backlog is high and capacity is almost full.",
                    exp(
                      "On-time delivery is around 91%. We want 96%.",
                      exp("We need to improve delivery reliability."),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    assert.equal(ready.nextEntranceSession?.scenarioComparison?.state, "READY_FOR_DECISION");
    assert.equal(decision.adapter.listDecisions().length, 0);
    const go = exp("Let's go with Scenario A.", ready);
    assert.equal(go.nextEntranceSession?.decisionExperience?.canonicalRecord, null);
    const yes = exp("Yes, confirm.", go);
    assert.equal(yes.nextEntranceSession?.decisionExperience?.canonicalRecord?.status, "Approved");
    assert.equal(decision.adapter.listDecisions().length, 1);
    assert.notEqual(
      yes.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
    const again = exp("Yes, confirm.", yes);
    assert.equal(decision.adapter.listDecisions().length, 1);
    const plan = exp("What's the execution plan?", again);
    assert.notEqual(plan.nextEntranceSession?.executionPlanning?.canonicalStatus, "in-progress");
    const startAsk = exp("Let's start it.", plan);
    const started = exp("Confirm.", startAsk);
    assert.equal(started.nextEntranceSession?.executionPlanning?.canonicalStatus, "in-progress");
    assert.equal(started.nextEntranceSession?.guidedIntroduction?.state, "INACTIVE");
    assert.equal(
      decisionLoopEducationOf(started.nextEntranceSession).state,
      "NOT_STARTED",
    );
  });

  it("source does not add an ENT Decision or Learning writer", () => {
    const source = readFileSync(join(here, "nexoraDecisionLoopEducationExperience.ts"), "utf8");
    assert.doesNotMatch(source, /commitThroughCanonicalRuntime/);
    assert.doesNotMatch(source, /createNexoraCanonicalDecisionRuntime/);
    assert.doesNotMatch(source, /shouldCommitRuntime: true/);
    assert.match(source, /shouldCommitRuntime: false/);
  });
});
