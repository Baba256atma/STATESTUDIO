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
import { ExecutiveModeProvider } from "./mode/ExecutiveModeProvider.tsx";
import {
  ScenarioExperienceLayer,
  ScenarioSelectionManager,
} from "./scenario/index.ts";

function MonitoringHarness() {
  return (
    <ExecutiveModeProvider initialMode="Monitoring">
      <ScenarioSelectionManager>
        <ExecutiveDecisionProvider>
          <ExecutiveExecutionProvider>
            <ExecutiveMonitoringProvider>
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
            </ExecutiveMonitoringProvider>
          </ExecutiveExecutionProvider>
        </ExecutiveDecisionProvider>
      </ScenarioSelectionManager>
    </ExecutiveModeProvider>
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
    assert.ok(INITIAL_MONITORING_ALERTS.some((a) => a.severity === "Critical"));
    assert.ok(INITIAL_MONITORING_ALERTS.some((a) => a.severity === "Warning"));
    assert.ok(INITIAL_OBJECT_HEALTH.some((o) => o.needsAttention));
    assert.equal(EXS1_CONTEXT.pack, "Production Delay");
  });

  it("maps Create Snapshot helpers to Monitoring Pack and Journal Pack", () => {
    const snapshot = createMonitoringSnapshot({
      executiveHealth: "Warning",
      summary: "Mock snapshot",
      alertCount: 2,
    });
    const pack = toMonitoringTimelinePack(snapshot);
    const journal = toMonitoringJournalEntry(snapshot);
    assert.match(pack.title, /Monitoring/);
    assert.equal(pack.snapshotId, snapshot.id);
    assert.equal(journal.executiveHealth, "Warning");
    assert.match(journal.summary, /Mock snapshot/);
    assert.ok(journal.alerts.length > 0);
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
  });

  it("activates Monitoring Workspace when Mode = Monitoring", () => {
    const html = renderToStaticMarkup(React.createElement(MonitoringHarness));
    assert.match(html, /data-testid="executive-monitoring-experience-layer"/);
    assert.match(html, /data-testid="executive-monitoring-workspace"/);
    assert.match(html, /Monitoring Workspace/);
    assert.match(html, /data-testid="executive-health-card"/);
    assert.match(html, /data-testid="executive-monitoring-overlay"/);
    assert.match(html, /data-testid="executive-monitoring-toolbar"/);
    assert.match(html, /data-testid="monitoring-create-snapshot"/);
    assert.match(html, /data-testid="executive-monitoring-filter-bar"/);
    assert.match(html, /data-testid="executive-kpi-card-kpi-revenue"/);
    assert.match(html, /data-testid="executive-alert-card-alert-inventory-target"/);
    assert.match(html, /data-testid="monitoring-object-ring-inventory"/);
    assert.match(html, /data-monitoring="Warning"/);
  });

  it("preserves cockpit foundation and pack identity", () => {
    const html = renderToStaticMarkup(React.createElement(Exs1Cockpit));
    assert.match(html, /data-testid="exs1-cockpit"/);
    assert.match(html, /data-testid="executive-cockpit-shell"/);
    assert.match(html, /data-testid="executive-mode-selector"/);
    assert.match(html, /data-testid="executive-status-bar"/);
    assert.match(html, /EXS-7/);
    assert.match(html, /S3/);
    assert.match(html, /Production Delay/);
    for (const object of EXS1_OBJECTS) {
      assert.match(html, new RegExp(`data-testid="exs1-object-${object.id}"`));
    }
  });
});
