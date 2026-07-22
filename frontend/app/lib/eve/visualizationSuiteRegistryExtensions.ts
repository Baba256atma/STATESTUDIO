const extensionNames = Object.freeze([
  "Suite Extension", "Platform Extension", "Capability Extension",
  "Compatibility Extension", "Lifecycle Extension", "Namespace Extension",
  "Registry Extension", "Composition Extension", "Metadata Extension",
  "Version Extension", "Public Index Extension",
  "Future Visualization Suite Extension",
] as const);

export const VisualizationSuiteRegistryExtensions = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-9:2/Extension/${index + 1}` as const,
    name,
    classification: name.replaceAll(" ", ""),
    description: `Metadata-only extension classification: ${name}.`,
    deterministicOrder: index + 1,
    runtimePluginRegistration: false,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
