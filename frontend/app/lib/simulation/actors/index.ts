/**
 * D7:3:1 — Strategic human actor simulation foundation (public surface).
 */

export type {
  StrategicHumanActorRole,
  StrategicHumanActor,
  ActorRoleParticipation,
  ActorSystemRelationship,
  HumanActorSimulationState,
  ExecutiveActorSemantics,
  HumanActorParticipationSnapshot,
  ActorPanelContract,
  ActorPanelRow,
  ActorParticipationContext,
  EvaluateHumanActorParticipationInput,
  EvaluateHumanActorParticipationResult,
} from "./humanActorTypes.ts";

export type { ActorGuardCode, ActorGuardResult } from "./actorGuards.ts";
export {
  DEFAULT_MAX_STRATEGIC_ACTORS,
  PROHIBITED_ACTOR_ATTRIBUTE_KEYS,
  buildActorContentFingerprint,
  detectProhibitedActorAttributes,
  guardEvaluateHumanActorParticipation,
} from "./actorGuards.ts";

export { logActorDev } from "./actorDevLog.ts";
export type { ActorDevChannel } from "./actorDevLog.ts";

export {
  deriveDefaultActorsFromTopology,
  applyRoleInfluenceAdjustments,
} from "./organizationalRoleModeling.ts";

export {
  calculateCoordinationPressure,
  calculateOrganizationalAlignmentScore,
  calculateActorParticipationIntensity,
  classifyCoordinationQuality,
} from "./coordinationInfluenceModel.ts";

export {
  buildActorRoleParticipations,
  buildActorSystemRelationships,
} from "./actorSystemRelationshipModel.ts";

export { buildExecutiveActorSemantics } from "./executiveActorSemantics.ts";

export {
  evaluateHumanActorParticipation,
  buildActorPanelContract,
  freezeHumanActorParticipationSnapshot,
} from "./strategicHumanActorFoundationEngine.ts";
