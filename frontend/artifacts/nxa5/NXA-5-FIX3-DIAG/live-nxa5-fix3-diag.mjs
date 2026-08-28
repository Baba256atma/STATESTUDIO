/**
 * NXA:5-FIX3-DIAG live Stage proof. Artifact-only. Does not change production.
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
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const queue = document.querySelector('[data-testid="nexora-executive-queue"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      visible: Number(stage?.getAttribute("data-stage-collection-visible") ?? "0"),
      breadcrumb: document.querySelector('[data-testid="nexora-stage-interaction-breadcrumb"]')?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      queueHeader: queue?.getAttribute("data-collection-header") ?? "none",
      goalRow: Boolean(document.querySelector('[data-testid="nexora-executive-queue-row-goal"]')),
    };
  });
}

async function run(name, utterances) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(`${name}: ${String(error)}`));
  await openExecutivePage(page, url);
  const turns = [];
  for (const utterance of utterances) {
    const reply = await askExecutiveChat(page, utterance);
    turns.push({ utterance, reply: reply.last ?? "", focused: reply.focused, stage: await snapshot(page) });
  }
  await page.screenshot({ path: join(out, `${name}.png`) });
  await browser.close();
  return turns;
}

await mkdir(out, { recursive: true });
const report = {
  identity: "NXA:5-FIX3-DIAG/LiveStage",
  url,
  errors,
  A: await run("live-A", ["show scenarios", "exlpain Demand Surge"]),
  B: await run("live-B", ["show me problems", "which one of prolems is important?"]),
  C: await run("live-C", ["show Demand Surge", "show me all goals"]),
};
await writeFile(join(out, "live-stage.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  errors,
  A: report.A.map((turn) => ({ utterance: turn.utterance, reply: turn.reply, focused: turn.focused, mode: turn.stage.mode, category: turn.stage.category })),
  B: report.B.map((turn) => ({ utterance: turn.utterance, reply: turn.reply, focused: turn.focused, mode: turn.stage.mode })),
  C: report.C.map((turn) => ({ utterance: turn.utterance, reply: turn.reply, focused: turn.focused, mode: turn.stage.mode, goalRow: turn.stage.goalRow })),
}, null, 2));
if (errors.length) process.exit(1);
