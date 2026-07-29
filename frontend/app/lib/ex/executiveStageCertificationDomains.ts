/**
 * EX-1:7 — Executive Stage Certification Domains.
 *
 * Exactly twelve canonical certification domains.
 * Each domain must pass independently.
 *
 * Ownership: owned exclusively by EX-1:7.
 */

/** Canonical certification domain name. */
export type ExecutiveStageCertificationDomainName =
  | "Architecture"
  | "Identity"
  | "Dependencies"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Runtime Compatibility"
  | "Public API"
  | "Quality"
  | "Release Readiness";

/** Certification domain declaration. */
export interface ExecutiveStageCertificationDomainDeclaration {
  readonly domainId: string;
  readonly domainName: ExecutiveStageCertificationDomainName;
  readonly description: string;
  readonly order: number;
  readonly removable: false;
  readonly mustPassIndependently: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const domain = (
  domainName: ExecutiveStageCertificationDomainName,
  description: string,
  order: number,
): ExecutiveStageCertificationDomainDeclaration =>
  Object.freeze({
    domainId: `EX-1:7/Domain/${domainName.replace(/\s+/g, "")}`,
    domainName,
    description,
    order,
    removable: false as const,
    mustPassIndependently: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly twelve certification domains. */
export const ExecutiveStageCertificationDomains = Object.freeze([
  domain(
    "Architecture",
    "Verifies canonical architecture, phase ordering, and module boundaries.",
    1,
  ),
  domain(
    "Identity",
    "Verifies canonical identifiers, namespaces, and version consistency.",
    2,
  ),
  domain(
    "Dependencies",
    "Verifies approved upstream imports and architectural isolation.",
    3,
  ),
  domain(
    "Registry",
    "Verifies registry completeness and canonical layer ordering.",
    4,
  ),
  domain(
    "Model",
    "Verifies model consistency, ownership hierarchy, and Runtime bindings.",
    5,
  ),
  domain(
    "Validation",
    "Verifies validation baseline and category completeness.",
    6,
  ),
  domain(
    "Manifest",
    "Verifies manifest completeness, capabilities, and guarantees.",
    7,
  ),
  domain(
    "Platform",
    "Verifies platform services, lifecycle, bridge, and events.",
    8,
  ),
  domain(
    "Runtime Compatibility",
    "Verifies compatibility with Executive Context Runtime Public Index.",
    9,
  ),
  domain(
    "Public API",
    "Verifies stable API surface and deterministic exports.",
    10,
  ),
  domain(
    "Quality",
    "Verifies TypeScript, ESLint, tests, and architecture audits.",
    11,
  ),
  domain(
    "Release Readiness",
    "Verifies release readiness for Freeze progression.",
    12,
  ),
] as const);

export const ExecutiveStageCertificationDomainNames = Object.freeze([
  "Architecture",
  "Identity",
  "Dependencies",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Runtime Compatibility",
  "Public API",
  "Quality",
  "Release Readiness",
] as const satisfies readonly ExecutiveStageCertificationDomainName[]);
