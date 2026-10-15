// Self-check for detectLang. Run: node lib/i18n.check.ts
import assert from "node:assert/strict";
import { detectLang } from "./i18n.ts";

assert.equal(detectLang("nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7"), "nl");
assert.equal(detectLang("en-US,en;q=0.9"), "en");
assert.equal(detectLang("de-DE,de;q=0.9"), "en"); // unsupported language: English
assert.equal(detectLang("de-DE,nl;q=0.5"), "nl"); // falls through to the first supported tag
assert.equal(detectLang("en;q=0.4,nl-BE;q=0.8"), "nl"); // q wins over header order
assert.equal(detectLang("nl;q=0,en;q=0.1"), "en"); // q=0 means "not this one"
assert.equal(detectLang("*"), "en");
assert.equal(detectLang(null), "nl"); // no header (crawlers): the site's own language
console.log("detectLang ok");
