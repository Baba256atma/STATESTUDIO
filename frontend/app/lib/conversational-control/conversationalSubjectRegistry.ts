/**
 * CC:2 — Read-only conversational subject registry helpers.
 *
 * Does not own domain catalogs. Projects supplied canonical subjects into a
 * match index. Optional MVP adapter builds a projection from Stage fixtures.
 */

import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type {
  NexoraConversationalSubjectKind,
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import { normalizeNexoraConversationalUtterance, expandControlledManagerLanguageKeys } from "./conversationalIntentNormalization.ts";
import { resolveRegisteredReference } from "@/app/lib/manager-object/nexoraRegisteredReferenceRecovery.ts";

export type NexoraConversationalSubjectMatchIndex = {
  readonly subjectsById: ReadonlyMap<string, NexoraConversationalSubjectRecord>;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
};

export type NexoraConversationalSubjectProjectionSource = {
  readonly objects?: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind?: string;
  }[];
  readonly contextSubjects?: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
  }[];
};

export function freezeConversationalSubjectRecord(
  record: NexoraConversationalSubjectRecord,
): NexoraConversationalSubjectRecord {
  return Object.freeze({
    subjectId: record.subjectId,
    subjectKind: record.subjectKind,
    canonicalName: record.canonicalName,
    aliases: Object.freeze([...(record.aliases ?? [])]),
    businessKey: record.businessKey ?? null,
  });
}

export function buildNexoraConversationalSubjectMatchIndex(
  subjects: readonly NexoraConversationalSubjectRecord[],
): NexoraConversationalSubjectMatchIndex {
  const frozen = Object.freeze(
    subjects.map((s) => freezeConversationalSubjectRecord(s)),
  );
  const subjectsById = new Map<string, NexoraConversationalSubjectRecord>();
  for (const subject of frozen) {
    subjectsById.set(subject.subjectId, subject);
  }
  return Object.freeze({
    subjectsById,
    subjects: frozen,
  });
}

export const NEXORA_FINAL3_NATURAL_REFERENCE_IDENTITY =
  "NEX-MVP-FINAL:3/natural-reference-v1" as const;

export function normalizeConversationalMatchKey(value: string): string {
  return normalizeNexoraConversationalUtterance(value);
}

/**
 * Deterministic candidate match against registered subjects.
 * Exact / morphology first, then catalog-bounded fuzzy recovery.
 * Never synthesizes IDs. Never guesses outside the supplied catalog.
 */
export function findCanonicalSubjectMatchesForHint(
  hintRaw: string,
  index: NexoraConversationalSubjectMatchIndex,
): readonly NexoraConversationalSubjectRecord[] {
  const key = normalizeConversationalMatchKey(hintRaw);
  if (!key) return Object.freeze([]);

  const exact = matchSubjectsByKey(key, index);
  if (exact.length > 0) return exact;

  const fillerStripped = interfaceFillerStrippedKey(key);
  if (fillerStripped) {
    const fillerMatches = matchSubjectsByKey(fillerStripped, index);
    if (fillerMatches.length > 0) return fillerMatches;
    const morphFromFiller = matchMorphologicalKeys(fillerStripped, index);
    if (morphFromFiller.length > 0) return morphFromFiller;
  }

  const morphFromKey = matchMorphologicalKeys(key, index);
  if (morphFromKey.length > 0) return morphFromKey;

  for (const alt of kindStrippedHintKeys(key)) {
    const kindMatches = matchSubjectsByKey(alt, index);
    if (kindMatches.length > 0) return kindMatches;
    const morphFromKind = matchMorphologicalKeys(alt, index);
    if (morphFromKind.length > 0) return morphFromKind;
  }

  const recovered = recoverRegisteredHint(hintRaw, index);
  return recovered;
}

function recoverRegisteredHint(
  hintRaw: string,
  index: NexoraConversationalSubjectMatchIndex,
): readonly NexoraConversationalSubjectRecord[] {
  const catalog = index.subjects.map((subject) =>
    Object.freeze({
      subjectId: subject.subjectId,
      canonicalName: subject.canonicalName,
      keys: Object.freeze(
        [
          subject.subjectId,
          subject.canonicalName,
          subject.businessKey ?? "",
          ...(subject.aliases ?? []),
        ].filter(Boolean),
      ),
    }),
  );
  const resolution = resolveRegisteredReference({
    raw: hintRaw,
    catalog,
  });
  const ids =
    resolution.selected != null
      ? [resolution.selected.subjectId]
      : resolution.ambiguous
        ? resolution.matches.map((item) => item.subjectId)
        : [];
  const seen = new Set<string>();
  const matches: NexoraConversationalSubjectRecord[] = [];
  for (const id of ids) {
    const subject = index.subjectsById.get(id);
    if (!subject || seen.has(subject.subjectId)) continue;
    seen.add(subject.subjectId);
    matches.push(subject);
  }
  return Object.freeze(matches);
}

function matchMorphologicalKeys(
  key: string,
  index: NexoraConversationalSubjectMatchIndex,
): readonly NexoraConversationalSubjectRecord[] {
  const matches: NexoraConversationalSubjectRecord[] = [];
  const seen = new Set<string>();
  for (const alt of expandControlledManagerLanguageKeys(key)) {
    for (const subject of matchSubjectsByKey(alt, index)) {
      if (seen.has(subject.subjectId)) continue;
      seen.add(subject.subjectId);
      matches.push(subject);
    }
  }
  return Object.freeze(matches);
}

function matchSubjectsByKey(
  key: string,
  index: NexoraConversationalSubjectMatchIndex,
): readonly NexoraConversationalSubjectRecord[] {
  const matches: NexoraConversationalSubjectRecord[] = [];
  const seen = new Set<string>();
  for (const subject of index.subjects) {
    const candidates = [
      subject.subjectId,
      subject.canonicalName,
      subject.businessKey ?? "",
      ...(subject.aliases ?? []),
    ]
      .filter(Boolean)
      .map((v) => normalizeConversationalMatchKey(String(v)));
    if (!candidates.includes(key)) continue;
    if (seen.has(subject.subjectId)) continue;
    seen.add(subject.subjectId);
    matches.push(subject);
  }
  return Object.freeze(matches);
}

/**
 * Trailing UI vocabulary (object/item/node/card/thing) is reference filler.
 * Strip even when the leftover is a category word such as "risk".
 * Do not apply this before an exact canonical/alias match, so a real name
 * that contains these words is preserved when it exists.
 */
function interfaceFillerStrippedKey(key: string): string | null {
  const stripped = key.replace(
    /\s+(?:objects?|items?|nodes?|cards?|things?)$/u,
    "",
  );
  if (!stripped || stripped === key) return null;
  return stripped;
}

/**
 * Kind suffixes (problem/scenario/…) are semantic, not filler.
 * Never collapse "risk problem" onto "risk".
 */
function kindStrippedHintKeys(key: string): readonly string[] {
  const stripped = key.replace(
    /\s+(scenario|problem|decision|execution|goal)$/u,
    "",
  );
  if (!stripped || stripped === key) return Object.freeze([]);
  if (
    /^(?:risks?|problems?|opportunities?|goals?|scenarios?|decisions?|executions?)$/.test(
      stripped,
    )
  ) {
    return Object.freeze([]);
  }
  return Object.freeze([stripped]);
}

function asSubjectKind(kind: string): NexoraConversationalSubjectKind {
  switch (kind) {
    case "object":
    case "goal":
    case "problem":
    case "scenario":
    case "decision":
    case "execution":
    case "outcome":
    case "workspace":
    case "business":
      return kind;
    default:
      return "unknown";
  }
}

/**
 * Project a catalog-shaped snapshot into CC:2 subject records.
 * Read-only adapter — fixtures remain owned by nex-mvp.
 */
export function projectNexoraConversationalSubjectsFromCatalog(
  source: NexoraConversationalSubjectProjectionSource = {},
): readonly NexoraConversationalSubjectRecord[] {
  const objects = (source.objects ?? []).map((o) =>
    freezeConversationalSubjectRecord({
      subjectId: o.id,
      subjectKind: asSubjectKind(o.kind ?? "object"),
      canonicalName: o.label,
      aliases: defaultAliasesForObject(o.id, o.label),
      businessKey: o.id,
    }),
  );

  const contexts = (source.contextSubjects ?? []).map((c) =>
    freezeConversationalSubjectRecord({
      subjectId: c.id,
      subjectKind: asSubjectKind(c.kind),
      canonicalName: c.label,
      aliases: Object.freeze([c.label]),
      businessKey: c.id,
    }),
  );

  return Object.freeze([...objects, ...contexts]);
}

/**
 * Default MVP Stage projection used by tests and local executive tooling.
 */
export function projectDefaultNexoraMvpConversationalSubjects(): readonly NexoraConversationalSubjectRecord[] {
  return projectNexoraConversationalSubjectsFromCatalog({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  });
}

function defaultAliasesForObject(
  id: string,
  label: string,
): readonly string[] {
  const aliases: string[] = [label];
  // Explicit registered aliases only — not fuzzy invention.
  if (id === "obj-revenue") {
    aliases.push("sales revenue", "revenue object");
  }
  if (id === "obj-capacity") {
    aliases.push("production capacity", "capacity object");
  }
  if (id === "obj-budget") {
    aliases.push("budget object", "the budget");
  }
  if (id === "obj-delivery" || /^deliver/i.test(label)) {
    aliases.push("delivery performance", "on-time delivery", "otd");
  }
  if (id === "obj-inventory" || /^inventor/i.test(label)) {
    aliases.push("inventory levels", "stock");
  }
  if (id === "obj-margin" || /^margin/i.test(label)) {
    aliases.push("profit margin", "margins");
  }
  return Object.freeze(aliases);
}
