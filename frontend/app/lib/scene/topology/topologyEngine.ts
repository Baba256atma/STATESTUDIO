/**
 * Type-C topology engine — single entry point for scene object positioning strategies.
 */

import { generateAutoTopology } from "./topologyAutoSelector.ts";
import { logTopologyGenerating, logTopologyInitializedOnce } from "./topologyDevLog.ts";
import { getTopologyGenerator } from "./topologyRegistry.ts";
import type { TopologyNode, TopologyResult, TopologyType } from "./topologyTypes.ts";

function normalizeTopologyNode(node: TopologyNode): TopologyNode {
  const id = String(node.id ?? "").trim();
  const name = String(node.name ?? id).trim() || id;
  if (!id) {
    throw new Error("TopologyNode requires a non-empty id");
  }
  const position = node.position;
  const hasPosition =
    position != null &&
    Number.isFinite(position.x) &&
    Number.isFinite(position.y) &&
    Number.isFinite(position.z);
  return {
    id,
    name,
    ...(hasPosition
      ? {
          position: {
            x: position.x,
            y: position.y,
            z: position.z,
          },
        }
      : {}),
  };
}

function normalizeTopologyNodes(nodes: TopologyNode[]): TopologyNode[] {
  return nodes.map(normalizeTopologyNode);
}

function coalesceTopologyNodes(nodes?: TopologyNode[] | null): TopologyNode[] {
  return Array.isArray(nodes) ? nodes : [];
}

/**
 * Generate a topology result for the given type and scene nodes.
 * Canonical entry point — routes through registry (or auto selector).
 */
export function generateTopology(
  topology: TopologyType,
  nodes?: TopologyNode[] | null
): TopologyResult {
  logTopologyInitializedOnce();
  const normalized = normalizeTopologyNodes(coalesceTopologyNodes(nodes));

  if (topology === "auto") {
    return generateAutoTopology(normalized);
  }

  logTopologyGenerating(topology, normalized.length);

  const generator = getTopologyGenerator(topology);
  const layout = generator(normalized);

  return {
    topology,
    nodes: layout.nodes,
    connections: layout.connections,
    generatedAt: Date.now(),
  };
}
