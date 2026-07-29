/**
 * RTC-3:6 — Executive Decision Register Enforcement Contracts.
 *
 * Ownership: owned exclusively by RTC-3:6.
 */

export type ExecutiveDecisionRegisterEnforcementContractName =
  | "DecisionRegisterEnforcementRequest"
  | "DecisionRegisterEnforcementPlan"
  | "DecisionRegisterEnforcementStep"
  | "DecisionRegisterEnforcementConfirmation"
  | "DecisionRegisterEnforcementEvidence";

export interface ExecutiveDecisionRegisterEnforcementContractDeclaration {
  readonly contractId:
    `RTC-3:6/Contract/${ExecutiveDecisionRegisterEnforcementContractName}`;
  readonly contractName: ExecutiveDecisionRegisterEnforcementContractName;
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
  contractName: ExecutiveDecisionRegisterEnforcementContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveDecisionRegisterEnforcementContractDeclaration =>
  Object.freeze({
    contractId: `RTC-3:6/Contract/${contractName}` as const,
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

export const ExecutiveDecisionRegisterEnforcementContracts = Object.freeze([
  contract(
    "DecisionRegisterEnforcementRequest",
    "Decision Register Enforcement Request",
    "Planning input bound to an exact RTC-3:5 policy decision. No inferred application state or payload content.",
    Object.freeze([
      "requestId",
      "policyDecision",
      "operation",
      "actorId",
      "actorKind",
      "authorityRef",
      "purpose",
      "targetRegister",
      "targetEntityId",
      "currentLifecycleState",
      "proposedLifecycleState",
      "privacyCategory",
      "classification",
      "proposedEffect",
      "obligations",
      "validationReference",
      "evidenceRefs",
      "confirmationEvidence",
      "breakGlass",
    ]),
    1,
  ),
  contract(
    "DecisionRegisterEnforcementPlan",
    "Decision Register Enforcement Plan",
    "Immutable ordered plan of non-executing descriptors. Effect-bearing only when Enforceable.",
    Object.freeze([
      "planId",
      "policyDecisionCode",
      "validationReference",
      "steps",
      "obligationToStepMap",
      "requiredEvidence",
      "expectedAppendOnlyEffect",
      "failureBehavior",
      "summary",
    ]),
    2,
  ),
  contract(
    "DecisionRegisterEnforcementStep",
    "Decision Register Enforcement Step",
    "Planning descriptor only. MUST NOT write, disclose, export, retain, dispose, or call services.",
    Object.freeze([
      "stepId",
      "kind",
      "order",
      "effectBearing",
      "obligationsSatisfied",
      "executes",
    ]),
    3,
  ),
  contract(
    "DecisionRegisterEnforcementConfirmation",
    "Decision Register Enforcement Confirmation",
    "Confirmation evidence must bind human actor, request, decision, target, operation, effect, authority, evidence set, policy version, expiry, and single-use identity.",
    Object.freeze([
      "confirmationId",
      "actorId",
      "actorKind",
      "requestId",
      "policyDecisionCode",
      "policyDecisionId",
      "policyVersion",
      "targetId",
      "operation",
      "proposedEffect",
      "authorityRef",
      "evidenceSet",
      "obligationKinds",
      "expired",
      "singleUse",
      "expiryMetadata",
    ]),
    4,
  ),
  contract(
    "DecisionRegisterEnforcementEvidence",
    "Decision Register Enforcement Evidence",
    "Required evidence references for enforceable plans. No payload content.",
    Object.freeze([
      "evidenceRefs",
      "exportPolicyRef",
      "retentionPolicyRef",
      "dispositionPolicyRef",
      "validationReference",
    ]),
    5,
  ),
] as const);

export const ExecutiveDecisionRegisterEnforcementContractNames = Object.freeze([
  "DecisionRegisterEnforcementRequest",
  "DecisionRegisterEnforcementPlan",
  "DecisionRegisterEnforcementStep",
  "DecisionRegisterEnforcementConfirmation",
  "DecisionRegisterEnforcementEvidence",
] as const satisfies readonly ExecutiveDecisionRegisterEnforcementContractName[]);
