/** NXA:2 — live productive executive dialogue certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-2-executive-conversation-guidance");
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
        need: shell?.getAttribute("data-nxa1-need") ?? "",
        referent: shell?.getAttribute("data-nxa1-referent") ?? "",
        behavior: shell?.getAttribute("data-nxa2-behavior") ?? "",
        valuable: shell?.getAttribute("data-nxa2-value") ?? "",
        gap: shell?.getAttribute("data-nxa2-gap") ?? "",
      };
    });
    turns.push({ utterance, response: result.last ?? "", focused: result.focused ?? "", diagnostic });
  }
  await page.screenshot({ path: join(out, `${name}.png`) });
  await page.close();
  transcripts.push({ name, turns });
  return turns;
}

const direct = await conversation("01-answer-ask", ["What is Capacity Gap?"]);
const clarify = await conversation("02-goal-gap", ["I want to improve performance."]);
const knownAdvice = await conversation("03-known-advice", ["Show Delivery.", "Delivery is below target. What should I do?"]);
const challenge = await conversation("04-challenge", ["Show Delivery.", "Capacity is definitely causing Delivery. Let's add staff."]);
const override = await conversation("05-override", ["What should I do about Capacity Gap?", "No. Show Margin Pressure."]);
const depth = await conversation("06-follow-up", ["Show Delivery.", "What should I do?", "Why?"]);
const uncertainty = await conversation("07-guide", ["Show Delivery.", "I'm not sure where to start."]);
const education = await conversation("08-education", ["Show Risk.", "How do I use this object?"]);
const stop = await conversation("09-wait", ["Show Delivery.", "Okay, I understand now."]);
const decision = await conversation("10-decision-boundary", ["Show Delivery.", "What should I do?", "Let's do that."]);
const generic = await conversation("11-generic", ["Explain Risk.", "Explain Capacity Expansion Plan.", "Explain Close Capacity Gap."]);
await browser.close();

const questionCount = (text) => (text.match(/\?/g) ?? []).length;
const leak = /\b(?:canonical|resolver|runtime binding|intent code|NCA:\d|MO:\d|EI:\d|DIR:\d)\b/i;
const all = transcripts.flatMap((item) => item.turns).map((turn) => turn.response).join(" ");
const proofs = {
  A_directAnswer: direct[0].diagnostic.behavior === "ANSWER" && questionCount(direct[0].response) === 0 && /Capacity Gap/i.test(direct[0].response),
  B_usefulClarification: clarify[0].diagnostic.behavior === "ASK" && clarify[0].diagnostic.gap === "GOAL" && questionCount(clarify[0].response) === 1,
  C_knownInformation: /96%|temporary capacity|delivery goal/i.test(knownAdvice[1].response) && !/what is (?:the |your )?delivery target/i.test(knownAdvice[1].response),
  D_advice: /capacity|investigat|delivery|evidence/i.test(knownAdvice[1].response) && !/generic help|how can i help/i.test(knownAdvice[1].response),
  E_challenge: challenge[1].diagnostic.behavior === "CHALLENGE" && /not.*confirm|evidence|uncertain|possible contributor/i.test(challenge[1].response) && challenge[1].focused === "obj-delivery",
  F_override: /margin/i.test(override[1].focused) && /Margin Pressure/i.test(override[1].response) && !/before that|must complete/i.test(override[1].response),
  G_followUpDepth: depth[2].response !== depth[1].response && /because|goal|trade-off|evidence|reason|fit/i.test(depth[2].response),
  H_uncertaintyGuide: uncertainty[1].diagnostic.behavior === "GUIDE" && /Delivery|Capacity Gap|investigat|evidence/i.test(uncertainty[1].response),
  I_contextualEducation: /Risk|explain|evidence|affect|investigat|ask/i.test(education[1].response) && !leak.test(education[1].response),
  J_wait: stop[1].diagnostic.behavior === "WAIT" && /Understood|welcome/i.test(stop[1].response) && !/would you like|what next/i.test(stop[1].response),
  K_decisionBoundary: !/decision (?:is |was )?approved|execution started/i.test(decision[2].response),
  L_genericObjects: generic.every((turn) => /Risk|Capacity Expansion Plan|Close Capacity Gap|scenario|goal/i.test(turn.response)),
  oneQuestionMaximum: transcripts.flatMap((item) => item.turns).every((turn) => turn.diagnostic.behavior !== "ASK" || questionCount(turn.response) <= 1),
  managerLanguage: !leak.test(all),
};
const report = { identity: "NXA:2/ExecutiveConversationGuidanceProductiveDialogue", url, pageErrors: errors, transcripts, proofs, ok: errors.length === 0 && Object.values(proofs).every(Boolean) };
await writeFile(join(out, "runtime-conversation-transcript.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:2 live /executive: ok");
