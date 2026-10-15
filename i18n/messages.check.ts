// Self-check: every translation file has the same keys as messages/nl.json, and each message uses the same
// {placeholders} and <tags>. Run: node i18n/messages.check.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

type Messages = { [key: string]: string | Messages };

const load = (locale: string): Messages =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

/** Every message as "Namespace.key.path" → text. */
function flatten(messages: Messages, prefix = ""): Map<string, string> {
  const flat = new Map<string, string>();
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") flat.set(path, value);
    else for (const [nestedPath, text] of flatten(value, path)) flat.set(nestedPath, text);
  }
  return flat;
}

/** The {placeholders} and <tags> in a message, sorted. */
const variables = (text: string) => [...text.matchAll(/\{(\w+)|<(\w+)>/g)].map((match) => match[0]).sort();

const reference = flatten(load("nl"));

for (const locale of ["en-GB"]) {
  const translation = flatten(load(locale));
  assert.deepEqual([...translation.keys()].sort(), [...reference.keys()].sort(), `${locale}.json has the same keys as nl.json`);
  for (const [path, text] of reference) {
    assert.deepEqual(variables(translation.get(path)!), variables(text), `${locale}: ${path} has the same placeholders and tags`);
  }
}

console.log("messages ok");
