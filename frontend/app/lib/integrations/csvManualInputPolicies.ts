/**
 * INT-1:1 — Acceptance and Security Policies.
 *
 * Immutable, deeply frozen MVP acceptance and security/isolation policies for
 * CSV file, pasted CSV text, and manual-table input. All limits are constants,
 * easy to raise in a later compatible version. No policy performs I/O, scanning,
 * or any runtime behavior — they are declarative data only.
 *
 * Ownership: owned exclusively by INT-1.
 * Dependency rules: depends only on INT-1 foundation types.
 */

import type {
  CsvTextAcceptancePolicy,
  DelimiterHint,
  EncodingHint,
  FileAcceptancePolicy,
  ImportPolicy,
  ManualTableAcceptancePolicy,
  SecurityIsolationPolicy,
} from "./csvManualInputFoundationTypes.ts";

const MEGABYTE = 1024 * 1024;

const filePolicy: FileAcceptancePolicy = Object.freeze({
  allowedExtensions: Object.freeze([".csv"]),
  allowedMimeTypes: Object.freeze(["text/csv", "application/csv", "text/plain"]),
  maximumFileSizeBytes: 10 * MEGABYTE,
  minimumFileSizeBytes: 1,
});

const csvTextPolicy: CsvTextAcceptancePolicy = Object.freeze({
  maximumCharacterCount: 5_000_000,
  minimumCharacterCount: 1,
});

const manualTablePolicy: ManualTableAcceptancePolicy = Object.freeze({
  maximumColumns: 100,
  maximumRows: 5_000,
  maximumCellCharacterCount: 10_000,
});

const supportedEncodings: readonly EncodingHint[] = Object.freeze([
  "UTF-8",
  "UTF-8-BOM",
  "UTF-16LE",
  "UTF-16BE",
  "Unknown",
]);

const supportedDelimiters: readonly DelimiterHint[] = Object.freeze([
  "Comma",
  "Semicolon",
  "Tab",
  "Pipe",
  "Auto",
]);

const securityPolicy: SecurityIsolationPolicy = Object.freeze({
  singleTenantPerImport: true,
  singleWorkspacePerImport: true,
  crossTenantReuseForbidden: true,
  crossWorkspaceAccessRequiresExplicitPolicy: true,
  filenamesAreDisplayMetadataOnly: true,
  pathTraversalNeverInterpreted: true,
  rawContentNeverLogged: true,
  diagnosticsNeverExposeSensitiveRows: true,
  untrustedFormulaPrefixes: Object.freeze(["=", "+", "-", "@"]),
  executableContentUnsupported: true,
  csvIsDataNeverCode: true,
});

/** The complete, deeply frozen INT-1 acceptance and security policy set. */
export const CsvManualInputPolicies: ImportPolicy = Object.freeze({
  file: filePolicy,
  csvText: csvTextPolicy,
  manualTable: manualTablePolicy,
  supportedEncodings,
  supportedDelimiters,
  security: securityPolicy,
});
