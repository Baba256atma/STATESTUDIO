"use client";

import type { DataCatalogSection } from "./ExecutiveDataConfig";
import { ExecutiveConnectionHistory } from "./ExecutiveConnectionHistory";
import { ExecutiveMappingWorkspace } from "./ExecutiveMappingWorkspace";
import { ExecutiveSourceCard } from "./ExecutiveSourceCard";
import { ExecutiveSourceDetails } from "./ExecutiveSourceDetails";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

const SECTIONS: readonly DataCatalogSection[] = [
  "Sources",
  "Mappings",
  "Connections",
  "History",
];

export function ExecutiveDataCatalog() {
  const {
    section,
    setSection,
    visibleSources,
    selectedSourceId,
    setSelectedSource,
    sources,
  } = useExecutiveData();

  return (
    <div
      data-testid="executive-data-catalog"
      style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
    >
      <div
        role="tablist"
        aria-label="Data catalog sections"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
      >
        {SECTIONS.map((item) => {
          const active = section === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              data-testid={`data-section-${item.toLowerCase()}`}
              onClick={() => setSection(item)}
              style={{
                padding: "0.35rem 0.55rem",
                borderRadius: cockpit.radius.sm,
                border: active
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
                background: active ? cockpit.accentSoft : "transparent",
                color: active ? cockpit.accent : cockpit.muted,
                fontSize: "0.66rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
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

      {section === "Sources" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {visibleSources.map((source) => (
            <ExecutiveSourceCard
              key={source.id}
              source={source}
              selected={source.id === selectedSourceId}
              onSelect={() => setSelectedSource(source.id)}
            />
          ))}
          <ExecutiveSourceDetails />
        </div>
      ) : null}

      {section === "Mappings" ? <ExecutiveMappingWorkspace /> : null}

      {section === "Connections" ? (
        <div
          data-testid="executive-data-connections"
          style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
        >
          {sources.map((source) => (
            <div
              key={source.id}
              style={{
                padding: "0.5rem 0.6rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${cockpit.border}`,
                background: cockpit.panelSoft,
                fontSize: "0.74rem",
                color: cockpit.textSoft,
              }}
            >
              <strong style={{ color: cockpit.text }}>{source.name}</strong>
              <p style={{ margin: "0.25rem 0 0" }}>
                {source.status} · {source.objectsConnected.join(" → ") || "Unmapped"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {section === "History" ? <ExecutiveConnectionHistory /> : null}
    </div>
  );
}
