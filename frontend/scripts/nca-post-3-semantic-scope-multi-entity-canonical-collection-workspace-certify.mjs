/**
 * NCA-POST:3 — live executive-chat proof.
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
const EXISTING = BASE.split("?")[0];
const OUT = join(
  process.cwd(),
  ".certification/nca-post-3-semantic-scope-multi-entity-canonical-collection-workspace",
);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutivePage(page, EXISTING);
const turns = [];

async function ask(utterance) {
  const turn = await askExecutiveChat(page, utterance);
  turns.push({ utterance, last: turn.last, focused: turn.focused });
  return turn.last ?? "";
}

const outcome = /which business outcome/i;
const collision = /Has backlog|My recommendation remains|temporary capacity/i;

const relation = await ask("explain risk and delivery relation");
const conditional = await ask("if delivery be late, is it ok?");
const assertion = await ask("capacity gap and margin pressure are problems");
const showProblems = await ask("show problems");
const queueCount = await page
  .locator('[data-testid="nexora-executive-queue-count-problem"]')
  .innerText()
  .catch(() => "");
await ask("show Delivery");
const allProblems = await ask("show me all problems");
const related = await ask("show problems related to Margin Pressure");
const change = await ask("why did Capacity Gap remove?");
const capability = await ask("can you add object?");
const stage = await ask("explain the stage. what is on stage now?");
await ask("show Delivery");
const late = await ask("Why is Delivery late?");
const product = await ask("What is the Stage?");
const back = await ask("Go back to Delivery.");

await browser.close();

const bothNames = /Risk/i.test(relation) && /Delivery/i.test(relation);
const noMarginSwap = !/Margin Pressure/i.test(relation) || /indirect/i.test(relation);
const report = {
  identity: "NCA-POST:3/SemanticScopeMultiEntityCanonicalCollectionNexoraWorkspaceIntelligence",
  url: EXISTING,
  opened: Boolean(opened),
  pageErrors: errors,
  turns,
  menuProblemCount: queueCount.trim() || null,
  canonicalProblems: ["Capacity Gap", "Margin Pressure"],
  advisorShowProblems: showProblems.replace(/^Nexora/, ""),
  menuNote:
    "Queue overlay count is recorded when visible; Advisor unfiltered membership must match canonical queue (2).",
  proofs: {
    relationBothSubjects: bothNames && noMarginSwap && !outcome.test(relation),
    conditionalNoOutcome: !outcome.test(conditional),
    assertionNoNav: !/Focused on/i.test(assertion) && !/temporary capacity/i.test(assertion),
    problemsParity:
      /Capacity Gap/i.test(showProblems) &&
      /Margin Pressure/i.test(showProblems) &&
      !/Showing problems for/i.test(showProblems),
    allUnfiltered:
      /Capacity Gap/i.test(allProblems) &&
      /Margin Pressure/i.test(allProblems) &&
      !/Showing problems for/i.test(allProblems),
    relatedFilter: /related to|Margin Pressure/i.test(related),
    changeNoCollision: !outcome.test(change) && !collision.test(change),
    capabilityHonest: /can't add a new production object/i.test(capability) && !outcome.test(capability),
    mixedStage: /visual workspace/i.test(stage) && !outcome.test(stage),
    continuity: /Delivery/i.test(late) && /Delivery/i.test(back) && /visual workspace/i.test(product),
  },
};
report.ok =
  errors.length === 0 &&
  Object.values(report.proofs).every(Boolean);

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
if (!report.ok) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log("NCA-POST:3 live ok");
