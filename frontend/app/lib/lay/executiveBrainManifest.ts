import { getExecutiveBrainConfiguration } from "./executiveBrainConfiguration.ts";
import { getExecutiveBrainRegistry } from "./executiveBrainRegistry.ts";
import type { ExecutiveBrainManifest, ExecutiveBrainValidationResult } from "./executiveBrainTypes.ts";

export const EXECUTIVE_BRAIN_PUBLIC_APIS = Object.freeze([
  "ExecutiveBrainFoundation",
  "getExecutiveBrainPlatform",
  "getExecutiveBrainCapabilities",
  "getExecutiveBrainConfiguration",
  "buildExecutiveBrainManifest",
  "validateExecutiveBrainFoundation",
] as const);

export function buildExecutiveBrainManifest(
  validation: ExecutiveBrainValidationResult = Object.freeze({ valid: true, issues: Object.freeze([]) })
): ExecutiveBrainManifest {
  const registry = getExecutiveBrainRegistry();
  return Object.freeze({
    platform: registry.platform,
    registry,
    configuration: getExecutiveBrainConfiguration(),
    publicApis: EXECUTIVE_BRAIN_PUBLIC_APIS,
    validation,
    metadataOnly: true,
    runtimeIntelligence: false,
    readyFor: "LAY-2 Executive Reasoning Engine",
  });
}
