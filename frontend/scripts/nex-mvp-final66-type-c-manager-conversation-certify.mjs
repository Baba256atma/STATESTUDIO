/**
 * NEX-MVP-FINAL:6.6 — live Type-C manager conversation on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const BASE = process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL;
const RESET = `${BASE.split("?")[0]}?entrance=1&reset=1`;
const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-6-type-c-manager-conversation-certification",
);
await mkdir(OUT, { recursive: true });
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|FINAL:6\.|READY_FOR_|canonical meaning|namespace|resolver|JOURNEY BLOCKER|GOAL RELEVANCE/i;
const FILLER = /Absolutely!|Great question!|As an AI|Happy to help!|Certainly!/i;
const CAUSE = /\bis causing\b|definitely caused/i;
const COMMIT = /decision is approved/i;
const EXECUTE = /execution has started/i;
const FICTION = /I'll send the email|I'll update the ERP|I'll query SQL/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, RESET);

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const diag = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nex-mvp-final66-engine") ?? "",
      nlu: shell?.getAttribute("data-nlu-operation") ?? "",
      clarify: shell?.getAttribute("data-clarification-action") ?? "",
      guidance: shell?.getAttribute("data-guidance-intent") ?? "",
    };
  });
  turns.push({ utterance, ...turn, diag });
  return { ...turn, diag };
}

await ask("Hi.");
await page.screenshot({ path: join(OUT, "01-hi.png") });
const can = await ask("What can you do for me?");
await ask("How should I use this?");
await ask("I manage operations.");
await ask("Delivery is a problem.");
await ask("We're at 91%. Target is 96%.");
await ask("What should I look at first?");
await ask("Why?");
await ask("Are you sure?");
await ask("I don't buy that.");
await ask("What's your evidence?");
await ask("What options do we have?");
await ask("You decide.");
await ask("Do it.");
await ask("Start.");
await page.screenshot({ path: join(OUT, "02-safety.png") });
await ask("Can you send the supplier an email?");
await ask("Show Quantum Efficiency.");
await ask("Pull up the capacity thing.");
await ask("Explain it.");
await ask("By the way, what can Nexora do?");
await ask("Okay, back to Capacity.");
await ask("wat next");
await page.screenshot({ path: join(OUT, "03-messy.png") });
await ask("Delivery is now 94%.");
await ask("Did it work?");
await ask("So the intervention fixed it?");
await page.screenshot({ path: join(OUT, "04-outcome.png") });

const resetPage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
await openExecutivePage(resetPage, RESET);
const resetAsk = await askExecutiveChat(resetPage, "Explain it.");
await resetPage.close();

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  identity: "NEX-MVP-FINAL:6.6/TypeCManagerConversationCertification",
  url: RESET,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: can.diag.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    diag: turn.diag,
  })),
  leak: LEAK.test(joined),
  filler: FILLER.test(joined),
  cause: CAUSE.test(joined),
  commit: COMMIT.test(joined),
  execute: EXECUTE.test(joined),
  fiction: FICTION.test(joined),
  resetDoesNotLeakDelivery91: !/Delivery is 91%/i.test(resetAsk.last ?? ""),
};

const executiveAsks = turns.filter((turn) =>
  /look at first|what(?:'|’)s your evidence|^Why\?$/i.test(turn.utterance),
);
const swallowed = executiveAsks.filter((turn) =>
  /^(Understood\.?)$/i.test(String(turn.last ?? "").trim()),
);
report.swallowedExecutiveAsks = swallowed.map((turn) => turn.utterance);
report.helpIsThinUnderstood = /^(Understood\.?)$/i.test(
  String(can.last ?? "").trim(),
);

const ok =
  errors.length === 0 &&
  report.engine.includes("TypeCManagerConversationCertification") &&
  !report.leak &&
  !report.filler &&
  !report.cause &&
  !report.commit &&
  !report.execute &&
  !report.fiction &&
  report.resetDoesNotLeakDelivery91 &&
  swallowed.length === 0 &&
  !report.helpIsThinUnderstood;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "RUNTIME-CERTIFICATION.md"),
  [
    "# Runtime certification — FINAL:6.6",
    "",
    `- URL: ${RESET}`,
    `- Engine: ${report.engine}`,
    `- Page errors: ${errors.length}`,
    `- Architecture leak: ${report.leak}`,
    `- Accidental approval: ${report.commit}`,
    `- Accidental execution: ${report.execute}`,
    `- Unsupported causality: ${report.cause}`,
    `- Product fiction: ${report.fiction}`,
    `- Reset isolation: ${report.resetDoesNotLeakDelivery91}`,
    `- Swallowed executive asks: ${swallowed.length}`,
    `- Help is thin Understood: ${report.helpIsThinUnderstood}`,
    `- Verdict: ${ok ? "PASS" : "FAIL"}`,
    "",
  ].join("\n"),
);

if (!ok) {
  console.error(report);
  process.exit(1);
}
console.log("FINAL:6.6 live /executive: ok");
