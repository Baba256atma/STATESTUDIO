export type DecisionGraphNodeType =
  | "signal"
  | "risk"
  | "scenario"
  | "comparison"
  | "recommendation"
  | "confidence"
  | "monitoring"
  | "memory"
  | "narrative";

export type DecisionGraphSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface StrategicDecisionGraphNode {
  id: string;
  type: DecisionGraphNodeType;
  title: string;
  summary?: string;
  relatedObjectIds?: string[];
  sourceId?: string;
  confidence?: number;
  severity?: DecisionGraphSeverity;
  createdAt: number;
}

export interface StrategicDecisionGraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  weight?: number;
  rationale?: string;
}

export interface StrategicDecisionGraph {
  id: string;
  nodes: StrategicDecisionGraphNode[];
  edges: StrategicDecisionGraphEdge[];
  headline?: string;
  executiveSummary?: string;
  createdAt: number;
}

export type StrategicDecisionPath = {
  id: string;
  nodeIds: string[];
  headline: string;
  executiveSummary: string;
};

export type StrategicDecisionGraphOverlayState = {
  graphId?: string;
  headline: string;
  executiveSummary: string;
  primaryPathNodeIds: string[];
  relatedObjectIds: string[];
};
