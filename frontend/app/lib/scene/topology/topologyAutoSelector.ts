/**
 * MVP auto topology selection — deterministic rules by node count only.
 */

import { generateFlowTopology } from "./flowTopologyGenerator.ts";
import { generateHubTopology } from "./hubTopologyGenerator.ts";
import { logTopologyAutoSelection } from "./topologyAutoDevLog.ts";
import type { ResolvedTopologyType, TopologyNode, TopologyResult } from "./topologyTypes.ts";

export function formatTopologySelectionReason(
  nodeCount: number,
  selected: ResolvedTopologyType
): string {
  const label = selected === "flow" ? "Flow Topology" : "Hub Topology";
  return `${nodeCount} node${nodeCount === 1 ? "" : "s"} -> ${label}`;
}

/**
 * Select the most readable topology for executives based on node count only.
 */
export function selectTopology(nodes: TopologyNode[]): ResolvedTopologyType {
  const nodeCount = nodes.length;

  if (nodeCount === 0) {
    return "flow";
  }
  if (nodeCount === 1) {
    return "hub";
  }
  if (nodeCount >= 2 && nodeCount <= 4) {
    return "flow";
  }
  if (nodeCount >= 5 && nodeCount <= 12) {
    return "hub";
  }

  return "hub";
}

function resolveLayout(nodeCount: number, selected: ResolvedTopologyType, nodes: TopologyNode[]) {
  const layout =
    selected === "flow" ? generateFlowTopology(nodes) : generateHubTopology(nodes);
  const selectionReason = formatTopologySelectionReason(nodeCount, selected);
  logTopologyAutoSelection({
    nodeCount,
    selected,
    reason: selectionReason,
  });
  return { layout, selectionReason };
}

/**
 * Count nodes → select topology → generate layout → return result with auto metadata.
 */
export function generateAutoTopology(nodes?: TopologyNode[] | null): TopologyResult {
  const safeNodes = Array.isArray(nodes) ? nodes : [];
  const nodeCount = safeNodes.length;
  const selected = selectTopology(safeNodes);
  const { layout, selectionReason } = resolveLayout(nodeCount, selected, safeNodes);

  return {
    topology: layout.topology,
    nodes: layout.nodes,
    connections: layout.connections,
    generatedAt: layout.generatedAt,
    autoSelected: true,
    selectionReason,
  };
}
