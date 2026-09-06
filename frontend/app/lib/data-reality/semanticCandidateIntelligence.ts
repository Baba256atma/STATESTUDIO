/**
 * DATA-ADV:2 — bounded, read-only semantic candidate intelligence.
 *
 * This resolver does not own or write field meaning. Canonical schema mappings
 * and manager-confirmed meanings remain authoritative in the RDI mapping.
 */
export const semanticCandidateIntelligenceIdentity = "DATA-ADV:2/SemanticCandidateIntelligence" as const;

export type SemanticCandidateState = "AUTHORITATIVE" | "MANAGER_CONFIRMED" | "LIKELY" | "AMBIGUOUS" | "UNKNOWN";
export type SemanticEvidenceKind =
  | "authoritative-mapping"
  | "manager-confirmation"
  | "canonical-concept"
  | "term-structure"
  | "domain-context"
  | "source-context"
  | "neighbor-confirmed-meaning";

export type SemanticCandidate = Readonly<{ meaning: string; evidence: readonly SemanticEvidenceKind[] }>;
export type SemanticCandidateResolution = Readonly<{
  state: SemanticCandidateState;
  candidates: readonly SemanticCandidate[];
  requiresConfirmation: boolean;
  explanation: string;
  authority: typeof semanticCandidateIntelligenceIdentity;
}>;

export type SemanticCandidateContext = Readonly<{
  term: string;
  sourceLabel: string;
  domain?: string | null;
  confirmedMeaning?: string | null;
  canonicalProposedMeaning?: string | null;
  confirmationSource?: "manager" | "authoritative-mapping" | "none";
  neighboringConfirmedMeanings?: readonly string[];
}>;

type Concept = Readonly<{ label: string; words: readonly string[]; domains: readonly string[] }>;

// Reusable business concepts, not source-column mappings. Terms are composed
// and ranked in context; none of these concepts can become confirmed truth.
const CANONICAL_CONCEPTS: readonly Concept[] = Object.freeze([
  { label: "Available Capacity", words: ["available", "capacity"], domains: ["production", "manufacturing", "operations"] },
  { label: "Capacity Availability", words: ["capacity", "availability"], domains: ["production", "manufacturing", "operations"] },
  { label: "Actual Value", words: ["actual", "value"], domains: ["finance", "project", "budget"] },
  { label: "Average Value", words: ["average", "value"], domains: ["analytics"] },
  { label: "Order Quantity", words: ["order", "quantity"], domains: ["orders", "shipping", "operations"] },
  { label: "Gross Margin Percent", words: ["gross", "margin", "percent"], domains: ["finance", "business"] },
  { label: "Revenue Variance", words: ["revenue", "variance"], domains: ["finance", "business"] },
  { label: "Schedule Variance", words: ["schedule", "variance"], domains: ["project"] },
  { label: "Resource Availability", words: ["resource", "availability"], domains: ["project"] },
  { label: "Cost Variance", words: ["cost", "variance"], domains: ["finance", "project"] },
  { label: "Delivery Performance", words: ["delivery", "performance"], domains: ["shipping", "operations"] },
  { label: "Late Order Rate", words: ["late", "order", "rate"], domains: ["orders", "shipping"] },
  { label: "Planned vs Actual", words: ["planned", "versus", "actual"], domains: ["project", "finance"] },
  { label: "Earned Value", words: ["earned", "value"], domains: ["project"] },
]);

const LEXEMES: Readonly<Record<string, readonly string[]>> = Object.freeze({
  act: ["actual"], actual: ["actual"], av: ["available", "availability", "average", "actual", "value"], avail: ["available", "availability"], available: ["available"], availability: ["availability"], avg: ["average"],
  cap: ["capacity"], capacity: ["capacity"], cost: ["cost"], delivery: ["delivery"], earned: ["earned"], gross: ["gross"], gm: ["gross", "margin"], late: ["late"], margin: ["margin"],
  ord: ["order"], order: ["order"], pct: ["percent"], percent: ["percent"], perf: ["performance"], performance: ["performance"], planned: ["planned"], qty: ["quantity"], quantity: ["quantity"],
  res: ["resource"], resource: ["resource"], rev: ["revenue"], revenue: ["revenue"], sch: ["schedule"], schedule: ["schedule"], val: ["value"], value: ["value"], var: ["variance"], variance: ["variance"], vs: ["versus"],
});

function words(value: string): readonly string[] {
  const separated = value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!separated) return [];
  const direct = separated.split(/\s+/);
  if (direct.length > 1 || LEXEMES[direct[0]!]) return direct;
  const compact = direct[0]!;
  const known = Object.keys(LEXEMES).filter((entry) => entry.length > 2).sort((a, b) => b.length - a.length);
  const result: string[] = [];
  let rest = compact;
  while (rest) {
    const match = known.find((entry) => rest.startsWith(entry));
    if (!match) return direct;
    result.push(match);
    rest = rest.slice(match.length);
  }
  return result;
}

function expandedSet(term: string): ReadonlySet<string> {
  return new Set(words(term).flatMap((word) => LEXEMES[word] ?? [word]));
}

function contextSet(input: SemanticCandidateContext): ReadonlySet<string> {
  return new Set(words(`${input.domain ?? ""} ${input.sourceLabel} ${(input.neighboringConfirmedMeanings ?? []).join(" ")}`).flatMap((word) => LEXEMES[word] ?? [word]));
}

export function resolveSemanticCandidates(input: SemanticCandidateContext): SemanticCandidateResolution {
  const confirmed = input.confirmedMeaning?.trim();
  if (confirmed && input.confirmationSource !== "none") {
    const state = input.confirmationSource === "manager" ? "MANAGER_CONFIRMED" : "AUTHORITATIVE";
    const evidence: readonly SemanticEvidenceKind[] = Object.freeze([input.confirmationSource === "manager" ? "manager-confirmation" : "authoritative-mapping"]);
    return Object.freeze({ state, candidates: Object.freeze([{ meaning: confirmed, evidence }]), requiresConfirmation: false, explanation: input.confirmationSource === "manager" ? "The manager previously confirmed this meaning for this source." : "The existing authoritative mapping supplies this meaning.", authority: semanticCandidateIntelligenceIdentity });
  }

  const canonicalProposal = input.canonicalProposedMeaning?.trim();
  if (canonicalProposal) {
    const evidence: readonly SemanticEvidenceKind[] = Object.freeze(["canonical-concept", "term-structure"]);
    return Object.freeze({ state: "LIKELY", candidates: Object.freeze([{ meaning: canonicalProposal, evidence }]), requiresConfirmation: true, explanation: `The term structure matches the existing canonical concept ${canonicalProposal}. That match is a candidate, not a confirmed meaning.`, authority: semanticCandidateIntelligenceIdentity });
  }

  const termWords = words(input.term);
  if (termWords.length === 0 || termWords.some((word) => /\d/.test(word)) || termWords.some((word) => !LEXEMES[word])) {
    return Object.freeze({ state: "UNKNOWN", candidates: Object.freeze([]), requiresConfirmation: true, explanation: "The field identity is known, but bounded business vocabulary and context do not support a meaning.", authority: semanticCandidateIntelligenceIdentity });
  }
  const expanded = expandedSet(input.term);
  const context = contextSet(input);
  const matches = CANONICAL_CONCEPTS.map((concept) => {
    const everyConceptWordCovered = concept.words.every((word) => expanded.has(word));
    const everyTermWordContributes = termWords.every((word) => (LEXEMES[word] ?? [word]).some((sense) => concept.words.includes(sense)));
    const covered = everyConceptWordCovered && everyTermWordContributes;
    const domainSupport = concept.domains.filter((word) => context.has(word)).length;
    const neighborSupport = (input.neighboringConfirmedMeanings ?? []).some((meaning) => concept.words.some((word) => words(meaning).includes(word)));
    const evidence: SemanticEvidenceKind[] = ["canonical-concept", "term-structure"];
    if (domainSupport) evidence.push("domain-context");
    if (words(input.sourceLabel).some((word) => concept.domains.includes(word))) evidence.push("source-context");
    if (neighborSupport) evidence.push("neighbor-confirmed-meaning");
    return { concept, covered, score: domainSupport * 2 + (neighborSupport ? 2 : 0), evidence: Object.freeze([...new Set(evidence)]) };
  }).filter((entry) => entry.covered);
  if (matches.length === 0) return Object.freeze({ state: "UNKNOWN", candidates: Object.freeze([]), requiresConfirmation: true, explanation: "The field identity is known, but bounded business vocabulary and context do not support a meaning.", authority: semanticCandidateIntelligenceIdentity });
  const best = Math.max(...matches.map((entry) => entry.score));
  const winners = matches.filter((entry) => entry.score === best);
  const candidates = Object.freeze(winners.map((entry) => Object.freeze({ meaning: entry.concept.label, evidence: entry.evidence })));
  const evidenceLabels = [...new Set(winners.flatMap((entry) => entry.evidence))];
  const explanation = `The term structure supports ${candidates.map((entry) => entry.meaning).join(" or ")}${evidenceLabels.includes("neighbor-confirmed-meaning") ? ", and confirmed neighboring fields support the same business vocabulary" : ""}${evidenceLabels.includes("source-context") || evidenceLabels.includes("domain-context") ? "; the source context also supports that interpretation" : ""}. This is evidence, not confirmation.`;
  return Object.freeze({ state: winners.length === 1 ? "LIKELY" : "AMBIGUOUS", candidates, requiresConfirmation: true, explanation, authority: semanticCandidateIntelligenceIdentity });
}
