export type ResilienceState =
  | "fragile"
  | "recovering"
  | "stable"
  | "adaptive"
  | "resilient";

export interface OrganizationalResilienceSignal {
  id: string;
  title: string;
  summary: string;
  resilienceState: ResilienceState;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  resilienceScore: number;
  recoveryCapacity?: number;
  adaptationCapacity?: number;
  executiveImpact?: string;
  recommendedFocus?: string;
  confidence?: number;
  domainIds?: string[];
  createdAt: number;
}

export type ResilienceCluster = {
  id: string;
  relatedObjectIds: string[];
  relatedZoneIds: string[];
  domainIds: string[];
  resilienceScore: number;
  recoveryCapacity: number;
  adaptationCapacity: number;
};

export type OrganizationalResilienceOverlayState = {
  topSignalId?: string;
  headline: string;
  executiveSummary: string;
  resilienceState: ResilienceState;
  relatedObjectIds: string[];
  resilienceScore: number;
};
