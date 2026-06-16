/**
 * MRP:3:3 — MRP Context History runtime.
 *
 * Tracks panel, workspace, and sub-workspace transitions for Section B back navigation.
 */

import type { MrpContextResolverInput } from "./mrpContextStoreContract.ts";
import {
  buildMrpContextHeaderView,
  buildMrpContextSignature,
} from "./mrpContextResolver.ts";
import {
  MRP_BACK_NAVIGATION_TAG,
  MRP_CONTEXT_HISTORY_MAX_DEPTH,
  MRP_HISTORY_RUNTIME_TAG,
  type MrpContextBackNavigationResult,
  type MrpContextHistoryEntry,
  type MrpContextHistorySummary,
  type MrpContextTransitionType,
} from "./mrpContextHistoryContract.ts";

const listeners = new Set<() => void>();
const backStack: MrpContextHistoryEntry[] = [];
const loggedHistoryKeys = new Set<string>();
const loggedBackKeys = new Set<string>();

let currentEntry: MrpContextHistoryEntry | null = null;
let isRestoring = false;
let skipNextHistoryRecord = false;
let backNavigationInProgress = false;
let lastBackNavigationAt = 0;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function logHistoryOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedHistoryKeys.has(key)) return;
  loggedHistoryKeys.add(key);
  globalThis.console?.debug?.(MRP_HISTORY_RUNTIME_TAG, detail);
}

function logBackOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedBackKeys.has(key)) return;
  loggedBackKeys.add(key);
  globalThis.console?.debug?.(MRP_BACK_NAVIGATION_TAG, detail);
}

function buildHistoryEntry(input: MrpContextResolverInput): MrpContextHistoryEntry {
  const header = buildMrpContextHeaderView(input, 0);
  const signature = buildMrpContextSignature(input);
  return Object.freeze({
    transitionType: "sub_workspace",
    signature,
    activeTab: input.activeTab,
    dashboardMode: input.dashboardMode,
    dashboardContext: input.dashboardContext,
    subWorkspaceMode: input.subWorkspaceMode?.trim() || null,
    selectedObjectId: input.selectedObjectId?.trim() || null,
    selectedObjectLabel: input.selectedObjectLabel?.trim() || null,
    routeObjectId: input.routeObjectId?.trim() || null,
    routeObjectName: input.routeObjectName?.trim() || null,
    panelName: header.panelName,
    activeMode: header.activeMode,
    selectedObject: header.selectedObject,
  });
}

export function classifyMrpContextTransition(
  previous: MrpContextHistoryEntry,
  next: MrpContextHistoryEntry
): MrpContextTransitionType {
  if (previous.dashboardMode !== next.dashboardMode) {
    return "workspace";
  }
  if (
    previous.dashboardContext !== next.dashboardContext ||
    previous.activeTab !== next.activeTab
  ) {
    return "panel";
  }
  return "sub_workspace";
}

function pushBackStack(entry: MrpContextHistoryEntry): void {
  backStack.push(entry);
  while (backStack.length > MRP_CONTEXT_HISTORY_MAX_DEPTH) {
    backStack.shift();
  }
}

export function getMrpContextHistoryDepth(): number {
  return backStack.length;
}

export function getMrpContextHistorySummary(): MrpContextHistorySummary {
  return Object.freeze({
    depth: backStack.length,
    maxDepth: MRP_CONTEXT_HISTORY_MAX_DEPTH,
    canNavigateBack: backStack.length > 0 && !backNavigationInProgress,
    currentSignature: currentEntry?.signature ?? null,
  });
}

export function isMrpContextHistoryRestoring(): boolean {
  return isRestoring;
}

export function subscribeMrpContextHistory(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function recordMrpContextHistoryTransition(input: MrpContextResolverInput): boolean {
  if (backNavigationInProgress) {
    return false;
  }

  const nextEntry = buildHistoryEntry(input);
  if (currentEntry?.signature === nextEntry.signature) {
    return false;
  }

  if (isRestoring || skipNextHistoryRecord) {
    skipNextHistoryRecord = false;
    isRestoring = false;
    currentEntry = nextEntry;
    notifyListeners();
    return false;
  }

  if (currentEntry) {
    const transitionType = classifyMrpContextTransition(currentEntry, nextEntry);
    pushBackStack(
      Object.freeze({
        ...currentEntry,
        transitionType,
      })
    );
    logHistoryOnce(`${transitionType}:${nextEntry.signature}`, {
      transitionType,
      from: {
        panelName: currentEntry.panelName,
        activeMode: currentEntry.activeMode,
        selectedObject: currentEntry.selectedObject,
      },
      to: {
        panelName: nextEntry.panelName,
        activeMode: nextEntry.activeMode,
        selectedObject: nextEntry.selectedObject,
      },
      depth: backStack.length,
    });
  }

  currentEntry = nextEntry;
  notifyListeners();
  return true;
}

export function requestMrpContextBackNavigation(): MrpContextBackNavigationResult {
  const now = Date.now();
  if (backNavigationInProgress) {
    logBackOnce("in_progress", { reason: "back_navigation_in_progress" });
    return Object.freeze({
      approved: false,
      entry: null,
      reason: "back_navigation_in_progress",
    });
  }

  if (now - lastBackNavigationAt < 250) {
    logBackOnce("debounced", { reason: "back_navigation_debounced" });
    return Object.freeze({
      approved: false,
      entry: null,
      reason: "back_navigation_debounced",
    });
  }

  const previous = backStack.pop();
  if (!previous) {
    return Object.freeze({
      approved: false,
      entry: null,
      reason: "history_empty",
    });
  }

  backNavigationInProgress = true;
  isRestoring = true;
  skipNextHistoryRecord = true;
  lastBackNavigationAt = now;
  currentEntry = previous;

  logBackOnce(previous.signature, {
    restored: {
      panelName: previous.panelName,
      activeMode: previous.activeMode,
      selectedObject: previous.selectedObject,
    },
    remainingDepth: backStack.length,
    transitionType: previous.transitionType,
  });

  notifyListeners();

  return Object.freeze({
    approved: true,
    entry: previous,
    reason: "restored_previous_context",
  });
}

export function completeMrpContextBackNavigation(): void {
  backNavigationInProgress = false;
  lastBackNavigationAt = 0;
  notifyListeners();
}

export function resetMrpContextHistoryForTests(): void {
  backStack.length = 0;
  currentEntry = null;
  isRestoring = false;
  skipNextHistoryRecord = false;
  backNavigationInProgress = false;
  lastBackNavigationAt = 0;
  loggedHistoryKeys.clear();
  loggedBackKeys.clear();
  notifyListeners();
}
