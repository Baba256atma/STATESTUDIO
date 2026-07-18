/**
 * DKL-2:7 — Certification Registry.
 *
 * Immutable registry of the seven DKL-2 certification components (Foundation,
 * Registry, Model, Validation, Manifest, Platform, PublicSurface). Each entry is
 * a metadata-only certification declaration backed by evidence ids. Every
 * component is Certified with zero blocking issues and zero warnings.
 *
 * Ownership: owned exclusively by DKL-2:7.
 * Dependency rules: depends only on the DKL-2:7 certification types.
 */

import {
  type CertificationComponentEntry,
  type CertificationComponentRegistry,
} from "./dataSourceKnowledgeCertificationTypes.ts";

const componentEntries: readonly CertificationComponentEntry[] = Object.freeze([
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-FOUNDATION",
    componentName: "DKL-2 Foundation Certification",
    componentKind: "Foundation",
    sourcePhase: "DKL-2:1",
    publicModule: "dataSourceKnowledgeRegistryFoundation.ts",
    status: "Certified",
    evidenceIds: Object.freeze(["EV-2-1-STATUS", "EV-2-1-EXPORTS"]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-REGISTRY",
    componentName: "DKL-2 Registry Certification",
    componentKind: "Registry",
    sourcePhase: "DKL-2:2",
    publicModule: "dataSourceKnowledgeRegistryPlatform.ts",
    status: "Certified",
    evidenceIds: Object.freeze([
      "EV-2-2-REGISTRY",
      "EV-2-2-EXPORTS",
      "EV-REGISTRY-ENTRIES",
      "EV-COMPATIBILITY-RELATIONSHIPS",
    ]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-MODEL",
    componentName: "DKL-2 Model Certification",
    componentKind: "Model",
    sourcePhase: "DKL-2:3",
    publicModule: "dataSourceRegistryModelPlatform.ts",
    status: "Certified",
    evidenceIds: Object.freeze(["EV-2-3-MODELS", "EV-2-3-EXPORTS"]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-VALIDATION",
    componentName: "DKL-2 Validation Certification",
    componentKind: "Validation",
    sourcePhase: "DKL-2:4",
    publicModule: "dataSourceKnowledgeValidationRunner.ts",
    status: "Certified",
    evidenceIds: Object.freeze(["EV-2-4-VALIDATION", "EV-2-4-RULES", "EV-2-4-EXPORTS"]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-MANIFEST",
    componentName: "DKL-2 Manifest Certification",
    componentKind: "Manifest",
    sourcePhase: "DKL-2:5",
    publicModule: "dataSourceKnowledgeRegistryManifestPlatform.ts",
    status: "Certified",
    evidenceIds: Object.freeze(["EV-2-5-MANIFEST", "EV-2-5-EXPORTS", "EV-GUARANTEES"]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-PLATFORM",
    componentName: "DKL-2 Platform Certification",
    componentKind: "Platform",
    sourcePhase: "DKL-2:6",
    publicModule: "dataSourceKnowledgeRegistryPlatformIndex.ts",
    status: "Certified",
    evidenceIds: Object.freeze([
      "EV-2-6-PLATFORM",
      "EV-2-6-EXPORTS",
      "EV-ARTIFACTS-METADATA",
      "EV-PRIOR-EXPORTS",
    ]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
  Object.freeze<CertificationComponentEntry>({
    componentId: "CERT-PUBLIC-SURFACE",
    componentName: "DKL-2 Public Surface Certification",
    componentKind: "PublicSurface",
    sourcePhase: "DKL-2:7",
    publicModule: "dataSourceKnowledgeCertificationPlatform.ts",
    status: "Certified",
    evidenceIds: Object.freeze([
      "EV-DEEP-IMMUTABILITY",
      "EV-METADATA-ONLY",
      "EV-ARTIFACTS-PHYSICAL",
      "EV-FORWARD-ONLY",
      "EV-CYCLE-FREE",
      "EV-PUBLIC-API-ONLY",
      "EV-PUBLIC-SURFACE-AMBIGUITY",
    ]),
    blockingIssueCount: 0,
    warningCount: 0,
    readiness: "ReadyForFreeze",
  }),
]);

const componentById: ReadonlyMap<string, CertificationComponentEntry> = new Map(
  componentEntries.map((entry) => [entry.componentId, entry]),
);

export const DataSourceKnowledgeCertificationRegistry: CertificationComponentRegistry =
  Object.freeze<CertificationComponentRegistry>({
    kind: "CertificationRegistry",
    components: componentEntries,
    getComponentById: (componentId: string): CertificationComponentEntry | undefined =>
      componentById.get(componentId),
    metadataOnly: true,
    immutable: true,
  });
