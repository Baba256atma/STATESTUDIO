import assert from "node:assert/strict";
import test from "node:test";
import {
  applyCsvSemanticClarification,
  answerCsvSemanticInquiry,
  interpretCsvSemantics,
  nextCsvSemanticClarification,
  summarizeCsvSemantics,
} from "./csvSemanticUnderstanding.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";

function understand(fileName: string, csvText: string, previousMapping?: ReturnType<typeof interpretCsvSemantics>) {
  const parse = parseCsvDeterministically(csvText);
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: `test:${fileName}`,
    importedAt: "2026-08-30T12:00:00.000Z",
    observedAt: "2026-08-30T12:00:00.000Z",
  });
  return interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
    previousMapping,
  });
}

test("DATA-UX:3 A: understands clear canonical fields without unnecessary questions", () => {
    const review = understand("delivery.csv", "date,orders,on_time_delivery,backlog\n2026-08-01,20,18,2");
    assert.equal(review.mappings.find((field) => field.sourceColumn === "date")?.semantic?.state, "UNDERSTOOD");
    assert.match(review.mappings.find((field) => field.sourceColumn === "on_time_delivery")?.semantic?.proposedMeaning ?? "", /On-Time Deliver/i);
    assert.equal(nextCsvSemanticClarification(review), null);
  });

test("DATA-UX:3 B: proposes abbreviated meanings and asks only the next material question", () => {
    const review = understand("production_capacity.csv", "DT,ORD_QTY,OTD,CAP_AV\n2026-08-01,20,94,820");
    const cap = review.mappings.find((field) => field.sourceColumn === "CAP_AV")!;
    assert.equal(cap.semantic?.state, "AMBIGUOUS");
    assert.match(cap.semantic?.proposedMeaning ?? "", /Available.*Capacity|Capacity.*Available/i);
    assert.equal(nextCsvSemanticClarification(review)?.fieldId, cap.semantic?.fieldId);
  });

test("DATA-UX:3 C: does not invent meaning for generic ambiguous fields", () => {
    const review = understand("export.csv", "date,value,status,index\n2026-08-01,4,ok,1");
    for (const name of ["value", "status", "index"]) {
      const semantic = review.mappings.find((field) => field.sourceColumn === name)?.semantic;
      assert.equal(semantic?.state, "UNKNOWN");
      assert.equal(semantic?.proposedMeaning, null);
    }
  });

test("DATA-UX:3 D: supports a non-Delivery shape without manufacturing canonical objects", () => {
    const review = understand("quality_finance.csv", "period,net_margin,scrap_percent,project_phase\nQ3,18,2.4,Build");
    assert.equal(review.mappings.find((field) => field.sourceColumn === "net_margin")?.semantic?.proposedMeaning, "Net Margin");
    assert.equal(review.mappings.find((field) => field.sourceColumn === "scrap_percent")?.semantic?.unit, "percent");
    assert.equal(review.mappings.every((field) => field.semantic?.confirmedTargetId == null), true);
  });

test("DATA-UX:3 E/F: reuses compatible scoped confirmation and detects type, unit, context, and rename drift", () => {
    let first = understand("capacity.csv", "date,CAP_AV\n2026-08-01,820");
    const fieldId = first.mappings.find((field) => field.sourceColumn === "CAP_AV")!.semantic!.fieldId;
    first = applyCsvSemanticClarification(first, fieldId, "yes, it means available production capacity").review;

    const compatible = understand("capacity.csv", "date,CAP_AV\n2026-09-01,845", first);
    assert.equal(compatible.mappings.find((field) => field.sourceColumn === "CAP_AV")?.semantic?.confirmationSource, "manager");

    const changedType = understand("capacity.csv", "date,CAP_AV\n2026-09-01,High", first);
    assert.equal(changedType.mappings.find((field) => field.sourceColumn === "CAP_AV")?.semantic?.state, "CONFLICTING");

    const changedUnit = understand("capacity.csv", "date,CAP_AV\n2026-09-01,84%", first);
    assert.equal(changedUnit.mappings.find((field) => field.sourceColumn === "CAP_AV")?.semantic?.state, "CONFLICTING");

    const renamed = understand("capacity.csv", "date,CAP_AVAILABLE\n2026-09-01,845", first);
    assert.notEqual(renamed.mappings.find((field) => field.sourceColumn === "CAP_AVAILABLE")?.semantic?.confirmationSource, "manager");

    const otherSource = understand("financial_capacity.csv", "date,CAP_AV\n2026-09-01,845", first);
    assert.notEqual(otherSource.mappings.find((field) => field.sourceColumn === "CAP_AV")?.semantic?.confirmationSource, "manager");
  });

test("DATA-UX:3 handles confirmation, correction, unknown, and natural definition without rigid syntax", () => {
    const initial = understand("capacity.csv", "date,CAP_AV\n2026-08-01,820");
    const fieldId = initial.mappings.find((field) => field.sourceColumn === "CAP_AV")!.semantic!.fieldId;
    const yes = applyCsvSemanticClarification(initial, fieldId, "Yes.");
    assert.equal(yes.review.mappings.find((field) => field.semantic?.fieldId === fieldId)?.semantic?.confirmationSource, "manager");
    assert.match(yes.acknowledgement, /confirmed/i);

    const corrected = applyCsvSemanticClarification(initial, fieldId, "No, it means available machine hours.");
    const correctedSemantic = corrected.review.mappings.find((field) => field.semantic?.fieldId === fieldId)?.semantic;
    assert.equal(correctedSemantic?.confirmedMeaning, "Available machine hours");
    assert.doesNotMatch(correctedSemantic?.confirmedMeaning ?? "", /production capacity/i);

    const unknown = applyCsvSemanticClarification(initial, fieldId, "I don't know");
    assert.equal(unknown.review.mappings.find((field) => field.semantic?.fieldId === fieldId)?.semantic?.state, "UNKNOWN");
    assert.equal(unknown.resolved, false);

    const natural = applyCsvSemanticClarification(initial, fieldId, "CAP_AV is the number of machine hours we still have available.");
    assert.match(natural.review.mappings.find((field) => field.semantic?.fieldId === fieldId)?.semantic?.confirmedMeaning ?? "", /number of machine hours/i);
  });

test("DATA-UX:3 summarizes only supported meanings and names unresolved material fields", () => {
    const review = understand("production_capacity.csv", "date,on_time_delivery,CAP_AV,ABC123\n2026-08-01,94,820,7");
    const summary = summarizeCsvSemantics(review, "production_capacity.csv");
    assert.match(summary.understood, /On-Time Deliver/i);
    assert.match(summary.unresolved, /CAP_AV/);
    assert.doesNotMatch(summary.understood, /ABC123/);
  });

test("DATA-UX:3 routes source questions and field follow-ups without Stage-object fallback", () => {
  const review = understand("production_capacity.csv", "date,on_time_delivery,CAP_AV\n2026-08-01,94,820");
  const field = answerCsvSemanticInquiry({ review, fileName: "production_capacity.csv", utterance: "What is CAP_AV?" });
  assert.match(field?.text ?? "", /not confirmed/i);
  const followUp = answerCsvSemanticInquiry({ review, fileName: "production_capacity.csv", utterance: "Is it important?", priorFieldId: field?.fieldId });
  assert.match(followUp?.text ?? "", /executive metric/i);
  assert.match(answerCsvSemanticInquiry({ review, fileName: "production_capacity.csv", utterance: "What did you understand from this CSV?" })?.text ?? "", /On-Time Deliver/i);
  assert.match(answerCsvSemanticInquiry({ review, fileName: "production_capacity.csv", utterance: "What should I clarify?" })?.text ?? "", /CAP_AV/);
});
