import { getDomainDefinition } from "./domainRegistry.ts";
import { normalizeDomainId } from "./domainHelpers.ts";
import type { DomainObjectTemplate, NexoraDomainId } from "./domainTypes.ts";

export type DomainObjectCatalogItem = {
  id: string;
  domainId: NexoraDomainId;
  templateId: string;
  label: string;
  role: DomainObjectTemplate["role"];
  description: string;
  aliases: string[];
  defaultImportance: number;
  suggestedShape:
    | "core"
    | "sphere"
    | "cube"
    | "diamond"
    | "ring"
    | "node"
    | "shield"
    | "signal"
    | "flow";
  suggestedPanel:
    | "objects"
    | "focus"
    | "risk"
    | "scenario"
    | "dashboard";
  suggestedColorToken:
    | "neutral"
    | "blue"
    | "green"
    | "amber"
    | "red"
    | "purple"
    | "cyan";
};

export function getSuggestedVisualForRole(
  role: DomainObjectTemplate["role"]
): Pick<DomainObjectCatalogItem, "suggestedShape" | "suggestedColorToken" | "suggestedPanel"> {
  switch (role) {
    case "core":
      return { suggestedShape: "core", suggestedColorToken: "purple", suggestedPanel: "dashboard" };
    case "input":
      return { suggestedShape: "node", suggestedColorToken: "blue", suggestedPanel: "objects" };
    case "process":
      return { suggestedShape: "flow", suggestedColorToken: "cyan", suggestedPanel: "focus" };
    case "constraint":
      return { suggestedShape: "ring", suggestedColorToken: "amber", suggestedPanel: "risk" };
    case "risk":
      return { suggestedShape: "shield", suggestedColorToken: "red", suggestedPanel: "risk" };
    case "decision":
      return { suggestedShape: "diamond", suggestedColorToken: "purple", suggestedPanel: "scenario" };
    case "output":
      return { suggestedShape: "sphere", suggestedColorToken: "green", suggestedPanel: "dashboard" };
    case "monitor":
      return { suggestedShape: "signal", suggestedColorToken: "cyan", suggestedPanel: "dashboard" };
    default:
      return { suggestedShape: "node", suggestedColorToken: "neutral", suggestedPanel: "objects" };
  }
}

export function buildDomainObjectCatalog(domainId: unknown): DomainObjectCatalogItem[] {
  const normalizedDomainId = normalizeDomainId(domainId);
  const domain = getDomainDefinition(normalizedDomainId);

  return domain.objectTemplates.map((template) => {
    const visual = getSuggestedVisualForRole(template.role);
    return {
      id: `${normalizedDomainId}:${template.id}`,
      domainId: normalizedDomainId,
      templateId: template.id,
      label: template.label,
      role: template.role,
      description: template.description,
      aliases: [...template.aliases],
      defaultImportance: template.defaultImportance,
      ...visual,
    };
  });
}
