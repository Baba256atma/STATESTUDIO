/**
 * NXA:5-FIX3B-DIAG2R live /executive adversarial conversation.
 * Uses the existing listener. Does not start or stop a server.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const errors = [];

const ADVERSARIAL = Object.freeze([
  "show prolems",
  "show me scenario",
  "show executions",
  "I am asking of Executions",
  "show Demand Surge",
  "explain it",
  "show problems",
  "which one is more important?",
  "that's not what I asked",
  "how many scenarios do we have?",
  "show them",
  "compare them",
  "no, I mean the scenarios on Stage",
  "show all scenario",
  "what problems do we have?",
  "how many problems do we have?",
  "explain Delivery",
]);

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

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
const baseline = await snapshot(page);
const turns = [];
for (const utterance of ADVERSARIAL) {
  const reply = await askExecutiveChat(page, utterance);
  const stage = await snapshot(page);
  turns.push({
    utterance,
    reply: reply.last ?? "",
    focused: reply.focused,
    stage,
  });
  await page.screenshot({ path: join(out, `turn-${String(turns.length).padStart(2, "0")}.png`) });
}
await page.screenshot({ path: join(out, "live-adversarial.png") });
await browser.close();

const report = {
  identity: "NXA:5-FIX3B-DIAG2R/Live",
  url,
  errors,
  baseline,
  turns,
};
await writeFile(join(out, "live-stage.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  errors,
  baselinePreparing: baseline.preparing,
  turns: turns.map((turn) => ({
    u: turn.utterance,
    r: turn.reply,
    focus: turn.focused,
    mode: turn.stage.mode,
    cat: turn.stage.category,
    visible: turn.stage.visible,
    queue: turn.stage.queueHeader,
  })),
}, null, 2));
if (errors.length) process.exit(1);
