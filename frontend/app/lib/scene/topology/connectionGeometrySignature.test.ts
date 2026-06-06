import assert from "node:assert/strict";
import test from "node:test";

import {
  buildTopologyConnectionGeometrySignature,
  buildOverlayFlowGeometrySignature,
} from "./connectionGeometrySignature.ts";
import {
  resetConnectionGeometryRuntimeForTests,
  resolveStableTopologyLineGeometries,
} from "./connectionGeometryRuntime.ts";
import { resetConnectionRuntimeStabilityAuditForTests } from "../../diagnostics/connectionRuntimeStabilityAudit.ts";

test("buildTopologyConnectionGeometrySignature is stable for identical lines", () => {
  const lines = [
    {
      id: "a__to__b",
      sourceId: "a",
      targetId: "b",
      sourcePosition: { x: 1, y: 2, z: 3 },
      targetPosition: { x: 4, y: 5, z: 6 },
      valid: true,
    },
  ];
  const first = buildTopologyConnectionGeometrySignature(lines);
  const second = buildTopologyConnectionGeometrySignature([...lines]);
  assert.equal(first, second);
});

test("resolveStableTopologyLineGeometries reuses geometry when signature unchanged", () => {
  resetConnectionRuntimeStabilityAuditForTests();
  resetConnectionGeometryRuntimeForTests();
  const lines = [
    {
      id: "a__to__b",
      sourceId: "a",
      targetId: "b",
      sourcePosition: { x: 1, y: 2, z: 3 },
      targetPosition: { x: 4, y: 5, z: 6 },
      valid: true,
    },
  ];
  const signature = buildTopologyConnectionGeometrySignature(lines);
  const first = resolveStableTopologyLineGeometries({
    lines,
    signature,
    reason: "test-first",
  });
  const second = resolveStableTopologyLineGeometries({
    lines,
    signature,
    selectedObjectId: "b",
    reason: "test-selection",
  });
  assert.equal(first.get("a__to__b"), second.get("a__to__b"));
});

test("buildOverlayFlowGeometrySignature ignores object array identity", () => {
  const first = buildOverlayFlowGeometrySignature({
    edges: [{ from: "a", to: "b" }],
    objectIds: ["a", "b"],
    yOffset: 0.08,
  });
  const second = buildOverlayFlowGeometrySignature({
    edges: [{ from: "a", to: "b" }],
    objectIds: ["b", "a"],
    yOffset: 0.08,
  });
  assert.equal(first, second);
});
