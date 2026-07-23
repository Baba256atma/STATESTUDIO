/**
 * EIL-4:1 — Integration Orchestration Foundation Contracts.
 *
 * Immutable contract declarations for Integration Orchestration Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

import type {
  OrchestrationContract,
  OrchestrationContractName,
} from "./integrationOrchestrationFoundationTypes.ts";

const contract = (
  contractName: OrchestrationContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): OrchestrationContract =>
  Object.freeze({
    contractId: `EIL-4:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten public orchestration contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationOrchestrationFoundationContracts: readonly OrchestrationContract[] =
  Object.freeze([
    contract(
      "OrchestrationContract",
      "Orchestration Contract",
      "Canonical metadata contract binding an orchestration identity to flow and step references.",
      Object.freeze([
        "orchestrationId",
        "orchestrationName",
        "flowRef",
        "stepRefs",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "FlowContract",
      "Flow Contract",
      "Declarative orchestration flow metadata without workflow execution.",
      Object.freeze([
        "flowId",
        "flowName",
        "categoryRef",
        "stepRefs",
        "runtimeExecuted",
      ]),
      2,
    ),
    contract(
      "StepContract",
      "Step Contract",
      "Declarative orchestration step metadata without step execution runtime.",
      Object.freeze([
        "stepId",
        "stepName",
        "flowRef",
        "dependencyRefs",
        "runtimeExecuted",
      ]),
      3,
    ),
    contract(
      "TransitionContract",
      "Transition Contract",
      "Declarative orchestration transition metadata without transition engines.",
      Object.freeze([
        "transitionId",
        "sourceStepRef",
        "targetStepRef",
        "runtimeEvaluated",
      ]),
      4,
    ),
    contract(
      "TriggerContract",
      "Trigger Contract",
      "Declarative orchestration trigger metadata without trigger firing runtime.",
      Object.freeze([
        "triggerId",
        "flowRef",
        "triggerKindRef",
        "runtimeFired",
      ]),
      5,
    ),
    contract(
      "DependencyContract",
      "Dependency Contract",
      "Declarative orchestration dependency metadata without resolution engines.",
      Object.freeze([
        "dependencyId",
        "sourceRef",
        "targetRef",
        "dependencyDirection",
        "runtimeResolved",
      ]),
      6,
    ),
    contract(
      "CompletionContract",
      "Completion Contract",
      "Declarative orchestration completion metadata without completion handlers.",
      Object.freeze([
        "completionId",
        "flowRef",
        "completionCriteriaRef",
        "runtimeHandled",
      ]),
      7,
    ),
    contract(
      "FailureContract",
      "Failure Contract",
      "Declarative orchestration failure metadata without failure recovery engines.",
      Object.freeze([
        "failureId",
        "flowRef",
        "failureCriteriaRef",
        "runtimeHandled",
      ]),
      8,
    ),
    contract(
      "StateContract",
      "State Contract",
      "Declarative orchestration state metadata without runtime state machines.",
      Object.freeze([
        "stateId",
        "flowRef",
        "lifecycleState",
        "executesTransitions",
      ]),
      9,
    ),
    contract(
      "MetadataContract",
      "Metadata Contract",
      "Declarative orchestration metadata envelope without persistence or inventory engines.",
      Object.freeze([
        "metadataId",
        "orchestrationRef",
        "annotationRefs",
        "runtimeStored",
      ]),
      10,
    ),
  ]);

export const IntegrationOrchestrationFoundationContractNames = Object.freeze([
  "OrchestrationContract",
  "FlowContract",
  "StepContract",
  "TransitionContract",
  "TriggerContract",
  "DependencyContract",
  "CompletionContract",
  "FailureContract",
  "StateContract",
  "MetadataContract",
] as const satisfies readonly OrchestrationContractName[]);
