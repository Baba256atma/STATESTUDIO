export type InterventionCategory =
  | "stabilize"
  | "reduce_dependency"
  | "increase_visibility"
  | "contain_propagation"
  | "rebalance_resources"
  | "diversify"
  | "strengthen_monitoring"
  | "reduce_coupling";

export type StrategicInterventionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface StrategicIntervention {
  id: string;
  title: string;
  summary: string;
  category: InterventionCategory;
  relatedObjectIds: string[];
  targetZoneIds?: string[];
  expectedImpact?: string;
  propagationReductionPotential?: number;
  confidence?: number;
  priority: StrategicInterventionPriority;
  executiveRationale?: string;
  domainIds?: string[];
  createdAt: number;
}

export type InterventionOpportunity = {
  id: string;
  category: InterventionCategory;
  relatedObjectIds: string[];
  targetZoneIds: string[];
  domainIds: string[];
  leverageScore: number;
  rationale: string;
};

export type StrategicInterventionOverlayState = {
  topInterventionId?: string;
  headline: string;
  executiveSummary: string;
  priority: StrategicInterventionPriority;
  relatedObjectIds: string[];
};

export type StabilizationPathwayStep = {
  id: string;
  order: number;
  interventionId: string;
  title: string;
  expectedImpact?: string;
};
