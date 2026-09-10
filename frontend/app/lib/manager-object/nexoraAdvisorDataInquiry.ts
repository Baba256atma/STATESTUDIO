/**
 * DATA-ADV:1 — manager-initiated data questions over Advisor Data Context.
 * Conversation reasons; semantic writes stay applyCsvSemanticClarification.
 */
import type { CsvSemanticClarification, CsvSemanticClarificationResult } from "../data-reality/csvSemanticUnderstanding.ts";
import { applyCsvSemanticClarification } from "../data-reality/csvSemanticUnderstanding.ts";
import { getCsvImportCandidate, saveCsvImportCandidate } from "../data-reality/csvRealDataImportStore.ts";
import {
  compactDataToken,
  projectAdvisorDataContext,
  type AdvisorDataContext,
  type AdvisorDataField,
  type AdvisorDataSource,
} from "./nexoraAdvisorDataContext.ts";
import type { ConversationContinuitySnapshot } from "./contextualManagerMeaning.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const nexoraAdvisorDataInquiryIdentity = "DATA-ADV:1/AdvisorDataInquiry" as const;

export type AdvisorDataDialogue = Readonly<{
  sourceContextId: string | null;
  fieldColumn: string | null;
  listedSourceContextIds?: readonly string[];
}>;

export const emptyAdvisorDataDialogue: AdvisorDataDialogue = Object.freeze({
  sourceContextId: null,
  fieldColumn: null,
  listedSourceContextIds: Object.freeze([] as string[]),
});

export type AdvisorDataConversationKind =
  | "inventory"
  | "csv-availability"
  | "source-inventory"
  | "concept-data"
  | "concept-data-source"
  | "explain-all-csv"
  | "specific-source"
  | "source-status"
  | "source-contents"
  | "source-semantics"
  | "source-relationships"
  | "object-provenance"
  | "investigation-availability"
  | "capability-csv"
  | "pending-inventory"
  | "historical-status"
  | "existing-data-bridge"
  | "field-coverage"
  | "field-values"
  | "analytical-capability"
  | "evidence-relevance"
  | "bounded-interpretation";

export type AdvisorDataInquiryDiagnostics = Readonly<{
  dataConversationIntent: AdvisorDataConversationKind | null;
  dataLibraryQueryDetected: boolean;
  dataConceptQueryDetected: boolean;
  dataSourceQueryDetected: boolean;
  specificSourceReference: string | null;
  dataLibrarySourceCount: number;
  activeSourceCount: number;
  pendingSourceCount: number;
  historicalSourceCount: number;
  resolvedSourceIds: readonly string[];
  resolvedSourceNames: readonly string[];
  sourceStatus: readonly string[];
  semanticTrustSummary: string;
  dataAdvProjectionConsumed: true;
  dataRealityConsumed: boolean;
  provenanceConsumed: boolean;
  advisorDataRoute: "DATA-ADV:1/AdvisorDataInquiry";
  genericEntityFallbackUsed: false;
  outcomeClarificationUsed: false;
  stageFallbackUsed: false;
  productFallbackUsed: false;
}>;

export type AdvisorDataInquiryAnswer = Readonly<{
  text: string;
  dialogue: AdvisorDataDialogue;
  clarification: CsvSemanticClarification | null;
  mutatesStage: false;
  mutatesDataReality: false;
  diagnostics?: AdvisorDataInquiryDiagnostics;
}>;

const ASSISTANT_INTRODUCED_DATA_KINDS = new Set<AdvisorDataConversationKind>([
  "csv-availability",
  "inventory",
  "source-inventory",
  "pending-inventory",
  "explain-all-csv",
  "specific-source",
  "source-contents",
  "source-semantics",
  "source-status",
]);

export function assistantIntroducedDataSourceIds(
  answer: AdvisorDataInquiryAnswer | null | undefined,
): readonly string[] {
  const kind = answer?.diagnostics?.dataConversationIntent ?? null;
  if (!kind || !ASSISTANT_INTRODUCED_DATA_KINDS.has(kind)) return [];
  return answer?.diagnostics?.resolvedSourceIds ?? [];
}

function listingDialogue(
  dialogue: AdvisorDataDialogue,
  listed: readonly AdvisorDataSource[],
): AdvisorDataDialogue {
  const ids = Object.freeze(listed.map((entry) => entry.sourceContextId));
  const unique = listed.length === 1 ? listed[0] : null;
  return Object.freeze({
    sourceContextId: unique?.sourceContextId ?? (listed.length === 0 ? dialogue.sourceContextId : null),
    fieldColumn: unique || listed.length > 0 ? null : dialogue.fieldColumn,
    listedSourceContextIds: ids,
  });
}

function isCurrentReferentDeictic(query: string): boolean {
  const text = query.replace(/[.?!]+$/g, "").trim();
  return /^(?:explain|show|describe) (?:it|that|this|this one|that one)$/.test(text)
    || /^(?:tell me more about|what(?:'s| is) going on with|what about) (?:it|that|this|this one|that one)$/.test(text)
    || /^(?:investigate) (?:it|that|this)$/.test(text);
}

function recoverExplainVerb(text: string): string {
  const [first, ...rest] = text.split(" ");
  if (!first || first === "explain") return text;
  if (first.length !== "explain".length) return text;
  const differences: number[] = [];
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== "explain"[index]) differences.push(index);
  }
  if (
    differences.length === 2 &&
    differences[1] === differences[0]! + 1 &&
    first[differences[0]!] === "explain"[differences[1]!] &&
    first[differences[1]!] === "explain"[differences[0]!]
  ) {
    return ["explain", ...rest].join(" ");
  }
  return text;
}

function prepared(utterance: string): string {
  return recoverExplainVerb(
    utterance
      .trim()
      .toLowerCase()
      .replace(/^[,\s]*nexora[,\s]+/i, "")
      .replace(/[.?!]+$/g, "")
      .replace(/\s+/g, " "),
  );
}

function hasCsvOrLibraryTarget(query: string): boolean {
  const withoutFilenames = query.replace(/[a-z0-9._-]+\.csv\b/g, " ");
  return /\b(?:data library|csv(?:s|\s+files?|\s+file names?|\s+sources?)?|data sources?|uploaded files?|imported files?|data files?)\b/.test(withoutFilenames);
}

function isBusinessCollectionAsk(query: string): boolean {
  return (
    /\b(?:problems?|scenarios?|risks?|decisions?|executions?|outcomes?|goals?)\b/.test(query) &&
    !hasCsvOrLibraryTarget(query)
  );
}

function isObjectDataAskNotLibrary(query: string): boolean {
  if (/\b(?:need to investigate|investigate this)\b/.test(query)) return true;
  if (/\bhow many files\b/.test(query) && /\binvestigate\b/.test(query)) return true;
  return (
    /\b(?:supports?|using|used by)\b/.test(query) &&
    /\b(?:csv|data)\b/.test(query) &&
    !/\b(?:data library|how many|list|file names|status of each)\b/.test(query)
  );
}

function isCsvContentAsk(query: string): boolean {
  return (
    /\b(?:columns?|fields?|kpi|kpis|calculate|conclude|cannot conclude|evidence|values?|range|rows?|average|inside this|unclear|understood|understand|still learn|still tell)\b/.test(query) ||
    /\bwhat does [a-z0-9_]+\b/.test(query) ||
    /\bwhat is [a-z0-9_]+\b/.test(query) && !/\bwhat is (?:on|the status|data)\b/.test(query)
  );
}

function isDataLibraryInventoryRequest(query: string): boolean {
  if (isBusinessCollectionAsk(query) || isObjectDataAskNotLibrary(query)) return false;
  if (isCsvContentAsk(query) && !/\bdata library\b/.test(query)) return false;
  if (!hasCsvOrLibraryTarget(query)) return false;
  return /\b(?:how many|count|list(?: all)?|names?|status(?:es)?|available|check|which|what|have|any|show|tell me|give me|every|uploaded)\b/.test(query);
}

function sourceLifecyclePhrase(source: AdvisorDataSource): string {
  if (source.lifecycle === "pending") return "pending review";
  if (source.lifecycle === "committed") return "in use";
  if (source.lifecycle === "connected") return "connected";
  if (source.lifecycle === "historical") return "removed";
  return source.statusLabel.toLowerCase();
}

function inventoryCensus(context: AdvisorDataContext, query: string): string {
  const csv = csvSources(context);
  if (csv.length === 0) {
    return "There are currently no CSV files in the Data Library.";
  }
  const items = csv.map((source) => `${source.label} — ${sourceLifecyclePhrase(source)}`);
  const countLine = `There are ${csv.length} CSV file${csv.length === 1 ? "" : "s"} in the current Data Library`;
  const libraryScope = /\bdata library\b/.test(query);
  const wantsCount = /\b(?:how many|count|file count)\b/.test(query) || (libraryScope && /\bcheck\b/.test(query));
  const wantsNames = /\b(?:list|names?|every|which)\b/.test(query) || /\bfile names\b/.test(query);
  const wantsStatus = /\bstatus(?:es)?\b/.test(query) || /\bin use\b/.test(query);
  if (libraryScope || (wantsCount && wantsNames) || (wantsNames && wantsStatus) || (wantsCount && wantsStatus)) {
    return `${countLine}: ${items.join("; ")}.`;
  }
  if (wantsCount && !wantsNames && !wantsStatus) {
    return `${countLine}.`;
  }
  if (wantsNames && !wantsStatus) {
    return `The current Data Library contains ${joinNames(csv.map((entry) => entry.label))}.`;
  }
  if (wantsStatus) {
    return csv.map((source) => `${source.label} is ${sourceLifecyclePhrase(source)}.`).join(" ");
  }
  return `${countLine}: ${items.join("; ")}.`;
}

function csvSources(context: AdvisorDataContext): readonly AdvisorDataSource[] {
  return context.sources.filter((entry) => entry.sourceType === "csv" && entry.lifecycle !== "historical");
}

function historicalSources(context: AdvisorDataContext): readonly AdvisorDataSource[] {
  return context.sources.filter((entry) => entry.lifecycle === "historical");
}

function joinNames(names: readonly string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function classifyAdvisorDataConversation(utterance: string): AdvisorDataConversationKind | null {
  const query = prepared(utterance);
  if (!query) return null;
  if (
    /\b(?:can|does|could) (?:this|the|my|our) (?:csv|file|data(?: source)?|source)\b/.test(query) &&
    /\b(?:support|tell (?:us|me) about|evidence|help (?:with|us understand)|capacity gap|problem)\b/.test(query)
  ) {
    return "evidence-relevance";
  }
  if (
    /\b(?:what (?:fields|columns) (?:do you|do we|are) (?:know|have|there)|what don'?t you understand|which (?:fields|columns).*(?:unclear|unknown|unresolved))\b/.test(
      query,
    )
  ) {
    return "field-coverage";
  }
  if (
    /\b(?:explain (?:the )?(?:csv )?file you currently have|what do you understand from (?:it|this|the file)|tell me about (?:my |our |the )?data|what data (?:are|is) you using|what can you learn from this (?:file|csv|source)|does this source tell)\b/.test(
      query,
    )
  ) {
    return "source-semantics";
  }
  if (/\bwhat data (?:is|are) this using\b/.test(query) || /\bwhat data (?:is|are) you using\b/.test(query) || /\bwhat data supports\b/.test(query) || /\bwhere did .+(come from|from)\b/.test(query)) {
    return "object-provenance";
  }
  if (
    /\b(?:what|which) csv\b/.test(query) &&
    /\b(?:using|used by|supports?)\b/.test(query) &&
    !/\b(?:how many|list|data library|file names)\b/.test(query)
  ) {
    return "object-provenance";
  }
  if (/\bdo we already have (?:that |this |the )?data\b/.test(query)) return "existing-data-bridge";
  if (/^(?:can you|could you|are you able to)\b/.test(query) && /\bcsv\b/.test(query) && /\b(?:read|use|import|open)\b/.test(query)) {
    return "capability-csv";
  }
  if (/\bwhich files?\b/.test(query) && /\b(?:waiting|pending|under review|review)\b/.test(query)) return "pending-inventory";
  if (/\bdo you still (?:have|use)\b/.test(query) && /\.csv\b/.test(query)) return "historical-status";
  if (/\bexplain all csv\b/.test(query) || /\bexplain (?:the )?(?:csv files|files you have)\b/.test(query) || /\btell me about (?:all )?(?:the )?csv\b/.test(query)) {
    return "explain-all-csv";
  }
  if (/\b(?:do you have|have you got) any (?:file like )?csv\b/.test(query) || /\bany (?:file like )?csv\b/.test(query) || /\bfile like csv\b/.test(query) || /\bdo you have (?:any )?csv files?\b/.test(query) || /\bwhat csv files\b/.test(query)) {
    return "csv-availability";
  }
  if (/^(?:explain|what is|what's|whats) (?:a )?data source\b/.test(query) && !/\b(?:sources|my|our)\b/.test(query)) {
    return "concept-data-source";
  }
  if (/^(?:explain|what is|what's|whats) data\b/.test(query) && !/\b(?:source|sources|csv|files?|library|using|for)\b/.test(query)) {
    return "concept-data";
  }
  if (/\bwhat data does nexora have\b/.test(query) || /\bwhat data (?:do (?:you|we) have|have (?:you|we) got)\b/.test(query) && !/\bfor\b/.test(query) && !/\busing\b/.test(query)) {
    return "inventory";
  }
  if (/\b(?:what (?:data |files |sources )?(?:do (?:you|we) have|have (?:you|we) got)|which files|what sources|my data sources|our data sources|explain (?:my |our |the )?data sources)\b/.test(query) && !/\bfor\b/.test(query) && !/\busing\b/.test(query)) {
    return /\bdata sources?\b/.test(query) && !/\bcsv\b/.test(query) ? "source-inventory" : "inventory";
  }
  if (/\bwhat data can help\b/.test(query) || /\bdo we have data to investigate\b/.test(query) || (/\binvestigate\b/.test(query) && /\b(?:csv|data source|data library|accepted data|what data)\b/.test(query))) {
    return "investigation-availability";
  }
  if (/\b(?:which columns|which fields|columns you understand|fields you understand|unclear business meaning|unclear meaning)\b/.test(query)) {
    return "field-coverage";
  }
  if (/\b(?:kpi|kpis|calculate)\b/.test(query) && !/\bhow many\b/.test(query)) return "analytical-capability";
  if (/\b(?:provide evidence|evidence related|evidence for|help (?:us )?understand|tell (?:us |me )?about)\b/.test(query) && !/\bwhat csv is\b/.test(query)) {
    return "evidence-relevance";
  }
  if (/\b(?:conclude|cannot conclude|can you not conclude|still (?:learn|tell) (?:me )?(?:from|about)|still missing|information is still missing)\b/.test(query)) {
    return "bounded-interpretation";
  }
  if (/\b(?:values?|range|rows?|average|minimum|maximum|how many rows)\b/.test(query) && !/\bhow many csv\b/.test(query)) {
    return "field-values";
  }
  if (/[a-z0-9._-]+\.csv/.test(query) && !isDataLibraryInventoryRequest(query)) return "specific-source";
  if (isDataLibraryInventoryRequest(query)) return "inventory";
  return null;
}

export function isAdvisorDataConversationUtterance(utterance: string): boolean {
  return classifyAdvisorDataConversation(utterance) != null
    || /\b(?:csv|data library|data source|uploaded file|imported file)\b/.test(prepared(utterance));
}

function findSourcesByLabel(context: AdvisorDataContext, query: string): readonly AdvisorDataSource[] {
  const compact = compactDataToken(query);
  return context.sources.filter((source) => {
    if (source.sourceType !== "csv") return false;
    const label = compactDataToken(source.label);
    return label === compact || compact.includes(label) || label.includes(compact) || query.includes(source.label.toLowerCase());
  });
}

function fieldMatches(field: AdvisorDataField, query: string): boolean {
  const compactQuery = compactDataToken(query);
  const compactColumn = compactDataToken(field.column);
  if (compactColumn.length < 2) return false;
  const queryTerms = query.split(/\s+/).map(compactDataToken).filter(Boolean);
  if (queryTerms.includes(compactColumn) || compactColumn === compactQuery) return true;
  const spaced = field.column.replace(/[_-]+/g, " ").toLowerCase();
  if (query.includes(spaced) && spaced.length > 2) return true;
  const meaning = compactDataToken(field.confirmedMeaning ?? "");
  if (meaning.length > 4 && compactQuery.includes(meaning)) return true;
  return false;
}

function findFields(context: AdvisorDataContext, query: string, dialogue: AdvisorDataDialogue): readonly AdvisorDataField[] {
  const all = csvSources(context).flatMap((source) => source.fields);
  const named = all.filter((field) => fieldMatches(field, query));
  if (named.length > 0) return named;
  if (/\b(?:it|that|this field|this)\b/.test(query) && dialogue.fieldColumn) {
    return all.filter((field) => field.column === dialogue.fieldColumn && (!dialogue.sourceContextId || field.sourceContextId === dialogue.sourceContextId));
  }
  return [];
}

function sourceById(context: AdvisorDataContext, sourceContextId: string | null): AdvisorDataSource | null {
  return context.sources.find((entry) => entry.sourceContextId === sourceContextId) ?? null;
}

function describeField(field: AdvisorDataField, source: AdvisorDataSource): string {
  const pendingNote = source.lifecycle === "pending" ? " This source is still under review and is not accepted evidence yet." : "";
  if (field.confidence === "confirmed" || field.confidence === "authoritative") {
    const how = field.confidence === "authoritative" ? "from the existing mapping" : "confirmed for this source";
    return `${field.column} means ${field.confirmedMeaning} in ${source.label}. That meaning is ${how}.${pendingNote}`;
  }
  if (field.confidence === "likely" && field.proposedMeaning) {
    return `${field.column} is a field in ${source.label}. Nexora thinks it may mean ${field.proposedMeaning}, but that meaning has not been confirmed yet.${pendingNote} Does ${field.column} mean ${field.proposedMeaning}?`;
  }
  if (field.confidence === "ambiguous") {
    const meanings = field.semanticResolution.candidates.map((candidate) => candidate.meaning);
    return `${field.column} is a field in ${source.label}. It could refer to ${meanings.join(" or ")}, but neither meaning is confirmed.${pendingNote} Which meaning is correct for this source?`;
  }
  return `${field.column} is a field in ${source.label}, but I don't have enough information to suggest its business meaning.${pendingNote} What does it represent?`;
}

function clarificationFor(field: AdvisorDataField, source: AdvisorDataSource, workspaceId: WorkspaceId): CsvSemanticClarification | null {
  if (source.lifecycle !== "pending" || !field.fieldId) return null;
  if (field.confidence === "confirmed" || field.confidence === "authoritative") return null;
  return Object.freeze({
    fieldId: field.fieldId,
    sourceColumn: field.column,
    sourceContextId: source.sourceContextId,
    workspaceId,
    question: field.proposedMeaning
      ? `Does ${field.column} represent ${field.proposedMeaning.toLowerCase()}?`
      : `What does ${field.column} represent?`,
    proposedMeaning: field.proposedMeaning,
  });
}

function listLibrary(context: AdvisorDataContext, csvOnly = false): string {
  const csv = csvSources(context);
  const connected = context.sources.filter((entry) => entry.lifecycle === "connected");
  const ready = csv.filter((entry) => entry.lifecycle === "committed");
  const pending = csv.filter((entry) => entry.lifecycle === "pending");
  if (csv.length === 0 && (csvOnly || connected.length === 0)) {
    return csvOnly
      ? "No CSV files are currently available in the Data Library."
      : "I don't see any data sources in this workspace yet.";
  }
  const csvPart = csv.length
    ? `You currently have ${csv.length} CSV source${csv.length === 1 ? "" : "s"}${connected.length && !csvOnly ? ` and ${connected.length} connected source${connected.length === 1 ? "" : "s"}` : ""}: ${joinNames(csv.map((entry) => entry.label))}.`
    : `You have ${connected.length} connected source${connected.length === 1 ? "" : "s"}.`;
  const readyNames = ready.map((entry) => entry.label);
  const pendingNames = pending.map((entry) => entry.label);
  const readyLine = ready.length ? ` ${joinNames(readyNames)} ${ready.length === 1 ? "is" : "are"} currently in use.` : "";
  const pendingLine = pending.length ? ` ${joinNames(pendingNames)} ${pending.length === 1 ? "is" : "are"} still being reviewed.` : "";
  return `${csvPart}${readyLine}${pendingLine}`;
}

function csvAvailability(context: AdvisorDataContext): string {
  const csv = csvSources(context);
  if (csv.length === 0) return "No CSV sources are currently available.";
  return `Yes. I currently have ${csv.length} CSV source${csv.length === 1 ? "" : "s"}: ${joinNames(csv.map((entry) => entry.label))}.`;
}

function explainAllCsv(context: AdvisorDataContext): string {
  const csv = csvSources(context);
  if (csv.length === 0) return "No CSV files are currently available in the Data Library.";
  return `You have ${csv.length} CSV source${csv.length === 1 ? "" : "s"}. ${csv.map((source) => describeSourceContents(source)).join(" ")}`;
}

function dataConcept(context: AdvisorDataContext): string {
  const csv = csvSources(context);
  const base = "Data is where Nexora keeps the sources it can use as evidence, such as CSV imports and their confirmed meanings.";
  if (csv.length === 0) return base;
  return `${base} You currently have ${csv.length} source${csv.length === 1 ? "" : "s"} available.`;
}

function dataSourceConcept(): string {
  return "A Data Source is where Nexora receives business information, such as an imported CSV. Nexora keeps the source separate from the business objects and tracks what its fields mean before using them as evidence.";
}

function csvCapability(): string {
  return "Nexora can import CSV files into the Data Library and use confirmed field meanings as evidence. That is a product capability; it does not mean a CSV file is currently present.";
}

function pendingInventory(context: AdvisorDataContext): string {
  const pending = csvSources(context).filter((entry) => entry.lifecycle === "pending");
  if (pending.length === 0) return "No CSV sources are currently waiting for review.";
  return `${joinNames(pending.map((entry) => entry.label))} ${pending.length === 1 ? "is" : "are"} waiting for review and ${pending.length === 1 ? "is" : "are"} not accepted evidence yet.`;
}

function ordinalIndex(query: string): number | null {
  if (/\b(?:the )?first (?:one|file|source)\b/.test(query)) return 0;
  if (/\b(?:the )?second (?:one|file|source)\b/.test(query)) return 1;
  if (/\b(?:the )?third (?:one|file|source)\b/.test(query)) return 2;
  if (/\b(?:the )?last (?:one|file|source)\b/.test(query)) return -1;
  return null;
}

function diagnosticsFor(
  kind: AdvisorDataConversationKind | null,
  context: AdvisorDataContext,
  sources: readonly AdvisorDataSource[],
): AdvisorDataInquiryDiagnostics {
  const csv = csvSources(context);
  const historical = historicalSources(context);
  return Object.freeze({
    dataConversationIntent: kind,
    dataLibraryQueryDetected: kind === "inventory" || kind === "csv-availability" || kind === "explain-all-csv" || kind === "source-inventory" || kind === "pending-inventory",
    dataConceptQueryDetected: kind === "concept-data",
    dataSourceQueryDetected: kind === "concept-data-source" || kind === "source-inventory",
    specificSourceReference: sources[0]?.label ?? null,
    dataLibrarySourceCount: csv.length,
    activeSourceCount: csv.filter((entry) => entry.lifecycle === "committed").length,
    pendingSourceCount: csv.filter((entry) => entry.lifecycle === "pending").length,
    historicalSourceCount: historical.length,
    resolvedSourceIds: Object.freeze(sources.map((entry) => entry.sourceContextId)),
    resolvedSourceNames: Object.freeze(sources.map((entry) => entry.label)),
    sourceStatus: Object.freeze(sources.map((entry) => entry.lifecycle)),
    semanticTrustSummary: sources.flatMap((entry) => entry.fields.map((field) => `${field.column}:${field.confidence}`)).slice(0, 12).join(",") || "none",
    dataAdvProjectionConsumed: true as const,
    dataRealityConsumed: sources.some((entry) => entry.acceptedEvidence),
    provenanceConsumed: kind === "object-provenance" || kind === "source-relationships" || kind === "investigation-availability" || kind === "existing-data-bridge",
    advisorDataRoute: "DATA-ADV:1/AdvisorDataInquiry" as const,
    genericEntityFallbackUsed: false as const,
    outcomeClarificationUsed: false as const,
    stageFallbackUsed: false as const,
    productFallbackUsed: false as const,
  });
}

function answer(
  text: string,
  dialogue: AdvisorDataDialogue,
  kind: AdvisorDataConversationKind | null,
  context: AdvisorDataContext,
  sources: readonly AdvisorDataSource[] = [],
  clarification: CsvSemanticClarification | null = null,
): AdvisorDataInquiryAnswer {
  return Object.freeze({
    text,
    dialogue,
    clarification,
    mutatesStage: false as const,
    mutatesDataReality: false as const,
    diagnostics: diagnosticsFor(kind, context, sources),
  });
}

function managerFaceConfidence(field: AdvisorDataField): string {
  if (field.confidence === "confirmed" || field.confidence === "authoritative") return "confirmed";
  if (field.confidence === "likely") return "understood but unconfirmed";
  if (field.confidence === "ambiguous") return "ambiguous";
  return "unknown";
}

function pendingSourceClause(source: AdvisorDataSource): string {
  return source.lifecycle === "pending"
    ? ` ${source.label} is pending review, so I can inspect it but I cannot treat it as accepted business evidence.`
    : "";
}

function fieldCoverageAnswer(source: AdvisorDataSource): string {
  const usable = source.fields.filter((field) => field.confidence === "confirmed" || field.confidence === "authoritative");
  const unclear = source.fields.filter((field) => field.confidence === "likely" || field.confidence === "ambiguous" || field.confidence === "unresolved");
  const usableText = usable.length
    ? `Confirmed or usable: ${usable.map((field) => `${field.column} (${field.confirmedMeaning})`).join("; ")}.`
    : "No columns currently have a confirmed business meaning.";
  const unclearText = unclear.length
    ? ` Unclear: ${unclear.map((field) => {
      if (field.confidence === "ambiguous") {
        const meanings = field.semanticResolution.candidates.map((candidate) => candidate.meaning).join(" or ");
        return `${field.column} — candidate meanings exist (${meanings}) but are not confirmed`;
      }
      if (field.confidence === "likely") return `${field.column} — understood but unconfirmed (${field.proposedMeaning})`;
      return `${field.column} — unknown meaning`;
    }).join("; ")}.`
    : "";
  return `In ${source.label}: ${usableText}${unclearText}${pendingSourceClause(source)}`;
}

function valuesAnswer(source: AdvisorDataSource, field: AdvisorDataField | null, wantsRows: boolean): string {
  if (wantsRows && !field) {
    return `${source.label} currently has ${source.recordCount} data row${source.recordCount === 1 ? "" : "s"}.${pendingSourceClause(source)}`;
  }
  if (!field) {
    return `I can inspect ${source.label}, but I need a field name to report values.`;
  }
  const observed = field.observation;
  const numeric = observed.numeric && observed.minimum != null && observed.maximum != null
    ? ` Numeric values range from ${observed.minimum} to ${observed.maximum}.`
    : observed.nonNullCount
      ? ` It has ${observed.nonNullCount} non-empty values (${observed.uniqueCount} unique).`
      : " I don't see stored values for that column.";
  const meaning = field.confidence === "confirmed" || field.confidence === "authoritative"
    ? ` ${field.column} means ${field.confirmedMeaning}.`
    : ` That is a structural observation only; ${field.column} does not have a confirmed business meaning, so I will not interpret the numbers as a KPI.`;
  return `${field.column} in ${source.label}:${numeric}${meaning}${pendingSourceClause(source)}`;
}

function kpiAnswer(source: AdvisorDataSource): string {
  const confirmed = source.fields.filter((field) => field.confidence === "confirmed" || field.confidence === "authoritative");
  const possible = source.fields.filter((field) => field.confidence === "ambiguous" || field.confidence === "likely");
  const unknown = source.fields.filter((field) => field.confidence === "unresolved");
  const supported = confirmed.filter((field) => field.observation.numeric);
  const supportedLine = supported.length
    ? `From confirmed fields I can calculate deterministic numeric summaries such as ${supported.map((field) => `${field.column} (${field.confirmedMeaning}) min/max/average`).join("; ")}. Those summaries are mathematical, and they are business-valid only for the confirmed meanings.`
    : "I cannot calculate a business-valid KPI from confirmed field meanings yet.";
  const possibleLine = possible.length
    ? ` ${possible.map((field) => {
      const meanings = field.semanticResolution.candidates.map((candidate) => candidate.meaning).join(" or ") || field.proposedMeaning || "an unconfirmed meaning";
      return `${field.column} could support a related metric if ${meanings} is confirmed`;
    }).join("; ")}.`
    : "";
  const unknownLine = unknown.length
    ? ` I cannot use ${unknown.map((field) => field.column).join(", ")} as a business KPI because ${unknown.length === 1 ? "its" : "their"} meaning is unknown. A numeric average of an unknown field would be mathematically possible but not a valid KPI.`
    : "";
  return `${supportedLine}${possibleLine}${unknownLine}${pendingSourceClause(source)}`;
}

function evidenceObjectLabel(query: string, focused: string | null): string {
  const named = query.match(/\b(?:related to|evidence for|evidence related to|about|understand|support)\s+(.+?)$/)?.[1]
    ?.replace(/[?]+$/g, "")
    .replace(/\b(?:this risk|this problem)\b/g, "")
    .trim();
  if (named) return named;
  return focused ?? "this object";
}

function evidenceAnswer(source: AdvisorDataSource, objectLabel: string): string {
  const compactObject = compactDataToken(objectLabel);
  const related = source.relatedObjectLabels.some((label) => compactDataToken(label).includes(compactObject) || compactObject.includes(compactDataToken(label)));
  const semanticHits = source.fields.filter((field) => {
    const blob = compactDataToken(`${field.confirmedMeaning ?? ""} ${field.proposedMeaning ?? ""} ${field.semanticResolution.candidates.map((candidate) => candidate.meaning).join(" ")}`);
    return compactObject.length > 3 && blob.includes(compactObject.slice(0, Math.min(8, compactObject.length)));
  });
  if (source.acceptedEvidence && related) {
    return `${source.label} currently supports ${source.relatedObjectLabels.join(", ")} as accepted evidence. That is a data relationship, not a claim that the file caused ${objectLabel}.`;
  }
  if (semanticHits.length && !source.acceptedEvidence) {
    const details = semanticHits.map((field) => {
      if (field.confidence === "ambiguous") {
        return `${field.column} has possible ${field.semanticResolution.candidates.map((candidate) => candidate.meaning).join(" or ")} meanings that are not confirmed`;
      }
      return `${field.column} is ${managerFaceConfidence(field)}`;
    }).join("; ");
    return `${source.label} may be relevant to ${objectLabel} because ${details}. The source is still pending review, so I cannot treat it as evidence for ${objectLabel} yet. Field-name similarity is not a confirmed relationship, and association is not causality.`;
  }
  if (related && source.lifecycle === "pending") {
    return `${source.label} may later relate to ${source.relatedObjectLabels.join(", ")}, but that is not confirmed. The source is still pending, so I cannot treat it as evidence for ${objectLabel} yet.`;
  }
  return `I do not have a confirmed evidence relationship from ${source.label} to ${objectLabel}. I will not infer one from the filename.${pendingSourceClause(source)}`;
}

function conclusionAnswer(source: AdvisorDataSource): string {
  const coverage = fieldCoverageAnswer(source);
  const can = `I can inspect ${source.label}, report its ${source.recordCount} row${source.recordCount === 1 ? "" : "s"}, and distinguish fields whose meanings are known from those still unresolved.`;
  const cannot = `I cannot yet treat unresolved fields as business meaning, treat this pending source as accepted evidence, invent KPIs, assert an object relationship from filename similarity, or draw a causal conclusion.`;
  return `${can} ${coverage} ${cannot}`;
}

function resolveActiveCsv(
  context: AdvisorDataContext,
  query: string,
  dialogue: AdvisorDataDialogue,
): AdvisorDataSource | null {
  const named = query.match(/([a-z0-9._-]+\.csv)/i)?.[1];
  if (named) {
    const found = findSourcesByLabel(context, named);
    if (found.length === 1) return found[0] ?? null;
  }
  const csv = csvSources(context);
  if (dialogue.sourceContextId) {
    const current = sourceById(context, dialogue.sourceContextId);
    if (current && current.lifecycle !== "historical") return current;
  }
  if (csv.length === 1) return csv[0] ?? null;
  return null;
}

function describeSourceContents(source: AdvisorDataSource): string {
  const confirmed = source.fields.filter((field) => field.confidence === "confirmed" || field.confidence === "authoritative");
  const unresolved = source.fields.filter((field) => field.confidence === "likely" || field.confidence === "ambiguous" || field.confidence === "unresolved");
  const confirmedText = confirmed.length
    ? `Confirmed fields include ${confirmed.map((field) => `${field.column} (${field.confirmedMeaning})`).join(", ")}.`
    : "No business meanings are confirmed yet.";
  const unresolvedText = unresolved.length
    ? ` Still unresolved: ${unresolved.map((field) => field.column).join(", ")}.`
    : "";
  const status = source.lifecycle === "pending"
    ? ` ${source.label} is under review and is not accepted into Data Reality yet.`
    : ` ${source.label} is ready.`;
  const related = source.relatedObjectLabels.length
    ? source.relatedUncertainty
      ? ` Nexora thinks ${source.relatedObjectLabels.join(", ")} may later be relevant, but has not connected them yet.`
      : ` It currently supports ${source.relatedObjectLabels.join(", ")}.`
    : "";
  return `${source.description} ${confirmedText}${unresolvedText}${status}${related}`;
}

function sourcesForTopic(context: AdvisorDataContext, topic: string): readonly AdvisorDataSource[] {
  const compact = compactDataToken(topic);
  if (!compact) return Object.freeze([]);
  return csvSources(context).filter((source) => {
    const relatedHit = source.relatedObjectLabels.some((label) => compactDataToken(label).includes(compact) || compact.includes(compactDataToken(label)));
    const fieldHit = source.fields.some((field) => {
      const meaning = compactDataToken(`${field.confirmedMeaning ?? ""} ${field.proposedMeaning ?? ""} ${field.column}`);
      return meaning.includes(compact) || compact.includes(compactDataToken(field.column));
    });
    const descriptionHit = compactDataToken(source.description).includes(compact) || compactDataToken(source.label).includes(compact);
    return relatedHit || fieldHit || descriptionHit;
  });
}

function investigateAnswer(context: AdvisorDataContext, topic: string): string {
  const relevant = sourcesForTopic(context, topic);
  const accepted = relevant.filter((source) => source.acceptedEvidence);
  const pending = relevant.filter((source) => source.lifecycle === "pending");
  const others = csvSources(context).filter((source) => source.acceptedEvidence && !accepted.includes(source));
  if (accepted.length === 0 && pending.length === 0 && others.length === 0) {
    return `I don't see accepted data that clearly supports investigating ${topic} yet.`;
  }
  const acceptedLine = accepted.length
    ? `We have accepted data in ${accepted.map((source) => `${source.label}${source.relatedObjectLabels.length ? ` (${source.relatedObjectLabels.join(", ")})` : ""}`).join("; ")}.`
    : others.length
      ? `We have accepted data in ${others.map((source) => `${source.label}${source.relatedObjectLabels.length ? ` (${source.relatedObjectLabels.join(", ")})` : ""}`).join("; ")}.`
      : "";
  const pendingLine = pending.length
    ? ` ${pending.map((source) => source.label).join(", ")} ${pending.length === 1 ? "is" : "are"} still under review and should not be treated as accepted evidence.`
    : "";
  const compare = accepted.length && others.length
    ? ` ${others.map((source) => source.label).join(", ")} may be relevant to compare, depending on the question.`
    : "";
  return `${acceptedLine}${pendingLine}${compare} I would start with the accepted evidence, then examine related sources. That is an investigation order, not a claim that one source caused the problem.`.trim();
}

function objectDataAnswer(context: AdvisorDataContext, objectLabel: string): string {
  const matches = csvSources(context).filter((source) =>
    source.relatedObjectLabels.some((label) => compactDataToken(label) === compactDataToken(objectLabel) || compactDataToken(label).includes(compactDataToken(objectLabel))),
  );
  const accepted = matches.filter((source) => source.acceptedEvidence);
  const pending = matches.filter((source) => source.lifecycle === "pending");
  if (accepted.length === 0 && pending.length === 0) {
    return `I don't see an accepted source currently supporting ${objectLabel}.`;
  }
  const acceptedText = accepted.length
    ? `${accepted.map((source) => source.label).join(", ")} ${accepted.length === 1 ? "provides" : "provide"} accepted ${objectLabel} data.`
    : `I don't see an accepted source currently supporting ${objectLabel}.`;
  const pendingText = pending.length
    ? ` ${pending.map((source) => source.label).join(", ")} ${pending.length === 1 ? "is" : "are"} under review and may become relevant, but ${pending.length === 1 ? "is" : "are"} not accepted evidence yet.`
    : "";
  return `${acceptedText}${pendingText}`;
}

function missingDataAnswer(context: AdvisorDataContext, utterance: string): string {
  const asked = utterance.match(/\b(?:supplier|vendor|weather|quality|schedule|milestone|resource)s?\b/i)?.[0];
  const topic = asked ?? "that";
  const hit = sourcesForTopic(context, topic);
  if (hit.some((source) => source.acceptedEvidence)) {
    return `${hit.filter((source) => source.acceptedEvidence).map((source) => source.label).join(", ")} already provides accepted ${topic} evidence.`;
  }
  const have = csvSources(context).filter((source) => source.acceptedEvidence).map((source) => source.label);
  const haveText = have.length ? `We have ${have.join(", ")}` : "I don't see accepted CSV evidence yet";
  return `${haveText}, but I don't see an accepted ${topic} data source. We would need ${topic} evidence before assessing that hypothesis confidently.`;
}

export function answerAdvisorDataInquiry(input: Readonly<{
  workspaceId: WorkspaceId;
  utterance: string;
  dialogue?: AdvisorDataDialogue;
  focusedObjectLabel?: string | null;
  context?: AdvisorDataContext;
  conversationContinuity?: ConversationContinuitySnapshot | null;
}>): AdvisorDataInquiryAnswer | null {
  const context = input.context ?? projectAdvisorDataContext(input.workspaceId);
  const listed = input.dialogue?.listedSourceContextIds ?? emptyAdvisorDataDialogue.listedSourceContextIds;
  const dialogue: AdvisorDataDialogue = Object.freeze({
    sourceContextId: input.dialogue?.sourceContextId ?? null,
    fieldColumn: input.dialogue?.fieldColumn ?? null,
    listedSourceContextIds: listed,
  });
  const query = prepared(input.utterance);
  if (!query) return null;
  const kind = classifyAdvisorDataConversation(input.utterance);
  const listedCsv = csvSources(context);
  const activeCsv = resolveActiveCsv(context, query, dialogue);
  const bind = (source: AdvisorDataSource, fieldColumn: string | null = dialogue.fieldColumn): AdvisorDataDialogue => Object.freeze({
    sourceContextId: source.sourceContextId,
    fieldColumn,
    listedSourceContextIds: dialogue.listedSourceContextIds,
  });

  if (kind === "object-provenance") {
    const named = query.match(/\b(?:what|which) csv is (.+?) using\b/)?.[1]?.trim();
    const objectLabel = named || input.focusedObjectLabel || "this";
    return answer(objectDataAnswer(context, objectLabel), dialogue, kind, context, csvSources(context).filter((source) =>
      source.relatedObjectLabels.some((label) => compactDataToken(label) === compactDataToken(objectLabel)),
    ));
  }
  if (kind === "existing-data-bridge") {
    const topic = input.focusedObjectLabel ?? "this";
    return answer(investigateAnswer(context, topic), dialogue, kind, context, sourcesForTopic(context, topic));
  }
  if (kind === "capability-csv") {
    return answer(csvCapability(), dialogue, kind, context);
  }
  if (kind === "concept-data-source") {
    return answer(dataSourceConcept(), dialogue, kind, context);
  }
  if (kind === "concept-data") {
    return answer(dataConcept(context), dialogue, kind, context, listedCsv);
  }
  if (kind === "csv-availability") {
    return answer(csvAvailability(context), listingDialogue(dialogue, listedCsv), kind, context, listedCsv);
  }
  if (kind === "explain-all-csv") {
    return answer(explainAllCsv(context), listingDialogue(dialogue, listedCsv), kind, context, listedCsv);
  }
  if (kind === "pending-inventory") {
    const pending = listedCsv.filter((entry) => entry.lifecycle === "pending");
    return answer(pendingInventory(context), listingDialogue(dialogue, pending), kind, context, pending);
  }
  if (kind === "source-semantics" || kind === "source-contents") {
    if (!activeCsv) {
      return listedCsv.length > 1
        ? answer("Which CSV source should I inspect?", dialogue, kind, context, listedCsv)
        : null;
    }
    return answer(describeSourceContents(activeCsv), bind(activeCsv), kind, context, [activeCsv]);
  }
  if (kind === "field-coverage" || kind === "analytical-capability" || kind === "evidence-relevance" || kind === "bounded-interpretation" || kind === "field-values") {
    if (!activeCsv) {
      return listedCsv.length > 1
        ? answer("Which CSV source should I inspect?", dialogue, kind, context, listedCsv)
        : null;
    }
    if (kind === "field-coverage") {
      return answer(fieldCoverageAnswer(activeCsv), bind(activeCsv), kind, context, [activeCsv]);
    }
    if (kind === "analytical-capability") {
      return answer(kpiAnswer(activeCsv), bind(activeCsv), kind, context, [activeCsv]);
    }
    if (kind === "evidence-relevance") {
      return answer(evidenceAnswer(activeCsv, evidenceObjectLabel(query, input.focusedObjectLabel ?? null)), bind(activeCsv), kind, context, [activeCsv]);
    }
    if (kind === "bounded-interpretation") {
      return answer(conclusionAnswer(activeCsv), bind(activeCsv), kind, context, [activeCsv]);
    }
    const namedField = findFields(context, query, bind(activeCsv))[0] ?? null;
    const wantsRows = /\brows?\b/.test(query) && !namedField;
    return answer(valuesAnswer(activeCsv, namedField, wantsRows), bind(activeCsv, namedField?.column ?? null), kind, context, [activeCsv]);
  }
  if (kind === "inventory" || kind === "source-inventory") {
    const text = kind === "inventory" && isDataLibraryInventoryRequest(query)
      ? inventoryCensus(context, query)
      : listLibrary(context, kind === "inventory");
    return answer(text, listingDialogue(dialogue, listedCsv), kind, context, listedCsv);
  }

  if (/\bexplain\b/.test(query) && /\bpending (?:one|file|source)\b/.test(query)) {
    const pending = listedCsv.filter((entry) => entry.lifecycle === "pending");
    if (pending.length === 1 && pending[0]) {
      return answer(describeSourceContents(pending[0]), Object.freeze({
        sourceContextId: pending[0].sourceContextId,
        fieldColumn: dialogue.fieldColumn,
        listedSourceContextIds: dialogue.listedSourceContextIds,
      }), "specific-source", context, pending);
    }
  }

  const ordinal = ordinalIndex(query);
  const listedIds = dialogue.listedSourceContextIds ?? [];
  if (ordinal != null && /\bexplain\b/.test(query) && listedIds.length > 0) {
    const id = ordinal < 0 ? listedIds[listedIds.length - 1] : listedIds[ordinal];
    const source = id ? sourceById(context, id) : null;
    if (source) {
      return answer(describeSourceContents(source), Object.freeze({
        sourceContextId: source.sourceContextId,
        fieldColumn: dialogue.fieldColumn,
        listedSourceContextIds: dialogue.listedSourceContextIds,
      }), "specific-source", context, [source]);
    }
  }

  const listAsk = /\b(?:what (?:data |files |sources )?(?:do (?:you|we) have|have (?:you|we) got)|which files|what sources)\b/.test(query)
    || /^what data do we have$/.test(query);
  if (listAsk && !/\bfor\b/.test(query) && !/\busing\b/.test(query)) {
    return answer(listLibrary(context), listingDialogue(dialogue, listedCsv), "inventory", context, listedCsv);
  }

  if (/\b(?:what (?:data )?are we missing|what(?:'s| is) missing|do we have (\w+) data)\b/.test(query) || /\bdo we have\b/.test(query) && /\bdata\b/.test(query)) {
    if (/\bsupplier|vendor|weather\b/.test(query) || /\bmissing\b/.test(query)) {
      return Object.freeze({
        text: missingDataAnswer(context, query),
        dialogue,
        clarification: null,
        mutatesStage: false,
        mutatesDataReality: false,
      });
    }
  }

  const namedFile = query.match(/([a-z0-9._-]+\.csv)/i)?.[1]
    ?? (/\b(?:that file|this (?:csv|file|source)|the file we were discussing|this source)\b/.test(query) ? sourceById(context, dialogue.sourceContextId)?.label ?? activeCsv?.label ?? null : null);
  const fileSources = namedFile ? findSourcesByLabel(context, namedFile.replace(/ file$/, "")) : [];
  const uniqueFile = fileSources.length === 1 ? fileSources[0] : dialogue.sourceContextId && /\b(?:that file|this (?:csv|file|source)|the file)\b/.test(query)
    ? sourceById(context, dialogue.sourceContextId)
    : activeCsv && /\bi mean\b/.test(query)
      ? activeCsv
      : null;

  if (namedFile && fileSources.length === 0) {
    return answer(`I don't currently have a source named ${namedFile}.`, dialogue, "specific-source", context);
  }
  if (namedFile && fileSources.length > 1) {
    return answer(`${namedFile} matches more than one source. Which source do you mean?`, dialogue, "specific-source", context, fileSources);
  }
  if (uniqueFile && (kind === "specific-source" || /\bi mean\b/.test(query)) && !/\b(?:what does|which columns|kpi|evidence|conclude|contain|explain|values?|range|rows?|objects?|related|use)\b/.test(query)) {
    return answer(`I'll use ${uniqueFile.label}.${pendingSourceClause(uniqueFile)}`, bind(uniqueFile), "specific-source", context, [uniqueFile]);
  }
  if (uniqueFile && (kind === "historical-status" || /\bdo you still (?:have|use)\b/.test(query) || /\bdo you have\b/.test(query) && /\.csv\b/.test(query))) {
    if (uniqueFile.lifecycle === "historical") {
      return answer(`${uniqueFile.label} is no longer active. It was removed and is not currently used as accepted evidence.`, {
        sourceContextId: uniqueFile.sourceContextId,
        fieldColumn: dialogue.fieldColumn,
        listedSourceContextIds: dialogue.listedSourceContextIds,
      }, "historical-status", context, [uniqueFile]);
    }
    if (uniqueFile.lifecycle === "pending") {
      return answer(`Yes. ${uniqueFile.label} is in the Data Library, but it is still pending review and is not being used as accepted evidence yet.`, {
        sourceContextId: uniqueFile.sourceContextId,
        fieldColumn: dialogue.fieldColumn,
        listedSourceContextIds: dialogue.listedSourceContextIds,
      }, "source-status", context, [uniqueFile]);
    }
    return answer(`Yes. ${uniqueFile.label} is currently in use.`, {
      sourceContextId: uniqueFile.sourceContextId,
      fieldColumn: dialogue.fieldColumn,
      listedSourceContextIds: dialogue.listedSourceContextIds,
    }, "source-status", context, [uniqueFile]);
  }

  if (uniqueFile && /\b(?:contain|what's in|what is in|what else|describe|explain|what is |ready|clarif|objects? (?:use|related)|remove)\b/.test(query)) {
    if (/\bready\b/.test(query)) {
      const text = uniqueFile.lifecycle === "committed"
        ? `${uniqueFile.label} is ready.`
        : `${uniqueFile.label} is still under review.`;
      return Object.freeze({ text, dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn }, clarification: null, mutatesStage: false, mutatesDataReality: false });
    }
    if (/\bclarif\b/.test(query)) {
      const unresolved = uniqueFile.fields.filter((field) => field.confidence === "likely" || field.confidence === "ambiguous" || field.confidence === "unresolved");
      const text = unresolved.length
        ? `${uniqueFile.label} still needs clarification for ${unresolved.map((field) => field.column).join(", ")}.`
        : `${uniqueFile.label} has no unresolved field meanings.`;
      return Object.freeze({ text, dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn }, clarification: null, mutatesStage: false, mutatesDataReality: false });
    }
    if (/\bobjects? (?:use|related)|related to\b/.test(query) || /\bwhich objects\b/.test(query)) {
      const text = uniqueFile.lifecycle === "committed"
        ? (uniqueFile.relatedObjectLabels.length
          ? `${uniqueFile.label} currently supports ${uniqueFile.relatedObjectLabels.join(", ")}. That is a data relationship, not a claim that the file caused those conditions.`
          : `${uniqueFile.label} has no established object relationship yet.`)
        : uniqueFile.relatedObjectLabels.length
          ? `${uniqueFile.label} may later relate to ${uniqueFile.relatedObjectLabels.join(", ")}, but that is not confirmed. The source is still pending.`
          : `Related objects for ${uniqueFile.label} are available after validation.`;
      return Object.freeze({ text, dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn }, clarification: null, mutatesStage: false, mutatesDataReality: false });
    }
    if (/\bremove\b/.test(query)) {
      const text = uniqueFile.lifecycle === "committed"
        ? `Removing ${uniqueFile.label} would follow the existing Data source-removal review. I will not remove it from conversation.`
        : `${uniqueFile.label} is still pending. Cancel import in Data if you do not want to keep it.`;
      return Object.freeze({ text, dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn }, clarification: null, mutatesStage: false, mutatesDataReality: false });
    }
    return Object.freeze({
      text: describeSourceContents(uniqueFile),
      dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn },
      clarification: null,
      mutatesStage: false,
      mutatesDataReality: false,
    });
  }

  if (/\bwhat data (?:do we have )?for\b/.test(query) || (/\bwhat data do we have for this\b/.test(query) && input.focusedObjectLabel)) {
    const objectLabel = query.match(/for ([a-z0-9][a-z0-9 _-]*)/)?.[1]?.trim()
      ?? input.focusedObjectLabel
      ?? "this";
    return Object.freeze({
      text: objectDataAnswer(context, objectLabel),
      dialogue,
      clarification: null,
      mutatesStage: false,
      mutatesDataReality: false,
    });
  }

  if (/\bwhat data can help\b/.test(query) || /\bwhich (?:source|data) should\b/.test(query) || (/\binvestigate\b/.test(query) && /\b(?:csv|data source|data library|what data)\b/.test(query))) {
    const topic = query.match(/for ([a-z0-9][a-z0-9 _-]*)/)?.[1]?.replace(/\b(?:our|the|a|an)\b/g, "").trim()
      ?? query.match(/investigate(?: our| the)? ([a-z0-9]+)/)?.[1]
      ?? query.match(/understand (?:the )?([a-z0-9][a-z0-9 _-]*)/)?.[1]?.trim()
      ?? query.match(/([a-z0-9]+) (?:problem|delay|issue)/)?.[1]
      ?? "this situation";
    return Object.freeze({
      text: investigateAnswer(context, topic),
      dialogue,
      clarification: null,
      mutatesStage: false,
      mutatesDataReality: false,
    });
  }

  if (/\bwhich (?:file|source|csv) contains\b/.test(query) || /\bwhich file is it from\b/.test(query) || /\bshow me (?:the )?(?:source|file)\b/.test(query)) {
    const fields = findFields(context, query, dialogue);
    if (fields.length === 0 && dialogue.fieldColumn) {
      const source = sourceById(context, dialogue.sourceContextId);
      if (source) {
        return Object.freeze({
          text: `${dialogue.fieldColumn} is in ${source.label}.`,
          dialogue,
          clarification: null,
          mutatesStage: false,
          mutatesDataReality: false,
        });
      }
    }
    const uniqueSources = [...new Set(fields.map((field) => field.sourceLabel))];
    if (uniqueSources.length === 1) {
      const field = fields[0]!;
      return Object.freeze({
        text: `${field.column} is in ${uniqueSources[0]}.`,
        dialogue: { sourceContextId: field.sourceContextId, fieldColumn: field.column },
        clarification: null,
        mutatesStage: false,
        mutatesDataReality: false,
      });
    }
    if (uniqueSources.length > 1) {
      return Object.freeze({
        text: `${fields[0]!.column} appears in ${uniqueSources.join(" and ")}. Which source do you mean?`,
        dialogue,
        clarification: null,
        mutatesStage: false,
        mutatesDataReality: false,
      });
    }
  }

  const fields = findFields(context, query, dialogue);
  const asksField = fields.length > 0 && (
    /\b(?:what is|what's|mean|explain|why|confirmed|confirmation|related to|this field)\b/.test(query)
    || /^(?:explain it|what is this field|what else is in that file)$/.test(query)
  );
  if (/\bwhat else is in that file\b/.test(query) && dialogue.sourceContextId) {
    const source = sourceById(context, dialogue.sourceContextId);
    if (source) {
      return Object.freeze({
        text: describeSourceContents(source),
        dialogue,
        clarification: null,
        mutatesStage: false,
        mutatesDataReality: false,
      });
    }
  }
  if (asksField || (fields.length > 0 && /\bwhat is\b/.test(query))) {
    const uniqueSources = [...new Map(fields.map((field) => [field.sourceContextId, field])).values()];
    if (uniqueSources.length > 1 && new Set(fields.map((field) => field.column.toLowerCase())).size === 1) {
      const meanings = [...new Set(fields.map((field) => `${field.sourceLabel}: ${field.confirmedMeaning ?? field.proposedMeaning ?? "unconfirmed"}`))];
      return Object.freeze({
        text: `${fields[0]!.column} appears in ${[...new Set(fields.map((field) => field.sourceLabel))].join(" and ")} with different source-scoped meanings (${meanings.join("; ")}). Which source do you mean?`,
        dialogue,
        clarification: null,
        mutatesStage: false,
        mutatesDataReality: false,
      });
    }
    const field = (
      dialogue.sourceContextId
        ? fields.find((entry) => entry.sourceContextId === dialogue.sourceContextId)
        : null
    ) ?? fields[0]!;
    const source = sourceById(context, field.sourceContextId);
    if (!source) return null;
    const text = /\bwhy\b/.test(query) && field.semanticResolution.requiresConfirmation
      ? `${field.semanticResolution.explanation}`
      : describeField(field, source);
    const clarification = !/\bwhy\b/.test(query) && (field.confidence === "likely" || field.confidence === "ambiguous" || field.confidence === "unresolved")
      ? clarificationFor(field, source, input.workspaceId)
      : null;
    return Object.freeze({
      text,
      dialogue: { sourceContextId: source.sourceContextId, fieldColumn: field.column },
      clarification,
      mutatesStage: false,
      mutatesDataReality: false,
    });
  }

  if (isCurrentReferentDeictic(query) && !dialogue.fieldColumn) {
    if (input.conversationContinuity?.parkedThread) return null;
    const listedIds = dialogue.listedSourceContextIds ?? [];
    const introducedId = dialogue.sourceContextId;
    if (listedIds.length > 1 && !dialogue.sourceContextId) {
      const listed = listedCsv.filter((entry) => listedIds.includes(entry.sourceContextId));
      return answer("Which CSV source should I inspect?", dialogue, "source-contents", context, listed);
    }
    const source = sourceById(context, introducedId ?? null);
    if (source) {
      return answer(describeSourceContents(source), Object.freeze({
        sourceContextId: source.sourceContextId,
        fieldColumn: null,
        listedSourceContextIds: dialogue.listedSourceContextIds,
      }), "source-contents", context, [source]);
    }
  }

  return null;
}

export function applyAdvisorDataSemanticClarification(
  workspaceId: WorkspaceId,
  sourceContextId: string,
  fieldId: string,
  utterance: string,
): CsvSemanticClarificationResult {
  const candidate = getCsvImportCandidate(workspaceId, sourceContextId);
  if (!candidate?.mapping) {
    return Object.freeze({
      review: { mappingId: "", mappings: [], readyForValidation: false, recognizedCount: 0, suggestedCount: 0, ignoredCount: 0, unresolvedCount: 0 },
      resolved: false,
      deferred: false,
      acknowledgement: "That clarification is no longer open.",
    });
  }
  const result = applyCsvSemanticClarification(candidate.mapping, fieldId, utterance);
  saveCsvImportCandidate(Object.freeze({ ...candidate, mapping: result.review }));
  return result;
}
