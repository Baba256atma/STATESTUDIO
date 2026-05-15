import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveAlertRationale,
  buildExecutiveAlertSummary,
  buildExecutiveAlertTitle,
  buildRecommendedAlertAttention,
} from "./executiveAlertNarratives.ts";

test("executive alert narratives are calm and strategic", () => {
  const title = buildExecutiveAlertTitle({ level: "urgent", focus: "Supplier propagation" });
  const summary = buildExecutiveAlertSummary({ level: "urgent", focus: "Supplier propagation" });
  const rationale = buildExecutiveAlertRationale({ level: "urgent", reason: "degrading timeline momentum" });
  const attention = buildRecommendedAlertAttention({ level: "critical", focus: "Supplier propagation" });

  assert.equal(title, "Supplier propagation crossed an executive attention threshold");
  assert.ok(summary.includes("disciplined executive review"));
  assert.ok(rationale.includes("degrading timeline momentum"));
  assert.ok(attention.includes("active executive review"));
});
