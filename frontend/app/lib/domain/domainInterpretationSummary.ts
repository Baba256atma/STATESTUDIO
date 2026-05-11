import type { DomainChatInterpretation } from "./domainChatIntents.ts";
import { getDomainDefinition } from "./domainRegistry.ts";

export function summarizeDomainInterpretation(
  interpretation: DomainChatInterpretation
): string {
  const domain = getDomainDefinition(interpretation.detectedDomainId);
  const entityLabels = interpretation.entities.map((entity) => entity.label).slice(0, 2);
  if (!entityLabels.length) {
    return `Detected ${domain.name} domain with no specific domain objects.`;
  }

  const joined =
    entityLabels.length === 1
      ? entityLabels[0]
      : `${entityLabels.slice(0, -1).join(", ")} and ${entityLabels[entityLabels.length - 1]}`;
  return `Detected ${domain.name} domain with references to ${joined}.`;
}
