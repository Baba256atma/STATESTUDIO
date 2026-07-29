/**
 * RTC-2:9 — Executive Journal Runtime Certification Contracts.
 *
 * Ownership: owned exclusively by RTC-2:9.
 */

export type ExecutiveJournalRuntimeCertificationContractName =
  | "JournalCertificationEvidencePackage"
  | "JournalCertificationGateResult"
  | "JournalCertificationException"
  | "JournalCertificationManifest"
  | "JournalCertificationResult";

export interface ExecutiveJournalRuntimeCertificationContractDeclaration {
  readonly contractId:
    `RTC-2:9/Contract/${ExecutiveJournalRuntimeCertificationContractName}`;
  readonly contractName: ExecutiveJournalRuntimeCertificationContractName;
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
  contractName: ExecutiveJournalRuntimeCertificationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeCertificationContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:9/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimeCertificationContracts = Object.freeze([
  contract(
    "JournalCertificationEvidencePackage",
    "Journal Certification Evidence Package",
    "Immutable caller-supplied certification evidence. No journal payloads. No live CI/CD or filesystem access.",
    Object.freeze([
      "packageId",
      "assuranceResultKind",
      "phaseIdentities",
      "testSuites",
      "typescriptPassed",
      "eslintZeroWarnings",
      "exceptions",
      "openIssues",
      "evaluationTime",
      "evidencePackageDigest",
    ]),
    1,
  ),
  contract(
    "JournalCertificationGateResult",
    "Journal Certification Gate Result",
    "Ordered gate evaluation: Pass, Fail, Exception, or NotEvaluated.",
    Object.freeze([
      "gateId",
      "result",
      "waivable",
      "reasonCode",
      "exceptionId",
      "order",
    ]),
    2,
  ),
  contract(
    "JournalCertificationException",
    "Journal Certification Exception",
    "Bounded approved exception for waivable gates only. Never overrides non-waivable gates.",
    Object.freeze([
      "exceptionId",
      "affectedGateId",
      "accountableOwner",
      "approvingAuthorityRef",
      "compensatingControl",
      "expiry",
      "evidenceRef",
    ]),
    3,
  ),
  contract(
    "JournalCertificationManifest",
    "Journal Certification Readiness Manifest",
    "Immutable readiness manifest. Explicitly not deployment, legal, privacy, or AI approval.",
    Object.freeze([
      "result",
      "gateResults",
      "failedGateIds",
      "exceptionBoundGateIds",
      "openIssueIds",
      "requiresHumanAuthorization",
      "prohibitedAutomatedActions",
      "summary",
    ]),
    4,
  ),
  contract(
    "JournalCertificationResult",
    "Journal Certification Result",
    "NotReady, ConditionallyReady, or ReadyForAuthorization. Never authorizes deployment.",
    Object.freeze([
      "kind",
      "reasonCode",
      "gateResults",
      "manifest",
      "authorizesDeployment",
    ]),
    5,
  ),
] as const);

export const ExecutiveJournalRuntimeCertificationContractNames = Object.freeze([
  "JournalCertificationEvidencePackage",
  "JournalCertificationGateResult",
  "JournalCertificationException",
  "JournalCertificationManifest",
  "JournalCertificationResult",
] as const satisfies readonly ExecutiveJournalRuntimeCertificationContractName[]);
