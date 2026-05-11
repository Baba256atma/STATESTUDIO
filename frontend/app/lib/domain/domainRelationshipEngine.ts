import { getDomainDefinition } from "./domainRegistry.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import type { DomainObjectTemplate, DomainRelationshipTemplate } from "./domainTypes.ts";
import type { SceneObject } from "../sceneTypes.ts";

export type DomainRelationshipMatch = {
  templateId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  confidence: number;
};

export type DomainRelationshipGenerationResult = {
  relationships: DomainRelationshipMatch[];
  warnings?: string[];
};

const MAX_RELATIONSHIPS = 24;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function objectId(object: unknown): string {
  return String(asRecord(object).id ?? "").trim();
}

function objectRole(object: unknown): DomainObjectTemplate["role"] | null {
  const record = asRecord(object);
  const meta = asRecord(record.meta);
  const semantic = asRecord(record.semantic);
  const raw = String(meta.semanticRole ?? semantic.role ?? record.role ?? "").trim();
  return isDomainObjectRole(raw) ? raw : null;
}

function isDomainObjectRole(value: string): value is DomainObjectTemplate["role"] {
  return [
    "core",
    "input",
    "process",
    "constraint",
    "risk",
    "decision",
    "output",
    "monitor",
  ].includes(value);
}

function confidenceForTemplate(template: DomainRelationshipTemplate): number {
  const strength = typeof template.strength === "number" && Number.isFinite(template.strength) ? template.strength : 0.62;
  const priorityBoost =
    template.visualPriority === "high" ? 0.12 :
      template.visualPriority === "medium" ? 0.06 :
        0;
  return Math.min(0.95, Math.max(0.35, Number((strength + priorityBoost).toFixed(2))));
}

function shouldSkipPair(template: DomainRelationshipTemplate, sourceIndex: number, targetIndex: number): boolean {
  if (sourceIndex === targetIndex) return true;
  if (template.fromRole === template.toRole) return sourceIndex > targetIndex;
  return false;
}

export function generateDomainRelationships(params: {
  domainId: unknown;
  objects: unknown[];
}): DomainRelationshipGenerationResult {
  try {
    const domainId = normalizeDomainId(params.domainId);
    const domain = getDomainDefinition(domainId);
    const objects = Array.isArray(params.objects) ? params.objects : [];
    const matches: DomainRelationshipMatch[] = [];
    const seen = new Set<string>();

    for (const template of domain.relationshipTemplates) {
      for (let sourceIndex = 0; sourceIndex < objects.length; sourceIndex += 1) {
        const source = objects[sourceIndex] as SceneObject;
        const sourceId = objectId(source);
        if (!sourceId || objectRole(source) !== template.fromRole) continue;

        for (let targetIndex = 0; targetIndex < objects.length; targetIndex += 1) {
          if (shouldSkipPair(template, sourceIndex, targetIndex)) continue;
          const target = objects[targetIndex] as SceneObject;
          const targetId = objectId(target);
          if (!targetId || objectRole(target) !== template.toRole) continue;

          const key = `${sourceId}|${targetId}|${template.relationshipType}`;
          if (seen.has(key)) continue;
          seen.add(key);
          matches.push({
            templateId: template.id,
            sourceObjectId: sourceId,
            targetObjectId: targetId,
            relationshipType: template.relationshipType,
            confidence: confidenceForTemplate(template),
          });
          if (matches.length >= MAX_RELATIONSHIPS) {
            return {
              relationships: matches,
              warnings: ["relationship_generation_capped"],
            };
          }
        }
      }
    }

    return { relationships: matches };
  } catch {
    return {
      relationships: [],
      warnings: ["relationship_generation_failed"],
    };
  }
}
