import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createMemoryCsvDurabilityStorage } from "../data-reality/csvRealDataImportDurability.ts";
import { resetCsvRealDataImportStoreForTests } from "../data-reality/csvRealDataImportStore.ts";
import { composeNexoraExecutiveIntelligenceExperience } from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import type { NexoraMVPStageObjectFixture } from "../nex-mvp/nexoraMVPStageFixtures.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import { createManagerWorkspace } from "../workspace/managerWorkspaceIdentity.ts";
import { isRealManagerWorkspaceId } from "../workspace/liveManagerDataWorkspaceGuard.ts";
import { BUSINESS_DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import {
  resetWorkspaceRegistryForTests,
  setActiveWorkspace,
} from "../workspace/workspaceRegistryStore.ts";
import { openBusinessDemo, resetBusinessDemoActivationForTests } from "./businessDemoActivation.ts";
import { BUSINESS_DEMO_STAGE_OBJECTS, resolveBusinessDemoStageMaterials } from "./businessDemoStageCatalog.ts";
import { resolveActiveDemoProfileStageMaterials } from "./demoProfileStageCatalog.ts";
import {
  openManufacturingDemo,
  openProjectDemo,
  resetDemoProfileForTests,
} from "./demoProfileStore.ts";

const here = dirname(fileURLToPath(import.meta.url));
const BUSINESS_IDS = BUSINESS_DEMO_STAGE_OBJECTS.map((entry) => entry.id);

function installStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage, sessionStorage: storage, dispatchEvent() { return true; } },
  });
}

function narrate(catalogObjects: readonly NexoraMVPStageObjectFixture[]) {
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
    catalogObjects,
  });
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolveNexoraMVPExecutiveIntelligence(context).advisor,
    intelligence: context,
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
  const experience = composeNexoraExecutiveIntelligenceExperience({
    narrative,
    presentationMode: "overview",
    productFixturesPermitted: false,
    validatedDataSource: false,
  });
  return { context, narrative, experience };
}

beforeEach(() => {
  installStorage();
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

afterEach(() => {
  resetWorkspaceRegistryForTests();
  resetCsvRealDataImportStoreForTests();
  resetDemoProfileForTests();
  resetBusinessDemoActivationForTests();
});

test("Business Demo Advisor receives only the Business Demo stage catalog", async () => {
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /!workspaceAuthorityReady\s*\?\s*unresolvedWorkspaceAdvisorCatalog/);
  assert.match(
    shell,
    /modernDemoActive \|\|\s*dataWorkspaceId === BUSINESS_DEMO_WORKSPACE_ID \|\|\s*\(!permitProductFixtures && isRealManagerWorkspaceId\(dataWorkspaceId\)\)/,
  );
  assert.match(shell, /workspaceAuthorityReady &&/);
  const advisor = readFileSync(join(here, "../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx"), "utf8");
  assert.match(advisor, /restrictAttentionToCatalog: stageCatalogObjects != null/);

  const opened = await openBusinessDemo({ storage: createMemoryCsvDurabilityStorage() });
  assert.equal(opened.opened, true);
  const materials = resolveBusinessDemoStageMaterials();
  assert.ok(materials);
  assert.deepEqual(
    materials.catalog.objects.map((object) => object.id),
    BUSINESS_IDS,
  );
  const { context, narrative } = narrate(materials.catalog.objects);
  const ranked = context.overviewAttention.map((entry) => entry.id);
  assert.deepEqual(ranked, []);
  assert.equal(narrative.attentionSubjectId, null);
  assert.equal(narrative.currentSubjectLabel, null);
  assert.equal(narrative.situation, "There is no explicit subject. Nexora is showing the executive overview.");
});

test("normal stable Business Demo objects do not invent an attention winner", async () => {
  await openBusinessDemo({ storage: createMemoryCsvDurabilityStorage() });
  const materials = resolveBusinessDemoStageMaterials();
  assert.ok(materials);
  assert.equal(
    materials.catalog.objects.every((object) => object.attention === "normal" && object.status === "stable"),
    true,
  );
  const { narrative, experience } = narrate(materials.catalog.objects);
  const text = [
    narrative.attentionReason,
    narrative.primaryAction?.label,
    narrative.recommendation,
    narrative.recentChange,
    experience.change.statement,
    narrative.evidenceSummary,
  ].join(" ");
  assert.equal(narrative.attentionReason, null);
  assert.equal(narrative.primaryAction, null);
  assert.equal(text.includes("strongest validated attention signal"), false);
  assert.equal(text.includes("Investigate Risk"), false);
  assert.equal(text.includes("Investigate Operating Cost"), false);
  assert.equal(text.includes("Healthy"), false);
  assert.equal(text.includes("obj-risk"), false);
  assert.match(experience.change.statement ?? "", /No meaningful validated change/);
});

test("an explicit actionable catalog object is named without a fixture", async () => {
  await openBusinessDemo({ storage: createMemoryCsvDurabilityStorage() });
  const materials = resolveBusinessDemoStageMaterials();
  assert.ok(materials);
  const inventoryId = `business-demo:${BUSINESS_DEMO_WORKSPACE_ID}:inventory`;
  const signaled = materials.catalog.objects.map((object) =>
    object.id === inventoryId
      ? Object.freeze({ ...object, attention: "important" as const })
      : object,
  );
  const { context, narrative } = narrate(signaled);
  assert.equal(context.overviewAttention[0]?.id, inventoryId);
  assert.equal(narrative.attentionSubjectId, inventoryId);
  assert.equal(narrative.attentionSubjectLabel, "Inventory");
  assert.match(narrative.attentionReason ?? "", /Inventory currently has the strongest validated attention signal/);
  assert.equal(narrative.primaryAction?.label, "Investigate Inventory");
  const production = resolveBusinessDemoStageMaterials();
  assert.equal(
    production?.catalog.objects.every((object) => object.attention === "normal" && object.status === "stable"),
    true,
  );
});

test("Manufacturing and Project Advisor catalogs stay on their own objects", () => {
  openManufacturingDemo();
  const manufacturing = resolveActiveDemoProfileStageMaterials();
  assert.ok(manufacturing);
  const manufacturingNarrative = narrate(manufacturing.catalog.objects);
  const manufacturingWinner = manufacturingNarrative.context.overviewAttention[0];
  assert.ok(manufacturingWinner);
  assert.equal(
    manufacturing.catalog.objects.some((object) => object.id === manufacturingWinner.id),
    true,
  );
  assert.match(manufacturingNarrative.narrative.attentionReason ?? "", new RegExp(manufacturingWinner.label));
  assert.equal(manufacturingWinner.id.startsWith("business-demo:"), false);

  openProjectDemo();
  const project = resolveActiveDemoProfileStageMaterials();
  assert.ok(project);
  const projectNarrative = narrate(project.catalog.objects);
  const projectWinner = projectNarrative.context.overviewAttention[0];
  assert.ok(projectWinner);
  assert.equal(project.catalog.objects.some((object) => object.id === projectWinner.id), true);
  assert.match(projectNarrative.narrative.attentionReason ?? "", new RegExp(projectWinner.label));
  assert.equal(projectWinner.id.startsWith("business-demo:"), false);
  assert.equal(resolveBusinessDemoStageMaterials(), null);
});

test("a real company catalog does not inherit Business Demo or fixture attention", () => {
  const company = createManagerWorkspace({ name: "Clean Company", kind: "BUSINESS" });
  assert.ok(company);
  setActiveWorkspace(company.workspaceId);
  assert.equal(isRealManagerWorkspaceId(company.workspaceId), true);
  assert.equal(resolveBusinessDemoStageMaterials(), null);
  const customerCatalog = Object.freeze([
    Object.freeze({
      id: "company-orders",
      label: "Orders",
      kind: "object" as const,
      managerWorkspaceId: company.workspaceId,
      position: [0, 0, 0] as const,
      status: "stable" as const,
      attention: "normal" as const,
    }),
  ]);
  const { context, narrative } = narrate(customerCatalog);
  assert.deepEqual(context.overviewAttention.map((entry) => entry.id), ["company-orders"]);
  assert.equal(narrative.attentionSubjectId, "company-orders");
  assert.equal(
    context.overviewAttention.some((entry) => entry.id.startsWith("business-demo:")),
    false,
  );
});

test("an unresolved workspace catalog does not recommend fixture Risk", () => {
  const { context, narrative, experience } = narrate([]);
  assert.deepEqual(context.overviewAttention.map((entry) => entry.id), []);
  assert.equal(narrative.attentionSubjectId, null);
  assert.equal(narrative.attentionReason, null);
  assert.equal(narrative.primaryAction, null);
  assert.equal(experience.change.statement?.includes("Risk"), false);
  const text = [narrative.situation, narrative.evidenceSummary, narrative.attentionReason].join(" ");
  assert.equal(text.includes("obj-risk"), false);
  assert.equal(text.includes("strongest validated attention signal"), false);
});

test("an authorized critical Risk object remains the recommendation", () => {
  const authorized = Object.freeze([
    Object.freeze({
      id: "company-risk",
      label: "Risk",
      kind: "object" as const,
      position: [0, 0, 0] as const,
      status: "risk" as const,
      attention: "critical" as const,
    }),
    Object.freeze({
      id: "company-revenue",
      label: "Revenue",
      kind: "object" as const,
      position: [1, 0, 0] as const,
      status: "stable" as const,
      attention: "normal" as const,
    }),
  ]);
  const { context, narrative } = narrate(authorized);
  assert.equal(context.overviewAttention[0]?.id, "company-risk");
  assert.equal(narrative.attentionSubjectId, "company-risk");
  assert.equal(narrative.primaryAction?.label, "Investigate Risk");
});

test("workspace switching does not keep the previous Advisor target", async () => {
  const storage = createMemoryCsvDurabilityStorage();
  openManufacturingDemo();
  const manufacturing = narrate(resolveActiveDemoProfileStageMaterials()!.catalog.objects);
  await openBusinessDemo({ storage });
  const business = narrate(resolveBusinessDemoStageMaterials()!.catalog.objects);
  openProjectDemo();
  const project = narrate(resolveActiveDemoProfileStageMaterials()!.catalog.objects);
  await openBusinessDemo({ storage });
  const returned = narrate(resolveBusinessDemoStageMaterials()!.catalog.objects);

  assert.notEqual(manufacturing.narrative.attentionSubjectId, null);
  assert.equal(business.narrative.attentionSubjectId, null);
  assert.equal(business.narrative.primaryAction, null);
  assert.notEqual(project.narrative.attentionSubjectId, business.narrative.attentionSubjectId);
  assert.equal(project.narrative.attentionSubjectId?.startsWith("business-demo:"), false);
  assert.equal(returned.narrative.attentionSubjectId, null);
  assert.equal(returned.narrative.primaryAction, null);
  assert.equal(returned.narrative.attentionReason, null);
  assert.equal(
    [business, returned].every((entry) => entry.narrative.attentionSubjectId !== manufacturing.narrative.attentionSubjectId),
    true,
  );
  assert.equal(
    [business, returned].every((entry) => entry.narrative.attentionSubjectId !== project.narrative.attentionSubjectId),
    true,
  );
});
