import assert from "node:assert/strict";
import test from "node:test";
import { buildD2ArchitectureReadinessReport } from "./d2ArchitectureReadiness.ts";

test("D2 architecture readiness report summarizes connector readiness", () => {
  const report = buildD2ArchitectureReadinessReport();

  assert.equal(report.readyForD3, true);
  assert.equal(report.connectorReadiness, "ready");
  assert.ok(report.layerCount >= 18);
  assert.ok(report.stabilizedSystems.includes("adaptation"));
  assert.ok(report.unresolvedOverlap.some((item) => item.includes("confidence vs readiness")));
});
