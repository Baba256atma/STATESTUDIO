export type StrategicMemoryCategory =
  | "fragility"
  | "propagation"
  | "scenario"
  | "recommendation"
  | "timeline"
  | "dependency"
  | "monitoring";

export type StrategicMemorySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type StrategicMemoryState =
  | "emerging"
  | "persistent"
  | "stabilizing"
  | "resolved"
  | "monitoring";

export interface StrategicMemoryRecord {
  id: string;
  category: StrategicMemoryCategory;
  title: string;
  summary: string;
  relatedObjectIds: string[];
  severity?: StrategicMemorySeverity;
  confidence?: number;
  recurrenceCount?: number;
  lastObservedAt: number;
  firstObservedAt: number;
  domainId?: string;
  relatedScenarioIds?: string[];
}

export type StrategicMemoryScore = {
  recordId: string;
  recurrenceScore: number;
  memoryState: StrategicMemoryState;
  persistenceDuration: number;
};

export type StrategicMemoryOverlayState = {
  topMemoryId?: string;
  memoryState: StrategicMemoryState;
  executiveSummary: string;
  relatedObjectIds: string[];
  recurringCategories: StrategicMemoryCategory[];
};

export type StrategicMemoryStoreState = {
  records: StrategicMemoryRecord[];
  updatedAt: number;
};
