import { buildBusinessSuiteArchitectureManifest } from "./businessSuiteArchitectureManifest.ts";
import { BusinessSuiteArchitectureRegistry } from "./businessSuiteArchitectureRegistry.ts";
import type { BusinessSuiteArchitecture, BusinessSuiteArchitectureValidation } from "./businessSuiteArchitectureTypes.ts";

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function result(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): BusinessSuiteArchitectureValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

export function validateBusinessSuiteArchitecture(
  manifest: BusinessSuiteArchitecture = buildBusinessSuiteArchitectureManifest()
): BusinessSuiteArchitectureValidation {
  const errors: string[] = [];
  const registry = BusinessSuiteArchitectureRegistry;
  const layerIds = new Set(registry.layers.map((layer) => layer.layerId));
  const categories = new Set(registry.categories);
  const rebuilt = buildBusinessSuiteArchitectureManifest();

  if (manifest.metadata.architectureId !== "BUS-ARCH") errors.push("invalid-architecture-id");
  if (manifest.version.versionId !== "BUS-ARCH-1") errors.push("invalid-version-id");
  if (!manifest.metadata.metadataOnly || !manifest.metadata.immutable) errors.push("invalid-architecture-metadata");
  if (!manifest.version.deterministic) errors.push("invalid-version-metadata");
  if (manifest.platforms.length === 0) errors.push("missing-platforms");
  if (manifest.layers.length === 0) errors.push("missing-layers");
  if (manifest.categories.length === 0) errors.push("missing-categories");
  if (manifest.principles.length < 12) errors.push("incomplete-principles");
  if (manifest.rules.length === 0) errors.push("missing-rules");
  if (manifest.deterministicFingerprint !== rebuilt.deterministicFingerprint) errors.push("manifest-not-deterministic");

  errors.push(...duplicateValues(manifest.platforms.map((platform) => platform.platformId)).map((id) => `duplicate-platform:${id}`));
  errors.push(...duplicateValues(manifest.layers.map((layer) => layer.layerId)).map((id) => `duplicate-layer:${id}`));
  errors.push(...duplicateValues(manifest.categories).map((id) => `duplicate-category:${id}`));
  errors.push(...duplicateValues(manifest.principles.map((principle) => principle.principleId)).map((id) => `duplicate-principle:${id}`));

  for (const layer of manifest.layers) {
    if (!layer.metadataOnly || !layer.immutable) errors.push(`invalid-layer-metadata:${layer.layerId}`);
  }
  for (const platform of manifest.platforms) {
    if (!layerIds.has(platform.architectureLayerId)) errors.push(`invalid-platform-layer:${platform.platformId}`);
    if (!categories.has(platform.category)) errors.push(`invalid-platform-category:${platform.platformId}`);
    if (!platform.metadataOnly || !platform.immutable) errors.push(`invalid-platform-metadata:${platform.platformId}`);
    if (platform.platformId !== platform.platformId.toLowerCase()) errors.push(`invalid-platform-naming:${platform.platformId}`);
  }
  for (const principle of manifest.principles) {
    if (!principle.required || !principle.metadataOnly) errors.push(`invalid-principle:${principle.principleId}`);
  }
  for (const rule of manifest.rules) {
    if (!rule.metadataOnly) errors.push(`invalid-rule:${rule.ruleId}`);
  }

  return result(errors);
}
