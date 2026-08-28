/**
 * NXA:5-FIX3B live Stage/Advisor proof. Artifact-only.
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
      preparing: Boolean(document.body.innerText.includes("PREPARING STAGE")),
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
const diagnosed = await run("live-diagnosed", [
  "show me problems",
  "which one of prolems is important?",
  "urgency",
]);
const investigation = await run("live-investigation", [
  "show me problems",
  "which should we investigate first?",
]);
const report = {
  identity: "NXA:5-FIX3B/Live",
  url,
  errors,
  diagnosed,
  investigation,
};
await writeFile(join(out, "live-stage.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  errors,
  diagnosed: diagnosed.turns.map((turn) => ({
    u: turn.utterance,
    r: turn.reply.replace(/^Nexora/, ""),
    mode: turn.stage.mode,
    cat: turn.stage.category,
    focus: turn.focused,
    visible: turn.stage.visible,
  })),
  investigation: investigation.turns.map((turn) => ({
    u: turn.utterance,
    r: turn.reply.replace(/^Nexora/, ""),
    mode: turn.stage.mode,
    cat: turn.stage.category,
  })),
}, null, 2));
if (errors.length) process.exit(1);
