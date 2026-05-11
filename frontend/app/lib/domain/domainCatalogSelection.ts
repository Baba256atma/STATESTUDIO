import type { AddObjectMenuItem } from "./domainAddObjectAdapter.ts";
import {
  insertDomainObjectIntoScene,
  type DomainSceneInsertionResult,
} from "./domainSceneInsertion.ts";

export function applyDomainCatalogSelectionToScene(params: {
  currentScene: unknown;
  item: AddObjectMenuItem;
}): DomainSceneInsertionResult {
  return insertDomainObjectIntoScene({
    currentScene: params.currentScene,
    creationRequest: {
      domainId: params.item.domainId,
      templateId: params.item.templateId,
      label: params.item.label,
      source: "user_add",
      preferredPosition: "auto",
    },
  });
}
