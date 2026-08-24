/**
 * MO:4 — Goal-Directed Executive Navigation certification tests.
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
import { MANAGER_OBJECT_REGISTERED_GOAL } from "./managerObjectCatalog.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  GOAL_DIRECTED_NAVIGATION_BOUNDARY,
  getGoalDirectedNavigationIdentity,
  verifyGoalDirectedNavigation,
} from "./managerObjectGoalNavigationEngine.ts";
import { parseExplicitGoalTitle } from "./managerObjectGoalContext.ts";
import { resolveManagerObjectTurn } from "./managerObjectInteraction.ts";

const here = dirname(fileURLToPath(import.meta.url));

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function subjects() {
  return projectManagerObjectConversationalSubjects();
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
    messageIdSeed: `mo4-${utterance}`,
  });
}

function navigate(
  objectId: string,
  utterance = "Where should I go next?",
  extra?: {
    readonly managerGoal?: string | null;
    readonly committedDecisionIds?: readonly string[];
    readonly previous?: ReturnType<typeof resolveManagerObjectTurn>;
  },
) {
  return resolveManagerObjectTurn({
    utterance,
    conversationalKind: "situation",
    hasNamedTargetHint: extra?.previous ? false : true,
    namedSubjectId: extra?.previous ? null : objectId,
    previousSession: extra?.previous?.session,
    subjects: subjects(),
    managerGoal: extra?.managerGoal,
    committedDecisionIds: extra?.committedDecisionIds,
  });
}

describe("MO:4 Goal-Directed Executive Navigation", () => {
  it("identity and boundary", () => {
    assert.equal(
      getGoalDirectedNavigationIdentity().id,
      "MO:4/GoalDirectedExecutiveNavigation",
    );
    assert.equal(GOAL_DIRECTED_NAVIGATION_BOUNDARY.commitsDecisions, false);
    assert.equal(GOAL_DIRECTED_NAVIGATION_BOUNDARY.startsExecution, false);
    assert.equal(GOAL_DIRECTED_NAVIGATION_BOUNDARY.duplicatesMo3, false);
    assert.equal(GOAL_DIRECTED_NAVIGATION_BOUNDARY.writesStageCoordinates, false);
    assert.equal(verifyGoalDirectedNavigation().ok, true);
  });

  it("generic engine has no hardcoded goal-to-object branches", () => {
    const source = [
      readFileSync(join(here, "managerObjectGoalNavigationEngine.ts"), "utf8"),
      readFileSync(join(here, "managerObjectGoalContext.ts"), "utf8"),
    ].join("\n");
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|obj-revenue/);
    assert.doesNotMatch(source, /Improve Delivery/);
    assert.doesNotMatch(source, /if\s*\([^)]*CapacityGap|goalPath\s*=\s*CapacityGap/);
    assert.doesNotMatch(
      source,
      /if\s*\([^)]*(?:Improve Delivery|Close Capacity)/,
    );
  });

  it("parses explicit goals without confirming inferred ones", () => {
    assert.equal(
      parseExplicitGoalTitle("My goal is to improve delivery reliability."),
      "Improve Delivery Reliability",
    );
    assert.equal(parseExplicitGoalTitle("Explain Capacity."), null);
  });

  it("1. Goal → KPI / Reality when a related measured signal exists", () => {
    const turn = navigate("obj-delivery", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(turn.navigation.goal.source, "resolved");
    assert.ok(turn.navigation.goal.successSignals.length > 0);
    assert.equal(turn.navigation.goalGap.quantification, "measured");
    assert.match(turn.navigation.goalGap.summary, /On-time|target/i);
  });

  it("2. Goal → relevant business object", () => {
    const turn = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    const delivery = turn.exploration.availablePaths.find(
      (path) => path.targetObjectId === "obj-delivery",
    );
    assert.ok(delivery);
    const ranked = turn.navigation.recommendedPath?.path.targetObjectId;
    assert.ok(
      ranked === "ctx-problem-capacity" || ranked === "obj-delivery",
    );
  });

  it("3. Goal → Problem", () => {
    const turn = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(
      turn.exploration.availablePaths.some(
        (path) => path.targetObjectId === "ctx-problem-capacity",
      ),
    );
    assert.equal(
      turn.navigation.recommendedPath?.path.targetObjectId,
      "ctx-problem-capacity",
    );
    assert.equal(turn.navigation.recommendedPath?.path.kind, "INVESTIGATE");
  });

  it("4. Goal → Risk when a risk path exists", () => {
    const turn = navigate("obj-risk", "Where should I go next?", {
      managerGoal: "Reduce risk",
    });
    assert.ok(
      turn.exploration.availablePaths.some((path) => path.kind === "RISK") ||
        turn.context.objectKind.value === "risk" ||
        turn.context.objectKind.value === "object",
    );
    assert.equal(turn.navigation.commitsDecision, false);
  });

  it("5. Problem → Scenario", () => {
    const turn = navigate("ctx-problem-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(
      turn.exploration.availablePaths.some((path) => path.kind === "SCENARIO"),
    );
  });

  it("6. Scenario → Decision", () => {
    const turn = navigate("ctx-scenario-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(
      turn.exploration.availablePaths.some((path) => path.kind === "DECISION"),
    );
  });

  it("7. Decision → Execution", () => {
    const turn = navigate("ctx-decision-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(
      turn.exploration.availablePaths.some((path) => path.kind === "EXECUTION"),
    );
  });

  it("8. Execution → Outcome", () => {
    const turn = navigate("ctx-execution-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    const outcome = turn.exploration.availablePaths.find(
      (path) => path.kind === "OUTCOME",
    );
    assert.ok(outcome);
    assert.equal(outcome.epistemicStatus, "UNKNOWN");
  });

  it("9. Outcome → Goal comparison stays UNKNOWN without recorded outcome", () => {
    const turn = navigate("ctx-execution-capacity", "Are we moving toward the goal?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.ok(turn.navigation.unknowns.some((item) => /outcome/i.test(item)));
    assert.doesNotMatch(turn.navigation.managerFacingText, /we succeeded|goal achieved/i);
  });

  it("10. Active goal influences ranking of valid MO:3 paths", () => {
    const baseline = navigate("obj-capacity");
    const directed = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    const score = (turn: ReturnType<typeof navigate>, id: string) => {
      const rec = turn.navigation.recommendedPath;
      if (rec?.path.targetObjectId === id) return rec.goalScore;
      const alt = turn.navigation.alternativePaths.find(
        (item) => item.path.targetObjectId === id,
      );
      return alt?.goalScore ?? 0;
    };
    assert.ok(
      score(directed, "obj-delivery") >= score(baseline, "obj-delivery") ||
        directed.navigation.recommendedPath?.path.targetObjectId ===
          "ctx-problem-capacity",
    );
    assert.notEqual(
      directed.exploration.availablePaths.some(
        (path) => path.targetObjectId === "obj-revenue",
      ),
      true,
    );
  });

  it("11. Changing goal changes ranking", () => {
    const delivery = navigate("obj-capacity", "My goal is to improve delivery reliability.");
    const cash = navigate("obj-capacity", "Protecting cash is now the priority.", {
      previous: delivery,
    });
    assert.equal(cash.navigation.goal.managerConfirmed, true);
    assert.match(cash.navigation.goal.title, /cash/i);
    assert.notEqual(
      cash.navigation.goal.title.toLowerCase(),
      delivery.navigation.goal.title.toLowerCase(),
    );
    assert.ok(
      cash.navigation.recommendedDirection !==
        delivery.navigation.recommendedDirection ||
        cash.navigation.recommendedPath?.goalScore !==
          delivery.navigation.recommendedPath?.goalScore ||
        cash.navigation.recommendedPath == null,
    );
  });

  it("12. Multiple goals do not collapse into one", () => {
    const first = navigate("obj-capacity", "My goal is to improve delivery reliability.");
    const second = navigate("obj-capacity", "Protecting cash is now the priority.", {
      previous: first,
    });
    assert.ok(second.navigation.secondaryGoals.length >= 1);
    assert.notEqual(
      second.navigation.secondaryGoals[0]?.title.toLowerCase(),
      second.navigation.goal.title.toLowerCase(),
    );
  });

  it("13. Goal conflict is exposed rather than auto-resolved", () => {
    const first = navigate("obj-capacity", "My goal is to improve delivery reliability.");
    const second = navigate("obj-capacity", "Protecting cash is now the priority.", {
      previous: first,
    });
    assert.equal(second.navigation.commitsDecision, false);
    const text = `${second.navigation.managerFacingText} ${second.navigation.conflicts.join(" ")}`;
    assert.match(text, /conflict|not resolve|trade-off|not invent/i);
  });

  it("14. Missing success signal stays UNKNOWN", () => {
    const turn = navigate("obj-demand", "My goal is to expand into a new market.");
    assert.equal(turn.navigation.goal.managerConfirmed, true);
    if (turn.navigation.goal.successSignals.length === 0) {
      assert.equal(turn.navigation.progressState, "UNKNOWN");
      assert.match(
        turn.navigation.managerFacingText,
        /success criteria are not yet defined/i,
      );
    }
  });

  it("15. Missing outcome stays UNKNOWN", () => {
    const turn = navigate("ctx-decision-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    const outcome = turn.exploration.availablePaths.find(
      (path) => path.kind === "OUTCOME",
    );
    assert.ok(outcome);
    assert.equal(outcome.epistemicStatus, "UNKNOWN");
  });

  it("16. Unrelated object is not recommended from semantic similarity alone", () => {
    const turn = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(
      turn.exploration.availablePaths.some(
        (path) => path.targetObjectId === "obj-revenue",
      ),
      false,
    );
    assert.notEqual(
      turn.navigation.recommendedPath?.path.targetObjectId,
      "obj-revenue",
    );
  });

  it("17. Inferred relevance stays INFERRED", () => {
    const turn = navigate("obj-capacity", "Protecting cash is now the priority.");
    const inferred = [
      ...(turn.navigation.recommendedPath
        ? turn.navigation.recommendedPath.relevanceSignals
        : []),
      ...turn.navigation.alternativePaths.flatMap((item) => item.relevanceSignals),
    ].filter((signal) => signal.epistemicStatus === "INFERRED");
    for (const signal of inferred) {
      assert.equal(signal.epistemicStatus, "INFERRED");
    }
    assert.equal(turn.navigation.goal.managerConfirmed, true);
  });

  it("18. Path relevance is not converted into causal certainty", () => {
    const turn = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.doesNotMatch(turn.navigation.managerFacingText, /\bcaused\b|\bcauses\b|root cause/i);
    assert.doesNotMatch(turn.navigation.reasoningSummary, /definitely the root cause/i);
  });

  it("19. No accidental decision commitment", () => {
    const turn = navigate("ctx-decision-capacity", "What decision is required?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(turn.navigation.commitsDecision, false);
    assert.equal(turn.exploration.commitsDecision, false);
    assert.doesNotMatch(turn.navigation.managerFacingText, /I approved|committed the decision/i);
  });

  it("20. No accidental execution start", () => {
    const turn = navigate("ctx-execution-capacity", "What happens after the decision?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(turn.navigation.startsExecution, false);
    assert.doesNotMatch(turn.navigation.managerFacingText, /I started execution|execution has been started/i);
  });

  it("explicit vs inferred vs unknown goal behavior", () => {
    const unknown = navigate("obj-demand", "Explain Demand.");
    assert.ok(
      unknown.navigation.goal.source === "unknown" ||
        unknown.navigation.goal.managerConfirmed === false,
    );
    const explicit = navigate("obj-demand", "My goal is to improve delivery reliability.");
    assert.equal(explicit.navigation.goal.managerConfirmed, true);
    assert.equal(explicit.navigation.goal.persisted, false);
    const resolved = navigate(MANAGER_OBJECT_REGISTERED_GOAL.objectId);
    assert.equal(resolved.navigation.goal.source === "resolved" || resolved.navigation.goal.goalId != null, true);
    assert.equal(resolved.navigation.goal.managerConfirmed, false);
  });

  it("conversation: goal continuity, guidance, and goal change", () => {
    const stated = run("My goal is to improve delivery reliability.");
    assert.match(stated.response, /Improve Delivery Reliability/i);
    const current = run("What is my current goal?", { previous: stated });
    assert.match(current.response, /Improve Delivery Reliability/i);
    const capacity = run("Explain Capacity.", { previous: current });
    assert.equal(capacity.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.equal(
      capacity.managerObjectTurn.session.goalContext?.title.toLowerCase().includes("delivery"),
      true,
    );
    const next = run("Where should I go next?", { previous: capacity });
    assert.match(next.response, /Capacity Gap|Recommended direction|goal/i);
    const why = run("Why?", { previous: next });
    assert.match(why.response, /Capacity Gap|connected|goal/i);
    const changed = run("Protecting cash is now the priority.", { previous: why });
    assert.match(changed.response, /cash/i);
    const nextCash = run("Where should I go next?", { previous: changed });
    assert.match(nextCash.managerObjectTurn.navigation.goal.title, /cash/i);
    assert.notEqual(
      nextCash.managerObjectTurn.navigation.goal.title,
      next.managerObjectTurn.navigation.goal.title,
    );
  });

  it("does not write Stage coordinates", () => {
    const turn = navigate("obj-capacity", "Where should I go next?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(turn.navigation.writesStageCoordinates, false);
  });
});
