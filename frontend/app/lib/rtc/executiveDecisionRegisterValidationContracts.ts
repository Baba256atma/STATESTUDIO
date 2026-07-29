/**
 * RTC-3:4 — Executive Decision Register Validation Contracts.
 *
 * Input, validator, issue, result, and summary contract declarations.
 * Declarations only. No UI.
 *
 * Ownership: owned exclusively by RTC-3:4.
 */

export type ExecutiveDecisionRegisterValidationContractName =
  | "DecisionRegisterValidationInput"
  | "DecisionRegisterValidationRule"
  | "DecisionRegisterValidationIssue"
  | "DecisionRegisterValidationResult"
  | "DecisionRegisterValidationSummary";

export type ExecutiveDecisionRegisterValidationRuleFamilyName =
  | "Identity"
  | "Structure"
  | "Lifecycle"
  | "AppendOnly"
  | "Provenance"
  | "Authority"
  | "Confirmation"
  | "Privacy"
  | "AiBoundary"
  | "Projection"
  | "Evidence"
  | "Disposition"
  | "Telemetry";

export interface ExecutiveDecisionRegisterValidationContractDeclaration {
  readonly contractId:
    `RTC-3:4/Contract/${ExecutiveDecisionRegisterValidationContractName}`;
  readonly contractName: ExecutiveDecisionRegisterValidationContractName;
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
  contractName: ExecutiveDecisionRegisterValidationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterValidationContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:4/Contract/${contractName}` as const,
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

export const ExecutiveDecisionRegisterValidationContracts:
  readonly ExecutiveDecisionRegisterValidationContractDeclaration[] =
    Object.freeze([
      contract(
        "DecisionRegisterValidationInput",
        "Decision Register Validation Input",
        "Immutable candidate metadata: entity descriptors, entity instances, relationship sets, and telemetry descriptors. Validation never mutates, normalizes, repairs, or enriches input.",
        Object.freeze([
          "entityKind",
          "entityId",
          "fields",
          "relationshipKind",
          "fromRef",
          "toRef",
          "descriptorId",
          "readonly_compatible",
        ]),
        1,
      ),
      contract(
        "DecisionRegisterValidationRule",
        "Decision Register Validation Rule",
        "Stable rule ID, closed family, priority, subject applicability, deterministic evaluator metadata, and upstream contract reference.",
        Object.freeze([
          "ruleId",
          "ruleKey",
          "family",
          "severity",
          "executionOrder",
          "upstreamContract",
          "evaluatesOnly",
          "mutatesState",
        ]),
        2,
      ),
      contract(
        "DecisionRegisterValidationIssue",
        "Decision Register Validation Issue",
        "Immutable issue with rule ID, closed code, severity, subject, field/relationship, expected/observed safe metadata, upstream contract, message, and ordering key. No payloads, secrets, timestamps, or stack traces.",
        Object.freeze([
          "ruleId",
          "issueCode",
          "severity",
          "subjectKind",
          "subjectId",
          "field",
          "expected",
          "observed",
          "upstreamContract",
          "message",
          "orderKey",
        ]),
        3,
      ),
      contract(
        "DecisionRegisterValidationResult",
        "Decision Register Validation Result",
        "Discriminated Valid/Invalid result. Any Error or Critical makes Invalid. Warnings never override errors or repair input.",
        Object.freeze([
          "outcome",
          "valid",
          "issues",
          "errorCount",
          "warningCount",
          "deterministic",
          "immutable",
        ]),
        4,
      ),
      contract(
        "DecisionRegisterValidationSummary",
        "Decision Register Validation Summary",
        "Deterministic inventory of validation identity, rule counts, family counts, open issues, and readiness.",
        Object.freeze([
          "validationId",
          "namespace",
          "ruleCount",
          "familyCount",
          "openIssueCount",
          "sourceModel",
          "readiness",
        ]),
        5,
      ),
    ]);

export const ExecutiveDecisionRegisterValidationContractNames = Object.freeze([
  "DecisionRegisterValidationInput",
  "DecisionRegisterValidationRule",
  "DecisionRegisterValidationIssue",
  "DecisionRegisterValidationResult",
  "DecisionRegisterValidationSummary",
] as const satisfies readonly ExecutiveDecisionRegisterValidationContractName[]);

export const ExecutiveDecisionRegisterValidationRuleFamilies = Object.freeze([
  "Identity",
  "Structure",
  "Lifecycle",
  "AppendOnly",
  "Provenance",
  "Authority",
  "Confirmation",
  "Privacy",
  "AiBoundary",
  "Projection",
  "Evidence",
  "Disposition",
  "Telemetry",
] as const satisfies readonly ExecutiveDecisionRegisterValidationRuleFamilyName[]);
