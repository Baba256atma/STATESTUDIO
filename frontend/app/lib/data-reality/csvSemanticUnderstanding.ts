/**
 * DATA-UX:3 compatibility over the authoritative RDI:2 field mapping.
 *
 * This module interprets bounded schema context. It owns no store, business
 * observations, Evidence, or causal truth. Its output is embedded in the
 * existing CsvColumnMapping and committed through the existing RDI store.
 */
import {
  CSV_MAPPING_TARGETS,
  buildCsvMappingReview,
  csvCanonicalSourceContextId,
  csvRealDataVerticalSliceIdentity,
  type CsvColumnMapping,
  type CsvFieldSemanticUnderstanding,
  type CsvMappingReview,
  type CsvMappingTarget,
  type CsvParseResult,
  type CsvStructuralDataType,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";

export type CsvSemanticClarification = Readonly<{
  fieldId: string;
  sourceColumn: string;
  sourceContextId: string;
  workspaceId: CsvVerticalSliceInput["workspaceId"];
  question: string;
  proposedMeaning: string | null;
}>;

export type CsvSemanticClarificationResult = Readonly<{
  review: CsvMappingReview;
  resolved: boolean;
  deferred: boolean;
  acknowledgement: string;
}>;

const GENERIC_UNKNOWN = new Set(["value", "status", "index", "id", "name", "description", "note", "notes", "comment"]);
const NATURAL_SHORT_WORDS = new Set(["on", "of", "to", "by", "per"]);
const SAFE_ABBREVIATIONS: Readonly<Record<string, string>> = Object.freeze({
  av: "available",
  avg: "average",
  cap: "capacity",
  dt: "date",
  hrs: "hours",
  lab: "labor",
  margin: "margin",
  net: "net",
  ord: "order",
  pct: "percent",
  qty: "quantity",
  rev: "revenue",
  scrap: "scrap",
  ship: "shipping",
  util: "utilization",
});

function normalized(value: string): string {
  return value.trim().toLowerCase().replace(/%/g, " percent ").replace(/[^a-z0-9]+/g, " ").trim();
}

function singular(value: string): string {
  if (value.endsWith("ies")) return `${value.slice(0, -3)}y`;
  if (value.endsWith("s") && value.length > 3) return value.slice(0, -1);
  return value;
}

function tokens(value: string): readonly string[] {
  return Object.freeze(normalized(value).split(/\s+/).filter(Boolean).map((token) => singular(token)));
}

function targetTokens(target: CsvMappingTarget): readonly string[] {
  return Object.freeze([...new Set([target.label, ...target.aliases].flatMap(tokens))]);
}

function acronym(target: CsvMappingTarget): string {
  return tokens(target.label).map((token) => token[0]).join("");
}

function title(words: readonly string[]): string {
  return words.map((word) => word === "on" || word === "time" ? word : `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`).join(" ")
    .replace(/^on time delivery$/i, "On-Time Delivery")
    .replace(/^on time deliveries$/i, "On-Time Deliveries");
}

function inferType(parse: CsvParseResult, columnIndex: number): CsvStructuralDataType {
  const values = parse.records.map((record) => record.values[columnIndex]).filter((value) => value != null);
  if (values.length === 0) return "empty";
  const kinds = new Set(values.map((value) => typeof value));
  if (kinds.size > 1) return "mixed";
  if (kinds.has("number")) return "number";
  if (values.every((value) => typeof value === "string" && /^\d{4}-\d{1,2}-\d{1,2}/.test(value))) return "date";
  return "text";
}

function samples(parse: CsvParseResult, columnIndex: number): readonly string[] {
  return Object.freeze([...new Set(parse.records.map((record) => record.values[columnIndex]).filter((value) => value != null).map(String))].slice(0, 3));
}

function sourceContextId(input: CsvVerticalSliceInput): string {
  return csvCanonicalSourceContextId(input.workspaceId, input.fileName, input.sourceContextId);
}

function detectUnit(input: CsvVerticalSliceInput, columnIndex: number, columnName: string): string | null {
  if (/percent|pct|rate|%/i.test(columnName)) return "percent";
  if (/revenue|cost|margin|sales|price|amount/i.test(columnName)) {
    if (/\$|usd/i.test(input.csvText)) return "USD";
  }
  const rows = input.csvText.split(/\r?\n/).slice(1, 9);
  const cells = rows.map((row) => row.split(",")[columnIndex]?.trim() ?? "");
  if (cells.some((cell) => /%$/.test(cell))) return "percent";
  if (cells.some((cell) => /^\$/.test(cell))) return "USD";
  return null;
}

function expandedHeaderWords(columnName: string): Readonly<{ words: readonly string[]; abbreviated: boolean }> {
  const raw = tokens(columnName);
  const compact = normalized(columnName).replace(/ /g, "");
  const acronymTarget = CSV_MAPPING_TARGETS.find((target) => acronym(target) === compact);
  if (acronymTarget) return Object.freeze({ words: tokens(acronymTarget.label), abbreviated: true });
  let abbreviated = false;
  const words = raw.map((word) => {
    const replacement = SAFE_ABBREVIATIONS[word];
    if (replacement) abbreviated = replacement !== word;
    else if (word.length <= 3 && /^[a-z]+$/.test(word) && !NATURAL_SHORT_WORDS.has(word)) abbreviated = true;
    return replacement ?? word;
  });
  return Object.freeze({ words: Object.freeze(words), abbreviated });
}

function candidateFor(columnName: string, fileName: string): Readonly<{ target: CsvMappingTarget | null; score: number; words: readonly string[]; abbreviated: boolean }> {
  const expanded = expandedHeaderWords(columnName);
  const wordSet = new Set(expanded.words.map(singular));
  const context = new Set(tokens(fileName));
  let best: CsvMappingTarget | null = null;
  let bestScore = 0;
  for (const target of CSV_MAPPING_TARGETS) {
    const targetSet = new Set(targetTokens(target));
    const overlap = [...wordSet].filter((word) => targetSet.has(word)).length;
    const objectSupport = target.objectKey && context.has(singular(target.objectKey)) ? 1 : 0;
    const exactAcronym = acronym(target) === normalized(columnName).replace(/ /g, "") ? 3 : 0;
    const score = overlap + objectSupport + exactAcronym;
    if (score > bestScore) {
      best = target;
      bestScore = score;
    }
  }
  return Object.freeze({ target: bestScore >= 2 ? best : null, score: bestScore, ...expanded });
}

function semanticFor(input: {
  source: CsvVerticalSliceInput;
  parse: CsvParseResult;
  mapping: CsvColumnMapping;
  previous: CsvMappingReview | null;
}): CsvColumnMapping {
  const sourceId = sourceContextId(input.source);
  const structuralType = inferType(input.parse, input.mapping.columnIndex);
  const representativeValues = samples(input.parse, input.mapping.columnIndex);
  const detectedUnit = detectUnit(input.source, input.mapping.columnIndex, input.mapping.sourceColumn);
  const prior = input.previous?.mappings.find((entry) =>
    entry.sourceColumn === input.mapping.sourceColumn && entry.semantic?.sourceContextId === sourceId,
  )?.semantic ?? null;
  const fieldId = `${sourceId}:field:${normalized(input.mapping.sourceColumn).replace(/ /g, "-")}`;
  const candidate = candidateFor(input.mapping.sourceColumn, input.source.fileName);
  const generic = GENERIC_UNKNOWN.has(normalized(input.mapping.sourceColumn));
  const selfDescribing = !generic && !candidate.abbreviated && candidate.words.length > 0 && candidate.words.every((word) => word.length > 3);
  const canonical = input.mapping.status === "recognized" || (!candidate.abbreviated && candidate.target && candidate.score >= 2);
  const target = candidate.target ?? (input.mapping.targetId ? CSV_MAPPING_TARGETS.find((entry) => entry.targetId === input.mapping.targetId) ?? null : null);
  const contextualWords = candidate.target?.objectKey && candidate.words.includes("capacity") && candidate.words.includes("available")
    ? Object.freeze(["available", candidate.target.objectKey, "capacity"])
    : candidate.words;
  const proposedMeaning = generic || /\d/.test(normalized(input.mapping.sourceColumn))
    ? null
    : target && canonical
      ? target.label
      : title(contextualWords);
  const effectiveUnit = detectedUnit ?? (canonical ? target?.unit ?? null : null);

  let schemaCompatibility: CsvFieldSemanticUnderstanding["schemaCompatibility"] = prior ? "compatible" : "new";
  if (prior && prior.structuralType !== structuralType) schemaCompatibility = "datatype-changed";
  else if (prior && prior.unit !== effectiveUnit && (prior.unit != null || effectiveUnit != null)) schemaCompatibility = "unit-changed";
  const drift = schemaCompatibility === "datatype-changed" || schemaCompatibility === "unit-changed";
  const reuse = prior?.confirmationSource === "manager" && !drift;
  const understood = canonical || selfDescribing;
  const material = Boolean(target && target.targetId !== "date" && (candidate.abbreviated || drift));
  const state: CsvFieldSemanticUnderstanding["state"] = drift
    ? "CONFLICTING"
    : reuse || understood
      ? "UNDERSTOOD"
      : proposedMeaning && material
        ? "AMBIGUOUS"
        : proposedMeaning
          ? "LIKELY"
          : "UNKNOWN";
  const confirmedMeaning = reuse ? prior.confirmedMeaning : canonical ? target?.label ?? proposedMeaning : understood ? proposedMeaning : null;
  const confirmationSource = reuse ? "manager" : canonical || understood ? "authoritative-mapping" : "none";
  const confirmedTargetId = reuse ? prior.confirmedTargetId : canonical ? target?.targetId ?? null : null;
  const unresolvedReason = drift
    ? `The field's ${schemaCompatibility === "datatype-changed" ? "datatype" : "unit"} differs from its previously confirmed schema.`
    : state === "AMBIGUOUS"
      ? "The abbreviated field may affect an existing executive metric and needs manager confirmation."
      : state === "UNKNOWN"
        ? "No supported business meaning can be inferred from bounded schema context."
        : null;
  const semantic: CsvFieldSemanticUnderstanding = Object.freeze({
    fieldId,
    workspaceId: input.source.workspaceId,
    sourceContextId: sourceId,
    sourceColumn: input.mapping.sourceColumn,
    structuralType,
    representativeValues,
    state,
    proposedMeaning,
    confirmedMeaning,
    confirmedTargetId,
    confirmationSource,
    unit: effectiveUnit,
    material,
    unresolvedReason,
    interpretationBasis: Object.freeze([
      "column-name",
      "inferred-datatype",
      "representative-values",
      "neighboring-columns",
      "source-file-name",
      "existing-rdi-mapping-targets",
      ...(prior ? ["compatible-prior-source-field"] : []),
    ]),
    priorMeaning: drift ? prior?.confirmedMeaning ?? null : null,
    schemaCompatibility,
    authority: csvRealDataVerticalSliceIdentity,
  });

  const usableTarget = confirmedTargetId ? CSV_MAPPING_TARGETS.find((entry) => entry.targetId === confirmedTargetId) ?? null : null;
  return Object.freeze({
    ...input.mapping,
    semantic,
    targetId: usableTarget?.targetId ?? (material ? target?.targetId ?? input.mapping.targetId : input.mapping.targetId),
    targetLabel: usableTarget?.label ?? (material ? target?.label ?? input.mapping.targetLabel : input.mapping.targetLabel),
    confirmed: Boolean(usableTarget),
    ignored: !usableTarget && !material,
    status: usableTarget ? "recognized" : material ? "suggested" : input.mapping.status,
    reason: drift ? "Prior manager-confirmed meaning requires reassessment after schema drift." : input.mapping.reason,
  });
}

export function interpretCsvSemantics(input: Readonly<{
  input: CsvVerticalSliceInput;
  parse: CsvParseResult;
  structural: CsvMappingReview;
  previousMapping?: CsvMappingReview | null;
}>): CsvMappingReview {
  const mappings = input.structural.mappings.map((mapping) => semanticFor({
    source: input.input,
    parse: input.parse,
    mapping,
    previous: input.previousMapping ?? null,
  }));
  return buildCsvMappingReview(input.structural.mappingId, mappings);
}

export function nextCsvSemanticClarification(review: CsvMappingReview): CsvSemanticClarification | null {
  const mapping = [...review.mappings]
    .filter((entry) => entry.semantic?.material && ["CONFLICTING", "AMBIGUOUS", "LIKELY"].includes(entry.semantic.state) && entry.semantic.confirmationSource === "none")
    .sort((a, b) => {
      const rank = (state: string) => state === "CONFLICTING" ? 0 : state === "AMBIGUOUS" ? 1 : 2;
      const contextual = (entry: CsvColumnMapping) => tokens(entry.semantic!.proposedMeaning ?? "").some((word) => tokens(entry.semantic!.sourceContextId).includes(word)) ? 0 : 1;
      return rank(a.semantic!.state) - rank(b.semantic!.state) || contextual(a) - contextual(b) || a.columnIndex - b.columnIndex;
    })[0];
  const semantic = mapping?.semantic;
  if (!mapping || !semantic) return null;
  const question = semantic.state === "CONFLICTING"
    ? `This field appears different from the meaning previously confirmed. Has ${mapping.sourceColumn}'s definition changed from ${semantic.priorMeaning ?? "the earlier meaning"}?`
    : semantic.proposedMeaning
      ? `Does ${mapping.sourceColumn} represent ${semantic.proposedMeaning.toLowerCase()}?`
      : `What does ${mapping.sourceColumn} represent?`;
  return Object.freeze({ fieldId: semantic.fieldId, sourceColumn: mapping.sourceColumn, sourceContextId: semantic.sourceContextId, workspaceId: semantic.workspaceId, question, proposedMeaning: semantic.proposedMeaning });
}

const BARE_AFFIRMATION =
  /^(?:yes|yeah|yep|correct|that'?s (?:right|correct)|yes,? it does|yes,? it is)(?:[.!]*)?$/i;
const BARE_REJECTION =
  /^(?:no|nope|that is not correct|that'?s not correct|that is not right)(?:[.!]*)?$/i;
const IGNORE_FIELD =
  /\b(?:ignore(?: it| this(?: column| field)?)?|don'?t use this (?:column|field)|(?:this field|this column) isn'?t relevant)\b/i;
const TENTATIVE_REPLY =
  /^(?:maybe|i think so|perhaps|possibly|probably)(?:[.!]*)?$/i;

function definitionFrom(answer: string, field: CsvColumnMapping): string | null {
  const trimmed = answer.trim().replace(/[.!]+$/, "");
  if (BARE_AFFIRMATION.test(trimmed) || (/^yes\b/i.test(trimmed) && !/\bmeans\b/i.test(trimmed) && trimmed.split(/\s+/).length <= 5)) {
    const explicit = trimmed
      .replace(/^yes(?:,)?(?:\s+(?:it|that) (?:does|is|means))?\s*/i, "")
      .replace(/^(?:correct|that'?s (?:right|correct))\s*/i, "")
      .trim();
    if (!explicit || BARE_AFFIRMATION.test(explicit)) return field.semantic?.proposedMeaning || null;
    if (/^it means\s+/i.test(explicit)) return explicit.replace(/^it means\s+/i, "").trim() || field.semantic?.proposedMeaning || null;
    return explicit || field.semantic?.proposedMeaning || null;
  }
  if (/^yes\b/i.test(trimmed) && /\bmeans\b/i.test(trimmed)) {
    return trimmed.replace(/^yes(?:,)?\s*(?:it means|[a-z0-9_ -]+ means)\s*/i, "").trim() || field.semantic?.proposedMeaning || null;
  }
  if (/^no\b/i.test(trimmed) && /\bmeans\b/i.test(trimmed)) {
    const corrected = trimmed.match(/^no(?:,)?\s+(?:in this file\s+)?(?:it\s+)?(?:[A-Za-z0-9_ -]+?\s+)?means\s+(.+)$/i);
    return corrected?.[1]?.trim() || null;
  }
  const escaped = field.sourceColumn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const named = trimmed.match(new RegExp(`^${escaped}\\s+(?:is|means|represents)\\s+(.+)$`, "i"));
  return named?.[1]?.trim() || null;
}

export function applyCsvSemanticClarification(review: CsvMappingReview, fieldId: string, answer: string): CsvSemanticClarificationResult {
  const field = review.mappings.find((entry) => entry.semantic?.fieldId === fieldId) ?? null;
  if (!field?.semantic) return Object.freeze({ review, resolved: false, deferred: false, acknowledgement: "I could not match that answer to the pending CSV field." });
  if (TENTATIVE_REPLY.test(answer.trim())) {
    return Object.freeze({ review, resolved: false, deferred: false, acknowledgement: `I still need a clear yes, no, or meaning for ${field.sourceColumn}.` });
  }
  if (/\b(?:ask me later|later|not now)\b/i.test(answer)) return Object.freeze({ review, resolved: false, deferred: true, acknowledgement: `Okay. I will leave ${field.sourceColumn} unresolved for this session.` });
  if (/\b(?:i don'?t know|not sure|no idea)\b/i.test(answer)) {
    const mappings = review.mappings.map((entry) => entry !== field ? entry : Object.freeze({ ...entry, confirmed: false, semantic: Object.freeze({ ...entry.semantic!, state: "UNKNOWN" as const, confirmedMeaning: null, confirmedTargetId: null, confirmationSource: "none" as const, unresolvedReason: "The manager does not currently know this field's meaning." }) }));
    return Object.freeze({ review: buildCsvMappingReview(review.mappingId, mappings), resolved: false, deferred: false, acknowledgement: `Understood. ${field.sourceColumn} remains unresolved and unrelated usable fields can continue.` });
  }
  if (IGNORE_FIELD.test(answer)) {
    const mappings = review.mappings.map((entry): CsvColumnMapping => entry !== field ? entry : Object.freeze({
      ...entry,
      targetId: null,
      targetLabel: null,
      confirmed: true,
      ignored: true,
      reason: "Ignored by manager.",
      semantic: Object.freeze({ ...entry.semantic!, material: false, unresolvedReason: null, confirmationSource: "manager" as const }),
    }));
    return Object.freeze({ review: buildCsvMappingReview(review.mappingId, mappings), resolved: true, deferred: false, acknowledgement: `Understood. ${field.sourceColumn} will not be used.` });
  }
  if (BARE_REJECTION.test(answer.trim())) {
    const proposal = field.semantic.proposedMeaning;
    const mappings = review.mappings.map((entry) => entry !== field ? entry : Object.freeze({
      ...entry,
      confirmed: false,
      ignored: false,
      semantic: Object.freeze({
        ...entry.semantic!,
        confirmedMeaning: null,
        confirmedTargetId: null,
        confirmationSource: "none" as const,
        unresolvedReason: proposal ? `The manager rejected “${proposal}”.` : "The manager rejected the proposed meaning.",
      }),
    }));
    return Object.freeze({
      review: buildCsvMappingReview(review.mappingId, mappings),
      resolved: false,
      deferred: false,
      acknowledgement: proposal
        ? `Understood. ${field.sourceColumn} is not ${proposal}. I will not invent a replacement meaning.`
        : `Understood. ${field.sourceColumn} remains unresolved.`,
    });
  }
  const definition = definitionFrom(answer, field);
  if (!definition) return Object.freeze({ review, resolved: false, deferred: false, acknowledgement: `I still need a meaning for ${field.sourceColumn}.` });
  const sameAsProposal = field.semantic.proposedMeaning && normalized(definition) === normalized(field.semantic.proposedMeaning);
  const confirmedTargetId = sameAsProposal ? field.targetId : null;
  const target = confirmedTargetId ? CSV_MAPPING_TARGETS.find((entry) => entry.targetId === confirmedTargetId) ?? null : null;
  const mappings = review.mappings.map((entry): CsvColumnMapping => entry !== field ? entry : Object.freeze({
    ...entry,
    confirmed: Boolean(target),
    ignored: !target,
    targetId: target?.targetId ?? null,
    targetLabel: target?.label ?? null,
    reason: sameAsProposal ? "Semantic proposal confirmed by manager." : "Manager supplied a scoped semantic correction; no unproven canonical target is assumed.",
    semantic: Object.freeze({
      ...entry.semantic!,
      state: "UNDERSTOOD" as const,
      confirmedMeaning: definition[0]!.toUpperCase() + definition.slice(1),
      confirmedTargetId,
      confirmationSource: "manager" as const,
      unresolvedReason: null,
      priorMeaning: field.semantic!.confirmedMeaning ?? field.semantic!.proposedMeaning,
    }),
  }));
  return Object.freeze({ review: buildCsvMappingReview(review.mappingId, mappings), resolved: true, deferred: false, acknowledgement: `Confirmed for this source: ${field.sourceColumn} means ${definition}.` });
}

export function summarizeCsvSemantics(review: CsvMappingReview, fileName: string): Readonly<{ understood: string; unresolved: string }> {
  const understood = review.mappings.filter((entry) => entry.semantic?.confirmedMeaning).map((entry) => `${entry.sourceColumn}: ${entry.semantic!.confirmedMeaning}`);
  const unresolved = review.mappings.filter((entry) => entry.semantic?.material && entry.semantic.confirmationSource === "none").map((entry) => entry.sourceColumn);
  return Object.freeze({
    understood: understood.length ? `From ${fileName}, I understand ${understood.join("; ")}.` : `I can read ${fileName}, but I do not have a confirmed business meaning for its fields.`,
    unresolved: unresolved.length ? `I still need help with ${unresolved.join(", ")}.` : "There are no material semantic questions for this source.",
  });
}

export type CsvSemanticInquiryAnswer = Readonly<{ text: string; fieldId: string | null }>;

/** Bounded semantic routing over the selected CSV; not an exact-sentence command map. */
export function answerCsvSemanticInquiry(input: Readonly<{
  review: CsvMappingReview;
  fileName: string;
  utterance: string;
  priorFieldId?: string | null;
}>): CsvSemanticInquiryAnswer | null {
  const query = normalized(input.utterance);
  const named = input.review.mappings.find((entry) => {
    const name = normalized(entry.sourceColumn);
    return name.length > 1 && new RegExp(`(?:^| )${name.replace(/ /g, "[ _-]?")}(?: |$)`, "i").test(query);
  }) ?? null;
  const prior = input.review.mappings.find((entry) => entry.semantic?.fieldId === input.priorFieldId) ?? null;
  const field = named ?? (/\b(?:it|that|this field)\b/.test(query) ? prior : null);
  if (field?.semantic && /\b(?:what|mean|explain|understand|important|wrong|clarify)\b/.test(query)) {
    const semantic = field.semantic;
    const meaning = semantic.confirmedMeaning
      ? `${field.sourceColumn} means ${semantic.confirmedMeaning}. ${semantic.confirmationSource === "manager" ? "That meaning was confirmed by the manager" : "That comes from the existing authoritative mapping"}.`
      : semantic.proposedMeaning
        ? `My current interpretation is that ${field.sourceColumn} may mean ${semantic.proposedMeaning}. It is not confirmed.`
        : `I can parse ${field.sourceColumn} as ${semantic.structuralType}, but its business meaning is unresolved.`;
    const importance = /important/.test(query) ? ` ${semantic.material ? "It matters because it may affect an executive metric." : "It is not currently required for a supported executive observation."}` : "";
    return Object.freeze({ text: `${meaning}${importance}`, fieldId: semantic.fieldId });
  }
  const summary = summarizeCsvSemantics(input.review, input.fileName);
  if (/\b(?:unknown|unresolved|clarify|don t understand|do not understand)\b/.test(query)) return Object.freeze({ text: summary.unresolved, fieldId: null });
  if (/\b(?:understand|explain|tell)\b/.test(query) && /\b(?:csv|file|source|data)\b/.test(query)) return Object.freeze({ text: `${summary.understood} ${summary.unresolved}`, fieldId: null });
  const related = query.match(/related to ([a-z0-9 ]+)/)?.[1]?.split(" ")[0] ?? null;
  if (related) {
    const fields = input.review.mappings.filter((entry) => normalized(`${entry.sourceColumn} ${entry.semantic?.confirmedMeaning ?? entry.semantic?.proposedMeaning ?? ""}`).includes(related));
    return Object.freeze({ text: fields.length ? `Fields related to ${related}: ${fields.map((entry) => entry.sourceColumn).join(", ")}.` : `I do not have a supported ${related} association in this source.`, fieldId: fields[0]?.semantic?.fieldId ?? null });
  }
  return null;
}
