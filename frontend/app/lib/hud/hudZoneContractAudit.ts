/**
 * MRP_HUD:10:1 — HUD zone contract audit definitions (diagnosis only).
 */

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../ui/executiveWorkspaceLayout.ts";
import { SCENE_HUD_ZONE_IDS } from "../scene/sceneHudZoneContract.ts";

export type HudAuditZoneId = "A" | "B" | "C" | "D" | "E" | "F";

export type HudAuditVerdict = "pass" | "warning" | "fail";

export type HudAuditZoneMeasurement = Readonly<{
  zoneId: HudAuditZoneId;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  ownerComponent: string;
  mountedComponent: string;
  visibleComponent: string;
  visible: boolean;
}>;

export type HudAuditPortalHost = Readonly<{
  id: string;
  selector: string;
  ownerComponent: string;
  expectedRole: "active" | "legacy" | "hidden" | "orphan";
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  visible: boolean;
  hidden: boolean;
  zeroSize: boolean;
  mounted: boolean;
}>;

export type HudAuditOverlap = Readonly<{
  zoneA: string;
  zoneB: string;
  overlapArea: number;
  visible: boolean;
}>;

export type HudAuditBrakeEntry = Readonly<{
  source: string;
  overlapDetected: boolean;
  mrpOverlapDetected: boolean;
  detail: string;
}>;

export type HudZoneContractAuditResult = Readonly<{
  auditId: "MRP_HUD:10:1";
  timestamp: number;
  verdict: HudAuditVerdict;
  overlapDetected: boolean;
  hiddenHostDetected: boolean;
  portalCount: number;
  zones: readonly HudAuditZoneMeasurement[];
  portals: readonly HudAuditPortalHost[];
  overlaps: readonly HudAuditOverlap[];
  brakes: readonly HudAuditBrakeEntry[];
  safeZoneViolations: readonly string[];
  contractOverlapDetected: boolean;
  contractMrpOverlapDetected: boolean;
  notes: readonly string[];
}>;

export const HUD_AUDIT_ZONE_DEFINITIONS: Readonly<
  Record<
    HudAuditZoneId,
    Readonly<{
      label: string;
      ownerComponent: string;
      domSelectors: readonly string[];
      sceneZoneId?: string;
    }>
  >
> = Object.freeze({
  A: Object.freeze({
    label: "Scene Left Safe Zone",
    ownerComponent: "ScenePanelShell / ExecutiveLeftDockZone",
    domSelectors: Object.freeze([
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.leftDock}`,
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.leftDockHost}`,
      "#nexora-scene-panel-shell",
      `[data-nx-zone="${SCENE_HUD_ZONE_IDS.scenePanel}"]`,
    ]),
    sceneZoneId: SCENE_HUD_ZONE_IDS.scenePanel,
  }),
  B: Object.freeze({
    label: "Scene Center Safe Zone",
    ownerComponent: "SceneCanvas / nexora-canvas-host",
    domSelectors: Object.freeze([
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.scene}`,
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.sceneCanvasHost}`,
      '[data-nx="scene-hud-zone-layout"]',
    ]),
  }),
  C: Object.freeze({
    label: "Scene Right Safe Zone",
    ownerComponent: "ObjectInfoHud / scene-object-panel-zone",
    domSelectors: Object.freeze([
      `[data-nx-zone="${SCENE_HUD_ZONE_IDS.objectPanel}"]`,
      '[data-scene-hud-panel="objectInfoHud"]',
    ]),
    sceneZoneId: SCENE_HUD_ZONE_IDS.objectPanel,
  }),
  D: Object.freeze({
    label: "Timeline Safe Zone",
    ownerComponent: "ExecutiveBottomWorkspaceOverlay",
    domSelectors: Object.freeze([
      `[data-nx-zone="${SCENE_HUD_ZONE_IDS.timeline}"]`,
      '[data-hud="timeline"]',
      '[data-scene-hud-panel="timelineHud"]',
    ]),
    sceneZoneId: SCENE_HUD_ZONE_IDS.timeline,
  }),
  E: Object.freeze({
    label: "MRP Safe Zone",
    ownerComponent: "MainRightPanelShell",
    domSelectors: Object.freeze([
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.rightDock}`,
      `#${EXECUTIVE_WORKSPACE_ZONE_IDS.visibleMrpHost}`,
      "#nexora-main-right-panel-shell",
      '[data-nx="mrp-chat-first-assistant-surface"]',
      '[data-nx="executive-dashboard-home-surface"]',
    ]),
  }),
  F: Object.freeze({
    label: "Floating Overlay Zone",
    ownerComponent: "SceneOverlayRenderer / future war room overlays",
    domSelectors: Object.freeze([
      "#nexora-stage-overlay",
      '[data-nx-overlay="timeline-events"]',
      '[data-scene-hud-panel="scenarioOverlay"]',
    ]),
  }),
});

export const HUD_AUDIT_PORTAL_HOST_REGISTRY: readonly Readonly<{
  id: string;
  selector: string;
  ownerComponent: string;
  expectedRole: HudAuditPortalHost["expectedRole"];
}>[] = Object.freeze([
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.rightPanelRoot,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.rightPanelRoot}`,
    ownerComponent: "RightPanelHost (legacy dashboard portal)",
    expectedRole: "legacy",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.visibleMrpHost,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.visibleMrpHost}`,
    ownerComponent: "MainRightPanelShell (Type-C visible MRP)",
    expectedRole: "active",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}`,
    ownerComponent: "ObjectPanelShell",
    expectedRole: "hidden",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost}`,
    ownerComponent: "ExecutiveAssistantPanel",
    expectedRole: "active",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.executiveScenarioHost}`,
    ownerComponent: "ExecutiveScenarioSuggestionsPanel",
    expectedRole: "active",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.executiveComparisonHost}`,
    ownerComponent: "ExecutiveScenarioComparisonPanel",
    expectedRole: "active",
  }),
  Object.freeze({
    id: EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantShell,
    selector: `#${EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantShell}`,
    ownerComponent: "ExecutiveAssistantPanelShell (legacy)",
    expectedRole: "legacy",
  }),
  Object.freeze({
    id: "nexora-left-command-host",
    selector: "#nexora-left-command-host",
    ownerComponent: "LeftCommandAssistant",
    expectedRole: "legacy",
  }),
]);

export function resolveHudAuditVerdict(input: {
  overlapDetected: boolean;
  hiddenHostDetected: boolean;
  visibleOverlapCount: number;
  contractMrpOverlapDetected: boolean;
  safeZoneViolationCount: number;
}): HudAuditVerdict {
  if (input.visibleOverlapCount > 0) return "fail";
  if (input.contractMrpOverlapDetected && input.overlapDetected) return "warning";
  if (input.hiddenHostDetected || input.safeZoneViolationCount > 0) return "warning";
  if (input.overlapDetected) return "warning";
  return "pass";
}

export function traceHudAuditZone(input: {
  zone: string;
  owner: string;
  visible: boolean;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[NexoraHUDAudit]\nzone=${input.zone}\nowner=${input.owner}\nvisible=${String(input.visible)}`
  );
}

export function traceHudAuditOverlapDetected(overlapDetected: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraHUDAudit]\noverlapDetected=${String(overlapDetected)}`);
}

export function traceHudAuditHiddenHostDetected(hiddenHostDetected: boolean): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraHUDAudit]\nhiddenHostDetected=${String(hiddenHostDetected)}`);
}

export function traceHudAuditPortalCount(portalCount: number): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraHUDAudit]\nportalCount=${portalCount}`);
}

export function traceHudAuditStatus(status: HudAuditVerdict): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(`[NexoraHUDAudit]\nauditStatus=${status}`);
}
