/** WS-5:3 — Dynamically derived model inventory and source registry. */
import { ScenarioWorkspaceCompositionModels } from "./scenarioWorkspaceCompositionModels.ts";
import { ScenarioWorkspaceDomainModels } from "./scenarioWorkspaceDomainModels.ts";
import { ScenarioWorkspaceMetadataModels } from "./scenarioWorkspaceMetadataModels.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";
import { ScenarioWorkspaceRelationshipModels } from "./scenarioWorkspaceRelationshipModels.ts";

export const ScenarioWorkspaceModelRegistry = Object.freeze({
  domainModels: ScenarioWorkspaceDomainModels,
  relationshipModels: ScenarioWorkspaceRelationshipModels,
  compositionModels: ScenarioWorkspaceCompositionModels,
  metadataModels: ScenarioWorkspaceMetadataModels,
  sourceRegistry: ScenarioWorkspaceRegistry,
  domainModelCount: ScenarioWorkspaceDomainModels.length,
  relationshipModelCount: ScenarioWorkspaceRelationshipModels.length,
  compositionModelCount: ScenarioWorkspaceCompositionModels.length,
  metadataModelCount: ScenarioWorkspaceMetadataModels.length,
  totalModelCount:
    ScenarioWorkspaceDomainModels.length
    + ScenarioWorkspaceRelationshipModels.length
    + ScenarioWorkspaceCompositionModels.length
    + ScenarioWorkspaceMetadataModels.length,
  deterministic: true,
  immutable: true,
} as const);
