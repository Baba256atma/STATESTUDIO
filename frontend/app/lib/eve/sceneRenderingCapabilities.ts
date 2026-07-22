const names = Object.freeze([
  "Scene Identity Definition", "Scene Reference Definition",
  "Render Context Definition", "Render Pass Definition",
  "Render Stage Definition", "Render Layer Definition",
  "Render Target Definition", "Render Surface Definition",
  "Frame Descriptor Definition", "Scene Composition Contract Definition",
  "Output Descriptor Definition", "Rendering Profile Definition",
  "Rendering Policy Definition", "Extension Point Definition",
] as const);

export const SceneRenderingCapabilities = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `EVE-2:1/Capability/${name.replaceAll(" ", "")}`,
    name,
    description: `Metadata capability for ${name}.`,
    deterministicOrder: index + 1,
    implementationProvided: false,
    executes: false,
    metadataOnly: true,
    immutable: true,
  })),
);

