import { test } from "node:test";
import * as assert from "node:assert/strict";

import { buildDomainScenarioOverlayState } from "./domainScenarioOverlays.ts";
import type { DomainScenario } from "./domainScenarioTypes.ts";

const scenarios: DomainScenario[] = [
  {
    id: "s1",
    domainId: "supply_chain",
    title: "Supplier Delay Scenario",
    description: "Delay risk",
    type: "delay",
    confidence: 0.8,
    severity: "high",
    relatedObjectIds: ["supplier", "inventory"],
    affectedObjectIds: ["supplier", "inventory"],
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Delay risk",
    recommendedFocus: "Reduce delay exposure around Supplier.",
  },
  {
    id: "s2",
    domainId: "supply_chain",
    title: "Inventory Bottleneck",
    description: "Bottleneck risk",
    type: "bottleneck",
    confidence: 0.7,
    severity: "medium",
    relatedObjectIds: ["inventory"],
    impacts: [],
    recommendedActions: [],
    executiveSummary: "Bottleneck risk",
  },
];

test("scenario overlay state is renderer-safe metadata", () => {
  const overlay = buildDomainScenarioOverlayState({ scenarios });

  assert.equal(overlay.scenarioSummaries.length, 2);
  assert.deepEqual(overlay.objectHighlights.supplier?.scenarioIds, ["s1"]);
  assert.deepEqual(overlay.objectHighlights.inventory?.scenarioIds, ["s1", "s2"]);
  assert.equal(overlay.objectHighlights.inventory?.highestSeverity, "high");
});

test("scenario overlay state does not mutate input", () => {
  const copy = structuredClone(scenarios);
  buildDomainScenarioOverlayState({ scenarios });

  assert.deepEqual(scenarios, copy);
});
