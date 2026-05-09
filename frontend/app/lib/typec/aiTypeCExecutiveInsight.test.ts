import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTypeCAIExecutiveInsight,
  buildTypeCAIExecutiveInsightInput,
  isTypeCEnhanceDisabled,
} from "./aiTypeCExecutiveInsight.ts";
import type { TypeCExecutiveSummary } from "./typeCExecutiveSummary.ts";

function summary(overrides: Partial<TypeCExecutiveSummary> = {}): TypeCExecutiveSummary {
  return {
    headline: "System fragility increasing around Supplier",
    recommendation: "Stabilize Supplier before scaling",
    confidence: { label: "High", value: 84 },
    why: ["Delay propagation detected", "High dependency concentration"],
    nextActions: ["Analyze Supplier risk", "Run scenario simulation"],
    riskNotes: ["Small delays may cascade", "System sensitive to input variance"],
    ...overrides,
  };
}

test("buildTypeCAIExecutiveInsightInput preserves valid deterministic summary and context", () => {
  const deterministicSummary = summary();
  const input = buildTypeCAIExecutiveInsightInput({
    deterministicSummary,
    sceneContext: {
      objectCount: 3,
      selectedObjectLabel: "Supplier",
      focusedObjectLabel: "Inventory",
    },
  });

  assert.equal(input.deterministicSummary, deterministicSummary);
  assert.deepEqual(input.sceneContext, {
    objectCount: 3,
    selectedObjectLabel: "Supplier",
    focusedObjectLabel: "Inventory",
  });
});

test("buildTypeCAIExecutiveInsight returns safe fallback for weak deterministic summary", () => {
  const insight = buildTypeCAIExecutiveInsight({
    deterministicSummary: summary({
      headline: "No executive insight available",
      recommendation: "Add objects or run analysis to generate insights",
      confidence: { label: "Low", value: 10 },
      why: [],
      nextActions: [],
      riskNotes: [],
    }),
  });

  assert.equal(insight.headline, "Executive insight unavailable");
  assert.equal(insight.source, "ai_enhanced");
});

test("buildTypeCAIExecutiveInsight does not invent missing selected object", () => {
  const insight = buildTypeCAIExecutiveInsight({
    deterministicSummary: summary({
      headline: "System stable with localized risks",
      recommendation: "Proceed with current strategy",
      confidence: { label: "Medium", value: 52 },
    }),
    sceneContext: {
      objectCount: 2,
    },
  });

  assert.match(insight.executiveBrief, /across 2 objects/);
  assert.doesNotMatch(insight.executiveBrief, /Supplier|Inventory|Delivery/);
});

test("buildTypeCAIExecutiveInsight clamps output length", () => {
  const insight = buildTypeCAIExecutiveInsight({
    deterministicSummary: summary({
      headline: "System fragility increasing around ".repeat(20),
      recommendation: "Stabilize the operational path before scaling. ".repeat(20),
      riskNotes: ["Small delays may cascade through the system and create wider uncertainty. ".repeat(20)],
      nextActions: ["Analyze supplier risk with a bounded executive review loop before committing. ".repeat(20)],
    }),
    sceneContext: {
      objectCount: 4,
      selectedObjectLabel: "Supplier",
    },
  });

  assert.ok(insight.headline.length <= 96);
  assert.ok(insight.executiveBrief.length <= 180);
  assert.ok(insight.strategicRisk.length <= 140);
  assert.ok(insight.recommendedMove.length <= 140);
  assert.ok(insight.confidenceNote.length <= 120);
});

test("buildTypeCAIExecutiveInsight source is always ai_enhanced", () => {
  const insight = buildTypeCAIExecutiveInsight({
    deterministicSummary: summary(),
  });

  assert.equal(insight.source, "ai_enhanced");
});

test("isTypeCEnhanceDisabled disables fallback summary", () => {
  assert.equal(
    isTypeCEnhanceDisabled(
      summary({
        headline: "No executive insight available",
        recommendation: "Add objects or run analysis to generate insights",
        confidence: { label: "Low", value: 10 },
        why: [],
      })
    ),
    true
  );
});

test("isTypeCEnhanceDisabled disables summary without why signals", () => {
  assert.equal(isTypeCEnhanceDisabled(summary({ why: [] })), true);
});

test("isTypeCEnhanceDisabled allows meaningful summary with enhancer", () => {
  assert.equal(isTypeCEnhanceDisabled(summary(), true), false);
});

test("isTypeCEnhanceDisabled disables when enhancer callback is missing", () => {
  assert.equal(isTypeCEnhanceDisabled(summary(), false), true);
});

test("isTypeCEnhanceDisabled disables low confidence when no object is selected", () => {
  assert.equal(
    isTypeCEnhanceDisabled(
      summary({
        confidence: { label: "Low", value: 32 },
      }),
      true,
      false
    ),
    true
  );
});
