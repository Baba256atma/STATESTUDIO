/**
 * EX-2 Tier-0 Synthetic Metadata Contract Package — final verification & certification.
 * Previous suite size: 14 tests. Expanded for independent control traceability.
 */

import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  adaptExecutiveJournalSyntheticMetadata,
  assertExecutiveJournalSyntheticMetadataConsumerAlias,
  assertExecutiveJournalSyntheticMetadataConsumerId,
  assertExecutiveJournalSyntheticMetadataPackageId,
  createExecutiveJournalSyntheticLoadingView,
  createExecutiveJournalSyntheticMetadataProvider,
  createExecutiveJournalSyntheticReadyView,
  ExecutiveJournalSyntheticAllowlistFieldCoverage,
  ExecutiveJournalSyntheticAllowlistFields,
  ExecutiveJournalSyntheticAdapterRejectionCodes,
  ExecutiveJournalSyntheticAdapterResults,
  ExecutiveJournalSyntheticArchitectureDenylistMapping,
  ExecutiveJournalSyntheticAuthorityStates,
  ExecutiveJournalSyntheticCertificationGateIds,
  ExecutiveJournalSyntheticDeniedFields,
  ExecutiveJournalSyntheticDenylistFieldCoverage,
  ExecutiveJournalSyntheticEntryCategories,
  ExecutiveJournalSyntheticIntegrityStates,
  ExecutiveJournalSyntheticLifecycleStates,
  ExecutiveJournalSyntheticMetadata,
  ExecutiveJournalSyntheticMetadataCertification,
  ExecutiveJournalSyntheticMetadataCertificationGates,
  ExecutiveJournalSyntheticMetadataFixtures,
  ExecutiveJournalSyntheticMetadataFormerConsumerId,
  ExecutiveJournalSyntheticMetadataIdentity,
  ExecutiveJournalSyntheticMetadataPreCertificationReadiness,
  ExecutiveJournalSyntheticNonProductionMarkerValue,
  ExecutiveJournalSyntheticOriginClassifications,
  ExecutiveJournalSyntheticPackageLocalDeniedFields,
  ExecutiveJournalSyntheticProviderResults,
  ExecutiveJournalSyntheticRejectionCodeCoverage,
  ExecutiveJournalSyntheticSourceClassifications,
  ExecutiveJournalSyntheticViewStates,
  filterSyntheticProjectionsByCategory,
  filterSyntheticProjectionsByLifecycle,
  getExecutiveJournalSyntheticMetadataSummary,
  mapAdapterOutcomeToViewContract,
  mapProviderGetResultToViewContract,
  mapProviderListResultToViewContract,
  validateExecutiveJournalSyntheticMetadataCertificationGates,
} from "./executiveJournalSyntheticMetadata.ts";
import {
  DENYLIST_COVERAGE,
  getExecutiveJournalProductArchitectureGate,
  isExecutiveJournalProductEx21Blocked,
  ExecutiveJournalProductArchitecture,
  ExecutiveJournalProductArchitectureGovernanceGovEx2T001,
  ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601,
  ExecutiveJournalProductArchitectureTier0AuthorityReview,
  ExecutiveJournalProductArchitectureTier0PrivacyReview,
} from "./executiveJournalProductArchitecture.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_PRODUCTION_FILES = Object.freeze([
  "executiveJournalSyntheticMetadata.ts",
  "executiveJournalSyntheticMetadataTypes.ts",
  "executiveJournalSyntheticMetadataIdentity.ts",
  "executiveJournalSyntheticMetadataFixtures.ts",
  "executiveJournalSyntheticMetadataProvider.ts",
  "executiveJournalSyntheticMetadataAdapter.ts",
  "executiveJournalSyntheticMetadataViewContracts.ts",
] as const);

const mutateFrozen = (value: object): boolean => {
  try {
    // @ts-expect-error intentional mutation probe
    value.__mutation_probe__ = true;
    return true;
  } catch {
    return false;
  }
};

const cloneValid = (): Record<string, unknown> =>
  structuredClone(
    ExecutiveJournalSyntheticMetadataFixtures[0],
  ) as unknown as Record<string, unknown>;

const assertRejected = (
  input: unknown,
  code: string,
  field: string | null = null,
): void => {
  const result = adaptExecutiveJournalSyntheticMetadata(input);
  assert.equal(result.result, "Rejected");
  if (result.result === "Rejected") {
    assert.equal(result.code, code);
    if (field !== null) {
      assert.equal(result.field, field);
    }
    assert.equal("projection" in result, false);
  }
};

describe("EX-2 Tier-0 Synthetic Metadata Final Verification and Certification", () => {
  describe("package inventory", () => {
    it("contains exactly the eight authorized package files with no extras or TSX", () => {
      const synth = readdirSync(HERE).filter((name) =>
        name.startsWith("executiveJournalSyntheticMetadata")
      );
      assert.deepEqual(
        [...synth].sort(),
        [
          ...PACKAGE_PRODUCTION_FILES,
          "executiveJournalSyntheticMetadata.test.ts",
        ].sort(),
      );
      assert.equal(synth.some((name) => name.endsWith(".tsx")), false);
      assert.equal(
        readdirSync(HERE).some((name) => /Ex21|EX-2:1/i.test(name)),
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.boundaries.importsRtc2,
        false,
      );
      assert.equal(validateExecutiveJournalSyntheticMetadataCertificationGates(), true);
    });
  });

  describe("authority and scope", () => {
    it("references exact authorization, reviews, and governance without widening", () => {
      const auth =
        ExecutiveJournalProductArchitectureHumanAuthorizationEx2AuthT02026072601;
      const privacy = ExecutiveJournalProductArchitectureTier0PrivacyReview;
      const authority = ExecutiveJournalProductArchitectureTier0AuthorityReview;
      const gov = ExecutiveJournalProductArchitectureGovernanceGovEx2T001;
      assert.equal(auth.authorizationId, "EX2-AUTH-T0-2026-07-26-01");
      assert.equal(
        auth.result,
        "AuthorizedForTier0SyntheticExMetadataContractsAndTests",
      );
      assert.equal(privacy.reviewId, "EX2-T0-PRIVACY-REVIEW-01");
      assert.equal(privacy.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(authority.reviewId, "EX2-T0-AUTHORITY-REVIEW-01");
      assert.equal(authority.result, "ApprovedWithTier0SyntheticConditions");
      assert.equal(gov.decisionId, "GOV-EX2-T0-01");
      assert.equal(gov.status, "Accepted");
      assert.equal(
        ExecutiveJournalSyntheticMetadata.authorization,
        auth,
      );
      assert.equal(ExecutiveJournalSyntheticMetadata.privacyReview, privacy);
      assert.equal(ExecutiveJournalSyntheticMetadata.authorityReview, authority);
      assert.equal(auth.productionApplicability, false);
      assert.equal(auth.realRtc2Applicability, false);
      assert.equal(auth.deploymentAuthorized, false);
      const summary = getExecutiveJournalSyntheticMetadataSummary();
      assert.equal(summary.productionApplicability, false);
      assert.equal(summary.realRtc2Applicability, false);
      assert.equal(summary.deploymentAuthorized, false);
      assert.equal(summary.governanceDecisionId, "GOV-EX2-T0-01");
    });
  });

  describe("identity", () => {
    it("records exact package identities and pre/post certification readiness", () => {
      const identity = ExecutiveJournalSyntheticMetadataIdentity;
      assert.equal(
        identity.packageId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(
        identity.consumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(
        identity.consumerNamespace,
        "nexora.ex.executive.journal.synthetic.metadata.consumer",
      );
      assert.equal(
        identity.providerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataProvider",
      );
      assert.equal(
        identity.adapterId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataPrivacyAdapter",
      );
      assert.equal(
        identity.viewContractId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataViewContract",
      );
      assert.equal(
        identity.projectionSchemaVersion,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(identity.providerVersion, "ex2-tier0-synthetic-provider/v1");
      assert.equal(identity.sourceClassification, "SyntheticSourceOnly");
      assert.equal(identity.status, "SyntheticContractPackage");
      assert.equal(
        identity.preCertificationReadiness,
        "ReadyForTier0ContractVerification",
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadataPreCertificationReadiness,
        "ReadyForTier0ContractVerification",
      );
      assert.equal(
        identity.readiness,
        "ReadyForTier0UiAuthorizationAssessment",
      );
      assert.deepEqual(
        [...identity.consumerAliases],
        ["ExecutiveJournalSyntheticMetadataConsumer", "EX-2:T0"],
      );
      assert.equal(
        identity.formerConsumerIdNotCanonical,
        ExecutiveJournalSyntheticMetadataFormerConsumerId,
      );
      assert.equal(identity.formerConsumerIdApproved, false);
      assert.equal(identity.certificationId, "EX2-CERT-T0-2026-07-26-01");
    });

    it("rejects former, malformed, case, whitespace, and partial consumer identities", () => {
      for (const bad of [
        "EX2-SYNTHETIC-TIER0-CONSUMER-01",
        "EX-2",
        "ex-2:t0/executivejournalsyntheticmetadataconsumer",
        " EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer ",
        "ExecutiveJournalSyntheticMetadataConsumer",
        "nexora.ex.executive.journal.synthetic.metadata.consumer",
      ]) {
        assert.throws(() =>
          assertExecutiveJournalSyntheticMetadataConsumerId(bad)
        );
      }
      assert.throws(() =>
        assertExecutiveJournalSyntheticMetadataConsumerAlias(
          "EX2-SYNTHETIC-TIER0-CONSUMER-01",
        )
      );
      assert.throws(() =>
        assertExecutiveJournalSyntheticMetadataPackageId("wrong")
      );
      assert.equal(
        assertExecutiveJournalSyntheticMetadataPackageId(
          "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
        ),
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      for (const alias of [
        "ExecutiveJournalSyntheticMetadataConsumer",
        "EX-2:T0",
      ]) {
        assert.equal(
          assertExecutiveJournalSyntheticMetadataConsumerAlias(alias),
          alias,
        );
      }
    });
  });

  describe("allowlist traceability", () => {
    it("keeps allowlist coverage table complete, ordered, unique, and immutable", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields.length, 12);
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage.length, 12);
      assert.deepEqual(
        ExecutiveJournalSyntheticAllowlistFieldCoverage.map((item) => item.field),
        [...ExecutiveJournalSyntheticAllowlistFields],
      );
      assert.deepEqual(
        ExecutiveJournalSyntheticAllowlistFieldCoverage.map((item) => item.index),
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      );
      assert.equal(
        new Set(ExecutiveJournalSyntheticAllowlistFields).size,
        12,
      );
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticAllowlistFields), false);
      assert.equal(
        mutateFrozen(ExecutiveJournalSyntheticAllowlistFieldCoverage),
        false,
      );
      for (const denied of ExecutiveJournalSyntheticDeniedFields) {
        assert.equal(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            denied,
          ),
          false,
        );
      }
    });

    it("directly covers allowlist field journal_ref at index 0", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[0], "journal_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[0].field, "journal_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[0].index, 0);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("journal_ref" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["journal_ref_alias"] = drifted["journal_ref"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "journal_ref_alias");
    });

    it("directly covers allowlist field entry_ref at index 1", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[1], "entry_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[1].field, "entry_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[1].index, 1);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("entry_ref" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["entry_ref_alias"] = drifted["entry_ref"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "entry_ref_alias");
    });

    it("directly covers allowlist field entry_category at index 2", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[2], "entry_category");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[2].field, "entry_category");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[2].index, 2);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("entry_category" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["entry_category_alias"] = drifted["entry_category"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "entry_category_alias");
    });

    it("directly covers allowlist field lifecycle_state at index 3", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[3], "lifecycle_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[3].field, "lifecycle_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[3].index, 3);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("lifecycle_state" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["lifecycle_state_alias"] = drifted["lifecycle_state"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "lifecycle_state_alias");
    });

    it("directly covers allowlist field origin_classification at index 4", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[4], "origin_classification");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[4].field, "origin_classification");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[4].index, 4);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("origin_classification" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["origin_classification_alias"] = drifted["origin_classification"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "origin_classification_alias");
    });

    it("directly covers allowlist field authority_state at index 5", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[5], "authority_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[5].field, "authority_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[5].index, 5);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("authority_state" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["authority_state_alias"] = drifted["authority_state"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "authority_state_alias");
    });

    it("directly covers allowlist field provenance_ref at index 6", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[6], "provenance_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[6].field, "provenance_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[6].index, 6);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("provenance_ref" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["provenance_ref_alias"] = drifted["provenance_ref"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "provenance_ref_alias");
    });

    it("directly covers allowlist field correction_ref at index 7", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[7], "correction_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[7].field, "correction_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[7].index, 7);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("correction_ref" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["correction_ref_alias"] = drifted["correction_ref"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "correction_ref_alias");
    });

    it("directly covers allowlist field supersession_ref at index 8", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[8], "supersession_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[8].field, "supersession_ref");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[8].index, 8);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("supersession_ref" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["supersession_ref_alias"] = drifted["supersession_ref"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "supersession_ref_alias");
    });

    it("directly covers allowlist field projection_schema_version at index 9", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[9], "projection_schema_version");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[9].field, "projection_schema_version");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[9].index, 9);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("projection_schema_version" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["projection_schema_version_alias"] = drifted["projection_schema_version"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "projection_schema_version_alias");
    });

    it("directly covers allowlist field integrity_state at index 10", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[10], "integrity_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[10].field, "integrity_state");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[10].index, 10);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("integrity_state" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["integrity_state_alias"] = drifted["integrity_state"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "integrity_state_alias");
    });

    it("directly covers allowlist field source_classification at index 11", () => {
      assert.equal(ExecutiveJournalSyntheticAllowlistFields[11], "source_classification");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[11].field, "source_classification");
      assert.equal(ExecutiveJournalSyntheticAllowlistFieldCoverage[11].index, 11);
      const accepted = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(accepted.result, "Accepted");
      if (accepted.result === "Accepted") {
        assert.ok("source_classification" in accepted.projection);
        assert.deepEqual(
          Object.keys(accepted.projection),
          [...ExecutiveJournalSyntheticAllowlistFields],
        );
      }
      const drifted = cloneValid();
      drifted["source_classification_alias"] = drifted["source_classification"];
      assertRejected(drifted, "EX2-SYNTH-UNKNOWN-FIELD", "source_classification_alias");
    });

  });

  describe("denylist traceability", () => {
    it("keeps denylist coverage complete with architecture mapping and no allowlist overlap", () => {
      assert.equal(
        ExecutiveJournalSyntheticDenylistFieldCoverage.length,
        ExecutiveJournalSyntheticDeniedFields.length,
      );
      assert.deepEqual(
        ExecutiveJournalSyntheticDenylistFieldCoverage.map((item) => item.field),
        [...ExecutiveJournalSyntheticDeniedFields],
      );
      assert.equal(
        new Set(ExecutiveJournalSyntheticDeniedFields).size,
        ExecutiveJournalSyntheticDeniedFields.length,
      );
      for (const mapped of ExecutiveJournalSyntheticArchitectureDenylistMapping) {
        assert.ok(
          (DENYLIST_COVERAGE as readonly string[]).includes(
            mapped.architectureItemId,
          ),
        );
        assert.ok(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            mapped.packageField,
          ),
        );
      }
      assert.equal(
        ExecutiveJournalSyntheticArchitectureDenylistMapping.length,
        DENYLIST_COVERAGE.length,
      );
      for (const archId of DENYLIST_COVERAGE) {
        assert.ok(
          ExecutiveJournalSyntheticArchitectureDenylistMapping.some(
            (item) => item.architectureItemId === archId,
          ),
          `missing architecture mapping for ${archId}`,
        );
      }
      for (const field of ExecutiveJournalSyntheticPackageLocalDeniedFields) {
        assert.ok(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            field,
          ),
        );
      }
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticDeniedFields), false);
    });

    it("directly rejects denied field body without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-body";
      input["body"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "body");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field payload without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-payload";
      input["payload"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "payload");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field narrative without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-narrative";
      input["narrative"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "narrative");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field rationale without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-rationale";
      input["rationale"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "rationale");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection";
      input["private_reflection"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_exists without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_exists";
      input["private_reflection_exists"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_exists");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_count without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_count";
      input["private_reflection_count"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_count");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_timestamp without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_timestamp";
      input["private_reflection_timestamp"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_timestamp");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_category without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_category";
      input["private_reflection_category"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_category");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field evidence without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-evidence";
      input["evidence"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "evidence");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field evidence_content without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-evidence_content";
      input["evidence_content"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "evidence_content");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field evidence_present without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-evidence_present";
      input["evidence_present"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "evidence_present");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field evidence_uri without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-evidence_uri";
      input["evidence_uri"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "evidence_uri");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field authority_evidence without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-authority_evidence";
      input["authority_evidence"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "authority_evidence");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field actor without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-actor";
      input["actor"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "actor");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field actor_ref without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-actor_ref";
      input["actor_ref"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "actor_ref");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field actor_name without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-actor_name";
      input["actor_name"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "actor_name");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field email without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-email";
      input["email"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "email");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field jurisdiction without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-jurisdiction";
      input["jurisdiction"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "jurisdiction");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field location without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-location";
      input["location"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "location");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field retention without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-retention";
      input["retention"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "retention");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field disclosure without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-disclosure";
      input["disclosure"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "disclosure");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field export without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-export";
      input["export"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "export");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field command without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-command";
      input["command"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "command");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field mutation without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-mutation";
      input["mutation"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "mutation");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field timestamp without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-timestamp";
      input["timestamp"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "timestamp");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field date_bucket without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-date_bucket";
      input["date_bucket"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "date_bucket");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field canonical_sequence_position without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-canonical_sequence_position";
      input["canonical_sequence_position"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "canonical_sequence_position");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field sparse_sequence_position without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-sparse_sequence_position";
      input["sparse_sequence_position"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "sparse_sequence_position");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field raw_source_offset without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-raw_source_offset";
      input["raw_source_offset"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "raw_source_offset");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field record_count without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-record_count";
      input["record_count"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "record_count");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field projected_entry_count without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-projected_entry_count";
      input["projected_entry_count"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "projected_entry_count");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_filter_count without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_filter_count";
      input["private_filter_count"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_filter_count");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field telemetry_payload without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-telemetry_payload";
      input["telemetry_payload"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "telemetry_payload");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field secret without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-secret";
      input["secret"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "secret");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field credential without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-credential";
      input["credential"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "credential");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field token without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-token";
      input["token"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "token");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field url without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-url";
      input["url"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "url");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field infrastructure_id without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-infrastructure_id";
      input["infrastructure_id"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "infrastructure_id");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field production_id without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-production_id";
      input["production_id"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "production_id");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field journal_body without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-journal_body";
      input["journal_body"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "journal_body");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_content without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_content";
      input["private_reflection_content"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_content");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_identity without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_identity";
      input["private_reflection_identity"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_identity");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field private_reflection_existence without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-private_reflection_existence";
      input["private_reflection_existence"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "private_reflection_existence");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field resolvable_evidence_uri without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-resolvable_evidence_uri";
      input["resolvable_evidence_uri"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "resolvable_evidence_uri");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field actor_pii without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-actor_pii";
      input["actor_pii"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "actor_pii");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field jurisdiction_location without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-jurisdiction_location";
      input["jurisdiction_location"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "jurisdiction_location");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field retention_instructions without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-retention_instructions";
      input["retention_instructions"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "retention_instructions");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field disclosure_export_details without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-disclosure_export_details";
      input["disclosure_export_details"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "disclosure_export_details");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field operational_commands without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-operational_commands";
      input["operational_commands"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "operational_commands");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field mutation_apis without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-mutation_apis";
      input["mutation_apis"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "mutation_apis");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field shareable_entry_category without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-shareable_entry_category";
      input["shareable_entry_category"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "shareable_entry_category");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

    it("directly rejects denied field projection_version without payload echo", () => {
      const input = cloneValid();
      const probe = "denied-value-projection_version";
      input["projection_version"] = probe;
      const snapshot = JSON.stringify(input);
      const result = adaptExecutiveJournalSyntheticMetadata(input);
      assert.equal(JSON.stringify(input), snapshot);
      assert.equal(result.result, "Rejected");
      if (result.result === "Rejected") {
        assert.equal(result.code, "EX2-SYNTH-DENIED-FIELD");
        assert.equal(result.field, "projection_version");
        assert.equal("projection" in result, false);
        assert.equal(JSON.stringify(result).includes(probe), false);
      }
    });

  });

  describe("unknown-field enforcement", () => {

    it("rejects unknown field class harmless_scalar", () => {
      const input = cloneValid();
      input['harmless_scalar'] = "ok";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'harmless_scalar');
    });

    it("rejects unknown field class nested_object_field", () => {
      const input = cloneValid();
      input['nested_object_field'] = { nested: true };
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'nested_object_field');
    });

    it("rejects unknown field class array_field", () => {
      const input = cloneValid();
      input['array_field'] = ["a"];
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'array_field');
    });

    it("rejects unknown field class prototype_like_key", () => {
      const input = cloneValid();
      input["__proto__like"] = "x";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", "__proto__like");
    });

    it("rejects unknown field class constructor", () => {
      const input = cloneValid();
      input['constructor'] = "x";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'constructor');
    });

    it("rejects unknown field class future_schema_field_v2", () => {
      const input = cloneValid();
      input['future_schema_field_v2'] = "x";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'future_schema_field_v2');
    });

    it("rejects unknown field class Entry_Ref", () => {
      const input = cloneValid();
      input['Entry_Ref'] = "syn-entry-001";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'Entry_Ref');
    });

    it("rejects unknown field class  entry_ref", () => {
      const input = cloneValid();
      input[' entry_ref'] = "syn-entry-001";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", ' entry_ref');
    });

    it("rejects unknown field class legacy_journal_id", () => {
      const input = cloneValid();
      input['legacy_journal_id'] = "syn-journal-001";
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", 'legacy_journal_id');
    });

    it("applies denied-field precedence before unknown-field", () => {
      const input = cloneValid();
      input.body = "x";
      input.extra_unknown = "y";
      assertRejected(input, "EX2-SYNTH-DENIED-FIELD", "body");
    });

    it("applies missing-field after shape/allowlist checks", () => {
      const input = cloneValid();
      delete input.source_classification;
      assertRejected(input, "EX2-SYNTH-MISSING-FIELD", "source_classification");
    });
  });

  describe("rejection-code traceability", () => {
    it("keeps rejection-code coverage complete and immutable", () => {
      assert.equal(ExecutiveJournalSyntheticAdapterRejectionCodes.length, 13);
      assert.equal(ExecutiveJournalSyntheticRejectionCodeCoverage.length, 13);
      assert.deepEqual(
        ExecutiveJournalSyntheticRejectionCodeCoverage.map((item) => item.code),
        [...ExecutiveJournalSyntheticAdapterRejectionCodes],
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalSyntheticAdapterRejectionCodes),
        false,
      );
    });

    it("triggers EX2-SYNTH-NOT-OBJECT", () => {
      assertRejected(null, "EX2-SYNTH-NOT-OBJECT");
      assertRejected("x", "EX2-SYNTH-NOT-OBJECT");
      assertRejected([], "EX2-SYNTH-NOT-OBJECT");
    });

    it("triggers EX2-SYNTH-DENIED-FIELD", () => {
      const input = cloneValid();
      input.body = "x";
      assertRejected(input, "EX2-SYNTH-DENIED-FIELD", "body");
    });

    it("triggers EX2-SYNTH-UNKNOWN-FIELD", () => {
      const input = cloneValid();
      input.extra = 1;
      assertRejected(input, "EX2-SYNTH-UNKNOWN-FIELD", "extra");
    });

    it("triggers EX2-SYNTH-MISSING-FIELD", () => {
      const input = cloneValid();
      delete input.integrity_state;
      assertRejected(input, "EX2-SYNTH-MISSING-FIELD", "integrity_state");
    });

    it("triggers EX2-SYNTH-SOURCE-CLASSIFICATION", () => {
      const input = cloneValid();
      input.source_classification = "ProductionSource";
      assertRejected(input, "EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
      input.source_classification = "LiveSource";
      assertRejected(input, "EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
      input.source_classification = "syntheticsourceonly";
      assertRejected(input, "EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
      input.source_classification = " SyntheticSourceOnly";
      assertRejected(input, "EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
    });

    it("triggers EX2-SYNTH-SCHEMA-VERSION", () => {
      const input = cloneValid();
      input.projection_schema_version = "v9";
      assertRejected(input, "EX2-SYNTH-SCHEMA-VERSION", "projection_schema_version");
    });

    it("triggers EX2-SYNTH-REFERENCE", () => {
      const input = cloneValid();
      input.entry_ref = "https://example.com/e";
      assertRejected(input, "EX2-SYNTH-REFERENCE", "entry_ref");
      const pathInput = cloneValid();
      pathInput.journal_ref = "/var/journal";
      assertRejected(pathInput, "EX2-SYNTH-REFERENCE", "journal_ref");
      const emailInput = cloneValid();
      emailInput.entry_ref = "a@b.com";
      assertRejected(emailInput, "EX2-SYNTH-REFERENCE", "entry_ref");
    });

    it("triggers EX2-SYNTH-ENTRY-CATEGORY", () => {
      const input = cloneValid();
      input.entry_category = "Secret";
      assertRejected(input, "EX2-SYNTH-ENTRY-CATEGORY", "entry_category");
    });

    it("triggers EX2-SYNTH-LIFECYCLE", () => {
      const input = cloneValid();
      input.lifecycle_state = "Running";
      assertRejected(input, "EX2-SYNTH-LIFECYCLE", "lifecycle_state");
    });

    it("triggers EX2-SYNTH-ORIGIN", () => {
      const input = cloneValid();
      input.origin_classification = "External";
      assertRejected(input, "EX2-SYNTH-ORIGIN", "origin_classification");
    });

    it("triggers EX2-SYNTH-AUTHORITY", () => {
      const input = cloneValid();
      input.authority_state = "Delegated";
      assertRejected(input, "EX2-SYNTH-AUTHORITY", "authority_state");
    });

    it("triggers EX2-SYNTH-INTEGRITY", () => {
      const input = cloneValid();
      input.integrity_state = "Partial";
      assertRejected(input, "EX2-SYNTH-INTEGRITY", "integrity_state");
    });

    it("triggers EX2-SYNTH-OPTIONAL-REFERENCE", () => {
      const input = cloneValid();
      input.correction_ref = "syn-entry-001";
      assertRejected(input, "EX2-SYNTH-OPTIONAL-REFERENCE", "correction_ref");
      const badProv = cloneValid();
      badProv.provenance_ref = "syn-entry-001";
      assertRejected(badProv, "EX2-SYNTH-OPTIONAL-REFERENCE", "provenance_ref");
    });
  });

  describe("closed vocabulary verification", () => {

    it("closes entry categories with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticEntryCategories.length, 6);
      assert.deepEqual([...ExecutiveJournalSyntheticEntryCategories], ['Commitment', 'Risk', 'Exception', 'Outcome', 'Control', 'General']);
      assert.equal(new Set(ExecutiveJournalSyntheticEntryCategories).size, 6);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticEntryCategories), false);
      const input = cloneValid();
      input["entry_category"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-ENTRY-CATEGORY", "entry_category");
    });

    it("closes lifecycle states with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticLifecycleStates.length, 6);
      assert.deepEqual([...ExecutiveJournalSyntheticLifecycleStates], ['Proposed', 'Accepted', 'Disputed', 'Superseded', 'Closed', 'Disposed']);
      assert.equal(new Set(ExecutiveJournalSyntheticLifecycleStates).size, 6);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticLifecycleStates), false);
      const input = cloneValid();
      input["lifecycle_state"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-LIFECYCLE", "lifecycle_state");
    });

    it("closes origin classifications with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticOriginClassifications.length, 3);
      assert.deepEqual([...ExecutiveJournalSyntheticOriginClassifications], ['HumanOrigin', 'AiProposed', 'SystemDerived']);
      assert.equal(new Set(ExecutiveJournalSyntheticOriginClassifications).size, 3);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticOriginClassifications), false);
      const input = cloneValid();
      input["origin_classification"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-ORIGIN", "origin_classification");
    });

    it("closes authority states with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticAuthorityStates.length, 3);
      assert.deepEqual([...ExecutiveJournalSyntheticAuthorityStates], ['Present', 'Absent', 'Unavailable']);
      assert.equal(new Set(ExecutiveJournalSyntheticAuthorityStates).size, 3);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticAuthorityStates), false);
      const input = cloneValid();
      input["authority_state"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-AUTHORITY", "authority_state");
    });

    it("closes integrity states with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticIntegrityStates.length, 3);
      assert.deepEqual([...ExecutiveJournalSyntheticIntegrityStates], ['Verified', 'Failed', 'Unavailable']);
      assert.equal(new Set(ExecutiveJournalSyntheticIntegrityStates).size, 3);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticIntegrityStates), false);
      const input = cloneValid();
      input["integrity_state"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-INTEGRITY", "integrity_state");
    });

    it("closes source classifications with exact order and fail-closed unknowns", () => {
      assert.equal(ExecutiveJournalSyntheticSourceClassifications.length, 1);
      assert.deepEqual([...ExecutiveJournalSyntheticSourceClassifications], ['SyntheticSourceOnly']);
      assert.equal(new Set(ExecutiveJournalSyntheticSourceClassifications).size, 1);
      assert.equal(mutateFrozen(ExecutiveJournalSyntheticSourceClassifications), false);
      const input = cloneValid();
      input["source_classification"] = "NotAClosedValue";
      assertRejected(input, "EX2-SYNTH-SOURCE-CLASSIFICATION", "source_classification");
    });

    it("closes provider, adapter, and view catalogues without RTC-2 authority claim", () => {
      assert.deepEqual([...ExecutiveJournalSyntheticProviderResults], [
        "Available",
        "Empty",
        "Denied",
        "Unavailable",
        "Stale",
        "Invalid",
      ]);
      assert.deepEqual([...ExecutiveJournalSyntheticAdapterResults], [
        "Accepted",
        "Rejected",
      ]);
      assert.equal(ExecutiveJournalSyntheticViewStates.length, 9);
      assert.equal(
        ExecutiveJournalSyntheticMetadata.boundaries.importsRtc2,
        false,
      );
      assert.equal(
        getExecutiveJournalSyntheticMetadataSummary().realRtc2Applicability,
        false,
      );
    });
  });

  describe("fixture certification", () => {

    it("certifies canonical fixture syn-entry-001", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[0];
      assert.equal(fixture.entry_ref, "syn-entry-001");
      assert.equal(fixture.lifecycle_state, "Accepted");
      assert.equal(fixture.entry_category, "Commitment");
      assert.equal(fixture.correction_ref, null);
      assert.equal(fixture.supersession_ref, null);
      assert.equal(fixture.authority_state, "Present");
      assert.equal(fixture.integrity_state, "Verified");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("certifies canonical fixture syn-entry-002", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[1];
      assert.equal(fixture.entry_ref, "syn-entry-002");
      assert.equal(fixture.lifecycle_state, "Proposed");
      assert.equal(fixture.entry_category, "Risk");
      assert.equal(fixture.correction_ref, null);
      assert.equal(fixture.supersession_ref, null);
      assert.equal(fixture.authority_state, "Absent");
      assert.equal(fixture.integrity_state, "Unavailable");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("certifies canonical fixture syn-entry-003", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[2];
      assert.equal(fixture.entry_ref, "syn-entry-003");
      assert.equal(fixture.lifecycle_state, "Accepted");
      assert.equal(fixture.entry_category, "Exception");
      assert.equal(fixture.correction_ref, "syn-correction-001");
      assert.equal(fixture.supersession_ref, null);
      assert.equal(fixture.authority_state, "Present");
      assert.equal(fixture.integrity_state, "Verified");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("certifies canonical fixture syn-entry-004", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[3];
      assert.equal(fixture.entry_ref, "syn-entry-004");
      assert.equal(fixture.lifecycle_state, "Superseded");
      assert.equal(fixture.entry_category, "Outcome");
      assert.equal(fixture.correction_ref, null);
      assert.equal(fixture.supersession_ref, "syn-supersession-001");
      assert.equal(fixture.authority_state, "Unavailable");
      assert.equal(fixture.integrity_state, "Failed");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("certifies canonical fixture syn-entry-005", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[4];
      assert.equal(fixture.entry_ref, "syn-entry-005");
      assert.equal(fixture.lifecycle_state, "Closed");
      assert.equal(fixture.entry_category, "Control");
      assert.equal(fixture.correction_ref, null);
      assert.equal(fixture.supersession_ref, null);
      assert.equal(fixture.authority_state, "Present");
      assert.equal(fixture.integrity_state, "Verified");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("certifies canonical fixture syn-entry-006", () => {
      const fixture = ExecutiveJournalSyntheticMetadataFixtures[5];
      assert.equal(fixture.entry_ref, "syn-entry-006");
      assert.equal(fixture.lifecycle_state, "Disposed");
      assert.equal(fixture.entry_category, "General");
      assert.equal(fixture.correction_ref, null);
      assert.equal(fixture.supersession_ref, null);
      assert.equal(fixture.authority_state, "Absent");
      assert.equal(fixture.integrity_state, "Unavailable");
      assert.equal(fixture.source_classification, "SyntheticSourceOnly");
      assert.equal(
        fixture.projection_schema_version,
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(mutateFrozen(fixture), false);
      const accepted = adaptExecutiveJournalSyntheticMetadata(
        structuredClone(fixture) as unknown as Record<string, unknown>,
      );
      assert.equal(accepted.result, "Accepted");
      for (const key of Object.keys(fixture)) {
        assert.ok(
          (ExecutiveJournalSyntheticAllowlistFields as readonly string[]).includes(
            key,
          ),
        );
        assert.equal(
          (ExecutiveJournalSyntheticDeniedFields as readonly string[]).includes(
            key,
          ),
          false,
        );
      }
      const serialized = JSON.stringify(fixture);
      assert.equal(/https?:\/\//i.test(serialized), false);
      assert.equal(/@[A-Za-z0-9.-]+/.test(serialized), false);
      assert.equal(serialized.includes("timestamp"), false);
      assert.equal(serialized.includes("sequence"), false);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("evidence"), false);
    });

    it("keeps fixture catalogue deterministic and mutation-safe across provider calls", () => {
      assert.equal(ExecutiveJournalSyntheticMetadataFixtures.length, 6);
      const provider = createExecutiveJournalSyntheticMetadataProvider("Normal");
      const a = provider.listSyntheticJournalMetadata();
      const b = provider.listSyntheticJournalMetadata();
      assert.equal(a.result, "Available");
      assert.equal(b.result, "Available");
      if (a.result === "Available" && b.result === "Available") {
        assert.deepEqual(
          a.projections.map((item) => item.entry_ref),
          b.projections.map((item) => item.entry_ref),
        );
        assert.equal(mutateFrozen(a.projections[0]), false);
      }
      assert.equal(
        ExecutiveJournalSyntheticMetadataFixtures[0].entry_ref,
        "syn-entry-001",
      );
    });
  });

  describe("provider-result traceability", () => {

    it("directly covers provider result Available", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Normal").listSyntheticJournalMetadata();
      assert.equal(result.result, "Available");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("directly covers provider result Empty", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Empty").listSyntheticJournalMetadata();
      assert.equal(result.result, "Empty");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("directly covers provider result Denied", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Denied").listSyntheticJournalMetadata();
      assert.equal(result.result, "Denied");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("directly covers provider result Unavailable", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Unavailable").listSyntheticJournalMetadata();
      assert.equal(result.result, "Unavailable");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("directly covers provider result Stale", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Stale").listSyntheticJournalMetadata();
      assert.equal(result.result, "Stale");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("directly covers provider result Invalid", () => {
      const result = createExecutiveJournalSyntheticMetadataProvider("Normal").getSyntheticJournalMetadataByRef("https://x");
      assert.equal(result.result, "Invalid");
      assert.ok(
        (ExecutiveJournalSyntheticProviderResults as readonly string[]).includes(
          result.result,
        ),
      );
    });

    it("covers get available, unknown, malformed, and denied references without throws", () => {
      const provider = createExecutiveJournalSyntheticMetadataProvider("Normal");
      assert.equal(
        provider.getSyntheticJournalMetadataByRef("syn-entry-001").result,
        "Available",
      );
      assert.equal(
        provider.getSyntheticJournalMetadataByRef("syn-entry-999").result,
        "Denied",
      );
      assert.equal(
        provider.getSyntheticJournalMetadataByRef("syn-journal-001").result,
        "Denied",
      );
      assert.equal(
        provider.getSyntheticJournalMetadataByRef("").result,
        "Invalid",
      );
      assert.equal(
        provider.getSyntheticProviderVersion(),
        "ex2-tier0-synthetic-provider/v1",
      );
      assert.equal(
        provider.getSyntheticProjectionSchemaVersion(),
        "ex2-tier0-synthetic-projection/v1",
      );
      assert.equal(
        provider.getSyntheticSourceClassification(),
        "SyntheticSourceOnly",
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.providerContract.networked,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.providerContract.persistent,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.providerContract.emitsTelemetry,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.providerContract.mutationOperations,
        false,
      );
    });
  });

  describe("adapter certification", () => {
    it("accepts all six fixtures with exact twelve-field immutable output", () => {
      for (const fixture of ExecutiveJournalSyntheticMetadataFixtures) {
        const accepted = adaptExecutiveJournalSyntheticMetadata(
          structuredClone(fixture),
        );
        assert.equal(accepted.result, "Accepted");
        if (accepted.result === "Accepted") {
          assert.deepEqual(
            Object.keys(accepted.projection),
            [...ExecutiveJournalSyntheticAllowlistFields],
          );
          assert.equal(mutateFrozen(accepted.projection), false);
          assert.equal(
            accepted.projection.source_classification,
            "SyntheticSourceOnly",
          );
        }
      }
      assert.equal(
        ExecutiveJournalSyntheticMetadata.adapterContract.silentFieldStripping,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.adapterContract.silentRepair,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.adapterContract.createsAuthority,
        false,
      );
    });

    it("handles null optional references and rejects invalid optional refs", () => {
      const valid = cloneValid();
      valid.correction_ref = null;
      valid.supersession_ref = null;
      assert.equal(
        adaptExecutiveJournalSyntheticMetadata(valid).result,
        "Accepted",
      );
      const bad = cloneValid();
      bad.supersession_ref = "syn-correction-001";
      assertRejected(bad, "EX2-SYNTH-OPTIONAL-REFERENCE", "supersession_ref");
    });
  });

  describe("view-state traceability", () => {

    it("directly covers view state Loading", () => {
      const view = createExecutiveJournalSyntheticLoadingView();
      assert.equal(view.state, "Loading");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state Ready", () => {
      const view = createExecutiveJournalSyntheticReadyView([ExecutiveJournalSyntheticMetadataFixtures[0]]);
      assert.equal(view.state, "Ready");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state Empty", () => {
      const view = mapProviderListResultToViewContract(createExecutiveJournalSyntheticMetadataProvider("Empty").listSyntheticJournalMetadata());
      assert.equal(view.state, "Empty");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state NotFound", () => {
      const view = mapProviderGetResultToViewContract(createExecutiveJournalSyntheticMetadataProvider("Normal").getSyntheticJournalMetadataByRef("syn-entry-999"));
      assert.equal(view.state, "NotFound");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state PrivacyRejected", () => {
      const view = mapAdapterOutcomeToViewContract(adaptExecutiveJournalSyntheticMetadata({ ...cloneValid(), body: "x" }));
      assert.equal(view.state, "PrivacyRejected");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state UnsupportedVersion", () => {
      const view = mapProviderListResultToViewContract(createExecutiveJournalSyntheticMetadataProvider("Stale").listSyntheticJournalMetadata());
      assert.equal(view.state, "UnsupportedVersion");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state IntegrityUnavailable", () => {
      const view = mapAdapterOutcomeToViewContract(adaptExecutiveJournalSyntheticMetadata(ExecutiveJournalSyntheticMetadataFixtures[1]));
      assert.equal(view.state, "IntegrityUnavailable");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state ProviderUnavailable", () => {
      const view = mapProviderListResultToViewContract(createExecutiveJournalSyntheticMetadataProvider("Unavailable").listSyntheticJournalMetadata());
      assert.equal(view.state, "ProviderUnavailable");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("directly covers view state Failure", () => {
      const view = mapProviderGetResultToViewContract(createExecutiveJournalSyntheticMetadataProvider("Normal").getSyntheticJournalMetadataByRef("https://x"));
      assert.equal(view.state, "Failure");
      assert.deepEqual(view.marker, ExecutiveJournalSyntheticNonProductionMarkerValue);
      assert.equal(mutateFrozen(view), false);
      assert.equal("actions" in view, false);
      assert.equal("mutate" in view, false);
      assert.equal(view.marker.environment, "NonProduction");
      assert.equal(view.marker.classification, "Synthetic");
      assert.equal(JSON.stringify(view).includes("LiveData"), false);
      assert.equal(JSON.stringify(view).includes("ProductionSource"), false);
    });

    it("requires Ready marker fields and keeps view catalogue complete", () => {
      assert.equal(ExecutiveJournalSyntheticViewStates.length, 9);
      assert.deepEqual([...ExecutiveJournalSyntheticViewStates], [
        "Loading",
        "Ready",
        "Empty",
        "NotFound",
        "PrivacyRejected",
        "UnsupportedVersion",
        "IntegrityUnavailable",
        "ProviderUnavailable",
        "Failure",
      ]);
      const ready = createExecutiveJournalSyntheticReadyView([
        ExecutiveJournalSyntheticMetadataFixtures[0],
      ]);
      assert.equal(ready.state, "Ready");
      if (ready.state === "Ready") {
        assert.equal(ready.marker.classification, "Synthetic");
        assert.equal(ready.marker.tier, "Tier0");
        assert.equal(ready.marker.environment, "NonProduction");
        assert.equal(
          ready.marker.label,
          "Synthetic / Tier 0 / Non-production",
        );
      }
      assert.equal(
        filterSyntheticProjectionsByCategory(
          ExecutiveJournalSyntheticMetadataFixtures,
          "Risk",
        ).length,
        1,
      );
      assert.equal(
        filterSyntheticProjectionsByLifecycle(
          ExecutiveJournalSyntheticMetadataFixtures,
          "Accepted",
        ).length,
        2,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.viewContractSurface.reactComponents,
        false,
      );
    });
  });

  describe("immutability", () => {
    it("blocks mutation of catalogues, fixtures, aggregate, summary, and certification", () => {
      const targets: object[] = [
        ExecutiveJournalSyntheticAllowlistFields,
        ExecutiveJournalSyntheticDeniedFields,
        ExecutiveJournalSyntheticAdapterRejectionCodes,
        ExecutiveJournalSyntheticEntryCategories,
        ExecutiveJournalSyntheticMetadataFixtures,
        ExecutiveJournalSyntheticMetadataFixtures[0],
        ExecutiveJournalSyntheticMetadata,
        getExecutiveJournalSyntheticMetadataSummary(),
        ExecutiveJournalSyntheticMetadataCertification,
        ExecutiveJournalSyntheticMetadataCertificationGates,
        ExecutiveJournalSyntheticAllowlistFieldCoverage,
        ExecutiveJournalSyntheticDenylistFieldCoverage,
        ExecutiveJournalSyntheticRejectionCodeCoverage,
      ];
      for (const target of targets) {
        assert.equal(mutateFrozen(target), false);
      }
      const poisoned = cloneValid();
      poisoned.body = "poison";
      adaptExecutiveJournalSyntheticMetadata(poisoned);
      const clean = adaptExecutiveJournalSyntheticMetadata(cloneValid());
      assert.equal(clean.result, "Accepted");
    });
  });

  describe("dependency and side-effect boundaries", () => {
    it("contains no prohibited imports or APIs in package production sources", () => {
      const prohibited = [
        /from\s+["']react["']/,
        /from\s+["']next\//,
        /from\s+["'].*\/rtc\//,
        /from\s+["'].*app8/,
        /from\s+["'].*decisionJournal/,
        /\bfetch\s*\(/,
        /\bWebSocket\b/,
        /\bEventSource\b/,
        /\bDate\.now\s*\(/,
        /\bnew\s+Date\s*\(/,
        /\bMath\.random\s*\(/,
        /\brandomUUID\b/,
        /\blocalStorage\b/,
        /\bindexedDB\b/,
        /\bcreateClient\b/,
        /\bpostgres\b/,
        /\baws-sdk\b/,
        /\b@azure\//,
        /process\.env/,
        /setTimeout|setInterval/,
      ];
      for (const file of PACKAGE_PRODUCTION_FILES) {
        const source = readFileSync(join(HERE, file), "utf8");
        for (const pattern of prohibited) {
          assert.equal(pattern.test(source), false, `${file} matched ${pattern}`);
        }
      }
      const arch = readFileSync(
        join(HERE, "executiveJournalProductArchitecture.ts"),
        "utf8",
      );
      assert.equal(
        arch.includes("executiveJournalSyntheticMetadata"),
        false,
      );
    });
  });

  describe("authorization boundary and G-EX2-08", () => {
    it("preserves authorization boundary and Tier-0 G-EX2-08 Pass without production pass", () => {
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-08").result,
        "Pass",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-08").evidenceRef,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-08")
          .tier0SyntheticPassOnly,
        true,
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-14").result,
        "Pass",
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
      assert.equal(summary.failedGateCount, 0);
      assert.equal(
        ExecutiveJournalSyntheticMetadataCertification.gEx208Tier0Pass,
        true,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadataCertification.gEx208ProductionPass,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadataCertification.gEx208RealRtc2Pass,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.boundaries.createsEx21,
        false,
      );
      assert.equal(
        ExecutiveJournalSyntheticMetadata.boundaries.createsReactUi,
        false,
      );
    });
  });

  describe("certification record and gates", () => {
    it("records EX2-CERT-T0-2026-07-26-01 with exact certified meaning", () => {
      const cert = ExecutiveJournalSyntheticMetadataCertification;
      assert.equal(cert.certificationId, "EX2-CERT-T0-2026-07-26-01");
      assert.equal(
        cert.title,
        "EX-2 Tier-0 Synthetic Metadata Contract Package Certification",
      );
      assert.equal(cert.status, "Certified");
      assert.equal(
        cert.result,
        "CertifiedForTier0SyntheticMetadataContractUse",
      );
      assert.equal(cert.certifyingAuthority, "Bahadoor");
      assert.equal(
        cert.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(cert.certificationDate, "2026-07-26");
      assert.equal(
        cert.packageId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
      );
      assert.equal(
        cert.consumerId,
        "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
      );
      assert.equal(cert.productionApplicability, false);
      assert.equal(cert.realRtc2Applicability, false);
      assert.equal(cert.uiImplementationAuthorized, false);
      assert.equal(cert.deploymentAuthorized, false);
      assert.equal(cert.nextArchitectureDecisionRequiredBeforeUi, true);
      assert.equal(
        cert.preCertificationReadiness,
        "ReadyForTier0ContractVerification",
      );
      assert.equal(
        cert.readiness,
        "ReadyForTier0UiAuthorizationAssessment",
      );
      assert.equal(cert.createsAdEx207, false);
      assert.equal(validateExecutiveJournalSyntheticMetadataCertificationGates(), true);
      const summary = getExecutiveJournalSyntheticMetadataSummary();
      assert.equal(summary.certificationId, "EX2-CERT-T0-2026-07-26-01");
      assert.equal(
        summary.readiness,
        "ReadyForTier0UiAuthorizationAssessment",
      );
    });

    it("evaluates certification gate C-01 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-01",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-01",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-02 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-02",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-02",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-03 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-03",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-03",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-04 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-04",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-04",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-05 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-05",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-05",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-06 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-06",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-06",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-07 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-07",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-07",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-08 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-08",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-08",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-09 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-09",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-09",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-10 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-10",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-10",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-11 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-11",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-11",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-12 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-12",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-12",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-13 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-13",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-13",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-14 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-14",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-14",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-15 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-15",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-15",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-16 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-16",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-16",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-17 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-17",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-17",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-18 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-18",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-18",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-19 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-19",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-19",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-20 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-20",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-20",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-21 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-21",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-21",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-22 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-22",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-22",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-23 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-23",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-23",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-24 as Pass", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-24",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-24",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "Pass");
      assert.equal(mutateFrozen(gate!), false);
    });

    it("evaluates certification gate C-25 as DisclosureOnly", () => {
      assert.ok(
        (ExecutiveJournalSyntheticCertificationGateIds as readonly string[]).includes(
          "C-25",
        ),
      );
      const gate = ExecutiveJournalSyntheticMetadataCertificationGates.find(
        (item) => item.gateId === "C-25",
      );
      assert.ok(gate);
      assert.equal(gate!.result, "DisclosureOnly");
      assert.equal(mutateFrozen(gate!), false);
    });

  });
});
