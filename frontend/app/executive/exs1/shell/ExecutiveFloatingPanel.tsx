"use client";

import type { ReactNode } from "react";
import type { ExecutiveFloatingPanelKind } from "./executiveCockpitTypes";
import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly kind: ExecutiveFloatingPanelKind;
  readonly title?: string;
  readonly onClose: () => void;
  readonly children?: ReactNode;
};

const DEFAULT_TITLES: Record<Exclude<ExecutiveFloatingPanelKind, null>, string> =
  {
    "add-object": "Add Object",
    "delete-object": "Delete Object",
    "import-csv": "Import CSV",
    rename: "Rename",
    wizard: "Wizard",
    "scenario-wizard": "New Scenario",
    "decision-wizard": "Manual Executive Decision",
    "execution-new-task": "New Task",
    "execution-assign-owner": "Assign Owner",
    "execution-change-status": "Change Status",
    "execution-notes": "Execution Notes",
    "monitoring-notes": "Monitoring Notes",
    "data-wizard": "Publish Enterprise Connector",
    properties: "Properties",
  };

/**
 * Executive Floating Panel — unified dialog system for the cockpit.
 * Shared radius, elevation, header, and motion. Never replaces Stage.
 */
export function ExecutiveFloatingPanel({
  kind,
  title,
  onClose,
  children,
}: Props) {
  if (kind == null) return null;

  return (
    <div
      data-testid="executive-floating-panel-root"
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2, 6, 14, 0.58)",
        backdropFilter: "blur(3px)",
        animation: "exs-float-backdrop-in 220ms ease",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? DEFAULT_TITLES[kind]}
        data-testid="executive-floating-panel"
        data-kind={kind}
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(28rem, calc(100vw - 2rem))",
          maxHeight: "min(70vh, 32rem)",
          display: "flex",
          flexDirection: "column",
          borderRadius: cockpit.radius.lg,
          border: `1px solid ${cockpit.borderStrong}`,
          background: `linear-gradient(165deg, ${cockpit.graphite} 0%, ${cockpit.navy} 100%)`,
          boxShadow: cockpit.elevation.floating,
          color: cockpit.text,
          overflow: "hidden",
          animation: "exs-float-panel-in 240ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.9rem 1rem",
            borderBottom: `1px solid ${cockpit.border}`,
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <h2
            data-testid="executive-floating-panel-title"
            style={{
              margin: 0,
              fontSize: cockpit.type.cardTitle.size,
              fontWeight: cockpit.type.cardTitle.weight,
              letterSpacing: cockpit.type.cardTitle.tracking,
            }}
          >
            {title ?? DEFAULT_TITLES[kind]}
          </h2>
          <button
            type="button"
            data-testid="executive-floating-panel-close"
            aria-label="Close panel"
            onClick={onClose}
            style={{
              border: `1px solid ${cockpit.border}`,
              background: "transparent",
              color: cockpit.muted,
              borderRadius: cockpit.radius.sm,
              width: "1.85rem",
              height: "1.85rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: cockpit.transition,
            }}
          >
            ×
          </button>
        </div>
        <div
          data-testid="executive-floating-panel-body"
          style={{
            padding: "1rem",
            overflow: "auto",
            fontSize: cockpit.type.body.size,
            lineHeight: cockpit.type.body.lineHeight,
            color: cockpit.textSoft,
          }}
        >
          {children ?? (
            <p style={{ margin: 0 }}>
              Floating panel ready. Choose a cockpit action to continue.
            </p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes exs-float-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes exs-float-panel-in {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-testid="executive-floating-panel-root"] * {
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
