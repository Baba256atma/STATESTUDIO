/**
 * EX-2:5 — Executive Journal Experience Manifest verification.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceManifest,
  ExecutiveJournalExperienceManifestApprovedAliases,
  ExecutiveJournalExperienceManifestAuthorization,
  ExecutiveJournalExperienceManifestBoundaries,
  ExecutiveJournalExperienceManifestCanonicalEligibility,
  ExecutiveJournalExperienceManifestCanonicalInput,
  ExecutiveJournalExperienceManifestCapabilities,
  ExecutiveJournalExperienceManifestCapabilityDefinitions,
  ExecutiveJournalExperienceManifestCapabilitySupportValues,
  ExecutiveJournalExperienceManifestCompatibilityValues,
  ExecutiveJournalExperienceManifestContracts,
  ExecutiveJournalExperienceManifestDecisions,
  ExecutiveJournalExperienceManifestDependencyDeclaration,
  ExecutiveJournalExperienceManifestEligibilityValues,
  ExecutiveJournalExperienceManifestEntries,
  ExecutiveJournalExperienceManifestEntryKinds,
  ExecutiveJournalExperienceManifestId,
  ExecutiveJournalExperienceManifestIdentity,
  ExecutiveJournalExperienceManifestLifecycle,
  ExecutiveJournalExperienceManifestLifecycleStates,
  ExecutiveJournalExperienceManifestNamespace,
  ExecutiveJournalExperienceManifestNonCapabilities,
  ExecutiveJournalExperienceManifestNonCapabilityDefinitions,
  ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions,
  ExecutiveJournalExperienceManifestPlatformPrerequisites,
  ExecutiveJournalExperienceManifestReadiness,
  ExecutiveJournalExperienceManifestReasonCodes,
  ExecutiveJournalExperienceManifestRequirementStatusValues,
  ExecutiveJournalExperienceManifestStatus,
  ExecutiveJournalExperienceManifestSummaryValue,
  ExecutiveJournalExperienceManifestUpstream,
  assertExecutiveJournalExperienceManifestEntryKind,
  assertExecutiveJournalExperienceManifestIdentity,
  assertExecutiveJournalExperienceManifestLifecycleTransition,
  assertExecutiveJournalExperienceManifestReasonCode,
  canTransitionExecutiveJournalExperienceManifestLifecycle,
  evaluateExecutiveJournalExperienceManifestEligibility,
  getExecutiveJournalExperienceManifestSummary,
  isExecutiveJournalExperienceManifestCapabilitySupport,
  isExecutiveJournalExperienceManifestCompatibility,
  isExecutiveJournalExperienceManifestEligibility,
  isExecutiveJournalExperienceManifestEntryKind,
  isExecutiveJournalExperienceManifestLifecycleState,
  isExecutiveJournalExperienceManifestReasonCode,
  isExecutiveJournalExperienceManifestRequirementStatus,
  resolveExecutiveJournalExperienceManifestIdentity,
} from "./executiveJournalExperienceManifest.ts";
import { ExecutiveJournalExperienceValidation } from "./executiveJournalExperienceValidation.ts";
import {
  ExecutiveJournalProductArchitectureDecisionAdrEx213,
  ExecutiveJournalProductArchitectureDecisions,
} from "./executiveJournalProductArchitecture.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const MANIFEST_FILES = Object.freeze([
  "executiveJournalExperienceManifest.ts",
  "executiveJournalExperienceManifestTypes.ts",
  "executiveJournalExperienceManifestIdentity.ts",
  "executiveJournalExperienceManifestLifecycle.ts",
  "executiveJournalExperienceManifestContracts.ts",
  "executiveJournalExperienceManifestEntries.ts",
  "executiveJournalExperienceManifestMetadata.ts",
  "executiveJournalExperienceManifest.test.ts",
] as const);

const PRODUCTION_FILES = MANIFEST_FILES.filter(
  (file) => !file.endsWith(".test.ts"),
);

const CAPABILITY_COVERAGE = Object.freeze([
  "Metadata-only journal experience composition",
  "Journal projection presentation metadata",
  "Entry-list metadata",
  "Entry-summary metadata",
  "Entry-detail metadata",
  "Category presentation",
  "Lifecycle presentation",
  "Origin presentation",
  "Authority-state presentation",
  "Integrity-state presentation",
  "Provenance references",
  "Correction and supersession references",
  "Filter-model metadata",
  "Tier-0 evidence references",
  "Deterministic summaries",
  "Fail-closed consumer-boundary metadata",
] as const);

const NON_CAPABILITY_COVERAGE = Object.freeze([
  "Journal body or narrative",
  "Rationale",
  "Private reflection or its existence signals",
  "Evidence content or resolvable evidence URI",
  "Authority evidence",
  "Actor PII",
  "Jurisdiction/location",
  "Retention or disclosure instructions",
  "Commands and mutations",
  "Real RTC-2 payload consumption",
  "Production provider access",
  "React UI or routes",
  "Navigation",
  "Network",
  "Persistence or browser storage",
  "Telemetry or analytics",
  "Clock or randomness",
  "Cloud or deployment",
  "EX-2:6 Platform implementation",
] as const);

const PREREQUISITE_COVERAGE = Object.freeze([
  "Exact EX-2:5 Manifest identity",
  "Exact EX-2:4 Valid evidence",
  "Canonical dependency chain intact",
  "All manifest entries sealed",
  "No prohibited capability declared",
  "Open issues carried forward",
  "Production gates disclosed as Pending",
  "Separate EX-2:6 architecture authorization",
  "No inference that Tier-0 evidence authorizes production",
] as const);

const isDeeplyFrozen = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null) return true;
  if (!Object.isFrozen(value)) return false;
  return Object.values(value).every(isDeeplyFrozen);
};

const attemptMutation = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null) return false;
  try {
    Object.assign(value, { unauthorizedMutation: true });
    return true;
  } catch {
    return false;
  }
};

const inputWith = (
  overrides: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> => ({
  ...ExecutiveJournalExperienceManifestCanonicalInput,
  ...overrides,
});

const reasonCodesFor = (
  overrides: Readonly<Record<string, unknown>>,
): readonly string[] =>
  evaluateExecutiveJournalExperienceManifestEligibility(
    inputWith(overrides),
  ).reasons.map((reason) => reason.code);

describe("EX-2:5 Executive Journal Experience Manifest", () => {
  describe("package inventory and dependency boundary", () => {
    it("contains exactly the eight authorized Manifest files", () => {
      const present = readdirSync(HERE).filter((name) =>
        /^executiveJournalExperienceManifest/.test(name)
      );
      assert.deepEqual(present.sort(), [...MANIFEST_FILES].sort());
      assert.equal(present.length, 8);
    });

    it("imports only EX-2:4 Validation as its upstream runtime dependency", () => {
      let validationImportCount = 0;
      for (const file of PRODUCTION_FILES) {
        const source = readFileSync(join(HERE, file), "utf8");
        const imports = [
          ...source.matchAll(
            /import\s+(?!type\b)[\s\S]*?\sfrom\s+"([^"]+)";/g,
          ),
        ].map((match) => match[1]);
        for (const dependency of imports) {
          if (dependency.includes("executiveJournalExperienceValidation")) {
            validationImportCount += 1;
          }
          assert.doesNotMatch(
            dependency,
            /executiveJournalExperience(?:Model|Registry|Foundation)|executiveJournalProductArchitecture/,
          );
          assert.doesNotMatch(
            dependency,
            /(?:\/rtc\/|APP-8|PublicIndex|react|next\/|route|navigation|provider|adapter|fixture|ExecutiveJournalSynthetic|executiveJournalSynthetic)/i,
          );
        }
        assert.doesNotMatch(source, /\bimport\s*\(|\brequire\s*\(/);
      }
      assert.equal(validationImportCount, 1);
      assert.equal(
        ExecutiveJournalExperienceManifestDependencyDeclaration
          .runtimeDependency,
        "EX-2:4/ExecutiveJournalExperienceValidation",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestDependencyDeclaration
          .earlierPhasesReachedThroughValidationOnly,
        true,
      );
    });

    it("does not create Platform or later packages from Manifest", () => {
      assert.equal(ExecutiveJournalExperienceManifest.ex26Created, false);
      assert.equal(ExecutiveJournalExperienceManifest.ex26Authorized, false);
    });
  });

  describe("identity and authorization", () => {
    it("publishes the exact canonical identity and readiness", () => {
      assert.equal(
        ExecutiveJournalExperienceManifestId,
        "EX-2:5/ExecutiveJournalExperienceManifest",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestNamespace,
        "nexora.ex.executive.journal.experience.manifest",
      );
      assert.equal(ExecutiveJournalExperienceManifestStatus, "Manifest");
      assert.equal(
        ExecutiveJournalExperienceManifestReadiness,
        "ReadyForPlatform",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestIdentity.previousPhase,
        "EX-2:4 — Executive Journal Experience Validation",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestIdentity.nextPhase,
        "EX-2:6 — Executive Journal Experience Platform",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestIdentity.authorizationDecisionId,
        "AD-EX2-13",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestIdentity
          .readyForPlatformAuthorizesEx26,
        false,
      );
    });

    it("resolves only the canonical identity, namespace, and approved aliases", () => {
      assert.deepEqual([...ExecutiveJournalExperienceManifestApprovedAliases], [
        "ExecutiveJournalExperienceManifest",
        "EX-2:5",
      ]);
      for (const value of [
        ExecutiveJournalExperienceManifestId,
        ExecutiveJournalExperienceManifestNamespace,
        ...ExecutiveJournalExperienceManifestApprovedAliases,
      ]) {
        assert.equal(
          resolveExecutiveJournalExperienceManifestIdentity(value).ok,
          true,
        );
        assert.equal(
          assertExecutiveJournalExperienceManifestIdentity(value),
          ExecutiveJournalExperienceManifestId,
        );
      }
    });

    it("fails closed for malformed and unapproved identity variants", () => {
      for (const value of [
        undefined,
        null,
        "",
        "EX-2:5 ",
        " EX-2:5",
        "ex-2:5",
        "EX-2",
        "EX-2:4",
        "EX-2:6",
        "RTC-2:5",
        "nexora.ex.executive.journal.experience.manifest.lookalike",
        "ExecutiveJournalExperienceManifest ",
        "Executive Journal Experience Manifest",
      ]) {
        assert.equal(
          resolveExecutiveJournalExperienceManifestIdentity(value).ok,
          false,
        );
        assert.throws(() =>
          assertExecutiveJournalExperienceManifestIdentity(value)
        );
      }
    });

    it("preserves exact Accepted AD-EX2-13 implementation authority", () => {
      const decision =
        ExecutiveJournalProductArchitectureDecisionAdrEx213;
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionDate, "2026-07-30");
      assert.equal(
        decision.selectedOption,
        "MetadataOnlyValidatedExperienceCapabilityManifest",
      );
      assert.equal(
        decision.decisionScope,
        "Ex25ManifestImplementationAndVerificationOnly",
      );
      assert.equal(decision.ex25ImplementationAuthorized, true);
      assert.equal(decision.ex26Authorized, false);
      assert.equal(
        ExecutiveJournalProductArchitectureDecisions.filter(
          (entry) => entry.decisionId === "AD-EX2-13",
        ).length,
        1,
      );
      assert.equal(
        ExecutiveJournalExperienceManifestAuthorization
          .authorizationDecisionId,
        "AD-EX2-13",
      );
    });
  });

  describe("closed vocabularies", () => {
    const VOCABULARY_COVERAGE = Object.freeze([
      Object.freeze({
        name: "eligibility",
        values: ExecutiveJournalExperienceManifestEligibilityValues,
        guard: isExecutiveJournalExperienceManifestEligibility,
      }),
      Object.freeze({
        name: "capability support",
        values:
          ExecutiveJournalExperienceManifestCapabilitySupportValues,
        guard: isExecutiveJournalExperienceManifestCapabilitySupport,
      }),
      Object.freeze({
        name: "compatibility",
        values: ExecutiveJournalExperienceManifestCompatibilityValues,
        guard: isExecutiveJournalExperienceManifestCompatibility,
      }),
      Object.freeze({
        name: "requirement status",
        values:
          ExecutiveJournalExperienceManifestRequirementStatusValues,
        guard: isExecutiveJournalExperienceManifestRequirementStatus,
      }),
      Object.freeze({
        name: "entry kind",
        values: ExecutiveJournalExperienceManifestEntryKinds,
        guard: isExecutiveJournalExperienceManifestEntryKind,
      }),
      Object.freeze({
        name: "reason code",
        values: ExecutiveJournalExperienceManifestReasonCodes,
        guard: isExecutiveJournalExperienceManifestReasonCode,
      }),
      Object.freeze({
        name: "lifecycle",
        values: ExecutiveJournalExperienceManifestLifecycleStates,
        guard: isExecutiveJournalExperienceManifestLifecycleState,
      }),
    ] as const);

    for (const catalogue of VOCABULARY_COVERAGE) {
      it(`closes ${catalogue.name} with exact order and fail-closed guards`, () => {
        assert.equal(Object.isFrozen(catalogue.values), true);
        assert.equal(
          new Set(catalogue.values).size,
          catalogue.values.length,
        );
        for (const value of catalogue.values) {
          assert.equal(catalogue.guard(value), true);
          assert.equal(catalogue.guard(value.toLowerCase()), false);
          assert.equal(catalogue.guard(`${value} `), false);
          assert.equal(catalogue.guard(` ${value}`), false);
          assert.equal(catalogue.guard(value.slice(0, -1)), false);
        }
        assert.equal(catalogue.guard("Unknown"), false);
        assert.equal(catalogue.guard(""), false);
      });
    }

    it("rejects every value presented to a different vocabulary", () => {
      for (const source of VOCABULARY_COVERAGE) {
        for (const value of source.values) {
          for (const target of VOCABULARY_COVERAGE) {
            if (target === source) continue;
            const isExplicitlySharedValue = target.values.some(
              (candidate) => candidate === value,
            );
            assert.equal(
              target.guard(value),
              isExplicitlySharedValue,
            );
          }
        }
      }
    });

    it("keeps the exact decision-authorized catalogue values", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceManifestEligibilityValues],
        ["Eligible", "Ineligible"],
      );
      assert.deepEqual(
        [...ExecutiveJournalExperienceManifestCapabilitySupportValues],
        ["Declared", "NotDeclared", "Prohibited"],
      );
      assert.deepEqual(
        [...ExecutiveJournalExperienceManifestCompatibilityValues],
        ["Compatible", "Incompatible", "NotEvaluated"],
      );
      assert.deepEqual(
        [...ExecutiveJournalExperienceManifestRequirementStatusValues],
        ["Satisfied", "Unsatisfied", "Pending"],
      );
      assert.equal(ExecutiveJournalExperienceManifestEntryKinds.length, 11);
      assert.equal(ExecutiveJournalExperienceManifestReasonCodes.length, 12);
      assert.equal(
        assertExecutiveJournalExperienceManifestEntryKind("Capability"),
        "Capability",
      );
      assert.equal(
        assertExecutiveJournalExperienceManifestReasonCode(
          "ValidationEvidenceMissing",
        ),
        "ValidationEvidenceMissing",
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceManifestEntryKind("capability")
      );
      assert.throws(() =>
        assertExecutiveJournalExperienceManifestReasonCode(
          "UnknownReason",
        )
      );
    });
  });

  describe("capability catalogue completeness", () => {
    it("contains exactly 16 stable entries in canonical order", () => {
      assert.equal(ExecutiveJournalExperienceManifestCapabilities.length, 16);
      assert.deepEqual(
        ExecutiveJournalExperienceManifestCapabilities.map(
          (entry) => entry.capabilityId,
        ),
        Array.from(
          { length: 16 },
          (_, index) => `EX25-CAP-${String(index + 1).padStart(2, "0")}`,
        ),
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestCapabilities.map(
          (entry) => entry.capability,
        ),
        CAPABILITY_COVERAGE,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestCapabilityDefinitions.map(
          (entry) => entry.capability,
        ),
        CAPABILITY_COVERAGE,
      );
    });

    for (const [index, capability] of CAPABILITY_COVERAGE.entries()) {
      it(`directly covers capability EX25-CAP-${String(index + 1).padStart(2, "0")} ${capability}`, () => {
        const entry = ExecutiveJournalExperienceManifestCapabilities[index];
        assert.equal(entry.order, index + 1);
        assert.equal(entry.capability, capability);
        assert.equal(entry.entryKind, "Capability");
        assert.equal(entry.support, "Declared");
        assert.notEqual(entry.supportingReference, null);
        assert.equal(entry.metadataOnly, true);
        assert.equal(entry.runtimeBehavior, false);
        assert.equal(entry.createsAuthority, false);
        assert.equal(entry.productionApplicable, false);
        assert.equal(isDeeplyFrozen(entry), true);
      });
    }

    it("binds every capability to the exact validated reference", () => {
      const model = ExecutiveJournalExperienceValidation.model;
      const expected = [
        model.getEntity("ExecutiveJournalExperience"),
        model.getEntity("JournalProjection"),
        model.getEntity("JournalEntryList"),
        model.getEntity("JournalEntrySummary"),
        model.getEntity("JournalEntryDetail"),
        model.getEntity("EntryCategoryPresentation"),
        model.getEntity("LifecyclePresentation"),
        model.getEntity("OriginPresentation"),
        model.getEntity("AuthorityPresentation"),
        model.getEntity("IntegrityPresentation"),
        model.getEntity("ProvenancePresentation"),
        model.getEntity("CorrectionSupersessionPresentation"),
        model.getEntity("JournalFilterModel"),
        model.getEntity("Tier0EvidenceReference"),
        ExecutiveJournalExperienceValidation.getSummary(),
        ExecutiveJournalExperienceValidation.boundaries,
      ];
      for (const [index, reference] of expected.entries()) {
        assert.equal(
          ExecutiveJournalExperienceManifestCapabilities[index]
            .supportingReference,
          reference,
        );
      }
    });
  });

  describe("non-capability catalogue completeness", () => {
    it("contains exactly 19 explicit prohibited entries", () => {
      assert.equal(
        ExecutiveJournalExperienceManifestNonCapabilities.length,
        19,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestNonCapabilityDefinitions,
        NON_CAPABILITY_COVERAGE,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestNonCapabilities.map(
          (entry) => entry.nonCapabilityId,
        ),
        Array.from(
          { length: 19 },
          (_, index) => `EX25-NONCAP-${String(index + 1).padStart(2, "0")}`,
        ),
      );
    });

    for (const [index, nonCapability] of NON_CAPABILITY_COVERAGE.entries()) {
      it(`directly covers non-capability EX25-NONCAP-${String(index + 1).padStart(2, "0")} ${nonCapability}`, () => {
        const entry =
          ExecutiveJournalExperienceManifestNonCapabilities[index];
        assert.equal(entry.order, index + 1);
        assert.equal(entry.nonCapability, nonCapability);
        assert.equal(entry.entryKind, "NonCapability");
        assert.equal(entry.support, "Prohibited");
        assert.equal(
          entry.supportingReference,
          ExecutiveJournalExperienceValidation.boundaries,
        );
        assert.equal(entry.metadataOnly, true);
        assert.equal(entry.runtimeBehavior, false);
        assert.equal(entry.createsAuthority, false);
        assert.equal(entry.productionApplicable, false);
        assert.equal(isDeeplyFrozen(entry), true);
      });
    }
  });

  describe("platform prerequisite completeness", () => {
    it("contains exactly nine decision-authorized declarations", () => {
      assert.equal(
        ExecutiveJournalExperienceManifestPlatformPrerequisites.length,
        9,
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestPlatformPrerequisiteDefinitions
          .map((entry) => entry.prerequisite),
        PREREQUISITE_COVERAGE,
      );
    });

    for (const [index, prerequisite] of PREREQUISITE_COVERAGE.entries()) {
      it(`directly covers prerequisite EX25-PREREQ-${String(index + 1).padStart(2, "0")} ${prerequisite}`, () => {
        const entry =
          ExecutiveJournalExperienceManifestPlatformPrerequisites[index];
        assert.equal(entry.order, index + 1);
        assert.equal(entry.prerequisite, prerequisite);
        assert.equal(entry.entryKind, "PlatformPrerequisite");
        assert.equal(
          isExecutiveJournalExperienceManifestRequirementStatus(
            entry.status,
          ),
          true,
        );
        assert.notEqual(entry.supportingReference, null);
        assert.equal(entry.productionApplicable, false);
        assert.equal(entry.authorizesPlatformImplementation, false);
        assert.equal(entry.metadataOnly, true);
        assert.equal(isDeeplyFrozen(entry), true);
      });
    }

    it("keeps production gates and separate EX-2:6 authorization Pending", () => {
      assert.equal(
        ExecutiveJournalExperienceManifestPlatformPrerequisites[6].status,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestPlatformPrerequisites[7].status,
        "Pending",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestPlatformPrerequisites[7]
          .authorizesPlatformImplementation,
        false,
      );
    });
  });

  describe("validated-input eligibility", () => {
    it("makes only the exact canonical Valid binding Eligible", () => {
      const result =
        evaluateExecutiveJournalExperienceManifestEligibility(
          ExecutiveJournalExperienceManifestCanonicalInput,
        );
      assert.equal(result.eligibility, "Eligible");
      assert.equal(result.eligible, true);
      assert.equal(result.reasonCount, 0);
      assert.deepEqual(result.reasons, []);
      assert.equal(
        ExecutiveJournalExperienceValidation.canonicalResult.result,
        "Valid",
      );
      assert.equal(result.productionAuthorized, false);
      assert.equal(result.platformAuthorized, false);
      assert.equal(result.ex26Authorized, false);
    });

    const reasonCases = [
      {
        code: "ValidationEvidenceMissing",
        overrides: { validationResult: undefined },
      },
      {
        code: "ValidationEvidenceInvalid",
        overrides: { validationResult: Object.freeze({ result: "Invalid" }) },
      },
      {
        code: "ValidationEvidenceMalformed",
        overrides: { validationResult: "Valid" },
      },
      {
        code: "ValidationEvidenceCloned",
        overrides: {
          validationResult: {
            ...ExecutiveJournalExperienceValidation.canonicalResult,
          },
        },
      },
      {
        code: "ValidationEvidenceStale",
        overrides: { evidenceCurrent: false },
      },
      {
        code: "ValidationEvidenceMismatched",
        overrides: { validationIdentity: "EX-2:4/Mismatch" },
      },
      {
        code: "ValidationEvidenceUnknown",
        overrides: { evidenceKnown: false },
      },
      {
        code: "UnsupportedCapability",
        overrides: { unsupportedCapabilityDeclared: true },
      },
      {
        code: "ProhibitedCapability",
        overrides: { prohibitedDeclarationConflict: true },
      },
      {
        code: "DependencyBoundaryViolation",
        overrides: { dependencyBoundaryIntact: false },
      },
      {
        code: "ManifestEntryUnsealed",
        overrides: { entriesSealed: false },
      },
      {
        code: "PlatformAuthorizationMissing",
        overrides: { separatePlatformAuthorizationRequired: false },
      },
    ] as const;

    for (const reasonCase of reasonCases) {
      it(`directly returns ${reasonCase.code}`, () => {
        const result =
          evaluateExecutiveJournalExperienceManifestEligibility(
            inputWith(reasonCase.overrides),
          );
        assert.equal(result.eligibility, "Ineligible");
        assert.equal(result.eligible, false);
        assert.deepEqual(
          result.reasons.map((reason) => reason.code),
          [reasonCase.code],
        );
        assert.equal(result.reasons[0].safeStructuralDetailOnly, true);
        assert.equal(result.reasons[0].echoesInput, false);
        assert.equal(isDeeplyFrozen(result), true);
      });
    }

    it("rejects mismatched Model, aggregate, and Validation references", () => {
      assert.deepEqual(reasonCodesFor({ validatedModel: {} }), [
        "ValidationEvidenceMismatched",
      ]);
      assert.deepEqual(
        reasonCodesFor({ validationAggregateDescriptor: {} }),
        ["ValidationEvidenceMismatched"],
      );
      assert.deepEqual(reasonCodesFor({ validation: {} }), [
        "ValidationEvidenceMismatched",
      ]);
    });

    it("distinguishes cloned aggregate, descriptor, and result references", () => {
      assert.deepEqual(
        reasonCodesFor({
          validation: {
            ...ExecutiveJournalExperienceValidation,
          },
        }),
        ["ValidationEvidenceCloned"],
      );
      assert.deepEqual(
        reasonCodesFor({
          validationAggregateDescriptor: {
            ...ExecutiveJournalExperienceValidation.aggregateDescriptor,
          },
        }),
        ["ValidationEvidenceCloned"],
      );
      assert.deepEqual(
        reasonCodesFor({
          validationResult: {
            ...ExecutiveJournalExperienceValidation.canonicalResult,
          },
        }),
        ["ValidationEvidenceCloned"],
      );
    });

    it("rejects incomplete catalogues without inventing catalogue entries", () => {
      assert.deepEqual(
        reasonCodesFor({
          capabilities:
            ExecutiveJournalExperienceManifestCapabilities.slice(0, -1),
        }),
        ["UnsupportedCapability"],
      );
      assert.deepEqual(
        reasonCodesFor({
          nonCapabilities:
            ExecutiveJournalExperienceManifestNonCapabilities.slice(0, -1),
        }),
        ["ProhibitedCapability"],
      );
      assert.deepEqual(
        reasonCodesFor({
          platformPrerequisites:
            ExecutiveJournalExperienceManifestPlatformPrerequisites.slice(
              0,
              -1,
            ),
        }),
        ["ManifestEntryUnsealed"],
      );
    });

    it("rejects reordered catalogues and altered supporting references", () => {
      assert.deepEqual(
        reasonCodesFor({
          capabilities: Object.freeze([
            ExecutiveJournalExperienceManifestCapabilities[1],
            ExecutiveJournalExperienceManifestCapabilities[0],
            ...ExecutiveJournalExperienceManifestCapabilities.slice(2),
          ]),
        }),
        ["UnsupportedCapability"],
      );
      assert.deepEqual(
        reasonCodesFor({
          capabilities: Object.freeze(
            ExecutiveJournalExperienceManifestCapabilities.map(
              (entry, index) =>
                index === 0
                  ? Object.freeze({ ...entry, supportingReference: {} })
                  : entry,
            ),
          ),
        }),
        ["UnsupportedCapability"],
      );
      assert.deepEqual(
        reasonCodesFor({
          nonCapabilities: Object.freeze([
            ExecutiveJournalExperienceManifestNonCapabilities[1],
            ExecutiveJournalExperienceManifestNonCapabilities[0],
            ...ExecutiveJournalExperienceManifestNonCapabilities.slice(2),
          ]),
        }),
        ["ProhibitedCapability"],
      );
      assert.deepEqual(
        reasonCodesFor({
          platformPrerequisites: Object.freeze([
            ExecutiveJournalExperienceManifestPlatformPrerequisites[1],
            ExecutiveJournalExperienceManifestPlatformPrerequisites[0],
            ...ExecutiveJournalExperienceManifestPlatformPrerequisites.slice(
              2,
            ),
          ]),
        }),
        ["ManifestEntryUnsealed"],
      );
    });

    it("rejects noncanonical, incomplete, and production-authority evidence", () => {
      assert.deepEqual(reasonCodesFor({ evidenceCanonical: false }), [
        "ValidationEvidenceUnknown",
      ]);
      assert.deepEqual(reasonCodesFor({ evidenceComplete: false }), [
        "ValidationEvidenceMissing",
      ]);
      assert.deepEqual(
        reasonCodesFor({ evidenceImpliesProductionAuthority: true }),
        ["ProhibitedCapability"],
      );
      assert.deepEqual(reasonCodesFor({ ex26Authorized: true }), [
        "ProhibitedCapability",
      ]);
    });

    it("orders and deduplicates reasons by the authorized catalogue", () => {
      const result =
        evaluateExecutiveJournalExperienceManifestEligibility({
          ...ExecutiveJournalExperienceManifestCanonicalInput,
          validationResult: undefined,
          evidenceComplete: false,
          evidenceCurrent: false,
          validationIdentity: "Mismatch",
          capabilities: [],
          nonCapabilities: [],
          dependencyBoundaryIntact: false,
          entriesSealed: false,
          separatePlatformAuthorizationRequired: false,
        });
      assert.deepEqual(
        result.reasons.map((reason) => reason.code),
        [
          "ValidationEvidenceMissing",
          "ValidationEvidenceStale",
          "ValidationEvidenceMismatched",
          "UnsupportedCapability",
          "ProhibitedCapability",
          "DependencyBoundaryViolation",
          "ManifestEntryUnsealed",
          "PlatformAuthorizationMissing",
        ],
      );
      assert.equal(
        new Set(result.reasons.map((reason) => reason.code)).size,
        result.reasonCount,
      );
    });

    it("does not throw, repair, mutate, or echo ordinary ineligible input", () => {
      const input = {
        ...ExecutiveJournalExperienceManifestCanonicalInput,
        validationResult: "secret-validation-payload",
        unexpectedSensitiveValue: "do-not-echo",
      };
      const before = { ...input };
      let result:
        | ReturnType<
            typeof evaluateExecutiveJournalExperienceManifestEligibility
          >
        | undefined;
      assert.doesNotThrow(() => {
        result =
          evaluateExecutiveJournalExperienceManifestEligibility(input);
      });
      assert.deepEqual(input, before);
      assert.equal(result?.repairedInput, false);
      assert.equal(result?.mutatedInput, false);
      assert.doesNotMatch(JSON.stringify(result), /secret|do-not-echo/);
      assert.deepEqual(reasonCodesFor({}), []);
    });

    it("is deterministic and returns deeply immutable results", () => {
      const first =
        evaluateExecutiveJournalExperienceManifestEligibility(
          ExecutiveJournalExperienceManifestCanonicalInput,
        );
      const second =
        evaluateExecutiveJournalExperienceManifestEligibility(
          ExecutiveJournalExperienceManifestCanonicalInput,
        );
      assert.deepEqual(first, second);
      assert.equal(isDeeplyFrozen(first), true);
      assert.equal(attemptMutation(first), false);
      assert.deepEqual(
        ExecutiveJournalExperienceManifestCanonicalEligibility,
        first,
      );
    });
  });

  describe("lifecycle", () => {
    it("publishes exact states, semantics, order, and terminal readiness", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceManifestLifecycleStates],
        [
          "Declared",
          "ValidationBound",
          "CapabilitiesDeclared",
          "Sealed",
          "ReadyForPlatform",
        ],
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestLifecycle.semantics.map(
          (entry) => entry.order,
        ),
        [1, 2, 3, 4, 5],
      );
      assert.equal(
        ExecutiveJournalExperienceManifestLifecycle.currentState,
        "ReadyForPlatform",
      );
      assert.equal(
        ExecutiveJournalExperienceManifestLifecycle
          .readyForPlatformAuthorizesEx26,
        false,
      );
    });

    it("permits only immediate forward transitions", () => {
      const allowed = [
        ["Declared", "ValidationBound"],
        ["ValidationBound", "CapabilitiesDeclared"],
        ["CapabilitiesDeclared", "Sealed"],
        ["Sealed", "ReadyForPlatform"],
      ] as const;
      for (const [from, to] of allowed) {
        assert.equal(
          canTransitionExecutiveJournalExperienceManifestLifecycle(from, to),
          true,
        );
        assert.equal(
          assertExecutiveJournalExperienceManifestLifecycleTransition(
            from,
            to,
          ),
          true,
        );
      }
      for (const [from, to] of [
        ["Declared", "Declared"],
        ["ValidationBound", "Declared"],
        ["Declared", "Sealed"],
        ["ReadyForPlatform", "Sealed"],
        ["declared", "ValidationBound"],
        ["Declared ", "ValidationBound"],
        ["Unknown", "Sealed"],
      ]) {
        assert.equal(
          canTransitionExecutiveJournalExperienceManifestLifecycle(
            from,
            to,
          ),
          false,
        );
        assert.throws(() =>
          assertExecutiveJournalExperienceManifestLifecycleTransition(
            from,
            to,
          )
        );
      }
    });

    it("verifies all 25 canonical lifecycle state pairs", () => {
      const allowed = new Set([
        "Declared→ValidationBound",
        "ValidationBound→CapabilitiesDeclared",
        "CapabilitiesDeclared→Sealed",
        "Sealed→ReadyForPlatform",
      ]);
      let pairCount = 0;
      for (const from of ExecutiveJournalExperienceManifestLifecycleStates) {
        for (const to of ExecutiveJournalExperienceManifestLifecycleStates) {
          pairCount += 1;
          const expected = allowed.has(`${from}→${to}`);
          assert.equal(
            canTransitionExecutiveJournalExperienceManifestLifecycle(
              from,
              to,
            ),
            expected,
          );
        }
      }
      assert.equal(pairCount, 25);
    });
  });

  describe("contracts, phase decisions, and boundaries", () => {
    it("contains exactly eight immutable contract kinds", () => {
      assert.equal(ExecutiveJournalExperienceManifestContracts.length, 8);
      assert.equal(
        new Set(
          ExecutiveJournalExperienceManifestContracts.map(
            (entry) => entry.contractId,
          ),
        ).size,
        8,
      );
    });

    for (const contract of ExecutiveJournalExperienceManifestContracts) {
      it(`directly covers contract ${contract.contractId}`, () => {
        assert.equal(contract.order >= 1 && contract.order <= 8, true);
        assert.equal(contract.metadataOnly, true);
        assert.equal(contract.exactValidationBinding, true);
        assert.equal(contract.repairsInput, false);
        assert.equal(contract.mutatesInput, false);
        assert.equal(contract.closedVocabularies, true);
        assert.equal(contract.deterministicOrdering, true);
        assert.equal(contract.safeDetailsOnly, true);
        assert.equal(contract.authorityCreation, false);
        assert.equal(contract.runtimeEffects, false);
        assert.equal(contract.productionAuthorization, false);
        assert.equal(contract.ex26SeparatelyAuthorized, true);
        assert.equal(isDeeplyFrozen(contract), true);
      });
    }

    it("continues phase decisions exactly from EX-2:4/D-14", () => {
      assert.deepEqual(
        ExecutiveJournalExperienceManifestDecisions.map(
          (decision) => decision.decisionId,
        ),
        [
          "EX-2:5/D-15",
          "EX-2:5/D-16",
          "EX-2:5/D-17",
          "EX-2:5/D-18",
          "EX-2:5/D-19",
          "EX-2:5/D-20",
        ],
      );
      assert.deepEqual(
        ExecutiveJournalExperienceManifestDecisions.map(
          (decision) => decision.order,
        ),
        [1, 2, 3, 4, 5, 6],
      );
      assert.equal(isDeeplyFrozen(
        ExecutiveJournalExperienceManifestDecisions,
      ), true);
      assert.equal(
        ExecutiveJournalExperienceValidation.decisions.at(-1)?.decisionId,
        "EX-2:4/D-14",
      );
    });

    for (const decision of ExecutiveJournalExperienceManifestDecisions) {
      it(`directly covers phase decision ${decision.decisionId}`, () => {
        assert.match(decision.statement, /\S/);
        assert.equal(Object.isFrozen(decision), true);
        assert.doesNotMatch(decision.decisionId, /^AD-EX2-/);
      });
    }

    it("keeps every prohibited behavior and dependency false", () => {
      const boundaries = ExecutiveJournalExperienceManifestBoundaries;
      assert.equal(boundaries.importsValidationOnlyAtRuntime, true);
      for (const [key, value] of Object.entries(boundaries)) {
        if (
          key === "boundariesId"
          || key === "importsValidationOnlyAtRuntime"
          || key === "metadataOnly"
          || key === "sideEffectFree"
          || key === "deterministic"
          || key === "failClosed"
          || key === "immutable"
        ) {
          continue;
        }
        assert.equal(value, false, key);
      }
    });
  });

  describe("exact upstream preservation", () => {
    it("preserves Validation and the complete chain by exact reference", () => {
      const upstream = ExecutiveJournalExperienceManifestUpstream;
      assert.equal(
        upstream.validation,
        ExecutiveJournalExperienceValidation,
      );
      assert.equal(
        upstream.validationCanonicalResult,
        ExecutiveJournalExperienceValidation.canonicalResult,
      );
      assert.equal(
        upstream.model,
        ExecutiveJournalExperienceValidation.model,
      );
      assert.equal(
        upstream.registry,
        ExecutiveJournalExperienceValidation.upstream.registry,
      );
      assert.equal(
        upstream.resolvedRegistryEntry,
        ExecutiveJournalExperienceValidation.upstream.resolvedRegistryEntry,
      );
      assert.equal(
        upstream.foundation,
        ExecutiveJournalExperienceValidation.upstream.foundation,
      );
      assert.deepEqual([...upstream.upstreamChain], [
        "EX-2:5/ExecutiveJournalExperienceManifest",
        "EX-2:4/ExecutiveJournalExperienceValidation",
        "EX-2:3/ExecutiveJournalExperienceModel",
        "EX-2:2/ExecutiveJournalExperienceRegistry",
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      ]);
    });

    it("preserves Validation catalogues, rules, and Model surfaces exactly", () => {
      const upstream = ExecutiveJournalExperienceManifestUpstream;
      assert.equal(
        upstream.validationResults,
        ExecutiveJournalExperienceValidation.types.results,
      );
      assert.equal(
        upstream.validationSeverities,
        ExecutiveJournalExperienceValidation.types.severities,
      );
      assert.equal(
        upstream.validationSubjectKinds,
        ExecutiveJournalExperienceValidation.types.subjects,
      );
      assert.equal(
        upstream.validationIssueCodes,
        ExecutiveJournalExperienceValidation.issueCodeCatalogue,
      );
      assert.equal(
        upstream.validationRules,
        ExecutiveJournalExperienceValidation.rules,
      );
      assert.equal(upstream.validationRules.length, 20);
      assert.equal(
        upstream.modelEntities,
        ExecutiveJournalExperienceValidation.model.entities,
      );
      assert.equal(
        upstream.modelRelationships,
        ExecutiveJournalExperienceValidation.model.relationships,
      );
      assert.equal(
        upstream.modelVocabularies,
        ExecutiveJournalExperienceValidation.model.vocabularies,
      );
    });

    it("preserves ledgers, authorization records, issues, and gates", () => {
      const upstream = ExecutiveJournalExperienceManifestUpstream;
      assert.equal(
        upstream.foundationArchitectureDecisionLedger,
        ExecutiveJournalExperienceValidation.upstream
          .foundationArchitectureDecisionLedger,
      );
      assert.equal(
        upstream.tier0EvidenceLedger,
        ExecutiveJournalExperienceValidation.upstream.tier0EvidenceLedger,
      );
      assert.equal(
        upstream.openIssues,
        ExecutiveJournalExperienceValidation.openIssues,
      );
      assert.equal(
        upstream.pendingGates,
        ExecutiveJournalExperienceValidation.pendingGates,
      );
      assert.equal(upstream.openIssues.issueIds.length, 13);
      assert.equal(
        upstream.openIssues.issues.every(
          (issue) =>
            issue.status === "Unresolved"
            && issue.carriedByPhase === "EX-2:1",
        ),
        true,
      );
      assert.deepEqual(
        upstream.pendingGates,
        ["G-EX2-04", "G-EX2-07", "G-EX2-12"],
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx213
          .preservation.allPendingGateResults,
        "Pending",
      );
      assert.equal(upstream.adEx213InjectedIntoSealedUpstreamLedgers, false);
    });
  });

  describe("aggregate and deterministic safe summary", () => {
    it("exposes exact canonical component references", () => {
      assert.equal(
        ExecutiveJournalExperienceManifest.identity,
        ExecutiveJournalExperienceManifestIdentity,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.lifecycle,
        ExecutiveJournalExperienceManifestLifecycle,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.entries,
        ExecutiveJournalExperienceManifestEntries,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.capabilities,
        ExecutiveJournalExperienceManifestCapabilities,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.nonCapabilities,
        ExecutiveJournalExperienceManifestNonCapabilities,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.platformPrerequisites,
        ExecutiveJournalExperienceManifestPlatformPrerequisites,
      );
      assert.equal(
        ExecutiveJournalExperienceManifest.validation,
        ExecutiveJournalExperienceValidation,
      );
      assert.equal(ExecutiveJournalExperienceManifest.metadataOnly, true);
      assert.equal(ExecutiveJournalExperienceManifest.createsAuthority, false);
      assert.equal(
        ExecutiveJournalExperienceManifest.implementsCapabilities,
        false,
      );
    });

    it("publishes the complete safe summary with exact counts", () => {
      const summary = getExecutiveJournalExperienceManifestSummary();
      assert.equal(summary, ExecutiveJournalExperienceManifestSummaryValue);
      assert.equal(summary.identity, ExecutiveJournalExperienceManifestId);
      assert.equal(summary.status, "Manifest");
      assert.equal(summary.readiness, "ReadyForPlatform");
      assert.equal(summary.eligibility, "Eligible");
      assert.equal(summary.capabilityCount, 16);
      assert.equal(summary.nonCapabilityCount, 19);
      assert.equal(summary.platformPrerequisiteCount, 9);
      assert.equal(summary.entryKindCount, 11);
      assert.equal(summary.reasonCodeCount, 12);
      assert.equal(summary.lifecycleStateCount, 5);
      assert.equal(summary.contractCount, 8);
      assert.equal(summary.decisionCount, 6);
      assert.equal(summary.openIssueCount, 13);
      assert.equal(summary.pendingGateCount, 3);
      assert.equal(summary.authorizationDecisionId, "AD-EX2-13");
      assert.equal(summary.metadataOnly, true);
      assert.equal(summary.sideEffectFree, true);
      assert.equal(summary.deterministic, true);
      assert.equal(summary.failClosed, true);
      assert.equal(summary.createsAuthority, false);
      assert.equal(summary.implementsCapabilities, false);
      assert.equal(summary.ex26Created, false);
      assert.equal(summary.ex26Authorized, false);
      assert.equal(
        summary.ciLintClassification,
        "CiStillBlockedByParkedReactCompilerDebt",
      );
      assert.doesNotMatch(
        JSON.stringify(summary),
        /journal_body|private_reflection|evidence_content|authority_evidence|actor_pii|fixture/i,
      );
      assert.equal(isDeeplyFrozen(summary), true);
    });
  });
});
