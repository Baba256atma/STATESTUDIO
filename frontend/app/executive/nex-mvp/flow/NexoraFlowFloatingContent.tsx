"use client";

import type { ReactNode } from "react";
import type {
  NexoraMVPExecutiveFlowContext,
  NexoraMVPFlowDomainState,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import type { NexoraMVPPresentationAvailableAction } from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import type { ExecutiveFloatingPanelKind } from "../../exs1/shell/executiveCockpitTypes";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly kind: ExecutiveFloatingPanelKind;
  readonly flowContext: NexoraMVPExecutiveFlowContext;
  readonly flowState: NexoraMVPFlowDomainState;
  readonly actions: readonly NexoraMVPPresentationAvailableAction[];
  readonly actionMessage: string | null;
  readonly actionError: string | null;
  readonly pendingActionId: string | null;
  readonly onAction: (action: NexoraMVPPresentationAvailableAction) => void;
  readonly onSelectSubject: (subjectId: string) => void;
};

/**
 * Thin Floating Panel bodies for Scenario compare / Decision / Execution.
 * Routes consequential actions through the shell flow domain applicator.
 */
export function NexoraFlowFloatingContent({
  kind,
  flowContext,
  flowState,
  actions,
  actionMessage,
  actionError,
  pendingActionId,
  onAction,
  onSelectSubject,
}: Props) {
  if (kind === "scenario-wizard") {
    return (
      <PanelFrame
        testId="nexora-flow-panel-scenario"
        title="Scenario comparison"
        subtitle={
          flowContext.problem
            ? `Problem · ${flowContext.problem.label}`
            : "Linked scenarios"
        }
      >
        {flowContext.linkedScenarios.length === 0 ? (
          <p style={muted}>No linked Scenario available for comparison.</p>
        ) : (
          <ul style={listStyle}>
            {flowContext.linkedScenarios.map((scenario) => (
              <li key={scenario.id}>
                <button
                  type="button"
                  data-testid={`nexora-flow-compare-${scenario.id}`}
                  onClick={() => onSelectSubject(scenario.id)}
                  style={rowButton}
                >
                  <strong>{scenario.label}</strong>
                  <span style={mutedInline}>Inspect on Stage</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p style={{ ...muted, marginTop: "0.75rem" }}>
          Compare key impact and risk on Stage; this panel stays concise.
        </p>
      </PanelFrame>
    );
  }

  if (kind === "decision-wizard") {
    const decisionId = flowContext.decision?.id;
    const decision = flowState.decisions.find((entry) => entry.id === decisionId);
    const decisionActions = actions.filter(
      (action) =>
        action.id.includes("approve") ||
        action.id.includes("reject") ||
        action.id.includes("review") ||
        action.id.includes("execution"),
    );
    return (
      <PanelFrame
        testId="nexora-flow-panel-decision"
        title={flowContext.decision?.label ?? "Decision review"}
        subtitle={
          decision
            ? `Status · ${decision.status}`
            : "No Decision in current flow chain"
        }
      >
        {flowContext.chain.summaryLine ? (
          <p style={muted}>{flowContext.chain.summaryLine}</p>
        ) : null}
        {decision?.sourceScenarioId ? (
          <p style={muted}>
            Source scenario linked · use Stage to inspect provenance.
          </p>
        ) : null}
        <ActionList
          actions={decisionActions}
          pendingActionId={pendingActionId}
          onAction={onAction}
        />
        <StatusLines message={actionMessage} error={actionError} />
      </PanelFrame>
    );
  }

  if (kind === "properties") {
    const executionId = flowContext.execution?.id;
    const execution = flowState.executions.find(
      (entry) => entry.id === executionId,
    );
    const executionActions = actions.filter(
      (action) =>
        action.id.includes("pause") ||
        action.id.includes("resume") ||
        action.id.includes("start-exec") ||
        action.id.includes("complete"),
    );
    return (
      <PanelFrame
        testId="nexora-flow-panel-execution"
        title={flowContext.execution?.label ?? "Execution details"}
        subtitle={
          execution
            ? `${execution.status} · ${execution.progress} · ${execution.health}`
            : "Focus an Execution subject for controls"
        }
      >
        {execution?.blocker ? (
          <p style={{ ...muted, color: "#fbbf24" }}>
            Blocker · {execution.blocker}
          </p>
        ) : null}
        <ActionList
          actions={executionActions}
          pendingActionId={pendingActionId}
          onAction={onAction}
        />
        <StatusLines message={actionMessage} error={actionError} />
      </PanelFrame>
    );
  }

  return (
    <PanelFrame
      testId="nexora-flow-panel-generic"
      title="Executive overlay"
      subtitle="Scenario, Decision, and Execution mount here without leaving /executive."
    >
      <p style={muted}>Select a flow action to open a focused overlay.</p>
    </PanelFrame>
  );
}

function PanelFrame({
  testId,
  title,
  subtitle,
  children,
}: {
  readonly testId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly children: ReactNode;
}) {
  return (
    <div data-testid={testId} style={{ padding: "1rem" }}>
      <h2
        style={{
          margin: 0,
          fontSize: "1rem",
          color: cockpit.text,
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: "0.35rem 0 0.85rem", ...muted }}>{subtitle}</p>
      {children}
    </div>
  );
}

function ActionList({
  actions,
  pendingActionId,
  onAction,
}: {
  readonly actions: readonly NexoraMVPPresentationAvailableAction[];
  readonly pendingActionId: string | null;
  readonly onAction: (action: NexoraMVPPresentationAvailableAction) => void;
}) {
  if (actions.length === 0) {
    return <p style={muted}>No actions available for this overlay.</p>;
  }
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
      data-testid="nexora-flow-panel-actions"
    >
      {actions.map((action) => {
        const pending = pendingActionId === action.id;
        const disabled = !action.available || pendingActionId != null;
        return (
          <button
            key={action.id}
            type="button"
            data-testid={`nexora-flow-panel-action-${action.id}`}
            disabled={disabled}
            title={
              action.available
                ? action.label
                : (action.disabledReason ?? "Unavailable")
            }
            onClick={() => {
              if (!disabled) onAction(action);
            }}
            style={{
              ...rowButton,
              opacity: disabled ? 0.55 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {pending ? `${action.label}…` : action.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusLines({
  message,
  error,
}: {
  readonly message: string | null;
  readonly error: string | null;
}) {
  return (
    <>
      {message ? (
        <p
          data-testid="nexora-flow-action-message"
          role="status"
          style={{ margin: "0.75rem 0 0", fontSize: "0.72rem", color: cockpit.success }}
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          data-testid="nexora-flow-action-error"
          role="alert"
          style={{ margin: "0.75rem 0 0", fontSize: "0.72rem", color: cockpit.risk }}
        >
          {error}
        </p>
      ) : null}
    </>
  );
}

const muted: CSSPropertiesLike = {
  margin: 0,
  fontSize: "0.72rem",
  color: cockpit.muted,
  lineHeight: 1.45,
};

const mutedInline: CSSPropertiesLike = {
  display: "block",
  marginTop: "0.2rem",
  fontSize: "0.65rem",
  color: cockpit.lowMuted,
};

const listStyle: CSSPropertiesLike = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const rowButton: CSSPropertiesLike = {
  width: "100%",
  textAlign: "left",
  border: `1px solid ${cockpit.border}`,
  background: cockpit.panelSoft,
  borderRadius: cockpit.radius.md,
  padding: "0.5rem 0.65rem",
  color: cockpit.text,
  fontFamily: "inherit",
  fontSize: "0.78rem",
};

type CSSPropertiesLike = Record<string, string | number>;
