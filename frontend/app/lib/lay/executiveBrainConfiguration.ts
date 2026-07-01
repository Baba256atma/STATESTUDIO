import type { ExecutiveBrainConfiguration } from "./executiveBrainTypes.ts";

export const DEFAULT_EXECUTIVE_BRAIN_CONFIGURATION: ExecutiveBrainConfiguration = Object.freeze({
  enabled: true,
  strictMode: true,
  diagnostics: false,
  validation: true,
  debug: false,
  runtimeIntelligence: false,
});

export function getExecutiveBrainConfiguration(): ExecutiveBrainConfiguration {
  return DEFAULT_EXECUTIVE_BRAIN_CONFIGURATION;
}
