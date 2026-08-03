"use client";

import type { Exs1Object, Exs1ObjectId } from "../exs1Types";
import type { ScenarioImpactNode } from "./ScenarioImpactConfig";
import { IMPACT_TRANSITION_MS } from "./ScenarioImpactConfig";

type Props = {
  readonly objects: readonly Exs1Object[];
  readonly chain: readonly ScenarioImpactNode[];
  readonly color: string;
  readonly propagationStep: number;
  readonly pathId: string;
};

type ScenarioImpactPathPoint = {
  readonly id: Exs1ObjectId;
  readonly x: number;
  readonly y: number;
  readonly order: number;
};

/**
 * ScenarioImpactPath — animated cause-chain arrows between impact nodes.
 */
export function ScenarioImpactPath({
  objects,
  chain,
  color,
  propagationStep,
  pathId,
}: Props) {
  const points = chain.reduce<ScenarioImpactPathPoint[]>((result, node) => {
    const object = objects.find((o) => o.id === node.objectId);
    if (!object) return result;
    result.push({
      x: object.x,
      y: object.y,
      order: node.order,
      id: node.objectId,
    });
    return result;
  }, []);

  points.sort((a, b) => a.order - b.order);

  if (points.length < 2) {
    return null;
  }

  return (
    <svg
      data-testid={`scenario-impact-path-${pathId}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <defs>
        <marker
          id={`impact-arrow-${pathId}`}
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill={color} />
        </marker>
      </defs>
      {points.slice(0, -1).map((from, index) => {
        const to = points[index + 1];
        if (!to) return null;
        const lit = propagationStep > index;
        return (
          <g key={`${from.id}-${to.id}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={color}
              strokeWidth={lit ? 0.55 : 0.28}
              strokeOpacity={lit ? 0.95 : 0.25}
              strokeLinecap="round"
              markerEnd={`url(#impact-arrow-${pathId})`}
              style={{
                transition: `stroke-opacity ${IMPACT_TRANSITION_MS}ms ease, stroke-width ${IMPACT_TRANSITION_MS}ms ease`,
              }}
            />
            {lit ? (
              <circle
                cx={(from.x + to.x) / 2}
                cy={(from.y + to.y) / 2}
                r={0.7}
                fill={color}
                opacity={0.85}
              >
                <animate
                  attributeName="r"
                  values="0.4;0.9;0.4"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
