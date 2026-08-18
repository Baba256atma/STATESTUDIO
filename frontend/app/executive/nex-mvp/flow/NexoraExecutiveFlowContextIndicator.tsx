"use client";

import type { CSSProperties } from "react";
import type {
  NexoraMVPExecutiveFlowChain,
  NexoraMVPExecutiveWorkflowPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly chain: NexoraMVPExecutiveFlowChain;
  readonly workflow?: NexoraMVPExecutiveWorkflowPresentation;
  readonly onSelectLink?: (subjectId: string) => void;
};

/**
 * Restrained flow-chain orientation — not a permanent dashboard stack.
 */
export function NexoraExecutiveFlowContextIndicator({
  chain,
  workflow,
  onSelectLink,
}: Props) {
  if (chain.links.length === 0) {
    return (
      <div
        data-testid="nexora-flow-chain"
        data-nex-mvp="8"
        data-ux5="executive-workflow"
        data-flow-empty="true"
        data-workflow-phase={workflow?.phase ?? "overview"}
        data-workflow-readiness={
          workflow?.readiness ?? "no-current-workflow"
        }
        data-workflow-current-subject={workflow?.currentSubjectId ?? "none"}
        data-workflow-next-subject={
          workflow?.nextAvailableSubject?.id ?? "none"
        }
        data-workflow-outcome={
          workflow?.outcomeAvailability ?? "unavailable"
        }
        data-workflow-learning={
          workflow?.learningAvailability ?? "unavailable"
        }
        aria-label="Executive flow overview"
        style={{ ...barStyle, ...cockpit.visuallyHidden }}
      >
        <span style={{ color: cockpit.lowMuted, fontSize: "0.68rem" }}>
          Overview · no focused flow chain
        </span>
      </div>
    );
  }

  return (
    <nav
      data-testid="nexora-flow-chain"
      data-nex-mvp="8"
      data-ux5="executive-workflow"
      data-workflow-phase={workflow?.phase ?? "overview"}
      data-workflow-readiness={
        workflow?.readiness ?? "no-current-workflow"
      }
      data-workflow-current-subject={workflow?.currentSubjectId ?? "none"}
      data-workflow-next-subject={
        workflow?.nextAvailableSubject?.id ?? "none"
      }
      data-workflow-outcome={workflow?.outcomeAvailability ?? "unavailable"}
      data-workflow-learning={workflow?.learningAvailability ?? "unavailable"}
      aria-label="Executive flow chain"
      style={barStyle}
    >
      {chain.links.map((link, index) => {
        const isCurrent = workflow?.currentSubjectId === link.id;
        return (
        <span key={link.id} style={{ display: "inline-flex", alignItems: "center" }}>
          {index > 0 ? (
            <span
              aria-hidden="true"
              style={{
                margin: "0 0.35rem",
                color: cockpit.lowMuted,
                fontSize: "0.65rem",
              }}
            >
              →
            </span>
          ) : null}
          <button
            type="button"
            data-testid={`nexora-flow-link-${link.id}`}
            data-flow-kind={link.kind}
            data-flow-current={isCurrent ? "true" : "false"}
            aria-current={isCurrent ? "step" : undefined}
            onClick={() => onSelectLink?.(link.id)}
            style={{
              border: "none",
              background: "transparent",
              color: isCurrent ? cockpit.accent : cockpit.textSoft,
              fontSize: "0.68rem",
              padding: "0.1rem 0.15rem",
              cursor: onSelectLink ? "pointer" : "default",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                color: cockpit.lowMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: "0.55rem",
                marginRight: "0.25rem",
              }}
            >
              {link.kind}
            </span>
            {link.label}
          </button>
        </span>
      )})}
      {workflow ? (
        <span
          data-testid="nexora-workflow-context"
          title={workflow.reason}
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.45rem",
            minWidth: 0,
          }}
        >
          <span
            data-testid="nexora-workflow-phase"
            style={{
              color: cockpit.accent,
              fontSize: "0.56rem",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              whiteSpace: "nowrap",
            }}
          >
            {workflow.phaseLabel}
          </span>
          <span
            data-testid="nexora-workflow-readiness"
            title={workflow.readinessLabel}
            style={{
              color: cockpit.lowMuted,
              fontSize: "0.62rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "14rem",
            }}
          >
            {workflow.readinessLabel}
          </span>
        </span>
      ) : null}
    </nav>
  );
}

const barStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.1rem",
  padding: "0.35rem 0.75rem",
  borderBottom: `1px solid ${cockpit.border}`,
  background: "rgba(8, 16, 28, 0.55)",
  minHeight: "1.75rem",
};
