/**
 * DKL-2:7 — Certification Compatibility.
 *
 * Ten immutable architectural compatibility declarations describing the intra-
 * DKL-2 progression, the forward path to certification and freeze, and forward
 * compatibility with future (not-yet-existing) consumers. These are architectural
 * declarations only; future consumers are not implied to exist or be operational.
 *
 * Ownership: owned exclusively by DKL-2:7.
 * Dependency rules: depends only on the DKL-2:7 certification types.
 */

import {
  type CertificationCompatibilityContainer,
  type CertificationCompatibilityDeclaration,
} from "./dataSourceKnowledgeCertificationTypes.ts";

const compatibilityEntries: readonly CertificationCompatibilityDeclaration[] = Object.freeze([
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-FOUNDATION-REGISTRY",
    source: "DKL-2 Foundation",
    target: "DKL-2 Registry",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Registry consumes foundation categories through the public foundation API.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-REGISTRY-MODEL",
    source: "DKL-2 Registry",
    target: "DKL-2 Model",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Models are derived deterministically from public registry entries.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-MODEL-VALIDATION",
    source: "DKL-2 Model",
    target: "DKL-2 Validation",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Validation evaluates public model surfaces without mutation.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-VALIDATION-MANIFEST",
    source: "DKL-2 Validation",
    target: "DKL-2 Manifest",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Manifest aggregates public validation results without re-evaluation.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-MANIFEST-PLATFORM",
    source: "DKL-2 Manifest",
    target: "DKL-2 Platform",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Platform aggregates the public manifest surface by reference.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-PLATFORM-CERTIFICATION",
    source: "DKL-2 Platform",
    target: "DKL-2 Certification",
    relationship: "ProvidesArchitecturalBasisFor",
    status: "Compatible",
    guarantees: Object.freeze([
      "Certification consumes the public platform surface as deterministic evidence.",
    ]),
    limitations: Object.freeze(["Architectural compatibility only; no runtime coupling."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-CERTIFICATION-FREEZE",
    source: "DKL-2 Certification",
    target: "DKL-2 Freeze",
    relationship: "EnablesForwardTransitionTo",
    status: "Compatible",
    guarantees: Object.freeze([
      "Certification declares the platform ReadyForFreeze for the DKL-2:8 freeze phase.",
    ]),
    limitations: Object.freeze(["Freeze is a future phase; no freeze artifacts exist yet."]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-PLATFORM-DKL3",
    source: "DKL-2 Platform",
    target: "DKL-3 Future Consumer",
    relationship: "ForwardCompatibleWith",
    status: "Compatible",
    guarantees: Object.freeze([
      "The stable public DKL-2 platform surface is safe for future DKL-3 consumers.",
    ]),
    limitations: Object.freeze([
      "The DKL-3 consumer does not yet exist and is not operational.",
    ]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-PLATFORM-CSV",
    source: "DKL-2 Platform",
    target: "CSV Integration Future Consumer",
    relationship: "ForwardCompatibleWith",
    status: "Compatible",
    guarantees: Object.freeze([
      "The registry and model metadata are sufficient to describe future CSV integration.",
    ]),
    limitations: Object.freeze([
      "No CSV ingestion, parsing, or connector execution is implied or present.",
    ]),
  }),
  Object.freeze<CertificationCompatibilityDeclaration>({
    compatibilityId: "COMPAT-PLATFORM-BUSINESS-OBJECT",
    source: "DKL-2 Platform",
    target: "Business Object Mapping Future Consumer",
    relationship: "ForwardCompatibleWith",
    status: "Compatible",
    guarantees: Object.freeze([
      "The knowledge and compatibility metadata are sufficient to describe future object mapping.",
    ]),
    limitations: Object.freeze([
      "No business-object creation or semantic processing is implied or present.",
    ]),
  }),
]);

const compatibilityById: ReadonlyMap<string, CertificationCompatibilityDeclaration> = new Map(
  compatibilityEntries.map((entry) => [entry.compatibilityId, entry]),
);

export const DataSourceKnowledgeCertificationCompatibility: CertificationCompatibilityContainer =
  Object.freeze<CertificationCompatibilityContainer>({
    kind: "CertificationCompatibility",
    declarations: compatibilityEntries,
    getCompatibilityById: (
      compatibilityId: string,
    ): CertificationCompatibilityDeclaration | undefined =>
      compatibilityById.get(compatibilityId),
    metadataOnly: true,
    immutable: true,
  });
