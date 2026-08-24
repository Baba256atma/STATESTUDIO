/**
 * NEX-EXP:6 — Scenario Comparison, Trade-off & Recommendation tests.
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
  applyManagerIdentityUtterance,
  emptyManagerIdentityContext,
} from "./nexoraEntranceIdentity.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  projectNexoraEntranceCatalog,
  shouldNexoraEntranceOwnUtterance,
} from "./nexoraEntranceExperience.ts";
import { NEXORA_EXECUTIVE_GOAL_OBJECT_ID } from "./nexoraGoalDiscoveryTypes.ts";
import {
  getNexoraScenarioComparisonExperienceIdentity,
  NEXORA_SCENARIO_COMPARISON_BOUNDARY,
  overlayComparisonCuesOnEntranceCatalog,
  scenarioComparisonUsesExistingAuthorities,
  shouldNexoraScenarioComparisonOwnUtterance,
  verifyNexoraScenarioComparisonExperience,
} from "./nexoraScenarioComparisonExperience.ts";
import {
  assessComparability,
  projectScenarioComparison,
} from "./nexoraScenarioComparisonResolution.ts";
import { shouldNexoraScenarioDiscoveryOwnUtterance } from "./nexoraScenarioDiscoveryExperience.ts";
import type { ExecutiveScenarioObject } from "./nexoraScenarioDiscoveryTypes.ts";
import { SCENARIO_PRIORITY_TRADEOFF_BOUNDARY } from "../executive-intelligence/scenarioPriorityTradeoffIntelligence.ts";

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

function runTurn(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? readyEntrance();
  const catalog = projectNexoraEntranceCatalog(session);
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
    messageIdSeed: `nex-exp6-${utterance}`,
  });
}

function reachComparableSet() {
  const reality = runTurn(
    "Our backlog is high and capacity is almost full.",
    runTurn(
      "On-time delivery is around 91%. We want 96%.",
      runTurn("We need to improve delivery reliability."),
    ),
  );
  const problem = runTurn("Capacity is our biggest problem.", reality);
  const ready = runTurn("Are we ready to explore scenarios?", problem);
  const weekend = runTurn("We could add weekend capacity.", ready);
  const baseline = runTurn("What if we do nothing?", weekend);
  return runTurn("Compare these scenarios.", baseline);
}

describe("NEX-EXP:6 Scenario Comparison, Trade-off & Recommendation", () => {
  it("identity, boundary, and reused authorities", () => {
    assert.equal(
      getNexoraScenarioComparisonExperienceIdentity().id,
      "NEX-EXP:6/ScenarioComparisonTradeoffRecommendation",
    );
    assert.equal(verifyNexoraScenarioComparisonExperience().ok, true);
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsNexExp7, false);
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsExecution, false);
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.writesDataReality, false);
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.parallelComparisonEngine, false);
    assert.equal(scenarioComparisonUsesExistingAuthorities(), true);
    assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.commitsDecisions, false);
    assert.equal(SCENARIO_PRIORITY_TRADEOFF_BOUNDARY.synthesizesFinalRecommendation, false);
  });

  it("starts only after READY_FOR_SCENARIO_COMPARISON and does not steal EXP:5 close", () => {
    const before = runTurn("We could add weekend capacity.", runTurn(
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
    ));
    assert.equal(
      shouldNexoraScenarioComparisonOwnUtterance(
        before.nextEntranceSession,
        "Compare the scenarios.",
      ),
      false,
    );
    const ready = reachComparableSet();
    assert.equal(
      ready.nextEntranceSession?.scenarioDiscovery?.state,
      "READY_FOR_SCENARIO_COMPARISON",
    );
    assert.equal(
      shouldNexoraScenarioDiscoveryOwnUtterance(
        ready.nextEntranceSession,
        "Compare the scenarios.",
      ),
      false,
    );
    assert.equal(
      shouldNexoraScenarioComparisonOwnUtterance(
        ready.nextEntranceSession,
        "Compare the scenarios.",
      ),
      true,
    );
  });

  it("two valid scenarios compare, trade off, recommend, and do not decide", () => {
    const ready = reachComparableSet();
    const compare = runTurn("Compare the scenarios.", ready);
    assert.match(compare.response, /Scenario A|Scenario B/i);
    assert.equal(
      compare.nextEntranceSession?.scenarioComparison?.comparison?.numericalScore,
      null,
    );
    assert.doesNotMatch(compare.response, /Scenario A = 87/);
    const trade = runTurn("What are the trade-offs?", compare);
    assert.match(trade.response, /gain|sacrifice|exchange/i);
    const rec = runTurn("Which one do you recommend?", trade);
    const status =
      rec.nextEntranceSession?.scenarioComparison?.recommendation
        ?.recommendationStatus;
    assert.ok(
      status === "AVAILABLE" || status === "TIED" || status === "WITHHELD",
    );
    assert.equal(
      rec.nextEntranceSession?.scenarioComparison?.recommendation?.commitsDecision,
      false,
    );
    assert.equal(
      rec.nextEntranceSession?.scenarioComparison?.recommendation?.startsExecution,
      false,
    );
    const why = runTurn("Why?", rec);
    assert.match(why.response, /Goal|recommend|tied|withhold/i);
    const decided = runTurn("Have I decided yet?", why);
    assert.match(decided.response, /No/);
    const prefer = runTurn("I prefer Scenario A.", decided);
    assert.match(prefer.response, /not been approved|not approval/i);
    assert.equal(
      prefer.nextEntranceSession?.scenarioComparison?.lastCommittedDecision,
      null,
    );
    assert.equal(
      prefer.nextEntranceSession?.scenarioComparison?.lastMutatedReality,
      null,
    );
    assert.equal(prefer.shouldCommitRuntime, false);
  });

  it("three scenarios, baseline, unknowns, confidence, and decision routing", () => {
    const two = reachComparableSet();
    const extra = runTurn("What if we outsource part of it?", two);
    const compare = runTurn("Compare the scenarios.", extra);
    assert.ok(
      (compare.nextEntranceSession?.scenarioDiscovery?.scenarios.length ?? 0) >= 3,
    );
    const unknown = runTurn("What don't we know?", compare);
    assert.match(unknown.response, /unknown|do not have|without inventing/i);
    const cost = runTurn("Which one costs less?", unknown);
    assert.match(cost.response, /unknown|will not rank/i);
    const faster = runTurn("Which one is faster?", cost);
    assert.doesNotMatch(faster.response, /exactly 3 days/);
    const risk = runTurn("Which one has more risk?", faster);
    assert.match(risk.response, /not high risk/i);
    const confidence = runTurn("How confident are you?", risk);
    assert.doesNotMatch(confidence.response, /\d+%/);
    assert.equal(
      shouldNexoraScenarioComparisonOwnUtterance(
        confidence.nextEntranceSession,
        "Approve Scenario A.",
      ),
      false,
    );
    const approve = runTurn("Approve Scenario A.", confidence);
    assert.doesNotMatch(approve.response, /Nexora currently recommends/);
    assert.equal(
      approve.nextEntranceSession?.scenarioComparison?.lastCommittedDecision ?? null,
      confidence.nextEntranceSession?.scenarioComparison?.lastCommittedDecision ??
        null,
    );
  });

  it("goal conflict withholds recommendation; priority shift recalculates", () => {
    const ready = reachComparableSet();
    const compare = runTurn("Compare the scenarios.", ready);
    const conflict = runTurn(
      "This path may conflict with another Goal.",
      compare,
    );
    const rec = runTurn("What do you recommend?", conflict);
    assert.match(
      rec.response,
      /cannot recommend confidently|priority|tied|recommend/i,
    );
    const shifted = runTurn(
      "What if cost becomes more important than speed?",
      rec,
    );
    assert.match(shifted.response, /Recalculated|recommend|tied|priority|cost/i);
    assert.equal(
      shifted.nextEntranceSession?.scenarioComparison?.managerPriority,
      "COST",
    );
  });

  it("comparability, invalid exclusion, numeric evidence, and no fake scores", () => {
    const ready = reachComparableSet();
    const scenarios =
      ready.nextEntranceSession?.scenarioDiscovery?.scenarios ?? [];
    const projected = projectScenarioComparison({
      scenarios,
      entrance: ready.nextEntranceSession!,
      managerPriority: "UNKNOWN",
      goalConflictNoted: false,
    });
    assert.equal(projected.comparison.numericalScore, null);
    assert.ok(projected.comparison.dimensions.length >= 1);
    assert.ok(
      projected.comparison.dimensions.every((entry) => entry.source.length > 0),
    );
    const invalid: ExecutiveScenarioObject = Object.freeze({
      ...scenarios[0],
      id: "issue-scenario-invalid",
      letter: "C",
      title: "Invalid path",
      scenarioStatus: "INVALID",
    });
    const withInvalid = projectScenarioComparison({
      scenarios: [...scenarios, invalid],
      entrance: ready.nextEntranceSession!,
      managerPriority: "UNKNOWN",
      goalConflictNoted: false,
    });
    assert.equal(
      withInvalid.comparison.scenarioResults.find(
        (entry) => entry.scenarioId === invalid.id,
      )?.ranked,
      false,
    );
    const constrained: ExecutiveScenarioObject = Object.freeze({
      ...scenarios[0],
      id: "issue-scenario-constrained",
      letter: "D",
      title: "Constrained path",
      scenarioStatus: "CONSTRAINED",
      constraints: ["capital spending cap"],
    });
    const withConstrained = projectScenarioComparison({
      scenarios: [...scenarios, constrained],
      entrance: ready.nextEntranceSession!,
      managerPriority: "UNKNOWN",
      goalConflictNoted: false,
    });
    assert.equal(
      withConstrained.comparison.scenarioResults.find(
        (entry) => entry.scenarioId === constrained.id,
      )?.constrained,
      true,
    );
    const numeric: ExecutiveScenarioObject[] = scenarios.map((entry, index) =>
      Object.freeze({
        ...entry,
        evidence: index === 0 ? ["quoted cost $45k"] : ["quoted cost $80k"],
      }),
    );
    const priced = projectScenarioComparison({
      scenarios: numeric,
      entrance: ready.nextEntranceSession!,
      managerPriority: "UNKNOWN",
      goalConflictNoted: false,
    });
    assert.ok(
      priced.comparison.scenarioResults.some((entry) => entry.numericValues.cost),
    );
    const splitGoals: ExecutiveScenarioObject[] = scenarios.map((entry, index) =>
      Object.freeze({
        ...entry,
        goalId: index === 0 ? "goal-one" : "goal-two",
      }),
    );
    const comparability = assessComparability(splitGoals);
    assert.equal(comparability.comparable, false);
  });

  it("decision handoff is prepared without starting NEX-EXP:7", () => {
    const rec = runTurn(
      "Which one do you recommend?",
      runTurn("Compare the scenarios.", reachComparableSet()),
    );
    const handoff = rec.nextEntranceSession?.scenarioComparison?.handoff;
    assert.ok(handoff);
    assert.equal(handoff?.commitsDecision, false);
    assert.equal(
      rec.nextEntranceSession?.scenarioComparison?.state,
      "READY_FOR_DECISION",
    );
    assert.equal(NEXORA_SCENARIO_COMPARISON_BOUNDARY.startsNexExp7, false);
  });

  it("Stage overlay preserves Goal origin, cue is restrained, and focus is not stolen", () => {
    const rec = runTurn(
      "Which one do you recommend?",
      runTurn("Compare the scenarios.", reachComparableSet()),
    );
    const catalog = overlayComparisonCuesOnEntranceCatalog(
      projectNexoraEntranceCatalog(rec.nextEntranceSession!),
      rec.nextEntranceSession?.scenarioComparison ?? null,
    );
    const goal = catalog.objects.find(
      (entry) => entry.id === NEXORA_EXECUTIVE_GOAL_OBJECT_ID,
    );
    assert.deepEqual(goal?.position, [0, 0, 0]);
    for (const object of catalog.objects) {
      assert.equal(object.position[2], 0);
    }
    const recommendedId =
      rec.nextEntranceSession?.scenarioComparison?.recommendation
        ?.recommendedScenarioId;
    if (recommendedId) {
      const cue = catalog.objects.find((entry) => entry.id === recommendedId);
      assert.equal(cue?.attention, "important");
    }
    assert.equal(rec.shouldCommitRuntime, false);
  });

  it("existing workspace and default catalog remain unaffected", () => {
    const session = createNexoraEntranceSession({
      workspaceResolution: "existing-workspace",
    });
    const result = executeNexoraConversationalExperience({
      utterance: "Compare the scenarios.",
      executiveSubjects: projectManagerObjectConversationalSubjects(),
      runtimeState: initialState(),
      catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
      previousEntranceSession: session,
      messageIdSeed: "nex-exp6-existing",
    });
    assert.ok(!result.nextEntranceSession?.scenarioComparison);
    assert.equal(
      shouldNexoraEntranceOwnUtterance(session, "Compare the scenarios."),
      false,
    );
  });

  it("generic engine has no hardcoded domain branches", () => {
    const source = [
      readFileSync(join(here, "nexoraScenarioComparisonResolution.ts"), "utf8"),
      readFileSync(join(here, "nexoraScenarioComparisonExperience.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /if \(Capacity/);
    assert.doesNotMatch(source, /if \(Delivery/);
    assert.doesNotMatch(source, /if \(Cash/);
    assert.doesNotMatch(source, /Project Orion/);
    assert.doesNotMatch(source, /if \(Software/);
    assert.doesNotMatch(source, /if \(Weekend/);
  });
});
