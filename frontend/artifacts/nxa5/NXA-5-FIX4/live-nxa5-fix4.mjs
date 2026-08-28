/**
 * NXA:5-FIX4 live /executive adversarial conversation.
 * Uses EXECUTIVE_URL or starts against an existing listener. Does not kill other servers.
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
  "show me scenarios",
  "what is on stage?",
  "why are they here?",
  "which one is more important for business?",
  "I am talking about scenarios",
  "risk",
  "explain Demand Surge",
  "what is on stage now?",
  "what is Capacity?",
  "what is on stage now?",
  "show Capacity",
  "what is on stage now?",
  "go back to scenarios",
  "compare them",
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
  const before = await snapshot(page);
  const reply = await askExecutiveChat(page, utterance);
  const stage = await snapshot(page);
  turns.push({
    utterance,
    reply: reply.last ?? "",
    focused: reply.focused,
    before,
    stage,
  });
  await page.screenshot({ path: join(out, `turn-${String(turns.length).padStart(2, "0")}.png`) });
}
await page.screenshot({ path: join(out, "live-adversarial.png") });
await browser.close();

const report = {
  identity: "NXA:5-FIX4/Live",
  url,
  errors,
  baseline,
  turns,
};
await writeFile(join(out, "live-stage.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  url,
  errors: errors.length,
  turns: turns.map((item) => ({
    u: item.utterance,
    cat: item.stage.category,
    focus: item.focused,
    reply: String(item.reply).slice(0, 120),
  })),
}, null, 2));
if (errors.length > 0) process.exit(1);
