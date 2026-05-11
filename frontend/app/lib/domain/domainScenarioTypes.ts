import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainScenarioSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

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
  type:
    | "mitigation"
    | "optimization"
    | "containment"
    | "fallback"
    | "expansion";
  confidence: number;
  severity: DomainScenarioSeverity;
  relatedObjectIds: string[];
  relatedSignalIds?: string[];
  impacts: DomainScenarioImpact[];
  recommendedActions: string[];
  executiveSummary: string;
  metadata?: Record<string, unknown>;
};
