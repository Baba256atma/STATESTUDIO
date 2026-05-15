export type TimelineTrend =
  | "stable"
  | "improving"
  | "degrading"
  | "volatile"
  | "critical";

export type TimelineStage =
  | "early_signal"
  | "emerging_pressure"
  | "active_risk"
  | "stabilization"
  | "monitoring";

export interface TimelineIntelligence {
  id: string;
  title: string;
  summary: string;
  relatedObjectIds: string[];
  trend: TimelineTrend;
  momentumScore: number;
  confidence: number;
  executiveImpact?: string;
  recommendedAttention?: string;
  domainId?: string;
  createdAt: number;
}

export type TimelineMemorySnapshot = {
  previousTrend?: TimelineTrend;
  previousSeverity?: "low" | "medium" | "high" | "critical";
  previousRecommendationPriority?: "low" | "medium" | "high" | "critical";
  previousPropagationIntensity?: number;
};

export type TimelineIntelligenceOverlayState = {
  topTimelineIntelligenceId?: string;
  trend: TimelineTrend;
  timelineStage: TimelineStage;
  momentumScore: number;
  relatedObjectIds: string[];
  executiveSummary: string;
};
