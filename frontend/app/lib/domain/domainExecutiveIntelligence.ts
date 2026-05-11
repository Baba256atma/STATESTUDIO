import type { NexoraDomainId } from "./domainTypes.ts";

export type ExecutivePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ExecutiveDecisionPosture =
  | "stable"
  | "watch"
  | "cautious"
  | "fragile"
  | "critical";

export type DomainExecutiveInsight = {
  id: string;
  domainId: NexoraDomainId;
  title: string;
  summary: string;
  posture: ExecutiveDecisionPosture;
  priority: ExecutivePriority;
  confidence: number;
  relatedObjectIds: string[];
  relatedScenarioIds?: string[];
  relatedSignalIds?: string[];
  recommendedActions: string[];
  explanation: string;
  executiveQuestions?: string[];
  metadata?: Record<string, unknown>;
};
