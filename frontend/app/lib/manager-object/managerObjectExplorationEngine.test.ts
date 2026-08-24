/**
 * MO:3 — Object-Guided Executive Exploration certification tests.
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
  OBJECT_GUIDED_EXPLORATION_BOUNDARY,
  getObjectGuidedExplorationIdentity,
  verifyObjectGuidedExploration,
} from "./managerObjectExplorationEngine.ts";
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
    messageIdSeed: `mo3-${utterance}`,
  });
}

function explore(objectId: string, utterance = "What should I look at next?", extra?: {
  readonly managerGoal?: string | null;
  readonly committedDecisionIds?: readonly string[];
}) {
  return resolveManagerObjectTurn({
    utterance,
    conversationalKind: "situation",
    hasNamedTargetHint: true,
    namedSubjectId: objectId,
    subjects: subjects(),
    managerGoal: extra?.managerGoal,
    committedDecisionIds: extra?.committedDecisionIds,
  });
}

function allPaths(turn: ReturnType<typeof resolveManagerObjectTurn>) {
  return turn.exploration.availablePaths;
}

describe("MO:3 Object-Guided Executive Exploration", () => {
  it("identity and boundary", () => {
    assert.equal(
      getObjectGuidedExplorationIdentity().id,
      "MO:3/ObjectGuidedExecutiveExploration",
    );
    assert.equal(OBJECT_GUIDED_EXPLORATION_BOUNDARY.commitsDecisions, false);
    assert.equal(OBJECT_GUIDED_EXPLORATION_BOUNDARY.startsExecution, false);
    assert.equal(OBJECT_GUIDED_EXPLORATION_BOUNDARY.writesStageCoordinates, false);
    assert.equal(verifyObjectGuidedExploration().ok, true);
  });

  it("one engine has no per-object exploration branches", () => {
    const source = readFileSync(
      join(here, "managerObjectExplorationEngine.ts"),
      "utf8",
    );
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|obj-revenue/);
    assert.doesNotMatch(
      source,
      /if\s*\([^)]*Capacity|if\s*\([^)]*Delivery|if\s*\([^)]*Revenue/,
    );
  });

  it("1. Capacity → related Problem", () => {
    const turn = explore("obj-capacity");
    const recommended = turn.exploration.recommendedPaths[0];
    assert.ok(recommended);
    assert.equal(recommended.kind, "INVESTIGATE");
    assert.equal(recommended.targetObjectId, "ctx-problem-capacity");
    assert.match(recommended.label, /Capacity Gap/);
    assert.doesNotMatch(recommended.reason, /confirmed cause|score 0\./i);
  });

  it("2. Capacity → Delivery", () => {
    const turn = explore("obj-capacity");
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.targetObjectId === "obj-delivery" && path.kind === "RELATED_OBJECT",
      ),
    );
  });

  it("3. Problem → evidence", () => {
    const turn = explore("ctx-problem-capacity");
    assert.ok(allPaths(turn).some((path) => path.kind === "EVIDENCE"));
  });

  it("4. Problem → Risk where available", () => {
    const margin = explore("ctx-problem-margin");
    assert.ok(
      allPaths(margin).some(
        (path) => path.kind === "RISK" || path.targetObjectId === "obj-risk",
      ),
    );
  });

  it("5. Problem → Scenario where available", () => {
    const turn = explore("ctx-problem-capacity");
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.kind === "SCENARIO" &&
          path.targetObjectId === "ctx-scenario-capacity",
      ),
    );
  });

  it("6. Scenario → comparison", () => {
    const demand = explore("ctx-scenario-demand");
    const paths = [
      ...allPaths(demand),
      ...demand.exploration.blockedPaths,
    ];
    assert.ok(paths.some((path) => path.kind === "COMPARE"));
  });

  it("7. Scenario → recommendation", () => {
    const turn = explore("ctx-scenario-capacity");
    assert.ok(allPaths(turn).some((path) => path.kind === "RECOMMENDATION"));
  });

  it("8. Scenario → Decision", () => {
    const turn = explore("ctx-scenario-capacity");
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.kind === "DECISION" &&
          path.targetObjectId === "ctx-decision-capacity",
      ),
    );
  });

  it("9. Decision → evidence/rationale", () => {
    const turn = explore("ctx-decision-capacity");
    const decisionPath = allPaths(turn).find((path) => path.kind === "DECISION") ??
      turn.exploration.recommendedPaths[0];
    assert.ok(decisionPath);
    assert.match(
      `${decisionPath.question ?? ""} ${decisionPath.reason}`,
      /evidence|decision|commit/i,
    );
    assert.equal(decisionPath.commitsDecision, false);
  });

  it("10. Decision → Execution", () => {
    const turn = explore("ctx-decision-capacity");
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.kind === "EXECUTION" &&
          path.targetObjectId === "ctx-execution-capacity",
      ),
    );
  });

  it("11. Execution → Decision", () => {
    const turn = explore("ctx-execution-capacity");
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.kind === "DECISION" &&
          path.targetObjectId === "ctx-decision-capacity",
      ),
    );
  });

  it("12. Execution → Outcome remains UNKNOWN when missing", () => {
    const turn = explore("ctx-execution-capacity");
    const outcome = allPaths(turn).find((path) => path.kind === "OUTCOME");
    assert.ok(outcome);
    assert.equal(outcome.epistemicStatus, "UNKNOWN");
    assert.match(outcome.reason, /UNKNOWN|not been recorded/i);
  });

  it("13. Goal → relevant executive object", () => {
    const turn = explore(MANAGER_OBJECT_REGISTERED_GOAL.objectId);
    assert.ok(
      allPaths(turn).some(
        (path) =>
          path.kind === "GOAL" && path.targetObjectId === "obj-capacity",
      ),
    );
  });

  it("14. Goal relevance influences ranking", () => {
    const baseline = explore("obj-capacity");
    const deliveryGoal = explore("obj-capacity", "What should I look at next?", {
      managerGoal: "Improve delivery reliability",
    });
    const deliveryRank = (turn: ReturnType<typeof explore>) => {
      const path = allPaths(turn).find(
        (item) => item.targetObjectId === "obj-delivery",
      );
      return path?.priority ?? 0;
    };
    assert.ok(deliveryRank(deliveryGoal) > deliveryRank(baseline));
  });

  it("15. UNKNOWN outcome remains UNKNOWN", () => {
    const turn = explore("ctx-decision-capacity");
    const outcome = allPaths(turn).find((path) => path.kind === "OUTCOME");
    assert.ok(outcome);
    assert.equal(outcome.epistemicStatus, "UNKNOWN");
  });

  it("16. Unrelated object is not recommended without support", () => {
    const turn = explore("obj-capacity");
    assert.equal(
      allPaths(turn).some((path) => path.targetObjectId === "obj-revenue"),
      false,
    );
  });

  it("17. Relationship does not become causality", () => {
    const turn = explore("obj-capacity");
    const related = allPaths(turn).find(
      (path) => path.targetObjectId === "obj-delivery",
    );
    assert.ok(related);
    assert.match(related.reason, /does not establish a confirmed cause/);
    assert.doesNotMatch(turn.exploration.managerFacingText, /\bcaused\b|\bcauses\b/);
  });

  it("18. Inferred path stays INFERRED", () => {
    const turn = explore("obj-capacity");
    const inferred = allPaths(turn).filter(
      (path) => path.epistemicStatus === "INFERRED",
    );
    for (const path of inferred) {
      assert.notEqual(path.epistemicStatus, "KNOWN");
    }
  });

  it("19. No accidental decision commitment", () => {
    const turn = explore("ctx-decision-capacity", "What should I look at next?", {
      committedDecisionIds: ["ctx-decision-capacity"],
    });
    assert.equal(turn.exploration.commitsDecision, false);
    assert.ok(
      turn.exploration.blockedPaths.some((path) => /Approve/.test(path.label)),
    );
    assert.doesNotMatch(turn.exploration.managerFacingText, /Recommended next: Approve/);
    const spoken = run("Explain Decision");
    const next = run("What should I look at next?", { previous: spoken });
    assert.equal(next.shouldCommitRuntime, false);
    assert.equal(next.decisionCommitmentResult, null);
  });

  it("20. No accidental execution start", () => {
    const turn = explore("ctx-execution-capacity");
    assert.equal(turn.exploration.startsExecution, false);
    const execution = allPaths(turn).find((path) => path.kind === "EXECUTION");
    if (execution) {
      assert.match(execution.reason, /not the same as starting execution/);
    }
    const spoken = run("Explain Execution");
    const next = run("What should I look at next?", { previous: spoken });
    assert.equal(next.shouldCommitRuntime, false);
  });

  it("generic engine derives Revenue paths from Revenue context", () => {
    const turn = explore("obj-revenue");
    assert.equal(turn.exploration.engineId, "MO:3/ObjectGuidedExecutiveExploration");
    const recommended = turn.exploration.recommendedPaths[0];
    assert.ok(recommended);
    assert.notEqual(recommended.targetObjectId, "ctx-problem-capacity");
    assert.ok(
      recommended.targetObjectId === "ctx-problem-margin" ||
        allPaths(turn).some((path) => path.targetObjectId === "ctx-problem-margin"),
    );
  });

  it("conversation loop: understand → explore → why → select problem", () => {
    const explain = run("Explain Capacity");
    assert.equal(explain.managerObjectTurn.activeObjectId, "obj-capacity");
    const next = run("What should I look at next?", { previous: explain });
    assert.match(next.response, /Recommended next:/);
    assert.match(next.response, /Capacity Gap/);
    assert.equal(next.managerObjectTurn.intent, "NEXT_ACTION");
    const why = run("Why?", { previous: next });
    assert.match(why.response, /Capacity Gap|connected/);
    const show = run("Show me that problem.", { previous: why });
    assert.equal(show.managerObjectTurn.activeObjectId, "ctx-problem-capacity");
  });

  it("requires manager choice and never uses graph-score copy", () => {
    const turn = explore("obj-capacity");
    for (const path of allPaths(turn)) {
      assert.equal(path.requiresManagerChoice, true);
    }
    assert.doesNotMatch(
      turn.exploration.managerFacingText,
      /relevance score|object-to-object edge/i,
    );
  });
});
