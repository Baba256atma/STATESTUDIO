import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { resetCsvRealDataImportStoreForTests, listCsvRealDataImports } from "../data-reality/csvRealDataImportStore.ts";
import { resolveNexoraMVPStageScenePresentation } from "../nex-mvp/nexora3DExecutiveStage.ts";
import { countNexoraMvpComposedPrimaryPopulation } from "../nex-mvp/nexoraMvpComposedPopulation.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  getActiveWorkspaceId,
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import {
  hostedWorkspaceSelectionForHydration,
  rememberHostedWorkspaceSelection,
  readStoredHostedWorkspaceSelection,
} from "../workspace-auth/hostedActiveWorkspace.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  readActiveDemoProfile,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";
import { resolveActiveDemoProfileStageMaterials } from "./demoProfileStageCatalog.ts";

beforeEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  rememberHostedWorkspaceSelection(null);
});

function composedCount() {
  const materials = resolveActiveDemoProfileStageMaterials();
  assert.ok(materials);
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: materials.catalog.objects,
    relationships: materials.catalog.relationships,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
    activeManagerWorkspaceId: DEMO_WORKSPACE_ID,
  });
  return {
    materials,
    composed: countNexoraMvpComposedPrimaryPopulation(scene.objects),
  };
}

test("both demo packages produce stage bodies and replace each other", () => {
  openManufacturingDemo();
  const manufacturing = composedCount();
  assert.ok(manufacturing.composed > 0);
  assert.ok(manufacturing.materials.catalog.objects.every((object) => object.managerWorkspaceId === DEMO_WORKSPACE_ID));
  const manufacturingIds = manufacturing.materials.catalog.objects.map((object) => object.id);

  openProjectDemo();
  const project = composedCount();
  assert.equal(readActiveDemoProfile(), "project");
  assert.ok(project.composed > 0);
  assert.equal(project.materials.catalog.objects.some((object) => manufacturingIds.includes(object.id) && object.id.startsWith("demo-subject:manufacturing:")), false);
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("demo-profile:manufacturing:")), true);

  openManufacturingDemo();
  const restored = composedCount();
  assert.equal(readActiveDemoProfile(), "manufacturing");
  assert.equal(listCsvRealDataImports(DEMO_WORKSPACE_ID).some((entry) => entry.importId.startsWith("demo-profile:project:")), true);
  assert.deepEqual(restored.materials.catalog.objects.map((object) => object.id), manufacturingIds);
});

test("a company workspace does not receive demo bodies or demo CSV", () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(company);
  openManufacturingDemo();
  setActiveWorkspace(company.workspaceId);
  assert.equal(readActiveDemoProfile(), null);
  assert.equal(resolveActiveDemoProfileStageMaterials(), null);
  assert.equal(listCsvRealDataImports(company.workspaceId).some((entry) => entry.importId.startsWith("demo-profile:")), false);
});

test("an explicit demo clears a stale hosted company selection", () => {
  const company = createManagerWorkspace({ name: "Hosted Company", kind: "BUSINESS" });
  assert.ok(company);
  rememberHostedWorkspaceSelection(company.workspaceId);
  openManufacturingDemo();
  assert.equal(readStoredHostedWorkspaceSelection(), company.workspaceId);
  assert.equal(hostedWorkspaceSelectionForHydration(readStoredHostedWorkspaceSelection()), null);
  assert.equal(getActiveWorkspaceId(), DEMO_WORKSPACE_ID);
  assert.equal(readActiveDemoProfile(), "manufacturing");
  resetDemoProfileForTests();
  assert.equal(hostedWorkspaceSelectionForHydration(readStoredHostedWorkspaceSelection()), company.workspaceId);
});

test("advisor overview names a catalog object and stays silent when the catalog is empty", () => {
  openManufacturingDemo();
  const materials = resolveActiveDemoProfileStageMaterials();
  assert.ok(materials);
  const context = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: {
      selectedSubject: null,
      focusedSubject: null,
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      subjectKind: null,
      relatedSubjectIds: [],
      contextSubjectIds: [],
      activeWorkspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
      interactionMode: "overview",
      breadcrumb: [],
    },
    presentationViewModel: {
      state: "minimum",
      subjectId: null,
      subjectKind: null,
      subjectLabel: null,
      essentialStatus: null,
      showEssentialStatus: false,
      showKPIs: false,
      showKOI: false,
      showRelationships: false,
      showExecutiveSummary: false,
      showActions: false,
      showReportSurface: false,
      showOperationSurface: false,
      primaryKpi: null,
      secondaryKpis: [],
      koi: null,
      summary: null,
      relationships: [],
      availableActions: [],
      capability: { minimum: true, report: false, operation: false },
      workspace: "overview",
      environmentIntent: "neutral",
    },
    focusedSubject: null,
    selectedSubject: null,
    breadcrumb: [],
    catalogObjects: materials.catalog.objects,
  });
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolveNexoraMVPExecutiveIntelligence(context).advisor,
    intelligence: context,
    restrictAttentionToCatalog: true,
  });
  const named = context.overviewAttention[0];
  assert.ok(named);
  assert.ok(materials.catalog.objects.some((object) => object.id === named.id));
  assert.equal(narrative.attentionReason?.includes("Risk"), false);
  assert.match(narrative.attentionReason ?? "", new RegExp(named.label));

  const empty = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: {
      selectedSubject: null,
      focusedSubject: null,
      primaryStageSubjectId: null,
      advisorSubjectId: null,
      subjectKind: null,
      relatedSubjectIds: [],
      contextSubjectIds: [],
      activeWorkspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
      interactionMode: "overview",
      breadcrumb: [],
    },
    presentationViewModel: {
      state: "minimum",
      subjectId: null,
      subjectKind: null,
      subjectLabel: null,
      essentialStatus: null,
      showEssentialStatus: false,
      showKPIs: false,
      showKOI: false,
      showRelationships: false,
      showExecutiveSummary: false,
      showActions: false,
      showReportSurface: false,
      showOperationSurface: false,
      primaryKpi: null,
      secondaryKpis: [],
      koi: null,
      summary: null,
      relationships: [],
      availableActions: [],
      capability: { minimum: true, report: false, operation: false },
      workspace: "overview",
      environmentIntent: "neutral",
    },
    focusedSubject: null,
    selectedSubject: null,
    breadcrumb: [],
    catalogObjects: [],
  });
  const silent = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolveNexoraMVPExecutiveIntelligence(empty).advisor,
    intelligence: empty,
    restrictAttentionToCatalog: true,
    advisorBinding: {
      focus: { recommendedObjectId: "obj-risk" },
      unresolved: { unavailableInformation: [], hasUnresolvedReality: false },
      prioritizedSubjects: [],
      primarySubject: null,
      presentationDensity: { showRecommendedActions: false },
      recommendations: { primaryAction: null },
    } as never,
  });
  assert.equal(empty.overviewAttention.length, 0);
  assert.equal(silent.attentionReason, null);
});
