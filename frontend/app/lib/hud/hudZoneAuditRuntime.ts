/**
 * MRP_HUD:10:1 — HUD zone audit runtime (DOM measurement + diagnosis only).
 */

import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import { zoneRectForId, SCENE_HUD_ZONE_IDS } from "../scene/sceneHudZoneContract.ts";
import { auditHiddenScenePanels } from "../scene/sceneHiddenPanelAudit.ts";
import {
  HUD_AUDIT_PORTAL_HOST_REGISTRY,
  HUD_AUDIT_ZONE_DEFINITIONS,
  resolveHudAuditVerdict,
  traceHudAuditHiddenHostDetected,
  traceHudAuditOverlapDetected,
  traceHudAuditPortalCount,
  traceHudAuditStatus,
  traceHudAuditZone,
  type HudAuditOverlap,
  type HudAuditPortalHost,
  type HudAuditZoneMeasurement,
  type HudZoneContractAuditResult,
} from "./hudZoneContractAudit.ts";

export type HudZoneAuditRuntimeInput = Readonly<{
  sceneHudContract: SceneHudZoneContract;
  activeMrpTab?: "dashboard" | "assistant";
  useVisibleMrpHost?: boolean;
}>;

let lastAuditSignature: string | null = null;
let lastAuditResult: HudZoneContractAuditResult | null = null;

function readElementMetrics(selector: string): {
  element: HTMLElement | null;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  visible: boolean;
  hidden: boolean;
  zeroSize: boolean;
  mountedComponent: string;
} {
  if (typeof document === "undefined") {
    return {
      element: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 0,
      visible: false,
      hidden: true,
      zeroSize: true,
      mountedComponent: "unavailable",
    };
  }

  const element = document.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    return {
      element: null,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 0,
      visible: false,
      hidden: true,
      zeroSize: true,
      mountedComponent: "not-mounted",
    };
  }

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const zIndex = Number.parseInt(style.zIndex || "0", 10) || 0;
  const hidden =
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number.parseFloat(style.opacity || "1") <= 0.05;
  const zeroSize = rect.width <= 1 && rect.height <= 1;
  const visible = !hidden && !zeroSize && rect.width > 0 && rect.height > 0;
  const mountedComponent =
    element.getAttribute("data-nx") ??
    element.getAttribute("data-nx-zone") ??
    element.getAttribute("data-hud") ??
    element.id;

  return {
    element,
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    zIndex,
    visible,
    hidden,
    zeroSize,
    mountedComponent,
  };
}

function resolveFirstVisibleSelector(selectors: readonly string[]): string | null {
  for (const selector of selectors) {
    const metrics = readElementMetrics(selector);
    if (metrics.element) return selector;
  }
  return selectors[0] ?? null;
}

function measureAuditZones(
  contract: SceneHudZoneContract
): HudAuditZoneMeasurement[] {
  return (Object.keys(HUD_AUDIT_ZONE_DEFINITIONS) as Array<keyof typeof HUD_AUDIT_ZONE_DEFINITIONS>).map(
    (zoneId) => {
      const definition = HUD_AUDIT_ZONE_DEFINITIONS[zoneId];
      const selector = resolveFirstVisibleSelector(definition.domSelectors) ?? definition.domSelectors[0] ?? "";
      const metrics = readElementMetrics(selector);

      if (definition.sceneZoneId) {
        const rect = zoneRectForId(contract, definition.sceneZoneId as typeof SCENE_HUD_ZONE_IDS.scenePanel);
        return Object.freeze({
          zoneId,
          label: definition.label,
          x: metrics.visible ? metrics.x : Math.round(rect.left),
          y: metrics.visible ? metrics.y : Math.round(rect.top),
          width: metrics.visible ? metrics.width : Math.round(rect.width),
          height: metrics.visible ? metrics.height : Math.round(rect.height),
          zIndex: metrics.zIndex,
          ownerComponent: definition.ownerComponent,
          mountedComponent: metrics.mountedComponent,
          visibleComponent: metrics.visible ? metrics.mountedComponent : "contract-fallback",
          visible: metrics.visible,
        });
      }

      return Object.freeze({
        zoneId,
        label: definition.label,
        x: metrics.x,
        y: metrics.y,
        width: metrics.width,
        height: metrics.height,
        zIndex: metrics.zIndex,
        ownerComponent: definition.ownerComponent,
        mountedComponent: metrics.mountedComponent,
        visibleComponent: metrics.visible ? metrics.mountedComponent : "not-visible",
        visible: metrics.visible,
      });
    }
  );
}

function auditPortalHosts(): HudAuditPortalHost[] {
  return HUD_AUDIT_PORTAL_HOST_REGISTRY.map((entry) => {
    const metrics = readElementMetrics(entry.selector);
    return Object.freeze({
      id: entry.id,
      selector: entry.selector,
      ownerComponent: entry.ownerComponent,
      expectedRole: entry.expectedRole,
      x: metrics.x,
      y: metrics.y,
      width: metrics.width,
      height: metrics.height,
      zIndex: metrics.zIndex,
      visible: metrics.visible,
      hidden: metrics.hidden,
      zeroSize: metrics.zeroSize,
      mounted: metrics.element !== null,
    });
  });
}

function rectsIntersect(
  a: Pick<HudAuditZoneMeasurement, "x" | "y" | "width" | "height" | "visible">,
  b: Pick<HudAuditZoneMeasurement, "x" | "y" | "width" | "height" | "visible">
): number {
  if (!a.visible || !b.visible || a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0) {
    return 0;
  }
  const left = Math.max(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  if (right <= left || bottom <= top) return 0;
  return (right - left) * (bottom - top);
}

function detectZoneOverlaps(zones: readonly HudAuditZoneMeasurement[]): HudAuditOverlap[] {
  const overlaps: HudAuditOverlap[] = [];
  for (let i = 0; i < zones.length; i += 1) {
    for (let j = i + 1; j < zones.length; j += 1) {
      const a = zones[i];
      const b = zones[j];
      if (!a || !b) continue;
      const overlapArea = rectsIntersect(a, b);
      if (overlapArea > 0) {
        overlaps.push(
          Object.freeze({
            zoneA: `${a.zoneId}:${a.label}`,
            zoneB: `${b.zoneId}:${b.label}`,
            overlapArea,
            visible: a.visible && b.visible,
          })
        );
      }
    }
  }
  return overlaps;
}

function collectSafeZoneViolations(input: {
  contract: SceneHudZoneContract;
  zones: readonly HudAuditZoneMeasurement[];
  portals: readonly HudAuditPortalHost[];
}): string[] {
  const violations: string[] = [];

  if (input.contract.mrpOverlapDetected) {
    violations.push("contract_mrp_overlap_detected");
  }
  if (input.contract.overlapDetected) {
    violations.push("contract_scene_zone_overlap_detected");
  }

  const objectZone = input.zones.find((zone) => zone.zoneId === "C");
  const mrpZone = input.zones.find((zone) => zone.zoneId === "E");
  if (objectZone?.visible && mrpZone?.visible) {
    const overlap = rectsIntersect(objectZone, mrpZone);
    if (overlap > 0) {
      violations.push("object_panel_overlaps_mrp_visible");
    }
  }

  const hiddenActiveHosts = input.portals.filter(
    (portal) => portal.expectedRole === "active" && portal.hidden && !portal.zeroSize
  );
  if (hiddenActiveHosts.length) {
    violations.push(`hidden_active_hosts:${hiddenActiveHosts.map((p) => p.id).join(",")}`);
  }

  const zeroSizeVisibleHosts = input.portals.filter(
    (portal) => portal.zeroSize && !portal.hidden && portal.expectedRole === "active"
  );
  if (zeroSizeVisibleHosts.length) {
    violations.push(`zero_size_active_hosts:${zeroSizeVisibleHosts.map((p) => p.id).join(",")}`);
  }

  const legacyHostsMounted = input.portals.filter(
    (portal) =>
      portal.expectedRole === "legacy" &&
      portal.width > 1 &&
      portal.height > 1 &&
      !portal.hidden
  );
  if (legacyHostsMounted.length > 1) {
    violations.push(`multiple_legacy_hosts_visible:${legacyHostsMounted.map((p) => p.id).join(",")}`);
  }

  return violations;
}

function buildAuditSignature(result: Omit<HudZoneContractAuditResult, "timestamp">): string {
  return [
    result.verdict,
    result.overlapDetected,
    result.hiddenHostDetected,
    result.portalCount,
    result.contractOverlapDetected,
    result.contractMrpOverlapDetected,
    result.safeZoneViolations.join("|"),
  ].join(":");
}

export function runHudZoneContractAudit(
  input: HudZoneAuditRuntimeInput
): HudZoneContractAuditResult {
  const zones = measureAuditZones(input.sceneHudContract);
  const portals = auditPortalHosts();
  const overlaps = detectZoneOverlaps(zones);
  const hiddenReports = typeof document !== "undefined" ? auditHiddenScenePanels() : [];
  const safeZoneViolations = collectSafeZoneViolations({
    contract: input.sceneHudContract,
    zones,
    portals,
  });

  const visibleOverlaps = overlaps.filter((overlap) => overlap.visible);
  const hiddenHostDetected = portals.some(
    (portal) =>
      (portal.hidden || portal.zeroSize) &&
      (portal.expectedRole === "active" || portal.id.includes("right-panel-root"))
  ) || hiddenReports.length > 0;

  const overlapDetected =
    input.sceneHudContract.overlapDetected ||
    input.sceneHudContract.mrpOverlapDetected ||
    visibleOverlaps.length > 0;

  const verdict = resolveHudAuditVerdict({
    overlapDetected,
    hiddenHostDetected,
    visibleOverlapCount: visibleOverlaps.length,
    contractMrpOverlapDetected: input.sceneHudContract.mrpOverlapDetected,
    safeZoneViolationCount: safeZoneViolations.length,
  });

  const result: HudZoneContractAuditResult = Object.freeze({
    auditId: "MRP_HUD:10:1",
    timestamp: Date.now(),
    verdict,
    overlapDetected,
    hiddenHostDetected,
    portalCount: portals.filter((portal) => portal.mounted).length,
    zones: Object.freeze(zones),
    portals: Object.freeze(portals),
    overlaps: Object.freeze(overlaps),
    brakes: Object.freeze([
      Object.freeze({
        source: "sceneHudZoneContract",
        overlapDetected: input.sceneHudContract.overlapDetected,
        mrpOverlapDetected: input.sceneHudContract.mrpOverlapDetected,
        detail: `sceneWidth=${input.sceneHudContract.sceneWidth}, mrpWidth=${input.sceneHudContract.mrpWidth}`,
      }),
    ]),
    safeZoneViolations: Object.freeze(safeZoneViolations),
    contractOverlapDetected: input.sceneHudContract.overlapDetected,
    contractMrpOverlapDetected: input.sceneHudContract.mrpOverlapDetected,
    notes: Object.freeze([
      input.useVisibleMrpHost
        ? "Type-C visible MRP host mode expected"
        : "Legacy right-panel-root host mode may be active",
      input.activeMrpTab ? `activeMrpTab=${input.activeMrpTab}` : "activeMrpTab=unknown",
    ]),
  });

  return result;
}

export function traceHudZoneContractAudit(result: HudZoneContractAuditResult): void {
  if (process.env.NODE_ENV === "production") return;

  for (const zone of result.zones) {
    traceHudAuditZone({
      zone: `${zone.zoneId}:${zone.label}`,
      owner: zone.ownerComponent,
      visible: zone.visible,
    });
  }

  traceHudAuditOverlapDetected(result.overlapDetected);
  traceHudAuditHiddenHostDetected(result.hiddenHostDetected);
  traceHudAuditPortalCount(result.portals.length);
  traceHudAuditStatus(result.verdict);
}

export function auditHudZoneContract(input: HudZoneAuditRuntimeInput): HudZoneContractAuditResult {
  const provisional = runHudZoneContractAudit(input);
  const signature = buildAuditSignature(provisional);

  if (lastAuditSignature === signature && lastAuditResult) {
    return lastAuditResult;
  }

  lastAuditSignature = signature;
  lastAuditResult = provisional;
  traceHudZoneContractAudit(provisional);

  if (typeof window !== "undefined") {
    (window as typeof window & { __NEXORA_HUD_ZONE_AUDIT__?: HudZoneContractAuditResult }).__NEXORA_HUD_ZONE_AUDIT__ =
      provisional;
  }

  return provisional;
}

export function resetHudZoneAuditForTests(): void {
  lastAuditSignature = null;
  lastAuditResult = null;
  if (typeof window !== "undefined") {
    delete (window as typeof window & { __NEXORA_HUD_ZONE_AUDIT__?: HudZoneContractAuditResult })
      .__NEXORA_HUD_ZONE_AUDIT__;
  }
}
