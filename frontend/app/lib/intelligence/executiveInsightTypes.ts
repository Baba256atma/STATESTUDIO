export type ExecutiveInsightCategory =
  | "risk"
  | "fragility"
  | "scenario"
  | "dependency"
  | "financial"
  | "operational"
  | "capacity"
  | "stability";

export type ExecutiveInsightSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveInsightSourceType =
  | "scenario"
  | "propagation"
  | "fragility"
  | "relationship";

export type ExecutivePriorityTier =
  | "monitor"
  | "attention"
  | "urgent"
  | "critical";

export interface ExecutiveInsight {
  id: string;
  title: string;
  summary: string;
  category: ExecutiveInsightCategory;
  severity: ExecutiveInsightSeverity;
  confidence: number;
  priorityScore: number;
  affectedObjectIds: string[];
  recommendedFocus?: string;
  domainId?: string;
  sourceType?: ExecutiveInsightSourceType;
  createdAt: number;
}

export type ExecutiveInsightRankingResult = {
  insights: ExecutiveInsight[];
  topInsight: ExecutiveInsight | null;
  tiers: Record<ExecutivePriorityTier, ExecutiveInsight[]>;
};
