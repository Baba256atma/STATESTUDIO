"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveActionInboxItem } from "./ExecutiveActionInboxItem";
import type { ExecutiveActionItem } from "./hooks/useExecutiveActionInbox";

type Props = {
  readonly items: readonly ExecutiveActionItem[];
  readonly panelWidth: number;
  readonly onReview: (proposalId: string) => void;
  readonly onViewAll: () => void;
};

/**
 * Sprint 6.7 — Dropdown notification list (not a decision surface).
 */
export function ExecutiveActionInboxDropdown({
  items,
  panelWidth,
  onReview,
  onViewAll,
}: Props) {
  const width = Math.min(420, Math.max(280, panelWidth - 24));

  return (
    <div
      role="dialog"
      aria-label="Pending Executive Actions"
      data-testid="executive-action-inbox-dropdown"
      style={{
        position: "absolute",
        left: "50%",
        bottom: "calc(100% + 0.4rem)",
        transform: "translateX(-50%)",
        width,
        zIndex: 35,
        padding: "0.7rem 0.75rem 0.55rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panel,
        boxShadow: cockpit.elevation.floating,
        animation: "exs-inbox-in 160ms ease",
        transformOrigin: "bottom center",
      }}
    >
      <div
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Pending Executive Actions
      </div>
      <div
        style={{
          marginTop: "0.2rem",
          marginBottom: "0.45rem",
          fontSize: "0.72rem",
          color: cockpit.textSoft,
        }}
      >
        {items.length === 0
          ? "Everything is up to date. No approvals are waiting."
          : `${items.length} item${items.length === 1 ? "" : "s"} awaiting review`}
      </div>

      {items.length > 0 ? (
        <div data-testid="executive-action-inbox-list">
          {items.map((item) => (
            <ExecutiveActionInboxItem
              key={item.id}
              item={item}
              onReview={onReview}
            />
          ))}
        </div>
      ) : (
        <div
          data-testid="executive-action-inbox-empty"
          style={{
            padding: "0.55rem 0.1rem 0.35rem",
            color: cockpit.muted,
            fontSize: "0.72rem",
          }}
        >
          No approvals are waiting.
        </div>
      )}

      <button
        type="button"
        data-testid="executive-action-inbox-view-all"
        onClick={onViewAll}
        style={{
          marginTop: "0.35rem",
          padding: "0.35rem 0.1rem",
          border: "none",
          background: "transparent",
          color: cockpit.accent,
          fontSize: "0.66rem",
          letterSpacing: "0.04em",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        View All →
      </button>
      <style>{`
        @keyframes exs-inbox-in {
          from { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.98); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
