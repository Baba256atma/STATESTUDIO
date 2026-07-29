/**
 * RTC-3:9 — Executive Decision Register Certification Rules.
 *
 * Ordered certification gates, pure evidence evaluation, result aggregation.
 * No side effects, no authorization, no clock, no CI access.
 *
 * Aggregation uses closed gate criticality (Blocking | Disclosure) plus
 * AD-RTC3-09 policy conditions. Disclosure Fail/NotEvaluated may remain
 * visible without forcing NotReady when AD-RTC3-09 conditions pass.
 * The evaluator MUST NOT hard-code exceptions by gate ID alone.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import { ExecutiveDecisionRegisterAssurance } from "./executiveDecisionRegisterAssurance.ts";
import {
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationNamespace,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationSourceAssurance,
  ExecutiveDecisionRegisterCertificationStatus,
  ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
} from "./executiveDecisionRegisterCertificationIdentity.ts";
import {
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  assertExecutiveDecisionRegisterCertificationGateCriticality,
} from "./executiveDecisionRegisterCertificationLifecycle.ts";
import type {
  ExecutiveDecisionRegisterCertificationEvidenceKind,
  ExecutiveDecisionRegisterCertificationEvidencePackage,
  ExecutiveDecisionRegisterCertificationGateCriticality,
  ExecutiveDecisionRegisterCertificationGateEvidence,
  ExecutiveDecisionRegisterCertificationGateId,
  ExecutiveDecisionRegisterCertificationGateResult,
  ExecutiveDecisionRegisterCertificationGateResultKind,
  ExecutiveDecisionRegisterCertificationManifest,
  ExecutiveDecisionRegisterCertificationResult,
  ExecutiveDecisionRegisterCertificationResultKind,
  ExecutiveDecisionRegisterCertificationTestSuiteEvidence,
  ExecutiveDecisionRegisterFullProjectTypeScriptClassification,
} from "./executiveDecisionRegisterCertificationTypes.ts";

export interface ExecutiveDecisionRegisterCertificationGateDeclaration {
  readonly gateId: ExecutiveDecisionRegisterCertificationGateId;
  readonly gateName: string;
  readonly order: number;
  readonly criticality: ExecutiveDecisionRegisterCertificationGateCriticality;
  readonly evidenceKind: ExecutiveDecisionRegisterCertificationEvidenceKind;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly authorizesDeployment: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const gate = (
  order: number,
  gateId: ExecutiveDecisionRegisterCertificationGateId,
  gateName: string,
  criticality: ExecutiveDecisionRegisterCertificationGateCriticality,
  evidenceKind: ExecutiveDecisionRegisterCertificationEvidenceKind,
  description: string,
): ExecutiveDecisionRegisterCertificationGateDeclaration =>
  Object.freeze({
    gateId,
    gateName,
    order,
    criticality: assertExecutiveDecisionRegisterCertificationGateCriticality(
      criticality,
    ),
    evidenceKind,
    description,
    evaluatesOnly: true as const,
    authorizesDeployment: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterCertificationGates = Object.freeze([
  gate(1, "G-01", "RTC-3:1 Foundation tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:1 tests pass."),
  gate(2, "G-02", "RTC-3:2 Registry tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:2 tests pass."),
  gate(3, "G-03", "RTC-3:3 Model tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:3 tests pass."),
  gate(4, "G-04", "RTC-3:4 Validation tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:4 tests pass."),
  gate(5, "G-05", "RTC-3:5 Policy tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:5 tests pass."),
  gate(6, "G-06", "RTC-3:6 Enforcement tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:6 tests pass."),
  gate(7, "G-07", "RTC-3:7 Execution Contract tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:7 tests pass."),
  gate(8, "G-08", "RTC-3:8 Assurance tests pass", "Blocking", "TestSuiteEvidence", "RTC-3:8 tests pass."),
  gate(9, "G-09", "Full RTC-3 regression suite passes", "Blocking", "TestSuiteEvidence", "Full RTC-3 regression."),
  gate(10, "G-10", "Relevant RTC-2 regressions pass", "Blocking", "TestSuiteEvidence", "RTC-2:9 certification regression."),
  gate(11, "G-11", "Relevant RTC-1 regressions pass", "Blocking", "TestSuiteEvidence", "RTC-1:9 regression."),
  gate(12, "G-12", "Strict TypeScript for RTC-3 sources and tests passes", "Blocking", "TypeScriptEvidence", "Scoped RTC-3 TS."),
  gate(13, "G-13", "RTC-3 production-source TypeScript passes", "Blocking", "TypeScriptEvidence", "Production RTC-3 TS."),
  gate(14, "G-14", "ESLint passes with zero warnings", "Blocking", "EslintEvidence", "ESLint --max-warnings 0."),
  gate(15, "G-15", "Runtime dependency boundaries pass", "Blocking", "DependencyBoundaryEvidence", "No prohibited imports."),
  gate(16, "G-16", "Exact upstream object references are preserved", "Blocking", "UpstreamReferenceEvidence", "Exact RTC-3:8 ref."),
  gate(17, "G-17", "Closed vocabularies and coverage tables are complete", "Blocking", "CoverageCompletenessEvidence", "Coverage tables."),
  gate(18, "G-18", "AI prohibitions are preserved", "Blocking", "AiProhibitionEvidence", "AI must-not preserved."),
  gate(19, "G-19", "Append-only, authority, confirmation, privacy, provenance, projection, retention, and telemetry controls are preserved", "Blocking", "ControlPreservationEvidence", "Control preservation."),
  gate(20, "G-20", "OI-01 through OI-06 remain unresolved with owners unchanged", "Blocking", "OpenIssueEvidence", "Open issues unchanged."),
  gate(21, "G-21", "AD-RTC3-06, AD-RTC3-07, and AD-RTC3-08 remain accepted and unchanged", "Blocking", "ArchitectureDecisionEvidence", "AD preservation."),
  gate(22, "G-22", "No prohibited side effects or runtime dependencies exist", "Blocking", "SideEffectBoundaryEvidence", "Side-effect flags false."),
  gate(23, "G-23", "No RTC-3:10 files or invented next phase exist", "Blocking", "NoNextPhaseEvidence", "No RTC-3:10 / nextPhase."),
  gate(24, "G-24", "Full-project TypeScript status is truthfully recorded", "Disclosure", "FullProjectTypeScriptEvidence", "Full-project TS disclosure."),
] as const);

export const ExecutiveDecisionRegisterCertificationGateIds = Object.freeze(
  ExecutiveDecisionRegisterCertificationGates.map((item) => item.gateId),
);

export const ExecutiveDecisionRegisterCertificationResultKinds = Object.freeze([
  "NotReady",
  "ReadyForAuthorization",
] as const);

export const ExecutiveDecisionRegisterCertificationGateResultKinds =
  Object.freeze(["Pass", "Fail", "NotEvaluated"] as const);

export const ExecutiveDecisionRegisterCertificationEvidenceKinds = Object.freeze([
  "TestSuiteEvidence",
  "TypeScriptEvidence",
  "EslintEvidence",
  "DependencyBoundaryEvidence",
  "UpstreamReferenceEvidence",
  "CoverageCompletenessEvidence",
  "AiProhibitionEvidence",
  "ControlPreservationEvidence",
  "OpenIssueEvidence",
  "ArchitectureDecisionEvidence",
  "SideEffectBoundaryEvidence",
  "NoNextPhaseEvidence",
  "FullProjectTypeScriptEvidence",
  "AssuranceResultEvidence",
] as const);

export const CERTIFICATION_GATE_COVERAGE = Object.freeze(
  [...ExecutiveDecisionRegisterCertificationGateIds],
);

export const CERTIFICATION_RESULT_COVERAGE = Object.freeze(
  [...ExecutiveDecisionRegisterCertificationResultKinds],
);

export const GATE_RESULT_COVERAGE = Object.freeze(
  [...ExecutiveDecisionRegisterCertificationGateResultKinds],
);

export const EVIDENCE_KIND_COVERAGE = Object.freeze(
  [...ExecutiveDecisionRegisterCertificationEvidenceKinds],
);

export const MANIFEST_FIELD_COVERAGE = Object.freeze([
  "certificationId",
  "namespace",
  "status",
  "readiness",
  "upstreamAssuranceIdentity",
  "certificationResult",
  "gateResults",
  "totalGateCount",
  "blockingGateCount",
  "blockingPassedCount",
  "blockingFailedCount",
  "blockingNotEvaluatedCount",
  "disclosureGateCount",
  "disclosurePassedCount",
  "disclosureFailedCount",
  "disclosureNotEvaluatedCount",
  "passedGateCount",
  "failedGateCount",
  "notEvaluatedGateCount",
  "rtc3PhaseTestResults",
  "rtc2RegressionResults",
  "rtc1RegressionResults",
  "scopedTypeScriptResult",
  "productionTypeScriptResult",
  "fullProjectTypeScriptResult",
  "fullProjectClassification",
  "fullProjectDiagnosticsCount",
  "fullProjectRtc3DiagnosticsCount",
  "repositoryWideTypeScriptHealth",
  "rtc3ScopedTypeScriptHealth",
  "eslintResult",
  "dependencyBoundaryResult",
  "architectureDecisionIds",
  "phaseDecisionIds",
  "openIssueIds",
  "humanAuthorizationRequired",
  "authorizationRecorded",
  "consumptionAuthorized",
  "integrationAuthorized",
  "deploymentAuthorized",
  "publicIndexAuthorized",
  "rtc310CreationAuthorized",
  "nextPhaseDecisionRequired",
  "terminalDecisionMarker",
  "evidenceDigest",
  "summary",
  "inventedTimestamp",
  "metadataOnly",
  "immutable",
  "deterministic",
] as const);

export const AUTHORIZATION_BOUNDARY_COVERAGE = Object.freeze([
  "humanAuthorizationRequired",
  "authorizationRecorded",
  "consumptionAuthorized",
  "integrationAuthorized",
  "deploymentAuthorized",
  "publicIndexAuthorized",
  "rtc310CreationAuthorized",
] as const);

export const GATE_CRITICALITY_COVERAGE = Object.freeze([
  "Blocking",
  "Disclosure",
] as const);

export const BLOCKING_GATE_BEHAVIOR_COVERAGE = Object.freeze([
  "blocking-pass-required",
  "blocking-fail-not-ready",
  "blocking-not-evaluated-not-ready",
  "blocking-missing-not-ready",
] as const);

export const DISCLOSURE_GATE_BEHAVIOR_COVERAGE = Object.freeze([
  "disclosure-fail-recorded",
  "disclosure-not-counted-as-passed",
  "disclosure-missing-not-ready",
  "disclosure-not-evaluated-recorded",
  "disclosure-pass-recorded",
  "disclosure-adr-tc309-permitted",
] as const);

export const ARCHITECTURE_DECISION_COVERAGE = Object.freeze([
  "AD-RTC3-06",
  "AD-RTC3-07",
  "AD-RTC3-08",
  "AD-RTC3-09",
] as const);

export const MANIFEST_CLASSIFICATION_FIELD_COVERAGE = Object.freeze([
  "totalGateCount",
  "blockingGateCount",
  "blockingPassedCount",
  "blockingFailedCount",
  "blockingNotEvaluatedCount",
  "disclosureGateCount",
  "disclosurePassedCount",
  "disclosureFailedCount",
  "disclosureNotEvaluatedCount",
  "fullProjectTypeScriptResult",
  "fullProjectDiagnosticsCount",
  "fullProjectRtc3DiagnosticsCount",
  "repositoryWideTypeScriptHealth",
  "rtc3ScopedTypeScriptHealth",
] as const);

export {
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
};

const PHASE_DECISION_IDS = Object.freeze([
  "D-01", "D-02", "D-03", "D-04", "D-05", "D-06",
  "D-07", "D-08", "D-09", "D-10", "D-11", "D-12",
  "D-13", "D-14", "D-15", "D-16", "D-17", "D-18",
  "D-19", "D-20", "D-21", "D-22", "D-23", "D-24",
  "D-25", "D-26", "D-27", "D-28", "D-29", "D-30",
  "D-31", "D-32", "D-33", "D-34", "D-35", "D-36",
  "D-37", "D-38", "D-39", "D-40", "D-41", "D-42",
  "D-43", "D-44", "D-45", "D-46", "D-47", "D-48",
  "D-49", "D-50", "D-51", "D-52", "D-53", "D-54",
] as const);

const REQUIRED_RTC3_SUITES = Object.freeze([
  "RTC-3:1",
  "RTC-3:2",
  "RTC-3:3",
  "RTC-3:4",
  "RTC-3:5",
  "RTC-3:6",
  "RTC-3:7",
  "RTC-3:8",
  "RTC-3:9",
] as const);

const suiteFor = (
  suites: readonly ExecutiveDecisionRegisterCertificationTestSuiteEvidence[],
  suiteId: string,
): ExecutiveDecisionRegisterCertificationTestSuiteEvidence | null =>
  suites.find((item) => item.suiteId === suiteId) ?? null;

const missingEvidence = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  reasonCode: string,
  message: string,
): ExecutiveDecisionRegisterCertificationGateResult =>
  Object.freeze({
    gateId: declaration.gateId,
    gateName: declaration.gateName,
    order: declaration.order,
    criticality: declaration.criticality,
    result: "NotEvaluated" as const,
    evidenceId: "missing",
    evidenceKind: "MissingEvidence" as const,
    evidenceSource: "not-supplied",
    commandOrInspection: "Not evaluated because evidence missing",
    scope: "RTC-3:9",
    diagnosticsCount: 0,
    rtc3DiagnosticsCount: 0,
    notes: "Mandatory evidence was not supplied.",
    evaluationTimestampDescriptor: null,
    reasonCode,
    message,
    metadataOnly: true as const,
    immutable: true as const,
  });

const fromEvidence = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  evidence: ExecutiveDecisionRegisterCertificationGateEvidence,
  result: ExecutiveDecisionRegisterCertificationGateResultKind,
  reasonCode: string,
  message: string,
): ExecutiveDecisionRegisterCertificationGateResult =>
  Object.freeze({
    gateId: declaration.gateId,
    gateName: declaration.gateName,
    order: declaration.order,
    criticality: declaration.criticality,
    result,
    evidenceId: evidence.evidenceId,
    evidenceKind: evidence.evidenceKind,
    evidenceSource: evidence.evidenceSource,
    commandOrInspection: evidence.commandOrInspection,
    scope: evidence.scope,
    diagnosticsCount: evidence.diagnosticsCount,
    rtc3DiagnosticsCount: evidence.rtc3DiagnosticsCount,
    notes: evidence.notes,
    evaluationTimestampDescriptor: evidence.evaluationTimestampDescriptor,
    reasonCode,
    message,
    metadataOnly: true as const,
    immutable: true as const,
  });

const gateDeclarationById = (
  gateId: string,
): ExecutiveDecisionRegisterCertificationGateDeclaration | null =>
  ExecutiveDecisionRegisterCertificationGates.find(
    (item) => item.gateId === gateId,
  ) ?? null;

/**
 * AD-RTC3-09 disclosure non-blocking conditions (criticality-driven):
 * - accepted scoped-certification policy flag;
 * - every Blocking TypeScriptEvidence gate Pass;
 * - disclosure evidence present (not MissingEvidence);
 * - rtc3DiagnosticsCount === 0;
 * - disclosure result is Fail (unrelated diagnostics) or runner-crash NotEvaluated.
 */
const disclosurePermittedByAdrtc309 = (
  gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[],
  disclosure: ExecutiveDecisionRegisterCertificationGateResult,
): boolean => {
  if (!SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION) {
    return false;
  }
  if (disclosure.criticality !== "Disclosure") {
    return false;
  }
  if (disclosure.evidenceKind === "MissingEvidence") {
    return false;
  }
  if (disclosure.rtc3DiagnosticsCount > 0) {
    return false;
  }
  const blockingTypeScriptGates = gateResults.filter(
    (item) =>
      item.criticality === "Blocking"
      && item.evidenceKind === "TypeScriptEvidence",
  );
  if (
    blockingTypeScriptGates.length === 0
    || blockingTypeScriptGates.some((item) => item.result !== "Pass")
  ) {
    return false;
  }
  if (disclosure.result === "Pass") {
    return true;
  }
  if (
    disclosure.result === "NotEvaluated"
    && (
      disclosure.reasonCode.endsWith("-RUNNER-CRASH")
      || /runner crash/i.test(disclosure.message)
    )
  ) {
    return true;
  }
  if (disclosure.result === "Fail") {
    return true;
  }
  return false;
};

const booleanFromEvidence = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
  value: boolean | null,
  passCode: string,
  failCode: string,
  missingCode: string,
  passMessage: string,
  failMessage: string,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  if (value === null || evidence === undefined) {
    return missingEvidence(
      declaration,
      missingCode,
      "Mandatory evidence was not evaluated.",
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    value ? "Pass" : "Fail",
    value ? passCode : failCode,
    value ? passMessage : failMessage,
  );
};

const evaluateSuiteGate = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
  suiteId: string,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  const suite = suiteFor(pkg.testSuites, suiteId);
  if (!evidence || !suite) {
    return missingEvidence(
      declaration,
      `CERT-${declaration.gateId}-MISSING`,
      `${suiteId} test evidence was not supplied.`,
    );
  }
  if (!suite.present) {
    return fromEvidence(
      declaration,
      evidence,
      "NotEvaluated",
      `CERT-${declaration.gateId}-ABSENT`,
      `${suiteId} suite evidence was marked absent.`,
    );
  }
  if (!suite.passed || suite.failCount > 0) {
    return fromEvidence(
      declaration,
      evidence,
      "Fail",
      `CERT-${declaration.gateId}-FAIL`,
      `${suiteId} tests failed.`,
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    "Pass",
    `CERT-${declaration.gateId}-PASS`,
    `${suiteId} tests passed.`,
  );
};

const evaluateFullRtc3Regression = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  if (!evidence) {
    return missingEvidence(
      declaration,
      "CERT-G-09-MISSING",
      "Full RTC-3 regression evidence was not supplied.",
    );
  }
  const suites = REQUIRED_RTC3_SUITES.map((id) => suiteFor(pkg.testSuites, id));
  if (suites.some((item) => item === null)) {
    return fromEvidence(
      declaration,
      evidence,
      "NotEvaluated",
      "CERT-G-09-INCOMPLETE",
      "Full RTC-3 regression evidence is incomplete.",
    );
  }
  if (suites.some((item) => !item!.present || !item!.passed || item!.failCount > 0)) {
    return fromEvidence(
      declaration,
      evidence,
      "Fail",
      "CERT-G-09-FAIL",
      "Full RTC-3 regression suite failed.",
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    "Pass",
    "CERT-G-09-PASS",
    "Full RTC-3 regression suite passed.",
  );
};

const evaluateAssuranceGate = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  // G-08 is assurance tests; assurance result Assured is enforced via G-16
  // upstream + dedicated checks in evaluateGate for identity/assurance package fields.
  return evaluateSuiteGate(declaration, pkg, "RTC-3:8");
};

const evaluateScopedTypeScript = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  const value = pkg.typeScript.scopedSourcesAndTestsPassed;
  if (!evidence || value === null) {
    return missingEvidence(
      declaration,
      "CERT-G-12-MISSING",
      "Scoped TypeScript evidence was not supplied.",
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    value ? "Pass" : "Fail",
    value ? "CERT-G-12-PASS" : "CERT-G-12-FAIL",
    value
      ? "Scoped RTC-3 sources and tests TypeScript passed."
      : "Scoped RTC-3 sources and tests TypeScript failed.",
  );
};

const evaluateProductionTypeScript = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  const value = pkg.typeScript.productionSourcesPassed;
  if (!evidence || value === null) {
    return missingEvidence(
      declaration,
      "CERT-G-13-MISSING",
      "Production TypeScript evidence was not supplied.",
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    value ? "Pass" : "Fail",
    value ? "CERT-G-13-PASS" : "CERT-G-13-FAIL",
    value
      ? "RTC-3 production-source TypeScript passed."
      : "RTC-3 production-source TypeScript failed.",
  );
};

const evaluateEslint = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  if (
    !evidence
    || pkg.eslintExitCode === null
    || pkg.eslintErrorCount === null
    || pkg.eslintWarningCount === null
  ) {
    return missingEvidence(
      declaration,
      "CERT-G-14-MISSING",
      "ESLint evidence was not supplied.",
    );
  }
  const pass =
    pkg.eslintExitCode === 0
    && pkg.eslintErrorCount === 0
    && pkg.eslintWarningCount === 0;
  return fromEvidence(
    declaration,
    evidence,
    pass ? "Pass" : "Fail",
    pass ? "CERT-G-14-PASS" : "CERT-G-14-FAIL",
    pass
      ? "ESLint passed with zero errors and zero warnings."
      : "ESLint failed or reported warnings.",
  );
};

const evaluateFullProjectTypeScript = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  const evidence = pkg.gateEvidence[declaration.gateId];
  const ts = pkg.typeScript;
  if (!evidence || ts.fullProjectClassification === null) {
    return missingEvidence(
      declaration,
      "CERT-G-24-MISSING",
      "Full-project TypeScript evidence was not supplied.",
    );
  }
  if (ts.fullProjectClassification === "NotEvaluatedEvidenceMissing") {
    return fromEvidence(
      declaration,
      evidence,
      "NotEvaluated",
      "CERT-G-24-MISSING",
      "Not evaluated because evidence missing",
    );
  }
  if (
    ts.fullProjectClassification === "NotEvaluatedRunnerCrash"
    || ts.fullProjectRunnerCrash
  ) {
    return fromEvidence(
      declaration,
      evidence,
      "NotEvaluated",
      "CERT-G-24-RUNNER-CRASH",
      "Not evaluated because runner crash",
    );
  }
  if (ts.fullProjectClassification === "Pass") {
    return fromEvidence(
      declaration,
      evidence,
      "Pass",
      "CERT-G-24-PASS",
      "Full-project TypeScript passed with no diagnostics.",
    );
  }
  return fromEvidence(
    declaration,
    evidence,
    "Fail",
    "CERT-G-24-FAIL",
    "Full-project TypeScript reported diagnostics.",
  );
};

const evaluateAssurancePackageFields = (
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): {
  readonly ok: boolean;
  readonly reasonCode: string;
  readonly message: string;
} => {
  if (pkg.assuranceResultKind === null || pkg.assuranceIdentity === null) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-MISSING",
      message: "Assurance evidence was not supplied.",
    };
  }
  if (pkg.assuranceIdentity !== ExecutiveDecisionRegisterCertificationSourceAssurance) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-IDENTITY-MISMATCH",
      message: "Assurance identity does not match canonical RTC-3:8.",
    };
  }
  if (pkg.assuranceAggregateExactReference !== true) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-REF-MISMATCH",
      message: "Assurance aggregate exact reference was not preserved.",
    };
  }
  if (pkg.assuranceResultKind === "NotAssured") {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-NOT-ASSURED",
      message: "NotAssured cannot be certified.",
    };
  }
  if (pkg.assuranceResultKind === "Indeterminate") {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-INDETERMINATE",
      message: "Indeterminate cannot be certified.",
    };
  }
  if (pkg.assuranceResultKind !== "Assured") {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-UNKNOWN",
      message: "Unknown assurance result fails closed.",
    };
  }
  if (pkg.assuranceCoverageComplete !== true) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-COVERAGE",
      message: "Assurance coverage is incomplete.",
    };
  }
  if (
    pkg.assuranceErrorOrCriticalFindings === null
    || pkg.assuranceErrorOrCriticalFindings > 0
  ) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-FINDINGS",
      message: "Unresolved Error or Critical findings block certification.",
    };
  }
  if (pkg.assuranceIndeterminateUnresolved === true) {
    return {
      ok: false,
      reasonCode: "CERT-ASSURANCE-INDETERMINATE-UNRESOLVED",
      message: "Unresolved Indeterminate assurance condition blocks certification.",
    };
  }
  return {
    ok: true,
    reasonCode: "CERT-ASSURANCE-OK",
    message: "Canonical Assured evidence accepted.",
  };
};

const evaluateGate = (
  declaration: ExecutiveDecisionRegisterCertificationGateDeclaration,
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationGateResult => {
  switch (declaration.gateId) {
    case "G-01":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:1");
    case "G-02":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:2");
    case "G-03":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:3");
    case "G-04":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:4");
    case "G-05":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:5");
    case "G-06":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:6");
    case "G-07":
      return evaluateSuiteGate(declaration, pkg, "RTC-3:7");
    case "G-08":
      return evaluateAssuranceGate(declaration, pkg);
    case "G-09":
      return evaluateFullRtc3Regression(declaration, pkg);
    case "G-10":
      return evaluateSuiteGate(declaration, pkg, "RTC-2:9");
    case "G-11":
      return evaluateSuiteGate(declaration, pkg, "RTC-1:9");
    case "G-12":
      return evaluateScopedTypeScript(declaration, pkg);
    case "G-13":
      return evaluateProductionTypeScript(declaration, pkg);
    case "G-14":
      return evaluateEslint(declaration, pkg);
    case "G-15":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.dependencyBoundaryOk,
        "CERT-G-15-PASS",
        "CERT-G-15-FAIL",
        "CERT-G-15-MISSING",
        "Runtime dependency boundaries passed.",
        "Runtime dependency boundaries failed.",
      );
    case "G-16": {
      const assurance = evaluateAssurancePackageFields(pkg);
      const evidence = pkg.gateEvidence[declaration.gateId];
      if (!evidence || pkg.upstreamReferencesExact === null) {
        return missingEvidence(
          declaration,
          "CERT-G-16-MISSING",
          "Upstream reference evidence was not supplied.",
        );
      }
      if (!assurance.ok) {
        return fromEvidence(
          declaration,
          evidence,
          "Fail",
          assurance.reasonCode,
          assurance.message,
        );
      }
      return fromEvidence(
        declaration,
        evidence,
        pkg.upstreamReferencesExact ? "Pass" : "Fail",
        pkg.upstreamReferencesExact ? "CERT-G-16-PASS" : "CERT-G-16-FAIL",
        pkg.upstreamReferencesExact
          ? "Exact upstream object references preserved."
          : "Upstream object references were not preserved.",
      );
    }
    case "G-17":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.coverageTablesComplete,
        "CERT-G-17-PASS",
        "CERT-G-17-FAIL",
        "CERT-G-17-MISSING",
        "Closed vocabularies and coverage tables are complete.",
        "Coverage tables are incomplete.",
      );
    case "G-18":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.aiProhibitionsPreserved,
        "CERT-G-18-PASS",
        "CERT-G-18-FAIL",
        "CERT-G-18-MISSING",
        "AI prohibitions are preserved.",
        "AI prohibitions were not preserved.",
      );
    case "G-19":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.controlsPreserved,
        "CERT-G-19-PASS",
        "CERT-G-19-FAIL",
        "CERT-G-19-MISSING",
        "Control surfaces are preserved.",
        "Control surfaces were not preserved.",
      );
    case "G-20":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.openIssuesUnresolvedUnchanged,
        "CERT-G-20-PASS",
        "CERT-G-20-FAIL",
        "CERT-G-20-MISSING",
        "OI-01 through OI-06 remain unresolved with owners unchanged.",
        "Open issues were altered or resolved by assumption.",
      );
    case "G-21":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.architectureDecisionsPreserved,
        "CERT-G-21-PASS",
        "CERT-G-21-FAIL",
        "CERT-G-21-MISSING",
        "AD-RTC3-06, AD-RTC3-07, and AD-RTC3-08 remain accepted and unchanged.",
        "Architecture decisions were not preserved.",
      );
    case "G-22":
      return booleanFromEvidence(
        declaration,
        pkg,
        pkg.sideEffectFlagsFalse,
        "CERT-G-22-PASS",
        "CERT-G-22-FAIL",
        "CERT-G-22-MISSING",
        "No prohibited side effects or runtime dependencies exist.",
        "Prohibited side effects or runtime dependencies were detected.",
      );
    case "G-23": {
      const evidence = pkg.gateEvidence[declaration.gateId];
      if (
        !evidence
        || pkg.noRtc310Files === null
        || pkg.noInventedNextPhase === null
      ) {
        return missingEvidence(
          declaration,
          "CERT-G-23-MISSING",
          "No-next-phase evidence was not supplied.",
        );
      }
      const pass = pkg.noRtc310Files && pkg.noInventedNextPhase;
      return fromEvidence(
        declaration,
        evidence,
        pass ? "Pass" : "Fail",
        pass ? "CERT-G-23-PASS" : "CERT-G-23-FAIL",
        pass
          ? "No RTC-3:10 files or invented next phase exist."
          : "RTC-3:10 files or invented next phase were detected.",
      );
    }
    case "G-24":
      return evaluateFullProjectTypeScript(declaration, pkg);
    default: {
      const _exhaustive: never = declaration.gateId;
      return missingEvidence(
        declaration,
        "CERT-UNKNOWN-GATE",
        `Unknown gate fails closed: ${String(_exhaustive)}`,
      );
    }
  }
};

const resolveKind = (
  gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[],
): ExecutiveDecisionRegisterCertificationResultKind => {
  if (gateResults.length !== ExecutiveDecisionRegisterCertificationGates.length) {
    return "NotReady";
  }
  for (const declaration of ExecutiveDecisionRegisterCertificationGates) {
    const found = gateResults.find((item) => item.gateId === declaration.gateId);
    if (!found) {
      return "NotReady";
    }
    assertExecutiveDecisionRegisterCertificationGateCriticality(found.criticality);
    if (found.criticality !== declaration.criticality) {
      return "NotReady";
    }
  }
  for (const item of gateResults) {
    if (!gateDeclarationById(item.gateId)) {
      return "NotReady";
    }
    assertExecutiveDecisionRegisterCertificationGateCriticality(item.criticality);
    if (item.rtc3DiagnosticsCount > 0) {
      return "NotReady";
    }
    if (item.criticality === "Blocking") {
      if (item.result === "Fail" || item.result === "NotEvaluated") {
        return "NotReady";
      }
      continue;
    }
    if (item.criticality === "Disclosure") {
      if (item.result === "Pass") {
        continue;
      }
      if (disclosurePermittedByAdrtc309(gateResults, item)) {
        continue;
      }
      return "NotReady";
    }
    return "NotReady";
  }
  return "ReadyForAuthorization";
};

const collectBlockingFailures = (
  gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[],
): readonly ExecutiveDecisionRegisterCertificationGateResult[] =>
  Object.freeze(
    gateResults.filter((item) => {
      assertExecutiveDecisionRegisterCertificationGateCriticality(item.criticality);
      if (item.rtc3DiagnosticsCount > 0) {
        return true;
      }
      if (item.criticality === "Blocking") {
        return item.result === "Fail" || item.result === "NotEvaluated";
      }
      if (item.criticality === "Disclosure") {
        if (item.result === "Pass") {
          return false;
        }
        return !disclosurePermittedByAdrtc309(gateResults, item);
      }
      return true;
    }),
  );

const triState = (
  value: boolean | null,
): "Pass" | "Fail" | "NotEvaluated" => {
  if (value === null) {
    return "NotEvaluated";
  }
  return value ? "Pass" : "Fail";
};

const classifyFullProject = (
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterFullProjectTypeScriptClassification
  | "NotEvaluatedEvidenceMissing" => {
  if (pkg.typeScript.fullProjectClassification === null) {
    return "NotEvaluatedEvidenceMissing";
  }
  return pkg.typeScript.fullProjectClassification;
};

const buildManifest = (
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
  kind: ExecutiveDecisionRegisterCertificationResultKind,
  gateResults: readonly ExecutiveDecisionRegisterCertificationGateResult[],
): ExecutiveDecisionRegisterCertificationManifest => {
  const blocking = gateResults.filter((item) => item.criticality === "Blocking");
  const disclosure = gateResults.filter(
    (item) => item.criticality === "Disclosure",
  );
  const passedGateCount = gateResults.filter((item) => item.result === "Pass").length;
  const failedGateCount = gateResults.filter((item) => item.result === "Fail").length;
  const notEvaluatedGateCount = gateResults.filter(
    (item) => item.result === "NotEvaluated",
  ).length;
  const blockingPassedCount = blocking.filter((item) => item.result === "Pass").length;
  const blockingFailedCount = blocking.filter((item) => item.result === "Fail").length;
  const blockingNotEvaluatedCount = blocking.filter(
    (item) => item.result === "NotEvaluated",
  ).length;
  const disclosurePassedCount = disclosure.filter(
    (item) => item.result === "Pass",
  ).length;
  const disclosureFailedCount = disclosure.filter(
    (item) => item.result === "Fail",
  ).length;
  const disclosureNotEvaluatedCount = disclosure.filter(
    (item) => item.result === "NotEvaluated",
  ).length;
  const rtc3PhaseTestResults = Object.freeze(
    REQUIRED_RTC3_SUITES.map((id) => {
      const suite = suiteFor(pkg.testSuites, id);
      return suite
        ?? Object.freeze({
          suiteId: id,
          present: false,
          passed: false,
          testCount: 0,
          passCount: 0,
          failCount: 0,
        });
    }),
  );
  const rtc2 = suiteFor(pkg.testSuites, "RTC-2:9");
  const rtc1 = suiteFor(pkg.testSuites, "RTC-1:9");
  const fullProjectClassification = classifyFullProject(pkg);
  const fullProjectTypeScriptResult: "Pass" | "Fail" | "NotEvaluated" =
    fullProjectClassification === "Pass"
      ? "Pass"
      : fullProjectClassification === "Fail"
      ? "Fail"
      : "NotEvaluated";
  const scopedTypeScriptResult = triState(
    pkg.typeScript.scopedSourcesAndTestsPassed,
  );
  const productionTypeScriptResult = triState(
    pkg.typeScript.productionSourcesPassed,
  );
  const rtc3ScopedTypeScriptHealth =
    scopedTypeScriptResult === "Pass" && productionTypeScriptResult === "Pass"
      ? ("certified" as const)
      : ("not certified" as const);

  return Object.freeze({
    certificationId: ExecutiveDecisionRegisterCertificationId,
    namespace: ExecutiveDecisionRegisterCertificationNamespace,
    status: ExecutiveDecisionRegisterCertificationStatus,
    readiness: ExecutiveDecisionRegisterCertificationReadiness,
    upstreamAssuranceIdentity:
      ExecutiveDecisionRegisterCertificationSourceAssurance,
    certificationResult: kind,
    gateResults,
    totalGateCount: gateResults.length,
    blockingGateCount: blocking.length,
    blockingPassedCount,
    blockingFailedCount,
    blockingNotEvaluatedCount,
    disclosureGateCount: disclosure.length,
    disclosurePassedCount,
    disclosureFailedCount,
    disclosureNotEvaluatedCount,
    passedGateCount,
    failedGateCount,
    notEvaluatedGateCount,
    rtc3PhaseTestResults,
    rtc2RegressionResults: Object.freeze(rtc2 ? [rtc2] : []),
    rtc1RegressionResults: Object.freeze(rtc1 ? [rtc1] : []),
    scopedTypeScriptResult,
    productionTypeScriptResult,
    fullProjectTypeScriptResult,
    fullProjectClassification,
    fullProjectDiagnosticsCount: pkg.typeScript.fullProjectDiagnosticsCount,
    fullProjectRtc3DiagnosticsCount:
      pkg.typeScript.fullProjectRtc3DiagnosticsCount,
    repositoryWideTypeScriptHealth: "not certified" as const,
    rtc3ScopedTypeScriptHealth,
    eslintResult:
      pkg.eslintExitCode === null
        ? "NotEvaluated"
        : pkg.eslintExitCode === 0
        && pkg.eslintErrorCount === 0
        && pkg.eslintWarningCount === 0
        ? "Pass"
        : "Fail",
    dependencyBoundaryResult: triState(pkg.dependencyBoundaryOk),
    architectureDecisionIds: Object.freeze([
      "AD-RTC3-06",
      "AD-RTC3-07",
      "AD-RTC3-08",
      "AD-RTC3-09",
    ] as const),
    phaseDecisionIds: PHASE_DECISION_IDS,
    openIssueIds: Object.freeze([
      "OI-01",
      "OI-02",
      "OI-03",
      "OI-04",
      "OI-05",
      "OI-06",
    ] as const),
    humanAuthorizationRequired: true as const,
    authorizationRecorded: false as const,
    consumptionAuthorized: false as const,
    integrationAuthorized: false as const,
    deploymentAuthorized: false as const,
    publicIndexAuthorized: false as const,
    rtc310CreationAuthorized: false as const,
    nextPhaseDecisionRequired: true as const,
    terminalDecisionMarker:
      ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
    evidenceDigest: pkg.evidenceDigest,
    summary: [
      ExecutiveDecisionRegisterCertificationId,
      kind,
      pkg.packageId,
      String(blockingPassedCount),
      String(blockingFailedCount),
      String(disclosureFailedCount),
      String(passedGateCount),
      String(failedGateCount),
      String(notEvaluatedGateCount),
      fullProjectClassification,
      String(pkg.typeScript.fullProjectDiagnosticsCount ?? 0),
      String(pkg.typeScript.fullProjectRtc3DiagnosticsCount ?? 0),
      pkg.evidenceDigest,
    ].join("|"),
    inventedTimestamp: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
};

const freezePackage = (
  pkg: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationEvidencePackage =>
  Object.freeze({
    ...pkg,
    testSuites: Object.freeze(pkg.testSuites.map((item) => Object.freeze({ ...item }))),
    typeScript: Object.freeze({ ...pkg.typeScript }),
    gateEvidence: Object.freeze(
      Object.fromEntries(
        Object.entries(pkg.gateEvidence).map(([key, value]) => [
          key,
          Object.freeze({ ...value }),
        ]),
      ),
    ) as ExecutiveDecisionRegisterCertificationEvidencePackage["gateEvidence"],
    metadataOnly: true as const,
    immutable: true as const,
    containsPayload: false as const,
  });

export const evaluateExecutiveDecisionRegisterCertificationGates = (
  evidencePackage: ExecutiveDecisionRegisterCertificationEvidencePackage,
): readonly ExecutiveDecisionRegisterCertificationGateResult[] => {
  const pkg = freezePackage(evidencePackage);
  return Object.freeze(
    ExecutiveDecisionRegisterCertificationGates.map((declaration) =>
      evaluateGate(declaration, pkg)
    ),
  );
};

export const certifyExecutiveDecisionRegister = (
  evidencePackage: ExecutiveDecisionRegisterCertificationEvidencePackage,
): ExecutiveDecisionRegisterCertificationResult => {
  if (
    ExecutiveDecisionRegisterAssurance.identity.id
      !== ExecutiveDecisionRegisterCertificationSourceAssurance
  ) {
    throw new Error(
      "RTC-3:9 Certification requires the canonical RTC-3:8 Assurance aggregate.",
    );
  }

  const pkg = freezePackage(evidencePackage);
  const gateResults = evaluateExecutiveDecisionRegisterCertificationGates(pkg);
  const kind = resolveKind(gateResults);
  const manifest = buildManifest(pkg, kind, gateResults);

  if (kind === "ReadyForAuthorization") {
    return Object.freeze({
      kind: "ReadyForAuthorization" as const,
      reasonCode: "CERT-READY-FOR-AUTHORIZATION" as const,
      reason:
        "All Blocking certification gates passed under AD-RTC3-09. Disclosure " +
        "gates were evaluated and recorded truthfully. ReadyForAuthorization " +
        "is not authorization. Human authorization remains separately required. " +
        "Consumption, integration, and deployment remain unauthorized.",
      packageId: pkg.packageId,
      gateResults,
      manifest,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      requiresHumanAuthorization: true as const,
      authorizesConsumption: false as const,
      authorizesIntegration: false as const,
      authorizesDeployment: false as const,
    });
  }

  const blocking = collectBlockingFailures(gateResults);

  return Object.freeze({
    kind: "NotReady" as const,
    reasonCode: blocking[0]?.reasonCode ?? "CERT-NOT-READY",
    reason:
      blocking[0]?.message
      ?? "One or more Blocking certification gates failed or were not evaluated, "
        + "or Disclosure evidence was incomplete, or RTC-3 diagnostics were present.",
    packageId: pkg.packageId,
    gateResults,
    manifest,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    authorizesConsumption: false as const,
    authorizesIntegration: false as const,
    authorizesDeployment: false as const,
  });
};

export const validateExecutiveDecisionRegisterCertificationCoverage = ():
  boolean => {
  const gateSet = new Set(CERTIFICATION_GATE_COVERAGE);
  const resultSet = new Set(CERTIFICATION_RESULT_COVERAGE);
  const gateResultSet = new Set(GATE_RESULT_COVERAGE);
  const evidenceSet = new Set(EVIDENCE_KIND_COVERAGE);
  const criticalitySet = new Set(GATE_CRITICALITY_COVERAGE);
  if (gateSet.size !== CERTIFICATION_GATE_COVERAGE.length) {
    return false;
  }
  if (resultSet.size !== CERTIFICATION_RESULT_COVERAGE.length) {
    return false;
  }
  if (gateResultSet.size !== GATE_RESULT_COVERAGE.length) {
    return false;
  }
  if (evidenceSet.size !== EVIDENCE_KIND_COVERAGE.length) {
    return false;
  }
  if (criticalitySet.size !== GATE_CRITICALITY_COVERAGE.length) {
    return false;
  }
  for (const gateId of ExecutiveDecisionRegisterCertificationGateIds) {
    if (!gateSet.has(gateId)) {
      return false;
    }
  }
  for (const kind of ExecutiveDecisionRegisterCertificationResultKinds) {
    if (!resultSet.has(kind)) {
      return false;
    }
  }
  for (const kind of ExecutiveDecisionRegisterCertificationGateResultKinds) {
    if (!gateResultSet.has(kind)) {
      return false;
    }
  }
  for (const kind of ExecutiveDecisionRegisterCertificationEvidenceKinds) {
    if (!evidenceSet.has(kind)) {
      return false;
    }
  }
  for (const declaration of ExecutiveDecisionRegisterCertificationGates) {
    if (!criticalitySet.has(declaration.criticality)) {
      return false;
    }
  }
  if (
    CERTIFICATION_GATE_COVERAGE.join("|")
      !== ExecutiveDecisionRegisterCertificationGateIds.join("|")
  ) {
    return false;
  }
  if (ARCHITECTURE_DECISION_COVERAGE.filter((id) => id === "AD-RTC3-09").length !== 1) {
    return false;
  }
  const blockingCount = ExecutiveDecisionRegisterCertificationGates.filter(
    (item) => item.criticality === "Blocking",
  ).length;
  const disclosureCount = ExecutiveDecisionRegisterCertificationGates.filter(
    (item) => item.criticality === "Disclosure",
  ).length;
  if (blockingCount !== 23 || disclosureCount !== 1) {
    return false;
  }
  return true;
};
