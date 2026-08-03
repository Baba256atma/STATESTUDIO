"use client";

import { useContext } from "react";
import { EXS1_OBJECTS } from "../mock/exs1Mock";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveSimulationContext } from "./ExecutiveSimulationProvider";

/**
 * Director overlay — current vs future, changed objects, impact paths.
 * Does not replace Runtime model.
 */
export function ExecutiveSimulationOverlay() {
  const simulation = useContext(ExecutiveSimulationContext);
  const session = simulation?.activeSession ?? null;
  const overlayActive = simulation?.overlayActive ?? false;

  if (!overlayActive || !session?.results) return null;

  const changed = session.results.future.objects.filter((o) => o.delta !== 0);
  const impacts = session.results.impact.impacts.slice(0, 4);

  return (
    <div
      data-testid="executive-simulation-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 8,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(55% 50% at 50% 42%, rgba(253,176,34,0.14) 0%, transparent 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "0.35rem 0.7rem",
          borderRadius: cockpit.radius.pill,
          border: `1px solid ${cockpit.borderStrong}`,
          background: cockpit.glass,
          color: "#FDB022",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Simulation Overlay · Current Runtime remains · {session.scenarioLabel}
      </div>

      {changed.map((object, index) => {
        const stageObject =
          EXS1_OBJECTS.find((o) => o.id === object.objectId) ??
          EXS1_OBJECTS[index % EXS1_OBJECTS.length];
        if (!stageObject) return null;
        return (
          <div
            key={object.objectId}
            data-testid={`simulation-overlay-object-${object.objectId}`}
            data-delta={object.delta}
            style={{
              position: "absolute",
              left: `${stageObject.x}%`,
              top: `${Math.max(12, stageObject.y - 10)}%`,
              transform: "translate(-50%, -50%)",
              minWidth: "6.5rem",
              padding: "0.4rem 0.5rem",
              borderRadius: cockpit.radius.sm,
              border: `1px solid ${object.delta >= 0 ? "#12B76A66" : "#F9706666"}`,
              background:
                object.delta >= 0
                  ? "rgba(18,183,106,0.16)"
                  : "rgba(249,112,102,0.16)",
              color: cockpit.text,
              fontSize: "0.62rem",
              boxShadow: cockpit.elevation.asset,
            }}
          >
            <div style={{ fontWeight: 600 }}>{object.label}</div>
            <div style={{ color: cockpit.muted }}>
              {object.current} → {object.future} ({object.delta >= 0 ? "+" : ""}
              {object.delta})
            </div>
          </div>
        );
      })}

      <div
        data-testid="simulation-overlay-propagation"
        style={{
          position: "absolute",
          bottom: "1.1rem",
          left: "1.1rem",
          right: "1.1rem",
          padding: "0.45rem 0.6rem",
          borderRadius: cockpit.radius.md,
          border: `1px solid ${cockpit.border}`,
          background: "rgba(10,14,20,0.82)",
          color: cockpit.textSoft,
          fontSize: "0.66rem",
        }}
      >
        Propagation ·{" "}
        {impacts
          .map((i) => `${i.label} ${i.direction}/${i.level}`)
          .join(" → ") || "—"}
        {" · "}
        Risk {session.results.risk.level}
      </div>
    </div>
  );
}
