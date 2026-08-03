"use client";

import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly title: string;
  readonly body: string;
  readonly actionHint?: string;
  readonly testId?: string;
};

/**
 * ExecutiveEmptyState — calm guidance, never raw placeholders.
 */
export function ExecutiveEmptyState({
  title,
  body,
  actionHint,
  testId = "executive-empty-state",
}: Props) {
  return (
    <div
      data-testid={testId}
      style={{
        padding: "1rem 0.85rem",
        borderRadius: cockpit.radius.md,
        border: `1px dashed ${cockpit.border}`,
        background: cockpit.panelSoft,
        textAlign: "left",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: cockpit.type.caption.size,
          letterSpacing: cockpit.type.caption.tracking,
          textTransform: "uppercase",
          color: cockpit.lowMuted,
          fontWeight: cockpit.type.caption.weight,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "0.45rem 0 0",
          fontSize: cockpit.type.body.size,
          lineHeight: cockpit.type.body.lineHeight,
          color: cockpit.textSoft,
        }}
      >
        {body}
      </p>
      {actionHint ? (
        <p
          style={{
            margin: "0.55rem 0 0",
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.accent,
          }}
        >
          {actionHint}
        </p>
      ) : null}
    </div>
  );
}
