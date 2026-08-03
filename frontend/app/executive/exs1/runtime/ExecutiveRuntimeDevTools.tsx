"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getAdvisorInspectorSnapshot,
  subscribeAdvisorInspector,
} from "../advisor/advisorInspectorBridge";
import {
  getIntelligenceInspectorSnapshot,
  subscribeIntelligenceInspector,
} from "../intelligence/intelligenceInspectorBridge";
import {
  getConnectorInspectorSnapshot,
  subscribeConnectorInspector,
} from "../connectors/connectorInspectorBridge";
import {
  getSimulationInspectorSnapshot,
  subscribeSimulationInspector,
} from "../simulation/simulationInspectorBridge";
import { cockpit } from "../shell/executiveCockpitTheme";
import { selectRuntimeInspectorSnapshot } from "./ExecutiveRuntimeSelectors";
import {
  useExecutiveRuntimeState,
  useExecutiveRuntimeStoreApi,
} from "./ExecutiveRuntimeProvider";

/**
 * Runtime Inspector — development-only snapshot of Runtime + Intelligence + Advisor.
 */
export function ExecutiveRuntimeDevTools() {
  const [open, setOpen] = useState(false);
  const store = useExecutiveRuntimeStoreApi();
  const snapshot = useExecutiveRuntimeState(selectRuntimeInspectorSnapshot);
  const events = useExecutiveRuntimeState((s) => s.events.slice(-8));
  const advisor = useSyncExternalStore(
    subscribeAdvisorInspector,
    getAdvisorInspectorSnapshot,
    () => null,
  );
  const intelligence = useSyncExternalStore(
    subscribeIntelligenceInspector,
    getIntelligenceInspectorSnapshot,
    () => null,
  );
  const connectors = useSyncExternalStore(
    subscribeConnectorInspector,
    getConnectorInspectorSnapshot,
    () => null,
  );
  const simulation = useSyncExternalStore(
    subscribeSimulationInspector,
    getSimulationInspectorSnapshot,
    () => null,
  );

  return (
    <div
      data-testid="executive-runtime-devtools"
      style={{
        position: "fixed",
        right: "0.75rem",
        bottom: "0.75rem",
        zIndex: 80,
        fontFamily: "inherit",
      }}
    >
      <button
        type="button"
        data-testid="runtime-inspector-toggle"
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "0.4rem 0.65rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.borderStrong}`,
          background: cockpit.glass,
          color: cockpit.accent,
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Runtime
      </button>
      {open ? (
        <div
          data-testid="runtime-inspector-panel"
          style={{
            marginTop: "0.4rem",
            width: "16.5rem",
            maxHeight: "22rem",
            overflow: "auto",
            padding: "0.65rem 0.75rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.borderStrong}`,
            background: "rgba(10,14,20,0.94)",
            color: cockpit.text,
            boxShadow: cockpit.elevation.raised,
            fontSize: "0.68rem",
            lineHeight: 1.45,
          }}
        >
          <div
            style={{
              marginBottom: "0.45rem",
              color: cockpit.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "0.58rem",
            }}
          >
            Runtime Inspector
          </div>
          {(
            [
              ["Mode", snapshot.mode],
              ["Pack", snapshot.pack],
              ["Timeline", `${snapshot.timeline.lens} @ ${snapshot.timeline.position}`],
              ["Object", snapshot.selectedObjectId ?? "—"],
              ["Scenario", snapshot.scenario ?? "—"],
              ["Decision", snapshot.decision ?? "—"],
              ["Execution", snapshot.execution],
              ["Monitoring", snapshot.monitoringHealth],
              ["Data Source", snapshot.dataSource ?? "—"],
              [
                "Explorer",
                `${snapshot.explorer.nav} · ${snapshot.explorer.width}px · ${
                  snapshot.explorer.visible ? "open" : "closed"
                }`,
              ],
            ] as const
          ).map(([label, value]) => (
            <div key={label} style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: cockpit.lowMuted }}>{label}</span>
              <div style={{ color: cockpit.textSoft }}>{String(value)}</div>
            </div>
          ))}

          <div
            data-testid="runtime-inspector-simulation"
            style={{
              marginTop: "0.55rem",
              paddingTop: "0.45rem",
              borderTop: `1px solid ${cockpit.border}`,
              color: cockpit.accent,
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Simulation
          </div>
          {(
            [
              ["Active Scenario", simulation?.activeScenario ?? "—"],
              ["Status", simulation?.status ?? "—"],
              ["Sessions", String(simulation?.sessionCount ?? 0)],
              ["Overlay", simulation?.overlayActive ? "On" : "Off"],
              ["Risk", simulation?.lastRisk ?? "—"],
              ["Decision Candidate", simulation?.decisionCandidateId ?? "—"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: cockpit.lowMuted }}>{label}</span>
              <div style={{ color: cockpit.textSoft }}>{value}</div>
            </div>
          ))}

          <div
            data-testid="runtime-inspector-connectors"
            style={{
              marginTop: "0.55rem",
              paddingTop: "0.45rem",
              borderTop: `1px solid ${cockpit.border}`,
              color: cockpit.accent,
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Connectors
          </div>
          {(
            [
              ["Connector Status", connectors?.connectorStatus ?? "—"],
              ["Current Session", connectors?.sessionLifecycle ?? "—"],
              ["Published Sources", String(connectors?.publishedSources ?? 0)],
              ["Last Publish", connectors?.lastPublish ?? "—"],
              ["Validation", connectors?.validationResult ?? "—"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: cockpit.lowMuted }}>{label}</span>
              <div style={{ color: cockpit.textSoft }}>{value}</div>
            </div>
          ))}

          <div
            data-testid="runtime-inspector-intelligence"
            style={{
              marginTop: "0.55rem",
              paddingTop: "0.45rem",
              borderTop: `1px solid ${cockpit.border}`,
              color: cockpit.accent,
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Intelligence
          </div>
          {(
            [
              ["Recent Signals", String(intelligence?.recentCount ?? 0)],
              ["Signal Queue", String(intelligence?.queueCount ?? 0)],
              ["Top Signal", intelligence?.topSignal ?? "—"],
              ["Priority", intelligence?.priority ?? "—"],
              ["Recommendation", intelligence?.recommendationType ?? "—"],
              ["Context Workspace", intelligence?.workspace ?? "—"],
              ["Context Pack", intelligence?.packTitle ?? "—"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: cockpit.lowMuted }}>{label}</span>
              <div style={{ color: cockpit.textSoft }}>{value}</div>
            </div>
          ))}

          <div
            data-testid="runtime-inspector-advisor"
            style={{
              marginTop: "0.55rem",
              paddingTop: "0.45rem",
              borderTop: `1px solid ${cockpit.border}`,
              color: cockpit.accent,
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Advisor Context
          </div>
          {(
            [
              ["Conversation Mode", advisor?.conversationMode ?? "—"],
              ["Advisor Mode", advisor?.mode ?? "—"],
              ["Advisor Pack", advisor?.packTitle ?? "—"],
              ["Last Proposal", advisor?.lastProposal ?? "—"],
              ["Pending Proposals", String(advisor?.pendingCount ?? 0)],
              ["Last Advisor Event", advisor?.lastAdvisorEvent ?? "—"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: cockpit.lowMuted }}>{label}</span>
              <div style={{ color: cockpit.textSoft }}>{value}</div>
            </div>
          ))}

          <div
            style={{
              marginTop: "0.55rem",
              paddingTop: "0.45rem",
              borderTop: `1px solid ${cockpit.border}`,
              color: cockpit.lowMuted,
              fontSize: "0.58rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Recent Events · {store.getEventLog().length}
          </div>
          {events.map((event) => (
            <div
              key={event.id}
              data-testid={`runtime-event-${event.type}`}
              style={{ marginTop: "0.2rem", color: cockpit.muted }}
            >
              {event.type}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
