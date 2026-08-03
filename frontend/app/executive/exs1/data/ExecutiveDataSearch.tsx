"use client";

import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

export function ExecutiveDataSearch() {
  const { query, setQuery } = useExecutiveData();

  return (
    <label
      data-testid="executive-data-search"
      style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
    >
      <span
        style={{
          fontSize: cockpit.type.status.size,
          letterSpacing: cockpit.type.status.tracking,
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        Search
      </span>
      <input
        data-testid="executive-data-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sources, columns, objects…"
        style={{
          padding: "0.45rem 0.55rem",
          borderRadius: cockpit.radius.sm,
          border: `1px solid ${cockpit.border}`,
          background: cockpit.panelSoft,
          color: cockpit.text,
          fontFamily: "inherit",
          fontSize: "0.8rem",
        }}
      />
    </label>
  );
}
