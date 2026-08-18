import { cockpit } from "./executiveCockpitTheme";

type Props = {
  readonly connected?: boolean;
  readonly autoSave?: boolean;
  readonly syncLabel?: string;
  readonly version?: string;
  readonly notificationCount?: number;
  readonly onHelp?: () => void;
  /** UX:1 — hide development/debug chrome from the manager experience. */
  readonly managerHidden?: boolean;
};

/**
 * Executive Status Bar — always bottom.
 * System status only; no business content.
 */
export function ExecutiveStatusBar({
  connected = true,
  autoSave = true,
  syncLabel = "Synced",
  version = "EXS-7 · Beta",
  notificationCount = 0,
  onHelp,
  managerHidden = false,
}: Props) {
  return (
    <footer
      data-testid="executive-status-bar"
      data-manager-visible={managerHidden ? "false" : "true"}
      aria-label="Executive Status Bar"
      aria-hidden={managerHidden}
      style={{
        height: managerHidden ? 0 : cockpit.statusHeight,
        overflow: managerHidden ? "hidden" : "visible",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "1.1rem",
        padding: managerHidden ? 0 : "0 0.9rem",
        borderTop: managerHidden ? "none" : `1px solid ${cockpit.border}`,
        background: cockpit.charcoal,
        color: cockpit.muted,
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      <StatusItem
        testId="executive-status-connected"
        label="Connected"
        value={connected ? "On" : "Off"}
        tone={connected ? "ok" : "warn"}
      />
      <StatusItem
        testId="executive-status-autosave"
        label="Auto Save"
        value={autoSave ? "On" : "Off"}
        tone={autoSave ? "ok" : "warn"}
      />
      <StatusItem
        testId="executive-status-sync"
        label="Sync"
        value={syncLabel}
      />
      <StatusItem
        testId="executive-status-version"
        label="Version"
        value={version}
      />
      <StatusItem
        testId="executive-status-notification"
        label="Notification"
        value={notificationCount > 0 ? String(notificationCount) : "None"}
      />
      <button
        type="button"
        data-testid="executive-status-help"
        onClick={onHelp}
        style={{
          marginLeft: "auto",
          border: "none",
          background: "transparent",
          color: cockpit.accent,
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Help
      </button>
    </footer>
  );
}

function StatusItem({
  testId,
  label,
  value,
  tone,
}: {
  readonly testId: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: "ok" | "warn";
}) {
  return (
    <div
      data-testid={testId}
      style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
    >
      <span style={{ color: cockpit.lowMuted }}>{label}</span>
      <span
        style={{
          color:
            tone === "ok"
              ? cockpit.success
              : tone === "warn"
                ? cockpit.warning
                : cockpit.textSoft,
        }}
      >
        {value}
      </span>
    </div>
  );
}
