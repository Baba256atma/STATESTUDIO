/**
 * Flow topology — horizontal executive workflow layout (left → right).
 */

import { logFlowTopologyGenerating } from "./flowTopologyDevLog.ts";
import type { TopologyConnection, TopologyNode, TopologyResult } from "./topologyTypes.ts";

export const FLOW_NODE_SPACING = 4;

function buildFlowConnections(nodes: TopologyNode[]): TopologyConnection[] {
  const connections: TopologyConnection[] = [];
  for (let index = 0; index < nodes.length - 1; index += 1) {
    const source = nodes[index];
    const target = nodes[index + 1];
    if (!source || !target) continue;
    connections.push({
      sourceId: source.id,
      targetId: target.id,
    });
  }
  return connections;
}

/**
 * Position nodes in incoming order along the X axis; y = 0, z = 0 for all nodes.
 */
export function generateFlowTopology(nodes: TopologyNode[]): TopologyResult {
  const ordered = nodes.map((node) => ({
    id: node.id,
    name: node.name,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  }));

  ordered.forEach((node, index) => {
    node.position = {
      x: index * FLOW_NODE_SPACING,
      y: 0,
      z: 0,
    };
  });

  const connections = buildFlowConnections(ordered);
  logFlowTopologyGenerating(ordered.length, connections.length);

  return {
    topology: "flow",
    nodes: ordered,
    connections: connections.length > 0 ? connections : undefined,
    generatedAt: Date.now(),
  };
}
