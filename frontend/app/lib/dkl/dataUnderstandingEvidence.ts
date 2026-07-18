/**
 * DKL-3:1 — Data Understanding Evidence Model.
 *
 * Canonical evidence categories, strength levels, and catalog metadata.
 * Evidence always requires limitations. No real evidence generation here.
 *
 * Ownership: owned exclusively by DKL-3:1.
 */

import type { EvidenceCategory, EvidenceStrength } from "./dataUnderstandingFoundationTypes.ts";

export const EVIDENCE_CATEGORIES: readonly EvidenceCategory[] = Object.freeze([
  "HeaderName",
  "PrimitiveType",
  "SampleValues",
  "ValueDistribution",
  "NullPattern",
  "UniquenessPattern",
  "FormatPattern",
  "SourceRegistry",
  "ConnectorContext",
  "ContentTypeContext",
  "DatasetName",
  "UserSelection",
  "ParserDiagnostic",
  "UserConfirmation",
  "CrossColumnPattern",
]);

export const EVIDENCE_STRENGTHS: readonly EvidenceStrength[] = Object.freeze([
  "Weak",
  "Moderate",
  "Strong",
]);

const CATEGORY_DESCRIPTIONS: Readonly<Record<EvidenceCategory, string>> = Object.freeze({
  HeaderName: "Lexical signal from an original column or dataset header name.",
  PrimitiveType: "Parser-derived provisional primitive type for a column.",
  SampleValues: "Bounded sample values from preview rows.",
  ValueDistribution: "Observed distribution characteristics within preview scope.",
  NullPattern: "Empty or missing-value patterns in preview evidence.",
  UniquenessPattern: "Observed uniqueness characteristics within preview scope.",
  FormatPattern: "Syntactic format patterns observed in sample values.",
  SourceRegistry: "Resolved DKL-2 data-source registry reference.",
  ConnectorContext: "Resolved DKL-2 connector registry reference.",
  ContentTypeContext: "Resolved DKL-2 content-type registry reference.",
  DatasetName: "Caller-supplied dataset name as lexical context.",
  UserSelection: "User-selected columns confirmed for understanding.",
  ParserDiagnostic: "Parser diagnostic codes and severities from INT-1:2.",
  UserConfirmation: "Explicit Pipeline Preview confirmation of the intake.",
  CrossColumnPattern: "Structural patterns spanning multiple selected columns.",
});

/**
 * Evidence catalog entry shape used by later phases. DKL-3:1 publishes the
 * catalog contract only — no scored or generated evidence items.
 */
export interface EvidenceCatalogEntry {
  readonly category: EvidenceCategory;
  readonly description: string;
  readonly limitationsRequired: true;
  readonly exampleLimitation: string;
}

const CATALOG: readonly EvidenceCatalogEntry[] = Object.freeze(
  EVIDENCE_CATEGORIES.map((category) =>
    Object.freeze({
      category,
      description: CATEGORY_DESCRIPTIONS[category],
      limitationsRequired: true as const,
      exampleLimitation:
        category === "HeaderName"
          ? 'Header "revenue" is strong lexical evidence, but it is not proof that values represent recognized accounting revenue.'
          : "Evidence is preview-scoped and provisional; it does not prove canonical organizational meaning.",
    }),
  ),
);

/** Canonical immutable evidence catalog. */
export const DataUnderstandingEvidenceCatalog = Object.freeze({
  categories: EVIDENCE_CATEGORIES,
  strengths: EVIDENCE_STRENGTHS,
  entries: CATALOG,
  limitationsRequired: true,
  notes: Object.freeze({
    evidenceIsNotProof: true,
    previewScoped: true,
    requireLimitationsForEvidence: true,
    noRealEvidenceGenerationInFoundation: true,
  }),
});
