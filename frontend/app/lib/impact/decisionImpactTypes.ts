export type DecisionImpactNodeRole =
  | "source"
  | "primary_effect"
  | "secondary_effect"
  | "downstream_risk"
  | "stabilizer"
  | "context";

export type DecisionImpactEdgeRole =
  | "impact_path"
  | "tradeoff_path"
  | "stabilizing_path"
  | "risk_path";

export type DecisionImpactNode = {
  object_id: string;
  role: DecisionImpactNodeRole;
  strength: number;
  depth: number;
  direction?: "upstream" | "downstream" | "mixed";
  rationale?: string | null;
};

export type DecisionImpactEdge = {
  from_id: string;
  to_id: string;
  strength: number;
  depth: number;
  role: DecisionImpactEdgeRole;
};

export type DecisionImpactState = {
  active: boolean;
  source_object_id: string | null;
  action_label?: string | null;
  nodes: DecisionImpactNode[];
  edges: DecisionImpactEdge[];
  mode: "impact";
  meta: {
    version: string;
    source: string;
    confidence: number;
    timestamp: number;
  };
};

export type DecisionImpactSummary = {
  title: string;
  summary: string;
  topAffectedObjectIds: string[];
  strongestDownstreamObjectId: string | null;
  strongestPathLabel: string | null;
  actionLabel: string | null;
  confidence: number;
};
