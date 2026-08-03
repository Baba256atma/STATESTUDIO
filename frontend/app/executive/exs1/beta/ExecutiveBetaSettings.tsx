"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ExecutiveFeatureFlagId } from "./ExecutiveFeatureFlags";
import { useExecutiveBeta } from "./hooks/useExecutiveBeta";

const FLAG_LABELS: readonly {
  readonly id: ExecutiveFeatureFlagId;
  readonly label: string;
}[] = [
  { id: "EnableSimulation", label: "Enable Simulation" },
  { id: "EnableConnectors", label: "Enable Connectors" },
  { id: "EnableRuntimeInspector", label: "Runtime Inspector" },
  { id: "EnableMetadataEditor", label: "Metadata Editor" },
  { id: "EnableDemoMode", label: "Demo Mode" },
  { id: "EnableDeveloperMode", label: "Developer Mode" },
  { id: "EnableMotionDebug", label: "Motion Debug" },
  { id: "EnableMetadataDebug", label: "Metadata Debug" },
];

/**
 * Executive Beta Settings — Demo Mode, Developer Mode, flags, validation, recovery, audit.
 */
export function ExecutiveBetaSettings() {
  const beta = useExecutiveBeta();

  return (
    <div
      data-testid="executive-beta-settings"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Beta Settings
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          Readiness {beta.readiness.ready}/{beta.readiness.total}
          {beta.readiness.betaReady ? " · Beta Ready" : " · Review required"}
        </p>
      </div>

      <section
        data-testid="executive-feature-flags"
        style={panelStyle}
      >
        <strong style={headingStyle}>Feature Flags</strong>
        {FLAG_LABELS.map((flag) => (
          <label
            key={flag.id}
            style={{
              display: "flex",
              gap: "0.45rem",
              alignItems: "center",
              fontSize: "0.7rem",
              color: cockpit.textSoft,
              marginTop: "0.3rem",
            }}
          >
            <input
              type="checkbox"
              data-testid={`beta-flag-${flag.id}`}
              checked={beta.flags[flag.id]}
              onChange={(e) => beta.setFlag(flag.id, e.target.checked)}
            />
            {flag.label}
          </label>
        ))}
      </section>

      <section data-testid="executive-demo-manager" style={panelStyle}>
        <strong style={headingStyle}>Demo Mode</strong>
        <p style={{ margin: "0.3rem 0", fontSize: "0.7rem", color: cockpit.muted }}>
          Current · {beta.currentDemo?.name ?? "—"}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          <button
            type="button"
            data-testid="beta-reset-demo"
            onClick={beta.resetDemo}
            style={buttonStyle}
          >
            Reset Demo
          </button>
          <button
            type="button"
            data-testid="beta-load-manufacturing"
            onClick={beta.loadManufacturingDemo}
            style={buttonStyle}
          >
            Load Manufacturing Demo
          </button>
          <button
            type="button"
            data-testid="beta-load-pmo"
            onClick={beta.loadPmoDemo}
            style={buttonStyle}
          >
            Load PMO Demo
          </button>
          <button
            type="button"
            data-testid="beta-load-retail"
            onClick={beta.loadRetailDemo}
            style={buttonStyle}
          >
            Load Retail Demo
          </button>
        </div>
        {beta.demoAdvisory.length ? (
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1rem", fontSize: "0.66rem", color: cockpit.muted }}>
            {beta.demoAdvisory.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section data-testid="executive-readiness-checklist" style={panelStyle}>
        <strong style={headingStyle}>Readiness Checklist</strong>
        {beta.checklist.map((item) => (
          <div
            key={item.id}
            data-testid={`beta-checklist-${item.id.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              marginTop: "0.3rem",
              fontSize: "0.68rem",
              color: item.operational ? cockpit.textSoft : "#F97066",
            }}
          >
            {item.operational ? "✓" : "○"} {item.id} · {item.requirement}
          </div>
        ))}
      </section>

      <section data-testid="executive-beta-validator" style={panelStyle}>
        <strong style={headingStyle}>Beta Validator</strong>
        <button
          type="button"
          data-testid="beta-run-validation"
          onClick={() => beta.runValidation()}
          style={{ ...buttonStyle, marginTop: "0.35rem" }}
        >
          Run End-to-End Validation
        </button>
        {beta.validation ? (
          <div
            data-testid="beta-validation-report"
            style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: cockpit.textSoft }}
          >
            <div>
              Result · {beta.validation.betaReady ? "Beta Ready" : "Needs attention"} ·{" "}
              {beta.validation.checks.filter((c) => c.ok).length}/
              {beta.validation.checks.length} checks
            </div>
            {beta.validation.checks.map((check) => (
              <div
                key={check.id}
                data-testid={`beta-check-${check.id}`}
                style={{ color: check.ok ? cockpit.muted : "#F97066" }}
              >
                {check.ok ? "✓" : "×"} {check.id} · {check.detail}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section data-testid="executive-recovery-center" style={panelStyle}>
        <strong style={headingStyle}>Recovery Center</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.35rem" }}>
          <button
            type="button"
            data-testid="beta-report-connector-failure"
            onClick={() =>
              beta.reportRecovery("ConnectorFailed", "Sample connector failure for beta.")
            }
            style={buttonStyle}
          >
            Sample Connector Failure
          </button>
        </div>
        {beta.recoveryRecords.length === 0 ? (
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.68rem", color: cockpit.muted }}>
            No open recoveries. Failures offer Retry · Resume · Cancel · Review · Continue Later.
          </p>
        ) : (
          beta.recoveryRecords.map((record) => (
            <div
              key={record.id}
              data-testid={`beta-recovery-${record.id}`}
              style={{ marginTop: "0.4rem", fontSize: "0.68rem", color: cockpit.textSoft }}
            >
              <div>
                {record.error.title} · {record.status}
              </div>
              <div style={{ color: cockpit.muted }}>{record.error.message}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.25rem" }}>
                {record.error.recovery.map((action) => (
                  <button
                    key={action}
                    type="button"
                    data-testid={`beta-recovery-action-${action.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => beta.actRecovery(record.id, action)}
                    style={buttonStyle}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section data-testid="executive-audit-console" style={panelStyle}>
        <strong style={headingStyle}>Audit Console</strong>
        <button
          type="button"
          data-testid="beta-seed-audit"
          onClick={beta.seedAuditTrail}
          style={{ ...buttonStyle, marginTop: "0.35rem" }}
        >
          Seed Minimum Audit Trail
        </button>
        {beta.auditEvents.map((event) => (
          <div
            key={event.id}
            data-testid={`beta-audit-${event.kind.toLowerCase().replace(/\s+/g, "-")}`}
            style={{ marginTop: "0.3rem", fontSize: "0.66rem", color: cockpit.muted }}
          >
            {event.kind} · {event.user} · {event.pack} ·{" "}
            {event.objects.join(", ")} · {event.timestamp.slice(0, 19)}
          </div>
        ))}
      </section>

      <section data-testid="executive-beta-scenarios" style={panelStyle}>
        <strong style={headingStyle}>Official Beta Scenarios</strong>
        {beta.scenarios.map((scenario) => (
          <details
            key={scenario.id}
            data-testid={`beta-scenario-${scenario.id}`}
            style={{ marginTop: "0.35rem", fontSize: "0.68rem", color: cockpit.textSoft }}
          >
            <summary>
              Scenario {scenario.number} · {scenario.title}
            </summary>
            <p style={{ margin: "0.3rem 0", color: cockpit.muted }}>{scenario.goal}</p>
            <ol style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {scenario.steps.map((step) => (
                <li key={step.order}>
                  {step.action} → {step.expect}
                </li>
              ))}
            </ol>
          </details>
        ))}
      </section>
    </div>
  );
}

const panelStyle = {
  padding: "0.55rem 0.65rem",
  borderRadius: cockpit.radius.md,
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panelSoft,
} as const;

const headingStyle = {
  fontSize: "0.72rem",
  color: cockpit.accent,
} as const;

const buttonStyle = {
  padding: "0.3rem 0.45rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.accent,
  fontSize: "0.62rem",
  cursor: "pointer",
  fontFamily: "inherit",
} as const;
