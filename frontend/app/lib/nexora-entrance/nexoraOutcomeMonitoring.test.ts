/**
 * NEX-EXP:9 — Outcome Monitoring & Goal Impact tests.
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
  deriveNexoraMVPStageInteractionPresentation,
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
  NEXORA_OUTCOME_OBJECT_ID,
  NEXORA_OUTCOME_MONITORING_BOUNDARY,
  getNexoraOutcomeMonitoringIdentity,
  outcomeMonitoringUsesExistingAuthorities,
  overlayOutcomeOnEntranceCatalog,
  shouldNexoraOutcomeMonitoringOwnUtterance,
  verifyNexoraOutcomeMonitoring,
} from "./nexoraOutcomeMonitoring.ts";
import {
  compareNumericExpectedObserved,
  unitsComparable,
} from "./nexoraOutcomeMonitoringResolution.ts";

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
  opts?: { readonly skipExecutionRuntime?: boolean },
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
    executionRuntime: opts?.skipExecutionRuntime ? null : execution,
    messageIdSeed: `nex-exp9-${utterance}`,
  });
  return { ...result, __decision: decision, __execution: execution };
}

function reachMonitoring() {
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
  const plan = runTurn("What's the execution plan?", committed);
  const go = runTurn("Let's start it.", plan);
  return runTurn("Confirm.", go);
}

describe("NEX-EXP:9 Outcome Monitoring & Goal Impact", () => {
  it("identity, boundary, and reused authorities", () => {
    assert.equal(
      getNexoraOutcomeMonitoringIdentity().id,
      "NEX-EXP:9/OutcomeMonitoringGoalImpactExperience",
    );
    assert.equal(verifyNexoraOutcomeMonitoring().ok, true);
    assert.equal(NEXORA_OUTCOME_MONITORING_BOUNDARY.startsNexExp10, false);
    assert.equal(NEXORA_OUTCOME_MONITORING_BOUNDARY.infersCausality, false);
    assert.equal(NEXORA_OUTCOME_MONITORING_BOUNDARY.executionCompleteMeansGoalAchieved, false);
    assert.equal(outcomeMonitoringUsesExistingAuthorities(), true);
  });

  it("starts only from READY_FOR_OUTCOME_MONITORING", () => {
    const before = runTurn("We need to improve delivery reliability.");
    assert.equal(
      shouldNexoraOutcomeMonitoringOwnUtterance(
        before.nextEntranceSession,
        "What is the outcome?",
      ),
      false,
    );
    const ready = reachMonitoring();
    assert.equal(
      ready.nextEntranceSession?.executionPlanning?.state,
      "READY_FOR_OUTCOME_MONITORING",
    );
    assert.ok(ready.nextEntranceSession?.executionPlanning?.handoff);
    assert.equal(
      shouldNexoraOutcomeMonitoringOwnUtterance(
        ready.nextEntranceSession,
        "What is the outcome?",
      ),
      true,
    );
  });

  it("no observation stays UNKNOWN and does not invent success", () => {
    const ready = reachMonitoring();
    const next = runTurn("What is the outcome?", ready);
    assert.match(next.response, /does not yet have enough outcome evidence/i);
    assert.match(next.response, /PREDICTED/);
    assert.doesNotMatch(next.response, /Delivery is improving/);
    assert.equal(
      next.nextEntranceSession?.outcomeMonitoring?.context?.goalImpact.state,
      "UNKNOWN",
    );
    const catalog = projectNexoraEntranceCatalog(next.nextEntranceSession!);
    assert.equal(
      catalog.objects.some((entry) => entry.id === NEXORA_OUTCOME_OBJECT_ID),
      false,
    );
  });

  it("manager-reported observation stays manager-reported and expected stays PREDICTED", () => {
    const ready = reachMonitoring();
    const next = runTurn("Delivery seems better now.", ready);
    assert.match(next.response, /manager-reported/i);
    assert.match(next.response, /PREDICTED/);
    const observed = next.nextEntranceSession?.outcomeMonitoring?.observations.at(-1);
    assert.equal(observed?.source, "manager-reported");
    assert.equal(observed?.epistemicStatus, "UNKNOWN");
  });

  it("numeric Goal gap, improving, not achieved, and causality unconfirmed", () => {
    const ready = reachMonitoring();
    const next = runTurn("On-time delivery is now 94%.", ready);
    const impact = next.nextEntranceSession?.outcomeMonitoring?.context?.goalImpact;
    assert.equal(impact?.state, "IMPROVING");
    assert.equal(impact?.gapBefore, 5);
    assert.equal(impact?.gapNow, 2);
    assert.equal(impact?.attribution, "NOT_CONFIRMED");
    const work = runTurn("Did it work?", next);
    assert.match(work.response, /target has not yet been reached/i);
    const cause = runTurn("Did the execution cause this?", work);
    assert.match(cause.response, /cannot confirm/i);
    const achieve = runTurn("Did we achieve the Goal?", cause);
    assert.match(achieve.response, /not achieved/i);
    const catalog = overlayOutcomeOnEntranceCatalog(
      projectNexoraEntranceCatalog(achieve.nextEntranceSession!),
      achieve.nextEntranceSession!.outcomeMonitoring,
    );
    assert.equal(
      catalog.objects.filter((entry) => entry.id === NEXORA_OUTCOME_OBJECT_ID).length,
      1,
    );
    const clicked = selectNexoraMVPInteractionSubject(
      achieve.nextRuntimeState,
      NEXORA_OUTCOME_OBJECT_ID,
      catalog,
    );
    assert.equal(clicked.focusedSubject?.id, NEXORA_OUTCOME_OBJECT_ID);
    const overlayObject = catalog.objects.find(
      (entry) => entry.id === NEXORA_OUTCOME_OBJECT_ID,
    );
    assert.equal(overlayObject?.position[2], 0);
    const presentation = deriveNexoraMVPStageInteractionPresentation(
      clicked,
      catalog,
    );
    assert.equal(presentation.focusedSubjectId, NEXORA_OUTCOME_OBJECT_ID);
  });

  it("numeric comparison, qualitative comparison, and unit safety", () => {
    const numeric = compareNumericExpectedObserved(20, 12, "%");
    assert.equal(numeric.comparisonStatus, "WORSE_THAN_EXPECTED");
    assert.equal(numeric.variance, -8);
    const ready = reachMonitoring();
    const qualitative = runTurn("Delivery seems better now.", ready);
    assert.match(qualitative.response, /PREDICTED|manager-reported/i);
    assert.equal(unitsComparable("%", "orders"), false);
    const units = runTurn("Can we compare 91% to 120 orders?", qualitative);
    assert.match(units.response, /not comparable/i);
  });

  it("stale evidence, mixed signals, worsening, and achievement criteria", () => {
    const ready = reachMonitoring();
    const stale = runTurn("That figure is old. Delivery is back down to 92%.", ready);
    assert.match(stale.response, /stale|UNKNOWN|manager-reported/i);
    const mixed = runTurn(
      "Cost worsened.",
      runTurn("Delivery seems better now.", ready),
    );
    assert.equal(
      mixed.nextEntranceSession?.outcomeMonitoring?.context?.goalImpact.state,
      "MIXED",
    );
    const worse = runTurn("On-time delivery is now 88%.", reachMonitoring());
    assert.equal(
      worse.nextEntranceSession?.outcomeMonitoring?.context?.goalImpact.state,
      "WORSENING",
    );
    const achieved = runTurn("On-time delivery is now 96%.", reachMonitoring());
    assert.equal(
      achieved.nextEntranceSession?.outcomeMonitoring?.context?.goalImpact.state,
      "ACHIEVED",
    );
    assert.equal(
      achieved.nextEntranceSession?.executionPlanning?.canonicalStatus,
      "in-progress",
    );
  });

  it("execution complete is not Goal success; learning is not created", () => {
    const ready = reachMonitoring();
    const done = runTurn("Execution is done. Did we succeed?", ready);
    assert.match(done.response, /does not mean the Goal is achieved/i);
    assert.equal(done.nextEntranceSession?.outcomeMonitoring?.lastCreatedLearning, null);
    const next = runTurn("What happens next?", done);
    assert.doesNotMatch(next.response, /Learning captured|we learned that/i);
    const stop = runTurn("Should we stop?", next);
    assert.match(stop.response, /does not cancel/i);
  });

  it("generic proofs share the engine and avoid domain hardcoding", () => {
    const ready = reachMonitoring();
    const cash = runTurn("Recovered cash increased.", ready);
    assert.match(cash.response, /PREDICTED|Observed|manager-reported/i);
    const src = [
      readFileSync(join(here, "nexoraOutcomeMonitoring.ts"), "utf8"),
      readFileSync(join(here, "nexoraOutcomeMonitoringResolution.ts"), "utf8"),
    ].join("\n");
    assert.equal(/if\s*\(\s*Capacity/.test(src), false);
    assert.equal(/if\s*\(\s*Delivery/.test(src), false);
    assert.equal(/Project Orion/.test(src), false);
    assert.equal(/if\s*\(\s*Software/.test(src), false);
    assert.equal(/if\s*\(\s*Weekend/.test(src), false);
  });

  it("existing workspace and default catalog stay unaffected", () => {
    const existing = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
      identity: emptyManagerIdentityContext(),
    });
    assert.equal(
      shouldNexoraOutcomeMonitoringOwnUtterance(existing, "What is the outcome?"),
      false,
    );
  });
});
