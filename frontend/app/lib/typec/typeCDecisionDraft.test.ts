import assert from "node:assert/strict";
import test from "node:test";
import { buildTypeCDecisionDraft } from "./typeCDecisionDraft.ts";
import type { TypeCDecisionReadinessSnapshot } from "./typeCDecisionReadiness.ts";

function readiness(
  overrides: Partial<TypeCDecisionReadinessSnapshot> = {}
): TypeCDecisionReadinessSnapshot {
  return {
    id: "readiness_alpha",
    scenarioId: "scenario_alpha",
    level: "ready",
    objectCount: 3,
    loopCount: 2,
    hasSelectedScenario: true,
    hasReadyScenario: true,
    missing: [],
    summary: "Scenario is ready for decision analysis.",
    createdAt: "2026-05-08T00:00:00.000Z",
    ...overrides,
  };
}

test("buildTypeCDecisionDraft returns null for null readiness", () => {
  assert.equal(buildTypeCDecisionDraft({ readiness: null, scene: null }), null);
});

test("buildTypeCDecisionDraft creates hold draft for not_ready readiness", () => {
  const draft = buildTypeCDecisionDraft({
    readiness: readiness({
      level: "not_ready",
      missing: ["selected_scenario", "minimum_objects"],
    }),
    scene: null,
  });

  assert.equal(draft?.posture, "hold");
  assert.equal(draft?.confidence, 0.2);
  assert.equal(draft?.summary, "Decision is blocked until the scenario structure is ready.");
});

test("buildTypeCDecisionDraft creates investigate draft for partial readiness", () => {
  const draft = buildTypeCDecisionDraft({
    readiness: readiness({
      level: "partial",
      missing: ["scenario_ready_status"],
    }),
    scene: null,
  });

  assert.equal(draft?.posture, "investigate");
  assert.equal(draft?.confidence, 0.45);
  assert.equal(draft?.summary, "Scenario needs more structure before recommendation.");
});

test("buildTypeCDecisionDraft creates recommend draft for ready readiness", () => {
  const draft = buildTypeCDecisionDraft({
    readiness: readiness(),
    scene: null,
  });

  assert.equal(draft?.posture, "recommend");
  assert.equal(draft?.confidence, 0.7);
  assert.deepEqual(draft?.nextActions, [
    "Review scenario assumptions",
    "Compare risk impact",
    "Prepare execution plan",
  ]);
});

test("buildTypeCDecisionDraft clamps confidence to safe range", () => {
  const draft = buildTypeCDecisionDraft({
    readiness: readiness(),
    scene: null,
  });

  assert.ok(draft);
  assert.ok(draft.confidence >= 0);
  assert.ok(draft.confidence <= 1);
});

test("buildTypeCDecisionDraft includes missing readiness items for not_ready and partial", () => {
  const notReady = buildTypeCDecisionDraft({
    readiness: readiness({
      level: "not_ready",
      missing: ["selected_scenario"],
    }),
    scene: null,
  });
  const partial = buildTypeCDecisionDraft({
    readiness: readiness({
      level: "partial",
      missing: ["connections"],
    }),
    scene: null,
  });

  assert.ok(notReady?.reasons.includes("Missing readiness item: selected_scenario"));
  assert.ok(partial?.reasons.includes("Missing readiness item: connections"));
});

test("buildTypeCDecisionDraft includes object and loop reasons when ready", () => {
  const draft = buildTypeCDecisionDraft({
    readiness: readiness({
      objectCount: 4,
      loopCount: 1,
    }),
    scene: null,
  });

  assert.ok(draft?.reasons.includes("Scenario contains 4 non-core objects."));
  assert.ok(draft?.reasons.includes("Scenario contains 1 connection."));
});

test("buildTypeCDecisionDraft creates deterministic id for same input", () => {
  const input = readiness();
  const first = buildTypeCDecisionDraft({ readiness: input, scene: null });
  const second = buildTypeCDecisionDraft({ readiness: input, scene: null });

  assert.equal(first?.id, second?.id);
});

test("buildTypeCDecisionDraft does not mutate readiness input", () => {
  const input = readiness({
    missing: ["connections"],
    level: "partial",
  });
  const before = structuredClone(input);

  buildTypeCDecisionDraft({ readiness: input, scene: null });

  assert.deepEqual(input, before);
});
