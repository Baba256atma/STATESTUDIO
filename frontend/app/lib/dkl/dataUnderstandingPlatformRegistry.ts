/**
 * DKL-3:6 — Data Understanding Platform Registry.
 *
 * Immutable platform metadata registry: identity, components, inventory, and
 * status. References prior DKL-3 phases by public API only.
 *
 * Ownership: owned exclusively by DKL-3:6.
 */

import type {
  DataUnderstandingPlatformIdentityDescriptor,
  PlatformComponentEntry,
} from "./dataUnderstandingPlatformTypes.ts";

export const DATA_UNDERSTANDING_PLATFORM_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_PLATFORM_IDENTITY: DataUnderstandingPlatformIdentityDescriptor =
  Object.freeze({
    platformId: "DKL-3",
    platformVersion: DATA_UNDERSTANDING_PLATFORM_VERSION,
    platformName: "Data Understanding Platform",
    platformNamespace: "nexora.dkl.data-understanding.platform",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:6",
    status: "PlatformComplete",
    readiness: "ReadyForCertification",
  });

const component = (
  componentId: string,
  componentName: string,
  sourcePhase: string,
  kind: string,
): PlatformComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    sourcePhase,
    kind,
    publicApiCount: 8 as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const COMPONENTS: readonly PlatformComponentEntry[] = Object.freeze([
  component("DKL-3:1/Foundation", "Data Understanding Foundation", "DKL-3:1", "Foundation"),
  component("DKL-3:2/Registry", "Data Understanding Registry", "DKL-3:2", "Registry"),
  component("DKL-3:3/Model", "Data Understanding Model", "DKL-3:3", "Model"),
  component("DKL-3:4/Validation", "Data Understanding Validation", "DKL-3:4", "Validation"),
  component("DKL-3:5/Manifest", "Data Understanding Manifest", "DKL-3:5", "Manifest"),
  component("DKL-3:6/Platform", "Data Understanding Platform", "DKL-3:6", "Platform"),
]);

export const DATA_UNDERSTANDING_PLATFORM_NAMESPACE_SECTIONS = Object.freeze([
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
] as const);

export const DATA_UNDERSTANDING_PLATFORM_PUBLIC_API_NAMES = Object.freeze([
  "DataUnderstandingPlatform",
  "DataUnderstandingPlatformRegistry",
  "DataUnderstandingPlatformCompatibility",
  "DataUnderstandingPlatformDependencies",
  "DataUnderstandingPlatformReadiness",
  "DataUnderstandingPlatformSummary",
  "DataUnderstandingPlatformVersion",
  "DataUnderstandingPlatformIdentity",
]);

/** Canonical immutable platform registry metadata. */
export const DataUnderstandingPlatformRegistry = Object.freeze({
  registryId: "DKL-3:6/PlatformRegistry",
  identity: DATA_UNDERSTANDING_PLATFORM_IDENTITY,
  version: DATA_UNDERSTANDING_PLATFORM_VERSION,
  namespace: DATA_UNDERSTANDING_PLATFORM_IDENTITY.platformNamespace,
  namespaceSections: DATA_UNDERSTANDING_PLATFORM_NAMESPACE_SECTIONS,
  namespaceSectionCount: DATA_UNDERSTANDING_PLATFORM_NAMESPACE_SECTIONS.length,
  components: COMPONENTS,
  componentCount: COMPONENTS.length,
  publicApiNames: DATA_UNDERSTANDING_PLATFORM_PUBLIC_API_NAMES,
  publicApiCount: DATA_UNDERSTANDING_PLATFORM_PUBLIC_API_NAMES.length,
  status: "PlatformComplete" as const,
  readiness: "ReadyForCertification" as const,
  inventory: Object.freeze({
    phasesCompleted: Object.freeze([
      "DKL-3:1",
      "DKL-3:2",
      "DKL-3:3",
      "DKL-3:4",
      "DKL-3:5",
    ]),
    phaseCount: 5,
    platformPhase: "DKL-3:6",
    nextPhase: "DKL-3:7",
  }),
  metadata: Object.freeze({
    metadataOnly: true,
    platformOnly: true,
    deterministic: true,
    immutable: true,
    noNewArchitecture: true,
    referencesPublicApisOnly: true,
  }),
  metadataOnly: true,
  platformOnly: true,
  immutable: true,
  deterministic: true,
});
