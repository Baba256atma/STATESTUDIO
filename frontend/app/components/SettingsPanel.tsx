"use client";

import React from "react";

export function SettingsPanel({
  isOpen,
  backgroundMode,
  orbitMode,
  showAxes,
  onBackgroundModeChange,
  onOrbitModeChange,
  onShowAxesChange,
  onClose,
  onStartDemo,
  demoLoading,
  demoError,
}: {
  isOpen: boolean;
  backgroundMode: "day" | "night" | "stars";
  orbitMode: "auto" | "manual";
  showAxes: boolean;
  onBackgroundModeChange: (mode: "day" | "night" | "stars") => void;
  onOrbitModeChange: (mode: "auto" | "manual") => void;
  onShowAxesChange: (next: boolean) => void;
  onClose: () => void;
  onStartDemo?: (demoId: "growth" | "fixes" | "escalation") => void;
  demoLoading?: boolean;
  demoError?: string | null;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30"
      onClick={onClose}
    >
      <div
        className="fixed right-4 top-14 w-64 rounded-lg border border-white/10 bg-slate-900/80 p-3 text-sm text-white backdrop-blur"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-white/60">Settings</div>
          <button
            onClick={onClose}
            className="text-xs text-white/60 hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs text-white/60">Background</div>
            <div className="mt-2 grid gap-2">
              {(["day", "night", "stars"] as const).map((mode) => (
                <label
                  key={mode}
                  className="flex cursor-pointer items-center gap-2 text-xs text-white/80"
                >
                  <input
                    type="radio"
                    name="backgroundMode"
                    checked={backgroundMode === mode}
                    onChange={() => onBackgroundModeChange(mode)}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-white/60">Orbit mode</div>
            <div className="mt-2 grid gap-2">
              {(["auto", "manual"] as const).map((mode) => (
                <label
                  key={mode}
                  className="flex cursor-pointer items-center gap-2 text-xs text-white/80"
                >
                  <input
                    type="radio"
                    name="orbitMode"
                    checked={orbitMode === mode}
                    onChange={() => onOrbitModeChange(mode)}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between gap-2 text-xs text-white/70">
            <span>Show axes</span>
            <input
              type="checkbox"
              checked={showAxes}
              onChange={(e) => onShowAxesChange(e.target.checked)}
            />
          </label>

          {onStartDemo && (
            <div>
              <div className="text-xs text-white/60">Demos</div>
              <div className="mt-2 grid gap-2">
                {(
                  [
                    { id: "growth", label: "Start Demo: Growth" },
                    { id: "fixes", label: "Start Demo: Fixes" },
                    { id: "escalation", label: "Start Demo: Escalation" },
                  ] as const
                ).map((demo) => (
                  <button
                    key={demo.id}
                    onClick={() => onStartDemo(demo.id)}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={demoLoading}
                  >
                    {demo.label}
                  </button>
                ))}
                {demoError && <div className="text-xs text-amber-200/80">{demoError}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
