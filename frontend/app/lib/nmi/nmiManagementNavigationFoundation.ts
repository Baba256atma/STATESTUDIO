/**
 * NPA-T NMI:5 — Management Navigation verification.
 * Requires certified NMI:1–4 and STAGE-PROD:1 Queue. Does not start NMI:6.
 */

import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_DECISION_ROADMAP_CONTRACT } from "./nmiDecisionRoadmapContract.ts";
import { verifyNmiDecisionRoadmap } from "./nmiDecisionRoadmapFoundation.ts";
import { NMI_MANAGEMENT_MAP_CONTRACT } from "./nmiManagementMapContract.ts";
import { NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT } from "./nmiRelationshipIntelligenceContract.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import {
  EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY,
  executiveStageQueueFoundationIdentity,
  verifyExecutiveStageQueueFoundation,
} from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import {
  NMI_ATTENTION_PROMOTION_RULE,
  NMI_MANAGEMENT_NAVIGATION_CONTRACT,
  NMI_MANAGEMENT_NAVIGATION_GATE_FLOW,
} from "./nmiManagementNavigationContract.ts";
import { getNmiManagementNavigationIdentity, nmiManagementNavigationIdentity } from "./nmiManagementNavigationIdentity.ts";

export function verifyNmiManagementNavigation(): {
  readonly ok: true;
  readonly identity: typeof nmiManagementNavigationIdentity;
} {
  verifyNmiFoundation();
  verifyNmiDecisionRoadmap();
  verifyNmiAuthorityBoundary();
  if (getNmiManagementNavigationIdentity().id !== nmiManagementNavigationIdentity) {
    throw new Error("NMI:5 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.attentionImplemented) {
    throw new Error("NMI:1 must not own Attention; Attention lives in NMI:5");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.attentionImplemented) {
    throw new Error("NMI:2 must not own Attention");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:3 must remain relationship intelligence only");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.startsNmi5) {
    throw new Error("NMI:4 must remain Decision Roadmap only");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.startsNmi6) {
    throw new Error("NMI:5 must not start NMI:6");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.secondQueue) {
    throw new Error("NMI:5 must not create a second Queue");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.queueAuthority !== executiveStageQueueFoundationIdentity) {
    throw new Error("NMI:5 must reuse STAGE-PROD:1 Queue");
  }
  if (!verifyExecutiveStageQueueFoundation().ok) {
    throw new Error("STAGE-PROD:1 Queue foundation must remain valid");
  }
  if (EXECUTIVE_STAGE_QUEUE_FOUNDATION_BOUNDARY.queueEntriesAreSemanticObjects) {
    throw new Error("Queue entries must remain non-semantic");
  }
  if (NMI_ATTENTION_PROMOTION_RULE.mapNodeWithoutQueue || NMI_ATTENTION_PROMOTION_RULE.roadmapNotReachedWithoutQueue) {
    throw new Error("NMI:5 must not auto-promote map/roadmap gaps");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.inventsPriorityScore || NMI_MANAGEMENT_NAVIGATION_CONTRACT.hiddenAiRanking) {
    throw new Error("NMI:5 must not invent priority scores");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.projectsOntoStage) {
    throw new Error("NMI:5 must not project onto Stage");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.bypassesGate || NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI:5 must reuse the existing Gate API");
  }
  if (NMI_MANAGEMENT_NAVIGATION_GATE_FLOW[0] !== "EXTERNAL_OR_INTERNAL_INPUT") {
    throw new Error("NMI:5 must preserve Gate-first data flow");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.readsSealedRmsGroundTruth || NMI_RMS_BOUNDARY.rmsWritesNmiTruth) {
    throw new Error("NMI:5 must not read sealed RMS Ground Truth");
  }
  if (NMI_AUTHORITY_BOUNDARY.queue !== "existing executive Queue (unchanged)") {
    throw new Error("NMI:1–4 Queue authority label must remain unchanged");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.parallelAdvisor) {
    throw new Error("NMI:5 must not change Advisor authority");
  }
  return Object.freeze({ ok: true as const, identity: nmiManagementNavigationIdentity });
}
