const capabilityNames = Object.freeze([
  "Suite composition", "Platform aggregation", "Metadata publication",
  "Compatibility publication", "Identity preservation",
  "Namespace preservation", "Suite summary publication",
  "Dependency publication", "Readiness publication", "Extension publication",
] as const);

export const VisualizationSuiteFoundationCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-9:1/Capability/${index + 1}` as const,
    name,
    description: `Descriptive Visualization Suite capability: ${name}.`,
    deterministicOrder: index + 1,
    implementationProvided: false,
    metadataOnly: true,
    immutable: true,
  })),
);
