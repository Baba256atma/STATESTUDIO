/**
 * NPA-T NMI:2 — Management Map foundation verification.
 * Requires certified NMI:1. Does not start NMI:3 or redesign Queue.
 */

import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY } from "./nmiRelationshipContract.ts";
import { NMI_MANAGEMENT_MAP_CONTRACT, NMI_MANAGEMENT_MAP_GATE_FLOW } from "./nmiManagementMapContract.ts";
import { getNmiManagementMapIdentity, nmiManagementMapIdentity } from "./nmiManagementMapIdentity.ts";

export function verifyNmiManagementMap(): {
  readonly ok: true;
  readonly identity: typeof nmiManagementMapIdentity;
} {
  verifyNmiFoundation();
  verifyNmiAuthorityBoundary();
  if (getNmiManagementMapIdentity().id !== nmiManagementMapIdentity) {
    throw new Error("NMI:2 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.managementMapImplemented) {
    throw new Error("NMI:1 must remain the UnifiedManagementModel; Management Map lives in NMI:2");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.startsNmi3) {
    throw new Error("NMI:2 must not start NMI:3");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:2 must not implement the Decision Roadmap");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.redesignsQueue || NMI_MANAGEMENT_MAP_CONTRACT.managerFacingQueueUi) {
    throw new Error("NMI:2 must not redesign Queue");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.newStageTheatre) {
    throw new Error("NMI:2 must not create a Stage or Theatre scene system");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.parallelAdvisor) {
    throw new Error("NMI:2 must not introduce a parallel Advisor");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.bypassesGate || NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI:2 must reuse the existing Gate API");
  }
  if (NMI_MANAGEMENT_MAP_GATE_FLOW[0] !== "EXTERNAL_OR_INTERNAL_INPUT") {
    throw new Error("NMI:2 must preserve Gate-first data flow");
  }
  if (NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation || NMI_MANAGEMENT_MAP_CONTRACT.createsCausalCertainty) {
    throw new Error("NMI:2 must not upgrade causal status");
  }
  if (NMI_AUTHORITY_BOUNDARY.queue !== "existing executive Queue (unchanged)") {
    throw new Error("NMI:2 must leave Queue unchanged");
  }
  return Object.freeze({ ok: true as const, identity: nmiManagementMapIdentity });
}
