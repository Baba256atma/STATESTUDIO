import { BUSINESS_DOMAIN_PACK_INPUT } from "./packs/businessDomainPack";
import { DEVOPS_DOMAIN_PACK_INPUT } from "./packs/devopsDomainPack";
import { FINANCE_DOMAIN_PACK_INPUT } from "./packs/financeDomainPack";

export interface NexoraScannerEntityCandidate {
  id: string;
  label: string;
  description?: string;
  tags?: string[];
  sourceType?: string;
  metadata?: Record<string, any>;
}

export interface NexoraScannerRelationCandidate {
  id: string;
  from: string;
  to: string;
  label?: string;
  description?: string;
  tags?: string[];
  sourceType?: string;
  metadata?: Record<string, any>;
}

export interface NexoraScannerLoopCandidate {
  id: string;
  label?: string;
  description?: string;
  nodes?: string[];
  tags?: string[];
  sourceType?: string;
  metadata?: Record<string, any>;
}

export interface NexoraDomainEntityMappingResult {
  entityId: string;
  domainId?: string | null;
  matchedVocabularyId?: string | null;
  mappedCoreRole?: string | null;
  score: number;
  source: "label" | "synonym" | "tag" | "domain_hint" | "fallback";
  notes?: string[];
}

export interface NexoraDomainRelationMappingResult {
  relationId: string;
  domainId?: string | null;
  mappedRelationType?: string | null;
  score: number;
  source: "label" | "tag" | "domain_hint" | "fallback";
  notes?: string[];
}

export interface NexoraDomainLoopMappingResult {
  loopId: string;
  domainId?: string | null;
  mappedLoopType?: string | null;
  score: number;
  source: "label" | "tag" | "domain_hint" | "fallback";
  notes?: string[];
}

export interface NexoraDomainScannerInterpretation {
  domainId?: string | null;
  entityMappings: NexoraDomainEntityMappingResult[];
  relationMappings: NexoraDomainRelationMappingResult[];
  loopMappings: NexoraDomainLoopMappingResult[];
  inferredTags: string[];
  notes?: string[];
}

type DomainVocabularyItem = {
  id: string;
  label: string;
  coreRole: string;
  description?: string;
  synonyms?: string[];
  tags?: string[];
};

type DomainScannerHint = {
  sourceType?: string;
  entityKeywords?: string[];
  relationKeywords?: string[];
  loopKeywords?: string[];
  tags?: string[];
};

type DomainPackLike = {
  id?: string;
  label?: string;
  tags?: string[];
  objectVocabulary?: DomainVocabularyItem[];
  preferredRelationTypes?: string[];
  preferredLoopTypes?: string[];
  scannerHints?: DomainScannerHint[];
};

function toDomainPackLike(pack: {
  id?: string;
  label?: string;
  tags?: string[];
  vocabulary?: Array<{
    id: string;
    label: string;
    coreRole: string;
    description?: string;
    synonyms?: string[];
    tags?: string[];
  }>;
  scannerHints?: DomainScannerHint[];
}): DomainPackLike {
  return {
    id: pack.id,
    label: pack.label,
    tags: pack.tags,
    objectVocabulary: Array.isArray(pack.vocabulary)
      ? pack.vocabulary.map((item) => ({
          id: item.id,
          label: item.label,
          coreRole: item.coreRole,
          ...(item.description ? { description: item.description } : {}),
          synonyms: item.synonyms ?? [],
          tags: item.tags ?? [],
        }))
      : [],
    scannerHints: Array.isArray(pack.scannerHints) ? pack.scannerHints : [],
  };
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function tokenizeText(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9_]+/g)
    .map((token) => token.trim())
    .filter(Boolean);
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean)));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

function includesPhrase(normalizedText: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  return Boolean(normalizedPhrase) && normalizedText.includes(normalizedPhrase);
}

function scoreCandidate(text: string, candidate: string): number {
  const normalizedText = normalizeText(text);
  const tokens = tokenizeText(text);
  const candidateTokens = tokenizeText(candidate);
  if (candidateTokens.length === 0) return 0;

  let score = 0;
  const matched = candidateTokens.filter((token) => tokens.includes(token)).length;
  if (matched === candidateTokens.length) {
    score += candidateTokens.length + 2;
  } else if (matched > 0) {
    score += matched;
  }

  if (includesPhrase(normalizedText, candidate)) {
    score += 2;
  }

  return score;
}

function normalizePack(domainPack?: any | null): DomainPackLike | null {
  if (!domainPack || typeof domainPack !== "object") return null;

  return {
    id: typeof domainPack.id === "string" ? domainPack.id.trim() : undefined,
    label: typeof domainPack.label === "string" ? domainPack.label.trim() : undefined,
    tags: Array.isArray(domainPack.tags) ? uniq(domainPack.tags.map((value: unknown) => String(value))) : [],
    objectVocabulary: Array.isArray(domainPack.objectVocabulary)
      ? domainPack.objectVocabulary.map((item: any) => ({
          id: String(item.id ?? "").trim(),
          label: String(item.label ?? item.id ?? "").trim(),
          coreRole: String(item.coreRole ?? "").trim(),
          ...(typeof item.description === "string" && item.description.trim()
            ? { description: item.description.trim() }
            : {}),
          synonyms: Array.isArray(item.synonyms)
            ? uniq(item.synonyms.map((value: unknown) => String(value)))
            : [],
          tags: Array.isArray(item.tags) ? uniq(item.tags.map((value: unknown) => String(value))) : [],
        }))
      : [],
    preferredRelationTypes: Array.isArray(domainPack.preferredRelationTypes)
      ? uniq(domainPack.preferredRelationTypes.map((value: unknown) => String(value)))
      : [],
    preferredLoopTypes: Array.isArray(domainPack.preferredLoopTypes)
      ? uniq(domainPack.preferredLoopTypes.map((value: unknown) => String(value)))
      : [],
    scannerHints: Array.isArray(domainPack.scannerHints)
      ? domainPack.scannerHints.map((hint: any) => ({
          ...(typeof hint.sourceType === "string" && hint.sourceType.trim()
            ? { sourceType: hint.sourceType.trim() }
            : {}),
          entityKeywords: Array.isArray(hint.entityKeywords)
            ? uniq(hint.entityKeywords.map((value: unknown) => String(value)))
            : [],
          relationKeywords: Array.isArray(hint.relationKeywords)
            ? uniq(hint.relationKeywords.map((value: unknown) => String(value)))
            : [],
          loopKeywords: Array.isArray(hint.loopKeywords)
            ? uniq(hint.loopKeywords.map((value: unknown) => String(value)))
            : [],
          tags: Array.isArray(hint.tags) ? uniq(hint.tags.map((value: unknown) => String(value))) : [],
        }))
      : [],
  };
}

function collectScannerHintKeywords(
  pack: DomainPackLike | null,
  kind: "entityKeywords" | "relationKeywords" | "loopKeywords"
): string[] {
  if (!pack) return [];
  return uniq(
    (pack.scannerHints ?? []).flatMap((hint) =>
      Array.isArray(hint[kind]) ? (hint[kind] as string[]) : []
    )
  );
}

function collectHintTags(pack: DomainPackLike | null): string[] {
  if (!pack) return [];
  return uniq((pack.scannerHints ?? []).flatMap((hint) => hint.tags ?? []));
}

function inferRelationTypeFromText(text: string, preferredRelationTypes: string[]): string | null {
  const relationKeywords: Array<{ type: string; terms: string[] }> = [
    { type: "flows_to", terms: ["flow", "flows to", "delivery", "handoff", "stream"] },
    { type: "depends_on", terms: ["depends on", "dependency", "requires", "relies on"] },
    { type: "blocks", terms: ["block", "blocked", "prevent", "stops"] },
    { type: "amplifies", terms: ["amplify", "increase", "accelerate", "worsen"] },
    { type: "reduces", terms: ["reduce", "decrease", "dampen", "lower"] },
    { type: "causes", terms: ["cause", "drives", "creates", "triggers"] },
    { type: "signals", terms: ["signal", "indicates", "shows", "reflects"] },
    { type: "transfers_risk", terms: ["transfer risk", "exposes", "spreads risk", "passes risk"] },
    { type: "competes_with", terms: ["competes", "rival", "tradeoff"] },
    { type: "substitutes", terms: ["substitute", "backup", "replace"] },
    { type: "stabilizes", terms: ["stabilize", "balance", "restore"] },
  ];

  let bestType: string | null = null;
  let bestScore = 0;

  for (const entry of relationKeywords) {
    const score = Math.max(...entry.terms.map((term) => scoreCandidate(text, term)), 0);
    if (score > bestScore) {
      bestScore = score;
      bestType = entry.type;
    }
  }

  if (bestScore <= 0 && preferredRelationTypes.length > 0) {
    return preferredRelationTypes[0] ?? null;
  }

  return bestType;
}

function inferLoopTypeFromText(text: string, preferredLoopTypes: string[]): string | null {
  const loopKeywords: Array<{ type: string; terms: string[] }> = [
    { type: "risk_cascade", terms: ["cascade", "spread", "failure chain", "propagation"] },
    { type: "pressure", terms: ["pressure", "stress", "strain", "load"] },
    { type: "constraint", terms: ["constraint", "bottleneck", "limit", "scarcity"] },
    { type: "buffer_recovery", terms: ["buffer", "reserve", "recovery", "absorb"] },
    { type: "balancing", terms: ["balance", "stability", "equilibrium"] },
    { type: "reinforcing", terms: ["reinforcing", "feedback", "amplify", "momentum"] },
    { type: "strategic_response", terms: ["response", "intervention", "mitigation", "strategy"] },
  ];

  let bestType: string | null = null;
  let bestScore = 0;

  for (const entry of loopKeywords) {
    const score = Math.max(...entry.terms.map((term) => scoreCandidate(text, term)), 0);
    if (score > bestScore) {
      bestScore = score;
      bestType = entry.type;
    }
  }

  if (bestScore <= 0 && preferredLoopTypes.length > 0) {
    return preferredLoopTypes[0] ?? null;
  }

  return bestType;
}

export function normalizeScannerText(text: string): string {
  return normalizeText(text);
}

export function tokenizeScannerText(text: string): string[] {
  return tokenizeText(text);
}

export function mapScannerEntityToDomain(args: {
  entity: NexoraScannerEntityCandidate;
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainEntityMappingResult {
  const entity = args.entity;
  const pack = normalizePack(args.domainPack);
  const domainId = args.domainId ?? pack?.id ?? null;
  const text = [entity.label, entity.description, ...(entity.tags ?? [])].filter(Boolean).join(" ");
  const hintKeywords = collectScannerHintKeywords(pack, "entityKeywords");

  let bestMatch: {
    vocabularyId: string | null;
    coreRole: string | null;
    score: number;
    source: NexoraDomainEntityMappingResult["source"];
    notes: string[];
  } = {
    vocabularyId: null,
    coreRole: null,
    score: 0,
    source: "fallback",
    notes: [],
  };

  for (const item of pack?.objectVocabulary ?? []) {
    const labelScore = scoreCandidate(text, item.label);
    if (labelScore > bestMatch.score) {
      bestMatch = {
        vocabularyId: item.id,
        coreRole: item.coreRole || null,
        score: labelScore,
        source: "label",
        notes: [`Matched vocabulary label: ${item.label}`],
      };
    }

    for (const synonym of item.synonyms ?? []) {
      const synonymScore = scoreCandidate(text, synonym);
      if (synonymScore > bestMatch.score) {
        bestMatch = {
          vocabularyId: item.id,
          coreRole: item.coreRole || null,
          score: synonymScore,
          source: "synonym",
          notes: [`Matched vocabulary synonym: ${synonym}`],
        };
      }
    }

    for (const tag of item.tags ?? []) {
      const tagScore = scoreCandidate(text, tag);
      if (tagScore > bestMatch.score) {
        bestMatch = {
          vocabularyId: item.id,
          coreRole: item.coreRole || null,
          score: tagScore,
          source: "tag",
          notes: [`Matched vocabulary tag: ${tag}`],
        };
      }
    }
  }

  for (const keyword of hintKeywords) {
    const hintScore = scoreCandidate(text, keyword);
    if (hintScore > bestMatch.score) {
      bestMatch = {
        vocabularyId: null,
        coreRole: null,
        score: hintScore,
        source: "domain_hint",
        notes: [`Matched scanner hint keyword: ${keyword}`],
      };
    }
  }

  const threshold = 2;

  return {
    entityId: entity.id,
    domainId,
    matchedVocabularyId: bestMatch.score >= threshold ? bestMatch.vocabularyId : null,
    mappedCoreRole: bestMatch.score >= threshold ? bestMatch.coreRole : null,
    score: clamp01(bestMatch.score / 12),
    source: bestMatch.score >= threshold ? bestMatch.source : "fallback",
    notes:
      bestMatch.score >= threshold
        ? uniq(bestMatch.notes)
        : ["No strong domain vocabulary match found."],
  };
}

export function mapScannerRelationToDomain(args: {
  relation: NexoraScannerRelationCandidate;
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainRelationMappingResult {
  const relation = args.relation;
  const pack = normalizePack(args.domainPack);
  const domainId = args.domainId ?? pack?.id ?? null;
  const text = [relation.label, relation.description, ...(relation.tags ?? [])].filter(Boolean).join(" ");
  const hintKeywords = collectScannerHintKeywords(pack, "relationKeywords");
  const inferredType = inferRelationTypeFromText(text, pack?.preferredRelationTypes ?? []);

  let bestScore = inferredType ? scoreCandidate(text, inferredType.replace(/_/g, " ")) : 0;
  let source: NexoraDomainRelationMappingResult["source"] = bestScore > 0 ? "label" : "fallback";
  const notes: string[] = [];

  for (const keyword of hintKeywords) {
    const score = scoreCandidate(text, keyword);
    if (score > bestScore) {
      bestScore = score;
      source = "domain_hint";
      notes.length = 0;
      notes.push(`Matched scanner relation hint: ${keyword}`);
    }
  }

  for (const tag of relation.tags ?? []) {
    const score = scoreCandidate(text, tag);
    if (score > bestScore) {
      bestScore = score;
      source = "tag";
      notes.length = 0;
      notes.push(`Matched relation tag: ${tag}`);
    }
  }

  if (inferredType && notes.length === 0 && bestScore > 0) {
    notes.push(`Inferred relation type: ${inferredType}`);
  }

  const threshold = 2;

  return {
    relationId: relation.id,
    domainId,
    mappedRelationType: bestScore >= threshold ? inferredType : null,
    score: clamp01(bestScore / 10),
    source: bestScore >= threshold ? source : "fallback",
    notes: bestScore >= threshold ? uniq(notes) : ["No strong domain relation match found."],
  };
}

export function mapScannerLoopToDomain(args: {
  loop: NexoraScannerLoopCandidate;
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainLoopMappingResult {
  const loop = args.loop;
  const pack = normalizePack(args.domainPack);
  const domainId = args.domainId ?? pack?.id ?? null;
  const text = [loop.label, loop.description, ...(loop.tags ?? [])].filter(Boolean).join(" ");
  const hintKeywords = collectScannerHintKeywords(pack, "loopKeywords");
  const inferredType = inferLoopTypeFromText(text, pack?.preferredLoopTypes ?? []);

  let bestScore = inferredType ? scoreCandidate(text, inferredType.replace(/_/g, " ")) : 0;
  let source: NexoraDomainLoopMappingResult["source"] = bestScore > 0 ? "label" : "fallback";
  const notes: string[] = [];

  for (const keyword of hintKeywords) {
    const score = scoreCandidate(text, keyword);
    if (score > bestScore) {
      bestScore = score;
      source = "domain_hint";
      notes.length = 0;
      notes.push(`Matched scanner loop hint: ${keyword}`);
    }
  }

  for (const tag of loop.tags ?? []) {
    const score = scoreCandidate(text, tag);
    if (score > bestScore) {
      bestScore = score;
      source = "tag";
      notes.length = 0;
      notes.push(`Matched loop tag: ${tag}`);
    }
  }

  if (inferredType && notes.length === 0 && bestScore > 0) {
    notes.push(`Inferred loop type: ${inferredType}`);
  }

  const threshold = 2;

  return {
    loopId: loop.id,
    domainId,
    mappedLoopType: bestScore >= threshold ? inferredType : null,
    score: clamp01(bestScore / 10),
    source: bestScore >= threshold ? source : "fallback",
    notes: bestScore >= threshold ? uniq(notes) : ["No strong domain loop match found."],
  };
}

export function mapScannerEntitiesToDomain(args: {
  entities: NexoraScannerEntityCandidate[];
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainEntityMappingResult[] {
  return (args.entities ?? []).map((entity) =>
    mapScannerEntityToDomain({
      entity,
      domainPack: args.domainPack,
      domainId: args.domainId,
    })
  );
}

export function mapScannerRelationsToDomain(args: {
  relations: NexoraScannerRelationCandidate[];
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainRelationMappingResult[] {
  return (args.relations ?? []).map((relation) =>
    mapScannerRelationToDomain({
      relation,
      domainPack: args.domainPack,
      domainId: args.domainId,
    })
  );
}

export function mapScannerLoopsToDomain(args: {
  loops: NexoraScannerLoopCandidate[];
  domainPack?: any | null;
  domainId?: string | null;
}): NexoraDomainLoopMappingResult[] {
  return (args.loops ?? []).map((loop) =>
    mapScannerLoopToDomain({
      loop,
      domainPack: args.domainPack,
      domainId: args.domainId,
    })
  );
}

export function inferScannerInterpretationTags(args: {
  entityMappings: NexoraDomainEntityMappingResult[];
  relationMappings: NexoraDomainRelationMappingResult[];
  loopMappings: NexoraDomainLoopMappingResult[];
}): string[] {
  const tags: string[] = [];

  for (const mapping of args.entityMappings ?? []) {
    if (mapping.mappedCoreRole) tags.push(mapping.mappedCoreRole);
    tags.push(mapping.source);
    for (const note of mapping.notes ?? []) {
      if (note.includes("vocabulary")) tags.push("vocabulary_match");
      if (note.includes("scanner hint")) tags.push("scanner_hint");
    }
  }

  for (const mapping of args.relationMappings ?? []) {
    if (mapping.mappedRelationType) tags.push(mapping.mappedRelationType);
    tags.push(mapping.source);
  }

  for (const mapping of args.loopMappings ?? []) {
    if (mapping.mappedLoopType) tags.push(mapping.mappedLoopType);
    tags.push(mapping.source);
  }

  return uniq(tags);
}

export function interpretScannerOutputForDomain(args: {
  domainId?: string | null;
  domainPack?: any | null;
  entities?: NexoraScannerEntityCandidate[];
  relations?: NexoraScannerRelationCandidate[];
  loops?: NexoraScannerLoopCandidate[];
}): NexoraDomainScannerInterpretation {
  const pack = normalizePack(args.domainPack);
  const domainId = args.domainId ?? pack?.id ?? null;
  const entityMappings = mapScannerEntitiesToDomain({
    entities: args.entities ?? [],
    domainPack: pack,
    domainId,
  });
  const relationMappings = mapScannerRelationsToDomain({
    relations: args.relations ?? [],
    domainPack: pack,
    domainId,
  });
  const loopMappings = mapScannerLoopsToDomain({
    loops: args.loops ?? [],
    domainPack: pack,
    domainId,
  });
  const inferredTags = inferScannerInterpretationTags({
    entityMappings,
    relationMappings,
    loopMappings,
  });
  const notes: string[] = [];

  if (entityMappings.length === 0) notes.push("No entities were provided.");
  if (relationMappings.length === 0) notes.push("No relations were provided.");
  if (loopMappings.length === 0) notes.push("No loops were provided.");

  const hintTags = collectHintTags(pack);
  for (const tag of hintTags) {
    if (!inferredTags.includes(tag)) inferredTags.push(tag);
  }

  return {
    domainId,
    entityMappings,
    relationMappings,
    loopMappings,
    inferredTags,
    notes,
  };
}

export function getMappedEntityRoles(
  interpretation: NexoraDomainScannerInterpretation
): Record<string, string> {
  return (interpretation.entityMappings ?? []).reduce<Record<string, string>>((acc, mapping) => {
    if (mapping.mappedCoreRole) {
      acc[mapping.entityId] = mapping.mappedCoreRole;
    }
    return acc;
  }, {});
}

export function getMappedRelationTypes(
  interpretation: NexoraDomainScannerInterpretation
): Record<string, string> {
  return (interpretation.relationMappings ?? []).reduce<Record<string, string>>((acc, mapping) => {
    if (mapping.mappedRelationType) {
      acc[mapping.relationId] = mapping.mappedRelationType;
    }
    return acc;
  }, {});
}

export function getMappedLoopTypes(
  interpretation: NexoraDomainScannerInterpretation
): Record<string, string> {
  return (interpretation.loopMappings ?? []).reduce<Record<string, string>>((acc, mapping) => {
    if (mapping.mappedLoopType) {
      acc[mapping.loopId] = mapping.mappedLoopType;
    }
    return acc;
  }, {});
}

const EXAMPLE_BUSINESS_PACK: DomainPackLike = toDomainPackLike(BUSINESS_DOMAIN_PACK_INPUT);

const EXAMPLE_FINANCE_PACK: DomainPackLike = toDomainPackLike(FINANCE_DOMAIN_PACK_INPUT);

const EXAMPLE_DEVOPS_PACK: DomainPackLike = toDomainPackLike(DEVOPS_DOMAIN_PACK_INPUT);

const EXAMPLE_STRATEGY_PACK: DomainPackLike = {
  id: "strategy",
  objectVocabulary: [
    { id: "competitor", label: "Competitor", coreRole: "actor", synonyms: ["rival"], tags: ["competition"] },
    { id: "market_share", label: "Market Share", coreRole: "outcome", synonyms: ["share"], tags: ["position"] },
    { id: "pricing_pressure", label: "Pricing Pressure", coreRole: "pressure", synonyms: ["price pressure"], tags: ["margin"] },
  ],
  preferredRelationTypes: ["competes_with", "signals", "amplifies"],
  preferredLoopTypes: ["strategic_response", "pressure", "reinforcing"],
  scannerHints: [
    {
      entityKeywords: ["competitor", "market share", "pricing pressure"],
      relationKeywords: ["competes", "signals", "drives"],
      loopKeywords: ["response", "pressure", "feedback"],
      tags: ["strategy"],
    },
  ],
};

export const EXAMPLE_DOMAIN_SCANNER_INTERPRETATIONS: Record<string, NexoraDomainScannerInterpretation> = {
  business: interpretScannerOutputForDomain({
    domainId: "business",
    domainPack: EXAMPLE_BUSINESS_PACK,
    entities: [
      { id: "e_supplier", label: "Supplier", tags: ["vendor"] },
      { id: "e_inventory", label: "Inventory", tags: ["stock"] },
      { id: "e_customer", label: "Customer", tags: ["client"] },
    ],
    relations: [
      { id: "r1", from: "e_supplier", to: "e_inventory", label: "flows to" },
    ],
    loops: [
      { id: "l1", label: "delivery pressure loop", tags: ["pressure"] },
    ],
  }),
  finance: interpretScannerOutputForDomain({
    domainId: "finance",
    domainPack: EXAMPLE_FINANCE_PACK,
    entities: [
      { id: "e_portfolio", label: "Portfolio" },
      { id: "e_liquidity", label: "Liquidity", tags: ["funding"] },
      { id: "e_drawdown", label: "Drawdown Risk", tags: ["loss"] },
    ],
    relations: [
      { id: "r1", from: "e_portfolio", to: "e_drawdown", label: "transfers risk" },
    ],
    loops: [
      { id: "l1", label: "risk cascade", tags: ["cascade"] },
    ],
  }),
  devops: interpretScannerOutputForDomain({
    domainId: "devops",
    domainPack: EXAMPLE_DEVOPS_PACK,
    entities: [
      { id: "e_service", label: "Service" },
      { id: "e_database", label: "Database", tags: ["db"] },
      { id: "e_queue", label: "Queue", tags: ["buffer"] },
    ],
    relations: [
      { id: "r1", from: "e_service", to: "e_database", label: "depends on" },
    ],
    loops: [
      { id: "l1", label: "latency pressure", tags: ["pressure"] },
    ],
  }),
  strategy: interpretScannerOutputForDomain({
    domainId: "strategy",
    domainPack: EXAMPLE_STRATEGY_PACK,
    entities: [
      { id: "e_competitor", label: "Competitor" },
      { id: "e_market_share", label: "Market Share" },
      { id: "e_pricing", label: "Pricing Pressure" },
    ],
    relations: [
      { id: "r1", from: "e_competitor", to: "e_market_share", label: "competes with" },
    ],
    loops: [
      { id: "l1", label: "strategic response loop", tags: ["response"] },
    ],
  }),
};
