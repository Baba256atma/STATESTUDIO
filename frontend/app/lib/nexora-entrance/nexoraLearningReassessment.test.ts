/**
 * NEX-EXP:10 — Learning, Reassessment & Next Executive Cycle tests.
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
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  NEXORA_LEARNING_OBJECT_ID,
  NEXORA_LEARNING_REASSESSMENT_BOUNDARY,
  getNexoraLearningReassessmentIdentity,
  learningReassessmentUsesExistingAuthorities,
  overlayLearningOnEntranceCatalog,
  shouldNexoraLearningReassessmentOwnUtterance,
  verifyNexoraLearningReassessment,
} from "./nexoraLearningReassessment.ts";
import { routeNextCycle } from "./nexoraLearningReassessmentResolution.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function readyEntrance() {
  const identity = applyManagerIdentityUtterance(
    emptyManagerIdentityContext(),
    "I'm Dana. I run operations for a logistics company.",
  );
  return createNexoraEntranceSession({
    workspaceResolution: "first-time",
    identity,
  });
}

type Runtimes = {
  readonly __decision: ReturnType<typeof createNexoraCanonicalDecisionRuntime>;
  readonly __execution: ReturnType<typeof createNexoraCanonicalExecutionRuntime>;
};

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience> & Runtimes,
) {
  const decision = previous?.__decision ?? createNexoraCanonicalDecisionRuntime();
  const execution =
    previous?.__execution ??
    createNexoraCanonicalExecutionRuntime({ decisionRuntime: decision.adapter });
  const session = previous?.nextEntranceSession ?? readyEntrance();
  const catalog = projectNexoraEntranceCatalog(session);
  const result = executeNexoraConversationalExperience({
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
    decisionRuntime: decision.adapter,
    executionRuntime: execution,
    messageIdSeed: `nex-exp10-${utterance}`,
  });
  return { ...result, __decision: decision, __execution: execution };
}

function reachLearningReady() {
  const committed = runTurn(
    "Yes, confirm.",
    runTurn(
      "Let's go with Scenario A.",
      runTurn(
        "Which one do you recommend?",
        runTurn(
          "Compare the scenarios.",
          runTurn(
            "Compare these scenarios.",
            runTurn(
              "What if we do nothing?",
              runTurn(
                "We could add weekend capacity.",
                runTurn(
                  "Are we ready to explore scenarios?",
                  runTurn(
                    "Capacity is our biggest problem.",
                    runTurn(
                      "Our backlog is high and capacity is almost full.",
                      runTurn(
                        "On-time delivery is around 91%. We want 96%.",
                        runTurn("We need to improve delivery reliability."),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
  const started = runTurn(
    "Confirm.",
    runTurn("Let's start it.", runTurn("What's the execution plan?", committed)),
  );
  return runTurn("On-time delivery is now 94%.", started);
}

describe("NEX-EXP:10 Learning, Reassessment & Next Executive Cycle", () => {
  it("identity, boundary, and reused authorities", () => {
    assert.equal(
      getNexoraLearningReassessmentIdentity().id,
      "NEX-EXP:10/LearningReassessmentNextExecutiveCycle",
    );
    assert.equal(verifyNexoraLearningReassessment().ok, true);
    assert.equal(NEXORA_LEARNING_REASSESSMENT_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_LEARNING_REASSESSMENT_BOUNDARY.infersCausality, false);
    assert.equal(NEXORA_LEARNING_REASSESSMENT_BOUNDARY.generalizesOneCase, false);
    assert.equal(learningReassessmentUsesExistingAuthorities(), true);
  });

  it("starts only at READY_FOR_LEARNING_REASSESSMENT and consumes EXP:9 handoff", () => {
    const before = runTurn("We need to improve delivery reliability.");
    assert.equal(
      shouldNexoraLearningReassessmentOwnUtterance(
        before.nextEntranceSession,
        "What did we learn?",
      ),
      false,
    );
    const ready = reachLearningReady();
    assert.equal(
      ready.nextEntranceSession?.outcomeMonitoring?.state,
      "READY_FOR_LEARNING_REASSESSMENT",
    );
    assert.ok(ready.nextEntranceSession?.outcomeMonitoring?.handoff);
    assert.equal(
      shouldNexoraLearningReassessmentOwnUtterance(
        ready.nextEntranceSession,
        "What did we learn?",
      ),
      true,
    );
  });

  it("no outcome means no Learning; outcome is not a general rule; causality unconfirmed", () => {
    const started = runTurn(
      "Confirm.",
      runTurn(
        "Let's start it.",
        runTurn(
          "What's the execution plan?",
          runTurn(
            "Yes, confirm.",
            runTurn(
              "Let's go with Scenario A.",
              runTurn(
                "Which one do you recommend?",
                runTurn(
                  "Compare the scenarios.",
                  runTurn(
                    "Compare these scenarios.",
                    runTurn(
                      "What if we do nothing?",
                      runTurn(
                        "We could add weekend capacity.",
                        runTurn(
                          "Are we ready to explore scenarios?",
                          runTurn(
                            "Capacity is our biggest problem.",
                            runTurn(
                              "Our backlog is high and capacity is almost full.",
                              runTurn(
                                "On-time delivery is around 91%. We want 96%.",
                                runTurn("We need to improve delivery reliability."),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    assert.equal(
      shouldNexoraLearningReassessmentOwnUtterance(
        started.nextEntranceSession,
        "What did we learn?",
      ),
      false,
    );
    const ready = reachLearningReady();
    const learned = runTurn("What did we learn?", ready);
    assert.match(learned.response, /THIS_CASE_ONLY/);
    assert.match(learned.response, /unconfirmed|UNKNOWN|not a restatement/i);
    assert.doesNotMatch(learned.response, /always/);
    const cause = runTurn("Did this prove Capacity caused the improvement?", learned);
    assert.match(cause.response, /UNKNOWN/);
    assert.match(cause.response, /will not emit CONFIRMED/);
    assert.equal(
      cause.nextEntranceSession?.learningReassessment?.lastCommittedDecision,
      null,
    );
    assert.equal(
      cause.nextEntranceSession?.learningReassessment?.lastMutatedExecution,
      null,
    );
  });

  it("assumption review, routing, memory, overlay, and no forced Goal restart", () => {
    const ready = reachLearningReady();
    const learned = runTurn("What did we learn?", ready);
    const untested = runTurn("What did we not learn?", learned);
    assert.match(untested.response, /NOT_TESTED|UNKNOWN/);
    const route = runTurn("Where should the next cycle start?", untested);
    assert.match(route.response, /REALITY/);
    assert.match(route.response, /not an automatic restart at Goal/);
    assert.equal(
      route.nextEntranceSession?.learningReassessment?.cycle?.reassessmentRoute,
      "REALITY",
    );
    assert.equal(
      routeNextCycle({
        impact: "WORSENING",
        signals: ["GOAL_WORSENING"],
        utterance: "What should we reassess?",
      }).route,
      "ISSUE",
    );
    assert.equal(
      routeNextCycle({
        impact: "MIXED",
        signals: [],
        utterance: "What should we reassess?",
      }).route,
      "SCENARIO",
    );
    assert.equal(
      routeNextCycle({
        impact: "ACHIEVED",
        signals: ["GOAL_ACHIEVED"],
        utterance: "Are we done?",
      }).route,
      "CLOSE",
    );
    const remember = runTurn("What will Nexora remember from this?", route);
    assert.match(remember.response, /Durable Learning|Memory status|provenance/i);
    const catalog = overlayLearningOnEntranceCatalog(
      projectNexoraEntranceCatalog(remember.nextEntranceSession!),
      remember.nextEntranceSession!.learningReassessment,
    );
    assert.equal(
      catalog.objects.filter((entry) => entry.id === NEXORA_LEARNING_OBJECT_ID).length,
      1,
    );
    const clicked = selectNexoraMVPInteractionSubject(
      remember.nextRuntimeState,
      NEXORA_LEARNING_OBJECT_ID,
      catalog,
    );
    assert.equal(clicked.focusedSubject?.id, NEXORA_LEARNING_OBJECT_ID);
    const goal = catalog.objects.find((entry) => entry.id.startsWith("goal-"));
    assert.deepEqual(goal?.position, [0, 0, 0]);
  });

  it("generic proofs share the engine; existing workspace unaffected", () => {
    const src = [
      readFileSync(join(here, "nexoraLearningReassessment.ts"), "utf8"),
      readFileSync(join(here, "nexoraLearningReassessmentResolution.ts"), "utf8"),
    ].join("\n");
    assert.equal(/if\s*\(\s*Capacity/.test(src), false);
    assert.equal(/if\s*\(\s*Delivery/.test(src), false);
    assert.equal(/Project Orion/.test(src), false);
    assert.equal(/if\s*\(\s*Software/.test(src), false);
    assert.equal(/if\s*\(\s*Weekend/.test(src), false);
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
      identity: emptyManagerIdentityContext(),
    });
    assert.equal(
      shouldNexoraLearningReassessmentOwnUtterance(existing, "What did we learn?"),
      false,
    );
  });
});
