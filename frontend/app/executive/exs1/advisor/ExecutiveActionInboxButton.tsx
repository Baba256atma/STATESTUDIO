"use client";

import { useEffect, useRef, useState } from "react";
import type { AdvisorProposal } from "./ExecutiveAdvisorTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveActionInboxDropdown } from "./ExecutiveActionInboxDropdown";
import { useExecutiveActionInbox } from "./hooks/useExecutiveActionInbox";

type Props = {
  readonly proposals: readonly AdvisorProposal[];
  readonly panelWidth: number;
  readonly iconOnly?: boolean;
  readonly accent?: string;
  readonly onReview: (proposalId: string) => void;
  readonly onViewAll: () => void;
};

/**
 * Sprint 6.7 — ✔ Approvals inbox trigger + dropdown.
 */
export function ExecutiveActionInboxButton({
  proposals,
  panelWidth,
  iconOnly = false,
  accent = cockpit.accent,
  onReview,
  onViewAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { items, pendingCount, isEmpty } = useExecutiveActionInbox(proposals);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label =
    pendingCount === 0
      ? iconOnly
        ? "✔"
        : "✔ Approvals"
      : iconOnly
        ? `✔ ${pendingCount}`
        : `✔ Approvals (${pendingCount})`;

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        data-testid="executive-action-inbox-button"
        data-pending-count={pendingCount}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={
          pendingCount === 0
            ? "Approvals"
            : `Approvals, ${pendingCount} pending`
        }
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "0.32rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: open ? `1px solid ${accent}66` : "1px solid transparent",
          background: open ? `${accent}14` : "transparent",
          color: pendingCount > 0 ? accent : cockpit.muted,
          fontSize: "0.62rem",
          letterSpacing: "0.04em",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </button>
      {open ? (
        <ExecutiveActionInboxDropdown
          items={items}
          panelWidth={panelWidth}
          onReview={(proposalId) => {
            setOpen(false);
            onReview(proposalId);
          }}
          onViewAll={() => {
            setOpen(false);
            onViewAll();
          }}
        />
      ) : null}
      {/* Keep empty-state discoverable for tests when closed via data attrs */}
      <span
        data-testid="executive-action-inbox-count"
        data-empty={isEmpty ? "true" : "false"}
        style={{ display: "none" }}
      >
        {pendingCount}
      </span>
    </div>
  );
}
