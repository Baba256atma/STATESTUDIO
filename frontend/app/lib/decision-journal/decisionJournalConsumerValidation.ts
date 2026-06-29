/**
 * APP-8:7 — Decision Journal consumer access validation.
 */

import {
  DECISION_JOURNAL_API_ERROR_CODES,
  DECISION_JOURNAL_CONSUMER_KEYS,
  apiError,
  type DecisionJournalConsumerAccessRequest,
  type DecisionJournalConsumerContract,
  type DecisionJournalConsumerId,
  type DecisionJournalValidationResult,
} from "./decisionJournalApiTypes.ts";
import {
  DECISION_JOURNAL_CONSUMER_CONTRACTS,
  getDecisionJournalConsumerContract,
} from "./decisionJournalConsumerContracts.ts";

export function isDecisionJournalConsumerId(value: string): value is DecisionJournalConsumerId {
  return (DECISION_JOURNAL_CONSUMER_KEYS as readonly string[]).includes(value);
}

export function validateDecisionJournalConsumerAccess(
  request: DecisionJournalConsumerAccessRequest
): DecisionJournalValidationResult {
  const issues: DecisionJournalValidationResult["issues"] = [];

  if (!isDecisionJournalConsumerId(request.consumerId)) {
    issues.push(
      apiError(DECISION_JOURNAL_API_ERROR_CODES.invalidConsumer, "Invalid consumer id.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  const contract = getDecisionJournalConsumerContract(request.consumerId);
  if (!contract) {
    issues.push(
      apiError(DECISION_JOURNAL_API_ERROR_CODES.invalidConsumer, "Consumer contract not found.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  if ((contract.forbiddenApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        DECISION_JOURNAL_API_ERROR_CODES.consumerForbidden,
        `Consumer ${request.consumerId} cannot access API group ${request.apiGroup}.`,
        "apiGroup"
      )
    );
  }

  if (!(contract.allowedApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        DECISION_JOURNAL_API_ERROR_CODES.consumerForbidden,
        `API group ${request.apiGroup} is not allowed for ${request.consumerId}.`,
        "apiGroup"
      )
    );
  }

  if (request.mutation && !contract.mutationAllowed) {
    issues.push(
      apiError(
        DECISION_JOURNAL_API_ERROR_CODES.mutationForbidden,
        `Mutation operation ${request.operation} is forbidden for ${request.consumerId}.`,
        "operation"
      )
    );
  }

  if (request.mutation && contract.readOnly) {
    issues.push(
      apiError(
        DECISION_JOURNAL_API_ERROR_CODES.mutationForbidden,
        `Consumer ${request.consumerId} is read-only.`,
        "consumerId"
      )
    );
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function assertConsumerCanAccess(
  consumerId: DecisionJournalConsumerId,
  apiGroup: DecisionJournalConsumerAccessRequest["apiGroup"],
  operation: string,
  mutation: boolean
): DecisionJournalValidationResult {
  return validateDecisionJournalConsumerAccess(
    Object.freeze({ consumerId, apiGroup, operation, mutation })
  );
}

export function getAllConsumerContracts(): readonly DecisionJournalConsumerContract[] {
  return Object.freeze(Object.values(DECISION_JOURNAL_CONSUMER_CONTRACTS));
}

export const DecisionJournalConsumerValidation = Object.freeze({
  isDecisionJournalConsumerId,
  validateDecisionJournalConsumerAccess,
  assertConsumerCanAccess,
  getAllConsumerContracts,
});
