/** NXA:1 — live Executive Decision Advisor contract on /executive. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-1-executive-advisor-contract");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const transcripts = [];

async function conversation(name, utterances) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(String(error)));
  await openExecutivePage(page, url);
  const turns = [];
  for (const utterance of utterances) {
    const result = await askExecutiveChat(page, utterance);
    const diagnostic = await page.evaluate(() => {
      const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
      return {
        role: shell?.getAttribute("data-nxa1-role") ?? "",
        need: shell?.getAttribute("data-nxa1-need") ?? "",
        referent: shell?.getAttribute("data-nxa1-referent") ?? "",
        navigation: shell?.getAttribute("data-nxa1-navigation") ?? "",
      };
    });
    turns.push({ utterance, response: result.last ?? "", focused: result.focused ?? "", diagnostic });
  }
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: false });
  await page.close();
  transcripts.push({ name, turns });
  return turns;
}

const knowledge = await conversation("01-knowledge", ["What is Capacity Gap?"]);
const navigation = await conversation("02-navigation", ["Show Capacity Gap."]);
const continuity = await conversation("03-continuity", ["Show Delivery.", "Explain it."]);
const advisory = await conversation("04-investigate-advise", [
  "Show Delivery.",
  "Why is Delivery below target?",
  "What should I do about it?",
  "Is Capacity definitely causing the Delivery problem?",
  "How can you help me with this?",
]);
const collection = await conversation("05-collection", [
  "Show all problems.",
  "Which one should I investigate first?",
]);
await browser.close();

const all = transcripts.flatMap((item) => item.turns).map((turn) => turn.response).join(" ");
const leak = /\b(?:canonical|resolver|semantic route|runtime binding|overlay|registry|intent code|internal state identifier|NCA:\d|MO:\d|EI:\d|DIR:\d)\b/i;
const certainty = /\b(?:definitely caused|is causing|confirmed cause)\b/i;
const proofs = {
  identity: transcripts.flatMap((item) => item.turns).every((turn) => turn.diagnostic.role === "Executive Decision Advisor"),
  knowledgeNotNavigation: knowledge[0].diagnostic.need === "KNOW" && knowledge[0].diagnostic.navigation === "false" && !/^Focused|^Showing/i.test(knowledge[0].response),
  explicitNavigation: navigation[0].diagnostic.need === "NAVIGATE" && navigation[0].diagnostic.navigation === "true" && /capacity/i.test(navigation[0].focused),
  referentialContinuity: /Delivery/i.test(continuity[1].diagnostic.referent) && /Delivery/i.test(continuity[1].response),
  investigation: advisory[1].diagnostic.need === "INVESTIGATE" && /Delivery/i.test(advisory[1].response),
  advice: advisory[2].diagnostic.need === "ADVISE" && advisory[2].response.length > 12,
  uncertainty: /evidence|confirm|associated|connected|not enough/i.test(advisory[3].response) && !/definitely causing/i.test(advisory[3].response) && advisory[3].focused === "obj-delivery",
  nexoraEducation: advisory[4].diagnostic.need === "LEARN_NEXORA" && /explain|evidence|recommend|investigat|goal|outcome/i.test(advisory[4].response),
  collectionContinuity: /Capacity Gap|Margin Pressure/i.test(collection[1].response),
  managerLanguage: !leak.test(all),
  causalSafety: !certainty.test(all.replace(/\b(?:not|isn't|is not|none of (?:these|them) is) (?:a )?confirmed cause\b/gi, "uncertainty preserved")),
};
const report = {
  identity: "NXA:1/ExecutiveDecisionAdvisorConversationContract",
  url,
  pageErrors: errors,
  transcripts,
  proofs,
  ok: errors.length === 0 && Object.values(proofs).every(Boolean),
};
await writeFile(join(out, "runtime-conversation-transcript.json"), JSON.stringify(report, null, 2));
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log("NXA:1 live /executive: ok");
