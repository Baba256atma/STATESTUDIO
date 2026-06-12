/**
 * MRP_HUD:10:3 — Timeline zone runtime enforcement.
 */

import { EXECUTIVE_WORKSPACE_ZONE_IDS } from "../ui/executiveWorkspaceLayout.ts";
import {
  resolveTimelineZoneContract,
  timelineZoneSignature,
  type TimelineZoneContract,
  type TimelineZoneInput,
} from "./timelineZoneContract.ts";
import {
  traceTimelineZoneContract,
  traceTimelineZoneWriteSkipped,
} from "./timelineZoneDiagnostics.ts";
import {
  commitTimelineWidthSnapshot,
  readTimelineWidthSnapshot,
} from "./timelineWidthContract.ts";
import {
  traceTimelineResize,
  traceTimelineWidthContract,
} from "./timeline131RuntimeDiagnostics.ts";
import { traceMrp129TimelineWidthUpdated } from "./mrp129RuntimeDiagnostics.ts";

export type TimelineOwnershipHost = Readonly<{
  id: string;
  selector: string;
  mounted: boolean;
  visible: boolean;
  zeroSize: boolean;
  width: number;
  height: number;
  inForbiddenHost: boolean;
}>;

export type TimelineOwnershipAudit = Readonly<{
  activeOwners: readonly string[];
  duplicateMountDetected: boolean;
  hiddenHostDetected: boolean;
  zeroSizeHostDetected: boolean;
  forbiddenPortalDetected: boolean;
  verdict: "pass" | "warning" | "fail";
}>;

const TIMELINE_HOST_SELECTORS = Object.freeze([
  `[data-nx-zone="scene-timeline-zone"]`,
  '[data-scene-hud-panel="timelineHud"]',
  '[data-hud="timeline"]',
]);

const FORBIDDEN_TIMELINE_HOST_SELECTORS = Object.freeze([
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.visibleMrpHost}`,
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.rightPanelRoot}`,
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.objectPanelHost}`,
  `#${EXECUTIVE_WORKSPACE_ZONE_IDS.executiveAssistantHost}`,
]);

let lastEnforcementSignature: string | null = null;
let lastEnforcementResult: TimelineZoneContract | null = null;

function readHostMetrics(
  selector: string,
  forbidden: boolean
): TimelineOwnershipHost {
  if (typeof document === "undefined") {
    return Object.freeze({
      id: selector,
      selector,
      mounted: false,
      visible: false,
      zeroSize: true,
      width: 0,
      height: 0,
      inForbiddenHost: forbidden,
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
      inForbiddenHost: forbidden,
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
  const hasTimelineChild = forbidden && Boolean(
    element.querySelector('[data-scene-hud-panel="timelineHud"], [data-hud="timeline"], [data-nx-zone="scene-timeline-zone"]')
  );

  return Object.freeze({
    id: element.id || selector,
    selector,
    mounted: true,
    visible: visible || hasTimelineChild,
    zeroSize,
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    inForbiddenHost: forbidden,
  });
}

export function auditTimelineOwnership(): TimelineOwnershipAudit {
  const allowedHosts = TIMELINE_HOST_SELECTORS.map((selector) =>
    readHostMetrics(selector, false)
  );
  const forbiddenHosts = FORBIDDEN_TIMELINE_HOST_SELECTORS.map((selector) =>
    readHostMetrics(selector, true)
  );

  const visibleOwners = allowedHosts.filter((host) => host.visible).map((host) => host.id);
  const duplicateMountDetected = visibleOwners.length > 1;
  const hiddenHostDetected = allowedHosts.some((host) => host.mounted && !host.visible && !host.zeroSize);
  const zeroSizeHostDetected = allowedHosts.some((host) => host.mounted && host.zeroSize);
  const forbiddenPortalDetected = forbiddenHosts.some((host) => host.visible);

  let verdict: TimelineOwnershipAudit["verdict"] = "pass";
  if (duplicateMountDetected || forbiddenPortalDetected) verdict = "fail";
  else if (hiddenHostDetected || zeroSizeHostDetected) verdict = "warning";

  return Object.freeze({
    activeOwners: Object.freeze(visibleOwners),
    duplicateMountDetected,
    hiddenHostDetected,
    zeroSizeHostDetected,
    forbiddenPortalDetected,
    verdict,
  });
}

export function enforceTimelineZone(input: TimelineZoneInput): TimelineZoneContract {
  return resolveTimelineZoneContract(input);
}

export function runTimelineZoneEnforcement(input: TimelineZoneInput): TimelineZoneContract {
  const result = enforceTimelineZone(input);
  const signature = timelineZoneSignature(result);

  if (lastEnforcementSignature === signature && lastEnforcementResult) {
    traceTimelineZoneWriteSkipped("same_layout_signature");
    return lastEnforcementResult;
  }

  lastEnforcementSignature = signature;
  lastEnforcementResult = result;
  traceTimelineZoneContract(result);
  const previousSnapshot = readTimelineWidthSnapshot();
  const widthSnapshot = commitTimelineWidthSnapshot(result.sceneWidth);
  if (widthSnapshot) {
    traceTimelineWidthContract(widthSnapshot);
    if (previousSnapshot.timelineTargetWidth > 0 && previousSnapshot.timelineTargetWidth !== widthSnapshot.timelineTargetWidth) {
      traceTimelineResize({
        previousWidth: previousSnapshot.timelineTargetWidth,
        nextWidth: widthSnapshot.timelineTargetWidth,
        sceneVisibleWidth: widthSnapshot.sceneVisibleWidth,
      });
    }
  }
  traceMrp129TimelineWidthUpdated({
    sceneWidth: result.sceneWidth,
    timelineWidth: result.timelineZone.width,
    ratio: result.timelineSceneWidthRatio,
  });

  if (typeof window !== "undefined") {
    (
      window as typeof window & {
        __NEXORA_TIMELINE_ZONE__?: TimelineZoneContract;
      }
    ).__NEXORA_TIMELINE_ZONE__ = result;
  }

  return result;
}

export function resetTimelineZoneForTests(): void {
  lastEnforcementSignature = null;
  lastEnforcementResult = null;
  if (typeof window !== "undefined") {
    delete (
      window as typeof window & {
        __NEXORA_TIMELINE_ZONE__?: TimelineZoneContract;
      }
    ).__NEXORA_TIMELINE_ZONE__;
  }
}
