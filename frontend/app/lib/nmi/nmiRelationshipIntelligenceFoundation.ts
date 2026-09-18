/**
 * NPA-T NMI:3 — Management Relationship Intelligence verification.
 * Requires certified NMI:1–2. Does not start NMI:4.
 */

import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_MANAGEMENT_MAP_CONTRACT } from "./nmiManagementMapContract.ts";
import { verifyNmiManagementMap } from "./nmiManagementMapFoundation.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY } from "./nmiRelationshipContract.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY } from "@/app/lib/business-context-awareness/businessProjectRelationshipContract.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import {
  NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT,
  NMI_RELATIONSHIP_INTELLIGENCE_GATE_FLOW,
} from "./nmiRelationshipIntelligenceContract.ts";
import {
  getNmiRelationshipIntelligenceIdentity,
  nmiRelationshipIntelligenceIdentity,
} from "./nmiRelationshipIntelligenceIdentity.ts";

export function verifyNmiRelationshipIntelligence(): {
  readonly ok: true;
  readonly identity: typeof nmiRelationshipIntelligenceIdentity;
} {
  verifyNmiFoundation();
  verifyNmiManagementMap();
  verifyNmiAuthorityBoundary();
  if (getNmiRelationshipIntelligenceIdentity().id !== nmiRelationshipIntelligenceIdentity) {
    throw new Error("NMI:3 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.managementMapImplemented) {
    throw new Error("NMI:1 must remain UnifiedManagementModel only");
  }
  if (NMI_MANAGEMENT_MAP_CONTRACT.startsNmi3) {
    throw new Error("NMI:2 must remain map-only; relationship intelligence lives in NMI:3");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.startsNmi4) {
    throw new Error("NMI:3 must not start NMI:4");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.decisionRoadmapImplemented) {
    throw new Error("NMI:3 must not implement the Decision Roadmap");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.duplicatesBca3) {
    throw new Error("NMI:3 must not duplicate BCA:3 relationship intelligence");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.duplicatesVaiCausal) {
    throw new Error("NMI:3 must not duplicate VAI causal authority");
  }
  if (BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.ownsCausalAuthority) {
    throw new Error("BCA:3 must remain non-causal");
  }
  if (VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore) {
    throw new Error("VAI must remain the causal projection owner");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.readsSealedRmsGroundTruth || NMI_RMS_BOUNDARY.rmsWritesNmiTruth) {
    throw new Error("NMI:3 must not read sealed RMS Ground Truth");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.bypassesGate || NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI:3 must reuse the existing Gate API");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_GATE_FLOW[0] !== "EXTERNAL_OR_INTERNAL_INPUT") {
    throw new Error("NMI:3 must preserve Gate-first data flow");
  }
  if (NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation) {
    throw new Error("NMI:3 must not convert correlation to causation");
  }
  if (NMI_AUTHORITY_BOUNDARY.queue !== "existing executive Queue (unchanged)") {
    throw new Error("NMI:3 must leave Queue unchanged");
  }
  if (NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.parallelAdvisor) {
    throw new Error("NMI:3 must not change Advisor authority");
  }
  return Object.freeze({ ok: true as const, identity: nmiRelationshipIntelligenceIdentity });
}
