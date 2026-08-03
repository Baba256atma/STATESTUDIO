"use client";

import type { DataFilter } from "./ExecutiveDataConfig";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

const FILTERS: readonly DataFilter[] = [
  "All",
  "Connected",
  "CSV",
  "Database",
  "API",
  "Warning",
];

export function ExecutiveDataFilterBar() {
  const { filter, setFilter } = useExecutiveData();

  return (
    <div
      data-testid="executive-data-filter-bar"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
    >
      {FILTERS.map((item) => {
        const active = filter === item;
        return (
          <button
            key={item}
            type="button"
            data-testid={`data-filter-${item.toLowerCase()}`}
            onClick={() => setFilter(item)}
            style={{
              padding: "0.25rem 0.45rem",
              borderRadius: cockpit.radius.pill,
              border: active
                ? `1px solid ${cockpit.accent}`
                : `1px solid ${cockpit.border}`,
              background: active ? cockpit.accentSoft : "transparent",
              color: active ? cockpit.accent : cockpit.muted,
              fontSize: "0.58rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: cockpit.transition,
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
