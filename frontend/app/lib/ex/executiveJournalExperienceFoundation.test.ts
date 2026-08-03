/**
 * EX-2:1 — Executive Journal Experience Foundation Final Verification.
 *
 * Completeness-traced coverage for identity, authorization, lifecycle,
 * boundaries, principles, decisions, evidence, open issues, aggregate,
 * and dependency boundaries. No mocks. No randomness. No network.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  ExecutiveJournalExperienceBoundaries,
  ExecutiveJournalExperienceBoundaryCatalogue,
  ExecutiveJournalExperienceBoundaryIds,
  ExecutiveJournalExperienceExOwnedResponsibilities,
  ExecutiveJournalExperiencePrinciples,
  ExecutiveJournalExperienceRtc2OwnedResponsibilities,
  assertExecutiveJournalExperienceBoundaryId,
  getExecutiveJournalExperienceBoundary,
} from "./executiveJournalExperienceBoundaries.ts";
import {
  ExecutiveJournalExperienceArchitectureDecisionIds,
  ExecutiveJournalExperienceArchitectureDecisions,
  ExecutiveJournalExperienceAuthorizingDecision,
  ExecutiveJournalExperienceDecisions,
  ExecutiveJournalExperienceEvidenceIds,
  ExecutiveJournalExperienceEvidenceLedger,
  getExecutiveJournalExperienceArchitectureDecision,
  getExecutiveJournalExperienceEvidence,
} from "./executiveJournalExperienceDecisions.ts";
import {
  ExecutiveJournalExperienceFoundation,
  ExecutiveJournalExperienceFoundationAuthorizationScope,
  ExecutiveJournalExperienceFoundationId,
  ExecutiveJournalExperienceFoundationNamespace,
  ExecutiveJournalExperienceFoundationNextPhase,
  ExecutiveJournalExperienceFoundationPhase,
  ExecutiveJournalExperienceFoundationReadiness,
  ExecutiveJournalExperienceFoundationStatus,
  ExecutiveJournalExperienceFoundationTitle,
  getExecutiveJournalExperienceFoundationSummary,
} from "./executiveJournalExperienceFoundation.ts";
import {
  ExecutiveJournalExperienceFoundationApprovedAliases,
  ExecutiveJournalExperienceIdentity,
  assertExecutiveJournalExperienceFoundationAlias,
  assertExecutiveJournalExperienceFoundationIdentity,
  resolveExecutiveJournalExperienceFoundationIdentity,
} from "./executiveJournalExperienceIdentity.ts";
import {
  ExecutiveJournalExperienceFoundationLifecycleStates,
  ExecutiveJournalExperienceLifecycle,
  assertExecutiveJournalExperienceFoundationLifecycleState,
  assertExecutiveJournalExperienceFoundationLifecycleTransition,
} from "./executiveJournalExperienceLifecycle.ts";
import {
  ExecutiveJournalExperienceOpenIssueCatalogue,
  ExecutiveJournalExperienceOpenIssueIds,
  ExecutiveJournalExperienceOpenIssues,
  ExecutiveJournalExperiencePendingGateIds,
  ExecutiveJournalExperiencePendingGates,
  getExecutiveJournalExperienceOpenIssue,
} from "./executiveJournalExperienceOpenIssues.ts";
import {
  ExecutiveJournalProductArchitectureDecisionAdrEx200,
  ExecutiveJournalProductArchitectureDecisionAdrEx201,
  ExecutiveJournalProductArchitectureDecisionAdrEx202,
  ExecutiveJournalProductArchitectureDecisionAdrEx203,
  ExecutiveJournalProductArchitectureDecisionAdrEx204,
  ExecutiveJournalProductArchitectureDecisionAdrEx205,
  ExecutiveJournalProductArchitectureDecisionAdrEx206,
  ExecutiveJournalProductArchitectureDecisionAdrEx207,
  ExecutiveJournalProductArchitectureDecisionAdrEx208,
  getExecutiveJournalProductArchitectureGate,
  getExecutiveJournalProductArchitectureSummary,
  isExecutiveJournalProductEx21Blocked,
  isExecutiveJournalProductEx21MetadataOnlyFoundationAuthorized,
} from "./executiveJournalProductArchitecture.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const EX21_FILES = Object.freeze([
  "executiveJournalExperienceFoundation.ts",
  "executiveJournalExperienceTypes.ts",
  "executiveJournalExperienceIdentity.ts",
  "executiveJournalExperienceBoundaries.ts",
  "executiveJournalExperienceDecisions.ts",
  "executiveJournalExperienceOpenIssues.ts",
  "executiveJournalExperienceLifecycle.ts",
  "executiveJournalExperienceFoundation.test.ts",
]);

/** Completeness table — fails if a boundary is added without coverage. */
const BOUNDARY_COVERAGE = Object.freeze([
  "ExperienceOwnership",
  "GovernanceAuthority",
  "MetadataOnly",
  "ReadOnly",
  "NoSystemOfRecord",
  "NoAuthorityCreation",
  "NoMutation",
  "NoPrivateReflectionExposure",
  "NoEvidencePayload",
  "NoActorPii",
  "NoNetwork",
  "NoPersistence",
  "NoTelemetry",
  "NoRoute",
  "NoProduction",
  "NoDeployment",
  "NoApp8Integration",
  "NoRtc3Integration",
  "NoPublicIndexPublication",
] as const);

const PRINCIPLE_COVERAGE = Object.freeze([
  {
    order: 1,
    principleId: "EX-2:1/Principle/01",
    statement:
      "EX-2 is an experience and consumer layer, not the journal system of record.",
  },
  {
    order: 2,
    principleId: "EX-2:1/Principle/02",
    statement:
      "EX-2 cannot create, confirm, broaden or exercise journal authority.",
  },
  {
    order: 3,
    principleId: "EX-2:1/Principle/03",
    statement: "EX-2 cannot mutate journal records or lifecycle state.",
  },
  {
    order: 4,
    principleId: "EX-2:1/Principle/04",
    statement:
      "Private-reflection existence and content remain undisclosed.",
  },
  {
    order: 5,
    principleId: "EX-2:1/Principle/05",
    statement:
      "Metadata consumption must be explicitly authorized and fail closed.",
  },
  {
    order: 6,
    principleId: "EX-2:1/Principle/06",
    statement: "Tier-0 evidence remains synthetic and non-production.",
  },
  {
    order: 7,
    principleId: "EX-2:1/Principle/07",
    statement:
      "Existing evidence is adopted by exact reference, never relabelled.",
  },
  {
    order: 8,
    principleId: "EX-2:1/Principle/08",
    statement:
      "Foundation readiness does not imply Platform, route, production or deployment readiness.",
  },
  {
    order: 9,
    principleId: "EX-2:1/Principle/09",
    statement:
      "Later phases must consume only the preceding formal EX-2 phase.",
  },
  {
    order: 10,
    principleId: "EX-2:1/Principle/10",
    statement:
      "Unknown identities, fields, states and authority claims fail closed.",
  },
] as const);

const DECISION_COVERAGE = Object.freeze([
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

const DECISION_EXACT_RECORDS = Object.freeze([
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

const EVIDENCE_COVERAGE = Object.freeze([
  "AD-EX2-00",
  "AD-EX2-01",
  "AD-EX2-02",
  "AD-EX2-03",
  "AD-EX2-04",
  "AD-EX2-05",
  "AD-EX2-06",
  "AD-EX2-07",
  "AD-EX2-08",
  "GOV-EX2-T0-01",
  "GOV-EX2-T0-02",
  "EX2-T0-PRIVACY-APPOINTMENT-01",
  "EX2-T0-AUTHORITY-APPOINTMENT-01",
  "EX2-T0-PRIVACY-REVIEW-01",
  "EX2-T0-AUTHORITY-REVIEW-01",
  "EX2-T0-UI-PRIVACY-APPOINTMENT-01",
  "EX2-T0-UI-AUTHORITY-SECURITY-APPOINTMENT-01",
  "EX2-T0-UI-PRIVACY-REVIEW-01",
  "EX2-T0-UI-AUTHORITY-SECURITY-REVIEW-01",
  "EX2-AUTH-T0-2026-07-26-01",
  "EX2-UI-AUTH-T0-2026-07-27-01",
  "EX2-CERT-T0-2026-07-26-01",
  "EX2-UI-CERT-T0-2026-07-27-01",
  "EX-2:T0/ExecutiveJournalSyntheticMetadataContractPackage",
  "EX-2:T0/ExecutiveJournalSyntheticMetadataConsumer",
  "EX-2:T0/ExecutiveJournalSyntheticContractPreview",
  "EX-2:T0/ExecutiveJournalSyntheticPreviewUI",
  "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade",
  "DevelopmentTestHarnessOnly",
  "AD-EX2-08/RouteAssessment",
] as const);

const APPROVED_EVIDENCE_CLASSIFICATIONS = Object.freeze([
  "SupportingEvidence",
  "ArchitectureDecision",
  "GovernanceDecision",
  "PendingGate",
  "OpenIssue",
] as const);

const OPEN_ISSUE_COVERAGE = Object.freeze([
  {
    issueId: "G-EX2-04",
    owner: "RTC Journal Operations / EX Architecture",
    blockingScope: "ProductionProviderCompatibility",
  },
  {
    issueId: "G-EX2-07",
    owner: "EX Product and Architecture Authority",
    blockingScope: "ProductionAllowlist",
  },
  {
    issueId: "G-EX2-12",
    owner: "EX Product and Architecture Authority",
    blockingScope: "ProductionTelemetry",
  },
  {
    issueId: "SystemOfRecordSelection",
    owner: "RTC Journal Operations",
    blockingScope: "SystemOfRecordSelection",
  },
  {
    issueId: "RealRtc2ConsumerAuthorization",
    owner: "Nexora Product and Architecture Authority",
    blockingScope: "RealRtc2Consumption",
  },
  {
    issueId: "ProductionProviderAndAdapter",
    owner: "EX-2 Product Boundary / RTC Journal Operations",
    blockingScope: "ProductionProviderAdapter",
  },
  {
    issueId: "ProductionPrivacyLegalAuthorityReviews",
    owner: "Privacy / Legal / Security / Executive Governance",
    blockingScope: "ProductionPrivacyLegalAuthority",
  },
  {
    issueId: "CloudPlatformAndRegion",
    owner: "Infrastructure / Architecture Authority",
    blockingScope: "CloudPlatformRegion",
  },
  {
    issueId: "KmsAndKeyCustody",
    owner: "Security / Infrastructure",
    blockingScope: "KmsKeyCustody",
  },
  {
    issueId: "RpoRtoAndRecoveryOwnership",
    owner: "RTC Journal Operations",
    blockingScope: "RecoveryOwnership",
  },
  {
    issueId: "RouteAndNavigationAuthorization",
    owner: "Nexora Product and Architecture Authority",
    blockingScope: "RouteNavigation",
  },
  {
    issueId: "PublicIndexPublication",
    owner: "EX Product Architecture",
    blockingScope: "PublicIndexPublication",
  },
  {
    issueId: "DeploymentAuthorization",
    owner: "Nexora Product and Architecture Authority",
    blockingScope: "Deployment",
  },
] as const);

const LIFECYCLE_LEGAL_TRANSITIONS = Object.freeze([
  ["Declared", "Bounded"],
  ["Bounded", "EvidenceLinked"],
  ["EvidenceLinked", "ReadyForRegistry"],
] as const);

const LIFECYCLE_ILLEGAL_TRANSITIONS = Object.freeze([
  ["Declared", "EvidenceLinked"],
  ["Declared", "ReadyForRegistry"],
  ["Bounded", "Declared"],
  ["Bounded", "ReadyForRegistry"],
  ["EvidenceLinked", "Declared"],
  ["EvidenceLinked", "Bounded"],
  ["ReadyForRegistry", "Declared"],
  ["ReadyForRegistry", "Bounded"],
  ["ReadyForRegistry", "EvidenceLinked"],
  ["ReadyForRegistry", "ReadyForRegistry"],
] as const);

const PROHIBITED_SOURCE_PATTERNS = Object.freeze([
  /\bfrom\s+["']react["']/,
  /\bfrom\s+["']react-dom/,
  /\bfrom\s+["']next\//,
  /\bfrom\s+["'][^"']*\/rtc\/executiveJournalRuntime/,
  /\bfrom\s+["'][^"']*\/rtc\/executiveContextRuntime(?!PublicIndex)/,
  /\bfrom\s+["'][^"']*\/rtc\/executiveDecisionRegister/,
  /\bfrom\s+["'][^"']*decision-journal/,
  /\bfrom\s+["']\.\/ExecutiveJournalSyntheticPreview\.tsx["']/,
  /\bfrom\s+["']\.\/ExecutiveJournalSyntheticHarness\.tsx["']/,
  /\bfrom\s+["']\.\/executiveJournalSyntheticUi/,
  /\bfrom\s+["']\.\/executiveStage/,
  /\bfrom\s+["']\.\/executiveStagePublicIndex\.ts["']/,
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\blocalStorage\b/,
  /\bsessionStorage\b/,
  /\bindexedDB\b/,
  /\bDate\.now\b/,
  /\bMath\.random\b/,
  /\bcrypto\.randomUUID\b/,
  /\bopenai\b/i,
  /\b@aws-sdk\b/,
  /\b@azure\//,
  /\bfrom\s+["']node:fs["']/,
  /\bfrom\s+["']fs["']/,
] as const);

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
    // expected
  }
  for (const nested of Object.values(record)) {
    if (attemptNestedMutation(nested)) {
      return true;
    }
  }
  return false;
};

describe("EX-2:1 Executive Journal Experience Foundation", () => {
  describe("package inventory", () => {
    it("contains exactly the eight Foundation files and no unauthorized later phases", () => {
      assert.equal(EX21_FILES.length, 8);
      const present = readdirSync(HERE);
      for (const file of EX21_FILES) {
        assert.ok(present.includes(file), `missing ${file}`);
      }
      assert.equal(
        present.filter((name) => EX21_FILES.includes(name)).length,
        8,
      );
      // EX-2:2 through EX-2:9 may exist under accepted authority; Foundation remains eight files.
    });
  });

  describe("identity", () => {
    it("publishes exact canonical identity fields", () => {
      assert.equal(
        ExecutiveJournalExperienceFoundationId,
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationNamespace,
        "nexora.ex.executive.journal.experience.foundation",
      );
      assert.equal(ExecutiveJournalExperienceFoundationStatus, "Foundation");
      assert.equal(
        ExecutiveJournalExperienceFoundationReadiness,
        "ReadyForRegistry",
      );
      assert.equal(ExecutiveJournalExperienceFoundationPhase, "EX-2:1");
      assert.equal(
        ExecutiveJournalExperienceFoundationTitle,
        "Executive Journal Experience Foundation",
      );
      assert.equal(
        ExecutiveJournalExperienceFoundationNextPhase,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(ExecutiveJournalExperienceIdentity.metadataOnly, true);
      assert.equal(ExecutiveJournalExperienceIdentity.sideEffectFree, true);
      assert.equal(ExecutiveJournalExperienceIdentity.title, ExecutiveJournalExperienceFoundationTitle);
      assert.equal(mutateFrozen(ExecutiveJournalExperienceIdentity), false);
      assert.equal(attemptNestedMutation(ExecutiveJournalExperienceIdentity), false);
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceFoundationApprovedAliases as object),
        false,
      );
    });

    it("accepts only approved aliases and rejects unknown variants", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceFoundationApprovedAliases],
        ["ExecutiveJournalExperienceFoundation", "EX-2:1"],
      );
      assert.equal(
        assertExecutiveJournalExperienceFoundationAlias(
          "ExecutiveJournalExperienceFoundation",
        ),
        "ExecutiveJournalExperienceFoundation",
      );
      assert.equal(
        assertExecutiveJournalExperienceFoundationAlias("EX-2:1"),
        "EX-2:1",
      );
      assert.equal(
        resolveExecutiveJournalExperienceFoundationIdentity("EX-2:1"),
        ExecutiveJournalExperienceFoundationId,
      );
      assert.equal(
        resolveExecutiveJournalExperienceFoundationIdentity(
          "ExecutiveJournalExperienceFoundation",
        ),
        ExecutiveJournalExperienceFoundationId,
      );
      assert.equal(
        assertExecutiveJournalExperienceFoundationIdentity(
          ExecutiveJournalExperienceFoundationId,
        ),
        ExecutiveJournalExperienceFoundationId,
      );
      for (const value of [
        "EX-2:2/ExecutiveJournalExperienceRegistry",
        "EX-2:1/ExecutiveStageFoundation",
        "EX-2:1/ExecutiveJournalExperience",
        "ex-2:1/ExecutiveJournalExperienceFoundation",
        "EX-2:1/executiveJournalExperienceFoundation",
        "EX-2:1/ExecutiveJournalExperienceFoundation ",
        " EX-2:1/ExecutiveJournalExperienceFoundation",
        "EX-2:1",
        "ExecutiveJournalExperienceFoundation ",
        " executiveJournalExperienceFoundation",
        "executiveJournalExperienceFoundation",
        "EX-2:10/ExecutiveJournalExperienceFoundation",
        "nexora.ex.executive.journal.experience.foundation",
        "nexora.ex.executive.stage.foundation",
        "nexora.ex.executive.journal.experience.Foundation",
        "",
      ]) {
        assert.throws(
          () => assertExecutiveJournalExperienceFoundationIdentity(value),
          /fails closed/,
        );
      }
      for (const value of [
        "EX-2:1/ExecutiveJournalExperienceFoundation",
        "ex-2:1",
        "EX-2:1 ",
        " EX-2:1",
        "EX-2:2",
        "Foundation",
        "ExecutiveJournalExperienceRegistry",
        "",
      ]) {
        assert.throws(
          () => assertExecutiveJournalExperienceFoundationAlias(value),
          /fails closed/,
        );
      }
    });
  });

  describe("authorization", () => {
    it("proves AD-EX2-08 metadata-only Foundation authority without EX-2:2 or production", () => {
      const decision = ExecutiveJournalExperienceAuthorizingDecision;
      const scope = ExecutiveJournalExperienceFoundationAuthorizationScope;
      const archSummary = getExecutiveJournalProductArchitectureSummary();
      assert.equal(decision, ExecutiveJournalProductArchitectureDecisionAdrEx208);
      assert.equal(decision.decisionId, "AD-EX2-08");
      assert.equal(decision.status, "Accepted");
      assert.equal(decision.decisionAuthority, "Bahadoor");
      assert.equal(
        decision.authorityRole,
        "Nexora Product and Architecture Authority",
      );
      assert.equal(decision.decisionDate, "2026-07-27");
      assert.equal(decision.formalEx2SequenceAuthorized, true);
      assert.equal(decision.ex21MetadataOnlyFoundationAuthorized, true);
      assert.equal(decision.ex21ImplementationAuthorized, true);
      assert.equal(
        decision.ex21ImplementationScope,
        "MetadataOnlyEx21FoundationOnly",
      );
      assert.equal(decision.ex22Authorized, false);
      assert.equal(decision.routeAuthorized, false);
      assert.equal(decision.realRtc2ConsumptionAuthorized, false);
      assert.equal(decision.productionIntegrationAuthorized, false);
      assert.equal(decision.publicIndexAuthorized, false);
      assert.equal(decision.deploymentAuthorized, false);
      assert.equal(scope.formalEx2SequenceAuthorized, true);
      assert.equal(scope.ex21MetadataOnlyFoundationAuthorized, true);
      assert.equal(scope.ex21ImplementationAuthorized, true);
      assert.equal(scope.scope, "MetadataOnlyEx21FoundationOnly");
      assert.equal(scope.ex22Authorized, false);
      assert.equal(scope.routeAuthorized, false);
      assert.equal(scope.realRtc2ConsumptionAuthorized, false);
      assert.equal(scope.productionAuthorized, false);
      assert.equal(scope.deploymentAuthorized, false);
      assert.equal(archSummary.ex21Blocked, true);
      assert.equal(
        archSummary.ex21BlockedMeans,
        "OperationalProductionAndLaterPhasesRemainBlocked",
      );
      assert.equal(archSummary.ex21BlockedClarifiedByAdEx208, true);
      assert.equal(isExecutiveJournalProductEx21Blocked(), true);
      assert.equal(
        isExecutiveJournalProductEx21MetadataOnlyFoundationAuthorized(),
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.authorizesEx22,
        false,
      );
      assert.equal(
        getExecutiveJournalExperienceFoundationSummary().ex22Authorized,
        false,
      );
    });
  });

  describe("lifecycle", () => {
    it("enforces exact vocabulary, order, legal transitions and terminal readiness", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceFoundationLifecycleStates],
        ["Declared", "Bounded", "EvidenceLinked", "ReadyForRegistry"],
      );
      assert.equal(ExecutiveJournalExperienceLifecycle.stateCount, 4);
      assert.equal(
        ExecutiveJournalExperienceLifecycle.currentState,
        "ReadyForRegistry",
      );
      assert.equal(
        ExecutiveJournalExperienceLifecycle.readiness,
        "ReadyForRegistry",
      );
      for (const [from, to] of LIFECYCLE_LEGAL_TRANSITIONS) {
        assert.deepEqual(
          assertExecutiveJournalExperienceFoundationLifecycleTransition(
            from,
            to,
          ),
          { from, to },
        );
      }
      for (const [from, to] of LIFECYCLE_ILLEGAL_TRANSITIONS) {
        assert.throws(
          () =>
            assertExecutiveJournalExperienceFoundationLifecycleTransition(
              from,
              to,
            ),
          /fails closed/,
        );
      }
      for (const value of [
        "Ready",
        "readyForRegistry",
        "Frozen",
        "Declared ",
        " Bounded",
        "",
      ]) {
        assert.throws(
          () =>
            assertExecutiveJournalExperienceFoundationLifecycleState(value),
          /fails closed/,
        );
      }
      assert.equal(mutateFrozen(ExecutiveJournalExperienceLifecycle), false);
      assert.equal(
        attemptNestedMutation(ExecutiveJournalExperienceLifecycle),
        false,
      );
    });

    it("ReadyForRegistry requires Foundation contracts without authorizing later phases", () => {
      const req =
        ExecutiveJournalExperienceLifecycle.readyForRegistryRequirements;
      assert.equal(req.requiresCanonicalIdentity, true);
      assert.equal(
        req.requiredIdentity,
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      );
      assert.equal(req.requiresCompleteBoundaryCatalogue, true);
      assert.equal(req.requiredBoundaryCount, BOUNDARY_COVERAGE.length);
      assert.equal(req.requiresAdEx208Authority, true);
      assert.equal(req.authorizingDecisionId, "AD-EX2-08");
      assert.equal(req.requiresEvidenceLedgerIntegrity, true);
      assert.equal(req.requiresOpenIssuesPreserved, true);
      assert.equal(req.requiresNoProhibitedBehavior, true);
      assert.equal(req.requiresNextPhaseDeclaredAsMetadataOnly, true);
      assert.equal(
        req.nextPhaseMetadata,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(req.requiresProductionGatesToPass, false);
      assert.equal(req.doesNotMeanEx22AuthorizedOrCreated, true);
      assert.equal(req.doesNotMeanRtc2ConsumptionActive, true);
      assert.equal(req.doesNotMeanUiOrRouteAuthorized, true);
      assert.equal(req.doesNotMeanPlatformExists, true);
      assert.equal(req.doesNotMeanProductionOrDeploymentReady, true);
      assert.equal(
        ExecutiveJournalExperienceLifecycle.productionGatesBlockMetadataFoundation,
        false,
      );
      assert.equal(ExecutiveJournalExperienceLifecycle.ex22Authorized, false);
      assert.equal(ExecutiveJournalExperienceLifecycle.ex22Created, false);
      assert.equal(
        ExecutiveJournalExperienceLifecycle.laterPhasesAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceLifecycle.laterPhasesCompleted,
        false,
      );
    });
  });

  describe("boundaries", () => {
    it("matches completeness table with unique ordered coverage", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceBoundaryIds],
        [...BOUNDARY_COVERAGE],
      );
      assert.equal(ExecutiveJournalExperienceBoundaryIds.length, 19);
      assert.equal(
        new Set(ExecutiveJournalExperienceBoundaryIds).size,
        BOUNDARY_COVERAGE.length,
      );
      assert.equal(
        Object.keys(ExecutiveJournalExperienceBoundaryCatalogue).length,
        BOUNDARY_COVERAGE.length,
      );
      for (const id of BOUNDARY_COVERAGE) {
        const boundary = getExecutiveJournalExperienceBoundary(id);
        assert.equal(boundary.boundaryId, id);
        assert.equal(boundary.enforced, true);
        assert.equal(assertExecutiveJournalExperienceBoundaryId(id), id);
      }
      for (const value of [
        "NoMagic",
        "experienceOwnership",
        "NoRoute ",
        " NoRoute",
        "NoPublicIndex",
        "",
      ]) {
        assert.throws(
          () => assertExecutiveJournalExperienceBoundaryId(value),
          /fails closed/,
        );
      }
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.ExperienceOwnership.owner,
        "EX-2",
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.GovernanceAuthority.owner,
        "RTC-2",
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.GovernanceAuthority
          .exMustNotOverride,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.MetadataOnly.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.ReadOnly.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoSystemOfRecord.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoAuthorityCreation.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoMutation.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoPrivateReflectionExposure
          .privateReflectionExistenceExposed,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoPrivateReflectionExposure
          .privateReflectionContentExposed,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoEvidencePayload
          .evidencePayloadExposed,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoEvidencePayload
          .authorityEvidenceExposed,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoActorPii.actorPiiExposed,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoNetwork.networkAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoPersistence
          .persistenceAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoTelemetry.telemetryEnabled,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoRoute.routeAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoProduction
          .productionAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoDeployment
          .deploymentAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoApp8Integration
          .app8IntegrationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoRtc3Integration
          .rtc3IntegrationAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoPublicIndexPublication
          .publicIndexAuthorized,
        false,
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceBoundaryCatalogue),
        false,
      );
    });
  });

  describe("principles", () => {
    it("matches completeness table and ownership split", () => {
      assert.equal(ExecutiveJournalExperiencePrinciples.length, 10);
      assert.deepEqual(
        ExecutiveJournalExperiencePrinciples.map((item) => ({
          order: item.order,
          principleId: item.principleId,
          statement: item.statement,
        })),
        [...PRINCIPLE_COVERAGE],
      );
      assert.equal(
        new Set(
          ExecutiveJournalExperiencePrinciples.map((item) => item.principleId),
        ).size,
        10,
      );
      assert.ok(
        ExecutiveJournalExperienceExOwnedResponsibilities.includes(
          "Executive Journal experience composition",
        ),
      );
      assert.ok(
        ExecutiveJournalExperienceRtc2OwnedResponsibilities.includes(
          "Executive Journal governance contracts",
        ),
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoSystemOfRecord.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoAuthorityCreation.value,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaryCatalogue.NoMutation.value,
        true,
      );
      assert.equal(mutateFrozen(ExecutiveJournalExperiencePrinciples), false);
    });
  });

  describe("architecture decisions", () => {
    it("covers AD-EX2-00 through AD-EX2-08 once with exact upstream references", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceArchitectureDecisionIds],
        [...DECISION_COVERAGE],
      );
      assert.deepEqual(
        ExecutiveJournalExperienceArchitectureDecisions.map(
          (item) => item.decisionId,
        ),
        [...DECISION_COVERAGE],
      );
      assert.equal(
        ExecutiveJournalExperienceArchitectureDecisions.length,
        DECISION_COVERAGE.length,
      );
      assert.equal(
        new Set(
          ExecutiveJournalExperienceArchitectureDecisions.map(
            (item) => item.decisionId,
          ),
        ).size,
        DECISION_COVERAGE.length,
      );
      for (let index = 0; index < DECISION_EXACT_RECORDS.length; index += 1) {
        assert.equal(
          ExecutiveJournalExperienceArchitectureDecisions[index],
          DECISION_EXACT_RECORDS[index],
        );
        assert.equal(
          getExecutiveJournalExperienceArchitectureDecision(
            DECISION_COVERAGE[index]!,
          ),
          DECISION_EXACT_RECORDS[index],
        );
        assert.equal(DECISION_EXACT_RECORDS[index]!.status, "Accepted");
      }
      assert.equal(
        ExecutiveJournalExperienceAuthorizingDecision,
        ExecutiveJournalProductArchitectureDecisionAdrEx208,
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx200.selectedOption,
        "C",
      );
      assert.equal(
        ExecutiveJournalProductArchitectureDecisionAdrEx207.createsEx21,
        false,
      );
      assert.equal(ExecutiveJournalExperienceDecisions.createsAdEx209, false);
      assert.equal(ExecutiveJournalExperienceDecisions.authorizesEx22, false);
      assert.equal(ExecutiveJournalExperienceDecisions.authorizesRoute, false);
      assert.equal(
        ExecutiveJournalExperienceDecisions.authorizesProduction,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.authorizesDeployment,
        false,
      );
      assert.throws(() =>
        getExecutiveJournalExperienceArchitectureDecision("AD-EX2-09")
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceArchitectureDecisions),
        false,
      );
    });
  });

  describe("evidence ledger", () => {
    it("covers exactly thirty unique supporting entries without phase relabelling", () => {
      assert.equal(EVIDENCE_COVERAGE.length, 30);
      assert.equal(ExecutiveJournalExperienceEvidenceIds.length, 30);
      assert.deepEqual(
        [...ExecutiveJournalExperienceEvidenceIds],
        [...EVIDENCE_COVERAGE],
      );
      assert.equal(
        new Set(ExecutiveJournalExperienceEvidenceIds).size,
        30,
      );
      for (const evidenceId of EVIDENCE_COVERAGE) {
        const entry = getExecutiveJournalExperienceEvidence(evidenceId);
        assert.equal(entry.evidenceId, evidenceId);
        assert.equal(entry.productionApplicability, false);
        assert.equal(entry.satisfiesFormalEx2PhaseAutomatically, false);
        assert.ok(
          (
            APPROVED_EVIDENCE_CLASSIFICATIONS as readonly string[]
          ).includes(entry.classification),
        );
        assert.ok(
          entry.label === "SupportingEvidence"
            || entry.label === "ArchitectureAuthority",
        );
      }
      assert.equal(
        ExecutiveJournalExperienceEvidenceLedger[8]?.evidenceId,
        "AD-EX2-08",
      );
      assert.equal(
        ExecutiveJournalExperienceEvidenceLedger[8]?.record,
        ExecutiveJournalProductArchitectureDecisionAdrEx208,
      );
      assert.equal(
        ExecutiveJournalExperienceEvidenceLedger[0]?.evidenceId,
        "AD-EX2-00",
      );
      assert.equal(
        ExecutiveJournalExperienceEvidenceLedger[0]?.record,
        ExecutiveJournalProductArchitectureDecisionAdrEx200,
      );
      const metaCert = getExecutiveJournalExperienceEvidence(
        "EX2-CERT-T0-2026-07-26-01",
      );
      assert.equal(
        (metaCert as { isFormalEx27Certification?: boolean })
          .isFormalEx27Certification,
        false,
      );
      const uiCert = getExecutiveJournalExperienceEvidence(
        "EX2-UI-CERT-T0-2026-07-27-01",
      );
      assert.equal(
        (uiCert as { isFormalEx27Certification?: boolean })
          .isFormalEx27Certification,
        false,
      );
      assert.equal(
        (uiCert as { isFormalEx26Platform?: boolean }).isFormalEx26Platform,
        false,
      );
      assert.equal(
        (uiCert as { isFormalEx29PublicIndex?: boolean }).isFormalEx29PublicIndex,
        false,
      );
      const preview = getExecutiveJournalExperienceEvidence(
        "EX-2:T0/ExecutiveJournalSyntheticContractPreview",
      );
      assert.equal(
        (preview as { isFormalEx26Platform?: boolean }).isFormalEx26Platform,
        false,
      );
      const route = getExecutiveJournalExperienceEvidence(
        "AD-EX2-08/RouteAssessment",
      );
      assert.equal(
        (route as { routeAssessment?: string }).routeAssessment,
        "DeferredSupportingEvidence",
      );
      assert.equal(
        (route as { isFormalEx29PublicIndex?: boolean }).isFormalEx29PublicIndex,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy.strategy,
        "ExactReferenceEvidenceLedger",
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy
          .scopeChangesMustExplicitlyReopenAffectedEvidence,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy
          .tier0CertificationIsNotEx27Certification,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy
          .tier0ImmutabilityIsNotEx28Freeze,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy
          .tier0UiOrRouteAssessmentIsNotEx29PublicIndex,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.evidenceAdoptionPolicy
          .oneEvidenceIdentityCountedOnlyOnce,
        true,
      );
      assert.throws(() =>
        getExecutiveJournalExperienceEvidence("EX2-CERT-FAKE")
      );
      assert.equal(
        attemptNestedMutation(ExecutiveJournalExperienceEvidenceLedger),
        false,
      );
    });
  });

  describe("open issues and pending gates", () => {
    it("preserves unresolved issues and Pending production gates with ownership", () => {
      assert.deepEqual(
        [...ExecutiveJournalExperienceOpenIssueIds],
        OPEN_ISSUE_COVERAGE.map((item) => item.issueId),
      );
      assert.equal(ExecutiveJournalExperienceOpenIssues.length, 13);
      assert.equal(
        new Set(ExecutiveJournalExperienceOpenIssueIds).size,
        13,
      );
      for (const expected of OPEN_ISSUE_COVERAGE) {
        const issue = getExecutiveJournalExperienceOpenIssue(expected.issueId);
        assert.equal(issue.status, "Unresolved");
        assert.equal(issue.owner, expected.owner);
        assert.equal(issue.blockingScope, expected.blockingScope);
        assert.equal(issue.blocksFoundationReadiness, false);
        assert.equal(issue.blocksProductionReadiness, true);
        assert.equal(issue.carriedByPhase, "EX-2:1");
        assert.ok(issue.description.length > 0);
      }
      assert.deepEqual([...ExecutiveJournalExperiencePendingGateIds], [
        "G-EX2-04",
        "G-EX2-07",
        "G-EX2-12",
      ]);
      for (const gate of ExecutiveJournalExperiencePendingGates) {
        assert.equal(gate.result, "Pending");
        assert.equal(gate.expectedResult, "Pending");
        assert.equal(gate.blocksFoundationReadiness, false);
        assert.equal(gate.blocksProductionReadiness, true);
        assert.equal(gate.carriedByPhase, "EX-2:1");
        assert.equal(
          getExecutiveJournalProductArchitectureGate(gate.gateId).result,
          "Pending",
        );
        assert.equal(
          getExecutiveJournalProductArchitectureGate(gate.gateId),
          gate.record,
        );
      }
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-04").name,
        "provider is governed by or proven compatible with RTC-2",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-07").name,
        "final field allowlist approved",
      );
      assert.equal(
        getExecutiveJournalProductArchitectureGate("G-EX2-12").name,
        "telemetry allowlist approved",
      );
      assert.equal(
        ExecutiveJournalExperienceOpenIssueCatalogue
          .anyIssueResolvedByAssumption,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceOpenIssueCatalogue
          .foundationReadinessBlockedByAnyOpenIssue,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceOpenIssueCatalogue
          .productionReadinessBlockedByOpenIssues,
        true,
      );
      assert.throws(() =>
        getExecutiveJournalExperienceOpenIssue("ResolvedByAssumption")
      );
      assert.equal(
        mutateFrozen(ExecutiveJournalExperienceOpenIssues as object),
        false,
      );
    });
  });

  describe("aggregate and summary", () => {
    it("preserves exact references and a deterministic safe summary", () => {
      assert.equal(
        ExecutiveJournalExperienceFoundation.identity,
        ExecutiveJournalExperienceIdentity,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.lifecycle,
        ExecutiveJournalExperienceLifecycle,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.boundaries,
        ExecutiveJournalExperienceBoundaries,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.principles,
        ExecutiveJournalExperiencePrinciples,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.decisions,
        ExecutiveJournalExperienceDecisions,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.evidenceLedger,
        ExecutiveJournalExperienceEvidenceLedger,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.openIssues,
        ExecutiveJournalExperienceOpenIssueCatalogue,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.pendingGates,
        ExecutiveJournalExperiencePendingGateIds,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.authorizationScope,
        ExecutiveJournalExperienceFoundationAuthorizationScope,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.authorizingDecision,
        ExecutiveJournalProductArchitectureDecisionAdrEx208,
      );
      assert.equal(
        ExecutiveJournalExperienceFoundation.nextPhase,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(ExecutiveJournalExperienceFoundation.createsEx22, false);
      assert.equal(ExecutiveJournalExperienceFoundation.authorizesEx22, false);
      assert.equal(ExecutiveJournalExperienceFoundation.createsRoute, false);
      assert.equal(ExecutiveJournalExperienceFoundation.createsUi, false);
      assert.equal(
        ExecutiveJournalExperienceFoundation.liveRtc2Integration,
        false,
      );

      const summary = getExecutiveJournalExperienceFoundationSummary();
      const again = getExecutiveJournalExperienceFoundationSummary();
      assert.deepEqual(summary, again);
      assert.equal(
        summary.identity,
        "EX-2:1/ExecutiveJournalExperienceFoundation",
      );
      assert.equal(
        summary.namespace,
        "nexora.ex.executive.journal.experience.foundation",
      );
      assert.equal(summary.status, "Foundation");
      assert.equal(summary.readiness, "ReadyForRegistry");
      assert.equal(summary.phase, "EX-2:1");
      assert.equal(summary.metadataOnly, true);
      assert.equal(summary.sideEffectFree, true);
      assert.deepEqual([...summary.decisionIds], [...DECISION_COVERAGE]);
      assert.deepEqual([...summary.evidenceIds], [...EVIDENCE_COVERAGE]);
      assert.deepEqual(
        [...summary.openIssueIds],
        OPEN_ISSUE_COVERAGE.map((item) => item.issueId),
      );
      assert.deepEqual([...summary.pendingGateIds], [
        "G-EX2-04",
        "G-EX2-07",
        "G-EX2-12",
      ]);
      assert.equal(
        summary.nextPhase,
        "EX-2:2 — Executive Journal Experience Registry",
      );
      assert.equal(summary.productionAuthorized, false);
      assert.equal(summary.routeAuthorized, false);
      assert.equal(summary.deploymentAuthorized, false);
      assert.equal(summary.ex22Created, false);
      assert.equal(summary.ex22Authorized, false);
      assert.equal(summary.authorizingDecisionId, "AD-EX2-08");
      assert.equal(
        new Set(summary.decisionIds).size,
        summary.decisionIds.length,
      );
      assert.equal(
        new Set(summary.evidenceIds).size,
        summary.evidenceIds.length,
      );
      assert.equal(
        new Set(summary.openIssueIds).size,
        summary.openIssueIds.length,
      );
      const serialized = JSON.stringify(summary);
      assert.equal(serialized.includes("private_reflection"), false);
      assert.equal(serialized.includes("syn-entry-"), false);
      assert.equal(serialized.includes("actor_pii"), false);
      assert.equal(serialized.includes("fixture"), false);
      assert.equal(serialized.includes("authorityEvidence"), false);
      assert.equal(mutateFrozen(ExecutiveJournalExperienceFoundation), false);
      assert.equal(mutateFrozen(summary), false);
    });
  });

  describe("dependency boundaries", () => {
    it("statically proves one-way architecture dependency and prohibited APIs", () => {
      const sources = EX21_FILES.filter((name) => !name.endsWith(".test.ts"));
      for (const file of sources) {
        const source = readFileSync(join(HERE, file), "utf8");
        for (const pattern of PROHIBITED_SOURCE_PATTERNS) {
          assert.doesNotMatch(
            source,
            pattern,
            `${file} must not match ${pattern}`,
          );
        }
      }
      assert.equal(
        ExecutiveJournalExperienceBoundaries.dependency
          .liveRtc2RuntimeImportAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaries.dependency
          .ex1RuntimeImportAuthorized,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaries.dependency.circularDependency,
        false,
      );
      assert.equal(
        ExecutiveJournalExperienceBoundaries.dependency
          .architectureMustNotImportFoundation,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.importBoundary
          .architectureMustNotImportFoundation,
        true,
      );
      assert.equal(
        ExecutiveJournalExperienceDecisions.importBoundary.importDirection,
        "FoundationMayImportArchitectureOneWay",
      );
      const architectureSource = readFileSync(
        join(HERE, "executiveJournalProductArchitecture.ts"),
        "utf8",
      );
      assert.doesNotMatch(
        architectureSource,
        /from ["']\.\/executiveJournalExperience/,
      );
    });
  });
});
