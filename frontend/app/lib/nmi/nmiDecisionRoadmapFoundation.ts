/**
 * NPA-T NMI:4 — Decision Roadmap foundation verification.
 * Requires certified NMI:1–3. Does not start NMI:5 or redesign Queue.
 */

import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_MANAGEMENT_MAP_CONTRACT } from "./nmiManagementMapContract.ts";
import { verifyNmiManagementMap } from "./nmiManagementMapFoundation.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY } from "./nmiRelationshipContract.ts";
import { NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT } from "./nmiRelationshipIntelligenceContract.ts";
import { verifyNmiRelationshipIntelligence } from "./nmiRelationshipIntelligenceFoundation.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { NMI_DECISION_ROADMAP_CONTRACT, NMI_DECISION_ROADMAP_GATE_FLOW } from "./nmiDecisionRoadmapContract.ts";
import { getNmiDecisionRoadmapIdentity, nmiDecisionRoadmapIdentity } from "./nmiDecisionRoadmapIdentity.ts";

export function verifyNmiDecisionRoadmap(): {
  readonly ok: true;
  readonly identity: typeof nmiDecisionRoadmapIdentity;
} {
  verifyNmiFoundation();
  verifyNmiManagementMap();
  verifyNmiRelationshipIntelligence();
  verifyNmiAuthorityBoundary();
  if (getNmiDecisionRoadmapIdentity().id !== nmiDecisionRoadmapIdentity) {
    throw new Error("NMI:4 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:1 must remain UnifiedManagementModel; Decision Roadmap lives in NMI:4");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:2 must not implement the Decision Roadmap");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.startsNmi4 || NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:3 must remain relationship intelligence only");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.startsNmi5) {
    throw new Error("NMI:4 must not start NMI:5");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.forcedWorkflow || NMI_DECISION_ROADMAP_CONTRACT.stateMachine) {
    throw new Error("NMI:4 must not become a workflow or state machine");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.ownsDecision || NMI_DECISION_ROADMAP_CONTRACT.ownsExecution) {
    throw new Error("NMI:4 must not own Decision or Execution");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.decidesAttention || NMI_DECISION_ROADMAP_CONTRACT.requiredAction) {
    throw new Error("NMI:4 must not decide Attention or prescribe requiredAction");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.projectsOntoStage) {
    throw new Error("NMI:4 must not project onto Stage");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.bypassesGate || NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI:4 must reuse the existing Gate API");
  }
  if (NMI_DECISION_ROADMAP_GATE_FLOW[0] !== "EXTERNAL_OR_INTERNAL_INPUT") {
    throw new Error("NMI:4 must preserve Gate-first data flow");
  }
  if (NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation || NMI_DECISION_ROADMAP_CONTRACT.analysisImpliesCausality) {
    throw new Error("NMI:4 must not manufacture causality");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.readsSealedRmsGroundTruth || NMI_RMS_BOUNDARY.rmsWritesNmiTruth) {
    throw new Error("NMI:4 must not read sealed RMS Ground Truth");
  }
  if (NMI_AUTHORITY_BOUNDARY.queue !== "existing executive Queue (unchanged)") {
    throw new Error("NMI:4 must leave Queue unchanged");
  }
  if (NMI_DECISION_ROADMAP_CONTRACT.parallelAdvisor) {
    throw new Error("NMI:4 must not change Advisor authority");
  }
  return Object.freeze({ ok: true as const, identity: nmiDecisionRoadmapIdentity });
}
