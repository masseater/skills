import { type Block, type CalloutKind, type Inline, parseInline, plainText } from "./markdown.ts";

export type Html = { readonly html: string };
export type Child = Html | string | number | null | undefined | false | Child[];
type Attrs = Record<string, string | number | boolean | null | undefined>;

const VOID = new Set(["br", "hr", "img", "meta", "link", "input"]);

export function escape(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function raw(html: string): Html {
  return { html };
}

function render(child: Child): string {
  if (child === null || child === undefined || child === false) return "";
  if (Array.isArray(child)) return child.map(render).join("");
  if (typeof child === "object") return child.html;
  return escape(String(child));
}

export function h(tag: string, attrs: Attrs | null, ...children: Child[]): Html {
  const written = Object.entries(attrs ?? {})
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([name, value]) => (value === true ? ` ${name}` : ` ${name}="${escape(String(value))}"`))
    .join("");
  if (VOID.has(tag)) return raw(`<${tag}${written}>`);
  return raw(`<${tag}${written}>${render(children)}</${tag}>`);
}

export type NavItem = { title: string; file: string; children: NavItem[] };
export type NavGroup = { title: string | null; items: NavItem[] };
export type TocEntry = { id: string; text: string; level: number };
export type Link = { title: string; file: string };

export type Context = {
  resolve: (href: string) => string;
  slug: (text: string) => string;
};

const CALLOUT_LABEL: Record<CalloutKind, string> = {
  note: "メモ",
  tip: "ヒント",
  important: "重要",
  warning: "注意",
  caution: "警告",
};

function Icon(name: "panel" | "chevron"): Html {
  const paths = {
    panel: "M4 5h16v14H4z M9 5v14",
    chevron: "M9 6l6 6-6 6",
  };
  return h(
    "svg",
    { class: `icon icon-${name}`, viewBox: "0 0 24 24", width: 18, height: 18, "aria-hidden": "true" },
    raw(`<path d="${paths[name]}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`),
  );
}

export function InlineContent({ nodes, ctx }: { nodes: Inline[]; ctx: Context }): Html {
  return raw(
    nodes
      .map((node) => {
        switch (node.type) {
          case "text":
            return escape(node.text);
          case "code":
            return h("code", null, node.text).html;
          case "strong":
            return h("strong", null, InlineContent({ nodes: node.children, ctx })).html;
          case "em":
            return h("em", null, InlineContent({ nodes: node.children, ctx })).html;
          case "del":
            return h("del", null, InlineContent({ nodes: node.children, ctx })).html;
          case "link":
            return h("a", { href: ctx.resolve(node.href) }, InlineContent({ nodes: node.children, ctx })).html;
          case "image":
            return h("img", { src: ctx.resolve(node.src), alt: node.alt, loading: "lazy" }).html;
          case "break":
            return "<br>";
        }
      })
      .join(""),
  );
}

function Text({ text, ctx }: { text: string; ctx: Context }): Html {
  return InlineContent({ nodes: parseInline(text), ctx });
}

export function Callout({ kind, children }: { kind: CalloutKind; children: Child }): Html {
  return h(
    "aside",
    { class: `callout callout-${kind}`, role: "note" },
    h("p", { class: "callout-label" }, CALLOUT_LABEL[kind]),
    children,
  );
}

export function CodeBlock({ lang, code }: { lang: string; code: string }): Html {
  if (lang === "mermaid") return h("div", { class: "figure" }, h("pre", { class: "mermaid" }, code));
  return h(
    "div",
    { class: "code" },
    lang === "" ? null : h("span", { class: "code-lang" }, lang),
    h("pre", null, h("code", lang === "" ? null : { class: `language-${lang}` }, code)),
  );
}

export function Table({ block, ctx }: { block: Extract<Block, { type: "table" }>; ctx: Context }): Html {
  const style = (index: number) => {
    const align = block.align[index];
    return align === null || align === undefined ? null : `text-align:${align}`;
  };
  return h(
    "div",
    { class: "table" },
    h(
      "table",
      null,
      h("thead", null, h("tr", null, block.head.map((cell, i) => h("th", { style: style(i) }, Text({ text: cell, ctx }))))),
      h(
        "tbody",
        null,
        block.rows.map((row) => h("tr", null, block.head.map((_, i) => h("td", { style: style(i) }, Text({ text: row[i] ?? "", ctx }))))),
      ),
    ),
  );
}

export function Blocks({ blocks, ctx, toc }: { blocks: Block[]; ctx: Context; toc?: TocEntry[] }): Html {
  return raw(
    blocks
      .map((block) => {
        switch (block.type) {
          case "heading": {
            const id = ctx.slug(plainText(block.text));
            if (toc !== undefined && (block.level === 2 || block.level === 3)) {
              toc.push({ id, text: plainText(block.text), level: block.level });
            }
            return h(`h${block.level}`, { id }, Text({ text: block.text, ctx })).html;
          }
          case "paragraph":
            return h("p", null, Text({ text: block.text, ctx })).html;
          case "code":
            return CodeBlock({ lang: block.lang, code: block.text }).html;
          case "list": {
            const tag = block.ordered ? "ol" : "ul";
            const start = block.ordered && block.start !== 1 ? block.start : null;
            const items = block.items.map((item) => {
              const [first, ...rest] = item;
              const tight = first?.type === "paragraph" && rest.every((child) => child.type !== "paragraph");
              const body = tight ? [Text({ text: first.text, ctx }), Blocks({ blocks: rest, ctx, toc })] : Blocks({ blocks: item, ctx, toc });
              return h("li", null, body);
            });
            return h(tag, { start }, items).html;
          }
          case "quote":
            return h("blockquote", null, Blocks({ blocks: block.children, ctx, toc })).html;
          case "callout":
            return Callout({ kind: block.kind, children: Blocks({ blocks: block.children, ctx, toc }) }).html;
          case "table":
            return Table({ block, ctx }).html;
          case "hr":
            return "<hr>";
        }
      })
      .join("\n"),
  );
}

function NavList({ items, current }: { items: NavItem[]; current: string }): Html {
  return h(
    "ul",
    null,
    items.map((item) =>
      h(
        "li",
        null,
        h("a", { href: item.file, "aria-current": item.file === current ? "page" : null }, item.title),
        item.children.length === 0 ? null : NavList({ items: item.children, current }),
      ),
    ),
  );
}

export function Sidebar({ groups, current }: { groups: NavGroup[]; current: string }): Html {
  return h(
    "nav",
    { class: "sidebar", id: "sidebar", "aria-label": "ページ一覧" },
    groups.map((group) =>
      h("section", { class: "nav-group" }, group.title === null ? null : h("h2", null, group.title), NavList({ items: group.items, current })),
    ),
  );
}

export function Breadcrumb({ trail }: { trail: string[] }): Html {
  if (trail.length === 0) return raw("");
  return h(
    "ol",
    { class: "breadcrumb", "aria-label": "現在地" },
    trail.map((step, index) => h("li", null, index === 0 ? null : Icon("chevron"), step)),
  );
}

export function Toc({ entries, compact }: { entries: TocEntry[]; compact: boolean }): Html {
  if (entries.length === 0) return raw("");
  const list = h(
    "ul",
    null,
    entries.map((entry) => h("li", { class: `toc-l${entry.level}` }, h("a", { href: `#${entry.id}` }, entry.text))),
  );
  if (compact) return h("details", { class: "toc-compact" }, h("summary", null, "このページ"), list);
  return h("nav", { class: "toc", "aria-label": "このページ" }, h("p", { class: "toc-label" }, "このページ"), list);
}

export function Pager({ prev, next }: { prev: Link | null; next: Link | null }): Html {
  const card = (link: Link | null, label: string, rel: string) =>
    link === null
      ? h("span", { class: "pager-gap" })
      : h("a", { class: `pager-${rel}`, href: link.file, rel }, h("span", { class: "pager-label" }, label), h("span", { class: "pager-title" }, link.title));
  return h("nav", { class: "pager", "aria-label": "前後のページ" }, card(prev, "前へ", "prev"), card(next, "次へ", "next"));
}

export type PageProps = {
  docTitle: string;
  pageTitle: string;
  standalone: boolean;
  groups: NavGroup[];
  current: string;
  trail: string[];
  toc: TocEntry[];
  body: Html;
  prev: Link | null;
  next: Link | null;
  style: string;
  script: string;
  fonts: string;
};

export function Page(props: PageProps): Html {
  const title = props.current === "index.html" ? props.docTitle : `${props.pageTitle} | ${props.docTitle}`;
  const head = [
    h("title", null, title),
    h("meta", { name: "claude:viewport-fit-sides", content: "cover" }),
    h("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
    h("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true }),
    h("link", { rel: "stylesheet", href: props.fonts }),
    h("style", null, raw(props.style)),
    h("script", null, raw(props.script)),
  ];
  const content = [
    h(
      "header",
      { class: "topbar" },
      h(
        "button",
        { type: "button", class: "sidebar-toggle", "aria-controls": "sidebar", "aria-expanded": "true", "aria-label": "サイドバー" },
        Icon("panel"),
      ),
      h("a", { class: "doc-title", href: "index.html" }, props.docTitle),
    ),
    h(
      "div",
      { class: "shell" },
      Sidebar({ groups: props.groups, current: props.current }),
      h("div", { class: "scrim", "aria-hidden": "true" }),
      h(
        "main",
        { class: "main" },
        h(
          "article",
          { class: "article" },
          Breadcrumb({ trail: props.trail }),
          h("h1", null, props.pageTitle),
          Toc({ entries: props.toc, compact: true }),
          h("div", { class: "prose" }, props.body),
          Pager({ prev: props.prev, next: props.next }),
        ),
      ),
      h("aside", { class: "toc-column" }, Toc({ entries: props.toc, compact: false })),
    ),
  ];
  if (!props.standalone) return raw([...head, ...content].map(render).join("\n"));
  return raw(
    `<!doctype html>\n${render(
      h(
        "html",
        { lang: "ja" },
        h("head", null, h("meta", { charset: "utf-8" }), h("meta", { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" }), head),
        h("body", null, content),
      ),
    )}`,
  );
}
