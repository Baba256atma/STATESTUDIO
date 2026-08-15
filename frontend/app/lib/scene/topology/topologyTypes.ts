/**
 * Type-C scene positioning topology contracts (MVP foundation).
 *
 * STAGE-2D:1 presentation invariant (Executive Stage):
 *   Stage plane = X / Y, depth = Z, canonical depth z = 0.
 * Keep `z` on the shared type for compatibility; generators and Stage
 * consumers must treat z = 0 as the presentation contract (do not use Z
 * to separate objects visually).
 */

/** Layout generators implemented for MVP auto selection. */
export type ResolvedTopologyType = "flow" | "hub";

export type TopologyType = ResolvedTopologyType | "ring" | "cluster" | "hybrid" | "auto";

export interface TopologyNode {
  id: string;
  name: string;
  /**
   * World/layout position. Executive Stage presentation requires z === 0
   * (STAGE-2D:1). Legacy Type-C hub may still emit XZ rings — report only.
   */
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface TopologyConnection {
  sourceId: string;
  targetId: string;
}

export interface TopologyLayoutOutput {
  nodes: TopologyNode[];
  connections?: TopologyConnection[];
}

export interface TopologyResult {
  topology: ResolvedTopologyType | Exclude<TopologyType, ResolvedTopologyType | "auto">;
  nodes: TopologyNode[];
  generatedAt: number;
  connections?: TopologyConnection[];
  autoSelected?: boolean;
  selectionReason?: string;
}

export type TopologyLayoutGenerator = (nodes: TopologyNode[]) => TopologyLayoutOutput;
