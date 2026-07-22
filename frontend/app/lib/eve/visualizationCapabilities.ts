const capabilityNames = Object.freeze([
  "Visual Object Representation",
  "Scene Reference Representation",
  "Viewport Definition",
  "Camera Contract Definition",
  "Layer Contract Definition",
  "Rendering Target Definition",
  "Rendering Surface Definition",
  "Rendering Mode Definition",
  "Visual State Definition",
  "Interaction State Definition",
  "Rendering Policy Definition",
  "Extension Point Definition",
] as const);

export const VisualizationCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `EVE-1:1/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Metadata capability for ${name}.`,
    deterministicOrder: index + 1,
    implementationProvided: false,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);

