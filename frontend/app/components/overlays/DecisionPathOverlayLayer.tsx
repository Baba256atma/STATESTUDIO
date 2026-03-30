"use client";

import React, { useEffect, useMemo } from "react";

import type { DecisionPathOverlayState } from "../../lib/simulation/decisionPathOverlayTypes";

export type DecisionPathNarrativeNodeRole = "primary" | "affected" | "context" | "outside";
export type DecisionPathNarrativeEdgeRole = "path" | "secondary" | "outside";

export type DecisionPathNodeVisualHints = {
  isCriticalPath: boolean;
  isLeveragePoint: boolean;
  isBottleneck: boolean;
  isProtected: boolean;
};

export type DecisionPathRendererEdge = {
  from: string;
  to: string;
  narrativeRole: DecisionPathNarrativeEdgeRole;
  depth: number;
  strength: number;
};

export type DecisionPathRendererState = {
  active: boolean;
  sourceId: string | null;
  overlay: DecisionPathOverlayState | null;
  nodeRoleById: Record<string, DecisionPathNarrativeNodeRole>;
  nodeStrengthById: Record<string, number>;
  nodeVisualHintsById: Record<string, DecisionPathNodeVisualHints>;
  edges: DecisionPathRendererEdge[];
  mode: "decision_path" | "mixed" | "idle";
};

function mapDecisionNodeRoleToNarrativeRole(
  role: DecisionPathOverlayState["nodes"][number]["role"]
): DecisionPathNarrativeNodeRole {
  switch (role) {
    case "source":
    case "leverage":
    case "destination":
      return "primary";
    case "impacted":
    case "bottleneck":
      return "affected";
    case "protected":
    case "context":
      return "context";
    default:
      return "outside";
  }
}

function mapDecisionEdgeRoleToNarrativeRole(
  role: DecisionPathOverlayState["edges"][number]["role"]
): DecisionPathNarrativeEdgeRole {
  switch (role) {
    case "primary_path":
      return "path";
    case "secondary_path":
    case "feedback":
    case "tradeoff":
      return "secondary";
    case "supporting":
    default:
      return "outside";
  }
}

function traceDecisionPathOverlay(payload: {
  nodeCount: number;
  edgeCount: number;
  sourceId: string | null;
  mode: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  console.debug("[Nexora][DecisionPathOverlay]", payload);
}

function buildDecisionPathRendererState(
  overlay: DecisionPathOverlayState | null | undefined
): DecisionPathRendererState {
  if (!overlay?.active) {
    return {
      active: false,
      sourceId: null,
      overlay: null,
      nodeRoleById: {},
      nodeStrengthById: {},
      nodeVisualHintsById: {},
      edges: [],
      mode: "idle",
    };
  }

  const nodeRoleById: Record<string, DecisionPathNarrativeNodeRole> = {};
  const nodeStrengthById: Record<string, number> = {};
  const nodeVisualHintsById: Record<string, DecisionPathNodeVisualHints> = {};

  overlay.nodes.forEach((node) => {
    nodeRoleById[node.id] = mapDecisionNodeRoleToNarrativeRole(node.role);
    nodeStrengthById[node.id] = Math.max(nodeStrengthById[node.id] ?? 0, node.strength);
    nodeVisualHintsById[node.id] = {
      isCriticalPath: node.role === "source" || node.role === "destination",
      isLeveragePoint: node.role === "leverage",
      isBottleneck: node.role === "bottleneck",
      isProtected: node.role === "protected",
    };
  });

  const edges = overlay.edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    narrativeRole: mapDecisionEdgeRoleToNarrativeRole(edge.role),
    depth: edge.depth,
    strength: edge.strength,
  }));

  return {
    active: true,
    sourceId: overlay.sourceId,
    overlay,
    nodeRoleById,
    nodeStrengthById,
    nodeVisualHintsById,
    edges,
    mode: "decision_path",
  };
}

export function DecisionPathOverlayLayer({
  overlay,
  children,
}: {
  overlay: DecisionPathOverlayState | null;
  children: (state: DecisionPathRendererState) => React.ReactNode;
}) {
  const renderState = useMemo(() => buildDecisionPathRendererState(overlay), [overlay]);

  useEffect(() => {
    if (!renderState.active) return;
    traceDecisionPathOverlay({
      nodeCount: renderState.overlay?.nodes.length ?? 0,
      edgeCount: renderState.overlay?.edges.length ?? 0,
      sourceId: renderState.sourceId,
      mode: renderState.mode,
    });
  }, [renderState]);

  return <>{children(renderState)}</>;
}
