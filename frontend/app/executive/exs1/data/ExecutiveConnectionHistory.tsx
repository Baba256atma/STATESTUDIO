"use client";

import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

export function ExecutiveConnectionHistory() {
  const { history } = useExecutiveData();

  return (
    <div
      data-testid="executive-connection-history"
      style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
    >
      {history.map((event) => (
        <article
          key={event.id}
          data-testid={`executive-history-${event.id}`}
          style={{
            padding: "0.55rem 0.6rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.56rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.accent,
            }}
          >
            {event.when}
          </p>
          <strong style={{ display: "block", marginTop: "0.2rem", fontSize: "0.8rem" }}>
            {event.title}
          </strong>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.7rem",
              color: cockpit.textSoft,
            }}
          >
            {event.summary}
          </p>
        </article>
      ))}
    </div>
  );
}
