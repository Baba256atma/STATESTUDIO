/**
 * NPA-T OVS-MATERIAL:1 live Day/Night Stage proof.
 * Reuses the existing executive Playwright harness.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  openExecutivePage,
} from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = `${(process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0]}?reset=1`;
await mkdir(out, { recursive: true });

async function stageProof(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const labels = [...document.querySelectorAll('[data-object-caption="primary"]')];
    const captions = labels.map((el) => {
      const lines = [...el.querySelectorAll("[data-caption-role]")].map((line) => ({
        role: line.getAttribute("data-caption-role"),
        text: line.textContent?.trim() ?? "",
        fontWeight: getComputedStyle(line).fontWeight,
        opacity: getComputedStyle(line).opacity,
      }));
      return {
        id: el.getAttribute("data-canonical-id"),
        managementKind: el.getAttribute("data-management-kind"),
        status: el.getAttribute("data-status"),
        lines,
        color: getComputedStyle(el).color,
      };
    });
    const objects = [...document.querySelectorAll("[data-testid^='nexora-stage-object-control-']")].map(
      (el) => ({
        id: el.getAttribute("data-canonical-id"),
        kind: el.getAttribute("data-object-type"),
        managementKind: el.getAttribute("data-management-kind"),
        status: el.getAttribute("data-status"),
        label: el.textContent?.replace(/\s+/g, " ").trim() ?? "",
      }),
    );
    const css = getComputedStyle(document.documentElement);
    return {
      themeMode: shell?.getAttribute("data-theme-mode") ?? null,
      resolvedTheme: shell?.getAttribute("data-resolved-ui-theme") ?? null,
      htmlTheme: document.documentElement.getAttribute("data-theme"),
      stageBgToken: css.getPropertyValue("--nx-stage-bg").trim(),
      labelHalo: css.getPropertyValue("--nx-label-halo").trim(),
      ovsEnabled: stage?.getAttribute("data-ovs-1-enabled") ?? null,
      ovsFamily: stage?.getAttribute("data-ovs-1-family") ?? null,
      ovsPrimitive: stage?.getAttribute("data-ovs-1-primitive") ?? null,
      canvas: Boolean(stage?.querySelector("canvas")),
      rightPanel: Boolean(
        document.querySelector('[data-testid="nexora-right-package-working-context"]') ||
          document.querySelector('[data-testid="nexora-advisor-view"]') ||
          document.querySelector('[data-testid="nexora-subject-report"]') ||
          document.querySelector('[data-testid="nexora-conversational-experience"]'),
      ),
      captions,
      objects,
    };
  });
}

const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
await page.waitForTimeout(1200);

await page.evaluate(() => {
  const button = document.querySelector('[data-testid="executive-theme-day"]');
  if (button instanceof HTMLElement) button.click();
});
await page.waitForFunction(
  () => document.documentElement.getAttribute("data-theme") === "day",
  null,
  { timeout: 8000 },
);
await page.waitForTimeout(1400);

const day = await stageProof(page);
await page.screenshot({ path: join(out, "day-stage.png"), fullPage: false });
await page.locator('[data-testid="nexora-3d-executive-stage"]').screenshot({
  path: join(out, "day-stage-canvas.png"),
});

const objectsToggle = page.locator("summary").filter({ hasText: "Objects" }).first();
if (await objectsToggle.count()) {
  await objectsToggle.click({ timeout: 3000 }).catch(() => null);
}
const riskControl = page.locator('[data-testid="nexora-stage-object-control-obj-risk"]');
if (await riskControl.count()) {
  await riskControl.click({ timeout: 4000, force: true });
  await page.waitForTimeout(700);
}
const dayRisk = await stageProof(page);
await page.screenshot({ path: join(out, "day-risk.png"), fullPage: false });
await page.locator('[data-testid="nexora-3d-executive-stage"]').screenshot({
  path: join(out, "day-risk-canvas.png"),
});

await page.evaluate(() => {
  const button = document.querySelector('[data-testid="executive-theme-night"]');
  if (button instanceof HTMLElement) button.click();
});
await page.waitForFunction(
  () => document.documentElement.getAttribute("data-theme") === "night",
  null,
  { timeout: 8000 },
);
await page.waitForTimeout(800);
const night = await stageProof(page);
await page.screenshot({ path: join(out, "night-stage.png"), fullPage: false });
await page.locator('[data-testid="nexora-3d-executive-stage"]').screenshot({
  path: join(out, "night-stage-canvas.png"),
});

await page.evaluate(() => {
  const button = document.querySelector('[data-testid="executive-theme-day"]');
  if (button instanceof HTMLElement) button.click();
});
await page.waitForFunction(
  () => document.documentElement.getAttribute("data-theme") === "day",
  null,
  { timeout: 8000 },
);
await page.waitForTimeout(500);

const proof = {
  url,
  errors,
  day,
  dayRisk,
  night,
  gates: {
    dayTheme: day.resolvedTheme === "day" || day.htmlTheme === "day",
    nightTheme: night.resolvedTheme === "night" || night.htmlTheme === "night",
    dayNotWhiteStage: !/#ffffff/.test(day.stageBgToken),
    dayUsesCoolBlue: /8ec4ea|c5e4f8|5a9ad0/i.test(day.stageBgToken),
    nightIndependent: night.htmlTheme !== day.htmlTheme,
    twoObjects: day.objects.length >= 2,
    captions: day.captions.length >= 2,
    captionHierarchy: day.captions.some(
      (caption) =>
        caption.lines.some((line) => line.role === "primary") &&
        caption.lines.some((line) => line.role === "secondary"),
    ),
    riskPresent: day.objects.some(
      (object) => object.id === "obj-risk" || object.managementKind === "risk",
    ),
    watchAndUnresolved:
      day.objects.some((object) => object.status === "watch") &&
      day.objects.some((object) => object.status === "unresolved"),
    canvas: day.canvas === true,
    rightPanel: day.rightPanel === true,
    pageErrors: errors.length === 0,
  },
};

await writeFile(join(out, "live-browser.json"), `${JSON.stringify(proof, null, 2)}\n`);
await browser.close();

const failed = Object.entries(proof.gates).filter(([, ok]) => !ok);
if (failed.length > 0) {
  console.error("OVS-MATERIAL:1 live gates failed:", failed);
  process.exit(1);
}
console.log("OVS-MATERIAL:1 live gates passed");
