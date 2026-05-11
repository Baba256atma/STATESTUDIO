import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainRiskSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DomainRiskSignalResult = {
  id: string;
  domainId: NexoraDomainId;
  signalType:
    | "fragility"
    | "exposure"
    | "dependency"
    | "delay"
    | "capacity"
    | "security"
    | "confidence_drop";
  label: string;
  severity: DomainRiskSeverity;
  confidence: number;
  relatedObjectIds: string[];
  relatedEdgeIds?: string[];
  explanation: string;
  recommendedPanel?:
    | "risk"
    | "focus"
    | "dashboard"
    | "scenario";
  metadata?: Record<string, unknown>;
};
