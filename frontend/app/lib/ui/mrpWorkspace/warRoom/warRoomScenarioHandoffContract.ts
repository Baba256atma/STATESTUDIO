/**
 * MRP:4E:5 — War Room scenario handoff consumer contract.
 *
 * War Room may consume ScenarioCommitPackage — execution remains War Room owned.
 */

import type { GeneratedScenarioId } from "../scenario/scenarioGenerationContract.ts";
import type { ScenarioCommitPackage } from "../scenario/scenarioHandoffContract.ts";

export const WAR_ROOM_SCENARIO_HANDOFF_TAG = "[WAR_ROOM_SCENARIO_HANDOFF]" as const;

export const WAR_ROOM_SCENARIO_HANDOFF_VERSION = "4E.5.0";

export type WarRoomScenarioHandoffState = Readonly<{
  commitPackage: ScenarioCommitPackage | null;
  activeScenarioId: GeneratedScenarioId | null;
  receivedAt: string | null;
  executionBlocked: true;
}>;

export const DEFAULT_WAR_ROOM_SCENARIO_HANDOFF_STATE: WarRoomScenarioHandoffState =
  Object.freeze({
    commitPackage: null,
    activeScenarioId: null,
    receivedAt: null,
    executionBlocked: true,
  });
