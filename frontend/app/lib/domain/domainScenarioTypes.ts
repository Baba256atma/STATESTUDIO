import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainScenarioSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DomainScenarioType =
  | "delay"
  | "bottleneck"
  | "instability"
  | "overload"
  | "dependency_failure"
  | "resource_constraint"
  | "financial_pressure"
  | "communication_breakdown";

export type DomainScenarioActionType =
  | "mitigation"
  | "optimization"
  | "containment"
  | "fallback"
  | "expansion";

export type DomainScenarioImpact = {
  category:
    | "risk"
    | "cost"
    | "timeline"
    | "stability"
    | "confidence";
  direction:
    | "increase"
    | "decrease"
    | "neutral";
  magnitude: number;
};

export type DomainScenario = {
  id: string;
  domainId: NexoraDomainId;
  title: string;
  description: string;
  type: DomainScenarioActionType | DomainScenarioType;
  confidence: number;
  severity: DomainScenarioSeverity;
  relatedObjectIds: string[];
  affectedObjectIds?: string[];
  relatedSignalIds?: string[];
  impacts: DomainScenarioImpact[];
  recommendedActions: string[];
  executiveSummary: string;
  probableImpact?: string;
  recommendedFocus?: string;
  createdAt?: number;
  metadata?: Record<string, unknown>;
};
