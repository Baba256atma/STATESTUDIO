/**
 * Hub topology — central hub with satellites on a circular ring.
 */

import { logHubTopologyGenerating } from "./hubTopologyDevLog.ts";
import type { TopologyConnection, TopologyNode, TopologyResult } from "./topologyTypes.ts";

export const HUB_RADIUS = 8;

function roundPosition(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function buildHubConnections(hubId: string, satellites: TopologyNode[]): TopologyConnection[] {
  return satellites.map((satellite) => ({
    sourceId: hubId,
    targetId: satellite.id,
  }));
}

function resolveSatelliteAngleRadians(satelliteIndex: number, satelliteCount: number): number {
  if (satelliteCount <= 0) return 0;
  return (Math.PI * 2 * satelliteIndex) / satelliteCount;
}

function positionSatellite(satelliteIndex: number, satelliteCount: number): TopologyNode["position"] {
  const angle = resolveSatelliteAngleRadians(satelliteIndex, satelliteCount);
  return {
    x: roundPosition(HUB_RADIUS * Math.cos(angle)),
    y: 0,
    z: roundPosition(HUB_RADIUS * Math.sin(angle)),
  };
}

/**
 * First node is the hub at origin; remaining nodes are satellites on a circle (y = 0).
 */
export function generateHubTopology(nodes: TopologyNode[]): TopologyResult {
  const ordered = nodes.map((node) => ({
    id: node.id,
    name: node.name,
  }));

  if (ordered.length === 0) {
    logHubTopologyGenerating("—", 0, 0);
    return {
      topology: "hub",
      nodes: [],
      generatedAt: Date.now(),
    };
  }

  const hub = ordered[0]!;
  const satellites = ordered.slice(1);
  const positioned: TopologyNode[] = [
    {
      ...hub,
      position: { x: 0, y: 0, z: 0 },
    },
    ...satellites.map((satellite, index) => ({
      ...satellite,
      position: positionSatellite(index, satellites.length),
    })),
  ];

  const connections = buildHubConnections(hub.id, satellites);
  logHubTopologyGenerating(hub.name, satellites.length, connections.length);

  return {
    topology: "hub",
    nodes: positioned,
    connections: connections.length > 0 ? connections : undefined,
    generatedAt: Date.now(),
  };
}
