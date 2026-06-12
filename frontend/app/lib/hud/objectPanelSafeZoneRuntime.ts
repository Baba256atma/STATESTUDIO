/**
 * MRP_HUD:10:2 — Object Panel safe zone runtime enforcement.
 */

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../ui/executiveWorkspaceLayout.ts";
import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import {
  objectPanelSafeZoneSignature,
  resolveObjectPanelSafeZoneContract,
  type ObjectPanelSafeZoneContract,
  type ObjectPanelSafeZoneInput,
} from "./objectPanelSafeZoneContract.ts";
import { traceObjectPanelSafeZoneContract } from "./objectPanelSafeZoneDiagnostics.ts";

export type ObjectPanelOwnershipHost = Readonly<{
  id: string;
  selector: string;
  mounted: boolean;
  visible: boolean;
  zeroSize: boolean;
  width: number;
  height: number;
}>;

export type ObjectPanelOwnershipAudit = Readonly<{
  activeOwners: readonly string[];
  duplicateMountDetected: boolean;
  shadowMountDetected: boolean;
  zeroSizeHostDetected: boolean;
  verdict: "pass" | "warning" | "fail";
}>;

const OBJECT_PANEL_HOST_SELECTORS = Object.freeze([
  `[data-nx-zone="objectPanel"]`,
  '[data-scene-hud-panel="objectInfoHud"]',
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}`,
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelShell}`,
]);

let lastEnforcementSignature: string | null = null;
let lastEnforcementResult: ObjectPanelSafeZoneContract | null = null;

function readHostMetrics(selector: string): ObjectPanelOwnershipHost {
  if (typeof document === "undefined") {
    return Object.freeze({
      id: selector,
      selector,
      mounted: false,
      visible: false,
      zeroSize: true,
      width: 0,
      height: 0,
    });
  }

  const element = document.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    return Object.freeze({
      id: selector,
      selector,
      mounted: false,
      visible: false,
      zeroSize: true,
      width: 0,
      height: 0,
    });
  }

  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const hidden =
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number.parseFloat(style.opacity || "1") <= 0.05;
  const zeroSize = rect.width <= 1 && rect.height <= 1;
  const visible = !hidden && !zeroSize && rect.width > 0 && rect.height > 0;

  return Object.freeze({
    id: element.id || selector,
    selector,
    mounted: true,
    visible,
    zeroSize,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  });
}

export function auditObjectPanelOwnership(): ObjectPanelOwnershipAudit {
  const hosts = OBJECT_PANEL_HOST_SELECTORS.map(readHostMetrics);
  const visibleOwners = hosts.filter((host) => host.visible).map((host) => host.id);
  const mountedOwners = hosts.filter((host) => host.mounted && !host.zeroSize).map((host) => host.id);
  const duplicateMountDetected = visibleOwners.length > 1;
  const shadowMountDetected =
    visibleOwners.some((id) => id.includes("object-panel-host")) &&
    visibleOwners.some((id) => id.includes("objectPanel") || id.includes("objectInfoHud"));
  const zeroSizeHostDetected = hosts.some(
    (host) => host.mounted && host.zeroSize && host.selector.includes("object-panel-host")
  );

  let verdict: ObjectPanelOwnershipAudit["verdict"] = "pass";
  if (duplicateMountDetected) verdict = "fail";
  else if (shadowMountDetected || zeroSizeHostDetected) verdict = "warning";

  return Object.freeze({
    activeOwners: Object.freeze(visibleOwners),
    duplicateMountDetected,
    shadowMountDetected,
    zeroSizeHostDetected,
    verdict,
  });
}

export function enforceObjectPanelSafeZone(
  input: ObjectPanelSafeZoneInput
): ObjectPanelSafeZoneContract {
  return resolveObjectPanelSafeZoneContract(input);
}

export function applyObjectPanelSafeZoneToHudContract(
  hudContract: SceneHudZoneContract,
  safeZone: ObjectPanelSafeZoneContract
): SceneHudZoneContract {
  return Object.freeze({
    ...hudContract,
    objectPanelZone: safeZone.objectPanelZone,
    objectPanelRight: safeZone.objectPanelRight,
    objectPanelWidth: safeZone.objectPanelWidth,
    mrpOverlapDetected: safeZone.overlapDetected,
    clamped: hudContract.clamped || safeZone.clamped,
  });
}

export type ObjectPanelSafeZoneRuntimeInput = ObjectPanelSafeZoneInput;

export function runObjectPanelSafeZoneEnforcement(
  input: ObjectPanelSafeZoneRuntimeInput
): ObjectPanelSafeZoneContract {
  const result = enforceObjectPanelSafeZone(input);
  const signature = objectPanelSafeZoneSignature(result);

  if (lastEnforcementSignature === signature && lastEnforcementResult) {
    return lastEnforcementResult;
  }

  lastEnforcementSignature = signature;
  lastEnforcementResult = result;
  traceObjectPanelSafeZoneContract(result);

  if (typeof window !== "undefined") {
    (
      window as typeof window & {
        __NEXORA_OBJECT_PANEL_SAFE_ZONE__?: ObjectPanelSafeZoneContract;
      }
    ).__NEXORA_OBJECT_PANEL_SAFE_ZONE__ = result;
  }

  return result;
}

export function resetObjectPanelSafeZoneForTests(): void {
  lastEnforcementSignature = null;
  lastEnforcementResult = null;
  if (typeof window !== "undefined") {
    delete (
      window as typeof window & {
        __NEXORA_OBJECT_PANEL_SAFE_ZONE__?: ObjectPanelSafeZoneContract;
      }
    ).__NEXORA_OBJECT_PANEL_SAFE_ZONE__;
  }
}
