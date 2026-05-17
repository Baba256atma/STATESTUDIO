/**
 * D7:1:1 — Simulation event contracts (operational reality graph).
 */

export type SimulationEventType =
  | "state_change"
  | "risk_increase"
  | "resource_shift"
  | "timeline_branch"
  | "operational_alert";

export interface SimulationEvent {
  id: string;
  type: SimulationEventType;
  sourceObjectId?: string;
  targetObjectIds?: string[];
  createdAt: string;
  payload?: unknown;
}

export type SimulationEventPayloadStateChange = Readonly<{
  objectId: string;
  patch: Record<string, unknown>;
}>;

export type SimulationEventPayloadRiskIncrease = Readonly<{
  delta?: number;
  reason?: string;
}>;
