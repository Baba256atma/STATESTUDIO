import {
  runDomainOntologyCertification,
  runDomainOntologyRegression,
} from "./domainOntologyCertificationIndex.ts";
import { isDomainOntologyCompatibilityMatrixValid } from "./domainOntologyPlatformCompatibility.ts";
import {
  buildDomainOntologyPlatformFreezeManifest,
  isDomainOntologyPlatformFreezeManifestValid,
} from "./domainOntologyPlatformFreezeManifest.ts";
import { DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY } from "./domainOntologyPlatformFreezeRegistry.ts";
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
import type { DomainOntologyFreezeResult } from "./domainOntologyPlatformFreezeTypes.ts";

let freezeState: DomainOntologyFreezeResult | null = null;

function check(checkId: string, passed: boolean, description: string) {
  return Object.freeze({ checkId, passed, description });
}

function placeholderDomain(): DomainPackage {
  return Object.freeze({
    contractVersion: "DOM-1",
    manifest: Object.freeze({
      domainId: "domain.ontology-freeze-runner",
      name: "Ontology Freeze Runner",
      version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
      metadata: Object.freeze({
        displayName: "Ontology Freeze Runner Domain",
        description: "Neutral placeholder domain metadata for ontology freeze runner certification.",
        category: "other",
        tags: Object.freeze(["ontology-freeze-runner"]),
      }),
      capabilities: Object.freeze([
        Object.freeze({
          id: "ontology-freeze-runner",
          name: "Ontology Freeze Runner",
          description: "Supports deterministic ontology freeze runner certification fixtures.",
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
    ontologyId: "ontology.freeze-runner.core",
    domainId: "domain.ontology-freeze-runner",
    name: "Ontology Freeze Runner Fixture",
    description: "Neutral placeholder ontology metadata for freeze runner certification.",
    version: Object.freeze({ major: 1, minor: 0, patch: 0 }),
    scope: "domain",
    status: "active",
    entityTypes: Object.freeze([
      Object.freeze({
        entityTypeId: "entity.freeze-runner.source",
        label: "Freeze Runner Source",
        description: "Neutral source entity metadata.",
        scope: "domain",
        status: "active",
      }),
      Object.freeze({
        entityTypeId: "entity.freeze-runner.target",
        label: "Freeze Runner Target",
        description: "Neutral target entity metadata.",
        scope: "domain",
        status: "active",
      }),
    ]),
    relationshipTypes: Object.freeze([
      Object.freeze({
        relationshipTypeId: "relationship.freeze-runner.link",
        label: "Freeze Runner Link",
        description: "Neutral direct relationship metadata.",
        sourceEntityTypeId: "entity.freeze-runner.source",
        targetEntityTypeId: "entity.freeze-runner.target",
        scope: "domain",
        status: "active",
      }),
    ]),
    attributes: Object.freeze([
      Object.freeze({
        attributeId: "attribute.freeze-runner.label",
        ownerEntityTypeId: "entity.freeze-runner.source",
        label: "Freeze Runner Label",
        description: "Neutral attribute metadata.",
        valueType: "string",
        required: false,
        scope: "domain",
        status: "active",
      }),
    ]),
    constraints: Object.freeze([
      Object.freeze({
        constraintId: "constraint.freeze-runner.label",
        targetType: "attribute",
        targetId: "attribute.freeze-runner.label",
        label: "Freeze Runner Constraint",
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

function isPublicApiRegistryValid(): boolean {
  const apiNames = DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY.map((entry) => entry.apiName);
  return (
    apiNames.length > 0 &&
    new Set(apiNames).size === apiNames.length &&
    DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY.every((entry) => entry.stable && entry.metadataOnly)
  );
}

export function runDomainOntologyPlatformFreeze(): DomainOntologyFreezeResult {
  const manifest = buildDomainOntologyPlatformFreezeManifest();
  const certification = runDomainOntologyCertification(certificationRegistry());
  const regression = runDomainOntologyRegression();
  const checks = Object.freeze([
    check("dom-3-3-certification-pass", certification.status === "PASS", "DOM-3:3 certification must pass."),
    check("dom-3-regression-pass", regression.failed === 0, "DOM-3 regression metadata must pass."),
    check("manifest-valid", isDomainOntologyPlatformFreezeManifestValid(manifest), "Freeze manifest must be valid."),
    check("compatibility-matrix-valid", isDomainOntologyCompatibilityMatrixValid(manifest.compatibilityMatrix), "Compatibility matrix must include required read-only boundaries."),
    check("public-api-registry-valid", isPublicApiRegistryValid(), "Public API registry must be stable and unique."),
  ]);
  const status = checks.every((entry) => entry.passed) ? "PASS" : "FAIL";

  freezeState = Object.freeze({
    status,
    manifest,
    certificationStatus: certification.status,
    regression,
    checks,
  });

  return freezeState;
}

export function getDomainOntologyPlatformFreezeState(): DomainOntologyFreezeResult {
  if (!freezeState) {
    return runDomainOntologyPlatformFreeze();
  }
  return freezeState;
}
