/**
 * Phase E — Beta Preparation & Hardening coverage.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "../components/Exs1Cockpit.tsx";
import {
  OFFICIAL_BETA_SCENARIOS,
  OFFICIAL_DEMO_DATASETS,
  BETA_READINESS_CHECKLIST,
  createAuditConsole,
  createDemoManager,
  createExecutiveError,
  createRecoveryCenter,
  mergeFeatureFlags,
  readinessSummary,
  runExecutiveBetaValidator,
  runExecutiveBetaValidatorWithConnectors,
} from "./index.ts";
import { ExecutiveBetaProvider } from "./ExecutiveBetaProvider.tsx";
import { ExecutiveBetaSettings } from "./ExecutiveBetaSettings.tsx";

const HERE = dirname(fileURLToPath(import.meta.url));

describe("Phase E Beta Preparation & Hardening", () => {
  it("ships ten official Beta Scenarios and five demo datasets", () => {
    assert.equal(OFFICIAL_BETA_SCENARIOS.length, 10);
    assert.ok(OFFICIAL_BETA_SCENARIOS.some((s) => s.id === "connect-csv"));
    assert.ok(OFFICIAL_BETA_SCENARIOS.some((s) => s.id === "simulation"));
    assert.equal(OFFICIAL_DEMO_DATASETS.length, 5);
    assert.ok(OFFICIAL_DEMO_DATASETS.some((d) => d.id === "manufacturing"));
  });

  it("marks readiness checklist Beta Ready", () => {
    const summary = readinessSummary(BETA_READINESS_CHECKLIST);
    assert.equal(summary.total, 12);
    assert.equal(summary.betaReady, true);
  });

  it("standardizes executive error recovery actions", () => {
    const error = createExecutiveError("SimulationFailed");
    assert.ok(error.recovery.includes("Retry"));
    assert.ok(error.recovery.includes("Continue Later"));
    const recovery = createRecoveryCenter();
    const record = recovery.report("ConnectorFailed", "demo");
    recovery.act(record.id, "Retry");
    assert.equal(recovery.list()[0]?.status, "Resolved");
  });

  it("loads demo datasets in one click", () => {
    const demos = createDemoManager();
    const retail = demos.loadRetailDemo();
    assert.equal(retail.dataset.id, "retail");
    assert.ok(retail.advisory.some((line) => /Retail/i.test(line)));
    const reset = demos.resetDemo();
    assert.equal(reset.dataset.id, "manufacturing");
  });

  it("records minimum audit trail events", () => {
    const audit = createAuditConsole();
    const events = audit.seedMinimumTrail();
    const kinds = new Set(events.map((e) => e.kind));
    assert.ok(kinds.has("Connector Published"));
    assert.ok(kinds.has("Simulation Executed"));
    assert.ok(kinds.has("Decision Approved"));
    assert.ok(kinds.has("Execution Started"));
    assert.ok(kinds.has("Monitoring Snapshot"));
  });

  it("passes end-to-end beta validator including CSV publish", async () => {
    const report = await runExecutiveBetaValidatorWithConnectors();
    assert.equal(report.scenarioCount, 10);
    assert.ok(report.checks.every((c) => c.ok), JSON.stringify(report.checks));
    assert.equal(report.betaReady, true);
    const sync = runExecutiveBetaValidator();
    assert.ok(sync.checks.some((c) => c.id === "simulation-isolated" && c.ok));
  });

  it("merges feature flags without component branching", () => {
    const flags = mergeFeatureFlags({ EnableSimulation: false });
    assert.equal(flags.EnableSimulation, false);
    assert.equal(flags.EnableConnectors, true);
  });

  it("renders Beta Settings surfaces", () => {
    const html = renderToStaticMarkup(
      <ExecutiveBetaProvider>
        <ExecutiveBetaSettings />
      </ExecutiveBetaProvider>,
    );
    assert.match(html, /data-testid="executive-beta-settings"/);
    assert.match(html, /data-testid="executive-feature-flags"/);
    assert.match(html, /data-testid="executive-demo-manager"/);
    assert.match(html, /data-testid="executive-beta-validator"/);
    assert.match(html, /data-testid="executive-recovery-center"/);
    assert.match(html, /data-testid="executive-audit-console"/);
    assert.match(html, /data-testid="beta-scenario-first-login"/);
  });

  it("exposes Settings nav and Beta version on cockpit", () => {
    const html = renderToStaticMarkup(<Exs1Cockpit />);
    assert.match(html, /data-testid="executive-nav-settings"/);
    assert.match(html, /data-testid="exs1-object-inventory"/);
    assert.match(html, /EXS-7 · Beta/);
  });

  it("ships beta documentation pack", () => {
    const docs = [
      "ExecutiveQuickStart.md",
      "ExecutiveArchitectureOverview.md",
      "ExecutiveRuntimeOverview.md",
      "ExecutiveMetadataGuide.md",
      "ExecutiveSimulationGuide.md",
      "ExecutiveConnectorGuide.md",
      "BetaUserGuide.md",
      "ExecutiveReleaseNotes.md",
      "ExecutiveKnownLimitations.md",
    ];
    for (const name of docs) {
      const text = readFileSync(join(HERE, "docs", name), "utf8");
      assert.ok(text.length > 80, name);
    }
  });
});
