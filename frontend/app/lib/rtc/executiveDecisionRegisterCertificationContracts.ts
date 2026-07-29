/**
 * RTC-3:9 — Executive Decision Register Certification Contracts.
 *
 * Certification request, evidence, gate result, certification result,
 * manifest, and deterministic summary contracts.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

export type ExecutiveDecisionRegisterCertificationContractName =
  | "DecisionRegisterCertificationEvidencePackage"
  | "DecisionRegisterCertificationGateResult"
  | "DecisionRegisterCertificationResult"
  | "DecisionRegisterCertificationManifest"
  | "DecisionRegisterCertificationSummary";

export interface ExecutiveDecisionRegisterCertificationContractDeclaration {
  readonly contractId:
    `RTC-3:9/Contract/${ExecutiveDecisionRegisterCertificationContractName}`;
  readonly contractName: ExecutiveDecisionRegisterCertificationContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly executable: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const contract = (
  contractName: ExecutiveDecisionRegisterCertificationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterCertificationContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:9/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    executable: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

export const ExecutiveDecisionRegisterCertificationContracts = Object.freeze([
  contract(
    "DecisionRegisterCertificationEvidencePackage",
    "Decision Register Certification Evidence Package",
    "Immutable caller-supplied verification evidence. No payloads. No clock, CI, or filesystem access by RTC-3:9.",
    Object.freeze([
      "packageId",
      "evidenceDigest",
      "assuranceResultKind",
      "assuranceIdentity",
      "testSuites",
      "typeScript",
      "eslintExitCode",
      "eslintErrorCount",
      "eslintWarningCount",
      "dependencyBoundaryOk",
      "gateEvidence",
    ]),
    1,
  ),
  contract(
    "DecisionRegisterCertificationGateResult",
    "Decision Register Certification Gate Result",
    "Ordered gate evaluation: Pass, Fail, or NotEvaluated with evidence descriptors.",
    Object.freeze([
      "gateId",
      "gateName",
      "criticality",
      "result",
      "evidenceId",
      "evidenceKind",
      "evidenceSource",
      "commandOrInspection",
      "scope",
      "diagnosticsCount",
      "rtc3DiagnosticsCount",
      "notes",
      "reasonCode",
    ]),
    2,
  ),
  contract(
    "DecisionRegisterCertificationResult",
    "Decision Register Certification Result",
    "NotReady or ReadyForAuthorization. Never authorizes consumption, integration, or deployment.",
    Object.freeze([
      "kind",
      "reasonCode",
      "gateResults",
      "manifest",
      "authorizesConsumption",
      "authorizesIntegration",
      "authorizesDeployment",
    ]),
    3,
  ),
  contract(
    "DecisionRegisterCertificationManifest",
    "Decision Register Certification Manifest",
    "Immutable deterministic readiness manifest with truthful full-project TypeScript classification.",
    Object.freeze([
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
    ]),
    4,
  ),
  contract(
    "DecisionRegisterCertificationSummary",
    "Decision Register Certification Summary",
    "Deterministic phase summary. ReadyForConsumer is phase readiness only.",
    Object.freeze([
      "certificationId",
      "version",
      "namespace",
      "status",
      "readiness",
      "gateCount",
      "openIssueCount",
      "decisionCount",
      "sourceAssurance",
      "previousPhase",
      "nextPhaseDecisionRequired",
      "humanAuthorizationRequired",
      "authorizationRecorded",
      "consumptionAuthorized",
      "deploymentAuthorized",
    ]),
    5,
  ),
] as const);

export const ExecutiveDecisionRegisterCertificationContractNames = Object.freeze(
  ExecutiveDecisionRegisterCertificationContracts.map(
    (item) => item.contractName,
  ),
);
