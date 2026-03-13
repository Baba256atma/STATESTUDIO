"use client";

import React, { useEffect } from "react";

export type ViewMode = "business" | "strategy";

/** Keeps the current view mode in the global SceneState store. */
export function ViewModeRegistrar({
  mode,
  onRegister,
}: {
  mode: ViewMode;
  onRegister?: (mode: ViewMode) => void;
}) {
  useEffect(() => {
    onRegister?.(mode);
  }, [mode, onRegister]);
  return null;
}

/** Registers selected object id in the global SceneState store. */
export function SelectedIdRegistrar({
  id,
  onRegister,
}: {
  id: string | null;
  onRegister?: (id: string | null) => void;
}) {
  useEffect(() => {
    onRegister?.(id);
  }, [id, onRegister]);
  return null;
}

/** Convenience wrapper used by the main page to register common scene state. */
export function SceneRegistrars({
  activeMode,
  selectedId,
  onRegisterViewMode,
  onRegisterSelectedId,
}: {
  activeMode: ViewMode;
  selectedId: string | null;
  onRegisterViewMode?: (mode: ViewMode) => void;
  onRegisterSelectedId?: (id: string | null) => void;
}) {
  return (
    <>
      <ViewModeRegistrar mode={activeMode} onRegister={onRegisterViewMode} />
      <SelectedIdRegistrar id={selectedId} onRegister={onRegisterSelectedId} />
    </>
  );
}
