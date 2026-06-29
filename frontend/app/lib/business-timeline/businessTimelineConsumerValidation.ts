/**
 * APP-7:6 — Business Timeline consumer access validation.
 */

import {
  BUSINESS_TIMELINE_API_ERROR_CODES,
  BUSINESS_TIMELINE_CONSUMER_KEYS,
  apiError,
  type BusinessTimelineConsumerAccessRequest,
  type BusinessTimelineConsumerContract,
  type BusinessTimelineConsumerId,
  type BusinessValidationResult,
} from "./businessTimelineApiTypes.ts";
import {
  BUSINESS_TIMELINE_CONSUMER_CONTRACTS,
  getBusinessTimelineConsumerContract,
} from "./businessTimelineConsumerContracts.ts";

export function isBusinessTimelineConsumerId(value: string): value is BusinessTimelineConsumerId {
  return (BUSINESS_TIMELINE_CONSUMER_KEYS as readonly string[]).includes(value);
}

export function validateBusinessTimelineConsumerAccess(
  request: BusinessTimelineConsumerAccessRequest
): BusinessValidationResult {
  const issues: BusinessValidationResult["issues"] = [];

  if (!isBusinessTimelineConsumerId(request.consumerId)) {
    issues.push(
      apiError(BUSINESS_TIMELINE_API_ERROR_CODES.invalidConsumer, "Invalid consumer id.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  const contract = getBusinessTimelineConsumerContract(request.consumerId);
  if (!contract) {
    issues.push(
      apiError(BUSINESS_TIMELINE_API_ERROR_CODES.invalidConsumer, "Consumer contract not found.", "consumerId")
    );
    return Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const });
  }

  if ((contract.forbiddenApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        BUSINESS_TIMELINE_API_ERROR_CODES.consumerForbidden,
        `Consumer ${request.consumerId} cannot access API group ${request.apiGroup}.`,
        "apiGroup"
      )
    );
  }

  if (!(contract.allowedApiGroups as readonly string[]).includes(request.apiGroup)) {
    issues.push(
      apiError(
        BUSINESS_TIMELINE_API_ERROR_CODES.consumerForbidden,
        `API group ${request.apiGroup} is not allowed for ${request.consumerId}.`,
        "apiGroup"
      )
    );
  }

  if (request.mutation && !contract.mutationAllowed) {
    issues.push(
      apiError(
        BUSINESS_TIMELINE_API_ERROR_CODES.mutationForbidden,
        `Mutation operation ${request.operation} is forbidden for ${request.consumerId}.`,
        "operation"
      )
    );
  }

  if (request.mutation && contract.readOnly) {
    issues.push(
      apiError(
        BUSINESS_TIMELINE_API_ERROR_CODES.mutationForbidden,
        `Consumer ${request.consumerId} is read-only.`,
        "consumerId"
      )
    );
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function assertConsumerCanAccess(
  consumerId: BusinessTimelineConsumerId,
  apiGroup: BusinessTimelineConsumerAccessRequest["apiGroup"],
  operation: string,
  mutation: boolean
): BusinessValidationResult {
  return validateBusinessTimelineConsumerAccess(
    Object.freeze({ consumerId, apiGroup, operation, mutation })
  );
}

export function getAllConsumerContracts(): readonly BusinessTimelineConsumerContract[] {
  return Object.freeze(Object.values(BUSINESS_TIMELINE_CONSUMER_CONTRACTS));
}

export const BusinessTimelineConsumerValidation = Object.freeze({
  isBusinessTimelineConsumerId,
  validateBusinessTimelineConsumerAccess,
  assertConsumerCanAccess,
  getAllConsumerContracts,
});
