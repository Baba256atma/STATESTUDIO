/**
 * Bounded OVS:1 live cert against existing :3000. Hard 25s wall clock.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const URL = "http://127.0.0.1:3000/executive?ovs1=1";
const DEADLINE_MS = 25_000;

function familyOf(kind) {
  const k = String(kind ?? "").toLowerCase();
  if (k.includes("outcome") || k.includes("learning")) return "outcome";
  if (k.includes("kpi") || k.includes("koi") || k.includes("measure")) return "kpi";
  if (k.includes("context") || k.includes("insight") || k.includes("guidance"))
    return "context";
  if (k.includes("risk")) return "risk";
  if (k.includes("problem") || k.includes("issue")) return "problem";
  if (k.includes("decision")) return "decision";
  if (k.includes("scenario")) return "scenario";
  if (k.includes("execution") || k.includes("action") || k.includes("task"))
    return "execution";
  if (k.includes("goal") || k.includes("objective")) return "goal";
  return "operational";
}

const primitiveOf = {
  operational: "rounded-block",
  goal: "orb",
  kpi: "cylinder",
  problem: "prism",
  risk: "diamond",
  scenario: "rounded-block",
  decision: "hex-prism",
  execution: "rounded-block",
  outcome: "ring",
  context: "orb",
};

async function main() {
  const started = Date.now();
  await mkdir(here, { recursive: true });
  const remaining = () => Math.max(1_000, DEADLINE_MS - (Date.now() - started));
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    timeout: 8_000,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(8_000);
  const report = { url: URL, steps: [] };
  try {
    const res = await page.goto(URL, {
      waitUntil: "domcontentloaded",
      timeout: remaining(),
    });
    report.http = res?.status() ?? null;
    await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', {
      timeout: Math.min(12_000, remaining()),
    });
    await page.waitForTimeout(1200);

    const snapshot = await page.evaluate(() => {
      const stage = document.querySelector("[data-ovs-1-contract]");
      const objects = [...document.querySelectorAll("[data-canonical-id][data-object-type]")].map(
        (el) => ({
          id: el.getAttribute("data-canonical-id"),
          kind: el.getAttribute("data-object-type"),
          label: el.getAttribute("aria-label") ?? el.textContent?.trim()?.slice(0, 80),
          role: el.getAttribute("data-role"),
          focused: el.getAttribute("data-focused"),
          selected: el.getAttribute("data-selected"),
        }),
      );
      const canvasCount = document.querySelectorAll("canvas").length;
      const alerts = [...document.querySelectorAll('[role="alert"]')]
        .map((el) => el.textContent?.trim()?.slice(0, 160))
        .filter(Boolean);
      return {
        href: location.href,
        canvasCount,
        ovs: stage
          ? {
              contract: stage.getAttribute("data-ovs-1-contract"),
              identity: stage.getAttribute("data-ovs-1-identity"),
              enabled: stage.getAttribute("data-ovs-1-enabled"),
              family: stage.getAttribute("data-ovs-1-family"),
              primitive: stage.getAttribute("data-ovs-1-primitive"),
            }
          : null,
        focusedSubject: document
          .querySelector("[data-focused-subject]")
          ?.getAttribute("data-focused-subject"),
        nmiOpen: document
          .querySelector("[data-nmi-panel-open]")
          ?.getAttribute("data-nmi-panel-open"),
        overflow: {
          innerW: window.innerWidth,
          innerH: window.innerHeight,
          scrollW: document.documentElement.scrollWidth,
          scrollH: document.documentElement.scrollHeight,
        },
        objects,
        alerts,
        objectListOpen: document.querySelector('[data-testid="nexora-stage-object-list"]')
          ?.open,
      };
    });
    snapshot.objects = snapshot.objects.map((o) => {
      const family = familyOf(o.kind);
      return { ...o, family, primitive: primitiveOf[family] };
    });
    report.load = snapshot;
    report.steps.push("stage-loaded");

    await page.screenshot({
      path: join(here, "live-stage.png"),
      fullPage: false,
    });

    const pick =
      snapshot.objects.find((o) => o.family !== "operational") ?? snapshot.objects[0];
    if (pick?.id) {
      const details = page.locator('[data-testid="nexora-stage-object-list"]');
      if (!(await details.evaluate((el) => el.open).catch(() => false))) {
        await details.locator("summary").click({ timeout: 3_000 });
      }
      await page
        .locator(`[data-testid="nexora-stage-object-control-${pick.id}"]`)
        .first()
        .click({ timeout: 4_000 });
      await page.waitForTimeout(400);
      const afterSelect = await page.evaluate(() => ({
        focusedSubject: document
          .querySelector("[data-focused-subject]")
          ?.getAttribute("data-focused-subject"),
        advisor: document
          .querySelector('[data-testid="executive-advisor-panel"]')
          ?.textContent?.slice(0, 240),
        ovsFamily: document
          .querySelector("[data-ovs-1-family]")
          ?.getAttribute("data-ovs-1-family"),
        ovsPrimitive: document
          .querySelector("[data-ovs-1-primitive]")
          ?.getAttribute("data-ovs-1-primitive"),
        selectedId: document
          .querySelector('[data-selected="true"][data-canonical-id]')
          ?.getAttribute("data-canonical-id"),
      }));
      report.selection = { pick, afterSelect };
      report.steps.push("selected-object");
      await page.screenshot({
        path: join(here, "live-selected.png"),
        fullPage: false,
      });
    }

    const nmiBtn = page.locator('[data-testid="executive-nav-nmi"]');
    if ((await nmiBtn.count()) > 0) {
      const before = await page.evaluate(
        () =>
          document.querySelector("[data-focused-subject]")?.getAttribute("data-focused-subject"),
      );
      await nmiBtn.click({ timeout: 3_000 });
      await page.waitForTimeout(300);
      const nmiOpen = await page
        .locator("[data-nmi-panel-open]")
        .getAttribute("data-nmi-panel-open");
      let nmiPicked = null;
      const queueBtn = page.locator('[data-testid="nexora-executive-queue-list"] button').first();
      const mapNode = page.locator("[data-testid^=\"nmi-map-node-\"]").first();
      if ((await queueBtn.count()) > 0) {
        nmiPicked = await queueBtn.getAttribute("data-canonical-id");
        await queueBtn.click({ timeout: 3_000 });
      } else if ((await mapNode.count()) > 0) {
        nmiPicked = await mapNode.getAttribute("data-nmi-map-node");
        await mapNode.click({ timeout: 3_000 });
      }
      await page.waitForTimeout(400);
      const afterNmi = await page.evaluate(() => ({
        focusedSubject: document
          .querySelector("[data-focused-subject]")
          ?.getAttribute("data-focused-subject"),
        nmiOpen: document
          .querySelector("[data-nmi-panel-open]")
          ?.getAttribute("data-nmi-panel-open"),
      }));
      await nmiBtn.click({ timeout: 3_000 });
      await page.waitForTimeout(300);
      const afterCollapse = await page.evaluate(() => ({
        focusedSubject: document
          .querySelector("[data-focused-subject]")
          ?.getAttribute("data-focused-subject"),
        nmiOpen: document
          .querySelector("[data-nmi-panel-open]")
          ?.getAttribute("data-nmi-panel-open"),
      }));
      report.nmi = { before, nmiOpen, nmiPicked, afterNmi, afterCollapse };
      report.steps.push("nmi-continuity");
    }

    const connections = await page.evaluate(() => {
      const host = document.querySelector("[data-testid=\"nexora-3d-executive-stage\"]");
      return {
        connectionCount: host?.getAttribute("data-connection-count") ?? null,
        hasConnectionsLayer: !!document.querySelector("[data-testid*=\"connection\"]"),
      };
    });
    report.connections = connections;

    report.elapsedMs = Date.now() - started;
    report.ok = true;
  } catch (error) {
    report.ok = false;
    report.error = String(error?.message ?? error);
    report.elapsedMs = Date.now() - started;
    try {
      await page.screenshot({ path: join(here, "live-error.png"), fullPage: false });
    } catch {
      /* ignore */
    }
  } finally {
    await browser.close().catch(() => undefined);
  }
  await writeFile(join(here, "live-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ok: report.ok, elapsedMs: report.elapsedMs, error: report.error ?? null, steps: report.steps }, null, 2));
  if (!report.ok) process.exit(2);
}

await main();
