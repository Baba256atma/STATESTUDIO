/**
 * EX-2:1 — Executive Journal Experience Foundation Decisions & Evidence.
 *
 * Exact-reference evidence ledger for AD-EX2-00 through AD-EX2-08 and
 * Tier-0 supporting evidence. No cloned or rewritten decision records.
 * One-way imports from architecture metadata only (no circular dependency).
 *
 * Ownership: owned exclusively by EX-2:1.
 */

import {
  ExecutiveJournalProductArchitectureAdEx208RouteDisposition,
  ExecutiveJournalProductArchitectureDecisionAdrEx200,
  ExecutiveJournalProductArchitectureDecisionAdrEx201,
  ExecutiveJournalProductArchitectureDecisionAdrEx202,
  ExecutiveJournalProductArchitectureDecisionAdrEx203,
  ExecutiveJournalProductArchitectureDecisionAdrEx204,
  ExecutiveJournalProductArchitectureDecisionAdrEx205,
  ExecutiveJournalProductArchitectureDecisionAdrEx206,
  ExecutiveJournalProductArchitectureDecisionAdrEx207,
  ExecutiveJournalProductArchitectureDecisionAdrEx208,
  ExecutiveJournalProductArchitectureGovernanceGovEx2T001,
  ExecutiveJournalProductArchitectureGovernanceGovEx2T002,
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2UiAuthT02026072701,
  ExecutiveJournalProductArchitectureTier0AuthorityAppointment,
  ExecutiveJournalProductArchitectureTier0AuthorityReview,
  ExecutiveJournalProductArchitectureTier0EvidenceAdoptionPolicy,
  ExecutiveJournalProductArchitectureTier0PrivacyAppointment,
  ExecutiveJournalProductArchitectureTier0PrivacyReview,
  ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
  ExecutiveJournalProductArchitectureTier0SyntheticUiFacade,
  ExecutiveJournalProductArchitectureTier0SyntheticUiHostStrategy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiProduct,
  ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityAppointment,
  ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityReview,
  ExecutiveJournalProductArchitectureTier0UiCertification,
  ExecutiveJournalProductArchitectureTier0UiPrivacyAppointment,
  ExecutiveJournalProductArchitectureTier0UiPrivacyReview,
} from "./executiveJournalProductArchitecture.ts";

/**
 * Dependency note: Foundation imports architecture one-way for exact object
 * references. Architecture must not import Foundation (avoids cycles).
 * Live RTC runtime modules are not imported.
 */
export const ExecutiveJournalExperienceEvidenceImportBoundary = Object.freeze({
  strategy: "ExactReferenceEvidenceLedger" as const,
  importDirection: "FoundationMayImportArchitectureOneWay" as const,
  architectureMustNotImportFoundation: true as const,
  liveRtcRuntimeImported: false as const,
  decisionRecordsCloned: false as const,
  decisionRecordsRewritten: false as const,
  reasonExactObjectReferencesSafe:
    "Architecture aggregate does not import EX-2:1; one-way exact references preserve identity without circular dependency." as const,
} as const);

/** Exact ordered architecture decisions — exact object references. */
export const ExecutiveJournalExperienceArchitectureDecisions = Object.freeze([
  ExecutiveJournalProductArchitectureDecisionAdrEx200,
  ExecutiveJournalProductArchitectureDecisionAdrEx201,
  ExecutiveJournalProductArchitectureDecisionAdrEx202,
  ExecutiveJournalProductArchitectureDecisionAdrEx203,
  ExecutiveJournalProductArchitectureDecisionAdrEx204,
  ExecutiveJournalProductArchitectureDecisionAdrEx205,
  ExecutiveJournalProductArchitectureDecisionAdrEx206,
  ExecutiveJournalProductArchitectureDecisionAdrEx207,
  ExecutiveJournalProductArchitectureDecisionAdrEx208,
] as const);

/** Exact ordered architecture decision IDs referenced by EX-2:1 Foundation. */
export const ExecutiveJournalExperienceArchitectureDecisionIds = Object.freeze([
  "AD-EX2-00",
  "AD-EX2-01",
  "AD-EX2-02",
  "AD-EX2-03",
  "AD-EX2-04",
  "AD-EX2-05",
  "AD-EX2-06",
  "AD-EX2-07",
  "AD-EX2-08",
] as const);

export const getExecutiveJournalExperienceArchitectureDecision = (
  decisionId: string,
) => {
  const found = ExecutiveJournalExperienceArchitectureDecisions.find(
    (item) => item.decisionId === decisionId,
  );
  if (!found) {
    throw new Error(
      `Unknown EX-2:1 architecture decision reference fails closed: ${JSON.stringify(decisionId)}`,
    );
  }
  return found;
};

/**
 * Authorizing decision for EX-2:1 — exact AD-EX2-08 reference.
 */
export const ExecutiveJournalExperienceAuthorizingDecision =
  ExecutiveJournalProductArchitectureDecisionAdrEx208;

/**
 * Tier-0 / architecture supporting evidence ledger.
 * Each identity appears exactly once. Production applicability remains false.
 * Tier-0 evidence is SupportingEvidence and does not satisfy formal phases.
 */
export const ExecutiveJournalExperienceEvidenceLedger = Object.freeze([
  Object.freeze({
    evidenceId: "AD-EX2-00" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-00." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx200,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-01" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-01." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx201,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-02" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-02." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx202,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-03" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-03." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx203,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-04" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-04." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx204,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-05" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-05." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx205,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-06" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-06." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx206,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-07" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Exact reference to Accepted AD-EX2-07." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx207,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-08" as const,
    classification: "ArchitectureDecision" as const,
    label: "ArchitectureAuthority" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes:
      "Exact reference to Accepted AD-EX2-08 — authority for metadata-only EX-2:1." as const,
    record: ExecutiveJournalProductArchitectureDecisionAdrEx208,
  }),
  Object.freeze({
    evidenceId: "GOV-EX2-T0-01" as const,
    classification: "GovernanceDecision" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 governance appointment decision." as const,
    record: ExecutiveJournalProductArchitectureGovernanceGovEx2T001,
  }),
  Object.freeze({
    evidenceId: "GOV-EX2-T0-02" as const,
    classification: "GovernanceDecision" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Exact reference to Tier-0 UI reviewer scope extension decision." as const,
    record: ExecutiveJournalProductArchitectureGovernanceGovEx2T002,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-PRIVACY-APPOINTMENT-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 privacy appointment." as const,
    record: ExecutiveJournalProductArchitectureTier0PrivacyAppointment,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-AUTHORITY-APPOINTMENT-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 authority appointment." as const,
    record: ExecutiveJournalProductArchitectureTier0AuthorityAppointment,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-PRIVACY-REVIEW-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 metadata privacy review." as const,
    record: ExecutiveJournalProductArchitectureTier0PrivacyReview,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-AUTHORITY-REVIEW-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 metadata authority review." as const,
    record: ExecutiveJournalProductArchitectureTier0AuthorityReview,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-UI-PRIVACY-APPOINTMENT-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 UI privacy appointment." as const,
    record: ExecutiveJournalProductArchitectureTier0UiPrivacyAppointment,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-UI-AUTHORITY-SECURITY-APPOINTMENT-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Exact reference to Tier-0 UI authority-security appointment." as const,
    record:
      ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityAppointment,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-UI-PRIVACY-REVIEW-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 UI privacy review." as const,
    record: ExecutiveJournalProductArchitectureTier0UiPrivacyReview,
  }),
  Object.freeze({
    evidenceId: "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact reference to Tier-0 UI authority-security review." as const,
    record: ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityReview,
  }),
  Object.freeze({
    evidenceId: "EX2-AUTH-T0-2026-07-26-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Exact reference to Tier-0 synthetic metadata contracts/tests authorization." as const,
    record:
      ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  }),
  Object.freeze({
    evidenceId: "EX2-UI-AUTH-T0-2026-07-27-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Exact reference to Tier-0 read-only synthetic UI authorization." as const,
    record:
      ExecutiveJournalProductArchitectureHumanAuthorizationEx2UiAuthT02026072701,
  }),
  Object.freeze({
    evidenceId: "EX2-CERT-T0-2026-07-26-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Tier-0 metadata certification — not formal EX-2:7 Certification." as const,
    recordRef: "EX2-CERT-T0-2026-07-26-01" as const,
    certificationResult:
      "CertifiedForTier0SyntheticMetadataContractUse" as const,
    isFormalEx27Certification: false as const,
  }),
  Object.freeze({
    evidenceId: "EX2-UI-CERT-T0-2026-07-27-01" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Tier-0 UI certification — not formal EX-2:7 Certification or Platform." as const,
    record: ExecutiveJournalProductArchitectureTier0UiCertification,
    isFormalEx27Certification: false as const,
    isFormalEx26Platform: false as const,
    isFormalEx29PublicIndex: false as const,
  }),
  Object.freeze({
    evidenceId:
      "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact package identity for Tier-0 synthetic metadata contracts." as const,
    packageId:
      "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage" as const,
  }),
  Object.freeze({
    evidenceId: ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact Tier-0 synthetic consumer identity." as const,
    consumerId: ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
  }),
  Object.freeze({
    evidenceId: "EX-2:T0/ExecutiveJournalSyntheticContractPreview" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact Tier-0 synthetic product identity — not Platform." as const,
    record: ExecutiveJournalProductArchitectureTier0SyntheticUiProduct,
    isFormalEx26Platform: false as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:T0/ExecutiveJournalSyntheticPreviewUI" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes:
      "Exact Tier-0 UI identity — not EX-2:6 Platform or EX-2:9 Public Index." as const,
    uiIdentity: "EX-2:T0/ExecutiveJournalSyntheticPreviewUI" as const,
    isFormalEx26Platform: false as const,
    isFormalEx29PublicIndex: false as const,
  }),
  Object.freeze({
    evidenceId: "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact Tier-0 read-only UI facade identity." as const,
    record: ExecutiveJournalProductArchitectureTier0SyntheticUiFacade,
  }),
  Object.freeze({
    evidenceId: "DevelopmentTestHarnessOnly" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2:T0" as const,
    notes: "Exact Tier-0 harness host strategy — not App Router route." as const,
    record: ExecutiveJournalProductArchitectureTier0SyntheticUiHostStrategy,
    appRouterMounted: false as const,
  }),
  Object.freeze({
    evidenceId: "AD-EX2-08/RouteAssessment" as const,
    classification: "SupportingEvidence" as const,
    label: "SupportingEvidence" as const,
    productionApplicability: false as const,
    satisfiesFormalEx2PhaseAutomatically: false as const,
    sourcePhase: "EX-2 Architecture" as const,
    notes: "Route assessment remains DeferredSupportingEvidence." as const,
    record: ExecutiveJournalProductArchitectureAdEx208RouteDisposition,
    routeAssessment: "DeferredSupportingEvidence" as const,
    isFormalEx29PublicIndex: false as const,
  }),
] as const);

export const ExecutiveJournalExperienceEvidenceIds = Object.freeze(
  ExecutiveJournalExperienceEvidenceLedger.map((item) => item.evidenceId),
);

export const getExecutiveJournalExperienceEvidence = (evidenceId: string) => {
  const found = ExecutiveJournalExperienceEvidenceLedger.find(
    (item) => item.evidenceId === evidenceId,
  );
  if (!found) {
    throw new Error(
      `Unknown EX-2:1 evidence identity fails closed: ${JSON.stringify(evidenceId)}`,
    );
  }
  return found;
};

export const ExecutiveJournalExperienceEvidenceAdoptionPolicy =
  ExecutiveJournalProductArchitectureTier0EvidenceAdoptionPolicy;

export const ExecutiveJournalExperienceDecisions = Object.freeze({
  decisionIds: ExecutiveJournalExperienceArchitectureDecisionIds,
  decisions: ExecutiveJournalExperienceArchitectureDecisions,
  authorizingDecision: ExecutiveJournalExperienceAuthorizingDecision,
  authorizingDecisionId: "AD-EX2-08" as const,
  evidenceLedger: ExecutiveJournalExperienceEvidenceLedger,
  evidenceIds: ExecutiveJournalExperienceEvidenceIds,
  evidenceAdoptionPolicy: ExecutiveJournalExperienceEvidenceAdoptionPolicy,
  importBoundary: ExecutiveJournalExperienceEvidenceImportBoundary,
  getDecision: getExecutiveJournalExperienceArchitectureDecision,
  getEvidence: getExecutiveJournalExperienceEvidence,
  createsAdEx209: false as const,
  authorizesEx22: false as const,
  authorizesRoute: false as const,
  authorizesProduction: false as const,
  authorizesDeployment: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
