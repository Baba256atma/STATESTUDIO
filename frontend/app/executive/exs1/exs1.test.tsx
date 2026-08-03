/**
 * EXS-7 — Executive Monitoring Experience coverage.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Exs1Cockpit } from "./components/Exs1Cockpit.tsx";
import { Exs1Stage } from "./components/Exs1Stage.tsx";
import {
  EXS1_CONNECTIONS,
  EXS1_CONTEXT,
  EXS1_OBJECTS,
  EXS1_PACKS,
} from "./mock/exs1Mock.ts";
import { ExecutiveDecisionProvider } from "./decision/index.ts";
import { ExecutiveExecutionProvider } from "./execution/index.ts";
import {
  INITIAL_EXECUTIVE_HEALTH,
  INITIAL_MONITORING_ALERTS,
  INITIAL_MONITORING_KPIS,
  INITIAL_OBJECT_HEALTH,
  createMonitoringSnapshot,
  toMonitoringJournalEntry,
  toMonitoringTimelinePack,
} from "./monitoring/ExecutiveMonitoringConfig.ts";
import {
  ExecutiveMonitoringExperienceLayer,
  ExecutiveMonitoringProvider,
} from "./monitoring/index.ts";
import { ExecutiveMetadataProvider } from "./metadata/index.ts";
import { ExecutiveModeProvider } from "./mode/ExecutiveModeProvider.tsx";
import { ExecutiveRuntimeProvider } from "./runtime/index.ts";
import {
  ScenarioExperienceLayer,
  ScenarioSelectionManager,
} from "./scenario/index.ts";

function MonitoringHarness() {
  return (
    <ExecutiveRuntimeProvider initialMode="Monitoring" showInspector={false}>
      <ExecutiveModeProvider>
        <ScenarioSelectionManager>
          <ExecutiveDecisionProvider>
            <ExecutiveExecutionProvider>
              <ExecutiveMonitoringProvider>
                <ExecutiveMetadataProvider>
                  <div data-testid="monitoring-harness">
                    <div style={{ position: "relative", width: 900, height: 640 }}>
                      <Exs1Stage
                        objects={EXS1_OBJECTS}
                        connections={EXS1_CONNECTIONS}
                        selectedObjectId={null}
                        onSelectObject={() => {}}
                      />
                      <ScenarioExperienceLayer onCreateRequest={() => {}} />
                      <ExecutiveMonitoringExperienceLayer onOpenNotes={() => {}} />
                    </div>
                  </div>
                </ExecutiveMetadataProvider>
              </ExecutiveMonitoringProvider>
            </ExecutiveExecutionProvider>
          </ExecutiveDecisionProvider>
        </ScenarioSelectionManager>
      </ExecutiveModeProvider>
    </ExecutiveRuntimeProvider>
  );
}

describe("EXS-7 Executive Monitoring Experience", () => {
  it("ships mock KPIs, alerts, and object health states", () => {
    assert.equal(INITIAL_EXECUTIVE_HEALTH, "Warning");
    assert.equal(INITIAL_MONITORING_KPIS.length, 3);
    assert.equal(INITIAL_MONITORING_KPIS[0]?.name, "Revenue");
    assert.equal(INITIAL_MONITORING_KPIS[1]?.name, "Delivery");
    assert.equal(INITIAL_MONITORING_KPIS[2]?.name, "Inventory");
    for (const kpi of INITIAL_MONITORING_KPIS) {
      assert.ok(kpi.expected.length > 0);
      assert.ok(kpi.actual.length > 0);
      assert.ok(kpi.variance.length > 0);
      assert.ok(
        ["Excellent", "Healthy", "Warning", "Critical"].includes(kpi.health),
      );
    }
    assert.ok(INITIAL_MONITORING_ALERTS.length >= 1);
    assert.ok(INITIAL_OBJECT_HEALTH.some((o) => o.health === "Critical"));
  });

  it("maps Create Snapshot helpers to Monitoring Pack and Journal Pack", () => {
    const snapshot = createMonitoringSnapshot({
      executiveHealth: "Warning",
      summary: "Test summary",
      alertCount: 2,
    });
    const pack = toMonitoringTimelinePack(snapshot);
    const journal = toMonitoringJournalEntry(snapshot);
    assert.match(pack.title, /Monitoring/);
    assert.equal(journal.summary, "Test summary");
    assert.match(journal.alerts, /2/);
  });

  it("does not show Monitoring Experience outside Monitoring mode", () => {
    const html = renderToStaticMarkup(React.createElement(Exs1Cockpit));
    assert.match(html, /data-monitoring-active="false"/);
    assert.doesNotMatch(
      html,
      /data-testid="executive-monitoring-experience-layer"/,
    );
    assert.match(html, /data-testid="executive-pack-production-delay"/);
    assert.match(html, /data-testid="executive-timeline-week"/);
    assert.equal(EXS1_PACKS.length, 1);
    assert.equal(EXS1_CONTEXT.pack, "Production Delay");
  });

  it("activates Monitoring Workspace when Mode = Monitoring", () => {
    const html = renderToStaticMarkup(React.createElement(MonitoringHarness));
    assert.match(html, /data-testid="executive-monitoring-experience-layer"/);
    assert.match(html, /data-testid="executive-monitoring-workspace"/);
    assert.match(html, /data-testid="executive-health-card"/);
    assert.match(html, /data-testid="executive-kpi-card-kpi-revenue"/);
    assert.match(html, /data-testid="executive-alert-card-/);
    assert.match(html, /data-testid="executive-monitoring-overlay"/);
    assert.match(html, /data-testid="executive-monitoring-toolbar"/);
    assert.match(html, /data-testid="monitoring-create-snapshot"/);
  });

  it("preserves cockpit foundation and pack identity", () => {
    const html = renderToStaticMarkup(React.createElement(Exs1Cockpit));
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-cockpit-shell"/);
    assert.match(html, /data-testid="executive-mode-selector"/);
    assert.match(html, /data-testid="executive-status-bar"/);
    assert.match(html, /EXS-7/);
    assert.match(html, /Beta/);
    for (const object of EXS1_OBJECTS) {
      assert.match(html, new RegExp(`data-testid="exs1-object-${object.id}"`));
    }
  });
});
