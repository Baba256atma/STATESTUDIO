export type CrossDomainRelationshipType =
  | "operational_impact"
  | "financial_impact"
  | "delivery_impact"
  | "resource_impact"
  | "customer_impact"
  | "stability_impact"
  | "dependency_impact";

export type CrossDomainSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface CrossDomainInsight {
  id: string;
  sourceDomainId: string;
  targetDomainId: string;
  relationshipType: CrossDomainRelationshipType;
  title: string;
  summary: string;
  relatedObjectIds: string[];
  severity: CrossDomainSeverity;
  confidence: number;
  executiveImpact?: string;
  createdAt: number;
}

export type CrossDomainInfluenceRule = {
  sourceDomainId: string;
  targetDomainId: string;
  relationshipType: CrossDomainRelationshipType;
  label: string;
  explanation: string;
  baseConfidence: number;
};

export type CrossDomainCluster = {
  id: string;
  domainIds: string[];
  relatedObjectIds: string[];
  insightIds: string[];
  severity: CrossDomainSeverity;
  systemicImpactScore: number;
};

export type CrossDomainOverlayState = {
  topInsightId?: string;
  systemicImpactScore: number;
  relatedDomainIds: string[];
  relatedObjectIds: string[];
  executiveSummary: string;
};
