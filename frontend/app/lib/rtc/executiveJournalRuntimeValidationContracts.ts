/**
 * RTC-2:4 — Executive Journal Runtime Validation Contracts.
 *
 * Validator and validation-result contracts.
 * Declarations only for contract shape; evaluation lives in rules.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

export type ExecutiveJournalRuntimeValidationContractName =
  | "JournalValidationResult"
  | "JournalValidationIssue"
  | "JournalValidationRule"
  | "JournalValidationSummary";

export interface ExecutiveJournalRuntimeValidationContractDeclaration {
  readonly contractId:
    `RTC-2:4/Contract/${ExecutiveJournalRuntimeValidationContractName}`;
  readonly contractName: ExecutiveJournalRuntimeValidationContractName;
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
  contractName: ExecutiveJournalRuntimeValidationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeValidationContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:4/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimeValidationContracts = Object.freeze([
  contract(
    "JournalValidationResult",
    "Journal Validation Result",
    "Discriminated Valid/Invalid outcome. Invalid requires one or more immutable issues. Warnings never convert Invalid to Valid.",
    Object.freeze([
      "outcome",
      "valid",
      "issues",
      "errorCount",
      "warningCount",
    ]),
    1,
  ),
  contract(
    "JournalValidationIssue",
    "Journal Validation Issue",
    "Stable issue shape without timestamps, randomness, stack traces, payloads, or secrets.",
    Object.freeze([
      "ruleId",
      "issueCode",
      "severity",
      "subjectKind",
      "subjectId",
      "message",
      "field",
      "upstreamContract",
      "orderKey",
    ]),
    2,
  ),
  contract(
    "JournalValidationRule",
    "Journal Validation Rule",
    "Pure deterministic rule with family, severity, and fixed execution order.",
    Object.freeze([
      "ruleId",
      "ruleKey",
      "family",
      "severity",
      "executionOrder",
      "upstreamContract",
    ]),
    3,
  ),
  contract(
    "JournalValidationSummary",
    "Journal Validation Summary",
    "Deterministic inventory of validation identity, rule counts, and readiness.",
    Object.freeze([
      "validationId",
      "namespace",
      "ruleCount",
      "familyCount",
      "openIssueCount",
      "readiness",
    ]),
    4,
  ),
] as const);

export const ExecutiveJournalRuntimeValidationContractNames = Object.freeze([
  "JournalValidationResult",
  "JournalValidationIssue",
  "JournalValidationRule",
  "JournalValidationSummary",
] as const satisfies readonly ExecutiveJournalRuntimeValidationContractName[]);

/** Rule family catalogue in deterministic execution order. */
export const ExecutiveJournalRuntimeValidationRuleFamilies = Object.freeze([
  "Identity",
  "Structure",
  "AppendOnly",
  "Provenance",
  "Authority",
  "Privacy",
  "AiBoundary",
  "Disclosure",
  "Projection",
  "Evidence",
  "Telemetry",
] as const);
