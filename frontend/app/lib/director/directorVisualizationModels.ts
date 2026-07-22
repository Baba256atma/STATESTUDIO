import type { DirectorModelDefinition } from "./directorModelTypes.ts";

export const DirectorVisualizationModels: readonly DirectorModelDefinition[] = Object.freeze([
  Object.freeze({
    id: "DIRECTOR-1:3/Model/VisualizationPlan", type: "VisualizationPlan",
    version: "1.0.0", namespace: "nexora.director.model.visualizationplan",
    status: "Model", stability: "Stable",
    registryReference: "DIRECTOR-1:2/VisualizationIntentType",
    fields: Object.freeze(["id", "visualizationIntent", "priority", "emphasis", "highlightTargetRefs", "comparisonMode", "simulationMode"]),
    deterministicOrder: 7, metadataOnly: true, immutable: true,
  }),
  Object.freeze({
    id: "DIRECTOR-1:3/Model/ExecutiveFocus", type: "ExecutiveFocus",
    version: "1.0.0", namespace: "nexora.director.model.executivefocus",
    status: "Model", stability: "Stable",
    registryReference: "DIRECTOR-1:2/ExecutiveFocusType",
    fields: Object.freeze(["id", "focusType", "targetRefs", "priority"]),
    deterministicOrder: 8, metadataOnly: true, immutable: true,
  }),
]);

