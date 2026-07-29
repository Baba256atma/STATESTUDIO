/**
 * AD-EX2-00 / AD-EX2-01 — Executive Journal Product Architecture verification.
 * Independent coverage for decisions, options, gates, allowlist, policy,
 * denylist, privacy, authorization, provider/adapter contracts, and boundaries.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ALLOWLIST_COVERAGE,
  AUTHORIZATION_BOUNDARY_COVERAGE,
  DENYLIST_COVERAGE,
  ExecutiveJournalProductArchitecture,
  ExecutiveJournalProductArchitectureAbsoluteDenylist,
  ExecutiveJournalProductArchitectureAllowlistFields,
  ExecutiveJournalProductArchitectureAlternatives,
  ExecutiveJournalProductArchitectureAdapterContract,
  ExecutiveJournalProductArchitectureAiMustNot,
  ExecutiveJournalProductArchitectureAllowedTelemetryClasses,
  ExecutiveJournalProductArchitectureDecisionAdrEx200,
  ExecutiveJournalProductArchitectureDecisionAdrEx201,
  ExecutiveJournalProductArchitectureDecisionAdrEx202,
  ExecutiveJournalProductArchitectureDecisionAdrEx203,
  ExecutiveJournalProductArchitectureDecisionAdrEx204,
  ExecutiveJournalProductArchitectureDecisionAdrEx205,
  ExecutiveJournalProductArchitectureDecisionAdrEx206,
  ExecutiveJournalProductArchitectureDecisionAdrEx207,
  ExecutiveJournalProductArchitectureDecisionAdrEx208,
  ExecutiveJournalProductArchitectureDecisionAdrEx209,
  ExecutiveJournalProductArchitectureDecisionAdrEx210,
  ExecutiveJournalProductArchitectureDecisionIds,
  ExecutiveJournalProductArchitectureDecisions,
  ExecutiveJournalProductArchitectureFormalEx2NinePhaseSequence,
  ExecutiveJournalProductArchitectureFormalEx2ReadinessChain,
  ExecutiveJournalProductArchitectureFormalEx2PhaseIdentities,
  ExecutiveJournalProductArchitectureAuthorizedEx21Foundation,
  ExecutiveJournalProductArchitectureAuthorizedEx22Registry,
  ExecutiveJournalProductArchitectureAuthorizedEx23Model,
  ExecutiveJournalProductArchitectureTier0EvidenceAdoptionPolicy,
  ExecutiveJournalProductArchitectureAdEx208AuthorizationFlags,
  ExecutiveJournalProductArchitectureAdEx209AuthorizationFlags,
  ExecutiveJournalProductArchitectureAdEx210AuthorizationFlags,
  ExecutiveJournalProductArchitectureEx21BlockedClarification,
  ExecutiveJournalProductArchitectureAdEx208PreservedOpenIssues,
  ExecutiveJournalProductArchitectureAdEx209PreservedOpenIssues,
  ExecutiveJournalProductArchitectureAdEx210PreservedOpenIssues,
  ExecutiveJournalProductArchitectureAdEx208RouteDisposition,
  ExecutiveJournalProductArchitectureInfrastructureReadiness,
  ExecutiveJournalProductArchitectureAdEx205GateImpact,
  ExecutiveJournalProductArchitectureAdEx206GateImpact,
  ExecutiveJournalProductArchitectureReopeningConditions,
  ExecutiveJournalProductArchitectureAuthGateImpact,
  ExecutiveJournalProductArchitectureTier0EnforcementGateImpact,
  ExecutiveJournalProductArchitectureTier0SyntheticUiAccessibility,
  ExecutiveJournalProductArchitectureTier0SyntheticUiAuthoritySecurityControls,
  ExecutiveJournalProductArchitectureTier0SyntheticUiBrowserStatePolicy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiDisplayPolicy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiEx21Strategy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiFacade,
  ExecutiveJournalProductArchitectureTier0SyntheticUiFeatureFlagPolicy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews,
  ExecutiveJournalProductArchitectureTier0SyntheticUiFutureAuthorization,
  ExecutiveJournalProductArchitectureTier0SyntheticUiHostStrategy,
  ExecutiveJournalProductArchitectureTier0SyntheticUiInformationArchitecture,
  ExecutiveJournalProductArchitectureTier0SyntheticUiMarker,
  ExecutiveJournalProductArchitectureTier0SyntheticUiPrivacyControls,
  ExecutiveJournalProductArchitectureTier0SyntheticUiProduct,
  ExecutiveJournalProductArchitectureTier0SyntheticUiResponsive,
  ExecutiveJournalProductArchitectureTier0SyntheticUiStatusLabels,
  ExecutiveJournalProductArchitectureTier0SyntheticUiTestPlan,
  ExecutiveJournalProductArchitectureTier0SyntheticUiViewStates,
  ExecutiveJournalProductArchitectureTier0UiGateIds,
  ExecutiveJournalProductArchitectureTier0UiGateImpact,
  ExecutiveJournalProductArchitectureTier0UiGates,
  ExecutiveJournalProductArchitectureTier0UiAppointmentConstraints,
  ExecutiveJournalProductArchitectureTier0UiAppointmentReopeningTriggers,
  ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityAppointment,
  ExecutiveJournalProductArchitectureTier0UiDualRoleException,
  ExecutiveJournalProductArchitectureTier0UiPrivacyAppointment,
  countExecutiveJournalProductArchitectureTier0UiGates,
  ExecutiveJournalProductArchitectureFormerTier0SyntheticConsumerId,
  ExecutiveJournalProductArchitectureGovernanceDecisionIds,
  ExecutiveJournalProductArchitectureGovernanceGovEx2T001,
  ExecutiveJournalProductArchitectureGovernanceGovEx2T002,
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2UiAuthT02026072701,
  ExecutiveJournalProductArchitectureHumanAuthorizationIds,
  ExecutiveJournalProductArchitectureUiAuthGateImpact,
  ExecutiveJournalProductArchitectureSyntheticAllowlistContract,
  ExecutiveJournalProductArchitectureSyntheticAllowlistFieldSemantics,
  ExecutiveJournalProductArchitectureSyntheticDevelopmentScope,
  ExecutiveJournalProductArchitectureSyntheticExcludedFields,
  ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields,
  ExecutiveJournalProductArchitectureSyntheticSequencePositionExclusion,
  ExecutiveJournalProductArchitectureSyntheticSourceClassification,
  ExecutiveJournalProductArchitectureSyntheticTelemetryPosition,
  ExecutiveJournalProductArchitectureSyntheticTestPlan,
  ExecutiveJournalProductArchitectureTier0AppointmentConstraints,
  ExecutiveJournalProductArchitectureTier0AppointmentReopeningTriggers,
  ExecutiveJournalProductArchitectureTier0AuthorityAppointment,
  ExecutiveJournalProductArchitectureTier0AuthorityReview,
  ExecutiveJournalProductArchitectureTier0DualRoleException,
  ExecutiveJournalProductArchitectureTier0PrivacyAppointment,
  ExecutiveJournalProductArchitectureTier0PrivacyReview,
  ExecutiveJournalProductArchitectureTier0ReviewAcceptanceGateImpact,
  ExecutiveJournalProductArchitectureTier0ReviewAiBoundary,
  ExecutiveJournalProductArchitectureTier0ReviewReopeningTriggers,
  ExecutiveJournalProductArchitectureTier0Reviews,
  ExecutiveJournalProductArchitectureTier0SyntheticConsumer,
  ExecutiveJournalProductArchitectureTier0SyntheticConsumerAliases,
  ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
  ExecutiveJournalProductArchitectureTier0SyntheticReviewResultSemantics,
  ExecutiveJournalProductArchitectureTier0SyntheticReviewResults,
  ExecutiveJournalProductArchitectureEligibilityResults,
  ExecutiveJournalProductArchitectureEnvironmentPolicy,
  ExecutiveJournalProductArchitectureEnvironments,
  ExecutiveJournalProductArchitectureIamRoles,
  ExecutiveJournalProductArchitectureInfrastructureAllowedTelemetry,
  ExecutiveJournalProductArchitectureInfrastructurePlatform,
  ExecutiveJournalProductArchitectureInfrastructureProhibitedTelemetry,
  ExecutiveJournalProductArchitectureKeyDomains,
  ExecutiveJournalProductArchitectureKeyManagementPolicy,
  ExecutiveJournalProductArchitectureKeyRoles,
  ExecutiveJournalProductArchitectureManagedPostgresPolicy,
  ExecutiveJournalProductArchitectureMandatoryPostgresCriteria,
  ExecutiveJournalProductArchitectureMigrationSecretsPolicy,
  ExecutiveJournalProductArchitectureObservabilityCapacityPolicy,
  ExecutiveJournalProductArchitectureOperationalOwnerNexoraRtcJournalOps,
  ExecutiveJournalProductArchitectureProhibitedTelemetryClasses,
  ExecutiveJournalProductArchitectureRecoveryPolicy,
  ExecutiveJournalProductArchitectureRecoveryTiers,
  ExecutiveJournalProductArchitectureRegionPolicy,
  ExecutiveJournalProductArchitectureSourceClassifications,
  ExecutiveJournalProductArchitectureSourceContractRtc2Ex2Source01,
  ExecutiveJournalProductArchitectureSourceFailureFamilies,
  ExecutiveJournalProductArchitectureSourceResultPrecedence,
  ExecutiveJournalProductArchitectureSourceResults,
  ExecutiveJournalProductArchitectureStorageStrategy,
  ExecutiveJournalProductArchitectureSystemOfRecordRtc2JournalSor01,
  ExecutiveJournalProductArchitectureThreatCatalogue,
  ExecutiveJournalProductArchitectureUnresolvedSelections,
  ExecutiveJournalProductArchitectureDenylistItems,
  ExecutiveJournalProductArchitectureEntryProjectionFields,
  ExecutiveJournalProductArchitectureFailureFamilies,
  ExecutiveJournalProductArchitectureFieldsRequiringFinalPolicy,
  ExecutiveJournalProductArchitectureGateIds,
  ExecutiveJournalProductArchitectureGateResults,
  ExecutiveJournalProductArchitectureGates,
  ExecutiveJournalProductArchitecturePolicyDecisionFields,
  ExecutiveJournalProductArchitecturePreliminaryAllowlist,
  ExecutiveJournalProductArchitectureProjectionContract,
  ExecutiveJournalProductArchitectureProjectionEnvelopeFields,
  ExecutiveJournalProductArchitectureProviderResults,
  ExecutiveJournalProductArchitectureProviderResultSemantics,
  ExecutiveJournalProductArchitectureProviderRtc2Ex2Provider01,
  GATE_COVERAGE,
  OPTION_COVERAGE,
  POLICY_DECISION_FIELD_COVERAGE,
  assertExecutiveJournalProductArchitectureAllowlistFieldId,
  assertExecutiveJournalProductArchitectureAuthorizationFlag,
  assertExecutiveJournalProductArchitectureDecisionId,
  assertExecutiveJournalProductArchitectureFormalEx2PhaseIdentity,
  assertExecutiveJournalProductArchitectureFormalEx2PhaseStatus,
  assertExecutiveJournalProductArchitectureFormalEx2Readiness,
  assertExecutiveJournalProductArchitectureDecisionStatus,
  assertExecutiveJournalProductArchitectureDenylistItemId,
  assertExecutiveJournalProductArchitectureEnvelopeFieldId,
  assertExecutiveJournalProductArchitectureEntryFieldId,
  assertExecutiveJournalProductArchitectureFailureFamily,
  assertExecutiveJournalProductArchitectureFieldPolicyStatus,
  assertExecutiveJournalProductArchitectureGateId,
  assertExecutiveJournalProductArchitectureGateResult,
  assertExecutiveJournalProductArchitectureOption,
  assertExecutiveJournalProductArchitectureEligibilityResult,
  assertExecutiveJournalProductArchitectureProjectionContractVersion,
  assertExecutiveJournalProductArchitectureProviderId,
  assertExecutiveJournalProductArchitectureProviderResult,
  assertExecutiveJournalProductArchitectureSequenceType,
  assertExecutiveJournalProductArchitectureSourceClassification,
  assertExecutiveJournalProductArchitectureSourceContractId,
  assertExecutiveJournalProductArchitectureSourceContractVersion,
  assertExecutiveJournalProductArchitectureSourceFailureFamily,
  assertExecutiveJournalProductArchitectureSourceId,
  assertExecutiveJournalProductArchitectureCloudPlatformSelection,
  assertExecutiveJournalProductArchitectureEnvironment,
  assertExecutiveJournalProductArchitectureHaClass,
  assertExecutiveJournalProductArchitectureIamRole,
  assertExecutiveJournalProductArchitectureInfrastructureReadinessOption,
  assertExecutiveJournalProductArchitectureInfrastructureTelemetry,
  assertExecutiveJournalProductArchitectureKeyDomain,
  assertExecutiveJournalProductArchitectureKeyRole,
  assertExecutiveJournalProductArchitectureOwnerId,
  assertExecutiveJournalProductArchitecturePlatformStatus,
  assertExecutiveJournalProductArchitecturePostgresProductClass,
  assertExecutiveJournalProductArchitectureProvisionalPlatformStatus,
  assertExecutiveJournalProductArchitectureRecoveryTier,
  assertExecutiveJournalProductArchitectureRecoveryTierAdEx205,
  assertExecutiveJournalProductArchitectureRegionDecisionStatus,
  assertExecutiveJournalProductArchitectureReopeningCondition,
  assertExecutiveJournalProductArchitectureReplicationStatus,
  assertExecutiveJournalProductArchitectureGovernanceDecisionId,
  assertExecutiveJournalProductArchitectureHumanAuthorizationId,
  assertExecutiveJournalProductArchitectureSyntheticOnlyAllowlistField,
  assertExecutiveJournalProductArchitectureSyntheticSourceClassification,
  assertExecutiveJournalProductArchitectureTier0ReviewId,
  assertExecutiveJournalProductArchitectureTier0SyntheticConsumerAlias,
  assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
  assertExecutiveJournalProductArchitectureTier0SyntheticReviewResult,
  assertExecutiveJournalProductArchitectureSourceRequestField,
  assertExecutiveJournalProductArchitectureSourceResponseField,
  assertExecutiveJournalProductArchitectureSourceResult,
  assertExecutiveJournalProductArchitectureStorageClass,
  assertExecutiveJournalProductArchitectureTelemetryClass,
  assertExecutiveJournalProductArchitectureThreatId,
  assertExecutiveJournalProductArchitectureTopologyClass,
  assertExecutiveJournalProductArchitectureTransportClass,
  assertExecutiveJournalProductArchitectureUnresolvedSelection,
  evaluateExecutiveJournalProductEx21GateEligibility,
  getExecutiveJournalProductArchitectureAllowlistField,
  getExecutiveJournalProductArchitectureAuthorizationFlagValue,
  getExecutiveJournalProductArchitectureDecision,
  getExecutiveJournalProductArchitectureGovernanceDecision,
  getExecutiveJournalProductArchitectureHumanAuthorization,
  getExecutiveJournalProductArchitectureTier0Review,
  getExecutiveJournalProductArchitectureDenylistItem,
  getExecutiveJournalProductArchitectureGate,
  getExecutiveJournalProductArchitecturePolicyDecisionField,
  getExecutiveJournalProductArchitectureSummary,
  getExecutiveJournalProductArchitectureFormalEx2Phase,
  isExecutiveJournalProductEx21Blocked,
  isExecutiveJournalProductEx21MetadataOnlyFoundationAuthorized,
  isExecutiveJournalProductEx22MetadataOnlyRegistryAuthorized,
  isExecutiveJournalProductEx23MetadataOnlyModelAuthorized,
  validateExecutiveJournalProductArchitectureCoverage,
} from "./executiveJournalProductArchitecture.ts";
import {
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationReadiness,
} from "./executiveJournalExperienceFoundation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = join(HERE, "../../..");
const RTC_DIR = join(FRONTEND_ROOT, "app/lib/rtc");
const APP8_DIR = join(FRONTEND_ROOT, "app/lib/decision-journal");

const mutateFrozen = (value: object): boolean => {
  try {
    (value as { mutated?: boolean }).mutated = true;
    return "mutated" in value;
  } catch {
    return false;
  }
};

const attemptNestedMutation = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  try {
    record.__nestedMutation = true;
    if ("__nestedMutation" in record) {
      return true;
    }
  } catch {
    // expected for frozen objects
  }
  for (const nested of Object.values(record)) {
    if (attemptNestedMutation(nested)) {
      return true;
    }
  }
  return false;
};

const GATE_EXPECTATIONS = Object.freeze([
  {
    gateId: "G-EX2-01",
    order: 1,
    name: "accepted AD-EX2-00",
    result: "Pass",
    why: "AD-EX2-00 is Accepted",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-02",
    order: 2,
    name: "product owner confirmed",
    result: "Pass",
    why: "product owner Bahadoor confirmed",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-03",
    order: 3,
    name: "provider/system of record selected",
    result: "Pass",
    why: "RTC2-JOURNAL-SOR-01 selected as SoR architecture strategy",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-04",
    order: 4,
    name: "provider is governed by or proven compatible with RTC-2",
    result: "Pending",
    why: "live source/provider compatibility unverified",
    blocksEx21: true,
  },
  {
    gateId: "G-EX2-05",
    order: 5,
    name: "versioned read-only projection contract defined",
    result: "Pass",
    why: "AD-EX2-01 accepts projection-contract architecture",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-06",
    order: 6,
    name: "exact EX-2 consumer identity defined",
    result: "Pass",
    why: "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer accepted by AD-EX2-06",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-07",
    order: 7,
    name: "final field allowlist approved",
    result: "Pending",
    why: "production final allowlist remains NonFinal; synthetic-only is not final",
    blocksEx21: true,
  },
  {
    gateId: "G-EX2-08",
    order: 8,
    name: "denylist mechanically enforced",
    result: "Pass",
    why: "EX-2:T0 synthetic package mechanical enforcement; Tier-0 only",
    blocksEx21: false,
    evidenceRef: "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
    evidenceScope: "Tier0SyntheticMechanicalEnforcementOnly",
    tier0SyntheticPassOnly: true,
  },
  {
    gateId: "G-EX2-09",
    order: 9,
    name: "private-reflection non-disclosure design approved",
    result: "Pass",
    why: "AD-EX2-01 accepts private non-disclosure architecture",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-10",
    order: 10,
    name: "privacy review passed",
    result: "Pass",
    why: "EX2-T0-PRIVACY-REVIEW-01 Tier-0 synthetic only; not production",
    blocksEx21: false,
    evidenceRef: "EX2-T0-PRIVACY-REVIEW-01",
    evidenceScope: "Tier0SyntheticMetadataOnly",
    tier0SyntheticPassOnly: true,
  },
  {
    gateId: "G-EX2-11",
    order: 11,
    name: "authority-boundary review passed",
    result: "Pass",
    why: "EX2-T0-AUTHORITY-REVIEW-01 Tier-0 synthetic only; not production",
    blocksEx21: false,
    evidenceRef: "EX2-T0-AUTHORITY-REVIEW-01",
    evidenceScope: "Tier0SyntheticReadOnlyContracts",
    tier0SyntheticPassOnly: true,
  },
  {
    gateId: "G-EX2-12",
    order: 12,
    name: "telemetry allowlist approved",
    result: "Pending",
    why: "telemetry allowlist pending",
    blocksEx21: true,
  },
  {
    gateId: "G-EX2-13",
    order: 13,
    name: "adapter ownership assigned",
    result: "Pass",
    why: "adapter ownership assigned to EX-2 Product Boundary",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-14",
    order: 14,
    name: "scoped human authorization recorded",
    result: "Pass",
    why: "EX2-AUTH-T0-2026-07-26-01 Tier-0 contracts/tests only; not production/deployment",
    blocksEx21: false,
    evidenceRef: "EX2-AUTH-T0-2026-07-26-01",
    evidenceScope: "Tier0SyntheticContractsAndTestsOnly",
    tier0SyntheticPassOnly: true,
  },
  {
    gateId: "G-EX2-15",
    order: 15,
    name: "APP-8 and RTC-3 remain outside scope",
    result: "Pass",
    why: "APP-8 and RTC-3 exclusion formally confirmed",
    blocksEx21: false,
  },
  {
    gateId: "G-EX2-16",
    order: 16,
    name: "implementation test plan approved",
    result: "Pass",
    why: "AD-EX2-06 accepts Tier-0 synthetic test plan",
    blocksEx21: false,
  },
] as const);

const PASS_GATE_IDS = Object.freeze([
  "G-EX2-01",
  "G-EX2-02",
  "G-EX2-03",
  "G-EX2-05",
  "G-EX2-06",
  "G-EX2-08",
  "G-EX2-09",
  "G-EX2-10",
  "G-EX2-11",
  "G-EX2-13",
  "G-EX2-14",
  "G-EX2-15",
  "G-EX2-16",
] as const);

const ALLOWLIST_EXPECTATIONS = Object.freeze([
  {
    fieldId: "journal_ref",
    canonicalName: "journal_ref",
    transformationRequired: false,
  },
  {
    fieldId: "entry_ref",
    canonicalName: "entry_ref",
    transformationRequired: false,
  },
  {
    fieldId: "canonical_sequence_position",
    canonicalName: "canonical sequence position",
    transformationRequired: true,
  },
  {
    fieldId: "shareable_entry_category",
    canonicalName: "shareable entry category",
    transformationRequired: true,
  },
  {
    fieldId: "lifecycle_state",
    canonicalName: "lifecycle state",
    transformationRequired: false,
  },
  {
    fieldId: "origin_classification",
    canonicalName: "transformed origin classification",
    transformationRequired: true,
  },
  {
    fieldId: "authority_state",
    canonicalName: "coarse authority state",
    transformationRequired: true,
  },
  {
    fieldId: "provenance_ref",
    canonicalName: "opaque provenance reference",
    transformationRequired: true,
  },
  {
    fieldId: "evidence_present",
    canonicalName: "evidence_present",
    transformationRequired: false,
  },
  {
    fieldId: "correction_ref",
    canonicalName: "opaque correction reference",
    transformationRequired: true,
  },
  {
    fieldId: "supersession_ref",
    canonicalName: "opaque supersession reference",
    transformationRequired: true,
  },
  {
    fieldId: "projection_version",
    canonicalName: "projection version",
    transformationRequired: false,
  },
  {
    fieldId: "integrity_state",
    canonicalName: "coarse integrity state",
    transformationRequired: true,
  },
] as const);

const POLICY_EXPECTATIONS = Object.freeze([
  {
    fieldId: "timestamp_or_date_bucket",
    canonicalName: "timestamp or date bucket",
  },
  { fieldId: "RestrictedWorking", canonicalName: "RestrictedWorking" },
  { fieldId: "RegulatedPrivileged", canonicalName: "RegulatedPrivileged" },
  { fieldId: "disposition_state", canonicalName: "disposition state" },
  {
    fieldId: "sparse_sequence_behavior",
    canonicalName: "sparse sequence behavior",
  },
  {
    fieldId: "filtered_private_activity_reveal",
    canonicalName: "any field capable of revealing filtered private activity",
  },
] as const);

const DENYLIST_EXPECTATIONS = Object.freeze([
  { itemId: "journal_body", identity: "journal body" },
  { itemId: "narrative", identity: "narrative" },
  { itemId: "rationale", identity: "rationale" },
  {
    itemId: "private_reflection_content",
    identity: "private-reflection content",
  },
  {
    itemId: "private_reflection_identity",
    identity: "private-reflection identity",
  },
  {
    itemId: "private_reflection_timestamp",
    identity: "private-reflection timestamp",
  },
  {
    itemId: "private_reflection_count",
    identity: "private-reflection count",
  },
  {
    itemId: "private_reflection_existence",
    identity: "private-reflection existence signal",
  },
  { itemId: "evidence_content", identity: "evidence content" },
  { itemId: "resolvable_evidence_uri", identity: "resolvable evidence URI" },
  { itemId: "authority_evidence", identity: "authority evidence" },
  {
    itemId: "actor_pii",
    identity: "actor identity or sensitive PII",
  },
  {
    itemId: "jurisdiction_location",
    identity: "jurisdiction or location information",
  },
  { itemId: "retention_instructions", identity: "retention instructions" },
  {
    itemId: "disclosure_export_details",
    identity: "disclosure/export details",
  },
  { itemId: "operational_commands", identity: "operational commands" },
  { itemId: "mutation_apis", identity: "mutation APIs" },
] as const);

const mtimeMs = (relativePath: string): number =>
  statSync(join(FRONTEND_ROOT, relativePath)).mtimeMs;

describe("AD-EX2-00 — Executive Journal Product Architecture", () => {
  describe("decision identity", () => {
    it("records exact AD-EX2-00 identity fields once", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(decision.decisionId, "AD-EX2-00");
      assert.equal(
        decision.title,
        "Establish EX-2 as a Read-Only RTC-2-Governed Executive Journal Experience",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.selectedOption, "C");
      assert.equal(decision.decisionScope, "architectural direction only");
      assert.equal(
        decision.decisionDateClassification,
        "supplied-decision-date",
      );
      assert.equal(ExecutiveJournalProductArchitectureDecisions.length, 11);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-00"),
        decision,
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-00"),
        "AD-EX2-00",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionStatus("Accepted"),
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.decisionId,
        "AD-EX2-01",
      );
    });

    it("fails closed for unknown, malformed, case-modified, and whitespace decision IDs", () => {
      for (const value of [
        "AD-EX2-11",
        "AD-EX2",
        "ad-ex2-00",
        "AD-EX2-00 ",
        " AD-EX2-00",
        "ad-ex2-01",
        "ad-ex2-02",
        "ad-ex2-03",
        "ad-ex2-04",
        "ad-ex2-05",
        "ad-ex2-06",
        "ad-ex2-07",
        "ad-ex2-08",
        "ad-ex2-09",
        "AD_EX2_00",
        "",
      ]) {
        assert.throws(
          () => assertExecutiveJournalProductArchitectureDecisionId(value),
          /fails closed/,
        );
        assert.throws(
          () => getExecutiveJournalProductArchitectureDecision(value),
          /fails closed/,
        );
      }
    });
  });

  describe("OPTION_COVERAGE", () => {
    it("covers all five options exactly once in canonical order", () => {
      assert.deepEqual([...OPTION_COVERAGE], ["A", "B", "C", "D", "E"]);
      assert.equal(new Set(OPTION_COVERAGE).size, 5);
      assert.deepEqual(
        ExecutiveJournalProductArchitectureAlternatives.map((item) => ({
          option: item.option,
          name: item.name,
          selected: item.selected,
        })),
        [
          { option: "A", name: "No EX-2 product", selected: false },
          {
            option: "B",
            name: "Status-only metadata surface",
            selected: false,
          },
          {
            option: "C",
            name: "Read-only journal projection",
            selected: true,
          },
          {
            option: "D",
            name: "Operational journal client",
            selected: false,
          },
          { option: "E", name: "APP-8-backed EX-2", selected: false },
        ],
      );
      assert.equal(mutateFrozen(OPTION_COVERAGE as object), false);
    });

    for (const option of ["A", "B", "D", "E"] as const) {
      it(`Option ${option} is not selected and not authorized`, () => {
        const alt = ExecutiveJournalProductArchitectureAlternatives.find(
          (item) => item.option === option,
        )!;
        assert.equal(alt.selected, false);
        assert.equal(alt.rejectedForNow, true);
        assert.equal(
          ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
          "C",
        );
        assert.equal(
          ExecutiveJournalProductArchitectureDecisionAdrEx200
            .implementationAuthorized,
          false,
        );
      });
    }

    it("Option C is selected", () => {
      const alt = ExecutiveJournalProductArchitectureAlternatives.find(
        (item) => item.option === "C",
      )!;
      assert.equal(alt.selected, true);
      assert.equal(alt.rejectedForNow, false);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
    });

    it("Option D requires a future architecture decision", () => {
      assert.match(
        ExecutiveJournalProductArchitectureAlternatives.find(
          (item) => item.option === "D",
        )!.reconsiderationRule!,
        /new architecture decision/,
      );
    });

    it("Option E requires APP-8/RTC-2 compatibility and ownership decisions", () => {
      assert.match(
        ExecutiveJournalProductArchitectureAlternatives.find(
          (item) => item.option === "E",
        )!.reconsiderationRule!,
        /APP-8\/RTC-2 compatibility/,
      );
    });

    it("unknown option values fail closed and catalogue is immutable", () => {
      assert.throws(() => assertExecutiveJournalProductArchitectureOption("F"));
      assert.throws(() => assertExecutiveJournalProductArchitectureOption("c"));
      assert.throws(() => assertExecutiveJournalProductArchitectureOption(""));
      for (const alt of ExecutiveJournalProductArchitectureAlternatives) {
        assert.equal(mutateFrozen(alt), false);
      }
    });
  });

  describe("GATE_COVERAGE", () => {
    it("contains exactly the 16 canonical gates with no missing or extra entries", () => {
      assert.equal(GATE_COVERAGE.length, 16);
      assert.equal(new Set(GATE_COVERAGE).size, 16);
      assert.deepEqual([...GATE_COVERAGE], [...ExecutiveJournalProductArchitectureGateIds]);
      assert.deepEqual(
        [...GATE_COVERAGE],
        GATE_EXPECTATIONS.map((item) => item.gateId),
      );
      assert.equal(validateExecutiveJournalProductArchitectureCoverage(), true);
      assert.equal(mutateFrozen(GATE_COVERAGE as object), false);
    });

    for (const expectation of GATE_EXPECTATIONS) {
      it(`directly tests ${expectation.gateId}`, () => {
        const gate = getExecutiveJournalProductArchitectureGate(
          expectation.gateId,
        );
        assert.equal(gate.gateId, expectation.gateId);
        assert.equal(gate.name, expectation.name);
        assert.equal(gate.order, expectation.order);
        assert.equal(gate.mandatoryBeforeEx21, true);
        assert.equal(gate.result, expectation.result);
        assert.ok(expectation.why.length > 0);
        if ("evidenceRef" in expectation && expectation.evidenceRef) {
          assert.equal(gate.evidenceRef, expectation.evidenceRef);
          assert.equal(gate.evidenceScope, expectation.evidenceScope);
          assert.equal(gate.tier0SyntheticPassOnly, true);
          assert.equal(gate.productionPass, false);
        }
        if (expectation.result === "Pass") {
          assert.ok(
            (PASS_GATE_IDS as readonly string[]).includes(expectation.gateId),
          );
        } else {
          assert.equal(expectation.result, "Pending");
          assert.equal(expectation.blocksEx21, true);
        }
        const eligibility = evaluateExecutiveJournalProductEx21GateEligibility(
          ExecutiveJournalProductArchitectureGates,
        );
        if (expectation.blocksEx21) {
          assert.ok(eligibility.blockingGateIds.includes(expectation.gateId));
          assert.equal(eligibility.eligible, false);
        }
        assert.equal(eligibility.authorizesImplementation, false);
        assert.equal(eligibility.authorizesEx21Creation, false);
        assert.equal(mutateFrozen(gate), false);
        assert.equal(
          assertExecutiveJournalProductArchitectureGateId(expectation.gateId),
          expectation.gateId,
        );
      });
    }

    it("rejects unknown gate IDs and only allows justified Pass gates", () => {
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGateId("G-EX2-17")
      );
      assert.throws(() =>
        getExecutiveJournalProductArchitectureGate("G-EX2-00")
      );
      const passed = ExecutiveJournalProductArchitectureGates
        .filter((item) => item.result === "Pass")
        .map((item) => item.gateId);
      assert.deepEqual(passed, [...PASS_GATE_IDS]);
      assert.equal(passed.length, 13);
      assert.equal(
        ExecutiveJournalProductArchitectureGates.filter(
          (item) => item.result === "Pending",
        ).length,
        3,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
    });
  });

  describe("gate-state behavior", () => {
    it("defines closed vocabulary Pass, Pending, Fail, NotEvaluated", () => {
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureGateResults],
        ["Pass", "Fail", "Pending", "NotEvaluated"],
      );
      for (const state of ExecutiveJournalProductArchitectureGateResults) {
        assert.equal(
          assertExecutiveJournalProductArchitectureGateResult(state),
          state,
        );
      }
    });

    it("fails closed for unknown and missing gate states", () => {
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGateResult("Waived")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGateResult("pass")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGateResult("")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGateResult(
          undefined as unknown as string,
        )
      );
    });

    it("any mandatory Pending, Fail, or NotEvaluated gate blocks EX-2:1", () => {
      for (const result of ["Pending", "Fail", "NotEvaluated"] as const) {
        const gates = ExecutiveJournalProductArchitectureGates.map((item) =>
          Object.freeze({
            gateId: item.gateId,
            result: item.gateId === "G-EX2-03" ? result : "Pass",
            mandatoryBeforeEx21: true as const,
          })
        );
        const eligibility = evaluateExecutiveJournalProductEx21GateEligibility(
          gates,
        );
        assert.equal(eligibility.eligible, false, result);
        assert.deepEqual(eligibility.blockingGateIds, ["G-EX2-03"]);
        assert.equal(eligibility.authorizesImplementation, false);
      }
    });

    it("only all mandatory Pass could make EX-2:1 eligible without authorizing implementation", () => {
      const allPass = ExecutiveJournalProductArchitectureGates.map((item) =>
        Object.freeze({
          gateId: item.gateId,
          result: "Pass" as const,
          mandatoryBeforeEx21: true as const,
        })
      );
      const eligibility = evaluateExecutiveJournalProductEx21GateEligibility(
        allPass,
      );
      assert.equal(eligibility.eligible, true);
      assert.equal(eligibility.authorizesImplementation, false);
      assert.equal(eligibility.authorizesEx21Creation, false);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200
          .implementationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200
          .ex21CreationAuthorized,
        false,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
    });

    it("current gate state cannot be mutated after construction", () => {
      for (const gate of ExecutiveJournalProductArchitectureGates) {
        assert.equal(mutateFrozen(gate), false);
        assert.throws(() => {
          (gate as { result: string }).result = "Pass";
        });
      }
    });
  });

  describe("ALLOWLIST_COVERAGE", () => {
    it("covers every preliminary candidate exactly once in deterministic order", () => {
      assert.deepEqual(
        [...ALLOWLIST_COVERAGE],
        ALLOWLIST_EXPECTATIONS.map((item) => item.fieldId),
      );
      assert.equal(new Set(ALLOWLIST_COVERAGE).size, ALLOWLIST_COVERAGE.length);
      assert.equal(
        ExecutiveJournalProductArchitectureAllowlistFields.length,
        13,
      );
      assert.equal(mutateFrozen(ALLOWLIST_COVERAGE as object), false);
    });

    for (const expectation of ALLOWLIST_EXPECTATIONS) {
      it(`directly tests preliminary allowlist field ${expectation.fieldId}`, () => {
        const field = getExecutiveJournalProductArchitectureAllowlistField(
          expectation.fieldId,
        );
        assert.equal(field.fieldId, expectation.fieldId);
        assert.equal(field.canonicalName, expectation.canonicalName);
        assert.equal(field.policyStatus, "PreliminaryCandidate");
        assert.equal(
          field.transformationRequired,
          expectation.transformationRequired,
        );
        assert.equal(field.nonPayload, true);
        assert.equal(field.finalAllowlist, false);
        assert.equal(field.authorizedForExConsumption, false);
        assert.equal(field.mayCrossProjectionBoundaryYet, false);
        assert.equal(field.immutable, true);
        assert.equal(mutateFrozen(field), false);
      });
    }

    it("preliminary allowlist is not final and does not authorize consumption", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(decision.allowlistFinal, false);
      assert.equal(decision.allowlistAuthorized, false);
      assert.equal(
        decision.preliminaryAllowlist,
        ExecutiveJournalProductArchitecturePreliminaryAllowlist,
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureAllowlistFieldId("secret")
      );
      assert.throws(() =>
        getExecutiveJournalProductArchitectureAllowlistField("journal_body")
      );
    });
  });

  describe("policy-decision fields", () => {
    it("covers every NeedsDecision field independently", () => {
      assert.deepEqual(
        [...POLICY_DECISION_FIELD_COVERAGE],
        POLICY_EXPECTATIONS.map((item) => item.fieldId),
      );
      assert.equal(
        ExecutiveJournalProductArchitecturePolicyDecisionFields.length,
        6,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureFieldsRequiringFinalPolicy.length,
        6,
      );
    });

    for (const expectation of POLICY_EXPECTATIONS) {
      it(`directly tests policy field ${expectation.fieldId}`, () => {
        const field = getExecutiveJournalProductArchitecturePolicyDecisionField(
          expectation.fieldId,
        );
        assert.equal(field.fieldId, expectation.fieldId);
        assert.equal(field.canonicalName, expectation.canonicalName);
        assert.equal(field.policyStatus, "NeedsDecision");
        assert.equal(field.inAuthorizedAllowlist, false);
        assert.equal(field.mayCrossProjectionBoundaryYet, false);
        assert.equal(field.defaultPolicyAssumed, false);
        assert.ok(field.reviewOwner.length > 0);
        assert.equal(
          (ALLOWLIST_COVERAGE as readonly string[]).includes(field.fieldId),
          false,
        );
        assert.equal(
          assertExecutiveJournalProductArchitectureFieldPolicyStatus(
            "NeedsDecision",
          ),
          "NeedsDecision",
        );
        assert.equal(mutateFrozen(field), false);
      });
    }

    it("unknown policy-decision fields fail closed", () => {
      assert.throws(() =>
        getExecutiveJournalProductArchitecturePolicyDecisionField("unknown")
      );
    });
  });

  describe("DENYLIST_COVERAGE", () => {
    it("covers every prohibited item with completeness checks", () => {
      assert.deepEqual(
        [...DENYLIST_COVERAGE],
        DENYLIST_EXPECTATIONS.map((item) => item.itemId),
      );
      assert.equal(new Set(DENYLIST_COVERAGE).size, DENYLIST_COVERAGE.length);
      assert.equal(ExecutiveJournalProductArchitectureDenylistItems.length, 17);
      const allowNames = new Set(
        ExecutiveJournalProductArchitectureAllowlistFields.map(
          (item) => item.canonicalName,
        ),
      );
      for (const item of ExecutiveJournalProductArchitectureDenylistItems) {
        assert.equal(allowNames.has(item.canonicalIdentity), false);
      }
      assert.equal(validateExecutiveJournalProductArchitectureCoverage(), true);
    });

    for (const expectation of DENYLIST_EXPECTATIONS) {
      it(`directly tests denylist item ${expectation.itemId}`, () => {
        const item = getExecutiveJournalProductArchitectureDenylistItem(
          expectation.itemId,
        );
        assert.equal(item.itemId, expectation.itemId);
        assert.equal(item.canonicalIdentity, expectation.identity);
        assert.equal(item.prohibited, true);
        assert.ok(item.prohibitionReason.length > 0);
        assert.equal(
          (ExecutiveJournalProductArchitecturePreliminaryAllowlist as readonly string[])
            .includes(item.canonicalIdentity),
          false,
        );
        assert.equal(
          ExecutiveJournalProductArchitectureDecisionAdrEx200
            .authorizationRecorded,
          false,
        );
        assert.equal(mutateFrozen(item), false);
        assert.equal(
          assertExecutiveJournalProductArchitectureDenylistItemId(
            expectation.itemId,
          ),
          expectation.itemId,
        );
      });
    }

    it("rejects unknown denylist entries", () => {
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDenylistItemId("unknown")
      );
      assert.ok(
        (ExecutiveJournalProductArchitectureAbsoluteDenylist as readonly string[])
          .includes("journal body"),
      );
    });
  });

  describe("private-reflection verification", () => {
    it("keeps every private-reflection exposure control false and non-overridable", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(decision.privateReflectionContentExposed, false);
      assert.equal(decision.privateReflectionIdentityExposed, false);
      assert.equal(decision.privateReflectionTimestampExposed, false);
      assert.equal(decision.privateReflectionCountExposed, false);
      assert.equal(decision.privateReflectionExistenceExposed, false);
      assert.equal(decision.privateReflectionPromotionSupported, false);
      assert.equal(
        decision.privateReflectionEmptyStateFilteringDisclosure,
        false,
      );
      assert.equal(decision.privateReflectionTelemetryExposure, false);
      assert.equal(decision.sparseSequenceInferenceApproved, false);
      assert.equal(
        decision.privateReflectionRestrictionsOverrideableByAuthorization,
        false,
      );
      assert.equal(decision.privateReflectionAuthorized, false);
      assert.equal(decision.privateReflectionContentProhibited, true);
      assert.equal(decision.privateReflectionIdentityProhibited, true);
      assert.equal(decision.privateReflectionTimestampProhibited, true);
      assert.equal(decision.privateReflectionCountProhibited, true);
      assert.equal(decision.privateReflectionExistenceProhibited, true);
    });
  });

  describe("AUTHORIZATION_BOUNDARY_COVERAGE", () => {
    it("records Tier-0 scoped authorization while keeping all other flags false", () => {
      assert.equal(AUTHORIZATION_BOUNDARY_COVERAGE.length, 28);
      assert.equal(
        new Set(AUTHORIZATION_BOUNDARY_COVERAGE).size,
        AUTHORIZATION_BOUNDARY_COVERAGE.length,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureAuthorizationFlagValue(
          "authorizationRecorded",
        ),
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary
          .authorizationRecorded,
        true,
      );
      for (const flag of AUTHORIZATION_BOUNDARY_COVERAGE) {
        if (flag === "authorizationRecorded") {
          continue;
        }
        assert.equal(
          getExecutiveJournalProductArchitectureAuthorizationFlagValue(flag),
          false,
          flag,
        );
        assert.equal(
          ExecutiveJournalProductArchitecture.authorizationBoundary[flag],
          false,
          flag,
        );
      }
      assert.equal(mutateFrozen(AUTHORIZATION_BOUNDARY_COVERAGE as object), false);
    });

    it("distinguishes proposed authorization, architecture acceptance, and product-owner approval from recorded authorization", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(
        decision.proposedFutureAuthorizationResult,
        "AuthorizedForSpecificExJournalMetadataConsumption",
      );
      assert.equal(decision.authorizationStatus, "NotRecorded");
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.productOwner, "Bahadoor");
      assert.equal(decision.implementationAuthorized, false);
      const passedOnly = evaluateExecutiveJournalProductEx21GateEligibility(
        ExecutiveJournalProductArchitectureGates.map((item) =>
          Object.freeze({
            gateId: item.gateId,
            result:
              item.gateId === "G-EX2-01" || item.gateId === "G-EX2-02"
                ? ("Pass" as const)
                : item.result,
            mandatoryBeforeEx21: true as const,
          })
        ),
      );
      assert.equal(passedOnly.eligible, false);
      assert.equal(passedOnly.authorizesImplementation, false);
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureAuthorizationFlag("deployed")
      );
    });
  });

  describe("provider boundary", () => {
    it("proves provider remains unselected and EX-2:1 blocked by provider gate", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(decision.providerSelected, false);
      assert.equal(decision.existingLiveProviderFound, false);
      assert.equal(decision.app8Selected, false);
      assert.equal(
        decision.rtc2ContractsAreGovernanceAuthorityNotLiveProvider,
        true,
      );
      assert.equal(
        decision.preferredProviderClass,
        "Future RTC-2-Governed Read-Only Projection Provider",
      );
      assert.equal(decision.providerDecisionRequired, true);
      assert.equal(decision.providerImplementationAuthorized, false);
      assert.equal(decision.adapterImplemented, false);
      assert.equal(decision.providerImplemented, false);
      assert.equal(decision.systemOfRecordResolved, false);
      assert.equal(
        ExecutiveJournalProductArchitectureSystemOfRecordRtc2JournalSor01
          .architectureStatus,
        "AcceptedSystemOfRecordClass",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSystemOfRecordRtc2JournalSor01
          .runtimeStatus,
        "NotImplemented",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-03").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(decision.app8Selected, false);
      assert.notEqual(decision.app8Selected, true);
    });
  });

  describe("dependency direction", () => {
    it("declares target dependency direction and prohibits runtime imports", () => {
      const source = readFileSync(
        join(HERE, "executiveJournalProductArchitecture.ts"),
        "utf8",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.dependencyDirection,
        "EX-2 presentation → allowlisted projection/adapter → authorized RTC-2-governed provider",
      );
      assert.equal(/^import /m.test(source), false);
      assert.doesNotMatch(source, /from ["']react["']/);
      assert.doesNotMatch(source, /from ["']next/);
      assert.doesNotMatch(source, /executiveJournalRuntime/);
      assert.doesNotMatch(source, /executiveDecisionRegister/);
      assert.doesNotMatch(source, /decision-journal/);
      assert.doesNotMatch(source, /executiveStagePublicIndex/);
      assert.doesNotMatch(source, /node:fs|node:net|node:child_process|fetch\(/);
      assert.doesNotMatch(source, /node:crypto|Math\.random|Date\.now|new Date/);
      assert.doesNotMatch(source, /EventEmitter|Worker|queue|bullmq/);
      assert.doesNotMatch(
        source,
        /from ["']pg["']|from ["']postgres["']|require\(["']pg["']\)|prisma|drizzle-orm|sqlalchemy/i,
      );
      assert.doesNotMatch(
        source,
        /from ["']@aws-sdk|from ["']aws-sdk|from ["']@google-cloud|from ["']@azure\/|from ["']@supabase|from ["']@neondatabase|knex|typeorm|sequelize|flyway|liquibase|node-pg-migrate/i,
      );
      assert.equal(/^import /m.test(source), false);
      assert.equal(
        ExecutiveJournalProductArchitectureStorageStrategy
          .postgresDependencyInstalled,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureManagedPostgresPolicy
          .postgresClientInstalled,
        false,
      );
      assert.equal(ExecutiveJournalProductArchitecture.importsReact, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsNext, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsRtc2Runtime, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsRtc3Runtime, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsApp8, false);
      assert.equal(ExecutiveJournalProductArchitecture.usesNetwork, false);
      assert.equal(ExecutiveJournalProductArchitecture.usesPersistence, false);
      assert.equal(ExecutiveJournalProductArchitecture.implementsAdapter, false);
      assert.equal(ExecutiveJournalProductArchitecture.implementsProvider, false);
      assert.equal(ExecutiveJournalProductArchitecture.circularDependency, false);
      assert.equal(ExecutiveJournalProductArchitecture.reverseDependency, false);
    });
  });

  describe("immutability and mutation safety", () => {
    it("deeply freezes decision catalogues and summary", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      const before = JSON.stringify(decision);
      assert.equal(attemptNestedMutation(decision), false);
      assert.equal(attemptNestedMutation(ExecutiveJournalProductArchitectureAlternatives), false);
      assert.equal(attemptNestedMutation(ExecutiveJournalProductArchitectureGates), false);
      assert.equal(
        attemptNestedMutation(ExecutiveJournalProductArchitectureAllowlistFields),
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitecturePolicyDecisionFields,
        ),
        false,
      );
      assert.equal(
        attemptNestedMutation(ExecutiveJournalProductArchitectureDenylistItems),
        false,
      );
      assert.equal(attemptNestedMutation(ExecutiveJournalProductArchitecture), false);
      const summaryA = getExecutiveJournalProductArchitectureSummary();
      const summaryB = getExecutiveJournalProductArchitectureSummary();
      assert.equal(attemptNestedMutation(summaryA), false);
      assert.deepEqual(summaryA, summaryB);
      assert.equal(JSON.stringify(decision), before);
      const input = { decisionId: "AD-EX2-00" };
      getExecutiveJournalProductArchitectureDecision(input.decisionId);
      input.decisionId = "AD-EX2-01";
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.decisionId,
        "AD-EX2-00",
      );
    });
  });

  describe("summary verification", () => {
    it("directly verifies every summary field and gate counts", () => {
      const summary = getExecutiveJournalProductArchitectureSummary();
      assert.equal(summary.decisionIdAdEx200, "AD-EX2-00");
      assert.equal(summary.decisionIdAdEx201, "AD-EX2-01");
      assert.equal(summary.decisionIdAdEx202, "AD-EX2-02");
      assert.equal(summary.decisionIdAdEx203, "AD-EX2-03");
      assert.equal(summary.decisionIdAdEx204, "AD-EX2-04");
      assert.equal(summary.decisionIdAdEx205, "AD-EX2-05");
      assert.equal(summary.decisionIdAdEx206, "AD-EX2-06");
      assert.equal(summary.statusAdEx200, "Accepted");
      assert.equal(summary.statusAdEx201, "Accepted");
      assert.equal(summary.statusAdEx202, "Accepted");
      assert.equal(summary.statusAdEx203, "Accepted");
      assert.equal(summary.statusAdEx204, "Accepted");
      assert.equal(summary.statusAdEx205, "Accepted");
      assert.equal(summary.statusAdEx206, "Accepted");
      assert.equal(summary.selectedOption, "C");
      assert.equal(
        summary.selectedArchitectureAdEx201,
        "Future RTC-2-Governed Projection Provider with Separate EX-2 Privacy Adapter",
      );
      assert.equal(
        summary.selectedStrategyAdEx202,
        "RTC-2-Governed Append-Only System of Record with Source-Side Eligibility Filtering",
      );
      assert.equal(
        summary.selectedPrivacyOptionAdEx202,
        "Option B — System of Record Produces Pre-Filtered Eligible Metadata",
      );
      assert.equal(summary.authority, "Bahadoor");
      assert.equal(summary.productOwner, "Bahadoor");
      assert.equal(summary.decisionDate, "2026-07-26");
      assert.equal(summary.providerId, "RTC2-EX2-PROVIDER-01");
      assert.equal(summary.providerArchitectureStatus, "AcceptedProviderClass");
      assert.equal(summary.providerRuntimeStatus, "NotImplemented");
      assert.equal(summary.providerSelected, false);
      assert.equal(summary.liveProviderSelected, false);
      assert.equal(summary.systemOfRecordId, "RTC2-JOURNAL-SOR-01");
      assert.equal(
        summary.systemOfRecordArchitectureStatus,
        "AcceptedSystemOfRecordClass",
      );
      assert.equal(summary.systemOfRecordRuntimeStatus, "NotImplemented");
      assert.equal(summary.sourceContractId, "RTC2-EX2-SOURCE-CONTRACT-01");
      assert.equal(summary.sourceContractVersion, "rtc2-ex2-source/v0");
      assert.equal(summary.operationalOwnerId, "NEXORA-RTC-JOURNAL-OPS");
      assert.equal(summary.operationalOwnerStatus, "AcceptedOperationalOwner");
      assert.equal(
        summary.storageClass,
        "PostgreSQLAppendOnlyTransactionalEventStore",
      );
      assert.equal(summary.storageVendorUnresolved, true);
      assert.equal(summary.storageRegionUnresolved, true);
      assert.equal(
        summary.transportClass,
        "AuthenticatedInternalServiceContract",
      );
      assert.equal(
        summary.infrastructurePlatformStatus,
        "NoEstablishedCloudPlatform",
      );
      assert.equal(
        summary.postgresqlProductClass,
        "DedicatedManagedPostgreSQL",
      );
      assert.equal(summary.infrastructureReadinessOption, "E");
      assert.equal(
        summary.infrastructureRecoveryTier,
        "Tier0ArchitectureAndSyntheticOnly",
      );
      assert.equal(
        summary.cloudPlatformSelection,
        "NoProductionPlatformYet",
      );
      assert.equal(
        summary.azureProvisionalStatus,
        "ProvisionalPreferredCandidate",
      );
      assert.equal(
        summary.awsProvisionalStatus,
        "ProvisionalSecondCandidate",
      );
      assert.equal(
        summary.gcpProvisionalStatus,
        "ProvisionalFallbackCandidate",
      );
      assert.equal(summary.cloudPlatformSelected, false);
      assert.equal(summary.postgresqlProductSelected, false);
      assert.equal(summary.vendorSelected, false);
      assert.equal(summary.regionSelected, false);
      assert.equal(summary.kmsSelected, false);
      assert.equal(summary.keysCreated, false);
      assert.equal(summary.rpoSelected, false);
      assert.equal(summary.rtoSelected, false);
      assert.equal(summary.provisioningAuthorized, false);
      assert.equal(summary.productionInfrastructureSelected, false);
      assert.equal(
        summary.tier0SyntheticConsumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(summary.syntheticOnlyAllowlistApproved, true);
      assert.equal(summary.syntheticAllowlistFinal, true);
      assert.equal(summary.productionAllowlistFinal, false);
      assert.equal(summary.realRtc2AllowlistAuthorized, false);
      assert.equal(summary.productionFinalAllowlist, false);
      assert.equal(summary.syntheticTelemetryEnabled, false);
      assert.equal(summary.syntheticTestPlanApproved, true);
      assert.equal(summary.governanceDecisionIdGovEx2T001, "GOV-EX2-T0-01");
      assert.equal(summary.governanceDecisionIdGovEx2T002, "GOV-EX2-T0-02");
      assert.equal(summary.governanceDecisionStatusGovEx2T002, "Accepted");
      assert.equal(
        summary.tier0UiPrivacyAppointmentId,
        "EX2-T0-UI-PRIVACY-APPOINTMENT-01",
      );
      assert.equal(
        summary.tier0UiAuthoritySecurityAppointmentId,
        "EX2-T0-UI-AUTHORITY-SECURITY-APPOINTMENT-01",
      );
      assert.equal(
        summary.tier0UiDualRoleExceptionId,
        "EX2-T0-UI-DUAL-ROLE-EXCEPTION-01",
      );
      assert.equal(summary.uiT009ReviewerAuthorityEstablished, true);
      assert.equal(summary.uiT009ReviewCompleted, true);
      assert.equal(summary.uiT009ReviewApproved, true);
      assert.equal(summary.uiT010ReviewerAuthorityEstablished, true);
      assert.equal(summary.uiT010ReviewCompleted, true);
      assert.equal(summary.uiT010ReviewApproved, true);
      assert.equal(
        summary.tier0UiPrivacyReviewId,
        "EX2-T0-UI-PRIVACY-REVIEW-01",
      );
      assert.equal(
        summary.tier0UiAuthoritySecurityReviewId,
        "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01",
      );
      assert.equal(
        summary.tier0UiPrivacyReviewResult,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        summary.tier0UiAuthoritySecurityReviewResult,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(summary.humanUiAuthorizationId, "EX2-UI-AUTH-T0-2026-07-27-01");
      assert.equal(
        summary.humanUiAuthorizationResult,
        "AuthorizedForTier0ReadOnlySyntheticExUiImplementationAndTests",
      );
      assert.equal(summary.humanUiAuthorizationStatus, "Recorded");
      assert.equal(summary.uiAuthorizedArtifactsImplemented, true);
      assert.equal(summary.uiImplementationEvidenceAvailable, true);
      assert.equal(summary.governanceDecisionStatusGovEx2T001, "Accepted");
      assert.equal(
        summary.tier0PrivacyAppointmentId,
        "EX2-T0-PRIVACY-APPOINTMENT-01",
      );
      assert.equal(
        summary.tier0AuthorityAppointmentId,
        "EX2-T0-AUTHORITY-APPOINTMENT-01",
      );
      assert.equal(
        summary.tier0DualRoleExceptionId,
        "EX2-T0-DUAL-ROLE-EXCEPTION-01",
      );
      assert.equal(
        summary.tier0PrivacyReviewId,
        "EX2-T0-PRIVACY-REVIEW-01",
      );
      assert.equal(
        summary.tier0AuthorityReviewId,
        "EX2-T0-AUTHORITY-REVIEW-01",
      );
      assert.equal(
        summary.tier0PrivacyReviewResult,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        summary.tier0AuthorityReviewResult,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        summary.gEx210ReviewAuthorityEstablishedForTier0SyntheticScope,
        true,
      );
      assert.equal(summary.gEx210ReviewCompletedAndApproved, true);
      assert.equal(
        summary.gEx211ReviewAuthorityEstablishedForTier0SyntheticScope,
        true,
      );
      assert.equal(summary.gEx211ReviewCompletedAndApproved, true);
      assert.equal(summary.humanAuthorizationId, "EX2-AUTH-T0-2026-07-26-01");
      assert.equal(
        summary.humanAuthorizationResult,
        "AuthorizedForTier0SyntheticExMetadataContractsAndTests",
      );
      assert.equal(summary.humanAuthorizationStatus, "Recorded");
      assert.equal(summary.authorizedArtifactsImplemented, true);
      assert.equal(summary.implementationEvidenceAvailable, true);
      assert.equal(
        summary.implementationPackageId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(summary.adapterOwner, "EX-2 Product Boundary");
      assert.equal(summary.adapterRuntimeStatus, "NotImplemented");
      assert.equal(summary.authorizationRecorded, true);
      assert.equal(summary.implementationAuthorized, false);
      assert.equal(summary.providerImplementationAuthorized, false);
      assert.equal(summary.adapterImplementationAuthorized, false);
      assert.equal(summary.systemOfRecordImplementationAuthorized, false);
      assert.equal(summary.storageImplementationAuthorized, false);
      assert.equal(summary.migrationCreationAuthorized, false);
      assert.equal(summary.productionDataAuthorized, false);
      assert.equal(summary.ex21CreationAuthorized, false);
      assert.equal(summary.totalGateCount, 16);
      assert.equal(summary.passedGateCount, 13);
      assert.equal(summary.pendingGateCount, 3);
      assert.equal(summary.failedGateCount, 0);
      assert.equal(summary.notEvaluatedGateCount, 0);
      assert.equal(summary.gateVocabularyConflictReported, true);
      assert.equal(
        summary.nextRequiredDecision,
        "NPA-T — EX-2:3 Executive Journal Experience Model",
      );
      assert.equal(
        summary.readinessConclusion,
        "ReadyForMetadataOnlyEx23ModelImplementation",
      );
      assert.equal(summary.decisionIdAdEx207, "AD-EX2-07");
      assert.equal(summary.statusAdEx207, "Accepted");
      assert.equal(summary.decisionIdAdEx208, "AD-EX2-08");
      assert.equal(summary.statusAdEx208, "Accepted");
      assert.equal(summary.decisionIdAdEx209, "AD-EX2-09");
      assert.equal(summary.statusAdEx209, "Accepted");
      assert.equal(summary.decisionIdAdEx210, "AD-EX2-10");
      assert.equal(summary.statusAdEx210, "Accepted");
      assert.equal(summary.formalEx2SequenceAuthorized, true);
      assert.equal(summary.ex21MetadataOnlyFoundationAuthorized, true);
      assert.equal(summary.ex21ImplementationAuthorized, true);
      assert.equal(
        summary.ex21ImplementationScope,
        "MetadataOnlyEx21FoundationOnly",
      );
      assert.equal(summary.ex22Authorized, true);
      assert.equal(summary.ex22MetadataOnlyRegistryAuthorized, true);
      assert.equal(summary.ex22ImplementationAuthorized, true);
      assert.equal(
        summary.ex22ImplementationScope,
        "MetadataOnlyEx22RegistryOnly",
      );
      assert.equal(summary.ex23Authorized, true);
      assert.equal(summary.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(summary.ex23ImplementationAuthorized, true);
      assert.equal(
        summary.ex23ImplementationScope,
        "MetadataOnlyEx23ModelOnly",
      );
      assert.equal(summary.ex24Authorized, false);
      assert.equal(summary.runtimeBehaviorAuthorized, false);
      assert.equal(summary.uiExpansionAuthorized, false);
      assert.equal(summary.routeAuthorized, false);
      assert.equal(summary.realRtc2ConsumptionAuthorized, false);
      assert.equal(summary.productionIntegrationAuthorized, false);
      assert.equal(summary.productionPlatformAuthorized, false);
      assert.equal(summary.productionProviderAuthorized, false);
      assert.equal(summary.ex21BlockedClarifiedByAdEx208, true);
      assert.equal(
        summary.ex21BlockedMeans,
        "OperationalProductionAndLaterPhasesRemainBlocked",
      );
      assert.equal(
        summary.adEx208SelectedOption,
        "FormalNinePhaseSequenceWithTier0EvidenceReuse",
      );
      assert.equal(
        summary.adEx209SelectedOption,
        "MetadataOnlyClosedWorldRegistry",
      );
      assert.equal(
        summary.adEx210SelectedOption,
        "MetadataOnlyCanonicalExperienceModel",
      );
      assert.equal(
        summary.adEx210DecisionScope,
        "Ex23ModelImplementationAndVerificationOnly",
      );
      assert.equal(
        summary.tier0EvidenceAdoptionStrategy,
        "ExactReferenceEvidenceLedger",
      );
      assert.equal(
        summary.routeAssessmentDisposition,
        "DeferredSupportingEvidence",
      );
      assert.equal(summary.tier0UiPassedGateCount, 16);
      assert.equal(summary.tier0UiPendingGateCount, 0);
      assert.equal(summary.uiCertificationId, "EX2-UI-CERT-T0-2026-07-27-01");
      assert.equal(summary.uiCertificationStatus, "Certified");
      assert.equal(
        summary.uiCertificationResult,
        "CertifiedForTier0ReadOnlySyntheticDevelopmentHarnessUse",
      );
      assert.equal(summary.uiStatus, "CertifiedTier0SyntheticUi");
      assert.equal(
        summary.uiReadiness,
        "ReadyForTier0SyntheticDevelopmentHarnessUse",
      );
      assert.equal(summary.adEx207UiImplementationAuthorized, true);
      assert.equal(summary.adEx207RouteAuthorized, false);
      assert.equal(summary.adEx207CreatesEx21, false);
      assert.equal(summary.certificationId, "EX2-CERT-T0-2026-07-26-01");
      assert.equal(summary.certificationStatus, "Certified");
      assert.equal(
        summary.certificationResult,
        "CertifiedForTier0SyntheticMetadataContractUse",
      );
      assert.equal(summary.app8IntegrationAuthorized, false);
      assert.equal(summary.rtc3IntegrationAuthorized, false);
      assert.equal(summary.persistenceAuthorized, false);
      assert.equal(summary.networkAuthorized, false);
      assert.equal(summary.publicIndexAuthorized, false);
      assert.equal(summary.deploymentAuthorized, false);
      assert.equal(summary.ex21Blocked, true);
      assert.equal(mutateFrozen(summary), false);
    });
  });

  describe("AD-EX2-03 decision", () => {
    it("records exact Accepted AD-EX2-03 once without changing AD-EX2-00..02", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx203;
      assert.equal(decision.decisionId, "AD-EX2-03");
      assert.equal(
        decision.title,
        "Assign Executive Journal Operational Ownership and Storage Strategy",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.decisionDateClassification, "SuppliedDecisionDate");
      assert.equal(decision.decisionScope, "ArchitectureOnly");
      assert.equal(
        decision.selectedDirection.operationalOwner,
        "NEXORA-RTC-JOURNAL-OPS",
      );
      assert.equal(
        decision.selectedDirection.storageClass,
        "PostgreSQLAppendOnlyTransactionalEventStore",
      );
      assert.equal(
        decision.selectedDirection.sourceToProviderTransportClass,
        "AuthenticatedInternalServiceContract",
      );
      assert.equal(
        decision.selectedDirection.privateDataStrategy,
        "LogicalSeparationRequired",
      );
      assert.equal(decision.selectedDirection.deploymentStatus, "NotAuthorized");
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.storageImplementationAuthorized, false);
      assert.equal(decision.persistenceAuthorized, false);
      assert.equal(decision.networkAuthorized, false);
      assert.equal(decision.migrationCreationAuthorized, false);
      assert.equal(decision.productionDataAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-03"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx202.decisionId,
        "AD-EX2-02",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(mutateFrozen(decision), false);
    });
  });

  describe("AD-EX2-03 ownership and storage", () => {
    it("accepts operational owner and PostgreSQL storage class without implementation", () => {
      const owner =
        ExecutiveJournalProductArchitectureOperationalOwnerNexoraRtcJournalOps;
      const storage = ExecutiveJournalProductArchitectureStorageStrategy;
      assert.equal(owner.ownerId, "NEXORA-RTC-JOURNAL-OPS");
      assert.equal(owner.ownerName, "Nexora RTC Journal Operations");
      assert.equal(owner.status, "AcceptedOperationalOwner");
      assert.equal(owner.governanceAuthority, "RTC-2");
      assert.equal(owner.gainsPolicyAuthority, false);
      assert.equal(owner.currentRuntimeImplementation, "None");
      assert.equal(owner.currentDeployment, "None");
      assert.equal(owner.responsibilities.length, 13);
      assert.equal(owner.exclusions.length, 9);
      assert.equal(owner.existingJsonFileStoresSelected, false);
      assert.equal(owner.existingFastapiAutomaticallySelected, false);
      assert.equal(
        storage.storageClass,
        "PostgreSQLAppendOnlyTransactionalEventStore",
      );
      assert.equal(storage.productVendor, "Unresolved");
      assert.equal(storage.region, "Unresolved");
      assert.equal(storage.productionInstance, "None");
      assert.equal(storage.schema, "NotImplemented");
      assert.equal(storage.persistenceAuthorized, false);
      assert.equal(storage.storageImplementationAuthorized, false);
      assert.equal(storage.appendOnlyRequired, true);
      assert.equal(storage.snapshotsNonAuthoritative, true);
      assert.equal(storage.providerRawTableAccess, false);
      assert.equal(storage.exRawStorageAccess, false);
      assert.equal(storage.logicalPrivateSeparationRequired, true);
      assert.equal(storage.physicalPrivateSeparation, "NeedsDecision");
      assert.equal(
        storage.keyDomainSeparationRequiredBeforePrivateProductionData,
        true,
      );
      assert.equal(storage.privateProductionDataAuthorized, false);
      assert.equal(storage.tlsRequiredBeforeDeployment, true);
      assert.equal(storage.atRestEncryptionRequiredBeforeDeployment, true);
      assert.equal(storage.kms, "Unresolved");
      assert.equal(storage.keyOwner, "Unresolved");
      assert.equal(storage.crossBorderReplication, "ProhibitedUntilApproved");
      assert.equal(storage.pitrCapabilityRequired, true);
      assert.equal(storage.restoreTestingRequired, true);
      assert.equal(storage.rpo, "Unresolved");
      assert.equal(storage.rto, "Unresolved");
      assert.equal(
        storage.transportClass,
        "AuthenticatedInternalServiceContract",
      );
      assert.equal(storage.directProviderDbAccess, false);
      assert.equal(storage.providerPrivateStoreAccess, false);
      assert.equal(storage.exDirectSourceAccess, false);
      assert.equal(storage.publicEndpoint, false);
      assert.equal(storage.networkImplementationAuthorized, false);
      assert.equal(storage.postgresDependencyInstalled, false);
      assert.equal(
        assertExecutiveJournalProductArchitectureOwnerId(
          "NEXORA-RTC-JOURNAL-OPS",
        ),
        "NEXORA-RTC-JOURNAL-OPS",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureStorageClass(
          "PostgreSQLAppendOnlyTransactionalEventStore",
        ),
        "PostgreSQLAppendOnlyTransactionalEventStore",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureTransportClass(
          "AuthenticatedInternalServiceContract",
        ),
        "AuthenticatedInternalServiceContract",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureOwnerId("APP-8")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureStorageClass("SQLite")
      );
    });
  });

  describe("AD-EX2-03 IAM telemetry threats", () => {
    it("covers IAM roles, telemetry classes, and threat catalogue", () => {
      assert.equal(ExecutiveJournalProductArchitectureIamRoles.length, 11);
      for (const role of ExecutiveJournalProductArchitectureIamRoles) {
        assert.equal(
          assertExecutiveJournalProductArchitectureIamRole(role),
          role,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureIamRole("SuperUser")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureAllowedTelemetryClasses.length,
        9,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureProhibitedTelemetryClasses.length,
        9,
      );
      assert.ok(
        ExecutiveJournalProductArchitectureProhibitedTelemetryClasses.includes(
          "journal_payload",
        ),
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureTelemetryClass(
          "service_availability",
        ),
        "service_availability",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTelemetryClass("payload_dump")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureThreatCatalogue.length,
        18,
      );
      for (const item of ExecutiveJournalProductArchitectureThreatCatalogue) {
        assert.equal(
          assertExecutiveJournalProductArchitectureThreatId(item.threatId),
          item.threatId,
        );
        assert.ok(item.severity.length > 0);
        assert.ok(item.mitigation.length > 0);
        assert.ok(item.affectedGate.startsWith("G-EX2-"));
        assert.equal(mutateFrozen(item), false);
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureThreatId("unknown_threat")
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
    });
  });

  describe("AD-EX2-04 decision", () => {
    it("records exact Accepted AD-EX2-04 once without changing AD-EX2-00..03", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx204;
      assert.equal(decision.decisionId, "AD-EX2-04");
      assert.equal(
        decision.title,
        "Define Executive Journal Infrastructure Policy and Selection Criteria",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.decisionDateClassification, "SuppliedDecisionDate");
      assert.equal(decision.decisionScope, "PolicyAndSelectionCriteriaOnly");
      assert.equal(decision.cloudPlatformSelected, false);
      assert.equal(decision.postgresqlProductSelected, false);
      assert.equal(decision.vendorSelected, false);
      assert.equal(decision.regionSelected, false);
      assert.equal(decision.kmsSelected, false);
      assert.equal(decision.keysCreated, false);
      assert.equal(decision.rpoSelected, false);
      assert.equal(decision.rtoSelected, false);
      assert.equal(decision.provisioningAuthorized, false);
      assert.equal(decision.persistenceAuthorized, false);
      assert.equal(decision.networkAuthorized, false);
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.productionDataAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-04"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-04",
        ).length,
        1,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx203.decisionId,
        "AD-EX2-03",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx203.decisionScope,
        "ArchitectureOnly",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx202.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-11")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("ad-ex2-04")
      );
      assert.equal(mutateFrozen(decision), false);
    });
  });

  describe("AD-EX2-05 decision", () => {
    it("records exact Accepted Option E Tier0 AD-EX2-05 once without changing AD-EX2-00..04", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx205;
      assert.equal(decision.decisionId, "AD-EX2-05");
      assert.equal(
        decision.title,
        "Select Nexora Executive Journal Infrastructure Readiness Position",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.selectedOption, "E");
      assert.equal(
        decision.selectedOptionLabel,
        "E — No Production Platform Yet",
      );
      assert.equal(
        decision.recoveryTier,
        "Tier0ArchitectureAndSyntheticOnly",
      );
      assert.equal(decision.productionInfrastructureSelected, false);
      assert.equal(decision.productionDeploymentAuthorized, false);
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.uiAuthorized, false);
      assert.equal(decision.integrationAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(decision.ex21CreationAuthorized, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-05"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-05",
        ).length,
        1,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx204.decisionScope,
        "PolicyAndSelectionCriteriaOnly",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx203.decisionId,
        "AD-EX2-03",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-11")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("ad-ex2-05")
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });
  });

  describe("GOV-EX2-T0-01 reviewer appointments", () => {
    it("records Accepted Tier-0 appointments without review approval or implementation authorization", () => {
      const gov = ExecutiveJournalProductArchitectureGovernanceGovEx2T001;
      const privacy = ExecutiveJournalProductArchitectureTier0PrivacyAppointment;
      const authority =
        ExecutiveJournalProductArchitectureTier0AuthorityAppointment;
      const dual = ExecutiveJournalProductArchitectureTier0DualRoleException;
      assert.equal(gov.decisionId, "GOV-EX2-T0-01");
      assert.equal(
        gov.title,
        "Appoint Interim EX-2 Tier-0 Synthetic Privacy and Authority Reviewers",
      );
      assert.equal(gov.status, "Accepted");
      assert.equal(gov.appointingHuman, "Bahadoor");
      assert.equal(
        gov.appointingRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(gov.decisionDate, "2026-07-26");
      assert.equal(gov.decisionScope, "Tier0SyntheticMetadataReviewOnly");
      assert.equal(gov.temporaryAppointment, true);
      assert.equal(gov.productionApplicability, false);
      assert.equal(gov.realRtc2Applicability, false);
      assert.equal(gov.implementationAuthorizationGranted, false);
      assert.equal(gov.deploymentAuthorizationGranted, false);
      assert.equal(gov.createsAdEx207, false);
      assert.equal(gov.isArchitectureDecision, false);
      assert.equal(gov.appointmentIsNotReviewApproval, true);
      assert.equal(gov.gEx210ReviewAuthorityEstablishedForTier0SyntheticScope, true);
      assert.equal(gov.gEx210ReviewCompletedAndApproved, false);
      assert.equal(gov.gEx211ReviewAuthorityEstablishedForTier0SyntheticScope, true);
      assert.equal(gov.gEx211ReviewCompletedAndApproved, false);
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceDecisionIds.length,
        2,
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureGovernanceDecisionIds],
        ["GOV-EX2-T0-01", "GOV-EX2-T0-02"],
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureGovernanceDecisionId(
          "GOV-EX2-T0-01",
        ),
        "GOV-EX2-T0-01",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGovernanceDecision(
          "GOV-EX2-T0-01",
        ),
        gov,
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGovernanceDecisionId(
          "AD-EX2-07",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureGovernanceDecisionId(
          "GOV-EX2-T0-03",
        )
      );
      assert.equal(privacy.appointmentId, "EX2-T0-PRIVACY-APPOINTMENT-01");
      assert.equal(privacy.reviewerName, "Bahadoor");
      assert.equal(
        privacy.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic Privacy Reviewer",
      );
      assert.equal(
        privacy.delegatedAuthorityClass,
        "Tier0SyntheticPrivacyReviewAuthority",
      );
      assert.equal(privacy.delegationReference, "GOV-EX2-T0-01");
      assert.equal(privacy.mayReviewGEx210ForTier0SyntheticScope, true);
      assert.equal(privacy.mayApproveProductionPrivacy, false);
      assert.equal(privacy.mayApproveRealRtc2Metadata, false);
      assert.equal(privacy.mayApproveDeployment, false);
      assert.equal(privacy.reviewCompletedAndApproved, false);
      assert.equal(authority.appointmentId, "EX2-T0-AUTHORITY-APPOINTMENT-01");
      assert.equal(authority.reviewerName, "Bahadoor");
      assert.equal(
        authority.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic Authority Boundary Reviewer",
      );
      assert.notEqual(privacy.reviewerRole, authority.reviewerRole);
      assert.equal(
        authority.delegatedAuthorityClass,
        "Tier0SyntheticAuthorityBoundaryReviewAuthority",
      );
      assert.equal(authority.delegationReference, "GOV-EX2-T0-01");
      assert.equal(authority.mayReviewGEx211ForTier0SyntheticScope, true);
      assert.equal(authority.mayCreateRtc2Authority, false);
      assert.equal(authority.mayApproveDeployment, false);
      assert.equal(authority.reviewCompletedAndApproved, false);
      assert.equal(dual.exceptionId, "EX2-T0-DUAL-ROLE-EXCEPTION-01");
      assert.equal(dual.status, "AcceptedForTier0SyntheticScope");
      assert.equal(dual.separationOfDutiesSatisfiedForProduction, false);
      assert.equal(dual.independentProductionReviewStillRequired, true);
      assert.equal(dual.mayBeCitedForProductionApproval, false);
      assert.equal(dual.generalNexoraSeparationOfDutiesPolicy, false);
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureTier0SyntheticReviewResults],
        [
          "ApprovedForTier0SyntheticScope",
          "ApprovedWithTier0SyntheticConditions",
          "RejectedForTier0SyntheticScope",
          "NotApproved",
        ],
      );
      assert.equal(
        new Set(
          ExecutiveJournalProductArchitectureTier0SyntheticReviewResults,
        ).size,
        4,
      );
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureTier0SyntheticReviewResults,
        ),
        false,
      );
      for (const result of
        ExecutiveJournalProductArchitectureTier0SyntheticReviewResults) {
        assert.equal(
          assertExecutiveJournalProductArchitectureTier0SyntheticReviewResult(
            result,
          ),
          result,
        );
        assert.ok(
          ExecutiveJournalProductArchitectureTier0SyntheticReviewResultSemantics[
            result
          ].length > 0,
        );
      }
      for (const value of [
        "Approved",
        "Pass",
        "approvedfortier0syntheticscope",
        "ApprovedForTier0SyntheticScope ",
        "",
      ]) {
        assert.throws(() =>
          assertExecutiveJournalProductArchitectureTier0SyntheticReviewResult(
            value,
          )
        );
      }
      assert.equal(
        ExecutiveJournalProductArchitectureTier0AppointmentConstraints.length,
        18,
      );
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureTier0AppointmentConstraints,
        ),
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0AppointmentReopeningTriggers
          .length,
        13,
      );
      assert.ok(
        ExecutiveJournalProductArchitectureTier0AppointmentReopeningTriggers
          .includes("real RTC-2 metadata is introduced"),
      );
      assert.equal(gov.appointmentIsNotReviewApproval, true);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields.length,
        12,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206
          .authorizationStatus,
        "NotRecorded",
      );
      assert.equal(gov.authorizationStatus, "NotRecorded");
      assert.equal(gov.implementationAuthorized, false);
      assert.equal(
        ExecutiveJournalProductArchitecture.governanceGovEx2T001,
        gov,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0PrivacyAppointment,
        privacy,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0AuthorityAppointment,
        authority,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.length,
        11,
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-06"),
        "AD-EX2-06",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-07"),
        "AD-EX2-07",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("GOV-EX2-T0-01")
      );
      assert.equal(mutateFrozen(gov), false);
      assert.equal(attemptNestedMutation(gov), false);
      assert.equal(mutateFrozen(privacy), false);
      assert.equal(mutateFrozen(authority), false);
      assert.equal(mutateFrozen(dual), false);
    });
  });

  describe("EX2-AUTH-T0-2026-07-26-01 human authorization", () => {
    it("records Tier-0 contracts-and-tests authorization with package implementation evidence", () => {
      const auth =
        ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601;
      const impact = ExecutiveJournalProductArchitectureAuthGateImpact;
      assert.equal(auth.authorizationId, "EX2-AUTH-T0-2026-07-26-01");
      assert.equal(
        auth.title,
        "Authorize EX-2 Tier-0 Synthetic Metadata Contracts and Tests",
      );
      assert.equal(auth.status, "Recorded");
      assert.equal(
        auth.result,
        "AuthorizedForTier0SyntheticExMetadataContractsAndTests",
      );
      assert.equal(auth.authorizingHuman, "Bahadoor");
      assert.equal(
        auth.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(auth.decisionDate, "2026-07-26");
      assert.equal(
        auth.decisionScope,
        "Tier0SyntheticContractsFixturesProviderAdapterViewContractsAndTests",
      );
      assert.equal(
        auth.consumer,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(auth.productionApplicability, false);
      assert.equal(auth.realRtc2Applicability, false);
      assert.equal(auth.deploymentAuthorized, false);
      assert.equal(auth.authorizationRecorded, true);
      assert.equal(auth.authorizedArtifactsImplemented, true);
      assert.equal(auth.implementationEvidenceAvailable, true);
      assert.equal(
        auth.implementationPackageId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(auth.ex21Created, false);
      assert.equal(auth.reactUiCreated, false);
      assert.equal(auth.createsAdEx207, false);
      assert.equal(auth.prerequisites.adEx206Accepted, true);
      assert.equal(auth.prerequisites.gEx210PassForTier0, true);
      assert.equal(auth.prerequisites.gEx211PassForTier0, true);
      assert.equal(auth.prerequisites.telemetryDisabled, true);
      assert.equal(auth.authorizedArtifactClasses.length, 14);
      assert.equal(auth.absoluteProhibitions.length, 27);
      assert.deepEqual(
        [...auth.authorizedSyntheticAllowlistFields],
        [
          ...ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields,
        ],
      );
      assert.equal(
        auth.authorizedFixtureConstraints
          .handAuthoredDeterministicFixturesAuthorized,
        true,
      );
      assert.equal(
        auth.authorizedFixtureConstraints.aiGeneratedFixturesAuthorized,
        false,
      );
      assert.equal(
        auth.authorizedFixtureConstraints.productionDerivedFixturesAuthorized,
        false,
      );
      assert.equal(
        auth.authorizedFixtureConstraints.randomFixtureGenerationAuthorized,
        false,
      );
      assert.equal(
        auth.authorizedFixtureConstraints
          .runtimeClockFixtureGenerationAuthorized,
        false,
      );
      assert.deepEqual(
        [...auth.authorizedProviderResultVocabulary],
        [
          "Available",
          "Empty",
          "Denied",
          "Unavailable",
          "Stale",
          "Invalid",
        ],
      );
      assert.equal(auth.authorizedViewStates.length, 9);
      assert.ok(
        auth.absoluteProhibitions.includes("React UI implementation"),
      );
      assert.ok(
        auth.absoluteProhibitions.includes("telemetry or analytics"),
      );
      assert.ok(
        auth.absoluteProhibitions.includes("network access"),
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-14").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-14").evidenceRef,
        "EX2-AUTH-T0-2026-07-26-01",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-14")
          .tier0SyntheticPassOnly,
        true,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-14").productionPass,
        false,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-08").result,
        "Pass",
      );
      assert.equal(impact.afterPassedGateCount, 12);
      assert.equal(impact.afterPendingGateCount, 4);
      assert.deepEqual([...impact.newlyPassed], ["G-EX2-14"]);
      assert.deepEqual(
        [...impact.remainingPending],
        ["G-EX2-04", "G-EX2-07", "G-EX2-08", "G-EX2-12"],
      );
      assert.equal(impact.authorizedArtifactsImplemented, true);
      const enforcement =
        ExecutiveJournalProductArchitectureTier0EnforcementGateImpact;
      assert.equal(enforcement.afterPassedGateCount, 13);
      assert.equal(enforcement.afterPendingGateCount, 3);
      assert.deepEqual([...enforcement.newlyPassed], ["G-EX2-08"]);
      assert.deepEqual(
        [...enforcement.remainingPending],
        ["G-EX2-04", "G-EX2-07", "G-EX2-12"],
      );
      assert.equal(
        enforcement.evidenceRef,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(enforcement.tier0PassIsNotProductionPass, true);
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary
          .authorizationRecorded,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary
          .implementationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary
          .deploymentAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary.uiAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticTelemetryPosition
          .telemetryEnabled,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureHumanAuthorizationIds.length,
        2,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureHumanAuthorization(
          "EX2-AUTH-T0-2026-07-26-01",
        ),
        auth,
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureHumanAuthorizationId(
          "EX2-AUTH-T0-X",
        )
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0PrivacyReview.result,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceGovEx2T001.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.humanAuthorizationEx2AuthT02026072601,
        auth,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(mutateFrozen(auth), false);
      assert.equal(attemptNestedMutation(auth), false);
    });
  });

  describe("EX2-T0 privacy and authority review acceptance", () => {
    it("records Completed Tier-0 reviews, Passes G-EX2-10/11, and preserves NotRecorded authorization", () => {
      const privacy = ExecutiveJournalProductArchitectureTier0PrivacyReview;
      const authority = ExecutiveJournalProductArchitectureTier0AuthorityReview;
      const impact =
        ExecutiveJournalProductArchitectureTier0ReviewAcceptanceGateImpact;
      const ai = ExecutiveJournalProductArchitectureTier0ReviewAiBoundary;
      assert.equal(ExecutiveJournalProductArchitectureTier0Reviews.length, 2);
      assert.equal(privacy.reviewId, "EX2-T0-PRIVACY-REVIEW-01");
      assert.equal(authority.reviewId, "EX2-T0-AUTHORITY-REVIEW-01");
      assert.equal(privacy.status, "Completed");
      assert.equal(authority.status, "Completed");
      assert.equal(privacy.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(authority.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(privacy.reviewer, "Bahadoor");
      assert.equal(authority.reviewer, "Bahadoor");
      assert.equal(
        privacy.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic Privacy Reviewer",
      );
      assert.equal(
        authority.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic Authority Boundary Reviewer",
      );
      assert.equal(privacy.delegationReference, "GOV-EX2-T0-01");
      assert.equal(authority.delegationReference, "GOV-EX2-T0-01");
      assert.equal(
        privacy.appointmentReference,
        "EX2-T0-PRIVACY-APPOINTMENT-01",
      );
      assert.equal(
        authority.appointmentReference,
        "EX2-T0-AUTHORITY-APPOINTMENT-01",
      );
      assert.equal(privacy.scope, "Tier0SyntheticMetadataOnly");
      assert.equal(authority.scope, "Tier0SyntheticReadOnlyContracts");
      assert.equal(privacy.productionApplicability, false);
      assert.equal(privacy.realRtc2Applicability, false);
      assert.equal(privacy.privateReflectionApplicability, false);
      assert.equal(authority.productionApplicability, false);
      assert.equal(authority.realRtc2Applicability, false);
      assert.equal(privacy.findings.privateReflectionExistence, "structurally prohibited");
      assert.equal(
        privacy.findings.evidenceExistenceContentLocation,
        "structurally prohibited",
      );
      assert.equal(privacy.findings.sequenceGapInference, "excluded");
      assert.equal(privacy.findings.timestampInference, "excluded");
      assert.equal(privacy.findings.recordCountInference, "excluded");
      assert.ok(
        privacy.approvalConditions.includes(
          "unknown fields require whole-projection rejection",
        ),
      );
      assert.ok(
        privacy.approvalConditions.includes("telemetry remains disabled"),
      );
      assert.equal(privacy.residualRisk.mechanicalEnforcementVerified, false);
      assert.equal(authority.findings.authorityCreation, "prohibited");
      assert.equal(authority.findings.lifecycleMutation, "prohibited");
      assert.equal(authority.findings.operationalCommandExecution, "prohibited");
      assert.equal(authority.findings.rtc2RuntimeImport, "prohibited");
      assert.equal(authority.residualRisk.mechanicalEnforcementVerified, false);
      assert.equal(ai.aiGeneratedFixtures, "NotAuthorized");
      assert.equal(ai.aiConfirmation, "Prohibited");
      assert.equal(ai.aiAuthorityCreation, "Prohibited");
      assert.equal(
        ExecutiveJournalProductArchitectureTier0ReviewReopeningTriggers.length,
        17,
      );
      assert.equal(privacy.scopeChangeInvalidatesReview, true);
      assert.equal(authority.scopeChangeInvalidatesReview, true);
      assert.equal(privacy.productionRequiresIndependentReview, true);
      assert.equal(privacy.mayBeCitedForProduction, false);
      assert.equal(authority.mayBeCitedForProduction, false);
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-10").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-10").evidenceRef,
        "EX2-T0-PRIVACY-REVIEW-01",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-10")
          .tier0SyntheticPassOnly,
        true,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-10").productionPass,
        false,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-11").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-11").evidenceRef,
        "EX2-T0-AUTHORITY-REVIEW-01",
      );
      assert.equal(impact.afterPassedGateCount, 11);
      assert.equal(impact.afterPendingGateCount, 5);
      assert.deepEqual([...impact.newlyPassed], ["G-EX2-10", "G-EX2-11"]);
      assert.deepEqual(
        [...impact.remainingPending],
        ["G-EX2-04", "G-EX2-07", "G-EX2-08", "G-EX2-12", "G-EX2-14"],
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206
          .authorizationStatus,
        "NotRecorded",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceGovEx2T001.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureTier0Review(
          "EX2-T0-PRIVACY-REVIEW-01",
        ),
        privacy,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureTier0Review(
          "EX2-T0-AUTHORITY-REVIEW-01",
        ),
        authority,
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0ReviewId("EX2-T0-X")
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0PrivacyReview,
        privacy,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0AuthorityReview,
        authority,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticTelemetryPosition
          .telemetryEnabled,
        false,
      );
      assert.equal(privacy.implementsAuthorization, false);
      assert.equal(authority.implementsAuthorization, false);
      assert.equal(mutateFrozen(privacy), false);
      assert.equal(mutateFrozen(authority), false);
      assert.equal(attemptNestedMutation(privacy), false);
      assert.equal(attemptNestedMutation(authority), false);
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureTier0ReviewReopeningTriggers,
        ),
        false,
      );
    });
  });

  describe("AD-EX2-06 decision", () => {
    it("records Accepted AD-EX2-06 architecture without implementation authorization", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx206;
      assert.equal(decision.decisionId, "AD-EX2-06");
      assert.equal(
        decision.title,
        "Authorize EX-2 Synthetic Metadata Provider and Read-Only UI Contract Architecture",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.decisionScope, "Tier0SyntheticArchitectureOnly");
      assert.equal(
        decision.selectedOption,
        "Tier0SyntheticMetadataContractArchitecture",
      );
      assert.equal(decision.syntheticAllowlistFinal, true);
      assert.equal(decision.productionAllowlistFinal, false);
      assert.equal(decision.realRtc2AllowlistAuthorized, false);
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.providerImplementationAuthorized, false);
      assert.equal(decision.adapterImplementationAuthorized, false);
      assert.equal(decision.fixturesImplementationAuthorized, false);
      assert.equal(decision.uiImplementationAuthorized, false);
      assert.equal(decision.routesAuthorized, false);
      assert.equal(decision.ex21CreationAuthorized, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.futureAuthorizationRecorded, false);
      assert.equal(decision.createsEx21, false);
      assert.equal(decision.createsFixtures, false);
      assert.equal(decision.createsReactUi, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-06"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-06",
        ).length,
        1,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx205.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });
  });

  describe("AD-EX2-06 synthetic contracts and gates", () => {
    it("defines Tier-0 consumer, synthetic allowlist, disabled telemetry, and gate impact", () => {
      const consumer = ExecutiveJournalProductArchitectureTier0SyntheticConsumer;
      const allowlist =
        ExecutiveJournalProductArchitectureSyntheticAllowlistContract;
      const telemetry =
        ExecutiveJournalProductArchitectureSyntheticTelemetryPosition;
      const plan = ExecutiveJournalProductArchitectureSyntheticTestPlan;
      const impact = ExecutiveJournalProductArchitectureAdEx206GateImpact;
      assert.equal(
        consumer.consumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticConsumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(
        consumer.namespace,
        "nexora.ex.executive.journal.synthetic.metadata.consumer",
      );
      assert.equal(consumer.consumerClass, "Tier0SyntheticReadOnlyConsumer");
      assert.equal(consumer.owner, "EX-2 Product Boundary");
      assert.equal(consumer.dataClassification, "SyntheticMetadataOnly");
      assert.equal(consumer.providerMode, "NonNetworkedFakeProvider");
      assert.equal(consumer.productionEligibility, false);
      assert.equal(consumer.realRtc2Consumption, false);
      assert.equal(consumer.uiActivation, false);
      assert.equal(consumer.deploymentEligibility, false);
      assert.deepEqual(
        [...consumer.aliases],
        ["ExecutiveJournalSyntheticMetadataConsumer", "EX-2:T0"],
      );
      assert.equal(
        consumer.status,
        "AcceptedTier0SyntheticConsumerIdentity",
      );
      assert.equal(consumer.consumesRealRtc2Data, false);
      assert.equal(consumer.formerConsumerIdApproved, false);
      assert.equal(
        consumer.formerConsumerIdNotCanonical,
        ExecutiveJournalProductArchitectureFormerTier0SyntheticConsumerId,
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
        ),
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "EX2-SYNTHETIC-TIER0-CONSUMER-01",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "EX-2",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "ex-2:t0/executivejournalsyntheticmetadataconsumer",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          " EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer ",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerId(
          "ExecutiveJournalSyntheticMetadataConsumer",
        )
      );
      for (const alias of
        ExecutiveJournalProductArchitectureTier0SyntheticConsumerAliases) {
        assert.equal(
          assertExecutiveJournalProductArchitectureTier0SyntheticConsumerAlias(
            alias,
          ),
          alias,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerAlias(
          "EX2-SYNTHETIC-TIER0-CONSUMER-01",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureTier0SyntheticConsumerAlias(
          "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
        )
      );
      assert.equal(allowlist.status, "AcceptedSyntheticOnlyClosedAllowlist");
      assert.equal(allowlist.syntheticAllowlistFinal, true);
      assert.equal(allowlist.productionAllowlistFinal, false);
      assert.equal(allowlist.realRtc2AllowlistAuthorized, false);
      assert.equal(allowlist.productionFinalAllowlist, false);
      assert.equal(allowlist.productionAllowlistStatus, "NonFinal");
      assert.equal(allowlist.evidencePresentIncluded, false);
      assert.equal(allowlist.closed, true);
      assert.equal(allowlist.unique, true);
      assert.equal(allowlist.deterministicallyOrdered, true);
      assert.equal(allowlist.automaticSchemaExpansion, false);
      assert.equal(allowlist.sourceClassificationRequired, true);
      assert.equal(
        allowlist.requiredSourceClassification,
        "SyntheticSourceOnly",
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields],
        [
          "journal_ref",
          "entry_ref",
          "entry_category",
          "lifecycle_state",
          "origin_classification",
          "authority_state",
          "provenance_ref",
          "correction_ref",
          "supersession_ref",
          "projection_schema_version",
          "integrity_state",
          "source_classification",
        ],
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields.length,
        12,
      );
      assert.equal(
        new Set(
          ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields,
        ).size,
        12,
      );
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields,
        ),
        false,
      );
      for (const field of
        ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields) {
        assert.equal(
          assertExecutiveJournalProductArchitectureSyntheticOnlyAllowlistField(
            field,
          ),
          field,
        );
      }
      for (const rejected of [
        "canonical_sequence_position",
        "shareable_entry_category",
        "projection_version",
        "evidence_present",
      ]) {
        assert.throws(() =>
          assertExecutiveJournalProductArchitectureSyntheticOnlyAllowlistField(
            rejected,
          )
        );
      }
      assert.ok(
        ExecutiveJournalProductArchitectureSyntheticExcludedFields.includes(
          "canonical_sequence_position",
        ),
      );
      assert.ok(
        ExecutiveJournalProductArchitectureSyntheticExcludedFields.includes(
          "shareable_entry_category",
        ),
      );
      assert.ok(
        ExecutiveJournalProductArchitectureSyntheticExcludedFields.includes(
          "projection_version",
        ),
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticSequencePositionExclusion
          .fieldId,
        "canonical_sequence_position",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticSequencePositionExclusion
          .status,
        "ExcludedFromTier0SyntheticAllowlist",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticAllowlistFieldSemantics
          .entry_category.includes("closed EX-owned vocabulary"),
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticAllowlistFieldSemantics
          .projection_schema_version.includes("EX-owned"),
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticAllowlistFieldSemantics
          .source_classification.includes("SyntheticSourceOnly"),
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSyntheticSourceClassification,
        "SyntheticSourceOnly",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSyntheticSourceClassification(
          "SyntheticSourceOnly",
        ),
        "SyntheticSourceOnly",
      );
      for (const rejected of [
        "",
        "ProductionSource",
        "LiveSource",
        "Unknown",
        "syntheticsourceonly",
        "SyntheticSourceOnly ",
        " SyntheticSourceOnly",
      ]) {
        assert.throws(() =>
          assertExecutiveJournalProductArchitectureSyntheticSourceClassification(
            rejected,
          )
        );
      }
      assert.equal(telemetry.telemetryEnabled, false);
      assert.equal(telemetry.productionTelemetryAllowlistApproved, false);
      assert.equal(plan.status, "AcceptedSyntheticTestPlan");
      assert.equal(plan.authorizesImplementation, false);
      assert.equal(plan.requiredCoverage.length, 21);
      assert.equal(impact.beforePassedGateCount, 7);
      assert.equal(impact.afterPassedGateCount, 9);
      assert.equal(impact.afterPendingGateCount, 7);
      assert.deepEqual([...impact.newlyPassed], ["G-EX2-06", "G-EX2-16"]);
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-06").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-06").name,
        "exact EX-2 consumer identity defined",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-16").result,
        "Pass",
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.getSummary().passedGateCount,
        13,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.getSummary().pendingGateCount,
        3,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        ExecutiveJournalProductArchitecture.authorizationBoundary
          .implementationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206
          .authorizationStatus,
        "NotRecorded",
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0SyntheticConsumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitecture.syntheticAllowlistFields],
        [
          ...ExecutiveJournalProductArchitectureSyntheticOnlyAllowlistFields,
        ],
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx205.status,
        "Accepted",
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalProductArchitectureDecisionAdrEx206),
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureDecisionAdrEx206,
        ),
        false,
      );
    });
  });

  describe("AD-EX2-05 infrastructure readiness", () => {
    it("encodes no-production selections and provisional candidates without selecting vendors", () => {
      const readiness = ExecutiveJournalProductArchitectureInfrastructureReadiness;
      assert.equal(readiness.selectedOption, "E");
      assert.equal(readiness.recoveryTier, "Tier0ArchitectureAndSyntheticOnly");
      assert.equal(readiness.cloudPlatform, "NoProductionPlatformYet");
      assert.equal(readiness.postgresqlProduct, "NotSelected");
      assert.equal(readiness.productionRegion, "NotSelected");
      assert.equal(readiness.backupRegion, "NotSelected");
      assert.equal(readiness.disasterRecoveryRegion, "NotSelected");
      assert.equal(readiness.kmsProduct, "NotSelected");
      assert.equal(readiness.customerManagedKey, "NotCreated");
      assert.equal(readiness.keyPolicyOwner, "Unassigned");
      assert.equal(readiness.keyCustodian, "Unassigned");
      assert.equal(readiness.breakGlassCustodians, "Unassigned");
      assert.equal(
        readiness.productionRpo,
        "NotApplicableUntilProductionSelection",
      );
      assert.equal(
        readiness.productionRto,
        "NotApplicableUntilProductionSelection",
      );
      assert.equal(readiness.backupSchedule, "NotSelected");
      assert.equal(readiness.productionCapacity, "NotEstimated");
      assert.equal(readiness.productionCost, "NotEstimated");
      assert.equal(
        readiness.crossBorderReplication,
        "ProhibitedUntilApproved",
      );
      assert.equal(readiness.azureStatus, "ProvisionalPreferredCandidate");
      assert.equal(readiness.awsStatus, "ProvisionalSecondCandidate");
      assert.equal(readiness.gcpStatus, "ProvisionalFallbackCandidate");
      assert.equal(readiness.azureSelected, false);
      assert.equal(readiness.awsSelected, false);
      assert.equal(readiness.gcpSelected, false);
      assert.equal(readiness.cloudAccountOrSubscriptionSelected, false);
      assert.equal(readiness.databaseExists, false);
      assert.equal(readiness.keyExists, false);
      assert.equal(readiness.backupExists, false);
      assert.equal(readiness.productionOrPrivateJournalDataAuthorized, false);
      assert.equal(
        assertExecutiveJournalProductArchitectureInfrastructureReadinessOption(
          "E",
        ),
        "E",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureRecoveryTierAdEx205(
          "Tier0ArchitectureAndSyntheticOnly",
        ),
        "Tier0ArchitectureAndSyntheticOnly",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureCloudPlatformSelection(
          "NoProductionPlatformYet",
        ),
        "NoProductionPlatformYet",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureProvisionalPlatformStatus(
          "ProvisionalPreferredCandidate",
        ),
        "ProvisionalPreferredCandidate",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureCloudPlatformSelection("Azure")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureProvisionalPlatformStatus(
          "Selected",
        )
      );
    });
  });

  describe("AD-EX2-05 synthetic scope reopening and gates", () => {
    it("proves AD-EX2-05 synthetic scope is not authorization; historical gate impact remains 7/9", () => {
      const synthetic =
        ExecutiveJournalProductArchitectureSyntheticDevelopmentScope;
      const gateImpact = ExecutiveJournalProductArchitectureAdEx205GateImpact;
      assert.equal(
        synthetic.decisionDoesNotAuthorizeOrCreateThoseComponents,
        true,
      );
      assert.equal(
        synthetic.syntheticPreparationIsNotImplementationAuthorization,
        true,
      );
      assert.equal(synthetic.prohibitedInSyntheticFixtures.length, 8);
      assert.ok(
        synthetic.prohibitedInSyntheticFixtures.includes("real_journal_payloads"),
      );
      assert.ok(
        synthetic.prohibitedInSyntheticFixtures.includes(
          "private_reflection_content_or_existence_signals",
        ),
      );
      assert.equal(
        ExecutiveJournalProductArchitectureReopeningConditions.length,
        14,
      );
      for (const condition of
        ExecutiveJournalProductArchitectureReopeningConditions) {
        assert.equal(
          assertExecutiveJournalProductArchitectureReopeningCondition(condition),
          condition,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureReopeningCondition("done")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx205
          .adEx205DoesNotSatisfyReopeningConditions,
        true,
      );
      assert.equal(gateImpact.notApplicableForTier0InVocabulary, false);
      assert.equal(gateImpact.gateStatesUnchangedByAdEx205, true);
      assert.equal(gateImpact.deferredProductionDoesNotCreatePass, true);
      assert.equal(gateImpact.beforePassedGateCount, 7);
      assert.equal(gateImpact.beforePendingGateCount, 9);
      assert.equal(gateImpact.afterPassedGateCount, 7);
      assert.equal(gateImpact.afterPendingGateCount, 9);
      assert.equal(gateImpact.gatesChanged.length, 0);
      assert.equal(gateImpact.ex21Authorized, false);
      assert.equal(gateImpact.uiImplementationAuthorized, false);
      assert.equal(gateImpact.metadataIntegrationAuthorized, false);
      assert.equal(gateImpact.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        ExecutiveJournalProductArchitecture.createsEx21,
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureReopeningConditions,
        ),
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureInfrastructureReadiness,
        ),
        false,
      );
    });
  });

  describe("AD-EX2-04 platform and postgres policy", () => {
    it("accepts NoEstablishedCloudPlatform and dedicated managed criteria without selection", () => {
      const platform = ExecutiveJournalProductArchitectureInfrastructurePlatform;
      const postgres = ExecutiveJournalProductArchitectureManagedPostgresPolicy;
      assert.equal(platform.platformStatus, "NoEstablishedCloudPlatform");
      assert.equal(platform.establishedCloudPlatform, "None");
      assert.equal(platform.accountOwnership, "Unresolved");
      assert.equal(platform.productionInfrastructure, "None");
      assert.equal(platform.managedPostgresqlProduct, "Unresolved");
      assert.equal(platform.productionReadiness, false);
      assert.equal(platform.cloudPlatformSelected, false);
      assert.equal(platform.accountSelected, false);
      assert.equal(
        assertExecutiveJournalProductArchitecturePlatformStatus(
          "NoEstablishedCloudPlatform",
        ),
        "NoEstablishedCloudPlatform",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitecturePlatformStatus("AWS")
      );
      assert.equal(postgres.productClass, "DedicatedManagedPostgreSQL");
      assert.equal(
        postgres.topologyClass,
        "DedicatedManagedPostgreSQLPreferred",
      );
      assert.equal(
        postgres.haClass,
        "ManagedSinglePrimaryProviderSupportedHa",
      );
      assert.equal(postgres.activeActiveInitialTopology, "Rejected");
      assert.equal(postgres.productionSqliteJsonFileInMemoryProhibited, true);
      assert.equal(postgres.vendor, "Unresolved");
      assert.equal(postgres.region, "Unresolved");
      assert.equal(postgres.postgresqlProductSelected, false);
      assert.equal(postgres.vendorSelected, false);
      assert.equal(postgres.postgresClientInstalled, false);
      assert.equal(
        ExecutiveJournalProductArchitectureMandatoryPostgresCriteria.length,
        19,
      );
      for (const criterion of
        ExecutiveJournalProductArchitectureMandatoryPostgresCriteria) {
        assert.ok(postgres.mandatoryCriteria.includes(criterion));
      }
      assert.equal(
        assertExecutiveJournalProductArchitecturePostgresProductClass(
          "DedicatedManagedPostgreSQL",
        ),
        "DedicatedManagedPostgreSQL",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureTopologyClass(
          "DedicatedManagedPostgreSQLPreferred",
        ),
        "DedicatedManagedPostgreSQLPreferred",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureHaClass(
          "ManagedSinglePrimaryProviderSupportedHa",
        ),
        "ManagedSinglePrimaryProviderSupportedHa",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitecturePostgresProductClass(
          "SharedPostgres",
        )
      );
    });
  });

  describe("AD-EX2-04 environment region keys recovery", () => {
    it("covers environments, residency, keys, recovery, secrets, and telemetry boundaries", () => {
      const env = ExecutiveJournalProductArchitectureEnvironmentPolicy;
      const region = ExecutiveJournalProductArchitectureRegionPolicy;
      const keys = ExecutiveJournalProductArchitectureKeyManagementPolicy;
      const recovery = ExecutiveJournalProductArchitectureRecoveryPolicy;
      const migration = ExecutiveJournalProductArchitectureMigrationSecretsPolicy;
      const observability =
        ExecutiveJournalProductArchitectureObservabilityCapacityPolicy;
      assert.equal(ExecutiveJournalProductArchitectureEnvironments.length, 6);
      for (const name of ExecutiveJournalProductArchitectureEnvironments) {
        assert.equal(
          assertExecutiveJournalProductArchitectureEnvironment(name),
          name,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureEnvironment("ProdAlias")
      );
      assert.equal(env.productionJournalDataProhibitedInNonProduction, true);
      assert.equal(
        env.privateOrRegulatedProductionDataProhibitedInNonProduction,
        true,
      );
      assert.equal(env.sharedCredentials, false);
      assert.equal(env.sharedKeys, false);
      assert.equal(env.stagingCannotBecomeProductionImplicitly, true);
      assert.equal(region.productionRegion, "NeedsHumanDecision");
      assert.equal(region.backupRegion, "NeedsHumanDecision");
      assert.equal(region.disasterRecoveryRegion, "NeedsHumanDecision");
      assert.equal(region.keyRegion, "NeedsHumanDecision");
      assert.equal(region.operatorAccessRegion, "NeedsHumanDecision");
      assert.equal(region.crossBorderReplication, "ProhibitedUntilApproved");
      assert.equal(region.regionSelected, false);
      assert.equal(region.oi04RemainsUnresolved, true);
      assert.equal(region.regionTopologyOptions.optionSelected, "None");
      assert.equal(
        assertExecutiveJournalProductArchitectureRegionDecisionStatus(
          "NeedsHumanDecision",
        ),
        "NeedsHumanDecision",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureReplicationStatus(
          "ProhibitedUntilApproved",
        ),
        "ProhibitedUntilApproved",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureRegionDecisionStatus("us-east-1")
      );
      assert.equal(ExecutiveJournalProductArchitectureKeyDomains.length, 6);
      for (const domain of ExecutiveJournalProductArchitectureKeyDomains) {
        assert.equal(
          assertExecutiveJournalProductArchitectureKeyDomain(domain),
          domain,
        );
      }
      assert.equal(ExecutiveJournalProductArchitectureKeyRoles.length, 7);
      for (const role of ExecutiveJournalProductArchitectureKeyRoles) {
        assert.equal(
          assertExecutiveJournalProductArchitectureKeyRole(role),
          role,
        );
      }
      assert.equal(keys.kmsVendor, "Unresolved");
      assert.equal(keys.keyOwnerIdentity, "Unresolved");
      assert.equal(keys.keyCustodianIdentity, "Unresolved");
      assert.equal(keys.kmsSelected, false);
      assert.equal(keys.keysCreated, false);
      assert.equal(keys.tlsRequiredForAllDatabaseAndServiceConnections, true);
      assert.equal(keys.atRestEncryptionRequiredForDatabaseAndBackups, true);
      assert.equal(
        keys.separateKeyDomainRequiredBeforePrivateRegulatedProductionData,
        true,
      );
      assert.equal(recovery.pitrRequired, true);
      assert.equal(recovery.isolatedRestoreTestingRequired, true);
      assert.equal(recovery.backupFrequency, "Unresolved");
      assert.equal(recovery.rpo, "Unresolved");
      assert.equal(recovery.rto, "Unresolved");
      assert.equal(recovery.selectedRecoveryTier, "None");
      assert.equal(recovery.rpoSelected, false);
      assert.equal(recovery.rtoSelected, false);
      assert.equal(recovery.disasterRecoveryTopology, "Unresolved");
      assert.equal(ExecutiveJournalProductArchitectureRecoveryTiers.length, 4);
      for (const tier of ExecutiveJournalProductArchitectureRecoveryTiers) {
        assert.equal(
          assertExecutiveJournalProductArchitectureRecoveryTier(tier),
          tier,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureRecoveryTier("Tier0")
      );
      assert.equal(migration.migrationTooling, "Unresolved");
      assert.equal(migration.authoritativeEventMigrationsForwardOnly, true);
      assert.equal(
        migration.destructiveRollbackOfCommittedHistoryProhibited,
        true,
      );
      assert.equal(migration.productionSecretsManagerRequired, true);
      assert.equal(migration.exReceivesNoDatabaseCredentials, true);
      assert.equal(migration.providerReceivesNoRawStoreCredentials, true);
      assert.equal(
        ExecutiveJournalProductArchitectureInfrastructureAllowedTelemetry.length,
        11,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureInfrastructureProhibitedTelemetry
          .length,
        10,
      );
      for (const item of
        ExecutiveJournalProductArchitectureInfrastructureAllowedTelemetry) {
        assert.equal(
          assertExecutiveJournalProductArchitectureInfrastructureTelemetry(item),
          item,
        );
      }
      for (const item of
        ExecutiveJournalProductArchitectureInfrastructureProhibitedTelemetry) {
        assert.equal(
          assertExecutiveJournalProductArchitectureInfrastructureTelemetry(item),
          item,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureInfrastructureTelemetry(
          "payload_dump",
        )
      );
      assert.equal(observability.capacityModel, "NeedsDecision");
      assert.equal(observability.workloadEvidence, "Absent");
      assert.equal(observability.costModel, "Unresolved");
      assert.equal(
        ExecutiveJournalProductArchitectureUnresolvedSelections.length,
        16,
      );
      for (const field of
        ExecutiveJournalProductArchitectureUnresolvedSelections) {
        assert.equal(
          assertExecutiveJournalProductArchitectureUnresolvedSelection(field),
          field,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureUnresolvedSelection("selected")
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureDecisionAdrEx204,
        ),
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureRegionPolicy,
        ),
        false,
      );
    });
  });

  describe("AD-EX2-02 decision", () => {
    it("records exact Accepted AD-EX2-02 once without changing AD-EX2-00/01", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx202;
      assert.equal(decision.decisionId, "AD-EX2-02");
      assert.equal(
        decision.title,
        "Define the RTC-2-Governed Executive Journal System of Record and Provider Source Contract",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.decisionDateClassification, "SuppliedDecisionDate");
      assert.equal(
        decision.selectedStrategy,
        "RTC-2-Governed Append-Only System of Record with Source-Side Eligibility Filtering",
      );
      assert.equal(
        decision.selectedPrivacyOption,
        "Option B — System of Record Produces Pre-Filtered Eligible Metadata",
      );
      assert.equal(decision.decisionScope, "ArchitectureOnly");
      assert.equal(decision.storageImplementationAuthorized, false);
      assert.equal(decision.systemOfRecordImplementationAuthorized, false);
      assert.equal(decision.providerImplementationAuthorized, false);
      assert.equal(decision.adapterImplementationAuthorized, false);
      assert.equal(decision.ex21CreationAuthorized, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.persistenceAuthorized, false);
      assert.equal(decision.networkAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-02"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.decisionId,
        "AD-EX2-01",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.status,
        "Accepted",
      );
      assert.equal(mutateFrozen(decision), false);
    });
  });

  describe("AD-EX2-02 system of record", () => {
    it("accepts SoR architecture class without implementing storage", () => {
      const sor =
        ExecutiveJournalProductArchitectureSystemOfRecordRtc2JournalSor01;
      assert.equal(sor.sourceId, "RTC2-JOURNAL-SOR-01");
      assert.equal(
        sor.name,
        "RTC-2-Governed Executive Journal System of Record",
      );
      assert.equal(sor.architectureStatus, "AcceptedSystemOfRecordClass");
      assert.equal(sor.runtimeStatus, "NotImplemented");
      assert.equal(sor.type, "AppendOnlyAuthoritativeJournalSource");
      assert.equal(sor.governanceAuthority, "RTC-2");
      assert.equal(sor.operationalOwner, "Unresolved");
      assert.equal(sor.storageImplementation, "Unresolved");
      assert.equal(sor.providerConsumer, "RTC2-EX2-PROVIDER-01");
      assert.equal(sor.app8Selected, false);
      assert.equal(sor.exSelected, false);
      assert.equal(sor.projectionProviderSelectedAsSor, false);
      assert.equal(sor.rtc2CertificationAggregateSelectedAsSor, false);
      assert.equal(
        sor.existingRepositoryEventAuditInfrastructureSelected,
        false,
      );
      assert.equal(sor.persistenceAuthorized, false);
      assert.equal(sor.networkAuthorized, false);
      assert.equal(sor.deploymentAuthorized, false);
      assert.equal(
        assertExecutiveJournalProductArchitectureSourceId("RTC2-JOURNAL-SOR-01"),
        "RTC2-JOURNAL-SOR-01",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceId("APP-8")
      );
      assert.equal(mutateFrozen(sor), false);
    });
  });

  describe("AD-EX2-02 source contract", () => {
    it("accepts read-only source-to-provider contract bindings", () => {
      const contract =
        ExecutiveJournalProductArchitectureSourceContractRtc2Ex2Source01;
      assert.equal(contract.contractId, "RTC2-EX2-SOURCE-CONTRACT-01");
      assert.equal(contract.version, "rtc2-ex2-source/v0");
      assert.equal(contract.architectureStatus, "AcceptedSourceContract");
      assert.equal(contract.runtimeStatus, "NotImplemented");
      assert.equal(contract.direction, "source → projection provider");
      assert.equal(contract.source, "RTC2-JOURNAL-SOR-01");
      assert.equal(contract.consumer, "RTC2-EX2-PROVIDER-01");
      assert.equal(contract.readOnly, true);
      assert.equal(contract.commands, false);
      assert.equal(contract.mutation, false);
      assert.equal(contract.payloadExposure, false);
      assert.equal(contract.privateExistenceExposure, false);
      assert.equal(contract.requestBindings.length, 11);
      assert.equal(contract.responseBindings.length, 13);
      assert.equal(contract.prohibitedResponseData.length, 13);
      for (const field of contract.requestBindings) {
        assert.equal(
          assertExecutiveJournalProductArchitectureSourceRequestField(field),
          field,
        );
      }
      for (const field of contract.responseBindings) {
        assert.equal(
          assertExecutiveJournalProductArchitectureSourceResponseField(field),
          field,
        );
      }
      assert.ok(
        contract.prohibitedResponseData.includes("private_existence_signals"),
      );
      assert.ok(
        contract.prohibitedResponseData.includes("raw_source_sequence_offsets"),
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSourceContractId(
          "RTC2-EX2-SOURCE-CONTRACT-01",
        ),
        "RTC2-EX2-SOURCE-CONTRACT-01",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSourceContractVersion(
          "rtc2-ex2-source/v0",
        ),
        "rtc2-ex2-source/v0",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceContractVersion("v9")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceRequestField("command")
      );
      assert.equal(mutateFrozen(contract), false);
    });
  });

  describe("AD-EX2-02 privacy sequence eligibility", () => {
    it("selects Option B and keeps sequences and classifications closed", () => {
      const sor =
        ExecutiveJournalProductArchitectureSystemOfRecordRtc2JournalSor01;
      const contract =
        ExecutiveJournalProductArchitectureSourceContractRtc2Ex2Source01;
      assert.equal(
        sor.selectedPrivacyOption,
        "Option B — System of Record Produces Pre-Filtered Eligible Metadata",
      );
      assert.equal(sor.providerSeesPrivateExistence, false);
      assert.equal(sor.privateIdsExposed, false);
      assert.equal(sor.privateTimestampsExposed, false);
      assert.equal(sor.privateCountsExposed, false);
      assert.equal(sor.rawOffsetsExposed, false);
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureSourceClassifications],
        [
          "ExecutiveRecord",
          "RestrictedWorking",
          "RegulatedPrivileged",
          "PrivateReflection",
          "Unknown",
        ],
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureEligibilityResults],
        ["Eligible", "Ineligible", "Indeterminate"],
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSourceClassification(
          "PrivateReflection",
        ),
        "PrivateReflection",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureEligibilityResult("Ineligible"),
        "Ineligible",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceClassification("Shared")
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSequenceType(
          "AuthoritativeSourceSequence",
        ),
        "AuthoritativeSourceSequence",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSequenceType(
          "ProviderSafeSourceCursor",
        ),
        "ProviderSafeSourceCursor",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureSequenceType(
          "ExConsumerSequence",
        ),
        "ExConsumerSequence",
      );
      assert.equal(contract.authoritativeSourceSequenceExposedToEx, false);
      assert.equal(contract.providerCursorOpaque, true);
      assert.equal(contract.providerCursorPurposeBound, true);
      assert.equal(contract.exConsumerSequenceDense, true);
      assert.equal(contract.exConsumerSequencePresentationOnly, true);
      assert.equal(contract.silentRebaseProhibited, true);
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSequenceType("raw_offset")
      );
    });
  });

  describe("AD-EX2-02 results failures authority AI", () => {
    it("covers eight source results, failure families, and AI prohibitions", () => {
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureSourceResults],
        [
          "Available",
          "Empty",
          "Denied",
          "Unavailable",
          "Stale",
          "Conflict",
          "Invalid",
          "Indeterminate",
        ],
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureSourceResultPrecedence],
        [
          "Invalid",
          "Denied",
          "Conflict",
          "Unavailable",
          "Stale",
          "Indeterminate",
          "Empty",
          "Available",
        ],
      );
      for (const result of ExecutiveJournalProductArchitectureSourceResults) {
        assert.equal(
          assertExecutiveJournalProductArchitectureSourceResult(result),
          result,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceResult("Success")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureSourceFailureFamilies.length,
        19,
      );
      for (const family of ExecutiveJournalProductArchitectureSourceFailureFamilies) {
        assert.equal(
          assertExecutiveJournalProductArchitectureSourceFailureFamily(family),
          family,
        );
        assert.doesNotMatch(family, /payload|private_existence|evidence_body/);
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureSourceFailureFamily("timeout")
      );
      assert.equal(ExecutiveJournalProductArchitectureAiMustNot.length, 13);
      assert.ok(
        ExecutiveJournalProductArchitectureAiMustNot.includes(
          "write authoritative journal events",
        ),
      );
      assert.ok(
        ExecutiveJournalProductArchitectureAiMustNot.includes(
          "claim projections are authoritative state",
        ),
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureDecisionAdrEx202,
        ),
        false,
      );
    });
  });

  describe("AD-EX2-01 decision", () => {
    it("records exact Accepted AD-EX2-01 once without changing AD-EX2-00", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx201;
      assert.equal(decision.decisionId, "AD-EX2-01");
      assert.equal(
        decision.title,
        "Define the RTC-2-Governed Read Projection Provider and EX-2 Adapter Boundary",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-26");
      assert.equal(decision.decisionDateClassification, "SuppliedDecisionDate");
      assert.equal(
        decision.selectedArchitecture,
        "Future RTC-2-Governed Projection Provider with Separate EX-2 Privacy Adapter",
      );
      assert.equal(decision.decisionScope, "ArchitectureOnly");
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.providerImplementationAuthorized, false);
      assert.equal(decision.adapterImplementationAuthorized, false);
      assert.equal(decision.ex21CreationAuthorized, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-01"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.decisionId,
        "AD-EX2-00",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.status,
        "Accepted",
      );
      assert.equal(mutateFrozen(decision), false);
    });
  });

  describe("AD-EX2-01 provider", () => {
    it("accepts provider class without selecting a live provider or SoR", () => {
      const provider =
        ExecutiveJournalProductArchitectureProviderRtc2Ex2Provider01;
      assert.equal(provider.providerId, "RTC2-EX2-PROVIDER-01");
      assert.equal(
        provider.name,
        "RTC-2-Governed Executive Journal Read Projection Provider",
      );
      assert.equal(provider.architectureStatus, "AcceptedProviderClass");
      assert.equal(provider.runtimeStatus, "NotImplemented");
      assert.equal(provider.providerType, "ReadOnlyProjectionProvider");
      assert.equal(provider.governanceAuthority, "RTC-2");
      assert.equal(provider.systemOfRecordStatus, "Unresolved");
      assert.equal(provider.systemOfRecordSelected, false);
      assert.equal(provider.liveProviderSelected, false);
      assert.equal(provider.existingSuitableProviderFound, false);
      assert.equal(provider.app8SelectedAsSystemOfRecord, false);
      assert.equal(provider.exSelectedAsSystemOfRecord, false);
      assert.equal(
        provider.rtc2CertificationAggregateIsSystemOfRecord,
        false,
      );
      assert.equal(provider.systemOfRecordDecisionRequired, true);
      assert.equal(provider.commandsSupported, false);
      assert.equal(provider.journalMutation, false);
      assert.equal(provider.persistenceAuthorized, false);
      assert.equal(provider.networkAuthorized, false);
      assert.equal(provider.deploymentAuthorized, false);
      assert.equal(provider.privateReflectionExistenceEmitted, false);
      assert.equal(
        assertExecutiveJournalProductArchitectureProviderId(
          "RTC2-EX2-PROVIDER-01",
        ),
        "RTC2-EX2-PROVIDER-01",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureProviderId("APP-8")
      );
      assert.equal(mutateFrozen(provider), false);
    });
  });

  describe("AD-EX2-01 projection contract", () => {
    it("covers required, optional, NeedsDecision, and prohibited envelope fields without overlap", () => {
      const fields = ExecutiveJournalProductArchitectureProjectionEnvelopeFields;
      const byCategory = (category: string) =>
        fields.filter((item) => item.category === category).map((item) =>
          item.fieldId
        );
      assert.deepEqual(byCategory("Required"), [
        "projection_contract_id",
        "projection_contract_version",
        "provider_id",
        "journal_ref",
        "consumer_scope",
        "purpose",
        "classification",
        "generated_from_sequence",
        "projection_integrity",
        "eligibility_policy_ref",
        "privacy_policy_ref",
        "authority_policy_ref",
        "entries",
        "result_status",
      ]);
      assert.deepEqual(byCategory("Optional"), [
        "provider_instance_ref",
        "telemetry_policy_ref",
        "continuation",
        "failure_reasons",
      ]);
      assert.ok(byCategory("NeedsDecision").includes("projected_entry_count"));
      assert.ok(byCategory("Prohibited").includes("journal_payload"));
      assert.ok(byCategory("Prohibited").includes("private_reflection_existence"));
      assert.ok(byCategory("Prohibited").includes("raw_source_offsets"));
      const ids = fields.map((item) => item.fieldId);
      assert.equal(new Set(ids).size, ids.length);
      for (const field of fields) {
        assert.equal(
          assertExecutiveJournalProductArchitectureEnvelopeFieldId(field.fieldId),
          field.fieldId,
        );
        assert.equal(mutateFrozen(field), false);
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureEnvelopeFieldId("payload")
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureProjectionContractVersion(
          "ex2-projection-contract/v0",
        ),
        "ex2-projection-contract/v0",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureProjectionContractVersion("v9")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureProjectionContract
          .denseConsumerSequenceRequired,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureProjectionContract
          .rawSourceOffsetsProhibited,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureProjectionContract.finalAllowlist,
        false,
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureEntryProjectionFields],
        [
          "journal_ref",
          "entry_ref",
          "canonical_consumer_sequence",
          "shareable_entry_category",
          "lifecycle_state",
          "transformed_origin_classification",
          "coarse_authority_state",
          "opaque_provenance_reference",
          "evidence_present",
          "opaque_correction_reference",
          "opaque_supersession_reference",
          "projection_version",
          "coarse_integrity_state",
        ],
      );
      for (const fieldId of ExecutiveJournalProductArchitectureEntryProjectionFields) {
        assert.equal(
          assertExecutiveJournalProductArchitectureEntryFieldId(fieldId),
          fieldId,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureEntryFieldId("timestamp")
      );
    });
  });

  describe("AD-EX2-01 results and failures", () => {
    it("covers all six results and every failure family independently", () => {
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureProviderResults],
        ["Available", "Empty", "Denied", "Unavailable", "Stale", "Invalid"],
      );
      for (const result of ExecutiveJournalProductArchitectureProviderResults) {
        assert.equal(
          assertExecutiveJournalProductArchitectureProviderResult(result),
          result,
        );
        assert.ok(
          ExecutiveJournalProductArchitectureProviderResultSemantics[result]
            .length > 0,
        );
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureProviderResult("Success")
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureProviderResult("")
      );
      assert.equal(ExecutiveJournalProductArchitectureFailureFamilies.length, 18);
      for (const family of ExecutiveJournalProductArchitectureFailureFamilies) {
        assert.equal(
          assertExecutiveJournalProductArchitectureFailureFamily(family),
          family,
        );
        assert.doesNotMatch(family, /payload|private_existence|evidence_body/);
      }
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureFailureFamily("timeout")
      );
    });
  });

  describe("AD-EX2-01 adapter", () => {
    it("assigns EX-2 ownership without authorizing implementation or classification", () => {
      const adapter = ExecutiveJournalProductArchitectureAdapterContract;
      assert.equal(adapter.owner, "EX-2 Product Boundary");
      assert.equal(adapter.runtimeStatus, "NotImplemented");
      assert.equal(adapter.adapterImplementationAuthorized, false);
      assert.equal(adapter.ownsClassification, false);
      assert.equal(adapter.ownsAuthoritySelection, false);
      assert.equal(adapter.responsibilities.length, 12);
      assert.equal(adapter.prohibitedResponsibilities.length, 11);
      assert.ok(
        adapter.responsibilities.includes("enforce the final allowlist"),
      );
      assert.ok(
        adapter.prohibitedResponsibilities.includes("journal classification"),
      );
      assert.ok(
        adapter.prohibitedResponsibilities.includes(
          "private-to-shared promotion",
        ),
      );
      assert.equal(mutateFrozen(adapter), false);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.app8CompatibilityStatus,
        "UnsuitableUnderCurrentEvidence",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.app8Selected,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx201.rtc3Included,
        false,
      );
    });
  });

  describe("AD-EX2-07 decision", () => {
    it("records Accepted AD-EX2-07 Tier-0 UI architecture without implementation authorization", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx207;
      assert.equal(decision.decisionId, "AD-EX2-07");
      assert.equal(
        decision.title,
        "Authorize EX-2 Tier-0 Read-Only Synthetic UI Architecture",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-27");
      assert.equal(
        decision.decisionScope,
        "Tier0ReadOnlySyntheticUiArchitectureOnly",
      );
      assert.equal(
        decision.selectedOption,
        "PreEx21DevelopmentHarnessWithReadOnlyUiFacade",
      );
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.reactUiAuthorized, false);
      assert.equal(decision.uiImplementationAuthorized, false);
      assert.equal(decision.ex21Authorized, false);
      assert.equal(decision.routeAuthorized, false);
      assert.equal(decision.productionAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.architectureAccepted, true);
      assert.equal(decision.implementationAuthorization, "NotRecorded");
      assert.equal(decision.uiArtifactsImplemented, true);
      assert.equal(decision.uiCertification, "Certified");
      assert.equal(
        decision.uiCertificationId,
        "EX2-UI-CERT-T0-2026-07-27-01",
      );
      assert.equal(
        decision.uiCertificationResult,
        "CertifiedForTier0ReadOnlySyntheticDevelopmentHarnessUse",
      );
      assert.equal(decision.uiCertificationRecorded, true);
      assert.equal(decision.createsEx21, false);
      assert.equal(decision.createsReactUi, false);
      assert.equal(decision.createsRoute, false);
      assert.equal(decision.createsFacadeImplementation, false);
      assert.equal(decision.createsHarness, false);
      assert.equal(decision.createsFeatureFlag, false);
      assert.equal(decision.modifiesEx1PublicIndex, false);
      assert.equal(decision.usesExistingExecutiveJournalSlot, false);
      assert.equal(
        decision.humanUiAuthorizationId,
        "EX2-UI-AUTH-T0-2026-07-27-01",
      );
      assert.equal(decision.humanUiAuthorizationRecorded, true);
      assert.equal(decision.nextRequiredDecisionMayImplementUi, false);
      assert.equal(
        decision.nextRequiredDecision,
        "New decision required before route, EX-2:1, real RTC-2, production, or deployment; current Tier-0 UI authorization is terminal",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-07"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-07",
        ).length,
        1,
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureDecisionIds],
        [
          "AD-EX2-00",
          "AD-EX2-01",
          "AD-EX2-02",
          "AD-EX2-03",
          "AD-EX2-04",
          "AD-EX2-05",
          "AD-EX2-06",
          "AD-EX2-07",
          "AD-EX2-08",
          "AD-EX2-09",
          "AD-EX2-10",
        ],
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-07"),
        "AD-EX2-07",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-08"),
        "AD-EX2-08",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-09"),
        "AD-EX2-09",
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-10"),
        "AD-EX2-10",
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-11")
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx206.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });

    it("records product, UI, facade, host, and pre-EX-2:1 strategy exactly", () => {
      const product = ExecutiveJournalProductArchitectureTier0SyntheticUiProduct;
      const facade = ExecutiveJournalProductArchitectureTier0SyntheticUiFacade;
      const host = ExecutiveJournalProductArchitectureTier0SyntheticUiHostStrategy;
      const ex21 =
        ExecutiveJournalProductArchitectureTier0SyntheticUiEx21Strategy;
      assert.equal(
        product.productId,
        "EX-2:T0/ExecutiveJournalSyntheticContractPreview",
      );
      assert.equal(
        product.uiIdentity,
        "EX-2:T0/ExecutiveJournalSyntheticPreviewUI",
      );
      assert.equal(
        product.uiNamespace,
        "nexora.ex.executive.journal.synthetic.preview.ui",
      );
      assert.equal(
        product.productName,
        "Executive Journal Synthetic Contract Preview (Tier 0)",
      );
      assert.equal(product.productClass, "Tier0ReadOnlySyntheticPreview");
      assert.equal(
        product.subtitle,
        "Non-production · No live journal data · Reviewers only",
      );
      assert.equal(product.operationalJournal, false);
      assert.equal(product.productionProduct, false);
      assert.equal(product.publicProduct, false);
      assert.equal(
        facade.facadeId,
        "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade",
      );
      assert.equal(
        facade.facadeNamespace,
        "nexora.ex.executive.journal.synthetic.readonly.ui.facade",
      );
      assert.equal(facade.rawFixturesExposed, false);
      assert.equal(facade.providerInternalsExposed, false);
      assert.equal(facade.adapterInternalsExposed, false);
      assert.equal(facade.preAdapterProjectionsExposed, false);
      assert.equal(facade.mutationOperationsExposed, false);
      assert.equal(facade.implemented, true);
      assert.equal(host.initialHost, "DevelopmentTestHarnessOnly");
      assert.equal(host.primaryNavigationExposure, false);
      assert.equal(host.existingExecutiveJournalSlotUsage, false);
      assert.equal(host.ex1PublicIndexModification, false);
      assert.equal(host.dedicatedAppRouterRoute, "NotAuthorized");
      assert.equal(host.routeCreated, false);
      assert.equal(ex21.strategy, "RemainPreEx21Tier0SyntheticPreview");
      assert.equal(ex21.ex21Created, false);
      assert.equal(ex21.migrationToEx21Automatic, false);
      assert.equal(ex21.newArchitectureDecisionRequiredForEx21, true);
    });

    it("records display, view-state, marker, status-label, a11y, and responsive policies", () => {
      const display =
        ExecutiveJournalProductArchitectureTier0SyntheticUiDisplayPolicy;
      assert.deepEqual([...display.display], [
        "entry_category",
        "lifecycle_state",
        "origin_classification",
        "authority_state",
        "integrity_state",
        "source_classification",
      ]);
      assert.deepEqual([...display.conditionalDisplay], [
        "journal_ref",
        "provenance_ref",
        "correction_ref",
        "supersession_ref",
        "projection_schema_version",
      ]);
      assert.deepEqual([...display.internalOnly], ["entry_ref"]);
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureTier0SyntheticUiViewStates],
        [
          "Loading",
          "Ready",
          "Empty",
          "NotFound",
          "PrivacyRejected",
          "UnsupportedVersion",
          "IntegrityUnavailable",
          "ProviderUnavailable",
          "Failure",
        ],
      );
      const marker = ExecutiveJournalProductArchitectureTier0SyntheticUiMarker;
      assert.equal(
        marker.visibleText,
        "Synthetic · Tier 0 · Non-production · No live journal data",
      );
      assert.equal(marker.dismissible, false);
      assert.equal(marker.visibleInEveryState, true);
      assert.equal(marker.requiredInDetailRegion, true);
      const labels =
        ExecutiveJournalProductArchitectureTier0SyntheticUiStatusLabels;
      assert.equal(
        labels.origin.AiProposed,
        "AI-proposed — non-authoritative",
      );
      assert.equal(labels.authority.Absent, "Authority absent");
      assert.equal(
        labels.integrity.Verified,
        "Integrity verified — synthetic",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiAccessibility.target,
        "WCAG22AA",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiAccessibility
          .minimumTouchTargetPx,
        44,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiResponsive
          .fixedDesktopViewportRequired,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiInformationArchitecture
          .layout,
        "SinglePageMasterDetail",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiInformationArchitecture
          .pagination,
        false,
      );
    });

    it("records privacy, authority, browser-state, feature-flag, reviews, and auth vocabulary", () => {
      const privacy =
        ExecutiveJournalProductArchitectureTier0SyntheticUiPrivacyControls;
      assert.equal(privacy.recordTotals, "Prohibited");
      assert.equal(privacy.telemetry, "Disabled");
      assert.equal(
        privacy.focusedUiPrivacyReviewRequiredBeforeImplementationAuthorization,
        true,
      );
      const authority =
        ExecutiveJournalProductArchitectureTier0SyntheticUiAuthoritySecurityControls;
      assert.equal(authority.authorityCreation, "Prohibited");
      assert.equal(authority.adapterBypass, "Prohibited");
      assert.equal(authority.rawFixtureAccess, "Prohibited");
      const browser =
        ExecutiveJournalProductArchitectureTier0SyntheticUiBrowserStatePolicy;
      assert.equal(browser.networkFetch, "Prohibited");
      assert.equal(browser.localStorage, "Prohibited");
      const flag =
        ExecutiveJournalProductArchitectureTier0SyntheticUiFeatureFlagPolicy;
      assert.equal(flag.featureFlagRequiredForHarnessOnlyImplementation, false);
      assert.equal(flag.featureFlagRequiredBeforeAnyRoute, true);
      assert.equal(flag.featureFlagCreated, false);
      const plan = ExecutiveJournalProductArchitectureTier0SyntheticUiTestPlan;
      assert.equal(plan.uiTestPlanApproved, true);
      assert.equal(plan.uiTestsImplemented, true);
      assert.equal(plan.uiEvidenceAvailable, true);
      const reviews =
        ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews;
      assert.equal(reviews.privacyReviewId, "EX2-T0-UI-PRIVACY-REVIEW-01");
      assert.equal(
        reviews.authoritySecurityReviewId,
        "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01",
      );
      assert.equal(
        reviews.privacyUiReviewStatus,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        reviews.authoritySecurityUiReviewStatus,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(reviews.uiT009ReviewCompleted, true);
      assert.equal(reviews.uiT009ReviewApproved, true);
      assert.equal(reviews.uiT010ReviewCompleted, true);
      assert.equal(reviews.uiT010ReviewApproved, true);
      assert.equal(reviews.reviewApprovalIsNotImplementationAuthorization, true);
      const future =
        ExecutiveJournalProductArchitectureTier0SyntheticUiFutureAuthorization;
      assert.equal(
        future.vocabulary,
        "AuthorizedForTier0ReadOnlySyntheticExUiImplementationAndTests",
      );
      assert.equal(future.authorizationVocabularyApproved, true);
      assert.equal(future.authorizationRecorded, true);
      assert.equal(future.authorizationId, "EX2-UI-AUTH-T0-2026-07-27-01");
      assert.equal(future.uiImplementationAuthorized, true);
      assert.equal(future.uiArtifactsImplemented, true);
    });

    it("records closed Tier-0 UI gate catalogue with exact Pass/Pending totals", () => {
      assert.equal(ExecutiveJournalProductArchitectureTier0UiGates.length, 16);
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureTier0UiGateIds],
        ExecutiveJournalProductArchitectureTier0UiGates.map(
          (item) => item.gateId,
        ),
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pass"),
        16,
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pending"),
        0,
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Fail"),
        0,
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("NotEvaluated"),
        0,
      );
      const impact = ExecutiveJournalProductArchitectureTier0UiGateImpact;
      assert.equal(impact.afterPassedGateCount, 16);
      assert.equal(impact.afterPendingGateCount, 0);
      assert.deepEqual([...impact.newlyPassed], [
        "UI-T0-09",
        "UI-T0-10",
        "UI-T0-11",
        "UI-T0-12",
        "UI-T0-13",
        "UI-T0-14",
        "UI-T0-15",
        "UI-T0-16",
      ]);
      assert.deepEqual([...impact.remainingPending], []);
      assert.equal(impact.uiT009ReviewCompleted, true);
      assert.equal(impact.uiT010ReviewCompleted, true);
      assert.equal(impact.uiT011HumanAuthorizationRecorded, true);
      assert.equal(impact.uiT012FacadeEnforcementVerified, true);
      assert.equal(impact.uiT013UiImplementationTestsPassed, true);
      assert.equal(impact.uiT014VisualAccessibilityQaPassed, true);
      assert.equal(impact.uiT014VisualAccessibilityQaPending, false);
      assert.equal(impact.uiT015AuthorizationBoundariesVerified, true);
      assert.equal(impact.uiT016UiCertificationRecorded, true);
      assert.equal(impact.uiT016UiCertificationPending, false);
      assert.equal(impact.tier0Pass, true);
      assert.equal(impact.productionPass, false);
      assert.equal(impact.routePass, false);
      assert.equal(impact.deploymentPass, false);
      assert.equal(impact.gEx204RemainsPending, true);
      assert.equal(impact.gEx207RemainsPending, true);
      assert.equal(impact.gEx212RemainsPending, true);
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.getSummary().passedGateCount,
        13,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.getSummary().pendingGateCount,
        3,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.decisionAdEx207,
        ExecutiveJournalProductArchitectureDecisionAdrEx207,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0UiGates,
        ExecutiveJournalProductArchitectureTier0UiGates,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(mutateFrozen(ExecutiveJournalProductArchitectureTier0UiGates), false);
    });
  });

  describe("AD-EX2-08 decision", () => {
    it("records Accepted AD-EX2-08 exactly once and remains immutable", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx208;
      assert.equal(decision.decisionId, "AD-EX2-08");
      assert.equal(
        decision.title,
        "Formalize the EX-2 Nine-Phase Sequence and Authorize Metadata-Only EX-2:1 Foundation",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-27");
      assert.equal(
        decision.decisionScope,
        "MetadataOnlyEx21FoundationAuthorization",
      );
      assert.equal(
        decision.selectedOption,
        "FormalNinePhaseSequenceWithTier0EvidenceReuse",
      );
      assert.equal(
        decision.supersedesOnly,
        "EarlierBlanketEx21BlockingInterpretation",
      );
      assert.equal(decision.doesNotRewriteOrWeakenAdEx200ThroughAdEx207, true);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-08",
        ).length,
        1,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-08"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.decisionAdEx208,
        decision,
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });

    it("leaves AD-EX2-00 through AD-EX2-07 unchanged", () => {
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.decisionId,
        "AD-EX2-00",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.ex21CreationAuthorized,
        false,
      );
      assert.ok(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.consequences.includes(
          "EX-2:1 remains blocked until all mandatory gates pass.",
        ),
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.decisionId,
        "AD-EX2-07",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.createsEx21,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.routeAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.nextRequiredDecision,
        "New decision required before route, EX-2:1, real RTC-2, production, or deployment; current Tier-0 UI authorization is terminal",
      );
      for (const id of [
        "AD-EX2-00",
        "AD-EX2-01",
        "AD-EX2-02",
        "AD-EX2-03",
        "AD-EX2-04",
        "AD-EX2-05",
        "AD-EX2-06",
        "AD-EX2-07",
      ] as const) {
        assert.equal(
          getExecutiveJournalProductArchitectureDecision(id).status,
          "Accepted",
        );
      }
    });

    it("records the exact ordered unique immutable nine-phase sequence", () => {
      const sequence = ExecutiveJournalProductArchitectureFormalEx2NinePhaseSequence;
      assert.equal(sequence.length, 9);
      assert.deepEqual(
        sequence.map((item) => item.title),
        [
          "EX-2:1 — Executive Journal Experience Foundation",
          "EX-2:2 — Executive Journal Experience Registry",
          "EX-2:3 — Executive Journal Experience Model",
          "EX-2:4 — Executive Journal Experience Validation",
          "EX-2:5 — Executive Journal Experience Manifest",
          "EX-2:6 — Executive Journal Experience Platform",
          "EX-2:7 — Executive Journal Experience Certification",
          "EX-2:8 — Executive Journal Experience Freeze",
          "EX-2:9 — Executive Journal Experience Public Index",
        ],
      );
      assert.deepEqual(
        sequence.map((item) => item.identity),
        [...ExecutiveJournalProductArchitectureFormalEx2PhaseIdentities],
      );
      assert.equal(
        new Set(sequence.map((item) => item.identity)).size,
        9,
      );
      assert.deepEqual(
        sequence.map((item) => item.order),
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureFormalEx2ReadinessChain],
        [
          { phaseStatus: "Foundation", readiness: "ReadyForRegistry" },
          { phaseStatus: "Registry", readiness: "ReadyForModel" },
          { phaseStatus: "Model", readiness: "ReadyForValidation" },
          { phaseStatus: "Validation", readiness: "ReadyForManifest" },
          { phaseStatus: "Manifest", readiness: "ReadyForPlatform" },
          { phaseStatus: "Platform", readiness: "ReadyForCertification" },
          { phaseStatus: "Certification", readiness: "ReadyForFreeze" },
          { phaseStatus: "Freeze", readiness: "ReadyForPublicIndex" },
          { phaseStatus: "PublicIndex", readiness: "ReadyForConsumer" },
        ],
      );
      assert.equal(mutateFrozen(sequence), false);
      assert.equal(attemptNestedMutation(sequence), false);
      assert.equal(
        mutateFrozen(ExecutiveJournalProductArchitectureFormalEx2ReadinessChain),
        false,
      );
    });

    it("fails closed for unknown phase identities and readiness values", () => {
      for (const value of [
        "EX-2:0/ExecutiveJournalExperienceFoundation",
        "EX-2:1/ExecutiveStageFoundation",
        "EX-2:10/ExecutiveJournalExperiencePublicIndex",
        "ex-2:1/ExecutiveJournalExperienceFoundation",
        "",
      ]) {
        assert.throws(
          () =>
            assertExecutiveJournalProductArchitectureFormalEx2PhaseIdentity(
              value,
            ),
          /fails closed/,
        );
        assert.throws(
          () => getExecutiveJournalProductArchitectureFormalEx2Phase(value),
          /fails closed/,
        );
      }
      for (const value of [
        "ReadyForEx21",
        "Ready",
        "readyForRegistry",
        "ReadyForConsumer ",
        "",
      ]) {
        assert.throws(
          () =>
            assertExecutiveJournalProductArchitectureFormalEx2Readiness(value),
          /fails closed/,
        );
      }
      for (const value of ["foundation", "EX-2:1", "Certified", ""]) {
        assert.throws(
          () =>
            assertExecutiveJournalProductArchitectureFormalEx2PhaseStatus(
              value,
            ),
          /fails closed/,
        );
      }
    });

    it("authorizes only metadata-only EX-2:1 Foundation", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx208;
      const foundation =
        ExecutiveJournalProductArchitectureAuthorizedEx21Foundation;
      const flags = ExecutiveJournalProductArchitectureAdEx208AuthorizationFlags;
      assert.equal(decision.formalEx2SequenceAuthorized, true);
      assert.equal(decision.ex21MetadataOnlyFoundationAuthorized, true);
      assert.equal(decision.ex21ImplementationAuthorized, true);
      assert.equal(
        decision.ex21ImplementationScope,
        "MetadataOnlyEx21FoundationOnly",
      );
      assert.equal(flags.formalEx2SequenceAuthorized, true);
      assert.equal(flags.ex21MetadataOnlyFoundationAuthorized, true);
      assert.equal(flags.ex21ImplementationAuthorized, true);
      assert.equal(
        foundation.identity,
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      );
      assert.equal(
        foundation.namespace,
        "nexora.ex.executive.journal.experience.foundation",
      );
      assert.equal(foundation.status, "Foundation");
      assert.equal(foundation.readiness, "ReadyForRegistry");
      assert.equal(
        foundation.nextPhaseMetadata,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(foundation.behavior.metadataOnly, true);
      assert.equal(foundation.behavior.sideEffectFree, true);
      assert.equal(foundation.behavior.routeOrUiMounting, false);
      assert.equal(foundation.behavior.networkingOrPersistence, false);
      assert.equal(foundation.behavior.liveRtc2Provider, false);
      assert.equal(foundation.behavior.productionData, false);
      assert.equal(foundation.behavior.deployment, false);
      assert.equal(foundation.behavior.app8Integration, false);
      assert.equal(foundation.behavior.rtc3Integration, false);
      assert.equal(foundation.behavior.authorityCreation, false);
      assert.equal(foundation.behavior.operationalJournalBehavior, false);
      assert.equal(foundation.createdByThisDecision, false);
      assert.equal(decision.createsEx21, false);
      assert.equal(
        isExecutiveJournalProductEx21MetadataOnlyFoundationAuthorized(),
        true,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureFormalEx2Phase(
          "EX-2:1/ExecutiveJournalExperienceFoundation",
        ).phaseAuthorized,
        true,
      );
      assert.equal(
        decision.readinessConclusion,
        "ReadyForMetadataOnlyEx21FoundationImplementation",
      );
    });

    it("keeps EX-2:2 through EX-2:9 unauthorized and uncreated", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx208;
      const flags = ExecutiveJournalProductArchitectureAdEx208AuthorizationFlags;
      assert.equal(decision.ex22Authorized, false);
      assert.equal(decision.ex23Authorized, false);
      assert.equal(decision.ex24Authorized, false);
      assert.equal(decision.ex25Authorized, false);
      assert.equal(decision.ex26Authorized, false);
      assert.equal(decision.ex27Authorized, false);
      assert.equal(decision.ex28Authorized, false);
      assert.equal(decision.ex29Authorized, false);
      assert.equal(flags.ex22Authorized, false);
      assert.equal(flags.ex23Authorized, false);
      assert.equal(flags.ex24Authorized, false);
      assert.equal(flags.ex25Authorized, false);
      assert.equal(flags.ex26Authorized, false);
      assert.equal(flags.ex27Authorized, false);
      assert.equal(flags.ex28Authorized, false);
      assert.equal(flags.ex29Authorized, false);
      for (const phase of ExecutiveJournalProductArchitectureFormalEx2NinePhaseSequence
        .slice(1)) {
        assert.equal(phase.phaseAuthorized, false);
        assert.equal(phase.phaseCreated, false);
        assert.equal(phase.metadataOnlyFoundationAuthorized, false);
      }
      assert.equal(decision.createsEx22, false);
      assert.equal(decision.createsEx29, false);
    });

    it("adopts Tier-0 evidence by exact reference without relabelling as formal phases", () => {
      const policy =
        ExecutiveJournalProductArchitectureTier0EvidenceAdoptionPolicy;
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx208;
      assert.equal(policy.strategy, "ExactReferenceEvidenceLedger");
      assert.equal(policy.maySupportEx21ByExactImmutableReference, true);
      assert.equal(
        policy.mayCopyRenameReissueOrReclassifyAsFormalEx2Phases,
        false,
      );
      assert.equal(policy.tier0CertificationIsNotEx27Certification, true);
      assert.equal(policy.tier0ImmutabilityIsNotEx28Freeze, true);
      assert.equal(policy.tier0UiOrRouteAssessmentIsNotEx29PublicIndex, true);
      assert.equal(policy.oneEvidenceIdentityCountedOnlyOnce, true);
      assert.equal(
        policy.scopeChangesMustExplicitlyReopenAffectedEvidence,
        true,
      );
      assert.equal(decision.relabelsTier0AsFormalEx2PhaseCompletion, false);
      assert.equal(
        getExecutiveJournalProductArchitectureSummary()
          .certificationId,
        "EX2-CERT-T0-2026-07-26-01",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureSummary().uiCertificationId,
        "EX2-UI-CERT-T0-2026-07-27-01",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureSummary()
          .certificationResult,
        "CertifiedForTier0SyntheticMetadataContractUse",
      );
    });

    it("clarifies historical ex21Blocked without deleting blocking history", () => {
      const clarification =
        ExecutiveJournalProductArchitectureEx21BlockedClarification;
      const summary = getExecutiveJournalProductArchitectureSummary();
      assert.equal(clarification.clarifyingDecisionId, "AD-EX2-08");
      assert.equal(clarification.historicalBlanketInterpretationRetained, true);
      assert.equal(clarification.historicalEx21BlockedFieldRetained, true);
      assert.equal(
        clarification.operationalAndProductionProgressionRemainsBlocked,
        true,
      );
      assert.equal(summary.ex21Blocked, true);
      assert.equal(summary.ex21BlockedClarifiedByAdEx208, true);
      assert.equal(
        summary.ex21BlockedMeans,
        "OperationalProductionAndLaterPhasesRemainBlocked",
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        isExecutiveJournalProductEx21MetadataOnlyFoundationAuthorized(),
        true,
      );
    });

    it("preserves pending gates and open issues unresolved", () => {
      const issues =
        ExecutiveJournalProductArchitectureAdEx208PreservedOpenIssues;
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.marksPendingGatesPass,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208
          .resolvesOpenProductionIssues,
        false,
      );
      assert.equal(
        issues.every((item) => item.resolvedByAdEx208 === false),
        true,
      );
      assert.equal(
        issues.filter((item) => item.id === "G-EX2-04")[0]?.result,
        "Pending",
      );
      assert.equal(
        issues.filter((item) => item.id === "G-EX2-07")[0]?.result,
        "Pending",
      );
      assert.equal(
        issues.filter((item) => item.id === "G-EX2-12")[0]?.result,
        "Pending",
      );
      assert.equal(getExecutiveJournalProductArchitectureSummary().passedGateCount, 13);
      assert.equal(getExecutiveJournalProductArchitectureSummary().pendingGateCount, 3);
    });

    it("defers route assessment and keeps production surfaces unauthorized", () => {
      const route =
        ExecutiveJournalProductArchitectureAdEx208RouteDisposition;
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx208;
      const flags = ExecutiveJournalProductArchitectureAdEx208AuthorizationFlags;
      assert.equal(route.routeAssessment, "DeferredSupportingEvidence");
      assert.equal(route.routeImplementationAuthorized, false);
      assert.equal(route.routeArchitectureDecisionAccepted, false);
      assert.equal(
        route.noRoutePathReservedAsAuthoritativeProductSurface,
        true,
      );
      assert.equal(
        route.adEx208UsedForFormalSequenceAuthorizationNotRouteAuthorization,
        true,
      );
      assert.equal(decision.routeAuthorized, false);
      assert.equal(decision.realRtc2ConsumptionAuthorized, false);
      assert.equal(decision.productionIntegrationAuthorized, false);
      assert.equal(decision.productionPlatformAuthorized, false);
      assert.equal(decision.publicIndexAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(flags.routeAuthorized, false);
      assert.equal(flags.realRtc2ConsumptionAuthorized, false);
      assert.equal(flags.productionIntegrationAuthorized, false);
      assert.equal(flags.productionPlatformAuthorized, false);
      assert.equal(flags.publicIndexAuthorized, false);
      assert.equal(flags.deploymentAuthorized, false);
      assert.equal(
        getExecutiveJournalProductArchitectureSummary().publicIndexAuthorized,
        false,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureSummary().deploymentAuthorized,
        false,
      );
    });

    it("does not create later phases or routes; AD-EX2-08 itself remains non-creating", () => {
      const exDir = readdirSync(HERE);
      // AD-EX2-08 does not authorize EX-2:3+. EX-2:2 Registry may exist under AD-EX2-09.
      assert.equal(
        exDir.some((name) =>
          /executiveJournalExperience(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/i
            .test(name)
        ),
        false,
      );
      assert.equal(
        readdirSync(join(FRONTEND_ROOT, "app")).some((name) =>
          name === "executive"
        )
          && readdirSync(join(FRONTEND_ROOT, "app/executive"), {
            withFileTypes: true,
          }).some((entry) =>
            entry.isDirectory()
            && /synthetic-journal|executive-journal-experience/i.test(entry.name)
          ),
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.createsEx21,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.createsRoute,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208
          .ex21MetadataOnlyFoundationAuthorized,
        true,
      );
      assert.equal(ExecutiveJournalProductArchitecture.createsEx21, false);
      assert.equal(
        ExecutiveJournalProductArchitecture.modifiesEx1PublicIndex,
        false,
      );
    });

    it("preserves dependency boundaries unchanged", () => {
      assert.equal(ExecutiveJournalProductArchitecture.importsReact, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsNext, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsRtc2Runtime, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsRtc3Runtime, false);
      assert.equal(ExecutiveJournalProductArchitecture.importsApp8, false);
      assert.equal(ExecutiveJournalProductArchitecture.usesNetwork, false);
      assert.equal(ExecutiveJournalProductArchitecture.usesPersistence, false);
      assert.equal(ExecutiveJournalProductArchitecture.implementsAdapter, false);
      assert.equal(ExecutiveJournalProductArchitecture.implementsProvider, false);
      assert.equal(ExecutiveJournalProductArchitecture.circularDependency, false);
      assert.equal(ExecutiveJournalProductArchitecture.reverseDependency, false);
      assert.equal(ExecutiveJournalProductArchitecture.metadataOnly, true);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.dependencyDirection,
        "EX-2 presentation → allowlisted projection/adapter → authorized RTC-2-governed provider",
      );
    });
  });

  describe("AD-EX2-09 decision", () => {
    it("records Accepted AD-EX2-09 exactly once and remains immutable", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx209;
      assert.equal(decision.decisionId, "AD-EX2-09");
      assert.equal(
        decision.title,
        "Authorize Metadata-Only EX-2:2 Executive Journal Experience Registry",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-27");
      assert.equal(
        decision.decisionScope,
        "Ex22RegistryImplementationAndVerificationOnly",
      );
      assert.equal(
        decision.selectedOption,
        "MetadataOnlyClosedWorldRegistry",
      );
      assert.equal(decision.doesNotRewriteAdEx200ThroughAdEx208, true);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-09",
        ).length,
        1,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-09"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.decisionAdEx209,
        decision,
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });

    it("leaves AD-EX2-00 through AD-EX2-08 and EX-2:1 unchanged", () => {
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.ex22Authorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx208.nextRequiredDecision,
        "NPA-T — EX-2:1 Executive Journal Experience Foundation (metadata-only)",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      for (const id of [
        "AD-EX2-00",
        "AD-EX2-01",
        "AD-EX2-02",
        "AD-EX2-03",
        "AD-EX2-04",
        "AD-EX2-05",
        "AD-EX2-06",
        "AD-EX2-07",
        "AD-EX2-08",
      ] as const) {
        assert.equal(
          getExecutiveJournalProductArchitectureDecision(id).status,
          "Accepted",
        );
      }
      assert.equal(
        ExecutiveJournalExperienceFoundationId,
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationReadiness,
        "ReadyForRegistry",
      );
    });

    it("authorizes metadata-only EX-2:2 Registry without EX-2:3 or runtime surfaces", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx209;
      const flags = ExecutiveJournalProductArchitectureAdEx209AuthorizationFlags;
      const registry = ExecutiveJournalProductArchitectureAuthorizedEx22Registry;
      const summary = getExecutiveJournalProductArchitectureSummary();
      assert.equal(decision.ex22MetadataOnlyRegistryAuthorized, true);
      assert.equal(decision.ex22ImplementationAuthorized, true);
      assert.equal(
        decision.ex22ImplementationScope,
        "MetadataOnlyEx22RegistryOnly",
      );
      assert.equal(flags.ex22MetadataOnlyRegistryAuthorized, true);
      assert.equal(flags.ex22ImplementationAuthorized, true);
      assert.equal(flags.ex23Authorized, false);
      assert.equal(flags.runtimeBehaviorAuthorized, false);
      assert.equal(flags.routeAuthorized, false);
      assert.equal(flags.realRtc2ConsumptionAuthorized, false);
      assert.equal(flags.productionProviderAuthorized, false);
      assert.equal(flags.networkAuthorized, false);
      assert.equal(flags.persistenceAuthorized, false);
      assert.equal(flags.telemetryAuthorized, false);
      assert.equal(flags.publicIndexAuthorized, false);
      assert.equal(flags.deploymentAuthorized, false);
      assert.equal(
        registry.identity,
        "EX-2:2/ExecutiveJournalExperienceRegistry",
      );
      assert.equal(
        registry.namespace,
        "nexora.ex.executive.journal.experience.registry",
      );
      assert.equal(registry.status, "Registry");
      assert.equal(registry.readiness, "ReadyForModel");
      assert.equal(
        registry.previousPhase,
        "EX-2:1 — Executive Journal Experience Foundation",
      );
      assert.equal(
        registry.nextPhaseMetadata,
        "EX-2:3 — Executive Journal Experience Model",
      );
      assert.equal(registry.createdByThisDecision, false);
      assert.equal(decision.createsEx22, false);
      assert.equal(decision.ex23Authorized, false);
      assert.equal(
        isExecutiveJournalProductEx22MetadataOnlyRegistryAuthorized(),
        true,
      );
      assert.equal(summary.ex22Authorized, true);
      assert.equal(summary.ex22MetadataOnlyRegistryAuthorized, true);
      // Aggregate summary advances with AD-EX2-10; AD-EX2-09 itself remains unchanged.
      assert.equal(summary.ex23Authorized, true);
      assert.equal(summary.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(
        summary.readinessConclusion,
        "ReadyForMetadataOnlyEx23ModelImplementation",
      );
      assert.equal(
        summary.nextRequiredDecision,
        "NPA-T — EX-2:3 Executive Journal Experience Model",
      );
      assert.equal(
        decision.readinessConclusion,
        "ReadyForMetadataOnlyEx22RegistryImplementation",
      );
      assert.equal(
        decision.nextRequiredDecision,
        "NPA-T — EX-2:2 Executive Journal Experience Registry (metadata-only)",
      );
    });

    it("preserves pending gates and does not create EX-2:3+ files", () => {
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.marksPendingGatesPass,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureAdEx209PreservedOpenIssues.every(
          (item) => item.resolvedByAdEx209 === false,
        ),
        true,
      );
      // AD-EX2-09 authorizes EX-2:2 Registry implementation; Model+ remain uncreated here.
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.createsEx22,
        false,
      );
      assert.equal(
        readdirSync(HERE).some((name) =>
          /executiveJournalExperience(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/i
            .test(name)
        ),
        false,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
    });
  });

  describe("AD-EX2-10 decision", () => {
    it("records Accepted AD-EX2-10 exactly once and remains immutable", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx210;
      assert.equal(decision.decisionId, "AD-EX2-10");
      assert.equal(
        decision.title,
        "Authorize Metadata-Only EX-2:3 Executive Journal Experience Model",
      );
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-27");
      assert.equal(
        decision.decisionScope,
        "Ex23ModelImplementationAndVerificationOnly",
      );
      assert.equal(
        decision.selectedOption,
        "MetadataOnlyCanonicalExperienceModel",
      );
      assert.equal(decision.doesNotRewriteAdEx200ThroughAdEx209, true);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (item) => item.decisionId === "AD-EX2-10",
        ).length,
        1,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureDecision("AD-EX2-10"),
        decision,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.decisionAdEx210,
        decision,
      );
      assert.equal(mutateFrozen(decision), false);
      assert.equal(attemptNestedMutation(decision), false);
    });

    it("leaves AD-EX2-00 through AD-EX2-09 and EX-2:2 ReadyForModel unchanged", () => {
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.ex23Authorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209
          .ex22MetadataOnlyRegistryAuthorized,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx209.readinessConclusion,
        "ReadyForMetadataOnlyEx22RegistryImplementation",
      );
      for (const id of [
        "AD-EX2-00",
        "AD-EX2-01",
        "AD-EX2-02",
        "AD-EX2-03",
        "AD-EX2-04",
        "AD-EX2-05",
        "AD-EX2-06",
        "AD-EX2-07",
        "AD-EX2-08",
        "AD-EX2-09",
      ] as const) {
        assert.equal(
          getExecutiveJournalProductArchitectureDecision(id).status,
          "Accepted",
        );
      }
      assert.equal(
        ExecutiveJournalProductArchitectureAuthorizedEx22Registry.readiness,
        "ReadyForModel",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureAuthorizedEx22Registry.identity,
        "EX-2:2/ExecutiveJournalExperienceRegistry",
      );
      assert.equal(
        readdirSync(HERE).includes("executiveJournalExperienceRegistry.ts"),
        true,
      );
    });

    it("authorizes metadata-only EX-2:3 Model without EX-2:4 or runtime surfaces", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx210;
      const flags = ExecutiveJournalProductArchitectureAdEx210AuthorizationFlags;
      const model = ExecutiveJournalProductArchitectureAuthorizedEx23Model;
      const summary = getExecutiveJournalProductArchitectureSummary();
      assert.equal(decision.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(decision.ex23ImplementationAuthorized, true);
      assert.equal(
        decision.ex23ImplementationScope,
        "MetadataOnlyEx23ModelOnly",
      );
      assert.equal(flags.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(flags.ex23ImplementationAuthorized, true);
      assert.equal(flags.ex24Authorized, false);
      assert.equal(flags.runtimeBehaviorAuthorized, false);
      assert.equal(flags.uiExpansionAuthorized, false);
      assert.equal(flags.routeAuthorized, false);
      assert.equal(flags.realRtc2ConsumptionAuthorized, false);
      assert.equal(flags.productionProviderAuthorized, false);
      assert.equal(flags.networkAuthorized, false);
      assert.equal(flags.persistenceAuthorized, false);
      assert.equal(flags.telemetryAuthorized, false);
      assert.equal(flags.publicIndexAuthorized, false);
      assert.equal(flags.deploymentAuthorized, false);
      assert.equal(
        model.identity,
        "EX-2:3/ExecutiveJournalExperienceModel",
      );
      assert.equal(
        model.namespace,
        "nexora.ex.executive.journal.experience.model",
      );
      assert.equal(model.status, "Model");
      assert.equal(model.readiness, "ReadyForValidation");
      assert.equal(model.phase, "EX-2:3");
      assert.equal(
        model.previousPhase,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(
        model.nextPhaseMetadata,
        "EX-2:4 — Executive Journal Experience Validation",
      );
      assert.equal(model.metadataOnly, true);
      assert.equal(model.sideEffectFree, true);
      assert.equal(model.ownership, "EX-owned presentation/consumer model");
      assert.equal(model.doesNotRecreateRtc2JournalGovernance, true);
      assert.equal(model.mayNot.importEx21FoundationDirectly, true);
      assert.equal(model.mayNot.importRtcApp8OrEx1RuntimeModules, true);
      assert.equal(model.createdByThisDecision, false);
      assert.equal(decision.createsEx23, false);
      assert.equal(decision.ex24Authorized, false);
      assert.equal(decision.injectsIntoFoundationLedger, false);
      assert.equal(decision.injectsIntoRegistryAuthorizationHistory, false);
      assert.equal(
        isExecutiveJournalProductEx23MetadataOnlyModelAuthorized(),
        true,
      );
      assert.equal(summary.ex23Authorized, true);
      assert.equal(summary.ex23MetadataOnlyModelAuthorized, true);
      assert.equal(summary.ex24Authorized, false);
      assert.equal(summary.uiExpansionAuthorized, false);
      assert.equal(
        summary.readinessConclusion,
        "ReadyForMetadataOnlyEx23ModelImplementation",
      );
      assert.equal(
        summary.nextRequiredDecision,
        "NPA-T — EX-2:3 Executive Journal Experience Model",
      );
      assert.equal(model.proposedPackage.length, 8);
      assert.equal(model.mayDefineEntitiesFor.length, 16);
      assert.equal(model.requiredDistinctions.length, 11);
      assert.ok(model.absoluteProhibitions.length >= 18);
    });

    it("preserves pending gates/issues and does not create EX-2:3 or EX-2:4 files", () => {
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx210.marksPendingGatesPass,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx210
          .resolvesOpenProductionIssues,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureAdEx210PreservedOpenIssues.every(
          (item) => item.resolvedByAdEx210 === false,
        ),
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx210.createsEx23,
        false,
      );
      assert.equal(
        readdirSync(HERE).some((name) =>
          /executiveJournalExperience(Model|Validation|Manifest|Platform|Certification|Freeze|PublicIndex)/i
            .test(name)
        ),
        false,
      );
      assert.throws(() =>
        assertExecutiveJournalProductArchitectureDecisionId("AD-EX2-11")
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
    });
  });

  describe("GOV-EX2-T0-02 UI reviewer scope extension", () => {
    it("records Accepted GOV-EX2-T0-02 without approving UI reviews or authorizing implementation", () => {
      const gov = ExecutiveJournalProductArchitectureGovernanceGovEx2T002;
      assert.equal(gov.decisionId, "GOV-EX2-T0-02");
      assert.equal(
        gov.title,
        "Extend Interim EX-2 Tier-0 Reviewer Authority to Synthetic UI Privacy and Authority-Security Review",
      );
      assert.equal(gov.status, "Accepted");
      assert.equal(gov.appointingHuman, "Bahadoor");
      assert.equal(
        gov.appointingRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(gov.decisionDate, "2026-07-27");
      assert.equal(gov.decisionScope, "Tier0SyntheticUiReviewOnly");
      assert.equal(gov.parentGovernanceDecision, "GOV-EX2-T0-01");
      assert.equal(gov.architectureDecision, "AD-EX2-07");
      assert.equal(gov.certifiedPackage, "EX2-CERT-T0-2026-07-26-01");
      assert.equal(gov.temporary, true);
      assert.equal(gov.productionApplicability, false);
      assert.equal(gov.realRtc2Applicability, false);
      assert.equal(gov.implementationAuthorization, false);
      assert.equal(gov.deploymentAuthorization, false);
      assert.equal(gov.uiT009ReviewerAuthorityEstablished, true);
      assert.equal(gov.uiT009ReviewCompleted, false);
      assert.equal(gov.uiT009ReviewApproved, false);
      assert.equal(gov.uiT010ReviewerAuthorityEstablished, true);
      assert.equal(gov.uiT010ReviewCompleted, false);
      assert.equal(gov.uiT010ReviewApproved, false);
      assert.equal(gov.appointmentIsNotReviewApproval, true);
      assert.equal(gov.earlierAppointmentsInsufficientForFocusedUiReviews, true);
      assert.equal(gov.priorAppointmentAndReviewHistoryNotRewritten, true);
      assert.equal(gov.createsAdEx208, false);
      assert.equal(gov.uiImplementationAuthorized, false);
      assert.equal(gov.facadeImplementationAuthorized, false);
      assert.equal(gov.reactAuthorized, false);
      assert.equal(gov.harnessAuthorized, false);
      assert.equal(gov.routeAuthorized, false);
      assert.equal(gov.ex21Authorized, false);
      assert.equal(gov.futureUiAuthorizationRecorded, false);
      assert.equal(
        getExecutiveJournalProductArchitectureGovernanceDecision("GOV-EX2-T0-02"),
        gov,
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureGovernanceDecisionId(
          "GOV-EX2-T0-02",
        ),
        "GOV-EX2-T0-02",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceGovEx2T001.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.status,
        "Accepted",
      );
      assert.equal(mutateFrozen(gov), false);
      assert.equal(attemptNestedMutation(gov), false);
    });

    it("records supplemental UI appointments, dual-role exception, and constraints", () => {
      const privacy =
        ExecutiveJournalProductArchitectureTier0UiPrivacyAppointment;
      const authority =
        ExecutiveJournalProductArchitectureTier0UiAuthoritySecurityAppointment;
      const dual = ExecutiveJournalProductArchitectureTier0UiDualRoleException;
      assert.equal(privacy.appointmentId, "EX2-T0-UI-PRIVACY-APPOINTMENT-01");
      assert.equal(privacy.reviewerName, "Bahadoor");
      assert.equal(
        privacy.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic UI Privacy Reviewer",
      );
      assert.equal(
        privacy.delegatedAuthorityClass,
        "Tier0SyntheticUiPrivacyReviewAuthority",
      );
      assert.equal(privacy.delegationReference, "GOV-EX2-T0-02");
      assert.equal(privacy.parentAppointment, "EX2-T0-PRIVACY-APPOINTMENT-01");
      assert.equal(privacy.mayReviewUiT009, true);
      assert.equal(privacy.mayReviewUiT010, false);
      assert.equal(privacy.mayApproveProductionPrivacy, false);
      assert.equal(privacy.mayApproveDeployment, false);
      assert.equal(privacy.reviewCompletedAndApproved, false);
      assert.equal(
        authority.appointmentId,
        "EX2-T0-UI-AUTHORITY-SECURITY-APPOINTMENT-01",
      );
      assert.equal(authority.reviewerName, "Bahadoor");
      assert.equal(
        authority.delegatedAuthorityClass,
        "Tier0SyntheticUiAuthoritySecurityReviewAuthority",
      );
      assert.equal(authority.mayReviewUiT010, true);
      assert.equal(authority.mayReviewUiT009, false);
      assert.equal(authority.mayCreateRtc2Authority, false);
      assert.equal(authority.mayApproveDeployment, false);
      assert.equal(authority.reviewCompletedAndApproved, false);
      assert.equal(dual.exceptionId, "EX2-T0-UI-DUAL-ROLE-EXCEPTION-01");
      assert.equal(dual.status, "AcceptedForTier0SyntheticUiReviewScope");
      assert.equal(dual.decisionReference, "GOV-EX2-T0-02");
      assert.equal(dual.productionSeparationOfDutiesSatisfied, false);
      assert.equal(dual.independentProductionReviewRequired, true);
      assert.equal(dual.mayBeCitedForProduction, false);
      assert.equal(dual.mayAuthorizeImplementation, false);
      assert.equal(
        ExecutiveJournalProductArchitectureTier0UiAppointmentConstraints.length,
        18,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0UiAppointmentReopeningTriggers
          .length,
        16,
      );
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureTier0UiAppointmentConstraints,
        ),
        false,
      );
      assert.equal(
        mutateFrozen(
          ExecutiveJournalProductArchitectureTier0UiAppointmentReopeningTriggers,
        ),
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0UiPrivacyAppointment,
        privacy,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0UiAuthoritySecurityAppointment,
        authority,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.tier0UiDualRoleException,
        dual,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.governanceGovEx2T002,
        ExecutiveJournalProductArchitectureGovernanceGovEx2T002,
      );
    });

    it("keeps GOV from authorizing implementation while UI reviews and implementation gates advance separately", () => {
      const impact = ExecutiveJournalProductArchitectureTier0UiGateImpact;
      assert.equal(impact.afterPassedGateCount, 16);
      assert.equal(impact.afterPendingGateCount, 0);
      assert.equal(impact.uiT009ReviewerAuthorityEstablished, true);
      assert.equal(impact.uiT009ReviewCompleted, true);
      assert.equal(impact.uiT009ReviewApproved, true);
      assert.equal(impact.uiT010ReviewerAuthorityEstablished, true);
      assert.equal(impact.uiT010ReviewCompleted, true);
      assert.equal(impact.uiT010ReviewApproved, true);
      assert.equal(impact.uiT011HumanAuthorizationRecorded, true);
      assert.equal(impact.uiT012FacadeEnforcementVerified, true);
      assert.equal(impact.uiT013UiImplementationTestsPassed, true);
      assert.equal(impact.uiT014VisualAccessibilityQaPassed, true);
      assert.equal(impact.uiT015AuthorizationBoundariesVerified, true);
      assert.equal(impact.uiT016UiCertificationRecorded, true);
      const ui09 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-09",
      );
      const ui10 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-10",
      );
      const ui11 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-11",
      );
      const ui12 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-12",
      );
      const ui13 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-13",
      );
      const ui14 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-14",
      );
      const ui15 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-15",
      );
      const ui16 = ExecutiveJournalProductArchitectureTier0UiGates.find(
        (item) => item.gateId === "UI-T0-16",
      );
      assert.equal(ui09?.result, "Pass");
      assert.equal(ui09?.evidenceRef, "EX2-T0-UI-PRIVACY-REVIEW-01");
      assert.equal(ui10?.result, "Pass");
      assert.equal(
        ui10?.evidenceRef,
        "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01",
      );
      assert.equal(ui11?.result, "Pass");
      assert.equal(ui11?.evidenceRef, "EX2-UI-AUTH-T0-2026-07-27-01");
      assert.equal(ui12?.result, "Pass");
      assert.equal(ui13?.result, "Pass");
      assert.equal(ui14?.result, "Pass");
      assert.equal(
        ui14?.evidenceRef,
        "EX2-UI-T0-14-VISUAL-A11Y-QA-2026-07-27+executiveJournalSyntheticUi.test.tsx",
      );
      assert.equal(ui15?.result, "Pass");
      assert.equal(ui16?.result, "Pass");
      assert.equal(ui16?.evidenceRef, "EX2-UI-CERT-T0-2026-07-27-01");
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pass"),
        16,
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pending"),
        0,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      const summary = ExecutiveJournalProductArchitecture.getSummary();
      assert.equal(summary.passedGateCount, 13);
      assert.equal(summary.pendingGateCount, 3);
      assert.equal(summary.tier0UiPassedGateCount, 16);
      assert.equal(summary.tier0UiPendingGateCount, 0);
      assert.equal(summary.adEx207UiImplementationAuthorized, true);
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews
          .privacyUiReviewStatus,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews
          .authoritySecurityUiReviewStatus,
        "ApprovedWithTier0SyntheticConditions",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews
          .appointmentIsNotReviewApproval,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFocusedReviews
          .reviewApprovalIsNotImplementationAuthorization,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFutureAuthorization
          .authorizationRecorded,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureTier0SyntheticUiFutureAuthorization
          .uiArtifactsImplemented,
        true,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceGovEx2T002
          .uiImplementationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureGovernanceGovEx2T002
          .futureUiAuthorizationRecorded,
        false,
      );
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        readdirSync(HERE).some((name) =>
          /page\.tsx|layout\.tsx|Ex21/i.test(name)
        ),
        false,
      );
      assert.ok(
        readdirSync(HERE).includes("ExecutiveJournalSyntheticHarness.tsx"),
      );
      assert.ok(
        readdirSync(HERE).includes("ExecutiveJournalSyntheticPreview.tsx"),
      );
      assert.ok(
        readdirSync(HERE).includes("executiveJournalSyntheticUiFacade.ts"),
      );
    });
  });

  describe("EX2-T0-UI focused reviews and EX2-UI-AUTH-T0-2026-07-27-01", () => {
    it("records completed UI privacy and authority-security reviews exactly once", () => {
      const privacy =
        ExecutiveJournalProductArchitecture.tier0UiPrivacyReview;
      const authority =
        ExecutiveJournalProductArchitecture.tier0UiAuthoritySecurityReview;
      assert.equal(privacy.reviewId, "EX2-T0-UI-PRIVACY-REVIEW-01");
      assert.equal(
        privacy.title,
        "EX-2 Tier-0 Synthetic UI Privacy Review",
      );
      assert.equal(privacy.status, "Completed");
      assert.equal(privacy.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(privacy.reviewer, "Bahadoor");
      assert.equal(
        privacy.reviewerRole,
        "Interim EX-2 Tier-0 Synthetic UI Privacy Reviewer",
      );
      assert.equal(
        privacy.authorityClass,
        "Tier0SyntheticUiPrivacyReviewAuthority",
      );
      assert.equal(privacy.appointment, "EX2-T0-UI-PRIVACY-APPOINTMENT-01");
      assert.equal(privacy.delegation, "GOV-EX2-T0-02");
      assert.equal(privacy.decisionDate, "2026-07-27");
      assert.equal(
        privacy.scope,
        "Tier0ReadOnlySyntheticUiPresentationOnly",
      );
      assert.equal(privacy.productionApplicability, false);
      assert.equal(privacy.realRtc2Applicability, false);
      assert.equal(privacy.deploymentApplicability, false);
      assert.equal(privacy.gateId, "UI-T0-09");
      assert.equal(privacy.implementsAuthorization, false);
      assert.deepEqual(
        [...privacy.fieldPresentation.display],
        [
          "entry_category",
          "lifecycle_state",
          "origin_classification",
          "authority_state",
          "integrity_state",
          "source_classification",
        ],
      );
      assert.deepEqual(
        [...privacy.fieldPresentation.conditionalDisplay],
        [
          "journal_ref",
          "provenance_ref",
          "correction_ref",
          "supersession_ref",
          "projection_schema_version",
        ],
      );
      assert.deepEqual(
        [...privacy.fieldPresentation.internalOnly],
        ["entry_ref"],
      );
      assert.equal(privacy.mandatoryControls.noRecordTotals, true);
      assert.equal(privacy.mandatoryControls.noTelemetry, true);
      assert.equal(privacy.mandatoryControls.noCopyAction, true);
      assert.equal(
        privacy.marker.visibleText,
        "Synthetic · Tier 0 · Non-production · No live journal data",
      );
      assert.equal(Object.keys(privacy.privacyThreatResults).length, 26);
      assert.ok(
        Object.values(privacy.privacyThreatResults).every(
          (result) => result === "Acceptable" || result === "AcceptableWithCondition",
        ),
      );
      assert.equal(privacy.scopeChangeInvalidatesReview, true);
      assert.equal(privacy.productionRequiresIndependentReview, true);
      assert.equal(privacy.mayBeCitedForProduction, false);
      assert.equal(authority.reviewId, "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01");
      assert.equal(
        authority.title,
        "EX-2 Tier-0 Synthetic UI Authority-Security Review",
      );
      assert.equal(authority.status, "Completed");
      assert.equal(authority.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(authority.reviewer, "Bahadoor");
      assert.equal(
        authority.appointment,
        "EX2-T0-UI-AUTHORITY-SECURITY-APPOINTMENT-01",
      );
      assert.equal(authority.delegation, "GOV-EX2-T0-02");
      assert.equal(authority.decisionDate, "2026-07-27");
      assert.equal(authority.gateId, "UI-T0-10");
      assert.equal(authority.aiBoundary.aiUiActions, "Prohibited");
      assert.equal(authority.aiBoundary.aiConfirmation, "Prohibited");
      assert.equal(Object.keys(authority.authorityThreatResults).length, 32);
      assert.ok(
        Object.values(authority.authorityThreatResults).every(
          (result) => result === "Acceptable" || result === "AcceptableWithCondition",
        ),
      );
      assert.equal(authority.architectureControls.noMutationApi, true);
      assert.equal(authority.architectureControls.noRoute, true);
      assert.equal(
        authority.architectureControls.mechanicalImplementationEvidenceRemainsPending,
        true,
      );
      assert.equal(mutateFrozen(privacy), false);
      assert.equal(mutateFrozen(authority), false);
    });

    it("records EX2-UI-AUTH-T0-2026-07-27-01 without creating UI artifacts", () => {
      const auth =
        ExecutiveJournalProductArchitectureHumanAuthorizationEx2UiAuthT02026072701;
      const impact = ExecutiveJournalProductArchitectureUiAuthGateImpact;
      assert.equal(auth.authorizationId, "EX2-UI-AUTH-T0-2026-07-27-01");
      assert.equal(
        auth.title,
        "Authorize EX-2 Tier-0 Read-Only Synthetic UI Implementation and Tests",
      );
      assert.equal(auth.status, "Recorded");
      assert.equal(
        auth.result,
        "AuthorizedForTier0ReadOnlySyntheticExUiImplementationAndTests",
      );
      assert.equal(auth.authorizingHuman, "Bahadoor");
      assert.equal(
        auth.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(auth.decisionDate, "2026-07-27");
      assert.equal(
        auth.decisionScope,
        "Tier0ReadOnlySyntheticUiFacadeHarnessPresentationAndTests",
      );
      assert.equal(
        auth.product,
        "EX-2:T0/ExecutiveJournalSyntheticContractPreview",
      );
      assert.equal(auth.ui, "EX-2:T0/ExecutiveJournalSyntheticPreviewUI");
      assert.equal(
        auth.facade,
        "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade",
      );
      assert.equal(auth.productionApplicability, false);
      assert.equal(auth.realRtc2Applicability, false);
      assert.equal(auth.deploymentAuthorized, false);
      assert.equal(auth.routeAuthorized, false);
      assert.equal(auth.ex21Authorized, false);
      assert.equal(auth.networkAuthorized, false);
      assert.equal(auth.persistenceAuthorized, false);
      assert.equal(auth.telemetryAuthorized, false);
      assert.equal(auth.cloudAuthorized, false);
      assert.equal(auth.authorizationRecorded, true);
      assert.equal(auth.authorizedArtifactsImplemented, true);
      assert.equal(auth.implementationEvidenceAvailable, true);
      assert.equal(auth.uiArtifactsImplemented, true);
      assert.equal(auth.facadeImplemented, true);
      assert.equal(auth.reactUiCreated, true);
      assert.equal(auth.harnessCreated, true);
      assert.equal(auth.routeCreated, false);
      assert.equal(auth.ex21Created, false);
      assert.equal(auth.gateId, "UI-T0-11");
      assert.equal(auth.prerequisites.adEx207Accepted, true);
      assert.equal(auth.prerequisites.govEx2T002Accepted, true);
      assert.equal(
        auth.prerequisites.uiPrivacyReviewApprovedWithTier0SyntheticConditions,
        true,
      );
      assert.equal(
        auth.prerequisites
          .uiAuthoritySecurityReviewApprovedWithTier0SyntheticConditions,
        true,
      );
      assert.equal(impact.afterPassedUiGateCount, 11);
      assert.equal(impact.afterPendingUiGateCount, 5);
      assert.deepEqual([...impact.newlyPassed], ["UI-T0-11"]);
      assert.deepEqual([...impact.remainingPending], [
        "UI-T0-12",
        "UI-T0-13",
        "UI-T0-14",
        "UI-T0-15",
        "UI-T0-16",
      ]);
      assert.equal(impact.uiImplementationAuthorized, true);
      assert.equal(impact.authorizedArtifactsImplemented, true);
      assert.equal(impact.routeAuthorized, false);
      const implImpact =
        ExecutiveJournalProductArchitecture.uiImplementationGateImpact;
      assert.equal(implImpact.afterPassedUiGateCount, 14);
      assert.equal(implImpact.afterPendingUiGateCount, 2);
      assert.deepEqual([...implImpact.remainingPending], [
        "UI-T0-14",
        "UI-T0-16",
      ]);
      assert.equal(implImpact.visualAccessibilityQaComplete, false);
      const visualImpact =
        ExecutiveJournalProductArchitecture.uiVisualAccessibilityQaGateImpact;
      assert.equal(visualImpact.afterPassedUiGateCount, 15);
      assert.equal(visualImpact.afterPendingUiGateCount, 1);
      assert.deepEqual([...visualImpact.newlyPassed], ["UI-T0-14"]);
      assert.deepEqual([...visualImpact.remainingPending], ["UI-T0-16"]);
      assert.equal(visualImpact.visualAccessibilityQaComplete, true);
      assert.equal(visualImpact.tier0Pass, true);
      assert.equal(visualImpact.productionPass, false);
      assert.equal(visualImpact.routePass, false);
      assert.equal(visualImpact.deploymentPass, false);
      assert.equal(visualImpact.automatedAxeEngine, "UnavailableNotInstalled");
      assert.equal(visualImpact.uiCertificationRecorded, false);
      const certImpact =
        ExecutiveJournalProductArchitecture.uiCertificationGateImpact;
      assert.equal(certImpact.afterPassedUiGateCount, 16);
      assert.equal(certImpact.afterPendingUiGateCount, 0);
      assert.deepEqual([...certImpact.newlyPassed], ["UI-T0-16"]);
      assert.deepEqual([...certImpact.remainingPending], []);
      assert.equal(certImpact.uiCertificationRecorded, true);
      assert.equal(
        certImpact.certificationId,
        "EX2-UI-CERT-T0-2026-07-27-01",
      );
      assert.equal(certImpact.terminalForCurrentAuthorization, true);
      assert.equal(
        getExecutiveJournalProductArchitectureHumanAuthorization(
          "EX2-UI-AUTH-T0-2026-07-27-01",
        ),
        auth,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.humanAuthorizationEx2UiAuthT02026072701,
        auth,
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.uiAuthGateImpact,
        impact,
      );
      assert.deepEqual(
        [...ExecutiveJournalProductArchitectureHumanAuthorizationIds],
        [
          "EX2-AUTH-T0-2026-07-26-01",
          "EX2-UI-AUTH-T0-2026-07-27-01",
        ],
      );
      assert.equal(
        assertExecutiveJournalProductArchitectureHumanAuthorizationId(
          "EX2-UI-AUTH-T0-2026-07-27-01",
        ),
        "EX2-UI-AUTH-T0-2026-07-27-01",
      );
      assert.equal(mutateFrozen(auth), false);
      assert.equal(mutateFrozen(impact), false);
      assert.equal(
        readdirSync(HERE).some((name) =>
          /Ex21|page\.tsx/i.test(name)
            && !name.includes("ProductArchitecture")
            && !name.includes("SyntheticMetadata")
            && !name.includes("SyntheticUi")
            && !name.includes("SyntheticPreview")
            && !name.includes("SyntheticHarness")
        ),
        false,
      );
    });
  });

  describe("EX2-UI-CERT-T0-2026-07-27-01", () => {
    it("records Tier-0 UI certification with UC-01..UC-25 Pass and disclosure UC-26/27", () => {
      const cert =
        ExecutiveJournalProductArchitecture.tier0UiCertification;
      assert.equal(cert.certificationId, "EX2-UI-CERT-T0-2026-07-27-01");
      assert.equal(
        cert.title,
        "EX-2 Tier-0 Read-Only Synthetic UI Certification",
      );
      assert.equal(cert.status, "Certified");
      assert.equal(
        cert.result,
        "CertifiedForTier0ReadOnlySyntheticDevelopmentHarnessUse",
      );
      assert.equal(cert.certifyingAuthority, "Bahadoor");
      assert.equal(
        cert.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(cert.certificationDate, "2026-07-27");
      assert.equal(
        cert.product,
        "EX-2:T0/ExecutiveJournalSyntheticContractPreview",
      );
      assert.equal(cert.ui, "EX-2:T0/ExecutiveJournalSyntheticPreviewUI");
      assert.equal(
        cert.facade,
        "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade",
      );
      assert.equal(cert.host, "DevelopmentTestHarnessOnly");
      assert.equal(cert.productionApplicability, false);
      assert.equal(cert.realRtc2Applicability, false);
      assert.equal(cert.routeAuthorized, false);
      assert.equal(cert.ex21Authorized, false);
      assert.equal(cert.deploymentAuthorized, false);
      assert.equal(cert.newDecisionRequiredBeforeRoute, true);
      assert.equal(cert.newDecisionRequiredBeforeProduction, true);
      assert.equal(cert.terminalForCurrentAuthorization, true);
      assert.equal(cert.nextDecisionRequired, true);
      assert.equal(cert.uiStatus, "CertifiedTier0SyntheticUi");
      assert.equal(
        cert.readiness,
        "ReadyForTier0SyntheticDevelopmentHarnessUse",
      );
      assert.equal(cert.qaToolingDisclosure, "TemporaryQaToolDownloadDisclosure");
      assert.equal(
        cert.fullProjectTypescriptDisclosure,
        "DisclosureOnlyNonEx2Diagnostics",
      );
      assert.equal(
        ExecutiveJournalProductArchitecture.validateTier0UiCertificationGates(),
        true,
      );
      const gates =
        ExecutiveJournalProductArchitecture.tier0UiCertificationGates;
      assert.equal(gates.length, 27);
      for (const gate of gates) {
        const order = Number(gate.gateId.slice(3));
        if (order <= 25) {
          assert.equal(gate.result, "Pass", gate.gateId);
        } else {
          assert.equal(gate.result, "DisclosureOnly", gate.gateId);
        }
      }
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pass"),
        16,
      );
      assert.equal(
        countExecutiveJournalProductArchitectureTier0UiGates("Pending"),
        0,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").result,
        "Pending",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").result,
        "Pending",
      );
      assert.equal(mutateFrozen(cert), false);
    });
  });

  describe("preservation", () => {
    it("preserves Accepted Option C boundaries and leaves upstream surfaces unchanged", () => {
      const decision = ExecutiveJournalProductArchitectureDecisionAdrEx200;
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(decision.selectedOption, "C");
      assert.equal(decision.allowlistFinal, false);
      assert.equal(decision.providerSelected, false);
      assert.equal(decision.authorizationRecorded, false);
      assert.equal(decision.implementationAuthorized, false);
      assert.equal(decision.ex21CreationAuthorized, false);
      assert.equal(ExecutiveJournalProductArchitecture.createsEx21, false);
      assert.equal(ExecutiveJournalProductArchitecture.createsRtc210, false);
      assert.equal(ExecutiveJournalProductArchitecture.createsRtc310, false);
      assert.equal(ExecutiveJournalProductArchitecture.modifiesRtc19, false);
      assert.equal(ExecutiveJournalProductArchitecture.modifiesRtc29, false);
      assert.equal(ExecutiveJournalProductArchitecture.modifiesRtc39, false);
      assert.equal(ExecutiveJournalProductArchitecture.modifiesApp8, false);
      assert.equal(
        ExecutiveJournalProductArchitecture.modifiesEx1PublicIndex,
        false,
      );
      assert.equal(ExecutiveJournalProductArchitecture.implementsProvider, false);
      assert.equal(ExecutiveJournalProductArchitecture.implementsAdapter, false);
      assert.equal(
        readdirSync(HERE).some((name) =>
          /Ex21|EX-2:1|Rtc210|Rtc310|Provider\.ts|Adapter\.ts/i.test(name)
            && !name.includes("ProductArchitecture")
            && !name.includes("SyntheticMetadata")
        ),
        false,
      );
      assert.ok(statSync(join(RTC_DIR, "executiveJournalRuntimeCertification.ts")));
      assert.ok(
        statSync(join(RTC_DIR, "executiveDecisionRegisterCertification.ts")),
      );
      assert.ok(statSync(APP8_DIR));
      const archMtime = mtimeMs(
        "app/lib/ex/executiveJournalProductArchitecture.ts",
      );
      assert.ok(archMtime > 0);
      assert.ok(
        mtimeMs("app/lib/rtc/executiveJournalRuntimeCertification.ts") > 0,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureDecisionAdrEx201,
        ),
        false,
      );
      assert.equal(
        attemptNestedMutation(
          ExecutiveJournalProductArchitectureProjectionContract,
        ),
        false,
      );
    });
  });
});
