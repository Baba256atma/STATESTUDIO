/**
 * RTC-2:5 — Executive Journal Runtime Policy Contracts.
 *
 * Policy input, decision, obligation, and evidence contracts.
 *
 * Ownership: owned exclusively by RTC-2:5.
 */

export type ExecutiveJournalRuntimePolicyContractName =
  | "JournalPolicyRequest"
  | "JournalPolicyDecision"
  | "JournalPolicyObligation"
  | "JournalPolicyEvidence";

export interface ExecutiveJournalRuntimePolicyContractDeclaration {
  readonly contractId:
    `RTC-2:5/Contract/${ExecutiveJournalRuntimePolicyContractName}`;
  readonly contractName: ExecutiveJournalRuntimePolicyContractName;
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
  contractName: ExecutiveJournalRuntimePolicyContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimePolicyContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:5/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimePolicyContracts = Object.freeze([
  contract(
    "JournalPolicyRequest",
    "Journal Policy Request",
    "Deterministic metadata-only policy request. MUST NOT carry free-form journal payload content for authority decisions.",
    Object.freeze([
      "requestId",
      "operation",
      "actorId",
      "actorKind",
      "authorityRef",
      "delegation",
      "purpose",
      "targetJournalId",
      "targetEntityKind",
      "recordCategory",
      "classification",
      "proposedEffect",
      "evidenceRefs",
      "validation",
      "jurisdictionContext",
      "breakGlass",
    ]),
    1,
  ),
  contract(
    "JournalPolicyDecision",
    "Journal Policy Decision",
    "Allow, Deny, or RequireConfirmation with matching rules, obligations, and no protected metadata leakage on deny.",
    Object.freeze([
      "decision",
      "decisionCode",
      "matchingRuleIds",
      "reason",
      "obligations",
      "validationOutcome",
      "confirmation",
      "revealsProtectedMetadata",
    ]),
    2,
  ),
  contract(
    "JournalPolicyObligation",
    "Journal Policy Obligation",
    "Immutable, deduplicated, deterministically ordered obligations attached to a decision.",
    Object.freeze([
      "obligationId",
      "kind",
      "description",
      "order",
    ]),
    3,
  ),
  contract(
    "JournalPolicyEvidence",
    "Journal Policy Evidence",
    "Upstream validation evidence and authority/evidence references required by the decision.",
    Object.freeze([
      "validation",
      "authorityRef",
      "evidenceRefs",
      "exportPolicyRef",
      "retentionPolicyRef",
      "dispositionPolicyRef",
    ]),
    4,
  ),
] as const);

export const ExecutiveJournalRuntimePolicyContractNames = Object.freeze([
  "JournalPolicyRequest",
  "JournalPolicyDecision",
  "JournalPolicyObligation",
  "JournalPolicyEvidence",
] as const satisfies readonly ExecutiveJournalRuntimePolicyContractName[]);

/** Rule family catalogue. */
export const ExecutiveJournalRuntimePolicyRuleFamilies = Object.freeze([
  "ValidationGate",
  "Authority",
  "HumanConfirmation",
  "AiBoundary",
  "PrivateReflection",
  "Disclosure",
  "Export",
  "RetentionDisposition",
  "Evidence",
  "Jurisdiction",
  "BreakGlass",
  "AllowGate",
] as const);
