import test from "node:test";
import assert from "node:assert/strict";

import { suppressExecutiveAlerts } from "./suppressExecutiveAlerts.ts";
import type { ExecutiveAlert } from "./executiveAlertTypes.ts";

const alert: ExecutiveAlert = {
  id: "alert_supplier",
  title: "Supplier pressure requires attention",
  summary: "Supplier pressure is elevated.",
  level: "urgent",
  relatedObjectIds: ["supplier"],
  rationale: "Escalation is based on supplier pressure.",
  confidence: 0.8,
  createdAt: 0,
};

test("suppression dedupes repeated alerts and preserves stronger level", () => {
  const suppressed = suppressExecutiveAlerts({
    alerts: [
      alert,
      { ...alert, id: "alert_supplier_duplicate", level: "attention", confidence: 0.7 },
    ],
  });

  assert.equal(suppressed.length, 1);
  assert.equal(suppressed[0].level, "urgent");
});

test("suppression drops weak informational noise and caps output", () => {
  const suppressed = suppressExecutiveAlerts({
    alerts: [
      { ...alert, id: "info_low", title: "Info low", level: "info", confidence: 0.3, relatedObjectIds: ["a"] },
      { ...alert, id: "critical", title: "Critical", level: "critical", relatedObjectIds: ["b"] },
      { ...alert, id: "urgent", title: "Urgent", level: "urgent", relatedObjectIds: ["c"] },
    ],
    maxAlerts: 1,
  });

  assert.equal(suppressed.length, 1);
  assert.equal(suppressed[0].level, "critical");
});
