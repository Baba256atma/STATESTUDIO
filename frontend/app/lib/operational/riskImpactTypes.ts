export type OperationalRiskExposureLevel = "minimal" | "elevated" | "high" | "critical";

/** Deterministic attention tier for executives (read model only). */
export type OperationalAttentionRecommendation = "watch" | "heightened" | "executive" | "urgent";

export type OperationalRiskImpactNode = Readonly<{
  objectId: string;
  exposureLevel: OperationalRiskExposureLevel;
  operationalSeverity: number;
  propagationScore: number;
  fragilityScore?: number;
  affectedSignals: readonly string[];
  impactReason: string;
  recommendedAttentionLevel: OperationalAttentionRecommendation;
}>;

export type OperationalRiskImpactMap = Readonly<{
  id: string;
  nodes: readonly OperationalRiskImpactNode[];
  highestExposureLevel: OperationalRiskExposureLevel;
  affectedObjectIds: readonly string[];
  mostFragileObjectId?: string;
  summary: string;
  executiveRiskHeadline: string;
  generatedAt: string;
}>;
