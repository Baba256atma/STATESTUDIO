import assert from "node:assert/strict";
import test from "node:test";

import {
  createCustomGoal,
  createSuggestedGoal,
  getGoalSuggestionsForDomain,
  getWorkspaceGoals,
  getWorkspaceGoalVersionSnapshot,
  resetWorkspaceGoalsForTests,
  saveWorkspaceGoals,
} from "./workspaceGoalContract.ts";

test("provides domain-aware goal suggestions", () => {
  const manufacturingGoals = getGoalSuggestionsForDomain("manufacturing");
  const financeGoals = getGoalSuggestionsForDomain("finance");

  assert.equal(manufacturingGoals[0]?.goalName, "Reduce Cost");
  assert.equal(financeGoals[0]?.goalName, "Improve Cash Flow");
});

test("creates suggested and custom goals with workspace ownership", () => {
  const suggestion = getGoalSuggestionsForDomain("project_management")[0];
  assert.ok(suggestion);

  const suggested = createSuggestedGoal({
    workspaceId: "workspace_a",
    suggestion,
    selectedAt: "2026-06-20T00:00:00.000Z",
  });
  const custom = createCustomGoal({
    workspaceId: "workspace_a",
    goalName: "Improve customer trust",
    selectedAt: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(suggested.workspaceId, "workspace_a");
  assert.equal(suggested.source, "Suggested");
  assert.equal(custom.goalId, "custom_improve_customer_trust");
  assert.equal(custom.source, "Custom");
});

test("saves multiple goals by workspace", () => {
  resetWorkspaceGoalsForTests();
  const suggestions = getGoalSuggestionsForDomain("manufacturing");
  const first = suggestions[0];
  const second = suggestions[1];
  assert.ok(first);
  assert.ok(second);

  saveWorkspaceGoals({
    workspaceId: "workspace_a",
    goals: [
      createSuggestedGoal({ workspaceId: "workspace_a", suggestion: first }),
      createSuggestedGoal({ workspaceId: "workspace_a", suggestion: second }),
    ],
  });

  assert.equal(getWorkspaceGoals("workspace_a").length, 2);
  assert.deepEqual(
    getWorkspaceGoals("workspace_a").map((goal) => goal.goalName),
    ["Reduce Cost", "Improve Throughput"]
  );
});

test("preserves separate goals across workspaces", () => {
  resetWorkspaceGoalsForTests();
  const financeGoal = getGoalSuggestionsForDomain("finance")[0];
  const operationsGoal = getGoalSuggestionsForDomain("operations")[0];
  assert.ok(financeGoal);
  assert.ok(operationsGoal);

  saveWorkspaceGoals({
    workspaceId: "workspace_a",
    goals: [createSuggestedGoal({ workspaceId: "workspace_a", suggestion: financeGoal })],
  });
  saveWorkspaceGoals({
    workspaceId: "workspace_b",
    goals: [createSuggestedGoal({ workspaceId: "workspace_b", suggestion: operationsGoal })],
  });

  assert.equal(getWorkspaceGoals("workspace_a")[0]?.goalName, "Improve Cash Flow");
  assert.equal(getWorkspaceGoals("workspace_b")[0]?.goalName, "Improve Efficiency");
});

test("increments goal store version when saved", () => {
  resetWorkspaceGoalsForTests();
  const before = getWorkspaceGoalVersionSnapshot();
  const technologyGoal = getGoalSuggestionsForDomain("technology")[0];
  assert.ok(technologyGoal);

  saveWorkspaceGoals({
    workspaceId: "workspace_a",
    goals: [createSuggestedGoal({ workspaceId: "workspace_a", suggestion: technologyGoal })],
  });

  assert.equal(getWorkspaceGoalVersionSnapshot(), before + 1);
});

