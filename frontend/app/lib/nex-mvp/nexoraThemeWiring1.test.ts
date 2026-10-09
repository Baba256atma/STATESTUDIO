/**
 * NPA-T THEME-WIRING:1 — focused authority, sync, role, and surface tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  cockpit,
  resolveExecutiveConversationRoleVisual,
} from "../../executive/exs1/shell/executiveCockpitTheme.ts";
import {
  applyResolvedUiThemeToDocument,
  persistThemeMode,
  resolveAndApplyUiThemeMode,
  resolveThemeMode,
} from "../ui/nexoraUiTheme.tsx";
import {
  NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY,
  deriveNexoraMVPSceneEnvironmentVisualState,
} from "./nexoraMVPWorkspacePresentation.ts";
import { EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY } from "../spatial-presentation/executiveOvsObjectStateVisual.ts";
import { EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE } from "../spatial-presentation/executiveOvsObjectVisualLanguage.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");

test("A — Day/Night selection resolves to one document authority", () => {
  assert.equal(resolveThemeMode("day", true), "day");
  assert.equal(resolveThemeMode("night", false), "night");
  assert.equal(resolveThemeMode("auto", true), "night");
  assert.equal(resolveThemeMode("auto", false), "day");
});

test("B — cockpit color fields are semantic CSS tokens, not night hex", () => {
  assert.equal(cockpit.bg, "var(--nx-bg-app)");
  assert.equal(cockpit.text, "var(--nx-text)");
  assert.equal(cockpit.muted, "var(--nx-muted)");
  assert.equal(cockpit.stageBg, "var(--nx-stage-bg)");
  assert.equal(cockpit.panel, "var(--nx-bg-panel)");
  assert.notEqual(cockpit.bg, "#070a10");
});

test("C — Manager and Nexora role tokens are distinct in both themes", () => {
  const manager = resolveExecutiveConversationRoleVisual("manager");
  const nexora = resolveExecutiveConversationRoleVisual("nexora");
  assert.notEqual(manager.labelColor, nexora.labelColor);
  assert.notEqual(manager.textColor, nexora.textColor);
  assert.notEqual(manager.labelWeight, nexora.labelWeight);
  assert.match(manager.labelColor, /--nx-role-manager-label/);
  assert.match(nexora.labelColor, /--nx-role-nexora-label/);
});

test("D — Day atmosphere tints the room without changing workspace treatment", () => {
  for (const intent of ["neutral", "investigate", "simulate", "commit", "execute"] as const) {
    const night = deriveNexoraMVPSceneEnvironmentVisualState(intent);
    const day = deriveNexoraMVPSceneEnvironmentVisualState(intent, {
      uiTheme: "day",
    });
    assert.equal(night.intent, day.intent);
    assert.equal(night.objectSurfaceTreatment, day.objectSurfaceTreatment);
    assert.notEqual(night.background, day.background);
  }
  assert.equal(
    NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.dayNightReplacesWorkspaceIntent,
    false,
  );
  assert.equal(NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.encodesObjectState, false);
});

test("E — OVS form/state authority is unchanged", () => {
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.operational, "rounded-block");
  assert.equal(EXECUTIVE_OVS_FAMILY_TO_PRIMITIVE.risk, "diamond");
  assert.equal(EXECUTIVE_OVS_OBJECT_STATE_VISUAL_BOUNDARY.changesGeometryFamily, false);
});

test("F — Executive shell applies html[data-theme] and persists existing key", () => {
  const shell = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"),
    "utf8",
  );
  assert.match(shell, /applyResolvedUiThemeToDocument/);
  assert.match(shell, /persistThemeMode/);
  assert.match(shell, /readStoredThemeMode/);
  assert.match(shell, /data-resolved-ui-theme=\{resolvedUiTheme\}/);
  assert.match(shell, /uiTheme: resolvedUiTheme/);
});

test("G — Conversation reuses message.role", () => {
  const source = readFileSync(
    join(FRONTEND, "app/executive/nex-mvp/NexoraConversationalExperience.tsx"),
    "utf8",
  );
  assert.match(source, /resolveExecutiveConversationRoleVisual/);
  assert.match(source, /message\.role === "manager"/);
  assert.doesNotMatch(source, /WhatsApp|Slack|Messenger/);
});

test("H — CSS tokens define Manager/Nexora and Day/Night roles", () => {
  const css = readFileSync(join(FRONTEND, "app/globals.css"), "utf8");
  assert.match(css, /html\[data-theme="night"\]/);
  assert.match(css, /html\[data-theme="day"\]/);
  assert.match(css, /--nx-role-manager-label/);
  assert.match(css, /--nx-role-nexora-label/);
  assert.match(css, /--nx-relationship/);
});

test("I — document apply helper writes data-theme when document exists", () => {
  if (typeof document === "undefined") {
    assert.equal(typeof applyResolvedUiThemeToDocument, "function");
    assert.equal(typeof persistThemeMode, "function");
    assert.equal(typeof resolveAndApplyUiThemeMode, "function");
    return;
  }
  applyResolvedUiThemeToDocument("day");
  assert.equal(document.documentElement.getAttribute("data-theme"), "day");
  applyResolvedUiThemeToDocument("night");
  assert.equal(document.documentElement.getAttribute("data-theme"), "night");
});
