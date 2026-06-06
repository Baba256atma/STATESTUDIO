import type { SceneConnectionLine } from "./topologyConnectionTypes.ts";

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function buildTopologyConnectionGeometrySignature(
  lines: readonly SceneConnectionLine[]
): string {
  if (!lines.length) return "empty";
  return lines
    .filter((line) => line.valid)
    .map(
      (line) =>
        `${line.id}:${line.sourceId}->${line.targetId}:${round3(line.sourcePosition.x)},${round3(line.sourcePosition.y)},${round3(line.sourcePosition.z)}:${round3(line.targetPosition.x)},${round3(line.targetPosition.y)},${round3(line.targetPosition.z)}`
    )
    .sort()
    .join("|");
}

export function buildConnectionEndpointsSignature(
  connections: readonly { sourceId: string; targetId: string }[]
): string {
  if (!connections.length) return "empty";
  return connections
    .map((connection) => `${connection.sourceId}->${connection.targetId}`)
    .sort()
    .join("|");
}

export function buildRuntimeLayoutPositionsSignature(
  positions: Record<string, [number, number, number]> | undefined
): string {
  if (!positions) return "empty";
  return Object.keys(positions)
    .sort()
    .map((id) => {
      const tuple = positions[id];
      if (!tuple) return `${id}:null`;
      return `${id}:${round3(tuple[0])},${round3(tuple[1])},${round3(tuple[2])}`;
    })
    .join("|");
}

export type OverlayFlowEdgeInput = {
  from: string;
  to: string;
};

export function buildOverlayFlowGeometrySignature(input: {
  edges: readonly OverlayFlowEdgeInput[];
  objectIds: readonly string[];
  yOffset: number;
  positionSignature?: string;
}): string {
  const edgeSig = input.edges
    .map((edge) => `${edge.from}->${edge.to}`)
    .sort()
    .join("|");
  const objectSig = [...input.objectIds].sort().join("|");
  return JSON.stringify({
    edges: edgeSig,
    objects: objectSig,
    yOffset: round3(input.yOffset),
    positions: input.positionSignature ?? "runtime",
  });
}

export function buildLoopEdgesGeometrySignature(input: {
  edges: readonly { from: string; to: string }[];
  positionSignature: string;
}): string {
  const edgeSig = input.edges
    .map((edge) => `${edge.from}->${edge.to}`)
    .sort()
    .join("|");
  return `${edgeSig}::${input.positionSignature}`;
}
