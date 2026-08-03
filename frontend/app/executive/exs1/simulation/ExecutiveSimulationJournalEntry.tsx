"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { SimulationJournalEntry } from "./ExecutiveSimulationSession";

type Props = {
  readonly entry: SimulationJournalEntry;
};

export function ExecutiveSimulationJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`executive-simulation-journal-${entry.id}`}
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#FDB022",
        }}
      >
        Simulation Pack
      </p>
      <h3
        style={{
          margin: "0.3rem 0 0",
          fontSize: "0.82rem",
          color: cockpit.text,
        }}
      >
        {entry.summary}
      </h3>
      <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem", color: cockpit.textSoft }}>
        Scenario · {entry.scenario}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Assumptions · {entry.assumptions}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Results · {entry.results}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Impacts · {entry.impacts}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Risks · {entry.risks}
      </p>
    </article>
  );
}
