/**
 * MO:5 — Executive Journey & Progress Intelligence certification tests.
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
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY,
  getExecutiveJourneyIntelligenceIdentity,
  verifyExecutiveJourneyIntelligence,
} from "./managerObjectJourneyEngine.ts";
import { resolveManagerObjectTurn } from "./managerObjectInteraction.ts";
import type { ExecutiveJourneyRuntimeFacts } from "./managerObjectJourneyEngine.ts";

const here = dirname(fileURLToPath(import.meta.url));

function subjects() {
  return projectManagerObjectConversationalSubjects();
}

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `mo5-${utterance}`,
  });
}

function journey(
  objectId: string,
  utterance = "Where are we?",
  extra?: {
    readonly managerGoal?: string | null;
    readonly previous?: ReturnType<typeof resolveManagerObjectTurn>;
    readonly facts?: ExecutiveJourneyRuntimeFacts;
    readonly named?: boolean;
  },
) {
  return resolveManagerObjectTurn({
    utterance,
    conversationalKind: "situation",
    hasNamedTargetHint: extra?.named === false ? false : extra?.previous == null,
    namedSubjectId: extra?.previous && extra?.named !== true ? null : objectId,
    previousSession: extra?.previous?.session,
    subjects: subjects(),
    managerGoal: extra?.managerGoal,
    committedDecisionIds: extra?.facts?.committedDecisionIds,
    journeyFacts: extra?.facts,
  });
}

describe("MO:5 Executive Journey & Progress Intelligence", () => {
  it("identity and boundary", () => {
    assert.equal(
      getExecutiveJourneyIntelligenceIdentity().id,
      "MO:5/ExecutiveJourneyProgressIntelligence",
    );
    assert.equal(EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.workflowEngine, false);
    assert.equal(EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.treatsVisitedAsResolved, false);
    assert.equal(EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.closesGoals, false);
    assert.equal(verifyExecutiveJourneyIntelligence().ok, true);
  });

  it("30. generic engine has no object-specific journey hardcoding", () => {
    const source = readFileSync(join(here, "managerObjectJourneyEngine.ts"), "utf8");
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|ctx-scenario-capacity|ctx-decision-capacity/);
    assert.doesNotMatch(source, /if\s*\([^)]*Capacity|if\s*\([^)]*ScenarioB|if\s*\([^)]*ExpandCapacity/);
  });

  it("1-2. Goal confirmed begins a journey; missing goal is MISSING_GOAL", () => {
    const missing = journey("obj-demand", "Where are we?");
    assert.ok(
      missing.journey.blocker?.kind === "MISSING_GOAL" ||
        missing.journey.journeyState === "UNKNOWN",
    );
    const begun = journey("obj-demand", "My goal is to improve delivery reliability.");
    assert.equal(begun.journey.activeGoal.managerConfirmed, true);
    assert.notEqual(begun.journey.journeyState, "UNKNOWN");
  });

  it("3. Reality known is recognized", () => {
    const turn = journey("obj-delivery", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(turn.journey.progressSignals.some((signal) => signal.id === "reality" && signal.value === "KNOWN"));
  });

  it("4-6. Problem / risk / scenario phases", () => {
    const problem = journey("obj-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(["ISSUE", "SCENARIO", "DECISION"].includes(problem.journey.currentPhase));
    assert.ok(problem.journey.activeProblems.length > 0);
    const risk = journey("obj-risk", "Where are we?", {
      managerGoal: "Reduce risk",
    });
    assert.equal(
      risk.journey.resolvedItems.some((item) => /Issue identified: Risk$/.test(item.label)),
      false,
    );
    const scenario = journey("ctx-problem-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(scenario.journey.availableScenarios.length > 0);
    assert.equal(scenario.journey.journeyState, "AWAITING_DECISION");
  });

  it("7-8. Viewed scenario/decision is not resolved or committed", () => {
    const viewed = journey("ctx-scenario-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(
      viewed.journey.resolvedItems.some((item) => item.id === "scenarios"),
      false,
    );
    const decision = journey("ctx-decision-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.notEqual(decision.journey.decisionState, "committed");
    assert.equal(decision.journey.commitsDecision, false);
  });

  it("9-12. Committed decision, execution states, blocked execution", () => {
    const committed = journey("ctx-decision-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: { committedDecisionIds: ["ctx-decision-capacity"] },
    });
    assert.equal(committed.journey.decisionState, "committed");
    assert.equal(committed.journey.currentPhase, "EXECUTION");
    const active = journey("ctx-execution-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "ACTIVE" },
      },
    });
    assert.equal(active.journey.executionState, "ACTIVE");
    assert.equal(active.journey.journeyState, "EXECUTING");
    const blocked = journey("ctx-execution-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "BLOCKED" },
      },
    });
    assert.equal(blocked.journey.blocker?.kind, "EXECUTION_BLOCKED");
    assert.equal(blocked.journey.startsExecution, false);
  });

  it("13-16. Completed execution without outcome; observed outcome; no fabricated learning", () => {
    const complete = journey("ctx-execution-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "COMPLETED" },
      },
    });
    assert.equal(complete.journey.blocker?.kind, "OUTCOME_REQUIRED");
    assert.equal(complete.journey.outcomeState, "NOT_OBSERVED");
    const observed = journey("ctx-execution-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "COMPLETED" },
        outcomeStates: { "ctx-execution-capacity": "IMPROVED" },
      },
    });
    assert.equal(observed.journey.outcomeState, "IMPROVED");
    assert.equal(observed.journey.learningState, "NOT_AVAILABLE");
    assert.doesNotMatch(observed.journey.managerFacingText, /we learned that expansion is always correct/i);
    const learned = journey("ctx-execution-capacity", "What did we learn?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        outcomeStates: { "ctx-execution-capacity": "IMPROVED" },
        learningState: "AVAILABLE",
      },
    });
    assert.equal(learned.journey.learningState, "AVAILABLE");
  });

  it("17-19. Visited is not resolved; unrelated click does not advance; back keeps truth", () => {
    const capacity = journey("obj-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    const revenue = journey("obj-revenue", "Where are we?", {
      previous: capacity,
      named: true,
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(revenue.session.visitedSubjectIds?.includes("obj-revenue"));
    assert.equal(
      revenue.journey.semanticProjection.some((label) => /revenue/i.test(label)),
      false,
    );
    const back = journey("obj-capacity", "Where are we?", {
      previous: revenue,
      named: true,
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(back.journey.resolvedItems.some((item) => item.id === "goal"));
    assert.ok((back.session.visitedSubjectIds?.length ?? 0) >= 2);
  });

  it("20-22. Goal change recalculates; history retained; multiple goals stay separate", () => {
    const delivery = journey("obj-capacity", "My goal is to improve delivery reliability.");
    const cash = journey("obj-capacity", "Protecting cash is now the priority.", {
      previous: delivery,
    });
    assert.match(cash.journey.activeGoal.title, /cash/i);
    assert.ok(cash.journey.history.some((snapshot) => /delivery/i.test(snapshot.goalTitle)));
    assert.ok(cash.journey.secondaryGoals.length >= 1);
    assert.notEqual(
      cash.journey.secondaryGoals[0]?.title.toLowerCase(),
      cash.journey.activeGoal.title.toLowerCase(),
    );
  });

  it("23-24. Scenario branches remain alternatives; revisited decision supported", () => {
    const scenario = journey("ctx-problem-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(scenario.journey.scenarioBranches.length >= 1);
    const revisited = journey("ctx-decision-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        outcomeStates: { "ctx-decision-capacity": "DEGRADED" },
      },
    });
    assert.equal(revisited.journey.reevaluation, "REVISIT_DECISION");
    assert.equal(revisited.journey.closesGoal, false);
  });

  it("25-29. Blocker is not a business cause; no fake percent; no commit/start/close", () => {
    const turn = journey("obj-capacity", "Where are we?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(turn.journey.blocker?.isBusinessCause, false);
    assert.match(turn.journey.blockerText, /not a confirmed business cause|does not mean the blocker caused/i);
    assert.doesNotMatch(turn.journey.managerFacingText, /\d+%\s+complete/i);
    assert.equal(turn.journey.commitsDecision, false);
    assert.equal(turn.journey.startsExecution, false);
    assert.equal(turn.journey.closesGoal, false);
  });

  it("conversation: where we are, remains, blocker, next, fit, continuity", () => {
    const stated = run("My goal is to improve delivery reliability.");
    const capacity = run("Explain Capacity.", { previous: stated });
    assert.equal(capacity.managerObjectTurn.activeObjectId, "obj-capacity");
    const where = run("Where are we?", { previous: capacity });
    assert.equal(where.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.match(where.response, /Goal:|Where we are/i);
    const done = run("What have we done so far?", { previous: where });
    assert.match(done.response, /Goal|done so far/i);
    const open = run("What is still unresolved?", { previous: done });
    assert.match(open.response, /unresolved|Decision/i);
    const block = run("What is blocking us?", { previous: open });
    assert.match(block.response, /blocker|DECISION/i);
    const next = run("What should happen next?", { previous: block });
    assert.match(next.response, /decision|milestone|path/i);
    const fit = run("Where does Capacity fit in the journey?", { previous: next });
    assert.match(fit.response, /Capacity|phase|journey/i);
    assert.equal(fit.managerObjectTurn.activeObjectId, "obj-capacity");
  });
});
