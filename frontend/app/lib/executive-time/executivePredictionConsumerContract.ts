/**
 * APP-1:7.5 — Executive Prediction Consumer Contract.
 * Read-only prediction consumption — consumers never mutate results.
 */

import type { ExecutivePredictionResult } from "./executivePredictionAuthorityTypes.ts";
import { EXECUTIVE_PREDICTION_CONSUMER_OWNER } from "./executivePredictionAuthorityTypes.ts";

export type ExecutivePredictionConsumerContract = Readonly<{
  consumerOwner: typeof EXECUTIVE_PREDICTION_CONSUMER_OWNER;
  receivePredictionResult: (result: ExecutivePredictionResult) => Readonly<{ received: true; mutated: false }>;
  mayMutateResult: false;
  mayGeneratePrediction: false;
  mayReplayPrediction: false;
}>;

export type ExecutivePredictionConsumerValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
}>;

export const EXECUTIVE_PREDICTION_CONSUMER_RULES = Object.freeze({
  readOnly: true,
  mayMutateResult: false,
  mayGeneratePrediction: false,
  mayReplayPrediction: false,
});

export function validateExecutivePredictionConsumerInput(
  result: ExecutivePredictionResult | null | undefined
): ExecutivePredictionConsumerValidationResult {
  if (!result) {
    return Object.freeze({ valid: false, messages: Object.freeze(["PredictionResult is required."]) });
  }
  const messages: string[] = [];
  if (!result.predictionId.trim()) messages.push("predictionId is required.");
  if (!result.explanation.trim()) messages.push("explanation is required.");
  return Object.freeze({
    valid: messages.length === 0,
    messages: Object.freeze(messages),
  });
}

export function receivePredictionResult(
  result: ExecutivePredictionResult
): Readonly<{ received: true; mutated: false }> {
  const validation = validateExecutivePredictionConsumerInput(result);
  if (!validation.valid) {
    throw new Error(validation.messages[0] ?? "Invalid prediction result for consumption.");
  }
  return Object.freeze({ received: true, mutated: false });
}

export const ExecutivePredictionConsumerContractDeclaration: ExecutivePredictionConsumerContract = Object.freeze({
  consumerOwner: EXECUTIVE_PREDICTION_CONSUMER_OWNER,
  receivePredictionResult,
  mayMutateResult: false,
  mayGeneratePrediction: false,
  mayReplayPrediction: false,
});
