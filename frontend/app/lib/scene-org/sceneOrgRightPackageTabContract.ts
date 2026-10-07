/**
 * NPA-T RIGHT WORKSPACE PACKAGE TABS:1
 * Presentation-only Right Context package tabs.
 *
 * A tab is a reference: package + canonicalId + view.
 * It does not own KPI, Scenario, Decision, Execution, Evidence, NMI, or
 * other business state. Canonical truth stays with existing owners.
 */

export const sceneOrgRightPackageTabContractIdentity =
  "NPA-T RIGHT-WORKSPACE/PackageTabs:1" as const;

/** First live package. Additional kinds reuse this session, not a new tab bar. */
export const SCENE_ORG_RIGHT_PACKAGE_KINDS = Object.freeze([
  "investigation",
] as const);

export type SceneOrgRightPackageKind =
  (typeof SCENE_ORG_RIGHT_PACKAGE_KINDS)[number];

export const SCENE_ORG_RIGHT_PACKAGE_VIEWS = Object.freeze([
  "working-context",
] as const);

export type SceneOrgRightPackageView =
  (typeof SCENE_ORG_RIGHT_PACKAGE_VIEWS)[number];

export const SCENE_ORG_RIGHT_FIXED_SURFACES = Object.freeze([
  "advisor",
  "details",
] as const);

export type SceneOrgRightFixedSurface =
  (typeof SCENE_ORG_RIGHT_FIXED_SURFACES)[number];

export type SceneOrgRightSurfaceId = SceneOrgRightFixedSurface | string;

export const SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS = Object.freeze({
  maxOpen: 1,
  recentContextPolicy: "replace-oldest",
});

export type SceneOrgRightPackageTab = Readonly<{
  tabId: string;
  package: SceneOrgRightPackageKind;
  canonicalId: string;
  view: SceneOrgRightPackageView;
  /** Presentation label from canonical display identity. Not business truth. */
  label: string;
}>;

export type SceneOrgRightPackageTabSession = Readonly<{
  tabs: readonly SceneOrgRightPackageTab[];
  activeSurface: SceneOrgRightSurfaceId;
}>;

export type SceneOrgRightPackageTabOpenInput = Readonly<{
  package: SceneOrgRightPackageKind;
  canonicalId: string;
  label: string;
  view?: SceneOrgRightPackageView;
}>;

export const SCENE_ORG_RIGHT_PACKAGE_TAB_AUTHORITY_GUARD = Object.freeze({
  presentationOnly: true,
  copiesBusinessState: false,
  ownsCanonicalSubject: false,
  replacesAdvisor: false,
  replacesDetailWorkspace: false,
  createsPackageDataSystem: false,
});

export function createEmptySceneOrgRightPackageTabSession(): SceneOrgRightPackageTabSession {
  return Object.freeze({
    tabs: Object.freeze([]),
    activeSurface: "advisor",
  });
}

export function sceneOrgRightPackageTabId(
  packageKind: SceneOrgRightPackageKind,
  canonicalId: string,
): string {
  return `${packageKind}:${canonicalId}`;
}

export function createSceneOrgRightPackageTab(
  input: SceneOrgRightPackageTabOpenInput,
): SceneOrgRightPackageTab {
  const canonicalId = input.canonicalId.trim();
  const label = input.label.trim() || canonicalId;
  return Object.freeze({
    tabId: sceneOrgRightPackageTabId(input.package, canonicalId),
    package: input.package,
    canonicalId,
    view: input.view ?? "working-context",
    label,
  });
}

export function findSceneOrgRightPackageTab(
  session: SceneOrgRightPackageTabSession,
  packageKind: SceneOrgRightPackageKind,
  canonicalId: string,
): SceneOrgRightPackageTab | null {
  const tabId = sceneOrgRightPackageTabId(packageKind, canonicalId);
  return session.tabs.find((tab) => tab.tabId === tabId) ?? null;
}

/**
 * Open or activate a contextual package tab.
 * Same package + canonicalId activates the existing tab.
 * A different package stays a later seam; this bound keeps one recent tab.
 */
export function openSceneOrgRightPackageTab(
  session: SceneOrgRightPackageTabSession,
  input: SceneOrgRightPackageTabOpenInput,
): SceneOrgRightPackageTabSession {
  if (!input.canonicalId.trim()) return session;
  const nextTab = createSceneOrgRightPackageTab(input);
  const existing = session.tabs.find((tab) => tab.tabId === nextTab.tabId);
  if (existing) {
    return Object.freeze({
      tabs: session.tabs,
      activeSurface: existing.tabId,
    });
  }
  const retained =
    session.tabs.length < SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS.maxOpen
      ? session.tabs
      : session.tabs.slice(session.tabs.length - (SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS.maxOpen - 1));
  return Object.freeze({
    tabs: Object.freeze([...retained, nextTab]),
    activeSurface: nextTab.tabId,
  });
}

export function syncSceneOrgRightSelectedObjectTab(
  session: SceneOrgRightPackageTabSession,
  input: SceneOrgRightPackageTabOpenInput,
): SceneOrgRightPackageTabSession {
  if (!input.canonicalId.trim()) return session;
  const nextTab = createSceneOrgRightPackageTab(input);
  const keepFixed =
    session.activeSurface === "advisor" || session.activeSurface === "details";
  const existing = session.tabs.find((tab) => tab.tabId === nextTab.tabId);
  if (existing) {
    return Object.freeze({
      tabs: session.tabs,
      activeSurface: keepFixed ? session.activeSurface : existing.tabId,
    });
  }
  const retained =
    session.tabs.length < SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS.maxOpen
      ? session.tabs
      : session.tabs.slice(
          session.tabs.length - (SCENE_ORG_RIGHT_PACKAGE_TAB_BOUNDS.maxOpen - 1),
        );
  const tabs = Object.freeze([...retained, nextTab]);
  return Object.freeze({
    tabs,
    activeSurface: keepFixed ? session.activeSurface : nextTab.tabId,
  });
}

export function activateSceneOrgRightPackageTab(
  session: SceneOrgRightPackageTabSession,
  surface: SceneOrgRightSurfaceId,
): SceneOrgRightPackageTabSession {
  if (surface === "advisor" || surface === "details") {
    return Object.freeze({ ...session, activeSurface: surface });
  }
  if (!session.tabs.some((tab) => tab.tabId === surface)) return session;
  return Object.freeze({ ...session, activeSurface: surface });
}

export function closeSceneOrgRightPackageTab(
  session: SceneOrgRightPackageTabSession,
  tabId: string,
): SceneOrgRightPackageTabSession {
  const tabs = Object.freeze(session.tabs.filter((tab) => tab.tabId !== tabId));
  const closingActive = session.activeSurface === tabId;
  return Object.freeze({
    tabs,
    activeSurface: closingActive ? "advisor" : session.activeSurface,
  });
}

export function resolveSceneOrgRightActivePackageTab(
  session: SceneOrgRightPackageTabSession,
): SceneOrgRightPackageTab | null {
  if (session.activeSurface === "advisor" || session.activeSurface === "details") {
    return null;
  }
  return session.tabs.find((tab) => tab.tabId === session.activeSurface) ?? null;
}
