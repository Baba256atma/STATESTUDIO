import type { BackupV1, Msg, ScenePrefs } from "./homeScreenUtils";
import type { SceneJson, SceneLoop } from "../lib/sceneTypes";
import type { HUDTabKey } from "../components/HUDShell";

export function buildBackup(params: {
  activeCompanyId: string;
  activeMode: string;
  activeTemplateId: string;
  hudTab: HUDTabKey;
  prefs: ScenePrefs;
  sceneJson: SceneJson | null;
  messages: Msg[];
  loops: SceneLoop[];
  activeLoopId: string | null;
  selectedLoopId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  selectedObjectId: string | null;
  overrides: Record<string, unknown>;
  objectUxById: Record<string, { opacity?: number; scale?: number }>;
  sessionId: string | null;
}): BackupV1 {
  return {
    version: "1",
    kind: "backup",
    savedAt: new Date().toISOString(),
    sessionId: params.sessionId,
    activeCompanyId: params.activeCompanyId,
    activeMode: params.activeMode,
    activeTemplateId: params.activeTemplateId,
    hudTab: params.hudTab,
    prefs: params.prefs,
    sceneJson: params.sceneJson,
    messages: params.messages,
    loops: params.loops,
    activeLoopId: params.activeLoopId,
    selectedLoopId: params.selectedLoopId,
    focusedId: params.focusedId,
    focusMode: params.focusMode,
    focusPinned: params.focusPinned,
    selectedObjectId: params.selectedObjectId,
    overrides: params.overrides,
    objectUxById: params.objectUxById,
  };
}

export function buildRestorePreviewLines(params: {
  activeCompanyId: string;
  activeMode: string;
  activeTemplateId: string;
  hudTab: HUDTabKey;
  loops: SceneLoop[];
  activeLoopId: string | null;
  selectedLoopId: string | null;
  focusedId: string | null;
  focusMode: "all" | "selected";
  focusPinned: boolean;
  selectedObjectId: string | null;
  messagesLen: number;
  overridesKeysCount: number;
  backup: BackupV1;
}): string[] {
  const toText = (v: unknown) => (v === null || v === undefined || v === "" ? "none" : String(v));
  const loopCount = Array.isArray(params.loops) ? params.loops.length : 0;
  const backupLoopCount = Array.isArray(params.backup.loops) ? params.backup.loops.length : 0;
  const backupOverridesCount = Object.keys(params.backup.overrides ?? {}).length;
  return [
    `Company: ${toText(params.activeCompanyId)} → ${toText(params.backup.activeCompanyId)}`,
    `Mode: ${toText(params.activeMode)} → ${toText(params.backup.activeMode)}`,
    `Template: ${toText(params.activeTemplateId)} → ${toText(params.backup.activeTemplateId)}`,
    `HUD Tab: ${toText(params.hudTab)} → ${toText(params.backup.hudTab)}`,
    `Loops: ${loopCount} → ${backupLoopCount}`,
    `Active Loop: ${toText(params.activeLoopId)} → ${toText(params.backup.activeLoopId)}`,
    `Selected Loop: ${toText(params.selectedLoopId)} → ${toText(params.backup.selectedLoopId)}`,
    `Focus Mode: ${toText(params.focusMode)} → ${toText(params.backup.focusMode)}`,
    `Focused: ${toText(params.focusedId)} → ${toText(params.backup.focusedId)}`,
    `Pinned: ${toText(params.focusPinned)} → ${toText(params.backup.focusPinned)}`,
    `Selected Object: ${toText(params.selectedObjectId)} → ${toText(params.backup.selectedObjectId)}`,
    `Messages: ${params.messagesLen} → ${Array.isArray(params.backup.messages) ? params.backup.messages.length : 0}`,
    `Overrides keys: ${params.overridesKeysCount} → ${backupOverridesCount}`,
  ];
}
