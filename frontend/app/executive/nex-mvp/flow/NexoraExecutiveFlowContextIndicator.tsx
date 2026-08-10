"use client";

import type { CSSProperties } from "react";
import type { NexoraMVPExecutiveFlowChain } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly chain: NexoraMVPExecutiveFlowChain;
  readonly onSelectLink?: (subjectId: string) => void;
};

/**
 * Restrained flow-chain orientation — not a permanent dashboard stack.
 */
export function NexoraExecutiveFlowContextIndicator({
  chain,
  onSelectLink,
}: Props) {
  if (chain.links.length === 0) {
    return (
      <div
        data-testid="nexora-flow-chain"
        data-nex-mvp="8"
        aria-label="Executive flow overview"
        style={barStyle}
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
      aria-label="Executive flow chain"
      style={barStyle}
    >
      {chain.links.map((link, index) => (
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
            onClick={() => onSelectLink?.(link.id)}
            style={{
              border: "none",
              background: "transparent",
              color: cockpit.textSoft,
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
      ))}
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
