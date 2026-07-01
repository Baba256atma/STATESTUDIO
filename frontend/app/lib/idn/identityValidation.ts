import type {
  IdentityValidationIssue,
  IdentityValidationResult,
} from "./identityContracts.ts";
import { isIdentityLifecycleState, isIdentitySource, isIdentityType } from "./identityTypes.ts";

function issue(
  code: IdentityValidationIssue["code"],
  field: string,
  message: string
): IdentityValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

function result(issues: readonly IdentityValidationIssue[]): IdentityValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isIsoTimestamp(value: unknown): value is string {
  return isNonEmptyString(value) && Number.isFinite(Date.parse(value));
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function validateTags(value: unknown, field: string): readonly IdentityValidationIssue[] {
  if (!Array.isArray(value)) {
    return [issue("invalid_tag", field, `${field} must be an array of non-empty strings.`)];
  }

  return value.flatMap((tag, index) =>
    isNonEmptyString(tag)
      ? []
      : [issue("invalid_tag", `${field}.${index}`, `${field} entries must be non-empty strings.`)]
  );
}

function validateMetadataMap(value: unknown, field: string): readonly IdentityValidationIssue[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [issue("invalid_metadata", field, `${field} must be a metadata object.`)];
  }

  const metadata = value as Record<string, unknown>;

  return Object.entries(metadata).flatMap(([key, metadataValue]) => {
    if (!isNonEmptyString(key)) {
      return [issue("invalid_metadata", field, `${field} keys must be non-empty strings.`)];
    }
    if (
      typeof metadataValue === "string" ||
      typeof metadataValue === "number" ||
      typeof metadataValue === "boolean" ||
      metadataValue === null
    ) {
      return [];
    }
    return [
      issue(
        "invalid_metadata",
        `${field}.${key}`,
        `${field}.${key} must be a string, number, boolean, or null.`
      ),
    ];
  });
}

export function validateIdentity(identity: unknown): IdentityValidationResult {
  const issues: IdentityValidationIssue[] = [];

  if (!isRecord(identity)) {
    return result([issue("invalid_metadata", "identity", "Identity contract must be an object.")]);
  }

  if (!isNonEmptyString(identity.id)) {
    issues.push(issue("required_field", "id", "Identity id is required."));
  }
  if (!isIdentityType(identity.type)) {
    issues.push(issue("invalid_identity_type", "type", "Identity type is not canonical."));
  }
  if (!isNonEmptyString(identity.displayName)) {
    issues.push(issue("required_field", "displayName", "Identity display name is required."));
  }
  if (!isIdentityLifecycleState(identity.lifecycle)) {
    issues.push(issue("invalid_lifecycle", "lifecycle", "Identity lifecycle is not canonical."));
  }
  if (!isPositiveInteger(identity.version)) {
    issues.push(issue("invalid_version", "version", "Identity version must be a positive integer."));
  }

  if (!isRecord(identity.created)) {
    issues.push(issue("invalid_metadata", "created", "Identity creation metadata is required."));
  } else {
    if (!isIsoTimestamp(identity.created.createdAt)) {
      issues.push(issue("invalid_metadata", "created.createdAt", "createdAt must be a valid timestamp."));
    }
    if (!isIsoTimestamp(identity.created.updatedAt)) {
      issues.push(issue("invalid_metadata", "created.updatedAt", "updatedAt must be a valid timestamp."));
    }
    if (!isNonEmptyString(identity.created.createdBy)) {
      issues.push(issue("invalid_metadata", "created.createdBy", "createdBy is required."));
    }
    if (!isPositiveInteger(identity.created.version)) {
      issues.push(issue("invalid_version", "created.version", "Metadata version must be a positive integer."));
    }
    if (!isIdentitySource(identity.created.source)) {
      issues.push(issue("invalid_metadata", "created.source", "Metadata source is not canonical."));
    }
    if (
      identity.created.description !== undefined &&
      typeof identity.created.description !== "string"
    ) {
      issues.push(issue("invalid_metadata", "created.description", "Description must be a string."));
    }
    issues.push(...validateTags(identity.created.tags, "created.tags"));
    issues.push(...validateMetadataMap(identity.created.metadata, "created.metadata"));
  }

  issues.push(...validateTags(identity.tags, "tags"));
  issues.push(...validateMetadataMap(identity.metadata, "metadata"));

  return result(issues);
}

export function validateIdentityCollection(
  identities: readonly unknown[]
): IdentityValidationResult {
  const issues: IdentityValidationIssue[] = [];
  const seenIds = new Set<string>();

  identities.forEach((identity, index) => {
    const identityResult = validateIdentity(identity);
    issues.push(
      ...identityResult.issues.map((validationIssue) =>
        issue(validationIssue.code, `${index}.${validationIssue.field}`, validationIssue.message)
      )
    );

    if (isRecord(identity) && isNonEmptyString(identity.id)) {
      if (seenIds.has(identity.id)) {
        issues.push(issue("duplicate_id", `${index}.id`, `Duplicate identity id: ${identity.id}.`));
      }
      seenIds.add(identity.id);
    }
  });

  return result(issues);
}
