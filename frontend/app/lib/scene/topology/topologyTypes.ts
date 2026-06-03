/**
 * Type-C scene positioning topology contracts (MVP foundation).
 */

/** Layout generators implemented for MVP auto selection. */
export type ResolvedTopologyType = "flow" | "hub";

export type TopologyType = ResolvedTopologyType | "ring" | "cluster" | "hybrid" | "auto";

export interface TopologyNode {
  id: string;
  name: string;
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
