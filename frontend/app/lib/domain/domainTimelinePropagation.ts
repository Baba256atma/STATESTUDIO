export type DomainPropagationEvent = {
  id: string;
  sourceObjectId: string;
  targetObjectId: string;
  propagationType:
    | "risk"
    | "delay"
    | "dependency"
    | "confidence"
    | "capacity";
  severity:
    | "low"
    | "medium"
    | "high"
    | "critical";
  propagationStrength: number;
  timestamp: number;
  estimatedDelayMs?: number;
  metadata?: Record<string, unknown>;
};

export type DomainTimelineFrame = {
  timestamp: number;
  activePropagationEvents: DomainPropagationEvent[];
  highlightedObjectIds: string[];
  highlightedEdgeIds: string[];
};
