/**
 * DKL-3:8 — Data Understanding Freeze Registry.
 *
 * Immutable freeze registry of frozen components. Metadata only.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import type {
  DataUnderstandingFreezeIdentityDescriptor,
  FreezeComponentEntry,
} from "./dataUnderstandingFreezeTypes.ts";

export const DATA_UNDERSTANDING_FREEZE_VERSION = "1.0.0";

export const DATA_UNDERSTANDING_FREEZE_IDENTITY: DataUnderstandingFreezeIdentityDescriptor =
  Object.freeze({
    freezeId: "DKL-3:8/DataUnderstandingFreeze",
    freezeVersion: DATA_UNDERSTANDING_FREEZE_VERSION,
    freezeName: "Data Understanding Freeze",
    freezeNamespace: "nexora.dkl.data-understanding.freeze",
    platformId: "DKL-3",
    platformVersion: "1.0.0",
    owner: "DKL-3 Data Understanding Platform",
    sourcePhase: "DKL-3:8",
    certificationStatus: "Certified",
    freezeStatus: "Frozen",
    stability: "Stable",
    readiness: "ReadyForPublicIndex",
    metadataOnly: true,
    immutable: true,
  });

const component = (
  componentId: string,
  componentName: string,
  sourcePhase: string,
  kind: string,
): FreezeComponentEntry =>
  Object.freeze({
    componentId,
    componentName,
    sourcePhase,
    kind,
    publicApiCount: 8 as const,
    frozen: true as const,
  });

const COMPONENTS: readonly FreezeComponentEntry[] = Object.freeze([
  component("DKL-3:1/Foundation", "Data Understanding Foundation", "DKL-3:1", "Foundation"),
  component("DKL-3:2/Registry", "Data Understanding Registry", "DKL-3:2", "Registry"),
  component("DKL-3:3/Model", "Data Understanding Model", "DKL-3:3", "Model"),
  component("DKL-3:4/Validation", "Data Understanding Validation", "DKL-3:4", "Validation"),
  component("DKL-3:5/Manifest", "Data Understanding Manifest", "DKL-3:5", "Manifest"),
  component("DKL-3:6/Platform", "Data Understanding Platform", "DKL-3:6", "Platform"),
  component("DKL-3:7/Certification", "Data Understanding Certification", "DKL-3:7", "Certification"),
]);

export const DATA_UNDERSTANDING_FREEZE_PUBLIC_API_NAMES = Object.freeze([
  "DataUnderstandingFreeze",
  "DataUnderstandingFreezeRegistry",
  "DataUnderstandingFreezeCompatibility",
  "DataUnderstandingFreezeLocks",
  "DataUnderstandingFreezeManifest",
  "DataUnderstandingFreezeSummary",
  "DataUnderstandingFreezeVersion",
  "DataUnderstandingFreezeIdentity",
]);

/** Canonical immutable freeze registry. */
export const DataUnderstandingFreezeRegistry = Object.freeze({
  registryId: "DKL-3:8/FreezeRegistry",
  identity: DATA_UNDERSTANDING_FREEZE_IDENTITY,
  version: DATA_UNDERSTANDING_FREEZE_VERSION,
  components: COMPONENTS,
  componentCount: COMPONENTS.length,
  frozenPhases: Object.freeze([
    "DKL-3:1",
    "DKL-3:2",
    "DKL-3:3",
    "DKL-3:4",
    "DKL-3:5",
    "DKL-3:6",
    "DKL-3:7",
  ]),
  frozenPhaseCount: 7 as const,
  frozenPublicApiCount: 56 as const,
  publicApiNames: DATA_UNDERSTANDING_FREEZE_PUBLIC_API_NAMES,
  publicApiCount: DATA_UNDERSTANDING_FREEZE_PUBLIC_API_NAMES.length,
  freezeStatus: "Frozen" as const,
  stability: "Stable" as const,
  readiness: "ReadyForPublicIndex" as const,
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
  deterministic: true,
});
