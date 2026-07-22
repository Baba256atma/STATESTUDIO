const extensionNames = Object.freeze([
  "Platform extension", "Module extension", "Capability extension",
  "Compatibility extension", "Lifecycle extension", "Namespace extension",
  "Registry extension", "Composition extension", "Metadata extension",
  "Version extension", "Reference extension", "Future visualization extension",
] as const);

export const VisualizationPlatformRegistryExtensions = Object.freeze(
  extensionNames.map((name, index) => Object.freeze({
    id: `EVE-8:2/Extension/${index + 1}` as const,
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
