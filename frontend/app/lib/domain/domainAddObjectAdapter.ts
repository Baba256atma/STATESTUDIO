import { buildDomainObjectCatalog, type DomainObjectCatalogItem } from "./domainObjectCatalog.ts";
import type { DomainObjectTemplate, NexoraDomainId } from "./domainTypes.ts";

export type AddObjectMenuItem = {
  id: string;
  label: string;
  description: string;
  role: DomainObjectTemplate["role"];
  domainId: NexoraDomainId;
  templateId: string;
  iconHint: DomainObjectCatalogItem["suggestedShape"];
  colorHint: DomainObjectCatalogItem["suggestedColorToken"];
  targetPanel: DomainObjectCatalogItem["suggestedPanel"];
};

export function getAddObjectMenuItemsForDomain(domainId: unknown): AddObjectMenuItem[] {
  return buildDomainObjectCatalog(domainId).map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description,
    role: item.role,
    domainId: item.domainId,
    templateId: item.templateId,
    iconHint: item.suggestedShape,
    colorHint: item.suggestedColorToken,
    targetPanel: item.suggestedPanel,
  }));
}
