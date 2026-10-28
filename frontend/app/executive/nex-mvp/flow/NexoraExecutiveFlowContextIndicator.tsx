"use client";

import type { CSSProperties, ReactNode, Ref } from "react";
import type {
  NexoraMVPExecutiveFlowChain,
  NexoraMVPExecutiveWorkflowPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly chain: NexoraMVPExecutiveFlowChain;
  readonly workflow?: NexoraMVPExecutiveWorkflowPresentation;
  readonly onSelectLink?: (subjectId: string) => void;
  /** Existing management-level navigation. Not a second process trail. */
  readonly context?: ReactNode;
  readonly onStageSlotRef?: Ref<HTMLDivElement>;
};

/**
 * Restrained flow-chain orientation — not a permanent dashboard stack.
 */
export function NexoraExecutiveFlowContextIndicator({
  chain,
  workflow,
  onSelectLink,
  context = null,
  onStageSlotRef,
}: Props) {
  const empty = chain.links.length === 0;
  return (
    <nav
      data-testid="nexora-flow-chain"
      data-stage-menu="process"
      data-nex-mvp="8"
      data-ux5="executive-workflow"
      data-flow-empty={empty ? "true" : "false"}
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
      aria-label={empty ? "Executive flow overview" : "Executive flow chain"}
      style={barStyle}
    >
      {empty ? (
        <span style={{ ...cockpit.visuallyHidden, color: cockpit.lowMuted, fontSize: "0.68rem" }}>
          Overview · no focused flow chain
        </span>
      ) : null}
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
      {workflow && !empty ? (
        <span
          data-testid="nexora-workflow-context"
          title={workflow.reason}
          style={{
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
      {context}
      <div
        ref={onStageSlotRef}
        id="nexora-process-on-stage-slot"
        data-testid="nexora-process-on-stage-slot"
        style={{
          marginLeft: "auto",
          flex: "0 0 auto",
          minWidth: "7.5rem",
          position: "relative",
        }}
      />
    </nav>
  );
}

const barStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.35rem 0.75rem",
  borderBottom: `1px solid ${cockpit.border}`,
  background: "var(--nx-bg-hud)",
  minHeight: "1.75rem",
  minWidth: 0,
  position: "relative",
  zIndex: 5,
  overflow: "visible",
};
