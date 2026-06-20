// extractVariables.js
//
// Parses `{{ variableName }}` tokens out of free text. Only tokens whose
// inner content is a syntactically valid JavaScript identifier are
// treated as variables — `{{ 2cool }}` or `{{ a-b }}` are left as plain
// text rather than turned into a dangling Handle, since neither is
// something you could destructure in real JS.

const VALID_JS_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const TOKEN_PATTERN = /\{\{\s*([^{}]+?)\s*\}\}/g;

/**
 * @param {string} text
 * @returns {string[]} ordered list of unique valid variable names found
 */
export function extractVariables(text) {
  if (!text) return [];
  const found = [];
  const seen = new Set();
  let match;
  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    const name = match[1].trim();
    if (VALID_JS_IDENTIFIER.test(name) && !seen.has(name)) {
      seen.add(name);
      found.push(name);
    }
  }
  return found;
}
