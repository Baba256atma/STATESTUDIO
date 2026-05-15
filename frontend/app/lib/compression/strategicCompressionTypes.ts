import type { ConfidenceLevel } from "../confidence/decisionConfidenceTypes.ts";

export type StrategicCompressionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface StrategicCompressedInsight {
  id: string;
  title: string;
  summary: string;
  supportingInsightIds: string[];
  supportingScenarioIds?: string[];
  relatedObjectIds: string[];
  priority: StrategicCompressionPriority;
  confidenceLevel?: ConfidenceLevel;
  executiveFocus?: string;
  domainId?: string;
  createdAt: number;
}

export type StrategicInsightCluster = {
  id: string;
  signalIds: string[];
  scenarioIds: string[];
  relatedObjectIds: string[];
  focus: string;
  domainId?: string;
  priority: StrategicCompressionPriority;
  confidenceLevel?: ConfidenceLevel;
};

export type ExecutiveBriefing = {
  headline: string;
  strategicFocus: string;
  confidence: ConfidenceLevel;
  priority: StrategicCompressionPriority;
  supportingInsightIds: string[];
};

export type StrategicCompressionOverlayState = {
  topInsightId?: string;
  headline: string;
  strategicFocus: string;
  priority: StrategicCompressionPriority;
  confidenceLevel: ConfidenceLevel;
  relatedObjectIds: string[];
};
