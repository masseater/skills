import { loadDefaultJapaneseParser } from "budoux";

const parser = loadDefaultJapaneseParser();
const BREAK = "​";
const JAPANESE = /[\p{scx=Hiragana}\p{scx=Katakana}\p{scx=Han}]/u;

const insertPhraseBreaks = (root: HTMLElement | null): void => {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? "";
    if (!JAPANESE.test(text) || text.includes(BREAK) || node.parentElement?.closest("code, pre")) {
      continue;
    }
    node.nodeValue = parser.parse(text).join(BREAK);
  }
};

export { insertPhraseBreaks };
