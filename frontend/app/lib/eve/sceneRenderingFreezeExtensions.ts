import { SceneRenderingCertification } from "./sceneRenderingCertification.ts";

const certifiedExtensions =
  SceneRenderingCertification.platform.manifest.validation.model.registry.extensions;

export const SceneRenderingFreezeExtensions = Object.freeze({
  extensionRegistry: certifiedExtensions,
  canonicalReference: certifiedExtensions.foundationContractReference,
  description: "Declarative future Scene Rendering architectural extension points.",
  preservedByReference: true,
  implementationProvided: false,
  extensionLoading: false,
  runtimeRegistration: false,
  runtimePlugins: false,
  execution: false,
  extensionsLocked: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
