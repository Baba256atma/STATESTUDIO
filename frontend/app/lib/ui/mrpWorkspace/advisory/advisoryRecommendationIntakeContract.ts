/**
 * MRP:5A:3 — Consume-only intelligence intake from certified workspaces.
 */

import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";
import type { WarRoomStatus } from "../warRoom/warRoomStateContract.ts";

export type AdvisoryRiskIntakeSnapshot = Readonly<{
  available: boolean;
  selectedObjectId: string | null;
  riskCount: number;
  elevatedRiskCount: number;
  criticalRiskCount: number;
  dominantRiskCategory: string;
}>;

export type AdvisoryTimelineIntakeSnapshot = Readonly<{
  available: boolean;
  selectedObjectId: string | null;
  totalEvents: number;
  recentEventCount: number;
  decisionEventCount: number;
  riskEventCount: number;
}>;

export type AdvisoryScenarioIntakeSnapshot = Readonly<{
  available: boolean;
  selectedObjectId: string | null;
  scenarioCount: number;
  activeScenarioId: GeneratedScenarioId | null;
  expectedProbability: string | null;
  worstCaseImpact: string | null;
}>;

export type AdvisoryWarRoomIntakeSnapshot = Readonly<{
  available: boolean;
  selectedObjectId: string | null;
  activeDecisionId: string | null;
  selectedStrategy: string | null;
  status: WarRoomStatus | null;
}>;

export type AdvisoryRecommendationIntake = Readonly<{
  risk: AdvisoryRiskIntakeSnapshot;
  timeline: AdvisoryTimelineIntakeSnapshot;
  scenario: AdvisoryScenarioIntakeSnapshot;
  warRoom: AdvisoryWarRoomIntakeSnapshot;
}>;

export const DEFAULT_ADVISORY_RISK_INTAKE: AdvisoryRiskIntakeSnapshot = Object.freeze({
  available: false,
  selectedObjectId: null,
  riskCount: 0,
  elevatedRiskCount: 0,
  criticalRiskCount: 0,
  dominantRiskCategory: "None",
});

export const DEFAULT_ADVISORY_TIMELINE_INTAKE: AdvisoryTimelineIntakeSnapshot = Object.freeze({
  available: false,
  selectedObjectId: null,
  totalEvents: 0,
  recentEventCount: 0,
  decisionEventCount: 0,
  riskEventCount: 0,
});

export const DEFAULT_ADVISORY_SCENARIO_INTAKE: AdvisoryScenarioIntakeSnapshot = Object.freeze({
  available: false,
  selectedObjectId: null,
  scenarioCount: 0,
  activeScenarioId: null,
  expectedProbability: null,
  worstCaseImpact: null,
});

export const DEFAULT_ADVISORY_WAR_ROOM_INTAKE: AdvisoryWarRoomIntakeSnapshot = Object.freeze({
  available: false,
  selectedObjectId: null,
  activeDecisionId: null,
  selectedStrategy: null,
  status: null,
});

export const DEFAULT_ADVISORY_RECOMMENDATION_INTAKE: AdvisoryRecommendationIntake = Object.freeze({
  risk: DEFAULT_ADVISORY_RISK_INTAKE,
  timeline: DEFAULT_ADVISORY_TIMELINE_INTAKE,
  scenario: DEFAULT_ADVISORY_SCENARIO_INTAKE,
  warRoom: DEFAULT_ADVISORY_WAR_ROOM_INTAKE,
});
