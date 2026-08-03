"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveSignalCard } from "./ExecutiveSignalCard";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";

export function ExecutiveSignalList() {
  const { visibleSignals, selectedSignalId, setSelectedSignalId } =
    useRuntimeIntelligence();

  if (visibleSignals.length === 0) {
    return (
      <p
        data-testid="executive-signal-list-empty"
        style={{ margin: 0, color: cockpit.muted, fontSize: "0.74rem" }}
      >
        No signals match the current filter. Interact with the cockpit to
        generate intelligence.
      </p>
    );
  }

  return (
    <div
      data-testid="executive-signal-list"
      style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
    >
      {visibleSignals.map((signal) => (
        <ExecutiveSignalCard
          key={signal.signalId}
          signal={signal}
          selected={signal.signalId === selectedSignalId}
          onSelect={() => setSelectedSignalId(signal.signalId)}
        />
      ))}
    </div>
  );
}
