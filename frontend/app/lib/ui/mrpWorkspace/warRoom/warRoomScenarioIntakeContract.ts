/**
 * MRP:4F:3 — War Room scenario handoff intake contract.
 *
 * Consumes ScenarioCommitPackage — no scenario regeneration or future simulation.
 */

import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";
import type { WarRoomState } from "./warRoomStateContract.ts";

export const WAR_ROOM_SCENARIO_INTAKE_TAG = "[MRP_WARROOM_HANDOFF]" as const;

export const WAR_ROOM_SCENARIO_INTAKE_VERSION = "4F.3.0";

export type WarRoomScenarioIntakeResult = Readonly<{
  ok: boolean;
  reason?: string;
  commitPackage?: ScenarioCommitPackage;
  activeDecisionId?: string | null;
  warRoomState?: WarRoomState;
  regeneratedScenario?: false;
  simulatedFuture?: false;
}>;

export type ScenarioCommitPackageValidation = Readonly<{
  valid: boolean;
  errors: readonly string[];
}>;
