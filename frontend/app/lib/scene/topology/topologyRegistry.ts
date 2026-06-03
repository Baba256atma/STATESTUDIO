/**
 * Registry mapping topology types to layout generators.
 */

import { generateFlowTopology } from "./flowTopologyGenerator.ts";
import { generateHubTopology } from "./hubTopologyGenerator.ts";
import type {
  TopologyLayoutGenerator,
  TopologyLayoutOutput,
  TopologyNode,
  TopologyType,
} from "./topologyTypes.ts";

type RegisteredTopologyType = Exclude<TopologyType, "auto">;

function createPlaceholderGenerator(_topology: RegisteredTopologyType): TopologyLayoutGenerator {
  return (nodes: TopologyNode[]): TopologyLayoutOutput => ({
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.name,
      ...(node.position
        ? {
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
          }
        : {}),
    })),
  });
}

function flowTopologyGenerator(nodes: TopologyNode[]): TopologyLayoutOutput {
  const result = generateFlowTopology(nodes);
  return {
    nodes: result.nodes,
    connections: result.connections,
  };
}

function hubTopologyGenerator(nodes: TopologyNode[]): TopologyLayoutOutput {
  const result = generateHubTopology(nodes);
  return {
    nodes: result.nodes,
    connections: result.connections,
  };
}

export type TopologyRegistry = Readonly<Record<RegisteredTopologyType, TopologyLayoutGenerator>>;

export const topologyRegistry: TopologyRegistry = Object.freeze({
  flow: flowTopologyGenerator,
  hub: hubTopologyGenerator,
  ring: createPlaceholderGenerator("ring"),
  cluster: createPlaceholderGenerator("cluster"),
  hybrid: createPlaceholderGenerator("hybrid"),
});

export function getTopologyGenerator(topology: RegisteredTopologyType): TopologyLayoutGenerator {
  return topologyRegistry[topology];
}
