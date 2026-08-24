/**
 * NEX-EXP:1 — deterministic manager identity extraction and sufficiency.
 * LLM may later compose wording; it must not invent identity facts.
 */

import type {
  CurrentWorkContext,
  ExecutiveContextKind,
  ExecutiveIdentityContext,
  IdentityEpistemic,
  IdentityFact,
  IdentityFieldName,
  IdentitySufficiency,
  ManagerIdentityContext,
  ManagerPersonalIdentity,
} from "./nexoraEntranceTypes.ts";

const NAME_REJECT = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "not",
  "also",
  "here",
  "ready",
  "trying",
  "building",
  "working",
  "running",
  "managing",
  "responsible",
  "currently",
  "looking",
  "asking",
  "doing",
  "actually",
  "just",
  "now",
  "still",
  "new",
  "nexora",
]);

const PII_PATTERN =
  /\b(?:address|home address|date of birth|birthday|\bage\b|years old|family|spouse|children|ssn|social security)\b/i;

export function emptyManagerIdentityContext(): ManagerIdentityContext {
  return freezeIdentity(buildIdentity({}));
}

export function identitySufficiencyOf(
  identity: Pick<
    ManagerIdentityContext,
    | "managerName"
    | "organizationName"
    | "role"
    | "responsibilities"
    | "domain"
    | "workContext"
    | "contextKind"
  >,
): IdentitySufficiency {
  const hasWho = Boolean(identity.managerName || identity.organizationName);
  const hasWork = Boolean(
    identity.role ||
      identity.workContext ||
      identity.responsibilities.length > 0,
  );
  const hasDomain = Boolean(identity.domain || identity.contextKind);
  if ((hasWho && hasWork && hasDomain) || (Boolean(identity.role) && Boolean(identity.domain))) {
    return "SUFFICIENT";
  }
  if (hasWho || hasWork || hasDomain) return "PARTIAL";
  return "INSUFFICIENT";
}

export function applyManagerIdentityUtterance(
  previous: ManagerIdentityContext,
  utterance: string,
): ManagerIdentityContext {
  const text = utterance.trim();
  if (!text) return previous;

  const extracted = extractIdentitySignals(text);
  const correction = extractCorrection(text, previous);
  const merged = mergeIdentity(previous, extracted, correction);
  return freezeIdentity(merged);
}

export function nextIdentityQuestionKey(
  identity: ManagerIdentityContext,
  askedQuestionKeys: readonly string[],
): string | null {
  if (identity.sufficiency === "SUFFICIENT") return null;
  const asked = new Set(askedQuestionKeys);
  const hasWho = Boolean(identity.managerName || identity.organizationName);
  const hasWork = Boolean(
    identity.role ||
      identity.workContext ||
      identity.responsibilities.length > 0,
  );
  const hasDomain = Boolean(identity.domain || identity.contextKind);

  if (!hasWho && !asked.has("who")) return "who";
  if (!hasWork && !asked.has("work")) return "work";
  if (!hasDomain && !asked.has("domain")) return "domain";
  if (!hasWho && !asked.has("who-follow")) return "who-follow";
  if (!hasWork && !asked.has("work-follow")) return "work-follow";
  return null;
}

export function questionTextForKey(key: string): string {
  if (key === "who" || key === "who-follow") {
    return "Who am I working with — you, a company, a team, or a project?";
  }
  if (key === "work" || key === "work-follow") {
    return "What do you currently manage or work on?";
  }
  if (key === "domain") {
    return "Are you currently treating this primarily as a company, a product, a project, or another kind of work?";
  }
  return "What else should I understand about the executive context you manage?";
}

export function isUnnecessaryPersonalDataUtterance(utterance: string): boolean {
  return PII_PATTERN.test(utterance);
}

export function extractGoalSignals(utterance: string): readonly string[] {
  const text = utterance.trim();
  const signals: string[] = [];
  const patterns = [
    /\b(?:we(?:'re| are)?|i(?:'m| am)?)\s+trying to\s+([^.;]+)/i,
    /\b(?:we|i)\s+want to\s+([^.;]+)/i,
    /\b(?:our |my )?goal is to\s+([^.;]+)/i,
    /\bneed to\s+([^.;]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) signals.push(cleanPhrase(match[1]));
  }
  return Object.freeze(signals.filter(Boolean));
}

export function describeKnownIdentity(identity: ManagerIdentityContext): string {
  const known = identity.sourceFacts.filter((fact) => fact.epistemic === "KNOWN");
  const inferred = identity.sourceFacts.filter(
    (fact) => fact.epistemic === "INFERRED",
  );
  if (known.length === 0 && inferred.length === 0) {
    return "I don’t currently have enough context about your role.";
  }
  const knownLine = known.length
    ? `Known: ${formatFacts(known)}.`
    : "Known: nothing confirmed yet.";
  const inferredLine = inferred.length
    ? ` Inferred, not confirmed: ${formatFacts(inferred)}.`
    : "";
  return `${knownLine}${inferredLine}`;
}

export function describeUnknownIdentity(identity: ManagerIdentityContext): string {
  if (identity.unknowns.length === 0) {
    return "I have enough executive context to continue.";
  }
  const labels = identity.unknowns.map(humanizeField).join(", ");
  return `Still unknown: ${labels}.`;
}

type PartialIdentity = {
  managerName?: string | null;
  organizationName?: string | null;
  role?: string | null;
  responsibilities?: readonly string[];
  domain?: string | null;
  domainEpistemic?: IdentityEpistemic;
  skills?: readonly string[];
  workContext?: string | null;
  contextKind?: ExecutiveContextKind | null;
  facts?: readonly IdentityFact[];
};

function extractIdentitySignals(utterance: string): PartialIdentity {
  const text = utterance.trim();
  if (isUnnecessaryPersonalDataUtterance(text) && !/\b(?:i(?:'m| am)|my name)\b/i.test(text)) {
    return {};
  }

  const facts: IdentityFact[] = [];
  const managerName = extractName(text);
  const organizationName = extractOrganizationName(text);
  const role = extractRole(text);
  const responsibilities = extractResponsibilities(text);
  const workContext = extractWorkContext(text);
  const skills = extractSkills(text);
  const contextKind = extractContextKind(text);
  const domainKnown = extractKnownDomain(text);
  const domainInferred =
    domainKnown == null ? inferDomain(text, organizationName, workContext) : null;

  if (managerName) {
    facts.push(fact("managerName", managerName, "KNOWN", "explicit-manager"));
  }
  if (organizationName) {
    facts.push(
      fact("organizationName", organizationName, "KNOWN", "explicit-manager"),
    );
  }
  if (role) facts.push(fact("role", role, "KNOWN", "explicit-manager"));
  for (const item of responsibilities) {
    facts.push(fact("responsibilities", item, "KNOWN", "explicit-manager"));
  }
  if (workContext) {
    facts.push(fact("workContext", workContext, "KNOWN", "explicit-manager"));
  }
  for (const skill of skills) {
    facts.push(fact("skills", skill, "KNOWN", "explicit-manager"));
  }
  if (contextKind) {
    facts.push(fact("contextKind", contextKind, "KNOWN", "explicit-manager"));
  }
  if (domainKnown) {
    facts.push(fact("domain", domainKnown, "KNOWN", "explicit-manager"));
  } else if (domainInferred) {
    facts.push(fact("domain", domainInferred, "INFERRED", "inferred"));
  }

  return {
    managerName,
    organizationName,
    role,
    responsibilities,
    workContext,
    skills,
    contextKind,
    domain: domainKnown ?? domainInferred,
    domainEpistemic: domainKnown
      ? "KNOWN"
      : domainInferred
        ? "INFERRED"
        : "UNKNOWN",
    facts,
  };
}

function extractCorrection(
  utterance: string,
  previous: ManagerIdentityContext,
): PartialIdentity | null {
  const text = utterance.trim();
  const actually = text.match(/^actually[,.]?\s+(.+)$/i);
  const notDomain = /\b(?:that(?:'s| is) not (?:our )?domain|not (?:our |the )?(?:domain|industry))\b/i.test(
    text,
  );
  if (!actually && !notDomain && !/\bwe(?:'re| are) (?:a |an )?/i.test(text)) {
    return null;
  }

  const rest = actually?.[1] ?? text;
  const kind = extractContextKind(rest);
  const knownDomain = extractKnownDomain(rest) ?? inferDomain(rest, null, rest);
  const org = extractOrganizationName(rest);
  const work = extractWorkContext(rest);
  const facts: IdentityFact[] = [];
  if (knownDomain) {
    facts.push(fact("domain", knownDomain, "KNOWN", "explicit-manager"));
  }
  if (kind) facts.push(fact("contextKind", kind, "KNOWN", "explicit-manager"));
  if (org) {
    facts.push(fact("organizationName", org, "KNOWN", "explicit-manager"));
  }
  if (work) facts.push(fact("workContext", work, "KNOWN", "explicit-manager"));
  if (facts.length === 0 && previous.domain) {
    return {
      domain: null,
      domainEpistemic: "UNKNOWN",
      facts: Object.freeze([
        fact("domain", previous.domain, "UNKNOWN", "explicit-manager"),
      ]),
    };
  }
  return {
    domain: knownDomain,
    domainEpistemic: knownDomain ? "KNOWN" : previous.domainEpistemic,
    contextKind: kind,
    organizationName: org,
    workContext: work,
    facts,
  };
}

function mergeIdentity(
  previous: ManagerIdentityContext,
  extracted: PartialIdentity,
  correction: PartialIdentity | null,
): Omit<ManagerIdentityContext, "personal" | "executive" | "currentWork" | "unknowns" | "confidence" | "sufficiency" | "sourceFacts"> & {
  sourceFacts: readonly IdentityFact[];
} {
  const explicit = correction
    ? { ...extracted, ...correction, facts: [...(extracted.facts ?? []), ...(correction.facts ?? [])] }
    : extracted;

  const managerName =
    explicit.managerName ?? previous.managerName;
  const organizationName =
    explicit.organizationName ?? previous.organizationName;
  const role = explicit.role ?? previous.role;
  const workContext = explicit.workContext ?? previous.workContext;
  const contextKind = explicit.contextKind ?? previous.contextKind;
  const responsibilities = unique([
    ...previous.responsibilities,
    ...(explicit.responsibilities ?? []),
  ]);
  const skills = unique([...previous.skills, ...(explicit.skills ?? [])]);

  let domain = previous.domain;
  let domainEpistemic = previous.domainEpistemic;
  if (explicit.domainEpistemic === "KNOWN" && explicit.domain) {
    domain = explicit.domain;
    domainEpistemic = "KNOWN";
  } else if (explicit.domain && domainEpistemic !== "KNOWN") {
    domain = explicit.domain;
    domainEpistemic = explicit.domainEpistemic ?? "INFERRED";
  }
  if (correction && correction.domain === null) {
    domain = null;
    domainEpistemic = "UNKNOWN";
  }

  const sourceFacts = mergeFacts(previous.sourceFacts, explicit.facts ?? []);
  return {
    managerName,
    organizationName,
    role,
    responsibilities,
    domain,
    domainEpistemic,
    skills,
    workContext,
    contextKind,
    sourceFacts,
  };
}

function buildIdentity(
  input: Partial<ManagerIdentityContext>,
): ManagerIdentityContext {
  const managerName = input.managerName ?? null;
  const organizationName = input.organizationName ?? null;
  const role = input.role ?? null;
  const responsibilities = input.responsibilities ?? [];
  const domain = input.domain ?? null;
  const domainEpistemic = input.domainEpistemic ?? (domain ? "INFERRED" : "UNKNOWN");
  const skills = input.skills ?? [];
  const workContext = input.workContext ?? null;
  const contextKind = input.contextKind ?? null;
  const sourceFacts = input.sourceFacts ?? [];
  const sufficiency = identitySufficiencyOf({
    managerName,
    organizationName,
    role,
    responsibilities,
    domain,
    workContext,
    contextKind,
  });
  const unknowns = resolveUnknowns({
    managerName,
    organizationName,
    role,
    responsibilities,
    domain,
    skills,
    workContext,
    contextKind,
  });
  const personal: ManagerPersonalIdentity = Object.freeze({
    managerName,
    role,
    skills,
  });
  const executive: ExecutiveIdentityContext = Object.freeze({
    kind: contextKind,
    organizationName,
    displayName: resolveDisplayName({
      managerName,
      organizationName,
      role,
      workContext,
      contextKind,
    }),
  });
  const currentWork: CurrentWorkContext = Object.freeze({
    workContext,
    responsibilities,
    domain,
    domainEpistemic,
  });
  const filled = [
    managerName,
    organizationName,
    role,
    domain,
    workContext,
    contextKind,
    responsibilities[0],
  ].filter(Boolean).length;
  return {
    managerName,
    organizationName,
    role,
    responsibilities,
    domain,
    domainEpistemic,
    skills,
    workContext,
    contextKind,
    personal,
    executive,
    currentWork,
    sourceFacts,
    unknowns,
    confidence: Math.min(1, filled / 3),
    sufficiency,
  };
}

function freezeIdentity(input: Partial<ManagerIdentityContext>): ManagerIdentityContext {
  const built = buildIdentity(input);
  return Object.freeze({
    ...built,
    responsibilities: Object.freeze([...built.responsibilities]),
    skills: Object.freeze([...built.skills]),
    sourceFacts: Object.freeze([...built.sourceFacts]),
    unknowns: Object.freeze([...built.unknowns]),
    personal: Object.freeze({ ...built.personal, skills: Object.freeze([...built.personal.skills]) }),
    executive: Object.freeze({ ...built.executive }),
    currentWork: Object.freeze({
      ...built.currentWork,
      responsibilities: Object.freeze([...built.currentWork.responsibilities]),
    }),
  });
}

export function resolveDisplayName(input: {
  readonly managerName: string | null;
  readonly organizationName: string | null;
  readonly role: string | null;
  readonly workContext: string | null;
  readonly contextKind: ExecutiveContextKind | null;
}): string {
  if (input.organizationName) return input.organizationName;
  if (input.managerName && input.role) {
    return `${input.managerName} · ${titleCase(input.role)}`;
  }
  if (input.managerName) return input.managerName;
  if (input.workContext) return titleCase(input.workContext);
  return "Executive Context";
}

function resolveUnknowns(input: {
  managerName: string | null;
  organizationName: string | null;
  role: string | null;
  responsibilities: readonly string[];
  domain: string | null;
  skills: readonly string[];
  workContext: string | null;
  contextKind: ExecutiveContextKind | null;
}): IdentityFieldName[] {
  const unknowns: IdentityFieldName[] = [];
  if (!input.managerName) unknowns.push("managerName");
  if (!input.organizationName) unknowns.push("organizationName");
  if (!input.role) unknowns.push("role");
  if (input.responsibilities.length === 0) unknowns.push("responsibilities");
  if (!input.domain) unknowns.push("domain");
  if (!input.workContext) unknowns.push("workContext");
  if (!input.contextKind) unknowns.push("contextKind");
  if (input.skills.length === 0) unknowns.push("skills");
  return unknowns;
}

function extractName(text: string): string | null {
  const named = text.match(/\bmy name is\s+([A-Za-z][A-Za-z'’-]{1,40})/i);
  if (named?.[1] && !NAME_REJECT.has(named[1].toLowerCase())) {
    return titleCase(named[1]);
  }
  const match = text.match(
    /\bi(?:'m| am)\s+([A-Za-z][A-Za-z'’-]{1,40})(?=\s*[.,]|$|\s+(?:and|i\b|i'm|i am|we\b))/i,
  );
  if (!match?.[1]) return null;
  const token = match[1];
  if (NAME_REJECT.has(token.toLowerCase())) return null;
  if (/^(responsible|trying|building|working|running|managing)$/i.test(token)) {
    return null;
  }
  return titleCase(token);
}

function extractOrganizationName(text: string): string | null {
  const patterns = [
    /\bi work (?:at|for)\s+([^.,;]+)/i,
    /\b(?:the )?company is\s+([^.,;]+)/i,
    /\bwe(?:'re| are) (?:called|named)\s+([^.,;]+)/i,
    /\bat\s+([A-Z][A-Za-z0-9&.'’ -]{1,50}?)(?=\s+and\b|[.,]|$)/,
    /\bi run\s+([A-Z][^.,;]+?)(?:\s+for\b|$)/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = cleanPhrase(match[1].replace(/\s+for managers$/i, ""));
      if (/^(a|an)\s+/i.test(value)) return null;
      if (/^(operations|delivery|capacity)/i.test(value)) return null;
      return value;
    }
  }
  return null;
}

function extractRole(text: string): string | null {
  const role = text.match(/\bmy role is\s+([^.,;]+)/i);
  if (role?.[1]) return cleanPhrase(role[1]);
  const titled = text.match(
    /\bi(?:'m| am) (?:the|an?)\s+([^.,;]+?)(?:\s+(?:at|for|in)\b|$)/i,
  );
  if (titled?.[1] && !/^(building|trying|working|running|managing|responsible)/i.test(titled[1])) {
    return cleanPhrase(titled[1]);
  }
  const run = text.match(/\bi run\s+([^.,;]+?)(?:\s+for\b)/i);
  if (run?.[1] && !/^(a|an)\s/i.test(run[1])) {
    return cleanPhrase(run[1]);
  }
  return null;
}

function extractResponsibilities(text: string): readonly string[] {
  const items: string[] = [];
  const responsible = text.match(
    /\bi(?:'m| am) responsible for\s+([^.,;]+)/i,
  );
  if (responsible?.[1]) items.push(cleanPhrase(responsible[1]));
  const mainly = text.match(/\bi mainly manage\s+([^.,;]+)/i);
  if (mainly?.[1]) items.push(cleanPhrase(mainly[1]));
  const run = text.match(/\bi run\s+([^.,;]+)/i);
  if (run?.[1]) items.push(cleanPhrase(run[1].replace(/\s+for\s+a\s+.+$/i, "")));
  const manage = text.match(/\bi manage\s+([^.,;]+)/i);
  if (manage?.[1]) items.push(cleanPhrase(manage[1]));
  return Object.freeze(unique(items));
}

function extractWorkContext(text: string): string | null {
  const building = text.match(/\bi(?:'m| am) building\s+([^.,;]+)/i);
  if (building?.[1]) return cleanPhrase(building[1]);
  const workOn = text.match(/\bi(?:'m| am) working on\s+([^.,;]+)/i);
  if (workOn?.[1]) return cleanPhrase(workOn[1]);
  const manage = text.match(/\bi manage\s+([^.,;]+)/i);
  if (manage?.[1]) return cleanPhrase(manage[1]);
  const run = text.match(/\bi run\s+([^.,;]+)/i);
  if (run?.[1]) return cleanPhrase(run[1]);
  const workAt = text.match(/\bi work at\s+([^.,;]+)/i);
  if (workAt?.[1]) return `work at ${cleanPhrase(workAt[1])}`;
  return null;
}

function extractSkills(text: string): readonly string[] {
  const match = text.match(
    /\bmy skills?(?: are| is| include)?\s+([^.,;]+)/i,
  );
  if (!match?.[1]) {
    const background = text.match(/\bbackground in\s+([^.,;]+)/i);
    if (!background?.[1]) return Object.freeze([]);
    return Object.freeze(splitList(background[1]));
  }
  return Object.freeze(splitList(match[1]));
}

function extractContextKind(text: string): ExecutiveContextKind | null {
  if (/\bproject\b/i.test(text)) return "PROJECT";
  if (/\bteam\b/i.test(text)) return "TEAM";
  if (/\bproduct\b/i.test(text) && /\bbusiness\b/i.test(text)) return "BUSINESS";
  if (/\bproduct\b/i.test(text)) return "BUSINESS";
  if (/\b(?:company|business)\b/i.test(text)) return "COMPANY";
  if (/\bfounder\b/i.test(text)) return "COMPANY";
  if (/\bclient|engagement\b/i.test(text)) return "OTHER";
  return null;
}

function extractKnownDomain(text: string): string | null {
  const explicit = text.match(
    /\b(?:we work in|our domain is|the domain is|industry is)\s+([^.,;]+)/i,
  );
  if (explicit?.[1]) return cleanPhrase(explicit[1]);
  const manufacturing = text.match(
    /\bwe(?:'re| are) a\s+([^.,;]+?)\s+company\b/i,
  );
  if (manufacturing?.[1]) return cleanPhrase(manufacturing[1]);
  return null;
}

function inferDomain(
  text: string,
  organizationName: string | null,
  workContext: string | null,
): string | null {
  const haystack = `${text} ${organizationName ?? ""} ${workContext ?? ""}`;
  const company = haystack.match(
    /\b(?:a|an|our)?\s*([A-Za-z][A-Za-z-]+)\s+(?:company|business|environment|industry)\b/i,
  );
  if (company?.[1] && !/^(the|this|that|our)$/i.test(company[1])) {
    return cleanPhrase(company[1]);
  }
  const projects = haystack.match(/\b([A-Za-z][A-Za-z-]+)\s+projects?\b/i);
  if (projects?.[1] && !/^(the|this|those|our|my)$/i.test(projects[1])) {
    return cleanPhrase(projects[1]);
  }
  return null;
}

function fact(
  field: IdentityFieldName,
  value: string,
  epistemic: IdentityEpistemic,
  source: IdentityFact["source"],
): IdentityFact {
  return Object.freeze({ field, value, epistemic, source });
}

function mergeFacts(
  previous: readonly IdentityFact[],
  incoming: readonly IdentityFact[],
): readonly IdentityFact[] {
  const next = [...previous];
  for (const fact of incoming) {
    if (fact.epistemic === "UNKNOWN") {
      const index = next.findIndex((entry) => entry.field === fact.field);
      if (index >= 0) next.splice(index, 1);
      continue;
    }
    const index = next.findIndex(
      (entry) => entry.field === fact.field && entry.value === fact.value,
    );
    if (index >= 0) {
      const existing = next[index];
      if (fact.epistemic === "KNOWN" || existing.epistemic !== "KNOWN") {
        next[index] = fact;
      }
    } else if (fact.epistemic === "KNOWN") {
      const inferred = next.findIndex(
        (entry) => entry.field === fact.field && entry.epistemic === "INFERRED",
      );
      if (inferred >= 0) next.splice(inferred, 1);
      next.push(fact);
    } else {
      next.push(fact);
    }
  }
  return Object.freeze(next);
}

function formatFacts(facts: readonly IdentityFact[]): string {
  return facts.map((fact) => `${humanizeField(fact.field)} = ${fact.value}`).join("; ");
}

function humanizeField(field: IdentityFieldName): string {
  if (field === "managerName") return "manager name";
  if (field === "organizationName") return "organization";
  if (field === "workContext") return "work context";
  if (field === "contextKind") return "context kind";
  return field;
}

function splitList(value: string): string[] {
  return unique(
    value
      .split(/\s*(?:,| and )\s*/i)
      .map((item) => cleanPhrase(item))
      .filter(Boolean),
  );
}

function unique(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function cleanPhrase(value: string): string {
  return value
    .replace(/\b(?:please|thanks|thank you)\b/gi, "")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) =>
      part.length === 0
        ? part
        : `${part[0].toUpperCase()}${part.slice(1)}`,
    )
    .join(" ");
}
