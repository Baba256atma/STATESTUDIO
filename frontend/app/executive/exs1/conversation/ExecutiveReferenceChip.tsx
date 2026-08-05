"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ConversationReference } from "./ExecutiveConversationSession";

type Props = {
  readonly reference: ConversationReference;
  readonly onSelect: (reference: ConversationReference) => void;
};

export function ExecutiveReferenceChip({ reference, onSelect }: Props) {
  return (
    <button
      type="button"
      data-testid={`executive-conversation-ref-${reference.id}`}
      data-kind={reference.kind}
      title={`${reference.kind} · ${reference.label}`}
      onClick={() => onSelect(reference)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.12rem 0.35rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${cockpit.border}`,
        background: "rgba(255,255,255,0.03)",
        color: cockpit.textSoft,
        fontSize: "0.6rem",
        letterSpacing: "0.02em",
        cursor: "pointer",
        fontFamily: "inherit",
        lineHeight: 1.2,
      }}
    >
      {reference.label}
    </button>
  );
}
