"use client";

import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveDecisionApprovalBar — Approve / Reject / Return / Combine / Duplicate.
 * Expresses transition *intent* only; legality belongs to canonical Decision Runtime
 * via useExecutiveDecision → useRuntimeDecision → NexoraDecisionRuntimeAdapter.
 * Status/lock displayed here are read projections of Runtime truth.
 */
export function ExecutiveDecisionApprovalBar() {
  const {
    currentDecision,
    approve,
    reject,
    returnForAnalysis,
    duplicate,
    combineFromScenarios,
    setPreviewOpen,
  } = useExecutiveDecision();

  if (!currentDecision) return null;

  // Presentation of canonical Runtime projection — not a local transition policy.
  const locked = currentDecision.locked;
  const alreadyApproved = currentDecision.status === "Approved";

  return (
    <div
      data-testid="executive-decision-approval-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.35rem",
      }}
    >
      <Action
        testId="decision-approve"
        label="Approve"
        color="#12B76A"
        disabled={locked || alreadyApproved}
        onClick={() => approve(currentDecision.id)}
      />
      <Action
        testId="decision-reject"
        label="Reject"
        color="#F04438"
        disabled={locked}
        onClick={() => reject(currentDecision.id)}
      />
      <Action
        testId="decision-return"
        label="Return for Analysis"
        color="#FDB022"
        disabled={locked}
        onClick={() => returnForAnalysis(currentDecision.id)}
      />
      <Action
        testId="decision-combine"
        label="Combine"
        color="#7A5AF8"
        disabled={locked}
        onClick={() =>
          combineFromScenarios(
            currentDecision.scenarioSourceIds.length
              ? currentDecision.scenarioSourceIds
              : ["scenario-a", "scenario-c"],
            currentDecision.scenarioSourceIds.length >= 2
              ? currentDecision.scenarioSourceLabel
              : "Scenario A + C",
          )
        }
      />
      <Action
        testId="decision-duplicate"
        label="Duplicate"
        color={cockpit.accent}
        onClick={() => duplicate(currentDecision.id)}
      />
      <Action
        testId="decision-preview"
        label="Decision Preview"
        color="#1570EF"
        onClick={() => setPreviewOpen(true)}
      />
    </div>
  );
}

function Action({
  testId,
  label,
  color,
  onClick,
  disabled,
}: {
  readonly testId: string;
  readonly label: string;
  readonly color: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "0.35rem 0.55rem",
        borderRadius: "999px",
        border: `1px solid ${color}88`,
        background: disabled ? "transparent" : `${color}18`,
        color: disabled ? cockpit.lowMuted : color,
        fontSize: "0.62rem",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        opacity: disabled ? 0.45 : 1,
        transition: cockpit.transition,
      }}
    >
      {label}
    </button>
  );
}
