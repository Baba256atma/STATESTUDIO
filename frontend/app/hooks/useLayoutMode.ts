"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { LayoutMode } from "../lib/contracts";

export type { LayoutMode };

const KEY = "nexora.layoutMode.v1";

function subscribeNoop() {
  return () => {};
}

function readStoredLayoutMode(defaultMode: LayoutMode): LayoutMode {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === "split" || raw === "floating" || raw === "hybrid") {
      return raw;
    }
  } catch {
    // ignore
  }
  return defaultMode;
}

export function useLayoutMode(defaultMode: LayoutMode = "floating") {
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(defaultMode);
  const [hydratedDefault, setHydratedDefault] = useState<LayoutMode | null>(null);

  // One-way seed from localStorage once the client is available.
  if (isClient && hydratedDefault !== defaultMode) {
    setHydratedDefault(defaultMode);
    setLayoutMode(readStoredLayoutMode(defaultMode));
  }

  useEffect(() => {
    if (hydratedDefault === null) return;
    try {
      window.localStorage.setItem(KEY, layoutMode);
    } catch {
      // ignore
    }
  }, [hydratedDefault, layoutMode]);

  const setFloating = useCallback(() => setLayoutMode("floating"), []);
  const setSplit = useCallback(() => setLayoutMode("split"), []);

  return { layoutMode, setLayoutMode, setFloating, setSplit };
}
