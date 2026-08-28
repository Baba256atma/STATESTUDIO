/** NXA:3 — live /executive situational-awareness certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-3-executive-situation");
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
    const situation = await page.evaluate(() => {
      const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
      return Object.fromEntries(["goal", "focus", "causal", "recommendation", "decision", "execution", "outcome", "change"].map((key) => [key, shell?.getAttribute(`data-nxa3-${key}`) ?? ""]));
    });
    turns.push({ utterance, response: result.last ?? "", focused: result.focused ?? "", situation });
  }
  await page.screenshot({ path: join(out, `${name}.png`) });
  await page.close();
  transcripts.push({ name, turns });
  return turns;
}

const a = await conversation("A-goal", ["My goal is to improve delivery reliability.", "Show Capacity Gap.", "Why does Capacity matter?"]);
const b = await conversation("B-investigation", ["Show Delivery.", "Show the problems.", "Explain Capacity Gap.", "Is it causing Delivery?", "What should I check?"]);
const c = await conversation("C-known", ["Show Delivery.", "How far are we from the Goal?"]);
const d = await conversation("D-invalidation", ["What should I do about Capacity Gap?", "Capacity is normal and is not the cause.", "What should I do now?"]);
const e = await conversation("E-override", ["What should I do about Capacity Gap?", "No. Focus on Margin Pressure.", "Where were we?"]);
const i = await conversation("I-conflict", ["Show Delivery.", "Our latest number is 94% for Delivery."]);
const j = await conversation("J-topic-shift", ["Show Capacity Gap.", "Forget Capacity for now. Show Margin Pressure.", "What should I investigate?"]);
const k = await conversation("K-recovery", ["Show Delivery.", "Why is it below target?", "Where were we?"]);
const l = await conversation("L-generic", ["Explain Delivery.", "Explain Capacity Gap.", "Explain Risk.", "Explain Capacity Expansion Plan.", "Explain Expand Capacity.", "Explain Capacity Expansion."]);
await browser.close();

const proofs = {
  A_goalOrientation: /delivery|goal/i.test(a[2].response) && a[2].situation.causal !== "CONFIRMED",
  B_continuity: /Capacity|Delivery|evidence|investigat/i.test(b[4].response) && b[4].situation.causal === "UNCONFIRMED",
  C_knownValues: /91|96|target/i.test(c[1].response) && !/what is (?:the |your )?target/i.test(c[1].response),
  D_invalidation: /would not repeat|reassess|weakens/i.test(d[2].response),
  E_override: /Margin Pressure/i.test(e[2].response) && /margin/i.test(e[2].situation.focus),
  I_conflict: /91%|91/.test(i[1].response) && /94%|94/.test(i[1].response) && /not yet validated/i.test(i[1].response),
  J_topicShift: /margin/i.test(j[2].situation.focus) && !/^Investigate Capacity Gap/i.test(j[2].response),
  K_compression: k[2].response.length < 600 && /focused|Goal:|unresolved|causal/i.test(k[2].response),
  L_generic: l.every((turn) => turn.situation.focus.length > 0),
};
const report = { identity: "NXA:3/ExecutiveContextSituationalAwareness", url, pageErrors: errors, transcripts, proofs, ok: errors.length === 0 && Object.values(proofs).every(Boolean) };
await writeFile(join(out, "runtime-situation-transcript.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:3 live /executive: ok");
process.exit(0);
