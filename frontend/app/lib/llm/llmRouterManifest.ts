/**
 * LLM-8 — Route manifest generation.
 */

import { LLM_ROUTER_CONTRACT_VERSION } from "./llmRouterContracts.ts";
import { getDefaultRouterCompatibility, validateRouterVersionCompatibility } from "./llmRouterValidation.ts";
import type { LlmRouteManifest, LlmRouterRegistry } from "./llmRouterTypes.ts";

export function getLlmRouteManifest(registry: LlmRouterRegistry): LlmRouteManifest {
  const versionValidation = validateRouterVersionCompatibility();
  return Object.freeze({
    manifestId: "llm-route-manifest",
    routerVersion: LLM_ROUTER_CONTRACT_VERSION,
    policyCount: registry.policyCount,
    knownRouteCount: registry.knownRoutes.length,
    validationResult: versionValidation.valid ? "valid" : "invalid",
    compatibility: getDefaultRouterCompatibility(),
    readOnly: true as const,
  });
}
