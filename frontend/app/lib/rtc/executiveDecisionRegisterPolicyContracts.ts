/**
 * RTC-3:5 — Executive Decision Register Policy Contracts.
 *
 * Policy input, decision, obligation, and evidence contracts.
 *
 * Ownership: owned exclusively by RTC-3:5.
 */

export type ExecutiveDecisionRegisterPolicyContractName =
  | "DecisionRegisterPolicyRequest"
  | "DecisionRegisterPolicyDecision"
  | "DecisionRegisterPolicyObligation"
  | "DecisionRegisterPolicyEvidence";

export interface ExecutiveDecisionRegisterPolicyContractDeclaration {
  readonly contractId:
    `RTC-3:5/Contract/${ExecutiveDecisionRegisterPolicyContractName}`;
  readonly contractName: ExecutiveDecisionRegisterPolicyContractName;
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
  contractName: ExecutiveDecisionRegisterPolicyContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterPolicyContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:5/Contract/${contractName}` as const,
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

export const ExecutiveDecisionRegisterPolicyContracts = Object.freeze([
  contract(
    "DecisionRegisterPolicyRequest",
    "Decision Register Policy Request",
    "Deterministic metadata-only policy request. MUST NOT carry unrestricted decision claims, rationale, evidence content, or private content.",
    Object.freeze([
      "requestId",
      "operation",
      "actorId",
      "actorKind",
      "authorityRef",
      "delegation",
      "purpose",
      "targetRegister",
      "targetEntityKind",
      "targetEntityId",
      "currentLifecycleState",
      "proposedLifecycleState",
      "authorityState",
      "originState",
      "privacyCategory",
      "classification",
      "proposedEffect",
      "evidenceRefs",
      "validation",
      "requestedScope",
      "confirmationContext",
      "jurisdictionContext",
      "breakGlass",
    ]),
    1,
  ),
  contract(
    "DecisionRegisterPolicyDecision",
    "Decision Register Policy Decision",
    "Allow, Deny, or RequireConfirmation with matching rules, obligations, and no protected metadata leakage on deny.",
    Object.freeze([
      "decision",
      "decisionCode",
      "matchingRuleIds",
      "requestId",
      "actorRef",
      "authorityRef",
      "purpose",
      "operation",
      "targetId",
      "reason",
      "obligations",
      "validationOutcome",
      "validationReference",
      "confirmation",
      "revealsProtectedMetadata",
    ]),
    2,
  ),
  contract(
    "DecisionRegisterPolicyObligation",
    "Decision Register Policy Obligation",
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
    "DecisionRegisterPolicyEvidence",
    "Decision Register Policy Evidence",
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

export const ExecutiveDecisionRegisterPolicyContractNames = Object.freeze([
  "DecisionRegisterPolicyRequest",
  "DecisionRegisterPolicyDecision",
  "DecisionRegisterPolicyObligation",
  "DecisionRegisterPolicyEvidence",
] as const satisfies readonly ExecutiveDecisionRegisterPolicyContractName[]);

/** Rule family catalogue. */
export const ExecutiveDecisionRegisterPolicyRuleFamilies = Object.freeze([
  "ValidationGate",
  "Authority",
  "HumanConfirmation",
  "AiBoundary",
  "Lifecycle",
  "AppendOnly",
  "Privacy",
  "Evidence",
  "Dispute",
  "Supersession",
  "OutcomeClosure",
  "Projection",
  "Disclosure",
  "Export",
  "RetentionDisposition",
  "BreakGlass",
  "AllowGate",
] as const);
