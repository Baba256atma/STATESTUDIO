/**
 * APP-9:7 — Confidence Evolution consumer access validation.
 */

import {
  CONFIDENCE_EVOLUTION_API_ERROR_CODES,
  CONFIDENCE_EVOLUTION_CONSUMER_KEYS,
  apiError,
  type ConfidenceEvolutionConsumerAccessRequest,
  type ConfidenceEvolutionConsumerContract,
  type ConfidenceEvolutionConsumerId,
  type ConfidenceEvolutionValidationResult,
} from "./confidenceEvolutionApiTypes.ts";
import {
  CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS,
  getConfidenceEvolutionConsumerContract,
} from "./confidenceEvolutionConsumerContracts.ts";

export function isConfidenceEvolutionConsumerId(value: string): value is ConfidenceEvolutionConsumerId {
  return (CONFIDENCE_EVOLUTION_CONSUMER_KEYS as readonly string[]).includes(value);
}

export function validateConfidenceEvolutionConsumerAccess(
  request: ConfidenceEvolutionConsumerAccessRequest
): ConfidenceEvolutionValidationResult {
  const issues: ConfidenceEvolutionValidationResult["issues"] = [];

  if (!isConfidenceEvolutionConsumerId(request.consumerId)) {
    issues.push(
      apiError(CONFIDENCE_EVOLUTION_API_ERROR_CODES.invalidConsumer, "Invalid consumer id.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  const contract = getConfidenceEvolutionConsumerContract(request.consumerId);
  if (!contract) {
    issues.push(
      apiError(CONFIDENCE_EVOLUTION_API_ERROR_CODES.invalidConsumer, "Consumer contract not found.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  if ((contract.forbiddenApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        CONFIDENCE_EVOLUTION_API_ERROR_CODES.consumerForbidden,
        `Consumer ${request.consumerId} cannot access API group ${request.apiGroup}.`,
        "apiGroup"
      )
    );
  }

  if (!(contract.allowedApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        CONFIDENCE_EVOLUTION_API_ERROR_CODES.consumerForbidden,
        `API group ${request.apiGroup} is not allowed for ${request.consumerId}.`,
        "apiGroup"
      )
    );
  }

  if (request.mutation && !contract.mutationAllowed) {
    issues.push(
      apiError(
        CONFIDENCE_EVOLUTION_API_ERROR_CODES.mutationForbidden,
        `Mutation operation ${request.operation} is forbidden for ${request.consumerId}.`,
        "operation"
      )
    );
  }

  if (request.mutation && contract.readOnly) {
    issues.push(
      apiError(
        CONFIDENCE_EVOLUTION_API_ERROR_CODES.mutationForbidden,
        `Consumer ${request.consumerId} is read-only.`,
        "consumerId"
      )
    );
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function assertConsumerCanAccess(
  consumerId: ConfidenceEvolutionConsumerId,
  apiGroup: ConfidenceEvolutionConsumerAccessRequest["apiGroup"],
  operation: string,
  mutation: boolean
): ConfidenceEvolutionValidationResult {
  return validateConfidenceEvolutionConsumerAccess(
    Object.freeze({ consumerId, apiGroup, operation, mutation })
  );
}

export function getAllConsumerContracts(): readonly ConfidenceEvolutionConsumerContract[] {
  return Object.freeze(Object.values(CONFIDENCE_EVOLUTION_CONSUMER_CONTRACTS));
}

export const ConfidenceEvolutionConsumerValidation = Object.freeze({
  isConfidenceEvolutionConsumerId,
  validateConfidenceEvolutionConsumerAccess,
  assertConsumerCanAccess,
  getAllConsumerContracts,
});
