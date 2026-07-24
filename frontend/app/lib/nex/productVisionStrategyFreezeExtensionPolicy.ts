/**
 * NEX-1:8 — Immutable extension policy declarations.
 */

export const ProductVisionStrategyFreezeExtensionPolicy = Object.freeze([
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/PreserveFrozenMetadata", rule: "Existing frozen metadata shall not be modified.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/ExtendNewVersions", rule: "New versions shall extend rather than alter frozen artifacts.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/StablePublicContracts", rule: "Frozen public contracts remain stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/BackwardCompatibility", rule: "Backward compatibility shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/ImmutableIdentity", rule: "Canonical identity shall remain immutable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/StableApiRegistry", rule: "Public API Registry shall remain stable.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/MetadataIntegrity", rule: "Metadata integrity shall be preserved.", metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-1:8/ExtensionPolicy/NonExecutable", rule: "Freeze is non-executable.", metadataOnly: true, immutable: true }),
] as const);
