"use client";

import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ExecutiveModeId } from "../shell/executiveCockpitTypes";
import {
  createExecutiveRuntimeStore,
  type ExecutiveRuntimeState,
  type ExecutiveRuntimeStore,
} from "./ExecutiveRuntimeStore";
import { ExecutiveRuntimeDevTools } from "./ExecutiveRuntimeDevTools";

const ExecutiveRuntimeStoreContext =
  createContext<ExecutiveRuntimeStore | null>(null);

type Props = {
  readonly children: ReactNode;
  readonly initialMode?: ExecutiveModeId;
  /** Inject a store (tests). */
  readonly store?: ExecutiveRuntimeStore;
  /** Show Runtime Inspector (defaults to development). */
  readonly showInspector?: boolean;
};

/**
 * ExecutiveRuntimeProvider — wraps the Executive Cockpit.
 * Owns the single Runtime store. Feature providers become Runtime consumers.
 */
export function ExecutiveRuntimeProvider({
  children,
  initialMode = "Problem",
  store: injected,
  showInspector,
}: Props) {
  const storeRef = useRef<ExecutiveRuntimeStore | null>(null);
  if (!storeRef.current) {
    storeRef.current =
      injected ?? createExecutiveRuntimeStore({ initialMode });
  }
  const store = storeRef.current;

  const inspectorEnabled =
    showInspector ?? process.env.NODE_ENV !== "production";

  return (
    <ExecutiveRuntimeStoreContext.Provider value={store}>
      {children}
      {inspectorEnabled ? <ExecutiveRuntimeDevTools /> : null}
    </ExecutiveRuntimeStoreContext.Provider>
  );
}

export function useExecutiveRuntimeStoreApi(): ExecutiveRuntimeStore {
  const store = useContext(ExecutiveRuntimeStoreContext);
  if (!store) {
    throw new Error(
      "useExecutiveRuntimeStoreApi must be used within ExecutiveRuntimeProvider",
    );
  }
  return store;
}

/**
 * Subscribe to Runtime state with referential caching of the selected value.
 */
export function useExecutiveRuntimeState<T>(
  selector: (state: ExecutiveRuntimeState) => T,
): T {
  const store = useExecutiveRuntimeStoreApi();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const cacheRef = useRef<{
    state: ExecutiveRuntimeState;
    selected: T;
  } | null>(null);

  const getSnapshot = () => {
    const state = store.getState();
    const cached = cacheRef.current;
    if (cached && cached.state === state) {
      return cached.selected;
    }
    const selected = selectorRef.current(state);
    if (cached && Object.is(cached.selected, selected)) {
      cacheRef.current = { state, selected: cached.selected };
      return cached.selected;
    }
    cacheRef.current = { state, selected };
    return selected;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
