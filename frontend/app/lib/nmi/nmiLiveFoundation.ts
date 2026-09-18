/**
 * NPA-T NMI:8 — live host verification.
 * Requires certified NMI:1–7. Does not start DTH-EXP.
 */

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { verifyNmiAdvisorIntegration } from "./nmiAdvisorFoundation.ts";
import { NMI_LIVE_GATE_FLOW, NMI_LIVE_HOST_CONTRACT, NMI_LIVE_PIPELINE } from "./nmiLiveContract.ts";
import { getNmiLiveIdentity, nmiLiveIdentity } from "./nmiLiveIdentity.ts";

export function verifyNmiLiveHost(): {
  readonly ok: true;
  readonly identity: typeof nmiLiveIdentity;
} {
  verifyNmiAdvisorIntegration();
  verifyNmiAuthorityBoundary();
  if (getNmiLiveIdentity().id !== nmiLiveIdentity) {
    throw new Error("NMI:8 identity mismatch");
  }
  if (NMI_LIVE_HOST_CONTRACT.secondManagementStore) {
    throw new Error("NMI:8 must not create a second management store");
  }
  if (NMI_LIVE_HOST_CONTRACT.secondQueue || NMI_LIVE_HOST_CONTRACT.secondAdvisor) {
    throw new Error("NMI:8 must not create a second Queue or Advisor");
  }
  if (NMI_LIVE_HOST_CONTRACT.writesDecision || NMI_LIVE_HOST_CONTRACT.writesExecution) {
    throw new Error("NMI:8 must not write Decision or Execution");
  }
  if (NMI_LIVE_HOST_CONTRACT.bypassesGate || NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI:8 must not bypass Gate");
  }
  if (NMI_LIVE_HOST_CONTRACT.feedbackLoop) {
    throw new Error("NMI:8 must not create a canonical feedback loop");
  }
  if (NMI_LIVE_HOST_CONTRACT.readsSealedRmsGroundTruth || NMI_RMS_BOUNDARY.nmiIsSimulationEngine) {
    throw new Error("NMI:8 must not read sealed RMS Ground Truth");
  }
  if (NMI_LIVE_HOST_CONTRACT.startsDthExp) {
    throw new Error("NMI:8 must not start DTH-EXP");
  }
  if (NMI_LIVE_HOST_CONTRACT.conversationalAuthority !== conversationalExperienceIdentity) {
    throw new Error("NMI:8 must remain inside CC:5");
  }
  if (NMI_LIVE_PIPELINE[0] !== "CANONICAL_AUTHORITIES") {
    throw new Error("NMI:8 pipeline must start from canonical authorities");
  }
  if (NMI_LIVE_GATE_FLOW[0] !== "EXTERNAL_OR_INTERNAL_INPUT") {
    throw new Error("NMI:8 Gate flow must start at Input");
  }
  if (NMI_AUTHORITY_BOUNDARY.parallelAdvisor) {
    throw new Error("NMI must not own a parallel Advisor");
  }
  return Object.freeze({ ok: true as const, identity: nmiLiveIdentity });
}
