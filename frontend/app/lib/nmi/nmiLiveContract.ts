/**
 * NPA-T NMI:8 — live host contract.
 * Assembles a read-only UnifiedManagementModel from existing canonical catalogs.
 */

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { nmiLiveIdentity } from "./nmiLiveIdentity.ts";
import { nmiFoundationIdentity } from "./nmiIdentity.ts";

export const NMI_LIVE_HOST_CONTRACT = Object.freeze({
  identity: nmiLiveIdentity,
  reusesNmi1Identity: nmiFoundationIdentity,
  conversationalAuthority: conversationalExperienceIdentity,
  gateApi: realDataIntegrationFoundationIdentity,
  composerNotAuthority: true as const,
  secondManagementStore: false as const,
  secondQueue: false as const,
  secondAdvisor: false as const,
  secondStage: false as const,
  writesBusinessProject: false as const,
  writesObject: false as const,
  writesGoal: false as const,
  writesKpi: false as const,
  writesDataReality: false as const,
  writesEvidence: false as const,
  writesProblem: false as const,
  writesRisk: false as const,
  writesVariable: false as const,
  writesScenario: false as const,
  writesDecision: false as const,
  writesExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesStageSemanticState: false as const,
  writesAdvisorMemory: false as const,
  writesQueue: false as const,
  fabricatesMissingStructure: false as const,
  inventsPriority: false as const,
  bypassesGate: false as const,
  feedbackLoop: false as const,
  readsSealedRmsGroundTruth: false as const,
  startsDthExp: false as const,
});

export const NMI_LIVE_PIPELINE = Object.freeze([
  "CANONICAL_AUTHORITIES",
  "NMI_1_UNIFIED_MANAGEMENT_MODEL",
  "NMI_2_MANAGEMENT_MAP",
  "NMI_3_RELATIONSHIP_INTELLIGENCE",
  "NMI_4_DECISION_ROADMAP",
  "NMI_5_NAVIGATION_ATTENTION",
  "NMI_6_STAGE_PROJECTION",
  "NMI_7_ADVISOR_CONTEXT",
  "EXISTING_UI_STAGE_ADVISOR",
] as const);

export const NMI_LIVE_GATE_FLOW = Object.freeze([
  "EXTERNAL_OR_INTERNAL_INPUT",
  "GATE_API_RDI_1",
  "CANONICAL_AUTHORITY_OR_DATA_REALITY",
  "NMI_UNIFIED_MANAGEMENT_MODEL",
  "NMI_READ_PIPELINE",
  "UI_STAGE_ADVISOR",
] as const);
