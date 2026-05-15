export type OperationalPropagationRiskLevel = "low" | "medium" | "high" | "critical";

export type OperationalPropagationNode = Readonly<{
  objectId: string;
  riskLevel: OperationalPropagationRiskLevel;
  propagationScore: number;
  sourceObjectId: string;
  reason: string;
  affectedByChangeIds: readonly string[];
  estimatedImpact: string;
}>;

export type OperationalPropagationPreview = Readonly<{
  id: string;
  sourceObjectIds: readonly string[];
  affectedObjectIds: readonly string[];
  propagationNodes: readonly OperationalPropagationNode[];
  highestRiskLevel: OperationalPropagationRiskLevel;
  summary: string;
  generatedAt: string;
}>;
