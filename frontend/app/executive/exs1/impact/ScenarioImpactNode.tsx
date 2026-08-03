"use client";

import type { Exs1Object } from "../exs1Types";
import { ScenarioImpactBadge } from "./ScenarioImpactBadge";
import type { ScenarioImpactNode as ImpactNodeModel } from "./ScenarioImpactConfig";
import { IMPACT_STATUS_COLOR } from "./ScenarioImpactConfig";

type Props = {
  readonly object: Exs1Object;
  readonly node: ImpactNodeModel;
  readonly color: string;
  readonly active: boolean;
  readonly dimmed: boolean;
};

/**
 * ScenarioImpactNode — visual emphasis ring/halo for an impacted object.
 * Positioned over the Stage object (non-interactive).
 */
export function ScenarioImpactNode({
  object,
  node,
  color,
  active,
  dimmed,
}: Props) {
  const statusColor = IMPACT_STATUS_COLOR[node.status];
  const ring =
    node.behavior === "warning-ring" || node.behavior === "success-ring"
      ? statusColor
      : color;

  return (
    <div
      data-testid={`scenario-impact-node-${object.id}`}
      data-status={node.status}
      data-level={node.level}
      data-behavior={node.behavior}
      data-active={active ? "true" : "false"}
      aria-hidden
      style={{
        position: "absolute",
        left: `${object.x}%`,
        top: `${object.y}%`,
        transform: `translate(-50%, -50%) scale(${
          node.behavior === "growing" && active
            ? 1.04
            : node.behavior === "shrinking" && active
              ? 0.96
              : 1
        })`,
        width: "7.4rem",
        height: "7.4rem",
        borderRadius: "0.75rem",
        pointerEvents: "none",
        zIndex: 4,
        opacity: dimmed ? 0.25 : active ? 1 : 0.55,
        transition: "opacity 250ms ease, box-shadow 250ms ease, transform 250ms ease",
        boxShadow:
          node.behavior === "attention-halo"
            ? `0 0 28px ${statusColor}55`
            : node.behavior === "warning-ring"
              ? `0 0 0 2px ${ring}, 0 0 18px ${ring}66`
              : node.behavior === "success-ring"
                ? `0 0 0 2px ${ring}, 0 0 18px ${ring}55`
                : active
                  ? `0 0 0 1px ${color}66`
                  : "none",
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-0.15rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.25rem",
        }}
      >
        <ScenarioImpactBadge status={node.status} compact />
        <ScenarioImpactBadge level={node.level} compact />
      </div>
    </div>
  );
}
