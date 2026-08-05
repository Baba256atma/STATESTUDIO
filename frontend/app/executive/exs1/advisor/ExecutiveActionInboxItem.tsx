"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveActionBadge } from "./ExecutiveActionBadge";
import type { ExecutiveActionItem } from "./hooks/useExecutiveActionInbox";

type Props = {
  readonly item: ExecutiveActionItem;
  readonly onReview: (proposalId: string) => void;
};

export function ExecutiveActionInboxItem({ item, onReview }: Props) {
  return (
    <div
      data-testid={`executive-action-item-${item.proposalId}`}
      data-action-type={item.type}
      style={{
        padding: "0.55rem 0.15rem",
        borderBottom: `1px solid ${cockpit.border}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.4rem",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            <span aria-hidden style={{ fontSize: "0.7rem" }}>
              {item.icon}
            </span>
            <span
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: item.tone,
              }}
            >
              {item.type}
            </span>
            <ExecutiveActionBadge priority={item.priority} />
          </div>
          <div
            style={{
              marginTop: "0.2rem",
              fontSize: "0.78rem",
              fontWeight: 550,
              color: cockpit.text,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              marginTop: "0.12rem",
              fontSize: "0.66rem",
              color: cockpit.muted,
            }}
          >
            Source · {item.source}
          </div>
          <div
            style={{
              marginTop: "0.1rem",
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            {item.status}
          </div>
        </div>
        <button
          type="button"
          data-testid={`executive-action-review-${item.proposalId}`}
          onClick={() => onReview(item.proposalId)}
          style={{
            flexShrink: 0,
            padding: "0.28rem 0.4rem",
            border: "none",
            background: "transparent",
            color: cockpit.accent,
            fontSize: "0.66rem",
            letterSpacing: "0.04em",
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
        >
          Review →
        </button>
      </div>
    </div>
  );
}
