import { normalizeExecutiveNarrativeText } from "./executiveNarrativeLanguage.ts";
import type { ExecutiveNarrativeTone } from "./narrativeSynthesisTypes.ts";

export function deriveStrategicMeaning(params: {
  focus: string;
  tone: ExecutiveNarrativeTone;
  relatedObjectIds?: string[];
  domainId?: string;
}): string {
  const focus = normalizeExecutiveNarrativeText(params.focus) || "This operating theme";
  const objectCount = Array.isArray(params.relatedObjectIds) ? params.relatedObjectIds.length : 0;
  const scope = objectCount > 1 ? "across connected operating dependencies" : "within the active operating context";
  const domainPhrase = params.domainId ? ` in ${params.domainId.replace(/_/g, " ")}` : "";

  if (params.tone === "urgent") {
    return `${focus} matters because it may concentrate executive exposure ${scope}${domainPhrase}.`;
  }
  if (params.tone === "cautionary") {
    return `${focus} matters because unresolved pressure can weaken operational resilience ${scope}${domainPhrase}.`;
  }
  if (params.tone === "stabilizing") {
    return `${focus} matters because improving conditions can create room for controlled monitoring ${scope}${domainPhrase}.`;
  }
  if (params.tone === "strategic") {
    return `${focus} matters because it links multiple intelligence signals into one decision-relevant operating pattern${domainPhrase}.`;
  }
  return `${focus} matters because it adds context to the executive operating picture${domainPhrase}.`;
}
