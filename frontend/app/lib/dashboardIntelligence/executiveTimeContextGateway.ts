/**
 * INT-1.3 — Executive Time Context gateway bridge.
 * Composes Executive Time Context with Unified Intelligence Context and gateway requests.
 */

import { buildExecutiveTimeContext } from "./executiveTimeContextBuilder.ts";
import {
  EXECUTIVE_TIME_METADATA_KEYS,
  type BuildExecutiveTimeContextInput,
  type ExecutiveTimeContext,
} from "./executiveTimeContextContract.ts";
import type { UnifiedIntelligenceContext } from "./intelligenceContextContract.ts";
import type { IntelligenceGatewayRequest } from "./singleIntelligenceSourceContract.ts";

export function executiveTimeContextToMetadata(
  timeContext: ExecutiveTimeContext
): Readonly<Record<string, string | null>> {
  return Object.freeze({
    [EXECUTIVE_TIME_METADATA_KEYS.timeState]: timeContext.timeState,
    [EXECUTIVE_TIME_METADATA_KEYS.referenceTimestamp]: timeContext.referenceTimestamp,
    [EXECUTIVE_TIME_METADATA_KEYS.requestedTime]: timeContext.requestedTime,
    [EXECUTIVE_TIME_METADATA_KEYS.timeContextId]: timeContext.timeContextId,
    [EXECUTIVE_TIME_METADATA_KEYS.timeVersion]: timeContext.version,
  });
}

export function attachExecutiveTimeContextToGatewayRequest(
  request: IntelligenceGatewayRequest,
  timeContext: ExecutiveTimeContext
): IntelligenceGatewayRequest {
  const timeMetadata = executiveTimeContextToMetadata(timeContext);
  const existingMetadata = request.context?.metadata ?? Object.freeze({});
  return Object.freeze({
    ...request,
    context: Object.freeze({
      selectionLabel: request.context?.selectionLabel ?? null,
      contextLabel: request.context?.contextLabel ?? null,
      metadata: Object.freeze({
        ...existingMetadata,
        ...timeMetadata,
      }),
    }),
  });
}

export function resolveExecutiveTimeContextForIntelligence(input: {
  executiveTime?: BuildExecutiveTimeContextInput | null;
  unifiedContext?: UnifiedIntelligenceContext | null;
}): ExecutiveTimeContext | null {
  if (input.executiveTime) {
    const build = buildExecutiveTimeContext(input.executiveTime);
    return build.success ? build.timeContext : null;
  }
  if (input.unifiedContext?.executiveTimeContext) {
    return input.unifiedContext.executiveTimeContext;
  }
  const defaultBuild = buildExecutiveTimeContext(Object.freeze({ timeState: "now" }));
  return defaultBuild.success ? defaultBuild.timeContext : null;
}

export const ExecutiveTimeContextGateway = Object.freeze({
  executiveTimeContextToMetadata,
  attachExecutiveTimeContextToGatewayRequest,
  resolveExecutiveTimeContextForIntelligence,
});
