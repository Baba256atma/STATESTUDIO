/**
 * EIL-6:5 — Integration Observability Manifest Exports.
 *
 * Declared public architectural export surface for Manifest.
 * Metadata-only. No implementation exports.
 *
 * Ownership: owned exclusively by EIL-6:5.
 */

import { IntegrationObservabilityValidationCanonicalId } from "./integrationObservabilityValidation.ts";
import { IntegrationObservabilityManifestCanonicalId } from "./integrationObservabilityManifestIdentity.ts";

/** Declared architectural export name. */
export type ObservabilityManifestExportName =
  | "IntegrationObservabilityManifestIdentity"
  | "IntegrationObservabilityManifest"
  | "IntegrationObservabilityManifestGuarantees"
  | "IntegrationObservabilityManifestCompatibility"
  | "IntegrationObservabilityManifestDependencies"
  | "IntegrationObservabilityManifestExports"
  | "IntegrationObservabilityManifestReadiness"
  | "IntegrationObservabilityManifestCanonicalId";

/** Immutable export declaration descriptor. */
export interface IntegrationObservabilityManifestExportDeclaration {
  readonly exportId: `EIL-6:5/Export/${ObservabilityManifestExportName}`;
  readonly exportName: ObservabilityManifestExportName;
  readonly description: string;
  readonly order: number;
  readonly architecturalOnly: true;
  readonly implementationExport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const exportDeclaration = (
  exportName: ObservabilityManifestExportName,
  description: string,
  order: number,
): IntegrationObservabilityManifestExportDeclaration =>
  Object.freeze({
    exportId: `EIL-6:5/Export/${exportName}` as const,
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
export const IntegrationObservabilityManifestExports = Object.freeze({
  exportsId: "EIL-6:5/Exports" as const,
  manifestCanonicalId: IntegrationObservabilityManifestCanonicalId,
  sourceValidationId: IntegrationObservabilityValidationCanonicalId,
  packageEntry: "index.ts" as const,
  packageEntryOnly: true as const,
  additionalPackageRoot: false as const,
  declarations: Object.freeze([
    exportDeclaration(
      "IntegrationObservabilityManifestIdentity",
      "Canonical Manifest identity metadata.",
      1,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifest",
      "Canonical Manifest aggregate.",
      2,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestGuarantees",
      "Immutable architectural guarantees.",
      3,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestCompatibility",
      "Immutable compatibility declarations.",
      4,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestDependencies",
      "Immutable Validation dependency metadata.",
      5,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestExports",
      "Declared public architectural export surface.",
      6,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestReadiness",
      "Manifest readiness declaration.",
      7,
    ),
    exportDeclaration(
      "IntegrationObservabilityManifestCanonicalId",
      "Canonical Manifest identifier constant.",
      8,
    ),
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
