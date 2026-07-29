/**
 * RTC-2:9 — Executive Journal Runtime Certification Rules.
 *
 * Pure deterministic gate evaluation over explicitly supplied evidence.
 * Never deploys, never authorizes, never reads clocks or CI systems.
 *
 * Ownership: owned exclusively by RTC-2:9.
 */

import { ExecutiveJournalRuntimeAssurance } from "./executiveJournalRuntimeAssurance.ts";
import {
  ExecutiveJournalRuntimeCertificationId,
  ExecutiveJournalRuntimeCertificationVersion,
} from "./executiveJournalRuntimeCertificationIdentity.ts";
import {
  ExecutiveJournalRuntimeCertificationGateIds,
  ExecutiveJournalRuntimeNonWaivableGateIds,
} from "./executiveJournalRuntimeCertificationLifecycle.ts";
import type {
  ExecutiveJournalRuntimeCertificationEvidencePackage,
  ExecutiveJournalRuntimeCertificationException,
  ExecutiveJournalRuntimeCertificationGateId,
  ExecutiveJournalRuntimeCertificationGateResult,
  ExecutiveJournalRuntimeCertificationGateResultKind,
  ExecutiveJournalRuntimeCertificationManifest,
  ExecutiveJournalRuntimeCertificationResult,
  ExecutiveJournalRuntimeCertificationResultKind,
} from "./executiveJournalRuntimeCertificationTypes.ts";

export interface ExecutiveJournalRuntimeCertificationGateDeclaration {
  readonly gateId: ExecutiveJournalRuntimeCertificationGateId;
  readonly gateName: string;
  readonly order: number;
  readonly waivable: boolean;
  readonly description: string;
  readonly evaluatesOnly: true;
  readonly authorizesDeployment: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const EXPECTED_PHASES = Object.freeze([
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
] as const);

const REQUIRED_SUITES = Object.freeze([
  "RTC-2:1",
  "RTC-2:2",
  "RTC-2:3",
  "RTC-2:4",
  "RTC-2:5",
  "RTC-2:6",
  "RTC-2:7",
  "RTC-2:8",
  "RTC-1:9",
] as const);

const OPEN_ISSUE_OWNERS = Object.freeze({
  "OI-01": "Records / legal",
  "OI-02": "Privacy + legal",
  "OI-03": "Executive governance",
  "OI-04": "Privacy + security",
  "OI-05": "Journal steward",
  "OI-06": "Policy authority",
} as const);

const gate = (
  order: number,
  gateId: ExecutiveJournalRuntimeCertificationGateId,
  gateName: string,
  waivable: boolean,
  description: string,
): ExecutiveJournalRuntimeCertificationGateDeclaration =>
  Object.freeze({
    gateId,
    gateName,
    order,
    waivable,
    description,
    evaluatesOnly: true as const,
    authorizesDeployment: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveJournalRuntimeCertificationGates = Object.freeze([
  gate(1, "G-01", "Upstream identity", false, "Exact RTC-2:1–2:8 identities and namespaces."),
  gate(2, "G-02", "Upstream readiness", true, "Every phase readiness required by the next phase."),
  gate(3, "G-03", "Assurance", false, "Applicable RTC-2:8 result must be Reconciled."),
  gate(4, "G-04", "Tests", true, "Passing RTC-2:1–2:8 and relevant RTC-1 evidence."),
  gate(5, "G-05", "Type safety", true, "Strict TypeScript success."),
  gate(6, "G-06", "Lint", true, "Zero ESLint errors and warnings."),
  gate(7, "G-07", "Dependency boundaries", false, "No prohibited imports or package additions."),
  gate(8, "G-08", "Append-only integrity", false, "Append-only and atomicity evidence."),
  gate(9, "G-09", "Authority", true, "Explicit authority and delegation boundaries."),
  gate(10, "G-10", "AI boundary", false, "AI cannot satisfy prohibited authority actions."),
  gate(11, "G-11", "Private reflection", false, "Structural isolation of private reflection."),
  gate(12, "G-12", "Disclosure", false, "Fail-closed disclosure evidence."),
  gate(13, "G-13", "Telemetry", false, "No journal payload in routine telemetry."),
  gate(14, "G-14", "Determinism", true, "Stable ordering and equivalent outputs."),
  gate(15, "G-15", "Immutability", true, "Mutation-safe canonical exports."),
  gate(16, "G-16", "Open issues", true, "OI-01–OI-06 unresolved with unchanged owners."),
  gate(17, "G-17", "Exceptions", true, "Exceptions complete, approved, bounded, unexpired."),
  gate(18, "G-18", "Human authorization boundary", false, "No deployment or AI authorization claims."),
] as const);

const isPresent = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== "";

const isNonWaivable = (
  gateId: ExecutiveJournalRuntimeCertificationGateId,
): boolean =>
  (ExecutiveJournalRuntimeNonWaivableGateIds as readonly string[]).includes(
    gateId,
  );

const gateResult = (
  declaration: ExecutiveJournalRuntimeCertificationGateDeclaration,
  result: ExecutiveJournalRuntimeCertificationGateResultKind,
  reasonCode: string,
  message: string,
  exceptionId: string | null = null,
): ExecutiveJournalRuntimeCertificationGateResult =>
  Object.freeze({
    gateId: declaration.gateId,
    gateName: declaration.gateName,
    order: declaration.order,
    result,
    waivable: declaration.waivable,
    reasonCode,
    message,
    exceptionId,
    metadataOnly: true as const,
    immutable: true as const,
  });

const booleanGate = (
  declaration: ExecutiveJournalRuntimeCertificationGateDeclaration,
  value: boolean | null,
  passCode: string,
  failCode: string,
  missingCode: string,
  passMessage: string,
  failMessage: string,
): ExecutiveJournalRuntimeCertificationGateResult => {
  if (value === null) {
    return gateResult(
      declaration,
      "NotEvaluated",
      missingCode,
      "Mandatory evidence was not evaluated.",
    );
  }
  if (value === true) {
    return gateResult(declaration, "Pass", passCode, passMessage);
  }
  return gateResult(declaration, "Fail", failCode, failMessage);
};

const exceptionForGate = (
  pkg: ExecutiveJournalRuntimeCertificationEvidencePackage,
  gateId: ExecutiveJournalRuntimeCertificationGateId,
): ExecutiveJournalRuntimeCertificationException | null => {
  const matches = pkg.exceptions.filter(
    (item) => item.affectedGateId === gateId,
  );
  return matches.length === 1 ? matches[0]! : null;
};

const exceptionValid = (
  exception: ExecutiveJournalRuntimeCertificationException,
  evaluationTime: string,
): { readonly ok: boolean; readonly reasonCode: string; readonly message: string } => {
  if (!exception.approved) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-UNAPPROVED",
      message: "Exception approval is missing.",
    });
  }
  if (!isPresent(exception.accountableOwner)) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-OWNER",
      message: "Exception owner is missing.",
    });
  }
  if (!isPresent(exception.approvingAuthorityRef)) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-APPROVAL",
      message: "Exception approving authority reference is missing.",
    });
  }
  if (exception.approvingActorKind === "Ai") {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-AI",
      message: "AI cannot approve an exception.",
    });
  }
  if (!isPresent(exception.compensatingControl)) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-CONTROL",
      message: "Exception compensating control is missing.",
    });
  }
  if (!isPresent(exception.expiry)) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-EXPIRY",
      message: "Exception expiry is missing.",
    });
  }
  if (!isPresent(evaluationTime)) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-EVAL-TIME",
      message: "Explicit evaluation-time value is required for expiry checks.",
    });
  }
  if (exception.expiry <= evaluationTime) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-EXPIRED",
      message: "Exception is expired relative to supplied evaluation time.",
    });
  }
  if (
    !isPresent(exception.rationale)
    || !isPresent(exception.scope)
    || !isPresent(exception.evidenceRef)
    || exception.reviewRequired !== true
  ) {
    return Object.freeze({
      ok: false,
      reasonCode: "CERT-EXCEPTION-MALFORMED",
      message: "Exception metadata is incomplete.",
    });
  }
  return Object.freeze({
    ok: true,
    reasonCode: "CERT-EXCEPTION-OK",
    message: "Approved bounded exception accepted for waivable gate.",
  });
};

const applyException = (
  declaration: ExecutiveJournalRuntimeCertificationGateDeclaration,
  base: ExecutiveJournalRuntimeCertificationGateResult,
  pkg: ExecutiveJournalRuntimeCertificationEvidencePackage,
): ExecutiveJournalRuntimeCertificationGateResult => {
  if (base.result !== "Fail" && base.result !== "NotEvaluated") {
    return base;
  }
  if (!declaration.waivable || isNonWaivable(declaration.gateId)) {
    return base;
  }
  const exception = exceptionForGate(pkg, declaration.gateId);
  if (!exception) {
    return base;
  }
  const validity = exceptionValid(exception, pkg.evaluationTime);
  if (!validity.ok) {
    return gateResult(
      declaration,
      "Fail",
      validity.reasonCode,
      validity.message,
      exception.exceptionId,
    );
  }
  return gateResult(
    declaration,
    "Exception",
    validity.reasonCode,
    validity.message,
    exception.exceptionId,
  );
};

const evaluateGates = (
  pkg: ExecutiveJournalRuntimeCertificationEvidencePackage,
): readonly ExecutiveJournalRuntimeCertificationGateResult[] => {
  const results: ExecutiveJournalRuntimeCertificationGateResult[] = [];

  for (const declaration of ExecutiveJournalRuntimeCertificationGates) {
    let base: ExecutiveJournalRuntimeCertificationGateResult;

    switch (declaration.gateId) {
      case "G-01": {
        const missing = EXPECTED_PHASES.some((expected) => {
          const found = pkg.phaseIdentities.find(
            (item) => item.phaseId === expected.phaseId,
          );
          return !found
            || found.identity !== expected.identity
            || found.namespace !== expected.namespace;
        });
        base = missing
          ? gateResult(
            declaration,
            "Fail",
            "CERT-IDENTITY",
            "Missing or incorrect RTC-2 phase identity or namespace.",
          )
          : gateResult(
            declaration,
            "Pass",
            "CERT-IDENTITY-OK",
            "Upstream identities and namespaces match.",
          );
        break;
      }
      case "G-02": {
        const readinessMismatch = EXPECTED_PHASES.some((expected) => {
          const found = pkg.phaseIdentities.find(
            (item) => item.phaseId === expected.phaseId,
          );
          return !found || found.readiness !== expected.readiness;
        });
        base = readinessMismatch
          ? gateResult(
            declaration,
            "Fail",
            "CERT-READINESS",
            "Incorrect upstream readiness state.",
          )
          : gateResult(
            declaration,
            "Pass",
            "CERT-READINESS-OK",
            "Upstream readiness states match required transitions.",
          );
        break;
      }
      case "G-03": {
        if (!isPresent(pkg.assuranceResultKind) || !isPresent(pkg.assuranceResultRef)) {
          base = gateResult(
            declaration,
            "NotEvaluated",
            "CERT-ASSURANCE-MISSING",
            "Assurance result reference is missing.",
          );
        } else if (pkg.assuranceResultKind === "Reconciled") {
          base = gateResult(
            declaration,
            "Pass",
            "CERT-ASSURANCE-OK",
            "Assurance result is Reconciled.",
          );
        } else {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-ASSURANCE-FAIL",
            `Assurance result ${pkg.assuranceResultKind} is not acceptable for certification.`,
          );
        }
        break;
      }
      case "G-04": {
        const missingSuite = REQUIRED_SUITES.some((suiteId) => {
          const suite = pkg.testSuites.find((item) => item.suiteId === suiteId);
          return !suite || !suite.present;
        });
        const failingSuite = pkg.testSuites.some(
          (item) =>
            (REQUIRED_SUITES as readonly string[]).includes(item.suiteId)
            && item.present
            && !item.passed,
        );
        if (missingSuite) {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-TESTS-MISSING",
            "Missing required test suite evidence.",
          );
        } else if (failingSuite) {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-TESTS-FAIL",
            "One or more required test suites failed.",
          );
        } else {
          base = gateResult(
            declaration,
            "Pass",
            "CERT-TESTS-OK",
            "Required test suites present and passing.",
          );
        }
        break;
      }
      case "G-05":
        base = booleanGate(
          declaration,
          pkg.typescriptPassed,
          "CERT-TSC-OK",
          "CERT-TSC-FAIL",
          "CERT-TSC-MISSING",
          "Strict TypeScript succeeded.",
          "Strict TypeScript failed.",
        );
        break;
      case "G-06":
        base = booleanGate(
          declaration,
          pkg.eslintZeroWarnings,
          "CERT-ESLINT-OK",
          "CERT-ESLINT-FAIL",
          "CERT-ESLINT-MISSING",
          "ESLint reported zero errors and zero warnings.",
          "ESLint reported errors or warnings.",
        );
        break;
      case "G-07":
        base = booleanGate(
          declaration,
          pkg.dependencyBoundaryOk,
          "CERT-DEPS-OK",
          "CERT-DEPS-FAIL",
          "CERT-DEPS-MISSING",
          "Dependency boundaries are satisfied.",
          "Prohibited dependency evidence failed.",
        );
        break;
      case "G-08": {
        const ok = pkg.appendOnlyOk === true
          && pkg.sequenceContinuityOk === true
          && pkg.atomicityOk === true
          && pkg.integrityEvidenceOk === true
          && pkg.idempotencyOk === true;
        if (
          pkg.appendOnlyOk === null
          || pkg.sequenceContinuityOk === null
          || pkg.atomicityOk === null
          || pkg.integrityEvidenceOk === null
          || pkg.idempotencyOk === null
        ) {
          base = gateResult(
            declaration,
            "NotEvaluated",
            "CERT-APPEND-MISSING",
            "Append-only integrity evidence is incomplete.",
          );
        } else {
          base = ok
            ? gateResult(
              declaration,
              "Pass",
              "CERT-APPEND-OK",
              "Append-only, sequence, atomicity, and integrity evidence passed.",
            )
            : gateResult(
              declaration,
              "Fail",
              "CERT-APPEND-FAIL",
              "Append-only integrity evidence failed.",
            );
        }
        break;
      }
      case "G-09":
        base = booleanGate(
          declaration,
          pkg.authorityBoundaryOk,
          "CERT-AUTH-OK",
          "CERT-AUTH-FAIL",
          "CERT-AUTH-MISSING",
          "Authority boundaries preserved.",
          "Authority-boundary evidence failed.",
        );
        break;
      case "G-10":
        base = booleanGate(
          declaration,
          pkg.aiBoundaryOk,
          "CERT-AI-OK",
          "CERT-AI-FAIL",
          "CERT-AI-MISSING",
          "AI boundary evidence passed.",
          "AI-boundary evidence failed.",
        );
        break;
      case "G-11":
        base = booleanGate(
          declaration,
          pkg.privateReflectionIsolationOk,
          "CERT-PRIVATE-OK",
          "CERT-PRIVATE-FAIL",
          "CERT-PRIVATE-MISSING",
          "Private-reflection isolation evidence passed.",
          "Private-reflection isolation evidence failed.",
        );
        break;
      case "G-12":
        base = booleanGate(
          declaration,
          pkg.disclosureFailClosedOk,
          "CERT-DISCLOSURE-OK",
          "CERT-DISCLOSURE-FAIL",
          "CERT-DISCLOSURE-MISSING",
          "Disclosure fail-closed evidence passed.",
          "Disclosure fail-closed evidence failed.",
        );
        break;
      case "G-13":
        base = booleanGate(
          declaration,
          pkg.telemetryPayloadExcludedOk,
          "CERT-TELEMETRY-OK",
          "CERT-TELEMETRY-FAIL",
          "CERT-TELEMETRY-MISSING",
          "Telemetry payload-exclusion evidence passed.",
          "Payload-bearing telemetry evidence failed.",
        );
        break;
      case "G-14":
        base = booleanGate(
          declaration,
          pkg.determinismOk,
          "CERT-DET-OK",
          "CERT-DET-FAIL",
          "CERT-DET-MISSING",
          "Determinism evidence passed.",
          "Determinism evidence failed.",
        );
        break;
      case "G-15":
        base = booleanGate(
          declaration,
          pkg.immutabilityOk,
          "CERT-IMM-OK",
          "CERT-IMM-FAIL",
          "CERT-IMM-MISSING",
          "Immutability evidence passed.",
          "Immutability evidence failed.",
        );
        break;
      case "G-16": {
        const ids = pkg.openIssues.map((item) => item.issueId);
        const expected = Object.keys(OPEN_ISSUE_OWNERS);
        const ownersOk = expected.every((issueId) => {
          const issue = pkg.openIssues.find((item) => item.issueId === issueId);
          return issue
            && issue.resolved === false
            && issue.accountableOwner
              === OPEN_ISSUE_OWNERS[issueId as keyof typeof OPEN_ISSUE_OWNERS];
        });
        const classifiedWithoutAuthority = pkg.openIssues.some(
          (item) =>
            item.releaseEffect !== "Unclassified"
            && !isPresent(item.releaseEffectAuthorityRef),
        );
        if (ids.length !== expected.length || !ownersOk) {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-OI-REGISTER",
            "Open-issue register is incomplete or owners changed.",
          );
        } else if (classifiedWithoutAuthority) {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-OI-CLASSIFICATION",
            "Open issues must not be classified without authority evidence.",
          );
        } else {
          base = gateResult(
            declaration,
            "Pass",
            "CERT-OI-OK",
            "OI-01 through OI-06 remain unresolved with unchanged owners.",
          );
        }
        break;
      }
      case "G-17": {
        if (pkg.exceptions.length === 0) {
          base = gateResult(
            declaration,
            "Pass",
            "CERT-EXCEPTION-NONE",
            "No exceptions supplied.",
          );
          break;
        }
        const invalid = pkg.exceptions
          .map((item) => exceptionValid(item, pkg.evaluationTime))
          .find((item) => !item.ok);
        const targetsNonWaivable = pkg.exceptions.some((item) =>
          isNonWaivable(item.affectedGateId)
        );
        if (targetsNonWaivable) {
          base = gateResult(
            declaration,
            "Fail",
            "CERT-EXCEPTION-NONWAIVABLE",
            "Exception cannot override a non-waivable gate.",
          );
        } else if (invalid) {
          base = gateResult(
            declaration,
            "Fail",
            invalid.reasonCode,
            invalid.message,
          );
        } else {
          base = gateResult(
            declaration,
            "Pass",
            "CERT-EXCEPTION-REGISTER-OK",
            "Exception register is complete and bounded.",
          );
        }
        break;
      }
      case "G-18": {
        const claims = pkg.claimsDeploymentAuthorization
          || pkg.claimsLegalApproval
          || pkg.claimsPrivacyApproval
          || pkg.claimsRecordsPolicyApproval
          || pkg.claimsAiApproval;
        base = claims
          ? gateResult(
            declaration,
            "Fail",
            "CERT-HUMAN-BOUNDARY",
            "Certification evidence claims unauthorized approval or deployment.",
          )
          : gateResult(
            declaration,
            "Pass",
            "CERT-HUMAN-BOUNDARY-OK",
            "Human authorization boundary preserved.",
          );
        break;
      }
      default:
        base = gateResult(
          declaration,
          "NotEvaluated",
          "CERT-UNKNOWN-GATE",
          "Unknown gate.",
        );
    }

    if (
      declaration.gateId === "G-08"
      && pkg.replayRecoveryRequired
      && pkg.replayRecoveryOk !== true
    ) {
      base = pkg.replayRecoveryOk === null
        ? gateResult(
          declaration,
          "NotEvaluated",
          "CERT-REPLAY-MISSING",
          "Required replay/recovery evidence is missing.",
        )
        : gateResult(
          declaration,
          "Fail",
          "CERT-REPLAY-FAIL",
          "Required replay/recovery evidence failed.",
        );
    }

    results.push(applyException(declaration, base, pkg));
  }

  return Object.freeze(results);
};

const resolveKind = (
  gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[],
): ExecutiveJournalRuntimeCertificationResultKind => {
  const hardFail = gateResults.some(
    (item) => item.result === "Fail" || item.result === "NotEvaluated",
  );
  if (hardFail) {
    return "NotReady";
  }
  const hasException = gateResults.some((item) => item.result === "Exception");
  if (hasException) {
    return "ConditionallyReady";
  }
  return "ReadyForAuthorization";
};

const buildManifest = (
  pkg: ExecutiveJournalRuntimeCertificationEvidencePackage,
  kind: ExecutiveJournalRuntimeCertificationResultKind,
  gateResults: readonly ExecutiveJournalRuntimeCertificationGateResult[],
): ExecutiveJournalRuntimeCertificationManifest => {
  const failedGateIds = Object.freeze(
    gateResults
      .filter((item) => item.result === "Fail" || item.result === "NotEvaluated")
      .map((item) => item.gateId),
  );
  const exceptionBoundGateIds = Object.freeze(
    gateResults
      .filter((item) => item.result === "Exception")
      .map((item) => item.gateId),
  );
  return Object.freeze({
    certificationId: ExecutiveJournalRuntimeCertificationId,
    certificationVersion: ExecutiveJournalRuntimeCertificationVersion,
    candidateIdentity: pkg.candidateIdentity,
    candidateVersion: pkg.candidateVersion,
    upstreamIdentityChain: Object.freeze(
      EXPECTED_PHASES.map((item) => item.identity),
    ),
    result: kind,
    gateResults,
    failedGateIds,
    exceptionBoundGateIds,
    openIssueIds: Object.freeze(pkg.openIssues.map((item) => item.issueId)),
    requiresHumanAuthorization: true as const,
    prohibitedAutomatedActions: Object.freeze([
      "deploy",
      "publish-package",
      "change-feature-flag",
      "modify-infrastructure",
      "ai-authorize-release",
      "ai-approve-exception",
    ]),
    evidencePackageDigest: pkg.evidencePackageDigest,
    summary: [
      ExecutiveJournalRuntimeCertificationId,
      ExecutiveJournalRuntimeCertificationVersion,
      kind,
      pkg.packageId,
      String(failedGateIds.length),
      String(exceptionBoundGateIds.length),
      pkg.evidencePackageDigest,
    ].join("|"),
    isDeploymentAuthorization: false as const,
    isLegalApproval: false as const,
    isPrivacyApproval: false as const,
    isRecordsPolicyApproval: false as const,
    canBeApprovedByAi: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
};

/**
 * Certify an immutable evidence package.
 * Pure. Deterministic. Never authorizes deployment.
 */
export function certifyExecutiveJournalRuntime(
  pkg: ExecutiveJournalRuntimeCertificationEvidencePackage,
): ExecutiveJournalRuntimeCertificationResult {
  if (
    ExecutiveJournalRuntimeAssurance.identity.id
      !== "RTC-2:8/ExecutiveJournalRuntimeReconciliationAssurance"
  ) {
    const gateResults = Object.freeze([
      gateResult(
        ExecutiveJournalRuntimeCertificationGates[0]!,
        "Fail",
        "CERT-UNKNOWN-ASSURANCE",
        "Unrecognized assurance aggregate identity.",
      ),
    ]);
    const manifest = buildManifest(pkg, "NotReady", gateResults);
    return Object.freeze({
      kind: "NotReady" as const,
      reasonCode: "CERT-UNKNOWN-ASSURANCE",
      reason: "Unrecognized assurance aggregate identity.",
      packageId: pkg.packageId,
      gateResults,
      manifest,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      authorizesDeployment: false as const,
    });
  }

  if (
    !isPresent(pkg.packageId)
    || !isPresent(pkg.candidateIdentity)
    || !isPresent(pkg.candidateVersion)
    || !isPresent(pkg.evidencePackageDigest)
    || !isPresent(pkg.evaluationTime)
  ) {
    const gateResults = evaluateGates(pkg);
    const forced = Object.freeze(
      gateResults.map((item, index) =>
        index === 0
          ? gateResult(
            ExecutiveJournalRuntimeCertificationGates[0]!,
            "Fail",
            "CERT-PACKAGE-MALFORMED",
            "Certification evidence package is missing mandatory descriptors.",
          )
          : item
      ),
    );
    const manifest = buildManifest(pkg, "NotReady", forced);
    return Object.freeze({
      kind: "NotReady" as const,
      reasonCode: "CERT-PACKAGE-MALFORMED",
      reason: "Certification evidence package is missing mandatory descriptors.",
      packageId: pkg.packageId || "missing",
      gateResults: forced,
      manifest,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      authorizesDeployment: false as const,
    });
  }

  const gateResults = evaluateGates(pkg);
  const kind = resolveKind(gateResults);
  const manifest = buildManifest(pkg, kind, gateResults);
  const firstFailure = gateResults.find(
    (item) => item.result === "Fail" || item.result === "NotEvaluated",
  );

  if (kind === "NotReady") {
    return Object.freeze({
      kind: "NotReady" as const,
      reasonCode: firstFailure?.reasonCode ?? "CERT-NOT-READY",
      reason: firstFailure?.message
        ?? "One or more mandatory certification gates failed.",
      packageId: pkg.packageId,
      gateResults,
      manifest,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      authorizesDeployment: false as const,
    });
  }

  if (kind === "ConditionallyReady") {
    return Object.freeze({
      kind: "ConditionallyReady" as const,
      reasonCode: "CERT-CONDITIONALLY-READY",
      reason:
        "Non-waivable gates passed; waivable conditions remain under approved exceptions. Not production authorization.",
      packageId: pkg.packageId,
      gateResults,
      manifest,
      metadataOnly: true as const,
      immutable: true as const,
      deterministic: true as const,
      authorizesDeployment: false as const,
    });
  }

  return Object.freeze({
    kind: "ReadyForAuthorization" as const,
    reasonCode: "CERT-READY-FOR-AUTHORIZATION",
    reason:
      "All mandatory gates passed. Evidence package may be presented for human authorization only.",
    packageId: pkg.packageId,
    gateResults,
    manifest,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    authorizesDeployment: false as const,
    requiresHumanAuthorization: true as const,
  });
}

export function isExecutiveJournalRuntimeReadyForAuthorization(
  result: ExecutiveJournalRuntimeCertificationResult,
): boolean {
  return result.kind === "ReadyForAuthorization";
}

export function isExecutiveJournalRuntimeCertificationNotReady(
  result: ExecutiveJournalRuntimeCertificationResult,
): boolean {
  return result.kind === "NotReady";
}

export function getExecutiveJournalRuntimeCertificationGateResults(
  result: ExecutiveJournalRuntimeCertificationResult,
): readonly ExecutiveJournalRuntimeCertificationGateResult[] {
  return result.gateResults;
}

export function validateExecutiveJournalCertificationGateCatalogue(): boolean {
  const gates: readonly ExecutiveJournalRuntimeCertificationGateDeclaration[] =
    ExecutiveJournalRuntimeCertificationGates;
  if (gates.length !== ExecutiveJournalRuntimeCertificationGateIds.length) {
    return false;
  }
  const ids = new Set(gates.map((item) => item.gateId));
  return ids.size === gates.length;
}
