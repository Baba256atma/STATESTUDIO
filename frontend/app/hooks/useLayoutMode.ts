"use client";

import { useCallback, useEffect, useState } from "react";
import type { LayoutMode } from "../lib/contracts";

export type { LayoutMode };

const KEY = "nexora.layoutMode.v1";

export function useLayoutMode(defaultMode: LayoutMode = "floating") {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(defaultMode);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw === "split" || raw === "floating" || raw === "hybrid") {
        setLayoutMode(raw);
      }
    } catch {
      // ignore
    }
  }, [defaultMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, layoutMode);
    } catch {
      // ignore
    }
  }, [layoutMode]);

  const setFloating = useCallback(() => setLayoutMode("floating"), []);
  const setSplit = useCallback(() => setLayoutMode("split"), []);

  return { layoutMode, setLayoutMode, setFloating, setSplit };
}
