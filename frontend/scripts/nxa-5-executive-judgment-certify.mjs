/** NXA:5 — live /executive judgment certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-5-executive-judgment");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await openExecutivePage(page, url);

async function turn(utterance) {
  const result = await askExecutiveChat(page, utterance);
  const diagnostics = await page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return Object.fromEntries(["judgment", "preferred", "recommendation", "strength", "readiness"].map((key) => [key, shell?.getAttribute(`data-nxa5-${key}`) ?? ""]));
  });
  return { utterance, response: result.last ?? "", focused: result.focused ?? "", diagnostics };
}

const turns = [];
turns.push(await turn("Show Delivery."));
turns.push(await turn("Show the problems."));
const beforeFocus = turns.at(-1).focused;
turns.push(await turn("Which problem should I investigate first?"));
turns.push(await turn("Why?"));
turns.push(await turn("What would change your recommendation?"));
turns.push(await turn("Which problem is bigger?"));
await page.screenshot({ path: join(out, "live-executive.png") });
await browser.close();

const priority = turns[2], why = turns[3], change = turns[4], magnitude = turns[5];
const proofs = {
  collectionContinuity: priority.diagnostics.judgment === "INVESTIGATION_PRIORITY" && priority.diagnostics.preferred.length > 0,
  specificRelativeRecommendation: /investigat/i.test(priority.response) && /while|first|rather|criterion|goal|learning|revers/i.test(priority.response),
  explanationContinuity: /because|goal|evidence|learning|revers/i.test(why.response),
  falsifiableCondition: /change the recommendation if/i.test(change.response) && !/new information\.?$/i.test(change.response),
  noFakeMagnitude: /don.t have comparable impact evidence|not.*claim.*bigger/i.test(magnitude.response),
  noArchitectureLeakage: turns.every((item) => !/NXA:5|EI:4|candidate set|semantic rank|internal score/i.test(item.response)),
  noStageMutation: turns.slice(2).every((item) => item.focused === beforeFocus),
  ccAuthorityPreserved: !turns.some((item) => /decision (?:has been|is now) (?:approved|committed)|execution (?:has )?started/i.test(item.response)),
  zeroPageErrors: errors.length === 0,
};
const report = { identity: "NXA:5/ExecutiveJudgmentPrioritizationRecommendationQuality", url, errors, turns, proofs, ok: Object.values(proofs).every(Boolean) };
await writeFile(join(out, "runtime-executive-judgment.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:5 live /executive: ok");
