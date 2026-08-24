/**
 * NEX-MVP-FINAL:6.5 — live guidance and self-knowledge on /executive.
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
const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-6-5-guidance-self-knowledge",
);
await mkdir(OUT, { recursive: true });
const LEAK =
  /CORE-INT|CC:9|EI:4|\bMO:|FINAL:6\.5|\bobj-|\bctx-|READY_FOR_|canonical meaning|namespace|resolver/i;
const FILLER = /Absolutely!|Great question!|As an AI|Happy to help!/i;
const WIZARD = /Step 1 complete|Now perform Step 2/i;
const FICTION = /I'll send the email|I'll update the ERP|monitor this 24\/7/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, BASE);

const turns = [];
async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  const guidance = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      engine: shell?.getAttribute("data-nex-mvp-final65-engine") ?? "",
      intent: shell?.getAttribute("data-guidance-intent") ?? "",
      action: shell?.getAttribute("data-guidance-action") ?? "",
      capability: shell?.getAttribute("data-guidance-capability") ?? "",
      availability: shell?.getAttribute("data-guidance-availability") ?? "",
      proactive: shell?.getAttribute("data-guidance-proactive") ?? "",
      suppressed: shell?.getAttribute("data-guidance-suppressed") ?? "",
    };
  });
  turns.push({ utterance, ...turn, guidance });
  return { ...turn, guidance };
}

const hi = await ask("Hi.");
await page.screenshot({ path: join(OUT, "01-hi.png") });
const can = await ask("What can you actually do for me?");
await page.screenshot({ path: join(OUT, "02-what-can-you-do.png") });
const how = await ask("How should I use Nexora?");
const improve = await ask("I want to improve Delivery.");
const need = await ask("What do you need from me?");
const baseline = await ask("We're at 91%. Target is 96%.");
const askNow = await ask("What should I ask now?");
const why = await ask("Why are we below target?");
const unknown = await ask("What don't we know yet?");
const first = await ask("What should I investigate first?");
const whyThat = await ask("Why that?");
const options = await ask("What options do we have?");
const compareYet = await ask("Can you compare them yet?");
const missing = await ask("What's missing?");
const nowWhat = await ask("Okay, now what?");
const decide = await ask("Can you make the decision for me?");
const instead = await ask("What can you do instead?");
const where = await ask("Where are we now?");
await page.screenshot({ path: join(OUT, "03-where-are-we.png") });
const did = await ask("Did we decide?");
const start = await ask("Can you start it?");
const doing = await ask("Are we doing it now?");
const watch = await ask("What should I watch next?");
const worked = await ask("Did it work?");
const stillUnknown = await ask("What don't we know yet?");
const email = await ask("Can you send this email?");
await page.screenshot({ path: join(OUT, "04-limitation.png") });

await browser.close();

const joined = turns.map((turn) => turn.last).join(" ");
const report = {
  identity: "NEX-MVP-FINAL:6.5/GuidanceSelfKnowledge",
  url: BASE,
  opened: Boolean(opened),
  pageErrors: errors,
  engine: can.guidance.engine,
  turns: turns.map((turn) => ({
    utterance: turn.utterance,
    last: turn.last,
    guidance: turn.guidance,
  })),
  leak: LEAK.test(joined),
  filler: FILLER.test(joined),
  wizard: WIZARD.test(joined),
  fiction: FICTION.test(joined),
  capabilityDiffers: can.last !== instead.last,
  honestEmail: /can(?:'|’)t|cannot|can not/i.test(email.last),
  noDecisionAutonomy: !/I'll decide|I will decide/i.test(decide.last),
  noStartWithoutDecision: !/execution has started/i.test(start.last),
};

const ok =
  errors.length === 0 &&
  report.engine.includes("GuidanceSelfKnowledge") &&
  !report.leak &&
  !report.filler &&
  !report.wizard &&
  !report.fiction &&
  report.honestEmail &&
  report.noDecisionAutonomy &&
  report.noStartWithoutDecision &&
  hi.last.length > 0 &&
  how.last.length > 0 &&
  where.last.length > 0;

report.ok = ok;
await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
await writeFile(
  join(OUT, "HUMAN-MANAGER-REVIEW.md"),
  [
    "# Human manager review — FINAL:6.5",
    "",
    `- Useful without a manual: ${how.last}`,
    `- Real capabilities: ${can.last}`,
    `- Limitations: ${email.last}`,
    `- Next step: ${nowWhat.last}`,
    `- Where we are: ${where.last}`,
    `- Decision boundary: ${decide.last}`,
    "",
    ok ? "Review: Nexora taught through conversation without a wizard or fake autonomy." : "Review: not certified.",
    "",
  ].join("\n"),
);

if (!ok) {
  console.error(report);
  process.exit(1);
}
console.log("FINAL:6.5 live /executive: ok");
