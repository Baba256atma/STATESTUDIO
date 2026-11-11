import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ExecutiveAdvisorHeader } from "@/app/executive/exs1/advisor/ExecutiveAdvisorHeader.tsx";
import { NexoraRightPackageWorkingContext } from "@/app/executive/nex-mvp/NexoraRightPackageWorkingContext.tsx";
import { NexoraDecisionTheatreInvestigationSurface } from "@/app/executive/nex-mvp/stage/NexoraDecisionTheatreInvestigationSurface.tsx";
import { projectNexoraDecisionTheatreFoundation } from "@/app/lib/decision-theatre/nexoraDecisionTheatrePublicIndex.ts";
import { projectNexoraDecisionTheatreObjectInvestigation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigationComposer.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  SCENE_ORG_RIGHT_PACKAGE_TAB_AUTHORITY_GUARD,
  SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS,
  activateSceneOrgRightPackageTab,
  closeSceneOrgRightPackageTab,
  createEmptySceneOrgRightPackageTabSession,
  findSceneOrgRightPackageTab,
  openSceneOrgRightPackageTab,
  resolveSceneOrgRightActivePackageTab,
  retainSceneOrgRightPackageTabsInCatalog,
  sceneOrgRightPackageTabId,
} from "./sceneOrgRightPackageTabContract.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function theatreFor(subjectId: string) {
  const state = selectNexoraMVPInteractionSubject(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    subjectId,
    catalog,
  );
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    investigationLevel: "understand",
  });
}

test("package tab is a canonical reference, not copied business state", () => {
  const session = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "obj-capacity", label: "Capacity" },
  );
  const tab = resolveSceneOrgRightActivePackageTab(session);
  assert.equal(tab?.canonicalId, "obj-capacity");
  assert.equal(tab?.package, "investigation");
  assert.equal(tab?.view, "working-context");
  assert.equal(tab?.label, "Capacity");
  assert.equal(tab?.tabId, sceneOrgRightPackageTabId("investigation", "obj-capacity"));
  assert.equal("kpi" in (tab ?? {}), false);
  assert.equal("scenario" in (tab ?? {}), false);
  assert.equal(SCENE_ORG_RIGHT_PACKAGE_TAB_AUTHORITY_GUARD.copiesBusinessState, false);
  assert.equal(SCENE_ORG_RIGHT_PACKAGE_TAB_AUTHORITY_GUARD.ownsCanonicalSubject, false);
});

test("duplicate package + canonicalId activates instead of duplicating", () => {
  const opened = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "obj-capacity", label: "Capacity" },
  );
  const again = openSceneOrgRightPackageTab(opened, {
    package: "investigation",
    canonicalId: "obj-capacity",
    label: "Capacity Utilization",
  });
  assert.equal(again.tabs.length, 1);
  assert.equal(again.tabs[0]?.label, "Capacity");
  assert.equal(again.activeSurface, opened.tabs[0]?.tabId);
});

test("a different canonicalId does not mutate the open Capacity tab", () => {
  const capacity = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "obj-capacity", label: "Capacity" },
  );
  const parked = activateSceneOrgRightPackageTab(capacity, "advisor");
  assert.equal(
    findSceneOrgRightPackageTab(parked, "investigation", "obj-capacity")?.canonicalId,
    "obj-capacity",
  );
  assert.equal(parked.tabs[0]?.canonicalId, "obj-capacity");
  assert.equal(parked.activeSurface, "advisor");
});

test("opening a different subject replaces the single recent contextual tab", () => {
  const capacity = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "obj-capacity", label: "Capacity" },
  );
  const risk = openSceneOrgRightPackageTab(capacity, {
    package: "investigation",
    canonicalId: "obj-risk",
    label: "Risk",
  });
  assert.equal(SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS.maxOpen, 1);
  assert.equal(risk.tabs.length, 1);
  assert.equal(risk.tabs[0]?.canonicalId, "obj-risk");
  assert.equal(findSceneOrgRightPackageTab(risk, "investigation", "obj-capacity"), null);
});

test("close returns to Advisor and keeps Advisor available", () => {
  const opened = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    { package: "investigation", canonicalId: "obj-capacity", label: "Capacity" },
  );
  const closed = closeSceneOrgRightPackageTab(opened, opened.tabs[0]!.tabId);
  assert.equal(closed.tabs.length, 0);
  assert.equal(closed.activeSurface, "advisor");
  const details = activateSceneOrgRightPackageTab(closed, "details");
  assert.equal(details.activeSurface, "details");
  const advisor = activateSceneOrgRightPackageTab(details, "advisor");
  assert.equal(advisor.activeSurface, "advisor");
});

test("Right header keeps Advisor and Details while showing one package tab", () => {
  const html = renderToStaticMarkup(
    React.createElement(ExecutiveAdvisorHeader, {
      tab: "Assist",
      onTabChange: () => undefined,
      collapsed: false,
      onToggleCollapse: () => undefined,
      packageTabs: [
        Object.freeze({
          tabId: "investigation:obj-capacity",
          label: "Capacity",
          canonicalId: "obj-capacity",
        }),
      ],
      activePackageTabId: "investigation:obj-capacity",
      onSelectPackageTab: () => undefined,
      onClosePackageTab: () => undefined,
    }),
  );
  assert.match(html, /data-testid="executive-advisor-tab-assist"/);
  assert.match(html, /data-testid="executive-advisor-tab-insight"/);
  assert.match(html, /data-testid="nexora-right-package-tab-obj-capacity"/);
  assert.match(html, /data-right-package-canonical-id="obj-capacity"/);
});

test("working context hosts the existing Object Card without Stage chrome or Open in Right", () => {
  const investigation = projectNexoraDecisionTheatreObjectInvestigation({
    theatre: theatreFor("ctx-problem-capacity"),
    level: "understand",
  });
  assert.ok(investigation);
  const html = renderToStaticMarkup(
    React.createElement(NexoraRightPackageWorkingContext, {
      tab: Object.freeze({
        tabId: "investigation:ctx-problem-capacity",
        package: "investigation" as const,
        canonicalId: "ctx-problem-capacity",
        view: "working-context" as const,
        label: "Capacity Gap",
        ownerWorkspaceId: null,
        ownerDemoProfileId: null,
        ownerDeckId: null,
        catalogBound: false,
      }),
      investigation,
    }),
  );
  assert.match(html, /data-right-package-canonical-id="ctx-problem-capacity"/);
  assert.match(html, /data-testid="nexora-theatre-investigation"/);
  assert.match(html, /data-object-card-host="right-panel"/);
  assert.doesNotMatch(html, /Open in Right/);
  assert.doesNotMatch(html, /data-testid="nexora-theatre-investigation-close"/);
});

test("Stage host still exposes Open in Right; Right host does not", () => {
  const investigation = projectNexoraDecisionTheatreObjectInvestigation({
    theatre: theatreFor("ctx-problem-capacity"),
    level: "understand",
  });
  assert.ok(investigation);
  const stage = renderToStaticMarkup(
    React.createElement(NexoraDecisionTheatreInvestigationSurface, {
      investigation,
      onLevelChange: () => undefined,
      onClose: () => undefined,
      onAsk: () => undefined,
      onOpenInRight: () => undefined,
    }),
  );
  assert.match(stage, /Open in Right/);
  const right = renderToStaticMarkup(
    React.createElement(NexoraDecisionTheatreInvestigationSurface, {
      host: "right-panel",
      investigation,
      onLevelChange: () => undefined,
      onClose: () => undefined,
      onAsk: () => undefined,
      onOpenInRight: () => undefined,
    }),
  );
  assert.doesNotMatch(right, /Open in Right/);
  assert.match(right, /data-object-card-host="right-panel"/);
});

test("working-context projection stays on the tab canonical ID after Stage selection changes", () => {
  const session = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "ctx-problem-capacity",
      label: "Capacity Gap",
    },
  );
  const parked = activateSceneOrgRightPackageTab(session, "advisor");
  const laterTheatre = theatreFor("ctx-problem-margin");
  assert.equal(laterTheatre.selectedExecutiveObjectId, "ctx-problem-margin");
  const tab = findSceneOrgRightPackageTab(
    parked,
    "investigation",
    "ctx-problem-capacity",
  );
  assert.equal(tab?.canonicalId, "ctx-problem-capacity");
  assert.notEqual(tab?.canonicalId, laterTheatre.selectedExecutiveObjectId);
  const investigation = projectNexoraDecisionTheatreObjectInvestigation({
    theatre: Object.freeze({
      ...laterTheatre,
      selectedExecutiveObjectId: tab!.canonicalId,
      primaryExecutiveObjectId: tab!.canonicalId,
    }),
    level: "understand",
  });
  assert.notEqual(investigation?.objectId, "ctx-problem-margin");
  if (investigation != null) {
    assert.equal(investigation.objectId, "ctx-problem-capacity");
  }
  const html = renderToStaticMarkup(
    React.createElement(NexoraRightPackageWorkingContext, {
      tab: tab!,
      investigation,
    }),
  );
  assert.match(html, /data-right-package-canonical-id="ctx-problem-capacity"/);
  assert.doesNotMatch(html, /data-right-package-canonical-id="ctx-problem-margin"/);
});

const manufacturingAuthority = {
  workspaceId: "demo_workspace",
  demoProfileId: "manufacturing",
  catalogObjectIds: ["obj-capacity"],
} as const;

test("a package tab closes when the demo profile catalog no longer owns it", () => {
  const opened = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "obj-capacity",
      label: "Capacity",
      ownerWorkspaceId: "demo_workspace",
      ownerDemoProfileId: "manufacturing",
      catalogBound: true,
    },
  );
  const active = activateSceneOrgRightPackageTab(opened, opened.tabs[0]!.tabId);
  const project = retainSceneOrgRightPackageTabsInCatalog(active, {
    workspaceId: "demo_workspace",
    demoProfileId: "project",
    catalogObjectIds: ["demo-subject:project:project-control"],
  });
  assert.equal(project.tabs.length, 0);
  assert.equal(project.activeSurface, "advisor");
  const restored = retainSceneOrgRightPackageTabsInCatalog(opened, manufacturingAuthority);
  assert.equal(restored, opened);
});

test("workspace and catalog replacement drop obsolete tabs and keep a valid one", () => {
  const capacity = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "obj-capacity",
      label: "Capacity",
      ownerWorkspaceId: "demo_workspace",
      ownerDemoProfileId: "manufacturing",
    },
  );
  const business = retainSceneOrgRightPackageTabsInCatalog(capacity, {
    workspaceId: "business_demo_workspace",
    demoProfileId: null,
    catalogObjectIds: ["business-demo:business_demo_workspace:revenue"],
  });
  assert.equal(business.tabs.length, 0);
  const revenue = openSceneOrgRightPackageTab(business, {
    package: "investigation",
    canonicalId: "business-demo:business_demo_workspace:revenue",
    label: "Revenue",
    ownerWorkspaceId: "business_demo_workspace",
    ownerDemoProfileId: null,
  });
  const details = activateSceneOrgRightPackageTab(revenue, "details");
  const removed = retainSceneOrgRightPackageTabsInCatalog(details, {
    workspaceId: "business_demo_workspace",
    demoProfileId: null,
    catalogObjectIds: [],
  });
  assert.equal(removed.tabs.length, 0);
  assert.equal(removed.activeSurface, "details");
});

test("a non-catalog reference survives inside its owner and closes on owner change", () => {
  const opened = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "ctx-problem-capacity",
      label: "Capacity Gap",
      ownerWorkspaceId: "demo_workspace",
      ownerDemoProfileId: "manufacturing",
      catalogBound: false,
    },
  );
  const same = retainSceneOrgRightPackageTabsInCatalog(opened, manufacturingAuthority);
  assert.equal(same.tabs.length, 1);
  const project = retainSceneOrgRightPackageTabsInCatalog(opened, {
    workspaceId: "demo_workspace",
    demoProfileId: "project",
    catalogObjectIds: ["demo-subject:project:project-control"],
  });
  assert.equal(project.tabs.length, 0);
});

test("rapid catalog transitions keep only the latest owned tab", () => {
  let session = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "obj-capacity",
      label: "Capacity",
      ownerWorkspaceId: "demo_workspace",
      ownerDemoProfileId: "manufacturing",
    },
  );
  session = retainSceneOrgRightPackageTabsInCatalog(session, {
    workspaceId: "demo_workspace",
    demoProfileId: "project",
    catalogObjectIds: ["demo-subject:project:project-control"],
  });
  session = openSceneOrgRightPackageTab(session, {
    package: "investigation",
    canonicalId: "demo-subject:project:project-control",
    label: "Project Control",
    ownerWorkspaceId: "demo_workspace",
    ownerDemoProfileId: "project",
  });
  session = retainSceneOrgRightPackageTabsInCatalog(session, manufacturingAuthority);
  session = openSceneOrgRightPackageTab(session, {
    package: "investigation",
    canonicalId: "obj-capacity",
    label: "Capacity",
    ownerWorkspaceId: "demo_workspace",
    ownerDemoProfileId: "manufacturing",
  });
  assert.deepEqual(session.tabs.map((tab) => tab.canonicalId), ["obj-capacity"]);
});

test("a Deck change closes a package tab that the demo profile alone would keep", () => {
  const session = openSceneOrgRightPackageTab(
    createEmptySceneOrgRightPackageTabSession(),
    {
      package: "investigation",
      canonicalId: "obj-capacity",
      label: "Capacity",
      ownerWorkspaceId: "demo_workspace",
      ownerDemoProfileId: "manufacturing",
      ownerDeckId: "manufacturing",
    },
  );
  const retained = retainSceneOrgRightPackageTabsInCatalog(session, {
    workspaceId: "demo_workspace",
    demoProfileId: "manufacturing",
    deckId: "executive",
    catalogObjectIds: ["obj-capacity"],
  });
  assert.equal(retained.tabs.length, 0);
  assert.equal(retained.activeSurface, "advisor");
});
