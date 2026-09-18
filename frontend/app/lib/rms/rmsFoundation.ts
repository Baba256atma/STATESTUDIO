/**
 * NPA-T RMS:1 — Real Management Simulation foundation surface.
 */

import { getRmsFoundationIdentity, rmsFoundationIdentity } from "./rmsIdentity.ts";
import { RMS_FOUNDATION_CONTRACT } from "./rmsFoundationContract.ts";
import { RMS_AUTHORITY_BOUNDARY, verifyRmsAuthorityBoundary } from "./rmsAuthorityBoundary.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT, RMS_OBSERVER_CONTRACT } from "./rmsActorContracts.ts";

export function verifyRmsFoundation(): { readonly ok: true; readonly identity: typeof rmsFoundationIdentity } {
  verifyRmsAuthorityBoundary();
  if (getRmsFoundationIdentity().id !== rmsFoundationIdentity) {
    throw new Error("RMS:1 identity mismatch");
  }
  if (RMS_FOUNDATION_CONTRACT.privilegedSimulationNexora) {
    throw new Error("RMS:1 must not create a privileged simulation Nexora");
  }
  if (RMS_FOUNDATION_CONTRACT.observerIsAuthority) {
    throw new Error("RMS:1 Observer must not become an authority");
  }
  if (RMS_FOUNDATION_CONTRACT.realityEqualsData || RMS_FOUNDATION_CONTRACT.dataEqualsNexoraKnowledge) {
    throw new Error("RMS:1 must keep Reality ≠ Data ≠ Nexora Knowledge");
  }
  if (RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess !== "FORBIDDEN") {
    throw new Error("RMS:1 Nexora Ground Truth access must remain FORBIDDEN");
  }
  if (!RMS_OBSERVER_CONTRACT.readOnly) {
    throw new Error("RMS:1 Observer must be read-only");
  }
  if (!RMS_AUTHORITY_BOUNDARY.d7OperationalGraph.includes("not RMS Ground Truth")) {
    throw new Error("RMS:1 must not treat D7 as Ground Truth");
  }
  return Object.freeze({ ok: true as const, identity: rmsFoundationIdentity });
}

export { getRmsFoundationIdentity, rmsFoundationIdentity } from "./rmsIdentity.ts";
export { RMS_FOUNDATION_CONTRACT, RMS_INTERACTION_MODES, RMS_FLOW_STAGES } from "./rmsFoundationContract.ts";
export {
  RMS_MANAGER_AGENT_CONTRACT,
  RMS_OPERATOR_AGENT_CONTRACT,
  RMS_NEXORA_PARTICIPANT_CONTRACT,
  RMS_OBSERVER_CONTRACT,
  tagRmsAction,
  actorActionsAreDistinguishable,
} from "./rmsActorContracts.ts";
export { RMS_AUTHORITY_BOUNDARY, verifyRmsAuthorityBoundary } from "./rmsAuthorityBoundary.ts";
export { RMS_OBSERVATION_CLASSES, recordRmsObservation } from "./rmsObservation.ts";
export {
  createRmsFoundationSession,
  inspectRmsGroundTruth,
  observeRmsSession,
  readRmsNexoraKnowledge,
  applyRmsGroundTruthEvents,
  pauseRmsGroundTruth,
  readRmsOperatorOperationalView,
  runRmsOperatorObservation,
  publishRmsOperatorObservableData,
  inspectRmsOperatorLedger,
  prepareRmsManagerConversation,
  runRmsManagerConversationTurn,
  inspectRmsManagerConversation,
  measureRmsObserverIntelligence,
  inspectRmsObserverReport,
  loadRmsEventSchedule,
  stepRmsEventSchedule,
  inspectRmsEventSchedule,
  rmsActorContracts,
} from "./rmsSession.ts";
export { RMS_3_BOUNDARY } from "./rmsOperatorContract.ts";
export { verifyRmsOperatorObservable } from "./rmsOperatorRuntime.ts";
export { RMS_4_BOUNDARY } from "./rmsManagerContract.ts";
export { verifyRmsManagerConversation } from "./rmsManagerRuntime.ts";
export { RMS_5_BOUNDARY } from "./rmsObserverContract.ts";
export { verifyRmsObserverIntelligence } from "./rmsObserverMeasurement.ts";
export { RMS_6_BOUNDARY } from "./rmsEventContract.ts";
export { verifyRmsEventsDisturbances } from "./rmsEventRuntime.ts";
export { RMS_7_BOUNDARY } from "./rmsScenarioContract.ts";
export { verifyRmsScenarioLibrary } from "./rmsScenarioValidation.ts";
export { listRmsScenarios, getRmsScenario, filterRmsScenarios } from "./rmsScenarioRegistry.ts";
export { runRmsScenario } from "./rmsScenarioRunner.ts";
export { RMS_8_BOUNDARY } from "./rmsWatchContract.ts";
export { verifyRmsWatchExperience } from "./rmsWatchProjection.ts";
export { startRmsWatchSession } from "./rmsWatchSession.ts";
export { listRmsWatchScenarioCards } from "./rmsWatchCatalog.ts";
export { RMS_9_BOUNDARY } from "./rmsHandoffContract.ts";
export { verifyRmsTakeControl, requestRmsTakeControl } from "./rmsHandoffRuntime.ts";
export { RMS_10_BOUNDARY } from "./rmsExperimentContract.ts";
export { verifyRmsExperiment, startRmsExperiment } from "./rmsExperimentRuntime.ts";
export { nexoraKnowledgeExposesGroundTruth, projectRmsNexoraKnowledgeView } from "./rmsGroundTruth.ts";
export { RMS_2_BOUNDARY } from "./rmsWorldContract.ts";
export { instantiateRmsGroundTruth, applyRmsWorldEvents, verifyRmsGroundTruthWorld } from "./rmsWorldEngine.ts";
export {
  createNorthstarManufacturingWorld,
  createWarehouseExpansionWorld,
} from "./rmsWorldFixtures.ts";
