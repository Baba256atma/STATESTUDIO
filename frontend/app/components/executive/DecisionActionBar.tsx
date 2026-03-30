"use client";

import React from "react";

import type { DecisionAutomationResult } from "../../lib/execution/decisionAutomationTypes";
import type { DecisionExecutionIntent } from "../../lib/execution/decisionExecutionIntent";
import type { DecisionGovernanceState } from "../../lib/governance/decisionGovernanceTypes";
import type { ApprovalWorkflowState } from "../../lib/approval/approvalWorkflowTypes";
import type { DecisionPolicyState } from "../../lib/policy/decisionPolicyTypes";
import { nx, primaryButtonStyle, secondaryButtonStyle, softCardStyle } from "../ui/nexoraTheme";

type ActionHandler = (intent: DecisionExecutionIntent | null) => DecisionAutomationResult | Promise<DecisionAutomationResult | void> | void;

type DecisionActionBarProps = {
  intent: DecisionExecutionIntent | null;
  policyState?: DecisionPolicyState | null;
  governanceState?: DecisionGovernanceState | null;
  approvalWorkflowState?: ApprovalWorkflowState | null;
  onOpenPolicy?: (() => void) | null;
  onOpenApproval?: (() => void) | null;
  onSimulateDecision?: ActionHandler | null;
  onPreviewImpact?: ActionHandler | null;
  onCompareAlternatives?: ActionHandler | null;
  onSaveScenario?: ActionHandler | null;
  onApplySafeMode?: ActionHandler | null;
};

function disabledReason(
  intent: DecisionExecutionIntent | null,
  governanceState: DecisionGovernanceState | null | undefined,
  approvalWorkflowState: ApprovalWorkflowState | null | undefined,
  mode: "simulate" | "preview" | "compare" | "save" | "apply"
) {
  if (governanceState && !governanceState.allowed_actions.includes(mode)) {
    return governanceState.explanation;
  }
  if (
    approvalWorkflowState?.required &&
    approvalWorkflowState.status !== "approved" &&
    approvalWorkflowState.blocked_until_approval_actions.includes(mode)
  ) {
    return approvalWorkflowState.explanation;
  }
  if (!intent) return "No actionable recommendation is available yet.";
  if (mode === "simulate" && !intent.simulation_ready) return "No simulation context is available yet.";
  if (mode === "compare" && !intent.compare_ready) return "No meaningful alternatives are available yet.";
  if ((mode === "preview" || mode === "apply") && !intent.target_ids.length) return "No affected targets are available yet.";
  return null;
}

export function DecisionActionBar(props: DecisionActionBarProps) {
  const [feedback, setFeedback] = React.useState<DecisionAutomationResult | null>(null);
  const [pendingMode, setPendingMode] = React.useState<DecisionAutomationResult["mode"] | null>(null);

  const runAction = React.useCallback(
    async (
      mode: DecisionAutomationResult["mode"],
      handler: ActionHandler | null | undefined,
      fallbackSummary: string
    ) => {
      if (!handler) return;
      const reason = disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, mode);
      if (reason) {
        setFeedback({ status: "partial", mode, summary: reason });
        return;
      }

      setPendingMode(mode);
      try {
        const result = await handler(props.intent);
        setFeedback(
          result ?? {
            status: "success",
            mode,
            summary: fallbackSummary,
            affected_target_ids: props.intent?.target_ids ?? [],
          }
        );
      } catch (error) {
        setFeedback({
          status: "error",
          mode,
          summary: error instanceof Error ? error.message : "This action could not be completed.",
        });
      } finally {
        setPendingMode(null);
      }
    },
    [props.intent]
  );

  const preferredPrimaryMode =
    props.policyState?.posture === "compare_first"
      ? "compare"
      : props.policyState?.posture === "restricted"
        ? "preview"
        : "simulate";

  return (
    <div style={{ ...softCardStyle, padding: 12, gap: 10 }}>
      <div style={{ color: "#cbd5f5", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Action Bar
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ActionButton
          label="Simulate this decision"
          disabledReason={disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, "simulate")}
          busy={pendingMode === "simulate"}
          primary={preferredPrimaryMode === "simulate"}
          onClick={() =>
            runAction("simulate", props.onSimulateDecision, "Simulation opened for the selected decision.")
          }
        />
        <ActionButton
          label="Preview impact"
          disabledReason={disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, "preview")}
          busy={pendingMode === "preview"}
          primary={preferredPrimaryMode === "preview"}
          onClick={() =>
            runAction("preview", props.onPreviewImpact, "Preview applied to the selected decision scope.")
          }
        />
        <ActionButton
          label="Compare with alternatives"
          disabledReason={disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, "compare")}
          busy={pendingMode === "compare"}
          primary={preferredPrimaryMode === "compare"}
          onClick={() =>
            runAction("compare", props.onCompareAlternatives, "Compare opened with the selected decision.")
          }
        />
        <ActionButton
          label="Save scenario"
          disabledReason={disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, "save")}
          busy={pendingMode === "save"}
          onClick={() =>
            runAction("save", props.onSaveScenario, "Scenario saved to decision memory.")
          }
        />
        <ActionButton
          label="Apply in safe mode"
          disabledReason={disabledReason(props.intent, props.governanceState, props.approvalWorkflowState, "apply")}
          busy={pendingMode === "apply"}
          onClick={() =>
            runAction("apply", props.onApplySafeMode, "Safe-mode action is now active.")
          }
        />
      </div>
      {feedback ? (
        <div
          style={{
            borderRadius: 10,
            border:
              feedback.status === "error"
                ? "1px solid rgba(239,68,68,0.24)"
                : feedback.status === "partial"
                  ? "1px solid rgba(245,158,11,0.22)"
                  : "1px solid rgba(96,165,250,0.22)",
            background: "rgba(2,6,23,0.38)",
            padding: "10px 12px",
            color: feedback.status === "error" ? nx.risk : feedback.status === "partial" ? nx.warning : "#dbeafe",
            fontSize: 12,
            lineHeight: 1.45,
          }}
        >
          {feedback.summary}
        </div>
      ) : null}
      {props.governanceState ? (
        <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>
          Governance: {props.governanceState.mode.replace(/_/g, " ")}.
        </div>
      ) : null}
      {props.policyState ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>
            Policy: {props.policyState.posture.replace(/_/g, " ")}.
          </div>
          {props.onOpenPolicy ? (
            <button type="button" onClick={props.onOpenPolicy} style={secondaryButtonStyle}>
              Open Policy
            </button>
          ) : null}
        </div>
      ) : null}
      {props.approvalWorkflowState ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>
            Approval: {props.approvalWorkflowState.status.replace(/_/g, " ")}.
          </div>
          {props.onOpenApproval ? (
            <button type="button" onClick={props.onOpenApproval} style={secondaryButtonStyle}>
              Open Approval
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ActionButton(props: {
  label: string;
  onClick: () => void;
  disabledReason: string | null;
  busy: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={Boolean(props.disabledReason) || props.busy}
      title={props.disabledReason ?? ""}
      style={{
        ...(props.primary ? primaryButtonStyle : secondaryButtonStyle),
        opacity: props.disabledReason ? 0.48 : 1,
        cursor: props.disabledReason ? "not-allowed" : "pointer",
      }}
    >
      {props.busy ? "Working..." : props.label}
    </button>
  );
}
