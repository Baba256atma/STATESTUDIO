"use client";

import type { ExecutivePreparationContext } from "@/app/lib/spatial-presentation/executiveStagePreparation";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly preparationContext: ExecutivePreparationContext | null | undefined;
  readonly presentationMode?: string | null;
};

/**
 * STAGE-PROD:6 — Daily / Meeting Preparation summary in Advisor.
 * Quiet when preparation is inactive. Not a Stage Object.
 */
export function NexoraExecutivePreparationPanel({
  preparationContext,
  presentationMode,
}: Props) {
  if (
    preparationContext == null ||
    presentationMode !== "preparation"
  ) {
    return null;
  }

  const summary = preparationContext.summary;
  const title =
    preparationContext.mode === "daily"
      ? "Daily Preparation"
      : `${preparationContext.subject?.label?.trim() || "Meeting"} · Prepared Context`;

  return (
    <section
      data-testid="nexora-executive-preparation"
      data-stage-prod="6"
      data-preparation-mode={preparationContext.mode}
      data-preparation-is-semantic-object="false"
      data-preparation-included={preparationContext.includedObjectIds.length}
      aria-label="Executive Preparation"
      style={{
        margin: "0.35rem 0.75rem 0.15rem",
        padding: "0.55rem 0.65rem 0.6rem",
        borderTop: `1px solid ${cockpit.border}`,
        borderBottom: `1px solid ${cockpit.border}`,
        background: "rgba(12, 18, 28, 0.42)",
      }}
    >
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.muted,
          fontWeight: 600,
          marginBottom: "0.35rem",
        }}
      >
        {title}
      </div>

      <p
        data-testid="nexora-executive-preparation-headline"
        style={{
          margin: "0 0 0.45rem",
          fontSize: "0.72rem",
          color: cockpit.text,
          lineHeight: 1.4,
        }}
      >
        {summary.headline}
      </p>

      {summary.priorityItems.length > 0 ? (
        <ul
          data-testid="nexora-executive-preparation-priorities"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {summary.priorityItems.slice(0, 7).map((item) => (
            <li
              key={item.objectId}
              data-preparation-item={item.objectId}
              style={{
                fontSize: "0.66rem",
                color: cockpit.textSoft,
                lineHeight: 1.4,
                padding: "0.12rem 0",
              }}
            >
              · {item.label}
              {item.reason ? ` — ${item.reason}` : ""}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
