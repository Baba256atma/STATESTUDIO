/**
 * NEX-ENT:6 — live /executive Data & Evidence education proof.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-ent6-data-evidence");
const BASE = process.env.NEXORA_BASE_URL ?? "http://localhost:3000";
const EXISTING = `${BASE}/executive`;
const ENTRANCE = `${BASE}/executive?entrance=1&reset=1`;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

function attachConsole(page) {
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
}

async function open(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  attachConsole(page);
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(900);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const data = document.querySelector('[data-testid="nexora-stage-data-control"]');
    const nexoraMessages = [
      ...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]'),
    ].map((node) => node.textContent ?? "");
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      entState: shell?.getAttribute("data-nex-ent1-state"),
      ent6State: shell?.getAttribute("data-nex-ent6-state"),
      example: shell?.getAttribute("data-nex-ent6-example"),
      gaTarget: shell?.getAttribute("data-guided-attention-target"),
      gaCue: shell?.getAttribute("data-guided-attention-cue"),
      dataRail: data?.getAttribute("data-data-rail-open"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      sufficiency: shell?.getAttribute("data-nex-exp1-sufficiency"),
      goal: shell?.getAttribute("data-nex-exp2-goal"),
      goalConfirmed: shell?.getAttribute("data-nex-exp2-confirmed"),
      last: nexoraMessages.at(-1) ?? "",
      jargon: /NCA|DTH|BCA|RDI|DATA-UX|canonical authority|runtime|projection/i.test(
        nexoraMessages.join(" "),
      ),
    };
  });
}

async function ask(page, utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(400);
  return snapshot(page);
}

async function reachDataEducation(page) {
  await ask(page, "Show me");
  await ask(page, "Show me how focus works");
  for (let index = 0; index < 20; index += 1) {
    const snap = await ask(page, "Show me the next one");
    if (snap.ent6State === "SOURCE") return snap;
  }
  return snapshot(page);
}

const existing = await open(EXISTING);
const existingSnapshot = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const first = await open(ENTRANCE);
await first.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
const intro = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "01-entrance-intro.png") });

const source = await reachDataEducation(first.page);
await first.page.screenshot({ path: join(OUT, "02-data-source.png") });

const located = await ask(first.page, "Where is Data?");
const dataOpen = located.dataRail === "true";
await first.page.screenshot({ path: join(OUT, "03-locate-data.png") });

await first.page.locator('[data-testid="nexora-stage-data-control"]').click();
await first.page.waitForTimeout(700);
const opened = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "04-data-open.png") });

const example = await ask(first.page, "Show me an example");
await first.page.screenshot({ path: join(OUT, "05-example.png") });
const unknown = await ask(first.page, "What does value mean?");
const likely = await ask(first.page, "What does OTD mean?");
const unsure = await ask(first.page, "I don't know");
const why = await ask(first.page, "Why are you asking?");
const cause = await ask(first.page, "Does that prove capacity caused the delay?");
const decision = await ask(first.page, "Will Nexora make the Decision?");
const unrelated = await ask(first.page, "What is a Problem?");
await first.page.screenshot({ path: join(OUT, "06-semantics.png") });

await first.page.reload({ waitUntil: "domcontentloaded" });
await first.page.waitForSelector('[data-testid="nexora-executive-shell"]');
await first.page.waitForTimeout(900);
const refreshed = await snapshot(first.page);
await first.page.screenshot({ path: join(OUT, "07-refresh.png") });
await first.page.close();

const skipSession = await open(ENTRANCE);
await skipSession.page.waitForFunction(
  () =>
    document.querySelector("[data-nex-ent1-state]")?.getAttribute("data-nex-ent1-state") ===
    "AWAITING_MANAGER",
);
await reachDataEducation(skipSession.page);
const skipped = await ask(skipSession.page, "Skip for now");
await skipSession.page.screenshot({ path: join(OUT, "08-skip.png") });
await skipSession.page.close();

const liveReport = {
  phase: "NEX-ENT:6",
  identity: "NEX-ENT:6/DataEvidenceEducation",
  completedAt: new Date().toISOString(),
  http: first.http,
  existingWorkspaceProtected:
    existingSnapshot.mode === "existing-workspace" &&
    (existingSnapshot.ent6State === "NOT_STARTED" || existingSnapshot.ent6State == null),
  entranceActivated: intro.entState === "AWAITING_MANAGER",
  dataEducationBegan:
    source.ent6State === "SOURCE" && /evidence|understanding of the real situation/i.test(source.last),
  locateNoAutoOpen: located.gaTarget === "DATA_ENTRY" && dataOpen === false,
  explicitDataOpen: opened.dataRail === "true",
  exampleMarked: example.example === "true" && /example/i.test(example.last),
  unknownField: /don.t have enough information/i.test(unknown.last),
  likelyProvisional: /likely|candidate|plausible|not confirmed/i.test(likely.last),
  iDontKnow: /unresolved rather than guessing/i.test(unsure.last),
  whyAsking: /than guess|confirm/i.test(why.last),
  evidenceNotCause: /does not establish cause/i.test(cause.last),
  dataNotDecision: /Decision/i.test(decision.last),
  unrelatedOk: /problem/i.test(unrelated.last) && !/example data from a certified/i.test(unrelated.last),
  skipSafe: skipped.ent6State === "SKIPPED" || skipped.mode === "existing-workspace",
  refreshNoLeak:
    refreshed.objectCount === 1 &&
    (refreshed.ent6State === "NOT_STARTED" || refreshed.ent6State === "INACTIVE"),
  noBusinessWrites: source.sufficiency === "INSUFFICIENT" && source.goal === "none",
  noDeveloperJargon: intro.jargon === false && source.jargon === false,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) => /unique key|hydration/i.test(text)),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));

const required = [
  "existingWorkspaceProtected",
  "entranceActivated",
  "dataEducationBegan",
  "locateNoAutoOpen",
  "exampleMarked",
  "unknownField",
  "likelyProvisional",
  "iDontKnow",
  "whyAsking",
  "evidenceNotCause",
  "dataNotDecision",
  "unrelatedOk",
  "skipSafe",
  "refreshNoLeak",
  "noBusinessWrites",
  "noDeveloperJargon",
];
if (first.http !== 200 || errors.length > 0) process.exit(1);
if (required.some((key) => liveReport[key] !== true)) process.exit(1);
