// src/utils/syntaxHighlight.tsx
// Lightweight syntax highlighter for JS/Python/C++ code — no external deps

import React from "react";

/** Token types for syntax coloring */
type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "operator"
  | "function"
  | "type"
  | "punctuation"
  | "builtin"
  | "plain";

/** Color map for each token type — VSCode One Dark inspired */
const tokenColors: Record<TokenType, string> = {
  keyword: "text-purple-400",        // if, for, return, const, let
  string: "text-emerald-400",        // "hello", 'world', `template`
  comment: "text-gray-500 italic",   // // comment, # comment
  number: "text-amber-400",          // 42, 3.14, 0xFF
  operator: "text-cyan-300",         // =, ===, &&, ||, =>
  function: "text-sky-400",          // functionName(
  type: "text-yellow-300",           // class, interface, struct
  punctuation: "text-gray-400",      // {, }, (, ), [, ], ;
  builtin: "text-rose-400",          // console, Math, null, true, false
  plain: "text-gray-200",            // default text
};

const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "do", "switch", "case", "break", "continue", "new", "delete", "typeof",
  "instanceof", "in", "of", "try", "catch", "finally", "throw", "async",
  "await", "yield", "import", "export", "default", "from", "extends",
  "super", "this", "static", "get", "set", "with",
]);

const PY_KEYWORDS = new Set([
  "def", "class", "return", "if", "elif", "else", "for", "while", "in",
  "not", "and", "or", "is", "import", "from", "as", "try", "except",
  "finally", "raise", "with", "pass", "break", "continue", "lambda",
  "yield", "global", "nonlocal", "assert", "del", "self",
]);

const CPP_KEYWORDS = new Set([
  "int", "void", "float", "double", "char", "bool", "long", "short",
  "unsigned", "signed", "auto", "const", "static", "inline", "virtual",
  "class", "struct", "enum", "union", "namespace", "using", "template",
  "typename", "public", "private", "protected", "if", "else", "for",
  "while", "do", "switch", "case", "break", "continue", "return", "new",
  "delete", "try", "catch", "throw", "true", "false", "nullptr", "this",
  "include", "define", "sizeof",
]);

const TYPE_KEYWORDS = new Set([
  "class", "struct", "interface", "enum", "type", "extends", "implements",
]);

const BUILTINS = new Set([
  "console", "Math", "Array", "Object", "String", "Number", "Boolean",
  "Promise", "Set", "Map", "JSON", "null", "undefined", "true", "false",
  "None", "True", "False", "print", "len", "range", "enumerate", "int",
  "str", "list", "dict", "set", "tuple", "sorted", "max", "min", "abs",
  "sum", "zip", "map", "filter", "append", "push", "pop", "shift",
  "unshift", "slice", "splice", "indexOf", "includes", "toString",
  "length", "size", "empty", "begin", "end", "front", "back",
  "push_back", "pop_back", "insert", "erase", "find", "sort",
  "reverse", "swap", "cout", "endl", "cin", "vector", "queue",
  "stack", "priority_queue", "unordered_set", "unordered_map",
  "deque", "popleft", "extend",
]);

interface Token {
  type: TokenType;
  value: string;
}

/** Tokenize a single line of code */
function tokenizeLine(line: string, language: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const keywords = language === "python" ? PY_KEYWORDS
    : language === "cpp" ? CPP_KEYWORDS : JS_KEYWORDS;

  while (i < line.length) {
    // 1. Single-line comments: // or #
    if (
      (line[i] === "/" && line[i + 1] === "/") ||
      (line[i] === "#" && language !== "cpp") ||
      (line[i] === "#" && language === "cpp" && (line.trimStart().startsWith("#include") || line.trimStart().startsWith("#define")))
    ) {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }

    // C++ preprocessor directives
    if (line[i] === "#" && language === "cpp") {
      tokens.push({ type: "keyword", value: line.slice(i) });
      break;
    }

    // 2. Strings: "", '', ``
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++; // skip escaped chars
        j++;
      }
      j++; // include closing quote
      tokens.push({ type: "string", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // 3. Numbers: integers, floats, hex
    if (/\d/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
      let j = i;
      if (line[j] === "0" && line[j + 1] === "x") {
        j += 2;
        while (j < line.length && /[0-9a-fA-F]/.test(line[j])) j++;
      } else {
        while (j < line.length && /[\d.]/.test(line[j])) j++;
      }
      tokens.push({ type: "number", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // 4. Words: identifiers, keywords, builtins
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);

      // Check what follows for function detection
      const afterWord = line.slice(j).trimStart();
      const isFunc = afterWord.startsWith("(");

      let type: TokenType = "plain";
      if (TYPE_KEYWORDS.has(word)) {
        type = "type";
      } else if (keywords.has(word)) {
        type = "keyword";
      } else if (BUILTINS.has(word)) {
        type = "builtin";
      } else if (isFunc) {
        type = "function";
      }

      tokens.push({ type, value: word });
      i = j;
      continue;
    }

    // 5. Operators
    if ("=<>!&|+-*/%?:".includes(line[i])) {
      let j = i;
      // Multi-char operators: ===, !==, >=, <=, =>, &&, ||, **, ++, --
      while (j < line.length && "=<>!&|+-*/%?:".includes(line[j])) j++;
      tokens.push({ type: "operator", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // 6. Punctuation
    if ("{}()[];,".includes(line[i])) {
      tokens.push({ type: "punctuation", value: line[i] });
      i++;
      continue;
    }

    // 7. Dot accessor & other
    if (line[i] === ".") {
      tokens.push({ type: "punctuation", value: "." });
      i++;
      continue;
    }

    // 8. Whitespace & anything else
    if (line[i] === " " || line[i] === "\t") {
      let j = i;
      while (j < line.length && (line[j] === " " || line[j] === "\t")) j++;
      tokens.push({ type: "plain", value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Default: push single char
    tokens.push({ type: "plain", value: line[i] });
    i++;
  }

  return tokens;
}

/** Render a single line of code with syntax highlighting */
export function highlightLine(line: string, language: string): React.ReactNode {
  if (!line.trim()) return " ";

  const tokens = tokenizeLine(line, language);

  return tokens.map((token, idx) => (
    <span key={idx} className={tokenColors[token.type]}>
      {token.value}
    </span>
  ));
}

/** Render an entire code block with syntax highlighting */
export function highlightCode(code: string, language: string): React.ReactNode[] {
  return code.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {highlightLine(line, language)}
      {"\n"}
    </React.Fragment>
  ));
}
