import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "../../../scripts/nex-mvp-final3-executive-chat-harness.mjs";

const out = dirname(fileURLToPath(import.meta.url));
const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const errors = [];
const ADVERSARIAL = Object.freeze([
  "show Capacity",
  "what happens if we ignore it?",
  "delivery is too late",
  "what did I just tell you?",
  "what is on Stage?",
  "why might Delivery be late?",
  "show Delivery",
  "inventory is too high",
  "what did I just report?",
]);

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      visible: Number(stage?.getAttribute("data-stage-collection-visible") ?? "0"),
    };
  });
}

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);
const turns = [];
for (const utterance of ADVERSARIAL) {
  const before = await snapshot(page);
  const reply = await askExecutiveChat(page, utterance);
  const stage = await snapshot(page);
  turns.push({ utterance, reply: reply.last ?? "", focused: reply.focused, before, stage });
}
await page.screenshot({ path: join(out, "live-adversarial.png") });
await browser.close();
await writeFile(join(out, "live-stage.json"), JSON.stringify({ identity: "NXA:5-FIX5/Live", url, errors, turns }, null, 2));
console.log(JSON.stringify({
  url,
  errors: errors.length,
  turns: turns.map((item) => ({
    u: item.utterance,
    focus: item.focused,
    cat: item.stage.category,
    reply: String(item.reply).slice(0, 140),
  })),
}, null, 2));
if (errors.length > 0) process.exit(1);
