"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { clamp } from "../lib/sizeCommands";

export type StateVector = Record<string, number>;

export type ViewMode = "full" | "input" | "hidden";

type OverrideEntry = {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number]; // stored as radians
  color?: string;
  visible?: boolean;
  caption?: string;
  showCaption?: boolean;
};

type StoredOverrideEntry = Partial<OverrideEntry> & Record<string, unknown>;

type SceneOverrideAction =
  | {
      type: "applyObject";
      object?: string;
      value?: Record<string, unknown> & { id?: string };
    }
  | { type: "clearObjectOverride"; object?: string }
  | { type: "clearAllOverrides" };

function readStoredOverrideEntry(value: unknown): OverrideEntry | null {
  if (!value || typeof value !== "object") return null;
  const v = value as StoredOverrideEntry;
  const entry: OverrideEntry = {};
  const s = Number(v.scale);
  if (Number.isFinite(s)) entry.scale = clamp(s, 0.2, 2.0);

  const pos = v.position;
  if (Array.isArray(pos) && pos.length === 3) {
    const p = pos.map((n) => Number(n));
    if (p.every((n) => Number.isFinite(n))) entry.position = [p[0], p[1], p[2]];
  }

  const rot = v.rotation;
  if (Array.isArray(rot) && rot.length === 3) {
    const r = rot.map((n) => Number(n));
    if (r.every((n) => Number.isFinite(n))) entry.rotation = [r[0], r[1], r[2]];
  }

  const col = v.color;
  if (typeof col === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(col)) {
    entry.color = col;
  }

  const cap = v.caption;
  if (typeof cap === "string") entry.caption = cap;

  const showCap = v.showCaption;
  if (typeof showCap === "boolean") entry.showCaption = showCap;

  const vis = v.visible;
  if (typeof vis === "boolean") entry.visible = vis;

  return Object.keys(entry).length > 0 ? entry : null;
}

function readNumericTuple(value: unknown): [number, number, number] | null {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const nums = value.map((n) => Number(n));
  return nums.every((n) => Number.isFinite(n)) ? [nums[0], nums[1], nums[2]] : null;
}

type SceneContextValue = {
  stateVector: StateVector;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (m: ViewMode) => void;
  chatOffset: { x: number; y: number };
  setChatOffset: (o: { x: number; y: number }) => void;
  overrides: Record<string, OverrideEntry>;
  setOverride: (id: string, patch: Partial<OverrideEntry>) => void;
  clearOverride: (id: string) => void;
  clearAllOverrides: () => void;
  pruneOverridesTo: (validIds: string[]) => void;
  // undo/redo for overrides
  undoOverrides: () => void;
  redoOverrides: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setCaption: (id: string, text: string) => void;
  toggleCaption: (id: string, show: boolean) => void;
  applyActions: (actions: unknown) => void;
};

const SceneStateContext = createContext<SceneContextValue | null>(null);

const OVERRIDES_KEY = "statestudio.overrides.v1";

export function SceneStateProvider({
  stateVector = {},
  children,
}: {
  stateVector?: StateVector;
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("full");
  const [chatOffset, setChatOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [overrides, setOverrides] = useState<Record<string, OverrideEntry>>(() => {
    try {
      const raw = window.localStorage.getItem(OVERRIDES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      const out: Record<string, OverrideEntry> = {};
      for (const k of Object.keys(parsed)) {
        const entry = readStoredOverrideEntry(parsed[k]);
        if (entry) out[k] = entry;
      }
      return out;
    } catch {
      return {};
    }
  });
  const [undoStack, setUndoStack] = useState<Record<string, OverrideEntry>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, OverrideEntry>[]>([]);

  const pushUndoSnapshot = useCallback((prevOverrides: Record<string, OverrideEntry>) => {
    setUndoStack((s) => {
      const next = [...s, JSON.parse(JSON.stringify(prevOverrides))];
      if (next.length > 30) next.splice(0, next.length - 30);
      return next;
    });
  }, []);
  const clearRedoStack = useCallback(() => setRedoStack(() => []), []);

  const applyActions = useCallback((actions: unknown) => {
    if (!Array.isArray(actions) || actions.length === 0) return;

    setOverrides((prev) => {
      // One undo snapshot for the whole batch (not per action)
      pushUndoSnapshot(prev);
      clearRedoStack();

      const next: Record<string, OverrideEntry> = { ...prev };

      for (const raw of actions as SceneOverrideAction[]) {
        if (!raw || typeof raw !== "object") continue;
        if (raw.type === "applyObject") {
          const id =
            (typeof raw.object === "string" && raw.object) ||
            (typeof raw.value?.id === "string" && raw.value.id) ||
            null;
          if (!id) continue;

          const v = raw.value ?? {};
          const cur: OverrideEntry = { ...(next[id] ?? {}) };

          const s = Number(v.scale);
          if (Number.isFinite(s)) cur.scale = clamp(s, 0.2, 2.0);

          const col = v.color;
          if (typeof col === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(col)) {
            cur.color = col;
          }

          const vis = v.visible;
          if (typeof vis === "boolean") cur.visible = vis;

          // Optional: allow backend to set caption/showCaption if provided
          if (typeof v.caption === "string") cur.caption = v.caption;
          if (typeof v.showCaption === "boolean") cur.showCaption = v.showCaption;

          next[id] = cur;
        } else if (raw.type === "clearObjectOverride") {
          const id = typeof raw.object === "string" ? raw.object : null;
          if (id && id in next) delete next[id];
        } else if (raw.type === "clearAllOverrides") {
          return {};
        }
      }

      return next;
    });
  }, [pushUndoSnapshot, clearRedoStack]);

  const setOverride = useCallback((id: string, patch: Partial<OverrideEntry>) => {
    setOverrides((prev) => {
      // push undo snapshot
      pushUndoSnapshot(prev);
      clearRedoStack();
      const next = { ...prev };
      const cur: OverrideEntry = { ...(next[id] ?? {}) };
      if (patch.scale !== undefined) {
        const s = Number(patch.scale);
        if (Number.isFinite(s)) cur.scale = clamp(s, 0.2, 2.0);
      }
      if (patch.position !== undefined) {
        const position = readNumericTuple(patch.position);
        if (position) cur.position = position;
      }
      if (patch.rotation !== undefined) {
        const rotation = readNumericTuple(patch.rotation);
        if (rotation) cur.rotation = rotation;
      }
      if (patch.color !== undefined) {
        const c = patch.color;
        if (typeof c === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(c)) cur.color = c;
      }
      if (patch.visible !== undefined) {
        cur.visible = !!patch.visible;
      }
      if (patch.caption !== undefined) {
        cur.caption = typeof patch.caption === "string" ? patch.caption : cur.caption;
      }
      if (patch.showCaption !== undefined) {
        cur.showCaption = !!patch.showCaption;
      }
      next[id] = cur;
      return next;
    });
  }, [pushUndoSnapshot, clearRedoStack]);

  const clearOverride = useCallback((id: string) => {
    setOverrides((prev) => {
      if (!(id in prev)) return prev;
      pushUndoSnapshot(prev);
      clearRedoStack();
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, [pushUndoSnapshot, clearRedoStack]);

  const setCaption = useCallback((id: string, text: string) => {
    setOverride(id, { caption: text });
  }, [setOverride]);

  const toggleCaption = useCallback((id: string, show: boolean) => {
    setOverride(id, { showCaption: show });
  }, [setOverride]);

  const clearAllOverrides = useCallback(() => {
    setOverrides((prev) => {
      pushUndoSnapshot(prev);
      clearRedoStack();
      return {};
    });
  }, [pushUndoSnapshot, clearRedoStack]);

  const pruneOverridesTo = useCallback((validIds: string[]) => {
    setOverrides((prev) => {
      pushUndoSnapshot(prev);
      clearRedoStack();
      const next: Record<string, OverrideEntry> = {};
      const setValid = new Set(validIds);
      for (const k of Object.keys(prev)) {
        if (setValid.has(k)) next[k] = prev[k];
      }
      return next;
    });
  }, [pushUndoSnapshot, clearRedoStack]);

  const undoOverrides = useCallback(() => {
    setUndoStack((u) => {
      if (u.length === 0) return u;
      setOverrides((current) => {
        const last = u[u.length - 1];
        setRedoStack((r) => [...r, JSON.parse(JSON.stringify(current))]);
        return JSON.parse(JSON.stringify(last));
      });
      return u.slice(0, u.length - 1);
    });
  }, []);

  const redoOverrides = useCallback(() => {
    setRedoStack((r) => {
      if (r.length === 0) return r;
      setOverrides((current) => {
        const nextSnap = r[r.length - 1];
        setUndoStack((u) => [...u, JSON.parse(JSON.stringify(current))]);
        return JSON.parse(JSON.stringify(nextSnap));
      });
      return r.slice(0, r.length - 1);
    });
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
    } catch {
      // ignore storage errors
    }
  }, [overrides]);

  return (
    <SceneStateContext.Provider
      value={{
        stateVector,
        selectedId,
        setSelectedId,
        focusedId,
        setFocusedId,
        viewMode,
        setViewMode,
        chatOffset,
        setChatOffset,
        overrides,
        setOverride,
        clearOverride,
        clearAllOverrides,
        pruneOverridesTo,
        undoOverrides,
        redoOverrides,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        setCaption,
        toggleCaption,
        applyActions,
      }}
    >
      {children}
    </SceneStateContext.Provider>
  );
}

export function useStateVector() {
  const ctx = useContext(SceneStateContext);
  return ctx?.stateVector ?? null;
}

export function useSelectedId() {
  const ctx = useContext(SceneStateContext);
  return ctx?.selectedId ?? null;
}

export function useSetSelectedId() {
  const ctx = useContext(SceneStateContext);
  return ctx?.setSelectedId ?? (() => {});
}

export function useFocusedId() {
  const ctx = useContext(SceneStateContext);
  return ctx?.focusedId ?? null;
}

export function useSetFocusedId() {
  const ctx = useContext(SceneStateContext);
  return ctx?.setFocusedId ?? (() => {});
}

export function useOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.overrides ?? {};
}

export function useSetOverride() {
  const ctx = useContext(SceneStateContext);
  return ctx?.setOverride ?? (() => {});
}

export function useClearOverride() {
  const ctx = useContext(SceneStateContext);
  return ctx?.clearOverride ?? (() => {});
}

export function useClearAllOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.clearAllOverrides ?? (() => {});
}

export function usePruneOverridesTo() {
  const ctx = useContext(SceneStateContext);
  return ctx?.pruneOverridesTo ?? (() => {});
}

export function useUndoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.undoOverrides ?? (() => {});
}

export function useRedoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.redoOverrides ?? (() => {});
}

export function useSetCaption() {
  const ctx = useContext(SceneStateContext);
  return ctx?.setCaption ?? ((caption: string, id: string) => { void caption; void id; });
}

export function useToggleCaption() {
  const ctx = useContext(SceneStateContext);
  return ctx?.toggleCaption ?? ((caption: string, enabled: boolean) => { void caption; void enabled; });
}

export function useCanUndoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.canUndo ?? false;
}

export function useCanRedoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.canRedo ?? false;
}

export function useApplyActions() {
  const ctx = useContext(SceneStateContext);
  return ctx?.applyActions ?? ((actions: unknown) => { void actions; });
}

export function useViewMode() {
  const ctx = useContext(SceneStateContext);
  return ctx?.viewMode ?? ("full" as ViewMode);
}

export function useSetViewMode() {
  const ctx = useContext(SceneStateContext);
  return ctx?.setViewMode ?? ((mode: ViewMode) => { void mode; });
}

export function useChatOffset(): { x: number; y: number } {
  const ctx = useContext(SceneStateContext);
  return ctx?.chatOffset ?? { x: 0, y: 0 };
}

export function useSetChatOffset(): (o: { x: number; y: number }) => void {
  const ctx = useContext(SceneStateContext);
  return ctx?.setChatOffset ?? ((offset: { x: number; y: number }) => { void offset; });
}
