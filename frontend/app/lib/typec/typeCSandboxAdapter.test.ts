import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTypeCSandboxRequest,
  fallbackTypeCSandboxResult,
  parseTypeCSandboxResult,
  safeTypeCSandboxResult,
} from "./typeCSandboxAdapter.ts";
import type { SceneJson } from "../sceneTypes.ts";

const scene: SceneJson = {
  state_vector: {},
  scene: {
    objects: [
      { id: "nexora_core", label: "Nexora Core" },
      { id: "supplier", label: "Supplier" },
    ],
    loops: [],
  },
};

test("buildTypeCSandboxRequest clones scene snapshot", () => {
  const request = buildTypeCSandboxRequest({ sceneJson: scene });
  assert.ok(request);
  assert.notEqual(request?.sceneSnapshot, scene);
  request!.sceneSnapshot.scene.objects![0]!.label = "Changed";
  assert.equal(scene.scene.objects?.[0]?.label, "Nexora Core");
});

test("buildTypeCSandboxRequest returns null without scene", () => {
  assert.equal(buildTypeCSandboxRequest({ sceneJson: null }), null);
});

test("parseTypeCSandboxResult validates result", () => {
  const parsed = parseTypeCSandboxResult({
    strategies: [
      {
        id: "s1",
        title: "Reduce supplier dependency",
        description: "Create a secondary path.",
        proposedActions: ["Add backup supplier"],
        expectedBenefits: ["Lower cascade exposure"],
        risks: ["Higher short-term cost"],
        confidence: 1.4,
      },
    ],
    bestStrategyId: "s1",
    summary: "Sandbox generated one alternative.",
  });
  assert.equal(parsed.source, "sandbox");
  assert.equal(parsed.bestStrategyId, "s1");
  assert.equal(parsed.strategies[0]?.confidence, 1);
});

test("parseTypeCSandboxResult rejects malformed result", () => {
  assert.throws(() => parseTypeCSandboxResult({ strategies: [] }));
});

test("safeTypeCSandboxResult returns fallback for malformed result", () => {
  const fallback = safeTypeCSandboxResult({ bad: true });
  assert.equal(fallback.summary, fallbackTypeCSandboxResult().summary);
});

test("parseTypeCSandboxResult caps strategies and list sizes", () => {
  const parsed = parseTypeCSandboxResult({
    strategies: Array.from({ length: 8 }, (_, index) => ({
      id: `s${index}`,
      title: "Strategy",
      description: "Description",
      proposedActions: ["a", "b", "c", "d", "e", "f"],
      expectedBenefits: ["benefit"],
      risks: ["risk"],
      confidence: 0.5,
    })),
    summary: "Summary",
  });
  assert.equal(parsed.strategies.length, 4);
  assert.equal(parsed.strategies[0]?.proposedActions.length, 5);
});
