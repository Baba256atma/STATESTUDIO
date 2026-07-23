/**
 * EIL-9:5 — Executive Integration Layer Manifest Exports.
 *
 * Declared public architectural export surface for Manifest.
 * Metadata-only. No implementation exports.
 *
 * Ownership: owned exclusively by EIL-9:5.
 */

import { ExecutiveIntegrationLayerValidationCanonicalId } from "./executiveIntegrationLayerValidation.ts";
import { ExecutiveIntegrationLayerManifestCanonicalId } from "./executiveIntegrationLayerManifestIdentity.ts";

/** Declared architectural export name. */
export type LayerManifestExportName =
  | "ExecutiveIntegrationLayerManifestIdentity"
  | "ExecutiveIntegrationLayerManifest"
  | "ExecutiveIntegrationLayerManifestGuarantees"
  | "ExecutiveIntegrationLayerManifestCompatibility"
  | "ExecutiveIntegrationLayerManifestDependencies"
  | "ExecutiveIntegrationLayerManifestExports"
  | "ExecutiveIntegrationLayerManifestReadiness"
  | "ExecutiveIntegrationLayerManifestCanonicalId";

/** Immutable export declaration descriptor. */
export interface ExecutiveIntegrationLayerManifestExportDeclaration {
  readonly exportId: `EIL-9:5/Export/${LayerManifestExportName}`;
  readonly exportName: LayerManifestExportName;
  readonly description: string;
  readonly order: number;
  readonly architecturalOnly: true;
  readonly implementationExport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const exportDeclaration = (
  exportName: LayerManifestExportName,
  description: string,
  order: number,
): ExecutiveIntegrationLayerManifestExportDeclaration =>
  Object.freeze({
    exportId: `EIL-9:5/Export/${exportName}` as const,
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
export const ExecutiveIntegrationLayerManifestExports = Object.freeze({
  exportsId: "EIL-9:5/Exports" as const,
  manifestCanonicalId: ExecutiveIntegrationLayerManifestCanonicalId,
  sourceValidationId: ExecutiveIntegrationLayerValidationCanonicalId,
  packageEntry: "index.ts" as const,
  packageEntryOnly: true as const,
  additionalPackageRoot: false as const,
  declarations: Object.freeze([
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestIdentity",
      "Canonical Manifest identity metadata.",
      1,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifest",
      "Canonical Manifest aggregate.",
      2,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestGuarantees",
      "Immutable architectural guarantees.",
      3,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestCompatibility",
      "Immutable compatibility declarations.",
      4,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestDependencies",
      "Immutable Validation dependency metadata.",
      5,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestExports",
      "Declared public architectural export surface.",
      6,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestReadiness",
      "Manifest readiness declaration.",
      7,
    ),
    exportDeclaration(
      "ExecutiveIntegrationLayerManifestCanonicalId",
      "Canonical Manifest identifier constant.",
      8,
    ),
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
