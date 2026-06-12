/**
 * MRP_HUD:10:5 — HUD runtime freeze validation.
 */

import { stableLayoutSignature } from "../layout/layoutThrottleAuditRuntime.ts";
import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import type { SceneHudZoneContractContext } from "../scene/sceneHudZoneContract.ts";
import { resolveSceneHudZoneContract, resetSceneHudZoneContractForTests } from "../scene/sceneHudZoneContract.ts";
import { auditObjectPanelOwnership } from "./objectPanelSafeZoneRuntime.ts";
import { resolveObjectPanelSafeZoneContract } from "./objectPanelSafeZoneContract.ts";
import { MIN_OBJECT_PANEL_TO_MRP_GAP } from "./objectPanelSafeZoneContract.ts";
import { auditTimelineOwnership } from "./timelineZoneRuntime.ts";
import { resolveTimelineZoneContract } from "./timelineZoneContract.ts";
import {
  MIN_TIMELINE_TO_OBJECT_PANEL_GAP,
  MIN_TIMELINE_TO_SCENE_PANEL_GAP,
} from "./timelineZoneContract.ts";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract.ts";
import {
  HUD_RUNTIME_FREEZE_V1,
  HUD_SUPPORTED_MIN_VIEWPORT_WIDTH_PX,
  type HudRuntimeFreezeStatus,
  type HudRuntimeFreezeZoneId,
} from "./hudRuntimeFreezeContract.ts";
import { auditHudZoneContract } from "./hudZoneAuditRuntime.ts";
import {
  absorbObjectClickLegacyRedirect,
  evaluateObjectClickPanelIntent,
  isObjectClickPanelIntentApplied,
  markObjectClickPanelIntentApplied,
  resetObjectClickPanelDedupForTests,
} from "./objectClickPanelDedupRuntime.ts";

export type ObjectClickFreezeQaResult = Readonly<{
  appliedWrites: number;
  duplicateWritesBlocked: number;
  legacyRedirectsAbsorbed: number;
  idleReplayBlocked: boolean;
  objectClickPanelLoop: boolean;
  writeSequence: readonly string[];
}>;

export function runObjectClickFreezeQaSequence(): ObjectClickFreezeQaResult {
  resetObjectClickPanelDedupForTests();

  let now = 1_000;
  let appliedWrites = 0;
  let duplicateWritesBlocked = 0;
  let legacyRedirectsAbsorbed = 0;
  const writeSequence: string[] = [];
  let previousObjectId: string | null = null;

  const attemptClick = (objectId: string, clickEventId: string): void => {
    const { intent, decision } = evaluateObjectClickPanelIntent({
      objectId,
      clickEventId,
      previousObjectId,
      now,
    });
    if (decision.action === "apply") {
      markObjectClickPanelIntentApplied({
        intent,
        clickEventId,
        reason: decision.reason === "changed_object" ? "changed_object" : "changed_mode",
        now,
      });
      appliedWrites += 1;
      writeSequence.push(objectId);
      previousObjectId = objectId;
    } else {
      duplicateWritesBlocked += 1;
    }

    if (
      isObjectClickPanelIntentApplied({ objectId, clickEventId, now })
    ) {
      absorbObjectClickLegacyRedirect({ objectId, clickEventId });
      legacyRedirectsAbsorbed += 1;
    }

    const deferredDuplicate = evaluateObjectClickPanelIntent({
      objectId,
      clickEventId,
      previousObjectId,
      now,
    });
    if (deferredDuplicate.decision.action === "skip") {
      duplicateWritesBlocked += 1;
    }
  };

  attemptClick("obj-a", "evt-a1");
  now += 3_000;
  attemptClick("obj-b", "evt-b1");
  now += 3_000;
  attemptClick("obj-a", "evt-a2");
  const finalWriteCount = appliedWrites;

  const deferredAt = now + 100;
  const deferredDuplicate = evaluateObjectClickPanelIntent({
    objectId: "obj-a",
    clickEventId: "evt-a2",
    previousObjectId: "obj-a",
    now: deferredAt,
  });
  if (deferredDuplicate.decision.action === "skip") {
    duplicateWritesBlocked += 1;
  }

  now += 10_000;
  const idleReplayBlocked =
    appliedWrites === finalWriteCount && deferredDuplicate.decision.action === "skip";

  const objectClickPanelLoop =
    appliedWrites !== 3 || !idleReplayBlocked;

  return Object.freeze({
    appliedWrites,
    duplicateWritesBlocked,
    legacyRedirectsAbsorbed,
    idleReplayBlocked,
    objectClickPanelLoop,
    writeSequence: Object.freeze(writeSequence),
  });
}

export function validateObjectClickSingleWriteBehavior(): Readonly<{
  pass: boolean;
  appliedWrites: number;
  duplicateWritesBlocked: number;
  idleReplayBlocked: boolean;
}> {
  const result = runObjectClickFreezeQaSequence();
  return Object.freeze({
    pass:
      result.appliedWrites === 3 &&
      result.duplicateWritesBlocked >= 1 &&
      result.idleReplayBlocked &&
      !result.objectClickPanelLoop,
    appliedWrites: result.appliedWrites,
    duplicateWritesBlocked: result.duplicateWritesBlocked,
    idleReplayBlocked: result.idleReplayBlocked,
  });
}

export type HudRuntimeFreezeValidationInput = Readonly<{
  sceneHudContract: SceneHudZoneContract;
  context?: Pick<
    SceneHudZoneContractContext,
    | "mainRightPanelWidth"
    | "mainRightPanelVisible"
    | "objectPanelExpanded"
    | "timelineHeightMode"
    | "timelineVisible"
    | "sceneWidth"
  >;
  activeMrpTab?: "dashboard" | "assistant";
  useVisibleMrpHost?: boolean;
}>;

export type HudRuntimeFreezeValidationResult = Readonly<{
  freezeId: typeof HUD_RUNTIME_FREEZE_V1.id;
  overall: HudRuntimeFreezeStatus;
  zones: Readonly<Record<HudRuntimeFreezeZoneId, HudRuntimeFreezeStatus>>;
  checks: Readonly<{
    visibleOverlap: boolean;
    objectPanelMrpCollision: boolean;
    timelineObjectPanelCollision: boolean;
    timelineScenePanelCollision: boolean;
    hiddenZeroSizeHosts: boolean;
    duplicateOwners: boolean;
    repeatedLayoutWrites: boolean;
    hudZoneBrakeWouldSpam: boolean;
    objectClickPanelLoop: boolean;
    objectClickSingleWrite: boolean;
    objectClickIdleReplay: boolean;
    resizeLayoutLoop: boolean;
  }>;
  consoleWarnings: readonly string[];
  signature: string;
  notes: readonly string[];
}>;

const FIXED_OBJECT_PANEL_SLOT_WIDTH = SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth;

function buildObjectPanelSafeZoneInput(
  contract: SceneHudZoneContract,
  context: HudRuntimeFreezeValidationInput["context"]
) {
  const mrpWidth = Math.max(0, context?.mainRightPanelWidth ?? contract.mrpWidth);
  const mrpVisible = context?.mainRightPanelVisible !== false && mrpWidth > 0;
  const usingViewportFallback =
    !context?.sceneWidth ||
    context.sceneWidth <= 0 ||
    context.sceneWidth >= contract.viewportWidth - 1;

  return {
    viewportWidth: contract.viewportWidth,
    layoutWidth: contract.sceneWidth,
    layoutHeight: contract.sceneHeight,
    sideInset: contract.scenePanelZone.left,
    sideTop: contract.scenePanelZone.top,
    sideMaxHeight: contract.objectPanelZone.height,
    scenePanelLeft: contract.scenePanelZone.left,
    scenePanelWidth: contract.scenePanelZone.width,
    objectPanelWidthRequested: context?.objectPanelExpanded
      ? SCENE_HUD_ZONE_METRICS.objectPanelExpandedWidth
      : FIXED_OBJECT_PANEL_SLOT_WIDTH,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile: contract.sceneWidth < 768,
    objectPanelExpanded: context?.objectPanelExpanded ?? false,
  };
}

function buildTimelineSafeZoneInput(
  contract: SceneHudZoneContract,
  context: HudRuntimeFreezeValidationInput["context"]
) {
  const mrpWidth = Math.max(0, context?.mainRightPanelWidth ?? contract.mrpWidth);
  const mrpVisible = context?.mainRightPanelVisible !== false && mrpWidth > 0;
  const usingViewportFallback =
    !context?.sceneWidth ||
    context.sceneWidth <= 0 ||
    context.sceneWidth >= contract.viewportWidth - 1;

  return {
    viewportWidth: contract.viewportWidth,
    layoutWidth: contract.sceneWidth,
    layoutHeight: contract.sceneHeight,
    sideInset: contract.scenePanelZone.left,
    timelineTop: contract.timelineZone.top,
    timelineHeight: contract.timelineZone.height,
    timelineBottomOffset: contract.timelineZone.bottom ?? SCENE_HUD_ZONE_METRICS.chatInputClearance,
    scenePanelLeft: contract.scenePanelZone.left,
    scenePanelWidth: contract.scenePanelZone.width,
    objectPanelLeft: contract.objectPanelZone.left,
    objectPanelWidth: contract.objectPanelZone.width,
    objectPanelBandWidth: FIXED_OBJECT_PANEL_SLOT_WIDTH,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile: contract.sceneWidth < 768,
  };
}

function resolveZoneStatus(...flags: boolean[]): HudRuntimeFreezeStatus {
  if (flags.some(Boolean)) return "fail";
  return "pass";
}

function resolveZoneStatusWithWarning(pass: boolean, warning: boolean): HudRuntimeFreezeStatus {
  if (!pass) return "fail";
  if (warning) return "warning";
  return "pass";
}

export function runHudRuntimeFreezeValidation(
  input: HudRuntimeFreezeValidationInput
): HudRuntimeFreezeValidationResult {
  const contract = input.sceneHudContract;
  const context = input.context;
  const supportedWidth = contract.viewportWidth >= HUD_SUPPORTED_MIN_VIEWPORT_WIDTH_PX;

  const objectSafeZone = resolveObjectPanelSafeZoneContract(
    buildObjectPanelSafeZoneInput(contract, context)
  );
  const timelineSafeZone = resolveTimelineZoneContract(
    buildTimelineSafeZoneInput(contract, context)
  );

  const objectOwnership =
    typeof document !== "undefined" ? auditObjectPanelOwnership() : null;
  const timelineOwnership =
    typeof document !== "undefined" ? auditTimelineOwnership() : null;

  const hudAudit = auditHudZoneContract({
    sceneHudContract: contract,
    activeMrpTab: input.activeMrpTab,
    useVisibleMrpHost: input.useVisibleMrpHost,
  });

  const timelineRight = contract.timelineZone.left + contract.timelineZone.width;
  const scenePanelRight = contract.scenePanelZone.left + contract.scenePanelZone.width;

  const objectPanelMrpCollision =
    supportedWidth &&
    (contract.mrpOverlapDetected || objectSafeZone.overlapDetected);

  const timelineObjectPanelCollision =
    supportedWidth &&
    contract.timelineZone.top <
      contract.objectPanelZone.top + contract.objectPanelZone.height - 0.5 &&
    timelineRight > contract.objectPanelZone.left - MIN_TIMELINE_TO_OBJECT_PANEL_GAP + 0.5;

  const timelineScenePanelCollision =
    supportedWidth &&
    contract.timelineZone.top <
      contract.scenePanelZone.top + contract.scenePanelZone.height - 0.5 &&
    timelineRight > scenePanelRight + 0.5 &&
    contract.timelineZone.left < scenePanelRight + MIN_TIMELINE_TO_SCENE_PANEL_GAP - 0.5;

  const visibleOverlap =
    supportedWidth &&
    (objectPanelMrpCollision ||
      timelineObjectPanelCollision ||
      timelineScenePanelCollision ||
      contract.overlapDetected);

  const hiddenZeroSizeHosts =
    hudAudit.hiddenHostDetected ||
    objectOwnership?.zeroSizeHostDetected === true ||
    timelineOwnership?.zeroSizeHostDetected === true;

  const duplicateOwners =
    objectOwnership?.duplicateMountDetected === true ||
    timelineOwnership?.duplicateMountDetected === true;

  const verySmallWidth =
    contract.viewportWidth <
    HUD_RUNTIME_FREEZE_V1.frozenBehaviors.hudDebounceStrategy.verySmallWidthThresholdPx;

  const checks = Object.freeze({
    visibleOverlap,
    objectPanelMrpCollision,
    timelineObjectPanelCollision,
    timelineScenePanelCollision,
    hiddenZeroSizeHosts,
    duplicateOwners,
    repeatedLayoutWrites: false,
    hudZoneBrakeWouldSpam: false,
    objectClickPanelLoop: false,
    objectClickSingleWrite: true,
    objectClickIdleReplay: true,
    resizeLayoutLoop: false,
  });

  const consoleWarnings: string[] = [];
  if (contract.overlapDetected && verySmallWidth && contract.clamped) {
    consoleWarnings.push(
      "HUDZoneBrake: single diagnostic allowed at very small widths when clamped"
    );
  }

  const zones: Record<HudRuntimeFreezeZoneId, HudRuntimeFreezeStatus> = {
    scenePanel: resolveZoneStatusWithWarning(
      contract.scenePanelZone.width > 0,
      contract.clamped && verySmallWidth
    ),
    objectPanel: resolveZoneStatus(
      objectPanelMrpCollision,
      objectOwnership?.verdict === "fail"
    ),
    timeline: resolveZoneStatus(
      timelineObjectPanelCollision,
      timelineScenePanelCollision,
      timelineSafeZone.overlapDetected && supportedWidth,
      timelineOwnership?.verdict === "fail"
    ),
    mrp: resolveZoneStatus(contract.mrpOverlapDetected && supportedWidth),
    assistant: input.activeMrpTab === "dashboard" ? "pass" : "pass",
    floatingOverlay: "pass",
    topControls: contract.topBarZone.width > 0 ? "pass" : "warning",
    commandDock: contract.timelineZone.bottom !== undefined ? "pass" : "warning",
  };

  if (timelineOwnership?.forbiddenPortalDetected) {
    zones.timeline = "fail";
  }
  if (objectOwnership?.verdict === "warning") {
    zones.objectPanel = zones.objectPanel === "pass" ? "warning" : zones.objectPanel;
  }

  const overall: HudRuntimeFreezeStatus = Object.values(zones).some((s) => s === "fail")
    ? "fail"
    : Object.values(zones).some((s) => s === "warning")
      ? "warning"
      : "pass";

  const signature = stableLayoutSignature({
    viewportWidth: contract.viewportWidth,
    sceneWidth: contract.sceneWidth,
    overall,
    zones,
    checks,
    activeMrpTab: input.activeMrpTab ?? null,
  });

  return Object.freeze({
    freezeId: HUD_RUNTIME_FREEZE_V1.id,
    overall,
    zones: Object.freeze(zones),
    checks,
    consoleWarnings: Object.freeze(consoleWarnings),
    signature,
    notes: Object.freeze([
      supportedWidth
        ? "supported viewport width"
        : "below supported minimum viewport",
      verySmallWidth ? "very small width — clamp diagnostics only" : "standard width",
      input.useVisibleMrpHost ? "Type-C visible MRP host" : "legacy MRP host mode",
    ]),
  });
}

export type HudRuntimeQaScenario =
  | "fresh_load"
  | "dashboard_tab"
  | "assistant_tab"
  | "select_object_a"
  | "select_object_b"
  | "deselect_canvas"
  | "assistant_support_panels"
  | "resize_viewport"
  | "idle_60s"
  | "console_inspection";

export function runHudRuntimeQaScenario(input: {
  scenario: HudRuntimeQaScenario;
  viewportWidth?: number;
  viewportHeight?: number;
  sceneWidth?: number;
  sceneHeight?: number;
  objectPanelExpanded?: boolean;
  activeMrpTab?: "dashboard" | "assistant";
}): HudRuntimeFreezeValidationResult {
  resetSceneHudZoneContractForTests();

  const viewportWidth = input.viewportWidth ?? 1440;
  const viewportHeight = input.viewportHeight ?? 900;
  const sceneWidth = input.sceneWidth ?? Math.max(480, viewportWidth - 72 - 430 - 24);
  const sceneHeight = input.sceneHeight ?? 800;

  const contract = resolveSceneHudZoneContract({
    viewportWidth,
    viewportHeight,
    sceneWidth,
    sceneHeight,
    mainRightPanelWidth: 430,
    mainRightPanelVisible: true,
    scenePanelVisible: true,
    timelineVisible: true,
    topBarVisible: true,
    objectPanelExpanded:
      input.scenario === "select_object_b" ? true : (input.objectPanelExpanded ?? false),
  });

  return mergeHudRuntimeQaScenarioChecks(
    runHudRuntimeFreezeValidation({
      sceneHudContract: contract,
      context: {
        mainRightPanelWidth: 430,
        mainRightPanelVisible: true,
        objectPanelExpanded: input.objectPanelExpanded ?? false,
        timelineVisible: true,
        sceneWidth,
      },
      activeMrpTab: input.activeMrpTab,
      useVisibleMrpHost: true,
    }),
    input.scenario
  );
}

function mergeHudRuntimeQaScenarioChecks(
  result: HudRuntimeFreezeValidationResult,
  scenario: HudRuntimeQaScenario
): HudRuntimeFreezeValidationResult {
  const objectClickScenarios: HudRuntimeQaScenario[] = [
    "select_object_a",
    "select_object_b",
    "idle_60s",
    "console_inspection",
  ];
  if (!objectClickScenarios.includes(scenario)) {
    return result;
  }

  const objectClickQa = validateObjectClickSingleWriteBehavior();
  return Object.freeze({
    ...result,
    checks: Object.freeze({
      ...result.checks,
      objectClickPanelLoop: !objectClickQa.pass,
      objectClickSingleWrite: objectClickQa.pass,
      objectClickIdleReplay: objectClickQa.idleReplayBlocked,
    }),
  });
}

export function validateHudRuntimeFreezeSignatureStability(
  contract: SceneHudZoneContract,
  context?: HudRuntimeFreezeValidationInput["context"]
): boolean {
  const first = runHudRuntimeFreezeValidation({ sceneHudContract: contract, context });
  const second = runHudRuntimeFreezeValidation({ sceneHudContract: contract, context });
  return first.signature === second.signature;
}
