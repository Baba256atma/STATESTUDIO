/**
 * NXA:5-FIX3B-DIAG2 live /executive proof. Artifact-only.
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
      preparing: /PREPARING STAGE/i.test(document.body.innerText ?? ""),
      queueHeader: queue?.getAttribute("data-collection-header") ?? "none",
    };
  });
}

async function run(name, utterances) {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(`${name}: ${String(error)}`));
  await openExecutivePage(page, url);
  const baseline = await snapshot(page);
  const turns = [];
  for (const utterance of utterances) {
    const reply = await askExecutiveChat(page, utterance);
    turns.push({ utterance, reply: reply.last ?? "", focused: reply.focused, stage: await snapshot(page) });
  }
  await page.screenshot({ path: join(out, `${name}.png`) });
  await browser.close();
  return { baseline, turns };
}

await mkdir(out, { recursive: true });
const full = await run("live-full", ["hi", "show problems", "show all executive", "I am asking of Executions", "show me execution"]);
const D1 = await run("live-D1", ["show executions"]);
const D2 = await run("live-D2", ["show execution"]);
const D3 = await run("live-D3", ["show me all executions"]);
const D4 = await run("live-D4", ["show all executive"]);
const D7 = await run("live-D7", ["show problems", "which one is important?", "show executions"]);
const D8 = await run("live-D8", ["show problems", "which one is important?", "urgency"]);
const D10 = await run("live-D10", ["show scenarios", "exlpain Demand Surge"]);
const report = { identity: "NXA:5-FIX3B-DIAG2/Live", url, errors, full, D1, D2, D3, D4, D7, D8, D10 };
await writeFile(join(out, "live-stage.json"), JSON.stringify(report, null, 2));
const slim = (pack) => pack.turns.map((turn) => ({ u: turn.utterance, r: turn.reply, focus: turn.focused, mode: turn.stage.mode, cat: turn.stage.category, visible: turn.stage.visible }));
console.log(JSON.stringify({
  errors,
  baselinePreparing: full.baseline.preparing,
  full: slim(full),
  D1: slim(D1),
  D2: slim(D2),
  D3: slim(D3),
  D4: slim(D4),
  D7: slim(D7),
  D8: slim(D8),
  D10: slim(D10),
}, null, 2));
if (errors.length) process.exit(1);
