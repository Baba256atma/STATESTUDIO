import { resolveRegisteredReference } from "./app/lib/manager-object/nexoraRegisteredReferenceRecovery.ts";
import { interpretCanonicalManagerMeaning } from "./app/lib/manager-object/canonicalManagerMeaningInterpreter.ts";
import { projectManagerObjectConversationalSubjects } from "./app/lib/manager-object/managerObjectCatalog.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "./app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
const subjects = projectManagerObjectConversationalSubjects(getDefaultNexoraMVPObjectInteractionCatalog());
for (const u of process.argv.slice(2)) {
  const m = interpretCanonicalManagerMeaning({ utterance: u, subjects });
  console.log(JSON.stringify({ u, ref: m.objectReference?.canonicalName ?? null, cands: JSON.stringify(m.ambiguity.candidates).slice(0,200) }));
}
