"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { AdvisorReference } from "./ExecutiveAdvisorTypes";

type Props = {
  readonly reference: AdvisorReference;
  readonly onSelect: (reference: AdvisorReference) => void;
};

export function ExecutiveAdvisorReference({ reference, onSelect }: Props) {
  return (
    <button
      type="button"
      data-testid={`executive-advisor-reference-${reference.id}`}
      data-kind={reference.kind}
      onClick={() => onSelect(reference)}
      style={{
        padding: "0.3rem 0.5rem",
        borderRadius: cockpit.radius.sm,
        border: `1px solid ${cockpit.borderStrong}`,
        background: cockpit.glass,
        color: cockpit.accent,
        fontSize: "0.66rem",
        letterSpacing: "0.04em",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: cockpit.transition,
      }}
    >
      {reference.kind}: {reference.label}
    </button>
  );
}
