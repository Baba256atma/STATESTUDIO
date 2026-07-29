/**
 * RTC-3:9 — Executive Decision Register Certification tests.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { ExecutiveDecisionRegisterAssurance } from "./executiveDecisionRegisterAssurance.ts";
import {
  ARCHITECTURE_DECISION_COVERAGE,
  AUTHORIZATION_BOUNDARY_COVERAGE,
  CERTIFICATION_GATE_COVERAGE,
  CERTIFICATION_RESULT_COVERAGE,
  EVIDENCE_KIND_COVERAGE,
  ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  ExecutiveDecisionRegisterCertification,
  ExecutiveDecisionRegisterCertificationApprovedAliases,
  ExecutiveDecisionRegisterCertificationGateIds,
  ExecutiveDecisionRegisterCertificationGates,
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationIdentity,
  ExecutiveDecisionRegisterCertificationNamespace,
  ExecutiveDecisionRegisterCertificationPreviousPhase,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationStatus,
  GATE_CRITICALITY_COVERAGE,
  GATE_RESULT_COVERAGE,
  MANIFEST_CLASSIFICATION_FIELD_COVERAGE,
  MANIFEST_FIELD_COVERAGE,
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  assertExecutiveDecisionRegisterCertificationAlias,
  assertExecutiveDecisionRegisterCertificationGateCriticality,
  assertExecutiveDecisionRegisterCertificationIdentity,
  certifyExecutiveDecisionRegister,
  getExecutiveDecisionRegisterCertificationSummary,
  validateExecutiveDecisionRegisterCertificationCoverage,
} from "./executiveDecisionRegisterCertification.ts";
import type {
  ExecutiveDecisionRegisterCertificationEvidencePackage,
  ExecutiveDecisionRegisterCertificationGateEvidence,
  ExecutiveDecisionRegisterCertificationGateId,
  ExecutiveDecisionRegisterCertificationTestSuiteEvidence,
} from "./executiveDecisionRegisterCertificationTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const REQUIRED_FILES = Object.freeze([
  "executiveDecisionRegisterCertification.ts",
  "executiveDecisionRegisterCertificationTypes.ts",
  "executiveDecisionRegisterCertificationIdentity.ts",
  "executiveDecisionRegisterCertificationLifecycle.ts",
  "executiveDecisionRegisterCertificationContracts.ts",
  "executiveDecisionRegisterCertificationRules.ts",
  "executiveDecisionRegisterCertificationMetadata.ts",
  "executiveDecisionRegisterCertification.test.ts",
] as const);

const GATE_EVIDENCE_KIND: Record<
  ExecutiveDecisionRegisterCertificationGateId,
  ExecutiveDecisionRegisterCertificationGateEvidence["evidenceKind"]
> = {
  "G-01": "TestSuiteEvidence",
  "G-02": "TestSuiteEvidence",
  "G-03": "TestSuiteEvidence",
  "G-04": "TestSuiteEvidence",
  "G-05": "TestSuiteEvidence",
  "G-06": "TestSuiteEvidence",
  "G-07": "TestSuiteEvidence",
  "G-08": "TestSuiteEvidence",
  "G-09": "TestSuiteEvidence",
  "G-10": "TestSuiteEvidence",
  "G-11": "TestSuiteEvidence",
  "G-12": "TypeScriptEvidence",
  "G-13": "TypeScriptEvidence",
  "G-14": "EslintEvidence",
  "G-15": "DependencyBoundaryEvidence",
  "G-16": "UpstreamReferenceEvidence",
  "G-17": "CoverageCompletenessEvidence",
  "G-18": "AiProhibitionEvidence",
  "G-19": "ControlPreservationEvidence",
  "G-20": "OpenIssueEvidence",
  "G-21": "ArchitectureDecisionEvidence",
  "G-22": "SideEffectBoundaryEvidence",
  "G-23": "NoNextPhaseEvidence",
  "G-24": "FullProjectTypeScriptEvidence",
};

const suite = (
  suiteId: string,
  overrides: Partial<ExecutiveDecisionRegisterCertificationTestSuiteEvidence> = {},
): ExecutiveDecisionRegisterCertificationTestSuiteEvidence =>
  Object.freeze({
    suiteId,
    present: true,
    passed: true,
    testCount: 1,
    passCount: 1,
    failCount: 0,
    ...overrides,
  });

const gateEvidence = (
  gateId: ExecutiveDecisionRegisterCertificationGateId,
  overrides: Partial<ExecutiveDecisionRegisterCertificationGateEvidence> = {},
): ExecutiveDecisionRegisterCertificationGateEvidence =>
  Object.freeze({
    evidenceId: `ev-${gateId}`,
    evidenceKind: GATE_EVIDENCE_KIND[gateId],
    evidenceSource: `source-${gateId}`,
    commandOrInspection: `inspect-${gateId}`,
    scope: "RTC-3",
    diagnosticsCount: 0,
    rtc3DiagnosticsCount: 0,
    notes: `notes-${gateId}`,
    evaluationTimestampDescriptor: null,
    passed: true,
    metadataOnly: true as const,
    immutable: true as const,
    ...overrides,
  });

const allGateEvidence = (
  overrides: Partial<
    Record<
      ExecutiveDecisionRegisterCertificationGateId,
      ExecutiveDecisionRegisterCertificationGateEvidence
    >
  > = {},
): ExecutiveDecisionRegisterCertificationEvidencePackage["gateEvidence"] => {
  const entries = ExecutiveDecisionRegisterCertificationGateIds.map((gateId) => [
    gateId,
    overrides[gateId] ?? gateEvidence(gateId),
  ]);
  return Object.freeze(Object.fromEntries(entries)) as
    ExecutiveDecisionRegisterCertificationEvidencePackage["gateEvidence"];
};

const packageEvidence = (
  overrides: Partial<ExecutiveDecisionRegisterCertificationEvidencePackage> = {},
): ExecutiveDecisionRegisterCertificationEvidencePackage => {
  const base: ExecutiveDecisionRegisterCertificationEvidencePackage = {
    packageId: "pkg-rtc3-9-1",
    evidenceDigest: "digest-rtc3-9-1",
    assuranceResultKind: "Assured",
    assuranceIdentity: "RTC-3:8/ExecutiveDecisionRegisterAssurance",
    assuranceAggregateExactReference: true,
    assuranceErrorOrCriticalFindings: 0,
    assuranceIndeterminateUnresolved: false,
    assuranceCoverageComplete: true,
    testSuites: Object.freeze([
      suite("RTC-3:1"),
      suite("RTC-3:2"),
      suite("RTC-3:3"),
      suite("RTC-3:4"),
      suite("RTC-3:5"),
      suite("RTC-3:6"),
      suite("RTC-3:7"),
      suite("RTC-3:8"),
      suite("RTC-3:9"),
      suite("RTC-2:9"),
      suite("RTC-1:9"),
    ]),
    typeScript: Object.freeze({
      scopedSourcesAndTestsPassed: true,
      productionSourcesPassed: true,
      fullProjectCommand:
        'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
      fullProjectExitCode: 2,
      fullProjectCompleted: true,
      fullProjectDiagnosticsCount: 947,
      fullProjectRtc3DiagnosticsCount: 0,
      fullProjectRunnerCrash: false,
      fullProjectClassification: "Fail",
    }),
    // Default G-24 evidence retains truthful full-project Fail (947 / 0).

    eslintExitCode: 0,
    eslintErrorCount: 0,
    eslintWarningCount: 0,
    dependencyBoundaryOk: true,
    upstreamReferencesExact: true,
    coverageTablesComplete: true,
    aiProhibitionsPreserved: true,
    controlsPreserved: true,
    openIssuesUnresolvedUnchanged: true,
    architectureDecisionsPreserved: true,
    sideEffectFlagsFalse: true,
    noRtc310Files: true,
    noInventedNextPhase: true,
    gateEvidence: allGateEvidence({
      "G-24": gateEvidence("G-24", {
        diagnosticsCount: 947,
        rtc3DiagnosticsCount: 0,
        notes:
          "Full-project compiler diagnostics present outside RTC-3 scope",
        commandOrInspection:
          'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
      }),
    }),
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  };
  return Object.freeze({
    ...base,
    ...overrides,
    typeScript: Object.freeze({
      ...base.typeScript,
      ...(overrides.typeScript ?? {}),
    }),
    testSuites: Object.freeze(
      overrides.testSuites
        ? [...overrides.testSuites]
        : [...base.testSuites],
    ),
    gateEvidence: overrides.gateEvidence ?? base.gateEvidence,
  });
};

const mutateFrozen = (value: object): boolean => {
  try {
    (value as { mutated?: boolean }).mutated = true;
    return "mutated" in value;
  } catch {
    return false;
  }
};

const gateResultOf = (
  result: ReturnType<typeof certifyExecutiveDecisionRegister>,
  gateId: ExecutiveDecisionRegisterCertificationGateId,
) => {
  const found = result.gateResults.find((item) => item.gateId === gateId);
  assert.ok(found, `missing gate ${gateId}`);
  return found;
};

describe("RTC-3:9 — Executive Decision Register Certification", () => {
  describe("identity and references", () => {
    it("exposes exact identity, namespace, status, readiness, and aliases", () => {
      for (const file of REQUIRED_FILES) {
        assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
      }
      assert.equal(
        ExecutiveDecisionRegisterCertificationId,
        "RTC-3:9/ExecutiveDecisionRegisterCertification",
      );
      assert.equal(
        ExecutiveDecisionRegisterCertificationNamespace,
        "nexora.rtc.executive.decision.register.certification",
      );
      assert.equal(ExecutiveDecisionRegisterCertificationStatus, "Certification");
      assert.equal(
        ExecutiveDecisionRegisterCertificationReadiness,
        "ReadyForConsumer",
      );
      assert.equal(
        ExecutiveDecisionRegisterCertificationPreviousPhase,
        "RTC-3:8 — Executive Decision Register Reconciliation & Assurance",
      );
      assert.deepEqual(
        [...ExecutiveDecisionRegisterCertificationApprovedAliases],
        ["ExecutiveDecisionRegisterCertification", "RTC-3:9"],
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.nextPhaseDecisionRequired,
        true,
      );
      assert.equal(ExecutiveDecisionRegisterCertification.nextPhase, null);
      assert.equal(
        assertExecutiveDecisionRegisterCertificationIdentity(
          ExecutiveDecisionRegisterCertificationId,
        ),
        ExecutiveDecisionRegisterCertificationId,
      );
      assert.equal(
        assertExecutiveDecisionRegisterCertificationAlias("RTC-3:9"),
        "RTC-3:9",
      );
    });

    it("fails closed on malformed and unknown identities", () => {
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationIdentity(
          "rtc-3:9/executivedecisionregistercertification",
        )
      );
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationIdentity(
          " RTC-3:9/ExecutiveDecisionRegisterCertification ",
        )
      );
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationIdentity("RTC-3:9")
      );
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationAlias("rtc-3:9")
      );
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationAlias("RTC-3:10")
      );
    });

    it("preserves exact RTC-3:8 aggregate reference and reaches earlier phases only through assurance", () => {
      assert.equal(
        ExecutiveDecisionRegisterCertification.assurance,
        ExecutiveDecisionRegisterAssurance,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.execution,
        ExecutiveDecisionRegisterAssurance.execution,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.foundation,
        ExecutiveDecisionRegisterAssurance.foundation,
      );
      const certSrc = readFileSync(
        join(HERE, "executiveDecisionRegisterCertification.ts"),
        "utf8",
      );
      const rulesSrc = readFileSync(
        join(HERE, "executiveDecisionRegisterCertificationRules.ts"),
        "utf8",
      );
      const metaSrc = readFileSync(
        join(HERE, "executiveDecisionRegisterCertificationMetadata.ts"),
        "utf8",
      );
      for (const src of [certSrc, rulesSrc, metaSrc]) {
        assert.equal(
          /from "\.\/executiveDecisionRegister(Foundation|Registry|Model|Validation|Policy|Enforcement|Execution)\.ts"/.test(
            src,
          ),
          false,
        );
        assert.match(
          src,
          /from "\.\/executiveDecisionRegisterAssurance\.ts"/,
        );
      }
    });
  });

  describe("certification results", () => {
    it("returns ReadyForAuthorization when all mandatory policy gates pass", () => {
      const result = certifyExecutiveDecisionRegister(packageEvidence());
      assert.equal(result.kind, "ReadyForAuthorization");
      assert.equal(result.manifest.certificationResult, "ReadyForAuthorization");
      assert.equal(result.authorizesConsumption, false);
      assert.equal(result.authorizesIntegration, false);
      assert.equal(result.authorizesDeployment, false);
      if (result.kind === "ReadyForAuthorization") {
        assert.equal(result.requiresHumanAuthorization, true);
      }
    });

    it("returns NotReady when one gate Fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ eslintWarningCount: 1 }),
      );
      assert.equal(result.kind, "NotReady");
      assert.equal(gateResultOf(result, "G-14").result, "Fail");
    });

    it("returns NotReady when one mandatory gate is NotEvaluated", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ dependencyBoundaryOk: null }),
      );
      assert.equal(result.kind, "NotReady");
      assert.equal(gateResultOf(result, "G-15").result, "NotEvaluated");
    });

    it("preserves deterministic gate ordering across multiple failures", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          eslintWarningCount: 1,
          dependencyBoundaryOk: false,
          aiProhibitionsPreserved: false,
        }),
      );
      assert.deepEqual(
        result.gateResults.map((item) => item.gateId),
        [...ExecutiveDecisionRegisterCertificationGateIds],
      );
      const failed = result.gateResults.filter((item) => item.result === "Fail");
      assert.ok(failed.length >= 3);
      for (let i = 1; i < failed.length; i += 1) {
        assert.ok(failed[i]!.order > failed[i - 1]!.order);
      }
    });

    it("fails closed on unknown gate/result coverage divergence", () => {
      assert.equal(
        validateExecutiveDecisionRegisterCertificationCoverage(),
        true,
      );
      assert.deepEqual(
        [...CERTIFICATION_GATE_COVERAGE],
        [...ExecutiveDecisionRegisterCertificationGateIds],
      );
      assert.deepEqual(
        [...CERTIFICATION_RESULT_COVERAGE],
        ["NotReady", "ReadyForAuthorization"],
      );
      assert.deepEqual([...GATE_RESULT_COVERAGE], [
        "Pass",
        "Fail",
        "NotEvaluated",
      ]);
    });
  });

  describe("every gate", () => {
    const positive = certifyExecutiveDecisionRegister(packageEvidence());

    for (const declaration of ExecutiveDecisionRegisterCertificationGates) {
      it(`${declaration.gateId} has direct positive coverage`, () => {
        const gate = gateResultOf(positive, declaration.gateId);
        if (declaration.gateId === "G-24") {
          assert.equal(gate.criticality, "Disclosure");
          assert.equal(gate.result, "Fail");
          assert.equal(gate.diagnosticsCount, 947);
          assert.equal(gate.rtc3DiagnosticsCount, 0);
        } else {
          assert.equal(gate.criticality, "Blocking");
          assert.equal(gate.result, "Pass");
        }
        assert.equal(gate.gateId, declaration.gateId);
        assert.equal(gate.gateName, declaration.gateName);
        assert.equal(gate.immutable, true);
      });
    }

    it("G-01 negative: foundation suite fail", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          testSuites: Object.freeze([
            suite("RTC-3:1", { passed: false, failCount: 1, passCount: 0 }),
            suite("RTC-3:2"),
            suite("RTC-3:3"),
            suite("RTC-3:4"),
            suite("RTC-3:5"),
            suite("RTC-3:6"),
            suite("RTC-3:7"),
            suite("RTC-3:8"),
            suite("RTC-3:9"),
            suite("RTC-2:9"),
            suite("RTC-1:9"),
          ]),
        }),
      );
      assert.equal(gateResultOf(result, "G-01").result, "Fail");
      assert.equal(result.kind, "NotReady");
    });

    it("G-02 through G-08 negative missing suite evidence", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          testSuites: Object.freeze([
            suite("RTC-3:1"),
            suite("RTC-3:9"),
            suite("RTC-2:9"),
            suite("RTC-1:9"),
          ]),
        }),
      );
      for (const gateId of [
        "G-02",
        "G-03",
        "G-04",
        "G-05",
        "G-06",
        "G-07",
        "G-08",
      ] as const) {
        assert.equal(gateResultOf(result, gateId).result, "NotEvaluated");
      }
    });

    it("G-09 negative: incomplete regression", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          testSuites: Object.freeze([
            suite("RTC-3:1"),
            suite("RTC-2:9"),
            suite("RTC-1:9"),
          ]),
        }),
      );
      assert.equal(gateResultOf(result, "G-09").result, "NotEvaluated");
    });

    it("G-10 and G-11 negative", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          testSuites: Object.freeze([
            suite("RTC-3:1"),
            suite("RTC-3:2"),
            suite("RTC-3:3"),
            suite("RTC-3:4"),
            suite("RTC-3:5"),
            suite("RTC-3:6"),
            suite("RTC-3:7"),
            suite("RTC-3:8"),
            suite("RTC-3:9"),
            suite("RTC-2:9", { passed: false, failCount: 2 }),
            suite("RTC-1:9", { present: false, passed: false }),
          ]),
        }),
      );
      assert.equal(gateResultOf(result, "G-10").result, "Fail");
      assert.equal(gateResultOf(result, "G-11").result, "NotEvaluated");
    });

    it("G-12 and G-13 negative", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          typeScript: {
            scopedSourcesAndTestsPassed: false,
            productionSourcesPassed: false,
            fullProjectCommand: null,
            fullProjectExitCode: null,
            fullProjectCompleted: null,
            fullProjectDiagnosticsCount: null,
            fullProjectRtc3DiagnosticsCount: null,
            fullProjectRunnerCrash: false,
            fullProjectClassification: "NotEvaluatedEvidenceMissing",
          },
        }),
      );
      assert.equal(gateResultOf(result, "G-12").result, "Fail");
      assert.equal(gateResultOf(result, "G-13").result, "Fail");
      assert.equal(result.kind, "NotReady");
    });

    it("G-14 negative: warnings not allowed", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ eslintWarningCount: 1, eslintExitCode: 1 }),
      );
      assert.equal(gateResultOf(result, "G-14").result, "Fail");
    });

    it("G-15 through G-23 negatives", () => {
      const cases: Array<{
        readonly gateId: ExecutiveDecisionRegisterCertificationGateId;
        readonly overrides: Partial<
          ExecutiveDecisionRegisterCertificationEvidencePackage
        >;
        readonly expected: "Fail" | "NotEvaluated";
      }> = [
        {
          gateId: "G-15",
          overrides: { dependencyBoundaryOk: false },
          expected: "Fail",
        },
        {
          gateId: "G-16",
          overrides: { upstreamReferencesExact: false },
          expected: "Fail",
        },
        {
          gateId: "G-17",
          overrides: { coverageTablesComplete: null },
          expected: "NotEvaluated",
        },
        {
          gateId: "G-18",
          overrides: { aiProhibitionsPreserved: false },
          expected: "Fail",
        },
        {
          gateId: "G-19",
          overrides: { controlsPreserved: false },
          expected: "Fail",
        },
        {
          gateId: "G-20",
          overrides: { openIssuesUnresolvedUnchanged: false },
          expected: "Fail",
        },
        {
          gateId: "G-21",
          overrides: { architectureDecisionsPreserved: false },
          expected: "Fail",
        },
        {
          gateId: "G-22",
          overrides: { sideEffectFlagsFalse: false },
          expected: "Fail",
        },
        {
          gateId: "G-23",
          overrides: { noRtc310Files: false },
          expected: "Fail",
        },
      ];
      for (const item of cases) {
        const result = certifyExecutiveDecisionRegister(
          packageEvidence(item.overrides),
        );
        assert.equal(
          gateResultOf(result, item.gateId).result,
          item.expected,
          item.gateId,
        );
        assert.equal(result.kind, "NotReady", item.gateId);
      }
    });

    it("G-24 Disclosure Fail with zero RTC-3 diagnostics remains Fail and non-blocking under AD-RTC3-09", () => {
      const result = certifyExecutiveDecisionRegister(packageEvidence());
      assert.equal(gateResultOf(result, "G-24").criticality, "Disclosure");
      assert.equal(gateResultOf(result, "G-24").result, "Fail");
      assert.equal(gateResultOf(result, "G-24").diagnosticsCount, 947);
      assert.equal(gateResultOf(result, "G-24").rtc3DiagnosticsCount, 0);
      assert.equal(result.manifest.fullProjectClassification, "Fail");
      assert.equal(result.manifest.fullProjectDiagnosticsCount, 947);
      assert.equal(result.manifest.fullProjectRtc3DiagnosticsCount, 0);
      assert.equal(result.manifest.repositoryWideTypeScriptHealth, "not certified");
      assert.equal(result.manifest.rtc3ScopedTypeScriptHealth, "certified");
      assert.equal(SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION, true);
      assert.match(SCOPED_TYPESCRIPT_POLICY_SOURCE, /AD-RTC3-09/);
      assert.equal(result.kind, "ReadyForAuthorization");
    });

    it("G-24 Disclosure NotEvaluated runner crash remains NotEvaluated under AD-RTC3-09", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          typeScript: {
            scopedSourcesAndTestsPassed: true,
            productionSourcesPassed: true,
            fullProjectCommand:
              'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
            fullProjectExitCode: 134,
            fullProjectCompleted: false,
            fullProjectDiagnosticsCount: 0,
            fullProjectRtc3DiagnosticsCount: 0,
            fullProjectRunnerCrash: true,
            fullProjectClassification: "NotEvaluatedRunnerCrash",
          },
        }),
      );
      assert.equal(gateResultOf(result, "G-24").result, "NotEvaluated");
      assert.match(
        gateResultOf(result, "G-24").message,
        /Not evaluated because runner crash/,
      );
      assert.equal(result.kind, "ReadyForAuthorization");
    });
  });

  describe("assurance", () => {
    it("Assured + complete evidence may pass", () => {
      const result = certifyExecutiveDecisionRegister(packageEvidence());
      assert.equal(gateResultOf(result, "G-16").result, "Pass");
      assert.equal(result.kind, "ReadyForAuthorization");
    });

    it("NotAssured fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ assuranceResultKind: "NotAssured" }),
      );
      assert.equal(gateResultOf(result, "G-16").result, "Fail");
      assert.equal(result.kind, "NotReady");
    });

    it("Indeterminate fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ assuranceResultKind: "Indeterminate" }),
      );
      assert.equal(gateResultOf(result, "G-16").result, "Fail");
      assert.equal(result.kind, "NotReady");
    });

    it("assurance identity mismatch fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          assuranceIdentity: "RTC-3:8/WrongAssurance",
        }),
      );
      assert.equal(gateResultOf(result, "G-16").result, "Fail");
    });

    it("assurance reference mismatch fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ assuranceAggregateExactReference: false }),
      );
      assert.equal(gateResultOf(result, "G-16").result, "Fail");
    });

    it("unresolved Error or Critical finding fails", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({ assuranceErrorOrCriticalFindings: 2 }),
      );
      assert.equal(gateResultOf(result, "G-16").result, "Fail");
    });
  });

  describe("manifest", () => {
    it("is deterministic, immutable, complete, and authorization-safe", () => {
      const a = certifyExecutiveDecisionRegister(packageEvidence());
      const b = certifyExecutiveDecisionRegister(packageEvidence());
      assert.equal(a.manifest.summary, b.manifest.summary);
      assert.deepEqual(
        a.manifest.gateResults.map((item) => item.gateId),
        [...ExecutiveDecisionRegisterCertificationGateIds],
      );
      assert.equal(a.manifest.totalGateCount, 24);
      assert.equal(a.manifest.blockingGateCount, 23);
      assert.equal(a.manifest.blockingPassedCount, 23);
      assert.equal(a.manifest.blockingFailedCount, 0);
      assert.equal(a.manifest.blockingNotEvaluatedCount, 0);
      assert.equal(a.manifest.disclosureGateCount, 1);
      assert.equal(a.manifest.disclosurePassedCount, 0);
      assert.equal(a.manifest.disclosureFailedCount, 1);
      assert.equal(a.manifest.disclosureNotEvaluatedCount, 0);
      assert.equal(a.manifest.passedGateCount, 23);
      assert.equal(a.manifest.failedGateCount, 1);
      assert.equal(a.manifest.notEvaluatedGateCount, 0);
      assert.equal(a.manifest.fullProjectTypeScriptResult, "Fail");
      assert.equal(a.manifest.fullProjectDiagnosticsCount, 947);
      assert.equal(a.manifest.fullProjectRtc3DiagnosticsCount, 0);
      assert.equal(a.manifest.inventedTimestamp, false);
      assert.deepEqual(
        [...a.manifest.architectureDecisionIds],
        ["AD-RTC3-06", "AD-RTC3-07", "AD-RTC3-08", "AD-RTC3-09"],
      );
      assert.equal(a.manifest.humanAuthorizationRequired, true);
      assert.equal(a.manifest.authorizationRecorded, false);
      assert.equal(a.manifest.consumptionAuthorized, false);
      assert.equal(a.manifest.integrationAuthorized, false);
      assert.equal(a.manifest.deploymentAuthorized, false);
      assert.equal(a.manifest.publicIndexAuthorized, false);
      assert.equal(a.manifest.rtc310CreationAuthorized, false);
      assert.equal(mutateFrozen(a.manifest), false);
      assert.equal(mutateFrozen(a.gateResults), false);
      for (const field of MANIFEST_FIELD_COVERAGE) {
        assert.ok(field in a.manifest, `missing manifest field ${field}`);
      }
      const mutable = {
        ...packageEvidence(),
        packageId: "mut-1",
      };
      const before = certifyExecutiveDecisionRegister(mutable);
      (mutable as { packageId: string }).packageId = "mut-2";
      const after = certifyExecutiveDecisionRegister(packageEvidence({
        packageId: "mut-1",
        evidenceDigest: "digest-rtc3-9-1",
      }));
      assert.equal(before.packageId, "mut-1");
      assert.equal(after.packageId, "mut-1");
    });
  });

  describe("boundaries", () => {
    it("ReadyForConsumer and ReadyForAuthorization do not authorize anything", () => {
      assert.equal(
        ExecutiveDecisionRegisterCertification.readiness,
        "ReadyForConsumer",
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.authorizesConsumption,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.authorizesIntegration,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.authorizesDeployment,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.publicIndexAuthorized,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.rtc310CreationAuthorized,
        false,
      );
      assert.equal(ExecutiveDecisionRegisterCertification.executes, false);
      assert.equal(ExecutiveDecisionRegisterCertification.persists, false);
      assert.equal(ExecutiveDecisionRegisterCertification.dispatches, false);
      assert.equal(ExecutiveDecisionRegisterCertification.publishes, false);
      assert.equal(
        ExecutiveDecisionRegisterCertification.mutatesDomainState,
        false,
      );
      assert.equal(ExecutiveDecisionRegisterCertification.repairsInput, false);
      assert.equal(
        ExecutiveDecisionRegisterCertification.createsAuthority,
        false,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.confirmsDecisions,
        false,
      );
      assert.equal(ExecutiveDecisionRegisterCertification.usesSystemClock, false);
      assert.equal(ExecutiveDecisionRegisterCertification.usesNetwork, false);
      assert.equal(ExecutiveDecisionRegisterCertification.usesRandomness, false);
      for (const flag of AUTHORIZATION_BOUNDARY_COVERAGE) {
        assert.ok(
          flag in ExecutiveDecisionRegisterCertification.authorizationBoundary,
          flag,
        );
      }
      assert.equal(
        readdirSync(HERE).some((name) =>
          /executiveDecisionRegister.*Rtc310|RTC-3:10|rtc310/i.test(name)
        ),
        false,
      );
    });
  });

  describe("metadata", () => {
    it("mints D-49 through D-54 exactly once and preserves upstream chain", () => {
      assert.deepEqual(
        ExecutiveDecisionRegisterCertification.decisions.map((item) =>
          item.decisionId
        ),
        ["D-49", "D-50", "D-51", "D-52", "D-53", "D-54"],
      );
      const d50 = ExecutiveDecisionRegisterCertification.decisions.find(
        (item) => item.decisionId === "D-50",
      );
      assert.ok(d50);
      assert.match(d50.statement, /Every Blocking certification gate must pass/);
      assert.match(d50.statement, /Disclosure gates must be evaluated/);
      assert.doesNotMatch(
        d50.statement,
        /Every mandatory certification gate must pass before RTC-3 may be ReadyForAuthorization\.$/,
      );
      assert.equal(mutateFrozen(ExecutiveDecisionRegisterCertification.decisions), false);
      assert.equal(
        ExecutiveDecisionRegisterCertification.upstreamFoundationDecisions.length,
        6,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.upstreamAssuranceDecisions.length,
        6,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.upstreamArchitectureDecisionAdrtc306,
        ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc306,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.upstreamArchitectureDecisionAdrtc307,
        ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc307,
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.upstreamArchitectureDecisionAdrtc308,
        ExecutiveDecisionRegisterAssurance.architectureDecision,
      );
      assert.equal(
        ExecutiveDecisionRegisterArchitectureDecisionAdrtc309.decisionId,
        "AD-RTC3-09",
      );
      assert.equal(
        ExecutiveDecisionRegisterArchitectureDecisionAdrtc309.status,
        "Accepted",
      );
      assert.equal(
        ExecutiveDecisionRegisterCertification.architectureDecisions.filter(
          (item) => item.decisionId === "AD-RTC3-09",
        ).length,
        1,
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterCertification.openIssues.map((item) => ({
          id: item.issueId,
          owner: item.accountableOwner,
          resolved: item.resolved,
          carriedByPhase: item.carriedByPhase,
        })),
        ExecutiveDecisionRegisterAssurance.openIssues.map((item) => ({
          id: item.issueId,
          owner: item.accountableOwner,
          resolved: false,
          carriedByPhase: "RTC-3:9",
        })),
      );
      const summary = getExecutiveDecisionRegisterCertificationSummary();
      assert.equal(summary.readiness, "ReadyForConsumer");
      assert.equal(summary.nextPhaseDecisionRequired, true);
      assert.equal(summary.authorizationRecorded, false);
      assert.deepEqual(
        [...summary.architectureDecisionIds],
        ["AD-RTC3-06", "AD-RTC3-07", "AD-RTC3-08", "AD-RTC3-09"],
      );
      assert.equal(
        ExecutiveDecisionRegisterCertificationIdentity.id,
        ExecutiveDecisionRegisterCertificationId,
      );
      assert.equal(EVIDENCE_KIND_COVERAGE.length, 14);
      assert.equal(CERTIFICATION_GATE_COVERAGE.length, 24);
      assert.deepEqual([...GATE_CRITICALITY_COVERAGE], ["Blocking", "Disclosure"]);
      assert.deepEqual(
        [...ARCHITECTURE_DECISION_COVERAGE],
        ["AD-RTC3-06", "AD-RTC3-07", "AD-RTC3-08", "AD-RTC3-09"],
      );
      for (const field of MANIFEST_CLASSIFICATION_FIELD_COVERAGE) {
        assert.ok(
          (MANIFEST_FIELD_COVERAGE as readonly string[]).includes(field),
          field,
        );
      }
    });
  });

  describe("gate criticality and AD-RTC3-09 aggregation", () => {
    it("classifies G-01 through G-23 Blocking and G-24 Disclosure immutably", () => {
      for (const declaration of ExecutiveDecisionRegisterCertificationGates) {
        assert.equal(
          declaration.criticality,
          declaration.gateId === "G-24" ? "Disclosure" : "Blocking",
        );
        assert.equal(
          assertExecutiveDecisionRegisterCertificationGateCriticality(
            declaration.criticality,
          ),
          declaration.criticality,
        );
      }
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationGateCriticality("Optional")
      );
      assert.throws(() =>
        assertExecutiveDecisionRegisterCertificationGateCriticality("blocking")
      );
      assert.deepEqual(
        ExecutiveDecisionRegisterCertificationGates.map((item) => item.gateId),
        [...ExecutiveDecisionRegisterCertificationGateIds],
      );
      assert.equal(
        mutateFrozen(ExecutiveDecisionRegisterCertificationGates[0]!),
        false,
      );
    });

    it("Blocking Fail or NotEvaluated forces NotReady; Disclosure Fail with rtc3Diagnostics>0 forces NotReady", () => {
      assert.equal(
        certifyExecutiveDecisionRegister(
          packageEvidence({ eslintWarningCount: 1 }),
        ).kind,
        "NotReady",
      );
      assert.equal(
        certifyExecutiveDecisionRegister(
          packageEvidence({ dependencyBoundaryOk: null }),
        ).kind,
        "NotReady",
      );
      const withRtc3Diag = certifyExecutiveDecisionRegister(
        packageEvidence({
          gateEvidence: allGateEvidence({
            "G-24": gateEvidence("G-24", {
              diagnosticsCount: 947,
              rtc3DiagnosticsCount: 3,
              notes: "RTC-3 diagnostics present",
            }),
          }),
          typeScript: {
            scopedSourcesAndTestsPassed: true,
            productionSourcesPassed: true,
            fullProjectCommand:
              'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
            fullProjectExitCode: 2,
            fullProjectCompleted: true,
            fullProjectDiagnosticsCount: 947,
            fullProjectRtc3DiagnosticsCount: 3,
            fullProjectRunnerCrash: false,
            fullProjectClassification: "Fail",
          },
        }),
      );
      assert.equal(withRtc3Diag.kind, "NotReady");
      assert.equal(gateResultOf(withRtc3Diag, "G-24").result, "Fail");
      assert.equal(gateResultOf(withRtc3Diag, "G-24").rtc3DiagnosticsCount, 3);
    });

    it("missing Disclosure evidence and Blocking TypeScript Fail force NotReady", () => {
      const missingDisclosure = certifyExecutiveDecisionRegister(
        packageEvidence({
          typeScript: {
            scopedSourcesAndTestsPassed: true,
            productionSourcesPassed: true,
            fullProjectCommand: null,
            fullProjectExitCode: null,
            fullProjectCompleted: null,
            fullProjectDiagnosticsCount: null,
            fullProjectRtc3DiagnosticsCount: null,
            fullProjectRunnerCrash: false,
            fullProjectClassification: null,
          },
        }),
      );
      assert.equal(missingDisclosure.kind, "NotReady");
      assert.equal(gateResultOf(missingDisclosure, "G-24").result, "NotEvaluated");
      assert.equal(
        certifyExecutiveDecisionRegister(
          packageEvidence({
            typeScript: {
              scopedSourcesAndTestsPassed: false,
              productionSourcesPassed: true,
              fullProjectCommand:
                'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
              fullProjectExitCode: 2,
              fullProjectCompleted: true,
              fullProjectDiagnosticsCount: 947,
              fullProjectRtc3DiagnosticsCount: 0,
              fullProjectRunnerCrash: false,
              fullProjectClassification: "Fail",
            },
          }),
        ).kind,
        "NotReady",
      );
      assert.equal(
        certifyExecutiveDecisionRegister(
          packageEvidence({
            typeScript: {
              scopedSourcesAndTestsPassed: true,
              productionSourcesPassed: false,
              fullProjectCommand:
                'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
              fullProjectExitCode: 2,
              fullProjectCompleted: true,
              fullProjectDiagnosticsCount: 947,
              fullProjectRtc3DiagnosticsCount: 0,
              fullProjectRunnerCrash: false,
              fullProjectClassification: "Fail",
            },
          }),
        ).kind,
        "NotReady",
      );
    });

    it("Disclosure Fail never authorizes and never counts as passed", () => {
      const result = certifyExecutiveDecisionRegister(packageEvidence());
      assert.equal(result.kind, "ReadyForAuthorization");
      assert.equal(result.manifest.disclosurePassedCount, 0);
      assert.equal(result.manifest.disclosureFailedCount, 1);
      assert.equal(result.authorizesConsumption, false);
      assert.equal(result.authorizesIntegration, false);
      assert.equal(result.authorizesDeployment, false);
      assert.equal(result.manifest.consumptionAuthorized, false);
      assert.equal(result.manifest.rtc310CreationAuthorized, false);
      assert.equal(validateExecutiveDecisionRegisterCertificationCoverage(), true);
    });

    it("Disclosure Pass remains truthfully Pass without rewriting diagnostics semantics", () => {
      const result = certifyExecutiveDecisionRegister(
        packageEvidence({
          typeScript: {
            scopedSourcesAndTestsPassed: true,
            productionSourcesPassed: true,
            fullProjectCommand:
              'NODE_OPTIONS="--max-old-space-size=8192" npx tsc --noEmit',
            fullProjectExitCode: 0,
            fullProjectCompleted: true,
            fullProjectDiagnosticsCount: 0,
            fullProjectRtc3DiagnosticsCount: 0,
            fullProjectRunnerCrash: false,
            fullProjectClassification: "Pass",
          },
          gateEvidence: allGateEvidence({
            "G-24": gateEvidence("G-24", {
              diagnosticsCount: 0,
              rtc3DiagnosticsCount: 0,
              notes: "full-project TypeScript passed",
            }),
          }),
        }),
      );
      assert.equal(gateResultOf(result, "G-24").result, "Pass");
      assert.equal(result.manifest.disclosurePassedCount, 1);
      assert.equal(result.manifest.disclosureFailedCount, 0);
      assert.equal(result.manifest.fullProjectTypeScriptResult, "Pass");
      assert.equal(result.kind, "ReadyForAuthorization");
      assert.equal(result.authorizesConsumption, false);
    });
  });
});
