"use client";

import type { ExecutionFilter } from "./ExecutionConfig";
import { useExecutiveExecution } from "./hooks/useExecutiveExecution";
import { cockpit } from "../shell/executiveCockpitTheme";

const FILTERS: readonly ExecutionFilter[] = [
  "All",
  "Blocked",
  "In Progress",
  "Completed",
  "My Tasks",
];

/**
 * ExecutionFilterBar — visual filtering only.
 */
export function ExecutionFilterBar() {
  const { filter, setFilter } = useExecutiveExecution();

  return (
    <div
      data-testid="execution-filter-bar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3rem",
      }}
    >
      {FILTERS.map((item) => {
        const active = filter === item;
        return (
          <button
            key={item}
            type="button"
            data-testid={`execution-filter-${item.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setFilter(item)}
            style={{
              padding: "0.25rem 0.45rem",
              borderRadius: "999px",
              border: active
                ? "1px solid #12B76A"
                : `1px solid ${cockpit.border}`,
              background: active ? "rgba(18,183,106,0.16)" : "transparent",
              color: active ? "#12B76A" : cockpit.muted,
              fontSize: "0.58rem",
              letterSpacing: "0.04em",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 250ms ease, border-color 250ms ease",
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
