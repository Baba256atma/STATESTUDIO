import { getDomainDefinition, listDomainDefinitions } from "./domainRegistry.ts";
import { inferDomainFromText, normalizeDomainId } from "./domainHelpers.ts";
import type { DomainChatEntity } from "./domainChatIntents.ts";
import type { DomainObjectTemplate, NexoraDomainId } from "./domainTypes.ts";

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function includesPhrase(text: string, phrase: string): boolean {
  const normalizedPhrase = normalizeText(phrase);
  return Boolean(normalizedPhrase) && text.includes(normalizedPhrase);
}

function matchScore(text: string, template: DomainObjectTemplate): number {
  let score = 0;
  if (includesPhrase(text, template.label)) score += 0.72;
  for (const alias of template.aliases) {
    if (includesPhrase(text, alias)) score += alias.length > 6 ? 0.42 : 0.32;
  }
  return Math.min(0.95, score);
}

function entityFromTemplate(
  domainId: NexoraDomainId,
  template: DomainObjectTemplate,
  confidence: number
): DomainChatEntity {
  return {
    label: template.label,
    matchedTemplateId: template.id,
    matchedDomainId: domainId,
    confidence: Math.min(1, Math.max(0, Number(confidence.toFixed(2)))),
  };
}

function dedupeEntities(entities: DomainChatEntity[]): DomainChatEntity[] {
  const seen = new Set<string>();
  const deduped: DomainChatEntity[] = [];

  for (const entity of entities) {
    const templateKey = entity.matchedTemplateId ?? "";
    const labelKey = normalizeText(entity.label);
    if ((templateKey && seen.has(templateKey)) || (labelKey && seen.has(`label:${labelKey}`))) continue;
    if (templateKey) seen.add(templateKey);
    if (labelKey) seen.add(`label:${labelKey}`);
    deduped.push(entity);
  }

  return deduped;
}

export function extractDomainEntities(params: {
  text: string;
  domainId?: unknown;
}): DomainChatEntity[] {
  const text = normalizeText(params.text);
  if (!text) return [];

  const primaryDomainId = params.domainId === undefined ? inferDomainFromText(text) : normalizeDomainId(params.domainId);
  const candidateDomains = [
    getDomainDefinition(primaryDomainId),
    ...listDomainDefinitions().filter((domain) => domain.id !== primaryDomainId),
  ];
  const entities: DomainChatEntity[] = [];

  for (const domain of candidateDomains) {
    for (const template of domain.objectTemplates) {
      const score = matchScore(text, template);
      if (score <= 0) continue;
      const domainBoost = domain.id === primaryDomainId ? 0.08 : 0;
      entities.push(entityFromTemplate(domain.id, template, score + domainBoost));
    }
  }

  return dedupeEntities(entities)
    .sort((left, right) => right.confidence - left.confidence || text.indexOf(normalizeText(left.label)) - text.indexOf(normalizeText(right.label)))
    .slice(0, 6);
}
