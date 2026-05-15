export type StrategicDriftType =
  | "fragility_reemergence"
  | "propagation_expansion"
  | "coordination_decay"
  | "monitoring_gap"
  | "confidence_erosion"
  | "intervention_decay"
  | "stability_regression";

export interface StrategicDriftSignal {
  id: string;
  title: string;
  summary: string;
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  driftIntensity: number;
  stabilityDeviation?: number;
  confidence?: number;
  executiveImpact?: string;
  recommendedAttention?: string;
  domainIds?: string[];
  createdAt: number;
}

export type StabilityBaseline = {
  id: string;
  relatedObjectIds: string[];
  relatedZoneIds: string[];
  sourceIds: string[];
  baselineStrength: number;
  stabilityScore: number;
  domainIds: string[];
  createdAt: number;
};

export type StrategicDriftPattern = {
  id: string;
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
  recurrenceScore: number;
  description: string;
};

export type StrategicDriftOverlayState = {
  topSignalId?: string;
  headline: string;
  executiveSummary: string;
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
  driftIntensity: number;
};
