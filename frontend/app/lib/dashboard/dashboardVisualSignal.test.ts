import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_VISUAL_SIGNAL_VERSION,
  CANONICAL_DASHBOARD_VISUAL_OWNER,
} from "./dashboardVisualSignalContract.ts";
import {
  getDashboardSurfaceVisualBundle,
  listDashboardSurfaceVisualPanelTypes,
} from "./dashboardSurfaceVisualRegistry.ts";
import { resolveDashboardSurfaceVisualBundle } from "./dashboardVisualSignalResolver.ts";
import { resetDashboardVisualSignalLoggingForTests } from "./dashboardVisualSignalLogging.ts";
import { initializeDashboardAccordionRuntime, resetDashboardAccordionRuntimeForTests } from "./dashboardAccordionRuntime.ts";
import { resetDashboardAccordionPanelCacheForTests } from "./dashboardAccordionContextPanels.ts";
import { resetDashboardAccordionRegistryForTests } from "./dashboardAccordionRegistry.ts";
import { resetDashboardSurfaceRegistryForTests } from "./dashboardSurfaceRegistry.ts";
import { runArchitectureFreezeValidationPass } from "../architecture/nexoraArchitectureFreezeRuntime.ts";

test.beforeEach(() => {
  resetDashboardVisualSignalLoggingForTests();
  resetDashboardAccordionRuntimeForTests();
  resetDashboardAccordionPanelCacheForTests();
  resetDashboardAccordionRegistryForTests();
  resetDashboardSurfaceRegistryForTests();
});

test("visual signal framework contract is canonical", () => {
  assert.equal(CANONICAL_DASHBOARD_VISUAL_OWNER, "dashboardVisualSignalFramework");
  assert.equal(DASHBOARD_VISUAL_SIGNAL_VERSION, "3.5.0");
});

test("all dashboard surfaces have visual bundles with micro charts and impact cards", () => {
  const panelTypes = listDashboardSurfaceVisualPanelTypes();
  assert.equal(panelTypes.length, 14);

  for (const panelType of panelTypes) {
    const bundle = getDashboardSurfaceVisualBundle(panelType);
    assert.equal(bundle.panelType, panelType);
    assert.ok(bundle.impactCard.headline.length > 0);
    assert.ok(bundle.headerSignals.summaryValue.length > 0);
    assert.ok(bundle.microCharts.length >= 1);
    assert.ok(["low", "moderate", "high", "critical"].includes(bundle.impactCard.impactLevel));
    assert.ok(["improving", "stable", "deteriorating"].includes(bundle.impactCard.direction));
    assert.ok(["low", "moderate", "high"].includes(bundle.impactCard.confidence));
  }
});

test("accordion panels attach visual bundles and header signals", () => {
  const runtime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });

  for (const panel of runtime.panels) {
    assert.ok(panel.visualBundle);
    assert.equal(panel.visualBundle.panelType, panel.panelType);
    assert.ok(panel.visualBundle.headerSignals.impactBadge);
    assert.ok(panel.visualBundle.headerSignals.trendDirection);
    if (panel.panelType === "executive_summary") {
      assert.equal(panel.bodySlot, "executive_delegate");
    } else if (panel.panelType === "operational") {
      assert.equal(panel.bodySlot, "operational_intelligence");
    } else if (panel.panelType === "risk") {
      assert.equal(panel.bodySlot, "risk_intelligence");
    } else if (panel.panelType === "timeline") {
      assert.equal(panel.bodySlot, "timeline_intelligence");
    } else if (panel.panelType === "scenario") {
      assert.equal(panel.bodySlot, "scenario_intelligence");
    } else if (panel.panelType === "war_room") {
      assert.equal(panel.bodySlot, "war_room_intelligence");
    } else if (panel.panelType === "decision") {
      assert.equal(panel.bodySlot, "executive_advisory");
    } else if (panel.panelType === "decision_guidance") {
      assert.equal(panel.bodySlot, "decision_guidance");
    } else if (panel.panelType === "governance") {
      assert.equal(panel.bodySlot, "governance_intelligence");
    } else if (panel.panelType === "strategic_alignment") {
      assert.equal(panel.bodySlot, "strategic_alignment_intelligence");
    } else if (panel.panelType === "policy_constraint") {
      assert.equal(panel.bodySlot, "policy_constraint_intelligence");
    } else if (panel.panelType === "stakeholder_intelligence") {
      assert.equal(panel.bodySlot, "stakeholder_intelligence");
    } else if (panel.panelType === "consensus_intelligence") {
      assert.equal(panel.bodySlot, "consensus_intelligence");
    } else if (panel.panelType === "institutional_alignment") {
      assert.equal(panel.bodySlot, "institutional_alignment");
    } else {
      assert.equal(panel.bodySlot, "visual_signal");
    }
  }
});

test("visual resolver returns surface-specific bundles", () => {
  const operational = resolveDashboardSurfaceVisualBundle({
    panelType: "operational",
    dashboardContext: "sources",
    normalizedContext: null,
  });
  const risk = resolveDashboardSurfaceVisualBundle({
    panelType: "risk",
    dashboardContext: "risk",
    normalizedContext: null,
  });
  assert.notEqual(operational.impactCard.headline, risk.impactCard.headline);
  assert.ok(operational.microCharts.some((chart) => chart.label.includes("Demand")));
  assert.ok(risk.microCharts.some((chart) => chart.label.includes("Risk")));
});

test("architecture freeze includes dashboard visual intelligence contract", () => {
  const validation = runArchitectureFreezeValidationPass({ force: true });
  assert.ok(validation.contractCount >= 28);
  const visualCheck = validation.checks.find((check) => check.id === "dashboard.visual_intelligence");
  assert.ok(visualCheck?.passed);
});
