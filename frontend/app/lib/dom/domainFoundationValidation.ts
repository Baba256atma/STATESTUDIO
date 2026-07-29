import { MAX_DOMAIN_ID_LENGTH, SUPPORTED_DOMAIN_CATEGORIES } from "./domainFoundationConstants.ts";
import { DOMAIN_FOUNDATION_CONTRACT_VERSION } from "./domainFoundationTypes.ts";
import type { DomainId, DomainPackage, DomainRegistry, DomainValidationIssue, DomainValidationResult, DomainVersion } from "./domainFoundationTypes.ts";

function issue(code: string, field: string, message: string): DomainValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" });
}

export function domainValidationResult(issues: readonly DomainValidationIssue[]): DomainValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function isValidDomainVersion(version: DomainVersion): boolean {
  return (
    isNonNegativeInteger(version.major) &&
    isNonNegativeInteger(version.minor) &&
    isNonNegativeInteger(version.patch) &&
    (version.label === undefined || (typeof version.label === "string" && version.label.trim().length > 0))
  );
}

export function compareDomainVersions(left: DomainVersion, right: DomainVersion): number {
  if (left.major !== right.major) {
    return left.major - right.major;
  }
  if (left.minor !== right.minor) {
    return left.minor - right.minor;
  }
  return left.patch - right.patch;
}

export function isValidDomainId(domainId: DomainId): boolean {
  if (typeof domainId !== "string") {
    return false;
  }
  const trimmed = domainId.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_DOMAIN_ID_LENGTH && /^[a-z][a-z0-9._:-]*$/.test(trimmed);
}

function validateDomainPackageStructure(domainPackage: DomainPackage): DomainValidationIssue[] {
  const issues: DomainValidationIssue[] = [];
  const manifest = domainPackage.manifest;

  if (domainPackage.contractVersion !== DOMAIN_FOUNDATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_contract_version", "contractVersion", "Domain package contract version must be DOM-1."));
  }

  if (!isValidDomainId(manifest.domainId)) {
    issues.push(issue("invalid_domain_id", "manifest.domainId", "Domain id must be a non-empty lowercase identifier."));
  }

  if (typeof manifest.name !== "string" || manifest.name.trim().length === 0) {
    issues.push(issue("invalid_domain_name", "manifest.name", "Domain name must be a non-empty string."));
  }

  if (!isValidDomainVersion(manifest.version)) {
    issues.push(issue("invalid_domain_version", "manifest.version", "Domain version must use non-negative integer major, minor, and patch values."));
  }

  if (!SUPPORTED_DOMAIN_CATEGORIES.includes(manifest.metadata.category)) {
    issues.push(issue("unsupported_category", "manifest.metadata.category", "Domain category is not supported by the foundation."));
  }

  if (typeof manifest.metadata.displayName !== "string" || manifest.metadata.displayName.trim().length === 0) {
    issues.push(issue("invalid_display_name", "manifest.metadata.displayName", "Domain display name must be a non-empty string."));
  }

  const capabilityIds = manifest.capabilities.map((capability) => capability.id);
  if (new Set(capabilityIds).size !== capabilityIds.length) {
    issues.push(issue("duplicate_capability_id", "manifest.capabilities", "Domain capability ids must be unique."));
  }

  const dependencyIds = manifest.dependencies.map((dependency) => dependency.domainId);
  if (new Set(dependencyIds).size !== dependencyIds.length) {
    issues.push(issue("duplicate_dependency_id", "manifest.dependencies", "Domain dependency ids must be unique."));
  }

  if (manifest.dependencies.some((dependency) => dependency.domainId === manifest.domainId)) {
    issues.push(issue("self_dependency", "manifest.dependencies", "A domain cannot depend on itself."));
  }

  for (const dependency of manifest.dependencies) {
    if (!isValidDomainVersion(dependency.minVersion)) {
      issues.push(issue("invalid_dependency_version", "manifest.dependencies", `Dependency ${dependency.domainId} has an invalid minimum version.`));
    }
  }

  return issues;
}

export function validateDomainPackage(domainPackage: DomainPackage): DomainValidationResult {
  return domainValidationResult(validateDomainPackageStructure(domainPackage));
}

function validateDependencyIntegrity(
  domainPackage: DomainPackage,
  registry: DomainRegistry
): DomainValidationIssue[] {
  const issues: DomainValidationIssue[] = [];

  for (const dependency of domainPackage.manifest.dependencies) {
    if (dependency.optional) {
      continue;
    }

    const provider = registry.indexes.byId[dependency.domainId];
    if (!provider) {
      issues.push(
        issue(
          "missing_dependency",
          "manifest.dependencies",
          `Required dependency is not registered: ${dependency.domainId}.`
        )
      );
      continue;
    }

    if (compareDomainVersions(provider.package.manifest.version, dependency.minVersion) < 0) {
      issues.push(
        issue(
          "dependency_version_mismatch",
          "manifest.dependencies",
          `Dependency ${dependency.domainId} does not satisfy minimum version requirements.`
        )
      );
    }
  }

  return issues;
}

export function validateDomainRegistration(
  registry: DomainRegistry,
  domainPackage: DomainPackage
): DomainValidationResult {
  const issues = [...validateDomainPackageStructure(domainPackage)];

  if (registry.frozen) {
    issues.push(issue("registry_frozen", "registry", "Domain registry is frozen and cannot accept mutations."));
  }

  if (registry.indexes.byId[domainPackage.manifest.domainId]) {
    issues.push(issue("duplicate_id", "manifest.domainId", `Domain id already registered: ${domainPackage.manifest.domainId}.`));
  }

  const normalizedName = domainPackage.manifest.name.trim().toLowerCase();
  if (registry.indexes.byName[normalizedName]) {
    issues.push(issue("duplicate_name", "manifest.name", `Domain name already registered: ${domainPackage.manifest.name}.`));
  }

  issues.push(...validateDependencyIntegrity(domainPackage, registry));

  return domainValidationResult(issues);
}

export function validateDomainRegistry(registry: DomainRegistry): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];
  const ids = registry.domains.map((entry) => entry.package.manifest.domainId);
  const names = registry.domains.map((entry) => entry.package.manifest.name.trim().toLowerCase());

  if (new Set(ids).size !== ids.length) {
    issues.push(issue("duplicate_registry_id", "domains", "Registry contains duplicate domain ids."));
  }

  if (new Set(names).size !== names.length) {
    issues.push(issue("duplicate_registry_name", "domains", "Registry contains duplicate domain names."));
  }

  for (const entry of registry.domains) {
    issues.push(...validateDomainPackageStructure(entry.package));
    issues.push(...validateDependencyIntegrity(entry.package, registry));
  }

  const orders = registry.domains.map((entry) => entry.registrationOrder);
  if (orders.length > 0) {
    const expected = Array.from({ length: orders.length }, (_, index) => index);
    if (orders.some((order, index) => order !== expected[index])) {
      issues.push(issue("invalid_registration_order", "domains", "Registry registration order is inconsistent."));
    }
  }

  return domainValidationResult(issues);
}

export function validateDomainFoundation(): DomainValidationResult {
  return domainValidationResult([]);
}
