import { create } from "zustand";

export type FocusMode = "all" | "selected" | "pinned";

export type FocusState = {
  focusMode: FocusMode;
  pinnedId: string | null;
  activeLoopId: string | null;
  setFocusMode: (mode: FocusMode) => void;
  pin: (id: string) => void;
  unpin: () => void;
  setActiveLoopId: (id: string | null) => void;
};

type FocusActions = {
  setFocusMode: (mode: FocusMode) => void;
  pin: (id: string) => void;
  unpin: () => void;
  setActiveObjectId?: (id: string | null) => void;
  setActiveLoopId?: (id: string | null) => void;
  clear?: () => void;
};

const useFocusStore = create<FocusState>((set) => ({
  focusMode: "all",
  pinnedId: null,
  activeLoopId: null,
  setFocusMode: (mode) => set({ focusMode: mode }),
  pin: (id) => set({ pinnedId: id, focusMode: "pinned" }),
  unpin: () => set({ pinnedId: null, focusMode: "all" }),
  setActiveLoopId: (id) => set({ activeLoopId: id }),
}));

export const useFocusMode = () => useFocusStore((s) => s.focusMode);
export const usePinnedId = () => useFocusStore((s) => s.pinnedId);
export const useActiveLoopId = () => useFocusStore((s) => s.activeLoopId);
let _cachedActions: FocusActions | null = null;
let _cachedActionRefs:
  | {
      setFocusMode?: unknown;
      pin?: unknown;
      unpin?: unknown;
      setActiveObjectId?: unknown;
      setActiveLoopId?: unknown;
      clear?: unknown;
    }
  | null = null;

const focusActionsSelector = (s: FocusState): FocusActions => {
  const nextRefs = {
    setFocusMode: s.setFocusMode,
    pin: s.pin,
    unpin: s.unpin,
    setActiveObjectId: (s as FocusActions).setActiveObjectId,
    setActiveLoopId: s.setActiveLoopId,
    clear: (s as FocusActions).clear,
  };

  if (
    _cachedActions &&
    _cachedActionRefs &&
    _cachedActionRefs.setFocusMode === nextRefs.setFocusMode &&
    _cachedActionRefs.pin === nextRefs.pin &&
    _cachedActionRefs.unpin === nextRefs.unpin &&
    _cachedActionRefs.setActiveObjectId === nextRefs.setActiveObjectId &&
    _cachedActionRefs.setActiveLoopId === nextRefs.setActiveLoopId &&
    _cachedActionRefs.clear === nextRefs.clear
  ) {
    return _cachedActions;
  }

  _cachedActionRefs = nextRefs;

  const actions: FocusActions = {
    setFocusMode: s.setFocusMode,
    pin: s.pin,
    unpin: s.unpin,
    ...(nextRefs.setActiveObjectId ? { setActiveObjectId: nextRefs.setActiveObjectId as (id: string | null) => void } : {}),
    ...(s.setActiveLoopId ? { setActiveLoopId: s.setActiveLoopId } : {}),
    ...(nextRefs.clear ? { clear: nextRefs.clear as () => void } : {}),
  };

  _cachedActions = actions;
  return actions;
};

export const useFocusActions = (): FocusActions => useFocusStore(focusActionsSelector);
