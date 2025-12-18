"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { clamp } from "../lib/sizeCommands";

export type StateVector = Record<string, number>;

type OverrideEntry = {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number]; // stored as radians
  color?: string;
  visible?: boolean;
  caption?: string;
  showCaption?: boolean;
};

type SceneContextValue = {
  stateVector: StateVector;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
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
};

const SceneStateContext = createContext<SceneContextValue | null>(null);

const OVERRIDES_KEY = "statestudio.overrides.v1";

export function SceneStateProvider({
  stateVector,
  children,
}: {
  stateVector: StateVector;
  children: React.ReactNode;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, OverrideEntry>>(() => {
    try {
      const raw = window.localStorage.getItem(OVERRIDES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      const out: Record<string, OverrideEntry> = {};
      for (const k of Object.keys(parsed)) {
        const v = parsed[k];
        if (v && typeof v === "object") {
          const entry: OverrideEntry = {};
          const s = Number((v as any).scale);
          if (Number.isFinite(s)) entry.scale = clamp(s, 0.2, 2.0);

          const pos = (v as any).position;
          if (Array.isArray(pos) && pos.length === 3) {
            const p: number[] = pos.map((n: any) => Number(n));
            if (p.every((n) => Number.isFinite(n))) entry.position = [p[0], p[1], p[2]];
          }

          const rot = (v as any).rotation;
          if (Array.isArray(rot) && rot.length === 3) {
            const r = rot.map((n: any) => Number(n));
            if (r.every((n) => Number.isFinite(n))) entry.rotation = [r[0], r[1], r[2]];
          }

          const col = (v as any).color;
          if (typeof col === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(col)) {
            entry.color = col;
          }

          const cap = (v as any).caption;
          if (typeof cap === "string") entry.caption = cap;

          const showCap = (v as any).showCaption;
          if (typeof showCap === "boolean") entry.showCaption = showCap;

          const vis = (v as any).visible;
          if (typeof vis === "boolean") entry.visible = vis;

          if (Object.keys(entry).length > 0) out[k] = entry;
        }
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
        const p = patch.position as any;
        if (Array.isArray(p) && p.length === 3) {
          const nums = p.map((n: any) => Number(n));
          if (nums.every((n) => Number.isFinite(n))) cur.position = [nums[0], nums[1], nums[2]];
        }
      }
      if (patch.rotation !== undefined) {
        const r = patch.rotation as any;
        if (Array.isArray(r) && r.length === 3) {
          const nums = r.map((n: any) => Number(n));
          if (nums.every((n) => Number.isFinite(n))) cur.rotation = [nums[0], nums[1], nums[2]];
        }
      }
      if (patch.color !== undefined) {
        const c = patch.color;
        if (typeof c === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(c)) cur.color = c;
      }
      if (patch.visible !== undefined) {
        cur.visible = !!patch.visible;
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
  return (ctx as any)?.setCaption ?? ((_: string, __: string) => {});
}

export function useToggleCaption() {
  const ctx = useContext(SceneStateContext);
  return (ctx as any)?.toggleCaption ?? ((_: string, __: boolean) => {});
}

export function useCanUndoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.canUndo ?? false;
}

export function useCanRedoOverrides() {
  const ctx = useContext(SceneStateContext);
  return ctx?.canRedo ?? false;
}