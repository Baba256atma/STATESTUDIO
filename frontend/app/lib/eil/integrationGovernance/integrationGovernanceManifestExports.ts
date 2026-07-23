/**
 * EIL-7:5 — Integration Governance Manifest Exports.
 *
 * Declared public architectural export surface for Manifest.
 * Metadata-only. No implementation exports.
 *
 * Ownership: owned exclusively by EIL-7:5.
 */

import { IntegrationGovernanceValidationCanonicalId } from "./integrationGovernanceValidation.ts";
import { IntegrationGovernanceManifestCanonicalId } from "./integrationGovernanceManifestIdentity.ts";

/** Declared architectural export name. */
export type GovernanceManifestExportName =
  | "IntegrationGovernanceManifestIdentity"
  | "IntegrationGovernanceManifest"
  | "IntegrationGovernanceManifestGuarantees"
  | "IntegrationGovernanceManifestCompatibility"
  | "IntegrationGovernanceManifestDependencies"
  | "IntegrationGovernanceManifestExports"
  | "IntegrationGovernanceManifestReadiness"
  | "IntegrationGovernanceManifestCanonicalId";

/** Immutable export declaration descriptor. */
export interface IntegrationGovernanceManifestExportDeclaration {
  readonly exportId: `EIL-7:5/Export/${GovernanceManifestExportName}`;
  readonly exportName: GovernanceManifestExportName;
  readonly description: string;
  readonly order: number;
  readonly architecturalOnly: true;
  readonly implementationExport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const exportDeclaration = (
  exportName: GovernanceManifestExportName,
  description: string,
  order: number,
): IntegrationGovernanceManifestExportDeclaration =>
  Object.freeze({
    exportId: `EIL-7:5/Export/${exportName}` as const,
    exportName,
    description,
    order,
    architecturalOnly: true as const,
    implementationExport: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Declared Manifest public architectural export surface.
 */
export const IntegrationGovernanceManifestExports = Object.freeze({
  exportsId: "EIL-7:5/Exports" as const,
  manifestCanonicalId: IntegrationGovernanceManifestCanonicalId,
  sourceValidationId: IntegrationGovernanceValidationCanonicalId,
  packageEntry: "index.ts" as const,
  packageEntryOnly: true as const,
  additionalPackageRoot: false as const,
  declarations: Object.freeze([
    exportDeclaration(
      "IntegrationGovernanceManifestIdentity",
      "Canonical Manifest identity metadata.",
      1,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifest",
      "Canonical Manifest aggregate.",
      2,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestGuarantees",
      "Immutable architectural guarantees.",
      3,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestCompatibility",
      "Immutable compatibility declarations.",
      4,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestDependencies",
      "Immutable Validation dependency metadata.",
      5,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestExports",
      "Declared public architectural export surface.",
      6,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestReadiness",
      "Manifest readiness declaration.",
      7,
    ),
    exportDeclaration(
      "IntegrationGovernanceManifestCanonicalId",
      "Canonical Manifest identifier constant.",
      8,
    ),
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
