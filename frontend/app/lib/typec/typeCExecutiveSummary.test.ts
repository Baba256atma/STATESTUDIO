import assert from "node:assert/strict";
import test from "node:test";
import { buildTypeCExecutiveSummary } from "./typeCExecutiveSummary.ts";
import type { TypeCDecisionDraft } from "./typeCDecisionDraft.ts";

function draft(overrides: Partial<TypeCDecisionDraft> = {}): TypeCDecisionDraft {
  return {
    id: "draft_alpha",
    scenarioId: "scenario_alpha",
    posture: "recommend",
    confidence: 0.7,
    summary: "Scenario is structurally ready for decision drafting.",
    reasons: ["Scenario contains 3 non-core objects."],
    nextActions: ["Review scenario assumptions"],
    basedOnReadinessId: "readiness_alpha",
    createdAt: "2026-05-08T00:00:00.000Z",
    ...overrides,
  };
}

test("buildTypeCExecutiveSummary returns null for null draft", () => {
  assert.equal(buildTypeCExecutiveSummary({ draft: null }), null);
});

test("buildTypeCExecutiveSummary creates not-ready headline for hold draft", () => {
  const summary = buildTypeCExecutiveSummary({
    draft: draft({
      posture: "hold",
      confidence: 0.2,
    }),
  });

  assert.equal(summary?.headline, "Decision is not ready yet");
  assert.equal(summary?.recommendation, "Hold decision until the scenario has enough structure.");
});

test("buildTypeCExecutiveSummary creates investigation headline for investigate draft", () => {
  const summary = buildTypeCExecutiveSummary({
    draft: draft({
      posture: "investigate",
      confidence: 0.45,
    }),
  });

  assert.equal(summary?.headline, "More investigation needed");
  assert.equal(summary?.recommendation, "Investigate missing scenario structure before committing.");
});

test("buildTypeCExecutiveSummary creates executive review headline for recommend draft", () => {
  const summary = buildTypeCExecutiveSummary({
    draft: draft({
      posture: "recommend",
      confidence: 0.7,
    }),
  });

  assert.equal(summary?.headline, "Scenario is ready for executive review");
  assert.equal(summary?.recommendation, "Proceed to structured review before execution.");
});

test("buildTypeCExecutiveSummary labels confidence low medium and high", () => {
  assert.equal(buildTypeCExecutiveSummary({ draft: draft({ confidence: 0.2 }) })?.confidence.label, "Low");
  assert.equal(buildTypeCExecutiveSummary({ draft: draft({ confidence: 0.45 }) })?.confidence.label, "Medium");
  assert.equal(buildTypeCExecutiveSummary({ draft: draft({ confidence: 0.7 }) })?.confidence.label, "High");
});

test("buildTypeCExecutiveSummary copies draft reasons into why", () => {
  const summary = buildTypeCExecutiveSummary({
    draft: draft({
      reasons: ["Missing readiness item: connections"],
    }),
  });

  assert.deepEqual(summary?.why, ["Missing readiness item: connections"]);
});

test("buildTypeCExecutiveSummary copies draft nextActions", () => {
  const summary = buildTypeCExecutiveSummary({
    draft: draft({
      nextActions: ["Compare risk impact", "Prepare execution plan"],
    }),
  });

  assert.deepEqual(summary?.nextActions, ["Compare risk impact", "Prepare execution plan"]);
});

test("buildTypeCExecutiveSummary creates deterministic id", () => {
  const input = draft();
  const first = buildTypeCExecutiveSummary({ draft: input });
  const second = buildTypeCExecutiveSummary({ draft: input });

  assert.equal(first?.id, second?.id);
});

test("buildTypeCExecutiveSummary does not mutate draft input", () => {
  const input = draft({
    reasons: ["Reason A"],
    nextActions: ["Action A"],
  });
  const before = structuredClone(input);

  buildTypeCExecutiveSummary({ draft: input });

  assert.deepEqual(input, before);
});
