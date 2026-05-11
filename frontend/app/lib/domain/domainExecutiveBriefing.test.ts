import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildExecutiveBriefing } from "./domainExecutiveBriefing.ts";
import { explainExecutiveInsight } from "./domainExecutiveExplainability.ts";
import type { DomainExecutiveInsight } from "./domainExecutiveIntelligence.ts";

const insight: DomainExecutiveInsight = {
  id: "insight",
  domainId: "pmo",
  title: "Scenario-ready pressure around timeline",
  summary: "Timeline has visible pressure and a scenario path.",
  posture: "cautious",
  priority: "high",
  confidence: 0.7,
  relatedObjectIds: ["timeline"],
  relatedScenarioIds: ["scenario"],
  relatedSignalIds: ["risk"],
  recommendedActions: ["Reduce milestone scope"],
  explanation: "Timeline pressure is visible.",
};

test("executive briefing is concise and deterministic", () => {
  const first = buildExecutiveBriefing({ insights: [insight] });
  const second = buildExecutiveBriefing({ insights: [insight] });

  assert.equal(second, first);
  assert.ok(first.includes("Recommended action"));
});

test("executive briefing handles empty input", () => {
  const briefing = buildExecutiveBriefing({ insights: [] });

  assert.ok(briefing.includes("No executive intelligence"));
});

test("explainability describes why insight exists", () => {
  const explanation = explainExecutiveInsight({ insight });

  assert.ok(explanation.includes("risk signal"));
  assert.ok(explanation.includes("scenario option"));
});
