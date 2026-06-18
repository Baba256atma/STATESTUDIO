import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_INTELLIGENCE_COMPLETE_TAG,
  INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  INT2_CERTIFICATION_FREEZE_TAGS,
  INT2_CERTIFIED_TAG,
  INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG,
} from "./dashboardIntelligenceCertificationContract.ts";
import { runDashboardIntelligenceCertification } from "./dashboardIntelligenceCertification.ts";

test("exports INT-2 freeze tags and certification diagnostic", () => {
  assert.equal(INT2_CERTIFIED_TAG, "[INT2_CERTIFIED]");
  assert.equal(DASHBOARD_INTELLIGENCE_COMPLETE_TAG, "[DASHBOARD_INTELLIGENCE_COMPLETE]");
  assert.equal(INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC, "[INT2_CERTIFICATION_COMPLETE]");
  assert.deepEqual(INT2_CERTIFICATION_FREEZE_TAGS, [
    "[INT2_CERTIFIED]",
    "[DASHBOARD_INTELLIGENCE_COMPLETE]",
  ]);
});

test("INT-2 certification passes all gates A through M", () => {
  const result = runDashboardIntelligenceCertification();

  assert.equal(result.tag, INT2_DASHBOARD_INTEGRATION_CERTIFICATION_TAG);
  assert.equal(result.version, "2.6.0");
  assert.equal(result.certified, true);
  assert.equal(result.gates.length, 13);
  assert.equal(
    result.gates.every((entry) => entry.status === "PASS"),
    true
  );
  assert.equal(result.diagnostics.includes(INT2_CERTIFICATION_COMPLETE_DIAGNOSTIC), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.gates), true);
});

test("certification validates INT-2 adapter feeds and guardrails", () => {
  const result = runDashboardIntelligenceCertification();
  const gateNames = result.gates.map((entry) => entry.name);

  assert.equal(gateNames.includes("Dashboard Adapter Works"), true);
  assert.equal(gateNames.includes("Executive Summary Feed Works"), true);
  assert.equal(gateNames.includes("Operational Feed Works"), true);
  assert.equal(gateNames.includes("Risk Feed Works"), true);
  assert.equal(gateNames.includes("Scenario Feed Works"), true);
  assert.equal(gateNames.includes("No Scene Mutations"), true);
  assert.equal(gateNames.includes("No Topology Mutations"), true);
  assert.equal(gateNames.includes("No Routing Changes"), true);
  assert.equal(gateNames.includes("No Object Mutations"), true);
  assert.equal(gateNames.includes("No MRP Mutations"), true);
  assert.equal(gateNames.includes("No Legacy Router Usage"), true);
  assert.equal(gateNames.includes("Build Passes"), true);
  assert.equal(gateNames.includes("Tests Pass"), true);
});
