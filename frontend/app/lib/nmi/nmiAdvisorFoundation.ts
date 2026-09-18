/**
 * NPA-T NMI:7 — Advisor integration verification.
 * Requires certified NMI:1–6. Does not start NMI:8 or DTH-EXP.
 */

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { NMI_STAGE_PROJECTION_CONTRACT } from "./nmiStageProjectionContract.ts";
import { verifyNmiStageProjection } from "./nmiStageProjectionFoundation.ts";
import { NMI_ADVISOR_CONTRACT, NMI_ADVISOR_GATE_FLOW } from "./nmiAdvisorContract.ts";
import { getNmiAdvisorIdentity, nmiAdvisorIdentity } from "./nmiAdvisorIdentity.ts";

export function verifyNmiAdvisorIntegration(): {
  readonly ok: true;
  readonly identity: typeof nmiAdvisorIdentity;
} {
  verifyNmiStageProjection();
  verifyNmiAuthorityBoundary();
  if (getNmiAdvisorIdentity().id !== nmiAdvisorIdentity) {
    throw new Error("NMI:7 identity mismatch");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.startsNmi7) {
    throw new Error("NMI:6 must not start NMI:7");
  }
  if (NMI_ADVISOR_CONTRACT.startsNmi8) {
    throw new Error("NMI:7 must not start NMI:8");
  }
  if (NMI_ADVISOR_CONTRACT.secondAdvisor) {
    throw new Error("NMI:7 must not create a second Advisor");
  }
  if (NMI_ADVISOR_CONTRACT.secondReferentResolver || NMI_ADVISOR_CONTRACT.secondFocusRegistry) {
    throw new Error("NMI:7 must not create a second referent resolver");
  }
  if (NMI_ADVISOR_CONTRACT.conversationalAuthority !== conversationalExperienceIdentity) {
    throw new Error("NMI:7 must remain inside CC:5");
  }
  if (NMI_ADVISOR_CONTRACT.writesDecision || NMI_ADVISOR_CONTRACT.writesExecution) {
    throw new Error("NMI:7 must not write Decision or Execution");
  }
  if (NMI_GATE_BOUNDARY.nmiGate || NMI_ADVISOR_CONTRACT.bypassesGate) {
    throw new Error("NMI:7 must not bypass Gate");
  }
  if (NMI_RMS_BOUNDARY.nmiIsSimulationEngine || NMI_ADVISOR_CONTRACT.readsSealedRmsGroundTruth) {
    throw new Error("NMI:7 must not read sealed RMS Ground Truth");
  }
  if (NMI_AUTHORITY_BOUNDARY.parallelAdvisor) {
    throw new Error("NMI must not own a parallel Advisor");
  }
  if (NMI_ADVISOR_GATE_FLOW.at(-1) !== "EXISTING_ADVISOR_COMPOSER") {
    throw new Error("NMI:7 must terminate at the existing Advisor composer");
  }
  return Object.freeze({ ok: true as const, identity: nmiAdvisorIdentity });
}
