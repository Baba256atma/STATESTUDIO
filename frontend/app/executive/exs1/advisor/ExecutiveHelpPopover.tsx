"use client";

import { useEffect, useRef, useState } from "react";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly guidance?: string;
  readonly iconOnly?: boolean;
  readonly accent?: string;
};

/**
 * Sprint 6.6 — ? Help popover (shortcuts, tips, approval).
 */
export function ExecutiveHelpPopover({
  guidance,
  iconOnly = false,
  accent = cockpit.accent,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        data-testid="executive-advisor-guidance"
        data-exs1-compat="exs1-advisor-guidance"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Help"
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "0.32rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: open ? `1px solid ${accent}66` : "1px solid transparent",
          background: open ? `${accent}14` : "transparent",
          color: open ? accent : cockpit.muted,
          fontSize: "0.62rem",
          letterSpacing: "0.04em",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {iconOnly ? "?" : "? Help"}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Executive Help"
          data-testid="executive-advisor-guidance-popover"
          style={{
            position: "absolute",
            right: 0,
            bottom: "calc(100% + 0.4rem)",
            width: "min(18rem, 78vw)",
            zIndex: 30,
            padding: "0.75rem 0.8rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panel,
            boxShadow: cockpit.elevation.floating,
            animation: "exs-pop-in 160ms ease",
          }}
        >
          <Section title="Keyboard">
            Enter — Send · Shift+Enter — New line
          </Section>
          <Section title="Conversation">
            Ask what to do next. Runtime context is included automatically.
          </Section>
          <Section title="Proposals">
            Proposal cards are suggestions only. Nothing changes until you act.
          </Section>
          <Section title="Manager approval">
            Approve applies a Runtime action. Dismiss leaves Runtime unchanged.
          </Section>
          {guidance ? (
            <Section title="Guidance">{guidance}</Section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  readonly title: string;
  readonly children: string;
}) {
  return (
    <div style={{ marginBottom: "0.55rem" }}>
      <p
        style={{
          margin: 0,
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.accent,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.74rem",
          lineHeight: 1.45,
          color: cockpit.textSoft,
        }}
      >
        {children}
      </p>
    </div>
  );
}
