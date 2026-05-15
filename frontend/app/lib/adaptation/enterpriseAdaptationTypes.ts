export type AdaptationState =
  | "rigid"
  | "strained"
  | "adjusting"
  | "adaptive"
  | "evolving";

export interface EnterpriseAdaptationSignal {
  id: string;
  title: string;
  summary: string;
  adaptationState: AdaptationState;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  flexibilityScore?: number;
  adaptationCapacity?: number;
  coordinationAdaptability?: number;
  executiveImpact?: string;
  recommendedFocus?: string;
  confidence?: number;
  domainIds?: string[];
  createdAt: number;
}

export type AdaptationBottleneck = {
  id: string;
  label: string;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  severity: "low" | "medium" | "high" | "critical";
  rationale: string;
};

export type EnterpriseAdaptationOverlayState = {
  topSignalId?: string;
  headline: string;
  executiveSummary: string;
  adaptationState: AdaptationState;
  relatedObjectIds: string[];
  bottleneckCount: number;
};
