"use client";

import type { ExecutiveAdvisorTab } from "../shell/executiveCockpitTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveAdvisorCollapseButton } from "./ExecutiveAdvisorCollapseButton";

type PackageTab = Readonly<{
  tabId: string;
  label: string;
  canonicalId: string;
}>;

type Props = {
  readonly tab: ExecutiveAdvisorTab;
  readonly onTabChange: (tab: ExecutiveAdvisorTab) => void;
  readonly collapsed: boolean;
  readonly onToggleCollapse: () => void;
  readonly accent?: string;
  readonly packageTabs?: readonly PackageTab[];
  readonly activePackageTabId?: string | null;
  readonly onSelectPackageTab?: (tabId: string) => void;
  readonly onClosePackageTab?: (tabId: string) => void;
};

const TABS: readonly ExecutiveAdvisorTab[] = ["Assist", "Insight"];
const TAB_LABEL: Record<ExecutiveAdvisorTab, string> = {
  Assist: "Advisor",
  Insight: "Details",
};
const TAB_ICON: Record<ExecutiveAdvisorTab, string> = {
  Assist: "💬",
  Insight: "📊",
};

/**
 * Sprint 6.6 — Minimal header: title, tabs, collapse.
 */
export function ExecutiveAdvisorHeader({
  tab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  accent = cockpit.accent,
  packageTabs = [],
  activePackageTabId = null,
  onSelectPackageTab,
  onClosePackageTab,
}: Props) {
  if (collapsed) {
    return (
      <div
        data-testid="executive-advisor-header"
        data-collapsed="true"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.45rem",
          padding: "0.65rem 0.35rem",
          height: "100%",
        }}
      >
        <ExecutiveAdvisorCollapseButton
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
        <div
          role="tablist"
          aria-label="Advisor tabs"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            width: "100%",
          }}
        >
          {TABS.map((item) => {
            const active = activePackageTabId == null && item === tab;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={TAB_LABEL[item]}
                data-testid={`executive-advisor-tab-${item.toLowerCase()}`}
                onClick={() => onTabChange(item)}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.2rem",
                  borderRadius: cockpit.radius.sm,
                  border: active
                    ? `1px solid ${accent}`
                    : `1px solid ${cockpit.border}`,
                  background: active ? `${accent}18` : "transparent",
                  color: active ? accent : cockpit.muted,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                  transition: `opacity 180ms ${cockpit.motion.easing}`,
                }}
              >
                {TAB_ICON[item]}
              </button>
            );
          })}
          {packageTabs.map((item) => {
            const active = item.tabId === activePackageTabId;
            return (
              <button
                key={item.tabId}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={item.label}
                data-testid={`nexora-right-package-tab-${item.canonicalId}`}
                data-right-package-canonical-id={item.canonicalId}
                onClick={() => onSelectPackageTab?.(item.tabId)}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.2rem",
                  borderRadius: cockpit.radius.sm,
                  border: active
                    ? `1px solid ${accent}`
                    : `1px solid ${cockpit.border}`,
                  background: active ? `${accent}18` : "transparent",
                  color: active ? accent : cockpit.muted,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.62rem",
                }}
              >
                {item.label.slice(0, 1)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="executive-advisor-header"
      data-collapsed="false"
      style={{
        padding: "0.7rem 0.95rem 0.6rem",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
            fontWeight: cockpit.type.status.weight,
          }}
        >
        Nexora Advisor
        </p>
        <ExecutiveAdvisorCollapseButton
          collapsed={collapsed}
          onToggle={onToggleCollapse}
        />
      </div>

      <div
        role="tablist"
        aria-label="Advisor tabs"
        data-ux3-tabs="advisor-dominant"
        style={{
          display: "flex",
          gap: "0.55rem",
          marginTop: "0.4rem",
        }}
      >
        {TABS.map((item) => {
          const active = activePackageTabId == null && item === tab;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              data-testid={`executive-advisor-tab-${item.toLowerCase()}`}
              onClick={() => onTabChange(item)}
              style={{
                padding: "0.15rem 0",
                borderRadius: 0,
                border: "none",
                borderBottom: active
                  ? `1px solid ${accent}`
                  : "1px solid transparent",
                background: "transparent",
                color: active ? cockpit.textSoft : cockpit.lowMuted,
                fontSize: "0.62rem",
                letterSpacing: "0.02em",
                textTransform: "none",
                fontWeight: active ? 600 : 450,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: `background 180ms ${cockpit.motion.easing}, color 180ms ${cockpit.motion.easing}`,
              }}
            >
              {TAB_LABEL[item]}
            </button>
          );
        })}
        {packageTabs.map((item) => {
          const active = item.tabId === activePackageTabId;
          return (
            <span
              key={item.tabId}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active}
                data-testid={`nexora-right-package-tab-${item.canonicalId}`}
                data-right-package-canonical-id={item.canonicalId}
                onClick={() => onSelectPackageTab?.(item.tabId)}
                style={{
                  padding: "0.15rem 0",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: active
                    ? `1px solid ${accent}`
                    : "1px solid transparent",
                  background: "transparent",
                  color: active ? cockpit.textSoft : cockpit.lowMuted,
                  fontSize: "0.62rem",
                  letterSpacing: "0.02em",
                  fontWeight: active ? 600 : 450,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {item.label}
              </button>
              <button
                type="button"
                aria-label={`Close ${item.label}`}
                data-testid={`nexora-right-package-tab-close-${item.canonicalId}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onClosePackageTab?.(item.tabId);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: cockpit.lowMuted,
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  padding: "0.05rem 0.1rem",
                  fontFamily: "inherit",
                }}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
