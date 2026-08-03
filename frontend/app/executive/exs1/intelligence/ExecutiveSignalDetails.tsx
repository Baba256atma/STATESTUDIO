"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutivePriorityBadge } from "./ExecutivePriorityBadge";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";

export function ExecutiveSignalDetails() {
  const {
    selectedSignal,
    acknowledge,
    resolve,
    archive,
    setLifecycle,
  } = useRuntimeIntelligence();

  if (!selectedSignal) {
    return (
      <div
        data-testid="executive-signal-details-empty"
        style={{ color: cockpit.muted, fontSize: "0.74rem" }}
      >
        Select a signal to inspect executive intelligence.
      </div>
    );
  }

  const signal = selectedSignal;

  return (
    <section
      data-testid="executive-signal-details"
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong style={{ color: cockpit.accent }}>{signal.type}</strong>
        <ExecutivePriorityBadge severity={signal.severity} />
      </div>
      <p style={{ margin: 0, fontSize: "0.78rem", color: cockpit.textSoft }}>
        {signal.summary}
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Source · {signal.sourceEvent}
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Objects · {signal.relatedObjectIds.join(", ") || "—"}
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Domains · {signal.domainNames.join(", ") || "—"}
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Timeline · {signal.relatedTimeline} (reference only)
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Suggested · {signal.suggestedWorkspace} · {signal.suggestedAction}
      </p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: cockpit.muted }}>
        Lifecycle · {signal.lifecycle}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        <Action
          testId="signal-acknowledge"
          label="Acknowledge"
          onClick={() => acknowledge(signal.signalId)}
        />
        <Action
          testId="signal-in-review"
          label="In Review"
          onClick={() => setLifecycle(signal.signalId, "In Review")}
        />
        <Action
          testId="signal-resolve"
          label="Resolve"
          onClick={() => resolve(signal.signalId)}
        />
        <Action
          testId="signal-archive"
          label="Archive"
          onClick={() => archive(signal.signalId)}
        />
      </div>
    </section>
  );
}

function Action({
  label,
  onClick,
  testId,
}: {
  readonly label: string;
  readonly onClick: () => void;
  readonly testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      style={{
        padding: "0.3rem 0.45rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${cockpit.borderStrong}`,
        background: "transparent",
        color: cockpit.accent,
        fontSize: "0.6rem",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
