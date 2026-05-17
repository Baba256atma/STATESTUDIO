/**
 * D7:1:8 — Executive war-room simulation orchestration (public surface).
 */

export type {
  WarRoomSessionStatus,
  WarRoomSimulationSession,
  WarRoomOrchestrationState,
  WarRoomScenarioRole,
  WarRoomScenarioSlot,
  WarRoomInterventionStep,
  WarRoomSyncRecord,
  WarRoomInterventionHistoryEntry,
  WarRoomComparisonHistoryEntry,
  WarRoomSessionHistory,
  WarRoomSessionHistoryEventKind,
  WarRoomSessionHistoryEntry,
  ExecutiveWarRoomSessionNarrative,
  WarRoomOrchestrationSnapshot,
  WarRoomPanelOrchestrationContract,
  WarRoomPanelScenarioRow,
  WarRoomPanelInterventionRow,
  CreateWarRoomSessionInput,
  OrchestrateWarRoomSimulationInput,
  WarRoomOrchestrationResult,
} from "./warRoomTypes.ts";

export type { WarRoomGuardCode, WarRoomGuardResult } from "./warRoomGuards.ts";
export {
  DEFAULT_MAX_WAR_ROOM_SCENARIOS,
  DEFAULT_MAX_INTERVENTION_STEPS,
  interventionsConflict,
  guardWarRoomSession,
  guardOrchestrateWarRoomSimulation,
  buildOrchestrationRequestFingerprint,
} from "./warRoomGuards.ts";

export { logWarRoomDev } from "./warRoomDevLog.ts";
export type { WarRoomDevChannel } from "./warRoomDevLog.ts";

export {
  createEmptyWarRoomSessionHistory,
  appendWarRoomHistoryEntry,
  appendInterventionHistory,
  appendComparisonHistory,
  appendSyncHistory,
  recordWarRoomEvent,
  freezeWarRoomSessionHistory,
} from "./warRoomSessionHistory.ts";

export { applyWarRoomInterventionSequence } from "./interventionSequencing.ts";
export type { InterventionSequenceResult } from "./interventionSequencing.ts";

export {
  buildWarRoomScenarioSlotsFromForest,
  cloneTimelinesByScenario,
  synchronizeWarRoomTimelines,
  runCoordinatedScenarioComparison,
  scenarioRiskLevelForSlot,
} from "./multiScenarioCoordination.ts";

export { buildExecutiveWarRoomSessionNarrative } from "./executiveWarRoomNarratives.ts";

export {
  createWarRoomSimulationSession,
  orchestrateWarRoomSimulation,
  focusWarRoomScenario,
  buildWarRoomPanelContract,
  freezeWarRoomOrchestrationSnapshot,
} from "./executiveWarRoomOrchestrationEngine.ts";
