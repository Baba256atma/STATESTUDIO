import {
  runDomainOntologyCertification,
  runDomainOntologyRegression,
} from "./domainOntologyCertificationIndex.ts";
import { getDomainOntologyPlatformCompatibilityMatrix } from "./domainOntologyPlatformCompatibility.ts";
import {
  createDomainRegistry,
  registerDomain,
  type DomainPackage,
} from "./domainFoundationIndex.ts";
import {
  createDomainOntologyRegistry,
  registerDomainOntology,
  type DomainOntologyPackage,
} from "./domainOntologyIndex.ts";
import {
  DOMAIN_ONTOLOGY_EXTENSION_POLICY,
  DOMAIN_ONTOLOGY_PHASE_REGISTRY,
  DOMAIN_ONTOLOGY_PLATFORM_IDENTITY,
  DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY,
  DOMAIN_ONTOLOGY_RELEASE_METADATA,
} from "./domainOntologyPlatformFreezeRegistry.ts";
import type { DomainOntologyPlatformFreezeManifest } from "./domainOntologyPlatformFreezeTypes.ts";

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.ontology-freeze",
      name: "Ontology Freeze",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Ontology Freeze Domain",
        description: "Neutral placeholder domain metadata for ontology platform freeze certification.",
        category: "other",
        tags: Object.freeze(["ontology-freeze"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "ontology-freeze",
          name: "Ontology Freeze",
          description: "Supports deterministic ontology platform freeze certification fixtures.",
          enabled: true,
        }),
      ]),
      dependencies: Object.freeze([]),
      status: "active",
    }),
  });
}

function placeholderOntology(): DomainOntologyPackage {
  return Object.freeze({
    contractVersion: "DOM-3:1",
    ontologyId: "ontology.freeze.core",
    domainId: "domain.ontology-freeze",
    name: "Ontology Freeze Fixture",
    description: "Neutral placeholder ontology metadata for platform freeze certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.freeze.source",
        label: "Freeze Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: "entity.freeze.target",
        label: "Freeze Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.freeze.link",
        label: "Freeze Link",
        description: "Neutral direct relationship metadata.",
        sourceEntityTypeId: "entity.freeze.source",
        targetEntityTypeId: "entity.freeze.target",
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.freeze.label",
        ownerEntityTypeId: "entity.freeze.source",
        label: "Freeze Label",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: "constraint.freeze.label",
        targetType: "attribute",
        targetId: "attribute.freeze.label",
        label: "Freeze Constraint",
        description: "Neutral constraint metadata.",
        severity: "warning",
        scope: "domain",
        status: "active",
      }),
    ]),
  });
}

function certificationRegistry() {
  const domainRegistry = registerDomain(createDomainRegistry(), placeholderDomain()).registry;
  return registerDomainOntology(
    createDomainOntologyRegistry(),
    placeholderOntology(),
    domainRegistry
  ).registry;
}

function freezeFingerprint(manifest: Omit<DomainOntologyPlatformFreezeManifest, "fingerprint">): string {
  return stableHash(
    [
      manifest.platformIdentity.platformId,
      manifest.platformIdentity.version,
      manifest.phaseRegistry.map((entry) => `${entry.phaseId}:${entry.status}:${entry.order}`).join(","),
      manifest.publicApiRegistry.map((entry) => `${entry.phaseId}:${entry.apiName}`).join(","),
      manifest.compatibilityMatrix.map((entry) => `${entry.targetLayer}:${entry.compatibility}`).join(","),
      manifest.extensionPolicy.policy,
      manifest.releaseMetadata.releaseVersion,
      manifest.certificationStatus,
      manifest.regressionStatus,
      manifest.immutable,
      manifest.deterministic,
      manifest.metadataOnly,
    ].join("||")
  );
}

export function buildDomainOntologyPlatformFreezeManifest(): DomainOntologyPlatformFreezeManifest {
  const certification = runDomainOntologyCertification(certificationRegistry());
  const regression = runDomainOntologyRegression();
  const base = Object.freeze({
    platformIdentity: DOMAIN_ONTOLOGY_PLATFORM_IDENTITY,
    phaseRegistry: DOMAIN_ONTOLOGY_PHASE_REGISTRY,
    publicApiRegistry: DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY,
    compatibilityMatrix: getDomainOntologyPlatformCompatibilityMatrix(),
    extensionPolicy: DOMAIN_ONTOLOGY_EXTENSION_POLICY,
    releaseMetadata: DOMAIN_ONTOLOGY_RELEASE_METADATA,
    certificationStatus: certification.status,
    regressionStatus: regression.failed === 0 ? ("PASS" as const) : ("FAIL" as const),
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });

  return Object.freeze({
    ...base,
    fingerprint: freezeFingerprint(base),
  });
}

export function isDomainOntologyPlatformFreezeManifestValid(
  manifest: DomainOntologyPlatformFreezeManifest
): boolean {
  const expected = freezeFingerprint({
    platformIdentity: manifest.platformIdentity,
    phaseRegistry: manifest.phaseRegistry,
    publicApiRegistry: manifest.publicApiRegistry,
    compatibilityMatrix: manifest.compatibilityMatrix,
    extensionPolicy: manifest.extensionPolicy,
    releaseMetadata: manifest.releaseMetadata,
    certificationStatus: manifest.certificationStatus,
    regressionStatus: manifest.regressionStatus,
    immutable: manifest.immutable,
    deterministic: manifest.deterministic,
    metadataOnly: manifest.metadataOnly,
  });

  return (
    manifest.platformIdentity.version === "DOM-3:4" &&
    manifest.phaseRegistry.length === 4 &&
    manifest.publicApiRegistry.length > 0 &&
    manifest.compatibilityMatrix.length === 9 &&
    manifest.certificationStatus === "PASS" &&
    manifest.regressionStatus === "PASS" &&
    manifest.extensionPolicy.allowsRuntimeGraphReasoning === false &&
    manifest.immutable === true &&
    manifest.deterministic === true &&
    manifest.metadataOnly === true &&
    manifest.fingerprint === expected
  );
}
