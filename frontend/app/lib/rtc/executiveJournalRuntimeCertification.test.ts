/**
 * RTC-2:9 — Executive Journal Runtime Certification Tests.
 *
 * Deterministic coverage for fail-closed release-readiness certification.
 * No mocks. No randomness. No network. No CI/CD. No deployment.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { ExecutiveJournalRuntimeAssurance } from "./executiveJournalRuntimeAssurance.ts";
import * as CertificationModule from "./executiveJournalRuntimeCertification.ts";
import {
  publicIndexId,
  publicIndexReadiness,
} from "./executiveContextRuntimePublicIndex.ts";
import {
  certifyExecutiveJournalRuntime,
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc210,
  ExecutiveJournalRuntimeCertification,
  ExecutiveJournalRuntimeCertificationId,
  ExecutiveJournalRuntimeCertificationName,
  ExecutiveJournalRuntimeCertificationNamespace,
  ExecutiveJournalRuntimeCertificationNextPhaseDecisionRequired,
  ExecutiveJournalRuntimeCertificationReadiness,
  ExecutiveJournalRuntimeCertificationSequenceTerminatedAtRtc29,
  ExecutiveJournalRuntimeCertificationStatus,
  ExecutiveJournalRuntimeCertificationVersion,
  ExecutiveJournalRuntimeHumanAuthorizationRtc2Auth2026072501,
  getExecutiveJournalRuntimeCertificationSummary,
  isExecutiveJournalRuntimeCertificationNotReady,
  isExecutiveJournalRuntimeReadyForAuthorization,
  validateExecutiveJournalCertificationGateCatalogue,
} from "./executiveJournalRuntimeCertification.ts";
import {
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
  ExecutiveJournalRuntimeExecution,
} from "./executiveJournalRuntimeExecution.ts";
import type {
  ExecutiveJournalRuntimeCertificationEvidencePackage,
  ExecutiveJournalRuntimeCertificationException,
  ExecutiveJournalRuntimeCertificationOpenIssue,
  ExecutiveJournalRuntimePhaseIdentityEvidence,
  ExecutiveJournalRuntimeTestSuiteEvidence,
} from "./executiveJournalRuntimeCertificationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const RTC29_FILES = Object.freeze([
  "executiveJournalRuntimeCertification.ts",
  "executiveJournalRuntimeCertificationTypes.ts",
  "executiveJournalRuntimeCertificationIdentity.ts",
  "executiveJournalRuntimeCertificationLifecycle.ts",
  "executiveJournalRuntimeCertificationContracts.ts",
  "executiveJournalRuntimeCertificationRules.ts",
  "executiveJournalRuntimeCertificationMetadata.ts",
  "executiveJournalRuntimeCertification.test.ts",
]);

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from ["']\.\.\//,
  /from ["']react["']/,
  /from ["']react\//,
  /from ["']next["']/,
  /from ["']next\//,
  /from ["'][^"']*\/(engine|app-context|assistant|eil|bus|ops|dkl|nea|decision-journal|ex)\//,
  /from ["']\.\/executiveJournalRuntimeFoundation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeRegistry\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeModel\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeValidation\.ts["']/,
  /from ["']\.\/executiveJournalRuntimePolicy\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeEnforcement\.ts["']/,
  /from ["']\.\/executiveJournalRuntimeExecution\.ts["']/,
  /from ["']\.\/executiveContext/,
  /from ["']node:net["']/,
  /from ["']node:http["']/,
  /from ["']node:fs["']/,
]);

const PHASES: readonly ExecutiveJournalRuntimePhaseIdentityEvidence[] = Object
  .freeze([
    Object.freeze({
      phaseId: "RTC-2:1",
      identity: "RTC-2:1/ExecutiveJournalRuntimeFoundation",
      namespace: "nexora.rtc.executive.journal.foundation",
      readiness: "ReadyForRegistry",
    }),
    Object.freeze({
      phaseId: "RTC-2:2",
      identity: "RTC-2:2/ExecutiveJournalRuntimeRegistry",
      namespace: "nexora.rtc.executive.journal.registry",
      readiness: "ReadyForModel",
    }),
    Object.freeze({
      phaseId: "RTC-2:3",
      identity: "RTC-2:3/ExecutiveJournalRuntimeModel",
      namespace: "nexora.rtc.executive.journal.model",
      readiness: "ReadyForValidation",
    }),
    Object.freeze({
      phaseId: "RTC-2:4",
      identity: "RTC-2:4/ExecutiveJournalRuntimeValidation",
      namespace: "nexora.rtc.executive.journal.validation",
      readiness: "ReadyForManifest",
    }),
    Object.freeze({
      phaseId: "RTC-2:5",
      identity: "RTC-2:5/ExecutiveJournalRuntimePolicy",
      namespace: "nexora.rtc.executive.journal.policy",
      readiness: "ReadyForPlatform",
    }),
    Object.freeze({
      phaseId: "RTC-2:6",
      identity: "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement",
      namespace: "nexora.rtc.executive.journal.enforcement",
      readiness: "ReadyForCertification",
    }),
    Object.freeze({
      phaseId: "RTC-2:7",
      identity: "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
      namespace: "nexora.rtc.executive.journal.execution",
      readiness: "ReadyForAssurance",
    }),
    Object.freeze({
      phaseId: "RTC-2:8",
      identity: "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance",
      namespace: "nexora.rtc.executive.journal.assurance",
      readiness: "ReadyForCertification",
    }),
  ]);

const SUITES: readonly ExecutiveJournalRuntimeTestSuiteEvidence[] = Object
  .freeze(
    [
      "RTC-2:1",
      "RTC-2:2",
      "RTC-2:3",
      "RTC-2:4",
      "RTC-2:5",
      "RTC-2:6",
      "RTC-2:7",
      "RTC-2:8",
      "RTC-1:9",
    ].map((suiteId) =>
      Object.freeze({ suiteId, passed: true, present: true })
    ),
  );

const OPEN_ISSUES: readonly ExecutiveJournalRuntimeCertificationOpenIssue[] =
  Object.freeze([
    Object.freeze({
      issueId: "OI-01",
      issue: "Which executive actions become official by default",
      accountableOwner: "Records / legal",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
    Object.freeze({
      issueId: "OI-02",
      issue: "Private-entry retention and succession",
      accountableOwner: "Privacy + legal",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
    Object.freeze({
      issueId: "OI-03",
      issue: "Authority-registry source and latency",
      accountableOwner: "Executive governance",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
    Object.freeze({
      issueId: "OI-04",
      issue: "Jurisdiction and key residency",
      accountableOwner: "Privacy + security",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
    Object.freeze({
      issueId: "OI-05",
      issue: "Evidence sources requiring preservation or pinning",
      accountableOwner: "Journal steward",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
    Object.freeze({
      issueId: "OI-06",
      issue: "Export formats, watermarking, and onward use",
      accountableOwner: "Policy authority",
      resolved: false as const,
      releaseEffect: "Unclassified" as const,
      releaseEffectAuthorityRef: null,
    }),
  ]);

const packageEvidence = (
  overrides: Partial<ExecutiveJournalRuntimeCertificationEvidencePackage> = {},
): ExecutiveJournalRuntimeCertificationEvidencePackage =>
  Object.freeze({
    packageId: "pkg-1",
    candidateIdentity: "RTC-2/ExecutiveJournalRuntime",
    candidateVersion: "1.0.0",
    assuranceResultKind: "Reconciled",
    assuranceResultRef: "asr-reconciled-1",
    phaseIdentities: PHASES,
    testSuites: SUITES,
    typescriptPassed: true,
    eslintZeroWarnings: true,
    dependencyBoundaryOk: true,
    determinismOk: true,
    immutabilityOk: true,
    appendOnlyOk: true,
    authorityBoundaryOk: true,
    aiBoundaryOk: true,
    privateReflectionIsolationOk: true,
    disclosureFailClosedOk: true,
    telemetryPayloadExcludedOk: true,
    idempotencyOk: true,
    sequenceContinuityOk: true,
    atomicityOk: true,
    integrityEvidenceOk: true,
    replayRecoveryOk: true,
    replayRecoveryRequired: false,
    openIssues: OPEN_ISSUES,
    exceptions: Object.freeze([]),
    accountableOwnerRefs: Object.freeze(["owner-1"]),
    evidencePackageDigest: "digest-pkg-1",
    claimsDeploymentAuthorization: false,
    claimsLegalApproval: false,
    claimsPrivacyApproval: false,
    claimsRecordsPolicyApproval: false,
    claimsAiApproval: false,
    evaluationTime: "2026-07-25T00:00:00Z",
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
    ...overrides,
  });

const exception = (
  overrides: Partial<ExecutiveJournalRuntimeCertificationException> = {},
): ExecutiveJournalRuntimeCertificationException =>
  Object.freeze({
    exceptionId: "ex-1",
    affectedGateId: "G-05",
    rationale: "temporary toolchain lag",
    accountableOwner: "platform-owner",
    approvingAuthorityRef: "authority-cert-1",
    approvingActorKind: "Human",
    compensatingControl: "manual tsc verification",
    scope: "candidate-1.0.0",
    expiry: "2026-08-01T00:00:00Z",
    reviewRequired: true as const,
    evidenceRef: "exception-evidence-1",
    approved: true,
    metadataOnly: true as const,
    immutable: true as const,
    ...overrides,
  });

const mutateFrozen = (value: object): boolean => {
  try {
    Reflect.set(value, "__mutation_probe__", true);
    return Reflect.has(value, "__mutation_probe__");
  } catch {
    return false;
  }
};

describe("RTC-2:9 Executive Journal Runtime Certification", () => {
  it("1-4: exact identity, namespace, status, and ReadyForConsumer readiness", () => {
    assert.equal(RTC29_FILES.length, 8);
    const present = readdirSync(HERE);
    for (const file of RTC29_FILES) {
      assert.ok(present.includes(file), `missing ${file}`);
    }
    assert.equal(
      ExecutiveJournalRuntimeCertificationId,
      "RTC-2:9/ExecutiveJournalRuntimeCertification",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertificationNamespace,
      "nexora.rtc.executive.journal.certification",
    );
    assert.equal(ExecutiveJournalRuntimeCertificationStatus, "Certification");
    assert.equal(
      ExecutiveJournalRuntimeCertificationReadiness,
      "ReadyForConsumer",
    );
    assert.equal(ExecutiveJournalRuntimeCertificationVersion, "1.0.0");
    assert.equal(
      ExecutiveJournalRuntimeCertificationName,
      "Executive Journal Runtime Certification & Release Readiness",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertificationNextPhaseDecisionRequired,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.nextPhaseDecisionRequired,
      true,
    );
    assert.equal(
      "nextPhase" in ExecutiveJournalRuntimeCertification,
      false,
    );
    assert.ok(
      !JSON.stringify(getExecutiveJournalRuntimeCertificationSummary())
        .includes("RTC-2:10"),
    );
    assert.ok("certifyExecutiveJournalRuntime" in CertificationModule);
  });

  it("AD-RTC2-07 lifecycle ordering is deterministic through RTC-2:9", () => {
    assert.equal(
      ExecutiveJournalRuntimeExecution.status,
      "ExecutionContract",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.readiness,
      "ReadyForAssurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeExecution.nextPhase,
      "RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.status,
      "Assurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.readiness,
      "ReadyForCertification",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.previousPhase,
      "RTC-2:7 — Executive Journal Runtime Execution Contract",
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.nextPhase,
      "RTC-2:9 — Executive Journal Runtime Certification & Release Readiness",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.assurance,
      ExecutiveJournalRuntimeAssurance,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.readiness,
      "ReadyForConsumer",
    );
    assert.equal(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.decisionId,
      "AD-RTC2-07",
    );
    assert.deepEqual(
      [
        ExecutiveJournalRuntimeExecution.readiness,
        ExecutiveJournalRuntimeAssurance.readiness,
        ExecutiveJournalRuntimeCertification.readiness,
      ],
      [
        "ReadyForAssurance",
        "ReadyForCertification",
        "ReadyForConsumer",
      ],
    );
  });

  it("RTC2-AUTH-2026-07-25-01 and AD-RTC2-10 Option A terminate at RTC-2:9", () => {
    const auth = ExecutiveJournalRuntimeHumanAuthorizationRtc2Auth2026072501;
    assert.equal(auth.authorizationId, "RTC2-AUTH-2026-07-25-01");
    assert.equal(auth.authorizingHuman, "Bahadoor");
    assert.equal(
      auth.authorityBasis,
      "Project Owner and final architecture decision-maker",
    );
    assert.equal(auth.effectiveDate, "2026-07-25");
    assert.equal(
      auth.subject,
      "NPA-T — RTC-2:1 through RTC-2:9 — Executive Journal Runtime",
    );
    assert.equal(auth.decision, "Approved");
    assert.equal(auth.result, "AuthorizedForMetadataConsumption");
    assert.notEqual(auth.result, "AuthorizedForConsumerIntegration");
    assert.equal(auth.allowsMetadataConsumption, true);
    assert.equal(auth.allowsUiIntegration, false);
    assert.equal(auth.allowsApp8Integration, false);
    assert.equal(auth.allowsNetworkIntegration, false);
    assert.equal(auth.allowsPersistenceIntegration, false);
    assert.equal(auth.allowsPublicIndexPublication, false);
    assert.equal(auth.allowsProductionActivation, false);
    assert.equal(auth.deploymentAuthorized, false);
    assert.equal(auth.createsRtc210, false);
    assert.equal(auth.modifiesRtc19, false);
    assert.equal(auth.immutable, true);
    assert.equal(mutateFrozen(auth), false);
    assert.ok(
      auth.fullProjectTypeScriptDisclosure.includes(
        "947 diagnostics outside RTC-2",
      ),
    );
    assert.ok(
      auth.certificationEvidenceReference.includes("ReadyForAuthorization"),
    );
    assert.deepEqual([...auth.architectureDecisionsAccepted], [
      "AD-RTC2-07",
      "AD-RTC2-10",
    ]);
    assert.deepEqual([...auth.openIssuesRemainUnresolved], [
      "OI-01",
      "OI-02",
      "OI-03",
      "OI-04",
      "OI-05",
      "OI-06",
    ]);
    assert.ok(auth.scope.includes("Acceptance of AD-RTC2-10 — Option A"));
    assert.ok(
      auth.scope.some((item) => item.includes("Metadata-only consumption")),
    );
    assert.ok(auth.prohibited.includes("Creation of RTC-2:10"));
    assert.ok(auth.prohibited.includes("Production deployment"));
    assert.ok(auth.prohibited.includes("Production activation"));
    assert.ok(auth.prohibited.includes("UI integration"));
    assert.ok(auth.prohibited.includes("APP-8 integration"));
    assert.ok(auth.prohibited.includes("Network integration"));
    assert.ok(auth.prohibited.includes("Persistence integration"));
    assert.ok(auth.prohibited.includes("Public Index publication"));

    const ad = ExecutiveJournalRuntimeArchitectureDecisionAdrtc210;
    assert.equal(ad.decisionId, "AD-RTC2-10");
    assert.equal(ad.status, "Accepted");
    assert.equal(ad.selectedOption, "A");
    assert.equal(
      ad.title,
      "Terminate RTC-2 sequence at certified consumer-ready metadata",
    );
    assert.equal(ad.createsRtc210, false);
    assert.equal(ad.preservesAdrtc207, true);
    assert.equal(ad.authorizationId, "RTC2-AUTH-2026-07-25-01");
    assert.equal(ad.immutable, true);
    assert.equal(mutateFrozen(ad), false);
    assert.ok(ad.decision.includes("RTC-2:10 will not be created"));
    assert.deepEqual([...ad.alternativesConsidered], ["A", "B", "C", "D"]);

    assert.equal(
      ExecutiveJournalRuntimeCertificationSequenceTerminatedAtRtc29,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.sequenceTerminatedAtRtc29,
      true,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertificationNextPhaseDecisionRequired,
      true,
    );
    assert.equal(ExecutiveJournalRuntimeCertification.createsRtc210, false);
    assert.equal(
      ExecutiveJournalRuntimeCertification.deploymentAuthorized,
      false,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.authorizesDeployment,
      false,
    );
    assert.equal(ExecutiveJournalRuntimeCertification.modifiesRtc19, false);
    assert.equal(
      ExecutiveJournalRuntimeCertification.humanAuthorization,
      auth,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.architectureDecisionAdrtc210,
      ad,
    );
    assert.equal(
      ExecutiveJournalRuntimeArchitectureDecisionAdrtc207.decisionId,
      "AD-RTC2-07",
    );
    assert.equal(
      publicIndexId,
      "RTC-1:9/ExecutiveContextRuntimePublicIndex",
    );
    assert.equal(publicIndexReadiness, "ReadyForConsumer");

    const summary = getExecutiveJournalRuntimeCertificationSummary();
    assert.equal(summary.authorizationId, "RTC2-AUTH-2026-07-25-01");
    assert.equal(
      summary.authorizationResult,
      "AuthorizedForMetadataConsumption",
    );
    assert.notEqual(
      summary.authorizationResult,
      "AuthorizedForConsumerIntegration",
    );
    assert.deepEqual([...summary.architectureDecisionIds], ["AD-RTC2-10"]);
    assert.equal(summary.deploymentAuthorized, false);
    assert.equal(summary.createsRtc210, false);
    assert.equal(summary.sequenceTerminatedAtRtc29, true);
    assert.ok(!JSON.stringify(summary).includes("RTC-2:10 —"));

    const journalPublicIndexFiles = readdirSync(HERE).filter((name) =>
      /executiveJournal.*PublicIndex/i.test(name)
    );
    assert.deepEqual(journalPublicIndexFiles, []);

    assert.ok(
      ExecutiveJournalRuntimeCertification.openIssues.every(
        (issue) => issue.resolved === false,
      ),
    );
    assert.deepEqual(
      ExecutiveJournalRuntimeCertification.openIssues.map(
        (issue) => issue.accountableOwner,
      ),
      [
        "Records / legal",
        "Privacy + legal",
        "Executive governance",
        "Privacy + security",
        "Journal steward",
        "Policy authority",
      ],
    );
  });

  it("5-6: imports RTC-2:8 by reference and preserves upstream chain", () => {
    assert.equal(
      ExecutiveJournalRuntimeCertification.assurance,
      ExecutiveJournalRuntimeAssurance,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.assurance,
      "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.execution,
      "RTC-2:7/ExecutiveJournalRuntimeExecutionContract",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.enforcement,
      "RTC-2:6/ExecutiveJournalRuntimePolicyEnforcement",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.policy,
      "RTC-2:5/ExecutiveJournalRuntimePolicy",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.validation,
      "RTC-2:4/ExecutiveJournalRuntimeValidation",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.model,
      "RTC-2:3/ExecutiveJournalRuntimeModel",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.registry,
      "RTC-2:2/ExecutiveJournalRuntimeRegistry",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.upstreamChain.foundation,
      "RTC-2:1/ExecutiveJournalRuntimeFoundation",
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.aiMustNot,
      ExecutiveJournalRuntimeAssurance.aiMustNot,
    );
    assert.equal(
      ExecutiveJournalRuntimeAssurance.readiness,
      "ReadyForCertification",
    );
  });

  it("7-8: complete evidence ReadyForAuthorization; never deployment auth", () => {
    const result = certifyExecutiveJournalRuntime(packageEvidence());
    assert.equal(result.kind, "ReadyForAuthorization");
    assert.equal(isExecutiveJournalRuntimeReadyForAuthorization(result), true);
    assert.equal(result.authorizesDeployment, false);
    assert.equal(result.manifest.isDeploymentAuthorization, false);
    assert.equal(result.manifest.requiresHumanAuthorization, true);
    assert.equal(result.manifest.canBeApprovedByAi, false);
    if (result.kind === "ReadyForAuthorization") {
      assert.equal(result.requiresHumanAuthorization, true);
    }
  });

  it("9-11: missing/failed/not-evaluated mandatory evidence NotReady", () => {
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ packageId: "" }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      isExecutiveJournalRuntimeCertificationNotReady(
        certifyExecutiveJournalRuntime(
          packageEvidence({ typescriptPassed: false }),
        ),
      ),
      true,
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ typescriptPassed: null }),
      ).kind,
      "NotReady",
    );
  });

  it("12-18: exceptions produce ConditionallyReady or Fail", () => {
    const conditional = certifyExecutiveJournalRuntime(
      packageEvidence({
        typescriptPassed: false,
        exceptions: Object.freeze([exception()]),
      }),
    );
    assert.equal(conditional.kind, "ConditionallyReady");
    assert.equal(conditional.authorizesDeployment, false);

    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          exceptions: Object.freeze([exception({ accountableOwner: "" })]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          exceptions: Object.freeze([exception({ approved: false })]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          exceptions: Object.freeze([
            exception({ compensatingControl: "" }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          exceptions: Object.freeze([exception({ expiry: "" })]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          evaluationTime: "2026-08-02T00:00:00Z",
          exceptions: Object.freeze([exception()]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          aiBoundaryOk: false,
          exceptions: Object.freeze([
            exception({ affectedGateId: "G-10" }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
  });

  it("19-21: divergent/invalid/indeterminate assurance NotReady", () => {
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ assuranceResultKind: "Divergent" }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ assuranceResultKind: "Invalid" }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ assuranceResultKind: "Indeterminate" }),
      ).kind,
      "NotReady",
    );
  });

  it("22-28: identity, readiness, tests, tsc, eslint failures", () => {
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          phaseIdentities: Object.freeze(PHASES.slice(1)),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          phaseIdentities: Object.freeze([
            ...PHASES.slice(0, 7),
            Object.freeze({
              ...PHASES[7]!,
              namespace: "wrong.namespace",
            }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          phaseIdentities: Object.freeze([
            ...PHASES.slice(0, 7),
            Object.freeze({
              ...PHASES[7]!,
              readiness: "ReadyForPublicIndex",
            }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          testSuites: Object.freeze(SUITES.slice(0, 5)),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          testSuites: Object.freeze([
            ...SUITES.slice(0, 8),
            Object.freeze({ suiteId: "RTC-1:9", passed: false, present: true }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ typescriptPassed: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ eslintZeroWarnings: false }),
      ).kind,
      "NotReady",
    );
  });

  it("29-34: non-waivable boundary failures", () => {
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ dependencyBoundaryOk: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ appendOnlyOk: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ aiBoundaryOk: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ privateReflectionIsolationOk: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ disclosureFailClosedOk: false }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ telemetryPayloadExcludedOk: false }),
      ).kind,
      "NotReady",
    );
  });

  it("35-37: AI cannot approve exception or authorize release", () => {
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          typescriptPassed: false,
          exceptions: Object.freeze([
            exception({ approvingActorKind: "Ai" }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({ claimsAiApproval: true }),
      ).kind,
      "NotReady",
    );
    const ready = certifyExecutiveJournalRuntime(packageEvidence());
    assert.equal(ready.kind, "ReadyForAuthorization");
    assert.equal(ready.manifest.requiresHumanAuthorization, true);
    assert.equal(ready.authorizesDeployment, false);
  });

  it("38-40: open issues unresolved, owners unchanged, no silent classification", () => {
    const result = certifyExecutiveJournalRuntime(packageEvidence());
    assert.deepEqual([...result.manifest.openIssueIds], [
      "OI-01",
      "OI-02",
      "OI-03",
      "OI-04",
      "OI-05",
      "OI-06",
    ]);
    assert.ok(
      ExecutiveJournalRuntimeCertification.openIssues.every(
        (item) =>
          item.resolved === false
          && item.resolvedByCertification === false
          && item.releaseEffect === "Unclassified",
      ),
    );
    assert.equal(
      certifyExecutiveJournalRuntime(
        packageEvidence({
          openIssues: Object.freeze([
            ...OPEN_ISSUES.slice(0, 5),
            Object.freeze({
              ...OPEN_ISSUES[5]!,
              releaseEffect: "ReleaseBlocking" as const,
              releaseEffectAuthorityRef: null,
            }),
          ]),
        }),
      ).kind,
      "NotReady",
    );
  });

  it("41-45: precedence, ordering, determinism, immutability", () => {
    assert.deepEqual(
      [...ExecutiveJournalRuntimeCertification.lifecycle.precedence],
      ["NotReady", "ConditionallyReady", "ReadyForAuthorization"],
    );
    const first = certifyExecutiveJournalRuntime(packageEvidence());
    const second = certifyExecutiveJournalRuntime(packageEvidence());
    assert.deepEqual(first, second);
    const orders = first.gateResults.map((item) => item.order);
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
    const input = packageEvidence();
    const before = JSON.stringify(input);
    const assessed = certifyExecutiveJournalRuntime(input);
    assert.equal(JSON.stringify(input), before);
    assert.equal(mutateFrozen(assessed), false);
    assert.equal(mutateFrozen(assessed.manifest), false);
    assert.equal(
      mutateFrozen(getExecutiveJournalRuntimeCertificationSummary()),
      false,
    );
    assert.equal(mutateFrozen(ExecutiveJournalRuntimeCertification), false);
  });

  it("46: no prohibited imports exist in RTC-2:9 files", () => {
    for (const file of RTC29_FILES) {
      if (file.endsWith(".test.ts")) {
        continue;
      }
      const source = readFileSync(`${HERE}/${file}`, "utf8");
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        assert.equal(
          pattern.test(source),
          false,
          `${file} matches prohibited import ${pattern}`,
        );
      }
    }
    const aggregate = readFileSync(
      `${HERE}/executiveJournalRuntimeCertification.ts`,
      "utf8",
    );
    assert.ok(
      aggregate.includes('from "./executiveJournalRuntimeAssurance.ts"'),
    );
    assert.ok(
      !aggregate.includes('from "./executiveJournalRuntimeExecution.ts"'),
    );
  });

  it("47: gate catalogue complete; evaluate-only; no deployment auth", () => {
    assert.equal(validateExecutiveJournalCertificationGateCatalogue(), true);
    assert.equal(ExecutiveJournalRuntimeCertification.evaluatesOnly, true);
    assert.equal(
      ExecutiveJournalRuntimeCertification.authorizesDeployment,
      false,
    );
    assert.equal(
      ExecutiveJournalRuntimeCertification.nonWaivableGateIds.length,
      9,
    );
  });
});
