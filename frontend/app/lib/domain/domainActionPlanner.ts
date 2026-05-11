import type { DomainChatInterpretation } from "./domainChatIntents.ts";
import { domainActionDedupeSignature } from "./domainDedupe.ts";

export type PlannedDomainAction = {
  type:
    | "ADD_DOMAIN_OBJECT"
    | "CONNECT_DOMAIN_OBJECTS"
    | "OPEN_PANEL";
  confidence: number;
  payload?: unknown;
};

function actionKey(action: PlannedDomainAction): string {
  return domainActionDedupeSignature(action);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function dedupeActions(actions: PlannedDomainAction[]): PlannedDomainAction[] {
  const seen = new Set<string>();
  const result: PlannedDomainAction[] = [];

  for (const action of actions) {
    const key = actionKey(action);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      ...action,
      confidence: Number(clamp01(action.confidence).toFixed(2)),
    });
  }

  return result;
}

export function buildDomainActionPlan(
  interpretation: DomainChatInterpretation
): PlannedDomainAction[] {
  const actions: PlannedDomainAction[] = [];
  const domainId = interpretation.detectedDomainId;
  const entities = interpretation.entities.slice(0, 2);

  if (interpretation.intent === "create_object") {
    for (const entity of entities) {
      if (!entity.matchedTemplateId) continue;
      actions.push({
        type: "ADD_DOMAIN_OBJECT",
        confidence: Math.min(interpretation.confidence, entity.confidence),
        payload: {
          domainId,
          templateId: entity.matchedTemplateId,
          label: entity.label,
          source: "chat_inferred",
          preferredPosition: "auto",
        },
      });
    }
  }

  if (interpretation.intent === "connect_objects" && interpretation.entities.length >= 2) {
    const [source, target] = interpretation.entities;
    actions.push({
      type: "CONNECT_DOMAIN_OBJECTS",
      confidence: Math.min(interpretation.confidence, source?.confidence ?? 0, target?.confidence ?? 0),
      payload: {
        domainId,
        sourceTemplateId: source?.matchedTemplateId,
        targetTemplateId: target?.matchedTemplateId,
        sourceLabel: source?.label,
        targetLabel: target?.label,
      },
    });
  }

  if (interpretation.intent === "analyze_risk") {
    actions.push({
      type: "OPEN_PANEL",
      confidence: interpretation.confidence,
      payload: { panel: "risk", domainId },
    });
  }

  if (interpretation.intent === "open_panel") {
    actions.push({
      type: "OPEN_PANEL",
      confidence: interpretation.confidence,
      payload: { panel: "objects", domainId },
    });
  }

  return dedupeActions(actions);
}
