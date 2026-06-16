/**
 * MRP:3:2 — Unified MRP Context Store runtime.
 *
 * Single publish authority for Section B Context Header fields.
 */

import type { DashboardContext } from "../mainRightPanelContract.ts";
import type { DashboardMode } from "../../dashboard/dashboardModeRuntimeContract.ts";
import type { MainRightPanelTab } from "../mainRightPanelContract.ts";
import {
  DEFAULT_MRP_ACTIVE_MODE,
  DEFAULT_MRP_BACK_LABEL,
  DEFAULT_MRP_PANEL_NAME,
  DEFAULT_MRP_SELECTED_OBJECT,
  MRP_CONTEXT_GUARD_TAG,
  MRP_CONTEXT_SYNC_TAG,
  type MrpContextHeaderView,
  type MrpContextPublishResult,
  type MrpContextResolverInput,
  type MrpContextStoreSnapshot,
} from "./mrpContextStoreContract.ts";
import {
  buildMrpContextHeaderView,
  buildMrpContextSignature,
} from "./mrpContextResolver.ts";

const listeners = new Set<() => void>();
const loggedGuardKeys = new Set<string>();
const loggedSyncKeys = new Set<string>();

let revision = 0;
let lastSignature: string | null = null;
let publishCount = 0;
let loopGuardWindowStart = 0;
let loopGuardPublishCount = 0;

let snapshot: MrpContextStoreSnapshot = createInitialSnapshot();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function createDefaultHeader(rev = 0): MrpContextHeaderView {
  return Object.freeze({
    panelName: DEFAULT_MRP_PANEL_NAME,
    activeMode: DEFAULT_MRP_ACTIVE_MODE,
    selectedObject: DEFAULT_MRP_SELECTED_OBJECT,
    backLabel: DEFAULT_MRP_BACK_LABEL,
    showBackNavigation: false,
    revision: rev,
    source: "mrp_context_store",
  });
}

function createInitialSnapshot(): MrpContextStoreSnapshot {
  const header = createDefaultHeader(0);
  return Object.freeze({
    header,
    activeTab: "dashboard",
    dashboardMode: "overview",
    dashboardContext: "overview",
    selectedObjectId: null,
    revision: 0,
    signature: "initial",
  });
}

function logGuardOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.warn?.(MRP_CONTEXT_GUARD_TAG, detail);
}

function logSyncOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedSyncKeys.has(key)) return;
  loggedSyncKeys.add(key);
  globalThis.console?.debug?.(MRP_CONTEXT_SYNC_TAG, detail);
}

function detectRenderLoop(): boolean {
  const now = Date.now();
  if (now - loopGuardWindowStart > 1000) {
    loopGuardWindowStart = now;
    loopGuardPublishCount = 0;
  }
  loopGuardPublishCount += 1;
  if (loopGuardPublishCount > 30) {
    logGuardOnce("render_loop", {
      reason: "publish_rate_exceeded",
      publishCount: loopGuardPublishCount,
    });
    return true;
  }
  return false;
}

function validateHeader(header: MrpContextHeaderView): string | null {
  if (!header.panelName.trim()) return "empty_panel_name";
  if (!header.activeMode.trim()) return "empty_active_mode";
  if (!header.selectedObject.trim()) return "empty_selected_object";
  return null;
}

export function getMrpContextStoreSnapshot(): MrpContextStoreSnapshot {
  return snapshot;
}

export function getMrpContextHeaderView(): MrpContextHeaderView {
  return snapshot.header;
}

export function getMrpContextStoreServerSnapshot(): MrpContextStoreSnapshot {
  return createInitialSnapshot();
}

export function subscribeMrpContextStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function publishMrpContextStore(input: MrpContextResolverInput): MrpContextPublishResult {
  publishCount += 1;

  if (detectRenderLoop()) {
    return Object.freeze({
      changed: false,
      header: snapshot.header,
      revision: snapshot.revision,
      guarded: true,
      guardReason: "render_loop",
    });
  }

  const signature = buildMrpContextSignature(input);
  if (signature === lastSignature) {
    return Object.freeze({
      changed: false,
      header: snapshot.header,
      revision: snapshot.revision,
      guarded: false,
    });
  }

  const nextRevision = revision + 1;
  const header = buildMrpContextHeaderView(input, nextRevision);
  const guardReason = validateHeader(header);

  if (guardReason) {
    logGuardOnce(`invalid:${guardReason}:${signature}`, {
      reason: guardReason,
      signature,
    });
    return Object.freeze({
      changed: false,
      header: snapshot.header,
      revision: snapshot.revision,
      guarded: true,
      guardReason,
    });
  }

  revision = nextRevision;
  lastSignature = signature;

  snapshot = Object.freeze({
    header,
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    dashboardContext: input.dashboardContext,
    selectedObjectId: input.selectedObjectId?.trim() || null,
    revision: nextRevision,
    signature,
  });

  logSyncOnce(signature, {
    panelName: header.panelName,
    activeMode: header.activeMode,
    selectedObject: header.selectedObject,
    revision: nextRevision,
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    dashboardContext: input.dashboardContext,
  });

  notifyListeners();

  return Object.freeze({
    changed: true,
    header,
    revision: nextRevision,
    guarded: false,
  });
}

export function resetMrpContextStoreForTests(): void {
  revision = 0;
  lastSignature = null;
  publishCount = 0;
  loopGuardWindowStart = 0;
  loopGuardPublishCount = 0;
  loggedGuardKeys.clear();
  loggedSyncKeys.clear();
  snapshot = createInitialSnapshot();
  notifyListeners();
}

/** @internal Test helper — expose publish count. */
export function getMrpContextStorePublishCountForTests(): number {
  return publishCount;
}
