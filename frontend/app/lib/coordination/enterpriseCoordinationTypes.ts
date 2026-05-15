export type CoordinationDependencyType =
  | "operational_alignment"
  | "cross_domain_sync"
  | "resource_dependency"
  | "monitoring_dependency"
  | "execution_dependency"
  | "communication_dependency";

export interface EnterpriseCoordinationInsight {
  id: string;
  title: string;
  summary: string;
  dependencyType: CoordinationDependencyType;
  relatedObjectIds: string[];
  relatedDomainIds?: string[];
  coordinationComplexity?: number;
  synchronizationRisk?: number;
  executiveImpact?: string;
  recommendedFocus?: string;
  confidence?: number;
  createdAt: number;
}

export type CoordinationCluster = {
  id: string;
  relatedObjectIds: string[];
  relatedDomainIds: string[];
  sourceInsightIds: string[];
  coordinationComplexity: number;
  synchronizationRisk: number;
};

export type EnterpriseCoordinationOverlayState = {
  topInsightId?: string;
  headline: string;
  executiveSummary: string;
  dependencyType: CoordinationDependencyType;
  relatedObjectIds: string[];
  relatedDomainIds: string[];
  coordinationComplexity: number;
};
