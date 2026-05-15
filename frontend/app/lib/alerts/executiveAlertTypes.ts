export type ExecutiveAlertLevel =
  | "info"
  | "attention"
  | "urgent"
  | "critical";

export type ExecutiveAlertState =
  | "new"
  | "active"
  | "monitoring"
  | "stabilizing"
  | "resolved";

export interface ExecutiveAlert {
  id: string;
  title: string;
  summary: string;
  level: ExecutiveAlertLevel;
  relatedObjectIds: string[];
  relatedInsightIds?: string[];
  relatedScenarioIds?: string[];
  rationale: string;
  confidence?: number;
  escalationReason?: string;
  recommendedAttention?: string;
  domainId?: string;
  createdAt: number;
}

export type ExecutiveAlertOverlayState = {
  topAlertId?: string;
  level: ExecutiveAlertLevel;
  state: ExecutiveAlertState;
  executiveSummary: string;
  relatedObjectIds: string[];
  activeAlertCount: number;
};
