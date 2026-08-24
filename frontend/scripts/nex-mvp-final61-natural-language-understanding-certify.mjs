/**
 * NEX-MVP-FINAL:6.1 — live natural-language turns on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutiveChat,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-1-natural-language-understanding",
);
await mkdir(OUT, { recursive: true });
const FALLBACK = /not sure how that relates/i;
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|MISSING_|READY_FOR_|\bobj-|\bctx-|canonical intent|resolver|namespace|semantic parser/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutiveChat(page);

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const nlu = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      operation: shell?.getAttribute("data-nlu-operation") ?? "",
      subject: shell?.getAttribute("data-nlu-subject") ?? "",
      intent: shell?.getAttribute("data-nlu-communicative-intent") ?? "",
      confidence: shell?.getAttribute("data-nlu-confidence") ?? "",
      engine: shell?.getAttribute("data-nex-mvp-final61-engine") ?? "",
    };
  });
  turns.push({ utterance, ...turn, nlu });
  return turn;
}

const look = await ask("Can we look at Delivery?");
await page.screenshot({ path: join(OUT, "01-look-delivery.png") });
const goingOn = await ask("What's actually going on with Delivery?");
const atRisk = await ask("Is anything putting the delivery goal at risk?");
const confident = await ask("How confident are we about that?");
const nothing = await ask("What would happen if management did nothing?");
const capacity = await ask("I'd like to understand Capacity.");
await page.screenshot({ path: join(OUT, "02-capacity-understand.png") });
const worry = await ask("Is Capacity really worth worrying about?");
const evidence = await ask("What evidence do we have?");
const options = await ask("What other options are there?");
const safer = await ask("Which scenario looks safer?");
await page.screenshot({ path: join(OUT, "03-options.png") });
await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  phase: "NEX-MVP-FINAL:6.1",
  identity: "NEX-MVP-FINAL:6.1/NaturalLanguageUnderstanding",
  http: opened.http,
  identityRuntime: opened.identity,
  existingUrl: EXECUTIVE_EXISTING_URL,
  turns,
  focusedDelivery: look.focused === "obj-delivery",
  noFallback: !FALLBACK.test(joined),
  leaks: LEAK.test(joined),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  report.focusedDelivery &&
  report.noFallback &&
  report.leaks === false &&
  report.errors.length === 0 &&
  /Delivery/i.test(goingOn.last);

process.exit(passed ? 0 : 1);
