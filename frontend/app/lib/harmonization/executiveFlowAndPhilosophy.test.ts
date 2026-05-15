import assert from "node:assert/strict";
import test from "node:test";

import {
  listHarmonizedExecutiveCognitionFlow,
  stageForExecutiveSignal,
} from "./executiveCognitionFlow.ts";
import {
  classifyExecutiveFocusPriority,
  listExecutiveFocusHierarchy,
  resolveDominantExecutiveFocus,
} from "./executiveFocusHierarchy.ts";
import {
  listHarmonizedPanelIdentities,
  validatePanelIdentityClarity,
} from "./panelIdentityMap.ts";
import {
  listTypeCOperatingPrinciples,
  validateTypeCOperatingPhilosophy,
} from "./typeCOperatingPhilosophy.ts";

test("executive cognition flow follows Type-C mental order", () => {
  const flow = listHarmonizedExecutiveCognitionFlow();

  assert.deepEqual(flow.map((step) => step.stage), [
    "awareness",
    "interpretation",
    "framing",
    "comparison",
    "readiness",
    "decision",
    "monitoring",
    "review",
  ]);
  assert.equal(stageForExecutiveSignal("comparison"), "comparison");
  assert.equal(stageForExecutiveSignal("drift"), "monitoring");
});

test("executive focus hierarchy prevents attention fragmentation", () => {
  const hierarchy = listExecutiveFocusHierarchy();
  const dominant = resolveDominantExecutiveFocus([
    { id: "memory", sourceType: "memory", severity: "medium", confidence: 0.7 },
    { id: "readiness", sourceType: "readiness", severity: "critical", confidence: 0.9 },
  ]);

  assert.equal(hierarchy[0].focus, "critical_blocker");
  assert.equal(classifyExecutiveFocusPriority("resilience"), "resilience_trend");
  assert.equal(dominant.focus, "critical_blocker");
  assert.equal(dominant.primarySignalId, "readiness");
});

test("panel identity map gives each executive surface a clear role", () => {
  const identities = listHarmonizedPanelIdentities();
  const validation = validatePanelIdentityClarity();

  assert.equal(identities.some((panel) => panel.panelId === "war_room" && panel.primaryQuestion.includes("reason")), true);
  assert.equal(validation.valid, true);
});

test("Type-C operating philosophy validates calm overlay-based principles", () => {
  const principles = listTypeCOperatingPrinciples();
  const validation = validateTypeCOperatingPhilosophy();

  assert.equal(principles.some((principle) => principle.id === "overlay_based_architecture"), true);
  assert.equal(principles.some((principle) => principle.id === "calm_intelligence"), true);
  assert.equal(validation.valid, true);
});
