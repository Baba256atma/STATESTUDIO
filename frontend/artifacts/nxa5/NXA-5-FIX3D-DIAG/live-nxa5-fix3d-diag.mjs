/**
 * NXA:5-FIX3D-DIAG live Stage/Advisor proof. Artifact-only.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const errors = [];

async function snapshot(page) {
  return page.evaluate(() => {
    const text = (testId) =>
      document.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, " ").trim() ?? null;
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      presentationState: stage?.getAttribute("data-presentation-state") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      advisorTitle: text("nexora-advisor-view-title"),
      advisorSubject: text("nexora-advisor-view-subject"),
      advisorObservation: text("nexora-advisor-observation"),
      advisorRationale: text("nexora-advisor-rationale"),
      advisorRecommendation: text("nexora-advisor-recommendation"),
      advisorContext: text("nexora-advisor-view-context"),
      reportText: document.querySelector('[data-testid="nexora-subject-report"]')?.textContent?.replace(/\s+/g, " ").trim() ?? null,
      kpiText: [...document.querySelectorAll('[data-testid*="kpi"], [data-testid*="primary-value"]')]
        .slice(0, 8)
        .map((el) => ({ testid: el.getAttribute("data-testid"), text: el.textContent?.replace(/\s+/g, " ").trim() })),
      pageHasIeee: /84\.00000000000001/.test(document.body.innerText ?? ""),
      pageHasRawFact: /raw fact/.test(document.body.innerText ?? ""),
      pageHasMaxSat: /maximumSatisfactionScore/.test(document.body.innerText ?? ""),
      pageHas84pct: /84\.0%|84%/.test(document.body.innerText ?? ""),
    };
  });
}

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
const turns = [];
async function capture(utterance, reply) {
  const ui = await snapshot(page);
  turns.push({ utterance, reply: reply.last ?? "", focused: reply.focused, ui });
  await page.screenshot({ path: join(out, `live-${utterance.replace(/\s+/g, "-").toLowerCase()}.png`) });
}
const focus = await askExecutiveChat(page, "focus Customer");
await capture("focus Customer", focus);
const disclosure = page.locator('[data-testid="nexora-presentation-disclosure"]');
if (await disclosure.count()) {
  await disclosure.click();
  const reportOption = page.locator('[data-testid="nexora-presentation-option-report"]');
  if (await reportOption.count()) {
    await reportOption.click();
    await page.waitForTimeout(400);
    turns.push({ utterance: "[UI] select Report presentation", reply: "", focused: focus.focused, ui: await snapshot(page) });
    await page.screenshot({ path: join(out, "live-report-presentation.png") });
  }
}
const cont = await askExecutiveChat(page, "Continue reviewing Customer");
await capture("Continue reviewing Customer", cont);
const explain = await askExecutiveChat(page, "explain Customer");
await capture("explain Customer", explain);
await writeFile(join(out, "live-stage.json"), JSON.stringify({ identity: "NXA:5-FIX3D-DIAG/LiveStage", url, errors, turns }, null, 2));
await browser.close();
console.log(JSON.stringify({ errors, turns: turns.map((turn) => ({ utterance: turn.utterance, reply: turn.reply, focused: turn.focused, title: turn.ui.advisorTitle, ieee: turn.ui.pageHasIeee, rawFact: turn.ui.pageHasRawFact, field: turn.ui.pageHasMaxSat, pct: turn.ui.pageHas84pct, presentationState: turn.ui.presentationState })) }, null, 2));
if (errors.length) process.exit(1);
