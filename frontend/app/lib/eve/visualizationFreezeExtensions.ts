import { VisualizationCertification } from "./visualizationCertification.ts";

const certifiedExtensions =
  VisualizationCertification.platform.manifest.validation.model.registry.extensions;

export const VisualizationFreezeExtensions = Object.freeze({
  extensionRegistry: certifiedExtensions,
  canonicalReference: certifiedExtensions.foundationReference,
  preservedByReference: true,
  implementationProvided: false,
  extensionsLocked: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

