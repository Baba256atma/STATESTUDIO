import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import {
  getScenarioAuthoringUiView,
  resetScenarioAuthoringUiRuntimeForTests,
  syncScenarioAuthoringUi,
} from "../ui/mrpWorkspace/scenario/scenarioAuthoringUiRuntime.ts";
import {
  SCENARIO_AUTHORING_UI_DIAGNOSTIC,
  SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC,
  S1_UI_BINDING_COMPLETE_TAG,
} from "../ui/mrpWorkspace/scenario/scenarioAuthoringUiContract.ts";
import {
  buildAssistantScenarioAuthoringAssistance,
  resetAssistantScenarioAuthoringBridgeForTests,
} from "./AssistantScenarioAuthoringBridge.ts";
import {
  ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC,
  ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  S1_ASSISTANT_BRIDGE_COMPLETE_TAG,
} from "./assistantScenarioAuthoringBridgeContract.ts";
import {
  buildScenarioDraft,
  SCENARIO_AUTHORING_CONTRACT,
  SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC,
  SCENARIO_AUTHORING_READY_DIAGNOSTIC,
  S1_AUTHORING_CONTRACT_COMPLETE_TAG,
} from "./scenarioAuthoringContract.ts";
import {
  buildScenarioDraftFromInput,
  resetScenarioDraftBuilderForTests,
} from "./ScenarioDraftBuilder.ts";
import {
  SCENARIO_DRAFT_BASELINE_SCENARIO_ID,
  SCENARIO_DRAFT_BUILDER_DIAGNOSTIC,
  SCENARIO_DRAFT_READY_DIAGNOSTIC,
  S1_DRAFT_BUILDER_COMPLETE_TAG,
} from "./scenarioDraftBuilderContract.ts";
import {
  archiveScenarioDraftRegistryEntry,
  createScenarioDraftRegistryEntry,
  readScenarioDraftRegistryEntry,
  resetScenarioDraftRegistryForTests,
  updateScenarioDraftRegistryEntry,
} from "./ScenarioDraftRegistry.ts";
import { S1_REGISTRY_COMPLETE_TAG } from "./scenarioDraftRegistryContract.ts";
import {
  buildScenarioInputModel,
  resetScenarioInputModelForTests,
  serializeScenarioInputModel,
} from "./ScenarioInputModel.ts";
import {
  SCENARIO_INPUT_MODEL_DIAGNOSTIC,
  SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC,
  S1_INPUT_MODEL_COMPLETE_TAG,
} from "./scenarioInputModelContract.ts";
import {
  validateScenarioDraft,
  resetScenarioValidationEngineForTests,
} from "./ScenarioValidationEngine.ts";
import {
  SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC,
  SCENARIO_VALIDATION_READY_DIAGNOSTIC,
  S1_VALIDATION_COMPLETE_TAG,
} from "./scenarioValidationEngineContract.ts";
import {
  SCENARIO_AUTHORING_COMPLETE_TAG,
  S1_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  S1_CERTIFICATION_FREEZE_TAGS,
  S1_CERTIFIED_TAG,
  S1_SCENARIO_AUTHORING_CERTIFICATION_TAG,
  type ScenarioAuthoringCertificationGate,
  type ScenarioAuthoringCertificationResult,
} from "./scenarioAuthoringCertificationContract.ts";
import { resetExecutiveScenarioSummaryForTests } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import { resetScenarioGenerationRuntimeForTests } from "../scenario-intelligence/ScenarioGenerationRuntime.ts";
import { resetObjectIntelligenceRuntimeForTests } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { resetRelationshipIntelligenceRuntimeForTests } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { resetKpiIntelligenceRuntimeForTests } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { resetRiskIntelligenceRuntimeForTests } from "../risk-intelligence/RiskIntelligenceRuntime.ts";

const CERTIFICATION_SCENE = Object.freeze({
  scene: {
    objects: [
      { id: "supplier-1", label: "Primary Supplier", type: "supplier" },
      { id: "inventory-1", label: "Inventory", type: "inventory" },
    ],
    relationships: [
      {
        id: "rel-supply",
        sourceId: "supplier-1",
        targetId: "inventory-1",
        type: "supplies",
      },
    ],
    kpis: [{ id: "revenue", label: "Revenue", category: "Revenue", value: 80 }],
    risks: [{ id: "delay-risk", label: "Delay Risk", severity: 75 }],
  },
});

const FRONTEND_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const S1_TEST_FILES = Object.freeze([
  "app/lib/scenario-authoring/scenarioAuthoringContract.test.ts",
  "app/lib/scenario-authoring/ScenarioInputModel.test.ts",
  "app/lib/scenario-authoring/ScenarioDraftBuilder.test.ts",
  "app/lib/scenario-authoring/ScenarioValidationEngine.test.ts",
  "app/lib/scenario-authoring/ScenarioDraftRegistry.test.ts",
  "app/lib/scenario-authoring/AssistantScenarioAuthoringBridge.test.ts",
  "app/lib/ui/mrpWorkspace/scenario/scenarioAuthoringUiCertification.test.ts",
] as const);

function resetCertificationRuntime(): void {
  resetScenarioAuthoringUiRuntimeForTests();
  resetAssistantScenarioAuthoringBridgeForTests();
  resetScenarioDraftBuilderForTests();
  resetScenarioDraftRegistryForTests();
  resetScenarioInputModelForTests();
  resetScenarioValidationEngineForTests();
  resetExecutiveScenarioSummaryForTests();
  resetScenarioGenerationRuntimeForTests();
  resetObjectIntelligenceRuntimeForTests();
  resetRelationshipIntelligenceRuntimeForTests();
  resetKpiIntelligenceRuntimeForTests();
  resetRiskIntelligenceRuntimeForTests();
}

function gate(
  id: ScenarioAuthoringCertificationGate["id"],
  name: string,
  failures: readonly string[]
): ScenarioAuthoringCertificationGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

type GuardModule = Readonly<{
  sceneMutation?: boolean;
  routingMutation?: boolean;
  topologyMutation?: boolean;
  dsMutation?: boolean;
  simulationActive?: boolean;
  intelligenceMutation?: boolean;
}>;

function buildCertificationDraft() {
  return buildScenarioDraft({
    draftId: "scenario-draft:cert",
    name: "Supplier Delay Risk",
    summary: "Certification scenario draft.",
    description: "S-1 certification draft record.",
    scenarioType: "risk",
    assumptions: ["Baseline reference preserved."],
    focusObjectIds: ["supplier-1"],
  });
}

function buildCertificationInputModel() {
  return buildScenarioInputModel({
    draftId: "scenario-draft:cert",
    objectChanges: [
      {
        targetId: "supplier-1",
        field: "active",
        proposedValue: "false",
      },
    ],
    relationshipChanges: [
      {
        targetId: "rel-supply",
        field: "dependency",
        proposedValue: "95",
      },
    ],
    kpiChanges: [
      {
        targetId: "revenue",
        field: "value",
        proposedValue: "72",
      },
    ],
    riskChanges: [
      {
        targetId: "delay-risk",
        field: "severity",
        proposedValue: "85",
      },
    ],
  });
}

export function runScenarioAuthoringCertification(): ScenarioAuthoringCertificationResult {
  resetCertificationRuntime();

  const gates: ScenarioAuthoringCertificationGate[] = [];
  const draft = buildCertificationDraft();
  const inputModel = buildCertificationInputModel();

  const contractFailures: string[] = [];
  if (S1_AUTHORING_CONTRACT_COMPLETE_TAG !== "[S1_AUTHORING_CONTRACT_COMPLETE]") {
    contractFailures.push("S1_AUTHORING_CONTRACT_COMPLETE tag missing");
  }
  if (!SCENARIO_AUTHORING_CONTRACT.diagnostics.includes(SCENARIO_AUTHORING_CONTRACT_DIAGNOSTIC)) {
    contractFailures.push("Authoring contract missing SCENARIO_AUTHORING_CONTRACT diagnostic");
  }
  if (!SCENARIO_AUTHORING_CONTRACT.diagnostics.includes(SCENARIO_AUTHORING_READY_DIAGNOSTIC)) {
    contractFailures.push("Authoring contract missing SCENARIO_AUTHORING_READY diagnostic");
  }
  if (draft.simulationActive !== false) contractFailures.push("Authoring draft reports simulation active");
  if (!Object.isFrozen(draft)) contractFailures.push("Authoring draft not frozen");
  gates.push(gate("A", "Authoring Contract Works", contractFailures));

  const inputFailures: string[] = [];
  if (S1_INPUT_MODEL_COMPLETE_TAG !== "[S1_INPUT_MODEL_COMPLETE]") {
    inputFailures.push("S1_INPUT_MODEL_COMPLETE tag missing");
  }
  if (inputModel.changeCount !== 4) inputFailures.push("Input model change count invalid");
  if (inputModel.simulationActive !== false) inputFailures.push("Input model reports simulation active");
  if (inputModel.dsMutation !== false) inputFailures.push("Input model reports DS mutation");
  if (!inputModel.diagnostics.includes(SCENARIO_INPUT_MODEL_DIAGNOSTIC)) {
    inputFailures.push("Input model missing SCENARIO_INPUT_MODEL diagnostic");
  }
  if (!inputModel.diagnostics.includes(SCENARIO_INPUT_MODEL_READY_DIAGNOSTIC)) {
    inputFailures.push("Input model missing SCENARIO_INPUT_MODEL_READY diagnostic");
  }
  const serialized = serializeScenarioInputModel(inputModel);
  if (!serialized.includes("supplier-1")) inputFailures.push("Input model serialization failed");
  gates.push(gate("B", "Input Model Works", inputFailures));

  const builderResult = buildScenarioDraftFromInput({
    inputModel,
    name: draft.name,
    summary: draft.summary,
    description: draft.description,
    scenarioType: "risk",
  });
  const builderFailures: string[] = [];
  if (S1_DRAFT_BUILDER_COMPLETE_TAG !== "[S1_DRAFT_BUILDER_COMPLETE]") {
    builderFailures.push("S1_DRAFT_BUILDER_COMPLETE tag missing");
  }
  if (!builderResult.draftId) builderFailures.push("Draft builder did not produce draftId");
  if (builderResult.baselineReference.baselineScenarioId !== SCENARIO_DRAFT_BASELINE_SCENARIO_ID) {
    builderFailures.push("Draft builder baseline reference missing");
  }
  if (builderResult.simulationActive !== false) builderFailures.push("Draft builder simulation active");
  if (!builderResult.diagnostics.includes(SCENARIO_DRAFT_BUILDER_DIAGNOSTIC)) {
    builderFailures.push("Draft builder missing SCENARIO_DRAFT_BUILDER diagnostic");
  }
  if (!builderResult.diagnostics.includes(SCENARIO_DRAFT_READY_DIAGNOSTIC)) {
    builderFailures.push("Draft builder missing SCENARIO_DRAFT_READY diagnostic");
  }
  gates.push(gate("C", "Draft Builder Works", builderFailures));

  const validation = validateScenarioDraft({
    draft: builderResult.draft,
    inputModel,
    sceneJson: CERTIFICATION_SCENE,
  });
  const validationFailures: string[] = [];
  if (S1_VALIDATION_COMPLETE_TAG !== "[S1_VALIDATION_COMPLETE]") {
    validationFailures.push("S1_VALIDATION_COMPLETE tag missing");
  }
  if (!validation.accepted) validationFailures.push("Valid draft not accepted by validation engine");
  if (validation.simulationActive !== false) validationFailures.push("Validation engine simulation active");
  if (!validation.diagnostics.includes(SCENARIO_VALIDATION_ENGINE_DIAGNOSTIC)) {
    validationFailures.push("Validation engine missing SCENARIO_VALIDATION_ENGINE diagnostic");
  }
  if (!validation.diagnostics.includes(SCENARIO_VALIDATION_READY_DIAGNOSTIC)) {
    validationFailures.push("Validation engine missing SCENARIO_VALIDATION_READY diagnostic");
  }
  const invalidValidation = validateScenarioDraft({
    draft: buildScenarioDraft({ name: "", summary: "", scenarioType: "risk" }),
    inputModel,
    sceneJson: CERTIFICATION_SCENE,
  });
  if (!invalidValidation.rejected) validationFailures.push("Invalid draft not rejected");
  gates.push(gate("D", "Validation Engine Works", validationFailures));

  const created = createScenarioDraftRegistryEntry({ draft: builderResult.draft });
  const read = readScenarioDraftRegistryEntry({ draftId: builderResult.draft.draftId });
  const updated = updateScenarioDraftRegistryEntry({
    draftId: builderResult.draft.draftId,
    draft: buildScenarioDraft({
      ...builderResult.draft,
      name: "Supplier Delay Risk v2",
      summary: "Updated certification draft.",
    }),
  });
  const archived = archiveScenarioDraftRegistryEntry({ draftId: builderResult.draft.draftId });
  const registryFailures: string[] = [];
  if (S1_REGISTRY_COMPLETE_TAG !== "[S1_REGISTRY_COMPLETE]") {
    registryFailures.push("S1_REGISTRY_COMPLETE tag missing");
  }
  if (!created.success) registryFailures.push("Registry create failed");
  if (!read) registryFailures.push("Registry read failed");
  if (!updated.success) registryFailures.push("Registry update failed");
  if (!archived.success) registryFailures.push("Registry archive failed");
  if (created.simulationResultsStored !== false) {
    registryFailures.push("Registry stores simulation results flag");
  }
  gates.push(gate("E", "Save Registry Works", registryFailures));

  resetScenarioDraftRegistryForTests();
  createScenarioDraftRegistryEntry({ draft: builderResult.draft });
  syncScenarioAuthoringUi({ selectedObjectId: "supplier-1" });
  const uiView = getScenarioAuthoringUiView();
  const uiFailures: string[] = [];
  if (S1_UI_BINDING_COMPLETE_TAG !== "[S1_UI_BINDING_COMPLETE]") {
    uiFailures.push("S1_UI_BINDING_COMPLETE tag missing");
  }
  if (!uiView.draft.hasDraft) uiFailures.push("UI binding did not surface draft");
  if (uiView.draft.draftName !== builderResult.draftName) {
    uiFailures.push("UI binding draft name mismatch");
  }
  if (!uiView.draft.draftType) uiFailures.push("UI binding draft type missing");
  if (!uiView.draft.draftSummary) uiFailures.push("UI binding draft summary missing");
  if (!uiView.draft.validationLabel) uiFailures.push("UI binding validation state missing");
  if (!uiView.diagnostics.includes(SCENARIO_AUTHORING_UI_DIAGNOSTIC)) {
    uiFailures.push("UI binding missing SCENARIO_AUTHORING_UI diagnostic");
  }
  if (!uiView.diagnostics.includes(SCENARIO_AUTHORING_UI_READY_DIAGNOSTIC)) {
    uiFailures.push("UI binding missing SCENARIO_AUTHORING_UI_READY diagnostic");
  }
  if (
    !existsSync(
      join(
        FRONTEND_ROOT,
        "app/components/main-right-panel/workspace/scenario/ScenarioAuthoringDraftPanel.tsx"
      )
    )
  ) {
    uiFailures.push("ScenarioAuthoringDraftPanel component missing");
  }
  gates.push(gate("F", "UI Binding Works", uiFailures));

  const assistance = buildAssistantScenarioAuthoringAssistance({
    sceneJson: CERTIFICATION_SCENE,
    draft: builderResult.draft,
    selectedObjectId: "supplier-1",
  });
  const bridgeFailures: string[] = [];
  if (S1_ASSISTANT_BRIDGE_COMPLETE_TAG !== "[S1_ASSISTANT_BRIDGE_COMPLETE]") {
    bridgeFailures.push("S1_ASSISTANT_BRIDGE_COMPLETE tag missing");
  }
  if (assistance.fieldExplanations.length === 0) {
    bridgeFailures.push("Assistant bridge missing field explanations");
  }
  if (assistance.simulationActive !== false) bridgeFailures.push("Assistant bridge simulation active");
  if (!assistance.diagnostics.includes(ASSISTANT_SCENARIO_AUTHORING_DIAGNOSTIC)) {
    bridgeFailures.push("Assistant bridge missing ASSISTANT_SCENARIO_AUTHORING diagnostic");
  }
  if (!assistance.diagnostics.includes(ASSISTANT_SCENARIO_AUTHORING_READY_DIAGNOSTIC)) {
    bridgeFailures.push("Assistant bridge missing ASSISTANT_SCENARIO_AUTHORING_READY diagnostic");
  }
  gates.push(gate("G", "Assistant Bridge Works", bridgeFailures));

  const guardModules: readonly GuardModule[] = Object.freeze([
    SCENARIO_AUTHORING_CONTRACT,
    inputModel,
    builderResult,
    validation,
    created,
    uiView,
    assistance,
  ]);

  const sceneFailures: string[] = [];
  const sceneJson = structuredClone(CERTIFICATION_SCENE);
  const beforeScene = JSON.stringify(sceneJson);
  buildAssistantScenarioAuthoringAssistance({ sceneJson, draft: builderResult.draft });
  validateScenarioDraft({ draft: builderResult.draft, inputModel, sceneJson });
  buildScenarioDraftFromInput({ inputModel, name: draft.name, summary: draft.summary });
  if (JSON.stringify(sceneJson) !== beforeScene) {
    sceneFailures.push("S-1 pipeline mutated scene payload");
  }
  if (guardModules.some((module) => module.sceneMutation !== false && module.sceneMutation !== undefined)) {
    sceneFailures.push("One or more S-1 modules report scene mutation");
  }
  gates.push(gate("H", "No Scene Mutations", sceneFailures));

  const topologyFailures: string[] = [];
  const topologyScene = structuredClone(CERTIFICATION_SCENE) as {
    scene: { relationships: readonly unknown[]; objects: readonly unknown[] };
  };
  const beforeRelationships = JSON.stringify(topologyScene.scene.relationships);
  const beforeObjects = JSON.stringify(topologyScene.scene.objects);
  validateScenarioDraft({ draft: builderResult.draft, inputModel, sceneJson: topologyScene });
  buildAssistantScenarioAuthoringAssistance({ sceneJson: topologyScene, draft: builderResult.draft });
  if (JSON.stringify(topologyScene.scene.relationships) !== beforeRelationships) {
    topologyFailures.push("S-1 pipeline mutated scene relationships");
  }
  if (JSON.stringify(topologyScene.scene.objects) !== beforeObjects) {
    topologyFailures.push("S-1 pipeline mutated scene objects");
  }
  if (guardModules.some((module) => module.topologyMutation !== false && module.topologyMutation !== undefined)) {
    topologyFailures.push("One or more S-1 modules report topology mutation");
  }
  gates.push(gate("I", "No Topology Mutations", topologyFailures));

  const routingFailures: string[] = [];
  const scenarioPlan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "scenario",
    dashboardContext: "overview",
  });
  if (scenarioPlan.workspaceId !== "scenario") {
    routingFailures.push(`Scenario mode must resolve scenario workspace, got ${scenarioPlan.workspaceId}`);
  }
  if (scenarioPlan.mountTarget !== "scenario_workspace") {
    routingFailures.push(`Scenario mount target must be scenario_workspace, got ${scenarioPlan.mountTarget}`);
  }
  if (guardModules.some((module) => module.routingMutation !== false && module.routingMutation !== undefined)) {
    routingFailures.push("S-1 modules report routing mutation");
  }
  gates.push(gate("J", "No Routing Changes", routingFailures));

  const dsFailures: string[] = [];
  if (guardModules.some((module) => module.dsMutation !== false && module.dsMutation !== undefined)) {
    dsFailures.push("S-1 modules report DS mutation");
  }
  if (uiView.intelligenceMutation !== false) dsFailures.push("UI binding reports intelligence mutation");
  if (created.intelligenceMutation !== false) dsFailures.push("Registry reports intelligence mutation");
  gates.push(gate("K", "No DS Mutations", dsFailures));

  const simulationFailures: string[] = [];
  if (guardModules.some((module) => module.simulationActive !== false && module.simulationActive !== undefined)) {
    simulationFailures.push("S-1 modules report simulation active");
  }
  if (uiView.simulationResultsStored !== false) {
    simulationFailures.push("UI binding reports simulation results stored");
  }
  gates.push(gate("L", "No Simulation Execution", simulationFailures));

  const buildFailures: string[] = [];
  const requiredModules = [
    "app/lib/scenario-authoring/scenarioAuthoringContract.ts",
    "app/lib/scenario-authoring/ScenarioInputModel.ts",
    "app/lib/scenario-authoring/ScenarioDraftBuilder.ts",
    "app/lib/scenario-authoring/ScenarioValidationEngine.ts",
    "app/lib/scenario-authoring/ScenarioDraftRegistry.ts",
    "app/lib/scenario-authoring/AssistantScenarioAuthoringBridge.ts",
    "app/lib/scenario-authoring/scenarioAuthoringCertification.ts",
    "app/lib/ui/mrpWorkspace/scenario/scenarioAuthoringUiRuntime.ts",
    "app/components/main-right-panel/workspace/scenario/ScenarioAuthoringDraftPanel.tsx",
    "app/components/main-right-panel/workspace/scenario/ScenarioWorkspace.tsx",
  ] as const;
  for (const modulePath of requiredModules) {
    if (!existsSync(join(FRONTEND_ROOT, modulePath))) {
      buildFailures.push(`Missing S-1 module ${modulePath}`);
    }
  }
  const buildResult = spawnSync("npm", ["run", "build"], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (buildResult.status !== 0) {
    buildFailures.push("npm run build failed during certification");
  }
  gates.push(gate("M", "Build Passes", buildFailures));

  const testFailures: string[] = [];
  for (const testFile of S1_TEST_FILES) {
    if (!existsSync(join(FRONTEND_ROOT, testFile))) {
      testFailures.push(`Missing S-1 test file ${testFile}`);
    }
  }
  const testResult = spawnSync("node", ["--test", ...S1_TEST_FILES], {
    cwd: FRONTEND_ROOT,
    stdio: "pipe",
    encoding: "utf8",
  });
  if (testResult.status !== 0) {
    testFailures.push("S-1 test suite failed during certification");
  }
  gates.push(gate("N", "Tests Pass", testFailures));

  const freezeTagsValid =
    S1_CERTIFIED_TAG === "[S1_CERTIFIED]" &&
    SCENARIO_AUTHORING_COMPLETE_TAG === "[SCENARIO_AUTHORING_COMPLETE]" &&
    S1_CERTIFICATION_FREEZE_TAGS.length === 2;

  const certified = gates.every((entry) => entry.status === "PASS") && freezeTagsValid;

  return Object.freeze({
    tag: S1_SCENARIO_AUTHORING_CERTIFICATION_TAG,
    version: "1.0.0",
    certified,
    diagnostics: Object.freeze([S1_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    freezeTags: S1_CERTIFICATION_FREEZE_TAGS,
  });
}
