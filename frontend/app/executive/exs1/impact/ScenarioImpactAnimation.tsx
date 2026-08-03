"use client";

import type { Exs1Object } from "../exs1Types";
import { IMPACT_TRANSITION_MS } from "./ScenarioImpactConfig";

type Props = {
  readonly rootObject: Exs1Object | null;
  readonly color: string;
  readonly rippleKey: number;
  readonly active: boolean;
};

/**
 * ScenarioImpactAnimation — ripple waves from root object.
 */
export function ScenarioImpactAnimation({
  rootObject,
  color,
  rippleKey,
  active,
}: Props) {
  if (!active || !rootObject) return null;

  return (
    <div
      data-testid="scenario-impact-animation"
      data-ripple-key={rippleKey}
      aria-hidden
      style={{
        position: "absolute",
        left: `${rootObject.x}%`,
        top: `${rootObject.y}%`,
        transform: "translate(-50%, -50%)",
        width: "2rem",
        height: "2rem",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={`${rippleKey}-${index}`}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            border: `1.5px solid ${color}`,
            opacity: 0,
            animation: `exs4-ripple ${IMPACT_TRANSITION_MS * 4}ms ease-out ${index * 180}ms infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes exs4-ripple {
          0% { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(4.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
