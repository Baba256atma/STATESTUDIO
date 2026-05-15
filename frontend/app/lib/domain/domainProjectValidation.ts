import { isKnownDomainId } from "./domainRegistry.ts";
import type { DomainProjectSnapshot } from "./domainProjectTypes.ts";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateDomainProjectSnapshot(value: unknown): {
  valid: boolean;
  warnings: string[];
} {
  const snapshot = asRecord(value);
  const metadata = asRecord(snapshot.metadata);
  const warnings: string[] = [];

  if (snapshot.version !== "domain-project-v1") warnings.push("invalid_version");
  if (!isNonEmptyString(snapshot.projectId)) warnings.push("missing_project_id");
  if (!isNonEmptyString(snapshot.projectName)) warnings.push("missing_project_name");
  if (!isKnownDomainId(snapshot.activeDomainId)) warnings.push("invalid_active_domain");
  if (!snapshot.scene || typeof snapshot.scene !== "object") warnings.push("missing_scene");
  if (metadata.createdBy !== "nexora-domain") warnings.push("invalid_created_by");
  if (metadata.domainPhase !== "domain") warnings.push("invalid_domain_phase");
  if (!isFiniteNumber(metadata.objectCount)) warnings.push("invalid_object_count");
  if (!isFiniteNumber(metadata.edgeCount)) warnings.push("invalid_edge_count");

  const derived = snapshot.derived;
  if (derived !== undefined && (!derived || typeof derived !== "object" || Array.isArray(derived))) {
    warnings.push("invalid_derived_payload");
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

export function isDomainProjectSnapshot(value: unknown): value is DomainProjectSnapshot {
  return validateDomainProjectSnapshot(value).valid;
}
