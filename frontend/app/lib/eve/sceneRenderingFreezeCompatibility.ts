import { SceneRenderingCertification } from "./sceneRenderingCertification.ts";

const names = Object.freeze([
  "PlatformCompatibility", "ManifestCompatibility", "ValidationCompatibility",
  "RegistryCompatibility", "FoundationCompatibility", "NamespaceCompatibility",
  "DependencyCompatibility", "FuturePublicIndexCompatibility",
] as const);

export const SceneRenderingFreezeCompatibility = Object.freeze(
  names.map((name, index) => {
    const certifiedEntry = SceneRenderingCertification.compatibility[index]!;
    return Object.freeze({
      id: `EVE-2:8/Compatibility/${name}`,
      name,
      compatible: certifiedEntry.certified,
      certificationEntry: certifiedEntry,
      canonicalReference: certifiedEntry.canonicalReference,
      preservedByReference: true,
      deterministicOrder: index + 1,
      runtimeCheck: false,
      metadataOnly: true,
      immutable: true,
    });
  }),
);
