"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveSignalList } from "./ExecutiveSignalList";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";
import type { IntelligenceFilter } from "./ExecutiveSignalTypes";

const FILTERS: readonly IntelligenceFilter[] = [
  "All",
  "Warnings",
  "Critical",
  "Decision Required",
  "Resolved",
  "My Attention",
];

/**
 * Executive Inbox — newest / unread / critical / decision-required / resolved.
 */
export function ExecutiveInbox() {
  const { filter, setFilter, query, setQuery, signals } =
    useRuntimeIntelligence();
  const unread = signals.filter((s) => s.unread).length;
  const critical = signals.filter(
    (s) => s.severity === "Critical" || s.type === "Critical",
  ).length;

  return (
    <div
      data-testid="executive-inbox"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Inbox
        </p>
        <p
          style={{
            margin: "0.25rem 0 0",
            fontSize: "0.72rem",
            color: cockpit.textSoft,
          }}
        >
          {signals.length} signals · {unread} unread · {critical} critical
        </p>
      </div>
      <input
        data-testid="intelligence-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search signals, objects, packs, domains…"
        style={{
          padding: "0.4rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: cockpit.navy,
          color: cockpit.text,
          fontSize: "0.74rem",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            data-testid={`intelligence-filter-${item.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setFilter(item)}
            style={{
              padding: "0.28rem 0.45rem",
              borderRadius: cockpit.radius.sm,
              border:
                filter === item
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
              background: filter === item ? cockpit.accentSoft : "transparent",
              color: filter === item ? cockpit.accent : cockpit.muted,
              fontSize: "0.58rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <ExecutiveSignalList />
    </div>
  );
}
