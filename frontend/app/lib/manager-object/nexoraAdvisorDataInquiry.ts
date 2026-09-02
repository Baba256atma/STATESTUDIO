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
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const nexoraAdvisorDataInquiryIdentity = "DATA-ADV:1/AdvisorDataInquiry" as const;

export type AdvisorDataDialogue = Readonly<{
  sourceContextId: string | null;
  fieldColumn: string | null;
}>;

export const emptyAdvisorDataDialogue: AdvisorDataDialogue = Object.freeze({
  sourceContextId: null,
  fieldColumn: null,
});

export type AdvisorDataInquiryAnswer = Readonly<{
  text: string;
  dialogue: AdvisorDataDialogue;
  clarification: CsvSemanticClarification | null;
  mutatesStage: false;
  mutatesDataReality: false;
}>;

function prepared(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.?!]+$/g, "").replace(/\s+/g, " ");
}

function csvSources(context: AdvisorDataContext): readonly AdvisorDataSource[] {
  return context.sources.filter((entry) => entry.sourceType === "csv");
}

function findSourcesByLabel(context: AdvisorDataContext, query: string): readonly AdvisorDataSource[] {
  const compact = compactDataToken(query);
  return csvSources(context).filter((source) => {
    const label = compactDataToken(source.label);
    return label === compact || compact.includes(label) || label.includes(compact) || query.includes(source.label.toLowerCase());
  });
}

function fieldMatches(field: AdvisorDataField, query: string): boolean {
  const compactQuery = compactDataToken(query);
  const compactColumn = compactDataToken(field.column);
  if (compactColumn.length < 2) return false;
  if (compactQuery.includes(compactColumn) || compactColumn === compactQuery) return true;
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
  return `${field.column} is a field in ${source.label}, but its business meaning has not been confirmed yet.${pendingNote}`;
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

function listLibrary(context: AdvisorDataContext): string {
  const csv = csvSources(context);
  const connected = context.sources.filter((entry) => entry.lifecycle === "connected");
  const ready = csv.filter((entry) => entry.lifecycle === "committed");
  const pending = csv.filter((entry) => entry.lifecycle === "pending");
  if (csv.length === 0 && connected.length === 0) {
    return "I don't see any data sources in this workspace yet.";
  }
  const csvPart = csv.length
    ? `You currently have ${csv.length} CSV source${csv.length === 1 ? "" : "s"}${connected.length ? ` and ${connected.length} connected source${connected.length === 1 ? "" : "s"}` : ""}.`
    : `You have ${connected.length} connected source${connected.length === 1 ? "" : "s"}.`;
  const readyNames = ready.map((entry) => entry.label).join(", ");
  const pendingNames = pending.map((entry) => entry.label).join(", ");
  const readyLine = ready.length ? ` ${readyNames} ${ready.length === 1 ? "is" : "are"} ready.` : "";
  const pendingLine = pending.length ? ` ${pendingNames} ${pending.length === 1 ? "is" : "are"} still being reviewed.` : "";
  return `${csvPart}${readyLine}${pendingLine}`;
}

function describeSourceContents(source: AdvisorDataSource): string {
  const confirmed = source.fields.filter((field) => field.confidence === "confirmed" || field.confidence === "authoritative");
  const unresolved = source.fields.filter((field) => field.confidence === "likely" || field.confidence === "unresolved");
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
}>): AdvisorDataInquiryAnswer | null {
  const context = input.context ?? projectAdvisorDataContext(input.workspaceId);
  const dialogue = input.dialogue ?? emptyAdvisorDataDialogue;
  const query = prepared(input.utterance);
  if (!query) return null;

  const listAsk = /\b(?:what (?:data |files |sources )?(?:do we have|have we got)|which files|what sources)\b/.test(query)
    || /^what data do we have$/.test(query);
  if (listAsk && !/\bfor\b/.test(query)) {
    return Object.freeze({
      text: listLibrary(context),
      dialogue,
      clarification: null,
      mutatesStage: false,
      mutatesDataReality: false,
    });
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
    ?? (/\b(?:that file|this (?:file|source)|the file we were discussing|this source)\b/.test(query) ? sourceById(context, dialogue.sourceContextId)?.label : null);
  const fileSources = namedFile ? findSourcesByLabel(context, namedFile.replace(/ file$/, "")) : [];
  const uniqueFile = fileSources.length === 1 ? fileSources[0] : dialogue.sourceContextId && /\b(?:that file|this (?:file|source)|the file)\b/.test(query)
    ? sourceById(context, dialogue.sourceContextId)
    : null;

  if (uniqueFile && /\b(?:contain|what's in|what is in|what else|describe|what is |ready|clarif|objects? (?:use|related)|remove)\b/.test(query)) {
    if (/\bready\b/.test(query)) {
      const text = uniqueFile.lifecycle === "committed"
        ? `${uniqueFile.label} is ready.`
        : `${uniqueFile.label} is still under review.`;
      return Object.freeze({ text, dialogue: { sourceContextId: uniqueFile.sourceContextId, fieldColumn: dialogue.fieldColumn }, clarification: null, mutatesStage: false, mutatesDataReality: false });
    }
    if (/\bclarif\b/.test(query)) {
      const unresolved = uniqueFile.fields.filter((field) => field.confidence === "likely" || field.confidence === "unresolved");
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

  if (/\b(?:investigate|which (?:source|data) should|what data can help|which object should i (?:look at|inspect))\b/.test(query)) {
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

  if (/\bwhich (?:file|source|csv) contains\b/.test(query) || /\bwhich file is it from\b/.test(query) || /\bwhich file is it from\b/.test(query)) {
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
    /\b(?:what is|what's|mean|explain|related to|this field)\b/.test(query)
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
    const text = describeField(field, source);
    const clarification = field.confidence === "likely" || field.confidence === "unresolved"
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
