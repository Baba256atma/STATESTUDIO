/**
 * RTC-2:6 — Executive Journal Runtime Policy Enforcement Contracts.
 *
 * Ownership: owned exclusively by RTC-2:6.
 */

export type ExecutiveJournalRuntimeEnforcementContractName =
  | "JournalEnforcementRequest"
  | "JournalEnforcementPlan"
  | "JournalEnforcementStep"
  | "JournalEnforcementConfirmation"
  | "JournalEnforcementEvidence";

export interface ExecutiveJournalRuntimeEnforcementContractDeclaration {
  readonly contractId:
    `RTC-2:6/Contract/${ExecutiveJournalRuntimeEnforcementContractName}`;
  readonly contractName: ExecutiveJournalRuntimeEnforcementContractName;
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
  contractName: ExecutiveJournalRuntimeEnforcementContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveJournalRuntimeEnforcementContractDeclaration =>
  Object.freeze({
    contractId: `RTC-2:6/Contract/${contractName}` as const,
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

export const ExecutiveJournalRuntimeEnforcementContracts = Object.freeze([
  contract(
    "JournalEnforcementRequest",
    "Journal Enforcement Request",
    "Planning input bound to an exact RTC-2:5 policy decision. No inferred application state.",
    Object.freeze([
      "requestId",
      "policyDecision",
      "operation",
      "actorId",
      "authorityRef",
      "purpose",
      "targetJournalId",
      "lifecycleState",
      "recordCategory",
      "confirmationEvidence",
      "validationOutcome",
    ]),
    1,
  ),
  contract(
    "JournalEnforcementPlan",
    "Journal Enforcement Plan",
    "Immutable ordered plan of non-executing descriptors. Effect-bearing only when Enforceable.",
    Object.freeze([
      "planId",
      "policyDecisionCode",
      "steps",
      "requiredEvidence",
      "lifecyclePrecondition",
      "resultingLifecycleState",
      "failureBehavior",
    ]),
    2,
  ),
  contract(
    "JournalEnforcementStep",
    "Journal Enforcement Step",
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
    "JournalEnforcementConfirmation",
    "Journal Enforcement Confirmation",
    "Confirmation evidence must bind actor, request, decision, target, operation, effect, authority, policy version, expiry, and single-use identity.",
    Object.freeze([
      "confirmationId",
      "actorId",
      "requestId",
      "policyDecisionCode",
      "policyVersion",
      "targetId",
      "operation",
      "proposedEffect",
      "authorityRef",
      "expired",
      "singleUse",
    ]),
    4,
  ),
  contract(
    "JournalEnforcementEvidence",
    "Journal Enforcement Evidence",
    "Required evidence references for enforceable plans. No payload content.",
    Object.freeze([
      "evidenceRefs",
      "exportPolicyRef",
      "retentionPolicyRef",
      "dispositionPolicyRef",
    ]),
    5,
  ),
] as const);

export const ExecutiveJournalRuntimeEnforcementContractNames = Object.freeze([
  "JournalEnforcementRequest",
  "JournalEnforcementPlan",
  "JournalEnforcementStep",
  "JournalEnforcementConfirmation",
  "JournalEnforcementEvidence",
] as const satisfies readonly ExecutiveJournalRuntimeEnforcementContractName[]);
