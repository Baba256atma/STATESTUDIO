/**
 * APP-1:7.5 — Executive Prediction Request / Publisher Contract.
 * Publishers submit requests only — never generate, store, or replay predictions.
 */

import type {
  ExecutivePredictionRequest,
  ExecutivePredictionRequestResult,
} from "./executivePredictionAuthorityTypes.ts";
import { EXECUTIVE_PREDICTION_PUBLISHER_OWNER } from "./executivePredictionAuthorityTypes.ts";

export type ExecutivePredictionPublisherContract = Readonly<{
  publisherOwner: typeof EXECUTIVE_PREDICTION_PUBLISHER_OWNER;
  requestPrediction: (request: ExecutivePredictionRequest) => ExecutivePredictionRequestResult;
  mayGeneratePrediction: false;
  mayModifyPrediction: false;
  mayStorePrediction: false;
  mayReplayPrediction: false;
}>;

export type ExecutivePredictionPublisherValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
}>;

export const EXECUTIVE_PREDICTION_PUBLISHER_RULES = Object.freeze({
  mayCreateRequest: true,
  mayGeneratePrediction: false,
  mayModifyPrediction: false,
  mayStorePrediction: false,
  mayReplayPrediction: false,
});

export function validateExecutivePredictionPublisherRequest(
  request: ExecutivePredictionRequest
): ExecutivePredictionPublisherValidationResult {
  const messages: string[] = [];
  if (!request.id.trim()) messages.push("id is required.");
  if (!request.workspaceId.trim()) messages.push("workspaceId is required.");
  if (!request.entityId.trim()) messages.push("entityId is required.");
  if (!request.requestedBy.trim()) messages.push("requestedBy is required.");
  if (!request.predictionContext.trim()) messages.push("predictionContext is required.");
  if (!request.currentTimeContext) messages.push("currentTimeContext is required.");
  if (!request.currentCameraContext) messages.push("currentCameraContext is required.");
  return Object.freeze({
    valid: messages.length === 0,
    messages: Object.freeze(messages),
  });
}

export const ExecutivePredictionPublisherContractDeclaration: ExecutivePredictionPublisherContract = Object.freeze({
  publisherOwner: EXECUTIVE_PREDICTION_PUBLISHER_OWNER,
  requestPrediction: () => {
    throw new Error("Publisher contract only — use Executive Prediction Authority request path.");
  },
  mayGeneratePrediction: false,
  mayModifyPrediction: false,
  mayStorePrediction: false,
  mayReplayPrediction: false,
});
