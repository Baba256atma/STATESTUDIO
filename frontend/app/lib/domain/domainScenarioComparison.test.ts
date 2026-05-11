import { test } from "node:test";
import * as assert from "node:assert/strict";

import { compareDomainScenarios } from "./domainScenarioComparison.ts";
import { scoreDomainScenarios } from "./domainScenarioScoring.ts";
import { deriveScenarioHighlightHints } from "./domainScenarioHighlights.ts";
import type { DomainScenario } from "./domainScenarioTypes.ts";

const scenarios: DomainScenario[] = [
  {
    id: "s1",
    domainId: "security",
    title: "Segment vulnerable assets",
    description: "Contain exposure.",
    type: "containment",
    confidence: 0.82,
    severity: "critical",
    relatedObjectIds: ["asset", "vulnerability"],
    impacts: [{ category: "risk", direction: "decrease", magnitude: 84 }],
    recommendedActions: ["Segment assets"],
    executiveSummary: "Segment vulnerable assets.",
  },
  {
    id: "s2",
    domainId: "security",
    title: "Monitor access path",
    description: "Increase monitoring.",
    type: "optimization",
    confidence: 0.58,
    severity: "medium",
    relatedObjectIds: ["access"],
    impacts: [{ category: "confidence", direction: "increase", magnitude: 42 }],
    recommendedActions: ["Monitor access"],
    executiveSummary: "Monitor access path.",
  },
];

test("scenario comparison generation is stable", () => {
  const scores = scoreDomainScenarios({ scenarios });
  const first = compareDomainScenarios({ scenarios, scores });
  const second = compareDomainScenarios({ scenarios, scores });

  assert.deepEqual(second, first);
  assert.equal(first.length, 1);
});

test("comparison includes key differences and recommendation", () => {
  const comparisons = compareDomainScenarios({ scenarios, scores: scoreDomainScenarios({ scenarios }) });

  assert.ok(comparisons[0]?.comparisonSummary.length);
  assert.equal(comparisons[0]?.keyDifferences.length, 2);
  assert.ok(comparisons[0]?.recommendation?.includes("Prefer"));
});

test("scenario highlight hints are metadata only", () => {
  const hints = deriveScenarioHighlightHints({ scenario: scenarios[0] });

  assert.deepEqual(hints.highlightedObjectIds, ["asset", "vulnerability"]);
});

test("empty comparison is safe", () => {
  const comparisons = compareDomainScenarios({ scenarios: [] });

  assert.deepEqual(comparisons, []);
});
