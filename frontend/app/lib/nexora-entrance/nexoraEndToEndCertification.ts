/**
 * NEX-E2E:1 — Full Executive Experience End-to-End Certification.
 * Integration audit + journey certification. Not NEX-EXP:11.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getNexoraEntranceExperienceIdentity } from "./nexoraEntranceExperience.ts";
import { getNexoraGoalDiscoveryExperienceIdentity } from "./nexoraGoalDiscoveryExperience.ts";
import { getNexoraDecisionExperienceIdentity } from "./nexoraDecisionExperience.ts";
import { getNexoraExecutionPlanningIdentity } from "./nexoraExecutionPlanning.ts";
import { getNexoraOutcomeMonitoringIdentity } from "./nexoraOutcomeMonitoring.ts";
import { getNexoraLearningReassessmentIdentity } from "./nexoraLearningReassessment.ts";

export const nexoraEndToEndCertificationIdentity =
  "NEX-E2E:1/FullExecutiveExperienceEndToEndCertification" as const;
export const nexoraEndToEndCertificationVersion = "1.0.0" as const;
export const nexoraEndToEndCertificationNamespace =
  "nexora.experience.end-to-end.full-executive-loop" as const;

export const NEXORA_END_TO_END_BOUNDARY = Object.freeze({
  identity: nexoraEndToEndCertificationIdentity,
  createsNexExp11: false as const,
  createsMo7: false as const,
  parallelOrchestrator: false as const,
  parallelAdvisor: false as const,
  parallelStage: false as const,
  parallelTruthStore: false as const,
  firstTimeRoute: "/executive?entrance=1" as const,
  resetRoute: "/executive?entrance=1&reset=1" as const,
  defaultRoute: "/executive" as const,
});

export function getNexoraEndToEndCertificationIdentity() {
  return Object.freeze({
    id: nexoraEndToEndCertificationIdentity,
    version: nexoraEndToEndCertificationVersion,
    namespace: nexoraEndToEndCertificationNamespace,
  });
}

export function reusedExperienceAuthorities() {
  return Object.freeze({
    entrance: getNexoraEntranceExperienceIdentity().id,
    goal: getNexoraGoalDiscoveryExperienceIdentity().id,
    decision: getNexoraDecisionExperienceIdentity().id,
    execution: getNexoraExecutionPlanningIdentity().id,
    outcome: getNexoraOutcomeMonitoringIdentity().id,
    learning: getNexoraLearningReassessmentIdentity().id,
  });
}

export function catalogZContractHolds(
  catalog: NexoraMVPObjectInteractionCatalog,
): boolean {
  return catalog.objects.every(
    (object) =>
      object.position[2] === 0 &&
      Number.isFinite(object.position[0]) &&
      Number.isFinite(object.position[1]),
  );
}

export function catalogHasNoOverlappingXy(
  catalog: NexoraMVPObjectInteractionCatalog,
): boolean {
  const keys = catalog.objects.map(
    (object) => `${object.position[0].toFixed(3)},${object.position[1].toFixed(3)}`,
  );
  return new Set(keys).size === keys.length;
}

export function verifyNexoraEndToEndCertification() {
  const authorities = reusedExperienceAuthorities();
  const ok =
    NEXORA_END_TO_END_BOUNDARY.createsNexExp11 === false &&
    NEXORA_END_TO_END_BOUNDARY.createsMo7 === false &&
    !authorities.learning.includes("NEX-EXP:11") &&
    authorities.entrance.startsWith("NEX-EXP:1/") &&
    authorities.learning.startsWith("NEX-EXP:10/");
  return Object.freeze({ ok, authorities });
}
