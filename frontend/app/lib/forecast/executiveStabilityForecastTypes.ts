export type StabilityForecastDirection =
  | "improving"
  | "stable"
  | "degrading"
  | "volatile"
  | "uncertain";

export type ForecastHorizon =
  | "immediate"
  | "near_term"
  | "monitoring_period";

export interface ExecutiveStabilityForecast {
  id: string;
  title: string;
  summary: string;
  direction: StabilityForecastDirection;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  relatedRecommendationIds?: string[];
  confidence: number;
  uncertaintyFactors?: string[];
  monitoringFocus?: string;
  executiveRationale?: string;
  domainIds?: string[];
  createdAt: number;
}

export type StabilityDirectionScore = {
  direction: StabilityForecastDirection;
  score: number;
  confidence: number;
};

export type ExecutiveStabilityForecastOverlayState = {
  topForecastId?: string;
  direction: StabilityForecastDirection;
  headline: string;
  executiveSummary: string;
  monitoringFocus: string;
  confidence: number;
};
