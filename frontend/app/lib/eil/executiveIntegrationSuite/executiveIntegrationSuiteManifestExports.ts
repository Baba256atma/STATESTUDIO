/**
 * EIL-8:5 — Executive Integration Suite Manifest Exports.
 *
 * Declared public architectural export surface for Manifest.
 * Metadata-only. No implementation exports.
 *
 * Ownership: owned exclusively by EIL-8:5.
 */

import { ExecutiveIntegrationSuiteValidationCanonicalId } from "./executiveIntegrationSuiteValidation.ts";
import { ExecutiveIntegrationSuiteManifestCanonicalId } from "./executiveIntegrationSuiteManifestIdentity.ts";

/** Declared architectural export name. */
export type SuiteManifestExportName =
  | "ExecutiveIntegrationSuiteManifestIdentity"
  | "ExecutiveIntegrationSuiteManifest"
  | "ExecutiveIntegrationSuiteManifestGuarantees"
  | "ExecutiveIntegrationSuiteManifestCompatibility"
  | "ExecutiveIntegrationSuiteManifestDependencies"
  | "ExecutiveIntegrationSuiteManifestExports"
  | "ExecutiveIntegrationSuiteManifestReadiness"
  | "ExecutiveIntegrationSuiteManifestCanonicalId";

/** Immutable export declaration descriptor. */
export interface ExecutiveIntegrationSuiteManifestExportDeclaration {
  readonly exportId: `EIL-8:5/Export/${SuiteManifestExportName}`;
  readonly exportName: SuiteManifestExportName;
  readonly description: string;
  readonly order: number;
  readonly architecturalOnly: true;
  readonly implementationExport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const exportDeclaration = (
  exportName: SuiteManifestExportName,
  description: string,
  order: number,
): ExecutiveIntegrationSuiteManifestExportDeclaration =>
  Object.freeze({
    exportId: `EIL-8:5/Export/${exportName}` as const,
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
export const ExecutiveIntegrationSuiteManifestExports = Object.freeze({
  exportsId: "EIL-8:5/Exports" as const,
  manifestCanonicalId: ExecutiveIntegrationSuiteManifestCanonicalId,
  sourceValidationId: ExecutiveIntegrationSuiteValidationCanonicalId,
  packageEntry: "index.ts" as const,
  packageEntryOnly: true as const,
  additionalPackageRoot: false as const,
  declarations: Object.freeze([
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestIdentity",
      "Canonical Manifest identity metadata.",
      1,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifest",
      "Canonical Manifest aggregate.",
      2,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestGuarantees",
      "Immutable architectural guarantees.",
      3,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestCompatibility",
      "Immutable compatibility declarations.",
      4,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestDependencies",
      "Immutable Validation dependency metadata.",
      5,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestExports",
      "Declared public architectural export surface.",
      6,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestReadiness",
      "Manifest readiness declaration.",
      7,
    ),
    exportDeclaration(
      "ExecutiveIntegrationSuiteManifestCanonicalId",
      "Canonical Manifest identifier constant.",
      8,
    ),
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
