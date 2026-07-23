/**
 * EIL-2:7 — Integration Connector Certification Criteria.
 *
 * Immutable declarative certification criteria for the EIL-2 Connector Platform.
 * Descriptive only. No certification execution.
 *
 * Ownership: owned exclusively by EIL-2:7.
 */

import {
  IntegrationConnectorPlatform,
  IntegrationConnectorPlatformIdentity,
} from "./integrationConnectorPlatform.ts";
import type {
  IntegrationConnectorCertificationCriterion,
  IntegrationConnectorCertificationCriterionCategory,
  IntegrationConnectorCertificationCriterionKey,
  IntegrationConnectorCertificationExpectedOutcome,
  IntegrationConnectorCertificationSeverity,
  IntegrationConnectorPlatformReference,
} from "./integrationConnectorCertificationTypes.ts";

const platform = IntegrationConnectorPlatform;

const platformRef = (
  sourcePath: string,
): IntegrationConnectorPlatformReference =>
  Object.freeze({
    platformId: IntegrationConnectorPlatformIdentity.canonicalId,
    platformNamespace: IntegrationConnectorPlatformIdentity.namespace,
    entryPoint: "integrationConnectorPlatform.ts" as const,
    sourcePath,
    preservesCanonicalReference: true as const,
    duplicatesPlatformValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const criterion = (
  key: IntegrationConnectorCertificationCriterionKey,
  canonicalName: string,
  description: string,
  category: IntegrationConnectorCertificationCriterionCategory,
  expectedOutcome: IntegrationConnectorCertificationExpectedOutcome,
  severity: IntegrationConnectorCertificationSeverity,
  sourcePath: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationConnectorCertificationCriterion =>
  Object.freeze({
    criterionId: `EIL-2:7/Criterion/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    category,
    expectedOutcome,
    severity,
    sourceReference: platformRef(sourcePath),
    ownership: "EIL-2:7" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesCertification: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen certification criteria.
 * Source references point at Platform aggregate surfaces.
 */
export const IntegrationConnectorCertificationCriteria: readonly IntegrationConnectorCertificationCriterion[] =
  Object.freeze([
    criterion(
      "CanonicalIdentity",
      "Canonical Identity",
      "Platform canonical identity must equal EIL-2:6/IntegrationConnectorPlatform.",
      "Identity",
      "Present",
      "Error",
      "identity",
      1,
      Object.freeze(["identity"]),
    ),
    criterion(
      "NamespaceIntegrity",
      "Namespace Integrity",
      "Platform namespace must equal nexora.eil.integration-connector.platform.",
      "Namespace",
      "Valid",
      "Error",
      "identity/namespace",
      2,
      Object.freeze(["namespace"]),
    ),
    criterion(
      "VersionIntegrity",
      "Version Integrity",
      "Platform version must equal 1.0.0.",
      "Version",
      "Valid",
      "Error",
      "identity/version",
      3,
      Object.freeze(["version"]),
    ),
    criterion(
      "DependencyIntegrity",
      "Dependency Integrity",
      "Platform must declare Manifest as sole upstream dependency.",
      "Dependency",
      "Compliant",
      "Error",
      "dependency",
      4,
      Object.freeze(["dependency"]),
    ),
    criterion(
      "InventoryIntegrity",
      "Inventory Integrity",
      `Platform inventory total must remain derived (${platform.inventory.total}).`,
      "Inventory",
      "Complete",
      "Error",
      "inventory",
      5,
      Object.freeze(["inventory"]),
    ),
    criterion(
      "ValidationCompleteness",
      "Validation Completeness",
      "Platform composition must retain Validation reference integrity.",
      "Validation",
      "Complete",
      "Error",
      "composition/validationReference",
      6,
      Object.freeze(["validation"]),
    ),
    criterion(
      "ManifestCompleteness",
      "Manifest Completeness",
      "Platform must reference EIL-2:5/IntegrationConnectorManifest without duplication.",
      "Manifest",
      "Complete",
      "Error",
      "composition/manifestReference",
      7,
      Object.freeze(["manifest"]),
    ),
    criterion(
      "PlatformCompleteness",
      "Platform Completeness",
      `Platform guarantees (${platform.guarantees.length}) and compatibility (${platform.compatibility.length}) must be complete.`,
      "Platform",
      "Complete",
      "Error",
      "guarantees",
      8,
      Object.freeze(["platform"]),
    ),
    criterion(
      "CompatibilityIntegrity",
      "Compatibility Integrity",
      "Platform compatibility declarations must remain complete and descriptive.",
      "Compatibility",
      "Complete",
      "Error",
      "compatibility",
      9,
      Object.freeze(["compatibility"]),
    ),
    criterion(
      "MetadataImmutability",
      "Metadata Immutability",
      "All Platform exports must remain deeply immutable.",
      "Immutability",
      "Immutable",
      "Error",
      "collections",
      10,
      Object.freeze(["immutability"]),
    ),
    criterion(
      "DeterministicOrdering",
      "Deterministic Ordering",
      "Platform collections must preserve explicit ascending ordinals.",
      "Determinism",
      "Deterministic",
      "Error",
      "guarantees",
      11,
      Object.freeze(["ordering"]),
    ),
    criterion(
      "ArchitecturalConsistency",
      "Architectural Consistency",
      "Foundation through Manifest lineage must remain consistent in composition.",
      "Architecture",
      "Compliant",
      "Error",
      "composition",
      12,
      Object.freeze(["architecture"]),
    ),
    criterion(
      "AggregateEntryPointIntegrity",
      "Aggregate Entry Point Integrity",
      "IntegrationConnectorPlatform must remain the sole Platform consumer entry point.",
      "Export",
      "Present",
      "Error",
      "summary",
      13,
      Object.freeze(["export"]),
    ),
    criterion(
      "MetadataOnlyCompliance",
      "Metadata-Only Compliance",
      "Platform must remain free of runtime, networking, and connector execution behavior.",
      "Compliance",
      "Compliant",
      "Error",
      "metadataOnly",
      14,
      Object.freeze(["metadata-only"]),
    ),
    criterion(
      "ReleaseConsistency",
      "Release Consistency",
      "Release lineage and version consistency must be preserved across EIL-2.",
      "Release",
      "Compliant",
      "Error",
      "composition/releaseLineage",
      15,
      Object.freeze(["release"]),
    ),
    criterion(
      "ReadinessCompliance",
      "Readiness Compliance",
      "Platform readiness must be ReadyForCertification prior to Freeze eligibility.",
      "Readiness",
      "Pass",
      "Error",
      "readiness",
      16,
      Object.freeze(["readiness"]),
    ),
  ]);
