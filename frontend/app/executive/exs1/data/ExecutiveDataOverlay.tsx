"use client";

import { useExecutiveData } from "./hooks/useExecutiveData";
import { EXS1_OBJECTS } from "../mock/exs1Mock";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveDataOverlay — sources as executive data assets on Stage.
 * No tables. Visual connections Source → Model only.
 */
export function ExecutiveDataOverlay() {
  const { isActive, sources, selectedSource } = useExecutiveData();
  if (!isActive) return null;

  const connected = sources.filter((s) => s.status === "Connected").slice(0, 3);

  return (
    <div
      data-testid="executive-data-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(50% 45% at 50% 40%, rgba(56,189,248,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "0.35rem 0.65rem",
          borderRadius: cockpit.radius.pill,
          border: `1px solid ${cockpit.borderStrong}`,
          background: cockpit.glass,
          color: cockpit.accent,
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Enterprise Sources → Objects → Knowledge → Runtime
        {selectedSource ? ` · ${selectedSource.name}` : ""}
      </div>

      {connected.map((source, index) => {
        const object =
          EXS1_OBJECTS.find((o) =>
            source.objectsConnected.some(
              (label) => o.label.toLowerCase() === label.toLowerCase(),
            ),
          ) ?? EXS1_OBJECTS[index % EXS1_OBJECTS.length];
        if (!object) return null;
        const left = 18 + index * 22;
        return (
          <div key={source.id}>
            <div
              data-testid={`executive-data-asset-${source.id}`}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: "18%",
                transform: "translate(-50%, -50%)",
                minWidth: "7.5rem",
                padding: "0.55rem 0.65rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${cockpit.accent}66`,
                background:
                  "linear-gradient(160deg, rgba(56,189,248,0.2), rgba(12,16,24,0.92))",
                boxShadow: cockpit.elevation.asset,
                color: cockpit.text,
                textAlign: "center",
                transition: cockpit.transition,
              }}
            >
              <div
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: cockpit.lowMuted,
                }}
              >
                Source
              </div>
              <div
                style={{
                  marginTop: "0.2rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: cockpit.accent,
                }}
              >
                {source.name}
              </div>
            </div>
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M ${left} 22 Q ${(left + object.x) / 2} 35 ${object.x} ${object.y}`}
                fill="none"
                stroke={cockpit.accent}
                strokeWidth={0.35}
                strokeOpacity={0.65}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
