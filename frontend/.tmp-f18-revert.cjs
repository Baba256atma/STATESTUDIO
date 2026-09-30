// Usage: node .tmp-f18-revert.cjs <scratchFrontend> <A|B|C-nca|C-cont>
const fs = require("fs");
const path = require("path");
const [root, which] = process.argv.slice(2);

const edits = {
  A: [
    "app/lib/conversational-control/conversationalExperienceOrchestrator.ts",
    [
      [
        "        (isDeicticSubjectExplain(intent.kind, intent.normalizedUtterance) ||\n          isTargetedDeicticInvestigationUtterance(intent.normalizedUtterance));",
        "        isDeicticSubjectExplain(intent.kind, intent.normalizedUtterance);",
      ],
    ],
  ],
  B: [
    "app/lib/manager-object/nexoraRegisteredReferenceRecovery.ts",
    [
      ["  const uncoveredParts: RegisteredReferenceCandidate[] = [];\n", ""],
      ["      let bestUncovered: RegisteredReferenceCandidate | null = null;\n", ""],
      [
        "          const covered = part === compact || compoundKeyCoveredByInput(key, normalized);\n",
        "          if (part !== compact && !compoundKeyCoveredByInput(key, normalized)) continue;\n",
      ],
      [
        "          if (covered) {\n            if (!best || distance < best.distance) best = candidate(entry, key, distance, \"fuzzy\");\n          } else if (!bestUncovered || distance < bestUncovered.distance) {\n            bestUncovered = candidate(entry, key, distance, \"fuzzy\");\n          }\n",
        "          if (!best || distance < best.distance) {\n            best = candidate(entry, key, distance, \"fuzzy\");\n          }\n",
      ],
      ["      else if (bestUncovered) uncoveredParts.push(bestUncovered);\n", ""],
      [
        "  const sharedPart = uncoveredParts.filter((item) => item.distance <= best.distance);\n  if (sharedPart.length > 0) {\n    const competing = [...unique.filter((item) => item.distance <= best.distance), ...sharedPart]\n      .sort(byDistanceThenContext);\n    return finish(raw, normalized, competing, \"AMBIGUOUS\");\n  }\n",
        "",
      ],
    ],
  ],
  "C-nca": [
    "app/lib/manager-object/nexoraNca2ConversationState.ts",
    [
      [
        "    !isReturnUtterance(prepared) &&\n    input.contextual.continuityMove !== \"other-referent\"\n  ) {\n    move = \"CLARIFY\";",
        "    !isReturnUtterance(prepared)\n  ) {\n    move = \"CLARIFY\";",
      ],
    ],
  ],
  "C-cont": [
    "app/lib/manager-object/conversationContinuityResolver.ts",
    [
      [
        /    const contrastsWithActive = [\s\S]*?: \(otherPresented \?\? previousOther \?\? sibling\?\.subjectId \?\? null\);\n/,
        `    const otherPresented =
      presented.find((id) => {
        if (id === activeId) return false;
        const record = recordOf(id, subjects);
        if (!record || /watch$/i.test(record.canonicalName)) return false;
        if (activeRecord?.subjectKind && record.subjectKind !== activeRecord.subjectKind) {
          return false;
        }
        return true;
      }) ?? null;
    const sibling =
      subjects.find(
        (item) =>
          item.subjectId !== activeId &&
          Boolean(activeRecord?.subjectKind) &&
          item.subjectKind === activeRecord?.subjectKind &&
          !/watch$/i.test(item.canonicalName),
      ) ?? null;
    const other =
      otherPresented ??
      continuity.previousSubjectId ??
      sibling?.subjectId ??
      null;
`,
      ],
    ],
  ],
};

const [file, replacements] = edits[which];
const target = path.join(root, file);
let text = fs.readFileSync(target, "utf8");
for (const [from, to] of replacements) {
  const hit = typeof from === "string" ? text.includes(from) : from.test(text);
  if (!hit) throw new Error(`${which}: pattern not found in ${file}`);
  text = text.replace(from, to);
}
fs.writeFileSync(target, text);
console.log(`reverted ${which} in ${file}`);
