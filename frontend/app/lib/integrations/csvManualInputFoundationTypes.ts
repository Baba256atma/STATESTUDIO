/**
 * INT-1:1 — CSV & Manual Input Integration Foundation Types.
 *
 * Readonly, metadata-only type contracts for the first Nexora data-ingestion
 * vertical slice. These types describe how Nexora accepts a CSV file, pasted CSV
 * text, or a small manually entered table, and how an import session is
 * identified and progresses through its controlled lifecycle.
 *
 * Ownership: owned exclusively by INT-1 (Integration platform). These types do
 * not own semantic understanding, Business Object mapping, knowledge creation,
 * persistence, or executive analysis.
 * Dependency rules: type-only module. No runtime behavior, no imports beyond
 * standard TypeScript. Discriminated unions and readonly types throughout.
 */

// --------------------------------------------------------------------------
// Input modes.
// --------------------------------------------------------------------------

/** The three canonical INT-1 input modes. */
export type CsvManualInputMode = "CsvFile" | "CsvText" | "ManualTable";

/** Declared encoding hints. Detection belongs to the parser phase (INT-1:2). */
export type EncodingHint = "UTF-8" | "UTF-8-BOM" | "UTF-16LE" | "UTF-16BE" | "Unknown";

/** Declared delimiter hints. Detection belongs to the parser phase (INT-1:2). */
export type DelimiterHint = "Comma" | "Semicolon" | "Tab" | "Pipe" | "Auto";

/** Metadata for a user-selected CSV file. The file is NOT read in this phase. */
export interface CsvFileInput {
  readonly mode: "CsvFile";
  readonly fileName: string;
  readonly fileSizeBytes: number;
  readonly mimeType: string;
  readonly lastModified: number;
  readonly encodingHint: EncodingHint;
}

/** CSV content pasted into Nexora. Complete parsing is deferred to INT-1:2. */
export interface CsvTextInput {
  readonly mode: "CsvText";
  readonly name: string;
  readonly content: string;
  readonly encodingHint: EncodingHint;
}

/** A small, manually supplied table with explicit dimension limits applied. */
export interface ManualTableInput {
  readonly mode: "ManualTable";
  readonly name: string;
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

/** Discriminated union of every accepted INT-1 input contract. */
export type CsvManualInputSource = CsvFileInput | CsvTextInput | ManualTableInput;

// --------------------------------------------------------------------------
// DKL-2 source references.
// --------------------------------------------------------------------------

export type SourceReferenceKind = "DataSource" | "ConnectorType" | "ContentType";

/** An immutable reference to a canonical DKL-2 registry entry. */
export interface SourceRegistryReference {
  readonly registryEntryId: string;
  readonly registryEntryName: string;
  readonly kind: SourceReferenceKind;
  readonly resolved: boolean;
}

// --------------------------------------------------------------------------
// Lifecycle.
// --------------------------------------------------------------------------

/** The nine ordered import-session lifecycle states. */
export type ImportLifecycleState =
  | "Created"
  | "InputAccepted"
  | "Parsing"
  | "PreviewReady"
  | "AwaitingConfirmation"
  | "Confirmed"
  | "Completed"
  | "Failed"
  | "Cancelled";

export type LifecycleTransitionMap = Readonly<
  Record<ImportLifecycleState, readonly ImportLifecycleState[]>
>;

// --------------------------------------------------------------------------
// Session identity.
// --------------------------------------------------------------------------

/**
 * Import-session identity. INT-1:1 never generates ids or timestamps — session
 * ids are supplied by the caller (or a later explicitly owned service). Tenant
 * and workspace fields are required to preserve Nexora isolation boundaries.
 */
export interface ImportSessionIdentity {
  readonly sessionId: string;
  readonly workspaceId: string;
  readonly tenantId: string;
  readonly sourceMode: CsvManualInputMode;
  readonly sourceName: string;
  readonly createdBy: string;
  readonly lifecycleState: ImportLifecycleState;
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
}

/** A temporary, in-memory import-session representation. */
export interface ImportSession {
  readonly identity: ImportSessionIdentity;
  readonly input: CsvManualInputSource;
  readonly diagnostics: readonly ImportDiagnostic[];
}

// --------------------------------------------------------------------------
// Policies.
// --------------------------------------------------------------------------

export interface FileAcceptancePolicy {
  readonly allowedExtensions: readonly string[];
  readonly allowedMimeTypes: readonly string[];
  readonly maximumFileSizeBytes: number;
  readonly minimumFileSizeBytes: number;
}

export interface CsvTextAcceptancePolicy {
  readonly maximumCharacterCount: number;
  readonly minimumCharacterCount: number;
}

export interface ManualTableAcceptancePolicy {
  readonly maximumColumns: number;
  readonly maximumRows: number;
  readonly maximumCellCharacterCount: number;
}

export interface SecurityIsolationPolicy {
  readonly singleTenantPerImport: boolean;
  readonly singleWorkspacePerImport: boolean;
  readonly crossTenantReuseForbidden: boolean;
  readonly crossWorkspaceAccessRequiresExplicitPolicy: boolean;
  readonly filenamesAreDisplayMetadataOnly: boolean;
  readonly pathTraversalNeverInterpreted: boolean;
  readonly rawContentNeverLogged: boolean;
  readonly diagnosticsNeverExposeSensitiveRows: boolean;
  readonly untrustedFormulaPrefixes: readonly string[];
  readonly executableContentUnsupported: boolean;
  readonly csvIsDataNeverCode: boolean;
}

/** The complete, deeply frozen INT-1 acceptance and security policy set. */
export interface ImportPolicy {
  readonly file: FileAcceptancePolicy;
  readonly csvText: CsvTextAcceptancePolicy;
  readonly manualTable: ManualTableAcceptancePolicy;
  readonly supportedEncodings: readonly EncodingHint[];
  readonly supportedDelimiters: readonly DelimiterHint[];
  readonly security: SecurityIsolationPolicy;
}

// --------------------------------------------------------------------------
// Diagnostics.
// --------------------------------------------------------------------------

export type DiagnosticCategory =
  | "Input"
  | "Policy"
  | "Encoding"
  | "Delimiter"
  | "Header"
  | "Row"
  | "Column"
  | "Lifecycle"
  | "RegistryReference"
  | "Security";

export type DiagnosticSeverity = "Info" | "Warning" | "Error" | "Blocking";

/**
 * A stable, structured diagnostic. Optional location fields are explicit and
 * readonly. Diagnostics never carry stack traces or sensitive file content.
 */
export interface ImportDiagnostic {
  readonly diagnosticId: string;
  readonly code: string;
  readonly category: DiagnosticCategory;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly field: string | null;
  readonly rowIndex: number | null;
  readonly columnIndex: number | null;
  readonly recoverable: boolean;
}

export interface DiagnosticCatalogEntry {
  readonly code: string;
  readonly category: DiagnosticCategory;
  readonly defaultSeverity: DiagnosticSeverity;
  readonly description: string;
  readonly recoverable: boolean;
}

// --------------------------------------------------------------------------
// Result envelopes (discriminated unions).
// --------------------------------------------------------------------------

export interface ImportSuccess<T> {
  readonly outcome: "Success";
  readonly value: T;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportFailure {
  readonly outcome: "Failure";
  readonly diagnostics: readonly ImportDiagnostic[];
}

export type ImportResult<T> = ImportSuccess<T> | ImportFailure;

// --------------------------------------------------------------------------
// Dataset preview contracts (consumed by the future Pipeline Page / INT-1:2).
// --------------------------------------------------------------------------

/** Syntactic preview primitive types. NOT DKL-3 semantic classifications. */
export type ProvisionalPrimitiveType =
  | "String"
  | "Integer"
  | "Decimal"
  | "Boolean"
  | "Date"
  | "DateTime"
  | "Unknown";

export interface ColumnPreview {
  readonly index: number;
  readonly originalName: string;
  readonly displayName: string;
  readonly sampleValues: readonly string[];
  readonly emptyValueCount: number;
  readonly provisionalPrimitiveType: ProvisionalPrimitiveType;
}

export interface RowPreview {
  readonly index: number;
  readonly cells: readonly string[];
  readonly truncated: boolean;
}

export interface DatasetPreview {
  readonly datasetName: string;
  readonly sourceMode: CsvManualInputMode;
  readonly detectedDelimiter: DelimiterHint;
  readonly detectedEncoding: EncodingHint;
  readonly headerCount: number;
  readonly rowCountObserved: number;
  readonly rowCountPreviewed: number;
  readonly columns: readonly ColumnPreview[];
  readonly rows: readonly RowPreview[];
  readonly diagnostics: readonly ImportDiagnostic[];
  readonly truncated: boolean;
}

// --------------------------------------------------------------------------
// Foundation validation request/result.
// --------------------------------------------------------------------------

/** The foundation-level validation request. Never mutated or read from disk. */
export interface CsvManualInputFoundationRequest {
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly createdBy: string;
  readonly input: CsvManualInputSource;
  readonly startingLifecycleState?: ImportLifecycleState;
}

/** The normalized, validated echo returned on a successful foundation check. */
export interface ValidatedFoundationSummary {
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly sourceMode: CsvManualInputMode;
  readonly sourceName: string;
  readonly startingLifecycleState: ImportLifecycleState;
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
}

export type FoundationValidationResult = ImportResult<ValidatedFoundationSummary>;
